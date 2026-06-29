# Fundo AI — WhatsApp Educational Chatbot & Resource Portal

**Created by Darrell Mucheri**  
Built for Zimbabwean students — ZIMSEC & Cambridge curriculum support via WhatsApp AI.

---

## What's Included

| Component | Description |
|---|---|
| `index.js` | WhatsApp bot (AI chat, quizzes, PDF generator, voice notes) |
| `admin-portal/` | Web portal — marketing site, student app, admin dashboard |
| `db.js` | MongoDB models (users, plans, materials, payments) |
| `settings.js` | Bot configuration (credentials, bot number, owner) |

---

## Deploying on Render Web Service (Recommended)

The web portal (`admin-portal/`) is a standalone Express + React app.
Deploy it on Render in about 5 minutes — no WhatsApp connection needed.

### Step-by-step

**1. Push your code to GitHub**

Make sure your project is in a GitHub repository (public or private).

**2. Create a new Web Service on Render**

- Go to [render.com](https://render.com) → **New → Web Service**
- Connect your GitHub account and select your repository
- Choose the **main** branch

**3. Configure the service**

| Field | Value |
|---|---|
| **Name** | `fundo-ai` *(or any name you like)* |
| **Root Directory** | `admin-portal` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && cd client && npm install && npm run build` |
| **Start Command** | `node server.js` |
| **Instance Type** | Free *(or Starter for always-on)* |

> **Important:** The build command installs both server and client dependencies, then compiles the React frontend into `client/dist/`. The Express server serves these built files automatically.

**4. Add Environment Variables**

In Render → your service → **Environment** tab, add:

| Key | Value | Required? |
|---|---|---|
| `MONGO_URI` | Your MongoDB Atlas connection string | ✅ Yes |
| `ADMIN_USERNAME` | Admin login username | ✅ Yes |
| `ADMIN_PASSWORD` | Admin login password | ✅ Yes |
| `SESSION_SECRET` | Any long random string (for JWT signing) | ✅ Yes |
| `PAYNOW_ID` | Your Paynow merchant ID | Optional |
| `PAYNOW_KEY` | Your Paynow integration key | Optional |
| `NVIDIA_API_KEY` | NVIDIA AI key (improves AI quality) | Optional |

> **Do NOT set `PORT`** — Render injects it automatically. The server reads `process.env.PORT` already.

**5. Deploy**

Click **Create Web Service**. Render will:
1. Clone your repo
2. Run the build command (installs deps + builds React)
3. Start the Express server
4. Assign a URL like `https://fundo-ai.onrender.com`

Your site is live! 🎉

---

### Troubleshooting Render deployments

| Problem | Fix |
|---|---|
| Build fails with "vite not found" | Make sure the build command is exactly: `npm install && cd client && npm install && npm run build` |
| Site loads but shows blank page | Check that `client/dist/` was built — look in the build logs for `✓ built in` |
| API calls return 404 | Make sure Root Directory is set to `admin-portal`, not the repo root |
| MongoDB connection error | Whitelist `0.0.0.0/0` in MongoDB Atlas → Network Access (allow all IPs) |
| App sleeps after inactivity | Upgrade to Render Starter plan ($7/mo) or use [UptimeRobot](https://uptimerobot.com) to ping it every 5 minutes |

---

### Re-deploying after changes

Every push to your GitHub main branch will automatically trigger a new build and deploy on Render (if auto-deploy is enabled — it is by default).

To manually redeploy: Render dashboard → your service → **Manual Deploy → Deploy latest commit**.

---

## Option B — Keep on Replit

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
| `SESSION_SECRET` | JWT signing secret | `fundo-ai-secret-2025` |
| `PORT` | Port (set automatically by Render) | `5000` |
| `PAYNOW_ID` | EcoCash Paynow integration ID | — |
| `PAYNOW_KEY` | EcoCash Paynow integration key | — |
| `NVIDIA_API_KEY` | NVIDIA AI API key | — |

---

## MongoDB Atlas Setup

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. **Network Access** → Add IP Address → `0.0.0.0/0` (allow all, needed for Render)
3. **Database Access** → Add a user with read/write privileges
4. **Connect** → Drivers → copy the connection string
5. Replace `<password>` in the string with your DB user password
6. Paste it as `MONGO_URI` in Render environment variables

---

## Admin Portal — How to Use

1. Open the portal URL and go to `/admin` — sign in with your admin credentials
2. **Upload resources**: drag & drop files (PDF, DOC, DOCX, images)
3. Select the correct **Category**, **Level**, **Grade**, and **Subject**
4. Add a **Year** for past papers and marking schemes
5. Click **Upload Files** — resources appear immediately on the Fundo AI bot

---

## WhatsApp Bot Setup (separate from web portal)

1. Get a session ID from [sessions.subzero.gleeze.com](https://sessions.subzero.gleeze.com)
2. Set `SESSION_ID` in `settings.js` or as an environment variable
3. Run: `node index.js` (in the repo root, not admin-portal)

The bot runs separately from the web portal — you can deploy them independently.

---

## Credits

**Darrell Mucheri** — Developer & Creator  
- Website: [fundoai.gleeze.com](http://fundoai.gleeze.com)
- Support: support.fundo.ai@gmail.com
- WhatsApp: [wa.me/263719647303](https://wa.me/263719647303)

---

*Fundo AI — Empowering Zimbabwean students through accessible, AI-powered education.*
