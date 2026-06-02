/**
 * GET /api/slots?date=YYYY-MM-DD
 * 
 * Fetch available appointment time slots for a specific date.
 * Public endpoint — no authentication required.
 * Rate limited to 30 requests/minute per IP.
 */
import { getSlotsByDate } from '@/lib/services/slots';
import { slotQuerySchema, validateInput } from '@/lib/validation';
import { successResponse, errorResponse, validationErrorResponse, rateLimitResponse, serverErrorResponse } from '@/lib/apiResponse';
import { slotLimiter } from '@/lib/rateLimit';

export async function GET(request) {
  try {
    // 1. Rate limit check
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const { success: withinLimit } = slotLimiter.check(ip);
    if (!withinLimit) {
      return rateLimitResponse();
    }

    // 2. Extract and validate query params
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return errorResponse('Missing required parameter: date', 400);
    }

    const validation = validateInput(slotQuerySchema, { date });
    if (!validation.success) {
      return validationErrorResponse(validation.errors);
    }

    // 3. Check if date is in the past
    const requestDate = new Date(date + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (requestDate < today) {
      return errorResponse('Cannot fetch slots for past dates', 400);
    }

    // 4. Check if date is too far in the future (60 days)
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 60);
    if (requestDate > maxDate) {
      return errorResponse('Cannot fetch slots more than 60 days in advance', 400);
    }

    // 5. Fetch slots
    const slotData = await getSlotsByDate(date);

    return successResponse({
      date: slotData.date,
      clinicOpen: slotData.clinicOpen,
      totalSlots: slotData.slots.length,
      availableSlots: slotData.slots.filter((s) => s.available).length,
      slots: slotData.slots,
    });
  } catch (error) {
    return serverErrorResponse(error);
  }
}
