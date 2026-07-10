# Fundo AI — Educational Resource Portal

**Created by Darrell Mucheri**  
Built for Zimbabwean students — ZIMSEC & Cambridge curriculum support.

---

## What's Included

| Component | Description |
|---|---|
| `admin-portal/server.js` | Express backend — API, file uploads, admin & student auth |
| `admin-portal/client/` | React frontend — marketing site, student app, admin dashboard |
| `admin-portal/project-prompts.js` | AI prompt templates used by the server |

---

## Deploying on Render (Recommended)

The portal is a standalone Express + React app. Deploy it on Render in about 5 minutes.

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
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `node server.js` |
| **Instance Type** | Free *(or Starter for always-on)* |

> **Important:** The build command installs client dependencies and compiles the React frontend into `client/dist/`. The Express server serves these built files automatically. Node.js 20 is pinned — do **not** use Node 24 (known npm compatibility issues).

**4. Add Environment Variables**

In Render → your service → **Environment** tab, add:

| Key | Required? | Notes |
|---|---|---|
| `MONGO_URI` | ✅ Yes | MongoDB Atlas connection string |
| `ADMIN_USERNAME` | ✅ Yes | Admin login username |
| `ADMIN_PASSWORD` | ✅ Yes | Admin login password |
| `SESSION_SECRET` | ✅ Yes | Any long random string for JWT signing |
| `PAYNOW_ID` | Optional | EcoCash Paynow merchant ID |
| `PAYNOW_KEY` | Optional | EcoCash Paynow integration key |
| `NVIDIA_API_KEY` | Optional | NVIDIA AI key for improved AI quality |

> **Do NOT set `PORT`** — Render injects it automatically. The server reads `process.env.PORT` already.

**5. Deploy**

Click **Create Web Service**. Render will:
1. Clone your repo
2. Run the build command (installs deps + compiles React)
3. Start the server with `node server.js`
4. Assign you a public URL like `https://fundo-ai.onrender.com`

---

## MongoDB Atlas Setup

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. **Network Access** → Add IP Address → `0.0.0.0/0` (required for Render)
3. **Database Access** → Add a user with read/write privileges
4. **Connect** → Drivers → copy the connection string
5. Replace `<password>` with your DB user password
6. Paste it as `MONGO_URI` in Render environment variables

---

## Admin Portal — How to Use

1. Open your Render URL and go to `/admin` — sign in with your admin credentials
2. **Upload resources**: drag & drop files (PDF, DOC, DOCX, images)
3. Select the correct **Category**, **Level**, **Grade**, and **Subject**
4. Add a **Year** for past papers and marking schemes
5. Click **Upload Files** — resources appear immediately on the student portal

---

## Running Locally

```bash
cd admin-portal
npm install
npm run build      # compiles the React frontend
node server.js     # starts the server on port 5000
```

Then open [http://localhost:5000](http://localhost:5000).

---

## Credits

**Darrell Mucheri** — Developer & Creator  
- Website: [fundoai.gleeze.com](http://fundoai.gleeze.com)
- Support: support.fundo.ai@gmail.com
- WhatsApp: [wa.me/263719647303](https://wa.me/263719647303)

---

*Fundo AI — Empowering Zimbabwean students through accessible, AI-powered education.*
