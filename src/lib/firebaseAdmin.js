/**
 * Firebase Admin SDK Configuration (Server-side ONLY)
 * 
 * Used in API routes for privileged operations like writing
 * appointments, managing slots, and data deletion (DPDP).
 * NEVER import this file from client-side code.
 */
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function getAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // In mock mode, we don't initialize real Firebase Admin
  if (process.env.USE_MOCK_DATA === 'true') {
    return null;
  }

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      // Private key comes as a string with literal \n — parse them
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const adminApp = getAdminApp();

/**
 * Get Firestore Admin instance.
 * Returns null in mock mode — callers should check USE_MOCK_DATA.
 */
function getAdminDb() {
  if (!adminApp) return null;
  return getFirestore(adminApp);
}

const adminDb = getAdminDb();

export { adminApp, adminDb };
