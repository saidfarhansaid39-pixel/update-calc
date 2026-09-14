import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ volume: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), density: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'volume', label: 'Displaced Volume', type: 'number', unit: 'm^3', min: 0.001, step: '0.001' }, { name: 'density', label: 'Fluid Density', type: 'number', unit: 'kg/m^3', min: 1, step: '1' }],
  defaults: { volume: '1', densityFluid: '1000', densityObject: '800' },
  presets: [
    { label: 'Iceberg (10% above water)', values: { volume: '1000', densityFluid: '1025', densityObject: '917' } },
    { label: 'Wood block (ρ=600, in water)', values: { volume: '0.1', densityFluid: '1000', densityObject: '600' } },
    { label: 'Submarine (neutral buoyancy)', values: { volume: '500', densityFluid: '1025', densityObject: '1025' } },
  ],
  compute: (v) => ({ result: v.volume * v.density * 9.81, label: 'Buoyant Force', unit: 'N', steps: [{ label: 'Formula', value: 'Fբ = ρ·V·g (Archimedes)' }, { label: 'Substitute', value: `${v.density} × ${v.volume} × 9.81` }, { label: 'Result', value: `${(v.volume * v.density * 9.81).toFixed(3)} N` }],
      extras: [
        { label: 'Real-World Application', value: 'Buoyancy governs ships, submarines, hot air balloons, and swimming. Archimedes\' principle explains why steel ships float (displaced water weight = ship weight).' },
        { label: 'Common Values', value: 'Fresh water: 1000 kg/m³. Seawater: 1025 kg/m³. Ice: 917 kg/m³ (91.7% submerged in seawater). Cork: 240 kg/m³. Human body: ~985 kg/m³.' },
        { label: 'Precision Tip', value: 'Buoyant force = weight of displaced fluid. Apparent weight = real weight - buoyant force. Floating condition: ρ_object < ρ_fluid.' },
        { label: 'Related Formula', value: 'F_b = ρ_fluid × V_displaced × g. Apparent weight: W_app = mg - F_b. Fraction submerged: ρ_object/ρ_fluid.' },
        { label: 'Unit Conversion Note', value: 'Density in kg/m³. 1 g/cm³ = 1000 kg/m³. Specific gravity = ρ/ρ_water (dimensionless).' }
      ] }),
  description: 'Archimedes\' Principle: the buoyant force equals the weight of the fluid displaced by the object.',
  formula: 'Fբ = ρ·V·g',
  interpretation: 'If the buoyant force exceeds the object\'s weight, it floats. If less, it sinks. If equal, it is neutrally buoyant.'
}

export default calcDef
