---
name: Notes & exam usage tracking fix
description: Correct field to check/increment for notes and mock exam limits depending on plan period.
---

## Rule
For FREE/daily plans: check and increment `pdfToday` only.
For monthly plans: check `pdfMonth` (not pdfToday), and increment BOTH `pdfToday` and `pdfMonth`.
Mock exams also increment `mockMonth` regardless of plan (for tracking in sidebar/profile).

**Why:** The original code only ever incremented `pdfToday` for both notes and exams. Monthly plan users hit 0 usage shown in the sidebar (pdfMonth was never touched), and limits were checked against pdfToday which resets daily — so monthly limits were never actually enforced.

**How to apply:** Any route that generates a PDF artifact (notes, exam) must detect `limits.period === 'monthly'` and branch accordingly. The `/api/student/me` response must include `mockMonth` in the usage object.
