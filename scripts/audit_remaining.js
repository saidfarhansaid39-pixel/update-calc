var fs = require('fs');

// ---- Construction ----
var reg = fs.readFileSync('packages/calculator-registry/src/registry.ts', 'utf8');
var lines = reg.split('\n');
var conslugs = [];
var cur = null;
for (var l of lines) {
  var sm = l.match(/slug:\s*'([^']+)'/);
  if (sm) cur = sm[1];
  var hm = l.match(/hubSlug:\s*'([^']+)'/);
  if (hm && hm[1] === 'construction-calculators' && cur) { conslugs.push(cur); cur = null; }
}

var existingslugs = new Set();
for (var i = 0; i < 6; i++) {
  var c = fs.readFileSync('src/lib/constructionCalcDefs/group' + i + '.ts', 'utf8');
  var m = c.match(/'([a-z][a-z0-9-]+)':\s*\{/g);
  if (m) m.forEach(function(x) { existingslugs.add(x.match(/'([^']+)'/)[1]); });
}

var missingCons = conslugs.filter(function(s) { return !existingslugs.has(s); });
var autoCons = missingCons.filter(function(s) { return /-\d+$/.test(s); });
console.log('=== Construction ===');
console.log('Registered: ' + conslugs.length + ', Existing: ' + existingslugs.size + ', Missing: ' + missingCons.length + ' (auto: ' + autoCons.length + ', non-auto: ' + (missingCons.length - autoCons.length) + ')');
if (missingCons.length > 0) {
  console.log('Missing slugs:');
  missingCons.forEach(function(s) { console.log('  ' + s + (/-\d+$/.test(s) ? ' [AUTO]' : '')); });
}

// ---- Everyday ----
var everyslugs = [];
cur = null;
for (var l of lines) {
  var sm = l.match(/slug:\s*'([^']+)'/);
  if (sm) cur = sm[1];
  var hm = l.match(/hubSlug:\s*'([^']+)'/);
  if (hm && hm[1] === 'everyday-calculators' && cur) { everyslugs.push(cur); cur = null; }
}

var ed = fs.readFileSync('src/components/hub-calculators/everyday-data.tsx', 'utf8');
// Extract keys from each map
function extractKeys(src, startMarker, endPattern) {
  var idx = src.indexOf(startMarker);
  if (idx < 0) return [];
  var objStart = src.indexOf('{', idx);
  if (objStart < 0) return [];
  var depth = 0, end = objStart;
  while (end < src.length) {
    var ch = src[end];
    if (ch === '{') depth++;
    if (ch === '}') { depth--; if (depth === 0) break; }
    end++;
  }
  var body = src.substring(objStart, end);
  var keys = body.match(/'([^']+)':/g);
  return keys ? keys.map(function(k) { return k.match(/'([^']+)'/)[1]; }) : [];
}

var formulaKeys = extractKeys(ed, 'everydayFormulas', '//');
var schemaKeys = extractKeys(ed, 'everydaySchemas', '//');
var defaultKeys = extractKeys(ed, 'everydayDefaults', '//');
var rendererKeys = extractKeys(ed, 'everydayRenderers', '//');
var presetKeys = extractKeys(ed, 'everydayPresets', '//');
var allEveryKeys = new Set(formulaKeys.concat(schemaKeys).concat(defaultKeys).concat(rendererKeys).concat(presetKeys));
var missingEvery = everyslugs.filter(function(s) { return !allEveryKeys.has(s); });
var autoEvery = missingEvery.filter(function(s) { return /-\d+$/.test(s); });
console.log('\n=== Everyday ===');
console.log('Registered: ' + everyslugs.length + ', Existing in any map: ' + allEveryKeys.size + ', Missing: ' + missingEvery.length + ' (auto: ' + autoEvery.length + ', non-auto: ' + (missingEvery.length - autoEvery.length) + ')');
console.log('Per map: formulas=' + formulaKeys.length + ' schemas=' + schemaKeys.length + ' defaults=' + defaultKeys.length + ' renderers=' + rendererKeys.length + ' presets=' + presetKeys.length);
if (missingEvery.length <= 30) {
  console.log('Missing slugs:');
  missingEvery.forEach(function(s) { console.log('  ' + s + (/-\d+$/.test(s) ? ' [AUTO]' : '')); });
}
