export const IS_PREVIEW_SITE = process.env.NEXT_PUBLIC_PREVIEW_MODE === 'true';
export const IS_PRODUCTION = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';