import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const registryPath = path.resolve(__dirname, '../packages/calculator-registry/src/registry.ts');
const content = fs.readFileSync(registryPath, 'utf8');

const slugRegex = /slug: '([^']+)'/g;
const allSlugs = [...content.matchAll(slugRegex)].map(m => m[1]);
const hubSlugsSet = new Set(['financial','health','math','conversion','date-time','construction','statistics','education','physics','chemistry','engineering','everyday','food','biology','ecology','sports']);
const existingSlugs = new Set(allSlugs.filter(s => !hubSlugsSet.has(s)));
console.log('Existing unique calculator slugs:', existingSlugs.size);

const hubMeta = {
  financial: { slug: 'financial-calculators', name: 'Financial Calculators' },
  health: { slug: 'health-calculators', name: 'Health Calculators' },
  math: { slug: 'math-calculators', name: 'Math Calculators' },
  conversion: { slug: 'conversion-calculators', name: 'Conversion Calculators' },
  'date-time': { slug: 'date-time-calculators', name: 'Date & Time Calculators' },
  construction: { slug: 'construction-calculators', name: 'Construction Calculators' },
  statistics: { slug: 'statistics-calculators', name: 'Statistics Calculators' },
  education: { slug: 'education-calculators', name: 'Education Calculators' },
  physics: { slug: 'physics-calculators', name: 'Physics Calculators' },
  chemistry: { slug: 'chemistry-calculators', name: 'Chemistry Calculators' },
  engineering: { slug: 'engineering-calculators', name: 'Engineering Calculators' },
  everyday: { slug: 'everyday-calculators', name: 'Everyday Calculators' },
  food: { slug: 'food-calculators', name: 'Food Calculators' },
  biology: { slug: 'biology-calculators', name: 'Biology Calculators' },
  ecology: { slug: 'ecology-calculators', name: 'Ecology Calculators' },
  sports: { slug: 'sports-calculators', name: 'Sports Calculators' },
};

let newEntries = [];
function add(cat, slug, title, desc, tier, kw) {
  if (existingSlugs.has(slug)) return false;
  const h = hubMeta[cat];
  newEntries.push({ slug, title, description: desc, category: cat, tier, hubSlug: h.slug, hubName: h.name, keywords: kw });
  existingSlugs.add(slug);
  return true;
}
