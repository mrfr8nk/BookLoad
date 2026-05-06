# Fundo AI — WhatsApp Educational Chatbot

## Overview
Fundo AI is a WhatsApp bot built for Zimbabwean students. It provides AI-powered educational assistance aligned with the ZIMSEC curriculum, supporting text, voice, image, and PDF interactions.

**Created by:** Darrell Mucheri  
**Website:** fundoai.gleeze.com

## Architecture
- **Runtime:** Node.js 20 (ES Modules)
- **WhatsApp Library:** `@whiskeysockets/baileys`
- **AI APIs:** BK9 (primary), MagicStudio for images
- **Database:** MongoDB (via Mongoose) for plan/payment system
- **Gift Codes:** File-based (`data/giftcodes.json`)
- **Entry point:** `index.js`
- **Config:** `settings.js`

## Project Structure
```
index.js          — Main bot logic (3400+ lines)
settings.js       — Bot credentials/config
db.js             — MongoDB + plan system + gift codes
data/             — Persistent data (stats, welcomed users, history, profiles, giftcodes)
session/          — WhatsApp session credentials (auto-generated)
temp/             — Temporary files
admin-portal/     — Web resource upload portal (port 5000)
  server.js       — Express API (auth, upload to CDN, CRUD on MongoDB)
  public/         — Glassmorphism frontend (login, upload, manage)
```

## Admin Portal (Resource Upload Web App)
- **URL:** port 5000 (webview) — workflow: `Admin Portal`
- **Login:** admin username/password from `settings.js`
- **Features:** multi-file upload → CDN → MongoDB, rename, delete, bulk delete, filter, search, year field for past papers
- **Resources uploaded here instantly appear on the Fundo bot** when students request materials

## Key Features
- **First-Time Onboarding** — 4 steps: email → name → age → school name → welcome
- **Main Menu with Logo** — Menu is sent as image with caption using LOGO_URL from settings.js
- **AI Chat** — ZIMSEC & Cambridge curriculum-aligned (normal + quick mode)
- **Image Generation** — MagicStudio (primary) + 4 fallback APIs; 100+ prompt styles
- **PDF Project Generator** — 6-stage guide (50 marks); personalised with student name & school name from profile; 24-hour restriction for new FREE plan users
- **Flash Quiz System** — MCQ quiz by level and subject
- **Voice Notes** — STT transcription + TTS replies
- **Image & PDF Analysis** — Vision + text extraction
- **Owner/Admin Commands** — Full moderation & monitoring with user profile details (name/email/age/school) + MongoDB signup dates
- **Admin Login** — Any number can login with username/password from settings.js
- **Gift Code System** — Admin generates codes with usage limits (`!gencode PRO 5`), users redeem them; per-user duplicate prevention
- **Support/Report System** — Users type `support <message>` or `report <message>`; reports are saved to `data/reports.json` and forwarded to owner; admin views with `!reports`
- **Bot Self-Reply Prevention** — Bot number filtered from message processing to prevent loop
- **Usage Limits + Cooldown Timers** — Dynamic countdown on limit messages
- **Global Cancel** — "cancel", "stop", "exit" works everywhere including support flow
- **Study Materials Library** — Syllabuses, past papers & textbooks: browse by level/subject/curriculum (ZIMSEC or Cambridge), files sent directly to user (no URL links)
- **Bulk Upload Support** — After each upload, user prompted yes/new/done for multi-file sessions in one flow
- **Upload Rewards System** — Every 3 approved uploads earns: 1 bonus PDF + 10 bonus chats + 2 bonus images
- **Media Download Limits** — Free users: 10 downloads/day; paid plans: unlimited
- **Extra Credits** — extraMessages & extraImages fields allow overflow access beyond plan limits (earned from uploads)

## Support & Community
- **Support Email:** support.fundo.ai@gmail.com
- **WhatsApp Channel:** https://whatsapp.com/channel/0029VbCigmv96H4JhJDwsd0X

## Configuration (settings.js)
Set these environment variables or edit `settings.js`:
- `SESSION_ID` — Ice~ session ID from https://sessions.subzero.gleeze.com
- `BOT_NUMBER` — WhatsApp bot number with country code
- `OWNER_NUMBER` — Owner/master WhatsApp number
- `ADMIN_USERNAME` — Admin login username (default: mrfrankofc)
- `ADMIN_PASSWORD` — Admin login password (default: darex123)
- `LOGO_URL` — Bot logo URL

## Secrets (stored in Replit Secrets)
- `MONGO_URI` — MongoDB connection string
- `PAYNOW_ID` / `PAYNOW_KEY` — EcoCash payment integration (optional)

## Setup Notes
- Project uses ES Modules (`"type": "module"` in package.json)
- `pdf-parse` is loaded via `createRequire` (CJS compatibility)
- `gifted-btns` is imported as a default export (CJS compatibility)
- `__dirname` and `__filename` are polyfilled using `fileURLToPath`

## Workflow
- **Start application** — runs `node index.js` (console output type)

## Admin Commands (via WhatsApp)
- `!help` — Full command list
- `!stats`, `!users`, `!topusers`, `!activeusers`, `!groups` — Monitoring
- `!users` — Lists users with phone, name, email, age, school, plan, and MongoDB signup date
- `!reports` — View latest 10 support/report submissions
- `!ban`/`!unban` — Block users
- `!mute`/`!unmute`, `!botoff`/`!boton` — Bot control
- `!gencode PRO` — Generate gift code (1 use)
- `!gencode PRO 5` — Generate gift code usable by 5 people
- `!gencode PRO MYCODE 3` — Custom code usable 3 times
- `!listcodes` — List all gift codes with usage counts
- `!setplan <number> <PLAN>` — Manually set user plan
- `!broadcast <message>` — Message all users
- `!admin` — Remote admin login (any number)

## User Support Commands
- `support <message>` — Submit a support query (forwarded to owner + saved)
- `report <message>` — Report an issue (same as support)
- `support` — Starts interactive support flow
