import Link from "next/link";
import styles from "./site.module.css";

export default function FloatingBookButton() {
  return (
    <Link className={styles.floatingBookButton} href="/book" aria-label="Book an appointment">
      Book
    </Link>
  );
}
