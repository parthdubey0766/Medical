/**
 * Zod Validation Schemas
 * 
 * Centralized validation for all API inputs.
 * Used server-side in API routes and can be reused client-side.
 * Follows DPDP Act data minimisation: only collect what's needed.
 */
import { z } from 'zod';

// --- Shared field validators ---

const phoneRegex = /^\+91[\-\s]?[6-9]\d{9}$/;
const nameRegex = /^[a-zA-Z\s'.,-]{2,100}$/;

export const phoneValidator = z
  .string()
  .trim()
  .regex(phoneRegex, 'Please enter a valid Indian phone number starting with +91 (e.g., +91-9876543210)');

export const emailValidator = z
  .string()
  .trim()
  .email('Please enter a valid email address')
  .max(254, 'Email is too long');

export const nameValidator = z
  .string()
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be under 100 characters')
  .regex(nameRegex, 'Name contains invalid characters');

// --- Appointment Booking Schema ---

export const bookingSchema = z.object({
  name: nameValidator,
  phone: phoneValidator,
  email: emailValidator,
  reason: z
    .string()
    .trim()
    .min(2, 'Please select or enter a reason')
    .max(200, 'Reason must be under 200 characters'),
  preferredDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine((date) => {
      const d = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return d >= today;
    }, 'Appointment date cannot be in the past')
    .refine((date) => {
      const d = new Date(date);
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 60);
      return d <= maxDate;
    }, 'Appointments can only be booked up to 60 days in advance'),
  preferredTimeSlot: z
    .string()
    .regex(/^\d{2}:\d{2}-\d{2}:\d{2}$/, 'Time slot must be in HH:MM-HH:MM format'),
  age: z
    .number()
    .int()
    .min(0, 'Age must be positive')
    .max(120, 'Please enter a valid age under 120'),
  notes: z
    .string()
    .trim()
    .max(500, 'Notes must be under 500 characters')
    .optional()
    .default(''),
  consentGiven: z
    .boolean()
    .refine((val) => val === true, 'You must consent to data processing to book an appointment'),
  marketingConsent: z
    .boolean()
    .optional()
    .default(false),
});

// --- Contact Form Schema ---

export const contactSchema = z.object({
  name: nameValidator,
  phone: phoneValidator,
  email: emailValidator,
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be under 2000 characters'),
  recaptchaToken: z
    .string()
    .optional(), // Optional for dev mode
});

// --- DPDP Data Request Schema ---

export const dataRequestSchema = z.object({
  email: emailValidator,
  phone: phoneValidator,
  requestType: z.enum(['access', 'erasure'], {
    errorMap: () => ({ message: 'Request type must be "access" or "erasure"' }),
  }),
  reason: z
    .string()
    .trim()
    .max(500, 'Reason must be under 500 characters')
    .optional()
    .default(''),
});

// --- Slot Query Schema ---

export const slotQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

/**
 * Validate input against a Zod schema.
 * Returns { success: true, data } or { success: false, errors }.
 */
export function validateInput(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));

  return { success: false, errors };
}
