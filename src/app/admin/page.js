"use client";

import { useState, useEffect } from "react";
import styles from "@/components/site.module.css";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  const [data, setData] = useState({ appointments: [], contacts: [] });

  useEffect(() => {
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
    } catch (err) {
      setLoginError("An error occurred");
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className={styles.pageMain}>
        <div style={{ padding: "4rem 2rem", textAlign: "center" }}>Loading...</div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className={styles.pageMain}>
        <section className={styles.pageHero}>
          <div className={styles.pageHeroInner}>
            <h1>Admin Login</h1>
            <p>Please log in to view the dashboard.</p>
          </div>
        </section>
        <section className={styles.section}>
          <div className={styles.sectionInner} style={{ maxWidth: "400px", margin: "0 auto" }}>
            <form onSubmit={handleLogin} className={styles.form}>
              <div className={styles.field}>
                <label>Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              {loginError && <p style={{ color: "red", fontSize: "0.9rem" }}>{loginError}</p>}
              <button type="submit" className={styles.button}>Login</button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.pageMain}>
      <section className={styles.pageHero} style={{ padding: "3rem 1rem" }}>
        <div className={styles.pageHeroInner}>
          <h1>Admin Dashboard</h1>
          <p>Manage your appointments and contact requests.</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner} style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2>Appointments ({data.appointments.length})</h2>
          <div style={{ overflowX: "auto", marginBottom: "3rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#f3f4f6", textAlign: "left" }}>
                  <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>Date & Time</th>
                  <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>Patient Name</th>
                  <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>Phone</th>
                  <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>Reason</th>
                  <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>Ref</th>
                </tr>
              </thead>
              <tbody>
                {data.appointments.length > 0 ? data.appointments.map((apt) => (
                  <tr key={apt.id}>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>
                      {apt.preferredDate} <br />
                      <small style={{ color: "#6b7280" }}>{apt.preferredTimeSlot}</small>
                    </td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>
                      {apt.name} <br/>
                      {apt.age && <small style={{ color: "#6b7280" }}>Age: {apt.age}</small>}
                    </td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>{apt.phone}</td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>{apt.reason}</td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>{apt.bookingRef}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{ padding: "1rem", textAlign: "center", color: "#6b7280" }}>No appointments found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <h2>Contact Messages ({data.contacts.length})</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#f3f4f6", textAlign: "left" }}>
                  <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>Date</th>
                  <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>Name</th>
                  <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>Contact Info</th>
                  <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>Message</th>
                </tr>
              </thead>
              <tbody>
                {data.contacts.length > 0 ? data.contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb", verticalAlign: "top" }}>
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb", verticalAlign: "top" }}>{contact.name}</td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb", verticalAlign: "top" }}>
                      {contact.phone}<br/>
                      <small style={{ color: "#6b7280" }}>{contact.email}</small>
                    </td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb", verticalAlign: "top", maxWidth: "300px" }}>
                      {contact.message}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" style={{ padding: "1rem", textAlign: "center", color: "#6b7280" }}>No messages found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
