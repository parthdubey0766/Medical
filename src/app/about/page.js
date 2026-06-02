import Image from "next/image";
import Link from "next/link";
import styles from "@/components/site.module.css";
import { DOCTOR_INFO } from "@/lib/mockData";

export const metadata = {
  title: "About Dr. Parth | Parth's Medical Clinic",
  description: "Learn about Dr. Parth's qualifications, experience, and approach to care.",
};

const qualifications = [
  "MBBS - Grant Medical College, Mumbai (2008)",
  "MD Internal Medicine - AIIMS, New Delhi (2012)",
  "Fellowship in Diabetology - International Diabetes Federation (2014)",
  "Certified in Preventive Cardiology (2016)",
];

export default function AboutPage() {
  return (
    <main className={styles.pageMain}>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroInner}>
          <span className={styles.eyebrow}>Doctor profile</span>
          <h1>{DOCTOR_INFO.name}</h1>
          <p>
            {DOCTOR_INFO.specialization}, with a patient-first approach to diagnosis, prevention,
            and long-term disease management.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.split}>
            <div className={styles.portraitFrame}>
              <Image
                src="/doctor-portrait.png"
                alt="Dr. Parth in consultation attire"
                fill
                sizes="(max-width: 840px) 100vw, 42vw"
                priority
              />
            </div>
            <div className={styles.copyStack}>
              <div className={styles.sectionHeader}>
                <h2>Care that starts by listening</h2>
                <p>{DOCTOR_INFO.title}</p>
              </div>
              <p>
                Dr. Parth has spent more than 15 years treating acute illnesses, diabetes,
                hypertension, respiratory complaints, and preventive health concerns.
              </p>
              <p>
                His practice focuses on clear explanations, realistic treatment plans, and follow-up
                that helps patients stay steady between visits.
              </p>
              <div className={styles.buttonRow}>
                <Link className={styles.button} href="/book">
                  Book appointment
                </Link>
                <Link className={styles.ghostButton} href="/services">
                  View services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.sectionMuted}>
        <div className={styles.sectionInner}>
          <div className={styles.gridTwo}>
            <article className={styles.detailCard}>
              <h2>Qualifications</h2>
              <ul className={styles.featureList}>
                {qualifications.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className={styles.detailCard}>
              <h2>Professional memberships</h2>
              <ul className={styles.featureList}>
                {DOCTOR_INFO.memberships.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.narrowInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Clinical journey</span>
            <h2>Experience across hospitals and community practice</h2>
          </div>
          <div className={styles.timeline}>
            {DOCTOR_INFO.timeline.map((item) => (
              <article className={styles.timelineItem} key={`${item.year}-${item.title}`}>
                <time>{item.year}</time>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
