import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ gradePoints: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), creditHours: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'gradePoints', label: 'Total Grade Points', type: 'number', min: 0.1, step: '1' },
    { name: 'creditHours', label: 'Total Credit Hours', type: 'number', min: 1, step: '1' },
  ],
  defaults: { gradePoints: '48', creditHours: '15' },
  presets: [
    { label: 'Semester (5 courses)', values: { gradePoints: '48', creditHours: '15' } },
    { label: 'Freshman Year (10 courses)', values: { gradePoints: '84', creditHours: '30' } },
    { label: 'Dean\'s List Target', values: { gradePoints: '52.5', creditHours: '15' } },
    { label: 'Honors Semester', values: { gradePoints: '56.25', creditHours: '15' } },
  ],
  compute: (v) => { const gp = parseFloat(v.gradePoints)||0; const ch = parseFloat(v.creditHours)||0; const gpa = gp / ch; const gradeNeeded = gpa < 4.0 ? ((ch * 3.0 - gp) + 3.0) : 0; const gpaToRaise = gpa < 4.0 ? 4.0 : 0; const pointsToA = gpa < 4.0 ? ((4.0 * ch) - gp) : 0; const classification = gpa >= 3.7 ? 'Summa Cum Laude' : gpa >= 3.5 ? 'Magna Cum Laude' : gpa >= 3.0 ? 'Cum Laude' : gpa >= 2.0 ? 'Good Standing' : gpa >= 1.0 ? 'Probation' : 'Academic Warning'; return { result: gpa, label: 'GPA (4.0 Scale)', unit: '', steps: [{ label: 'Total Grade Points', value: `${gp.toFixed(1)}` }, { label: 'Total Credit Hours', value: `${ch}` }, { label: 'GPA', value: `${gpa.toFixed(3)}` }, { label: 'Classification', value: classification }, { label: 'Points to 4.0', value: `${pointsToA.toFixed(1)} more pts` }, { label: 'Grade Needed Next Semester', value: gpa >= 3.0 ? `Already above 3.0` : `${gradeNeeded.toFixed(2)} GPA needed` }, { label: 'Letter Grade Avg', value: `${gpa >= 3.7 ? 'A−' : gpa >= 3.3 ? 'B+' : gpa >= 3.0 ? 'B' : gpa >= 2.7 ? 'B−' : gpa >= 2.3 ? 'C+' : gpa >= 2.0 ? 'C' : gpa >= 1.7 ? 'C−' : gpa >= 1.3 ? 'D+' : gpa >= 1.0 ? 'D' : 'F'} avg` }, { label: 'Academic Standing', value: `${gpa >= 2.0 ? 'Good' : 'Probation'} (min 2.0 for graduation)` }] ,
    extras: [
      { label: 'GPA Scale & Grade Conversion', value: `A = 4.0 (93-100%), A− = 3.7 (90-92%), B+ = 3.3 (87-89%), B = 3.0 (83-86%), B− = 2.7 (80-82%), C+ = 2.3 (77-79%), C = 2.0 (73-76%), C− = 1.7 (70-72%), D+ = 1.3 (67-69%), D = 1.0 (60-66%), F = 0.0 (<60%). Your ${gpa.toFixed(3)} converts to ~${(gpa * 25).toFixed(0)}% average.` },
      { label: 'Semester GPA Planning', value: `Current GPA: ${gpa.toFixed(3)} over ${ch} credits. To reach 3.0 (good standing) in ${ch} more credits: need ${gp < 3.0 * ch ? `GPA of ${((3.0 * (ch + ch) - gp) / ch).toFixed(2)} in next ${ch} credits` : 'already there'}. To reach 3.5 (cum laude): need ${((3.5 * (ch + ch) - gp) / ch).toFixed(2)} in next ${ch} credits. Use a semester-by-semester plan.` },
      { label: 'Course Grade Impact Analysis', value: `One 3-credit course at your current ${gpa.toFixed(3)} adds ${(3 * gpa).toFixed(1)} grade points. An A (4.0) in a 3-credit course adds 12 pts. An F adds 0. The GPA difference between an A and a C in a 3-credit course = (4.0 - 2.0) × 3 = 6.0 grade points total over ${ch} = ${(6.0 / ch).toFixed(3)} GPA impact. Every grade matters.` },
      { label: 'Weighted vs Unweighted GPA', value: `This calculator uses unweighted (4.0 scale). Weighted GPAs (used for AP/IB/dual enrollment) give 5.0 for A in advanced courses. A student taking 3 AP + 3 regular courses: weighted GPA ~0.3-0.5 higher than unweighted. Unweighted ${gpa.toFixed(3)} ≈ weighted ${(gpa + 0.4).toFixed(3)} with ${ch >= 15 ? 'a full course load' : 'fewer advanced courses'}. Colleges recalculate your GPA their own way.` },
      { label: 'Graduation Requirements & Honors', value: `Most degrees require 120 credits total, min 2.0 GPA. At ${ch} credits and ${gpa.toFixed(3)}: ${gp < 2.0 * 120 ? `need ${((2.0 * 120 - gp) / (120 - ch)).toFixed(2)} GPA on remaining ${120 - ch} credits to graduate` : 'on track for graduation'}. ${gpa >= 3.5 ? 'Cum laude (3.5-3.7): honors recognition at graduation.' : ''} ${gpa >= 3.7 ? 'Magna cum laude (3.7-3.9): high honors.' : ''} ${gpa >= 3.9 ? 'Summa cum laude (3.9-4.0): highest honors.' : ''}` },
      { label: 'Retaking Courses & GPA Repair', value: `If you retake a course, most schools replace the original grade (new grade only, or average). Retaking a D/F course benefits GPA: replacing an F (0 pts) with a B (12 pts for 3 cr) in one 3-credit course adds 12 grade points = raises GPA by ${(12 / ch).toFixed(3)}. Discuss a grade forgiveness/replacement policy with your academic advisor.` },
      { label: 'Scholarship GPA Thresholds', value: `Many scholarships require 3.0+ (some: 3.5+ for merit). Your ${gpa.toFixed(3)} qualifies for ${gpa >= 3.5 ? 'most merit scholarships' : gpa >= 3.0 ? 'many scholarships' : gpa >= 2.5 ? 'some scholarships (keep applying)' : 'few GPA-based scholarships — look for need-based or essay-based'}. A 0.1 GPA increase (${gpa >= 2.9 ? 'to reach 3.0' : ''} can unlock thousands in aid. $${(gpa >= 3.0 ? 0 : (3.0 - gpa) * ch * 100).toFixed(0)} in potential aid per 0.1 point.` },
      { label: 'Pass/Fail Course Strategy', value: `Taking a course pass/fail instead of graded: protects your GPA if you'd earn C or below. A pass doesn't add grade points but counts for credit. If you're confident in an A− or better, take for grade (boosts GPA). Pass/fail is best for: difficult electives outside your major, courses with heavy workload in a tough semester. Check your school's limit (usually 1-2 per semester).` },
    ]} },
  description: 'Calculate your grade point average on a 4.0 scale from total grade points and credit hours. Includes GPA classification (cum laude thresholds), letter grade equivalent, points needed for 4.0, next-semester planning, weighted vs unweighted comparison, and academic standing assessment.',
  formula: 'GPA = Total Grade Points ÷ Total Credit Hours | Grade Points per Course = Grade Value × Credit Hours | A=4.0, A−=3.7, B+=3.3, B=3.0, B−=2.7, C+=2.3, C=2.0, C−=1.7, D+=1.3, D=1.0, F=0.0',
  interpretation: '3.0+ GPA is good academic standing (graduation minimum). 3.5+ cum laude range. 3.7+ magna cum laude. 3.9+ summa cum laude. Weighted AP/IB courses may use 5.0 scale. One A in a 3-credit course adds 12 grade points. One F in same course adds 0 — can drop GPA by 0.1-0.3 depending on total credits. Retaking courses with grade forgiveness can significantly improve GPA.'
}

export default calcDef
