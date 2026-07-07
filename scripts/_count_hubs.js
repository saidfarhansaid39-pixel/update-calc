const fs = require('fs');
const content = fs.readFileSync('packages/calculator-registry/src/registry.ts', 'utf8');
const counts = {};
const regex = /hubSlug:\s*['"]([^'"]+)['"]/g;
let m;
while ((m = regex.exec(content)) !== null) {
  counts[m[1]] = (counts[m[1]] || 0) + 1;
}
console.log('Registry entries per hub:');
const sorted = Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0]));
for (const [hub, count] of sorted) {
  console.log(hub + ': ' + count);
}
