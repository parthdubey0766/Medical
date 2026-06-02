/**
 * Email Service (Resend)
 * 
 * Sends transactional emails for appointment confirmations,
 * contact form auto-replies, and DPDP request acknowledgements.
 * 
 * In mock mode, logs to console instead of sending real emails.
 */

const IS_MOCK = process.env.USE_MOCK_DATA === 'true';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@parths-clinic.com';

/**
 * Send an email via Resend API.
 * @param {object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML email body
 * @param {string} [options.text] - Plain text fallback
 * @returns {Promise<{ success: boolean, id?: string, error?: string }>}
 */
export async function sendEmail({ to, subject, html, text }) {
  if (IS_MOCK) {
    console.log('[Mock Email]', { to, subject, preview: html?.substring(0, 100) });
    return { success: true, id: `mock-email-${Date.now()}` };
  }

  if (!RESEND_API_KEY) {
    console.warn('[EmailService] RESEND_API_KEY not configured, skipping email.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
        text: text || stripHtmlForText(html),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[EmailService] Resend API error:', errorData);
      return { success: false, error: errorData.message || 'Failed to send email' };
    }

    const data = await response.json();
    console.log('[EmailService] Email sent:', data.id);
    return { success: true, id: data.id };
  } catch (error) {
    console.error('[EmailService] Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send appointment confirmation email.
 */
export async function sendBookingConfirmation({ to, name, bookingRef, date, timeSlot, reason }) {
  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const html = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #0D9488, #0F766E); padding: 32px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">✅ Appointment Confirmed</h1>
      </div>
      <div style="padding: 32px;">
        <p style="font-size: 16px; color: #374151;">Dear <strong>${name}</strong>,</p>
        <p style="font-size: 16px; color: #374151;">Your appointment has been successfully booked. Here are the details:</p>
        
        <div style="background: #fff; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e5e7eb;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Booking Ref</td>
              <td style="padding: 8px 0; font-weight: 600; color: #0D9488; font-size: 14px;">${bookingRef}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Date</td>
              <td style="padding: 8px 0; font-weight: 600; color: #111827; font-size: 14px;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Time</td>
              <td style="padding: 8px 0; font-weight: 600; color: #111827; font-size: 14px;">${timeSlot}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Reason</td>
              <td style="padding: 8px 0; font-weight: 600; color: #111827; font-size: 14px;">${reason}</td>
            </tr>
          </table>
        </div>

        <p style="font-size: 14px; color: #6b7280;">
          📍 <strong>Parth's Medical Clinic</strong><br>
          123, MG Road, Sector 15, Gurugram, Haryana 122001<br>
          📞 +91-9876543210
        </p>

        <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
          If you need to reschedule or cancel, please call us or reply to this email.
        </p>
      </div>
      <div style="background: #f3f4f6; padding: 16px; text-align: center; font-size: 12px; color: #9ca3af;">
        © ${new Date().getFullYear()} Parth's Medical Clinic. All rights reserved.<br>
        This is an automated message. Your data is handled per our Privacy Policy.
      </div>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Appointment Confirmed — ${bookingRef} | Parth's Clinic`,
    html,
  });
}

/**
 * Send contact form acknowledgement email.
 */
export async function sendContactAcknowledgement({ to, name }) {
  const html = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0D9488, #0F766E); padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">📩 Message Received</h1>
      </div>
      <div style="padding: 32px; background: #fff;">
        <p style="font-size: 16px; color: #374151;">Dear <strong>${name}</strong>,</p>
        <p style="font-size: 16px; color: #374151;">
          Thank you for reaching out to Parth's Medical Clinic. We have received your message and will get back to you within 24 hours.
        </p>
        <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
          For urgent matters, please call us directly at <strong>+91-9876543210</strong>.
        </p>
      </div>
      <div style="background: #f3f4f6; padding: 16px; text-align: center; font-size: 12px; color: #9ca3af; border-radius: 0 0 12px 12px;">
        © ${new Date().getFullYear()} Parth's Medical Clinic.
      </div>
    </div>
  `;

  return sendEmail({
    to,
    subject: `We received your message — Parth's Clinic`,
    html,
  });
}

/**
 * Send DPDP request acknowledgement email.
 */
export async function sendDpdpAcknowledgement({ to, name, requestType, requestId }) {
  const html = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0D9488, #0F766E); padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">🔒 Data Request Received</h1>
      </div>
      <div style="padding: 32px; background: #fff;">
        <p style="font-size: 16px; color: #374151;">Dear User,</p>
        <p style="font-size: 16px; color: #374151;">
          We have received your data <strong>${requestType}</strong> request under the Digital Personal Data Protection Act 2023.
        </p>
        <div style="background: #f0fdfa; border: 1px solid #ccfbf1; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0; font-size: 14px; color: #134e4a;">
            <strong>Request ID:</strong> ${requestId}<br>
            <strong>Type:</strong> Data ${requestType}<br>
            <strong>Status:</strong> Processing
          </p>
        </div>
        <p style="font-size: 14px; color: #6b7280;">
          We will process your request within 72 hours as required by law. You will receive a follow-up email with the outcome.
        </p>
      </div>
      <div style="background: #f3f4f6; padding: 16px; text-align: center; font-size: 12px; color: #9ca3af; border-radius: 0 0 12px 12px;">
        © ${new Date().getFullYear()} Parth's Medical Clinic.
      </div>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Data ${requestType} request received — Ref: ${requestId}`,
    html,
  });
}

/**
 * Strip HTML tags for plain text fallback.
 */
function stripHtmlForText(html) {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
