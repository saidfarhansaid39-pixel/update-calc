var fs = require('fs');
var c = fs.readFileSync('src/components/hub-calculators/GenericMathCalculator.tsx', 'utf8');
var slugs = ['30-60-90-triangle', '45-45-90-triangle', '2x2-matrix-calculator', '3x3-matrix-calculator', '30-60-90-calc', '45-45-90-calc'];
slugs.forEach(function(s) {
  var idx = c.indexOf("'" + s + "'");
  if (idx < 0) {
    console.log(s + ': NOT FOUND');
  } else {
    var line = c.substring(0, idx).split('\n').length;
    var count = c.split("'" + s + "'").length - 1;
    console.log(s + ': found at line ' + line + ', occurrences: ' + count);
  }
});
