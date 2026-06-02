/**
 * Slots Service
 * 
 * Handles fetching and managing available appointment time slots.
 * Switches between Firestore and mock data based on USE_MOCK_DATA env var.
 */
import { adminDb } from '@/lib/firebaseAdmin';
import { generateMockSlots, CLINIC_HOURS } from '@/lib/mockData';

const IS_MOCK = process.env.USE_MOCK_DATA === 'true';

/**
 * Get available time slots for a specific date.
 * @param {string} date - YYYY-MM-DD format
 * @returns {Promise<{ date: string, slots: Array<{ start: string, end: string, available: boolean }>, clinicOpen: boolean }>}
 */
export async function getSlotsByDate(date) {
  if (IS_MOCK) {
    return getMockSlots(date);
  }
  return getFirestoreSlots(date);
}

/**
 * Mock implementation — generates slots based on clinic hours.
 */
function getMockSlots(date) {
  const slots = generateMockSlots(date);
  return {
    date,
    slots,
    clinicOpen: slots.length > 0,
  };
}

/**
 * Firestore implementation — fetches from availableSlots collection.
 */
async function getFirestoreSlots(date) {
  try {
    const docRef = adminDb.collection('availableSlots').doc(date);
    const doc = await docRef.get();

    if (!doc.exists) {
      // No pre-generated slots — generate default ones and save
      const defaultSlots = generateMockSlots(date);
      if (defaultSlots.length > 0) {
        await docRef.set({
          date,
          slots: defaultSlots,
          createdAt: new Date().toISOString(),
        });
      }
      return {
        date,
        slots: defaultSlots,
        clinicOpen: defaultSlots.length > 0,
      };
    }

    const data = doc.data();
    return {
      date: data.date,
      slots: data.slots || [],
      clinicOpen: (data.slots || []).length > 0,
    };
  } catch (error) {
    console.error('[SlotsService] Error fetching slots:', error);
    throw error;
  }
}

/**
 * Mark a specific slot as unavailable (booked).
 * @param {string} date - YYYY-MM-DD format
 * @param {string} timeSlot - "HH:MM-HH:MM" format
 * @returns {Promise<boolean>} true if slot was successfully marked
 */
export async function markSlotBooked(date, timeSlot) {
  if (IS_MOCK) {
    // In mock mode, we just return true — no persistent state
    return true;
  }

  try {
    const docRef = adminDb.collection('availableSlots').doc(date);
    const doc = await docRef.get();

    if (!doc.exists) return false;

    const data = doc.data();
    const [slotStart, slotEnd] = timeSlot.split('-');
    const updatedSlots = data.slots.map((slot) => {
      if (slot.start === slotStart && slot.end === slotEnd) {
        return { ...slot, available: false };
      }
      return slot;
    });

    await docRef.update({ slots: updatedSlots });
    return true;
  } catch (error) {
    console.error('[SlotsService] Error marking slot booked:', error);
    throw error;
  }
}

/**
 * Check if a specific slot is still available.
 * Used to prevent double-booking (optimistic lock check).
 */
export async function isSlotAvailable(date, timeSlot) {
  const { slots } = await getSlotsByDate(date);
  const [slotStart, slotEnd] = timeSlot.split('-');

  const slot = slots.find((s) => s.start === slotStart && s.end === slotEnd);
  return slot ? slot.available : false;
}
