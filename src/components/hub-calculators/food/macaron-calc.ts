import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'macarons', label: 'Target Macarons', type: 'number', min: 12, step: '6' },
      { name: 'method', label: 'Method', type: 'select', options: [{ label: 'French (simpler)', value: 'french' }, { label: 'Italian (more stable)', value: 'italian' }] }
    ],
    compute: (v) => {
      const b = Math.ceil(v.macarons / 24); const ew = b * 100; const su = b * (v.method === 'french' ? 100 : 150); const af = b * 110; const is = b * 110; return { result: v.macarons, label: 'Macaron Batch', unit: 'macarons', steps: [{ label: 'Batches of 24', value: b }, { label: 'Almond flour', value: af + ' g' }, { label: 'Icing sugar', value: is + ' g' }, { label: 'Egg whites', value: ew + ' g' }, { label: 'Sugar', value: su + ' g' }, { label: 'Method', value: v.method }] }
    },
    description: 'Macaron ingredients. Batch of 24 uses 100g egg white, 110g almond flour, 110g powdered sugar.',
    example: { label: '48 macarons, French method', value: '2 batches' }
}

export default calcDef
