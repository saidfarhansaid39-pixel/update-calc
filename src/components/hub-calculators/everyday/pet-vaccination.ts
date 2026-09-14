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
  defaults: { pets: '1', coreVaccine: '30', nonCoreVaccine: '20', examFee: '55', years: '1' },
  presets: [
    { label: 'Puppy First Year (3 visits)', values: { pets: '1', coreVaccine: '30', nonCoreVaccine: '25', examFee: '55', years: '1' } },
    { label: 'Adult Dog Annual', values: { pets: '1', coreVaccine: '25', nonCoreVaccine: '20', examFee: '50', years: '1' } },
    { label: 'Two Cats Annual Visit', values: { pets: '2', coreVaccine: '28', nonCoreVaccine: '0', examFee: '60', years: '1' } },
    { label: 'Multi-Pet Household (3)', values: { pets: '3', coreVaccine: '30', nonCoreVaccine: '20', examFee: '55', years: '3' } },
  ],
  compute: (v) => {
    const annualPerPet = v.coreVaccine + v.nonCoreVaccine + v.examFee
    const annualTotal = annualPerPet * v.pets
    const totalCost = annualTotal * v.years
    return { result: totalCost, label: 'Total Vaccination Cost', unit: '$',
      steps: [
        { label: 'Cost per Pet per Visit', value: `$${v.coreVaccine} (core) + $${v.nonCoreVaccine} (non-core) + $${v.examFee} (exam) = $${annualPerPet.toFixed(2)}` },
        { label: 'Annual Cost per Pet', value: `$${annualPerPet.toFixed(2)}` },
        { label: 'Annual Total for All Pets', value: `$${annualPerPet.toFixed(2)} × ${v.pets} = $${annualTotal.toFixed(2)}` },
        { label: 'Total Over Period', value: `$${annualTotal.toFixed(2)} × ${v.years} years = $${totalCost.toFixed(2)}` },
        { label: 'Core Vaccines Total', value: `$${v.coreVaccine} × ${v.pets} × ${v.years} = $${(v.coreVaccine * v.pets * v.years).toFixed(2)}` },
        { label: 'Non-Core Vaccines Total', value: `$${v.nonCoreVaccine} × ${v.pets} × ${v.years} = $${(v.nonCoreVaccine * v.pets * v.years).toFixed(2)}` },
        { label: 'Exam Fees Total', value: `$${v.examFee} × ${v.pets} × ${v.years} = $${(v.examFee * v.pets * v.years).toFixed(2)}` },
        { label: 'Monthly Equivalent', value: `$${(totalCost / (v.years * 12)).toFixed(2)}/mo` },
      ],
      extras: [
        { label: '💉 Core vs Non-Core Vaccines', value: 'Core (required): Rabies, DHPP (distemper/adenovirus/parainfluenza/parvovirus) for dogs; FVRCP (feline viral rhinotracheitis/calicivirus/panleukopenia) for cats. Non-core (optional): Bordetella (kennel cough), Leptospirosis, Lyme, Feline Leukemia.' },
        { label: '🐶 Puppy Vaccination Schedule', value: 'Puppies need a series of 3-4 boosters at 6-8, 10-12, 14-16, and 16-20 weeks. Rabies at 12-16 weeks. Can\'t go to public places until 2 weeks after final booster. First year costs $150-300 total.' },
        { label: '🐱 Kitten Vaccination Schedule', value: 'Kittens: FVRCP at 6-8, 10-12, 14-16 weeks. Rabies at 12-16 weeks. Feline Leukemia recommended for outdoor cats. First year similar cost to puppies.' },
        { label: '💵 Low-Cost Vaccine Clinics', value: 'Many animal shelters and pet stores offer low-cost vaccine clinics: $10-20 per vaccine vs $25-40 at a private vet. No exam fee. Great for healthy pets. Check Petco, Tractor Supply, and local humane societies.' },
        { label: '🔄 Booster Schedule by Vaccine', value: 'Rabies: 1 year (then 1 or 3 years depending on state). DHPP: 1 year or 3 years. Bordetella: 6 months to 1 year. Leptospirosis: 1 year. Lyme: 1 year. FVRCP: 1 year or 3 years. Feline Leukemia: 1 year.' },
        { label: '🏥 Wellness Plans Save Money', value: 'Vet wellness plans ($25-50/month) include annual vaccines, exam, heartworm test, and fecal. For 1 pet on a plan: $300-600/year vs $200-350 pay-per-visit. Plans save money if your pet needs multiple services.' },
        { label: '⚠️ Vaccine Side Effects', value: 'Mild: lethargy, mild fever, injection site soreness (24-48 hrs). Rare: allergic reactions (hives, facial swelling). Report to your vet. Benadryl is often pre-administered for at-risk breeds (bulldogs, boxers).' },
        { label: '📋 Vaccine Records Are Important', value: 'Keep a paper or digital vaccine record. Required for boarding, grooming, daycare, dog parks, and travel (interstate health certificates). Most kennels require Bordetella within 6 months.' },
      ]
    }
  },
  description: 'Estimate pet vaccination costs across core and non-core vaccines, exam fees, and multiple years. Includes per-vaccine breakdowns, monthly equivalents, and puppy/kitten schedule info.',
  formula: 'Annual Cost per Pet = Core Vaccine + Non-Core Vaccine + Exam Fee | Annual Total = Per Pet × Number of Pets | Lifetime Cost = Annual Total × Years | Monthly Equivalent = Lifetime ÷ (Years × 12)',
  interpretation: 'Core vaccines (rabies, DHPP/FVRCP) cost $20-40 each and are required by law in most US states. Non-core vaccines (Bordetella, Leptospirosis, Lyme) cost $15-35 each and are recommended based on lifestyle. Annual exam fees range from $40-100. Puppies/kittens have higher first-year costs ($150-300) due to multiple booster visits. Low-cost vaccine clinics ($10-20/vaccine) can save 40-60% for healthy pets. After the first year, annual costs stabilize at $75-200 per pet depending on vaccines and exam fees.'
}

export default calcDef
