---
name: Project generator parallel batch size
description: Why project generation must run all 7 AI stages fully in parallel.
---

## Rule
`runWithConcurrency` batchSize for the 7 project stages must be 7 (all at once), not 3.

**Why:** With batchSize=3, the 3 sequential batches could take 3×22s = 66s worst case, which exceeds the ~30s reverse-proxy timeout on Replit, causing the project generation to silently fail. Each stage independently races NVIDIA + BK9, so running all 7 in parallel completes in ~12–18s.

**How to apply:** Never reduce batchSize below 7 for project generation. If more stages are added, increase it to match.
