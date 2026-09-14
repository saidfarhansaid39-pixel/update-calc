import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = join(__dirname, '..', 'src', 'i18n', 'calculator-overrides');

const en = JSON.parse(readFileSync(join(BASE, 'en.json'), 'utf-8'));
const enTitles = Object.fromEntries(Object.entries(en).map(([k,v])=>[k,v.title]));

const locales = ['es','fr','de','pt','ru','ar','hi','ja','zh-CN'];

// Collect remaining per locale
const remainingByLocale = {};
for (const loc of locales) {
  const d = JSON.parse(readFileSync(join(BASE, loc+'.json'), 'utf-8'));
  const rem = [];
  for (const k of Object.keys(en)) {
    if (d[k] && d[k].title === en[k].title) {
      rem.push(en[k].title);
    }
  }
  remainingByLocale[loc] = rem;
  console.log(loc + ': ' + rem.length + ' remaining');
}

// Extract all unique words across all remaining titles
const allWords = new Set();
for (const loc of locales) {
  for (const title of remainingByLocale[loc]) {
    // Split on spaces, slashes, hyphens, numbers
    const words = title.split(/[\s\/\-\(\)]+/);
    for (const w of words) {
      // Keep only alphabetic words (skip pure numbers, acronyms)
      if (/^[A-Z][a-z]+$/.test(w) || /^[A-Z][a-z]+[A-Z]/.test(w)) {
        allWords.add(w);
      }
    }
  }
}
const sortedWords = [...allWords].sort();
console.log('\nUnique words across all remaining: ' + sortedWords.length);
console.log(JSON.stringify(sortedWords));
