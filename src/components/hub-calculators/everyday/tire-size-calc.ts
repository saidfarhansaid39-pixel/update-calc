import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ tr2Width: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tr2Aspect: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tr2Rim: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'tr2Width', label: 'Tire Width (mm)', type: 'number', min: 135, max: 405, step: '10' },
    { name: 'tr2Aspect', label: 'Aspect Ratio (%)', type: 'number', min: 20, max: 85, step: '5' },
    { name: 'tr2Rim', label: 'Rim Diameter (in)', type: 'number', min: 12, max: 30, step: '1' },
  ],
  defaults: { tr2Width: '225', tr2Aspect: '45', tr2Rim: '17' },
  presets: [
    { label: 'Compact Car (185/65R15)', values: { tr2Width: '185', tr2Aspect: '65', tr2Rim: '15' } },
    { label: 'Sedan (205/55R16)', values: { tr2Width: '205', tr2Aspect: '55', tr2Rim: '16' } },
    { label: 'Sports Car (225/45R17)', values: { tr2Width: '225', tr2Aspect: '45', tr2Rim: '17' } },
    { label: 'SUV/Truck (265/70R17)', values: { tr2Width: '265', tr2Aspect: '70', tr2Rim: '17' } },
  ],
  compute: (v) => {
    const sidewallMm = v.tr2Width * (v.tr2Aspect / 100)
    const sidewallIn = sidewallMm / 25.4
    const totalDiameter = v.tr2Rim + sidewallIn * 2
    const circumferenceIn = totalDiameter * Math.PI
    const revsPerMile = 63360 / circumferenceIn
    return { result: totalDiameter, label: 'Overall Tire Diameter', unit: 'in', steps: [
      { label: 'Formula', value: 'Diameter = Rim + 2 × (Width × Aspect/100) / 25.4' },
      { label: 'Tire Marking', value: v.tr2Width + '/' + v.tr2Aspect + 'R' + v.tr2Rim },
      { label: 'Sidewall', value: v.tr2Width + ' × ' + (v.tr2Aspect / 100) + ' = ' + sidewallMm.toFixed(1) + ' mm (' + sidewallIn.toFixed(2) + ' in)' },
      { label: 'Rim', value: v.tr2Rim + ' in' },
      { label: 'Total Diameter', value: v.tr2Rim + ' + 2 × ' + sidewallIn.toFixed(2) + ' = ' + totalDiameter.toFixed(2) + ' in' },
      { label: 'Circumference', value: totalDiameter.toFixed(2) + ' × π = ' + circumferenceIn.toFixed(2) + ' in' },
      { label: 'Revs per Mile', value: '63,360 ÷ ' + circumferenceIn.toFixed(2) + ' = ' + revsPerMile.toFixed(0) + ' revs/mi' },
    ] ,
    extras: [
      { label: 'Tire Markings Decoded', value: '205/55R16: 205 mm width, 55% aspect ratio (sidewall = 55% of width), Radial, 16 in rim diameter' },
      { label: 'Diameter Examples', value: '205/55R16 = 24.9 in. 225/45R17 = 25.0 in. 265/70R17 = 31.6 in.  LT285/75R16 = 32.8 in (light truck)' },
      { label: 'Plus Sizing', value: '+1 sizing: go up 1 in rim, lower aspect ratio ~5-10 points, keep same diameter. E.g., 205/55R16 → 225/45R17' },
      { label: 'Revs/Mile Impact', value: 'More revs/mile = more speedometer reading than actual speed. A 2% diameter reduction = 2% more revs = 2% speedo error' },
      { label: 'OEM vs Aftermarket', value: 'OEM tires are tuned for ride comfort and noise. Aftermarket can improve handling but may increase road noise by 2-5 dB' },
      { label: 'Tire Weight', value: 'A 225/45R17 weighs ~22-26 lb. Upsizing to 245/40R18 adds ~4-6 lb per corner — affects acceleration and fuel economy' },
      { label: 'Speed Rating', value: 'Common ratings: H (130 mph), V (149 mph), W (168 mph), Y (186 mph). Never install a lower speed rating than OEM' },
      { label: 'Tire Pressure', value: 'Recommended pressure on door jamb sticker, not tire sidewall. +1 sizing: pressure may need ~2-4 PSI adjustment' },
    ]}
  },
  description: 'Calculate overall tire diameter, sidewall height, circumference, and revolutions per mile from standard tire size markings (e.g., 225/45R17). Essential for checking tire compatibility, speedometer calibration, and gear ratio analysis.',
  formula: 'Sidewall (in) = Width (mm) × (Aspect Ratio ÷ 100) ÷ 25.4. Total Diameter = Rim Diameter + 2 × Sidewall. Circumference = Diameter × π. Revs per Mile = 63,360 ÷ Circumference.',
  interpretation: 'A 225/45R17 tire has a 225 mm tread width, 45% aspect ratio (101.25 mm sidewall), fits a 17 in rim, and has an overall diameter of ~25.0 in. Each revolution covers ~78.5 in of road, meaning ~807 revs per mile. Understanding these dimensions is critical when replacing tires, changing wheel sizes, or ensuring speedometer accuracy.'
}

export default calcDef
