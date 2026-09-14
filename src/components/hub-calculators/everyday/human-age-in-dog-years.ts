import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ humanAge: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), dogSize: z.enum(['small', 'medium', 'large']) }),
  fields: [
    { name: 'humanAge', label: 'Human Age (years)', type: 'number', min: 0, step: '1' },
    { name: 'dogSize', label: 'Dog Size', type: 'select', options: [{ label: 'Small (<20 lbs)', value: 'small' }, { label: 'Medium (21-50 lbs)', value: 'medium' }, { label: 'Large (>50 lbs)', value: 'large' }] },
  ],
  defaults: { humanAge: "30", dogSize: "medium" },
  presets: [
    { label: "Puppy (First Year)", values: { humanAge: "1", dogSize: "medium" } },
    { label: "Adolescent Dog", values: { humanAge: "2", dogSize: "large" } },
    { label: "Senior Dog (Small Breed)", values: { humanAge: "10", dogSize: "small" } },
    { label: "Centenarian Comparison", values: { humanAge: "80", dogSize: "medium" } },
  ],
  compute: (v) => { const human = v.humanAge; let dogYears; if (human <= 1) { dogYears = human * 15 } else if (human <= 2) { dogYears = 15 + (human - 1) * 9 } else { const base = human > 2 ? human - 2 : 0; const mult = v.dogSize === 'small' ? 4 : v.dogSize === 'medium' ? 5 : 6; dogYears = 24 + base * mult } const humanEquivalent = dogYears; const lifeStage = dogYears <= 2 ? 'Puppy / Adolescent' : dogYears <= 10 ? 'Adult' : dogYears <= 15 ? 'Senior' : 'Geriatric'; const sizeLabel = v.dogSize === 'small' ? 'Small (<20 lb)' : v.dogSize === 'medium' ? 'Medium (21-50 lb)' : 'Large (>50 lb)'; const avgLifespan = v.dogSize === 'small' ? '12-16 yr' : v.dogSize === 'medium' ? '10-14 yr' : '8-12 yr'; return { result: dogYears, label: 'Dog Age', unit: 'dog years', steps: [{ label: 'Human Age', value: `${human} years` }, { label: 'Dog Size Category', value: sizeLabel }, { label: 'First Year Equivalent', value: '15 dog years (rapid maturation)' }, { label: 'Second Year', value: '+9 years = 24 (full adolescence)' }, { label: 'Remaining Years Factor', value: `${Math.max(0, human - 2)} yr × ${v.dogSize === 'small' ? '4' : v.dogSize === 'medium' ? '5' : '6'}/yr` }, { label: 'Total Dog Years', value: `${dogYears.toFixed(0)} dog years` }, { label: 'Life Stage', value: lifeStage }, { label: 'Avg Lifespan for Size', value: avgLifespan }] ,
    extras: [
      { label: "The Old Myth vs Modern Science", value: "The '1 human year = 7 dog years' rule is an oversimplification. Dogs mature extremely quickly in their first 2 years (15 + 9 = 24 dog years), then aging slows to 4-6 dog years per human year depending on size." },
      { label: "Size Matters Significantly", value: "Small breeds (Chihuahua, Yorkie) age slower and live longer. Large breeds (Great Dane, Mastiff) age faster and have shorter lifespans. After age 2, small dogs age ~4 dog years per human year vs 6 for large dogs." },
      { label: "Breed-Specific Longevity", value: "Longest-lived breeds: Chihuahua (14-18), Toy Poodle (14-18), Dachshund (12-16). Shortest-lived: Great Dane (7-10), Bernese Mountain Dog (7-10), Irish Wolfhound (6-10)." },
      { label: "Canine Life Stages", value: "Puppy (0-2 dog yr): socializaton & training | Adult (3-10 dog yr): active & mature | Senior (10-15 dog yr): slow down, health monitoring | Geriatric (>15 dog yr): palliative care" },
      { label: "Signs of Aging in Dogs", value: "Gray muzzle (7+ dog yr), decreased activity, vision/hearing loss, dental disease, arthritis, cognitive decline (Canine Cognitive Dysfunction). Regular vet checkups twice yearly after ~10 dog years." },
      { label: "Extending Your Dog's Lifespan", value: "Quality diet (avoid obesity — 56% of dogs are overweight), regular exercise, dental care, annual vet visits, mental stimulation, and maintaining a healthy weight can add 1-3 years." },
      { label: "Large Breed Health Risks", value: "Large dogs are prone to hip dysplasia, bloat (GDV), osteoarthritis, and certain cancers. Preventive care: joint supplements (glucosamine), weight management, and avoiding high-impact exercise until growth plates close (~18-24 mo)." },
      { label: "Adoption Age Estimation", value: "Veterinarians estimate age via: teeth (puppy vs adult vs worn), eye clarity (lens sclerosis after ~7 human/yr), muscle tone, and overall vitality. DNA tests can reveal breed-related aging factors." },
    ]} },
  description: 'Convert human years to dog years using the modern scientific method that accounts for size-dependent aging. Small breeds age slower; large breeds age faster after age 2.',
  formula: 'Dog Years = 15 (yr 1) + 9 (yr 2) + (Human Age − 2) × Size Factor | Small (≤20 lb): 4× | Medium (21-50 lb): 5× | Large (>50 lb): 6×',
  interpretation: 'The old rule of "1 human year = 7 dog years" is inaccurate and misleading. Dogs mature incredibly fast in their first two years — a 1-year-old dog is equivalent to a 15-year-old human, and a 2-year-old dog is a 24-year-old human. After that, aging rate depends on size: small breeds (under 20 lb) age about 4 dog years per human year, while large breeds (over 50 lb) age about 6 dog years per human year. This is why small dogs often live 12-16+ years while giant breeds average only 8-10 years. A 10-year-old Chihuahua is about 56 dog years; a 10-year-old Great Dane is about 72.'
}

export default calcDef
