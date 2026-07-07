var fs = require('fs');
var dir = 'src/components/hub-calculators/';
var files = [
  'GenericConstructionCalculator.tsx',
  'GenericEducationCalculator.tsx',
  'GenericDateTimeCalculator.tsx',
  'GenericFoodCalculator.tsx'
];
var regCounts = { construction: 244, education: 192, 'date-time': 201, food: 145 };
files.forEach(function(f) {
  var c = fs.readFileSync(dir + f, 'utf8');
  // Count calcDef keys (lines like `'slug-name': {`)
  var match = c.match(/'[a-z][a-z0-9-]+':\s*\{/g);
  var defCount = match ? match.length : 0;
  // Also check calcTypeMap
  var typeMatch = c.match(/'[a-z][a-z0-9-]+':\s*'/g);
  var typeCount = typeMatch ? typeMatch.length : 0;
  var hub = f.replace('Generic','').replace('Calculator.tsx','').toLowerCase();
  console.log(f + ': ' + defCount + ' calcDefs' + (typeCount ? ', ' + typeCount + ' typeMap entries' : '') + ' | registry: ' + (regCounts[hub] || '?'));
});
