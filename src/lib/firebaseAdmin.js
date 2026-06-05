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

  // Fail fast: validate required credentials before attempting init
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    const missing = [];
    if (!projectId) missing.push('FIREBASE_ADMIN_PROJECT_ID');
    if (!clientEmail) missing.push('FIREBASE_ADMIN_CLIENT_EMAIL');
    if (!privateKey) missing.push('FIREBASE_ADMIN_PRIVATE_KEY');

    console.error(
      `[Firebase Admin] Missing required environment variables: ${missing.join(', ')}.\n` +
      'Either set USE_MOCK_DATA=true for development, or configure Firebase Admin credentials.\n' +
      'See .env.local.example for required variables.'
    );

    // In production, throw so the deployment fails visibly
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Firebase Admin SDK misconfigured. Missing: ${missing.join(', ')}`);
    }

    return null;
  }

  try {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        // Private key comes as a string with literal \n — parse them
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('[Firebase Admin] Initialization failed:', error.message);

    if (error.message.includes('private_key')) {
      console.error(
        '[Firebase Admin] Hint: The private key format may be incorrect.\n' +
        'Make sure the FIREBASE_ADMIN_PRIVATE_KEY env var contains the full PEM key\n' +
        'including "-----BEGIN PRIVATE KEY-----" and "-----END PRIVATE KEY-----".\n' +
        'In Vercel, paste the key as-is — Vercel handles multi-line values correctly.'
      );
    }

    if (process.env.NODE_ENV === 'production') {
      throw error;
    }

    return null;
  }
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
