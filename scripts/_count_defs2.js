const fs = require('fs');
const path = require('path');

// Map hub slugs to their calculator files
const hubFiles = {
  'financial-calculators': 'GenericFinancialCalculator.tsx',
  'health-calculators': 'GenericHealthCalculator.tsx',
  'math-calculators': 'GenericMathCalculator.tsx',
  'conversion-calculators': 'GenericConversionCalculator.tsx',
  'date-time-calculators': 'GenericDateTimeCalculator.tsx',
  'construction-calculators': 'GenericConstructionCalculator.tsx',
  'statistics-calculators': 'GenericStatisticsCalculator.tsx',
  'education-calculators': 'GenericEducationCalculator.tsx',
  'physics-calculators': 'GenericPhysicsCalculator.tsx',
  'chemistry-calculators': 'GenericChemistryCalculator.tsx',
  'engineering-calculators': 'GenericEngineeringCalculator.tsx',
  'everyday-calculators': 'GenericEverydayCalculator.tsx',
  'food-calculators': 'GenericFoodCalculator.tsx',
  'biology-calculators': 'GenericBiologyCalculator.tsx',
  'ecology-calculators': 'GenericEcologyCalculator.tsx',
  'sports-calculators': 'GenericSportsCalculator.tsx',
};

const dir = 'src/components/hub-calculators';

// Count all slugs in registry grouped by hub
const registryContent = fs.readFileSync('packages/calculator-registry/src/registry.ts', 'utf8');
const registryByHub = {};
let currentHub = null;
const hubSlugRegex = /hubSlug:\s*['"]([^'"]+)['"]/g;
// Get all hub slugs
const hubs = [...registryContent.matchAll(/hubSlug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);

// Read the whole file line by line to track slugs per hub
const lines = registryContent.split('\n');
let curSlug = null;
let curHub = null;
for (const line of lines) {
  const slugM = line.match(/slug:\s*['"]([^'"]+)['"]/);
  if (slugM) curSlug = slugM[1];
  const hubM = line.match(/hubSlug:\s*['"]([^'"]+)['"]/);
  if (hubM) curHub = hubM[1];
  if (curSlug && curHub) {
    if (!registryByHub[curHub]) registryByHub[curHub] = [];
    registryByHub[curHub].push(curSlug);
  }
}

// Count entries in each hub file by extracting slug patterns from calcDefs
console.log('calcDef counts per hub:');
console.log('');

for (const [hub, file] of Object.entries(hubFiles)) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) {
    console.log(hub + ': FILE NOT FOUND');
    continue;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Count calcDef entries - they can be either:
  // 1. calcDefs['slug'] = { or calcDefs["slug"] = {
  // 2. 'slug': {  (inside a calcDefs = { ... } object literal)
  const bracketAssign = (content.match(/calcDefs\s*\[\s*['"][^'"]+['"]\s*\]\s*=\s*\{/g) || []).length;
  const objectProps = (content.match(/^\s*['"][a-z][a-z0-9-]*['"]\s*:/gm) || []).length;
  
  // Better approach: find slug patterns in context of calcDefs
  // Look for slug strings that appear as property keys or array indices of calcDefs
  const slugPattern = /['"][a-z][a-z0-9-]*['"]\s*[=:]/g;
  let allSlugs = [];
  let m;
  while ((m = slugPattern.exec(content)) !== null) {
    const slug = m[0].replace(/['"]/g, '').replace(/\s*[=:]\s*$/, '');
    allSlugs.push(slug);
  }
  
  // Deduplicate
  const uniqueSlugs = [...new Set(allSlugs)];
  
  // Filter to only those that look like calculator slugs
  const calcSlugs = uniqueSlugs.filter(s => /^[a-z][a-z0-9-]/.test(s) && s.length > 3);
  
  const registryCount = (registryByHub[hub] || []).length;
  const calcDefCount = calcSlugs.length;
  const gap = registryCount - calcDefCount;
  const pct = registryCount > 0 ? Math.round((calcDefCount / registryCount) * 100) : 0;
  
  console.log(hub + ': ' + calcDefCount + ' calcDefs vs ' + registryCount + ' registry (' + pct + '%)');
  if (gap > 0) console.log('  MISSING: ' + gap + ' need calcDefs');
}
