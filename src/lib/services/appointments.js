/**
 * Appointments Service
 * 
 * Handles creating, querying, and managing appointment bookings.
 * Uses Firestore transactions to prevent double-booking.
 * Switches between Firestore and mock data based on USE_MOCK_DATA env var.
 */
import { adminDb } from '@/lib/firebaseAdmin';
import { addMockAppointment, getMockAppointments, deleteMockAppointment } from '@/lib/mockData';
import { generateBookingRef, normalizePhone, sanitizeObject } from '@/lib/sanitize';
import { markSlotBooked, isSlotAvailable } from './slots';

const IS_MOCK = process.env.USE_MOCK_DATA === 'true';

/**
 * Create a new appointment booking.
 * Validates slot availability and uses Firestore transactions to prevent races.
 * 
 * @param {object} bookingData - Validated booking data from Zod schema
 * @returns {Promise<{ appointment: object, bookingRef: string }>}
 * @throws {Error} If slot is unavailable or database write fails
 */
export async function createAppointment(bookingData) {
  // Sanitize inputs
  const sanitized = sanitizeObject(bookingData);
  sanitized.phone = normalizePhone(sanitized.phone);

  // Generate booking reference
  const bookingRef = generateBookingRef();

  if (IS_MOCK) {
    return createMockAppointment(sanitized, bookingRef);
  }
  return createFirestoreAppointment(sanitized, bookingRef);
}

/**
 * Mock implementation — stores in memory.
 */
async function createMockAppointment(data, bookingRef) {
  const appointment = addMockAppointment({
    ...data,
    bookingRef,
  });

  console.log(`[Mock] Appointment created: ${bookingRef}`, {
    name: data.name,
    date: data.preferredDate,
    slot: data.preferredTimeSlot,
  });

  return { appointment, bookingRef };
}

/**
 * Firestore implementation — uses transaction for atomicity.
 */
async function createFirestoreAppointment(data, bookingRef) {
  try {
    // Use a Firestore transaction to atomically check slot + create appointment
    const result = await adminDb.runTransaction(async (transaction) => {
      // 1. Check slot availability within transaction
      const slotDocRef = adminDb.collection('availableSlots').doc(data.preferredDate);
      const slotDoc = await transaction.get(slotDocRef);

      if (slotDoc.exists) {
        const slotData = slotDoc.data();
        const [slotStart, slotEnd] = data.preferredTimeSlot.split('-');
        const targetSlot = slotData.slots.find(
          (s) => s.start === slotStart && s.end === slotEnd
        );

        if (!targetSlot || !targetSlot.available) {
          throw new Error('SLOT_UNAVAILABLE');
        }

        // 2. Mark slot as booked
        const updatedSlots = slotData.slots.map((slot) => {
          if (slot.start === slotStart && slot.end === slotEnd) {
            return { ...slot, available: false };
          }
          return slot;
        });
        transaction.update(slotDocRef, { slots: updatedSlots });
      }

      // 3. Create appointment document
      const appointmentRef = adminDb.collection('appointments').doc();
      const appointmentData = {
        ...data,
        bookingRef,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        // DPDP: Set auto-delete timestamp (90 days after appointment date)
        autoDeleteAt: getAutoDeleteDate(data.preferredDate),
      };

      transaction.set(appointmentRef, appointmentData);

      // 4. Log consent for DPDP compliance
      const consentRef = adminDb.collection('consentLogs').doc();
      transaction.set(consentRef, {
        appointmentRef: appointmentRef.id,
        bookingRef,
        email: data.email,
        phone: data.phone,
        consentGiven: data.consentGiven,
        marketingConsent: data.marketingConsent || false,
        consentTimestamp: new Date().toISOString(),
        ipAddress: null, // Set by API route
      });

      return { id: appointmentRef.id, ...appointmentData };
    });

    return { appointment: result, bookingRef };
  } catch (error) {
    if (error.message === 'SLOT_UNAVAILABLE') {
      throw new Error('This time slot is no longer available. Please select another slot.');
    }
    console.error('[AppointmentsService] Transaction failed:', error);
    throw error;
  }
}

/**
 * Get appointments by email (for DPDP data access requests).
 * @param {string} email
 * @returns {Promise<Array>}
 */
export async function getAppointmentsByEmail(email) {
  if (IS_MOCK) {
    return getMockAppointments().filter((a) => a.email === email);
  }

  try {
    const snapshot = await adminDb
      .collection('appointments')
      .where('email', '==', email)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('[AppointmentsService] Error fetching by email:', error);
    throw error;
  }
}

/**
 * Get appointments by phone number (for DPDP data access requests).
 * @param {string} phone - Normalized phone number
 * @returns {Promise<Array>}
 */
export async function getAppointmentsByPhone(phone) {
  const normalizedPhone = normalizePhone(phone);

  if (IS_MOCK) {
    return getMockAppointments().filter((a) => a.phone === normalizedPhone);
  }

  try {
    const snapshot = await adminDb
      .collection('appointments')
      .where('phone', '==', normalizedPhone)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('[AppointmentsService] Error fetching by phone:', error);
    throw error;
  }
}

/**
 * Delete all appointments for an email (DPDP erasure request).
 * @param {string} email
 * @returns {Promise<number>} Number of deleted records
 */
export async function deleteAppointmentsByEmail(email) {
  if (IS_MOCK) {
    console.log(`[Mock] DPDP erasure request for email: ${email}`);
    return 0;
  }

  try {
    const snapshot = await adminDb
      .collection('appointments')
      .where('email', '==', email)
      .get();

    const batch = adminDb.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`[DPDP] Deleted ${snapshot.size} appointments for email request.`);
    return snapshot.size;
  } catch (error) {
    console.error('[AppointmentsService] Error deleting by email:', error);
    throw error;
  }
}

/**
 * Calculate auto-delete date (90 days after appointment).
 * @param {string} appointmentDate - YYYY-MM-DD
 * @returns {string} ISO timestamp
 */
function getAutoDeleteDate(appointmentDate) {
  const date = new Date(appointmentDate);
  date.setDate(date.getDate() + 90);
  return date.toISOString();
}

/**
 * Get all appointments (Admin only).
 * @returns {Promise<Array>}
 */
export async function getAllAppointments() {
  if (IS_MOCK) {
    return getMockAppointments().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  try {
    const snapshot = await adminDb
      .collection('appointments')
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('[AppointmentsService] Error fetching all appointments:', error);
    throw error;
  }
}

/**
 * Delete a single appointment by ID (Admin only).
 * @param {string} id - Document ID
 * @returns {Promise<boolean>} True if deleted
 */
export async function deleteAppointmentById(id) {
  if (IS_MOCK) {
    const deleted = deleteMockAppointment(id);
    console.log(`[Mock] Appointment ${id} ${deleted ? 'deleted' : 'not found'}`);
    return deleted;
  }

  try {
    const docRef = adminDb.collection('appointments').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return false;
    await docRef.delete();
    console.log(`[AppointmentsService] Deleted appointment: ${id}`);
    return true;
  } catch (error) {
    console.error('[AppointmentsService] Error deleting appointment:', error);
    throw error;
  }
}
