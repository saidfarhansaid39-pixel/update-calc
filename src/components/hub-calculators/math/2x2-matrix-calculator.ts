import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), d: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), op: z.string().min(1) }),
    fields: [numField('a', 'a (top-left)'), numField('b', 'b (top-right)'), numField('c', 'c (bottom-left)'), numField('d', 'd (bottom-right)'), selectField('op','Operation',[{value:'determinant',label:'Determinant'},{value:'inverse',label:'Inverse'},{value:'transpose',label:'Transpose'}])],
    defaults: { a: '1', b: '2', c: '3', d: '4', op: 'determinant' },
    compute: (v) => { const a=n(v.a),b=n(v.b),c=n(v.c),d=n(v.d),op=v.op||'determinant'; if(op==='determinant'){const det=a*d-b*c; return { result:det, label:'Determinant', steps:[step('Matrix:',`[[${a},${b}],[${c},${d}]]`),step('det = ad - bc:',''+det)] } }; if(op==='transpose'){return { result:`[[${a},${c}],[${b},${d}]]`, label:'Transpose', steps:[step('Original:',`[[${a},${b}],[${c},${d}]]`),step('Transpose:',`[[${a},${c}],[${b},${d}]]`)] } }; const det=a*d-b*c; if(det===0)return { result:'Matrix is singular', label:'No inverse' }; const ia=d/det,ib=-b/det,ic=-c/det,id=a/det; return { result:det, label:'Inverse', steps:[step('Determinant:','det = '+det),step('Inverse:','1/'+det+' × [[d,-b],[-c,a]]')], extras:[{label:'a⁻¹',value:ia.toFixed(4)},{label:'b⁻¹',value:ib.toFixed(4)},{label:'c⁻¹',value:ic.toFixed(4)},{label:'d⁻¹',value:id.toFixed(4)}] } },
    formula: 'det = ad-bc. A⁻¹ = 1/det × [[d, -b], [-c, a]]',
    description: '2×2 matrix operations: determinant, inverse, and transpose.',
    interpretation: 'The result of the selected 2×2 matrix operation.'
}

export default calcDef
