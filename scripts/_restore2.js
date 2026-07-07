const fs = require('fs')
const c = fs.readFileSync('src/components/hub-calculators/GenericEngineeringCalculator.tsx', 'utf8')

// Find the hvac-load entry end by looking for the unique ending
const hvacEnd = "example: { label: '50m"
const hIdx = c.indexOf(hvacEnd)
if (hIdx === -1) { console.error('hvac not found'); process.exit(1) }

// Fine the end of this line and the next '  },' closing the hvac entry
const lineEnd = c.indexOf('\n', hIdx)
console.log('hvac line:', c.slice(hIdx, lineEnd))

// Find the '  },' that closes the hvac-load entry
const afterHvacLine = c.slice(lineEnd + 1)
const closeBrace = afterHvacLine.indexOf('  },')
if (closeBrace === -1) { console.error('close brace not found'); process.exit(1) }
const hvacEntryEnd = lineEnd + 1 + closeBrace + 4  // end of '  },'
console.log('hvac entry ends at byte:', hvacEntryEnd)

// Now find what's after it
const afterHvac = c.slice(hvacEntryEnd)
console.log('Next 3 lines:', afterHvac.split('\n').slice(0, 4).join('\\n'))

// Find the closing '}\n\nconst newCalcTypes'
const closeMarker = '\n}\n\nconst newCalcTypes'
const cIdx = c.lastIndexOf(closeMarker)
if (cIdx === -1) { console.error('closing marker not found'); process.exit(1) }
console.log('closing marker at byte:', cIdx)

// Remove everything between hvacEntryEnd and cIdx
const before = c.slice(0, hvacEntryEnd)
const after = c.slice(cIdx + 1)
const restored = before + after

fs.writeFileSync('src/components/hub-calculators/GenericEngineeringCalculator.tsx', restored, 'utf8')
console.log('Restored. New size:', restored.length, 'bytes')

// Verify
const lines = restored.split('\n')
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("'hvac-load'")) console.log('hvac-load at line', i+1, ':', lines[i])
  if (lines[i].includes("'gerber-parabola'")) console.log('gerber still present at line', i+1)
  if (lines[i].includes('const newCalcTypes')) console.log('newCalcTypes at line', i+1)
}
console.log('Total lines:', lines.length)
