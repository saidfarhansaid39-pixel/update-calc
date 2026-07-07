const fs = require('fs');

// Get all registry slugs per hub
const reg = fs.readFileSync('packages/calculator-registry/src/registry.ts', 'utf8');
const slugsByHub = {};
const lines = reg.split('\n');
let curS = null, curH = null;
for (const l of lines) {
  const sm = l.match(/slug:\s*['"]([^'"]+)['"]/);
  if (sm) curS = sm[1];
  const hm = l.match(/hubSlug:\s*['"]([^'"]+)['"]/);
  if (hm) curH = hm[1];
  if (curS && curH) {
    const slug = curS;
    // remove numeric suffix auto-generated variants
    const isAutoGen = /-\d+$/.test(slug);
    if (!slugsByHub[curH]) slugsByHub[curH] = [];
    slugsByHub[curH].push({ slug, isAutoGen });
  }
}

// Which hub files use which format
const fileInfo = {
  'physics-calculators': { file: 'GenericPhysicsCalculator.tsx', fmt: 'assign' },
  'chemistry-calculators': { file: 'GenericChemistryCalculator.tsx', fmt: 'assign' },
  'biology-calculators': { file: 'GenericBiologyCalculator.tsx', fmt: 'assign' },
  'ecology-calculators': { file: 'GenericEcologyCalculator.tsx', fmt: 'assign' },
  'statistics-calculators': { file: 'GenericStatisticsCalculator.tsx', fmt: 'assign' },
  'sports-calculators': { file: 'GenericSportsCalculator.tsx', fmt: 'assign' },
  'math-calculators': { file: 'GenericMathCalculator.tsx', fmt: 'object' },
  'financial-calculators': { file: 'GenericFinancialCalculator.tsx', fmt: 'unknown' },
  'health-calculators': { file: 'GenericHealthCalculator.tsx', fmt: 'unknown' },
  'conversion-calculators': { file: 'GenericConversionCalculator.tsx', fmt: 'unknown' },
  'date-time-calculators': { file: 'GenericDateTimeCalculator.tsx', fmt: 'unknown' },
  'construction-calculators': { file: 'GenericConstructionCalculator.tsx', fmt: 'unknown' },
  'education-calculators': { file: 'GenericEducationCalculator.tsx', fmt: 'unknown' },
  'engineering-calculators': { file: 'GenericEngineeringCalculator.tsx', fmt: 'unknown' },
  'everyday-calculators': { file: 'GenericEverydayCalculator.tsx', fmt: 'unknown' },
  'food-calculators': { file: 'GenericFoodCalculator.tsx', fmt: 'unknown' },
};

const dir = 'src/components/hub-calculators';

for (const [hub, fi] of Object.entries(fileInfo)) {
  const fp = dir + '/' + fi.file;
  if (!fs.existsSync(fp)) { console.log(hub + ': no file'); continue; }
  const content = fs.readFileSync(fp, 'utf8');
  
  // For assign format: extract slugs from calcDefs['slug'] = {
  const existingSlugs = new Set();
  if (fi.fmt === 'assign' || fi.fmt === 'unknown') {
    const re = /calcDefs\s*\[\s*['"]([^'"]+)['"]\s*\]\s*=\s*\{/g;
    let m;
    while ((m = re.exec(content)) !== null) existingSlugs.add(m[1]);
  }
  
  const registry = slugsByHub[hub] || [];
  const missing = registry.filter(x => !existingSlugs.has(x.slug) && !x.isAutoGen).map(x => x.slug);
  const autoGenMissing = registry.filter(x => !existingSlugs.has(x.slug) && x.isAutoGen).map(x => x.slug);
  
  if (fi.fmt === 'unknown' && existingSlugs.size === 0) {
    // Try object pattern too
    const objRe = /^\s*['"]([a-z][a-z0-9-]+)['"]\s*:/gm;
    let m;
    while ((m = objRe.exec(content)) !== null) existingSlugs.add(m[1]);
    const missing2 = registry.filter(x => !existingSlugs.has(x.slug)).map(x => x.slug);
    if (missing2.length < missing.length) {
      console.log(hub + ': uses object pattern');
    }
  }
  
  if (existingSlugs.size > 0) {
    const missingNonAuto = registry.filter(x => !existingSlugs.has(x.slug) && !x.isAutoGen).map(x => x.slug);
    const missingAuto = registry.filter(x => !existingSlugs.has(x.slug) && x.isAutoGen).map(x => x.slug);
    const hasDefs = registry.filter(x => existingSlugs.has(x.slug)).length;
    console.log(hub + ': ' + hasDefs + '/' + registry.length + ' defs (' + Math.round(hasDefs/registry.length*100) + '%)');
    console.log('  Missing non-auto: ' + missingNonAuto.length);
    console.log('  Missing auto-gen: ' + missingAuto.length);
    if (missingNonAuto.length > 0 && missingNonAuto.length <= 10) {
      console.log('  Missing slugs: ' + missingNonAuto.join(', '));
    }
  } else {
    console.log(hub + ': COULD NOT DETECT FORMAT (0 matches) — ' + registry.length + ' reg entries');
  }
}
