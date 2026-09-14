import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ trc2Width: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), trc2Aspect: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), trc2Rim: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), trc2NewWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), trc2NewAspect: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), trc2NewRim: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'trc2Width', label: 'Current Width (mm)', type: 'number', min: 135, max: 405, step: '10' },
    { name: 'trc2Aspect', label: 'Current Aspect Ratio (%)', type: 'number', min: 20, max: 85, step: '5' },
    { name: 'trc2Rim', label: 'Current Rim (in)', type: 'number', min: 12, max: 30, step: '1' },
    { name: 'trc2NewWidth', label: 'New Width (mm)', type: 'number', min: 135, max: 405, step: '10' },
    { name: 'trc2NewAspect', label: 'New Aspect Ratio (%)', type: 'number', min: 20, max: 85, step: '5' },
    { name: 'trc2NewRim', label: 'New Rim (in)', type: 'number', min: 12, max: 30, step: '1' },
  ],
  defaults: { trc2Width: '205', trc2Aspect: '55', trc2Rim: '16', trc2NewWidth: '225', trc2NewAspect: '45', trc2NewRim: '17' },
  presets: [
    { label: 'Sedan Upgrade (16→17 in)', values: { trc2Width: '205', trc2Aspect: '55', trc2Rim: '16', trc2NewWidth: '225', trc2NewAspect: '45', trc2NewRim: '17' } },
    { label: 'SUV Off-Road (larger)', values: { trc2Width: '265', trc2Aspect: '65', trc2Rim: '17', trc2NewWidth: '285', trc2NewAspect: '70', trc2NewRim: '18' } },
    { label: 'Sports Car (wider/lower)', values: { trc2Width: '225', trc2Aspect: '45', trc2Rim: '17', trc2NewWidth: '245', trc2NewAspect: '40', trc2NewRim: '18' } },
    { label: 'Winter Tires (narrower)', values: { trc2Width: '235', trc2Aspect: '55', trc2Rim: '17', trc2NewWidth: '215', trc2NewAspect: '60', trc2NewRim: '17' } },
  ],
  compute: (v) => {
    const oldSidewall = v.trc2Width * (v.trc2Aspect / 100) / 25.4
    const oldDiameter = v.trc2Rim + oldSidewall * 2
    const newSidewall = v.trc2NewWidth * (v.trc2NewAspect / 100) / 25.4
    const newDiameter = v.trc2NewRim + newSidewall * 2
    const diff = newDiameter - oldDiameter
    const diffPct = oldDiameter > 0 ? (diff / oldDiameter) * 100 : 0
    const speedError = 60 * (1 + diffPct / 100) - 60
    let safetyMsg = 'Within safe range (< 3%)'
    if (diffPct > 3 || diffPct < -3) safetyMsg = 'WARNING: Exceeds 3% limit — ABS and speedometer affected'
    return { result: newDiameter, label: 'New Tire Diameter', unit: 'in', steps: [
      { label: 'Formula', value: 'Diameter = Rim + 2 × (Width × Aspect/100) / 25.4' },
      { label: 'Old Tire', value: v.trc2Width + '/' + v.trc2Aspect + 'R' + v.trc2Rim },
      { label: 'New Tire', value: v.trc2NewWidth + '/' + v.trc2NewAspect + 'R' + v.trc2NewRim },
      { label: 'Old Diameter', value: v.trc2Rim + ' + 2 × (' + v.trc2Width + ' × ' + (v.trc2Aspect / 100) + ')/25.4 = ' + oldDiameter.toFixed(2) + ' in' },
      { label: 'New Diameter', value: v.trc2NewRim + ' + 2 × (' + v.trc2NewWidth + ' × ' + (v.trc2NewAspect / 100) + ')/25.4 = ' + newDiameter.toFixed(2) + ' in' },
      { label: 'Difference', value: diff.toFixed(2) + ' in (' + diffPct.toFixed(1) + '%)' },
      { label: 'Speedo Error @ 60mph', value: speedError.toFixed(1) + ' mph (actual speed)' },
      { label: 'Safety Assessment', value: safetyMsg },
    ] ,
    extras: [
      { label: '3% Rule', value: 'Tire diameter must stay within ±3% of OEM for proper ABS, traction control, and speedometer calibration' },
      { label: 'Speedometer Effect', value: 'Larger diameter tires make your speedometer read slower than actual speed. At +3%, 60 mph indicated = 61.8 mph actual' },
      { label: 'Ground Clearance', value: 'Going +1 in diameter raises your car by 0.5 in — helpful for snow/off-road but changes center of gravity' },
      { label: 'Acceleration Tradeoff', value: 'Larger diameter = taller gearing = lower RPM at highway but reduced acceleration. +3% diameter = ~3% less torque at wheels' },
      { label: 'Fender Clearance', value: 'Always check fender clearance when upsizing. +1 in rim typically needs +0.5 in clearance each side. Test with wheels at full lock' },
      { label: 'Load Rating', value: 'Upsizing? Ensure new tires have equal or higher load rating than OEM. Especially critical for trucks and SUVs' },
      { label: 'TPMS Compatibility', value: 'Aftermarket wheels may need TPMS sensor relocation or new sensors. Factor $50-100/wheel for TPMS installation' },
      { label: 'Winter Tire Strategy', value: 'Narrower tires (e.g., 205 vs 225) cut through snow better. Higher aspect ratio (60 vs 45) gives more sidewall flex for grip' },
    ]}
  },
  description: 'Compare two tire sizes to calculate diameter difference, speedometer error, and safety compatibility. Essential when upsizing wheels, switching to winter tires, or considering an off-road upgrade.',
  formula: 'Diameter (in) = Rim Diameter + 2 × (Width × Aspect Ratio ÷ 100) ÷ 25.4. Difference % = (New - Old) ÷ Old × 100. Speedometer Error at 60 mph = 60 × (1 + Diff%) - 60.',
  interpretation: 'A 205/55R16 to 225/45R17 change: old diameter ~24.9 in, new ~25.0 in, difference +0.3% — perfectly safe. Speedometer reads 60 mph but actual speed is 60.2 mph. Staying within ±3% is critical for ABS, ESC, and speedometer accuracy. Going larger improves ground clearance but reduces acceleration; going smaller improves acceleration but increases highway RPM.'
}

export default calcDef
