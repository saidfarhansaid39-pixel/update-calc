import { readFileSync, readdirSync, existsSync } from 'fs'
import { join, relative, extname } from 'path'

const ROOT = new URL('../.next/server/app', import.meta.url).pathname
const ISSUES = []

function walk(dir) {
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (entry.name.endsWith('.html')) check(full)
    }
  } catch {}
}

function extractAttr(html, tagPattern, attr) {
  const re = new RegExp(`<${tagPattern}[^>]*${attr}=["']([^"']*)["']`, 'gi')
  const values = []
  let m
  while ((m = re.exec(html)) !== null) values.push(m[1])
  return values
}

function hasAttr(html, tagPattern, attr) {
  return new RegExp(`<${tagPattern}[^>]*${attr}`, 'i').test(html)
}

function check(file) {
  const html = readFileSync(file, 'utf8')
  const rel = relative(ROOT, file)

  // 1. Check for missing lang attribute on <html>
  if (!hasAttr(html, 'html', 'lang')) {
    ISSUES.push({ file: rel, issue: 'Missing lang attribute on <html>' })
  }

  // 2. Check for <img> without alt
  const imgPattern = /<img\s[^>]*src=["'][^"']*["'][^>]*>/gi
  let m
  while ((m = imgPattern.exec(html)) !== null) {
    const tag = m[0]
    if (!/alt\s*=/i.test(tag)) {
      const srcMatch = tag.match(/src=["']([^"']*)["']/i)
      ISSUES.push({ file: rel, issue: `Missing alt on img: ${srcMatch?.[1]?.slice(0, 60) || 'unknown'}` })
    }
  }

  // 3. Check for inputs without aria-label or associated label
  const inputPattern = /<input\s[^>]*type=["'](?!hidden)[^"']*["'][^>]*>/gi
  while ((m = inputPattern.exec(html)) !== null) {
    const tag = m[0]
    if (!/aria-label\s*=/i.test(tag) && !/id\s*=/i.test(tag)) {
      ISSUES.push({ file: rel, issue: `Input missing both id and aria-label` })
    }
  }

  // 4. Check for aria-expanded buttons without accessible name
  const expandedBtnPattern = /<button[^>]*aria-expanded[^>]*>/gi
  while ((m = expandedBtnPattern.exec(html)) !== null) {
    const tag = m[0]
    if (!/aria-label\s*=/i.test(tag) && !/aria-labelledby\s*=/i.test(tag)) {
      const content = tag.replace(/<button[^>]*>/, '').replace(/<\/button>$/, '').trim()
      if (!content || content.length < 2) {
        ISSUES.push({ file: rel, issue: `Button with aria-expanded but no accessible name` })
      }
    }
  }

  // 5. Check heading hierarchy
  const levels = []
  const hTagRe = /<h([1-6])[^>]*>/gi
  while ((m = hTagRe.exec(html)) !== null) levels.push(parseInt(m[1]))
  let max = 0
  for (const l of levels) {
    if (l > max + 1 && max > 0) {
      const textMatch = html.slice(m.index).match(/>([^<]*)</)
      ISSUES.push({ file: rel, issue: `Skipped heading: h${max} → h${l}` })
      break
    }
    max = Math.max(max, l)
  }

  // 6. Check for icon buttons without aria-label
  const iconBtnPattern = /<button[^>]*>([\s\S]*?)<\/button>/gi
  while ((m = iconBtnPattern.exec(html)) !== null) {
    const tag = m[0]
    const content = m[1].trim()
    if (/svg/i.test(content) && !/aria-label\s*=/i.test(tag) && content.length < 20) {
      ISSUES.push({ file: rel, issue: `Icon-only button without aria-label` })
    }
  }
}

// Walk
walk(ROOT)

// Also check top-level pages
const topDir = join(ROOT, '..')
walk(topDir)

if (ISSUES.length === 0) {
  console.log('✅ No accessibility issues found in built pages.')
} else {
  console.log(`🔴 Found ${ISSUES.length} issues:\n`)
  const byIssue = {}
  for (const { file, issue } of ISSUES) {
    if (!byIssue[issue]) byIssue[issue] = []
    byIssue[issue].push(file)
  }
  for (const [issue, files] of Object.entries(byIssue)) {
    console.log(`  ${issue}`)
    for (const f of files.slice(0, 3)) console.log(`    → ${f}`)
    if (files.length > 3) console.log(`    → ... and ${files.length - 3} more`)
    console.log()
  }
  console.log(`\nTotal: ${ISSUES.length} issues across ${Object.keys(byIssue).length} categories`)
}
