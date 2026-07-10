import { readFileSync, readdirSync, existsSync, writeFileSync } from 'fs';
import { join, relative, extname, resolve } from 'path';
import { pathToFileURL, fileURLToPath } from 'url';

const ROOT = fileURLToPath(new URL('../.next/server/app', import.meta.url));
const REPORT_PATH = fileURLToPath(new URL('../a11y-report.json', import.meta.url));

function walk(dir) {
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.html')) check(full);
    }
  } catch {}
}

function extractAttr(html, tagPattern, attr) {
  const re = new RegExp(`<${tagPattern}[^>]*${attr}=["']([^"']*)["']`, 'gi');
  const values = [];
  let m;
  while ((m = re.exec(html)) !== null) values.push(m[1]);
  return values;
}

function hasAttr(html, tagPattern, attr) {
  return new RegExp(`<${tagPattern}[^>]*${attr}`, 'i').test(html);
}

// --- Color contrast sample check ---------------------------------------------
// Tailwind `gray` palette hex values, used for a sample contrast audit.
const GRAY_HEX = {
  50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db',
  400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151',
  800: '#1f2937', 900: '#111827', 950: '#030712',
};

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function relativeLuminance([r, g, b]) {
  const lin = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastRatio(fg, bg) {
  const l1 = relativeLuminance(hexToRgb(fg));
  const l2 = relativeLuminance(hexToRgb(bg));
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

function classContrastIssues(html) {
  const issues = [];
  // Match class="...text-gray-XXX ... bg-gray-YYY ..." pairs.
  const classRe = /class=["']([^"']*)["']/gi;
  let m;
  while ((m = classRe.exec(html)) !== null) {
    const cls = m[1];
    const textMatch = cls.match(/\btext-gray-(\d{2,3})\b/);
    const bgMatch = cls.match(/\bbg-gray-(\d{2,3})\b/);
    if (textMatch && bgMatch) {
      const fg = GRAY_HEX[textMatch[1]];
      const bg = GRAY_HEX[bgMatch[1]];
      if (fg && bg) {
        const ratio = contrastRatio(fg, bg);
        if (ratio < 4.5) {
          issues.push(`Low contrast text-gray-${textMatch[1]} on bg-gray-${bgMatch[1]} (ratio ${ratio.toFixed(2)} < 4.5)`);
        }
      }
    }
  }
  return issues;
}

// --- Main checker ------------------------------------------------------------
const ISSUES = [];

function check(file) {
  const html = readFileSync(file, 'utf8');
  const rel = relative(ROOT, file);

  // 1. Missing lang attribute on <html>
  if (!hasAttr(html, 'html', 'lang')) {
    ISSUES.push({ file: rel, issue: 'Missing lang attribute on <html>', severity: 'critical' });
  }

  // 2. <img> without alt
  const imgPattern = /<img\s[^>]*src=["'][^"']*["'][^>]*>/gi;
  let m;
  while ((m = imgPattern.exec(html)) !== null) {
    const tag = m[0];
    if (!/alt\s*=/i.test(tag)) {
      const srcMatch = tag.match(/src=["']([^"']*)["']/i);
      ISSUES.push({ file: rel, issue: `Missing alt on img: ${srcMatch?.[1]?.slice(0, 60) || 'unknown'}`, severity: 'critical' });
    }
  }

  // 3. Form <input> without associated label / aria-label
  const inputPattern = /<input\s[^>]*type=["'](?!hidden)[^"']*["'][^>]*>/gi;
  while ((m = inputPattern.exec(html)) !== null) {
    const tag = m[0];
    const idMatch = tag.match(/id\s*=\s*["']([^"']*)["']/i);
    if (!/aria-label\s*=/i.test(tag) && !idMatch) {
      ISSUES.push({ file: rel, issue: 'Input missing both id and aria-label', severity: 'critical' });
    } else if (idMatch) {
      const forRe = new RegExp(`<label[^>]*for=["']${idMatch[1]}["']`, 'i');
      if (!forRe.test(html) && !/aria-label\s*=/i.test(tag)) {
        ISSUES.push({ file: rel, issue: `Input id="${idMatch[1]}" has no associated <label> or aria-label`, severity: 'critical' });
      }
    }
  }

  // 4. <select> without associated label / aria-label
  const selectPattern = /<select\s[^>]*>/gi;
  while ((m = selectPattern.exec(html)) !== null) {
    const tag = m[0];
    const idMatch = tag.match(/id\s*=\s*["']([^"']*)["']/i);
    if (!/aria-label\s*=/i.test(tag) && !idMatch) {
      ISSUES.push({ file: rel, issue: 'Select missing both id and aria-label', severity: 'critical' });
    } else if (idMatch) {
      const forRe = new RegExp(`<label[^>]*for=["']${idMatch[1]}["']`, 'i');
      if (!forRe.test(html) && !/aria-label\s*=/i.test(tag)) {
        ISSUES.push({ file: rel, issue: `Select id="${idMatch[1]}" has no associated <label> or aria-label`, severity: 'critical' });
      }
    }
  }

  // 5. aria-expanded buttons without accessible name
  const expandedBtnPattern = /<button[^>]*aria-expanded[^>]*>/gi;
  while ((m = expandedBtnPattern.exec(html)) !== null) {
    const tag = m[0];
    if (!/aria-label\s*=/i.test(tag) && !/aria-labelledby\s*=/i.test(tag)) {
      const content = tag.replace(/<button[^>]*>/, '').replace(/<\/button>$/, '').trim();
      if (!content || content.length < 2) {
        ISSUES.push({ file: rel, issue: 'Button with aria-expanded but no accessible name', severity: 'critical' });
      }
    }
  }

  // 6. Heading hierarchy (no skipped levels h1 -> h3)
  const levels = [];
  const hTagRe = /<h([1-6])[^>]*>/gi;
  while ((m = hTagRe.exec(html)) !== null) levels.push(parseInt(m[1]));
  let max = 0;
  for (const l of levels) {
    if (l > max + 1 && max > 0) {
      ISSUES.push({ file: rel, issue: `Skipped heading: h${max} → h${l}`, severity: 'warning' });
      break;
    }
    max = Math.max(max, l);
  }

  // 7. Icon-only buttons without aria-label
  const iconBtnPattern = /<button[^>]*>([\s\S]*?)<\/button>/gi;
  while ((m = iconBtnPattern.exec(html)) !== null) {
    const tag = m[0];
    const content = m[1].trim();
    if (/svg/i.test(content) && !/aria-label\s*=/i.test(tag) && content.length < 20) {
      ISSUES.push({ file: rel, issue: 'Icon-only button without aria-label', severity: 'critical' });
    }
  }

  // 8. Color contrast (sample: gray palette)
  for (const c of classContrastIssues(html)) {
    ISSUES.push({ file: rel, issue: c, severity: 'critical' });
  }
}

// --- Orchestration -----------------------------------------------------------
export function runA11yChecks() {
  ISSUES.length = 0;
  walk(ROOT);
  walk(join(ROOT, '..'));

  const critical = ISSUES.filter((i) => i.severity === 'critical');
  const warnings = ISSUES.filter((i) => i.severity === 'warning');

  const byIssue = {};
  for (const { file, issue } of ISSUES) {
    if (!byIssue[issue]) byIssue[issue] = [];
    byIssue[issue].push(file);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      total: ISSUES.length,
      critical: critical.length,
      warnings: warnings.length,
      categories: Object.keys(byIssue).length,
    },
    byIssue,
    issues: ISSUES,
  };

  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  return report;
}

// Run directly when executed (not when imported).
const _isMain = !!process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;
if (_isMain) {
  const report = runA11yChecks();
  if (report.summary.total === 0) {
    console.log('✅ No accessibility issues found in built pages.');
  } else {
    console.log(`🔴 Found ${report.summary.total} issues (${report.summary.critical} critical, ${report.summary.warnings} warnings):\n`);
    for (const [issue, files] of Object.entries(report.byIssue)) {
      console.log(`  ${issue}`);
      for (const f of files.slice(0, 3)) console.log(`    → ${f}`);
      if (files.length > 3) console.log(`    → ... and ${files.length - 3} more`);
      console.log();
    }
    console.log(`Total: ${report.summary.total} issues across ${report.summary.categories} categories`);
  }
  console.log(`Report written to a11y-report.json`);
  process.exit(report.summary.critical > 0 ? 1 : 0);
}
