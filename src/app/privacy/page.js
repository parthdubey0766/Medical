import DataRequestForm from "@/components/DataRequestForm";
import styles from "@/components/site.module.css";

export const metadata = {
  title: "Privacy & Data Requests",
  description: "Request access to or erasure of your personal appointment data under the DPDP Act 2023. Parth's Medical Clinic handles all requests within 72 hours.",
};

export default function PrivacyPage() {
  return (
    <main className={styles.pageMain}>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroInner}>
          <span className={styles.eyebrow}>Privacy</span>
          <h1>Personal data requests</h1>
          <p>
            Submit a request to access your appointment data or ask for erasure of records linked to
            your email and phone number.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.bookingLayout}>
            <div className={styles.formPanel}>
              <DataRequestForm />
            </div>
            <aside className={styles.asidePanel}>
              <h2>How requests are handled</h2>
              <ul>
                <li>Requests are rate limited to protect patient records.</li>
                <li>Access requests return appointment records matched to your email or phone.</li>
                <li>Erasure requests remove appointment records associated with the submitted email.</li>
              </ul>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
