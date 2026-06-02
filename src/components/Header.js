"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./site.module.css";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "Doctor" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Clinic tour" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.siteHeader}>
      <div className={styles.headerInner}>
        <Link className={styles.brand} href="/" aria-label="Parth's Medical Clinic home">
          <span className={styles.brandMark}>DS</span>
          <span className={styles.brandText}>
            <strong>Parth&apos;s</strong>
            <span>Medical Clinic</span>
          </span>
        </Link>

        <button
          className={styles.menuButton}
          type="button"
          aria-expanded={open}
          aria-controls="site-navigation"
          onClick={() => setOpen((current) => !current)}
        >
          <span className={styles.menuLine} />
          <span className={styles.menuLine} />
          <span className={styles.menuLine} />
          <span className="sr-only">Menu</span>
        </button>

        <nav
          id="site-navigation"
          className={`${styles.nav} ${open ? styles.navOpen : ""}`}
          aria-label="Primary navigation"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              className={styles.navLink}
              data-active={isActive(pathname, item.href) ? "true" : "false"}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link className={styles.navCta} href="/book" onClick={() => setOpen(false)}>
            Book appointment
          </Link>
        </nav>
      </div>
    </header>
  );
}
