import Link from "next/link";
import styles from "./site.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <span className={styles.brandMark}>DS</span>
          <div>
            <strong>Parth&apos;s Medical Clinic</strong>
            <p>General medicine and diabetology in Gurugram.</p>
          </div>
        </div>

        <div className={styles.footerColumns}>
          <div>
            <h2>Visit</h2>
            <p>123, MG Road, Sector 15, Gurugram, Haryana 122001</p>
            <a href="https://maps.google.com/?q=28.4595,77.0266" target="_blank" rel="noreferrer">
              Open map
            </a>
          </div>
          <div>
            <h2>Hours</h2>
            <p>Mon - Fri: 9:00 AM - 1:00 PM, 5:00 PM - 9:00 PM</p>
            <p>Saturday: 9:00 AM - 1:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
          <div>
            <h2>Contact</h2>
            <a href="tel:+919876543210">+91-9876543210</a>
            <a href="mailto:clinic@parthsclinic.com">clinic@parthsclinic.com</a>
            <Link href="/privacy">Privacy and data requests</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
