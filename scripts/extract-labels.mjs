import fs from 'fs';
import path from 'path';

const hubDir = 'src/components/hub-calculators';
const fieldLabels = {};  // label -> count
const optionLabels = {}; // label -> count
const uiLabels = {};     // label -> count

// ===== 1. Extract from calcDef files (field definitions) =====
const calcDefHubs = ['biology','chemistry','ecology','physics','statistics','sports','math','food','construction'];

for (const hub of calcDefHubs) {
  const hubDir2 = path.join(hubDir, hub);
  if (!fs.existsSync(hubDir2)) continue;
  
  const files = fs.readdirSync(hubDir2).filter(f => f.endsWith('.ts') && f !== 'index.ts');
  
  for (const file of files) {
    const content = fs.readFileSync(path.join(hubDir2, file), 'utf8');
    
    // Extract field labels: { name: 'xxx', label: 'Label', ... }
    const fieldMatches = content.matchAll(/fields:\s*\[([\s\S]*?)\]/g);
    for (const fm of fieldMatches) {
      const fieldsBlock = fm[1];
      const labelMatches = fieldsBlock.matchAll(/label:\s*['"]([^'"]+)['"]/g);
      for (const m of labelMatches) {
        const label = m[1];
        if (label && label.length > 0 && label.length < 80) {
          fieldLabels[label] = (fieldLabels[label] || 0) + 1;
        }
      }
    }
    
    // Also match fields without array brackets (single field)
    const singleFieldMatches = content.matchAll(/\{\s*name:\s*['"][^'"]+['"][^}]*label:\s*['"]([^'"]+)['"]/g);
    for (const m of singleFieldMatches) {
      const label = m[1];
      if (label && label.length > 0 && label.length < 80) {
        fieldLabels[label] = (fieldLabels[label] || 0) + 1;
      }
    }
    
    // Extract option labels from select options
    const optionMatches = content.matchAll(/options?:\s*\[([\s\S]*?)\]/g);
    for (const om of optionMatches) {
      const optsBlock = om[1];
      const labelMatches = optsBlock.matchAll(/label:\s*['"]([^'"]+)['"]/g);
      for (const m of labelMatches) {
        const label = m[1];
        if (label && label.length > 0 && label.length < 80) {
          optionLabels[label] = (optionLabels[label] || 0) + 1;
        }
      }
    }
  }
}

// ===== 2. Extract from everyday-data.tsx (field definitions) =====
const everydayDataPath = path.join(hubDir, 'everyday-data.tsx');
if (fs.existsSync(everydayDataPath)) {
  const content = fs.readFileSync(everydayDataPath, 'utf8');
  
  // Extract field labels from field defs
  const fieldMatches = content.matchAll(/label:\s*['"]([^'"]+)['"]/g);
  for (const m of fieldMatches) {
    const label = m[1];
    if (label && label.length > 0 && label.length < 80) {
      fieldLabels[label] = (fieldLabels[label] || 0) + 1;
    }
  }
}

// ===== 3. Extract from Generic*Calculator files =====
const genericFiles = fs.readdirSync(hubDir).filter(f => f.startsWith('Generic') && f.endsWith('.tsx'));

for (const file of genericFiles) {
  const content = fs.readFileSync(path.join(hubDir, file), 'utf8');
  
  // Extract from fieldLabels object (GenericEverydayCalculator has a big one)
  const fieldLabelsObjMatch = content.match(/fieldLabels:\s*Record<string,\s*string>\s*=\s*\{([\s\S]*?)\n\s*\}/);
  if (fieldLabelsObjMatch) {
    const block = fieldLabelsObjMatch[1];
    const matches = block.matchAll(/['"](\w+)['"]\s*:\s*['"]([^'"]+)['"]/g);
    for (const m of matches) {
      const label = m[2];
      if (label && label.length > 0) {
        fieldLabels[label] = (fieldLabels[label] || 0) + 1;
      }
    }
  }
  
  // Extract from optionLabels object
  const optionLabelsObjMatch = content.match(/optionLabels:\s*Record<string,\s*string>\s*=\s*\{([\s\S]*?)\n\s*\}/);
  if (optionLabelsObjMatch) {
    const block = optionLabelsObjMatch[1];
    const matches = block.matchAll(/['"](\w+)['"]\s*:\s*['"]([^'"]+)['"]/g);
    for (const m of matches) {
      const label = m[2];
      if (label && label.length > 0) {
        optionLabels[label] = (optionLabels[label] || 0) + 1;
      }
    }
  }
  
  // Extract inline option objects { label: 'xxx', value: 'xxx' }
  const inlineOptions = content.matchAll(/\{\s*label:\s*['"]([^'"]+)['"][^}]*value:\s*['"][^'"]+['"]/g);
  for (const m of inlineOptions) {
    const label = m[1];
    if (label && label.length > 0 && label.length < 80) {
      optionLabels[label] = (optionLabels[label] || 0) + 1;
    }
  }
  
  // Extract UI text from JSX (between > and <, starting with uppercase)
  const uiTextMatches = content.matchAll(/>\s*([A-Z][^<{}\n]{2,60})\s*</g);
  for (const m of uiTextMatches) {
    const text = m[1].trim();
    if (text && !text.includes('{') && !text.includes('className') && !text.startsWith('http') && 
        text.length > 2 && text.length < 80 && !/^\d/.test(text) &&
        !text.includes('import') && !text.includes('from ') && !text.includes('const ')) {
      uiLabels[text] = (uiLabels[text] || 0) + 1;
    }
  }
}

// ===== 4. Extract from standalone calculator components =====
const standaloneCalcDir = 'src/components/calculator';
if (fs.existsSync(standaloneCalcDir)) {
  const calcFiles = fs.readdirSync(standaloneCalcDir).filter(f => f.endsWith('.tsx'));
  for (const file of calcFiles) {
    const content = fs.readFileSync(path.join(standaloneCalcDir, file), 'utf8');
    
    // Extract label properties from result objects
    const labelMatches = content.matchAll(/label:\s*['"]([^'"]+)['"]/g);
    for (const m of labelMatches) {
      const label = m[1];
      if (label && label.length > 0 && label.length < 80 && !label.includes('{') && !label.startsWith('http')) {
        fieldLabels[label] = (fieldLabels[label] || 0) + 1;
      }
    }
    
    // Extract option labels
    const optionMatches = content.matchAll(/\{\s*value:\s*['"][^'"]+['"][^}]*label:\s*['"]([^'"]+)['"]/g);
    for (const m of optionMatches) {
      const label = m[1];
      if (label && label.length > 0 && label.length < 80) {
        optionLabels[label] = (optionLabels[label] || 0) + 1;
      }
    }
  }
}

// ===== 5. Manually add common labels that appear across multiple calculators =====
const commonLabels = [
  // Financial
  'Principal', 'Principal ($)', 'Rate (%)', 'Interest Rate (%)', 'Loan Amount', 'Down Payment',
  'Term', 'Years', 'Months', 'Monthly Payment', 'Annual Salary', 'Hourly Rate',
  'Property Value', 'Home Price', 'Credit Score', 'Debt Amount',
  // Health
  'Weight (kg)', 'Height (cm)', 'Body Fat (%)', 'Activity Level',
  'Waist', 'Hip', 'Neck', 'Resting Heart Rate', 'Max Heart Rate',
  'Calories', 'Protein (g)', 'Carbs (g)', 'Fat (g)',
  // Sports
  'Distance (km)', 'Duration (min)', 'Pace', 'Speed (km/h)',
  'Reps', 'Sets', 'Body Weight (kg)',
  // Math
  'Side A', 'Side B', 'Side C', 'Radius', 'Diameter', 'Base', 'Angle',
  // Conversion
  'From', 'To', 'Value', 'Unit',
  // Food
  'Servings', 'Ingredients', 'Cost Per Serving',
  // Common UI
  'Calculate', 'Reset', 'Clear', 'Save', 'Export',
  'Select values to calculate', 'Enter your details above',
  'No results', 'Steps', 'Step-by-Step',
];
for (const label of commonLabels) {
  if (!fieldLabels[label]) fieldLabels[label] = 0; // ensure exists but don't inflate count
}

// ===== 6. Add more inline UI text from Generic*Calculator files =====
for (const file of genericFiles) {
  const content = fs.readFileSync(path.join(hubDir, file), 'utf8');
  
  // Extract specific UI text patterns
  const specificUIText = [
    'Select values to calculate',
    'Enter your details above',
    'Select a sports calculator',
    'Select a food calculator',
    'This calculator is being developed',
    'Steps',
    'Step-by-Step',
    'Standard tipping',
    'Calculate',
    'Reset',
    'Clear',
    'No results',
    'Temperature unit',
    'Bill Amount ($)',
    'Service Quality',
    'Tip Percentage (%)',
    'Split Among',
    'Round up total to nearest dollar',
    'Advanced Options',
    'Professional Options',
    'Expert Options',
    'Group Options',
    'Additional Options',
    'Presets',
    'Value',
    'From',
    'To',
    'Bill Breakdown',
    'Unit Converter',
    'Converted Value',
    'Generated Password',
    'Length',
    'Courses',
    'GPA',
  ];
  for (const text of specificUIText) {
    if (content.includes(text)) {
      uiLabels[text] = (uiLabels[text] || 0) + 1;
    }
  }
  
  // Extract select option text from JSX
  const selectOptionMatches = content.matchAll(/<option[^>]*>([^<]+)<\/option>/g);
  for (const m of selectOptionMatches) {
    const label = m[1].trim();
    if (label && label.length > 1 && label.length < 80 && !label.startsWith('{') && !/^\d+$/.test(label)) {
      optionLabels[label] = (optionLabels[label] || 0) + 1;
    }
  }
}

// ===== Helper: create key from label =====
function toKey(label) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .trim();
}

// ===== Build output =====
const sortedFields = Object.entries(fieldLabels).sort((a,b) => b[1] - a[1]);
const sortedOptions = Object.entries(optionLabels).sort((a,b) => b[1] - a[1]);
const sortedUI = Object.entries(uiLabels).sort((a,b) => b[1] - a[1]);

// Build deduplicated output (keep highest count per key)
const fieldLabelsJson = {};
const seenKeys = new Set();
for (const [label, count] of sortedFields) {
  const key = toKey(label);
  if (key && key.length > 0 && !seenKeys.has(key)) {
    seenKeys.add(key);
    fieldLabelsJson[key] = { en: label, count };
  }
}

const optionLabelsJson = {};
const seenOptKeys = new Set();
for (const [label, count] of sortedOptions) {
  const key = toKey(label);
  if (key && key.length > 0 && !seenOptKeys.has(key)) {
    seenOptKeys.add(key);
    optionLabelsJson[key] = { en: label, count };
  }
}

const uiLabelsJson = {};
const seenUIKeys = new Set();
for (const [label, count] of sortedUI) {
  const key = toKey(label);
  if (key && key.length > 0 && !seenUIKeys.has(key)) {
    seenUIKeys.add(key);
    uiLabelsJson[key] = { en: label, count };
  }
}

const output = {
  fieldLabels: fieldLabelsJson,
  uiLabels: uiLabelsJson,
  optionLabels: optionLabelsJson,
  meta: {
    extractedAt: new Date().toISOString(),
    totalFieldLabels: Object.keys(fieldLabelsJson).length,
    totalUiLabels: Object.keys(uiLabelsJson).length,
    totalOptionLabels: Object.keys(optionLabelsJson).length,
  }
};

fs.writeFileSync('src/i18n/calc-field-labels.json', JSON.stringify(output, null, 2));

console.log('=== Refined Extraction Results ===');
console.log(`Field labels: ${Object.keys(fieldLabelsJson).length}`);
console.log(`UI labels: ${Object.keys(uiLabelsJson).length}`);
console.log(`Option labels: ${Object.keys(optionLabelsJson).length}`);

console.log('\n=== Top 60 Field Labels ===');
sortedFields.slice(0, 60).forEach(([label, count]) => console.log(`  ${count}x: ${label}`));

console.log('\n=== Top 40 Option Labels ===');
sortedOptions.slice(0, 40).forEach(([label, count]) => console.log(`  ${count}x: ${label}`));

console.log('\n=== Top 30 UI Labels ===');
sortedUI.slice(0, 30).forEach(([label, count]) => console.log(`  ${count}x: ${label}`));
