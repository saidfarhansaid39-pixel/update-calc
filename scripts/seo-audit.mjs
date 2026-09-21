import { readFileSync, readdirSync, existsSync } from 'fs'
import { join, basename } from 'path'

const root = process.cwd()
const issues = []

function addIssue(severity, category, file, description) {
  issues.push({ severity, category, file, description })
}

// ============================================================
// 1. CHECK FOR BROKEN INTERNAL LINKS
// ============================================================
console.log('\n=== 1. BROKEN INTERNAL LINKS ===\n')

// Collect all routes from page.tsx files
const routes = new Set()
function findRoutes(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== '.next' && entry.name !== 'dist') {
      findRoutes(fullPath)
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      const content = readFileSync(fullPath, 'utf8')
      // Find href="..." and Link href={...}
      const hrefMatches = content.matchAll(/href=["']([^"']+)["']/g)
      for (const match of hrefMatches) {
        const href = match[1]
        if (href.startsWith('/') && !href.startsWith('//') && !href.includes('${') && !href.includes('{')) {
          routes.add(href.split('?')[0].split('#')[0])
        }
      }
    }
  }
}
findRoutes(join(root, 'src'))

// Known valid routes
const validRoutes = new Set([
  '/', '/about', '/contact', '/privacy', '/terms', '/a-z-index',
  '/financial-calculators', '/health-calculators', '/math-calculators',
  '/conversion-calculators', '/date-time-calculators', '/construction-calculators',
  '/statistics-calculators', '/education-calculators', '/physics-calculators',
  '/chemistry-calculators', '/engineering-calculators', '/everyday-calculators',
  '/food-calculators', '/biology-calculators', '/ecology-calculators',
  '/sports-calculators', '/editorial-policy', '/press',
])

// Check for static page files
const staticPages = ['about', 'contact', 'privacy', 'terms', 'a-z-index', 'editorial-policy', 'press']
for (const page of staticPages) {
  if (existsSync(join(root, 'src', 'app', page, 'page.tsx'))) {
    validRoutes.add(`/${page}`)
  }
}

// Check for 404 page
const has404 = existsSync(join(root, 'src', 'app', 'not-found', 'page.tsx'))
console.log(`404 page exists: ${has404 ? '✅ Yes' : '❌ No'}`)

// Check for error boundaries
const errorFiles = []
function findErrorFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== '.next') {
      findErrorFiles(fullPath)
    } else if (entry.name === 'error.tsx') {
      errorFiles.push(fullPath.replace(root, ''))
    }
  }
}
findErrorFiles(join(root, 'src', 'app'))
console.log(`Error boundaries: ${errorFiles.length} files found`)

// ============================================================
// 2. CHECK FOR DUPLICATE CONTENT / CANONICAL ISSUES
// ============================================================
console.log('\n=== 2. DUPLICATE CONTENT & CANONICALS ===\n')

// Check for pages with export const dynamic = 'force-static' that shouldn't
const forceStaticPages = []
function findForceStatic(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== '.next') {
      findForceStatic(fullPath)
    } else if (entry.name === 'page.tsx') {
      const content = readFileSync(fullPath, 'utf8')
      if (content.includes("export const dynamic = 'force-static'")) {
        forceStaticPages.push(fullPath.replace(root, ''))
      }
    }
  }
}
findForceStatic(join(root, 'src', 'app'))
console.log(`Pages with force-static: ${forceStaticPages.length}`)
for (const p of forceStaticPages) {
  console.log(`  ${p}`)
}

// Check for duplicate page.tsx files
const pageFiles = []
function findPageFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== '.next') {
      findPageFiles(fullPath)
    } else if (entry.name === 'page.tsx') {
      pageFiles.push(fullPath.replace(root, ''))
    }
  }
}
findPageFiles(join(root, 'src', 'app'))
console.log(`Total page.tsx files: ${pageFiles.length}`)

// ============================================================
// 3. CHECK FOR REDIRECT CHAINS
// ============================================================
console.log('\n=== 3. REDIRECT CHAINS ===\n')

// Check next.config.mjs for redirect rules
if (existsSync(join(root, 'next.config.mjs'))) {
  const config = readFileSync(join(root, 'next.config.mjs'), 'utf8')
  
  // Count redirects
  const redirectMatches = config.match(/redirects\s*[:=]/g)
  console.log(`Redirect definitions in next.config.mjs: ${redirectMatches ? redirectMatches.length : 0}`)
  
  // Check for potential redirect loops (A -> B -> A)
  const redirectEntries = config.matchAll(/source:\s*['"]([^'"]+)['"],\s*destination:\s*['"]([^'"]+)['"]/g)
  const redirects = []
  for (const match of redirectEntries) {
    redirects.push({ source: match[1], destination: match[2] })
  }
  
  // Check for redirect chains (A -> B -> C)
  const destSet = new Set(redirects.map(r => r.source))
  const chains = redirects.filter(r => destSet.has(r.destination))
  if (chains.length > 0) {
    console.log(`⚠️  Potential redirect chains:`)
    for (const c of chains) {
      console.log(`  ${c.source} -> ${c.destination}`)
      addIssue('warning', 'redirect-chain', 'next.config.mjs', `Chain: ${c.source} -> ${c.destination}`)
    }
  } else {
    console.log(`✅ No redirect chains detected`)
  }
  
  // Check for redirect loops
  const loops = redirects.filter(r => {
    const dest = r.destination.split('?')[0]
    return redirects.some(r2 => r2.source === dest && r2.destination.split('?')[0] === r.source.split('?')[0])
  })
  if (loops.length > 0) {
    console.log(`❌ Potential redirect loops:`)
    for (const l of loops) {
      console.log(`  ${l.source} -> ${l.destination}`)
      addIssue('critical', 'redirect-loop', 'next.config.mjs', `Loop: ${l.source} <-> ${l.destination}`)
    }
  }
} else {
  console.log(`❌ next.config.mjs not found`)
}

// ============================================================
// 4. CHECK SCHEMA MARKUP FOR ERRORS
// ============================================================
console.log('\n=== 4. SCHEMA MARKUP AUDIT ===\n')

// Check for Product schema (should be SoftwareApplication)
const schemaFiles = []
function findSchemaFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== '.next') {
      findSchemaFiles(fullPath)
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      const content = readFileSync(fullPath, 'utf8')
      if (content.includes('@type') && (content.includes('Schema') || content.includes('schema'))) {
        schemaFiles.push(fullPath.replace(root, ''))
      }
    }
  }
}
findSchemaFiles(join(root, 'src'))
console.log(`Schema files found: ${schemaFiles.length}`)

// Check for Product schema (Google rejects price: '0')
let productSchemaCount = 0
let softwareAppCount = 0
let webAppCount = 0
for (const file of schemaFiles) {
  const content = readFileSync(join(root, file), 'utf8')
  if (content.includes("'@type': 'Product'") || content.includes('"@type": "Product"')) {
    productSchemaCount++
    console.log(`❌ Product schema found in: ${file}`)
    addIssue('critical', 'schema', file, 'Product schema with price "0" causes Merchant listings errors in GSC')
  }
  if (content.includes("'@type': 'SoftwareApplication'") || content.includes('"@type": "SoftwareApplication"')) {
    softwareAppCount++
  }
  if (content.includes("'@type': 'WebApplication'") || content.includes('"@type": "WebApplication"')) {
    webAppCount++
  }
}
console.log(`Product schemas: ${productSchemaCount} ${productSchemaCount === 0 ? '✅' : '❌'}`)
console.log(`SoftwareApplication schemas: ${softwareAppCount} ✅`)
console.log(`WebApplication schemas: ${webAppCount} ✅`)

// Check for duplicate schema types on same page
for (const file of schemaFiles) {
  const content = readFileSync(join(root, file), 'utf8')
  const typeMatches = [...content.matchAll(/'@type':\s*'([^']+)'/g)]
  const types = typeMatches.map(m => m[1])
  const dups = types.filter((t, i) => types.indexOf(t) !== i)
  if (dups.length > 0) {
    console.log(`⚠️  Duplicate schema types in ${file}: ${[...new Set(dups)].join(', ')}`)
    addIssue('warning', 'schema', file, `Duplicate schema types: ${[...new Set(dups)].join(', ')}`)
  }
}

// ============================================================
// 5. CHECK FOR MISSING H1 TAGS
// ============================================================
console.log('\n=== 5. HEADING STRUCTURE ===\n')

let missingH1 = 0
let multipleH1 = 0
for (const file of pageFiles) {
  const content = readFileSync(join(root, file), 'utf8')
  const h1Matches = content.match(/<h1[\s>]/g) || []
  if (h1Matches.length === 0) {
    missingH1++
    console.log(`❌ No H1 in: ${file}`)
    addIssue('warning', 'headings', file, 'No H1 tag found')
  } else if (h1Matches.length > 1) {
    multipleH1++
    console.log(`⚠️  Multiple H1s in: ${file} (${h1Matches.length} H1s)`)
    addIssue('warning', 'headings', file, `Multiple H1 tags: ${h1Matches.length}`)
  }
}
console.log(`Missing H1: ${missingH1} ${missingH1 === 0 ? '✅' : '❌'}`)
console.log(`Multiple H1: ${multipleH1} ${multipleH1 === 0 ? '✅' : '⚠️'}`)

// ============================================================
// 6. CHECK FOR MISSING META DESCRIPTIONS
// ============================================================
console.log('\n=== 6. META DESCRIPTIONS ===\n')

let missingMeta = 0
for (const file of pageFiles) {
  const content = readFileSync(join(root, file), 'utf8')
  // Check if generateMetadata exists and returns description
  if (content.includes('generateMetadata')) {
    const hasDescription = content.includes('description') || content.includes('metaDescription')
    if (!hasDescription) {
      missingMeta++
      console.log(`⚠️  No description in metadata: ${file}`)
      addIssue('warning', 'metadata', file, 'No description in generateMetadata')
    }
  }
}
console.log(`Missing meta descriptions: ${missingMeta} ${missingMeta === 0 ? '✅' : '⚠️'}`)

// ============================================================
// 7. CHECK FOR INTERNAL LINKS TO NON-EXISTENT ROUTES
// ============================================================
console.log('\n=== 7. BROKEN LINKS ===\n')

const hardcodedLinks = new Set()
function checkLinks(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== '.next') {
      checkLinks(fullPath)
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      const content = readFileSync(fullPath, 'utf8')
      // Find hardcoded href="/..." links (not template literals)
      const matches = content.matchAll(/href=["'](\/[a-z][a-z0-9-]*(?:\/[a-z][a-z0-9-]*)*)["']/g)
      for (const match of matches) {
        const path = match[1]
        // Skip dynamic routes, API routes, external links
        if (path.includes('/api/') || path.includes('/search') || path.includes('/login') || path.includes('/register')) continue
        hardcodedLinks.add(path)
      }
    }
  }
}
checkLinks(join(root, 'src'))

let brokenLinks = 0
for (const link of hardcodedLinks) {
  // Check if route is valid (either static page or dynamic route pattern)
  const parts = link.split('/').filter(Boolean)
  
  // Check if it's a known static page
  if (validRoutes.has(link)) continue
  
  // Check if it matches a hub pattern
  if (parts.length === 1 && parts[0].endsWith('-calculators')) continue
  
  // Check if it matches a calculator pattern (hub/slug)
  if (parts.length === 2 && parts[0].endsWith('-calculators')) continue
  
  // Check if it's a special route (blog, author, etc.)
  if (['blog', 'author', 'calculator-builder', 'suggest-calculator', 'my-calculations'].includes(parts[0])) continue
  
  console.log(`❌ Potentially broken link: ${link}`)
  addIssue('critical', 'broken-link', 'various', `Link to non-existent route: ${link}`)
  brokenLinks++
}
console.log(`Potentially broken links: ${brokenLinks} ${brokenLinks === 0 ? '✅' : '❌'}`)

// ============================================================
// 8. CHECK FOR ORPHAN PAGES (no internal links)
// ============================================================
console.log('\n=== 8. ORPHAN PAGES ===\n')

// Pages that should be linked from somewhere
const importantPages = [
  '/about', '/contact', '/privacy', '/terms', '/a-z-index',
  '/editorial-policy', '/press',
]

// Check if these appear in Header or Footer
const headerFile = join(root, 'src', 'components', 'Header.tsx')
const footerFile = join(root, 'src', 'components', 'Footer.tsx')
const headerContent = existsSync(headerFile) ? readFileSync(headerFile, 'utf8') : ''
const footerContent = existsSync(footerFile) ? readFileSync(footerFile, 'utf8') : ''
const allNavContent = headerContent + footerContent

for (const page of importantPages) {
  if (!allNavContent.includes(page)) {
    console.log(`⚠️  Orphan page (not in header/footer): ${page}`)
    addIssue('warning', 'orphan', page, 'Page not linked from header or footer')
  }
}

// ============================================================
// 9. CHECK FOR CRAWL BUDGET WASTERS
// ============================================================
console.log('\n=== 9. CRAWL BUDGET ISSUES ===\n')

// Check for pages with noindex but still linked
const noindexPages = []
for (const file of pageFiles) {
  const content = readFileSync(join(root, file), 'utf8')
  if (content.includes('index: false') || content.includes('noindex')) {
    noindexPages.push(file.replace(root, ''))
  }
}
console.log(`Pages with noindex: ${noindexPages.length}`)
for (const p of noindexPages) {
  console.log(`  ${p}`)
}

// Check for empty pages or pages with very little content
let thinContent = 0
for (const file of pageFiles) {
  const content = readFileSync(join(root, file), 'utf8')
  // Count JSX text content (rough heuristic)
  const textContent = content.replace(/<[^>]+>/g, '').replace(/import.*$/gm, '').replace(/export.*$/gm, '').replace(/\s+/g, ' ').trim()
  if (textContent.length < 200 && !content.includes('generateStaticParams')) {
    thinContent++
    console.log(`⚠️  Thin content: ${file.replace(root, '')} (${textContent.length} chars)`)
    addIssue('warning', 'thin-content', file.replace(root, ''), `Very little text content (${textContent.length} chars)`)
  }
}
console.log(`Thin content pages: ${thinContent} ${thinContent === 0 ? '✅' : '⚠️'}`)

// Check for JavaScript files that shouldn't be served
const jsFiles = []
function findJsFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== '.next' && entry.name !== 'dist') {
      findJsFiles(fullPath)
    } else if (entry.name.endsWith('.js') && entry.name.includes('page')) {
      jsFiles.push(fullPath.replace(root, ''))
    }
  }
}
findJsFiles(join(root, 'src', 'app'))
if (jsFiles.length > 0) {
  console.log(`⚠️  .js page files found (should be .tsx):`)
  for (const f of jsFiles) {
    console.log(`  ${f}`)
    addIssue('warning', 'file-type', f, '.js page file should be .tsx')
  }
}

// ============================================================
// 10. CHECK FOR MIXED CONTENT (HTTP/HTTPS)
// ============================================================
console.log('\n=== 10. MIXED CONTENT ===\n')

let httpLinks = 0
for (const file of schemaFiles) {
  const content = readFileSync(join(root, file), 'utf8')
  const httpMatches = content.match(/http:\/\/[^\s'"]+/g) || []
  if (httpMatches.length > 0) {
    for (const match of httpMatches) {
      if (!match.includes('localhost') && !match.includes('127.0.0.1')) {
        console.log(`❌ HTTP link in schema: ${file} -> ${match}`)
        addIssue('critical', 'mixed-content', file, `HTTP link: ${match}`)
        httpLinks++
      }
    }
  }
}
console.log(`HTTP links in schemas: ${httpLinks} ${httpLinks === 0 ? '✅' : '❌'}`)

// ============================================================
// 11. CHECK FOR MISSING ALT TEXT ON IMAGES
// ============================================================
console.log('\n=== 11. IMAGE ALT TEXT ===\n')

let missingAlt = 0
function checkAltText(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== '.next') {
      checkAltText(fullPath)
    } else if (entry.name.endsWith('.tsx')) {
      const content = readFileSync(fullPath, 'utf8')
      const imgMatches = content.matchAll(/<img[^>]*>/g)
      for (const match of imgMatches) {
        if (!match[0].includes('alt=') && !match[0].includes('aria-hidden')) {
          missingAlt++
          console.log(`⚠️  Missing alt: ${fullPath.replace(root, '')}`)
          addIssue('warning', 'a11y', fullPath.replace(root, ''), 'Image missing alt attribute')
        }
      }
    }
  }
}
checkAltText(join(root, 'src'))
console.log(`Missing alt text: ${missingAlt} ${missingAlt === 0 ? '✅' : '⚠️'}`)

// ============================================================
// 12. CHECK FOR CLS (Layout Shift) ISSUES
// ============================================================
console.log('\n=== 12. LAYOUT SHIFT RISKS ===\n')

let clsRisks = 0
function checkCLS(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== '.next') {
      checkCLS(fullPath)
    } else if (entry.name.endsWith('.tsx')) {
      const content = readFileSync(fullPath, 'utf8')
      // Check for images without width/height
      const imgMatches = content.matchAll(/<img[^>]*>/g)
      for (const match of imgMatches) {
        if (!match[0].includes('width=') && !match[0].includes('height=') && !match[0].includes('fill')) {
          clsRisks++
          addIssue('warning', 'cls', fullPath.replace(root, ''), 'Image without explicit dimensions')
        }
      }
    }
  }
}
checkCLS(join(root, 'src'))
console.log(`CLS risks (images without dimensions): ${clsRisks} ${clsRisks === 0 ? '✅' : '⚠️'}`)

// ============================================================
// 13. CHECK FOR CRAWL TRAPS (INFINITE LOOPS)
// ============================================================
console.log('\n=== 13. CRAWL TRAPS ===\n')

// Check for pagination that could create infinite crawl paths
const paginationLinks = []
for (const file of pageFiles) {
  const content = readFileSync(join(root, file), 'utf8')
  if (content.includes('page=') || content.includes('pageNum') || content.includes('currentPage')) {
    paginationLinks.push(file.replace(root, ''))
  }
}
console.log(`Pages with pagination: ${paginationLinks.length}`)
for (const p of paginationLinks) {
  console.log(`  ${p}`)
}

// Check for pages with searchParams (dynamic rendering)
const searchParamPages = []
for (const file of pageFiles) {
  const content = readFileSync(join(root, file), 'utf8')
  if (content.includes('searchParams') && !file.includes('layout')) {
    searchParamPages.push(file.replace(root, ''))
  }
}
console.log(`Pages using searchParams: ${searchParamPages.length}`)
for (const p of searchParamPages) {
  console.log(`  ${p}`)
}

// ============================================================
// 14. CHECK ROBOTS.TXT
// ============================================================
console.log('\n=== 14. ROBOTS.TXT ===\n')

if (existsSync(join(root, 'src', 'app', 'robots.ts'))) {
  const robots = readFileSync(join(root, 'src', 'app', 'robots.ts'), 'utf8')
  console.log(`✅ robots.ts exists`)
  
  // Check for important directives
  if (robots.includes('sitemap')) {
    console.log(`✅ Sitemap referenced in robots`)
  } else {
    console.log(`⚠️  No sitemap referenced in robots`)
    addIssue('warning', 'robots', 'robots.ts', 'No sitemap URL referenced')
  }
  
  if (robots.includes('Disallow')) {
    const disallows = robots.match(/Disallow:\s*['"]([^'"]+)['"]/g) || []
    console.log(`Disallow rules: ${disallows.length}`)
    for (const d of disallows) {
      console.log(`  ${d}`)
    }
  }
} else {
  console.log(`❌ robots.ts not found`)
  addIssue('critical', 'robots', 'robots.ts', 'Missing robots.ts')
}

// ============================================================
// 15. CHECK SITEMAP
// ============================================================
console.log('\n=== 15. SITEMAP ===\n')

if (existsSync(join(root, 'src', 'app', 'sitemap.xml', 'route.ts'))) {
  console.log(`✅ sitemap.xml route exists`)
} else {
  console.log(`❌ sitemap.xml route not found`)
  addIssue('critical', 'sitemap', 'sitemap.xml', 'Missing sitemap.xml route')
}

if (existsSync(join(root, 'src', 'lib', 'sitemap-data.ts'))) {
  console.log(`✅ sitemap-data.ts exists`)
  const sitemapData = readFileSync(join(root, 'src', 'lib', 'sitemap-data.ts'), 'utf8')
  const shardMatches = sitemapData.match(/sitemapShardIds/g)
  console.log(`   Sitemap sharding: ${shardMatches ? 'Yes' : 'No'}`)
} else {
  console.log(`⚠️  sitemap-data.ts not found`)
}

// ============================================================
// 16. CHECK FOR NEXT.JS 16 SPECIFIC ISSUES
// ============================================================
console.log('\n=== 16. NEXT.JS 16 ISSUES ===\n')

// Check for dynamic = 'force-static' on catch-all route (causes locale bug)
const catchAll = join(root, 'src', 'app', '[...slug]', 'page.tsx')
if (existsSync(catchAll)) {
  const content = readFileSync(catchAll, 'utf8')
  if (content.includes("export const dynamic = 'force-static'")) {
    console.log(`❌ CRITICAL: force-static on catch-all route (breaks locale detection)`)
    addIssue('critical', 'nextjs', '[...slug]/page.tsx', 'force-static breaks locale detection')
  } else {
    console.log(`✅ Catch-all route does NOT use force-static (correct)`)
  }
} else {
  console.log(`⚠️  Catch-all route not found`)
}

// Check for middleware.ts (deprecated in Next.js 16)
if (existsSync(join(root, 'src', 'middleware.ts'))) {
  console.log(`⚠️  middleware.ts found (should use proxy.ts in Next.js 16)`)
  addIssue('warning', 'nextjs', 'middleware.ts', 'Deprecated in Next.js 16, use proxy.ts')
} else {
  console.log(`✅ No middleware.ts (correct for Next.js 16)`)
}

// Check for proxy.ts
if (existsSync(join(root, 'src', 'proxy.ts'))) {
  console.log(`✅ proxy.ts exists`)
} else {
  console.log(`❌ proxy.ts not found`)
  addIssue('critical', 'nextjs', 'proxy.ts', 'Missing proxy.ts for Next.js 16 i18n')
}

// ============================================================
// 17. CHECK FOR SPEED / PERFORMANCE ISSUES
// ============================================================
console.log('\n=== 17. PERFORMANCE ISSUES ===\n')

// Check for large client components
let largeComponents = 0
function checkComponentSize(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== '.next') {
      checkComponentSize(fullPath)
    } else if (entry.name.endsWith('.tsx')) {
      const stats = { size: readFileSync(fullPath).length }
      if (stats.size > 50000) { // >50KB
        largeComponents++
        console.log(`⚠️  Large component: ${fullPath.replace(root, '')} (${(stats.size / 1024).toFixed(1)}KB)`)
        addIssue('warning', 'performance', fullPath.replace(root, ''), `Large file: ${(stats.size / 1024).toFixed(1)}KB`)
      }
    }
  }
}
checkComponentSize(join(root, 'src'))
console.log(`Large components (>50KB): ${largeComponents} ${largeComponents === 0 ? '✅' : '⚠️'}`)

// ============================================================
// SUMMARY
// ============================================================
console.log('\n' + '='.repeat(60))
console.log('SEO AUDIT SUMMARY')
console.log('='.repeat(60))

const critical = issues.filter(i => i.severity === 'critical')
const warnings = issues.filter(i => i.severity === 'warning')
const info = issues.filter(i => i.severity === 'info')

console.log(`\n🔴 Critical: ${critical.length}`)
console.log(`🟡 Warnings: ${warnings.length}`)
console.log(`ℹ️  Info: ${info.length}`)

if (critical.length > 0) {
  console.log(`\n🔴 CRITICAL ISSUES:`)
  for (const issue of critical) {
    console.log(`  [${issue.category}] ${issue.description}`)
    console.log(`    File: ${issue.file}`)
  }
}

if (warnings.length > 0) {
  console.log(`\n🟡 WARNINGS:`)
  for (const issue of warnings) {
    console.log(`  [${issue.category}] ${issue.description}`)
  }
}

console.log(`\n${'='.repeat(60)}`)
console.log(`Total issues: ${issues.length}`)
console.log(`${'='.repeat(60)}`)
