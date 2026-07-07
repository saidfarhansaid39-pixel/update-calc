const fs = require('fs');
const reg = fs.readFileSync('packages/calculator-registry/src/registry.ts', 'utf8');

// Extract everyday hub slugs: match entries with hubSlug: 'everyday-calculators'
const everydaySlugs = [];
const entryRe = /\{\s*slug:\s*'([^']+)'[\s\S]*?hubSlug:\s*'everyday-calculators'/g;
let m;
while ((m = entryRe.exec(reg)) !== null) {
  everydaySlugs.push(m[1]);
}
console.log('Registry everyday slugs:', everydaySlugs.length);

// Read calcTypeMap from GenericEverydayCalculator
const calcSrc = fs.readFileSync('src/components/hub-calculators/GenericEverydayCalculator.tsx', 'utf8');
const mapMatch = calcSrc.match(/const calcTypeMap: Record<string, CalcType> = \{([\s\S]*?)\n\}/);
const mapLines = mapMatch[1].split('\n');
const mappedSlugs = new Set();
mapLines.forEach(l => {
  const mm = l.match(/'([^']+)':\s*'([^']+)'/);
  if (mm) mappedSlugs.add(mm[1]);
});
console.log('calcTypeMap entries:', mappedSlugs.size);

// Find missing
const missing = everydaySlugs.filter(s => !mappedSlugs.has(s));
console.log('Missing from calcTypeMap:', missing.length);
missing.forEach(s => console.log('  MISSING:', s));

// Also check if they have entries in everydayFormulas
const formulaSrc = fs.readFileSync('src/components/hub-calculators/everyday-data.tsx', 'utf8');
const formulaMatch = formulaSrc.match(/export const everydayFormulas[^=]*=\s*\{([\s\S]*?)\};/);
const formulaLines = formulaMatch[1].split('\n');
const formulaKeys = new Set();
formulaLines.forEach(l => {
  const mm = l.match(/^\s+([a-z][\w-]*):/);
  if (mm) formulaKeys.add(mm[1]);
});
console.log('everydayFormulas keys:', formulaKeys.size);

// For missing slugs, check if they have formula entries
const calcTypeToShort = {};
mapLines.forEach(l => {
  const mm = l.match(/'([^']+)':\s*'([^']+)'/);
  if (mm) calcTypeToShort[mm[2]] = mm[1];
});

// Check each registry slug in formulas by looking up the mapped short key
const formulaMissing = everydaySlugs.filter(s => {
  const short = calcTypeToShort[Object.entries(calcTypeToShort).find(([,v]) => v === s)?.[0] || ''];
  // Actually let's reverse map
  return false;
});

// Output all missing
console.log('\n--- Missing analysis ---');
// For each missing slug, find if it's auto-generated (ends with -digit)
missing.forEach(s => {
  const isAuto = /\d$/.test(s);
  console.log(`  ${s}${isAuto ? ' (AUTO)' : ''}`);
});

// Build summary
const autoMissing = missing.filter(s => /\d$/.test(s));
const nonAutoMissing = missing.filter(s => !(/\d$/.test(s)));
console.log(`\nTotal registry everyday: ${everydaySlugs.length}`);
console.log(`Total calcTypeMap: ${mappedSlugs.size}`);
console.log(`Total missing: ${missing.length}`);
console.log(`  Auto-generated missing: ${autoMissing.length}`);
console.log(`  Non-auto missing: ${nonAutoMissing.length}`);
