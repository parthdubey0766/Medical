/**
 * Admin Authentication Utilities
 *
 * Provides signed cookie creation and validation for the admin panel.
 * Uses HMAC-SHA256 with the ADMIN_PASSWORD as the key — no extra
 * env vars needed. The cookie value is a timestamped, signed token
 * instead of a plain "true" string.
 *
 * Cookie format: <timestamp>.<signature>
 */
import { createHmac, timingSafeEqual } from 'crypto';

const COOKIE_NAME = 'admin_auth';
const MAX_AGE_SECONDS = 60 * 60 * 24; // 1 day

/**
 * Derive an HMAC key from the admin password.
 * @returns {string}
 */
function getSecret() {
  return process.env.ADMIN_PASSWORD || '';
}

/**
 * Create a signed token: "<timestamp>.<hmac-hex>"
 * @returns {string}
 */
function createToken() {
  const timestamp = Date.now().toString(36);
  const hmac = createHmac('sha256', getSecret())
    .update(timestamp)
    .digest('hex');
  return `${timestamp}.${hmac}`;
}

/**
 * Verify a signed token.
 * @param {string} token - The token from the cookie
 * @returns {boolean}
 */
function verifyToken(token) {
  if (!token || typeof token !== 'string') return false;

  const dotIndex = token.indexOf('.');
  if (dotIndex === -1) return false;

  const timestamp = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);

  // Verify signature
  const expectedHmac = createHmac('sha256', getSecret())
    .update(timestamp)
    .digest('hex');

  // Timing-safe comparison to prevent timing attacks
  try {
    const sigBuf = Buffer.from(signature, 'hex');
    const expectedBuf = Buffer.from(expectedHmac, 'hex');
    if (sigBuf.length !== expectedBuf.length) return false;
    return timingSafeEqual(sigBuf, expectedBuf);
  } catch {
    return false;
  }
}

/**
 * Timing-safe password comparison.
 * @param {string} input - User-supplied password
 * @returns {boolean}
 */
export function verifyPassword(input) {
  const expected = getSecret();
  if (!expected) return false;

  try {
    const inputBuf = Buffer.from(input);
    const expectedBuf = Buffer.from(expected);

    // Pad the shorter buffer so lengths match for timingSafeEqual
    if (inputBuf.length !== expectedBuf.length) return false;
    return timingSafeEqual(inputBuf, expectedBuf);
  } catch {
    return false;
  }
}

/**
 * Create the admin auth cookie options.
 * @returns {{ name: string, value: string, httpOnly: boolean, path: string, maxAge: number, sameSite: string, secure: boolean }}
 */
export function createAuthCookie() {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    name: COOKIE_NAME,
    value: createToken(),
    httpOnly: true,
    path: '/',
    maxAge: MAX_AGE_SECONDS,
    sameSite: 'lax',
    secure: isProduction, // HTTPS-only in production
  };
}

/**
 * Validate the admin auth cookie from a cookie store.
 * @param {import('next/headers').ReadonlyRequestCookies} cookieStore
 * @returns {boolean}
 */
export function validateAuthCookie(cookieStore) {
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie) return false;

  // Support legacy plain "true" value during migration
  if (cookie.value === 'true') return false;

  return verifyToken(cookie.value);
}

/**
 * Create a cookie that clears the auth session.
 * @returns {{ name: string, value: string, path: string, maxAge: number }}
 */
export function createLogoutCookie() {
  return {
    name: COOKIE_NAME,
    value: '',
    path: '/',
    maxAge: 0,
  };
}
