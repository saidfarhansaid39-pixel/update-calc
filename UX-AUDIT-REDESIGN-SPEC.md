# Calculator Page UX — Platform-Wide Gap Audit & Redesign Blueprint

**Scope:** all 4,270 calculators (16 hubs) rendered through the shared `PremiumCalculatorShell` + `Generic*Calculator` engine.
**Method:** static source audit (component tree, gating, props) + live Playwright probe (desktop 1440×900 + mobile 390×844) on 3 representative pages: `/health-calculators/bmi-calculator`, `/statistics-calculators/mean-calculator`, `/financial-calculators/401k-calculator`.
**Repro:** `%TEMP%\opencode\ux-audit-probe.cjs` (fold/touch/actions) and `%TEMP%\opencode\ux-micro-probe.cjs` (duplication counts).
**Status:** analysis & blueprint only — no code changes.

---

## 0. Current-State Architecture (what every calculator inherits)

**Route chain:** `src/app/[...slug]/page.tsx` → `CalculatorPageContent` (`src/components/hub-pages/calculator-page-content.tsx:255`) → `CalculatorRenderer` → `Generic<Hub>Calculator` → `PremiumCalculatorShell` → below-fold blocks.

**Measured DOM order (BMI, live):**

| y (desktop) | y (mobile) | Block | Component |
|---|---|---|---|
| 71 | 71 | "Updated 2026-04-25" micro-line | `calculator-page-content.tsx:269` |
| 117 | 117 | Breadcrumbs + header **Print** button | `CalculatorLayout` |
| 153 | 173 | **H1** | `CalculatorLayout.tsx:45` |
| 253 | 269 | Gradient intro card (218–278 px, repeats the title) | `CalculatorIntro.tsx:30` |
| 495 | 571 | "On This Page" ToC card (54 px) | shell `tocSections` (`:707`) |
| **573** | **649** | **`#calculator` card starts** | shell `:747` |
| 600 | 727 | First input | engine form |
| — | 775 | Sticky mobile result CTA (visible ✓) | shell `:1393` |

**Inside `#calculator`:** mode toggle (Basic/Advanced/Expert) + region panel (country/currency/measurement) → 2-col grid (form │ live result card) → charts → **preset chips (`:874`, below the grid)** → ActionToolbar (reset/reload/unit/sliders/copy/export/share/save, `:895`) → ExportShareSection (`:948`) → educational sections **gated `modeLevel >= 1`** (`:1034–1175`) → shell guide `#guide` **default-closed** (`:333`, `useState(false)`) → **InternalLinkingGrid (`:1380`) + RelatedCalculatorCarousel (`:1385`)**.
Then `calculator-page-content.tsx` renders **ExampleSection/FormulaSection (usually `null`) → RelatedCalculatorCarousel (`:297`) → InternalLinkingGrid (`:301`) again**.

**Already good (do not break):** live computation (401k shows `1,390,326.04` on load), 48 px inputs (`h-12`), sticky mobile result CTA, breadcrumbs + Updated date, Export&Share card (Copy/Print/CSV/Embed/Share all present), same-hub carousel (`RelatedCalculatorCarousel.tsx:26`), sticky ToC, ARIA labels, 0 page errors, full 10-locale i18n.

---

## 1. UX Audit & Friction Points (3 headline flaws)

### Flaw #1 — The tool is pushed below SEO preamble (violates "instant value above the fold")
- Mobile 390×844: the calculator card starts at **y649** and the first input at **y727** — roughly **one visible input row** before scrolling; ~476 px of preamble (breadcrumbs, 278 px hero, ToC) sits above the tool.
- Desktop: first input at y600 of a 900 px viewport — workable but 420 px is spent on H1 + hero + ToC before any interactive element.
- The gradient intro card **repeats the H1 title** (duplicate "BMI Calculator" heading ×2 — heading-hygiene + fold cost).
- **Fix direction:** fold `CalculatorIntro` into a single H1 + one-line description row; make the ToC sticky-inline (it already becomes sticky later) instead of a full-width block above the tool; presets immediately below H1.

### Flaw #2 — Recommendation pollution + double rendering (violates "zero pollution")
- `InternalLinkingGrid.tsx:46–47,151` renders a **"You might also like" cross-category block** (`hubSlug !== hub`, seeded from *other* hubs) — direct violation of the same-vertical rule.
- It renders **twice per page**: shell `PremiumCalculatorShell.tsx:1380` **and** page-content `calculator-page-content.tsx:301`. Live micro-probe: **`youMightAlsoLike: 2`, `popularIn: 2` on all 3 probed pages** — i.e. 4 same-hub lists + 2 cross-category lists + duplicated link-count footers per page.
- Dead code hazard: `src/components/seo/RelatedCalculators.tsx` (excludes the current hub by design, labels results "from other hubs") is never imported — delete before anyone wires it up.
- **Fix direction:** delete the cross-category block; render exactly **one** recommendation module per page (keep the same-hub carousel *or* the grid, not both ×2).

### Flaw #3 — The educational layer is hidden or broken (violates "collapsible formula + reference table + FAQ accordion")
- **No formula visible in default mode.** Shell formula/example/interpretation all gated `modeLevel >= 1` (`:1034–1117`); `FormulaSection` returns `null` when the registry entry has no `formula` (`calc-panel/FormulaSection.tsx:43–45`, common case). Live probe: `formulaHeading: null` on all 3 pages; `detailsCount: 0` — **zero `<details>` accordions anywhere**, so no collapsible FAQ either (shell FAQ = flat paragraphs inside a default-closed panel, `:1218–1230`).
- The 8-section `GuideContent` (ToC, `<details>` FAQ, variables table, FAQPage schema) exists — but renders **only on cluster pages** (`calculator-page-content.tsx:215`), never on primary pages.
- Formula source quality varies by hub: health = real formulas (`GenericHealthCalculator.tsx:1582`); everyday/engineering = meta formulas; **food = placeholder `'See step-by-step'` (`GenericFoodCalculator.tsx:412`); sports = step values joined by `' ? '` (`GenericSportsCalculator.tsx:405`)** — junk text under a "Formula" heading is a trust/E-E-A-T liability.
- **Fix direction:** ungated, collapsed-by-default Formula & Methodology accordion below the result (open by default ≥1024 px), variables **table**, port `GuideContent` FAQ accordions to primary pages, per-hub formula QA lint.

### Full findings table

| ID | Principle | Finding | Evidence | Severity |
|---|---|---|---|---|
| F01 | P1 Fold | 476 px preamble above tool on mobile; first input y727/844 | probe fold inventory | **High** |
| F02 | P1 Fold | Presets render **below** the form/result grid, +377 px…+1,790 px under first input; only 45 % of calcDefs define presets (944/2,106 files) | shell `:874`; presetY 977/1389/2430 vs inputY 600/640/640 | **High** |
| F03 | P1 Compute | Mixed compute models: hub engines live (useMemo), standalone forms are button-first (`RefinanceForm:117`, `AutoLoanForm:141`, … some auto-compute on mount `MortgageForm:43`) | source | **High** |
| F04 | P1 Compute | Mobile sticky CTA shows **`Mean Calculator: NaN`** on load (empty CSV-list → engine NaN; no empty-state guard) | micro-probe `nanVisible: true` (mean only) | **High (defect)** |
| F05 | P4 Content | Formula/example/interpretation hidden behind Advanced mode; invisible by default | shell `:1034–1117` | **High** |
| F06 | P4 Content | No `<details>` FAQ accordions on any probed page; primary pages get no `GuideContent` | probe `detailsCount: 0`; `:215` cluster-only | **High** |
| F07 | P3 Silo | Cross-category "You might also like" block | `InternalLinkingGrid.tsx:46–47,151` | **High** |
| F08 | P3 Silo | Every recommendation module rendered twice (shell + page-content) | probe `×2` on all pages | **High** |
| F09 | P4 Content | Placeholder/junk formulas (food `'See step-by-step'`, sports step-join) | `GenericFoodCalculator:412`, `GenericSportsCalculator:405` | **High** |
| F10 | P2 Utility | Share = bare URL, no input state (`ShareButtons.tsx:49`) — "Share link w/ inputs" missing | source | **Medium** |
| F11 | P2 Utility | No contextual action (timer / schedule download / .ics) anywhere in the toolbar; `Timer.tsx` exists but unused | source | **Medium** |
| F12 | P2 Mobile | Touch targets: toolbar/preset buttons 44 px (4 px under 48); header/footer text links have **16–17 px** effective tap height (111/158 targets <40 px — inline links + sr-only labels inflate the count; nav/footer links are the real offenders) | probe touch buckets | **Medium** |
| F13 | P1/P2 | ActionToolbar (Copy/Share/Export) sits *below* presets/results — on long forms it is off-screen when you need it; no copy button in the sticky mobile CTA | shell `:895` vs `:874` | **Medium** |
| F14 | P1 Fold | Duplicate title heading (H1 + `CalculatorIntro` both "BMI Calculator") | probe `dupHeadings` | **Low** |
| F15 | P3 Silo | Dead cross-hub component `seo/RelatedCalculators.tsx` | zero imports | **Low (hygiene)** |
| F16 | P4 Content | No reference/benchmark table component outside the currency hub (`CurrencyTables`); `FormulaSection` variables render as `<ol>`, not a table | source | **Medium** |
| F17 | P2 | Duplicate Print affordances (header row + toolbar) | probe `actions.print` = 2 | **Low** |

---

## 2. Mobile & Desktop Layout Blueprint

Legend: ✓ exists today · → moves/relabels · ＋ new

### Desktop ≥1024
```
[Breadcrumbs ✓]  [Print ✓ (keep ONE — toolbar only)]
[H1 ✓] [Updated badge ✓] [tier badge ✓]     ← ＋ absorb CalculatorIntro title/desc as one line (kills F14, saves ~220 px)
[────────── #calculator card ──────────]
[Unit strip → : Metric|Imperial · °C/°F · Monthly|Annual · Region  ← unify mode-toggle row + InternationalizationPanel + ActionToolbar unit select into ONE segmented row]
[Quick presets: [chip][chip][chip] … →]    ← MOVED above inputs (from shell :874); horizontal-scroll chips ≤640
┌ form (2-col, h-12 inputs ✓) ┐ ┌ result card ┐
│  ExtraFieldInjector ✓       │ │ MAIN result (bold, high-contrast ✓)
│  live compute ✓             │ │ ＋ secondary metrics row (total interest, payoff date, …)
│                             │ │ ＋ steps breakdown (engines already produce steps)
└─────────────────────────────┘ └─────────────┘
[Action toolbar → DIRECTLY under result column:]
 [Copy Result ✓] [Share w/ inputs ＋] [Print/CSV ✓] [Contextual ＋]
[Export & Share collapsed card ✓ (Embed/Cite stay tier-gated)]
[▶ Formula & Methodology — accordion ＋ (ungate F05): formula line + VARIABLES TABLE + notes]
[▶ Worked example — accordion (exists, gated → ungate)]
[▶ Reference / benchmark table ＋ (per hub, see §5B)]
[▶ FAQ — 3–5 × <details> ＋ (port GuideContent FAQPage schema to primary pages)]
[Related tools — SAME HUB, exactly ONE module → (dedupe F08): "More in {Hub}" grid OR carousel]
[Long-form guide ✓ (Complete Guide / Mistakes / Glossary / Pros-Cons — keep, already below tool)]
```

### Mobile ≤640
```
[H1 + one-line desc]
[presets chips — horizontal scroll →]
[unit strip →]
[inputs (stacked, 48 px ✓)] → [result card]
[sticky bottom bar ✓: result summary + Calculate/Recalculate]
   ＋ add [Copy] button to the sticky bar; ＋ show "—" instead of NaN (F04)
[Action toolbar → directly after result]
[▶ formula / ▶ example / ▶ table / ▶ FAQ — all default-collapsed, full-width]
[single related module]
```

---

## 3. Interactive Control Matrix

| Control | Today | Target behavior | Coverage | Notes |
|---|---|---|---|---|
| Numeric/text inputs | `h-12` (48 px ✓), live compute in hub engines | Keep 48 px; standardize **live compute everywhere** (debounced 250 ms) + keep a primary CTA only as "scroll to result"/recalculate for legacy standalone forms | All | Retire the mixed model (F03) |
| Per-field unit select | `FieldWithUnit` ✓ | Keep, adjacent to input | Multi-unit fields | — |
| Global unit system | Region panel top of card + ActionToolbar unit select (2 places) | Merge into single segmented **unit strip** above presets | All shell pages | F13 |
| Temperature / term basis | °C/°F via conversion engine; Monthly/Annual ad hoc in finance forms | Standardize segmented toggles directly above the affected input group | conversion + finance | — |
| Quick presets | `VisualPresetCards` **below** grid; `min-h-[44px]` chips | Above inputs; chips ≥48 px; horizontal scroll ≤640 | 944/2,106 calcDefs (45 %) → target 100 % of tier2/3 + top-500 tier1 | F02, F12 |
| Result card | Live ✓, `text-3xl` main + quality badge + range validator | Add **secondary metrics row** (key outputs the engine already computes) directly under main | All | Step breakdown already exists in engines |
| Empty state | "Enter values…" on BMI ✓, **NaN on mean** | Guard `Number.isNaN(mainValue)` → show prompt; never render NaN | statistics/ecology first | F04 |
| Action toolbar | reset/reload/unit/sliders/copy/export/share/save ✓ | Move directly under result; buttons ≥48 px; **add Share-w/inputs + contextual slot** | All | F10–F13 |
| Share with inputs | bare URL | Serialize `inputs` → `?i=<base64url(JSON)>`, restored **client-side** in the shell (no server `searchParams` → preserves caching; sanitize/whitelist fields; cap ~2 KB) | All | F10 |
| Contextual action | none | One hub-specific slot: food → **Start cooking timer** (`Timer.tsx` exists), finance → **Download schedule CSV** (export exists, reshape to amortization rows), date-time → **Add to calendar (.ics)**, conversion → **Swap units** | per hub | F11 |
| Print / CSV | header + toolbar Print (duplicate) | Single Print in toolbar; CSV stays in Export card | All | F17 |
| Slider toggle / scenario save | tier-gated ✓ | Keep as-is | tier1/3 | — |
| Sticky mobile CTA | ✓ shows result | + Copy button; + NaN guard | All | F04 |

---

## 4. Contextual Cross-Link Strategy (zero pollution)

**Rules**
- **R1 — Same hub only.** Every recommendation module pulls from the current `hubSlug`. No exceptions below global chrome (header/footer nav may stay cross-hub).
- **R2 — Exactly one module per page** (delete the shell↔page-content duplication, keep whichever renders richer).
- **R3 — Kill the cross-category block** (`InternalLinkingGrid` "You might also like", lines 146–166); replace with a second row of *same-hub* "Popular in {Hub}" if more surface is needed.
- **R4 — Sibling priority ordering:** rank same-hub candidates by shared input fields/keywords (e.g. BMI ↔ body-fat share weight/height/age) before alphabetical fill.
- **R5 — Delete dead `seo/RelatedCalculators.tsx`** so cross-hub logic cannot be resurrected.

**Five strictly-relevant tools per vertical (real registry slugs):**

| Page | Related tools (same hub) |
|---|---|
| `/financial-calculators/401k-calculator` | `compound-interest-calculator`, `retirement-calculator`, `salary-calculator`, `investment-calculator`, `403b-calculator` |
| `/health-calculators/bmi-calculator` | `navy-body-fat`, `waist-to-hip-ratio`, `body-roundness-index`, `lean-body-mass`, `protein-calculator` |
| `/food-calculators/recipe-scaling-calculator` | `recipe-cost-calculator`, `meal-planner-calculator`, `cooking-temperature-calculator`, `oven-time-calculator`, `portion-size-calculator` |
| `/statistics-calculators/mean-calculator` | `median-calculator`, `mode-calculator`, `standard-deviation-calculator`, `variance-calculator`, `percentile-calculator` |
| `/everyday-calculators/cooking-time-calculator` | `cleaning-time-calculator`, `water-intake-calculator`, `caffeine-calculator`, `grocery-budget-calculator`, `party-planner-calculator` |

**Silo audit baseline:** live pages today show same-hub dominance (49/73 BMI links) with the residue coming from chrome + the cross-category block; after R1–R5, recommendation modules = 100 % same-hub.

---

## 5. SEO & Educational Content Schema

### A. Formula & Methodology (collapsible accordion, below the tool)
Structure per calculator:
1. **Formula line** — mono, one expression (`BMI = kg / m²`).
2. **Variables table** — `Variable | Symbol | Unit | Typical range | Meaning`.
3. **Worked example** — the engine's example/steps output.
4. **Notes / assumptions** — one short paragraph (source: hub formula registry).

Source of truth: generalize the `healthFormulas` pattern (`GenericHealthCalculator.tsx:1582`) into a per-hub formula registry consumed by the shell. **QA gate:** new lint script fails on placeholder formulas (`'See step-by-step'`, step-join expressions, empty strings) — fixes F05/F09.

*Sample (BMI):*

| Variable | Symbol | Unit | Typical range | Meaning |
|---|---|---|---|---|
| Mass | m | kg | 30–200 | Body weight |
| Height | h | m | 1.4–2.1 | Stature |
| BMI | — | kg/m² | 12–60 | `m / h²` |

### B. Reference / benchmark table
New shared `<ReferenceTable>` below the formula block, one per hub (examples: BMI categories, healthy rate-of-loss; APR benchmarks by loan type; oven-temperature equivalents; pace zones by age band; normal lab ranges). Rendered as a real `<table>` (crawlable), i18n via fragment files only.

### C. FAQ accordion
3–5 targeted questions per calculator (edge cases, assumptions, usage tips), each in `<details><summary>` (SSR-visible, keyboard accessible, zero JS), emitting the `FAQPage` JSON-LD `GuideContent` already generates. Cluster variants must not duplicate the primary's FAQ verbatim (canonical-aware variants).

### D. On-page schema & headings
Keep: `BreadcrumbList`, `WebPage`, `MedicalWebPage` (health), `Dataset`, `WebApplication` (with `image`+`brand` injection). Change: single H1 per page — demote `CalculatorIntro`'s title to a visual line (F14); keep Updated date; keep long-form guide below the FAQ.

---

## 6. Implementation Roadmap (for a later coding session)

**Phase 1 — quick wins (≈1–2 days)**
1. Dedupe + silo recommendations (delete `youMightAlsoLike`, remove one of the two render sites) — F07/F08.
2. Move presets above inputs; chips 44→48 px — F02/F12.
3. Ungate formula/example into a collapsed accordion below the result in Basic mode — F05.
4. NaN empty-state guard in statistics/ecology engines + sticky CTA — F04.
5. Demote `CalculatorIntro` title (single H1) — F14/F01.
6. Nav/footer tap areas ≥40 px; toolbar buttons 44→48 px — F12.

**Phase 2 — engagement**
7. Share-w-inputs (`?i=` client-side restore) — F10.
8. Port `GuideContent` FAQ accordions to primary pages — F06.
9. `<ReferenceTable>` + first 5 hubs — F16.
10. Contextual action slot (timer / schedule CSV / .ics / swap) — F11.
11. Formula registry + placeholder lint (food/sports first) — F09.

**Phase 3 — scale**
12. Preset coverage → 100 % tier2/3 + top-500; live-compute unification on standalone forms; fold/touch A/B measurement (reuse the probe scripts as CI smoke).

**Gates for every change:** `pnpm typecheck` → `pnpm test` → `pnpm run build` → Playwright probe (fold positions, `youMightAlsoLike ≤ 1`, `details ≥ 3`, no NaN, touch buckets) → i18n keys only via fragment files + `scripts/merge-i18n-fragments.mjs` → currency display via `subMoney` → tier gating unchanged.

**Acceptance metrics:** mobile first input ≤350 px below H1; exactly 1 recommendation module; 0 cross-hub recommendation links; ≥3 `<details>` accordions per primary page; 0 NaN in empty states; all toolbar/preset targets ≥48 px.
