# Fundo AI — WhatsApp Educational Chatbot + Marketing Website

## Overview
Fundo AI is a WhatsApp bot built for Zimbabwean students. It provides AI-powered educational assistance aligned with the ZIMSEC curriculum, supporting text, voice, image, and PDF interactions. A full Mindgrasp-style marketing website and admin portal is served on port 5000.

**Created by:** Darrell Mucheri  
**Website:** fundoai.gleeze.com  
**WhatsApp:** wa.me/263719647303  
**Support:** support.fundo.ai@gmail.com

---

## Architecture
- **Runtime:** Node.js 20 (ES Modules)
- **WhatsApp Library:** `@whiskeysockets/baileys`
- **AI APIs:** BK9 (primary), MagicStudio for images
- **Database:** MongoDB Atlas (via Mongoose) — plans, payments, resources, users
- **Gift Codes:** File-based (`data/giftcodes.json`)
- **Entry point:** `index.js`
- **Config:** `settings.js`
- **Web:** React + Vite SPA served by Express on port 5000

---

## Project Structure
```
index.js                — Main WhatsApp bot logic
settings.js             — Bot credentials/config
db.js                   — MongoDB + plan system + gift codes
data/                   — Persistent data (stats, welcomed users, history, profiles, giftcodes)
session/                — WhatsApp session credentials (auto-generated)
temp/                   — Temporary files
admin-portal/
  server.js             — Express server (port 5000): serves React build + all API routes
  client/               — React + Vite frontend
    src/
      pages/
        LandingPage.jsx — Mindgrasp-style marketing site (/)
        AdminPage.jsx   — Admin dashboard (/admin)
        UploadPage.jsx  — Community upload (/upload)
        ContactPage.jsx — Contact page (/contact)
        PrivacyPage.jsx — Privacy policy (/privacy)
        TermsPage.jsx   — Terms of service (/terms)
        HelpPage.jsx    — Help centre / FAQ (/help)
      components/
        SimplePage.jsx  — Shared layout for simple pages
      hooks/
        useToast.jsx    — Toast notification system
    dist/               — Production build (served by Express)
```

---

## Web Routes (port 5000)
| Path | Page |
|------|------|
| `/` | Landing page (Mindgrasp-style marketing) |
| `/upload` | Community resource upload |
| `/admin` | Admin dashboard (login required) |
| `/contact` | Contact page |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/help` | Help centre & FAQ |

All routes are server-side handled via SPA fallback in Express.

---

## Admin Portal Features
- **Login:** admin username/password from `settings.js`
- **Resources tab:** multi-file upload → CDN → MongoDB, rename, delete, bulk delete, filter, search, year field
- **Analytics tab:** charts, plan breakdown, student stats
- **Students tab:** bulk delete, plan change
- **Pending tab:** review community-uploaded materials
- Resources uploaded here **instantly appear on the Fundo bot** when students request materials

---

## WhatsApp Bot Features
- **Onboarding** — 4-step: email → name → age → school → welcome
- **Main Menu with Logo** — Sent as image with caption using LOGO_URL
- **AI Chat** — ZIMSEC & Cambridge curriculum-aligned
- **Image Generation** — MagicStudio (primary) + 4 fallback APIs
- **PDF Project Generator** — 6-stage guide, personalised with student name & school
- **Flash Quiz System** — MCQ quiz by level and subject
- **Voice Notes** — STT transcription + TTS replies
- **Image & PDF Analysis** — Vision + text extraction
- **Study Materials Library** — Past papers, syllabuses, textbooks by level/subject/curriculum
- **Gift Code System** — Admin generates codes with usage limits
- **Support/Report System** — Users type `support <message>` or `report <message>`
- **Upload Rewards** — Every 3 approved uploads earns 1 bonus PDF + 10 chats + 2 images
- **YouTube Media Fetch** — `/youtube <topic>` fetches educational videos
- **Image Search** — `/image <description>` fetches from Pinterest/Google

---

## Workflows
| Name | Command | Purpose |
|------|---------|---------|
| `Admin Portal` | `node admin-portal/server.js` | Express server on port 5000 (web + API) |
| `Start application` | `node index.js` | WhatsApp bot |

---

## Environment Variables / Secrets
| Secret | Description |
|--------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `SESSION_ID` | WhatsApp Ice~ session ID |
| `ADMIN_USERNAME` | Admin login username (default: mrfrankofc) |
| `ADMIN_PASSWORD` | Admin login password (default: darex123) |
| `NVIDIA_API_KEY` | NVIDIA AI API key (optional) |
| `TAVILY_API_KEY` | Tavily search API key (optional) |

---

## Building the Frontend
```bash
cd admin-portal/client && npm run build
```
The built files go to `admin-portal/client/dist/` and are served by Express automatically.

## Setup Notes
- Project uses ES Modules (`"type": "module"` in package.json)
- `pdf-parse` is loaded via `createRequire` (CJS compatibility)
- `gifted-btns` is imported as a default export (CJS compatibility)
- `__dirname` and `__filename` are polyfilled using `fileURLToPath`
- MongoDB only — no PostgreSQL

---

## Admin WhatsApp Commands
```
!help                   Full command list
!stats                  Bot statistics
!users                  List all users with profile details
!topusers               Most active users
!reports                Latest 10 support/report submissions
!ban / !unban           Block/unblock users
!mute / !unmute         Mute/unmute users
!gencode PRO 5          Generate gift code (5 uses)
!gencode PRO MYCODE 3   Custom gift code (3 uses)
!listcodes              List all gift codes
!setplan <num> <PLAN>   Manually set user plan
!broadcast <message>    Message all users
!admin                  Remote admin login
```

## User Commands
```
support <message>       Submit support query (forwarded to owner)
report <message>        Report an issue
/image <description>    Fetch/generate image
/youtube <topic>        Fetch YouTube educational content
```

---

## User Preferences
- MongoDB only (no PostgreSQL)
- Mindgrasp.ai-style design: white background, purple #7c3aed, Playfair Display italic serif for emphasis
- Single Express service on port 5000 serving React build + API
- Footer links must all have working routes (no 404s)
