import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ dogWeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), walkMinPerDay: z.string().min(1).refine(v => parseFloat(v) >= 5, '>=5'), daysPerWeek: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'dogWeight', label: 'Dog Weight (lbs)', type: 'number', min: 1, step: '5' },
    { name: 'walkMinPerDay', label: 'Walk Minutes per Day', type: 'number', min: 5, step: '5' },
    { name: 'daysPerWeek', label: 'Days per Week', type: 'number', min: 1, max: 7, step: '1' },
  ],
  defaults: { dogWeight: '45', walkMinPerDay: '30', daysPerWeek: '7' },
  presets: [
    { label: 'Small Breed (Chihuahua)', values: { dogWeight: '8', walkMinPerDay: '15', daysPerWeek: '5' } },
    { label: 'Medium Active Breed (Beagle)', values: { dogWeight: '30', walkMinPerDay: '40', daysPerWeek: '7' } },
    { label: 'High-Energy (Border Collie)', values: { dogWeight: '55', walkMinPerDay: '60', daysPerWeek: '7' } },
    { label: 'Giant Breed (Great Dane)', values: { dogWeight: '150', walkMinPerDay: '20', daysPerWeek: '6' } },
  ],
  compute: (v) => {
    const weeklyMin = v.walkMinPerDay * v.daysPerWeek
    const weeklyKm = weeklyMin * 0.08
    const calPerMin = v.dogWeight * 0.0008
    const weeklyCal = calPerMin * weeklyMin
    const monthlyMin = weeklyMin * 4.33
    const annualMin = weeklyMin * 52
    const annualKm = weeklyKm * 52
    const humanCalPerMin = 3.5
    const humanWeeklyCal = humanCalPerMin * weeklyMin
    const paceMinPerMi = 20
    const weeklyMi = weeklyMin / paceMinPerMi
    return { result: weeklyMin, label: 'Weekly Walking Duration', unit: 'min', steps: [
      { label: 'Daily Walk Duration', value: `${v.walkMinPerDay} min` },
      { label: 'Days per Week', value: `${v.daysPerWeek} days` },
      { label: 'Weekly Total', value: `${weeklyMin} min (${weeklyMin / 60} hrs)` },
      { label: 'Monthly Total', value: `${monthlyMin.toFixed(0)} min` },
      { label: 'Annual Total', value: `${annualMin.toFixed(0)} min (${(annualMin / 60 / 24).toFixed(1)} days)` },
      { label: 'Weekly Distance', value: `${weeklyKm.toFixed(1)} km (${weeklyMi.toFixed(1)} mi)` },
      { label: 'Annual Distance', value: `${annualKm.toFixed(0)} km (${(annualKm * 0.621).toFixed(0)} mi)` },
      { label: 'Dog Calories Burned/Week', value: `${weeklyCal.toFixed(0)} kcal (vs ${humanWeeklyCal.toFixed(0)} kcal for you)` },
    ] ,
    extras: [
      { label: "Breed Energy Requirements", value: "High-energy breeds (Husky, Border Collie, Australian Shepherd) need 60-90 min vigorous exercise daily. Low-energy breeds (Bulldog, Basset Hound, Shih Tzu) do fine with 15-20 min. Inadequate exercise causes destructive behaviors like chewing and digging." },
      { label: "Walk vs Sniff Walk", value: "A 15-min 'sniff walk' (dog leads, stops to smell) is mentally more enriching than a 30-min structured walk. Dogs process scent information like reading a newspaper — let them 'read' for 10-15 min per walk." },
      { label: "Weather Safety", value: "Pavement can be 40-60°F hotter than air on sunny days. If it's 85°F+, walk on grass or early morning. Below 20°F, small/short-haired breeds need booties and jackets. Signs of过热: excessive panting, drooling, stumbling." },
      { label: "Mental Enrichment Alternatives", value: "Replace one daily walk with: puzzle feeder (10 min), nose work (15 min), tug-of-war (5 min), or training session (10 min). Mental exercise tires dogs 2-3× more than physical exercise." },
      { label: "Leash Reactivity", value: "Dogs that bark/lunge at other dogs on leash are often over-aroused, not aggressive. Counter-conditioning with high-value treats 10 ft from triggers, 5 min sessions, 3×/day, resolves in 4-8 weeks for most dogs." },
      { label: "Puppy Walking Guidelines", value: "Puppy exercise rule: 5 min per month of age, twice daily. A 4-month-old = 20 min walks, 2×/day. Too much forced exercise before growth plates close (12-18 months) can cause hip and joint damage." },
      { label: "Owner Health Benefits", value: "Dog owners walk 22 min/day more than non-owners — meeting WHO physical activity guidelines 65% more often. A 150 lb person burns ~100 cal per 30-min walk. Daily dog walking = 12-15 lbs weight loss per year." },
      { label: "Professional Dog Walking Costs", value: "Professional walkers charge $15-30 per 30-min walk, $20-40 per hour. 5 days/week = $300-600/mo. Many offer group walks at 50% discount. Pet sitters often include walks in overnight care packages." },
    ]}
  },
  description: 'Evaluate your dog\'s weekly walking routine — duration, distance, and calories for both dog and owner. Includes breed-specific recommendations, monthly and annual projections, and enrichment guidance.',
  formula: 'Weekly Min = Min/Day × Days/Week | Dog Cal = Weight × 0.0008 × Min | Weekly KM = Min × 0.08 | Human Cal = 3.5 × Min',
  interpretation: 'Most adult dogs need 30-60 min of daily exercise, but quality matters more than quantity. A 50 lb dog walking 30 min/day burns ~84 kcal/week from walking alone. The average dog owner walks 22 min/day more than non-owners, burning an extra 4,000-6,000 kcal/year — enough to lose 1-2 lbs annually without diet changes.'
}

export default calcDef
