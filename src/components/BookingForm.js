"use client";

import { useEffect, useState } from "react";
import styles from "./site.module.css";

const reasons = [
  "General consultation",
  "Diabetes follow-up",
  "Blood pressure review",
  "Preventive health check-up",
  "Respiratory symptoms",
  "Medication review",
];

function toDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getDateBounds() {
  const today = new Date();
  return {
    min: toDateInput(today),
    max: toDateInput(addDays(today, 60)),
  };
}

function formatTime(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(2026, 0, 1, hours, minutes));
}

function getApiMessage(payload) {
  if (payload?.error?.details?.length) {
    return payload.error.details.map((item) => item.message).join(" ");
  }
  return payload?.error?.message || payload?.data?.message || "Something went wrong. Please try again.";
}

export default function BookingForm() {
  const [dateBounds] = useState(getDateBounds);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [form, setForm] = useState(() => ({
    name: "",
    phone: "+91-",
    email: "",
    reason: reasons[0],
    preferredDate: dateBounds.min,
    preferredTimeSlot: "",
    age: "",
    notes: "",
    consentGiven: false,
    marketingConsent: false,
  }));

  useEffect(() => {
    if (!form.preferredDate) return;

    const controller = new AbortController();

    fetch(`/api/slots?date=${encodeURIComponent(form.preferredDate)}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok || !payload.success) {
          throw new Error(getApiMessage(payload));
        }
        setSlots(payload.data.slots || []);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setStatus({ kind: "error", message: error.message });
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setSlotsLoading(false);
      });

    return () => controller.abort();
  }, [form.preferredDate]);

  function updateField(event) {
    const { name, type, checked, value } = event.target;
    if (name === "preferredDate") {
      setSlotsLoading(true);
      setStatus(null);
      setSlots([]);
      setForm((current) => ({
        ...current,
        preferredDate: value,
        preferredTimeSlot: "",
      }));
      return;
    }

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function submitBooking(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const payload = {
      ...form,
      age: form.age ? Number(form.age) : null,
      notes: form.notes || "",
    };

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(getApiMessage(result));
      }

      setStatus({
        kind: "success",
        message: `Appointment confirmed. Reference: ${result.data.bookingRef}`,
      });
      setForm((current) => ({
        ...current,
        name: "",
        phone: "+91-",
        email: "",
        age: "",
        notes: "",
        consentGiven: false,
        marketingConsent: false,
      }));
    } catch (error) {
      setStatus({ kind: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={submitBooking}>
      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label htmlFor="booking-name">Full name</label>
          <input
            id="booking-name"
            className={styles.input}
            name="name"
            value={form.name}
            onChange={updateField}
            autoComplete="name"
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="booking-phone">Phone</label>
          <input
            id="booking-phone"
            className={styles.input}
            name="phone"
            value={form.phone}
            onChange={updateField}
            autoComplete="tel"
            placeholder="+91-9876543210"
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="booking-email">Email</label>
          <input
            id="booking-email"
            className={styles.input}
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            autoComplete="email"
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="booking-age">Age</label>
          <input
            id="booking-age"
            className={styles.input}
            name="age"
            type="number"
            min="0"
            max="120"
            value={form.age}
            onChange={updateField}
            inputMode="numeric"
            required
          />
        </div>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label htmlFor="booking-reason">Reason</label>
          <select
            id="booking-reason"
            className={styles.select}
            name="reason"
            value={form.reason}
            onChange={updateField}
            required
          >
            {reasons.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="booking-date">Preferred date</label>
          <input
            id="booking-date"
            className={styles.input}
            name="preferredDate"
            type="date"
            min={dateBounds.min}
            max={dateBounds.max}
            value={form.preferredDate}
            onChange={updateField}
            required
          />
        </div>
      </div>

      <div className={styles.field}>
        <label>Available slots</label>
        <div className={styles.slotGrid} aria-live="polite">
          {slotsLoading ? (
            <p className={styles.helperText}>Checking available slots...</p>
          ) : slots.length ? (
            slots.map((slot) => {
              const value = `${slot.start}-${slot.end}`;
              return (
                <button
                  key={value}
                  className={styles.slotButton}
                  type="button"
                  disabled={!slot.available}
                  data-selected={form.preferredTimeSlot === value ? "true" : "false"}
                  onClick={() => setForm((current) => ({ ...current, preferredTimeSlot: value }))}
                >
                  {formatTime(slot.start)}
                </button>
              );
            })
          ) : (
            <p className={styles.helperText}>No slots are available for this date.</p>
          )}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="booking-notes">Notes</label>
        <textarea
          id="booking-notes"
          className={styles.textarea}
          name="notes"
          value={form.notes}
          onChange={updateField}
          maxLength={500}
        />
      </div>

      <label className={styles.checkboxField}>
        <input
          name="consentGiven"
          type="checkbox"
          checked={form.consentGiven}
          onChange={updateField}
          required
        />
        <span>I consent to the clinic processing my details to manage this appointment.</span>
      </label>

      <label className={styles.checkboxField}>
        <input
          name="marketingConsent"
          type="checkbox"
          checked={form.marketingConsent}
          onChange={updateField}
        />
        <span>I would like to receive occasional health reminders from the clinic.</span>
      </label>

      {status ? (
        <p className={styles.statusMessage} data-kind={status.kind} aria-live="polite">
          {status.message}
        </p>
      ) : null}

      <button
        className={styles.button}
        type="submit"
        disabled={submitting || !form.preferredTimeSlot || !form.consentGiven}
      >
        {submitting ? "Confirming..." : "Confirm appointment"}
      </button>
    </form>
  );
}
