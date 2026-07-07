const fs = require('fs');
const files = [
  'GenericPhysicsCalculator.tsx',
  'GenericChemistryCalculator.tsx',
  'GenericStatisticsCalculator.tsx',
  'GenericSportsCalculator.tsx',
  'GenericBiologyCalculator.tsx',
  'GenericEcologyCalculator.tsx',
];
const dir = 'src/components/hub-calculators';
for (const f of files) {
  const c = fs.readFileSync(dir + '/' + f, 'utf8');
  const re = /calcDefs\s*\[\s*['"][^'"]+['"]\s*\]\s*=\s*\{/g;
  const matches = c.match(re);
  const count = matches ? matches.length : 0;
  const lines = c.split('\n').length;
  console.log(f + ': ' + count + ' calcDefs, ' + lines + ' lines');
}
