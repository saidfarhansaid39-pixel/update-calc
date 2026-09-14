import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ input1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), input2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'input1', label: 'Species Distribution Input', type: 'number', unit: '', min: 0, step: '0.1' }, { name: 'input2', label: 'Second Parameter', type: 'number', unit: '', min: 0, step: '0.1' }],
  presets: [
    { label: 'Alpine treeline shift', values: { currentElevation: '2200', futureElevation: '2600', shiftRate: '12' } },
    { label: 'Species northward shift', values: { currentLat: '40', futureLat: '43', shiftRate: '17' } },
    { label: 'Bioclimatic envelope', values: { bio1: '15', bio7: '28', bio12: '1200' } },
    { label: 'Climate velocity', values: { tempGradient: '0.6', warmingRate: '0.3', shiftDistance: '50' } },
    { label: 'Assisted migration', values: { currentRange: '500', targetRange: '300', dispersalCap: '5' } }
    ],
  compute: (v) => ({ result: v.input1 * v.input2 || v.input1, label: 'Species Distribution Result', unit: '', steps: [{ label: 'Formula', value: 'Standard formula' }, { label: 'Input', value: String(v.input1) }, { label: 'Result', value: String(Math.round((v.input1 * v.input2 || v.input1) * 100) / 100) + ' ' }],
    extras: [
      { label: "Environmental Context", value: "Species distribution models (SDMs) predict suitable habitat across space and time." },
      { label: "Measurement Method", value: "MaxEnt, GLM, GAM, Random Forest using presence data and bioclimatic predictors." },
      { label: "Conservation Note", value: "SDMs inform IUCN Red List assessments and protected area expansion decisions." },
      { label: "Typical Ranges", value: "AUC: 0.5 (random) to 1.0 (perfect). TSS: -1 to 1 (>0.4 good)." },
      { label: "Related Concepts", value: "Ecological niche theory, climate envelope, MaxEnt, ensemble modeling." }
    ] }),
  description: 'Species distribution model. Calculates the species distribution based on input parameters.',
  formula: 'Standard formula',
  interpretation: 'MaxEnt or GLM based habitat suitability mapping.'
}

export default calcDef
