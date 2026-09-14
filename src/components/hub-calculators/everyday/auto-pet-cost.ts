import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ apcPetType: z.string().min(1), apcPetSize: z.string().min(1), apcFoodQuality: z.string().min(1), apcVetVisitsYearly: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), apcGroomingYearly: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), apcPetSittingMonthly: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), apcPetInsurance: z.string().min(1) }),
  fields: [
    { name: 'apcPetType', label: 'Pet Type', type: 'select', options: [{ label: 'Dog', value: 'dog' }, { label: 'Cat', value: 'cat' }, { label: 'Small Mammal', value: 'small' }, { label: 'Bird', value: 'bird' }, { label: 'Fish', value: 'fish' }] },
    { name: 'apcPetSize', label: 'Pet Size', type: 'select', options: [{ label: 'Small (0-20 lbs)', value: 'small' }, { label: 'Medium (21-50 lbs)', value: 'medium' }, { label: 'Large (51-90 lbs)', value: 'large' }, { label: 'Extra Large (91+ lbs)', value: 'xl' }] },
    { name: 'apcFoodQuality', label: 'Food Quality', type: 'select', options: [{ label: 'Economy', value: 'economy' }, { label: 'Premium', value: 'premium' }, { label: 'Prescription/Specialty', value: 'specialty' }] },
    { name: 'apcVetVisitsYearly', label: 'Vet Visits per Year', type: 'number', min: 0, step: '1' },
    { name: 'apcGroomingYearly', label: 'Grooming per Year', type: 'number', min: 0, step: '2' },
    { name: 'apcPetSittingMonthly', label: 'Pet Sitting/Walking ($/mo)', type: 'number', min: 0, step: '25' },
    { name: 'apcPetInsurance', label: 'Pet Insurance', type: 'select', options: [{ label: 'None', value: 'none' }, { label: 'Accident Only ($15/mo)', value: 'accident' }, { label: 'Comprehensive ($40/mo)', value: 'comprehensive' }] },
  ],
  defaults: { apcPetType: 'dog', apcPetSize: 'medium', apcFoodQuality: 'premium', apcVetVisitsYearly: '2', apcGroomingYearly: '6', apcPetSittingMonthly: '0', apcPetInsurance: 'none' },
  presets: [
    { label: 'Medium Dog — Premium', values: { apcPetType: 'dog', apcPetSize: 'medium', apcFoodQuality: 'premium', apcVetVisitsYearly: '2', apcGroomingYearly: '6', apcPetSittingMonthly: '50', apcPetInsurance: 'comprehensive' } },
    { label: 'Indoor Cat — Economy', values: { apcPetType: 'cat', apcPetSize: 'small', apcFoodQuality: 'economy', apcVetVisitsYearly: '1', apcGroomingYearly: '0', apcPetSittingMonthly: '0', apcPetInsurance: 'none' } },
    { label: 'Large Dog — Full Coverage', values: { apcPetType: 'dog', apcPetSize: 'large', apcFoodQuality: 'specialty', apcVetVisitsYearly: '3', apcGroomingYearly: '12', apcPetSittingMonthly: '100', apcPetInsurance: 'comprehensive' } },
    { label: 'Small Mammal — Budget', values: { apcPetType: 'small', apcPetSize: 'small', apcFoodQuality: 'economy', apcVetVisitsYearly: '1', apcGroomingYearly: '0', apcPetSittingMonthly: '0', apcPetInsurance: 'none' } },
  ],
  compute: (v) => {
    const foodCosts: Record<string, Record<string, number>> = { dog: { small: 25, medium: 40, large: 60, xl: 80 }, cat: { small: 20, medium: 25, large: 30, xl: 35 }, small: { small: 10, medium: 15, large: 20, xl: 25 }, bird: { small: 10, medium: 15, large: 20, xl: 25 }, fish: { small: 5, medium: 10, large: 15, xl: 20 } }
    const qualityFactors: Record<string, number> = { economy: 1, premium: 1.5, specialty: 2.5 }
    const sizeMap: Record<string, string> = { small: 'small', medium: 'medium', large: 'large', xl: 'xl' }
    const baseFood = (foodCosts[v.apcPetType] || foodCosts.dog)[sizeMap[v.apcPetSize] || 'medium'] || 40
    const foodFactor = qualityFactors[v.apcFoodQuality] || 1
    const monthlyFood = baseFood * foodFactor
    const monthlyVet = (v.apcVetVisitsYearly * 60) / 12
    const monthlyGrooming = (v.apcGroomingYearly * 50) / 12
    const insuranceCosts: Record<string, number> = { none: 0, accident: 15, comprehensive: 40 }
    const monthlyInsurance = insuranceCosts[v.apcPetInsurance] || 0
    const monthlyTotal = monthlyFood + monthlyVet + monthlyGrooming + v.apcPetSittingMonthly + monthlyInsurance
    const annualTotal = monthlyTotal * 12
    const firstYear = monthlyTotal * 12 + 500
    return { result: monthlyTotal, label: 'Monthly Pet Cost', unit: '$', steps: [
      { label: 'Monthly Food', value: `Base $${baseFood.toFixed(2)} × quality ${foodFactor}× = $${monthlyFood.toFixed(2)}` },
      { label: 'Vet (annualized/mo)', value: `${v.apcVetVisitsYearly} visits × $60 ÷ 12 months = $${monthlyVet.toFixed(2)}` },
      { label: 'Grooming (annualized/mo)', value: `${v.apcGroomingYearly} sessions × $50 ÷ 12 months = $${monthlyGrooming.toFixed(2)}` },
      { label: 'Pet Sitting/Walking', value: `$${v.apcPetSittingMonthly.toFixed(2)}/mo` },
      { label: 'Pet Insurance', value: `$${monthlyInsurance.toFixed(2)}/mo` },
      { label: 'Monthly Total', value: `$${monthlyFood.toFixed(2)} + $${monthlyVet.toFixed(2)} + $${monthlyGrooming.toFixed(2)} + $${v.apcPetSittingMonthly.toFixed(2)} + $${monthlyInsurance.toFixed(2)} = $${monthlyTotal.toFixed(2)}` },
      { label: 'Annual Total', value: `$${monthlyTotal.toFixed(2)} × 12 = $${annualTotal.toFixed(2)}` },
      { label: 'First-Year Total', value: `$${annualTotal.toFixed(2)} + $500.00 setup = $${firstYear.toFixed(2)}` },
    ] ,
    extras: [
      { label: "First-year setup costs", value: "Expect $200–800 for adoption fees, spay/neuter, microchip, initial vaccines, leash, crate, bowls, and bed. This calculator adds a flat $500." },
      { label: "Pet insurance payoff", value: "Comprehensive insurance ($40/mo) covers 70–90% of major vet bills. An emergency surgery ($3,000–7,000) would cost you $300–700 out-of-pocket vs $3,000+ without insurance." },
      { label: "Food quality trade-offs", value: "Premium food ($1.50×) costs more upfront but may reduce vet visits from allergies and dental issues. Prescription diets ($2.50×) are necessary for chronic conditions like kidney disease or diabetes." },
      { label: "Grooming frequency", value: "Short-haired dogs: 4–6×/year ($30–60 each). Long-haired: 8–12×/year ($50–90 each). Cats rarely need grooming ($0–2×/year). Nail trims add $10–20 per session." },
      { label: "Pet sitting vs boarding", value: "Pet sitting ($15–25/visit) is cheaper than boarding ($35–60/night) for short trips. For a 7-day vacation: sitting = $105–175; boarding = $245–420." },
      { label: "Hidden annual costs", value: "Licenses ($10–20/year), flea/tick prevention ($100–250/year), heartworm meds ($60–200/year), toys and treats ($50–200/year). Budget $300–600/year beyond food and vet." },
      { label: "Pet size matters", value: "A 20-lb dog eats ~1.5 cups/day ($25–40/mo). A 90-lb dog eats ~4 cups/day ($60–100/mo). XL breeds (120+ lbs) can cost $80–130/mo just for food." },
      { label: "Emergency fund", value: "Vets recommend a $1,000–2,000 emergency fund per pet. Common emergencies: foreign body ingestion ($1,500–3,500), broken bone ($500–2,000), poisoning ($500–2,500)." },
    ]}
  },
  description: 'Estimate real monthly and annual pet ownership costs — food scaled by pet type, size, and quality tier, plus vet care, grooming, pet sitting, and insurance. Includes first-year setup expenses.',
  formula: 'Monthly = (BaseFood × Quality) + (VetVisits × $60 ÷ 12) + (GroomingSessions × $50 ÷ 12) + Sitting + Insurance | FirstYear = Monthly × 12 + $500',
  interpretation: 'A medium dog on premium food with comprehensive insurance costs ~$180–250/month ($2,200–3,000/year). An indoor cat on economy food with no insurance runs ~$30–50/month ($360–600/year). First year always adds $500+ for setup.'
}

export default calcDef
