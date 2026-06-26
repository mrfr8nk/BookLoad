---
name: Student Portal APIs
description: Which AI APIs are used in the student portal and their response shapes
---

**Chat:** GET `https://api.bk9.dev/ai/BK92?q=...&BK9=system&model=openai/gpt-oss-120b` → `res.data.BK9`. Falls back to BK91 then NVIDIA.

**Image generation:** GET `https://omegatech-api.dixonomega.tech/api/ai/nano-banana-pro?prompt=...` → `res.data.image` (URL). Falls back to Pollinations URL.

**Image analysis (vision):** GET `https://api.bk9.dev/ai/vision?q=...&image_url=...&model=meta-llama/llama-4-scout-17b-16e-instruct` → `res.data.BK9`.

**Why:** User specified these exact APIs to replace old BK91/Pollinations-only setup. Fallbacks kept so AI still works if any upstream goes down.

**How to apply:** `callBK92`, `callVisionAPI`, `generateImageAI` are the three server functions (admin-portal/server.js). Client `/api/student/analyze-image` POST `{imageUrl, question}` → `{reply}`.
