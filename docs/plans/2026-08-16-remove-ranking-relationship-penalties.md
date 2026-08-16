# Remove Ranking Relationship Penalties Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ensure maintainer affiliation is disclosed but never changes a project score, gate, or tier.

**Architecture:** Keep evidence status as audit metadata. Only objective capability scores and explicitly documented engineering gates determine public classification; the top tier continues to require independently reproducible evidence.

**Tech Stack:** TypeScript, React, Node.js static verification.

---

### Task 1: Remove relationship-dependent classifiers

**Files:**
- Modify: `src/data/standards.ts`
- Test: `scripts/verify-ranking.mjs`

**Step 1:** Delete evidence-status exclusion and tier-capping functions from framework and product classification.

**Step 2:** Retain verified evidence solely as the S/T0 admission condition.

**Step 3:** Assert the classifiers contain no observation or relationship cap.

### Task 2: Recalibrate the two affected entries

**Files:**
- Modify: `src/data/projects.ts`
- Modify: `src/data/products.ts`

**Step 1:** Update llmfetcher’s engineering dimensions from its public CI, offline tests, documentation and implementation scope.

**Step 2:** Update Angelus’s capability dimensions and remove unsupported inherited-bug wording.

**Step 3:** Verify the derived results are A / T2 respectively.

### Task 3: Correct public methodology

**Files:**
- Modify: `README.md`
- Modify: `src/components/about/RankingStandards.tsx`
- Modify: `src/components/about/Principles.tsx`
- Modify: `src/components/about/ProcessSteps.tsx`
- Modify: `src/components/about/TierTable.tsx`

**Step 1:** Replace every claim that observation or affiliation caps a tier.

**Step 2:** State that affiliation is disclosure-only and that evidence status communicates confidence.

### Task 4: Verify

**Files:**
- Test: `scripts/verify-ranking.mjs`

**Step 1:** Run `npm run verify:ranking`.

**Step 2:** Run targeted ESLint and `npm run build`.
