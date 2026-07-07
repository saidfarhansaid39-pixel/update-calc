const fs = require('fs');
const path = require('path');

const hubFiles = [
  ['financial-calculators', 'GenericFinancialCalculator.tsx'],
  ['health-calculators', 'GenericHealthCalculator.tsx'],
  ['math-calculators', 'GenericMathCalculator.tsx'],
  ['conversion-calculators', 'GenericConversionCalculator.tsx'],
  ['date-time-calculators', 'GenericDateTimeCalculator.tsx'],
  ['construction-calculators', 'GenericConstructionCalculator.tsx'],
  ['statistics-calculators', 'GenericStatisticsCalculator.tsx'],
  ['education-calculators', 'GenericEducationCalculator.tsx'],
  ['physics-calculators', 'GenericPhysicsCalculator.tsx'],
  ['chemistry-calculators', 'GenericChemistryCalculator.tsx'],
  ['engineering-calculators', 'GenericEngineeringCalculator.tsx'],
  ['everyday-calculators', 'GenericEverydayCalculator.tsx'],
  ['food-calculators', 'GenericFoodCalculator.tsx'],
  ['biology-calculators', 'GenericBiologyCalculator.tsx'],
  ['ecology-calculators', 'GenericEcologyCalculator.tsx'],
  ['sports-calculators', 'GenericSportsCalculator.tsx'],
];

const dir = 'src/components/hub-calculators';

// Count registry slugs per hub
const registryContent = fs.readFileSync('packages/calculator-registry/src/registry.ts', 'utf8');
const registryByHub = {};
const lines = registryContent.split('\n');
let curSlug = null, curHub = null;
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

function countByPattern(content, pattern) {
  return (content.match(new RegExp(pattern, 'g')) || []).length;
}

console.log('=== calcDefs count per hub ===');
for (const [hub, file] of hubFiles) {
  const fp = path.join(dir, file);
  if (!fs.existsSync(fp)) { console.log(hub + ': file not found'); continue; }
  const c = fs.readFileSync(fp, 'utf8');
  
  // Method 1: count calcDefs['slug'] = { lines
  const m1 = countByPattern(c, "calcDefs\\s*\\[\\s*'[^']+'\\s*\\]\\s*=\\s*\\{");
  // Method 2: count calcDefs["slug"] = { lines  
  const m2 = countByPattern(c, 'calcDefs\\s*\\[\\s*"[^"]+"\\s*\\]\\s*=\\s*\\{');
  // Method 3: count lines that are object keys in a calcDefs = { ... } block
  // Find lines like:   'slug': { or slug: {
  const m3 = countByPattern(c, "calcDefs\\s*=\\s*\\{");
  let m3count = 0;
  if (m3 > 0) {
    // Find the opening { of calcDefs and count slug keys until closing }
    const startIdx = c.indexOf('calcDefs');
    if (startIdx >= 0) {
      const braceIdx = c.indexOf('{', startIdx);
      if (braceIdx >= 0) {
        let depth = 1;
        let i = braceIdx + 1;
        let slugKeys = 0;
        while (i < c.length && depth > 0) {
          if (c[i] === '{') depth++;
          else if (c[i] === '}') depth--;
          else if (c[i] === "'" && depth === 1) {
            // Check if this looks like a slug key
            const endQuote = c.indexOf("'", i + 1);
            if (endQuote > i && endQuote < c.length) {
              const inside = c.substring(i+1, endQuote);
              if (/^[a-z][a-z0-9-]{2,}$/.test(inside)) {
                const after = c.substring(endQuote+1).trimStart();
                if (after.startsWith(':')) slugKeys++;
              }
            }
            i = endQuote > i ? endQuote : i + 1;
          }
          i++;
        }
        m3count = slugKeys;
      }
    }
  }
  
  const totalDefs = Math.max(m1 + m2, m3count);
  const regCount = (registryByHub[hub] || []).length;
  const gap = regCount - totalDefs;
  const pct = regCount > 0 ? Math.round((totalDefs / regCount) * 100) : 0;
  
  console.log(hub + ': ' + totalDefs + ' / ' + regCount + ' (' + pct + '%) gap=' + gap + ' [m1=' + m1 + ' m2=' + m2 + ' m3=' + m3count + ']');
}
