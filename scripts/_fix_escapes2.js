const fs = require('fs')
let content = fs.readFileSync('scripts/_gen_engineering.js', 'utf8')

// Replace all ${...} in the file with \${...} except:
// 1. Already escaped \${...}
// 2. The two places where we define the entries object itself (the top-level is fine)
// We'll replace ALL ${ not preceded by \

// Actually, we need to be smarter. Only replace ${ that appear inside
// compute/fields/description string values.

// Simpler approach: find every ${ outside of the entry value template literals
// by analyzing the structure.

// The entries object keys have `fields: `, `compute: `, `description: ` values
// These are all template literals. Inside them, any ${ must be escaped to \$
// But ${ TOP-LEVEL usage (like `const entries = {`) should NOT be escaped

// Pattern: inside a backtick-quoted string value, escape all unescaped ${
// Let's use a simpler approach: just escape ALL ${ that are NOT pre-escaped
// and NOT in the top-level building code (after the entries object)

// Find all ${ that are NOT preceded by \
const regex = /(?<!\\)\$\{/g
const matches = content.match(regex)
console.log('Total ${ found:', matches ? matches.length : 0)

// Actually the issue is more nuanced. In backtick strings, \$ is not a valid
// escape sequence like \\ is. In JS template literals, to escape ${ you do
// \${. So \${ is an escaped dollar-brace.
// But our source has $ from things like 'toFixed(2)}' in the template literal
// which would be interpreted.

// Let me just manually escape each problematic one by searching for patterns
// We know these ${ patterns are inside template literals in the script:

const unescaped = [
  '${((1 - v.f_split) * 100).toFixed(0)}',
  '${v.p1}',
  '${v.p2}',
  '${v.z1}',
  '${Math.min(v.p1, v.p2)}',
  '${Math.max(v.p1, v.p2)}',
]

for (const pat of unescaped) {
  while (content.includes(pat)) {
    content = content.replace(pat, '\\' + pat)
  }
}

fs.writeFileSync('scripts/_gen_engineering.js', content, 'utf8')
console.log('Done fixing')
