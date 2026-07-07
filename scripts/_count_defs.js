const fs = require('fs');
const path = require('path');
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
const registryContent = fs.readFileSync('packages/calculator-registry/src/registry.ts', 'utf8');
const registrySlugs = new Map();
const hubRegex = /hubSlug:\s*['"]([^'"]+)['"]/g;
let lastSlug = null;
let lastHub = null;
const lines = registryContent.split('\n');
for (const line of lines) {
  const slugMatch = line.match(/slug:\s*['"]([^'"]+)['"]/);
  if (slugMatch) lastSlug = slugMatch[1];
  const hubMatch = line.match(/hubSlug:\s*['"]([^'"]+)['"]/);
  if (hubMatch) lastHub = hubMatch[1];
  if (lastSlug && lastHub) {
    registrySlugs.set(lastSlug + '@' + lastHub, { slug: lastSlug, hub: lastHub });
  }
}

const registryByHub = {};
for (const [key, val] of registrySlugs) {
  if (!registryByHub[val.hub]) registryByHub[val.hub] = [];
  registryByHub[val.hub].push(val.slug);
}

console.log('calcDef counts per hub:');
for (const [hub, file] of Object.entries(hubFiles)) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) {
    console.log(hub + ': FILE NOT FOUND');
    continue;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const defCount = (content.match(/calcDefs\['/g) || []).length;
  const registryCount = (registryByHub[hub] || []).length;
  console.log(hub + ': ' + defCount + ' calcDefs vs ' + registryCount + ' registry entries');
}

// Also count conversion specialty
const convContent = fs.readFileSync(path.join(dir, 'GenericConversionCalculator.tsx'), 'utf8');
console.log('');
console.log('Conversion breakdown:');
const convDefs = (convContent.match(/calcDefs\[/g) || []).length;
console.log('  calcDefs entries: ' + convDefs);
