import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ petType: z.enum(['dog', 'cat']), petAge: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), size: z.enum(['small', 'medium', 'large']) }),
  fields: [
    { name: 'petType', label: 'Pet Type', type: 'select', options: [{ label: 'Dog', value: 'dog' }, { label: 'Cat', value: 'cat' }] },
    { name: 'petAge', label: 'Pet Age (years)', type: 'number', min: 0, step: '1' },
    { name: 'size', label: 'Size (dogs only)', type: 'select', options: [{ label: 'Small (<20 lbs)', value: 'small' }, { label: 'Medium (21-50 lbs)', value: 'medium' }, { label: 'Large (>50 lbs)', value: 'large' }] },
  ],
  defaults: { petType: 'dog', petAge: '5', size: 'medium' },
  presets: [
    { label: '1-Year-Old Puppy', values: { petType: 'dog', petAge: '1', size: 'medium' } },
    { label: '10-Year-Old Cat', values: { petType: 'cat', petAge: '10', size: 'medium' } },
    { label: '7-Year-Old Large Dog', values: { petType: 'dog', petAge: '7', size: 'large' } },
    { label: '2-Year-Old Small Dog', values: { petType: 'dog', petAge: '2', size: 'small' } },
  ],
  compute: (v) => { let humanYears; const sizeLabel = v.petType === 'cat' ? 'N/A' : v.size; if (v.petType === 'cat') { if (v.petAge <= 1) humanYears = 15; else if (v.petAge <= 2) humanYears = 24; else humanYears = 24 + (v.petAge - 2) * 4 } else { if (v.petAge <= 1) humanYears = 15; else if (v.petAge <= 2) humanYears = 24; else { const mult = v.size === 'small' ? 4 : v.size === 'medium' ? 5 : 6; humanYears = 24 + (v.petAge - 2) * mult } } const lifeStage = humanYears < 24 ? 'Adolescent/Young Adult' : humanYears < 48 ? 'Adult' : humanYears < 64 ? 'Senior' : 'Geriatric'; const year2calc = v.petType === 'cat' ? 'Year 2: +9 (=15 + 9 = 24 human years)' : 'Year 2: +9 (=15 + 9 = 24 human years)'; const afterCalc = v.petType === 'cat' ? '× 4/yr after' : `× ${v.size === 'small' ? '4' : v.size === 'medium' ? '5' : '6'}/yr after`; return { result: humanYears, label: 'Human Years Equivalent', unit: 'years',
    steps: [
      { label: 'Pet Details', value: `${v.petAge}-year-old ${v.petType} (${sizeLabel}${v.petType === 'dog' ? ' dog' : ''})` },
      { label: 'Year 1:', value: '15 human years (rapid development)' },
      { label: 'Year 2:', value: `${v.petAge >= 2 ? '+9 = 24 human years' : 'Not reached yet (would be +9 to reach 24)'}` },
      { label: 'Years After 2', value: v.petAge <= 2 ? 'Not applicable yet' : `(${v.petAge} - 2) × ${v.size === 'small' ? '4' : v.size === 'medium' ? '5' : '6'} (${v.size === 'cat' ? '4' : sizeLabel}) = ${(v.petAge - 2) * (v.petType === 'cat' ? 4 : v.size === 'small' ? 4 : v.size === 'medium' ? 5 : 6)}` },
      { label: 'Calculated Human Age', value: v.petAge <= 1 ? '15 human years' : v.petAge <= 2 ? '24 human years' : `24 + ${(v.petAge - 2) * (v.petType === 'cat' ? 4 : v.size === 'small' ? 4 : v.size === 'medium' ? 5 : 6)} = ${humanYears.toFixed(0)} human years` },
      { label: 'Life Stage', value: lifeStage },
      { label: 'Vet Visit Recommendation', value: lifeStage === 'Geriatric' ? 'Visit every 6 months for senior wellness' : lifeStage === 'Senior' ? 'Annual vet visit strongly recommended' : 'Annual checkup recommended' },
      { label: 'Age in Pet Years (reverse)', value: humanYears > 0 ? `Human ${humanYears.toFixed(0)} → Pet ${v.petAge} years` : 'N/A' },
      { label: 'Breed Longevity Note', value: v.petType === 'dog' ? (v.size === 'small' ? 'Small dogs live 12-18 yrs avg' : v.size === 'medium' ? 'Medium dogs live 10-15 yrs avg' : 'Large dogs live 8-12 yrs avg') : 'Cats live 12-18 yrs avg (indoor longer)' },
    ],
    extras: [
      { label: '🐕 The 7-Year Myth', value: 'The old "1 dog year = 7 human years" rule is inaccurate. The first year = 15 human years (rapid maturation), second = +9 (total 24). After that, size matters: small dogs age slower (4/yr), medium (5/yr), large (6/yr).' },
      { label: '🐈 How Cats Age', value: 'Cats: Year 1 = 15 human years. Year 2 = 24 total. After year 2, add 4 human years per cat year. A 10-year-old cat = 56 human years (full senior). Indoor cats tend to live 3-5 years longer than outdoor cats.' },
      { label: '🔬 New AAHA Canine Aging Study', value: 'The 2020 AAHA study found that dog aging is not linear. Epigenetic clocks show rapid aging in early life, slowing after adulthood. The formula: Human age = 16 × ln(dog years) + 31. For a 5-year-old: 16 × ln(5) + 31 ≈ 57 human years.' },
      { label: '📏 Why Size Matters', value: 'Large dogs age faster due to faster growth rates (IGF-1 factor). A 7-year-old Great Dane = 60 human years (geriatric). A 7-year-old Chihuahua = 44 human years (adult). This calculator uses the standard veterinary formula.' },
      { label: '🏥 Senior Pet Care Milestones', value: 'Small dogs: senior at 11-12 years (human 60-64). Medium dogs: senior at 10-11 years (human 56-60). Large dogs: senior at 8-9 years (human 56-60). Cats: senior at 11 years (human 60). Twice-yearly vet visits recommended.' },
      { label: '🦷 Dental Age in Senior Pets', value: 'By 3 years: most pets need some dental attention. By 7 years: 80% of dogs and 70% of cats have periodontal disease. Dental health correlates strongly with overall longevity — clean teeth = longer life.' },
      { label: '🧬 Breed-Specific Aging', value: 'Some breeds age faster: Great Danes (6-8 yr avg), Irish Wolfhounds (6-10). Some age slower: Chihuahuas (12-20 yr avg), Dachshunds (12-16), Toy Poodles (12-18). Mixed breeds generally outlive purebreds by 1-2 years.' },
      { label: '✏️ Converting Human Age to Pet Age', value: 'Reverse formula: Human age ≤ 15 → pet age < 1 year. Human age 15-24 → pet age 1-2. Above 24: Dog pet years = 2 + (human − 24) ÷ factor. Cat = 2 + (human − 24) ÷ 4. Example: human 40 wants a medium dog → 2 + (40-24)/5 = 5.2 dog years.' },
    ]
  } },
  description: 'Convert your pet\'s age to human equivalent years using scientifically adjusted formulas for dogs (by size: small/medium/large) and cats. Get life stage classification and vet care recommendations.',
  formula: 'Both species: Year 1 = 15 human years, Year 2 = 24 total (cumulative). After Year 2: Cats = +4/yr, Small dogs = +4/yr, Medium dogs = +5/yr, Large dogs = +6/yr. | Human Age = (Pet Age ≤ 1) ? 15 : (Pet Age = 2) ? 24 : 24 + (Pet Age − 2) × Factor | Life Stage: <24 = Young Adult, 24-47 = Adult, 48-63 = Senior, 64+ = Geriatric',
  interpretation: 'The old "7-year rule" is inaccurate. Modern veterinary science uses size-adjusted formulas: a 10-lb Chihuahua ages slower (×4/yr after 2) than a 100-lb Labrador (×6/yr after 2). Cats age similarly to small dogs. A 5-year-old cat = 36 human years (adult). A 5-year-old medium dog = 39 human years (adult). A 10-year-old large dog = 72 human years (geriatric). Senior vet care (twice-yearly visits) should begin at: small dogs 11 yrs, medium dogs 10 yrs, large dogs 8 yrs, cats 11 yrs.'
}

export default calcDef
