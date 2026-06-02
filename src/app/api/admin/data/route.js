import { cookies } from 'next/headers';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/apiResponse';
import { getAllAppointments } from '@/lib/services/appointments';
import { getAllContacts } from '@/lib/services/contacts';

export async function GET(request) {
  try {
    const authCookie = cookies().get('admin_auth');

    if (!authCookie || authCookie.value !== 'true') {
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
