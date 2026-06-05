import BookingForm from "@/components/BookingForm";
import styles from "@/components/site.module.css";
import { CLINIC_INFO } from "@/lib/mockData";

export const metadata = {
  title: "Book Appointment",
  description: "Book an appointment online with Dr. Parth in Gurugram. Choose your preferred date and time slot, receive instant confirmation via email and SMS.",
};

export default function BookPage() {
  return (
    <main className={styles.pageMain}>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroInner}>
          <span className={styles.eyebrow}>Appointments</span>
          <h1>Book a clinic visit</h1>
          <p>
            Select a date, choose an available slot, and receive a confirmation reference after
            submission.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.bookingLayout}>
            <div className={styles.formPanel}>
              <BookingForm />
            </div>
            <aside className={styles.asidePanel}>
              <h2>Clinic hours</h2>
              <ul>
                <li>{CLINIC_INFO.workingHours.weekdays}</li>
                <li>{CLINIC_INFO.workingHours.saturday}</li>
                <li>{CLINIC_INFO.workingHours.sunday}</li>
              </ul>
              <h2>Before you arrive</h2>
              <ul>
                <li>Bring current prescriptions and recent test reports.</li>
                <li>Arrive 10 minutes before your selected slot.</li>
                <li>For urgent symptoms, call the clinic before booking online.</li>
              </ul>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
