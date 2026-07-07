import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const registryDir = resolve(rootDir, 'packages/calculator-registry');
const srcFile = resolve(registryDir, 'src', 'registry.ts');
const distDir = resolve(registryDir, 'dist');

// Fast: read entire file as lines
const lines = readFileSync(srcFile, 'utf8').split('\n');

const jsLines = [];

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];

  // Line 1: remove type import
  if (i === 0) {
    if (line.includes("import { type CalculatorEntry, type HubInfo }")) {
      continue;
    }
  }

  // Remove `: HubInfo[]` type annotation
  if (line.includes(': HubInfo[]')) {
    line = line.replace(/: HubInfo\[\]/g, '');
  }

  // Remove `: CalculatorEntry[]` type annotation
  if (line.includes(': CalculatorEntry[]')) {
    line = line.replace(/: CalculatorEntry\[\]/g, '');
  }

  // Fix function parameter types: `(category: string, slug: string): string {`
  if (line.includes('function calculatorUrl(category: string, slug: string): string')) {
    line = line.replace(
      'function calculatorUrl(category: string, slug: string): string',
      'function calculatorUrl(category, slug)'
    );
  }

  // Fix `function hubForCategory(category: string): HubInfo | undefined {`
  if (line.includes('function hubForCategory(category: string): HubInfo | undefined')) {
    line = line.replace(
      'function hubForCategory(category: string): HubInfo | undefined',
      'function hubForCategory(category)'
    );
  }

  // Fix `new Set<string>()`
  if (line.includes('new Set<string>()')) {
    line = line.replace('new Set<string>()', 'new Set()');
  }

  // Fix `(cat: string) =>`
  if (line.includes('(cat: string)')) {
    line = line.replace('(cat: string)', '(cat)');
  }

  jsLines.push(line);
}

const output = jsLines.join('\n');

mkdirSync(distDir, { recursive: true });
writeFileSync(resolve(distDir, 'registry-data.js'), output, 'utf8');
console.log(`Written ${distDir}\\registry-data.js (${lines.length} lines → ${output.split('\n').length} lines)`);
