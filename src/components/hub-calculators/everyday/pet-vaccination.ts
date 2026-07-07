import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ pets: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), coreVaccine: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), nonCoreVaccine: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), examFee: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), years: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'pets', label: 'Number of Pets', type: 'number', min: 1, step: '1' },
    { name: 'coreVaccine', label: 'Core Vaccine Cost Each ($)', type: 'number', min: 10, step: '10' },
    { name: 'nonCoreVaccine', label: 'Non-Core Vaccine Cost Each ($)', type: 'number', min: 0, step: '10' },
    { name: 'examFee', label: 'Exam Fee per Visit ($)', type: 'number', min: 20, step: '10' },
    { name: 'years', label: 'Years of Vaccinations', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const annualPerPet = v.coreVaccine + v.nonCoreVaccine + v.examFee
    const annualTotal = annualPerPet * v.pets
    const totalCost = annualTotal * v.years
    return { result: totalCost, label: 'Total Vaccination Cost', unit: '$', steps: [{ label: 'Annual Cost per Pet', value: `$${annualPerPet.toFixed(2)}` }, { label: 'Annual Total', value: `$${annualTotal.toFixed(2)}` }, { label: 'Total Over Period', value: `$${totalCost.toFixed(2)}` }] }
  },
  description: 'Estimate pet vaccination costs including core and non-core vaccines, exam fees, and multi-year planning.',
  formula: 'Annual/Pet = Core + NonCore + Exam | Total = Annual/Pet × Pets × Years',
  interpretation: 'Core vaccines (rabies, distemper): $20-40 each. Non-core (kennel cough, lepto): $15-35. Annual exam: $40-100. Puppies need boosters every 3-4 weeks until 16 weeks. Adult dogs need boosters every 1-3 years.'
}

export default calcDef
