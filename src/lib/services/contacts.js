/**
 * Contacts Service
 * 
 * Handles contact form submissions.
 * Stores in Firestore (or mock) and triggers notifications.
 */
import { adminDb } from '@/lib/firebaseAdmin';
import { addMockContact, deleteMockContact } from '@/lib/mockData';
import { sanitizeObject, normalizePhone } from '@/lib/sanitize';

const IS_MOCK = process.env.USE_MOCK_DATA === 'true';

/**
 * Create a new contact form submission.
 * @param {object} contactData - Validated contact data from Zod schema
 * @returns {Promise<object>} The created contact record
 */
export async function createContact(contactData) {
  const sanitized = sanitizeObject(contactData);
  sanitized.phone = normalizePhone(sanitized.phone);

  if (IS_MOCK) {
    return createMockContact(sanitized);
  }
  return createFirestoreContact(sanitized);
}

/**
 * Mock implementation.
 */
async function createMockContact(data) {
  const contact = addMockContact(data);
  console.log('[Mock] Contact form submission:', {
    name: data.name,
    message: data.message.substring(0, 50) + '...',
  });
  return contact;
}

/**
 * Firestore implementation.
 */
async function createFirestoreContact(data) {
  try {
    const docRef = await adminDb.collection('contacts').add({
      ...data,
      status: 'new',
      createdAt: new Date().toISOString(),
      readAt: null,
      repliedAt: null,
    });

    console.log('[ContactsService] New contact saved:', docRef.id);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('[ContactsService] Error creating contact:', error);
    throw error;
  }
}

/**
 * Get all contact messages (Admin only).
 * @returns {Promise<Array>}
 */
export async function getAllContacts() {
  if (IS_MOCK) {
    // Need to import getMockContacts inside the function or at top
    const { getMockContacts } = await import('@/lib/mockData.js');
    return getMockContacts().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  try {
    const snapshot = await adminDb
      .collection('contacts')
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('[ContactsService] Error fetching all contacts:', error);
    throw error;
  }
}

/**
 * Delete a single contact by ID (Admin only).
 * @param {string} id - Document ID
 * @returns {Promise<boolean>} True if deleted
 */
export async function deleteContactById(id) {
  if (IS_MOCK) {
    const deleted = deleteMockContact(id);
    console.log(`[Mock] Contact ${id} ${deleted ? 'deleted' : 'not found'}`);
    return deleted;
  }

  try {
    const docRef = adminDb.collection('contacts').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return false;
    await docRef.delete();
    console.log(`[ContactsService] Deleted contact: ${id}`);
    return true;
  } catch (error) {
    console.error('[ContactsService] Error deleting contact:', error);
    throw error;
  }
}
