import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ peakPower: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0), weightKg: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0), avgPower: z.string().optional().refine(v => !v || parseFloat(v) > 0) }),
  fields: [
    { name: 'peakPower', label: 'Peak Power (5s)', type: 'number', unit: 'W', min: 100, step: '10' },
    { name: 'weightKg', label: 'Body Weight', type: 'number', unit: 'kg', min: 20, step: '0.5' },
    { name: 'avgPower', label: 'Avg Power 30s (optional)', type: 'number', unit: 'W', min: 50, step: '10' },
  ],
  compute: (v) => {
    const relPeak = v.peakPower / v.weightKg; const fi = v.avgPower ? ((v.peakPower - v.avgPower) / v.peakPower * 100) : 0
    return { result: relPeak, label: 'Relative Peak Power', unit: 'W/kg', steps: [
      { label: 'Peak power', value: v.peakPower+' W' }, { label: 'Body weight', value: v.weightKg+' kg' },
      { label: 'Relative peak', value: relPeak.toFixed(1)+' W/kg' },
      ...(v.avgPower ? [{ label: 'Fatigue index (30s)', value: fi.toFixed(1)+'%' }] : []),
    ]}
  }, description: 'Analyze Wingate Anaerobic Test results. The 30-second maximal sprint test measures peak power, anaerobic capacity, and fatigue resistance.', formula: 'Relative peak power = peak power / body weight; Fatigue index = (peak - min) / peak × 100', interpretation: 'Higher relative peak power indicates better anaerobic capacity. Elite cyclists achieve 15+ W/kg peak power.'
}

export default calcDef
