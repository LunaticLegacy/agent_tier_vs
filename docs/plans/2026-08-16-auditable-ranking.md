# Auditable Ranking Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace hand-adjusted Agent VS tiers with deterministic, evidence-aware framework and product classifications.

**Architecture:** Keep the editorial records as raw inputs, then derive public score and tier through one shared scoring module.  Audit metadata contains the evidence state, a review snapshot, and relationship disclosures; the interface shows those alongside the score instead of hiding uncertainty.

**Tech Stack:** React 19, TypeScript 5.9, Vite, Tailwind CSS, Framer Motion.

---

### Task 1: Define deterministic standards

**Files:**
- Create: `src/data/standards.ts`
- Modify: `src/data/projects.ts`
- Modify: `src/data/products.ts`

**Step 1: Encode the framework and product weights, tier gates, evidence caps, and audit types.**

**Step 2: Convert the two exported data sets to derived records so stored editorial values cannot override a computed tier.**

**Step 3: Add audit records for every entry, including author disclosure and the current public repository facts for llmfetcher and Angelus.**

### Task 2: Make the standards inspectable

**Files:**
- Create: `src/components/about/RankingStandards.tsx`
- Modify: `src/pages/About.tsx`
- Modify: `src/components/about/ProcessSteps.tsx`
- Modify: `src/components/about/Principles.tsx`

**Step 1: Publish the formula, hard gates, evidence states, and conflict-of-interest rule on the methodology page.**

**Step 2: Replace claims of finality with explicit snapshot and reassessment language.**

### Task 3: Surface audit status in entries

**Files:**
- Create: `src/components/AuditBadge.tsx`
- Modify: `src/pages/ProjectDetail.tsx`
- Modify: `src/pages/ProductDetail.tsx`

**Step 1: Render the score provenance, evidence status, review snapshot, and relationship disclosure next to each verdict.**

**Step 2: Link direct public evidence when it is available.**

### Task 4: Verify the reclassification

**Files:**
- Create: `scripts/verify-ranking.mjs`
- Modify: `package.json`

**Step 1: Assert that all displayed scores equal the standard formula and all tiers equal the standard classifier.**

**Step 2: Assert llmfetcher is disclosed and capped at framework Tier C, and Angelus is disclosed and capped at product T3.**

**Step 3: Run `npm run verify:ranking`, `npm run lint`, and `npm run build`.**
