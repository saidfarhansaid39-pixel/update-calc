// Extract missing slugs with full registry data as JSON per hub
const fs = require('fs');

const reg = fs.readFileSync('packages/calculator-registry/src/registry.ts', 'utf8');

// Extract all registry entries with full data
const entries = [];
const lines = reg.split('\n');
let cur = {};
for (const l of lines) {
  const slugM = l.match(/slug:\s*'([^']+)'/);
  const titleM = l.match(/title:\s*'([^']+)'/);
  const descM = l.match(/description:\s*'([^']+)'/);
  const hubM = l.match(/hubSlug:\s*'([^']+)'/);
  const tierM = l.match(/tier:\s*'([^']+)'/);
  const kwM = l.match(/keywords:\s*\[([^\]]+)\]/);
  if (slugM) cur.slug = slugM[1];
  if (titleM) cur.title = titleM[1];
  if (descM) cur.description = descM[1];
  if (hubM) cur.hubSlug = hubM[1];
  if (tierM) cur.tier = tierM[1];
  if (kwM) cur.keywords = kwM[1].split(',').map(k => k.trim().replace(/['"]/g, ''));
  if (l.includes('},') && cur.slug && cur.hubSlug) {
    entries.push({ ...cur });
    cur = {};
  }
}

// Group by hub
const byHub = {};
for (const e of entries) {
  if (!byHub[e.hubSlug]) byHub[e.hubSlug] = [];
  byHub[e.hubSlug].push(e);
}

// Extract existing slugs from each hub file
const files = {
  'date-time-calculators': 'src/components/hub-calculators/GenericDateTimeCalculator.tsx',
  'education-calculators': 'src/components/hub-calculators/GenericEducationCalculator.tsx',
  'food-calculators': 'src/components/hub-calculators/GenericFoodCalculator.tsx',
  'engineering-calculators': 'src/components/hub-calculators/GenericEngineeringCalculator.tsx',
  'everyday-calculators': 'src/components/hub-calculators/everyday-data.tsx',
  'financial-calculators': 'src/components/hub-calculators/GenericFinancialCalculator.tsx',
  'health-calculators': 'src/components/hub-calculators/GenericHealthCalculator.tsx',
  'conversion-calculators': 'src/components/hub-calculators/GenericConversionCalculator.tsx',
  'math-calculators': 'src/components/hub-calculators/GenericMathCalculator.tsx',
};

function extractExisting(filePath) {
  if (!fs.existsSync(filePath)) return new Set();
  const c = fs.readFileSync(filePath, 'utf8');
  const slugs = new Set();
  // calcDefs['slug'] pattern
  let re = /calcDefs\s*\[\s*[']([^']+)['"]\s*\]\s*=\s*\{/g;
  let m;
  while ((m = re.exec(c)) !== null) slugs.add(m[1]);
  // 'slug': { pattern
  re = /^\s*[']([a-z][a-z0-9-]+)[']\s*:/gm;
  while ((m = re.exec(c)) !== null) slugs.add(m[1]);
  // everydayFormulas pattern
  re = /\s+([a-z][a-z0-9-]+):\s*\{/g;
  while ((m = re.exec(c)) !== null) slugs.add(m[1]);
  // calcTypeMap entries
  re = /^\s*[']([a-z][a-z0-9-]+)[']\s*:\s*['][a-z]+['],/gm;
  while ((m = re.exec(c)) !== null) slugs.add(m[1]);
  return slugs;
}

// For each hub, find missing non-auto slugs and write JSON
const outputDir = 'scripts/missing_json';
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

for (const [hub, hubEntries] of Object.entries(byHub)) {
  const filePath = files[hub];
  if (!filePath) continue;
  const existing = extractExisting(filePath);
  const missing = hubEntries.filter(e => !existing.has(e.slug) && !/-\d+$/.test(e.slug));
  const autoGen = hubEntries.filter(e => !existing.has(e.slug) && /-\d+$/.test(e.slug));
  
  if (missing.length > 0) {
    const filename = hub.replace('-calculators', '') + '_missing.json';
    fs.writeFileSync(outputDir + '/' + filename, JSON.stringify(missing, null, 2));
    console.log(hub + ': ' + missing.length + ' missing (non-auto) -> ' + filename);
  }
}

console.log('\nDone. Check scripts/missing_json/ for per-hub JSON files.');
