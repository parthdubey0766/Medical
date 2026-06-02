/**
 * POST /api/contact
 * 
 * Submit a contact form inquiry.
 * Validates inputs, stores the inquiry, sends acknowledgement email.
 * Rate limited to 3 requests/minute per IP.
 */
import { createContact } from '@/lib/services/contacts';
import { contactSchema, validateInput } from '@/lib/validation';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  rateLimitResponse,
  serverErrorResponse,
} from '@/lib/apiResponse';
import { contactLimiter } from '@/lib/rateLimit';
import { notifyContactSubmission } from '@/lib/services/notifications';

export async function POST(request) {
  try {
    // 1. Rate limit check
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const { success: withinLimit } = contactLimiter.check(ip);
    if (!withinLimit) {
      return rateLimitResponse();
    }

    // 2. Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return errorResponse('Invalid JSON in request body', 400);
    }

    // 3. Validate input
    const validation = validateInput(contactSchema, body);
    if (!validation.success) {
      return validationErrorResponse(validation.errors);
    }

    const validatedData = validation.data;

    // 4. Optional: Verify reCAPTCHA token (if configured)
    if (validatedData.recaptchaToken && process.env.RECAPTCHA_SECRET_KEY) {
      const recaptchaValid = await verifyRecaptcha(validatedData.recaptchaToken);
      if (!recaptchaValid) {
        return errorResponse('reCAPTCHA verification failed. Please try again.', 403);
      }
    }

    // 5. Store the contact inquiry
    const contact = await createContact(validatedData);

    // 6. Send acknowledgement email (fire-and-forget)
    notifyContactSubmission(validatedData).catch((err) => {
      console.error('[ContactAPI] Notification error (non-blocking):', err);
    });

    // 7. Return success
    return successResponse(
      {
        message: 'Thank you for reaching out! We will get back to you within 24 hours.',
        contactId: contact.id,
      },
      201
    );
  } catch (error) {
    return serverErrorResponse(error);
  }
}

/**
 * Verify reCAPTCHA v3 token with Google.
 * @param {string} token - The reCAPTCHA token from the client
 * @returns {Promise<boolean>}
 */
async function verifyRecaptcha(token) {
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    });

    const data = await response.json();
    // Score threshold: 0.5 (0.0 = bot, 1.0 = human)
    return data.success && data.score >= 0.5;
  } catch (error) {
    console.error('[reCAPTCHA] Verification error:', error);
    return false; // Fail open or closed based on security posture — here we fail closed
  }
}
