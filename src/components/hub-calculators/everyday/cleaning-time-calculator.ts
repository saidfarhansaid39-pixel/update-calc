import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ roomCount: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), bathCount: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), sqftClean: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), clutterLevel: z.string().min(1), floorType: z.string().min(1), deepClean: z.string().min(1) }),
  fields: [
    { name: 'roomCount', label: 'Number of Rooms', type: 'number', min: 1, step: '1' },
    { name: 'bathCount', label: 'Number of Bathrooms', type: 'number', min: 1, step: '1' },
    { name: 'sqftClean', label: 'Total Sq Ft', type: 'number', min: 200, step: '100' },
    { name: 'clutterLevel', label: 'Clutter Level', type: 'select', options: [{ label: 'Minimal', value: 'minimal' }, { label: 'Moderate', value: 'moderate' }, { label: 'Heavy', value: 'heavy' }] },
    { name: 'floorType', label: 'Floor Type', type: 'select', options: [{ label: 'Hardwood/LVP', value: 'hard' }, { label: 'Carpet (most rooms)', value: 'carpet' }, { label: 'Tile/Mixed', value: 'tile' }] },
    { name: 'deepClean', label: 'Cleaning Type', type: 'select', options: [{ label: 'Standard Surface Clean', value: 'standard' }, { label: 'Deep Clean', value: 'deep' }, { label: 'Move-Out/Move-In', value: 'moveout' }] },
  ],
  defaults: { roomCount: '4', bathCount: '2', sqftClean: '1500', clutterLevel: 'moderate', floorType: 'hard', deepClean: 'standard' },
  presets: [
    { label: 'Small Apartment Quick Clean', values: { roomCount: '2', bathCount: '1', sqftClean: '700', clutterLevel: 'minimal', floorType: 'hard', deepClean: 'standard' } },
    { label: 'Standard Family Home', values: { roomCount: '5', bathCount: '2.5', sqftClean: '1800', clutterLevel: 'moderate', floorType: 'carpet', deepClean: 'standard' } },
    { label: 'Deep Clean Weekend', values: { roomCount: '4', bathCount: '2', sqftClean: '1500', clutterLevel: 'moderate', floorType: 'tile', deepClean: 'deep' } },
    { label: 'Move-Out Cleaning', values: { roomCount: '6', bathCount: '3', sqftClean: '2500', clutterLevel: 'heavy', floorType: 'carpet', deepClean: 'moveout' } },
  ],
  compute: (v) => {
    const roomTime = v.roomCount * 10
    const bathTime = v.bathCount * 20
    const sqftTime = v.sqftClean * 0.02
    const clutterFactors: Record<string, number> = { minimal: 0.8, moderate: 1, heavy: 1.4 }
    const floorFactor = v.floorType === 'carpet' ? 0.15 : v.floorType === 'tile' ? 0.05 : 0
    const sqftFloorAdj = v.sqftClean * floorFactor
    const deepCleanFactors: Record<string, number> = { standard: 1, deep: 1.8, moveout: 2.5 }
    const totalMin = Math.ceil((roomTime + bathTime + sqftTime + sqftFloorAdj) * clutterFactors[v.clutterLevel] * deepCleanFactors[v.deepClean])
    const hours = Math.floor(totalMin / 60)
    const mins = totalMin % 60
    const cleaningPace = (totalMin / v.sqftClean).toFixed(2)
    const proCost = totalMin <= 120 ? 0 : (totalMin / 60) * 45
    const breaksNeeded = Math.floor(totalMin / 45)
    return { result: totalMin, label: 'Estimated Cleaning Time', unit: 'minutes', steps: [
      { label: 'Room Dusting & Tidy', value: `${v.roomCount} rooms × 10 min = ${roomTime} min` },
      { label: 'Bathroom Scrubbing', value: `${v.bathCount} baths × 20 min = ${bathTime} min` },
      { label: 'Floor Area Sweeping/Mopping', value: `${v.sqftClean} sq ft × 0.02 = ${sqftTime.toFixed(0)} min` },
      { label: `Floor Type Adjustment (${v.floorType})`, value: floorFactor > 0 ? `+${sqftFloorAdj.toFixed(0)} min (${v.floorType} takes longer)` : 'Hard floors: standard pace' },
      { label: `Clutter Factor`, value: `${clutterFactors[v.clutterLevel]}× (${v.clutterLevel})` },
      { label: `Cleaning Depth (${v.deepClean})`, value: `${deepCleanFactors[v.deepClean]}× multiplier` },
      { label: 'Total Time', value: `${hours > 0 ? `${hours}h ${mins}m` : `${totalMin} min`} (${cleaningPace} min/sq ft)` },
      { label: 'Suggested Breaks', value: breaksNeeded > 0 ? `Take ${breaksNeeded} × 5-10 min break${breaksNeeded > 1 ? 's' : ''}` : 'No break needed — under 45 min' },
    ] ,
    extras: [
      { label: 'Professional Cleaner Benchmark', value: `Professionals average ${(totalMin / v.sqftClean).toFixed(1)} min/sq ft — ${totalMin / v.sqftClean > 0.04 ? 'slower' : 'faster'} than the 0.04 industry standard. Your ${totalMin < 60 ? '<1 hour' : `${hours}h ${mins}m`} estimate is ${deepCleanFactors[v.deepClean] < 1.5 ? 'a light surface clean' : deepCleanFactors[v.deepClean] < 2.2 ? 'a thorough cleaning' : 'a deep scrub'}. Pro cleaning of your home would cost ~$${proCost.toFixed(0)}.` },
      { label: 'Room-by-Room Time Allocation', value: `Expected breakdown: Kitchen (25% = ${(totalMin * 0.25).toFixed(0)} min), Bathrooms (20% = ${(totalMin * 0.2).toFixed(0)} min), Living areas (20% = ${(totalMin * 0.2).toFixed(0)} min), Bedrooms (20% = ${(totalMin * 0.2).toFixed(0)} min), Entry/halls (10% = ${(totalMin * 0.1).toFixed(0)} min), Detail work (5% = ${(totalMin * 0.05).toFixed(0)} min).` },
      { label: 'Speed Cleaning Technique', value: 'Work top-to-bottom, left-to-right. Use a caddy to carry supplies. The 10-minute tidy: pick up clutter first, then spray and walk away (let dwell time work). Microfiber picks up 99% of bacteria vs 30% for cotton cloths. Cutting clutter time by half saves 15-30 min per session.' },
      { label: 'Carpet vs Hard Floor Time', value: v.floorType === 'carpet' ? `Carpet adds ${sqftFloorAdj.toFixed(0)} min for vacuuming (slow passes needed) vs hard floors for sweeping/mopping. Carpet also needs: spot cleaning (5-10 min), occasional steam cleaning (add 1-2 hrs quarterly).` : `Hard floors clean ${floorFactor === 0 ? 'fastest' : 'moderately'}. Sweep/vacuum then damp mop takes ~${(v.sqftClean * 0.015).toFixed(0)} min for ${v.sqftClean} sq ft. No carpet shampooing needed — saves 30-60 min monthly.` },
      { label: 'Deep Clean vs Standard: The Gap', value: v.deepClean !== 'standard' ? `A ${v.deepClean} clean takes ${deepCleanFactors[v.deepClean]}× longer than standard. This includes: moving furniture, washing baseboards, inside cabinets, blinds, light fixtures, behind appliances. Budget ${hours > 3 ? 'a full morning/afternoon' : '1-2 hours'} for this level.` : 'Standard clean skips: baseboards, blinds, inside cabinets, appliance pulls, and light fixtures. A deep clean (1.8× time) hits these 2-4×/year. Schedule quarterly deep cleans to maintain home condition.' },
      { label: 'Productivity vs Perfection', value: 'Cleaning has diminishing returns after 60 min — focus and energy drop 30-40%. The Pomodoro technique works: 25 min cleaning, 5 min rest. Most people overestimate cleaning time by 20-30% and miss spots when rushing. Take breaks — your suggested schedule of every 45 min helps maintain quality.' },
      { label: 'Seasonal Time Adjustments', value: 'Spring and fall: add 30-60 min for window washing, screen cleaning, and ceiling fan dusting not in your regular routine. Winter: less outdoor dirt but more tracked-in moisture = add 10-15% floor time. Summer: more open windows = add 10% dusting time. Budget $90-120 extra minutes quarterly.' },
      { label: 'Cleaning Frequency Recommendations', value: totalMin > 120 ? `At ${hours}h${mins}m per session, a weekly deep clean is unrealistic. Recommended: 20-min daily tidy-up + ${totalMin < 60 ? 'weekly' : 'biweekly'} surface clean + quarterly deep clean. This splits the ${totalMin}-min session into manageable 20-30 min daily chunks.` : `At ${totalMin} min per session, weekly cleaning is manageable. For optimal maintenance, do a ${totalMin}-min session weekly and a 2-3 hour deep clean every 3 months.` },
    ]}
  },
  description: 'Estimate how long it takes to clean your home based on room count, bathrooms, square footage, clutter level, floor type, and cleaning depth (standard, deep, move-out). Get time-saving tips, professional cost equivalents, and room-by-room allocation.',
  formula: 'Time = [(Rooms × 10) + (Baths × 20) + (SqFt × 0.02) + FloorAdj] × ClutterFactor × DepthFactor. Floor adj: carpet +15%, tile +5%, hard 0%. Depth: standard 1×, deep 1.8×, move-out 2.5×.',
  interpretation: 'Clutter factors: minimal 0.8× (clear surfaces), moderate 1× (move some items), heavy 1.4× (move everything). Professional cleaners average 1 hr per 500 sq ft at $40-75/hr. Speed tip: work top-to-bottom, left-to-right, let dwell time work. Deep cleans take 1.8-2.5× longer but are needed only quarterly. Budget 20 min daily + weekly session for manageable maintenance.'
}

export default calcDef
