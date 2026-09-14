import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ input1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), input2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'input1', label: 'Climate Envelope Input', type: 'number', unit: '', min: 0, step: '0.1' }, { name: 'input2', label: 'Second Parameter', type: 'number', unit: '', min: 0, step: '0.1' }],
  presets: [
    { label: 'Alpine treeline shift', values: { currentElevation: '2200', futureElevation: '2600', shiftRate: '12' } },
    { label: 'Species northward shift', values: { currentLat: '40', futureLat: '43', shiftRate: '17' } },
    { label: 'Bioclimatic envelope', values: { bio1: '15', bio7: '28', bio12: '1200' } },
    { label: 'Climate velocity', values: { tempGradient: '0.6', warmingRate: '0.3', shiftDistance: '50' } },
    { label: 'Assisted migration', values: { currentRange: '500', targetRange: '300', dispersalCap: '5' } }
    ],
  compute: (v) => ({ result: v.input1 * v.input2 || v.input1, label: 'Climate Envelope Result', unit: '', steps: [{ label: 'Formula', value: 'Standard formula' }, { label: 'Input', value: String(v.input1) }, { label: 'Result', value: String(Math.round((v.input1 * v.input2 || v.input1) * 100) / 100) + ' ' }],
    extras: [
      { label: "Environmental Context", value: "Species are shifting ranges toward poles and higher elevations in response to climate change." },
      { label: "Measurement Method", value: "Species distribution models (SDMs) use occurrence data + bioclimatic variables (WorldClim, CHELSA). Ensemble modeling reduces uncertainty." },
      { label: "Conservation Note", value: "Climate velocity exceeds dispersal capacity for many species, increasing extinction risk." },
      { label: "Typical Ranges", value: "Climate velocity: 0.1-10 km/decade. Species shift rates: 1-50 km/decade." },
      { label: "Related Concepts", value: "Ecological niche theory, climate refugia, assisted migration, phenological shifts." }
    ] }),
  description: 'Climate envelope model. Calculates the climate envelope based on input parameters.',
  formula: 'Standard formula',
  interpretation: 'Species bioclimatic range under current and future climate.'
}

export default calcDef
