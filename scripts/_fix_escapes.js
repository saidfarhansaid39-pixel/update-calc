const fs = require('fs')
const content = fs.readFileSync('scripts/_gen_engineering.js', 'utf8')

// Fix unescaped ${...} inside template literals for compute strings
// These should be \${ to be literal in the output TSX file
const fixes = [
  ['CFM (${qM3s.toFixed(3)}', 'CFM (\\${qM3s.toFixed(3)}'],
  ['BTU/h (${(sensibleBtuh / 12000).toFixed(2)}', 'BTU/h (\\${(sensibleBtuh / 12000).toFixed(2)}'],
  ['BTU/h (${(totalBtuh / 12000).toFixed(2)}', 'BTU/h (\\${(totalBtuh / 12000).toFixed(2)}'],
  ['in. wg (${dpPa.toFixed(0)}', 'in. wg (\\${dpPa.toFixed(0)}'],
  ['× ${aBag.toFixed(2)}', '× \\${aBag.toFixed(2)}'],
  ['min (${acRatio.toFixed(3)}', 'min (\\${acRatio.toFixed(3)}'],
  ['bar (${dP.toFixed(0)}', 'bar (\\${dP.toFixed(0)}'],
  ['m³ → ${t1.toFixed(1)}', 'm³ → \\${t1.toFixed(1)}'],
  ['RPM (${nRps.toFixed(2)}', 'RPM (\\${nRps.toFixed(2)}'],
  ['W (${(p / 1000).toFixed(2)}', 'W (\\${(p / 1000).toFixed(2)}'],
]

let result = content
for (const [from, to] of fixes) {
  while (result.includes(from)) {
    result = result.replace(from, to)
  }
}

fs.writeFileSync('scripts/_gen_engineering.js', result, 'utf8')
console.log('Fixed escapes')
