import { cookies } from 'next/headers';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function POST(request) {
  try {
    const { password } = await request.json();
    
    // In production, you would set ADMIN_PASSWORD in your environment variables.
    // For this dev environment, we'll allow "admin123" if the env var isn't set.
    const validPassword = process.env.ADMIN_PASSWORD || 'admin123';

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
