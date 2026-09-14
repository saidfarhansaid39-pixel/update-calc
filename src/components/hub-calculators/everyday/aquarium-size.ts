import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ length: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'), width: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'), height: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0') }),
  fields: [
    { name: 'length', label: 'Length (inches)', type: 'number', min: 1, step: '1' },
    { name: 'width', label: 'Width (inches)', type: 'number', min: 1, step: '1' },
    { name: 'height', label: 'Height (inches)', type: 'number', min: 1, step: '1' },
  ],
  defaults: { length: '48', width: '13', height: '21' },
  presets: [
    { label: '10 Gal Standard (20×10×12)', values: { length: '20', width: '10', height: '12' } },
    { label: '20 Gal Tall (24×12×16)', values: { length: '24', width: '12', height: '16' } },
    { label: '55 Gal Standard (48×13×21)', values: { length: '48', width: '13', height: '21' } },
    { label: '75 Gal (48×18×21)', values: { length: '48', width: '18', height: '21' } },
  ],
  compute: (v) => {
    const volCuIn = v.length * v.width * v.height
    const gallons = volCuIn / 231
    const liters = gallons * 3.785
    const usableGal = gallons * 0.85
    const surfaceArea = v.length * v.width
    const gasExchange = surfaceArea / 12
    const stockingInches = gallons
    return { result: gallons, label: 'Tank Volume', unit: 'gal', steps: [
      { label: '1. Volume in cubic inches', value: `${v.length}" × ${v.width}" × ${v.height}" = ${volCuIn.toFixed(0)} cu in` },
      { label: '2. Convert to gallons', value: `${volCuIn.toFixed(0)} ÷ 231 = ${gallons.toFixed(1)} gal` },
      { label: '3. Volume in liters', value: `${gallons.toFixed(1)} gal × 3.785 = ${liters.toFixed(1)} L` },
      { label: '4. Usable water (85%)', value: `${gallons.toFixed(1)} × 0.85 (substrate/decor) = ${usableGal.toFixed(1)} gal` },
      { label: '5. Surface area', value: `${v.length}" × ${v.width}" = ${surfaceArea} sq in` },
      { label: '6. Gas exchange rating', value: `${surfaceArea} ÷ 12 ≈ ${gasExchange.toFixed(0)} (score > 20 is excellent)` },
      { label: '7. Stocking capacity', value: `~${stockingInches.toFixed(0)} inches of fish total (1"/gal guideline)` },
    ] ,
    extras: [
      { label: "Displacement Factor", value: "Subtract 10-15% for gravel/sand (1-2 lbs/gal), hardscape (driftwood/rocks), and equipment (filter, heater). A 55 gal tank holds ~45-50 gal actual water." },
      { label: "Standard Tank Sizes", value: "10gal (20×10×12), 20L (30×12×12), 29gal (30×12×18), 55gal (48×13×21), 75gal (48×18×21), 125gal (72×18×21). Measure your tank's actual outside dimensions." },
      { label: "Stocking Guidelines", value: "1 inch of adult fish per gallon is a starting point. A 55 gal tank = ~55 inches of fish. Consider bioload, temperament, and swimming space — not just inches." },
      { label: "Surface Area Matters", value: "Wider tanks provide better gas exchange (O₂ in, CO₂ out). Long/low tanks (e.g., 40Breeder 36×18×16) have excellent surface area for oxygen exchange." },
      { label: "Glass Thickness", value: `Larger tanks need thicker glass: ≤55gal uses 3/8", 55-75gal uses 1/2", 75-125gal uses 5/8", >125gal needs 3/4" or bracing. Check manufacturer specs.` },
      { label: "Weight Considerations", value: "A filled tank weighs ~8.5-10 lbs per gallon. A 55gal tank = ~500 lbs total. Ensure your floor/stand can support the weight. Place perpendicular to floor joists." },
      { label: "Stocking by Swimming Style", value: "Surface: hatchetfish, top-dwelling tetras. Mid-water: most tetras, rasboras, barbs. Bottom: corydoras, loaches, plecos. Stock all levels for a balanced community." },
      { label: "Filtration Sizing", value: "Filter should turn over tank volume 4-10× per hour. For a 55 gal tank: 220-550 GPH filter. Canister filters are best for planted tanks; HOB for easy maintenance." },
    ]}
  },
  description: 'Calculate aquarium volume in gallons and liters from length, width, and height. Includes usable water volume (85% after displacement), surface area, and gas exchange rating.',
  formula: 'Volume (gal) = (L × W × H) ÷ 231 | L = L × W × H × 3.785 | Usable = Gal × 0.85 | Surface Area = L × W | Stocking ≈ gal inches of fish',
  interpretation: 'Usable water is ~85% of gross volume due to displacement. Stock ~1" of adult fish per gallon. Wider tanks = better gas exchange. A 55gal tank weighs ~500 lbs filled.'
}

export default calcDef
