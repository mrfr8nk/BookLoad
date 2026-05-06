# Fundo AI — WhatsApp Educational Chatbot & Resource Portal

**Created by Darrell Mucheri**
Built for Zimbabwean students — ZIMSEC & Cambridge curriculum support via WhatsApp AI.

---

## What's Included

| Component | Description |
|---|---|
| `index.js` | WhatsApp bot (AI chat, quizzes, PDF generator, voice notes) |
| `admin-portal/` | Web portal for uploading study resources to the bot |
| `db.js` | MongoDB models (users, plans, materials, payments) |
| `settings.js` | Bot configuration (credentials, bot number, owner) |

---

## Deploying the Admin Resource Portal

The admin portal (`admin-portal/`) is a standalone Express web app.
It connects to your MongoDB and CDN — no WhatsApp connection needed.

### Option A — Deploy on Render (Recommended, Free Tier)

1. Go to [render.com](https://render.com) and create a free account
2. Click **New → Web Service**
3. Connect your GitHub repo
4. Set the following:

| Field | Value |
|---|---|
| **Name** | `fundo-admin-portal` |
| **Root Directory** | `admin-portal` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Instance Type** | Free |

5. Add these **Environment Variables** in Render:

| Key | Value |
|---|---|
| `MONGO_URI` | Your MongoDB connection string |
| `ADMIN_USERNAME` | Your admin username (default: `mrfrankofc`) |
| `ADMIN_PASSWORD` | Your admin password |
| `PORTAL_PORT` | `10000` *(Render uses port 10000 by default)* |

6. Click **Deploy** — your portal will be live at `https://fundo-admin-portal.onrender.com`

---

### Option B — Deploy on Vercel

> Note: Vercel is designed for serverless — Express apps work but need an adapter.

1. Install Vercel CLI: `npm i -g vercel`
2. Inside `admin-portal/`, create a `vercel.json`:

```json
{
  "version": 2,
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "server.js" }]
}
```

3. Run `vercel` in the `admin-portal/` folder and follow the prompts
4. Add your environment variables via the Vercel dashboard under **Project → Settings → Environment Variables**

---

### Option C — Keep on Replit (Easiest)

The portal is already running on Replit at port 5000.
To make it always available (no sleep):
- Go to your Replit project → **Deployments** tab → **Autoscale** or **Reserved VM**
- This keeps both the bot and portal running 24/7

---

## Environment Variables Reference

| Variable | Description | Default |
|---|---|---|
| `MONGO_URI` | MongoDB connection string | hardcoded fallback |
| `ADMIN_USERNAME` | Portal login username | `mrfrankofc` |
| `ADMIN_PASSWORD` | Portal login password | `darex@123` |
| `PORTAL_PORT` | Port for admin portal | `5000` |
| `SESSION_ID` | WhatsApp session ID (bot only) | — |
| `BOT_NUMBER` | WhatsApp bot number (bot only) | `263776046121` |
| `OWNER_NUMBER` | Owner WhatsApp number (bot only) | `263719647303` |
| `PAYNOW_ID` | EcoCash Paynow integration ID (optional) | — |
| `PAYNOW_KEY` | EcoCash Paynow integration key (optional) | — |

---

## Admin Portal — How to Use

1. Open the portal URL and sign in with your admin credentials
2. **Upload resources**: drag & drop files (PDF, DOC, DOCX, images) into the left panel
3. Select the correct **Category**, **Level**, **Grade**, and **Subject** from the dropdowns
4. Add a **Year** for past papers and marking schemes
5. Rename each file's display title before uploading (optional)
6. Click **Upload Files** — each file uploads individually with a progress bar
7. Resources appear **immediately** on the Fundo AI bot when students request them

---

## WhatsApp Bot Setup

1. Get a session ID from [sessions.subzero.gleeze.com](https://sessions.subzero.gleeze.com)
2. Set `SESSION_ID` in `settings.js` or as an environment variable
3. Run: `node index.js`

---

## Credits

**Darrell Mucheri** — Developer & Creator
- Website: [fundoai.gleeze.com](http://fundoai.gleeze.com)
- Support: support.fundo.ai@gmail.com
- WhatsApp Channel: [Join here](https://whatsapp.com/channel/0029VbCigmv96H4JhJDwsd0X)

---

*Fundo AI — Empowering Zimbabwean students through accessible, AI-powered education.*
