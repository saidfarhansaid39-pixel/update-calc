const fs = require('fs');
const c = fs.readFileSync('src/components/hub-calculators/GenericPhysicsCalculator.tsx', 'utf8');
const lines = c.split('\n');
// Find lorentz-transformation block start
let start = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("calcDefs['lorentz-transformation'")) { start = i; break; }
}
if (start < 0) { console.log('NOT FOUND'); process.exit(1); }
// Check around it
for (let i = start - 1; i <= start + 10; i++) {
  const l = lines[i];
  if (!l) continue;
  const m = l.match(/\s+(formula|description|interpretation|value): '(.+)/);
  if (m) console.log((i+1) + ': ' + m[1] + ': ' + m[2].substring(0, 100));
}
