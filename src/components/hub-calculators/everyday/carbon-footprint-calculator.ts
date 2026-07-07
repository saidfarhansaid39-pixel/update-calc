import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ electricityKwh: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), carMiles: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), flights: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), dietType: z.string().min(1) }),
  fields: [
    { name: 'electricityKwh', label: 'Monthly Electricity (kWh)', type: 'number', min: 0, step: '100' },
    { name: 'carMiles', label: 'Monthly Car Miles', type: 'number', min: 0, step: '100' },
    { name: 'flights', label: 'Flights Taken (short haul)', type: 'number', min: 0, step: '1' },
    { name: 'dietType', label: 'Diet Type', type: 'select', options: [{ label: 'Meat-heavy', value: 'meat' }, { label: 'Average', value: 'average' }, { label: 'Vegetarian', value: 'vegetarian' }, { label: 'Vegan', value: 'vegan' }] },
  ],
  compute: (v) => {
    const dietFactors: Record<string, number> = { meat: 1600, average: 1200, vegetarian: 800, vegan: 500 }
    const electricCO2 = v.electricityKwh * 0.92
    const carCO2 = v.carMiles * 0.41
    const flightCO2 = v.flights * 200
    const dietCO2 = (dietFactors[v.dietType] || 1200) / 12
    const totalMonthly = electricCO2 + carCO2 + flightCO2 + dietCO2
    const totalAnnual = totalMonthly * 12
    return { result: totalAnnual, label: 'Annual CO2 Footprint', unit: 'lbs', steps: [{ label: 'Electricity', value: `${electricCO2.toFixed(0)} lbs/mo` }, { label: 'Car Travel', value: `${carCO2.toFixed(0)} lbs/mo` }, { label: 'Flights', value: `${flightCO2.toFixed(0)} lbs/mo` }, { label: 'Diet', value: `${dietCO2.toFixed(0)} lbs/mo` }, { label: 'Annual Total', value: `${totalAnnual.toFixed(0)} lbs CO2` }] }
  },
  description: 'Estimate your annual carbon footprint from energy, transportation, air travel, and diet. Compare to the US average (~40,000 lbs CO2/person/year).',
  formula: 'Footprint = Electric(kWh×0.92) + Car(miles×0.41) + Flights(count×200) + Diet',
  interpretation: 'US average: ~40,000 lbs CO2/yr. Global average: ~10,000 lbs. To reach Paris Agreement targets, aim for <5,000 lbs/yr. Biggest levers: reduce flying, go plant-based, switch to renewables.'
}

export default calcDef
