/**
 * POST /api/book
 * 
 * Create a new appointment booking.
 * Validates inputs, checks slot availability, creates appointment,
 * sends confirmation notifications (email + SMS).
 * Rate limited to 5 requests/minute per IP.
 */
import { createAppointment } from '@/lib/services/appointments';
import { bookingSchema, validateInput } from '@/lib/validation';
import { 
  successResponse, 
  errorResponse, 
  validationErrorResponse, 
  rateLimitResponse, 
  serverErrorResponse 
} from '@/lib/apiResponse';
import { bookingLimiter } from '@/lib/rateLimit';
import { notifyBookingConfirmation } from '@/lib/services/notifications';
import { maskEmail, maskPhone } from '@/lib/sanitize';
import { IS_PREVIEW_SITE } from '@/lib/runtime';

export async function POST(request) {
  try {
    if (IS_PREVIEW_SITE) {
      return successResponse(
        {
          bookingRef: 'PREVIEW-BOOKING',
          appointment: {
            name: 'Preview User',
            preferredDate: new Date().toISOString().slice(0, 10),
            preferredTimeSlot: '09:00-09:15',
            reason: 'General consultation',
            status: 'preview',
          },
          message: 'Preview mode booking captured locally only.',
        },
        201
      );
    }

    // 1. Rate limit check
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const { success: withinLimit } = bookingLimiter.check(ip);
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
    const validation = validateInput(bookingSchema, body);
    if (!validation.success) {
      return validationErrorResponse(validation.errors);
    }

    const validatedData = validation.data;

    // 4. Create appointment (includes slot availability check via Firestore transaction)
    let result;
    try {
      result = await createAppointment(validatedData);
    } catch (error) {
      if (error.message.includes('no longer available')) {
        return errorResponse(error.message, 409); // Conflict — slot taken
      }
      throw error; // Re-throw for general error handler
    }

    // 5. Send notifications (non-blocking — don't await for response)
    // Fire-and-forget: notifications should never delay the booking response
    notifyBookingConfirmation({
      ...validatedData,
      bookingRef: result.bookingRef,
    }).catch((err) => {
      console.error('[BookAPI] Notification error (non-blocking):', err);
    });

    // 6. Return success response
    console.log('[BookAPI] Appointment booked:', {
      ref: result.bookingRef,
      date: validatedData.preferredDate,
      slot: validatedData.preferredTimeSlot,
      email: maskEmail(validatedData.email),
      phone: maskPhone(validatedData.phone),
    });

    return successResponse(
      {
        bookingRef: result.bookingRef,
        appointment: {
          name: result.appointment.name,
          preferredDate: result.appointment.preferredDate,
          preferredTimeSlot: result.appointment.preferredTimeSlot,
          reason: result.appointment.reason,
          status: result.appointment.status,
        },
        message: 'Appointment booked successfully! A confirmation has been sent to your email and phone.',
      },
      201
    );
  } catch (error) {
    return serverErrorResponse(error);
  }
}
