// Extract exact missing slugs per hub by comparing registry vs calcDef files
const fs = require('fs');
const path = require('path');

// Read registry
const regPath = 'packages/calculator-registry/src/registry.ts';
let regContent = fs.readFileSync(regPath, 'utf8');

// Extract calculator entries from registry
// They're in arrays like: { slug: 'bmi-calculator', title: 'BMI', hub: 'health', ... }
const slugHubMap = {};
const slugPattern = /slug:\s*'([^']+)'/g;
const hubPattern = /hub:\s*'([^']+)'/g;

// Read registry more carefully - extract all entries
const entries = regContent.split('\n');
let currentEntry = '';
let currentSlug = '';
let currentHub = '';
for (let i = 0; i < entries.length; i++) {
  const line = entries[i];
  const slugMatch = line.match(/slug:\s*'([^']+)'/);
  if (slugMatch) currentSlug = slugMatch[1];
  const hubMatch = line.match(/hub:\s*'([^']+)'/);
  if (hubMatch) currentHub = hubMatch[1];
  if (line.trim() === '},' || line.trim() === ']') {
    if (currentSlug && currentHub) {
      slugHubMap[currentSlug] = currentHub;
    }
    currentSlug = '';
    currentHub = '';
  }
}

// Group slugs by hub
const hubToSlugs = {};
for (const [slug, hub] of Object.entries(slugHubMap)) {
  if (!hubToSlugs[hub]) hubToSlugs[hub] = [];
  hubToSlugs[hub].push(slug);
}

console.log('Total registry entries:', Object.keys(slugHubMap).length);
console.log('Hubs:', Object.keys(hubToSlugs).length);

// Now read each calcDef file and extract existing slugs
const hubFiles = {
  'financial-calculators': 'src/components/hub-calculators/GenericFinancialCalculator.tsx',
  'health-calculators': 'src/components/hub-calculators/GenericHealthCalculator.tsx',
  'math-calculators': 'src/components/hub-calculators/GenericMathCalculator.tsx',
  'conversion-calculators': 'src/components/hub-calculators/GenericConversionCalculator.tsx',
  'date-time-calculators': 'src/components/hub-calculators/GenericDateTimeCalculator.tsx',
  'education-calculators': 'src/components/hub-calculators/GenericEducationCalculator.tsx',
  'engineering-calculators': 'src/components/hub-calculators/GenericEngineeringCalculator.tsx',
  'everyday-calculators': 'src/components/hub-calculators/everyday-data.tsx',
  'food-calculators': 'src/components/hub-calculators/GenericFoodCalculator.tsx',
};

function extractSlugs(filePath) {
  if (!fs.existsSync(filePath)) return [];
  let content = fs.readFileSync(filePath, 'utf8');
  const slugs = [];
  // Match both patterns: 'slug': { and calcDefs['slug']
  const pat1 = /'([a-z0-9][a-z0-9-]*[a-z0-9])'\s*:\s*\{/g;
  const pat2 = /calcDefs\['([a-z0-9][a-z0-9-]*[a-z0-9])'\]/g;
  let m;
  while ((m = pat1.exec(content)) !== null) slugs.push(m[1]);
  while ((m = pat2.exec(content)) !== null) slugs.push(m[1]);
  return [...new Set(slugs)];
}

for (const [hub, filePath] of Object.entries(hubFiles)) {
  const existing = extractSlugs(filePath);
  const registered = hubToSlugs[hub] || [];
  const missing = registered.filter(s => !existing.includes(s));
  // Separate auto-generated slugs (ending in digit)
  const autoGen = missing.filter(s => /-\d+$/.test(s));
  const nonAuto = missing.filter(s => !/-\d+$/.test(s));
  
  console.log(`\n=== ${hub} ===`);
  console.log(`  Registry: ${registered.length}, Existing: ${existing.length}, Missing: ${missing.length} (non-auto: ${nonAuto.length}, auto: ${autoGen.length})`);
  if (nonAuto.length > 0 && nonAuto.length <= 20) {
    console.log(`  Missing slugs: ${nonAuto.join(', ')}`);
  } else if (nonAuto.length > 0) {
    console.log(`  First 20 missing: ${nonAuto.slice(0, 20).join(', ')}`);
    console.log(`  (...${nonAuto.length - 20} more)`);
  }
}
