import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ batteryKwh: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), rangeMiles: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), chargeRateKw: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), dailyMiles: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'batteryKwh', label: 'Battery Capacity (kWh)', type: 'number', min: 10, step: '5' },
    { name: 'rangeMiles', label: 'Full Range (miles)', type: 'number', min: 50, step: '10' },
    { name: 'chargeRateKw', label: 'Charger Power (kW)', type: 'number', min: 1, step: '1' },
    { name: 'dailyMiles', label: 'Daily Driving (miles)', type: 'number', min: 1, step: '5' },
  ],
  defaults: { batteryKwh: '75', rangeMiles: '300', chargeRateKw: '7.2', dailyMiles: '35' },
  presets: [
    { label: 'Tesla Model 3 (Standard)', values: { batteryKwh: '60', rangeMiles: '272', chargeRateKw: '7.2', dailyMiles: '35' } },
    { label: 'Ford F-150 Lightning', values: { batteryKwh: '98', rangeMiles: '230', chargeRateKw: '11.5', dailyMiles: '50' } },
    { label: 'Rivian R1S (Large Pack)', values: { batteryKwh: '135', rangeMiles: '320', chargeRateKw: '11.5', dailyMiles: '40' } },
    { label: 'Short Commute (Leaf)', values: { batteryKwh: '40', rangeMiles: '150', chargeRateKw: '3.3', dailyMiles: '20' } },
  ],
  compute: (v) => {
    const efficiency = v.batteryKwh / v.rangeMiles
    const dailyKwhNeeded = v.dailyMiles * efficiency
    const chargeTimeHrs = dailyKwhNeeded / v.chargeRateKw
    const chargeTimeMin = chargeTimeHrs * 60
    const pctUsed = (v.dailyMiles / v.rangeMiles) * 100
    const weeklyKwh = dailyKwhNeeded * 7
    const monthlyKwh = dailyKwhNeeded * 30
    const annualKwh = dailyKwhNeeded * 365
    const miPerHrCharge = v.chargeRateKw / efficiency
    const pctAddedPerHr = (miPerHrCharge / v.rangeMiles) * 100
    const weeklyChargeMin = chargeTimeMin * 7
    return { result: chargeTimeMin, label: 'Charge Time Needed', unit: 'min', steps: [
      { label: 'Vehicle Efficiency', value: `${(efficiency * 1000).toFixed(0)} Wh/mi (${efficiency.toFixed(3)} kWh/mi)` },
      { label: 'Daily Energy Needed', value: `${v.dailyMiles} mi × ${efficiency.toFixed(3)} kWh/mi = ${dailyKwhNeeded.toFixed(1)} kWh` },
      { label: 'Battery Used per Day', value: `${pctUsed.toFixed(1)}% of ${v.batteryKwh} kWh pack` },
      { label: 'Charger Power', value: `${v.chargeRateKw} kW (${v.chargeRateKw < 3 ? 'Level 1' : v.chargeRateKw < 20 ? 'Level 2' : 'DC Fast'} charger)` },
      { label: 'Charge Time per Day', value: `${chargeTimeHrs.toFixed(2)} hrs (${chargeTimeMin.toFixed(0)} min)` },
      { label: 'Miles Added per Hour', value: `${miPerHrCharge.toFixed(0)} mi/hr (${pctAddedPerHr.toFixed(1)}%/hr)` },
      { label: 'Weekly Charging', value: `${weeklyKwh.toFixed(1)} kWh, ${weeklyChargeMin.toFixed(0)} min total` },
      { label: 'Annual Energy', value: `${annualKwh.toFixed(0)} kWh/yr` },
    ] ,
    extras: [
      { label: "Charging Levels Comparison", value: "Level 1 (120V, 1.2-1.8 kW): adds 3-5 mi/hr. Best for PHEVs and short commutes. Level 2 (240V, 3.3-19.2 kW): adds 12-60 mi/hr. Standard for home charging. DC Fast (50-350 kW): adds 150-1,000 mi/hr in 20-30 min. Not recommended for daily use — frequent DCFC accelerates battery degradation 1.5-2×." },
      { label: "Home Charging Installation", value: "NEMA 14-50 outlet installation: $200-800 (electrician). Level 2 EVSE (charger): $400-1,200. Federal tax credit: 30% of installation (up to $1,000) via IRA. Many utility companies offer $250-1,000 rebates for installing level 2 chargers. Total net cost after incentives: often $0-500." },
      { label: "Battery Degradation Expectations", value: "EV batteries degrade ~2.3%/year average. After 8 years / 100,000 miles: ~80-85% original capacity (warranty threshold). LFP batteries (Tesla RWD, many Chinese EVs) degrade slower (1-1.5%/yr) and can be charged to 100% daily. NCM batteries (most EVs) should be limited to 80-90% daily charge." },
      { label: "Public Charging Network", value: "US public charger count: ~180,000 ports (2024), growing 40%/yr. Tesla Supercharger (NACS): 50,000+ stalls, 250 kW avg. CCS/CHAdeMO: 40,000+ stalls, 50-350 kW. Tesla NACS becoming standard — Ford, GM, Rivian, Volvo gaining access in 2024-25. Road trip charging adds 25-50% to travel time vs gas." },
      { label: "Cold Weather Impact", value: "EV range drops 20-40% in below-freezing temperatures. Battery chemistry slows, cabin heating uses 3-7 kW. Pre-conditioning (warming battery while plugged in) recovers 10-15% range. Heat pumps (standard on newer EVs) reduce cold-weather losses by 30-50% vs resistive heating." },
      { label: "Charging Cost Comparison", value: "Home (Level 2 at $0.14/kWh): $0.05-0.07/mi. Public Level 2 ($0.20-0.40/kWh): $0.07-0.16/mi. DCFC ($0.30-0.56/kWh): $0.10-0.25/mi. Gas equivalent (30 MPG at $3.50/gal): $0.12/mi. Home charging is 40-60% cheaper than gas. DCFC can be equal to or more expensive than gas in some regions." },
      { label: "One-Pedal Driving & Regenerative Braking", value: "Regen braking recaptures 15-30% of kinetic energy — most effective in city driving (stop-and-go). Highway regen is minimal. One-pedal driving (e.g., Tesla, Ioniq 5, Mach-E) extends range 5-15% in mixed driving. Aggressive driving reduces EV range 30-40% (vs 15-25% for gas cars)." },
      { label: "EV Total Cost of Ownership", value: "EVs cost $0.04-0.08/mi in energy vs $0.10-0.18/mi for gas. Maintenance: $0.03-0.05/mi (no oil changes, fewer brake jobs) vs $0.06-0.10/mi for gas. Breakeven vs comparable gas car: 1-3 years / 15,000-45,000 miles with current incentives. 10-year TCO: $5,000-15,000 less than gas." },
    ]}
  },
  description: 'Calculate the exact charging time needed for your daily commute based on EV battery specs, efficiency, charger power, and driving distance. Includes level-specific charger analysis and annual energy projections.',
  formula: 'Charge Time (hrs) = [Daily Miles × (Battery kWh / Range)] / Charger kW | Efficiency = Battery kWh / Range (kWh/mi)',
  interpretation: 'Most EV owners charge overnight on a Level 2 (240V) home charger, adding 20-60 miles of range per hour. For a typical 35-mile daily commute in a 75 kWh / 300-mile range EV, you need only ~1.5 hours on a 7.2 kW Level 2 charger — easily done overnight. The key insight: charging time is driven by your miles-to-kWh efficiency, not just battery size. A more efficient EV (lower kWh/mi) charges faster and costs less to run.'
}

export default calcDef
