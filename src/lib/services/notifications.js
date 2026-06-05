/**
 * Notification Orchestrator
 * 
 * Coordinates sending all notifications (email + SMS) for various events.
 * Handles failures gracefully — a failed notification should never
 * block the main operation (booking, contact form, etc.).
 */
import { sendBookingConfirmation, sendContactAcknowledgement, sendDpdpAcknowledgement } from './email';
import { sendBookingConfirmationSMS, sendWhatsAppToAdmin } from './sms';
import { maskEmail, maskPhone } from '@/lib/sanitize';

/**
 * Send all notifications for a new appointment booking.
 * Runs email and SMS in parallel. Non-blocking — errors are logged, not thrown.
 * 
 * @param {object} booking - Appointment details
 * @returns {Promise<{ email: boolean, sms: boolean }>}
 */
export async function notifyBookingConfirmation(booking) {
  const results = { email: false, sms: false, whatsapp: false };

  try {
    const [emailResult, smsResult, whatsappResult] = await Promise.allSettled([
      sendBookingConfirmation({
        to: booking.email,
        name: booking.name,
        bookingRef: booking.bookingRef,
        date: booking.preferredDate,
        timeSlot: booking.preferredTimeSlot,
        reason: booking.reason,
      }),
      sendBookingConfirmationSMS({
        to: booking.phone,
        name: booking.name,
        bookingRef: booking.bookingRef,
        date: booking.preferredDate,
        timeSlot: booking.preferredTimeSlot,
      }),
      sendWhatsAppToAdmin({
        name: booking.name,
        phone: booking.phone,
        bookingRef: booking.bookingRef,
        date: booking.preferredDate,
        timeSlot: booking.preferredTimeSlot,
        reason: booking.reason,
        age: booking.age,
      }),
    ]);

    results.email = emailResult.status === 'fulfilled' && emailResult.value?.success;
    results.sms = smsResult.status === 'fulfilled' && smsResult.value?.success;
    results.whatsapp = whatsappResult.status === 'fulfilled' && whatsappResult.value?.success;

    console.log('[Notifications] Booking confirmation sent:', {
      bookingRef: booking.bookingRef,
      email: results.email ? `✅ ${maskEmail(booking.email)}` : '❌ Failed',
      sms: results.sms ? `✅ ${maskPhone(booking.phone)}` : '❌ Failed',
      whatsapp: results.whatsapp ? '✅ Admin notified' : '❌ Failed',
    });
  } catch (error) {
    console.error('[Notifications] Unexpected error in booking notifications:', error);
  }

  return results;
}

/**
 * Send notification for a contact form submission.
 * @param {object} contact - Contact form data
 * @returns {Promise<{ email: boolean }>}
 */
export async function notifyContactSubmission(contact) {
  const results = { email: false };

  try {
    const emailResult = await sendContactAcknowledgement({
      to: contact.email,
      name: contact.name,
    });

    results.email = emailResult?.success || false;

    console.log('[Notifications] Contact acknowledgement:', {
      email: results.email ? `✅ ${maskEmail(contact.email)}` : '❌ Failed',
    });
  } catch (error) {
    console.error('[Notifications] Unexpected error in contact notifications:', error);
  }

  return results;
}

/**
 * Send notification for a DPDP data request.
 * @param {object} request - Data request details
 * @returns {Promise<{ email: boolean }>}
 */
export async function notifyDpdpRequest(request) {
  const results = { email: false };

  try {
    const emailResult = await sendDpdpAcknowledgement({
      to: request.email,
      requestType: request.requestType,
      requestId: request.id,
    });

    results.email = emailResult?.success || false;
  } catch (error) {
    console.error('[Notifications] Unexpected error in DPDP notifications:', error);
  }

  return results;
}
