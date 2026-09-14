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
  defaults: { triSwimKm: '1.5', triBikeKm: '40', triRunKm: '10', triGoalHours: '2', triGoalMin: '30', triGoalSec: '0' },
  presets: [
    { label: 'Sprint Triathlon', values: { triSwimKm: '0.75', triBikeKm: '20', triRunKm: '5', triGoalHours: '1', triGoalMin: '15', triGoalSec: '0' } },
    { label: 'Olympic Triathlon', values: { triSwimKm: '1.5', triBikeKm: '40', triRunKm: '10', triGoalHours: '2', triGoalMin: '30', triGoalSec: '0' } },
    { label: 'Half Ironman (70.3)', values: { triSwimKm: '1.9', triBikeKm: '90', triRunKm: '21.1', triGoalHours: '5', triGoalMin: '30', triGoalSec: '0' } },
    { label: 'Full Ironman', values: { triSwimKm: '3.8', triBikeKm: '180', triRunKm: '42.2', triGoalHours: '12', triGoalMin: '0', triGoalSec: '0' } },
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
    return { result: totalSeconds, label: 'Target Finish Time', unit: 'sec', steps: [
      { label: 'Formula', value: 'Split = (GoalTime - Transition) × (LegDist ÷ TotalDist)' },
      { label: 'Goal Time', value: v.triGoalHours + 'h ' + v.triGoalMin + 'm ' + v.triGoalSec + 's (' + totalSeconds + 's)' },
      { label: 'Transition (2 min)', value: 'Subtract ' + transitionTime + 's → ' + actualSeconds + 's racing time' },
      { label: 'Swim (' + v.triSwimKm + ' km)', value: Math.floor(swimTime / 60) + ':' + Math.round(swimTime % 60).toString().padStart(2, '0') + ' (' + swimPace100m.toFixed(1) + 's/100m)' },
      { label: 'Bike (' + v.triBikeKm + ' km)', value: Math.floor(bikeTime / 60) + ':' + Math.round(bikeTime % 60).toString().padStart(2, '0') + ' (' + bikeSpeedKmh.toFixed(1) + ' km/h)' },
      { label: 'Run (' + v.triRunKm + ' km)', value: Math.floor(runTime / 60) + ':' + Math.round(runTime % 60).toString().padStart(2, '0') + ' (' + (runPaceKm / 60).toFixed(1) + ' min/km)' },
    ] ,
    extras: [
      { label: 'Time Allocation', value: 'Swim ~15-18%, Bike ~48-52%, Run ~30-35%. Bike leg is the longest but drafting saves 5-10% energy' },
      { label: 'Wetsuit Advantage', value: 'A wetsuit improves swim times by 5-10% through buoyancy and reduced drag — legal in most races below 76°F' },
      { label: 'Drafting Rules', value: 'Drafting on the bike is illegal in most USAT events (penalty: 2-5 min). Ironman: 12m draft zone' },
      { label: 'Nutrition Strategy', value: 'Aim for 60-90g carbs/hour on bike, 30-60g/hour on run. Practice nutrition in training — race day is not experiment day' },
      { label: 'Transition Tips', value: 'Practice T1/T2 transitions. Pro transitions: 30-60s. Age group: 2-5 min. Lay out gear in order of use' },
      { label: 'Pacing Strategy', value: 'Negative split the bike (ride second half 5-10% harder). The run is where most athletes lose/gain the most positions' },
      { label: 'Heart Rate Zones', value: 'Swim: Z3-4 (155-170 bpm). Bike: Z2-3 (135-155). Run: Z3-4 (150-165). Keep HR under control on the bike' },
      { label: 'Race Day Prep', value: 'Arrive 2h early. Mark transition with a bright towel. Count racks from swim exit. Memorize your bike location' },
    ]}
  },
  description: 'Calculate split times for swim, bike, and run based on triathlon distance and goal finish time. Supports sprint through full Ironman distances with proportional pacing and transition time allocation.',
  formula: 'Leg Time = (Total Goal Seconds - 120s Transition) × (Leg Distance ÷ Total Distance). Swim Pace (s/100m) = Swim Time ÷ (Swim km × 10). Bike Speed (km/h) = Bike km ÷ (Bike Time ÷ 3600). Run Pace (min/km) = Run Time ÷ (Run km × 60).',
  interpretation: 'Time allocation is proportional to distance: swim gets 15-18% of total time, bike 48-52%, run 30-35%. For a 2:30 Olympic triathlon: swim ~22 min (1:30/100m), bike ~77 min (31 km/h), run ~51 min (5:05/km), plus 2 min transitions. Adjust pacing based on your strengths — stronger cyclists can push the bike and hold on during the run.'
}

export default calcDef
