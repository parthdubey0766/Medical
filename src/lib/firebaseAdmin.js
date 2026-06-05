/**
 * Firebase Admin SDK Configuration (Server-side ONLY)
 * 
 * Used in API routes for privileged operations like writing
 * appointments, managing slots, and data deletion (DPDP).
 * NEVER import this file from client-side code.
 */
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let cachedAdminApp = null;
let cachedAdminDb = null;

function hasFirebaseAdminConfig() {
  return Boolean(
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
    process.env.FIREBASE_ADMIN_PRIVATE_KEY
  );
}

function isFirebaseAdminAvailable() {
  if (process.env.USE_MOCK_DATA === 'true') {
    return false;
  }

  return Boolean(getAdminDbInstance());
}

function getAdminAppInstance() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  if (cachedAdminApp) {
    return cachedAdminApp;
  }

  // In mock mode, we don't initialize real Firebase Admin
  if (process.env.USE_MOCK_DATA === 'true') {
    return null;
  }

  // Validate required credentials before attempting init
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    const missing = [];
    if (!projectId) missing.push('FIREBASE_ADMIN_PROJECT_ID');
    if (!clientEmail) missing.push('FIREBASE_ADMIN_CLIENT_EMAIL');
    if (!privateKey) missing.push('FIREBASE_ADMIN_PRIVATE_KEY');

    console.warn(
      `[Firebase Admin] Missing required environment variables: ${missing.join(', ')}.\n` +
      'Either set USE_MOCK_DATA=true for development, or configure Firebase Admin credentials.\n' +
      'See .env.local.example for required variables.'
    );

    return null;
  }

  try {
    cachedAdminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        // Private key comes as a string with literal \n — parse them
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
    return cachedAdminApp;
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

    return null;
  }
}

function getAdminDbInstance() {
  if (cachedAdminDb) {
    return cachedAdminDb;
  }
  const app = getAdminAppInstance();
  if (!app) return null;
  cachedAdminDb = getFirestore(app);
  return cachedAdminDb;
}

// Helper to throw detailed configuration error at runtime
function throwConfigurationError() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  const missing = [];
  if (!projectId) missing.push('FIREBASE_ADMIN_PROJECT_ID');
  if (!clientEmail) missing.push('FIREBASE_ADMIN_CLIENT_EMAIL');
  if (!privateKey) missing.push('FIREBASE_ADMIN_PRIVATE_KEY');

  throw new Error(
    `Firebase Admin SDK misconfigured. Missing: ${missing.join(', ')}. ` +
    `Please configure these environment variables in your Vercel project settings.`
  );
}

// Proxies to intercept accesses at runtime and check/throw then
const adminApp = new Proxy({}, {
  get(target, prop) {
    const app = getAdminAppInstance();
    if (!app) {
      if (process.env.USE_MOCK_DATA === 'true') {
        return null;
      }
      throwConfigurationError();
    }
    const val = app[prop];
    return typeof val === 'function' ? val.bind(app) : val;
  }
});

const adminDb = new Proxy({}, {
  get(target, prop) {
    const db = getAdminDbInstance();
    if (!db) {
      if (process.env.USE_MOCK_DATA === 'true') {
        return null;
      }
      throwConfigurationError();
    }
    const val = db[prop];
    return typeof val === 'function' ? val.bind(db) : val;
  }
});

export { adminApp, adminDb, hasFirebaseAdminConfig, isFirebaseAdminAvailable };
