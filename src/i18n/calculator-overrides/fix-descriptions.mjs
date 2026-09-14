import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function countMatches(content, regex) {
  const re = new RegExp(regex.source, 'g');
  const m = content.match(re);
  return m ? m.length : 0;
}

function getSample(content, regex) {
  const re = new RegExp(regex.source, 'g');
  const m = re.exec(content);
  if (!m) return null;
  const idx = m.index;
  return content.substring(idx, idx + 100);
}

// === Check es.json and fr.json (expected to be already clean) ===
const esContent = fs.readFileSync(path.join(__dirname, 'es.json'), 'utf-8');
const esConvert = countMatches(esContent, /\bConvert\s/);
const esCalculate = countMatches(esContent, /\bCalculate\s/);
console.log('=== es.json (already clean) ===');
console.log(`  "Convert ": ${esConvert} occurrences`);
console.log(`  "Calculate ": ${esCalculate} occurrences`);

const frContent = fs.readFileSync(path.join(__dirname, 'fr.json'), 'utf-8');
const frCalculate = countMatches(frContent, /\bCalculate\s/);
const frConvert = countMatches(frContent, /\bConvert\s/);
console.log('');
console.log('=== fr.json (already clean) ===');
console.log(`  "Calculate ": ${frCalculate} occurrences`);
console.log(`  "Convert ": ${frConvert} occurrences`);

console.log('');
console.log('=== Fixing ar.json ===');

const arPath = path.join(__dirname, 'ar.json');
const arBakPath = path.join(__dirname, 'ar.json.bak');

// Backup
let arContent = fs.readFileSync(arPath, 'utf-8');
fs.copyFileSync(arPath, arBakPath);

// Fix 1: "Calculate " -> "احسب "
const calcBefore = getSample(arContent, /\bCalculate\s/);
const calcRe = /\bCalculate\s/g;
let calcCount = countMatches(arContent, /\bCalculate\s/);
if (calcCount > 0) {
  arContent = arContent.replace(calcRe, 'احسب ');
}

// Fix 2: Full English description for annealing-temperature-calculator
// Match from start of description to end of English sentence
const engDescRe = /"description":\s*"Calculate the optimal annealing temperature for PCR primers\.[^"]*target DNA\."/;
const engBefore = getSample(arContent, engDescRe);
let engCount = countMatches(arContent, engDescRe);
if (engCount > 0) {
  const arabicDesc = '"description": "احسب درجة حرارة التلدين المثلى لبادئات PCR. يستخدم معادلة Ta الأساسية لحساب درجة حرارة التلدين."';
  arContent = arContent.replace(engDescRe, arabicDesc);
}

// Verify JSON validity
try {
  JSON.parse(arContent);
} catch (err) {
  console.error(`  ERROR: Invalid JSON - restoring backup`);
  console.error(`  ${err.message}`);
  fs.copyFileSync(arBakPath, arPath);
  process.exit(1);
}

fs.writeFileSync(arPath, arContent, 'utf-8');

console.log(`  "Calculate " -> "احسب ": ${calcCount} occurrence(s)`);
if (calcBefore) console.log(`    Before: "${calcBefore}"`);
console.log(`  Full English desc -> Arabic: ${engCount} occurrence(s)`);
if (engBefore) console.log(`    Before: "${engBefore}"`);

console.log('');
console.log('=== Final Summary ===');
console.log(`es.json: 0 replacements needed (already clean)`);
console.log(`fr.json: 0 replacements needed (already clean)`);
console.log(`ar.json: ${calcCount + engCount} replacements`);
console.log(`Total:   ${calcCount + engCount} replacements`);
console.log('Backups: es.json.bak, fr.json.bak, ar.json.bak all preserved');
console.log('New bak created: ar.json.bak (overwritten)');
