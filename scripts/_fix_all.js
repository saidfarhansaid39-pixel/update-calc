const fs = require('fs')
let content = fs.readFileSync('scripts/_gen_engineering.js', 'utf8')

// Find ALL ${...} that:
// 1. Are NOT already preceded by \ (i.e., \${ already escaped)
// 2. Are inside template literal values (not in the top-level for loop code)
//
// We identify them by looking for patterns that are inside compute/fields/description/example values

// Strategy: The unescaped ${ appear INSIDE template literal string values.
// These values are assigned to properties like `compute: `...`` or `fields: `...``.
// Inside those backtick strings, any unescaped ${ causes evaluation at script time.

// Let me just find all ${ not preceded by \ that are inside backtick strings.
// We'll process the file character by character to track backtick depth.

// Actually, simpler: since the only unescaped ${ we need are in the for loop
// at the bottom (lines like `${slug}`), let me check where they are.

// The block-building code at the bottom uses:
//   block += `  '${slug}': {\n${entry.fields},\n...
// These should NOT be escaped.

// All other ${ inside template literals in the entries object should be \${

// Let me replace all ${ that are NOT already \${ AND NOT in the bottom loop
// The bottom loop is after the entries object definition.

// Find all ${ positions
const positions = []
let idx = 0
while ((idx = content.indexOf('${', idx)) !== -1) {
  // Check if preceded by \
  const prev = idx > 0 ? content[idx - 1] : ''
  if (prev !== '\\') {
    positions.push({ idx, escaped: false })
  }
  idx++
}

console.log('Found ' + positions.length + ' unescaped ${} patterns')

// Check which are in the for loop area (after line with "const block = ''" or similar)
// The for loop starts around the "for (const [slug, entry]" line
const loopMarker = "for (const [slug, entry] of Object.entries(entries))"
const loopStart = content.indexOf(loopMarker)
console.log(`Loop starts at byte ${loopStart}`)

// Filter positions: keep only those before the loop
const toFix = positions.filter(p => p.idx < loopStart)
console.log(`Need to fix ${toFix.length} positions (those before the loop)`)

// Fix them in reverse order to preserve indices
for (let i = toFix.length - 1; i >= 0; i--) {
  const pos = toFix[i].idx
  content = content.slice(0, pos) + '\\' + content.slice(pos)
}

fs.writeFileSync('scripts/_gen_engineering.js', content, 'utf8')
console.log('Fixed all unescaped ${ before for loop')
