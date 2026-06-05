/**
 * DELETE /api/admin/delete
 *
 * Deletes a single appointment or contact record.
 * Protected by signed admin cookie validation.
 */
import { cookies } from 'next/headers';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/apiResponse';
import { deleteAppointmentById } from '@/lib/services/appointments';
import { deleteContactById } from '@/lib/services/contacts';
import { IS_PREVIEW_SITE } from '@/lib/runtime';
import { validateAuthCookie } from '@/lib/adminAuth';

export async function DELETE(request) {
  try {
    if (IS_PREVIEW_SITE) {
      return errorResponse('Delete not available in preview mode', 403);
    }

    const cookieStore = await cookies();

    if (!validateAuthCookie(cookieStore)) {
      return errorResponse('Unauthorized', 401);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return errorResponse('Invalid request body', 400);
    }

    const { type, id } = body;

    if (!type || !id) {
      return errorResponse('Missing type or id', 400);
    }

    if (type !== 'appointment' && type !== 'contact') {
      return errorResponse('Invalid type. Must be "appointment" or "contact"', 400);
    }

    let deleted = false;
    if (type === 'appointment') {
      deleted = await deleteAppointmentById(id);
    } else {
      deleted = await deleteContactById(id);
    }

    if (!deleted) {
      return errorResponse('Record not found', 404);
    }

    return successResponse({ message: `${type} deleted successfully` });
  } catch (error) {
    return serverErrorResponse(error);
  }
}
