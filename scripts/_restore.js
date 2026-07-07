const fs = require('fs')
const c = fs.readFileSync('src/components/hub-calculators/GenericEngineeringCalculator.tsx', 'utf8')

// Find the last occurrence of 'hvac-load' entry end, then the first new entry
const hvacClose = "example: { label: '50m\u00b2, 2.7m, \u0394T=15\u00b0C, 4 people', value: 'Cooling load = 1,068 W (0.30 tons)' },\n  },"
const gerberStart = "  'gerber-parabola': {"
const closeMarker = "\n}\n\nconst newCalcTypes"

const hvacIdx = c.lastIndexOf(hvacClose)
const closeIdx = c.lastIndexOf(closeMarker)

if (hvacIdx === -1 || closeIdx === -1) {
  console.error('Could not find markers', { hvacIdx, closeIdx })
  process.exit(1)
}

// The inserted block starts after hvacClose and ends at closeIdx
const before = c.slice(0, hvacIdx + hvacClose.length)
const after = c.slice(closeIdx + 1) // includes the \n before }

const restored = before + after
fs.writeFileSync('src/components/hub-calculators/GenericEngineeringCalculator.tsx', restored, 'utf8')
console.log('Restored original file')

// Verify
const lines = restored.split('\n')
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("'hvac-load'") || lines[i].includes('const newCalcTypes')) {
    console.log(`Line ${i+1}: ${lines[i]}`)
  }
}
