import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ dailyFare: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tripsPerDay: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), daysPerWeek: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), gasCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), parkingCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'dailyFare', label: 'One-Way Fare ($)', type: 'number', min: 0.5, step: '0.5' },
    { name: 'tripsPerDay', label: 'Trips per Day', type: 'number', min: 1, max: 4, step: '1' },
    { name: 'daysPerWeek', label: 'Days per Week', type: 'number', min: 1, max: 7, step: '1' },
    { name: 'gasCost', label: 'Weekly Gas Cost Saved ($)', type: 'number', min: 0, step: '10' },
    { name: 'parkingCost', label: 'Weekly Parking Saved ($)', type: 'number', min: 0, step: '10' },
  ],
  defaults: { dailyFare: '2.75', tripsPerDay: '2', daysPerWeek: '5', gasCost: '60', parkingCost: '0' },
  presets: [
    { label: 'NYC Subway Commuter', values: { dailyFare: '2.90', tripsPerDay: '2', daysPerWeek: '5', gasCost: '80', parkingCost: '400' } },
    { label: 'Chicago Bus Rider', values: { dailyFare: '2.25', tripsPerDay: '2', daysPerWeek: '5', gasCost: '60', parkingCost: '250' } },
    { label: 'London Tube Weekly', values: { dailyFare: '3.50', tripsPerDay: '2', daysPerWeek: '5', gasCost: '100', parkingCost: '350' } },
    { label: 'LA Metro (3×/Week)', values: { dailyFare: '1.75', tripsPerDay: '2', daysPerWeek: '3', gasCost: '40', parkingCost: '60' } },
  ],
  compute: (v) => {
    const weeklyTransit = v.dailyFare * v.tripsPerDay * v.daysPerWeek
    const monthlyTransit = weeklyTransit * 4.33
    const monthlySavings = v.gasCost * 4.33 + v.parkingCost * 4.33 - monthlyTransit
    return { result: monthlyTransit, label: 'Monthly Transit Cost', unit: '$',
      steps: [
        { label: 'Daily Round Trip', value: `$${v.dailyFare} × ${v.tripsPerDay} trip(s) = $${(v.dailyFare * v.tripsPerDay).toFixed(2)}` },
        { label: 'Weekly Transit Cost', value: `$${(v.dailyFare * v.tripsPerDay).toFixed(2)} × ${v.daysPerWeek} days = $${weeklyTransit.toFixed(2)}` },
        { label: 'Monthly Transit Cost', value: `$${weeklyTransit.toFixed(2)} × 4.33 weeks = $${monthlyTransit.toFixed(2)}` },
        { label: 'Monthly Gas Savings', value: `$${v.gasCost} × 4.33 = $${(v.gasCost * 4.33).toFixed(2)}` },
        { label: 'Monthly Parking Savings', value: `$${v.parkingCost} × 4.33 = $${(v.parkingCost * 4.33).toFixed(2)}` },
        { label: 'Total Savings vs Driving', value: monthlySavings >= 0 ? `Save $${monthlySavings.toFixed(2)}/mo` : `Cost $${Math.abs(monthlySavings).toFixed(2)}/mo more` },
        { label: 'Annual Transit Cost', value: `$${(monthlyTransit * 12).toFixed(0)}` },
        { label: 'Annual Savings vs Driving', value: monthlySavings >= 0 ? `Save $${(monthlySavings * 12).toFixed(0)}/yr` : `Spend $${(Math.abs(monthlySavings) * 12).toFixed(0)}/yr more` },
      ],
      extras: [
        { label: '🚇 US Average Fares', value: 'Average base fare: $2.50 (bus), $2.75 (subway). Monthly passes: $50-130 depending on city. NYC monthly MetroCard: $132.' },
        { label: '💼 IRS Transit Benefit', value: 'Employers can offer up to $315/month (2025) in pre-tax transit benefits — saves $600-1,000/yr in taxes.' },
        { label: '⛽ Driving Cost Breakdown', value: 'Average cost to drive: $0.62/mi (AAA 2024). Includes gas, maintenance, tires, insurance, depreciation. 20-mi round trip × 5 days = $62/week.' },
        { label: '🅿️ Urban Parking Reality', value: 'Downtown parking: $150-500/month (US average $250). In NYC, monthly parking averages $600. Transit eliminates this entirely.' },
        { label: '⏱️ Commute Time Factor', value: 'Transit commuters average 61 min/day round trip. Driving: 55 min/day. On crowded routes, transit can be faster during peak hours.' },
        { label: '🌱 Carbon Comparison', value: 'Transit produces 0.22 kg CO₂/mi vs 0.40 kg CO₂/mi for a single-occupancy car. Switching to transit cuts commute emissions by 45%.' },
        { label: '💵 Annual Savings Potential', value: 'A 2-car household switching to 1 car + transit saves $5,000-10,000/year including insurance, maintenance, and depreciation.' },
        { label: '📱 Payment Tips', value: 'Use contactless (Apple Pay/Google Pay) for daily fares — many cities cap weekly charges equal to a monthly pass rate.' },
      ]
    }
  },
  description: 'Calculate monthly public transit costs and compare savings against driving including gas and parking expenses. Evaluate whether a monthly pass or daily fares save more money for your commute pattern.',
  formula: 'Monthly Transit = One-Way Fare × Trips/Day × Days/Week × 4.33 | Monthly Savings = (Weekly Gas + Weekly Parking) × 4.33 − Monthly Transit | Annual = Monthly × 12',
  interpretation: 'Monthly transit passes are usually cheaper than daily fares if you commute 5 days/week. The IRS allows up to $315/month (2025) in pre-tax transit benefits. The average US transit commuter saves $800-2,000/year compared to driving, not including the indirect savings from reduced vehicle wear, insurance, and parking. Transit also produces 45% less CO₂ per mile than single-occupancy driving.'
}

export default calcDef
