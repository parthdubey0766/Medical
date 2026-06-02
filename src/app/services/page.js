import Link from "next/link";
import styles from "@/components/site.module.css";
import { SERVICES } from "@/lib/mockData";

export const metadata = {
  title: "Services | Parth's Medical Clinic",
  description: "Explore general medicine, diabetes care, respiratory care, preventive health, and more.",
};

const serviceCodes = {
  "general-medicine": "GM",
  diabetology: "DB",
  "cardiology-screening": "CS",
  "respiratory-care": "RC",
  "preventive-health": "PH",
  "geriatric-care": "GC",
};

export default function ServicesPage() {
  return (
    <main className={styles.pageMain}>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroInner}>
          <span className={styles.eyebrow}>Services</span>
          <h1>Medical care with continuity</h1>
          <p>
            From routine illness to diabetes follow-up and preventive screening, each visit is
            structured around practical next steps.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.gridThree}>
            {SERVICES.map((service) => (
              <article className={styles.serviceCard} key={service.id}>
                <span className={styles.serviceCode}>{serviceCodes[service.id]}</span>
                <h2>{service.name}</h2>
                <p>{service.fullDesc}</p>
                <ul className={styles.featureList}>
                  {service.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className={styles.buttonRow}>
            <Link className={styles.button} href="/book">
              Book appointment
            </Link>
            <Link className={styles.ghostButton} href="/contact">
              Ask a question
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
