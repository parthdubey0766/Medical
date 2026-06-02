/**
 * Input Sanitization Utilities
 * 
 * Strips potentially dangerous content from user inputs
 * before storing or processing. Defence-in-depth layer
 * on top of Zod validation.
 */

/**
 * Strip HTML tags from a string.
 */
export function stripHtml(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/<[^>]*>/g, '');
}

/**
 * Escape special characters that could be used in injection attacks.
 */
export function escapeSpecialChars(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Normalize phone number to E.164-ish format for India.
 * Examples:
 *   "9876543210" → "+919876543210"
 *   "+91-9876543210" → "+919876543210"
 *   "+91 98765 43210" → "+919876543210"
 */
export function normalizePhone(phone) {
  if (typeof phone !== 'string') return phone;
  // Remove all non-digit characters except leading +
  const cleaned = phone.replace(/(?!^\+)\D/g, '');
  if (cleaned.startsWith('+91')) return cleaned;
  if (cleaned.startsWith('91') && cleaned.length === 12) return '+' + cleaned;
  if (cleaned.length === 10) return '+91' + cleaned;
  return cleaned;
}

/**
 * Sanitize all string fields in an object.
 * Strips HTML and trims whitespace.
 */
export function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = stripHtml(value).trim();
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

/**
 * Generate a booking reference number.
 * Format: DRS-YYYYMMDD-XXXXX (e.g., DRS-20260602-A3F7K)
 */
export function generateBookingRef() {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `DRS-${dateStr}-${random}`;
}

/**
 * Mask sensitive data for logging.
 * "john@example.com" → "j***@e***.com"
 * "+919876543210" → "+91****3210"
 */
export function maskEmail(email) {
  if (!email) return '';
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  const domainParts = domain.split('.');
  return `${local[0]}***@${domainParts[0][0]}***.${domainParts.slice(1).join('.')}`;
}

export function maskPhone(phone) {
  if (!phone) return '';
  if (phone.length <= 4) return '****';
  return phone.slice(0, -4).replace(/\d/g, '*') + phone.slice(-4);
}
