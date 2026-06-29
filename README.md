# AI Resume Analyzer — Frontend

React 18 + Vite frontend for the AI Resume Analyzer. Users register with
email, password, and profession; log in; then upload a resume PDF against a
job description on a split-panel homepage that shows an ATS score ring, a
section-by-section health review, keyword gaps, bullet rewrites, and a
**Regenerate Resume** button that produces a downloadable PDF.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 + Vite 5 |
| Routing | React Router v6 |
| File upload | react-dropzone |
| Icons | lucide-react |
| Styling | CSS Modules + CSS custom properties |
| Fonts | Plus Jakarta Sans (display) · Inter (body) |
| Auth | JWT stored in `localStorage`, loaded on mount via `/auth/me` |

---

## Project Structure

```
src/
├── api/
│   └── client.js              # All API calls (authApi + resumeApi)
│
├── context/
│   └── AuthContext.jsx        # Global auth state + login/register/logout
│
├── components/
│   ├── auth/
│   │   ├── AuthPages.jsx      # RegisterPage + LoginPage (shared shell)
│   │   └── AuthPages.module.css
│   │
│   ├── layout/
│   │   ├── Navbar.jsx         # Sticky top bar — brand, user chip, logout
│   │   └── Navbar.module.css
│   │
│   ├── resume/
│   │   ├── Dropzone.jsx           # PDF drag-and-drop upload zone
│   │   ├── ScoreRing.jsx          # Animated SVG ATS score ring (counts up)
│   │   ├── SectionHealth.jsx      # ★ Per-section health bars (the key feature)
│   │   ├── Keywords.jsx           # Matched + missing keyword chips
│   │   ├── BulletRewrites.jsx     # Before/after bullet comparison grid
│   │   ├── StrengthsWeaknesses.jsx# Two-column strengths vs improvements
│   │   └── RegenModal.jsx         # Modal: generate + preview + download PDF
│   │
│   └── ui/
│       ├── UI.jsx             # Button, Input, Textarea, Alert, Spinner, Badge
│       └── UI.module.css
│
├── pages/
│   └── HomePage.jsx           # Left (upload) + Right (results) split layout
│
├── App.jsx                    # Router + GuestOnly + Protected route guards
├── App.module.css
├── main.jsx
└── index.css                  # Design tokens (:root) + global reset
```

---

## Pages & Flow

```
/register  →  email + password + profession  →  auto-login  →  /
/login     →  email + password               →  /
/          →  Left: upload PDF + job desc    →  Right: full analysis + Regen button
```

### Key result panels (right side of homepage)

1. **ATS Score Ring** — SVG circle that animates from 0 to the score on load,
   colour-coded green / amber / red, with seniority level tag.
2. **Section Health Bars** — every section found in the resume (Summary, Work
   Experience, Skills, Education, Projects …) gets a score bar and a one-line
   comment. Missing sections appear as 0 / red.
3. **Strengths & Areas to Improve** — two columns, three items each.
4. **Matched / Missing Keywords** — green and rose chip lists from the JD comparison.
5. **Bullet Rewrites** — before/after grid showing original weak bullets vs
   AI-rewritten versions with metrics and strong verbs.
6. **Top Recommendations** — three numbered tips on amber background.
7. **Regenerate Resume CTA** — opens a modal that calls `/resume/regenerate`,
   renders the HTML in an iframe, and triggers the browser print dialog
   (`window.print()`) for "Save as PDF".

---

## Quick Start

```bash
# 1. Install
npm install

# 2. Copy env (only needed for production)
cp .env.example .env

# 3. Start (requires the FastAPI backend on :8000)
npm run dev
```

Open **http://localhost:5173** — Vite proxies `/api/*` to `http://localhost:8000`.

---

## Deploying

### Vercel (recommended)

1. Push to GitHub.
2. Import repo in Vercel.
3. Set environment variable `VITE_API_BASE_URL` = your Render backend URL.
4. Build command: `npm run build` · Output: `dist`.
5. Vercel handles SPA routing automatically.

### Netlify

Same as Vercel, plus add a `public/_redirects` file:

```
/* /index.html 200
```

---

## Backend connection

All requests go through `src/api/client.js`. The base URL is:

- **Dev**: empty string (Vite proxy handles `/api/*`)  
- **Prod**: `VITE_API_BASE_URL` env var (e.g. `https://ai-resume-analyzer-api.onrender.com`)

Every protected request sends `Authorization: Bearer <token>` from
`localStorage`. The `AuthProvider` reads and validates this token on mount via
`GET /auth/me`.
