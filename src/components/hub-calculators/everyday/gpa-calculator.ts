import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ gradePoints: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), creditHours: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'gradePoints', label: 'Total Grade Points', type: 'number', min: 0.1, step: '1' },
    { name: 'creditHours', label: 'Total Credit Hours', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => { const gp = parseFloat(v.gradePoints)||0; const ch = parseFloat(v.creditHours)||0; const gpa = gp / ch; return { result: gpa, label: 'GPA', unit: '', steps: [{ label: 'Total Grade Points', value: `${gp.toFixed(1)}` }, { label: 'Total Credits', value: `${ch}` }, { label: 'GPA (4.0 Scale)', value: `${gpa.toFixed(3)}` }] } },
  description: 'Calculate your grade point average on a 4.0 scale from total grade points and credit hours. A=4, B=3, C=2, D=1, F=0.',
  formula: 'GPA = Total Grade Points ÷ Total Credit Hours',
  interpretation: '3.0+ GPA is generally good standing. 3.5+ is cum laude range. Weighted courses (AP/IB) may use a 5.0 scale — adjust grade points accordingly.'
}

export default calcDef
