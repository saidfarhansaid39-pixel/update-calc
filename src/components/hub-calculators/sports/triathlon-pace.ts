import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ swimKm: z.string().min(1).refine(v => parseFloat(v) >= 0), bikeKm: z.string().min(1).refine(v => parseFloat(v) >= 0), runKm: z.string().min(1).refine(v => parseFloat(v) >= 0), totalMin: z.string().min(1).refine(v => parseFloat(v) > 0) }),
  fields: [
    { name: 'swimKm', label: 'Swim Distance', type: 'number', unit: 'km', min: 0, step: '0.1' },
    { name: 'bikeKm', label: 'Bike Distance', type: 'number', unit: 'km', min: 0, step: '1' },
    { name: 'runKm', label: 'Run Distance', type: 'number', unit: 'km', min: 0, step: '0.1' },
    { name: 'totalMin', label: 'Total Time', type: 'number', unit: 'min', min: 1, step: '1' },
  ],
  compute: (v) => {
    const totalKm = v.swimKm + v.bikeKm + v.runKm; const pace = totalKm > 0 ? v.totalMin / totalKm : 0
    return { result: pace, label: 'Triathlon Pace', unit: 'min/km', steps: [
      { label: 'Total distance', value: totalKm.toFixed(1)+' km' },
      { label: 'Total time', value: v.totalMin+' min ('+Math.floor(v.totalMin/60)+'h '+(v.totalMin%60).toFixed(0)+'m)' },
      { label: 'Overall pace', value: pace < 60 ? (pace*60).toFixed(0)+' s/km' : Math.floor(pace/60)+':'+Math.round(pace%60).toString().padStart(2,'0')+' min/km' },
    ]}
  }, description: 'Calculate overall triathlon pace across all three disciplines for pacing strategy development.', formula: 'Overall pace = total time / total distance', interpretation: 'Overall pace helps triathletes set realistic targets and manage effort across disciplines.'
}

export default calcDef
