/**
 * POST /api/request-data
 * 
 * DPDP Act 2023 — Data Access & Erasure Requests
 * 
 * Allows users to:
 * - Request access to their personal data ("access")
 * - Request erasure/deletion of their data ("erasure")
 * 
 * This endpoint is rate limited strictly (2 req/min) and
 * logs all requests for compliance audit trail.
 */
import { getAppointmentsByEmail, getAppointmentsByPhone, deleteAppointmentsByEmail } from '@/lib/services/appointments';
import { dataRequestSchema, validateInput } from '@/lib/validation';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  rateLimitResponse,
  serverErrorResponse,
} from '@/lib/apiResponse';
import { dataRequestLimiter } from '@/lib/rateLimit';
import { notifyDpdpRequest } from '@/lib/services/notifications';
import { normalizePhone, maskEmail, maskPhone } from '@/lib/sanitize';
import { addMockDataRequest } from '@/lib/mockData';
import { IS_PREVIEW_SITE } from '@/lib/runtime';

const IS_MOCK = process.env.USE_MOCK_DATA === 'true';

export async function POST(request) {
  try {
    if (IS_PREVIEW_SITE) {
      return successResponse({
        requestId: 'PREVIEW-DPDP',
        requestType: 'access',
        message: 'Preview mode request captured locally only.',
        recordsFound: 0,
        data: [],
      }, 201);
    }

    // 1. Rate limit check (strict: 2 per minute)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const { success: withinLimit } = dataRequestLimiter.check(ip);
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
    const validation = validateInput(dataRequestSchema, body);
    if (!validation.success) {
      return validationErrorResponse(validation.errors);
    }

    const { email, phone, requestType, reason } = validation.data;
    const normalizedPhone = normalizePhone(phone);

    // 4. Log the DPDP request for audit trail
    const requestId = `DPDP-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

    console.log('[DPDP] Data request received:', {
      requestId,
      type: requestType,
      email: maskEmail(email),
      phone: maskPhone(normalizedPhone),
      ip,
    });

    // 5. Handle based on request type
    if (requestType === 'access') {
      return handleAccessRequest({ email, phone: normalizedPhone, requestId, reason });
    } else if (requestType === 'erasure') {
      return handleErasureRequest({ email, phone: normalizedPhone, requestId, reason });
    }

    return errorResponse('Invalid request type', 400);
  } catch (error) {
    return serverErrorResponse(error);
  }
}

/**
 * Handle data access request — return user's stored data.
 */
async function handleAccessRequest({ email, phone, requestId, reason }) {
  try {
    // Fetch appointments by email and phone
    const [byEmail, byPhone] = await Promise.all([
      getAppointmentsByEmail(email),
      getAppointmentsByPhone(phone),
    ]);

    // Merge and deduplicate
    const allAppointments = [...byEmail];
    for (const apt of byPhone) {
      if (!allAppointments.find((a) => a.id === apt.id)) {
        allAppointments.push(apt);
      }
    }

    // Store the request for audit
    if (IS_MOCK) {
      addMockDataRequest({ email, phone, requestType: 'access', reason, requestId });
    }

    // Send acknowledgement email (fire-and-forget)
    notifyDpdpRequest({ email, requestType: 'access', id: requestId }).catch(() => {});

    // Return sanitized data (exclude internal fields)
    const sanitizedAppointments = allAppointments.map((apt) => ({
      bookingRef: apt.bookingRef,
      name: apt.name,
      email: apt.email,
      phone: apt.phone,
      reason: apt.reason,
      preferredDate: apt.preferredDate,
      preferredTimeSlot: apt.preferredTimeSlot,
      status: apt.status,
      createdAt: apt.createdAt,
    }));

    return successResponse({
      requestId,
      requestType: 'access',
      message: 'Your data has been retrieved. A copy has also been sent to your email.',
      recordsFound: sanitizedAppointments.length,
      data: sanitizedAppointments,
    });
  } catch (error) {
    console.error('[DPDP] Access request error:', error);
    throw error;
  }
}

/**
 * Handle data erasure request — delete user's stored data.
 */
async function handleErasureRequest({ email, phone, requestId, reason }) {
  try {
    // Delete all appointments associated with this email
    const deletedCount = await deleteAppointmentsByEmail(email);

    // Store the request for audit
    if (IS_MOCK) {
      addMockDataRequest({ email, phone, requestType: 'erasure', reason, requestId });
    }

    // Send acknowledgement email (fire-and-forget)
    notifyDpdpRequest({ email, requestType: 'erasure', id: requestId }).catch(() => {});

    console.log('[DPDP] Erasure completed:', {
      requestId,
      recordsDeleted: deletedCount,
      email: maskEmail(email),
    });

    return successResponse({
      requestId,
      requestType: 'erasure',
      message: 'Your data erasure request has been processed. All associated records have been deleted.',
      recordsDeleted: deletedCount,
    });
  } catch (error) {
    console.error('[DPDP] Erasure request error:', error);
    throw error;
  }
}
