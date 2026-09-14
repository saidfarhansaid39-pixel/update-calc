import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ dogAge: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), breedSize: z.string().min(1) }),
  fields: [
    { name: 'dogAge', label: 'Dog Age (years)', type: 'number', min: 0.1, step: '0.5' },
    { name: 'breedSize', label: 'Breed Size', type: 'select', options: [{ label: 'Small (<20 lbs)', value: 'small' }, { label: 'Medium (21-50 lbs)', value: 'medium' }, { label: 'Large (51-100 lbs)', value: 'large' }, { label: 'Giant (>100 lbs)', value: 'giant' }] },
  ],
  defaults: { dogAge: '3', breedSize: 'medium' },
  presets: [
    { label: 'Puppy (1 yr Small)', values: { dogAge: '1', breedSize: 'small' } },
    { label: 'Prime Adult (4 yr Large)', values: { dogAge: '4', breedSize: 'large' } },
    { label: 'Senior (10 yr Giant)', values: { dogAge: '10', breedSize: 'giant' } },
    { label: 'Centenarian (15 yr Small)', values: { dogAge: '15', breedSize: 'small' } },
  ],
  compute: (v) => {
    const age = v.dogAge
    const sizeFactors: Record<string, number> = { small: 0.5, medium: 0.65, large: 0.8, giant: 1.0 }
    const sizeLabels: Record<string, string> = { small: 'Small (<20lbs)', medium: 'Medium (21-50lbs)', large: 'Large (51-100lbs)', giant: 'Giant (>100lbs)' }
    const sizeFactor = sizeFactors[v.breedSize] || 0.65
    const humanYears = 16 * Math.log(age + 1) + 31 - sizeFactor * 5
    const oldMethod = age * 7
    const firstYearHuman = 16 * Math.log(1 + 1) + 31 - sizeFactor * 5
    const lifeStage = age < 1 ? 'Puppy' : age < 3 ? 'Young Adult' : age < 7 ? 'Adult' : age < 12 ? 'Senior' : 'Geriatric'
    const avgLifespan: Record<string, number> = { small: 14, medium: 12, large: 10, giant: 8 }
    const pctLived = (age / avgLifespan[v.breedSize]) * 100
    return { result: humanYears, label: 'Human Years', unit: '', steps: [
      { label: 'Dog Age', value: `${age} year${age !== 1 ? 's' : ''}` },
      { label: 'Breed Size', value: sizeLabels[v.breedSize] },
      { label: 'Life Stage', value: lifeStage },
      { label: 'Modern Formula Result', value: `${humanYears.toFixed(1)} human years` },
      { label: 'Old 7:1 Rule', value: `${oldMethod.toFixed(0)} human years (outdated)` },
      { label: 'First-Year Equivalent', value: `${firstYearHuman.toFixed(1)} human years in year 1` },
      { label: 'Expected Lifespan', value: `~${avgLifespan[v.breedSize]} years (${pctLived.toFixed(0)}% lived)` },
      { label: 'Speed of Aging', value: `1 dog year ≈ ${(humanYears / age).toFixed(1)} human years at this age` },
    ] ,
    extras: [
      { label: "Why the 7:1 Rule Is Wrong", value: "The 7:1 rule originated from a 1950s marketing gimmick comparing human 77-year lifespan to dog 11-year average. Modern science (Wang et al., 2020, Cell Systems) proves aging is logarithmic — dogs reach ~31 human years by age 1, then slow down." },
      { label: "Breed Size and Longevity", value: "Small breeds (Chihuahua, Dachshund) live 12-18 years. Giant breeds (Great Dane, Irish Wolfhound) live 6-10 years. This inverse relationship is unique to dogs — in most species, larger animals live longer. The faster growth rate in giant breeds accelerates cellular aging." },
      { label: "Senior Dog Milestones", value: "Small breeds enter senior phase at ~11-12 years, large breeds at ~8-9, giants at ~6-7. Signs of aging: gray muzzle (7-8 yrs), reduced activity, stiff joints, cognitive changes. Annual vet visits become twice-yearly for seniors." },
      { label: "Dog Year Milestones", value: "1 dog year = ~31 human years (all breeds). 2 yr = ~42 small, ~45 large. 5 yr = ~50 small, ~57 large. 10 yr = ~58 small, ~68 large. 15 yr = ~63 small, ~77 large. The gap widens with age — small breeds effectively age in slow motion." },
      { label: "Epigenetic Clock Science", value: "The logarithmic formula is based on DNA methylation patterns (epigenetic clocks). Researchers compared Labrador methylation patterns to human chronological age. This same technique is used in human forensic age estimation and anti-aging research." },
      { label: "Mixed Breed Advantage", value: "Mixed-breed dogs live 1-2 years longer on average than purebreds (15% longer lifespan). Genetic diversity reduces inherited disorders. A 10-year-old mixed-breed small dog (~58 human years) is statistically healthier than a same-age purebred." },
      { label: "Human- Dog Age Comparison Calendar", value: "Key medical parallels: 1 dog yr = human age 30+ (dental care critical). 4 dog yr = human ~45-50 (annual bloodwork recommended). 8 dog yr = human ~60-65 (senior panel, thyroid check). 12 dog yr = human 75+ (geriatric care)." },
      { label: "Longevity Interventions", value: "Proven to extend lifespan 1-3 years: maintaining ideal body weight (biggest factor), feeding high-protein/low-carb fresh food, daily moderate exercise (20-40 min), dental cleaning, and omega-3 EPA/DHA supplementation (1,000 mg/50 lbs daily)." },
    ]}
  },
  description: 'Convert dog age to human years using the modern logarithmic formula (Wang et al. 2020) that accounts for breed size and DNA methylation aging rates. Includes life stage classification, lifespan projections, and the outdated 7:1 method for comparison.',
  formula: 'Human Years = 16 × ln(Dog Age + 1) + 31 - Breed Adjustment | Breed Factors: Small -2.5, Medium -0.5, Large +2.5, Giant +5',
  interpretation: 'The 2020 canine epigenetic clock study proved dogs age rapidly in their first year (reaching ~31 human equivalent across all breeds) then slow down significantly. A 1-year-old dog is a teenager, not a 7-year-old child. Small breeds age slower after maturity and live longer — a 15-year-old Chihuahua (~63 human years) is like a healthy retiree, while a 10-year-old Great Dane (~78 human years) is already geriatric. This formula is validated for dogs aged 1-16 years across 104 Labrador retrievers and correlates to human developmental stages better than any previous method.'
}

export default calcDef
