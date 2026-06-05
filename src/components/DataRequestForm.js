"use client";

import { useState } from "react";
import { IS_PREVIEW_SITE } from "@/lib/runtime";
import styles from "./site.module.css";

function getApiMessage(payload) {
  if (payload?.error?.details?.length) {
    return payload.error.details.map((item) => item.message).join(" ");
  }
  return payload?.error?.message || payload?.data?.message || "Something went wrong. Please try again.";
}

export default function DataRequestForm() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [form, setForm] = useState({
    email: "",
    phone: "+91-",
    requestType: "access",
    reason: "",
  });

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitRequest(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    if (IS_PREVIEW_SITE) {
      setStatus({
        kind: "success",
        message: "Preview mode only: data requests are not submitted from GitHub Pages.",
      });
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/request-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(getApiMessage(result));
      }
      setStatus({
        kind: "success",
        message: `${result.data.message} Request ID: ${result.data.requestId}`,
      });
      setForm({ email: "", phone: "+91-", requestType: "access", reason: "" });
    } catch (error) {
      setStatus({ kind: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={submitRequest}>
      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label htmlFor="data-email">Email</label>
          <input
            id="data-email"
            className={styles.input}
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="data-phone">Phone</label>
          <input
            id="data-phone"
            className={styles.input}
            name="phone"
            value={form.phone}
            onChange={updateField}
            placeholder="+91-9876543210"
            required
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="data-request-type">Request type</label>
        <select
          id="data-request-type"
          className={styles.select}
          name="requestType"
          value={form.requestType}
          onChange={updateField}
        >
          <option value="access">Access my data</option>
          <option value="erasure">Erase my data</option>
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="data-reason">Reason</label>
        <textarea
          id="data-reason"
          className={styles.textarea}
          name="reason"
          value={form.reason}
          onChange={updateField}
          maxLength={500}
        />
      </div>

      {status ? (
        <p className={styles.statusMessage} data-kind={status.kind} aria-live="polite">
          {status.message}
        </p>
      ) : null}

      <button className={styles.button} type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit request"}
      </button>
    </form>
  );
}
