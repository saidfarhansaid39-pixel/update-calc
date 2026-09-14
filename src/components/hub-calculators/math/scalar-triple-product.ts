import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ ax: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), ay: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), az: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), bx: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), by: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), bz: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), cx: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), cy: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), cz: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('ax', 'a.x'), numField('ay', 'a.y'), numField('az', 'a.z'), numField('bx', 'b.x'), numField('by', 'b.y'), numField('bz', 'b.z'), numField('cx', 'c.x'), numField('cy', 'c.y'), numField('cz', 'c.z')],
    defaults: { ax: '1', ay: '0', az: '0', bx: '0', by: '1', bz: '0', cx: '0', cy: '0', cz: '1' },
    compute: (v) => {
      const ax = n(v.ax), ay = n(v.ay), az = n(v.az), bx = n(v.bx), by = n(v.by), bz = n(v.bz), cx = n(v.cx), cy = n(v.cy), cz = n(v.cz)
      const result = ax * (by * cz - bz * cy) - ay * (bx * cz - bz * cx) + az * (bx * cy - by * cx)
      return { result: result.toFixed(4), label: '[a,b,c]', steps: [step('Formula', 'a � (b x c)'), step('Result', result.toFixed(4))] ,
    extras: [
      { label: "Dimension Check", value: "Matrix dimensions must be compatible for the operation." },
      { label: "Singular Matrix Warning", value: "A determinant of zero means the matrix has no inverse." },
      { label: "Computational Complexity", value: "Larger matrices require significantly more computation." },
      { label: "Application", value: "Used in computer graphics, machine learning, and physics simulations." }
    ]}
    },
    formula: '[a,b,c] = a � (b x c).',
    description: 'Calculate the scalar triple product of three 3D vectors.',
    interpretation: 'The scalar triple product gives the signed volume of the parallelepiped.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
