# Dr Sharma Clinic Website

Modern clinic website built with Next.js for showcasing services, handling contact requests, and appointment booking flow.

## Tech Stack

- Next.js (App Router)
- React
- Firebase (client/admin integration in `src/lib`)

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

- Copy `.env.local.example` to `.env.local`
- Fill your local values
- Never commit `.env.local` (already ignored by `.gitignore`)

3. Start development server:

```bash
npm run dev
```

4. Open `http://localhost:3000`

## Available Scripts

- `npm run dev` - start development server
- `npm run build` - create production build
- `npm run start` - run production server
- `npm run lint` - run lint checks

## Project Structure

- `src/app` - pages and API routes
- `src/components` - reusable UI components
- `src/lib` - utilities, validation, Firebase config, and services
- `public` - static assets and images

## Security Notes

- Secret files are ignored through `.gitignore` (`.env*`)
- Do not store passwords, private keys, or API secrets in tracked files

## Git Setup

After creating your remote repository on GitHub/GitLab:

```bash
git remote add origin <your-repo-url>
git branch -M main
git push -u origin main
```
