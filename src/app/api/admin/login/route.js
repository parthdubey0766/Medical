import { cookies } from 'next/headers';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function POST(request) {
  try {
    const { password } = await request.json();

    // Require an explicit environment variable and avoid any hardcoded fallback secrets.
    const validPassword = process.env.ADMIN_PASSWORD;
    if (!validPassword) {
      return errorResponse('Admin login is not configured', 503);
    }

    if (password === validPassword) {
      cookies().set({
        name: 'admin_auth',
        value: 'true',
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
        sameSite: 'lax',
      });
      return successResponse({ message: 'Logged in successfully' });
    }

    return errorResponse('Invalid password', 401);
  } catch (error) {
    return errorResponse('Server error', 500);
  }
}
