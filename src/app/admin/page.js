"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { IS_PREVIEW_SITE } from "@/lib/runtime";
import s from "./admin.module.css";

/* ────────────────────────────────────────────
   Demo data for preview / GitHub Pages mode
   ──────────────────────────────────────────── */
const demoAppointments = [
  { id: "demo-1", preferredDate: "2026-06-05", preferredTimeSlot: "09:30-09:45", name: "Aman Verma", phone: "+91-9876543210", reason: "Diabetes follow-up", bookingRef: "DRV-24051", age: 52, email: "aman@example.com", createdAt: "2026-06-04T08:00:00.000Z" },
  { id: "demo-2", preferredDate: "2026-06-05", preferredTimeSlot: "10:15-10:30", name: "Neha Sharma", phone: "+91-9811122233", reason: "Preventive health check-up", bookingRef: "DRV-24052", age: 34, email: "neha@example.com", createdAt: "2026-06-04T07:30:00.000Z" },
  { id: "demo-3", preferredDate: "2026-06-04", preferredTimeSlot: "11:00-11:15", name: "Rohit Soni", phone: "+91-9898989898", reason: "Blood pressure monitoring", bookingRef: "DRV-24048", age: 61, email: "rohit@example.com", createdAt: "2026-06-03T14:00:00.000Z" },
  { id: "demo-4", preferredDate: "2026-06-06", preferredTimeSlot: "17:30-17:45", name: "Pooja Jain", phone: "+91-9777777777", reason: "Asthma management", bookingRef: "DRV-24055", age: 28, email: "pooja@example.com", createdAt: "2026-06-04T09:15:00.000Z" },
  { id: "demo-5", preferredDate: "2026-06-04", preferredTimeSlot: "09:00-09:15", name: "Vikram Singh", phone: "+91-9123456789", reason: "Routine check-up", bookingRef: "DRV-24044", age: 45, email: "vikram@example.com", createdAt: "2026-06-02T11:00:00.000Z" },
  { id: "demo-6", preferredDate: "2026-06-07", preferredTimeSlot: "10:00-10:15", name: "Anjali Patel", phone: "+91-9988776655", reason: "Thyroid follow-up", bookingRef: "DRV-24060", age: 38, email: "anjali@example.com", createdAt: "2026-06-05T06:45:00.000Z" },
  { id: "demo-7", preferredDate: "2026-06-03", preferredTimeSlot: "18:00-18:15", name: "Suresh Kumar", phone: "+91-9000111222", reason: "Knee pain consultation", bookingRef: "DRV-24040", age: 67, email: "suresh@example.com", createdAt: "2026-06-01T08:30:00.000Z" },
  { id: "demo-8", preferredDate: "2026-06-05", preferredTimeSlot: "17:00-17:15", name: "Meera Gupta", phone: "+91-9555444333", reason: "Cholesterol profiling", bookingRef: "DRV-24053", age: 50, email: "meera@example.com", createdAt: "2026-06-04T10:00:00.000Z" },
  { id: "demo-9", preferredDate: "2026-06-08", preferredTimeSlot: "09:15-09:30", name: "Arjun Reddy", phone: "+91-9222333444", reason: "General medicine consult", bookingRef: "DRV-24065", age: 42, email: "arjun@example.com", createdAt: "2026-06-05T09:00:00.000Z" },
  { id: "demo-10", preferredDate: "2026-06-06", preferredTimeSlot: "11:30-11:45", name: "Priya Mehta", phone: "+91-9111000999", reason: "Diabetes management", bookingRef: "DRV-24058", age: 55, email: "priya@example.com", createdAt: "2026-06-04T12:00:00.000Z" },
  { id: "demo-11", preferredDate: "2026-06-09", preferredTimeSlot: "10:45-11:00", name: "Karan Chopra", phone: "+91-9667788990", reason: "Respiratory care", bookingRef: "DRV-24070", age: 33, email: "karan@example.com", createdAt: "2026-06-06T07:00:00.000Z" },
  { id: "demo-12", preferredDate: "2026-06-02", preferredTimeSlot: "18:30-18:45", name: "Sunita Devi", phone: "+91-9876501234", reason: "Geriatric care visit", bookingRef: "DRV-24035", age: 72, email: "sunita@example.com", createdAt: "2026-05-31T10:30:00.000Z" },
];

const demoContacts = [
  { id: "demo-c1", createdAt: "2026-06-03T08:30:00.000Z", name: "Rohit Soni", phone: "+91-9898989898", email: "rohit@example.com", message: "Could you share the earliest slot for a routine follow-up?", status: "new" },
  { id: "demo-c2", createdAt: "2026-06-03T09:10:00.000Z", name: "Pooja Jain", phone: "+91-9777777777", email: "pooja@example.com", message: "I need directions and parking details before visiting.", status: "new" },
  { id: "demo-c3", createdAt: "2026-06-02T15:20:00.000Z", name: "Amit Kumar", phone: "+91-9100200300", email: "amit@example.com", message: "Is Dr. Parth available for a home visit for my elderly father?", status: "read" },
  { id: "demo-c4", createdAt: "2026-06-04T11:05:00.000Z", name: "Kavita Nair", phone: "+91-9333444555", email: "kavita@example.com", message: "What vaccinations are available at the clinic? Please share the list.", status: "new" },
  { id: "demo-c5", createdAt: "2026-06-01T07:45:00.000Z", name: "Rahul Gupta", phone: "+91-9444555666", email: "rahul@example.com", message: "Thank you for the wonderful treatment. My health has improved a lot!", status: "replied" },
];

const ITEMS_PER_PAGE = 10;

/* ────────────────────────────────────────────
   CSV Helper
   ──────────────────────────────────────────── */
function downloadCSV(rows, headers, filename) {
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((h) => {
        const val = String(row[h] ?? "").replace(/"/g, '""');
        return `"${val}"`;
      }).join(",")
    ),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/* ────────────────────────────────────────────
   Main Component
   ──────────────────────────────────────────── */
export default function AdminDashboard() {
  /* ── Auth State ── */
  const [isAuthenticated, setIsAuthenticated] = useState(IS_PREVIEW_SITE);
  const [loading, setLoading] = useState(!IS_PREVIEW_SITE);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  /* ── Data ── */
  const [data, setData] = useState(
    IS_PREVIEW_SITE
      ? { appointments: demoAppointments, contacts: demoContacts }
      : { appointments: [], contacts: [] }
  );

  /* ── UI State ── */
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  /* ── Appointments Filter/Sort/Page ── */
  const [aptSearch, setAptSearch] = useState("");
  const [aptDateFrom, setAptDateFrom] = useState("");
  const [aptDateTo, setAptDateTo] = useState("");
  const [aptSort, setAptSort] = useState({ key: "preferredDate", dir: "desc" });
  const [aptPage, setAptPage] = useState(1);

  /* ── Contacts Filter/Sort/Page ── */
  const [conSearch, setConSearch] = useState("");
  const [conSort, setConSort] = useState({ key: "createdAt", dir: "desc" });
  const [conPage, setConPage] = useState(1);

  /* ── Delete Modal ── */
  const [deleteModal, setDeleteModal] = useState(null); // { type, id, name }
  const [deleting, setDeleting] = useState(false);

  /* ── Data Fetching ── */
  useEffect(() => {
    if (IS_PREVIEW_SITE) return;
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/admin/data");
      const result = await res.json();
      if (res.status === 401) {
        setIsAuthenticated(false);
      } else if (result.success) {
        setIsAuthenticated(true);
        setData(result.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        await fetchData();
      } else {
        setLoginError(result.error?.message || "Invalid password");
        setLoading(false);
      }
    } catch {
      setLoginError("An error occurred");
      setLoading(false);
    }
  }

  /* ── Toast Helper ── */
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  /* ── Delete Handler ── */
  async function handleDelete() {
    if (!deleteModal) return;
    setDeleting(true);

    if (IS_PREVIEW_SITE) {
      // Demo mode: remove from local state
      setData((prev) => {
        const key = deleteModal.type === "appointment" ? "appointments" : "contacts";
        return { ...prev, [key]: prev[key].filter((item) => item.id !== deleteModal.id) };
      });
      showToast(`${deleteModal.type === "appointment" ? "Patient" : "Contact"} record deleted`);
      setDeleteModal(null);
      setDeleting(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: deleteModal.type, id: deleteModal.id }),
      });
      const result = await res.json();
      if (result.success) {
        setData((prev) => {
          const key = deleteModal.type === "appointment" ? "appointments" : "contacts";
          return { ...prev, [key]: prev[key].filter((item) => item.id !== deleteModal.id) };
        });
        showToast(`${deleteModal.type === "appointment" ? "Patient" : "Contact"} record deleted`);
      } else {
        showToast(result.error?.message || "Delete failed", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setDeleteModal(null);
      setDeleting(false);
    }
  }

  /* ────────────────────────────────────────────
     Filtered & Sorted Appointments
     ──────────────────────────────────────────── */
  const filteredAppointments = useMemo(() => {
    let list = [...data.appointments];

    // Search
    if (aptSearch.trim()) {
      const q = aptSearch.toLowerCase();
      list = list.filter(
        (a) =>
          a.name?.toLowerCase().includes(q) ||
          a.phone?.includes(q) ||
          a.bookingRef?.toLowerCase().includes(q) ||
          a.reason?.toLowerCase().includes(q) ||
          a.email?.toLowerCase().includes(q)
      );
    }

    // Date range
    if (aptDateFrom) list = list.filter((a) => a.preferredDate >= aptDateFrom);
    if (aptDateTo) list = list.filter((a) => a.preferredDate <= aptDateTo);

    // Sort
    list.sort((a, b) => {
      const va = a[aptSort.key] || "";
      const vb = b[aptSort.key] || "";
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return aptSort.dir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [data.appointments, aptSearch, aptDateFrom, aptDateTo, aptSort]);

  const totalAptPages = Math.max(1, Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE));
  const paginatedApts = filteredAppointments.slice((aptPage - 1) * ITEMS_PER_PAGE, aptPage * ITEMS_PER_PAGE);

  /* ────────────────────────────────────────────
     Filtered & Sorted Contacts
     ──────────────────────────────────────────── */
  const filteredContacts = useMemo(() => {
    let list = [...data.contacts];

    if (conSearch.trim()) {
      const q = conSearch.toLowerCase();
      list = list.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.phone?.includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.message?.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      const va = a[conSort.key] || "";
      const vb = b[conSort.key] || "";
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return conSort.dir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [data.contacts, conSearch, conSort]);

  const totalConPages = Math.max(1, Math.ceil(filteredContacts.length / ITEMS_PER_PAGE));
  const paginatedCons = filteredContacts.slice((conPage - 1) * ITEMS_PER_PAGE, conPage * ITEMS_PER_PAGE);

  /* ── Stats ── */
  const today = new Date().toISOString().split("T")[0];
  const todayApts = data.appointments.filter((a) => a.preferredDate === today).length;
  const thisWeekStart = new Date();
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
  const weekStr = thisWeekStart.toISOString().split("T")[0];
  const weekApts = data.appointments.filter((a) => a.preferredDate >= weekStr).length;
  const newContacts = data.contacts.filter((c) => c.status === "new" || !c.status).length;

  /* ── Sort Toggle ── */
  function toggleAptSort(key) {
    setAptSort((prev) => ({
      key,
      dir: prev.key === key && prev.dir === "desc" ? "asc" : "desc",
    }));
    setAptPage(1);
  }
  function toggleConSort(key) {
    setConSort((prev) => ({
      key,
      dir: prev.key === key && prev.dir === "desc" ? "asc" : "desc",
    }));
    setConPage(1);
  }
  function sortIndicator(sortState, key) {
    if (sortState.key !== key) return <span className={s.sortArrow}>↕</span>;
    return <span className={s.sortArrow}>{sortState.dir === "asc" ? "↑" : "↓"}</span>;
  }

  /* ── CSV Download ── */
  function downloadAppointments() {
    downloadCSV(
      filteredAppointments,
      ["name", "age", "phone", "email", "preferredDate", "preferredTimeSlot", "reason", "bookingRef"],
      `appointments_${new Date().toISOString().split("T")[0]}.csv`
    );
    showToast(`${filteredAppointments.length} appointments exported`);
  }
  function downloadContacts() {
    downloadCSV(
      filteredContacts,
      ["name", "phone", "email", "message", "createdAt"],
      `contacts_${new Date().toISOString().split("T")[0]}.csv`
    );
    showToast(`${filteredContacts.length} contacts exported`);
  }

  /* ────────────────────────────────────────────
     RENDER — Loading
     ──────────────────────────────────────────── */
  if (loading) {
    return (
      <div className={s.loadingPage}>
        <div className={s.loadingSpinnerLg} />
        <span>Loading dashboard…</span>
      </div>
    );
  }

  /* ────────────────────────────────────────────
     RENDER — Login
     ──────────────────────────────────────────── */
  if (!isAuthenticated) {
    return (
      <div className={s.loginPage}>
        <div className={s.loginCard}>
          <div className={s.loginLogo}>
            <div className={s.sidebarLogo}>P</div>
            <div className={s.sidebarBrand}>
              <strong>Parth&apos;s Clinic</strong>
              <span>Admin Portal</span>
            </div>
          </div>
          <h1>Welcome back</h1>
          <p>Enter your admin password to access the dashboard.</p>
          <form onSubmit={handleLogin}>
            <div className={s.loginField}>
              <label htmlFor="admin-password">Password</label>
              <div className={s.passwordWrapper}>
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${s.loginInput} ${s.passwordInput}`}
                  placeholder="Enter admin password"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  className={s.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <button type="submit" className={s.loginBtn} disabled={!password}>
              Sign In
            </button>
            {loginError && <div className={s.loginError}>{loginError}</div>}
          </form>
        </div>
      </div>
    );
  }

  /* ────────────────────────────────────────────
     RENDER — Dashboard
     ──────────────────────────────────────────── */
  const tabs = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "appointments", icon: "📋", label: "Appointments" },
    { id: "contacts", icon: "✉️", label: "Messages" },
  ];

  return (
    <div className={s.adminLayout}>
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div className={s.sidebarOverlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`${s.sidebar} ${sidebarOpen ? s.sidebarOpen : ""}`}>
        <div className={s.sidebarHeader}>
          <div className={s.sidebarLogo}>P</div>
          <div className={s.sidebarBrand}>
            <strong>Parth&apos;s Clinic</strong>
            <span>Admin Portal</span>
          </div>
        </div>

        <nav className={s.sidebarNav}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${s.sidebarLink} ${activeTab === tab.id ? s.sidebarLinkActive : ""}`}
              onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
            >
              <span className={s.sidebarIcon}>{tab.icon}</span>
              {tab.label}
              {tab.id === "contacts" && newContacts > 0 && (
                <span className={s.panelBadge} style={{ marginLeft: "auto" }}>{newContacts}</span>
              )}
            </button>
          ))}
        </nav>

        <div className={s.sidebarFooter}>
          {!IS_PREVIEW_SITE && (
            <button
              className={s.logoutBtn}
              onClick={() => {
                document.cookie = "admin_auth=; path=/; max-age=0";
                setIsAuthenticated(false);
                setPassword("");
                setShowPassword(false);
              }}
            >
              <span className={s.sidebarIcon}>🚪</span>
              Log Out
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className={s.mainContent}>
        {/* Preview Banner */}
        {IS_PREVIEW_SITE && (
          <div className={s.previewBanner}>
            ⚠️ Preview mode — showing demo data. Connect your backend for live records.
          </div>
        )}

        {/* Top Bar */}
        <header className={s.topBar}>
          <button className={s.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle menu">
            ☰
          </button>
          <div className={s.topBarTitle}>
            <h1>{tabs.find((t) => t.id === activeTab)?.label || "Dashboard"}</h1>
            <span>{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
          <div className={s.topBarActions}>
            {/* placeholder for future actions */}
          </div>
        </header>

        {/* Content */}
        <div className={s.dashboardContent}>
          {/* ═══════════════════════════════════
             Dashboard Tab
             ═══════════════════════════════════ */}
          {activeTab === "dashboard" && (
            <>
              <div className={s.statsGrid}>
                <div className={`${s.statCard} ${s.statCardTeal} ${s.animateIn}`}>
                  <div className={s.statIcon}>👥</div>
                  <span className={s.statValue}>{data.appointments.length}</span>
                  <span className={s.statLabel}>Total Patients</span>
                </div>
                <div className={`${s.statCard} ${s.statCardOrange} ${s.animateIn}`}>
                  <div className={s.statIcon}>📅</div>
                  <span className={s.statValue}>{todayApts}</span>
                  <span className={s.statLabel}>Today&apos;s Appointments</span>
                </div>
                <div className={`${s.statCard} ${s.statCardBlue} ${s.animateIn}`}>
                  <div className={s.statIcon}>✉️</div>
                  <span className={s.statValue}>{newContacts}</span>
                  <span className={s.statLabel}>Unread Messages</span>
                </div>
                <div className={`${s.statCard} ${s.statCardPurple} ${s.animateIn}`}>
                  <div className={s.statIcon}>📈</div>
                  <span className={s.statValue}>{weekApts}</span>
                  <span className={s.statLabel}>This Week</span>
                </div>
              </div>

              {/* Quick-view: Upcoming appointments */}
              <div className={s.panel}>
                <div className={s.panelHeader}>
                  <div className={s.panelTitle}>
                    <h2>Upcoming Appointments</h2>
                    <span className={s.panelBadge}>{data.appointments.filter((a) => a.preferredDate >= today).length}</span>
                  </div>
                  <button className={`${s.actionBtn} ${s.downloadBtn}`} onClick={() => setActiveTab("appointments")}>
                    View All →
                  </button>
                </div>
                <div className={s.tableWrap}>
                  <table className={`${s.table} ${s.tableDesktop}`}>
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Date & Time</th>
                        <th>Reason</th>
                        <th>Booking Ref</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.appointments
                        .filter((a) => a.preferredDate >= today)
                        .sort((a, b) => a.preferredDate.localeCompare(b.preferredDate))
                        .slice(0, 5)
                        .map((apt) => (
                          <tr key={apt.id}>
                            <td>
                              <span className={s.tableName}>{apt.name}</span>
                              <span className={s.tableSecondary}>Age: {apt.age || "—"}</span>
                            </td>
                            <td>
                              {apt.preferredDate}
                              <span className={s.tableSecondary}>{apt.preferredTimeSlot}</span>
                            </td>
                            <td>{apt.reason}</td>
                            <td><span className={s.tableRef}>{apt.bookingRef}</span></td>
                          </tr>
                        ))}
                      {data.appointments.filter((a) => a.preferredDate >= today).length === 0 && (
                        <tr>
                          <td colSpan="4">
                            <div className={s.emptyState}>
                              <div className={s.emptyIcon}>📅</div>
                              <h3>No upcoming appointments</h3>
                              <p>New bookings will appear here.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {/* Mobile cards for dashboard */}
                  <div className={s.mobileCard}>
                    {data.appointments
                      .filter((a) => a.preferredDate >= today)
                      .sort((a, b) => a.preferredDate.localeCompare(b.preferredDate))
                      .slice(0, 5)
                      .map((apt) => (
                        <div key={apt.id} className={s.mobileCardItem}>
                          <div className={s.mobileCardHeader}>
                            <span className={s.mobileCardName}>{apt.name}</span>
                            <span className={s.tableRef}>{apt.bookingRef}</span>
                          </div>
                          <div className={s.mobileCardGrid}>
                            <div className={s.mobileCardField}>
                              <dt>Date</dt>
                              <dd>{apt.preferredDate}</dd>
                            </div>
                            <div className={s.mobileCardField}>
                              <dt>Time</dt>
                              <dd>{apt.preferredTimeSlot}</dd>
                            </div>
                            <div className={`${s.mobileCardField} ${s.mobileCardMessage}`}>
                              <dt>Reason</dt>
                              <dd>{apt.reason}</dd>
                            </div>
                          </div>
                        </div>
                      ))}
                    {data.appointments.filter((a) => a.preferredDate >= today).length === 0 && (
                      <div className={s.emptyState}>
                        <div className={s.emptyIcon}>📅</div>
                        <h3>No upcoming appointments</h3>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ═══════════════════════════════════
             Appointments Tab
             ═══════════════════════════════════ */}
          {activeTab === "appointments" && (
            <div className={s.panel}>
              <div className={s.panelHeader}>
                <div className={s.panelTitle}>
                  <h2>All Appointments</h2>
                  <span className={s.panelBadge}>{filteredAppointments.length}</span>
                </div>
                <div className={s.panelActions}>
                  <div className={s.searchBar}>
                    <span className={s.searchIcon}>🔍</span>
                    <input
                      id="apt-search"
                      type="text"
                      className={s.searchInput}
                      placeholder="Search name, phone, ref…"
                      value={aptSearch}
                      onChange={(e) => { setAptSearch(e.target.value); setAptPage(1); }}
                    />
                  </div>
                  <div className={s.dateFilter}>
                    <span className={s.dateLabel}>From</span>
                    <input
                      type="date"
                      className={s.dateInput}
                      value={aptDateFrom}
                      onChange={(e) => { setAptDateFrom(e.target.value); setAptPage(1); }}
                    />
                    <span className={s.dateLabel}>To</span>
                    <input
                      type="date"
                      className={s.dateInput}
                      value={aptDateTo}
                      onChange={(e) => { setAptDateTo(e.target.value); setAptPage(1); }}
                    />
                  </div>
                  {(aptSearch || aptDateFrom || aptDateTo) && (
                    <button className={`${s.actionBtn} ${s.clearBtn}`} onClick={() => { setAptSearch(""); setAptDateFrom(""); setAptDateTo(""); setAptPage(1); }}>
                      ✕ Clear
                    </button>
                  )}
                  <button className={`${s.actionBtn} ${s.downloadBtn}`} onClick={downloadAppointments}>
                    ⬇ Download CSV
                  </button>
                </div>
              </div>

              {/* Desktop Table */}
              <div className={s.tableWrap}>
                <table className={`${s.table} ${s.tableDesktop}`}>
                  <thead>
                    <tr>
                      <th className={aptSort.key === "name" ? s.sortActive : ""} onClick={() => toggleAptSort("name")}>
                        Patient {sortIndicator(aptSort, "name")}
                      </th>
                      <th className={aptSort.key === "preferredDate" ? s.sortActive : ""} onClick={() => toggleAptSort("preferredDate")}>
                        Date & Time {sortIndicator(aptSort, "preferredDate")}
                      </th>
                      <th>Phone</th>
                      <th className={aptSort.key === "reason" ? s.sortActive : ""} onClick={() => toggleAptSort("reason")}>
                        Reason {sortIndicator(aptSort, "reason")}
                      </th>
                      <th>Ref</th>
                      <th style={{ width: 50 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedApts.length > 0 ? paginatedApts.map((apt) => (
                      <tr key={apt.id}>
                        <td>
                          <span className={s.tableName}>{apt.name}</span>
                          <span className={s.tableSecondary}>Age: {apt.age || "—"}</span>
                        </td>
                        <td>
                          {apt.preferredDate}
                          <span className={s.tableSecondary}>{apt.preferredTimeSlot}</span>
                        </td>
                        <td>{apt.phone}</td>
                        <td>{apt.reason}</td>
                        <td><span className={s.tableRef}>{apt.bookingRef}</span></td>
                        <td>
                          <button
                            className={s.deleteBtn}
                            title="Delete this record"
                            onClick={() => setDeleteModal({ type: "appointment", id: apt.id, name: apt.name })}
                          >
                            🗑
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="6">
                          <div className={s.emptyState}>
                            <div className={s.emptyIcon}>🔍</div>
                            <h3>No appointments found</h3>
                            <p>Try adjusting your search or date filters.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className={s.mobileCard}>
                {paginatedApts.length > 0 ? paginatedApts.map((apt) => (
                  <div key={apt.id} className={s.mobileCardItem}>
                    <div className={s.mobileCardHeader}>
                      <span className={s.mobileCardName}>{apt.name}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span className={s.tableRef}>{apt.bookingRef}</span>
                        <button
                          className={s.deleteBtn}
                          title="Delete"
                          onClick={() => setDeleteModal({ type: "appointment", id: apt.id, name: apt.name })}
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                    <div className={s.mobileCardGrid}>
                      <div className={s.mobileCardField}><dt>Date</dt><dd>{apt.preferredDate}</dd></div>
                      <div className={s.mobileCardField}><dt>Time</dt><dd>{apt.preferredTimeSlot}</dd></div>
                      <div className={s.mobileCardField}><dt>Phone</dt><dd>{apt.phone}</dd></div>
                      <div className={s.mobileCardField}><dt>Age</dt><dd>{apt.age || "—"}</dd></div>
                      <div className={`${s.mobileCardField} ${s.mobileCardMessage}`}><dt>Reason</dt><dd>{apt.reason}</dd></div>
                    </div>
                  </div>
                )) : (
                  <div className={s.emptyState}>
                    <div className={s.emptyIcon}>🔍</div>
                    <h3>No appointments found</h3>
                    <p>Try adjusting your search or date filters.</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {filteredAppointments.length > ITEMS_PER_PAGE && (
                <div className={s.pagination}>
                  <span className={s.pageInfo}>
                    Showing {(aptPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(aptPage * ITEMS_PER_PAGE, filteredAppointments.length)} of {filteredAppointments.length}
                  </span>
                  <div className={s.pageButtons}>
                    <button className={s.pageBtn} disabled={aptPage <= 1} onClick={() => setAptPage(aptPage - 1)}>←</button>
                    {Array.from({ length: totalAptPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        className={`${s.pageBtn} ${aptPage === p ? s.pageBtnActive : ""}`}
                        onClick={() => setAptPage(p)}
                      >
                        {p}
                      </button>
                    ))}
                    <button className={s.pageBtn} disabled={aptPage >= totalAptPages} onClick={() => setAptPage(aptPage + 1)}>→</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════
             Contacts Tab
             ═══════════════════════════════════ */}
          {activeTab === "contacts" && (
            <div className={s.panel}>
              <div className={s.panelHeader}>
                <div className={s.panelTitle}>
                  <h2>Contact Messages</h2>
                  <span className={s.panelBadge}>{filteredContacts.length}</span>
                </div>
                <div className={s.panelActions}>
                  <div className={s.searchBar}>
                    <span className={s.searchIcon}>🔍</span>
                    <input
                      id="con-search"
                      type="text"
                      className={s.searchInput}
                      placeholder="Search name, email, message…"
                      value={conSearch}
                      onChange={(e) => { setConSearch(e.target.value); setConPage(1); }}
                    />
                  </div>
                  {conSearch && (
                    <button className={`${s.actionBtn} ${s.clearBtn}`} onClick={() => { setConSearch(""); setConPage(1); }}>
                      ✕ Clear
                    </button>
                  )}
                  <button className={`${s.actionBtn} ${s.downloadBtn}`} onClick={downloadContacts}>
                    ⬇ Download CSV
                  </button>
                </div>
              </div>

              {/* Desktop Table */}
              <div className={s.tableWrap}>
                <table className={`${s.table} ${s.tableDesktop}`}>
                  <thead>
                    <tr>
                      <th className={conSort.key === "createdAt" ? s.sortActive : ""} onClick={() => toggleConSort("createdAt")}>
                        Date {sortIndicator(conSort, "createdAt")}
                      </th>
                      <th className={conSort.key === "name" ? s.sortActive : ""} onClick={() => toggleConSort("name")}>
                        Name {sortIndicator(conSort, "name")}
                      </th>
                      <th>Contact</th>
                      <th>Message</th>
                      <th>Status</th>
                      <th style={{ width: 50 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCons.length > 0 ? paginatedCons.map((c) => (
                      <tr key={c.id}>
                        <td>
                          {new Date(c.createdAt).toLocaleDateString("en-IN")}
                          <span className={s.tableSecondary}>
                            {new Date(c.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </td>
                        <td><span className={s.tableName}>{c.name}</span></td>
                        <td>
                          {c.phone}
                          <span className={s.tableSecondary}>{c.email}</span>
                        </td>
                        <td style={{ maxWidth: 300 }}>{c.message}</td>
                        <td>
                          <span className={`${s.tableTag} ${c.status === "replied" ? s.tagReplied : c.status === "read" ? s.tagRead : s.tagNew}`}>
                            {c.status === "replied" ? "Replied" : c.status === "read" ? "Read" : "New"}
                          </span>
                        </td>
                        <td>
                          <button
                            className={s.deleteBtn}
                            title="Delete this message"
                            onClick={() => setDeleteModal({ type: "contact", id: c.id, name: c.name })}
                          >
                            🗑
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="6">
                          <div className={s.emptyState}>
                            <div className={s.emptyIcon}>✉️</div>
                            <h3>No messages found</h3>
                            <p>Contact form submissions will appear here.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className={s.mobileCard}>
                {paginatedCons.length > 0 ? paginatedCons.map((c) => (
                  <div key={c.id} className={s.mobileCardItem}>
                    <div className={s.mobileCardHeader}>
                      <div>
                        <span className={s.mobileCardName}>{c.name}</span>
                        <span className={`${s.tableTag} ${c.status === "replied" ? s.tagReplied : c.status === "read" ? s.tagRead : s.tagNew}`} style={{ marginLeft: "0.5rem" }}>
                          {c.status === "replied" ? "Replied" : c.status === "read" ? "Read" : "New"}
                        </span>
                      </div>
                      <button
                        className={s.deleteBtn}
                        title="Delete"
                        onClick={() => setDeleteModal({ type: "contact", id: c.id, name: c.name })}
                      >
                        🗑
                      </button>
                    </div>
                    <div className={s.mobileCardGrid}>
                      <div className={s.mobileCardField}><dt>Date</dt><dd>{new Date(c.createdAt).toLocaleDateString("en-IN")}</dd></div>
                      <div className={s.mobileCardField}><dt>Phone</dt><dd>{c.phone}</dd></div>
                      <div className={s.mobileCardField}><dt>Email</dt><dd>{c.email}</dd></div>
                      <div className={`${s.mobileCardField} ${s.mobileCardMessage}`}><dt>Message</dt><dd>{c.message}</dd></div>
                    </div>
                  </div>
                )) : (
                  <div className={s.emptyState}>
                    <div className={s.emptyIcon}>✉️</div>
                    <h3>No messages found</h3>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {filteredContacts.length > ITEMS_PER_PAGE && (
                <div className={s.pagination}>
                  <span className={s.pageInfo}>
                    Showing {(conPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(conPage * ITEMS_PER_PAGE, filteredContacts.length)} of {filteredContacts.length}
                  </span>
                  <div className={s.pageButtons}>
                    <button className={s.pageBtn} disabled={conPage <= 1} onClick={() => setConPage(conPage - 1)}>←</button>
                    {Array.from({ length: totalConPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        className={`${s.pageBtn} ${conPage === p ? s.pageBtnActive : ""}`}
                        onClick={() => setConPage(p)}
                      >
                        {p}
                      </button>
                    ))}
                    <button className={s.pageBtn} disabled={conPage >= totalConPages} onClick={() => setConPage(conPage + 1)}>→</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ═══════════════════════════════════
         Delete Confirmation Modal
         ═══════════════════════════════════ */}
      {deleteModal && (
        <div className={s.modalOverlay} onClick={() => !deleting && setDeleteModal(null)}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <div className={s.modalIcon}>⚠️</div>
              <h3>Delete Record</h3>
            </div>
            <div className={s.modalBody}>
              <p>
                Are you sure you want to delete the record for <strong>{deleteModal.name}</strong>?
                This action cannot be undone.
              </p>
            </div>
            <div className={s.modalActions}>
              <button className={s.modalCancel} onClick={() => setDeleteModal(null)} disabled={deleting}>
                Cancel
              </button>
              <button className={s.modalDelete} onClick={handleDelete} disabled={deleting}>
                {deleting ? <span className={s.spinner} /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════
         Toast Notification
         ═══════════════════════════════════ */}
      {toast && (
        <div className={`${s.toast} ${toast.type === "error" ? s.toastError : s.toastSuccess}`}>
          {toast.type === "error" ? "✕" : "✓"} {toast.message}
        </div>
      )}
    </div>
  );
}
