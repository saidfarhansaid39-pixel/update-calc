import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ triSwimKm: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), triBikeKm: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), triRunKm: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), triGoalHours: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), triGoalMin: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), triGoalSec: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'triSwimKm', label: 'Swim Distance (km)', type: 'number', min: 0, step: '0.5' },
    { name: 'triBikeKm', label: 'Bike Distance (km)', type: 'number', min: 0, step: '5' },
    { name: 'triRunKm', label: 'Run Distance (km)', type: 'number', min: 0, step: '2' },
    { name: 'triGoalHours', label: 'Goal Hours', type: 'number', min: 0, step: '1' },
    { name: 'triGoalMin', label: 'Goal Minutes', type: 'number', min: 0, max: 59, step: '5' },
    { name: 'triGoalSec', label: 'Goal Seconds', type: 'number', min: 0, max: 59, step: '10' },
  ],
  compute: (v) => {
    const totalSeconds = v.triGoalHours * 3600 + v.triGoalMin * 60 + v.triGoalSec
    const totalDistKm = v.triSwimKm + v.triBikeKm + v.triRunKm
    const transitionTime = 120
    const actualSeconds = totalSeconds - transitionTime
    const swimPct = totalDistKm > 0 ? v.triSwimKm / totalDistKm : 0
    const bikePct = totalDistKm > 0 ? v.triBikeKm / totalDistKm : 0
    const runPct = totalDistKm > 0 ? v.triRunKm / totalDistKm : 0
    const swimTime = actualSeconds * swimPct
    const bikeTime = actualSeconds * bikePct
    const runTime = actualSeconds * runPct
    const swimPace100m = v.triSwimKm > 0 ? (swimTime / (v.triSwimKm * 10)) : 0
    const bikeSpeedKmh = v.triBikeKm > 0 && bikeTime > 0 ? (v.triBikeKm / (bikeTime / 3600)) : 0
    const runPaceKm = v.triRunKm > 0 ? (runTime / v.triRunKm) : 0
    return { result: totalSeconds, label: 'Target Finish Time', unit: 'sec', steps: [{ label: 'Swim (' + v.triSwimKm + ' km)', value: Math.floor(swimTime / 60) + ':' + Math.round(swimTime % 60).toString().padStart(2, '0') + ' (' + swimPace100m.toFixed(1) + 's/100m)' }, { label: 'Bike (' + v.triBikeKm + ' km)', value: Math.floor(bikeTime / 60) + ':' + Math.round(bikeTime % 60).toString().padStart(2, '0') + ' (' + bikeSpeedKmh.toFixed(1) + ' km/h)' }, { label: 'Run (' + v.triRunKm + ' km)', value: Math.floor(runTime / 60) + ':' + Math.round(runTime % 60).toString().padStart(2, '0') + ' (' + (runPaceKm / 60).toFixed(1) + ' min/km)' }, { label: 'Total + Transition', value: v.triGoalHours + 'h ' + v.triGoalMin + 'm ' + v.triGoalSec + 's' }] }
  },
  description: 'Calculate split times for swim, bike, and run in a triathlon based on total distance and goal finish time.',
  formula: 'Sprint: 0.75km/20km/5km | Olympic: 1.5km/40km/10km | Half: 1.9km/90km/21.1km | Full: 3.8km/180km/42.2km',
  interpretation: 'Time allocation: swim ~15% (wetsuit helps), bike ~50% (drafting legal), run ~35% (most challenging). Olympic distance: 2-3 hours. Half Ironman: 4.5-6 hours. Full Ironman: 9-17 hours. Include 2-5 min transitions.'
}

export default calcDef
