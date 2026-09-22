import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = 'C:/Users/store one/Pictures/calculatora/MpB2M28jkJJIYqVynKKb/Fichiers multiples';
const en = JSON.parse(readFileSync(join(ROOT, 'src/i18n/messages/en.json'), 'utf8'));
const formLabels = en.calculatorUI?.formLabels || {};
const existingKeys = new Set(Object.keys(formLabels));

// Read the renderfield labels (these have encoding issues, so let's re-extract)
const hubFiles = [
  'GenericFinancialCalculator.tsx',
  'GenericHealthCalculator.tsx', 
  'GenericMathCalculator.tsx',
  'GenericConversionCalculator.tsx',
  'GenericDateTimeCalculator.tsx',
  'GenericEducationCalculator.tsx',
  'GenericEngineeringCalculator.tsx',
  'GenericEverydayCalculator.tsx',
  'GenericFoodCalculator.tsx',
  'GenericPhysicsCalculator.tsx',
  'GenericSportsCalculator.tsx',
  'GenericStatisticsCalculator.tsx',
  'GenericBiologyCalculator.tsx',
  'GenericChemistryCalculator.tsx',
  'GenericEcologyCalculator.tsx',
  'GenericConstructionCalculator.tsx',
];

const allLabels = new Set();

for (const file of hubFiles) {
  try {
    const content = readFileSync(join(ROOT, 'src/components/hub-calculators', file), 'utf8');
    
    // Extract renderField labels: renderField('name', 'Label', ...)
    const rfRegex = /renderField\([^,]+,\s*'([^']+)'/g;
    let m;
    while ((m = rfRegex.exec(content)) !== null) {
      allLabels.add(m[1]);
    }
    
    // Extract field definition labels: label: 'Label'
    const labelRegex = /label:\s*'([^']+)'/g;
    while ((m = labelRegex.exec(content)) !== null) {
      allLabels.add(m[1]);
    }
    
    // Extract select option labels in renderField calls
    const optRegex = /\{ value: '[^']+', label: '([^']+)' \}/g;
    while ((m = optRegex.exec(content)) !== null) {
      allLabels.add(m[1]);
    }
  } catch (e) {
    // skip
  }
}

function toKey(label) {
  return label
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const missing = [];
const found = [];
for (const label of allLabels) {
  const key = toKey(label);
  if (!key) continue;
  if (existingKeys.has(key)) {
    found.push(label);
  } else {
    missing.push({ label, key });
  }
}

console.log('Total unique labels: ' + allLabels.size);
console.log('Found in translations: ' + found.length);
console.log('Missing from translations: ' + missing.length);
console.log('\n--- Missing labels (to add to calculatorUI.formLabels) ---');
for (const m of missing) {
  console.log('  "' + m.key + '": "' + m.label.replace(/"/g, '\\"') + '",');
}
