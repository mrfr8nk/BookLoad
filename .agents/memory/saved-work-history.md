---
name: Saved work history architecture
description: How generated notes and project reports are persisted and displayed.
---

## Architecture
- **Model:** `SavedWork` in MongoDB — fields: phone, type (notes|project), title, content, subject, level, timestamps.
- **Routes:** POST /api/student/saved-work (create), GET /api/student/saved-work[?type=], GET /api/student/saved-work/:id, DELETE /api/student/saved-work/:id — all behind requireStudent.
- **Auto-save:** Notes generation and project generation call the POST route on success (fire-and-forget, `.catch(()=>{})`).
- **UI:** `HistoryTab` component (id:'history', icon:Clock) — grid of cards, click to open viewer modal with ReactMarkdown, delete button per card.
- **Mobile nav:** BOTTOM_TABS constant (7 tabs: chat, notes, project, exam, history, materials, profile) replaces full TABS in the mobile bottom nav to avoid overcrowding.

**Why:** All generated content was previously ephemeral — students could not return to previous notes/projects. Server-side persistence ensures cross-device access.
