import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ tankLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tankWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tankHeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), shape: z.string().min(1) }),
  fields: [
    { name: 'tankLength', label: 'Tank Length (in)', type: 'number', min: 1, step: '1' },
    { name: 'tankWidth', label: 'Tank Width (in)', type: 'number', min: 1, step: '1' },
    { name: 'tankHeight', label: 'Tank Height (in)', type: 'number', min: 1, step: '1' },
    { name: 'shape', label: 'Shape', type: 'select', options: [{ label: 'Rectangular', value: 'rect' }, { label: 'Cylindrical', value: 'cyl' }] },
  ],
  defaults: { tankLength: '48', tankWidth: '13', tankHeight: '21', shape: 'rect' },
  presets: [
    { label: '55 Gal Rectangle (48×13×21)', values: { tankLength: '48', tankWidth: '13', tankHeight: '21', shape: 'rect' } },
    { label: '20 Gal Long (30×12×12)', values: { tankLength: '30', tankWidth: '12', tankHeight: '12', shape: 'rect' } },
    { label: 'Cylindrical Tank (18" wide)', values: { tankLength: '18', tankWidth: '18', tankHeight: '24', shape: 'cyl' } },
    { label: '10 Gal Standard (20×10×12)', values: { tankLength: '20', tankWidth: '10', tankHeight: '12', shape: 'rect' } },
  ],
  compute: (v) => {
    const isCyl = v.shape === 'cyl'
    const volCuIn = isCyl ? Math.PI * (v.tankWidth / 2) ** 2 * v.tankHeight : v.tankLength * v.tankWidth * v.tankHeight
    const gallons = volCuIn / 231
    const liters = gallons * 3.78541
    const usableGal = gallons * 0.85
    const waterWeight = gallons * 8.34
    const surfaceArea = isCyl ? Math.PI * (v.tankWidth / 2) ** 2 : v.tankLength * v.tankWidth
    const shapeLabel = isCyl ? 'Cylindrical' : 'Rectangular'
    return { result: gallons, label: 'Water Volume', unit: 'gal', steps: [
      { label: `1. ${shapeLabel} volume (cu in)`, value: isCyl
        ? `π × (${v.tankWidth}÷2)² × ${v.tankHeight} = ${volCuIn.toFixed(0)} cu in`
        : `${v.tankLength} × ${v.tankWidth} × ${v.tankHeight} = ${volCuIn.toFixed(0)} cu in` },
      { label: '2. Convert to gallons', value: `${volCuIn.toFixed(0)} ÷ 231 = ${gallons.toFixed(1)} gal` },
      { label: '3. Volume in liters', value: `${gallons.toFixed(1)} × 3.785 = ${liters.toFixed(1)} L` },
      { label: '4. Usable water (~85%)', value: `${gallons.toFixed(1)} × 0.85 = ${usableGal.toFixed(1)} gal` },
      { label: '5. Water weight', value: `${gallons.toFixed(1)} gal × 8.34 lbs/gal = ${waterWeight.toFixed(0)} lbs` },
      { label: '6. Surface area', value: isCyl
        ? `π × (${v.tankWidth}÷2)² = ${surfaceArea.toFixed(0)} sq in`
        : `${v.tankLength} × ${v.tankWidth} = ${surfaceArea.toFixed(0)} sq in` },
    ] ,
    extras: [
      { label: "Shape Formula Comparison", value: "Rectangle: L×W×H. Cylinder: π×r²×H, where r = width/2. One gallon = 231 cu in. Bow-front tanks use the rectangular formula with a width average." },
      { label: "Displacement Reality", value: "Gravel (1-2 lbs/gal), hardscape (rocks/driftwood), filter, heater, and decorations reduce usable water by 10-20%. Always dose medications and fertilizers based on usable volume." },
      { label: "Water Weight", value: "Freshwater weighs 8.34 lbs/gal. Saltwater: 8.55 lbs/gal. A 55gal tank = ~460 lbs water + 40 lbs substrate + 20 lbs glass + 15 lbs equipment = ~535 lbs total." },
      { label: "Stocking Rules", value: `1 inch of adult fish per gallon (freshwater). For saltwater, 1 inch per 5 gallons. Always research adult sizes — many fish sold as 1" grow to 6-12"+` },
      { label: "Glass Bow Factor", value: "Bow-front/convex tanks hold slightly less than rectangular due to curved glass. Subtract 5-10% or measure average width at the widest and narrowest points." },
      { label: "Hexagonal Tanks", value: "For hex tanks: Volume = (3√3 × s² × H) / (2 × 231) where s = side length in inches. Most hex tanks hold less than they appear due to tapered shape." },
      { label: "Temperature Expansion", value: "Water expands slightly when heated. A tank at 78°F vs 68°F has negligible volume difference (<0.2%). More relevant for sealed systems like reef tanks." },
      { label: "Metric Alternative", value: `For dimensions in cm: Volume (L) = L×W×H ÷ 1000. Then 1 L = 0.264 gal. Use this for European tanks. Rim thickness adds 0.5-1" to external measurements.` },
    ]}
  },
  description: 'Calculate water volume for rectangular or cylindrical aquariums. Enter dimensions in inches to get gallons, liters, usable water volume, water weight, and surface area.',
  formula: 'Rect: L×W×H÷231 | Cyl: π×(W/2)²×H÷231 | Usable = Gal × 0.85 | Weight = Gal × 8.34 lbs',
  interpretation: 'Usable water is 80-90% of gross volume after displacement. Freshwater weighs 8.34 lbs/gal. Stock 1" of fish per gallon. Bow-front tanks hold 5-10% less than rectangular.'
}

export default calcDef
