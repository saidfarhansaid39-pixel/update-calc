const f = require('fs');
const content = f.readFileSync('C:\\Users\\store one\\Pictures\\calculatora\\MpB2M28jkJJIYqVynKKb\\Fichiers multiples\\src\\components\\hub-calculators\\GenericFinancialCalculator.tsx', 'utf-8');
const lines = content.split('\n');
console.log('File:', (content.length/1024).toFixed(0)+'KB,', lines.length, 'lines');
const hasDefaultExport = /export\s+default\s/.test(content);
const namedExport = content.match(/export\s+\{\s*(\w+)/);
console.log('Default export:', hasDefaultExport);
console.log('Named export:', namedExport ? namedExport[1] : 'none');
console.log('Has use client:', content.includes("'use client'"));
const imports = content.match(/^import .+$/gm);
if (imports) {
  const external = imports.filter(i => !i.includes('./') && !i.includes('../'));
  const local = imports.filter(i => i.includes('./') || i.includes('../'));
  console.log('External imports:', external.length);
  console.log('Local imports:', local.length);
  // Check for potentially problematic imports
  local.forEach(i => {
    if (i.includes('..')) console.log('  Relative parent:', i.substring(0, 60));
  });
}
// Check for potential runtime errors
if (content.includes('undefined') || content.includes('null.')) console.log('WARNING: Possible null reference');
// Check for empty catch blocks
const catches = content.match(/catch\s*\([^)]+\)\s*\{/g);
console.log('Catch blocks:', catches?.length || 0);
