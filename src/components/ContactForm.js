"use client";

import { useState } from "react";
import styles from "./site.module.css";

function getApiMessage(payload) {
  if (payload?.error?.details?.length) {
    return payload.error.details.map((item) => item.message).join(" ");
  }
  return payload?.error?.message || payload?.data?.message || "Something went wrong. Please try again.";
}

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "+91-",
    email: "",
    message: "",
  });

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitContact(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(getApiMessage(result));
      }
      setStatus({ kind: "success", message: result.data.message });
      setForm({ name: "", phone: "+91-", email: "", message: "" });
    } catch (error) {
      setStatus({ kind: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={submitContact}>
      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label htmlFor="contact-name">Full name</label>
          <input
            id="contact-name"
            className={styles.input}
            name="name"
            value={form.name}
            onChange={updateField}
            autoComplete="name"
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="contact-phone">Phone</label>
          <input
            id="contact-phone"
            className={styles.input}
            name="phone"
            value={form.phone}
            onChange={updateField}
            autoComplete="tel"
            placeholder="+91-9876543210"
            required
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-email">Email</label>
        <input
          id="contact-email"
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
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          className={styles.textarea}
          name="message"
          value={form.message}
          onChange={updateField}
          minLength={10}
          maxLength={2000}
          required
        />
      </div>

      {status ? (
        <p className={styles.statusMessage} data-kind={status.kind} aria-live="polite">
          {status.message}
        </p>
      ) : null}

      <button className={styles.button} type="submit" disabled={submitting}>
        {submitting ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
