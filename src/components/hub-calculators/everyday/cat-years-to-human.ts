import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ catAge: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), lifestyle: z.string().min(1) }),
  fields: [
    { name: 'catAge', label: 'Cat Age (years)', type: 'number', min: 0.1, step: '1' },
    { name: 'lifestyle', label: 'Lifestyle', type: 'select', options: [{ label: 'Indoor Only', value: 'indoor' }, { label: 'Indoor/Outdoor', value: 'mixed' }, { label: 'Outdoor Only', value: 'outdoor' }] },
  ],
  defaults: { catAge: '5', lifestyle: 'indoor' },
  presets: [
    { label: 'Kitten (Indoor)', values: { catAge: '0.5', lifestyle: 'indoor' } },
    { label: 'Adult Indoor Cat', values: { catAge: '5', lifestyle: 'indoor' } },
    { label: 'Senior Cat', values: { catAge: '12', lifestyle: 'indoor' } },
    { label: 'Outdoor Senior', values: { catAge: '10', lifestyle: 'outdoor' } },
  ],
  compute: (v) => {
    const catYrs = v.catAge
    const humanYrs = catYrs <= 1 ? 15 : catYrs <= 2 ? 24 : 24 + (catYrs - 2) * 4
    const lifeStage = catYrs <= 1 ? 'Kitten' : catYrs <= 6 ? 'Adult' : catYrs <= 11 ? 'Senior' : 'Geriatric'
    const outdoorFactor = v.lifestyle === 'outdoor' ? 0.75 : v.lifestyle === 'mixed' ? 0.88 : 1
    const adjustedLifespan = Math.round(18 * outdoorFactor)
    const remainingYears = Math.max(0, adjustedLifespan - catYrs)
    return { result: humanYrs, label: 'Human Age Equivalent', unit: 'years', steps: [
      { label: 'Cat Chronological Age', value: `${catYrs} year${catYrs !== 1 ? 's' : ''}` },
      { label: 'First Year Conversion', value: catYrs >= 1 ? '15 human years' : `${(catYrs * 15).toFixed(1)} human years (pro-rated)` },
      { label: 'Second Year Addition', value: catYrs >= 2 ? '+9 = 24 human years' : catYrs > 1 ? `+${((catYrs - 1) * 9).toFixed(1)} = ${humanYrs} human years` : 'N/A' },
      { label: 'Each Year After 2', value: catYrs > 2 ? `+4 per year = +${((catYrs - 2) * 4).toFixed(0)} human years` : 'N/A' },
      { label: 'Human Age Equivalent', value: `${humanYrs} human years` },
      { label: 'Life Stage', value: lifeStage },
      { label: 'Expected Lifespan', value: `${adjustedLifespan} years (${v.lifestyle}-adjusted)` },
      { label: 'Estimated Years Remaining', value: `${remainingYears.toFixed(0)} years` },
    ] ,
    extras: [
      { label: 'First Year Accelerated Aging', value: 'Cats age fastest in their first two years. A 6-month-old kitten is developmentally equivalent to a 7-8 year old human child — fully weaned, coordinated, and learning social boundaries.' },
      { label: 'Indoor vs Outdoor Lifespan Gap', value: `Indoor cats live 12-18 years on average; outdoor cats average just 3-7 years due to cars, predators, and disease. Your ${v.lifestyle} cat has an expected lifespan of ${adjustedLifespan} years.` },
      { label: 'Senior Screenings Recommended', value: catYrs >= 10 ? 'Cats over 10 should have twice-yearly vet checkups including bloodwork, thyroid test, and dental assessment. Early detection of kidney disease and hyperthyroidism adds 2-4 years of quality life.' : 'Annual vet visits are recommended. At age 10+, switch to bi-annual senior wellness exams.' },
      { label: 'Weight Management Impact', value: 'Overweight cats age faster and have 2.5× the risk of diabetes and arthritis. A 1-lb weight loss in a 10-lb cat can add 2+ years to lifespan. Feed measured portions, not free-choice.' },
      { label: 'Dental Health = Longevity', value: 'Untreated dental disease shortens cat lifespan by 2-5 years through chronic inflammation damaging kidneys and hearts. Daily brushing or dental treats cut tartar by 60-70%.' },
      { label: 'Hydration & Kidney Health', value: 'Cats evolved for low thirst drive. Chronic dehydration causes kidney disease — the #1 cause of death in senior cats. Wet food (70%+ moisture) vs dry food (10% moisture) reduces kidney strain significantly.' },
      { label: 'Human-Equivalent Life Milestones', value: 'Cat years roughly map: 1 = human teen, 2 = mid-20s, 5 = mid-30s, 8 = mid-40s, 12 = mid-60s, 15 = mid-70s, 20 = mid-90s. Cats aged 20+ are considered centenarian-equivalent.' },
      { label: 'Breed-Specific Longevity', value: 'Mixed-breed cats average 14-18 years. Purebreds vary: Siamese (15-20), Burmese (16-18), Persian (12-16), Maine Coon (10-13), Sphynx (8-14). Genetics account for ~30% of lifespan; environment and diet account for ~70%.' },
    ]}
  },
  description: 'Convert cat years to human years using the standard veterinary scale: first year equals ~15 human years, year two adds ~9 more, and each subsequent year adds ~4 human years. Includes lifestyle-adjusted lifespan estimates and breed-specific longevity guidance.',
  formula: 'Human Years = 15 (year 1) or 24 (year 2) or 24 + (Age − 2) × 4 (year 3+). Expected lifespan = 18 years × lifestyle factor (indoor 1.0, mixed 0.88, outdoor 0.75).',
  interpretation: 'Indoor cats live 12-18 years on average; outdoor cats average 3-7 years. A 15-year-old indoor cat is ~76 in human years — equivalent to a healthy senior. Regular vet checkups, proper diet, weight management, and dental care can extend lifespan by 2-5 years. Cats over 10 years old should have bi-annual senior wellness exams including bloodwork and thyroid screening.'
}

export default calcDef
