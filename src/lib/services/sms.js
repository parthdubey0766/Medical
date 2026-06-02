/**
 * SMS Service (Twilio)
 * 
 * Sends SMS notifications for appointment confirmations.
 * In mock mode, logs to console instead of sending real SMS.
 */

const IS_MOCK = process.env.USE_MOCK_DATA === 'true';
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

/**
 * Send an SMS via Twilio API.
 * @param {object} options
 * @param {string} options.to - Recipient phone (E.164 format)
 * @param {string} options.body - SMS message body (max 1600 chars)
 * @returns {Promise<{ success: boolean, sid?: string, error?: string }>}
 */
export async function sendSMS({ to, body }) {
  if (IS_MOCK) {
    console.log('[Mock SMS]', { to, body: body.substring(0, 80) + '...' });
    return { success: true, sid: `mock-sms-${Date.now()}` };
  }

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.warn('[SMSService] Twilio not configured, skipping SMS.');
    return { success: false, error: 'SMS service not configured' };
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: to,
        From: TWILIO_PHONE_NUMBER,
        Body: body,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[SMSService] Twilio API error:', errorData);
      return { success: false, error: errorData.message || 'Failed to send SMS' };
    }

    const data = await response.json();
    console.log('[SMSService] SMS sent:', data.sid);
    return { success: true, sid: data.sid };
  } catch (error) {
    console.error('[SMSService] Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send appointment confirmation SMS.
 */
export async function sendBookingConfirmationSMS({ to, name, bookingRef, date, timeSlot }) {
  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const body = `✅ Appointment Confirmed\n\nDear ${name},\nRef: ${bookingRef}\n📅 ${formattedDate} at ${timeSlot}\n📍 Parth's Clinic, MG Road, Gurugram\n📞 +91-9876543210\n\nPlease arrive 10 mins early.`;

  return sendSMS({ to, body });
}
