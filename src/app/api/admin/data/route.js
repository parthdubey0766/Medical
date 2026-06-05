/**
 * GET /api/admin/data
 *
 * Returns all appointments and contacts for the admin dashboard.
 * Protected by signed admin cookie validation.
 */
import { cookies } from 'next/headers';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/apiResponse';
import { getAllAppointments } from '@/lib/services/appointments';
import { getAllContacts } from '@/lib/services/contacts';
import { IS_PREVIEW_SITE } from '@/lib/runtime';
import { validateAuthCookie } from '@/lib/adminAuth';

export async function GET(request) {
  try {
    if (IS_PREVIEW_SITE) {
      return successResponse({
        appointments: [],
        contacts: [],
      });
    }

    const cookieStore = await cookies();

    if (!validateAuthCookie(cookieStore)) {
      return errorResponse('Unauthorized', 401);
    }

    const [appointments, contacts] = await Promise.all([
      getAllAppointments(),
      getAllContacts()
    ]);

    return successResponse({
      appointments,
      contacts
    });
  } catch (error) {
    return serverErrorResponse(error);
  }
}
