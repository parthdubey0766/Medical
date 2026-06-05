import ContactForm from "@/components/ContactForm";
import styles from "@/components/site.module.css";
import { CLINIC_INFO } from "@/lib/mockData";

export const metadata = {
  title: "Contact",
  description: "Contact Parth's Medical Clinic in Gurugram — phone, email, WhatsApp, and location map. We respond to all inquiries within 24 hours.",
};

export default function ContactPage() {
  return (
    <main className={styles.pageMain}>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroInner}>
          <span className={styles.eyebrow}>Contact</span>
          <h1>Reach the clinic</h1>
          <p>Call, message, or send an inquiry. The clinic will respond within 24 hours.</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.contactLayout}>
            <div className={styles.formPanel}>
              <ContactForm />
            </div>
            <aside className={styles.asidePanel}>
              <h2>Contact details</h2>
              <ul>
                <li>{CLINIC_INFO.address}</li>
                <li>
                  <a href={`tel:${CLINIC_INFO.phone.replaceAll("-", "")}`}>{CLINIC_INFO.phone}</a>
                </li>
                <li>
                  <a href={`mailto:${CLINIC_INFO.email}`}>{CLINIC_INFO.email}</a>
                </li>
                <li>
                  <a href={`https://wa.me/${CLINIC_INFO.whatsapp}`} target="_blank" rel="noreferrer">
                    WhatsApp clinic
                  </a>
                </li>
              </ul>
              <h2>Hours</h2>
              <ul>
                <li>{CLINIC_INFO.workingHours.weekdays}</li>
                <li>{CLINIC_INFO.workingHours.saturday}</li>
                <li>{CLINIC_INFO.workingHours.sunday}</li>
              </ul>
            </aside>
          </div>

          <div className={styles.contactStrip}>
            <div className={styles.contactItem}>
              <strong>Phone</strong>
              <a href={`tel:${CLINIC_INFO.phone.replaceAll("-", "")}`}>{CLINIC_INFO.phone}</a>
            </div>
            <div className={styles.contactItem}>
              <strong>Email</strong>
              <a href={`mailto:${CLINIC_INFO.email}`}>{CLINIC_INFO.email}</a>
            </div>
            <div className={styles.contactItem}>
              <strong>Map</strong>
              <a href={CLINIC_INFO.googleMapsLink} target="_blank" rel="noreferrer">
                Open directions
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.sectionMuted}>
        <div className={styles.sectionInner}>
          <div className={styles.mapFrame}>
            <iframe
              title="Map to Parth's Medical Clinic"
              src={CLINIC_INFO.googleMapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
