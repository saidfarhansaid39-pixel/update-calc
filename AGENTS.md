## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, invoke the `skill` tool with `skill: "graphify"` before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## Progress Summary

### Done (initial)
- **16 category hubs**: 2,520 calculators across financial, health, math, conversion, date-time, construction, stats, education, physics, chemistry, engineering, everyday, food, biology, ecology, sports
- **Calculator registry**: 2,520 entries with Zod-validated types, tiered (tier1/tier2/tier3), per PRD §7.3
- **Monorepo scaffold**: pnpm-workspace.yaml, .npmrc, vitest.workspace.ts, packages/formulas/, packages/calculator-registry/, packages/shared/
- **Prisma schema**: Full data model (User, SavedCalculation, etc.) — SQLite for dev (file:./dev.db)
- **PremiumCalculatorShell**: Tier-aware wrapper with scenario comparison, CSV export, print/export buttons, educational guide, tier badges, SchemaMarkup
- **CalculatorCharts**: LoanDonutChart, InvestmentGrowthChart, ComparisonBarChart, AmortizationChart
- **12 multi-unit dimensions** in unit library (mass, length, volume, temperature, area, pressure, energy, power, speed, time, data, torque) — 75+ unit definitions
- **Food hub**: 60 calculators with hand-crafted per-calc formulas, select inputs, step-by-step output
- **30 standalone financial route pages** + 6 premium T3 pages (401k, compound-interest, investment, refinance, retirement, rent-vs-buy, student-loan, debt-payoff, income-tax, social-security)
- **Old `src/lib/calculatorsRegistry.ts` deleted**: migrated to `@calcuniverse/calculator-registry`
- **Fixed mobile responsiveness** — ActionToolbar collapsible dropdown, `md:grid-cols-2`, `p-4 sm:p-6` cards, touch targets
- **Fixed form not rendering bug** — `calcError` checks `hasInputs && result === null`
- **Fixed 14 broken hub links** — Header nav + Footer → `/financial-calculators` etc.
- **Fixed redirect-chain links** in CurrencyTables, Footer, homepage
- **Created 3 static pages** — `/privacy`, `/terms`, `/contact`
- **All 16 hubs in nav** — Header: 6 primary + 10 under "More" (Framer Motion), all 16 in mobile
- **ExtraFieldInjector** — `+ Add Input Field`, grouped dropdown, localStorage, FormProvider
- **Extra field pools** — 16 hub-level pools (8-14 fields) + 22+ slug overrides
- **ExtraFieldsContext** — React context + `useExtraFields()` + `onExtraFieldsChange`
- **Universal adjustment engine** — `computeAdjustments()` covers all 16 hub types
- **ExtraFieldAdjustments component** — adjustment cards wired into PremiumCalculatorShell
- **SEO cluster infrastructure** — `src/lib/seo-clusters/` types, patterns, engine, component
- **300+ cluster pattern templates** — 10 audience + 5-11 hub-specific variants per hub
- **Curated allowlist** — 89 fast calculators get SEO long-tail keyword pages
- **Extra input fields upgrade** — 66 new extra field definitions (4-5 per hub), 5 new adjustment blocks

### Unified Route Architecture (June 28)
- **Unified `[hubSlug]/[slug]/page.tsx`** — single catch-all route replacing 16 hub templates
- **Unified `[hubSlug]/page.tsx`** — single hub landing page replacing 16 duplicate landing pages
- **`src/lib/hub-data.ts`** — registry map for all 16 hubs with `getHubMeta()`, `isValidHubSlug()`, `getAllHubSlugs()`, `findCalculator()`
- **16 Generic*Calculator files** moved to `src/components/hub-calculators/`; `index.ts` registry
- **Deleted 16 `[slug]/` directories** and 16 old hub landing `page.tsx` files
- **Updated 28 standalone page import paths** to `@/components/hub-calculators/GenericFinancialCalculator`
- **Cluster generation gated** by `CLUSTER_PASS` env var in `shouldGenerateClusters()`
- **Reduced variants** from 5→3→2→1 (`slice(0, 1)`) for memory
- **Slow-calc exclusion** in `shouldGenerateClusters()`: dividend-growth-rate, payout-ratio, retention-ratio
- **Cluster build OOM fix** — cluster slugs removed from `generateStaticParams()`, `revalidate = 3600` for ISR
- **Internal linking** — `PrimaryClusterLinks` from primary pages to cluster variants
- **`everyday-data.tsx`** — 504 corrupted U+FFFD + 401 byte corruptions fully fixed

### Extra-Field Compute Integration (June 28)
- **`src/lib/extra-field-compute.ts`** expanded 53→437 lines — all 113 extra fields typed across 16 hubs
- **Wired into `GenericFinancialCalculator.tsx`** — financial compute() reads extra fields
- **Health calculator** — compute() applies extra fields (BMR formula, activity, goal)

### Share / Embed / Cite (June 28)
- **`src/components/premium/ShareButtons.tsx`** — NEW — Social share dropdown (Twitter/X, Facebook, LinkedIn, Pinterest, Email) with `target="_blank"`, ARIA labels
- **`src/components/premium/EmbedWidget.tsx`** — NEW — Iframe embed code generator with clipboard copy
- **`src/components/premium/CitationGenerator.tsx`** — NEW — APA 7th, MLA 9th, Chicago 17th citations with per-format copy
- **ExportPanel enhanced** — Markdown copy, Embed toggle with CalculatorWidget, "Copy All"
- **All three integrated into `PremiumCalculatorShell.tsx`**

### Deep Content / SEO Guide System (June 28)
- **`src/lib/seo/guide-content.ts`** — NEW — Dynamic 8-section engine (whatIs, howToUse, formula, example, useCases, tips, related, faq) with category-aware templates, 30+ slug-specific example calculations, formula source lookup
- **`src/components/seo/GuideContent.tsx`** — NEW — Server Component with sticky ToC sidebar, collapsible `<details>/<summary>` FAQ, `FAQPage` Schema.org markup, reading time badge, "Was this helpful?" feedback
- **Integrated into `[hubSlug]/[slug]/page.tsx`** for all primary calculator pages
- **Verified rendering live** on BMI calculator — rich styled cards with number badges, emerald/teal theme, TOC, and FAQPage schema

### Registry Expansion (June 28)
- **From ~1,385 to 2,520 calculator entries** (+1,135 new across all 16 hubs)
- **All hub `calculatorCount` values updated** — `packages/calculator-registry/src/registry.ts`
- **Sitemap updated** to include all 2,520 calculator URLs

### Performance & Build (June 28)
- **`next.config.mjs`** — `optimizePackageImports` expanded (lucide-react, recharts, framer-motion, all Radix UI)
- **`@next/bundle-analyzer`** installed — run `ANALYZE=true npm run build` for visual analysis
- **`src/app/[hubSlug]/loading.tsx`** — NEW — Skeleton loading cards with pulsing animation
- **Build verified**: 2,531 pages, ~2.3 min SSG, 0 errors, 0 TypeScript errors

### Accessibility Deep Audit (June 28)
- **`scripts/check-a11y.mjs`** — NEW — Automated checker parsing built HTML files for 8 patterns (lang attr, img alt, input labels, icon buttons, heading hierarchy, expanded buttons, aria-expanded names)
- **0 issues found** on built pages via script
- **15 manual fixes applied**:
  - Header "More": `aria-expanded`, `aria-haspopup`, `aria-label`
  - Header mobile search: `aria-label`
  - Header mobile nav: `aria-label="Mobile navigation"`
  - Footer sections: `<nav>` per section with `aria-label`
  - CalculatorFormField lock: `aria-label` + `aria-pressed`
  - CalculatorFormField unit select: `aria-label`
  - SearchBar: `aria-controls`, `aria-autocomplete`, listbox `id`
  - ExportPanel: `min-h-[44px]`, `aria-label` on each button, `aria-expanded` on embed toggle
  - GuideContent ToC: first link `aria-current="location"`
  - ClusterPageContent back link: `aria-label` with human-readable title
- **All interactive elements**: `min-h-[44px]` (WCAG 2.5.5), explicit `aria-label`
- **Chart a11y**: `role="img"` with dynamic `aria-label`, `isAnimationActive={false}`
- **Skip-to-content**: `<a href="#main-content">`, `<main id="main-content" tabIndex={-1}>`

### Competitive Scorecard (June 28)
- **AllCalculators scored 87/100** — ranked #1 in engineering
- vs Omni Calculator (76/100), Inch Calculator (73/100), Calculator.net (55/100)
- Strengths: dark mode, extra fields, auto-adjustments, engineering depth
- Embed/widget, deep content, share/cite gaps now addressed

### Known Constraints
- **60s SSG timeout** — ~50+ calculators across all hubs render slower than 60s
- **Curated allowlist** — only fast calculators (<60s) get cluster pages; add new ones at `src/lib/seo-clusters/index.ts:85`
- **Auto-generated calculators** (slug ending with digit, ~571 entries) excluded from cluster generation
- **Slow calculators** concentrated in: biology, ecology, food, education, chemistry, health
- **Chart components** are client-side only (`next/dynamic` with `ssr: false`) — not present in static HTML

### Conversion Engine Built (July 1)
- **Dynamic conversion engine** integrated into `src/components/hub-calculators/GenericConversionCalculator.tsx:469-720`:
  - Parses 227 "X-to-Y" pattern slugs via `parseSlug()` regex
  - Resolves slug-style unit names (e.g., "miles-per-hour", "gallons") to factor map keys via 180+ `unitAliases` covering 14 dimensions
  - Detects dimension via `slugToDimension()` against 16 factor maps (length, mass, volume, temp, speed, area, pressure, energy, power, time, digital, angle, force, frequency, torque, acceleration)
  - Auto-generates `CalcDef` with single-input form, temperature special-cased via `convertTemp()`
  - Fallback chain: `calcDefs[slug]` (90 specific) → `buildDynamicDef(slug)` → `'inches-to-cm'`
- **All 3 dimension factor map expansions**: `energyToJ` (kJ, kcal, Wh, kWh), `timeToS` (day, week), `speedToMS` (mph, kn)
- **TypeScript**: 0 errors

### International SEO Architecture (July 4)
- **10-locale i18n**: en, es, fr, de, pt, ru, ar (RTL), hi, ja, zh-CN
- **`src/i18n/routing.ts`** — `defineRouting()` with 10 locales, `localePrefix: 'as-needed'`, `isRtl()`, `localeNames`
- **`src/proxy.ts`** — next-intl middleware for locale detection/cookie/redirect (Next.js 16 proxy convention)
- **`src/lib/navigation.ts`** — `createNavigation()` shared navigation (Link, redirect, usePathname, useRouter)
- **`src/components/LocaleSwitcher.tsx`** — Dropdown/minimal UI, ARIA, keyboard nav, locale-aware routing
- **`src/components/Header.tsx`** — LocaleSwitcher integrated in header
- **`src/components/Footer.tsx`** — LocaleSwitcher in company section
- **`src/app/layout.tsx`** — RTL dir, per-locale fonts (Noto Sans Arabic/JP/SC/Devanagari), hreflang auto-gen, localized metadata, locale-aware SchemaMarkup
- **`src/app/page.tsx`** — Homepage migrated to `getTranslations('homepage')` (hub names/descriptions from translation keys)
- **`src/app/sitemap.ts`** — 10-locale sitemap generation
- **`src/app/robots.ts`** — Locale-aware rules
- **`src/app/[hubSlug]/[slug]/page.tsx`** — Locale-aware canonical/hreflang/OG/Twitter/robots metadata, locale-specific OG image URL
- **`src/app/[hubSlug]/page.tsx`** — Locale-aware canonicals, breadcrumbs, pagination
- **10 translation files**: 10 namespaces (nav, footer, hubs, actions, common, seo, content, guide, homepage, pages, notFound, standalone)
- **RTL CSS**: `globals.css` has `[dir="rtl"]` utilities (text direction, margins, rotation, display) — verified passing all 12 RTL checks
- **Font families**: `tailwind.config.ts` → `fontFamily` entries for arabic/japanese/chinese/devanagari + CSS vars
- **`src/app/api/og/[slug]/route.tsx`** — OG image now reads `?locale=` param, renders language badge
- **`src/components/SchemaMarkup.tsx`** — Locale-aware JSON-LD with `inLanguage`, locale-prefixed URLs
- **`src/app/not-found/`** — 404 page localized with `getTranslations('notFound')`
- **89 slug aliases**: 14 Spanish + 74 across fr/de/pt/ru/ar/hi/ja/zh-CN in `next.config.mjs` redirects
- **15 standalone pages**: amortization, annuity-payout, auto-loan, credit-cards-payoff, currency, debt-consolidation, estate-tax, house-affordability, income-tax, interest-rate, mortgage, payment, rent, salary, social-security — all migrated to `generateMetadata` with `getTranslations('standalone')`
- **4 static pages**: about, contact, privacy, terms — migrated to `getTranslations('pages')` with hreflang
- **All internal links**: 14 components/pages use locale-aware `Link`/`useRouter` from `@/lib/navigation`
- **`tsconfig.json`** — `allowImportingTsExtensions: true`
- **`package.json`** — `--experimental-strip-types` for build:search-index, `tsx` installed as dev dep
- **Build verified**: 4304 SSG pages in ~30s SSG, 0 errors, 0 TypeScript errors

### Content Layer Localization (July 4 — Multi-Agent)

#### Registry Localization Infrastructure
- **`src/lib/localized-registry.ts`** — NEW — Sync locale-aware calculator lookup layer:
  - `getLocalizedCalculator(slug, locale)` — merges registry English with per-locale overrides
  - `getLocalizedCalculatorsByHub(hubSlug, locale)` — hub-wide localized listing
  - `getLocalizedHubMeta(hubSlug, locale)` — localized hub metadata
  - Statically imports 10 override JSON files from `src/i18n/calculator-overrides/{locale}.json`
  - Empty override files (en/es/fr/de/pt/ru/ar/hi/ja/zh-CN) — infrastructure ready, translations TBD
- **`src/lib/hub-data.ts`** — All functions accept optional `locale` param, return localized data
- **`src/app/[hubSlug]/[slug]/page.tsx`** — Page titles, OG, Twitter, breadcrumbs use localized calculator names
- **`src/app/[hubSlug]/page.tsx`** — Hub title, description, calculator list use localized data
- **`src/lib/seo/guide-content.ts`** — `generateGuide(calc, t?, locale?)` passes localized calculator names through all 8 guide sections
- **`src/components/seo/GuideContent.tsx`** — Passes locale to guide engine
- **`src/components/premium/PremiumCalculatorShell.tsx`** — Locale-aware internal registry lookups + related calculators
- **`src/components/seo/RelatedCalculators.tsx`** — Uses localized calculator titles
- **`src/components/premium/InternalLinkingGrid.tsx`** — 3 render locations use localized titles
- **`src/components/premium/RelatedCalculatorCarousel.tsx`** — Carousel items use localized names
- **`src/app/api/og/[slug]/route.tsx`** — OG images render localized calculator names via `?locale=` param

#### Extra Field Labels i18n
- **`src/lib/extra-field-pools/helpers.ts`** — NEW — `getLabelKey()`, `localizeExtraField()`, `localizeLabel()`, `localizePlaceholder()`, `localizeOption()` — wraps translation around ExtraFieldDef
- **`extraFields` namespace**: 664 translation keys (309 label + 352 option + 3 placeholder) added to all 10 locale files
- **`src/components/premium/ExtraFieldInjector.tsx`** — All labels/placeholders/options resolve via `t('extraFields.{key}')` with English fallback

#### Per-Locale Search Index
- **`scripts/build-search-index.mjs`** — Now iterates all 10 locales, loads locale-specific overrides, outputs to `public/search-index/{locale}.json`
- **`src/lib/search.ts`** — `searchCalculators(query, locale, signal)` loads locale-specific prebuilt index; `createSearch(locale)` returns locale-bound search function
- **`src/components/SearchBar.tsx`** — Reads `useLocale()`, passes to `createSearch(locale)`, displays localized calculator titles in results

#### Calculator UI Namespace
- **`calculatorUI` namespace** — 50+ common keys across 5 sub-namespaces (`headings`, `formLabels`, `sections`, `results`, `tabs`, `buttons`, `breadcrumbs`, `descriptions`) in all 10 locale files
- **11 components migrated**: MortgageForm, MortgageResults, MortgageCalculatorWrapper, MortgagePayoffForm, PaymentCalculator, PaymentForm, PaymentResults, SalaryForm, SalaryResults, RentForm, RentResults — all use `useTranslations('calculatorUI')`
- **IncomeTaxForm.tsx** — Calculate/Clear buttons + modify instructions migrated to translation keys
- **`clusters` namespace** — Empty `{}` in all 10 locale files, ready for future cluster variant translations
- **`scripts/translate-overrides.mjs`** — Updated with `--systematic` flag for pattern-based translation without API key. Run `node scripts/translate-overrides.mjs --systematic` to populate override files.
- **Override files populated**: All 9 non-English locales have 4,254 entries. es/fr/de/pt get pattern-based translations (e.g., "Convertidor de Pulgadas a CM"); ru/ar/hi/ja/zh-CN keep English titles. Descriptions stay English for all.
- **~140 form components migrated** to `useTranslations('calculatorUI')` across 6 agent batches + final batch of 73 files
- **6 article components** got `useTranslations('articles')` infrastructure
- **Stale files removed**: `it.json` and `nl.json` deleted from `src/i18n/messages/`
- **Fixed pre-existing type bugs**: `CalculatorType`, `initialCategory`, `PixelCalculatorForm import`

### Remaining Gaps
- **Professional translations**: es/fr/de/pt need real translations (systematic is a scaffold); ru/ar/hi/ja/zh-CN have English titles needing native-script translations
- **Guide content prose**: 2,533 lines of English prose in `guide-content.ts` (calculator names localized, body text still English)
- **Article body prose**: 10+ article components with English-only body content
- **Expanded slug aliases**: Current 89 can grow to cover more calculators per locale
- **Lighthouse optimization**: Per-locale performance audit

### Next Steps
- Run `node scripts/translate-overrides.mjs` with `OPENAI_API_KEY` for proper AI translations
- Translate guide content prose and article body content per locale
- Expand language-specific slug aliases beyond current 89
- Measure Lighthouse scores per locale, optimize to 95-100

### Critical Context
- **Build**: 4,304 pages in ~70s compile + ~28s SSG = ~1.6 min total, 0 errors.
- **TypeScript**: 0 errors across entire project.
- **Registry**: 2,520 calculator entries across 16 hubs (was ~1,385).
- **Brand primary**: `#1a759f` (was `#34a0a4`). Tailwind `text-primary`, `bg-primary`, `border-primary` resolve to accessible dark teal.
- **SearchBar**: live search over 2,520+ calculators with autocomplete dropdown. Dynamic import.
- **`dynamicParams = true`** (Next.js 16 default) — ISR pages accessible even if not in `generateStaticParams`.
- **Standalone pages** take route priority over `[hubSlug]/[slug]`.
- **`pnpm`** is package manager. `bun`, `node`, `npx` also available.
- **`@next/bundle-analyzer`** installed — `ANALYZE=true npm run build`.
- **`scripts/check-a11y.mjs`** — run after build for automated accessibility checks.
- **Competitive position**: #1 in engineering (87/100). Embed, deep content, share/cite gaps now closed.
- **i18n**: 10 locales (en/es/fr/de/pt/ru/ar/hi/ja/zh-CN), `localePrefix: 'as-needed'` (English at root), next-intl v4.13.0, proxy.ts replaces middleware.ts
- **RTL**: Arabic uses `dir="rtl"` on `<html>` + RTL CSS utilities, Noto Sans Arabic font
- **Translation files**: lazy-loaded per-request via `getRequestConfig`, no bundle impact

### Relevant Files
- `src/app/[hubSlug]/[slug]/page.tsx`: Unified calculator page — ISR for cluster, SSG for primary + GuideContent + locale-aware metadata
- `src/app/[hubSlug]/page.tsx`: Unified hub landing page + locale-aware breadcrumbs/pagination
- `src/app/sitemap.ts`: 10-locale sitemap
- `src/app/robots.ts`: Locale-aware robots.txt
- `src/i18n/routing.ts`: 10-locale routing config + `isRtl()`
- `src/i18n/request.ts`: getRequestConfig for lazy translation loading
- `src/proxy.ts`: next-intl middleware (locale detection/redirect)
- `src/lib/navigation.ts`: Locale-aware Link/redirect/usePathname/useRouter
- `src/components/LocaleSwitcher.tsx`: Language dropdown component
- `src/i18n/messages/{en,es,fr,de,pt,ru,ar,hi,ja,zh-CN}.json`: Translation files
- `src/app/page.tsx`: Homepage with getTranslations('homepage')
- `src/app/layout.tsx`: RTL dir, fonts, hreflang, localized metadata
- `src/lib/hub-data.ts`: Hub registry map for 16 hubs
- `src/components/hub-calculators/index.ts`: Maps hubSlug → Generic*Calculator
- `src/components/hub-calculators/everyday-data.tsx`: Restored 1,894 lines, fully UTF-8 valid
- `src/components/SearchBar.tsx`: Live search over registry, autocomplete, ARIA combobox
- `src/components/premium/ShareButtons.tsx`: Social share dropdown
- `src/components/premium/EmbedWidget.tsx`: Iframe embed generator
- `src/components/premium/CitationGenerator.tsx`: APA/MLA/Chicago citations
- `src/components/premium/ExportPanel.tsx`: Enhanced — Markdown, Embed, Copy All
- `src/components/premium/PremiumCalculatorShell.tsx`: Integrates share/embed/cite
- `src/components/seo/GuideContent.tsx`: Server Component — sticky ToC, collapsible FAQ, FAQPage schema
- `src/lib/seo/guide-content.ts`: Dynamic 8-section guide engine
- `src/lib/extra-field-compute.ts`: 437 lines — all 113 extra fields typed across 16 hubs
- `src/app/[hubSlug]/loading.tsx`: Skeleton loading UI
- `next.config.mjs`: Compression, images, security headers, bundle analyzer, optimizePackageImports
- `scripts/check-a11y.mjs`: Automated a11y checker for built HTML
- `packages/calculator-registry/src/registry.ts`: 2,520 entries
- `src/lib/localized-registry.ts`: Locale-aware calculator lookup layer
- `src/i18n/calculator-overrides/{en,es,fr,de,pt,ru,ar,hi,ja,zh-CN}.json`: Calculator override files (populated via systematic translation for 9 non-English locales)
- `scripts/translate-overrides.mjs`: Translate override entries via OpenAI or systematic pattern mode
- `src/lib/extra-field-pools/helpers.ts`: Extra field label localization helpers
- `src/components/premium/ExtraFieldInjector.tsx`: Locale-aware extra field rendering
- `scripts/build-search-index.mjs`: Generates per-locale search indexes
- `public/search-index/{en,es,fr,...}.json`: Per-locale search index files
