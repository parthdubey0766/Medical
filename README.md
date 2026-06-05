# Parth's Medical Clinic — parth06.app

Production-ready medical clinic website built with **Next.js 16** (App Router), **Firebase**, and **Vercel**.

Live at: **https://parth06.app**

---

## 🚀 Deploy to Vercel (3 Steps)

### Step 1: Push to GitHub

Push this repo to GitHub (public or private):

```bash
git add .
git commit -m "Production ready"
git remote add origin https://github.com/YOUR_USERNAME/dr-sharma-clinic.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"** → select your repo
3. Vercel auto-detects Next.js — just click **Deploy**
4. After first deploy, go to **Project Settings → Domains** → add `parth06.app`

### Step 3: Add Environment Variables

Go to **Project Settings → Environment Variables** in Vercel and add these:

| Variable | Value | Required |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://parth06.app` | ✅ |
| `ADMIN_PASSWORD` | Your strong admin password | ✅ |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | From Firebase Console | ✅ |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | From Firebase Console | ✅ |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | From Firebase Console | ✅ |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | From Firebase Console | ✅ |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | From Firebase Console | ✅ |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | From Firebase Console | ✅ |
| `FIREBASE_ADMIN_PROJECT_ID` | From service account JSON | ✅ |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | From service account JSON | ✅ |
| `FIREBASE_ADMIN_PRIVATE_KEY` | From service account JSON (paste as-is) | ✅ |
| `RESEND_API_KEY` | From [resend.com](https://resend.com) | ✅ |
| `RESEND_FROM_EMAIL` | `noreply@parth06.app` | ✅ |
| `NEXT_PUBLIC_CLINIC_PHONE` | `+91-9876543210` | ✅ |
| `NEXT_PUBLIC_CLINIC_EMAIL` | `clinic@parth06.app` | ✅ |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `919876543210` | ✅ |
| `TWILIO_ACCOUNT_SID` | From Twilio | Optional |
| `TWILIO_AUTH_TOKEN` | From Twilio | Optional |
| `TWILIO_PHONE_NUMBER` | From Twilio | Optional |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | From Google reCAPTCHA | Optional |
| `RECAPTCHA_SECRET_KEY` | From Google reCAPTCHA | Optional |

> **Important:** Do NOT set `USE_MOCK_DATA` in Vercel — it defaults to `false` (uses real Firebase).

After adding variables, click **Redeploy** from the Deployments tab.

That's it! Every future `git push` to `main` auto-deploys.

---

## 🔧 Local Development

```bash
npm install
npm run dev        # → http://localhost:3000
```

The app runs in **mock mode** by default (`.env.local` has `USE_MOCK_DATA=true`), so you don't need real Firebase credentials for local dev.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.js              # Home page
│   ├── about/               # Doctor profile
│   ├── services/            # Medical services
│   ├── book/                # Appointment booking
│   ├── contact/             # Contact form + map
│   ├── gallery/             # Clinic tour photos
│   ├── privacy/             # DPDP data request form
│   ├── admin/               # Admin dashboard (password-protected)
│   ├── api/                 # API routes (book, contact, slots, admin)
│   ├── sitemap.js           # Auto-generated sitemap
│   ├── robots.js            # Auto-generated robots.txt
│   └── layout.js            # Root layout with SEO metadata
├── components/              # Reusable UI components
└── lib/
    ├── firebase.js          # Client SDK
    ├── firebaseAdmin.js     # Admin SDK (server-only)
    ├── adminAuth.js         # Signed cookie auth
    ├── rateLimit.js         # Rate limiting
    ├── validation.js        # Zod schemas
    ├── sanitize.js          # Input sanitization
    ├── apiResponse.js       # Standardized API responses
    └── services/            # Business logic (appointments, contacts, etc.)
```

---

## 🔒 Security Features

- **Signed admin cookies** (HMAC-SHA256) — no plain-text auth tokens
- **Timing-safe password comparison** — prevents timing attacks
- **Rate limiting** on all API endpoints (brute-force protection on admin login)
- **Input validation** with Zod schemas
- **Input sanitization** (HTML stripping, phone normalization)
- **Security headers** (HSTS, CSP, X-Frame-Options, etc.)
- **Firestore rules** — all writes go through server-side Admin SDK
- **DPDP Act compliance** — consent logging, data access/erasure endpoints

---

## 📋 Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Run production server locally |
| `npm run lint` | Run ESLint |

---

## 🌐 Domain Setup (parth06.app)

In Vercel **Project Settings → Domains**:
1. Add `parth06.app`
2. Vercel will show DNS records to add at your domain registrar
3. Add the `A` and/or `CNAME` records as shown
4. SSL certificate is automatic

---

## 📄 GitHub Pages Preview

A static preview (with demo data) can also deploy to GitHub Pages for demo purposes. See `.github/workflows/deploy-pages.yml`.
