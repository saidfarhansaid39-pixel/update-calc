import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ pointsCovered: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), totalPoints: z.string().min(1).refine(v => parseInt(v) > 0, '>0') }),
  fields: [
    { name: 'pointsCovered', label: 'Points with canopy overhead', type: 'number', min: 0, step: '1' },
    { name: 'totalPoints', label: 'Total sampling points', type: 'number', min: 1, step: '1' },
    ],
  presets: [
    { label: 'Piping plover nest success', values: { nests: '30', successfulNests: '12', eggsPerNest: '4' } },
    { label: 'Invasive kudzu control', values: { infestationArea: '5', treatmentEfficacy: '60', regrowthRate: '15' } },
    { label: 'Canopy cover restoration', values: { baselines: '10', quadrats: '25', canopyThreshold: '30' } },
    { label: 'Rainwater harvesting', values: { roofArea: '100', annualRainfall: '900', collectionEff: '0.8' } },
    { label: 'Nest box monitoring', values: { nestBoxes: '50', occupied: '32', fledgedPerNest: '2.5' } }
    ],
  compute: (v) => { const covered = parseInt(v.pointsCovered); const total = parseInt(v.totalPoints); const pct = total>0?covered/total*100:0; return { result: pct, label: 'Canopy Cover', unit: '%', steps: [{ label: 'Canopy points', value: `${covered}` }, { label: 'Total points', value: `${total}` }, { label: 'Cover = covered/total × 100', value: `${pct.toFixed(1)}%` }, { label: 'Interpretation', value: pct>70?'Closed canopy':pct>30?'Moderate canopy':'Open canopy' }] ,
    extras: [
      { label: "Environmental Context", value: "Applied ecology translates ecological principles into practical management — from restoring degraded habitats to controlling invasive species." },
      { label: "Measurement Method", value: "Field experiments, BACI (Before-After-Control-Impact) designs, adaptive management frameworks. Monitoring data collected at regular intervals." },
      { label: "Conservation Note", value: "Nest success rates < 30% often require intervention. Invasive species control costs $120 billion/year in the US alone. Early detection is critical." },
      { label: "Typical Ranges", value: "Nest success: 20-80% (species-dependent). Canopy cover: 25-100% (forest interior). Invasive species cover >30% indicates need for control." },
      { label: "Related Concepts", value: "Adaptive management, ecological restoration, integrated pest management, early detection rapid response (EDRR), rewilding." }
    ]} },
  description: 'Canopy cover is the proportion of ground area covered by the vertical projection of tree crowns, measured using densiometers or point sampling.',
  formula: 'Canopy cover (%) = (Points with canopy / Total points) × 100',
  interpretation: '>70% = closed canopy forest, 30-70% = moderate, <30% = open canopy. Affects understory light, temperature, and moisture conditions.'
}

export default calcDef
