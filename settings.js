/**
 * ╔══════════════════════════════════════════╗
 * ║         FUNDO AI — Settings               ║
 * ║  Edit your credentials here once          ║
 * ╚══════════════════════════════════════════╝
 *
 * SESSION_ID  → Your Ice~ session ID (e.g. Ice~abc123)
 *               Get one at: https://sessions.subzero.gleeze.com
 *               Leave empty to use pairing code instead.
 *
 * BOT_NUMBER  → Your WhatsApp number WITH country code, no + or spaces
 *               Example: 263719647303
 *
 * OWNER_NUMBER → The master/owner number that controls the bot
 *
 * ADMIN_USERNAME / ADMIN_PASSWORD → Credentials for remote admin login
 *               Any WhatsApp number can login with these to manage the bot
 *
 * LOGO_URL     → Bot logo shown in menu headers
 */

export default {
  SESSION_ID: process.env.SESSION_ID || "",
  BOT_NUMBER: process.env.BOT_NUMBER || "18195080751",
  OWNER_NUMBER: process.env.OWNER_NUMBER || "263719647303",
  LOGO_URL:
    process.env.LOGO_URL || "https://mrfranko-cdn.hf.space/edu/fundo.png",
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || "mrfrankofc",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "darex@123",
};
