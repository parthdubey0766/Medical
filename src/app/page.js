import Image from "next/image";
import Link from "next/link";
import styles from "@/components/site.module.css";
import { CLINIC_INFO, DOCTOR_INFO, SERVICES, TESTIMONIALS } from "@/lib/mockData";

const serviceCodes = {
  "general-medicine": "GM",
  diabetology: "DB",
  "cardiology-screening": "CS",
  "respiratory-care": "RC",
  "preventive-health": "PH",
  "geriatric-care": "GC",
};

export default function Home() {
  const highlightedServices = SERVICES.slice(0, 4);
  const metrics = CLINIC_INFO.trustMetrics;

  return (
    <main className={styles.pageMain}>
      <section className={styles.hero}>
        <Image
          className={styles.heroImage}
          src="/clinic-exterior.png"
          alt="Exterior view of Parth's Medical Clinic"
          fill
          priority
          sizes="100vw"
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>General Medicine and Diabetology</span>
          <h1>{CLINIC_INFO.name}</h1>
          <p className={styles.heroLead}>
            Thoughtful consultations, preventive care, chronic disease management, and clear
            follow-up for families across Gurugram.
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.button} href="/book">
              Book appointment
            </Link>
            <Link className={styles.secondaryButton} href="/gallery">
              View clinic tour
            </Link>
          </div>
          <div className={styles.heroFacts} aria-label="Clinic highlights">
            <div className={styles.heroFact}>
              <strong>{DOCTOR_INFO.experience}</strong>
              <span>Clinical experience</span>
            </div>
            <div className={styles.heroFact}>
              <strong>{metrics.patients.toLocaleString("en-IN")}+</strong>
              <span>Patients served</span>
            </div>
            <div className={styles.heroFact}>
              <strong>{metrics.rating}/5</strong>
              <span>Patient rating</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.metricStrip}>
            <div className={styles.metric}>
              <strong>9 AM</strong>
              <span>Morning OPD starts Monday to Saturday</span>
            </div>
            <div className={styles.metric}>
              <strong>15 min</strong>
              <span>Structured appointment slots</span>
            </div>
            <div className={styles.metric}>
              <strong>DPDP</strong>
              <span>Consent-aware data handling</span>
            </div>
            <div className={styles.metric}>
              <strong>24 hr</strong>
              <span>Contact follow-up window</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.sectionMuted}>
        <div className={styles.sectionInner}>
          <div className={styles.split}>
            <div className={styles.copyStack}>
              <div className={styles.sectionHeader}>
                <span className={styles.eyebrow}>Meet your physician</span>
                <h2>{DOCTOR_INFO.name}</h2>
                <p>{DOCTOR_INFO.title}</p>
              </div>
              <p>
                Dr. Parth brings calm, evidence-based care to everyday illnesses, diabetes,
                blood pressure concerns, respiratory symptoms, and preventive health planning.
              </p>
              <p>
                Consultations are designed to give patients enough time to explain symptoms,
                understand medicines, and leave with a practical next step.
              </p>
              <div className={styles.buttonRow}>
                <Link className={styles.ghostButton} href="/about">
                  Doctor profile
                </Link>
              </div>
            </div>
            <div className={styles.portraitFrame}>
              <Image
                src="/doctor-portrait.png"
                alt="Portrait of Dr. Parth"
                fill
                sizes="(max-width: 840px) 100vw, 42vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={`${styles.sectionHeader} ${styles.center}`}>
            <span className={styles.eyebrow}>Care areas</span>
            <h2>Services for everyday and long-term health</h2>
            <p>
              The clinic covers common medical concerns, prevention, and regular monitoring for
              conditions that need continuity.
            </p>
          </div>
          <div className={styles.gridFour}>
            {highlightedServices.map((service) => (
              <article className={styles.serviceCard} key={service.id}>
                <span className={styles.serviceCode}>{serviceCodes[service.id]}</span>
                <h3>{service.name}</h3>
                <p>{service.shortDesc}</p>
                <Link className={styles.ghostButton} href="/services">
                  Details
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sectionDark}>
        <div className={styles.sectionInner}>
          <div className={styles.split}>
            <div className={styles.imageFrame}>
              <Image
                src="/clinic-reception.png"
                alt="Reception area at Parth's Medical Clinic"
                fill
                sizes="(max-width: 840px) 100vw, 48vw"
              />
            </div>
            <div className={styles.copyStack}>
              <div className={styles.sectionHeader}>
                <span className={styles.eyebrow}>Clinic experience</span>
                <h2>A calm place for focused care</h2>
                <p>
                  Reception, waiting, and consultation areas are organized for simple movement,
                  privacy, and clear communication.
                </p>
              </div>
              <div className={styles.buttonRow}>
                <Link className={styles.button} href="/gallery">
                  Explore gallery
                </Link>
                <Link className={styles.secondaryButton} href="/contact">
                  Find the clinic
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={`${styles.sectionHeader} ${styles.center}`}>
            <span className={styles.eyebrow}>Patient voices</span>
            <h2>Trusted for steady, practical care</h2>
          </div>
          <div className={styles.gridThree}>
            {TESTIMONIALS.map((testimonial) => (
              <article className={styles.testimonialCard} key={testimonial.id}>
                <div className={styles.testimonialName}>
                  <span>{testimonial.name}</span>
                  <span className={styles.rating}>5/5</span>
                </div>
                <p>{testimonial.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
