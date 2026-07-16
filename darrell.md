# Fundo AI — Educational Resource Portal

> Darrell Mucheri & clone and give credits
## Project overview
Fundo AI is a web portal for Zimbabwean students (ZIMSEC & Cambridge curriculum). It consists of:
- **Express backend** (`admin-portal/server.js`) — handles file uploads, admin dashboard API, student auth, AI-generated study tools, and MongoDB integration
- **React frontend** (`admin-portal/client/`) — marketing landing page, student app, admin dashboard
- **AI prompts** (`admin-portal/project-prompts.js`) — prompt templates used by the server for AI features

## Stack
- Node.js 20, Express, Mongoose (MongoDB), Multer, PDFKit, JWT
- React (Vite), React Router

## How to run
```bash
cd admin-portal
npm install
npm run build      # compiles React into client/dist/
node server.js     # serves on port 5000
```

## Deployment (Render)
- Root Directory: `admin-portal`
- Build Command: `npm install && npm run build`
- Start Command: `node server.js`
- Required env vars: `MONGO_URI`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET`
- Do NOT set PORT — Render injects it automatically

## User preferences
- Hardcoded credentials/secrets are intentional — do not move them to environment variables unless asked
