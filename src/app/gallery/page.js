import Image from "next/image";
import Link from "next/link";
import styles from "@/components/site.module.css";

export const metadata = {
  title: "Gallery | Parth's Medical Clinic",
  description: "View clinic spaces and explore the patient journey.",
};

const gallery = [
  {
    src: "/clinic-exterior.png",
    alt: "Clinic exterior with accessible entrance",
    title: "Clinic exterior",
    caption: "Visible street-facing access and clear entry.",
  },
  {
    src: "/clinic-reception.png",
    alt: "Clinic reception and waiting chairs",
    title: "Reception",
    caption: "Organized front desk for appointments and arrivals.",
  },
  {
    src: "/waiting-area.png",
    alt: "Clinic waiting area",
    title: "Waiting area",
    caption: "Comfortable seating with a calm patient flow.",
  },
  {
    src: "/doctors-cabin.png",
    alt: "Doctor consultation cabin",
    title: "Consultation room",
    caption: "Private room for focused examination and care planning.",
  },
];

export default function GalleryPage() {
  return (
    <main className={styles.pageMain}>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroInner}>
          <span className={styles.eyebrow}>Gallery</span>
          <h1>Clinic spaces</h1>
          <p>
            Preview the reception, waiting area, and consultation room before
            your visit.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.galleryGrid}>
            {gallery.map((item) => (
              <figure key={item.src}>
                <div className={styles.galleryImage}>
                  <Image src={item.src} alt={item.alt} fill sizes="(max-width: 840px) 100vw, 45vw" />
                </div>
                <figcaption className={styles.galleryCaption}>
                  <strong>{item.title}</strong>
                  <span>{item.caption}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className={styles.buttonRow}>
            <Link className={styles.button} href="/book">
              Book appointment
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
