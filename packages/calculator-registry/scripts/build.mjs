import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgDir = join(__dirname, '..');
const distDir = join(pkgDir, 'dist');
mkdirSync(distDir, { recursive: true });

const tmpEntry = join(distDir, '_extract.mjs');
const outputPath = join(distDir, 'index.mjs');

const extractCode = `
import { calculatorRegistry, hubs, calculatorUrl, hubForCategory } from '../src/index.ts';
const byHub = {
  financialCalculators: calculatorRegistry.filter(c => c.category === 'financial'),
  healthCalculators: calculatorRegistry.filter(c => c.category === 'health'),
  mathCalculators: calculatorRegistry.filter(c => c.category === 'math'),
  conversionCalculators: calculatorRegistry.filter(c => c.category === 'conversion'),
  dateTimeCalculators: calculatorRegistry.filter(c => c.category === 'date-time'),
  constructionCalculators: calculatorRegistry.filter(c => c.category === 'construction'),
  statisticsCalculators: calculatorRegistry.filter(c => c.category === 'statistics'),
  educationCalculators: calculatorRegistry.filter(c => c.category === 'education'),
  physicsCalculators: calculatorRegistry.filter(c => c.category === 'physics'),
  chemistryCalculators: calculatorRegistry.filter(c => c.category === 'chemistry'),
  engineeringCalculators: calculatorRegistry.filter(c => c.category === 'engineering'),
  everydayCalculators: calculatorRegistry.filter(c => c.category === 'everyday'),
  foodCalculators: calculatorRegistry.filter(c => c.category === 'food'),
  biologyCalculators: calculatorRegistry.filter(c => c.category === 'biology'),
  ecologyCalculators: calculatorRegistry.filter(c => c.category === 'ecology'),
  sportsCalculators: calculatorRegistry.filter(c => c.category === 'sports'),
};
const out = {
  hubs, calculatorRegistry, ...byHub,
  calculatorUrl: calculatorUrl.toString(),
  hubForCategory: hubForCategory.toString(),
};
process.stdout.write(JSON.stringify(out));
`;

writeFileSync(tmpEntry, extractCode, 'utf-8');

let raw;
try {
  raw = execSync(`npx tsx "${tmpEntry}"`, { cwd: pkgDir, encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 });
  console.log('✓ Registry data extracted');
} catch (err) {
  console.error('✗ Failed to extract registry:', err.message);
  process.exit(1);
} finally {
  rmSync(tmpEntry, { force: true });
}

const data = JSON.parse(raw.trim());
const { calculatorUrl: calcUrlFn, hubForCategory: hubForCatFn, ...pureData } = data;

const mjsLines = [
  '// Auto-generated – do not edit. Run `node scripts/build.mjs` to rebuild.',
  '',
  `const data = ${JSON.stringify(pureData)};`,
  '',
  'export function calculatorUrl(category, slug) {',
  '  return `/${category}-calculators/${slug}`;',
  '}',
  '',
  'export function hubForCategory(category) {',
  '  return data.hubs.find(h => h.slug === category) ?? null;',
  '}',
  '',
  ...Object.keys(pureData).map(key => `export const ${key} = data.${key};`),
  '',
];

writeFileSync(outputPath, mjsLines.join('\n'), 'utf-8');
console.log(`✓ Wrote ${outputPath}`);
