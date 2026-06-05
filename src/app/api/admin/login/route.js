/**
 * POST /api/admin/login
 *
 * Authenticates the admin with a password and sets a signed session cookie.
 * Rate limited to 5 attempts per 15 minutes per IP to prevent brute force.
 */
import { cookies } from 'next/headers';
import { successResponse, errorResponse, rateLimitResponse } from '@/lib/apiResponse';
import { IS_PREVIEW_SITE } from '@/lib/runtime';
import { verifyPassword, createAuthCookie } from '@/lib/adminAuth';
import { adminLoginLimiter } from '@/lib/rateLimit';

export async function POST(request) {
  try {
    if (IS_PREVIEW_SITE) {
      return successResponse({ message: 'Preview mode login bypassed' });
    }

    // Rate limit check
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const { success: withinLimit } = adminLoginLimiter.check(ip);
    if (!withinLimit) {
      console.warn('[AdminLogin] Rate limit exceeded for IP:', ip);
      return rateLimitResponse();
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return errorResponse('Invalid request body', 400);
    }

    const { password } = body;

    // Require an explicit environment variable — no hardcoded fallback.
    const validPassword = process.env.ADMIN_PASSWORD;
    if (!validPassword) {
      console.error('[AdminLogin] ADMIN_PASSWORD environment variable is not set');
      return errorResponse('Admin login is not configured', 503);
    }

    if (!password || typeof password !== 'string') {
      return errorResponse('Password is required', 400);
    }

    // Timing-safe password comparison
    if (verifyPassword(password)) {
      const cookieStore = await cookies();
      cookieStore.set(createAuthCookie());
      console.log('[AdminLogin] Successful login from IP:', ip);
      return successResponse({ message: 'Logged in successfully' });
    }

    console.warn('[AdminLogin] Failed login attempt from IP:', ip);
    return errorResponse('Invalid password', 401);
  } catch (error) {
    console.error('[AdminLogin] Server error:', error);
    return errorResponse('Server error', 500);
  }
}
