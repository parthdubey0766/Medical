"use client";

import { useEffect, useState } from "react";
import styles from "./site.module.css";

const STORAGE_KEY = "parths-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(window.localStorage.getItem(STORAGE_KEY) !== "accepted");
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function acceptCookies() {
    window.localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <section className={styles.cookieBanner} aria-label="Cookie notice">
      <p>
        We use essential cookies for appointment booking and basic site security. Your medical
        information is only used to respond to your request.
      </p>
      <button type="button" onClick={acceptCookies}>
        Accept
      </button>
    </section>
  );
}
