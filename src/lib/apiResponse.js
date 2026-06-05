/**
 * API Response Helpers
 * 
 * Standardised JSON response format for all API endpoints.
 * Ensures consistent error handling and response structure.
 * Each response includes a unique request ID for debugging.
 */
import { NextResponse } from 'next/server';

/**
 * Generate a short unique request ID.
 */
function generateRequestId() {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Send a success response.
 * @param {object} data - Response payload
 * @param {number} status - HTTP status code (default: 200)
 */
export function successResponse(data, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      requestId: generateRequestId(),
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Send an error response.
 * @param {string} message - Error message
 * @param {number} status - HTTP status code (default: 400)
 * @param {Array} errors - Detailed validation errors (optional)
 */
export function errorResponse(message, status = 400, errors = null) {
  const body = {
    success: false,
    error: {
      message,
      ...(errors && { details: errors }),
    },
    requestId: generateRequestId(),
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(body, { status });
}

/**
 * Send a validation error response (422).
 * @param {Array} errors - Array of { field, message } objects
 */
export function validationErrorResponse(errors) {
  return errorResponse('Validation failed', 422, errors);
}

/**
 * Send a rate limit error response (429).
 */
export function rateLimitResponse() {
  return errorResponse(
    'Too many requests. Please try again later.',
    429
  );
}

/**
 * Send a server error response (500).
 * Logs the actual error but sends a generic message to client.
 * @param {Error} error - The caught error (logged, not sent to client)
 */
export function serverErrorResponse(error) {
  console.error('[API Error]', error);
  return errorResponse(
    'An internal server error occurred. Please try again later.',
    500
  );
}

/**
 * Send a method not allowed response (405).
 * @param {string[]} allowed - List of allowed HTTP methods
 */
export function methodNotAllowedResponse(allowed = []) {
  return NextResponse.json(
    {
      success: false,
      error: {
        message: `Method not allowed. Allowed: ${allowed.join(', ')}`,
      },
      requestId: generateRequestId(),
      timestamp: new Date().toISOString(),
    },
    {
      status: 405,
      headers: {
        Allow: allowed.join(', '),
      },
    }
  );
}
