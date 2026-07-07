'use client'

import React from 'react'
import { z } from 'zod'

export function numField(label: string, min?: number, max?: number) {
  const range = min !== undefined && max !== undefined ? `Must be ${min}-${max}`
    : min !== undefined ? `Must be >= ${min}` : max !== undefined ? `Must be <= ${max}` : 'Must be a number'
  return z.string().min(1, `${label} required`).refine(
    v => !isNaN(parseFloat(v)) && (min === undefined || parseFloat(v) >= min) && (max === undefined || parseFloat(v) <= max), range
  )
}

export const sel = (opts: string[]) => z.enum(opts as [string, ...string[]])

export const yesno = z.enum(['yes', 'no'])

function SimpleResult({ label, value, unit }: { label: string; value: number | string; unit?: string }) {
  return (
    <div className="text-center space-y-1">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-3xl font-bold text-[#06b6d4]">{typeof value === 'number' ? value.toFixed(2) : value}{unit && <span className="text-lg ml-1">{unit}</span>}</p>
    </div>
  )
}

function MultiResult({ items }: { items: { label: string; value: number | string; unit?: string }[] }) {
  return (
    <div className="space-y-3 text-center">
      {items.map((item, i) => (
        <div key={i}>
          <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{typeof item.value === 'number' ? item.value.toFixed(2) : item.value}{item.unit && <span className="text-sm ml-1">{item.unit}</span>}</p>
        </div>
      ))}
    </div>
  )
}

export const everydayRenderers: Record<string, (vals: Record<string, any>) => React.ReactNode> = {
  clothing: (v) => {
    const us = parseFloat(v.us) || 0; const eu = us * 2 + 32; const uk = us - 2
    return <MultiResult items={[{ label: 'US Size', value: us }, { label: 'EU Size', value: Math.round(eu) }, { label: 'UK Size', value: Math.round(uk) }]} />
  },
  ring: (v) => {
    const mm = parseFloat(v.mm) || 0; const us = mm * 0.04 + 1; const uk = mm * 0.04 - 0.5
    return <MultiResult items={[{ label: 'Circumference', value: mm, unit: 'mm' }, { label: 'US Size', value: us.toFixed(1) }, { label: 'UK Size', value: uk.toFixed(1) }]} />
  },
  cooking: (v) => {
    const weight = parseFloat(v.weight) || 0; const method = v.method || 'roast'; const perKg = method === 'roast' ? 40 : 20; const time = weight * perKg
    return <MultiResult items={[{ label: 'Weight', value: weight, unit: 'kg' }, { label: 'Cooking Time', value: time, unit: 'min' }, { label: 'Method', value: method }]} />
  },
  pace: (v) => {
    const dist = parseFloat(v.distance) || 0; const hours = parseFloat(v.hours) || 0; const mins = parseFloat(v.mins) || 0; const totalHrs = hours + mins / 60; const pace = dist > 0 ? totalHrs / dist : 0; const speed = totalHrs > 0 ? dist / totalHrs : 0
    return <MultiResult items={[{ label: 'Distance', value: dist, unit: 'km' }, { label: 'Pace', value: pace, unit: 'hr/km' }, { label: 'Avg Speed', value: speed, unit: 'km/h' }]} />
  },
  steps: (v) => {
    const steps = parseFloat(v.steps) || 0; const stride = parseFloat(v.stride) || 0.76; const distM = steps * stride; const distKm = distM / 1000; const distMi = distKm / 1.609; const cal = steps * 0.04
    return <MultiResult items={[{ label: 'Steps', value: steps }, { label: 'Distance', value: distKm, unit: 'km' }, { label: 'Distance', value: distMi, unit: 'mi' }, { label: 'Calories', value: cal, unit: 'kcal' }]} />
  },
  water_intake: (v) => {
    const weight = parseFloat(v.weight) || 70; const activity = parseFloat(v.activity) || 0; const base = weight * 0.033; const extra = activity * 0.5; const total = base + extra
    return <MultiResult items={[{ label: 'Base Intake', value: base, unit: 'L' }, { label: 'Activity Bonus', value: extra, unit: 'L' }, { label: 'Daily Goal', value: total, unit: 'L' }]} />
  },
  caffeine: (v) => {
    const cups = parseFloat(v.cups) || 0; const type = v.type || 'drip'; const mgMap: Record<string, number> = { drip: 95, espresso: 63, instant: 62, cold: 95, tea: 47, energy: 80 }; const perCup = mgMap[type] || 95; const total = cups * perCup; const safe = total <= 400
    return <MultiResult items={[{ label: 'Caffeine Intake', value: total, unit: 'mg' }, { label: 'Per Cup', value: perCup, unit: 'mg' }, { label: 'Safe Limit', value: safe ? 'Within limit' : 'Exceeded 400mg' }]} />
  },
  alcohol: (v) => {
    const vol = parseFloat(v.volume) || 0; const abv = parseFloat(v.abv) || 5; const pureAlcohol = vol * (abv / 100) * 0.789; const stdDrinks = pureAlcohol / 10
    return <MultiResult items={[{ label: 'Pure Alcohol', value: pureAlcohol, unit: 'g' }, { label: 'Standard Drinks', value: stdDrinks }, { label: 'ABV', value: abv, unit: '%' }]} />
  },
  bac: (v) => {
    const drinks = parseFloat(v.drinks) || 0; const weight = parseFloat(v.weight) || 70; const gender = v.gender || 'male'; const r = gender === 'male' ? 0.68 : 0.55; const hours = parseFloat(v.hours) || 0; const bac = ((drinks * 14) / (weight * 1000 * r)) * 100 - (hours * 0.015); const bacClamped = Math.max(0, bac)
    return <MultiResult items={[{ label: 'Estimated BAC', value: bacClamped.toFixed(3), unit: '%' }, { label: 'Legal Limit', value: '0.08%' }, { label: 'Status', value: bacClamped >= 0.08 ? 'OVER LIMIT' : 'Under limit' }]} />
  },
  habit_cost: (v) => {
    const perDay = parseFloat(v.perDay) || 0; const quantity = parseFloat(v.quantity) || 1; const daily = perDay * quantity; const weekly = daily * 7; const monthly = daily * 30; const yearly = daily * 365
    return <MultiResult items={[{ label: 'Daily Cost', value: daily, unit: '$' }, { label: 'Weekly', value: weekly, unit: '$' }, { label: 'Monthly', value: monthly, unit: '$' }, { label: 'Yearly', value: yearly, unit: '$' }]} />
  },
  pet: (v) => {
    const weight = parseFloat(v.weight) || 10; const type = v.type || 'dog'; const multi = type === 'dog' ? 0.025 : 0.02; const dailyG = weight * multi * 1000; const dailyCups = dailyG / 250
    return <MultiResult items={[{ label: 'Portion Size', value: dailyG, unit: 'g/day' }, { label: 'Cups/Day', value: dailyCups.toFixed(1) }, { label: 'Monthly', value: (dailyG * 30 / 1000).toFixed(1), unit: 'kg' }]} />
  },
  pet_age: (v) => {
    const years = parseFloat(v.years) || 0; const type = v.type || 'dog'; const humanYears = type === 'dog' ? 16 * Math.log(years + 1) + 31 : 15 * Math.log(years + 1) + 20
    return <SimpleResult label={`Human Years (${type})`} value={humanYears.toFixed(1)} />
  },
  party: (v) => {
    const guests = parseFloat(v.guests) || 0; const hours = parseFloat(v.hours) || 2; const drinks = guests * hours * 1.5; const food = guests * 6; const ice = Math.ceil(guests / 10)
    return <MultiResult items={[{ label: 'Guests', value: guests }, { label: 'Drinks Needed', value: Math.ceil(drinks) }, { label: 'Food Servings', value: Math.ceil(food) }, { label: 'Ice Bags', value: ice }]} />
  },
  wedding: (v) => {
    const guests = parseFloat(v.guests) || 100; const total = parseFloat(v.total) || 30000; const venue = total * 0.35; const catering = total * 0.30; const photo = total * 0.12; const attire = total * 0.08; const other = total * 0.15
    return <MultiResult items={[{ label: 'Venue', value: venue, unit: '$' }, { label: 'Catering', value: catering, unit: '$' }, { label: 'Photo/Video', value: photo, unit: '$' }, { label: 'Attire', value: attire, unit: '$' }, { label: 'Other', value: other, unit: '$' }]} />
  },
  moving: (v) => {
    const dist = parseFloat(v.distance) || 0; const items = parseFloat(v.items) || 50; const rooms = parseFloat(v.rooms) || 1; const labor = rooms * 200; const transport = dist * 2.5; const supplies = items * 3; const total = labor + transport + supplies
    return <MultiResult items={[{ label: 'Labor', value: labor, unit: '$' }, { label: 'Transport', value: transport, unit: '$' }, { label: 'Supplies', value: supplies, unit: '$' }, { label: 'Total', value: total, unit: '$' }]} />
  },
  cleaning: (v) => {
    const rooms = parseFloat(v.rooms) || 0; const bath = parseFloat(v.bath) || 0; const type = v.type || 'deep'; const minPerRoom = type === 'deep' ? 45 : 20; const totalMin = rooms * minPerRoom + bath * 30
    return <MultiResult items={[{ label: 'Estimated Time', value: totalMin, unit: 'min' }, { label: 'Hours', value: (totalMin / 60).toFixed(1) }, { label: 'Type', value: type }]} />
  },
  laundry: (v) => {
    const loads = parseFloat(v.loads) || 0; const costPer = parseFloat(v.costPer) || 1.50; const total = loads * costPer; const monthly = loads * 4 * costPer; const yearly = monthly * 12
    return <MultiResult items={[{ label: 'Per Load', value: costPer, unit: '$' }, { label: 'Weekly Total', value: total, unit: '$' }, { label: 'Monthly', value: monthly, unit: '$' }, { label: 'Yearly', value: yearly, unit: '$' }]} />
  },
  electricity: (v) => {
    const watts = parseFloat(v.watts) || 0; const hours = parseFloat(v.hours) || 1; const rate = parseFloat(v.rate) || 0.12; const kwh = watts * hours / 1000; const cost = kwh * rate; const monthly = cost * 30
    return <MultiResult items={[{ label: 'Energy Used', value: kwh, unit: 'kWh' }, { label: 'Cost Per Day', value: cost, unit: '$' }, { label: 'Monthly Cost', value: monthly, unit: '$' }]} />
  },
  water_bill: (v) => {
    const usage = parseFloat(v.usage) || 0; const rate = parseFloat(v.rate) || 3.5; const base = parseFloat(v.base) || 15; const total = base + usage * rate / 1000
    return <MultiResult items={[{ label: 'Water Used', value: usage, unit: 'L' }, { label: 'Usage Charge', value: (usage * rate / 1000).toFixed(2), unit: '$' }, { label: 'Total Bill', value: total.toFixed(2), unit: '$' }]} />
  },
  internet: (v) => {
    const devices = parseFloat(v.devices) || 0; const streaming = v.streaming === 'yes' ? 25 : 0; const gaming = v.gaming === 'yes' ? 50 : 0; const work = v.work === 'yes' ? 25 : 0; const total = 10 + devices * 5 + streaming + gaming + work
    return <MultiResult items={[{ label: 'Recommended Speed', value: total, unit: 'Mbps' }, { label: 'Streaming 4K', value: streaming ? 'Yes' : 'No' }, { label: 'Gaming', value: gaming ? 'Yes' : 'No' }]} />
  },
  phone: (v) => {
    const plan = parseFloat(v.plan) || 0; const lines = parseFloat(v.lines) || 1; const device = parseFloat(v.device) || 0; const monthly = plan * lines + device / 24; const yearly = monthly * 12
    return <MultiResult items={[{ label: 'Monthly Total', value: monthly, unit: '$' }, { label: 'Per Line', value: plan, unit: '$' }, { label: 'Yearly Cost', value: yearly, unit: '$' }]} />
  },
  streaming: (v) => {
    const services = parseFloat(v.services) || 0; const avgCost = parseFloat(v.avgCost) || 12.99; const monthly = services * avgCost; const yearly = monthly * 12
    return <MultiResult items={[{ label: 'Monthly Total', value: monthly, unit: '$' }, { label: 'Yearly Total', value: yearly, unit: '$' }, { label: 'Services', value: services }]} />
  },
  grocery: (v) => {
    const people = parseFloat(v.people) || 1; const perPerson = parseFloat(v.perPerson) || 100; const weekly = people * perPerson; const monthly = weekly * 4.33; const yearly = monthly * 12
    return <MultiResult items={[{ label: 'Weekly Budget', value: weekly, unit: '$' }, { label: 'Monthly Budget', value: monthly, unit: '$' }, { label: 'Yearly Budget', value: yearly, unit: '$' }]} />
  },
  dining: (v) => {
    const meals = parseFloat(v.meals) || 0; const avgCost = parseFloat(v.avgCost) || 15; const monthly = meals * 4.33 * avgCost; const yearly = monthly * 12; const savings = parseFloat(v.savings) || 0; const potential = yearly - yearly * (savings / 100)
    return <MultiResult items={[{ label: 'Monthly Spend', value: monthly, unit: '$' }, { label: 'Yearly Spend', value: yearly, unit: '$' }, { label: 'With Savings', value: potential, unit: '$' }]} />
  },
  gym: (v) => {
    const monthly = parseFloat(v.monthly) || 0; const visits = parseFloat(v.visits) || 0; const perVisit = visits > 0 ? monthly / visits : 0; const yearly = monthly * 12; const commute = parseFloat(v.commute) || 0; const totalYearly = yearly + commute * 12
    return <MultiResult items={[{ label: 'Monthly Fee', value: monthly, unit: '$' }, { label: 'Cost Per Visit', value: perVisit, unit: '$' }, { label: 'Yearly Total', value: totalYearly, unit: '$' }]} />
  },
  maintenance: (v) => {
    const homeValue = parseFloat(v.homeValue) || 0; const rule = parseFloat(v.rule) || 1; const annual = homeValue * rule / 100; const monthly = annual / 12
    return <MultiResult items={[{ label: 'Annual Maintenance', value: annual, unit: '$' }, { label: 'Monthly Reserve', value: monthly, unit: '$' }, { label: 'Rule Used', value: `${rule}% of value` }]} />
  },
  car_payment: (v) => {
    const price = parseFloat(v.price) || 0; const down = parseFloat(v.down) || 0; const rate = (parseFloat(v.rate) || 5) / 100 / 12; const term = parseFloat(v.term) || 60; const loan = price - down; const pmt = loan * rate * Math.pow(1 + rate, term) / (Math.pow(1 + rate, term) - 1); const total = pmt * term
    return <MultiResult items={[{ label: 'Monthly Payment', value: pmt || 0, unit: '$' }, { label: 'Loan Amount', value: loan, unit: '$' }, { label: 'Total Paid', value: total || 0, unit: '$' }]} />
  },
  car_cost: (v) => {
    const payment = parseFloat(v.payment) || 0; const insurance = parseFloat(v.insurance) || 0; const gas = parseFloat(v.gas) || 0; const maintenance = parseFloat(v.maintenance) || 0; const monthly = payment + insurance + gas + maintenance; const yearly = monthly * 12; const perKm = parseFloat(v.km) > 0 ? monthly / parseFloat(v.km) : 0
    return <MultiResult items={[{ label: 'Monthly Total', value: monthly, unit: '$' }, { label: 'Yearly Total', value: yearly, unit: '$' }, { label: 'Cost/km', value: perKm, unit: '$' }]} />
  },
  commute: (v) => {
    const dist = parseFloat(v.distance) || 0; const days = parseFloat(v.days) || 5; const mpg = parseFloat(v.mpg) || 25; const gasPrice = parseFloat(v.gasPrice) || 3.5; const dailyFuel = dist * 2 / mpg * gasPrice; const weekly = dailyFuel * days; const monthly = weekly * 4.33; const yearly = monthly * 12
    return <MultiResult items={[{ label: 'Daily Cost', value: dailyFuel, unit: '$' }, { label: 'Weekly', value: weekly, unit: '$' }, { label: 'Monthly', value: monthly, unit: '$' }, { label: 'Yearly', value: yearly, unit: '$' }]} />
  },
  tire: (v) => {
    const width = parseFloat(v.width) || 205; const aspect = parseFloat(v.aspect) || 55; const rim = parseFloat(v.rim) || 16; const sidewall = width * aspect / 100; const diameter = rim * 25.4 + sidewall * 2; const circ = diameter * Math.PI; const revPerKm = 1000000 / circ
    return <MultiResult items={[{ label: 'Sidewall', value: sidewall, unit: 'mm' }, { label: 'Diameter', value: diameter, unit: 'mm' }, { label: 'Rev/km', value: Math.round(revPerKm) }]} />
  },
  lottery: (v) => {
    const odds = parseFloat(v.odds) || 292200000; const ticket = parseFloat(v.ticket) || 2; const jackpot = parseFloat(v.jackpot) || 100000000; const ev = (jackpot / odds) - ticket; const roi = ((jackpot / odds) / ticket - 1) * 100
    return <MultiResult items={[{ label: 'Odds', value: `1:${odds.toLocaleString()}` }, { label: 'Expected Value', value: ev, unit: '$' }, { label: 'ROI', value: roi.toFixed(2), unit: '%' }]} />
  },
  battery: (v) => {
    const mah = parseFloat(v.mah) || 3000; const ma = parseFloat(v.ma) || 500; const hours = mah / ma; const voltage = parseFloat(v.voltage) || 3.7; const wh = mah / 1000 * voltage
    return <MultiResult items={[{ label: 'Battery Life', value: hours, unit: 'hrs' }, { label: 'Capacity', value: wh, unit: 'Wh' }, { label: 'Load Current', value: ma, unit: 'mA' }]} />
  },
  photo: (v) => {
    const widthPx = parseFloat(v.widthPx) || 3000; const heightPx = parseFloat(v.heightPx) || 2000; const dpi = parseFloat(v.dpi) || 300; const widthIn = widthPx / dpi; const heightIn = heightPx / dpi; const mp = widthPx * heightPx / 1000000
    return <MultiResult items={[{ label: 'Print Size', value: `${widthIn.toFixed(1)}×-${heightIn.toFixed(1)}`, unit: 'in' }, { label: 'Megapixels', value: mp.toFixed(1), unit: 'MP' }, { label: 'DPI', value: dpi }]} />
  },
  file: (v) => {
    const size = parseFloat(v.size) || 0; const speed = parseFloat(v.speed) || 50; const unit = v.unit || 'MB'; const sizeBits = unit === 'GB' ? size * 8000 : unit === 'MB' ? size * 8 : size * 0.008; const seconds = speed > 0 ? sizeBits / speed : 0; const mins = Math.floor(seconds / 60); const secs = Math.round(seconds % 60)
    return <MultiResult items={[{ label: 'File Size', value: `${size} ${unit}` }, { label: 'Transfer Speed', value: speed, unit: 'Mbps' }, { label: 'Transfer Time', value: `${mins}m ${secs}s` }]} />
  },
  color: (v) => {
    const hex = v.hex || '#1a3a8a'; const r = parseInt(hex.slice(1, 3), 16); const g = parseInt(hex.slice(3, 5), 16); const b = parseInt(hex.slice(5, 7), 16); const hslR = r / 255; const hslG = g / 255; const hslB = b / 255; const max = Math.max(hslR, hslG, hslB); const min = Math.min(hslR, hslG, hslB); const l = (max + min) / 2; const s = max === min ? 0 : l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min)
    return <MultiResult items={[{ label: 'Hex', value: hex }, { label: 'RGB', value: `rgb(${r},${g},${b})` }, { label: 'HSL', value: `hsl(${Math.round(s * 100)}%,${Math.round(l * 100)}%)` }]} />
  },
  prime: (v) => {
    const n = parseFloat(v.number) || 0; const isPrime = (num: number): boolean => { if (num < 2) return false; for (let i = 2; i <= Math.sqrt(num); i++) { if (num % i === 0) return false } return true }; const result = isPrime(n)
    return <SimpleResult label={`${n} is prime?`} value={result ? 'Yes' : 'No'} />
  },
  exercise: (v) => {
    const met = parseFloat(v.met) || 3.5; const weight = parseFloat(v.weight) || 70; const min = parseFloat(v.minutes) || 30; const calories = met * weight * 3.5 * min / 200; const act = v.activity || 'walking'
    return <MultiResult items={[{ label: 'Activity', value: act }, { label: 'Duration', value: min, unit: 'min' }, { label: 'Calories Burned', value: Math.round(calories), unit: 'kcal' }]} />
  },
  fastfood: (v) => {
    const meals = parseFloat(v.meals) || 0; const avgCal = parseFloat(v.avgCal) || 800; const avgCost = parseFloat(v.avgCost) || 10; const weeklyCal = meals * avgCal; const weeklyCost = meals * avgCost; const monthlyCost = weeklyCost * 4.33; const yearlyCost = monthlyCost * 12
    return <MultiResult items={[{ label: 'Calories/Week', value: weeklyCal, unit: 'kcal' }, { label: 'Weekly Cost', value: weeklyCost, unit: '$' }, { label: 'Monthly', value: monthlyCost, unit: '$' }, { label: 'Yearly', value: yearlyCost, unit: '$' }]} />
  },
  ev: (v) => {
    const battery = parseFloat(v.battery) || 60; const efficiency = parseFloat(v.efficiency) || 6; const range = battery * efficiency; const chargeKw = parseFloat(v.chargeKw) || 7; const chargeTime = battery / chargeKw; const costPerKm = (parseFloat(v.rate) || 0.12) / efficiency
    return <MultiResult items={[{ label: 'Range', value: range, unit: 'km' }, { label: 'Charge Time', value: chargeTime, unit: 'hrs' }, { label: 'Cost/km', value: costPerKm, unit: '$' }]} />
  },
  carbon: (v) => {
    const elec = parseFloat(v.electricity) || 0; const gas = parseFloat(v.gas) || 0; const car = parseFloat(v.carKm) || 0; const flights = parseFloat(v.flights) || 0; const elecCO2 = elec * 0.4; const gasCO2 = gas * 2.2; const carCO2 = car * 0.12; const flightCO2 = flights * 200; const total = elecCO2 + gasCO2 + carCO2 + flightCO2; const trees = Math.round(total / 21)
    return <MultiResult items={[{ label: 'Electricity', value: elecCO2, unit: 'kg CO2' }, { label: 'Gas', value: gasCO2, unit: 'kg CO2' }, { label: 'Car', value: carCO2, unit: 'kg CO2' }, { label: 'Flights', value: flightCO2, unit: 'kg CO2' }, { label: 'Total', value: total, unit: 'kg CO2' }, { label: 'Trees to Offset', value: trees }]} />
  },
  salary: (v) => {
    const annual = parseFloat(v.annual) || 0; const hourly = annual / 2080; const weekly = annual / 52; const monthly = annual / 12; const biweekly = annual / 26
    return <MultiResult items={[{ label: 'Hourly', value: hourly, unit: '$' }, { label: 'Weekly', value: weekly, unit: '$' }, { label: 'Biweekly', value: biweekly, unit: '$' }, { label: 'Monthly', value: monthly, unit: '$' }, { label: 'Annual', value: annual, unit: '$' }]} />
  },
  overtime: (v) => {
    const rate = parseFloat(v.rate) || 0; const regular = parseFloat(v.regular) || 40; const otHrs = parseFloat(v.overtime) || 0; const otRate = rate * 1.5; const regularPay = rate * regular; const otPay = otRate * otHrs; const total = regularPay + otPay
    return <MultiResult items={[{ label: 'Regular Pay', value: regularPay, unit: '$' }, { label: 'Overtime Pay', value: otPay, unit: '$' }, { label: 'Total Pay', value: total, unit: '$' }]} />
  },
  commission: (v) => {
    const sales = parseFloat(v.sales) || 0; const rate = parseFloat(v.rate) || 5; const base = parseFloat(v.base) || 0; const commission = sales * rate / 100; const total = base + commission
    return <MultiResult items={[{ label: 'Commission', value: commission, unit: '$' }, { label: 'Base Salary', value: base, unit: '$' }, { label: 'Total', value: total, unit: '$' }]} />
  },
  freelance: (v) => {
    const target = parseFloat(v.target) || 0; const billable = parseFloat(v.billable) || 1500; const expenses = parseFloat(v.expenses) || 0; const overhead = target * 0.3; const needed = target + overhead + expenses; const rate = needed / billable
    return <MultiResult items={[{ label: 'Revenue Needed', value: needed, unit: '$' }, { label: 'Target Income', value: target, unit: '$' }, { label: 'Hourly Rate', value: rate, unit: '$/hr' }]} />
  },
  splitting: (v) => {
    const total = parseFloat(v.total) || 0; const people = parseFloat(v.people) || 2; const perPerson = total / people; const tip = parseFloat(v.tipPercent) || 0; const withTip = total + total * tip / 100; const perWithTip = withTip / people
    return <MultiResult items={[{ label: 'Per Person', value: perPerson, unit: '$' }, { label: 'Total with Tip', value: withTip, unit: '$' }, { label: 'Each (with tip)', value: perWithTip, unit: '$' }]} />
  },
  utilities: (v) => {
    const elec = parseFloat(v.electricity) || 0; const water = parseFloat(v.water) || 0; const gas = parseFloat(v.gas) || 0; const internet = parseFloat(v.internet) || 0; const other = parseFloat(v.other) || 0; const total = elec + water + gas + internet + other
    return <MultiResult items={[{ label: 'Electricity', value: elec, unit: '$' }, { label: 'Water', value: water, unit: '$' }, { label: 'Gas', value: gas, unit: '$' }, { label: 'Internet', value: internet, unit: '$' }, { label: 'Total', value: total, unit: '$' }]} />
  },
  sleep: (v) => {
    const wakeRaw = v.wake || '07:00'; const wake = String(wakeRaw).includes(':') ? String(wakeRaw) : '07:00'; const [h, m] = wake.split(':').map(Number); const cycles = parseFloat(v.cycles) || 5; const cycleMin = cycles * 90; const bedMin = h * 60 + m - cycleMin; const bedH = ((bedMin % 1440) + 1440) % 1440; const bedHr = Math.floor(bedH / 60); const bedMin2 = Math.round(bedH % 60)
    return <MultiResult items={[{ label: 'Wake Time', value: wake }, { label: 'Bedtime', value: `${String(bedHr).padStart(2, '0')}:${String(bedMin2).padStart(2, '0')}` }, { label: 'Sleep Cycles', value: cycles }, { label: 'Total Sleep', value: cycleMin / 60, unit: 'hrs' }]} />
  },
  ergonomics: (v) => {
    const height = parseFloat(v.height) || 170; const desk = height * 0.45; const seat = height * 0.27; const monitor = height * 0.08; const monitorTop = height + monitor; const elbow = height * 0.15
    return <MultiResult items={[{ label: 'Desk Height', value: desk, unit: 'cm' }, { label: 'Seat Height', value: seat, unit: 'cm' }, { label: 'Monitor Top', value: monitorTop, unit: 'cm' }, { label: 'Elbow Height', value: elbow, unit: 'cm' }]} />
  },
  tv: (v) => {
    const dist = parseFloat(v.distance) || 3; const distCm = dist * 100; const idealSize = distCm / 2.5 / 2.54; const minSize = distCm / 3 / 2.54; const maxSize = distCm / 1.5 / 2.54; const aspect = v.aspect || '16:9'; const diag = idealSize; const w = diag * 0.87; const h_d = diag * 0.49
    return <MultiResult items={[{ label: 'Ideal Size', value: Math.round(idealSize), unit: 'in' }, { label: 'Range', value: `${Math.round(minSize)}-${Math.round(maxSize)}`, unit: 'in' }, { label: 'Width', value: Math.round(w), unit: 'cm' }, { label: 'Height', value: Math.round(h_d), unit: 'cm' }]} />
  },
  paint: (v) => {
    const w = parseFloat(v.width) || 0; const h = parseFloat(v.height) || 0; const coats = parseFloat(v.coats) || 2; const area = w * h; const litres = area * coats / 11; const gallons = litres / 3.785; const cans = Math.ceil(gallons)
    return <MultiResult items={[{ label: 'Wall Area', value: area, unit: 'm²' }, { label: 'Paint Needed', value: litres.toFixed(1), unit: 'L' }, { label: 'Cans (1 gal)', value: cans }]} />
  },
  wallpaper: (v) => {
    const w = parseFloat(v.width) || 0; const h = parseFloat(v.height) || 0; const rollW = 0.53; const rollH = 10; const strips = Math.floor(rollH / (h + 0.1)); const stripsNeeded = Math.ceil(w / rollW); const rolls = Math.ceil(stripsNeeded / strips)
    return <MultiResult items={[{ label: 'Wall Width', value: w, unit: 'm' }, { label: 'Wall Height', value: h, unit: 'm' }, { label: 'Rolls Needed', value: rolls }]} />
  },
  tile: (v) => {
    const area = parseFloat(v.area) || 0; const tileW = parseFloat(v.tileW) || 0.3; const tileH = parseFloat(v.tileH) || 0.3; const tileArea = tileW * tileH; const tiles = Math.ceil(area / tileArea); const waste = Math.ceil(tiles * 1.1); const boxes = Math.ceil(waste / (parseFloat(v.perBox) || 10))
    return <MultiResult items={[{ label: 'Tiles Needed', value: tiles }, { label: 'With Waste (10%)', value: waste }, { label: 'Boxes', value: boxes }]} />
  },
  flooring: (v) => {
    const area = parseFloat(v.area) || 0; const plankW = parseFloat(v.plankW) || 0.15; const plankL = parseFloat(v.plankL) || 1.2; const plankArea = plankW * plankL; const planks = Math.ceil(area / plankArea * 1.1); const packs = Math.ceil(planks / (parseFloat(v.perPack) || 8))
    return <MultiResult items={[{ label: 'Area', value: area, unit: 'm²' }, { label: 'Planks Needed', value: planks }, { label: 'Packs', value: packs }]} />
  },
  rug: (v) => {
    const roomW = parseFloat(v.roomW) || 0; const roomL = parseFloat(v.roomL) || 0; const rugW = roomW - 0.6; const rugL = roomL - 0.6; const area = rugW * rugL
    return <MultiResult items={[{ label: 'Recommended Size', value: `${rugW.toFixed(1)}×-${rugL.toFixed(1)}`, unit: 'm' }, { label: 'Area', value: area.toFixed(1), unit: 'm²' }]} />
  },
  curtain: (v) => {
    const w = parseFloat(v.width) || 0; const h = parseFloat(v.height) || 0; const fullness = parseFloat(v.fullness) || 2; const fabricW = w * fullness; const panels = Math.ceil(fabricW / 1.37); const drop = v.mount || 'floor'; const dropCm = drop === 'floor' ? h + 15 : h - 5
    return <MultiResult items={[{ label: 'Fabric Width', value: fabricW, unit: 'm' }, { label: 'Panels', value: panels }, { label: 'Drop Length', value: dropCm, unit: 'cm' }]} />
  },
  furniture: (v) => {
    const roomW = parseFloat(v.roomW) || 0; const roomL = parseFloat(v.roomL) || 0; const walkway = parseFloat(v.walkway) || 0.9; const usableW = roomW - walkway * 2; const usableL = roomL - walkway * 2; const area = usableW * usableL
    return <MultiResult items={[{ label: 'Room Dimensions', value: `${roomW}×-${roomL}`, unit: 'm' }, { label: 'Usable Area', value: area, unit: 'm²' }, { label: 'Walkway', value: walkway, unit: 'm' }]} />
  },
  stairs: (v) => {
    const rise = parseFloat(v.rise) || 0; const run = parseFloat(v.run) || 0; const totalRise = parseFloat(v.totalRise) || 0; const steps = Math.round(totalRise / rise); const treads = steps - 1; const totalRun = treads * run; const stringer = Math.sqrt(totalRise ** 2 + totalRun ** 2); const angle = Math.atan2(totalRise, totalRun) * 180 / Math.PI
    return <MultiResult items={[{ label: 'Number of Steps', value: steps }, { label: 'Total Run', value: totalRun, unit: 'cm' }, { label: 'Stringer Length', value: stringer.toFixed(1), unit: 'cm' }, { label: 'Angle', value: angle.toFixed(1), unit: '××' }]} />
  },
  deck: (v) => {
    const w = parseFloat(v.width) || 0; const l = parseFloat(v.length) || 0; const area = w * l; const boards = Math.ceil(area / (0.14 * l)) * 1.1; const posts = Math.ceil(w / 2.4 + 1) * 2; const screws = Math.ceil(boards * 12)
    return <MultiResult items={[{ label: 'Deck Area', value: area, unit: 'm²' }, { label: 'Boards Needed', value: Math.ceil(boards) }, { label: 'Posts', value: posts }, { label: 'Screws', value: screws }]} />
  },
  garden: (v) => {
    const area = parseFloat(v.area) || 0; const depth = parseFloat(v.depth) || 0.1; const volume = area * depth; const liters = volume * 1000; const bags = Math.ceil(liters / 50)
    return <MultiResult items={[{ label: 'Area', value: area, unit: 'm²' }, { label: 'Depth', value: depth, unit: 'm' }, { label: 'Volume Needed', value: volume, unit: 'm²' }, { label: 'Bags (50L)', value: bags }]} />
  },
  planting: (v) => {
    const area = parseFloat(v.area) || 0; const spacing = parseFloat(v.spacing) || 0.3; const plantsPerM2 = 1 / (spacing * spacing); const plants = Math.ceil(area * plantsPerM2)
    return <MultiResult items={[{ label: 'Area', value: area, unit: 'm²' }, { label: 'Spacing', value: spacing, unit: 'm' }, { label: 'Plants Needed', value: plants }]} />
  },
  crop: (v) => {
    const area = parseFloat(v.area) || 0; const yieldPerM2 = parseFloat(v.yieldPerM2) || 2.5; const total = area * yieldPerM2; const kg = total; const lbs = kg * 2.205
    return <MultiResult items={[{ label: 'Growing Area', value: area, unit: 'm²' }, { label: 'Expected Yield', value: kg, unit: 'kg' }, { label: 'Yield (lbs)', value: lbs.toFixed(1), unit: 'lb' }]} />
  },
  aquarium: (v) => {
    const l = parseFloat(v.length) || 0; const w = parseFloat(v.width) || 0; const h = parseFloat(v.height) || 0; const volL = l * w * h / 1000; const volGal = volL / 3.785; const heaterW = volL * 0.05 + 25; const lightW = volL * 0.3
    return <MultiResult items={[{ label: 'Volume', value: volL.toFixed(1), unit: 'L' }, { label: 'Volume (gal)', value: volGal.toFixed(1), unit: 'gal' }, { label: 'Heater', value: Math.round(heaterW), unit: 'W' }, { label: 'Lighting', value: Math.round(lightW), unit: 'W' }]} />
  },
  storage: (v) => {
    const size = parseFloat(v.size) || 0; const rate = parseFloat(v.rate) || 100; const months = parseFloat(v.months) || 1; const monthly = size * rate; const total = monthly * months
    return <MultiResult items={[{ label: 'Monthly Cost', value: monthly, unit: '$' }, { label: 'Total Cost', value: total, unit: '$' }, { label: 'Duration', value: months, unit: 'mo' }]} />
  },
  delivery: (v) => {
    const dist = parseFloat(v.distance) || 0; const base = parseFloat(v.base) || 5; const perKm = parseFloat(v.perKm) || 1.5; const tip = parseFloat(v.tip) || 0; const total = base + dist * perKm + tip
    return <MultiResult items={[{ label: 'Delivery Fee', value: total, unit: '$' }, { label: 'Distance', value: dist, unit: 'km' }, { label: 'Tip', value: tip, unit: '$' }]} />
  },
  catering: (v) => {
    const guests = parseFloat(v.guests) || 0; const perPerson = parseFloat(v.perPerson) || 25; const staff = Math.ceil(guests / 20); const food = guests * perPerson; const labor = staff * 200; const total = food + labor
    return <MultiResult items={[{ label: 'Food Cost', value: food, unit: '$' }, { label: 'Staff Needed', value: staff }, { label: 'Labor', value: labor, unit: '$' }, { label: 'Total', value: total, unit: '$' }]} />
  },
  meal: (v) => {
    const meals = parseFloat(v.meals) || 0; const cost = parseFloat(v.cost) || 0; const prepTime = parseFloat(v.prepTime) || 30; const costPer = meals > 0 ? cost / meals : 0; const timePer = meals > 0 ? prepTime / meals : 0
    return <MultiResult items={[{ label: 'Total Meals', value: meals }, { label: 'Cost Per Meal', value: costPer, unit: '$' }, { label: 'Time Per Meal', value: timePer, unit: 'min' }]} />
  },
  pet_cost: (v) => {
    const food = parseFloat(v.food) || 0; const vet = parseFloat(v.vet) || 0; const supplies = parseFloat(v.supplies) || 0; const other = parseFloat(v.other) || 0; const monthly = food + vet / 12 + supplies + other; const yearly = monthly * 12
    return <MultiResult items={[{ label: 'Monthly Cost', value: monthly, unit: '$' }, { label: 'Yearly Cost', value: yearly, unit: '$' }, { label: 'Annual Vet', value: vet, unit: '$' }]} />
  },
  childcare: (v) => {
    const days = parseFloat(v.days) || 5; const dailyRate = parseFloat(v.dailyRate) || 50; const registration = parseFloat(v.registration) || 100; const monthly = days * 4.33 * dailyRate + registration / 12; const yearly = monthly * 12
    return <MultiResult items={[{ label: 'Monthly Cost', value: monthly, unit: '$' }, { label: 'Daily Rate', value: dailyRate, unit: '$' }, { label: 'Yearly Cost', value: yearly, unit: '$' }]} />
  },
  'gpa-calc': (v) => {
    const gp: Record<string, number> = { 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0, 'A+': 4.0, 'A-': 3.7, 'B+': 3.3, 'B-': 2.7, 'C+': 2.3, 'C-': 1.7, 'D+': 1.3, 'D-': 0.7 }
    const gpas = (v.grades || '').split(',').map((g: string) => g.trim().toUpperCase()); const nums = gpas.map((g: string) => gp[g] !== undefined ? gp[g] : parseFloat(g)).filter((x: number) => !isNaN(x)); const gpa = nums.length > 0 ? nums.reduce((a: number, b: number) => a + b, 0) / nums.length : 0
    return <MultiResult items={[{ label: 'GPA', value: gpa.toFixed(2) }, { label: 'Courses', value: nums.length }]} />
  },
  'grade-calc': (v) => {
    const gp: Record<string, number> = { 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0, 'A+': 4.0, 'A-': 3.7, 'B+': 3.3, 'B-': 2.7, 'C+': 2.3, 'C-': 1.7, 'D+': 1.3, 'D-': 0.7 }
    const gpas = (v.grades || '').split(',').map((g: string) => g.trim().toUpperCase()); const nums = gpas.map((g: string) => gp[g] !== undefined ? gp[g] : parseFloat(g)).filter((x: number) => !isNaN(x)); const gpa = nums.length > 0 ? nums.reduce((a: number, b: number) => a + b, 0) / nums.length : 0
    const letter = gpa >= 3.7 ? 'A' : gpa >= 2.7 ? 'B' : gpa >= 1.7 ? 'C' : gpa >= 0.7 ? 'D' : 'F'
    return <MultiResult items={[{ label: 'GPA', value: gpa.toFixed(2) }, { label: 'Letter Grade', value: letter }, { label: 'Courses', value: nums.length }]} />
  },
  'random-number': (v) => {
    const min = parseFloat(v.min) || 1; const max = parseFloat(v.max) || 100; const num = min + Math.floor(Math.random() * (max - min + 1))
    return <SimpleResult label="Random Number" value={num} />
  },
  'coin-flip': (v) => {
    const trials = parseFloat(v.trials) || 1; const heads = Array.from({length: trials}, () => Math.random() < 0.5 ? 1 : 0).reduce((a: number, b: number) => a + b, 0); const tails = trials - heads
    return <MultiResult items={[{ label: 'Heads', value: heads }, { label: 'Tails', value: tails }, { label: 'Total', value: trials }]} />
  },
  'dice-roller': (v) => {
    const dice = parseFloat(v.dice) || 1; const sides = parseFloat(v.sides) || 6; const rolls = Array.from({length: dice}, () => Math.floor(Math.random() * sides) + 1); const total = rolls.reduce((a: number, b: number) => a + b, 0)
    return <MultiResult items={[{ label: 'Rolls', value: rolls.join(', ') }, { label: 'Total', value: total }, { label: 'Dice', value: dice }]} />
  },
  'decision-maker': (_v) => {
    const opts = ['Yes', 'No', 'Maybe', 'Ask again', 'Definitely', "Don't count on it"]; const result = opts[Math.floor(Math.random() * opts.length)]
    return <SimpleResult label="Decision" value={result} />
  },
  'name-generator': (_v) => {
    const names = ['Liam', 'Emma', 'Noah', 'Olivia', 'James', 'Ava', 'Oliver', 'Sophia', 'Elijah', 'Mia', 'Mateo', 'Luna', 'Lucas', 'Harper', 'Levi', 'Ella', 'Asher', 'Amelia', 'Ethan', 'Charlotte']; const name = names[Math.floor(Math.random() * names.length)]
    return <SimpleResult label="Random Name" value={name} />
  },
  'password-gen': (v) => {
    const length = parseFloat(v.length) || 16; const upper = v.upper === 'yes'; const digits = v.digits === 'yes'; const symbols = v.symbols === 'yes'
    let chars = 'abcdefghijklmnopqrstuvwxyz'; if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; if (digits) chars += '0123456789'; if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'
    let pwd = ''; for (let i = 0; i < length; i++) pwd += chars[Math.floor(Math.random() * chars.length)]
    return <MultiResult items={[{ label: 'Password', value: pwd }, { label: 'Length', value: length, unit: 'chars' }]} />
  },
  'password-check': (v) => {
    const pwd = v.password || ''; const len = pwd.length; const hasUpper = /[A-Z]/.test(pwd); const hasDigit = /[0-9]/.test(pwd); const hasSymbol = /[^a-zA-Z0-9]/.test(pwd); const score = Math.min(100, (hasUpper ? 25 : 0) + (hasDigit ? 25 : 0) + (hasSymbol ? 25 : 0) + Math.min(25, len * 2))
    return <MultiResult items={[{ label: 'Length', value: len }, { label: 'Score', value: `${score}/100` }, { label: 'Upper', value: hasUpper ? 'Yes' : 'No' }, { label: 'Digits', value: hasDigit ? 'Yes' : 'No' }, { label: 'Symbols', value: hasSymbol ? 'Yes' : 'No' }]} />
  },
  'run-pace': (v) => {
    const dist = parseFloat(v.distance) || 0; const hours = parseFloat(v.hours) || 0; const mins = parseFloat(v.mins) || 0; const totalHrs = hours + mins / 60; const pace = dist > 0 ? totalHrs / dist : 0; const speed = totalHrs > 0 ? dist / totalHrs : 0
    return <MultiResult items={[{ label: 'Distance', value: dist, unit: 'km' }, { label: 'Pace', value: pace, unit: 'hr/km' }, { label: 'Speed', value: speed, unit: 'km/h' }]} />
  },
  'swim-pace': (v) => {
    const dist = parseFloat(v.distance) || 0; const hours = parseFloat(v.hours) || 0; const mins = parseFloat(v.mins) || 0; const totalHrs = hours + mins / 60; const pace = dist > 0 ? totalHrs / dist : 0; const speed = totalHrs > 0 ? dist / totalHrs : 0
    return <MultiResult items={[{ label: 'Distance', value: dist, unit: 'm' }, { label: 'Pace/100m', value: pace, unit: 'min' }, { label: 'Speed', value: speed, unit: 'km/h' }]} />
  },
  'bike-pace': (v) => {
    const dist = parseFloat(v.distance) || 0; const hours = parseFloat(v.hours) || 0; const mins = parseFloat(v.mins) || 0; const totalHrs = hours + mins / 60; const speed = totalHrs > 0 ? dist / totalHrs : 0; const pace = dist > 0 ? totalHrs / dist : 0
    return <MultiResult items={[{ label: 'Distance', value: dist, unit: 'km' }, { label: 'Avg Speed', value: speed, unit: 'km/h' }, { label: 'Pace', value: pace, unit: 'hr/km' }]} />
  },
  'tri-pace': (v) => {
    const swim = parseFloat(v.swim) || 1.5; const bike = parseFloat(v.bike) || 40; const run = parseFloat(v.run) || 10; const totalDist = swim + bike + run
    const swimHrs = parseFloat(v.swimHrs) || 0; const swimMin = parseFloat(v.swimMin) || 30; const bikeHrs = parseFloat(v.bikeHrs) || 1; const bikeMin = parseFloat(v.bikeMin) || 15; const runHrs = parseFloat(v.runHrs) || 0; const runMin = parseFloat(v.runMin) || 45; const totalHrs = swimHrs + swimMin/60 + bikeHrs + bikeMin/60 + runHrs + runMin/60
    return <MultiResult items={[{ label: 'Total Distance', value: totalDist, unit: 'km' }, { label: 'Total Time', value: totalHrs, unit: 'hrs' }, { label: 'Overall Pace', value: totalDist > 0 ? totalHrs / totalDist : 0, unit: 'hr/km' }]} />
  },
  'step-counter': (v) => {
    const steps = parseFloat(v.steps) || 0; const stride = parseFloat(v.stride) || 0.76; const distM = steps * stride; const distKm = distM / 1000; const cal = steps * 0.04
    return <MultiResult items={[{ label: 'Steps', value: steps }, { label: 'Distance', value: distKm, unit: 'km' }, { label: 'Calories', value: cal, unit: 'kcal' }]} />
  },
  'steps-miles': (v) => {
    const steps = parseFloat(v.steps) || 0; const stride = parseFloat(v.stride) || 0.76; const distM = steps * stride; const distMi = distM / 1609
    return <SimpleResult label="Distance" value={distMi} unit="mi" />
  },
  'steps-km': (v) => {
    const steps = parseFloat(v.steps) || 0; const stride = parseFloat(v.stride) || 0.76; const distM = steps * stride; const distKm = distM / 1000
    return <SimpleResult label="Distance" value={distKm} unit="km" />
  },
  'smoking-cost': (v) => {
    const perDay = parseFloat(v.perDay) || 10; const packs = parseFloat(v.packs) || 1; const daily = perDay * packs; const weekly = daily * 7; const monthly = daily * 30; const yearly = daily * 365
    return <MultiResult items={[{ label: 'Daily', value: daily, unit: '$' }, { label: 'Weekly', value: weekly, unit: '$' }, { label: 'Monthly', value: monthly, unit: '$' }, { label: 'Yearly', value: yearly, unit: '$' }]} />
  },
  'coffee-cost': (v) => {
    const perDay = parseFloat(v.perDay) || 5; const cups = parseFloat(v.cups) || 1; const daily = perDay * cups; const weekly = daily * 7; const monthly = daily * 30; const yearly = daily * 365
    return <MultiResult items={[{ label: 'Daily', value: daily, unit: '$' }, { label: 'Weekly', value: weekly, unit: '$' }, { label: 'Monthly', value: monthly, unit: '$' }, { label: 'Yearly', value: yearly, unit: '$' }]} />
  },
  'daily-affirm': (_v) => {
    const affs = ['You are capable of amazing things.', 'Today is full of possibilities.', 'You have the power to make a difference.', 'Believe in yourself.', 'Every day is a fresh start.', 'Your potential is limitless.', 'You are stronger than you think.', 'Small steps lead to big results.']; const af = affs[Math.floor(Math.random() * affs.length)]
    return <SimpleResult label="Daily Affirmation" value={af} />
  },
  gratitude: (_v) => {
    const prompts = ['What made you smile today?', 'Who are you grateful for?', 'What went well this week?', 'What simple pleasure did you enjoy?', 'What strength did you show today?']; const p = prompts[Math.floor(Math.random() * prompts.length)]
    return <SimpleResult label="Gratitude Prompt" value={p} />
  },
  'habit-track': (v) => {
    const days = parseFloat(v.days) || 21; const habit = v.habit || 'Exercise'; const progress = Math.min(100, (parseFloat(v.done) || 0) / days * 100); const remaining = days - (parseFloat(v.done) || 0)
    return <MultiResult items={[{ label: 'Habit', value: habit }, { label: 'Goal', value: days, unit: 'days' }, { label: 'Progress', value: progress.toFixed(0), unit: '%' }, { label: 'Remaining', value: Math.max(0, remaining) }]} />
  },
  'mood-track': (v) => {
    const rating = parseFloat(v.rating) || 5; const pct = (rating / 10) * 100; const level = rating >= 7 ? 'Positive' : rating >= 4 ? 'Neutral' : 'Negative'
    return <MultiResult items={[{ label: 'Score', value: `${rating}/10` }, { label: 'Level', value: level }, { label: 'Index', value: pct, unit: '%' }]} />
  },
  'pet-food': (v) => {
    const weight = parseFloat(v.weight) || 10; const type = v.type || 'dog'; const multi = type === 'dog' ? 0.025 : 0.02; const dailyG = weight * multi * 1000; const dailyCups = dailyG / 250
    return <MultiResult items={[{ label: 'Portion', value: dailyG, unit: 'g/day' }, { label: 'Cups/Day', value: dailyCups.toFixed(1) }, { label: 'Monthly', value: (dailyG * 30 / 1000).toFixed(1), unit: 'kg' }]} />
  },
  'cat-tree': (v) => {
    const cats = parseFloat(v.cats) || 1; const height = Math.max(60, cats * 45); const platforms = Math.ceil(cats * 2.5)
    return <MultiResult items={[{ label: 'Cats', value: cats }, { label: 'Height', value: height, unit: 'cm' }, { label: 'Platforms', value: platforms }]} />
  },
  'dog-train': (v) => {
    const age = parseFloat(v.age) || 1; const sessions = Math.max(1, 8 - Math.min(7, Math.floor(age))); const minPer = Math.max(5, 20 - age * 2)
    return <MultiResult items={[{ label: 'Sessions/Week', value: sessions }, { label: 'Min/Session', value: minPer }, { label: 'Focus', value: age < 1 ? 'Basic commands' : age < 3 ? 'Obedience' : 'Maintenance' }]} />
  },
  'dog-walk': (v) => {
    const weight = parseFloat(v.weight) || 20; const minDaily = Math.ceil(weight * 1.5); const kmDaily = minDaily * 0.08; const cal = weight * 0.8 * minDaily / 60
    return <MultiResult items={[{ label: 'Duration', value: minDaily, unit: 'min/day' }, { label: 'Distance', value: kmDaily.toFixed(1), unit: 'km' }, { label: 'Calories', value: cal.toFixed(0), unit: 'kcal' }]} />
  },
  'pet-chip': (v) => {
    const weight = parseFloat(v.weight) || 10; const type = v.type || 'dog'; const chipSize = type === 'dog' ? '12mm' : '8mm'; const implant = weight >= 2 ? 'Safe' : 'Consult vet'
    return <MultiResult items={[{ label: 'Type', value: type }, { label: 'Chip Size', value: chipSize }, { label: 'Readiness', value: implant }]} />
  },
  'pet-vax': (v) => {
    const age = parseFloat(v.age) || 0; const core = age < 1 ? 'DHPP now+3wk+3wk+1yr' : age < 7 ? 'DHPP 1yr booster' : 'DHPP 1-3yr'; const rabies = age >= 0.25 ? 'Rabies 1yr then 3yr' : 'Defer until 12wk'
    return <MultiResult items={[{ label: 'Age', value: age, unit: 'yrs' }, { label: 'Core', value: core }, { label: 'Rabies', value: rabies }]} />
  },
  'pet-age': (v) => {
    const years = parseFloat(v.years) || 0; const type = v.type || 'dog'; const human = type === 'dog' ? 16 * Math.log(years + 1) + 31 : 15 * Math.log(years + 1) + 20
    return <SimpleResult label={`Human Years (${type})`} value={human.toFixed(1)} />
  },
  'dog-years': (v) => {
    const years = parseFloat(v.years) || 0; const human = 16 * Math.log(years + 1) + 31
    return <SimpleResult label="Dog to Human Years" value={human.toFixed(1)} />
  },
  'cat-years': (v) => {
    const years = parseFloat(v.years) || 0; const human = 15 * Math.log(years + 1) + 20
    return <SimpleResult label="Cat to Human Years" value={human.toFixed(1)} />
  },
  'human-dog-years': (v) => {
    const human = parseFloat(v.human) || 30; const dog = Math.exp((human - 31) / 16) - 1
    return <SimpleResult label="Human Age in Dog Years" value={dog.toFixed(1)} />
  },
  'party-planner': (v) => {
    const guests = parseFloat(v.guests) || 0; const hours = parseFloat(v.hours) || 2; const drinks = guests * hours * 1.5; const food = guests * 6; const ice = Math.ceil(guests / 10)
    return <MultiResult items={[{ label: 'Guests', value: guests }, { label: 'Drinks', value: Math.ceil(drinks) }, { label: 'Food', value: Math.ceil(food) }, { label: 'Ice Bags', value: ice }]} />
  },
  'event-budget': (v) => {
    const guests = parseFloat(v.guests) || 0; const budget = parseFloat(v.budget) || 1000; const perPerson = guests > 0 ? budget / guests : 0; const venue = budget * 0.4; const food = budget * 0.35; const decor = budget * 0.15; const misc = budget * 0.1
    return <MultiResult items={[{ label: 'Total Budget', value: budget, unit: '$' }, { label: 'Per Person', value: perPerson, unit: '$' }, { label: 'Venue', value: venue, unit: '$' }, { label: 'Food', value: food, unit: '$' }]} />
  },
  'moving-cost': (v) => {
    const dist = parseFloat(v.distance) || 0; const items = parseFloat(v.items) || 50; const rooms = parseFloat(v.rooms) || 1; const labor = rooms * 200; const transport = dist * 2.5; const supplies = items * 3; const total = labor + transport + supplies
    return <MultiResult items={[{ label: 'Labor', value: labor, unit: '$' }, { label: 'Transport', value: transport, unit: '$' }, { label: 'Supplies', value: supplies, unit: '$' }, { label: 'Total', value: total, unit: '$' }]} />
  },
  'apt-search': (v) => {
    const income = parseFloat(v.income) || 5000; const budget = income * 0.3; const deposit = budget * 2; const fees = parseFloat(v.fees) || 100; const totalMove = deposit + fees
    return <MultiResult items={[{ label: 'Monthly Budget', value: budget, unit: '$' }, { label: 'Deposit', value: deposit, unit: '$' }, { label: 'Total Move-In', value: totalMove, unit: '$' }]} />
  },
  'closing-cost': (v) => {
    const price = parseFloat(v.price) || 300000; const rate = parseFloat(v.rate) || 3; const closing = price * rate / 100; const escrow = price * 0.01; const total = closing + escrow
    return <MultiResult items={[{ label: 'Home Price', value: price, unit: '$' }, { label: 'Closing Costs', value: closing, unit: '$' }, { label: 'Escrow', value: escrow, unit: '$' }, { label: 'Total Due', value: total, unit: '$' }]} />
  },
  'home-buy': (v) => {
    const price = parseFloat(v.price) || 300000; const downPct = parseFloat(v.downPct) || 20; const down = price * downPct / 100; const loan = price - down; const rate = (parseFloat(v.rate) || 6.5) / 100 / 12; const term = parseFloat(v.term) || 360; const pmt = loan * rate * Math.pow(1 + rate, term) / (Math.pow(1 + rate, term) - 1)
    return <MultiResult items={[{ label: 'Down Payment', value: down, unit: '$' }, { label: 'Loan', value: loan, unit: '$' }, { label: 'Monthly', value: pmt || 0, unit: '$' }]} />
  },
  'mortgage-ok': (v) => {
    const income = parseFloat(v.income) || 8000; const debts = parseFloat(v.debts) || 500; const maxMonth = income * 0.28; const maxTotal = income * 0.36; const avail = maxTotal - debts
    return <MultiResult items={[{ label: 'Max Monthly', value: maxMonth, unit: '$' }, { label: 'Max Total Debt', value: maxTotal, unit: '$' }, { label: 'Available', value: avail, unit: '$' }]} />
  },
  'moving-list': (v) => {
    const days = parseFloat(v.days) || 30; const tasks = days >= 30 ? 'Change address, Hire movers, Pack boxes, Notify utilities, Clean' : days >= 14 ? 'Pack essentials, Confirm movers, Transfer utilities' : days >= 7 ? 'Final packing, Clean fridge, Defrost freezer, Documents' : 'Overnight bag, Confirm time, Clean, Walkthrough'
    return <SimpleResult label={`${days}-Day Checklist`} value={tasks} />
  },
  'rent-ok': (v) => {
    const income = parseFloat(v.income) || 5000; const rent = parseFloat(v.rent) || 1500; const ratio = income > 0 ? rent / income * 100 : 0; const verdict = ratio <= 30 ? 'Affordable' : ratio <= 50 ? 'Stretch' : 'Too expensive'
    return <MultiResult items={[{ label: 'Rent', value: rent, unit: '$' }, { label: 'Income', value: income, unit: '$' }, { label: 'Ratio', value: ratio.toFixed(1), unit: '%' }, { label: 'Verdict', value: verdict }]} />
  },
  'elec-bill': (v) => {
    const watts = parseFloat(v.watts) || 100; const hours = parseFloat(v.hours) || 8; const rate = parseFloat(v.rate) || 0.12; const kwh = watts * hours / 1000; const cost = kwh * rate; const monthly = cost * 30
    return <MultiResult items={[{ label: 'Energy', value: kwh, unit: 'kWh/day' }, { label: 'Daily Cost', value: cost, unit: '$' }, { label: 'Monthly', value: monthly, unit: '$' }]} />
  },
  'appliance-cost': (v) => {
    const watts = parseFloat(v.watts) || 1500; const hours = parseFloat(v.hours) || 1; const rate = parseFloat(v.rate) || 0.12; const kwh = watts * hours / 1000; const cost = kwh * rate; const yearly = cost * 365
    return <MultiResult items={[{ label: 'Energy', value: kwh, unit: 'kWh/use' }, { label: 'Cost/Use', value: cost, unit: '$' }, { label: 'Yearly', value: yearly, unit: '$' }]} />
  },
  'appliance-energy': (v) => {
    const watts = parseFloat(v.watts) || 100; const hours = parseFloat(v.hours) || 24; const kwh = watts * hours / 1000; const monthly = kwh * 30
    return <MultiResult items={[{ label: 'Power', value: watts, unit: 'W' }, { label: 'Daily', value: kwh, unit: 'kWh' }, { label: 'Monthly', value: monthly, unit: 'kWh' }]} />
  },
  'energy-bill': (v) => {
    const kwh = parseFloat(v.kwh) || 500; const rate = parseFloat(v.rate) || 0.12; const base = parseFloat(v.base) || 10; const total = base + kwh * rate; const avg = kwh > 0 ? total / kwh : 0
    return <MultiResult items={[{ label: 'Usage', value: kwh, unit: 'kWh' }, { label: 'Bill', value: total, unit: '$' }, { label: 'Avg Rate', value: avg, unit: '$/kWh' }]} />
  },
  'bulb-save': (v) => {
    const oldW = parseFloat(v.oldW) || 60; const newW = parseFloat(v.newW) || 10; const hours = parseFloat(v.hours) || 5; const count = parseFloat(v.count) || 10; const rate = parseFloat(v.rate) || 0.12; const savings = (oldW - newW) * hours * count * 365 / 1000 * rate
    return <MultiResult items={[{ label: 'Old Wattage', value: oldW, unit: 'W' }, { label: 'New Wattage', value: newW, unit: 'W' }, { label: 'Yearly Savings', value: savings, unit: '$' }]} />
  },
  'thermostat-save': (v) => {
    const bill = parseFloat(v.bill) || 200; const savings = bill * 0.1; const yearly = savings * 12; const smartCost = parseFloat(v.smartCost) || 200; const payback = savings > 0 ? smartCost / savings : 0
    return <MultiResult items={[{ label: 'Monthly Bill', value: bill, unit: '$' }, { label: 'Monthly Savings', value: savings, unit: '$' }, { label: 'Yearly', value: yearly, unit: '$' }, { label: 'Payback', value: payback.toFixed(1), unit: 'mo' }]} />
  },
  'grocery-budget': (v) => {
    const people = parseFloat(v.people) || 1; const perPerson = parseFloat(v.perPerson) || 100; const weekly = people * perPerson; const monthly = weekly * 4.33; const yearly = monthly * 12
    return <MultiResult items={[{ label: 'Weekly', value: weekly, unit: '$' }, { label: 'Monthly', value: monthly, unit: '$' }, { label: 'Yearly', value: yearly, unit: '$' }]} />
  },
  'best-buy': (v) => {
    const priceA = parseFloat(v.priceA) || 0; const qtyA = parseFloat(v.qtyA) || 1; const priceB = parseFloat(v.priceB) || 0; const qtyB = parseFloat(v.qtyB) || 1; const unitA = qtyA > 0 ? priceA / qtyA : 0; const unitB = qtyB > 0 ? priceB / qtyB : 0; const better = unitA <= unitB ? 'Option A' : 'Option B'
    return <MultiResult items={[{ label: 'Unit Price A', value: unitA, unit: '$' }, { label: 'Unit Price B', value: unitB, unit: '$' }, { label: 'Best', value: better }]} />
  },
  'bundle-save': (v) => {
    const single = parseFloat(v.single) || 10; const bundle = parseFloat(v.bundle) || 25; const singleTotal = single * 3; const savings = singleTotal - bundle; const pct = singleTotal > 0 ? savings / singleTotal * 100 : 0
    return <MultiResult items={[{ label: 'Separate', value: singleTotal, unit: '$' }, { label: 'Bundle', value: bundle, unit: '$' }, { label: 'Savings', value: savings, unit: '$' }, { label: 'Save %', value: pct, unit: '%' }]} />
  },
  bogo: (v) => {
    const price = parseFloat(v.price) || 5; const qty = parseFloat(v.qty) || 2; const effective = qty > 0 ? price / qty : 0; const savings = price - effective
    return <MultiResult items={[{ label: 'Price', value: price, unit: '$' }, { label: 'Items', value: qty }, { label: 'Effective', value: effective, unit: '$' }, { label: 'You Save', value: savings, unit: '$' }]} />
  },
  'cost-use': (v) => {
    const price = parseFloat(v.price) || 20; const uses = parseFloat(v.uses) || 10; const costPer = uses > 0 ? price / uses : 0
    return <MultiResult items={[{ label: 'Price', value: price, unit: '$' }, { label: 'Uses', value: uses }, { label: 'Cost/Use', value: costPer, unit: '$' }]} />
  },
  coupon: (v) => {
    const total = parseFloat(v.total) || 50; const discount = parseFloat(v.discount) || 10; const saved = total * discount / 100; const finalPrice = total - saved
    return <MultiResult items={[{ label: 'Original', value: total, unit: '$' }, { label: 'Discount', value: discount, unit: '%' }, { label: 'You Save', value: saved, unit: '$' }, { label: 'Final', value: finalPrice, unit: '$' }]} />
  },
  'price-comp': (v) => {
    const priceA = parseFloat(v.priceA) || 0; const priceB = parseFloat(v.priceB) || 0; const diff = Math.abs(priceA - priceB); const cheaper = priceA <= priceB ? 'Store A' : 'Store B'
    return <MultiResult items={[{ label: 'Store A', value: priceA, unit: '$' }, { label: 'Store B', value: priceB, unit: '$' }, { label: 'Difference', value: diff, unit: '$' }, { label: 'Cheaper', value: cheaper }]} />
  },
  'price-oz': (v) => {
    const price = parseFloat(v.price) || 3.99; const oz = parseFloat(v.oz) || 16; const perOz = oz > 0 ? price / oz : 0
    return <SimpleResult label="$ per Ounce" value={perOz} unit="$" />
  },
  'price-lb': (v) => {
    const price = parseFloat(v.price) || 5.99; const lb = parseFloat(v.lb) || 1; const perLb = lb > 0 ? price / lb : 0
    return <SimpleResult label="$ per Pound" value={perLb} unit="$" />
  },
  'unit-price': (v) => {
    const price = parseFloat(v.price) || 0; const units = parseFloat(v.units) || 1; const perUnit = units > 0 ? price / units : 0
    return <MultiResult items={[{ label: 'Total', value: price, unit: '$' }, { label: 'Units', value: units }, { label: 'Per Unit', value: perUnit, unit: '$' }]} />
  },
  'commute-fuel': (v) => {
    const dist = parseFloat(v.distance) || 0; const days = parseFloat(v.days) || 5; const mpg = parseFloat(v.mpg) || 25; const gasPrice = parseFloat(v.gasPrice) || 3.5; const dailyFuel = dist * 2 / mpg * gasPrice; const weekly = dailyFuel * days; const monthly = weekly * 4.33; const yearly = monthly * 12
    return <MultiResult items={[{ label: 'Daily', value: dailyFuel, unit: '$' }, { label: 'Weekly', value: weekly, unit: '$' }, { label: 'Monthly', value: monthly, unit: '$' }, { label: 'Yearly', value: yearly, unit: '$' }]} />
  },
  parking: (v) => {
    const daily = parseFloat(v.daily) || 15; const days = parseFloat(v.days) || 5; const weekly = daily * days; const monthly = weekly * 4.33; const yearly = monthly * 12
    return <MultiResult items={[{ label: 'Daily', value: daily, unit: '$' }, { label: 'Weekly', value: weekly, unit: '$' }, { label: 'Monthly', value: monthly, unit: '$' }, { label: 'Yearly', value: yearly, unit: '$' }]} />
  },
  'rental-car': (v) => {
    const daily = parseFloat(v.daily) || 50; const days = parseFloat(v.days) || 3; const insurance = parseFloat(v.insurance) || 15; const total = (daily + insurance) * days; const deposit = parseFloat(v.deposit) || 200; const grand = total + deposit
    return <MultiResult items={[{ label: 'Base', value: total, unit: '$' }, { label: 'Insurance', value: insurance * days, unit: '$' }, { label: 'Deposit', value: deposit, unit: '$' }, { label: 'Total', value: grand, unit: '$' }]} />
  },
  'taxi-fare': (v) => {
    const dist = parseFloat(v.distance) || 5; const base = parseFloat(v.base) || 3.5; const perKm = parseFloat(v.perKm) || 2; const tip = parseFloat(v.tip) || 0; const total = base + dist * perKm + tip
    return <MultiResult items={[{ label: 'Distance', value: dist, unit: 'km' }, { label: 'Fare', value: total, unit: '$' }, { label: 'Tip', value: tip, unit: '$' }]} />
  },
  toll: (v) => {
    const tolls = parseFloat(v.tolls) || 5; const days = parseFloat(v.days) || 5; const weekly = tolls * days; const monthly = weekly * 4.33; const yearly = monthly * 12
    return <MultiResult items={[{ label: 'Daily', value: tolls, unit: '$' }, { label: 'Weekly', value: weekly, unit: '$' }, { label: 'Monthly', value: monthly, unit: '$' }, { label: 'Yearly', value: yearly, unit: '$' }]} />
  },
  'soil-calc': (v) => {
    const area = parseFloat(v.area) || 0; const depth = parseFloat(v.depth) || 0.1; const volume = area * depth; const liters = volume * 1000; const bags = Math.ceil(liters / 50)
    return <MultiResult items={[{ label: 'Area', value: area, unit: 'm²' }, { label: 'Depth', value: depth, unit: 'm' }, { label: 'Volume', value: volume, unit: 'm²' }, { label: 'Bags (50L)', value: bags }]} />
  },
  mulch: (v) => {
    const area = parseFloat(v.area) || 0; const depth = parseFloat(v.depth) || 0.075; const volume = area * depth; const bags = Math.ceil(volume * 1000 / 50)
    return <MultiResult items={[{ label: 'Area', value: area, unit: 'm²' }, { label: 'Depth', value: depth, unit: 'm' }, { label: 'Volume', value: volume, unit: 'm²' }, { label: 'Bags', value: bags }]} />
  },
  compost: (v) => {
    const area = parseFloat(v.area) || 0; const depth = parseFloat(v.depth) || 0.05; const volume = area * depth; const bags = Math.ceil(volume * 1000 / 30)
    return <MultiResult items={[{ label: 'Area', value: area, unit: 'm²' }, { label: 'Depth', value: depth, unit: 'm' }, { label: 'Compost', value: volume, unit: 'm²' }, { label: 'Bags (30L)', value: bags }]} />
  },
  'cold-frame': (v) => {
    const w = parseFloat(v.width) || 1; const l = parseFloat(v.length) || 2; const area = w * l; const plants = Math.floor(area * 12)
    return <MultiResult items={[{ label: 'Size', value: `${w}×-${l}`, unit: 'm' }, { label: 'Area', value: area, unit: 'm²' }, { label: 'Plants', value: plants }]} />
  },
  container: (v) => {
    const pots = parseFloat(v.pots) || 5; const size = v.size || 'medium'; const liter = size === 'large' ? 15 : size === 'medium' ? 8 : 3; const soil = pots * liter; const bags = Math.ceil(soil / 50)
    return <MultiResult items={[{ label: 'Pots', value: pots }, { label: 'Pot Size', value: `${liter}L` }, { label: 'Soil', value: soil, unit: 'L' }, { label: 'Bags', value: bags }]} />
  },
  greenhouse: (v) => {
    const w = parseFloat(v.width) || 2; const l = parseFloat(v.length) || 3; const area = w * l; const minVent = area * 0.15; const heatReq = area * 0.5
    return <MultiResult items={[{ label: 'Floor Area', value: area, unit: 'm²' }, { label: 'Ventilation', value: minVent, unit: 'm²' }, { label: 'Heating', value: heatReq, unit: 'kW' }]} />
  },
  herb: (v) => {
    const area = parseFloat(v.area) || 1; const herbs = Math.floor(area * 16); const types = Math.min(herbs, 8)
    return <MultiResult items={[{ label: 'Area', value: area, unit: 'm²' }, { label: 'Plants', value: herbs }, { label: 'Varieties', value: types }]} />
  },
  'indoor-herb': (v) => {
    const pots = parseFloat(v.pots) || 3; const light = pots * 8; const water = pots * 0.1
    return <MultiResult items={[{ label: 'Pots', value: pots }, { label: 'Light', value: light, unit: 'hrs/day' }, { label: 'Water', value: water, unit: 'L/day' }]} />
  },
  microgreen: (v) => {
    const trays = parseFloat(v.trays) || 2; const days = 10; const yieldG = trays * 200; const weekly = yieldG / days * 7
    return <MultiResult items={[{ label: 'Trays', value: trays }, { label: 'Yield', value: yieldG, unit: 'g' }, { label: 'Weekly Harvest', value: weekly.toFixed(0), unit: 'g' }]} />
  },
  'raised-bed': (v) => {
    const w = parseFloat(v.width) || 1.2; const l = parseFloat(v.length) || 2.4; const h = parseFloat(v.height) || 0.3; const vol = w * l * h; const liters = vol * 1000; const bags = Math.ceil(liters / 50)
    return <MultiResult items={[{ label: 'Size', value: `${w}×-${l}×-${h}`, unit: 'm' }, { label: 'Volume', value: vol, unit: 'm²' }, { label: 'Soil', value: liters, unit: 'L' }, { label: 'Bags', value: bags }]} />
  },
  trellis: (v) => {
    const w = parseFloat(v.width) || 1; const h = parseFloat(v.height) || 2; const area = w * h; const posts = Math.ceil(w / 1.5) + 1; const wire = (w * 3 + h * 2) * 1.2
    return <MultiResult items={[{ label: 'Area', value: area, unit: 'm²' }, { label: 'Posts', value: posts }, { label: 'Wire', value: wire.toFixed(1), unit: 'm' }]} />
  },
  vertical: (v) => {
    const area = parseFloat(v.area) || 1; const pockets = Math.floor(area * 24); const plants = Math.floor(pockets * 0.8)
    return <MultiResult items={[{ label: 'Wall Area', value: area, unit: 'm²' }, { label: 'Pockets', value: pockets }, { label: 'Plants', value: plants }]} />
  },
  worm: (v) => {
    const people = parseFloat(v.people) || 2; const waste = people * 0.5; const binSize = waste * 7 * 2; const worms = binSize * 500
    return <MultiResult items={[{ label: 'Food Waste', value: waste * 7, unit: 'kg/wk' }, { label: 'Bin Size', value: binSize, unit: 'L' }, { label: 'Worms', value: Math.round(worms) }]} />
  },
  'storage-cost': (v) => {
    const size = parseFloat(v.size) || 100; const rate = parseFloat(v.rate) || 1.5; const months = parseFloat(v.months) || 12; const monthly = size * rate; const total = monthly * months
    return <MultiResult items={[{ label: 'Monthly', value: monthly, unit: '$' }, { label: 'Total', value: total, unit: '$' }, { label: 'Duration', value: months, unit: 'mo' }]} />
  },
  closet: (v) => {
    const w = parseFloat(v.width) || 2; const rods = Math.ceil(w / 1.2); const shelves = Math.floor(w / 0.6)
    return <MultiResult items={[{ label: 'Width', value: w, unit: 'm' }, { label: 'Rods', value: rods }, { label: 'Shelves', value: shelves }]} />
  },
  konmari: (v) => {
    const items = parseFloat(v.items) || 100; const keep = Math.round(items * 0.4); const donate = Math.round(items * 0.35); const discard = items - keep - donate; const time = items * 3
    return <MultiResult items={[{ label: 'Items', value: items }, { label: 'Keep', value: keep }, { label: 'Donate', value: donate }, { label: 'Discard', value: discard }, { label: 'Time', value: time, unit: 'min' }]} />
  },
  garage: (v) => {
    const cars = parseFloat(v.cars) || 1; const area = cars * 14; const shelves = Math.ceil(area / 3); const hooks = Math.ceil(area / 2)
    return <MultiResult items={[{ label: 'Garage Area', value: area, unit: 'm²' }, { label: 'Shelves', value: shelves }, { label: 'Hooks', value: hooks }]} />
  },
  'home-inv': (v) => {
    const rooms = parseFloat(v.rooms) || 3; const items = rooms * 50; const value = items * 25
    return <MultiResult items={[{ label: 'Rooms', value: rooms }, { label: 'Items', value: items }, { label: 'Est. Value', value: value, unit: '$' }]} />
  },
  'home-org': (v) => {
    const area = parseFloat(v.area) || 100; const bins = Math.ceil(area / 10); const time = area * 0.5
    return <MultiResult items={[{ label: 'Area', value: area, unit: 'm²' }, { label: 'Bins', value: bins }, { label: 'Time', value: time, unit: 'hrs' }]} />
  },
  shed: (v) => {
    const w = parseFloat(v.width) || 2; const l = parseFloat(v.length) || 3; const area = w * l; const shelves = Math.ceil(area / 2)
    return <MultiResult items={[{ label: 'Area', value: area, unit: 'm²' }, { label: 'Shelves', value: shelves }, { label: 'Storage', value: area * 0.5, unit: 'm²' }]} />
  },
  workshop: (v) => {
    const w = parseFloat(v.width) || 4; const l = parseFloat(v.length) || 5; const area = w * l; const bench = Math.min(2, w * 0.4); const aisles = w - bench
    return <MultiResult items={[{ label: 'Area', value: area, unit: 'm²' }, { label: 'Workbench', value: bench, unit: 'm' }, { label: 'Aisle', value: aisles, unit: 'm' }]} />
  },
  'delivery-fee': (v) => {
    const dist = parseFloat(v.distance) || 0; const base = parseFloat(v.base) || 5; const perKm = parseFloat(v.perKm) || 1.5; const tip = parseFloat(v.tip) || 0; const total = base + dist * perKm + tip
    return <MultiResult items={[{ label: 'Fee', value: total, unit: '$' }, { label: 'Distance', value: dist, unit: 'km' }, { label: 'Tip', value: tip, unit: '$' }]} />
  },
  baggage: (v) => {
    const bags = parseFloat(v.bags) || 1; const weight = parseFloat(v.weight) || 23; const fee = bags > 1 ? (bags - 1) * 35 : 0; const overweight = weight > 23 ? 50 : 0
    return <MultiResult items={[{ label: 'Bags', value: bags }, { label: 'Bag Fee', value: fee, unit: '$' }, { label: 'Overweight', value: overweight, unit: '$' }, { label: 'Total', value: fee + overweight, unit: '$' }]} />
  },
  'hotel-cost': (v) => {
    const nights = parseFloat(v.nights) || 3; const rate = parseFloat(v.rate) || 150; const tax = rate * 0.12; const total = (rate + tax) * nights
    return <MultiResult items={[{ label: 'Rate', value: rate, unit: '$/night' }, { label: 'Nights', value: nights }, { label: 'Total', value: total, unit: '$' }]} />
  },
  luggage: (v) => {
    const h = parseFloat(v.height) || 55; const w = parseFloat(v.width) || 40; const d = parseFloat(v.depth) || 20; const vol = h * w * d / 1000; const carryon = h <= 56 && w <= 45 && d <= 25
    return <MultiResult items={[{ label: 'Size', value: `${h}×-${w}×-${d}`, unit: 'cm' }, { label: 'Volume', value: vol, unit: 'L' }, { label: 'Carry-on OK', value: carryon ? 'Yes' : 'No' }]} />
  },
  'packing-list': (v) => {
    const days = parseFloat(v.days) || 3; const climate = v.climate || 'moderate'; const outfits = Math.ceil(days * 1.3); const pairs = climate === 'cold' ? Math.ceil(days * 0.8) : Math.ceil(days * 0.6)
    return <MultiResult items={[{ label: 'Days', value: days }, { label: 'Outfits', value: outfits }, { label: 'Shoe Pairs', value: pairs }, { label: 'Climate', value: climate }]} />
  },
  'pack-vol': (v) => {
    const outfits = parseFloat(v.outfits) || 5; const shoes = parseFloat(v.shoes) || 2; const vol = outfits * 2 + shoes * 3 + 1; const bagType = vol <= 40 ? 'Carry-on' : vol <= 70 ? 'Check-in M' : 'Check-in L'
    return <MultiResult items={[{ label: 'Est. Volume', value: vol, unit: 'L' }, { label: 'Bag Type', value: bagType }]} />
  },
  'travel-budget': (v) => {
    const days = parseFloat(v.days) || 7; const flight = parseFloat(v.flight) || 500; const hotel = parseFloat(v.hotel) || 150 * days; const food = parseFloat(v.food) || 100 * days; const total = flight + hotel + food
    return <MultiResult items={[{ label: 'Flights', value: flight, unit: '$' }, { label: 'Lodging', value: hotel, unit: '$' }, { label: 'Food', value: food, unit: '$' }, { label: 'Total', value: total, unit: '$' }]} />
  },
  'travel-time': (v) => {
    const dist = parseFloat(v.distance) || 1000; const speed = parseFloat(v.speed) || 800; const hours = dist / speed; const layovers = parseFloat(v.layovers) || 0; const totalHrs = hours + layovers * 2
    return <MultiResult items={[{ label: 'Distance', value: dist, unit: 'km' }, { label: 'Fly Time', value: hours, unit: 'hrs' }, { label: 'Layovers', value: layovers }, { label: 'Total', value: totalHrs, unit: 'hrs' }]} />
  },
  'trip-cost': (v) => {
    const transport = parseFloat(v.transport) || 500; const lodging = parseFloat(v.lodging) || 600; const food = parseFloat(v.food) || 300; const activities = parseFloat(v.activities) || 200; const total = transport + lodging + food + activities
    return <MultiResult items={[{ label: 'Transport', value: transport, unit: '$' }, { label: 'Lodging', value: lodging, unit: '$' }, { label: 'Food', value: food, unit: '$' }, { label: 'Activities', value: activities, unit: '$' }, { label: 'Total', value: total, unit: '$' }]} />
  },
  weather: (v) => {
    const tempA = parseFloat(v.tempA) || 25; const tempB = parseFloat(v.tempB) || 10; const diff = Math.abs(tempA - tempB); const warmer = tempA >= tempB ? 'City A' : 'City B'
    return <MultiResult items={[{ label: 'City A', value: tempA, unit: '°C' }, { label: 'City B', value: tempB, unit: '°C' }, { label: 'Difference', value: diff, unit: '°C' }, { label: 'Warmer', value: warmer }]} />
  },
  'streaming-cost': (v) => {
    const services = parseFloat(v.services) || 3; const avgCost = parseFloat(v.avgCost) || 12.99; const monthly = services * avgCost; const yearly = monthly * 12
    return <MultiResult items={[{ label: 'Monthly', value: monthly, unit: '$' }, { label: 'Yearly', value: yearly, unit: '$' }, { label: 'Services', value: services }]} />
  },
  'subscription-calc': (v) => {
    const subs = parseFloat(v.subs) || 5; const avg = parseFloat(v.avg) || 10; const monthly = subs * avg; const yearly = monthly * 12
    return <MultiResult items={[{ label: 'Monthly', value: monthly, unit: '$' }, { label: 'Yearly', value: yearly, unit: '$' }, { label: 'Subscriptions', value: subs }]} />
  },
  'sub-cost': (v) => {
    const services = parseFloat(v.services) || 4; const avg = parseFloat(v.avg) || 14.99; const monthly = services * avg; const yearly = monthly * 12
    return <MultiResult items={[{ label: 'Monthly', value: monthly, unit: '$' }, { label: 'Yearly', value: yearly, unit: '$' }, { label: 'Avg/Service', value: avg, unit: '$' }]} />
  },
  'sub-save': (v) => {
    const current = parseFloat(v.current) || 60; const bundle = parseFloat(v.bundle) || 40; const savings = current - bundle; const yearly = savings * 12
    return <MultiResult items={[{ label: 'Current', value: current, unit: '$' }, { label: 'Bundle', value: bundle, unit: '$' }, { label: 'Monthly Save', value: savings, unit: '$' }, { label: 'Yearly Save', value: yearly, unit: '$' }]} />
  },
  'net-speed': (v) => {
    const devices = parseFloat(v.devices) || 4; const streaming = v.streaming === 'yes' ? 25 : 0; const gaming = v.gaming === 'yes' ? 50 : 0; const work = v.work === 'yes' ? 25 : 0; const total = 10 + devices * 5 + streaming + gaming + work
    return <MultiResult items={[{ label: 'Recommended', value: total, unit: 'Mbps' }, { label: 'Devices', value: devices }, { label: 'Streaming', value: streaming ? 'Yes' : 'No' }]} />
  },
  'data-usage': (v) => {
    const devices = parseFloat(v.devices) || 3; const hdHrs = parseFloat(v.hd) || 2; const sdHrs = parseFloat(v.sd) || 3; const daily = devices * (hdHrs * 3 + sdHrs * 0.7); const monthly = daily * 30
    return <MultiResult items={[{ label: 'Daily', value: daily, unit: 'GB' }, { label: 'Monthly', value: monthly, unit: 'GB' }, { label: 'Devices', value: devices }]} />
  },
  'internet-cost': (v) => {
    const plan = parseFloat(v.plan) || 60; const equip = parseFloat(v.equip) || 10; const monthly = plan + equip; const yearly = monthly * 12
    return <MultiResult items={[{ label: 'Plan', value: plan, unit: '$' }, { label: 'Equipment', value: equip, unit: '$' }, { label: 'Monthly', value: monthly, unit: '$' }, { label: 'Yearly', value: yearly, unit: '$' }]} />
  },
  'salary-hourly': (v) => {
    const annual = parseFloat(v.annual) || 60000; const hourly = annual / 2080; const weekly = annual / 52; const monthly = annual / 12
    return <MultiResult items={[{ label: 'Hourly', value: hourly, unit: '$' }, { label: 'Weekly', value: weekly, unit: '$' }, { label: 'Monthly', value: monthly, unit: '$' }, { label: 'Annual', value: annual, unit: '$' }]} />
  },
  'hourly-salary': (v) => {
    const hourly = parseFloat(v.hourly) || 30; const annual = hourly * 2080; const weekly = annual / 52; const monthly = annual / 12
    return <MultiResult items={[{ label: 'Annual', value: annual, unit: '$' }, { label: 'Monthly', value: monthly, unit: '$' }, { label: 'Weekly', value: weekly, unit: '$' }, { label: 'Hourly', value: hourly, unit: '$' }]} />
  },
  'billable-hrs': (v) => {
    const rate = parseFloat(v.rate) || 100; const hours = parseFloat(v.hours) || 1500; const revenue = rate * hours; const expenses = parseFloat(v.expenses) || 30000; const net = revenue - expenses
    return <MultiResult items={[{ label: 'Revenue', value: revenue, unit: '$' }, { label: 'Expenses', value: expenses, unit: '$' }, { label: 'Net Income', value: net, unit: '$' }]} />
  },
  'meeting-cost2': (v) => {
    const attendees = parseFloat(v.attendees) || 4; const duration = parseFloat(v.duration) || 60; const avgSalary = parseFloat(v.avgSalary) || 60000; const hourlyRate = avgSalary / 2080; const cost = attendees * (duration / 60) * hourlyRate
    return <MultiResult items={[{ label: 'Attendees', value: attendees }, { label: 'Duration', value: duration, unit: 'min' }, { label: 'Cost', value: cost, unit: '$' }]} />
  },
  pomodoro: (v) => {
    const work = parseFloat(v.work) || 25; const breaks = parseFloat(v.breaks) || 5; const cycles = parseFloat(v.cycles) || 4; const total = cycles * work + (cycles - 1) * breaks + 15
    return <MultiResult items={[{ label: 'Work Blocks', value: cycles }, { label: 'Total Time', value: total, unit: 'min' }, { label: 'Focus Time', value: cycles * work, unit: 'min' }]} />
  },
  'priority-matrix2': (v) => {
    const tasks = parseFloat(v.tasks) || 10; const urgent = parseFloat(v.urgent) || 3; const important = parseFloat(v.important) || 4; const q1 = Math.min(urgent, important); const q2 = important - q1; const q3 = urgent - q1; const q4 = tasks - q1 - q2 - q3
    return <MultiResult items={[{ label: 'Do First', value: q1 }, { label: 'Schedule', value: q2 }, { label: 'Delegate', value: q3 }, { label: 'Eliminate', value: q4 }]} />
  },
  productivity: (v) => {
    const done = parseFloat(v.done) || 6; const planned = parseFloat(v.planned) || 8; const efficiency = planned > 0 ? done / planned * 100 : 0; const focus = parseFloat(v.focus) || 70
    return <MultiResult items={[{ label: 'Done', value: done }, { label: 'Efficiency', value: efficiency, unit: '%' }, { label: 'Focus', value: focus, unit: '%' }, { label: 'Productivity Index', value: (efficiency * focus / 100).toFixed(0) }]} />
  },
  'project-deadline2': (v) => {
    const tasks = parseFloat(v.tasks) || 20; const hrsPer = parseFloat(v.hoursPer) || 4; const hrsDay = parseFloat(v.hoursPerDay) || 6; const totalHours = tasks * hrsPer; const days = hrsDay > 0 ? totalHours / hrsDay : 0
    return <MultiResult items={[{ label: 'Tasks', value: tasks }, { label: 'Total Hours', value: totalHours }, { label: 'Days Needed', value: Math.ceil(days) }]} />
  },
  'task-est': (v) => {
    const opt = parseFloat(v.optimistic) || 2; const likely = parseFloat(v.likely) || 4; const pess = parseFloat(v.pessimistic) || 8; const est = (opt + 4 * likely + pess) / 6; const sd = (pess - opt) / 6
    return <MultiResult items={[{ label: 'PERT Estimate', value: est, unit: 'hrs' }, { label: 'Std Dev', value: sd, unit: 'hrs' }, { label: 'Range', value: `${(est - sd * 2).toFixed(1)}-${(est + sd * 2).toFixed(1)} hrs` }]} />
  },
  'time-block': (v) => {
    const hours = parseFloat(v.hours) || 8; const blocks = parseFloat(v.blocks) || 4; const blockLen = blocks > 0 ? hours / blocks : 0; const focus = parseFloat(v.focus) || 80; const effective = hours * focus / 100
    return <MultiResult items={[{ label: 'Blocks', value: blocks }, { label: 'Block Len', value: blockLen, unit: 'hrs' }, { label: 'Focus Time', value: effective, unit: 'hrs' }]} />
  },
  'work-hours': (v) => {
    const start = v.start || '09:00'; const end = v.end || '17:00'; const [sh, sm] = start.split(':').map(Number); const [eh, em] = end.split(':').map(Number); const totalMin = (eh * 60 + em) - (sh * 60 + sm); const hrs = totalMin / 60; const breaks = parseFloat(v.breaks) || 1; const net = hrs - breaks
    return <MultiResult items={[{ label: 'Total', value: hrs, unit: 'hrs' }, { label: 'Breaks', value: breaks, unit: 'hrs' }, { label: 'Net', value: net, unit: 'hrs' }]} />
  },
  'file-size2': (v) => {
    const size = parseFloat(v.size) || 500; const unit = v.unit || 'MB'; const speed = parseFloat(v.speed) || 50; const sizeBits = unit === 'GB' ? size * 8000 : unit === 'MB' ? size * 8 : size * 0.008; const seconds = speed > 0 ? sizeBits / speed : 0; const mins = Math.floor(seconds / 60); const secs = Math.round(seconds % 60)
    return <MultiResult items={[{ label: 'Size', value: `${size} ${unit}` }, { label: 'Speed', value: speed, unit: 'Mbps' }, { label: 'Time', value: `${mins}m ${secs}s` }]} />
  },
  'download-time': (v) => {
    const size = parseFloat(v.size) || 5000; const unit = v.unit || 'MB'; const speed = parseFloat(v.speed) || 100; const sizeBits = unit === 'GB' ? size * 8000 : unit === 'MB' ? size * 8 : size * 0.008; const seconds = speed > 0 ? sizeBits / speed : 0; const mins = Math.floor(seconds / 60); const secs = Math.round(seconds % 60)
    return <MultiResult items={[{ label: 'Size', value: `${size} ${unit}` }, { label: 'Speed', value: speed, unit: 'Mbps' }, { label: 'ETA', value: `${mins}m ${secs}s` }]} />
  },
  'upload-time': (v) => {
    const size = parseFloat(v.size) || 100; const unit = v.unit || 'MB'; const speed = parseFloat(v.speed) || 20; const sizeBits = unit === 'GB' ? size * 8000 : unit === 'MB' ? size * 8 : size * 0.008; const seconds = speed > 0 ? sizeBits / speed : 0; const mins = Math.floor(seconds / 60); const secs = Math.round(seconds % 60)
    return <MultiResult items={[{ label: 'Size', value: `${size} ${unit}` }, { label: 'Speed', value: speed, unit: 'Mbps' }, { label: 'ETA', value: `${mins}m ${secs}s` }]} />
  },
  'calories-burned': (v) => {
    const met = parseFloat(v.met) || 3.5; const weight = parseFloat(v.weight) || 70; const min = parseFloat(v.minutes) || 30; const calories = met * weight * 3.5 * min / 200
    return <MultiResult items={[{ label: 'Activity', value: v.activity || 'General' }, { label: 'Duration', value: min, unit: 'min' }, { label: 'Calories', value: Math.round(calories), unit: 'kcal' }]} />
  },
  'walking-cal': (v) => {
    const weight = parseFloat(v.weight) || 70; const min = parseFloat(v.minutes) || 30; const met = 3.5; const calories = met * weight * 3.5 * min / 200; const steps = Math.round(min * 100)
    return <MultiResult items={[{ label: 'Duration', value: min, unit: 'min' }, { label: 'Steps', value: steps }, { label: 'Calories', value: Math.round(calories), unit: 'kcal' }]} />
  },
  'running-cal': (v) => {
    const weight = parseFloat(v.weight) || 70; const min = parseFloat(v.minutes) || 30; const speed = parseFloat(v.speed) || 8; const met = speed >= 10 ? 11.5 : speed >= 8 ? 9.8 : speed >= 6 ? 7.5 : 6; const calories = met * weight * 3.5 * min / 200
    return <MultiResult items={[{ label: 'Duration', value: min, unit: 'min' }, { label: 'Speed', value: speed, unit: 'km/h' }, { label: 'Calories', value: Math.round(calories), unit: 'kcal' }]} />
  },
  'cycling-cal': (v) => {
    const weight = parseFloat(v.weight) || 70; const min = parseFloat(v.minutes) || 30; const speed = parseFloat(v.speed) || 16; const met = speed >= 20 ? 10 : speed >= 16 ? 8 : speed >= 12 ? 6 : 4; const calories = met * weight * 3.5 * min / 200
    return <MultiResult items={[{ label: 'Duration', value: min, unit: 'min' }, { label: 'Speed', value: speed, unit: 'km/h' }, { label: 'Calories', value: Math.round(calories), unit: 'kcal' }]} />
  },
  'swimming-cal': (v) => {
    const weight = parseFloat(v.weight) || 70; const min = parseFloat(v.minutes) || 30; const intensity = v.intensity || 'moderate'; const met = intensity === 'vigorous' ? 9.8 : intensity === 'moderate' ? 5.8 : 3.5; const calories = met * weight * 3.5 * min / 200
    return <MultiResult items={[{ label: 'Duration', value: min, unit: 'min' }, { label: 'Intensity', value: intensity }, { label: 'Calories', value: Math.round(calories), unit: 'kcal' }]} />
  },
  'yoga-cal': (v) => {
    const weight = parseFloat(v.weight) || 70; const min = parseFloat(v.minutes) || 30; const style = v.style || 'hatha'; const met = style === 'power' ? 4 : style === 'vinyasa' ? 3.3 : 2.5; const calories = met * weight * 3.5 * min / 200
    return <MultiResult items={[{ label: 'Duration', value: min, unit: 'min' }, { label: 'Style', value: style }, { label: 'Calories', value: Math.round(calories), unit: 'kcal' }]} />
  },
  'desk-ergo': (v) => {
    const height = parseFloat(v.height) || 170; const desk = height * 0.45; const seat = height * 0.27; const monitor = height + height * 0.08; const elbow = height * 0.15
    return <MultiResult items={[{ label: 'Desk', value: desk, unit: 'cm' }, { label: 'Seat', value: seat, unit: 'cm' }, { label: 'Monitor', value: monitor, unit: 'cm' }, { label: 'Elbow', value: elbow, unit: 'cm' }]} />
  },
  'stand-desk': (v) => {
    const height = parseFloat(v.height) || 170; const stand = height * 0.44; const sit = height * 0.27; const transition = height * 0.36
    return <MultiResult items={[{ label: 'Standing', value: stand, unit: 'cm' }, { label: 'Sitting', value: sit, unit: 'cm' }, { label: 'Transition', value: transition, unit: 'cm' }]} />
  },
  'monitor-ht': (v) => {
    const height = parseFloat(v.height) || 170; const eyeLevel = height * 0.93; const monitorTop = eyeLevel + 5; const monitorBottom = monitorTop - 35
    return <MultiResult items={[{ label: 'Eye Level', value: eyeLevel, unit: 'cm' }, { label: 'Monitor Top', value: monitorTop, unit: 'cm' }, { label: 'Monitor Bottom', value: monitorBottom, unit: 'cm' }]} />
  },
  'tv-size': (v) => {
    const dist = parseFloat(v.distance) || 3; const distCm = dist * 100; const ideal = distCm / 2.5 / 2.54; const min = distCm / 3 / 2.54; const max = distCm / 1.5 / 2.54
    return <MultiResult items={[{ label: 'Ideal Size', value: Math.round(ideal), unit: 'in' }, { label: 'Range', value: `${Math.round(min)}-${Math.round(max)}`, unit: 'in' }]} />
  },
  'projector-screen': (v) => {
    const dist = parseFloat(v.distance) || 3; const aspect = v.aspect || '16:9'; const diag = dist * 39.37 * 0.5; const w = diag * 0.87; const h = diag * 0.49
    return <MultiResult items={[{ label: 'Screen', value: Math.round(diag), unit: 'in' }, { label: 'Width', value: Math.round(w), unit: 'cm' }, { label: 'Height', value: Math.round(h), unit: 'cm' }]} />
  },
  'floor-mat': (v) => {
    const area = parseFloat(v.area) || 0; const plankW = parseFloat(v.plankW) || 0.15; const plankL = parseFloat(v.plankL) || 1.2; const plankArea = plankW * plankL; const planks = Math.ceil(area / plankArea * 1.1); const packs = Math.ceil(planks / (parseFloat(v.perPack) || 8))
    return <MultiResult items={[{ label: 'Area', value: area, unit: 'm²' }, { label: 'Planks', value: planks }, { label: 'Packs', value: packs }]} />
  },
  'carpet-room': (v) => {
    const w = parseFloat(v.width) || 0; const l = parseFloat(v.length) || 0; const area = w * l; const rollW = 3.66; const lengths = Math.ceil(w / rollW); const total = lengths * l; const waste = total - area
    return <MultiResult items={[{ label: 'Area', value: area, unit: 'm²' }, { label: 'Carpet', value: total, unit: 'm²' }, { label: 'Waste', value: waste, unit: 'm²' }]} />
  },
  'deck-mat': (v) => {
    const w = parseFloat(v.width) || 0; const l = parseFloat(v.length) || 0; const area = w * l; const boards = Math.ceil(area / (0.14 * l)) * 1.1; const posts = Math.ceil(w / 2.4 + 1) * 2; const screws = Math.ceil(boards * 12)
    return <MultiResult items={[{ label: 'Area', value: area, unit: 'm²' }, { label: 'Boards', value: Math.ceil(boards) }, { label: 'Posts', value: posts }, { label: 'Screws', value: screws }]} />
  },
  'fence-mat': (v) => {
    const l = parseFloat(v.length) || 0; const h = parseFloat(v.height) || 1.8; const panels = Math.ceil(l / 1.8); const posts = panels + 1; const concrete = posts * 25
    return <MultiResult items={[{ label: 'Length', value: l, unit: 'm' }, { label: 'Panels', value: panels }, { label: 'Posts', value: posts }, { label: 'Concrete', value: concrete, unit: 'kg' }]} />
  },
  'seed-space': (v) => {
    const area = parseFloat(v.area) || 0; const spacing = parseFloat(v.spacing) || 0.3; const plants = Math.ceil(area / (spacing * spacing)); const seeds = plants * 2
    return <MultiResult items={[{ label: 'Area', value: area, unit: 'm²' }, { label: 'Spacing', value: spacing, unit: 'm' }, { label: 'Plants', value: plants }, { label: 'Seeds', value: seeds }]} />
  },
  'plant-space': (v) => {
    const area = parseFloat(v.area) || 0; const spacing = parseFloat(v.spacing) || 0.3; const rowSpacing = parseFloat(v.rowSpacing) || spacing; const plants = Math.ceil(area / (spacing * rowSpacing))
    return <MultiResult items={[{ label: 'Area', value: area, unit: 'm²' }, { label: 'Spacing', value: spacing, unit: 'm' }, { label: 'Row Space', value: rowSpacing, unit: 'm' }, { label: 'Plants', value: plants }]} />
  },
  companion: (v) => {
    const crop = v.crop || 'tomato'; const comps: Record<string, string> = { tomato: 'Basil, Marigold, Carrot', carrot: 'Onion, Rosemary, Sage', basil: 'Tomato, Pepper, Oregano', lettuce: 'Strawberry, Carrot, Cucumber' }; const comp = comps[crop] || 'See companion planting guide'
    return <MultiResult items={[{ label: 'Crop', value: crop }, { label: 'Companions', value: comp }]} />
  },
  'seed-start': (v) => {
    const weeks = parseFloat(v.weeks) || 8; const trays = parseFloat(v.trays) || 2; const cells = trays * 72; const germ = Math.ceil(cells * 0.85); const transplant = Math.ceil(germ * 0.9)
    return <MultiResult items={[{ label: 'Weeks Before Frost', value: weeks }, { label: 'Cells Started', value: cells }, { label: 'Germination', value: germ }, { label: 'Transplant Ready', value: transplant }]} />
  },
  transplant: (v) => {
    const plants = parseFloat(v.plants) || 20; const spacing = parseFloat(v.spacing) || 0.3; const area = plants * spacing * spacing
    return <MultiResult items={[{ label: 'Plants', value: plants }, { label: 'Spacing', value: spacing, unit: 'm' }, { label: 'Area Needed', value: area, unit: 'm²' }]} />
  },
  'crop-yield': (v) => {
    const area = parseFloat(v.area) || 0; const yPerM2 = parseFloat(v.yieldPerM2) || 2.5; const total = area * yPerM2; const lbs = total * 2.205
    return <MultiResult items={[{ label: 'Area', value: area, unit: 'm²' }, { label: 'Yield', value: total, unit: 'kg' }, { label: 'Yield (lbs)', value: lbs.toFixed(1), unit: 'lb' }]} />
  },
  'crop-rotate': (v) => {
    const beds = parseFloat(v.beds) || 4; const fams = ['Legumes', 'Brassicas', 'Alliums', 'Roots', 'Solanums', 'Cucurbits']; const assigned = fams.slice(0, beds)
    return <MultiResult items={[{ label: 'Beds', value: beds }, { label: 'Cycle', value: `${beds}-year rotation` }, { label: 'Families', value: assigned.join(', ') }]} />
  },
  'aquarium-vol': (v) => {
    const l = parseFloat(v.length) || 0; const w = parseFloat(v.width) || 0; const h = parseFloat(v.height) || 0; const volL = l * w * h / 1000; const volGal = volL / 3.785
    return <MultiResult items={[{ label: 'Volume', value: volL.toFixed(1), unit: 'L' }, { label: 'Volume (gal)', value: volGal.toFixed(1), unit: 'gal' }]} />
  },
  'aquarium-heater': (v) => {
    const vol = parseFloat(v.volume) || 100; const heater = vol * 0.05 + 25; const roomT = parseFloat(v.room) || 20; const target = parseFloat(v.target) || 26; const diff = target - roomT; const power = diff > 5 ? heater * 1.5 : heater
    return <MultiResult items={[{ label: 'Volume', value: vol, unit: 'L' }, { label: 'Heater', value: Math.round(power), unit: 'W' }, { label: 'Temp Diff', value: diff, unit: '°C' }]} />
  },
  'aquarium-light': (v) => {
    const vol = parseFloat(v.volume) || 100; const planted = v.planted === 'yes'; const base = vol * 30; const light = planted ? base * 1.5 : base; const hours = planted ? 10 : 8
    return <MultiResult items={[{ label: 'Volume', value: vol, unit: 'L' }, { label: 'Light', value: Math.round(light), unit: 'lumens' }, { label: 'Photoperiod', value: hours, unit: 'hrs/day' }]} />
  },
  'aquarium-size2': (v) => {
    const fish = parseFloat(v.fish) || 5; const fishSize = parseFloat(v.fishSize) || 5; const minVol = fish * fishSize * 2; const dim = `${Math.round(minVol / 30)}×-${Math.round(minVol / 20)}×-${Math.round(minVol / 15)}`
    return <MultiResult items={[{ label: 'Fish', value: fish }, { label: 'Min Volume', value: minVol, unit: 'L' }, { label: 'Recommended', value: dim, unit: 'cm' }]} />
  },
  'cleaning-time': (v) => {
    const rooms = parseFloat(v.rooms) || 0; const bath = parseFloat(v.bath) || 0; const type = v.type || 'deep'; const minPerRoom = type === 'deep' ? 45 : 20; const totalMin = rooms * minPerRoom + bath * 30
    return <MultiResult items={[{ label: 'Time', value: totalMin, unit: 'min' }, { label: 'Hours', value: (totalMin / 60).toFixed(1) }, { label: 'Type', value: type }]} />
  },
  'clean-supplies': (v) => {
    const area = parseFloat(v.area) || 100; const cleaner = Math.ceil(area / 200); const wipes = Math.ceil(area / 50); const bags = Math.ceil(area / 100)
    return <MultiResult items={[{ label: 'Area', value: area, unit: 'm²' }, { label: 'Cleaner', value: cleaner }, { label: 'Wipes', value: wipes }, { label: 'Bags', value: bags }]} />
  },
  'laundry-cost': (v) => {
    const loads = parseFloat(v.loads) || 0; const costPer = parseFloat(v.costPer) || 1.50; const total = loads * costPer; const monthly = loads * 4 * costPer; const yearly = monthly * 12
    return <MultiResult items={[{ label: 'Per Load', value: costPer, unit: '$' }, { label: 'Weekly', value: total, unit: '$' }, { label: 'Monthly', value: monthly, unit: '$' }, { label: 'Yearly', value: yearly, unit: '$' }]} />
  },
  'laundry-auto': (v) => {
    const people = parseFloat(v.people) || 2; const loads = people * 2.5; const costPer = parseFloat(v.costPer) || 1.50; const weekly = loads * costPer; const monthly = weekly * 4.33; const yearly = monthly * 12
    return <MultiResult items={[{ label: 'People', value: people }, { label: 'Loads/Week', value: loads }, { label: 'Weekly', value: weekly, unit: '$' }, { label: 'Yearly', value: yearly, unit: '$' }]} />
  },
  'cater-cost': (v) => {
    const guests = parseFloat(v.guests) || 0; const perPerson = parseFloat(v.perPerson) || 25; const staff = Math.ceil(guests / 20); const food = guests * perPerson; const labor = staff * 200; const total = food + labor
    return <MultiResult items={[{ label: 'Food', value: food, unit: '$' }, { label: 'Staff', value: staff }, { label: 'Labor', value: labor, unit: '$' }, { label: 'Total', value: total, unit: '$' }]} />
  },
  'meal-prep': (v) => {
    const meals = parseFloat(v.meals) || 14; const cost = parseFloat(v.cost) || 70; const prepTime = parseFloat(v.prepTime) || 30; const costPer = meals > 0 ? cost / meals : 0; const timePer = meals > 0 ? prepTime / meals : 0
    return <MultiResult items={[{ label: 'Meals', value: meals }, { label: 'Cost/Meal', value: costPer, unit: '$' }, { label: 'Time/Meal', value: timePer, unit: 'min' }]} />
  },
  'leftover-calc': (v) => {
    const portions = parseFloat(v.portions) || 4; const eaten = parseFloat(v.eaten) || 3; const leftover = portions - eaten; const waste = parseFloat(v.waste) || 0; const usable = leftover - waste; const days = Math.ceil(leftover * 0.5)
    return <MultiResult items={[{ label: 'Portions', value: portions }, { label: 'Leftover', value: Math.max(0, leftover) }, { label: 'Eat Within', value: days, unit: 'days' }]} />
  },
  'pizza-calc': (v) => {
    const pizzas = parseFloat(v.pizzas) || 2; const slices = parseFloat(v.slices) || 8; const people = parseFloat(v.people) || 4; const total = pizzas * slices; const perPerson = people > 0 ? total / people : 0; const enough = perPerson >= 3
    return <MultiResult items={[{ label: 'Total Slices', value: total }, { label: 'Per Person', value: perPerson }, { label: 'Enough?', value: enough ? 'Yes' : 'Order more' }]} />
  },
  'coffee-calc2': (v) => {
    const cups = parseFloat(v.cups) || 10; const grounds = cups * 10; const water = cups * 200; const costPer = parseFloat(v.costPer) || 0.50; const total = cups * costPer
    return <MultiResult items={[{ label: 'Cups', value: cups }, { label: 'Grounds', value: grounds, unit: 'g' }, { label: 'Water', value: water, unit: 'mL' }, { label: 'Cost', value: total, unit: '$' }]} />
  },
  'takeout-calc': (v) => {
    const meals = parseFloat(v.meals) || 5; const avgCost = parseFloat(v.avgCost) || 15; const weekly = meals * avgCost; const monthly = weekly * 4.33; const yearly = monthly * 12
    return <MultiResult items={[{ label: 'Weekly', value: weekly, unit: '$' }, { label: 'Monthly', value: monthly, unit: '$' }, { label: 'Yearly', value: yearly, unit: '$' }]} />
  },
  'util-est': (v) => {
    const elec = parseFloat(v.electricity) || 0; const water = parseFloat(v.water) || 0; const gas = parseFloat(v.gas) || 0; const internet = parseFloat(v.internet) || 0; const other = parseFloat(v.other) || 0; const total = elec + water + gas + internet + other
    return <MultiResult items={[{ label: 'Electricity', value: elec, unit: '$' }, { label: 'Water', value: water, unit: '$' }, { label: 'Gas', value: gas, unit: '$' }, { label: 'Internet', value: internet, unit: '$' }, { label: 'Total', value: total, unit: '$' }]} />
  },
  'auto-util': (v) => {
    const sqft = parseFloat(v.sqft) || 1500; const people = parseFloat(v.people) || 2; const elec = sqft * 0.08; const water = people * 20; const gas = sqft * 0.04; const total = elec + water + gas
    return <MultiResult items={[{ label: 'Electricity', value: elec, unit: '$' }, { label: 'Water', value: water, unit: '$' }, { label: 'Gas', value: gas, unit: '$' }, { label: 'Total', value: total, unit: '$' }]} />
  },
  'util-cost': (v) => {
    const elec = parseFloat(v.electricity) || 0; const water = parseFloat(v.water) || 0; const gas = parseFloat(v.gas) || 0; const trash = parseFloat(v.trash) || 0; const total = elec + water + gas + trash
    return <MultiResult items={[{ label: 'Electricity', value: elec, unit: '$' }, { label: 'Water', value: water, unit: '$' }, { label: 'Gas', value: gas, unit: '$' }, { label: 'Trash', value: trash, unit: '$' }, { label: 'Total', value: total, unit: '$' }]} />
  },
  'cell-cost': (v) => {
    const plan = parseFloat(v.plan) || 50; const lines = parseFloat(v.lines) || 2; const device = parseFloat(v.device) || 800; const monthly = plan * lines + device / 24; const yearly = monthly * 12
    return <MultiResult items={[{ label: 'Monthly', value: monthly, unit: '$' }, { label: 'Per Line', value: plan, unit: '$' }, { label: 'Yearly', value: yearly, unit: '$' }]} />
  },
  'phone-bill': (v) => {
    const plan = parseFloat(v.plan) || 60; const taxes = parseFloat(v.taxes) || 15; const monthly = plan + taxes; const yearly = monthly * 12
    return <MultiResult items={[{ label: 'Plan', value: plan, unit: '$' }, { label: 'Taxes', value: taxes, unit: '$' }, { label: 'Monthly', value: monthly, unit: '$' }, { label: 'Yearly', value: yearly, unit: '$' }]} />
  },
  'pet-cost2': (v) => {
    const food = parseFloat(v.food) || 50; const vet = parseFloat(v.vet) || 300; const supplies = parseFloat(v.supplies) || 20; const other = parseFloat(v.other) || 10; const monthly = food + vet / 12 + supplies + other; const yearly = monthly * 12
    return <MultiResult items={[{ label: 'Monthly', value: monthly, unit: '$' }, { label: 'Yearly', value: yearly, unit: '$' }, { label: 'Annual Vet', value: vet, unit: '$' }]} />
  },
  'pet-board': (v) => {
    const days = parseFloat(v.days) || 7; const daily = parseFloat(v.daily) || 35; const total = days * daily; const deposit = parseFloat(v.deposit) || 0; const grand = total + deposit
    return <MultiResult items={[{ label: 'Days', value: days }, { label: 'Daily Rate', value: daily, unit: '$' }, { label: 'Total', value: grand, unit: '$' }]} />
  },
  'pet-groom': (v) => {
    const visits = parseFloat(v.visits) || 6; const costPer = parseFloat(v.costPer) || 50; const yearly = visits * costPer; const tip = yearly * 0.15; const total = yearly + tip
    return <MultiResult items={[{ label: 'Visits/Year', value: visits }, { label: 'Per Visit', value: costPer, unit: '$' }, { label: 'Yearly', value: yearly, unit: '$' }, { label: 'With Tip', value: total, unit: '$' }]} />
  },
  'pet-sit': (v) => {
    const days = parseFloat(v.days) || 5; const daily = parseFloat(v.daily) || 30; const visits = parseFloat(v.visits) || 2; const total = days * daily * visits
    return <MultiResult items={[{ label: 'Days', value: days }, { label: 'Visits/Day', value: visits }, { label: 'Total', value: total, unit: '$' }]} />
  },
  'hex-color': (v) => {
    const hex = v.hex || '#1a3a8a'; const r = parseInt(hex.slice(1, 3), 16); const g = parseInt(hex.slice(3, 5), 16); const b = parseInt(hex.slice(5, 7), 16)
    return <MultiResult items={[{ label: 'Hex', value: hex }, { label: 'RGB', value: `rgb(${r},${g},${b})` }]} />
  },
  'color-pick': (v) => {
    const r = parseFloat(v.r) || 52; const g = parseFloat(v.g) || 160; const b = parseFloat(v.b) || 164; const hex = '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('')
    return <MultiResult items={[{ label: 'RGB', value: `rgb(${r},${g},${b})` }, { label: 'Hex', value: hex }]} />
  },
  'lotto-calc': (v) => {
    const odds = parseFloat(v.odds) || 292200000; const ticket = parseFloat(v.ticket) || 2; const jackpot = parseFloat(v.jackpot) || 100000000; const ev = (jackpot / odds) - ticket; const roi = ((jackpot / odds) / ticket - 1) * 100
    return <MultiResult items={[{ label: 'Odds', value: `1:${odds.toLocaleString()}` }, { label: 'Exp. Value', value: ev, unit: '$' }, { label: 'ROI', value: roi.toFixed(2), unit: '%' }]} />
  },
  'bingo-odds': (v) => {
    const cards = parseFloat(v.cards) || 1; const players = parseFloat(v.players) || 20; const odds = players * cards; const winChance = odds > 0 ? 100 / odds : 0
    return <MultiResult items={[{ label: 'Players', value: players }, { label: 'Your Cards', value: cards }, { label: 'Win Chance', value: winChance.toFixed(2), unit: '%' }]} />
  },
  'lotto-odds': (v) => {
    const mainBalls = parseFloat(v.mainBalls) || 69; const picks = parseFloat(v.picks) || 5; const extraBalls = parseFloat(v.extraBalls) || 26; let combos = 1; for (let i = 0; i < picks; i++) combos *= (mainBalls - i) / (i + 1); const totalOdds = combos * extraBalls
    return <MultiResult items={[{ label: 'Combinations', value: Math.round(combos).toLocaleString() }, { label: 'Odds of Jackpot', value: `1:${Math.round(totalOdds).toLocaleString()}` }]} />
  },
  'poker-odds': (v) => {
    const outs = parseFloat(v.outs) || 8; const cards = parseFloat(v.cards) || 47; const chance = cards > 0 ? outs / cards * 100 : 0; const river = cards > 1 ? outs / (cards - 1) * 100 : 0
    return <MultiResult items={[{ label: 'Outs', value: outs }, { label: 'Turn', value: chance.toFixed(1), unit: '%' }, { label: 'River', value: river.toFixed(1), unit: '%' }]} />
  },
  'carbon-foot': (v) => {
    const elec = parseFloat(v.electricity) || 500; const gas = parseFloat(v.gas) || 50; const car = parseFloat(v.carKm) || 200; const flights = parseFloat(v.flights) || 2; const elecCO2 = elec * 0.4; const gasCO2 = gas * 2.2; const carCO2 = car * 0.12; const flightCO2 = flights * 200; const total = elecCO2 + gasCO2 + carCO2 + flightCO2; const trees = Math.round(total / 21)
    return <MultiResult items={[{ label: 'Electricity', value: elecCO2, unit: 'kg CO2' }, { label: 'Gas', value: gasCO2, unit: 'kg CO2' }, { label: 'Car', value: carCO2, unit: 'kg CO2' }, { label: 'Flights', value: flightCO2, unit: 'kg CO2' }, { label: 'Total', value: total, unit: 'kg CO2' }, { label: 'Trees to Offset', value: trees }]} />
  },
  'flight-carbon2': (v) => {
    const dist = parseFloat(v.distance) || 5000; const passengers = parseFloat(v.passengers) || 1; const co2 = dist * 0.115 * passengers; const trees = Math.round(co2 / 21)
    return <MultiResult items={[{ label: 'Distance', value: dist, unit: 'km' }, { label: 'Passengers', value: passengers }, { label: 'CO2', value: co2, unit: 'kg' }, { label: 'Trees to Offset', value: trees }]} />
  },
  'flight-offset': (v) => {
    const dist = parseFloat(v.distance) || 5000; const passengers = parseFloat(v.passengers) || 1; const co2 = dist * 0.115 * passengers; const cost = parseFloat(v.costPer) || 0.02; const offset = co2 * cost
    return <MultiResult items={[{ label: 'CO2', value: co2, unit: 'kg' }, { label: 'Offset Cost', value: offset, unit: '$' }, { label: 'Passengers', value: passengers }]} />
  },
  'furniture-arr': (v) => {
    const roomW = parseFloat(v.roomW) || 0; const roomL = parseFloat(v.roomL) || 0; const walkway = parseFloat(v.walkway) || 0.9; const usableW = roomW - walkway * 2; const usableL = roomL - walkway * 2; const area = usableW * usableL
    return <MultiResult items={[{ label: 'Room', value: `${roomW}×-${roomL}`, unit: 'm' }, { label: 'Usable Area', value: area, unit: 'm²' }, { label: 'Walkway', value: walkway, unit: 'm' }]} />
  },
  'furniture-lay': (v) => {
    const roomW = parseFloat(v.roomW) || 0; const roomL = parseFloat(v.roomL) || 0; const sofa = parseFloat(v.sofa) || 2; const table = parseFloat(v.table) || 1; const remaining = roomW - sofa - table; const fit = remaining >= 1 ? 'Good fit' : 'Too tight'
    return <MultiResult items={[{ label: 'Room', value: `${roomW}×-${roomL}`, unit: 'm' }, { label: 'Remaining Space', value: remaining, unit: 'm' }, { label: 'Layout', value: fit }]} />
  },
  'room-size': (v) => {
    const w = parseFloat(v.width) || 0; const l = parseFloat(v.length) || 0; const area = w * l; const usage = area < 10 ? 'Small (closet)' : area < 20 ? 'Bedroom' : area < 40 ? 'Living room' : area < 80 ? 'Great room' : 'Open plan'
    return <MultiResult items={[{ label: 'Room Size', value: `${w}×-${l}`, unit: 'm' }, { label: 'Area', value: area, unit: 'm²' }, { label: 'Typical Usage', value: usage }]} />
  },
  'curtain-len': (v) => {
    const w = parseFloat(v.width) || 0; const h = parseFloat(v.height) || 0; const fullness = parseFloat(v.fullness) || 2; const fabricW = w * fullness; const panels = Math.ceil(fabricW / 1.37); const drop = v.mount || 'floor'; const dropCm = drop === 'floor' ? h + 15 : h - 5
    return <MultiResult items={[{ label: 'Fabric Width', value: fabricW, unit: 'm' }, { label: 'Panels', value: panels }, { label: 'Drop', value: dropCm, unit: 'cm' }]} />
  },
  'curtain-size2': (v) => {
    const w = parseFloat(v.width) || 0; const h = parseFloat(v.height) || 0; const recW = w * 1.5; const recH = h + 10
    return <MultiResult items={[{ label: 'Window', value: `${w}×-${h}`, unit: 'm' }, { label: 'Recommended Curtain', value: `${recW.toFixed(1)}×-${recH}`, unit: 'cm' }]} />
  },
  '50-30-20-budget-2': (v) => {
    const income = parseFloat(v.income) || 0; const needs = income * 0.5; const wants = income * 0.3; const savings = income * 0.2
    return <MultiResult items={[{ label: 'Monthly Income', value: income, unit: '$' }, { label: 'Needs (50%)', value: needs, unit: '$' }, { label: 'Wants (30%)', value: wants, unit: '$' }, { label: 'Savings (20%)', value: savings, unit: '$' }]} />
  },
  'budget-planner-calc': (v) => {
    const income = parseFloat(v.income) || 0; const housing = parseFloat(v.housing) || 0; const food = parseFloat(v.food) || 0; const transport = parseFloat(v.transport) || 0; const utilities = parseFloat(v.utilities) || 0; const other = parseFloat(v.other) || 0; const savingsGoal = parseFloat(v.savingsGoal) || 0; const totalExpenses = housing + food + transport + utilities + other; const remaining = income - totalExpenses - savingsGoal; const onTrack = remaining >= 0
    return <MultiResult items={[{ label: 'Total Income', value: income, unit: '$' }, { label: 'Total Expenses', value: totalExpenses, unit: '$' }, { label: 'Savings Goal', value: savingsGoal, unit: '$' }, { label: 'Remaining', value: remaining, unit: '$' }, { label: 'Budget Status', value: onTrack ? 'On Track' : 'Over Budget' }]} />
  },
  'budget-envelope': (v) => {
    const total = parseFloat(v.total) || 0; const groceries = parseFloat(v.groceries) || 0; const dining = parseFloat(v.dining) || 0; const entertainment = parseFloat(v.entertainment) || 0; const transport = parseFloat(v.transport) || 0; const other = parseFloat(v.other) || 0; const allocated = groceries + dining + entertainment + transport + other; const unallocated = total - allocated
    return <MultiResult items={[{ label: 'Total Cash', value: total, unit: '$' }, { label: 'Groceries', value: groceries, unit: '$' }, { label: 'Dining', value: dining, unit: '$' }, { label: 'Entertainment', value: entertainment, unit: '$' }, { label: 'Transport', value: transport, unit: '$' }, { label: 'Other', value: other, unit: '$' }, { label: 'Unallocated', value: unallocated, unit: '$' }]} />
  },
  'emergency-fund-calc': (v) => {
    const expenses = parseFloat(v.expenses) || 0; const months = parseFloat(v.months) || 6; const current = parseFloat(v.current) || 0; const target = expenses * months; const progress = target > 0 ? Math.min(100, current / target * 100) : 0; const remainingTarget = Math.max(0, target - current)
    return <MultiResult items={[{ label: 'Monthly Expenses', value: expenses, unit: '$' }, { label: 'Target Fund', value: target, unit: '$' }, { label: 'Current Saved', value: current, unit: '$' }, { label: 'Progress', value: progress.toFixed(1), unit: '%' }, { label: 'Still Needed', value: remainingTarget, unit: '$' }]} />
  },
  'net-worth-calc': (v) => {
    const home = parseFloat(v.home) || 0; const investments = parseFloat(v.investments) || 0; const cash = parseFloat(v.cash) || 0; const vehicles = parseFloat(v.vehicles) || 0; const otherAssets = parseFloat(v.otherAssets) || 0; const mortgage = parseFloat(v.mortgage) || 0; const loans = parseFloat(v.loans) || 0; const creditCards = parseFloat(v.creditCards) || 0; const otherLiabilities = parseFloat(v.otherLiabilities) || 0; const totalAssets = home + investments + cash + vehicles + otherAssets; const totalLiabilities = mortgage + loans + creditCards + otherLiabilities; const netWorth = totalAssets - totalLiabilities
    return <MultiResult items={[{ label: 'Total Assets', value: totalAssets, unit: '$' }, { label: 'Total Liabilities', value: totalLiabilities, unit: '$' }, { label: 'Net Worth', value: netWorth, unit: '$' }]} />
  },
  'net-worth-calc-2': (v) => {
    const assets = parseFloat(v.assets) || 0; const liabilities = parseFloat(v.liabilities) || 0; const netWorth = assets - liabilities
    return <MultiResult items={[{ label: 'Total Assets', value: assets, unit: '$' }, { label: 'Total Liabilities', value: liabilities, unit: '$' }, { label: 'Net Worth', value: netWorth, unit: '$' }]} />
  },
  'passive-income': (v) => {
    const investment = parseFloat(v.investment) || 0; const yieldRate = parseFloat(v.yieldRate) || 5; const monthlyAdd = parseFloat(v.monthlyAdd) || 0; const annualYield = investment * yieldRate / 100; const monthlyYield = annualYield / 12; const annualTotal = annualYield + monthlyAdd * 12; const monthlyTotal = monthlyYield + monthlyAdd
    return <MultiResult items={[{ label: 'Investment Value', value: investment, unit: '$' }, { label: 'Yield Rate', value: yieldRate, unit: '%' }, { label: 'Monthly Passive', value: monthlyTotal, unit: '$' }, { label: 'Annual Passive', value: annualTotal, unit: '$' }]} />
  },
  'debt-snowball': (v) => {
    const debt1 = parseFloat(v.debt1) || 0; const debt2 = parseFloat(v.debt2) || 0; const debt3 = parseFloat(v.debt3) || 0; const min1 = parseFloat(v.min1) || 0; const min2 = parseFloat(v.min2) || 0; const min3 = parseFloat(v.min3) || 0; const extra = parseFloat(v.extra) || 0;     const debts = [[debt1, min1, 'Debt 1'], [debt2, min2, 'Debt 2'], [debt3, min3, 'Debt 3']].filter((d: (number | string)[]) => (d[0] as number) > 0).sort((a, b) => (a[0] as number) - (b[0] as number)); const totalDebt = debts.reduce((s, d) => s + (d[0] as number), 0); const totalMin = debts.reduce((s, d) => s + (d[1] as number), 0); const totalPayment = totalMin + extra; const order = debts.map((d, i) => `${i + 1}. ${d[2]} ($${d[0]})`).join(' | '); const months = totalPayment > 0 && totalDebt > 0 ? Math.ceil(totalDebt / totalPayment) : 0
    return <MultiResult items={[{ label: 'Total Debt', value: totalDebt, unit: '$' }, { label: 'Payoff Order', value: order }, { label: 'Monthly Payment', value: totalPayment, unit: '$' }, { label: 'Est. Months', value: Math.max(1, months) }]} />
  },
  'debt-avalanche': (v) => {
    const debt1 = parseFloat(v.debt1) || 0; const debt2 = parseFloat(v.debt2) || 0; const debt3 = parseFloat(v.debt3) || 0; const rate1 = parseFloat(v.rate1) || 0; const rate2 = parseFloat(v.rate2) || 0; const rate3 = parseFloat(v.rate3) || 0; const min1 = parseFloat(v.min1) || 0; const min2 = parseFloat(v.min2) || 0; const min3 = parseFloat(v.min3) || 0; const extra = parseFloat(v.extra) || 0;     const debts = [[debt1, rate1, min1, 'Debt 1'], [debt2, rate2, min2, 'Debt 2'], [debt3, rate3, min3, 'Debt 3']].filter((d: (number | string)[]) => (d[0] as number) > 0).sort((a, b) => (b[1] as number) - (a[1] as number)); const totalDebt = debts.reduce((s, d) => s + (d[0] as number), 0); const totalMin = debts.reduce((s, d) => s + (d[2] as number), 0); const totalPayment = totalMin + extra; const order = debts.map((d, i) => `${i + 1}. ${d[3]} (${d[1]}%)`).join(' | '); const months = totalPayment > 0 && totalDebt > 0 ? Math.ceil(totalDebt / totalPayment) : 0
    return <MultiResult items={[{ label: 'Total Debt', value: totalDebt, unit: '$' }, { label: 'Payoff Order', value: order }, { label: 'Monthly Payment', value: totalPayment, unit: '$' }, { label: 'Est. Months', value: Math.max(1, months) }]} />
  },
  'zero-based-budget-2': (v) => {
    const income = parseFloat(v.income) || 0; const housing = parseFloat(v.housing) || 0; const food = parseFloat(v.food) || 0; const transport = parseFloat(v.transport) || 0; const utilities = parseFloat(v.utilities) || 0; const savings = parseFloat(v.savings) || 0; const other = parseFloat(v.other) || 0; const totalOut = housing + food + transport + utilities + savings + other; const leftover = income - totalOut; const balanced = Math.abs(leftover) < 0.01
    return <MultiResult items={[{ label: 'Total Income', value: income, unit: '$' }, { label: 'Total Allocated', value: totalOut, unit: '$' }, { label: 'Leftover', value: leftover, unit: '$' }, { label: 'Status', value: balanced ? 'Balanced ✓' : leftover > 0 ? 'Unallocated' : 'Over Allocated' }]} />
  },
  'paypal-fees': (v) => {
    const amount = parseFloat(v.amount) || 0; const type = v.type || 'domestic'; const feePct = type === 'domestic' ? 0.0299 : 0.0449; const fixedFee = 0.49; const fee = amount * feePct + fixedFee; const net = amount - fee
    return <MultiResult items={[{ label: 'Fee', value: fee, unit: '$' }, { label: 'You Receive', value: net, unit: '$' }, { label: 'Buyer Pays', value: amount, unit: '$' }, { label: 'Type', value: type === 'domestic' ? 'Domestic' : 'International' }]} />
  },
  'stripe-fees': (v) => {
    const amount = parseFloat(v.amount) || 0; const cardType = v.cardType || 'credit'; const rates: Record<string, { pct: number; fixed: number }> = { credit: { pct: 0.029, fixed: 0.30 }, debit: { pct: 0, fixed: 0.05 }, amex: { pct: 0.035, fixed: 0.30 } }; const r = rates[cardType] || rates.credit; const fee = amount * r.pct + r.fixed; const net = amount - fee
    return <MultiResult items={[{ label: 'Fee', value: fee, unit: '$' }, { label: 'Net Amount', value: net, unit: '$' }, { label: 'Effective Rate', value: (fee / amount * 100).toFixed(2), unit: '%' }]} />
  },
  'ebay-fees': (v) => {
    const price = parseFloat(v.salePrice) || 0; const category = v.category || 'general'; const store = v.store || 'store-none'; const baseRate: Record<string, number> = { electronics: 0.1325, clothing: 0.15, sports: 0.1325, home: 0.1325, general: 0.1325 }; const storeDiscount: Record<string, number> = { 'store-none': 0, 'store-basic': 0.009, 'store-premium': 0.0265 }; const pct = baseRate[category] || 0.1325; const discount = storeDiscount[store] || 0; const fee = price * (pct - discount); const net = price - fee
    return <MultiResult items={[{ label: 'Final Value Fee', value: fee, unit: '$' }, { label: 'Net Proceeds', value: net, unit: '$' }, { label: 'Effective Rate', value: ((pct - discount) * 100).toFixed(2), unit: '%' }]} />
  },
  'etsy-fees': (v) => {
    const price = parseFloat(v.itemPrice) || 0; const qty = parseFloat(v.qty) || 1; const shipping = parseFloat(v.shipping) || 0; const subtotal = price * qty + shipping; const listingFee = 0.20 * qty; const transFee = subtotal * 0.065; const paymentFee = subtotal * 0.03 + 0.25; const totalFees = listingFee + transFee + paymentFee; const netRevenue = price * qty - totalFees
    return <MultiResult items={[{ label: 'Listing Fees', value: listingFee, unit: '$' }, { label: 'Transaction Fee', value: transFee, unit: '$' }, { label: 'Payment Processing', value: paymentFee, unit: '$' }, { label: 'Total Fees', value: totalFees, unit: '$' }, { label: 'Net Revenue', value: netRevenue, unit: '$' }]} />
  },
  'amazon-fba': (v) => {
    const price = parseFloat(v.itemPrice) || 0; const category = v.category || 'general'; const sizeTier = v.sizeTier || 's-standard'; const refPct: Record<string, number> = { electronics: 0.15, clothing: 0.17, books: 0.15, home: 0.15, general: 0.15 }; const fulfillFee: Record<string, number> = { 's-small': 3.07, 's-standard': 5.07, 's-large': 7.55, 's-oversize': 15.00 }; const refFee = price * (refPct[category] || 0.15); const fulfill = fulfillFee[sizeTier] || 5.07; const netProfit = price - refFee - fulfill
    return <MultiResult items={[{ label: 'Referral Fee', value: refFee, unit: '$' }, { label: 'Fulfillment Fee', value: fulfill, unit: '$' }, { label: 'Net Profit', value: netProfit, unit: '$' }]} />
  },
  'crowdfunding-fee': (v) => {
    const goal = parseFloat(v.goal) || 0; const platform = v.platform || 'kickstarter'; const platPct = 0.05; const paymentPct = 0.03; const fixedFee = platform === 'kickstarter' ? 0.20 : 0.30; const platFee = goal * platPct; const paymentFee = goal * paymentPct + fixedFee; const totalFees = platFee + paymentFee; const netRaised = goal - totalFees
    return <MultiResult items={[{ label: 'Platform Fee', value: platFee, unit: '$' }, { label: 'Processing Fee', value: paymentFee, unit: '$' }, { label: 'Net Raised', value: netRaised, unit: '$' }, { label: 'Total Fees', value: totalFees, unit: '$' }]} />
  },
  'pawn-loan': (v) => {
    const itemValue = parseFloat(v.itemValue) || 0; const loanPct = parseFloat(v.loanPct) || 30; const monthlyRate = parseFloat(v.monthlyRate) || 5; const months = parseFloat(v.months) || 1; const loanAmount = itemValue * (loanPct / 100); const monthlyInterest = loanAmount * (monthlyRate / 100); const totalInterest = monthlyInterest * months; const totalRepay = loanAmount + totalInterest
    return <MultiResult items={[{ label: 'Loan Amount', value: loanAmount, unit: '$' }, { label: 'Monthly Interest', value: monthlyInterest, unit: '$' }, { label: 'Total Interest', value: totalInterest, unit: '$' }, { label: 'Total to Repay', value: totalRepay, unit: '$' }]} />
  },
  'craps-odds': (v) => {
    const betAmount = parseFloat(v.betAmount) || 0; const betType = v.betType || 'craps-pass'; const odds: Record<string, { payout: string; houseEdge: string }> = { 'craps-pass': { payout: '1:1', houseEdge: '1.41%' }, 'craps-dont-pass': { payout: '1:1', houseEdge: '1.36%' }, 'craps-come': { payout: '1:1', houseEdge: '1.41%' }, 'craps-dont-come': { payout: '1:1', houseEdge: '1.36%' }, 'craps-field': { payout: '1:1 (2:1 on 2/12)', houseEdge: '2.78%' } }; const info = odds[betType] || odds['craps-pass']; const payoutAmount = betAmount; const labels: Record<string, string> = { 'craps-pass': 'Pass Line', 'craps-dont-pass': "Don't Pass", 'craps-come': 'Come', 'craps-dont-come': "Don't Come", 'craps-field': 'Field' }
    return <MultiResult items={[{ label: 'Bet Type', value: labels[betType] || betType }, { label: 'Payout Odds', value: info.payout }, { label: 'Payout Amount', value: payoutAmount, unit: '$' }, { label: 'House Edge', value: info.houseEdge }]} />
  },
  'roulette-odds': (v) => {
    const betAmount = parseFloat(v.betAmount) || 0; const betType = v.betType || 'roulette-red-black'; const wheelType = v.wheelType || 'european'; const slots = wheelType === 'european' ? 37 : 38; const payoutInfo: Record<string, { payout: number; winSpots: number }> = { 'roulette-red-black': { payout: 1, winSpots: 18 }, 'roulette-single': { payout: 35, winSpots: 1 }, 'roulette-split': { payout: 17, winSpots: 2 }, 'roulette-street': { payout: 11, winSpots: 3 }, 'roulette-corner': { payout: 8, winSpots: 4 } }; const info = payoutInfo[betType] || payoutInfo['roulette-red-black']; const winProb = info.winSpots / slots; const ev = betAmount * (winProb * (1 + info.payout) - 1)
    return <MultiResult items={[{ label: 'Win Probability', value: (winProb * 100).toFixed(1), unit: '%' }, { label: 'Payout', value: `${info.payout}:1` }, { label: 'Expected Value', value: ev, unit: '$' }, { label: 'Wheel', value: wheelType === 'european' ? 'European' : 'American' }]} />
  },
  'parlay-odds': (v) => {
    const legs = Math.floor(parseFloat(v.legs) || 2); const oddsDec = parseFloat(v.oddsDecimal) || 2; const stake = parseFloat(v.stake) || 0; const parlayOdds = Math.pow(oddsDec, legs); const payout = stake * parlayOdds; const profit = payout - stake; const impliedProb = (1 / parlayOdds) * 100
    return <MultiResult items={[{ label: 'Parlay Odds', value: parlayOdds.toFixed(2) }, { label: 'Total Payout', value: payout, unit: '$' }, { label: 'Profit', value: profit, unit: '$' }, { label: 'Implied Probability', value: impliedProb.toFixed(2), unit: '%' }]} />
  },
  'prop-bet': (v) => {
    const stake = parseFloat(v.stake) || 0; const yesOdds = parseInt(v.yesOdds) || 0; const noOdds = parseInt(v.noOdds) || 0; const americanToProb = (odds: number): number => odds > 0 ? 100 / (odds + 100) : Math.abs(odds) / (Math.abs(odds) + 100); const yesProb = americanToProb(yesOdds); const noProb = americanToProb(noOdds); const totalProb = yesProb + noProb; const breakEven = totalProb > 0 ? yesProb / totalProb * 100 : 50; const yesPayout = yesOdds > 0 ? stake * (1 + yesOdds / 100) : stake * (1 + 100 / Math.abs(yesOdds)); const noPayout = noOdds > 0 ? stake * (1 + noOdds / 100) : stake * (1 + 100 / Math.abs(noOdds))
    return <MultiResult items={[{ label: 'Yes Payout', value: yesPayout, unit: '$' }, { label: 'No Payout', value: noPayout, unit: '$' }, { label: 'Yes Implied Prob', value: (yesProb * 100).toFixed(1), unit: '%' }, { label: 'Break-Even Prob', value: breakEven.toFixed(1), unit: '%' }]} />
  },
  'sports-betting-odds': (v) => {
    const stake = parseFloat(v.stake) || 0; const oddsAmerican = parseInt(v.oddsAmerican) || -110; const profit = oddsAmerican > 0 ? stake * (oddsAmerican / 100) : stake * (100 / Math.abs(oddsAmerican)); const totalReturn = stake + profit; const impliedProb = oddsAmerican > 0 ? 100 / (oddsAmerican + 100) * 100 : Math.abs(oddsAmerican) / (Math.abs(oddsAmerican) + 100) * 100
    return <MultiResult items={[{ label: 'Profit', value: profit, unit: '$' }, { label: 'Total Return', value: totalReturn, unit: '$' }, { label: 'Implied Probability', value: impliedProb.toFixed(1), unit: '%' }]} />
  },
  'blackjack-basic': (v) => {
    const handValue = Math.floor(parseFloat(v.handValue) || 0); const dealerUp = Math.floor(parseFloat(v.dealerUp) || 0); const getAction = (hand: number, dealer: number): string => { if (hand <= 8) return 'Hit'; if (hand === 9) return dealer >= 3 && dealer <= 6 ? 'Double' : 'Hit'; if (hand === 10) return dealer >= 2 && dealer <= 9 ? 'Double' : 'Hit'; if (hand === 11) return dealer >= 2 && dealer <= 10 ? 'Double' : 'Hit'; if (hand === 12) return dealer >= 4 && dealer <= 6 ? 'Stand' : 'Hit'; if (hand >= 13 && hand <= 16) return dealer >= 2 && dealer <= 6 ? 'Stand' : 'Hit'; if (hand >= 17) return 'Stand'; return 'Hit' }; const action = getAction(handValue, dealerUp)
    return <MultiResult items={[{ label: 'Your Hand', value: handValue }, { label: 'Dealer Up-Card', value: dealerUp === 11 ? 'Ace' : String(dealerUp) }, { label: 'Action', value: action }]} />
  },
  'generator-sizing': (v) => {
    const sqft = parseFloat(v.sqft) || 1500; const ac = v.ac === 'yes' ? 3500 : 0; const fridge = v.fridge === 'yes' ? 600 : 0; const wellPump = v.wellPump === 'yes' ? 1500 : 0; const sump = v.sump === 'yes' ? 800 : 0; const lights = v.lights === 'yes' ? 500 : 0; const baseTotal = ac + fridge + wellPump + sump + lights; const safety = baseTotal * 0.2; const totalWatts = baseTotal + safety; const totalKw = totalWatts / 1000
    return <MultiResult items={[{ label: 'Essential Load', value: baseTotal, unit: 'W' }, { label: 'Safety Margin (20%)', value: safety, unit: 'W' }, { label: 'Generator Size', value: totalWatts, unit: 'W' }, { label: 'Generator Size', value: totalKw, unit: 'kW' }]} />
  },
  'furnace-cost': (v) => {
    const sqft = parseFloat(v.sqft) || 2000; const efficiency = v.efficiency || '80'; const region = v.region || 'midwest'; const baseCost = 3000 + sqft * 0.5; const upgrade = efficiency === '95' ? 2500 : 0; const regionMultiplier: Record<string, number> = { northeast: 1.2, south: 0.85, midwest: 1.0, west: 1.15 }; const mult = regionMultiplier[region] || 1; const total = (baseCost + upgrade) * mult
    return <MultiResult items={[{ label: 'Base Cost', value: baseCost, unit: '$' }, { label: 'Efficiency Upgrade', value: upgrade, unit: '$' }, { label: 'Region Factor', value: mult }, { label: 'Total Estimated Cost', value: total, unit: '$' }]} />
  },
  'pool-chemical-calc': (v) => {
    const volume = parseFloat(v.volume) || 20000; const chemical = v.chemical || 'chlorine'; const current = parseFloat(v.currentLevel) || 0; const target = parseFloat(v.targetLevel) || 3; const factors: Record<string, number> = { chlorine: 10, ph_up: 25, ph_down: 25, alkalinity_up: 17, shock: 5 }; const factor = factors[chemical] || 10; const doseOz = (target - current) * volume / factor; const doseLbs = doseOz / 16; const label = chemical === 'ph_up' ? 'pH Up' : chemical === 'ph_down' ? 'pH Down' : chemical === 'alkalinity_up' ? 'Alkalinity Up' : chemical === 'shock' ? 'Pool Shock' : 'Chlorine'
    return <MultiResult items={[{ label: 'Chemical', value: label }, { label: 'Dose Needed', value: doseOz, unit: 'oz' }, { label: 'Dose Needed', value: doseLbs, unit: 'lbs' }, { label: 'Pool Volume', value: volume, unit: 'gal' }]} />
  },
  'pool-heating-cost': (v) => {
    const volume = parseFloat(v.volume) || 20000; const desired = parseFloat(v.desiredTemp) || 82; const current = parseFloat(v.currentTemp) || 70; const rise = desired - current; const heaterType = v.heaterType || 'gas'; const costPer = parseFloat(v.costPer) || 1.5; const months = parseFloat(v.months) || 3; const btu = volume * 8.34 * rise; const efficiencyMap: Record<string, number> = { gas: 0.8, heat_pump: 4.0, solar: 0 }; const eff = efficiencyMap[heaterType] || 0.8; const monthlyCost = eff > 0 ? btu / 100000 * costPer * 30 / eff : 0; const seasonCost = monthlyCost * months
    return <MultiResult items={[{ label: 'BTU Needed', value: btu, unit: 'BTU' }, { label: 'Monthly Cost', value: monthlyCost, unit: '$' }, { label: 'Season Cost', value: seasonCost, unit: '$' }, { label: 'Temp Rise', value: rise, unit: 'F' }]} />
  },
  'solar-panel-calc': (v) => {
    const bill = parseFloat(v.monthlyBill) || 200; const sun = parseFloat(v.sunlight) || 5; const eff = (parseFloat(v.systemEfficiency) || 80) / 100; const rate = 0.12; const systemKw = bill / (sun * 30 * eff * rate); const panels = Math.ceil(systemKw * 1000 / 400); const cost = systemKw * 2500; const annualSavings = bill * 12; const payback = cost / annualSavings
    return <MultiResult items={[{ label: 'System Size', value: systemKw, unit: 'kW' }, { label: 'Panels Needed', value: panels }, { label: 'Est. Cost', value: cost, unit: '$' }, { label: 'Payback Period', value: payback, unit: 'years' }]} />
  },
  'space-heater-cost': (v) => {
    const watts = parseFloat(v.watts) || 1500; const hours = parseFloat(v.hours) || 8; const rate = parseFloat(v.rate) || 0.12; const daily = watts * hours / 1000 * rate; const monthly = daily * 30; const yearly = daily * 365
    return <MultiResult items={[{ label: 'Daily Cost', value: daily, unit: '$' }, { label: 'Monthly Cost', value: monthly, unit: '$' }, { label: 'Yearly Cost', value: yearly, unit: '$' }]} />
  },
  'leak-detection': (v) => {
    const drips = parseFloat(v.dripsPerMin) || 60; const hours = parseFloat(v.hoursPerDay) || 24; const galPerDrip = 0.00025; const daily = drips * 60 * hours * galPerDrip; const monthly = daily * 30; const yearly = daily * 365; const costGal = 0.004; const yearlyCost = yearly * costGal
    return <MultiResult items={[{ label: 'Water Wasted/Day', value: daily, unit: 'gal' }, { label: 'Water Wasted/Month', value: monthly, unit: 'gal' }, { label: 'Water Wasted/Year', value: yearly, unit: 'gal' }, { label: 'Yearly Cost', value: yearlyCost, unit: '$' }]} />
  },
  'phantom-load': (v) => {
    const devices = parseFloat(v.devices) || 10; const avgW = parseFloat(v.avgStandby) || 20; const rate = parseFloat(v.rate) || 0.12; const dailyKwh = devices * avgW * 24 / 1000; const monthlyCost = dailyKwh * 30 * rate; const yearlyCost = dailyKwh * 365 * rate
    return <MultiResult items={[{ label: 'Daily Phantom Load', value: dailyKwh, unit: 'kWh' }, { label: 'Monthly Cost', value: monthlyCost, unit: '$' }, { label: 'Yearly Cost', value: yearlyCost, unit: '$' }]} />
  },
  'pest-control-cost': (v) => {
    const sqft = parseFloat(v.sqft) || 2000; const pest = v.pestType || 'ants'; const treatment = v.treatmentType || 'quarterly'; const sev = v.severity || 'moderate'; const baseCosts: Record<string, number> = { ants: 150, roaches: 200, termites: 500, bed_bugs: 800, rodents: 250, mosquitoes: 100 }; const severityMult: Record<string, number> = { mild: 1, moderate: 1.5, severe: 2.5 }; const freqMult: Record<string, number> = { 'one-time': 1, quarterly: 4, monthly: 12 }; const perVisit = (baseCosts[pest] || 150) * (severityMult[sev] || 1.5); const annual = sqft > 2000 ? perVisit * (freqMult[treatment] || 4) * 1.1 : perVisit * (freqMult[treatment] || 4)
    return <MultiResult items={[{ label: 'Per Visit Cost', value: perVisit, unit: '$' }, { label: 'Annual Total', value: annual, unit: '$' }, { label: 'Frequency', value: treatment === 'one-time' ? 'One-Time' : treatment === 'quarterly' ? 'Quarterly' : 'Monthly' }]} />
  },
  'shower-time-cost': (v) => {
    const mins = parseFloat(v.showerMins) || 10; const flow = parseFloat(v.flowRate) || 2.0; const waterCost = parseFloat(v.waterCost) || 0.005; const heaterType = v.heaterType || 'electric'; const gal = mins * flow; const waterCharge = gal * waterCost; const energyFactor: Record<string, { kwhPerGal: number }> = { electric: { kwhPerGal: 0.12 }, gas: { kwhPerGal: 0.015 }, heat_pump: { kwhPerGal: 0.05 } }; const factor = energyFactor[heaterType] || energyFactor.electric; const energyKwh = gal * factor.kwhPerGal; const energyCost = energyKwh * 0.12; const perShower = waterCharge + energyCost; const daily = perShower; const monthly = daily * 30; const yearly = daily * 365
    return <MultiResult items={[{ label: 'Water Used', value: gal, unit: 'gal' }, { label: 'Cost Per Shower', value: perShower, unit: '$' }, { label: 'Monthly Cost', value: monthly, unit: '$' }, { label: 'Yearly Cost', value: yearly, unit: '$' }]} />
  },
  'toilet-flush-cost': (v) => {
    const flushes = parseFloat(v.flushesPerDay) || 5; const gpf = parseFloat(v.gallonsPerFlush) || 1.6; const cost = parseFloat(v.waterCost) || 0.005; const daily = flushes * gpf * cost; const weekly = daily * 7; const monthly = daily * 30; const yearly = daily * 365; const oldDaily = flushes * 1.6 * cost; const savings = oldDaily - daily; const savingsYearly = savings * 365
    return <MultiResult items={[{ label: 'Daily Cost', value: daily, unit: '$' }, { label: 'Monthly Cost', value: monthly, unit: '$' }, { label: 'Yearly Cost', value: yearly, unit: '$' }, { label: 'Savings vs 1.6 GPF', value: savingsYearly, unit: '$/yr' }]} />
  },
  'cashback-calc': (v) => {
    const spend = parseFloat(v.annualSpend) || 20000; const rate = parseFloat(v.cashbackRate) || 2; const cat = v.category || 'flat'; let annualCashback = spend * rate / 100; let effectiveRate = rate; if (cat === 'rotating') { const capped = Math.min(spend, 6000); annualCashback = capped * 0.05 + (spend - capped) * 0.01; effectiveRate = annualCashback / spend * 100 }
    return <MultiResult items={[{ label: 'Annual Spending', value: spend, unit: '$' }, { label: 'Annual Cashback', value: annualCashback, unit: '$' }, { label: 'Effective Rate', value: effectiveRate, unit: '%' }]} />
  },
  'rebate-calc': (v) => {
    const price = parseFloat(v.purchasePrice) || 500; const rebate = parseFloat(v.rebateAmount) || 50; const mailIn = v.mailIn === 'yes'; const tax = parseFloat(v.taxRate) || 8; const taxAmt = price * tax / 100; const grossCost = price + taxAmt; const finalCost = mailIn ? grossCost - rebate : (price - rebate) + taxAmt; const savings = grossCost - finalCost; const savingsPct = grossCost > 0 ? savings / grossCost * 100 : 0
    return <MultiResult items={[{ label: 'Full Price + Tax', value: grossCost, unit: '$' }, { label: 'Net Cost After Rebate', value: finalCost, unit: '$' }, { label: 'You Save', value: savings, unit: '$' }, { label: 'Effective Savings', value: savingsPct, unit: '%' }]} />
  },
  'loyalty-rewards': (v) => {
    const points = parseFloat(v.pointsPerDollar) || 2; const spend = parseFloat(v.annualSpend) || 20000; const value = parseFloat(v.redemptionValue) || 1; const pointsEarned = spend * points; const dollarValue = pointsEarned * value / 100; const returnPct = dollarValue / spend * 100
    return <MultiResult items={[{ label: 'Points Earned/Year', value: pointsEarned }, { label: 'Dollar Value', value: dollarValue, unit: '$' }, { label: 'Effective Return', value: returnPct, unit: '%' }]} />
  },
  'consignment-pricing': (v) => {
    const price = parseFloat(v.itemPrice) || 100; const commission = parseFloat(v.commissionRate) || 40; const platform = v.platform || 'online'; const platformSurcharge = platform === 'brick-mortar' ? 5 : 0; const totalCommission = commission + platformSurcharge; const fee = price * totalCommission / 100; const payout = price - fee; const platformLabel = platform === 'online' ? 'Online' : 'Brick & Mortar'
    return <MultiResult items={[{ label: 'Your Payout', value: payout, unit: '$' }, { label: 'Platform Fee', value: fee, unit: '$' }, { label: 'Platform', value: platformLabel }]} />
  },
  'craigslist-pricing': (v) => {
    const age = parseFloat(v.itemAge) || 12; const origPrice = parseFloat(v.originalPrice) || 1000; const cond = v.condition || 'good'; const dem = v.demand || 'medium'; const condFactors: Record<string, number> = { 'like-new': 0.9, good: 0.7, fair: 0.5, poor: 0.3 }; const demMod: Record<string, number> = { high: 1.1, medium: 1.0, low: 0.9 }; const ageFactor = Math.max(0.3, 1 - age * 0.02); const fairPrice = origPrice * (condFactors[cond] || 0.7) * (demMod[dem] || 1) * ageFactor
    return <MultiResult items={[{ label: 'Original Price', value: origPrice, unit: '$' }, { label: 'Fair Price', value: fairPrice, unit: '$' }, { label: 'Depreciation', value: ((1 - ageFactor) * 100).toFixed(0), unit: '%' }, { label: 'Condition', value: cond === 'like-new' ? 'Like New' : cond.charAt(0).toUpperCase() + cond.slice(1) }]} />
  },
  'auction-hammer': (v) => {
    const hammer = parseFloat(v.hammerPrice) || 1000; const bp = parseFloat(v.buyersPremium) || 20; const sc = parseFloat(v.sellersCommission) || 15; const vatOn = v.vatOnPremium === 'yes'; const vatRate = parseFloat(v.vatRate) || 20; const premiumAmt = hammer * bp / 100; const vatAmt = vatOn ? premiumAmt * vatRate / 100 : 0; const buyerTotal = hammer + premiumAmt + vatAmt; const commissionAmt = hammer * sc / 100; const sellerNet = hammer - commissionAmt
    return <MultiResult items={[{ label: 'Buyer Total', value: buyerTotal, unit: '$' }, { label: "Buyer's Premium", value: premiumAmt, unit: '$' }, { label: 'Seller Net', value: sellerNet, unit: '$' }, { label: "Seller's Commission", value: commissionAmt, unit: '$' }]} />
  },
  'diaper-cost': (v) => {
    const dpd = parseFloat(v.diapersPerDay) || 8; const cpd = parseFloat(v.costPerDiaper) || 0.25; const daily = dpd * cpd; const monthly = daily * 30; const yearly = daily * 365; const total25 = yearly * 2.5
    return <MultiResult items={[{ label: 'Daily Cost', value: daily, unit: '$' }, { label: 'Monthly Cost', value: monthly, unit: '$' }, { label: 'Yearly Cost', value: yearly, unit: '$' }, { label: 'Total (2.5 yrs)', value: total25, unit: '$' }]} />
  },
  'formula-cost': (v) => {
    const oz = parseFloat(v.ozPerFeeding) || 4; const feed = parseFloat(v.feedingsPerDay) || 8; const cpo = parseFloat(v.costPerOz) || 0.15; const dailyOz = oz * feed; const dailyCost = dailyOz * cpo; const monthly = dailyCost * 30; const firstYear = monthly * 12
    return <MultiResult items={[{ label: 'Daily Cost', value: dailyCost, unit: '$' }, { label: 'Monthly Cost', value: monthly, unit: '$' }, { label: 'First Year Total', value: firstYear, unit: '$' }]} />
  },
  'baby-gear': (v) => {
    const stroller = parseFloat(v.stroller) || 300; const carSeat = parseFloat(v.carSeat) || 250; const crib = parseFloat(v.crib) || 400; const clothes = parseFloat(v.clothes) || 500; const bottles = parseFloat(v.bottles) || 50; const highChair = parseFloat(v.highChair) || 150; const other = parseFloat(v.babyOther) || 200; const total = stroller + carSeat + crib + clothes + bottles + highChair + other
    return <MultiResult items={[{ label: 'Stroller', value: stroller, unit: '$' }, { label: 'Car Seat', value: carSeat, unit: '$' }, { label: 'Crib', value: crib, unit: '$' }, { label: 'Clothes', value: clothes, unit: '$' }, { label: 'Bottles/Gear', value: bottles + highChair + other, unit: '$' }, { label: 'Total', value: total, unit: '$' }]} />
  },
  'college-fund': (v) => {
    const childAge = parseFloat(v.childAge) || 5; const collegeAge = parseFloat(v.collegeAge) || 18; const current = parseFloat(v.currentSavings) || 0; const monthly = parseFloat(v.monthlyContribution) || 200; const ret = parseFloat(v.expectedReturn) || 6; const tuition = parseFloat(v.tuitionCost) || 20000; const years = collegeAge - childAge; const months = years * 12; const r = ret / 100 / 12; const fvContributions = monthly * (Math.pow(1 + r, months) - 1) / r; const fvCurrent = current * Math.pow(1 + ret / 100, years); const projected = fvCurrent + fvContributions; const target = tuition * 4; const diff = projected - target
    return <MultiResult items={[{ label: 'Projected Savings', value: projected, unit: '$' }, { label: 'Target (4 yrs)', value: target, unit: '$' }, { label: 'Shortfall/Surplus', value: diff, unit: '$' }, { label: 'Years to College', value: years }]} />
  },
  'college-savings-calc': (v) => {
    const childAge = parseFloat(v.childAge) || 5; const deduction = parseFloat(v.stateTaxDeduction) || 0; const contribution = parseFloat(v.monthlyContribution) || 250; const ret = parseFloat(v.expectedReturn) || 6; const infl = parseFloat(v.tuitionInflation) || 5; const years = 18 - childAge; const months = years * 12; const r = ret / 100 / 12; const fv = contribution * (Math.pow(1 + r, months) - 1) / r; const projectedTuition = 20000 * Math.pow(1 + infl / 100, years); const covers = fv >= projectedTuition
    return <MultiResult items={[{ label: 'Projected Value', value: fv, unit: '$' }, { label: 'Projected Tuition/yr', value: projectedTuition, unit: '$' }, { label: 'Covers Tuition?', value: covers ? 'Yes' : 'No' }]} />
  },
  'pet-insurance': (v) => {
    const type = v.petType || 'dog'; const age = parseFloat(v.petAge) || 3; const cov = v.coverageLevel || 'accident+illness'; const ded = parseFloat(v.deductible) || 250; const reimb = parseFloat(v.reimbursement) || 80; const vetCost = parseFloat(v.annualVetCost) || 800; const baseRate = type === 'dog' ? 30 : 20; const ageMult = 1 + Math.max(0, age - 1) * 0.1; const covMult = cov === 'comprehensive' ? 1.8 : cov === 'accident+illness' ? 1.3 : 0.7; const dedFactor = 1 - (ded - 100) / 900 * 0.2; const monthly = baseRate * ageMult * covMult * dedFactor; const annual = monthly * 12; const payout = Math.min(vetCost * reimb / 100, vetCost - ded); const savings = vetCost - annual
    return <MultiResult items={[{ label: 'Monthly Premium', value: monthly, unit: '$' }, { label: 'Annual Premium', value: annual, unit: '$' }, { label: 'Uninsured Vet Cost', value: vetCost, unit: '$' }, { label: 'Annual Savings', value: savings >= 0 ? savings.toFixed(0) : '($' + Math.abs(savings).toFixed(0) + ')', unit: '$' }]} />
  },
  'towing-capacity': (v) => {
    const gvwr = parseFloat(v.gvwr) || 6000; const curb = parseFloat(v.curbWeight) || 4000; const payload = parseFloat(v.payload) || 500; const twPct = parseFloat(v.tongueWeightPercent) || 12; const trailer = parseFloat(v.trailerWeight) || 2000; const maxTow = gvwr - curb - payload; const tw = trailer * twPct / 100; const safe = trailer <= maxTow
    return <MultiResult items={[{ label: 'Max Towing Capacity', value: maxTow, unit: 'lbs' }, { label: 'Trailer Weight', value: trailer, unit: 'lbs' }, { label: 'Tongue Weight', value: tw, unit: 'lbs' }, { label: 'Status', value: safe ? 'Safe to Tow' : 'OVER CAPACITY' }]} />
  },
  'tire-pressure-calc': (v) => {
    const cur = parseFloat(v.currentPressure) || 30; const rec = parseFloat(v.recommendedPressure) || 32; const ld = v.load || 'normal'; const temp = v.temperature || 'summer'; const ldAdj = ld === 'heavy' ? 4 : ld === 'light' ? -2 : 0; const tempAdj = temp === 'winter' ? -3 : 0; const adjRec = rec + ldAdj + tempAdj; const diff = cur - adjRec
    return <MultiResult items={[{ label: 'Recommended (adjusted)', value: adjRec, unit: 'PSI' }, { label: 'Current Pressure', value: cur, unit: 'PSI' }, { label: 'Adjustment Needed', value: diff >= 0 ? '+' + diff.toFixed(0) : diff.toFixed(0), unit: 'PSI' }]} />
  },
  'qr-code-generator': (v) => {
    const ct = v.contentType || 'url'; const ec = v.errorCorrection || 'M'; const sizes: Record<string, number> = { url: 4296, text: 7089, phone: 174, email: 160, wifi: 200 }; const ecMult: Record<string, number> = { L: 1.0, M: 0.75, Q: 0.5, H: 0.3 }; const maxCap = Math.round((sizes[ct] || 1000) * (ecMult[ec] || 0.75))
    return <MultiResult items={[{ label: 'Content Type', value: ct === 'url' ? 'URL' : ct === 'text' ? 'Text' : ct.charAt(0).toUpperCase() + ct.slice(1) }, { label: 'Error Correction', value: ec === 'L' ? 'Low (7%)' : ec === 'M' ? 'Medium (15%)' : ec === 'Q' ? 'Quartile (25%)' : 'High (30%)' }, { label: 'Max Characters', value: maxCap }]} />
  },
  'font-size-calc': (v) => {
    const base = parseFloat(v.baseSize) || 16; const scale = parseFloat(v.scaleRatio) || 1.25; const lv = v.level || 'body'; const levels: Record<string, number> = { h6: 1, h5: 2, h4: 3, h3: 4, h2: 5, h1: 6, body: 0, small: -1 }; const exp = levels[lv] || 0; const sizeVal = base * Math.pow(scale, exp)
    return <MultiResult items={[{ label: `${lv.toUpperCase()} Size`, value: sizeVal, unit: 'px' }, { label: 'Base Size', value: base, unit: 'px' }, { label: 'Scale Ratio', value: scale }, { label: 'H1 Size', value: base * Math.pow(scale, 6), unit: 'px' }]} />
  },
  'secret-santa': (v) => {
    const ppl = parseFloat(v.participants) || 5; const budget = parseFloat(v.maxBudget) || 25; const total = ppl * budget; const exchanges = ppl
    return <MultiResult items={[{ label: 'Budget Per Person', value: budget, unit: '$' }, { label: 'Total Budget', value: total, unit: '$' }, { label: 'Gift Exchanges', value: exchanges }]} />
  },
  'yard-sale': (v) => {
    const clothing = parseFloat(v.clothingValue) || 200; const furniture = parseFloat(v.furnitureValue) || 300; const books = parseFloat(v.booksValue) || 50; const toys = parseFloat(v.toysValue) || 100; const kitchen = parseFloat(v.kitchenValue) || 150; const elec = parseFloat(v.electronicsValue) || 200; const strat = v.strategy || 'fair'; const rates: Record<string, number> = { cheap: 0.1, fair: 0.2, premium: 0.35 }; const r = rates[strat] || 0.2; const totalRev = (clothing + furniture + books + toys + kitchen + elec) * r
    return <MultiResult items={[{ label: 'Clothing', value: clothing * r, unit: '$' }, { label: 'Furniture', value: furniture * r, unit: '$' }, { label: 'Books/Toys', value: (books + toys) * r, unit: '$' }, { label: 'Kitchen/Elec', value: (kitchen + elec) * r, unit: '$' }, { label: 'Total Revenue', value: totalRev, unit: '$' }]} />
  },
  'raffle-tickets': (v) => {
    const sold = parseFloat(v.ticketsSold) || 100; const yours = parseFloat(v.yourTickets) || 5; const prize = parseFloat(v.prizeValue) || 500; const price = parseFloat(v.ticketPrice) || 2; const total = sold + yours; const winProb = yours / total * 100; const ev = prize * (yours / total) - price
    return <MultiResult items={[{ label: 'Win Probability', value: winProb, unit: '%' }, { label: 'Expected Value', value: ev, unit: '$' }, { label: 'Total Tickets', value: total }]} />
  },
  'sweepstakes-entry': (v) => {
    const entries = parseFloat(v.entriesSubmitted) || 100; const totalEst = parseFloat(v.totalEntriesEstimated) || 5000; const prizes = parseFloat(v.numberOfPrizes) || 3; const winAny = 1 - Math.pow((totalEst - entries) / totalEst, prizes); const winFirst = entries / totalEst * 100
    return <MultiResult items={[{ label: 'Chance of Any Prize', value: (winAny * 100).toFixed(2), unit: '%' }, { label: 'Chance of 1st Prize', value: winFirst.toFixed(2), unit: '%' }, { label: 'Total Entries (est.)', value: totalEst }]} />
  },
  'side-hustle': (v) => {
    const rate = parseFloat(v.hourlyRate) || 25; const hrs = parseFloat(v.hoursPerWeek) || 10; const wks = parseFloat(v.weeksPerYear) || 48; const exp = parseFloat(v.expenses) || 500; const tax = parseFloat(v.taxRate) || 22; const gross = rate * hrs * wks; const taxes = gross * tax / 100; const net = gross - exp - taxes; const effRate = net / (hrs * wks)
    return <MultiResult items={[{ label: 'Gross Income', value: gross, unit: '$' }, { label: 'Net Income', value: net, unit: '$' }, { label: 'Effective Hourly Rate', value: effRate, unit: '$' }]} />
  },
  'spending-habit': (v) => {
    const coffee = parseFloat(v.coffee) || 5; const lunch = parseFloat(v.lunch) || 12; const snacks = parseFloat(v.snacks) || 4; const drinks2 = parseFloat(v.drinks) || 3; const trans = parseFloat(v.transportation) || 6; const daily = coffee + lunch + snacks + drinks2 + trans; const monthly = daily * 30; const yearly = daily * 365; const tenYear = yearly * 10; const future = yearly * (Math.pow(1.05, 10) - 1) / 0.05
    return <MultiResult items={[{ label: 'Daily', value: daily, unit: '$' }, { label: 'Monthly', value: monthly, unit: '$' }, { label: 'Yearly', value: yearly, unit: '$' }, { label: '10-Yr @ 5% Return', value: future.toFixed(0), unit: '$' }]} />
  },
  'funeral-cost': (v) => {
    const disp = v.disposition || 'burial'; const casket = parseFloat(v.casketCost) || 2000; const service = parseFloat(v.serviceFee) || 2000; const plot = parseFloat(v.burialPlot) || 3000; const stone = parseFloat(v.headstone) || 1500; const other = parseFloat(v.funeralOther) || 1000; const base = disp === 'burial' ? 5000 : 2500; const total = base + casket + service + plot + stone + other
    return <MultiResult items={[{ label: 'Disposition', value: disp === 'burial' ? 'Burial' : 'Cremation' }, { label: 'Casket/Urn', value: casket, unit: '$' }, { label: 'Service Fee', value: service, unit: '$' }, { label: 'Plot/Stone', value: plot + stone, unit: '$' }, { label: 'Total', value: total, unit: '$' }]} />
  },
  'charity-donation': (v) => {
    const amt = parseFloat(v.donationAmount) || 1000; const bracket = parseFloat(v.taxBracket) || 22; const item = v.itemized || 'yes'; const taxSavings = item === 'yes' ? amt * bracket / 100 : 0; const netCost = amt - taxSavings
    return <MultiResult items={[{ label: 'Donation Amount', value: amt, unit: '$' }, { label: 'Tax Savings', value: taxSavings, unit: '$' }, { label: 'Net Cost to You', value: netCost, unit: '$' }]} />
  },
  'dry-cleaning-cost': (v) => {
    const shirts = parseFloat(v.shirtsPerWeek) || 0; const suits = parseFloat(v.suitsPerWeek) || 0; const dresses = parseFloat(v.dressesPerWeek) || 0; const coats = parseFloat(v.coatsPerWeek) || 0; const pants = parseFloat(v.pantsPerWeek) || 0; const wks = parseFloat(v.weeksPerYear) || 48; const weekly = shirts * 3.5 + suits * 15 + dresses * 14 + coats * 22.5 + pants * 7.5; const monthly = weekly * 4.33; const yearly = weekly * wks
    return <MultiResult items={[{ label: 'Weekly Cost', value: weekly, unit: '$' }, { label: 'Monthly Cost', value: monthly, unit: '$' }, { label: 'Yearly Cost', value: yearly, unit: '$' }]} />
  },
  'travel-insurance': (v) => {
    const cost = parseFloat(v.tripCost) || 2000; const age = v.ageGroup || '31-50'; const cov = v.coverageType || 'standard'; const rates: Record<string, number> = { basic: 0.05, standard: 0.08, comprehensive: 0.12 }; const ageMult: Record<string, number> = { '18-30': 0.8, '31-50': 1, '51-65': 1.2, '66+': 1.5 }; const premium = cost * (rates[cov] || 0.08) * (ageMult[age] || 1)
    return <MultiResult items={[{ label: 'Trip Cost', value: cost, unit: '$' }, { label: 'Insurance Premium', value: premium, unit: '$' }, { label: 'Coverage', value: cov === 'basic' ? 'Basic (5%)' : cov === 'standard' ? 'Standard (8%)' : 'Comprehensive (12%)' }]} />
  },
  'renters-insurance': (v) => {
    const prop = parseFloat(v.propertyValue) || 30000; const ded = parseFloat(v.deductible) || 500; const liab = parseFloat(v.liability) || 300000; const base = 15 + (prop / 10000) * 2; const dedAdj = ded >= 1000 ? -3 : ded <= 250 ? 3 : 0; const liabAdj = (liab / 100000) * 2; const monthly = Math.max(10, base + dedAdj + liabAdj); const annual = monthly * 12
    return <MultiResult items={[{ label: 'Monthly Premium', value: monthly, unit: '$' }, { label: 'Annual Premium', value: annual, unit: '$' }, { label: 'Deductible', value: ded, unit: '$' }]} />
  },
  'security-deposit': (v) => {
    const rent = parseFloat(v.monthlyRent) || 1500; const depMos = parseFloat(v.depositMonths) || 1; const interest = v.stateRequiresInterest === 'yes'; const deposit = rent * depMos; const interestEarned = interest ? deposit * 0.01 : 0; const deductions = 200; const expectedReturn = deposit + interestEarned - deductions
    return <MultiResult items={[{ label: 'Deposit Required', value: deposit, unit: '$' }, { label: 'Interest Earned', value: interestEarned, unit: '$' }, { label: 'Est. Deductions', value: deductions, unit: '$' }, { label: 'Expected Return', value: Math.max(0, expectedReturn), unit: '$' }]} />
  },
  'wedding-guest': (v) => {
    const outfit = parseFloat(v.outfit) || 150; const trans = parseFloat(v.transportationCost) || 50; const nights = parseFloat(v.hotelNights) || 0; const hRate = parseFloat(v.hotelRate) || 200; const giftAmt = parseFloat(v.gift) || 100; const pre = v.hasPreWedding === 'yes' ? 200 : 0; const hotel = nights * hRate; const total = outfit + trans + hotel + giftAmt + pre
    return <MultiResult items={[{ label: 'Outfit', value: outfit, unit: '$' }, { label: 'Transport', value: trans, unit: '$' }, { label: 'Hotel', value: hotel, unit: '$' }, { label: 'Gift', value: giftAmt, unit: '$' }, { label: 'Total Cost', value: total, unit: '$' }]} />
  },
  'holiday-budget-2': (v) => {
    const total = parseFloat(v.totalBudget) || 1000; const gifts = parseFloat(v.gifts) || 0; const travel = parseFloat(v.travel) || 0; const food = parseFloat(v.food) || 0; const decor = parseFloat(v.decorations) || 0; const ent = parseFloat(v.entertainment) || 0; const planned = gifts + travel + food + decor + ent; const leftover = total - planned; const giftsRec = total * 0.5; const travelRec = total * 0.25; const foodRec = total * 0.15; const decorRec = total * 0.05; const entRec = total * 0.05
    return <MultiResult items={[{ label: 'Total Budget', value: total, unit: '$' }, { label: 'Planned Total', value: planned, unit: '$' }, { label: 'Gifts (rec 50%)', value: `${gifts} (${giftsRec.toFixed(0)} rec)`, unit: '$' }, { label: 'Travel (rec 25%)', value: `${travel} (${travelRec.toFixed(0)} rec)`, unit: '$' }, { label: 'Leftover', value: leftover, unit: '$' }]} />
  },
  'fundraiser-goal': (v) => {
    const target = parseFloat(v.targetAmount) || 10000; const donors = parseFloat(v.numberOfDonors) || 100; const avgDon = parseFloat(v.averageDonation) || 50; const plat = v.platform || 'gofundme'; const platFee = plat === 'gofundme' ? 0.029 : 0.05; const payFee = 0.03; const fixed = plat === 'gofundme' ? 0.30 : 0.20; const totalFees = target * platFee + target * payFee + fixed; const net = target - totalFees; const donorsNeeded = Math.ceil(target / avgDon)
    return <MultiResult items={[{ label: 'Net Raised After Fees', value: net, unit: '$' }, { label: 'Total Fees', value: totalFees, unit: '$' }, { label: 'Donors Needed', value: donorsNeeded }]} />
  },
  'biweekly-monthly': (v) => {
    const bi = parseFloat(v.biweeklyAmount) || 1000; const monthly = bi * 26 / 12; const annual = bi * 26
    return <MultiResult items={[{ label: 'Monthly', value: monthly, unit: '$' }, { label: 'Annual', value: annual, unit: '$' }, { label: 'Biweekly', value: bi, unit: '$' }]} />
  },
  'bonus-calc': (v) => {
    const bonus = parseFloat(v.bonusAmount) || 5000; const fed = parseFloat(v.bonusTaxRate) || 22; const state = parseFloat(v.stateTax) || 0; const ficaAmt = parseFloat(v.fica) || 7.65; const fedTax = bonus * fed / 100; const stateTaxAmt = bonus * state / 100; const ficaTax = bonus * ficaAmt / 100; const totalTax = fedTax + stateTaxAmt + ficaTax; const net = bonus - totalTax
    return <MultiResult items={[{ label: 'Gross Bonus', value: bonus, unit: '$' }, { label: 'Total Withholding', value: totalTax, unit: '$' }, { label: 'Net Take Home', value: net, unit: '$' }, { label: 'Effective Tax Rate', value: (totalTax / bonus * 100).toFixed(1), unit: '%' }]} />
  },
}

export const everydaySchemas: Record<string, z.ZodObject<any>> = {
  clothing: z.object({ us: numField('US Size', 0) }),
  ring: z.object({ mm: numField('Circumference (mm)', 0) }),
  cooking: z.object({ weight: numField('Weight (kg)', 0), method: sel(['roast', 'grill', 'bake', 'fry']) }),
  pace: z.object({ distance: numField('Distance (km)', 0), hours: numField('Hours', 0), mins: numField('Minutes', 0) }),
  steps: z.object({ steps: numField('Number of Steps', 0), stride: numField('Stride Length (m)', 0) }),
  water_intake: z.object({ weight: numField('Weight (kg)', 0), activity: numField('Activity (min)', 0) }),
  caffeine: z.object({ cups: numField('Cups', 0), type: sel(['drip', 'espresso', 'instant', 'cold', 'tea', 'energy']) }),
  alcohol: z.object({ volume: numField('Volume (mL)', 0), abv: numField('ABV (%)', 0) }),
  bac: z.object({ drinks: numField('Drinks', 0), weight: numField('Weight (kg)', 0), gender: sel(['male', 'female']), hours: numField('Hours', 0) }),
  habit_cost: z.object({ perDay: numField('Cost Per Unit ($)', 0), quantity: numField('Daily Quantity', 0) }),
  pet: z.object({ weight: numField('Pet Weight (kg)', 0), type: sel(['dog', 'cat']) }),
  pet_age: z.object({ years: numField('Pet Age (years)', 0), type: sel(['dog', 'cat']) }),
  party: z.object({ guests: numField('Number of Guests', 0), hours: numField('Party Duration (hrs)', 0) }),
  wedding: z.object({ guests: numField('Guest Count', 0), total: numField('Total Budget ($)', 0) }),
  moving: z.object({ distance: numField('Distance (km)', 0), items: numField('Items', 0), rooms: numField('Rooms', 0) }),
  cleaning: z.object({ rooms: numField('Rooms', 0), bath: numField('Bathrooms', 0), type: sel(['deep', 'standard', 'quick']) }),
  laundry: z.object({ loads: numField('Loads/Week', 0), costPer: numField('Cost Per Load ($)', 0) }),
  electricity: z.object({ watts: numField('Wattage (W)', 0), hours: numField('Hours/Day', 0), rate: numField('Rate ($/kWh)', 0) }),
  water_bill: z.object({ usage: numField('Usage (L)', 0), rate: numField('Rate ($/kL)', 0), base: numField('Base Fee ($)', 0) }),
  internet: z.object({ devices: numField('Devices', 0), streaming: yesno, gaming: yesno, work: yesno }),
  phone: z.object({ plan: numField('Plan Cost ($)', 0), lines: numField('Lines', 1), device: numField('Device Cost ($)', 0) }),
  streaming: z.object({ services: numField('Number of Services', 0), avgCost: numField('Avg Cost ($)', 0) }),
  grocery: z.object({ people: numField('People', 1), perPerson: numField('Per Person/Week ($)', 0) }),
  dining: z.object({ meals: numField('Meals/Week', 0), avgCost: numField('Avg Cost ($)', 0), savings: numField('Savings %', 0) }),
  gym: z.object({ monthly: numField('Monthly Fee ($)', 0), visits: numField('Visits/Month', 0), commute: numField('Commute Cost ($)', 0) }),
  maintenance: z.object({ homeValue: numField('Home Value ($)', 0), rule: numField('Rule (%)', 0) }),
  car_payment: z.object({ price: numField('Car Price ($)', 0), down: numField('Down Payment ($)', 0), rate: numField('Interest Rate (%)', 0), term: numField('Loan Term (months)', 0) }),
  car_cost: z.object({ payment: numField('Monthly Payment ($)', 0), insurance: numField('Insurance ($)', 0), gas: numField('Gas ($)', 0), maintenance: numField('Maintenance ($)', 0), km: numField('Monthly KM', 0) }),
  commute: z.object({ distance: numField('One-Way Distance (km)', 0), days: numField('Days/Week', 0), mpg: numField('Fuel Efficiency (mpg)', 0), gasPrice: numField('Gas Price ($/gal)', 0) }),
  tire: z.object({ width: numField('Width (mm)', 0), aspect: numField('Aspect Ratio', 0), rim: numField('Rim Diameter (in)', 0) }),
  lottery: z.object({ odds: numField('Odds (1 in X)', 0), ticket: numField('Ticket Price ($)', 0), jackpot: numField('Jackpot ($)', 0) }),
  battery: z.object({ mah: numField('Battery Capacity (mAh)', 0), ma: numField('Load Current (mA)', 0), voltage: numField('Voltage (V)', 0) }),
  photo: z.object({ widthPx: numField('Width (px)', 0), heightPx: numField('Height (px)', 0), dpi: numField('DPI', 0) }),
  file: z.object({ size: numField('File Size', 0), speed: numField('Speed (Mbps)', 0), unit: sel(['MB', 'GB', 'KB']) }),
  color: z.object({ hex: z.string().min(4, 'Enter hex').regex(/^#[0-9a-fA-F]{6}$/, 'Must be #rrggbb') }),
  prime: z.object({ number: numField('Number', 0) }),
  exercise: z.object({ met: numField('MET Value', 0), weight: numField('Weight (kg)', 0), minutes: numField('Duration (min)', 0), activity: z.string().optional() }),
  fastfood: z.object({ meals: numField('Meals/Week', 0), avgCal: numField('Avg Calories', 0), avgCost: numField('Avg Cost ($)', 0) }),
  ev: z.object({ battery: numField('Battery (kWh)', 0), efficiency: numField('Efficiency (km/kWh)', 0), chargeKw: numField('Charger Power (kW)', 0), rate: numField('Electricity Rate ($/kWh)', 0) }),
  carbon: z.object({ electricity: numField('Electricity (kWh/mo)', 0), gas: numField('Gas (therms/mo)', 0), carKm: numField('Car (km/week)', 0), flights: numField('Flights/Year', 0) }),
  salary: z.object({ annual: numField('Annual Salary ($)', 0) }),
  overtime: z.object({ rate: numField('Hourly Rate ($)', 0), regular: numField('Regular Hours', 0), overtime: numField('Overtime Hours', 0) }),
  commission: z.object({ sales: numField('Sales ($)', 0), rate: numField('Commission Rate (%)', 0), base: numField('Base Salary ($)', 0) }),
  freelance: z.object({ target: numField('Target Income ($)', 0), billable: numField('Billable Hours/Year', 0), expenses: numField('Annual Expenses ($)', 0) }),
  splitting: z.object({ total: numField('Total Bill ($)', 0), people: numField('People', 1), tipPercent: numField('Tip %', 0) }),
  utilities: z.object({ electricity: numField('Electricity ($)', 0), water: numField('Water ($)', 0), gas: numField('Gas ($)', 0), internet: numField('Internet ($)', 0), other: numField('Other ($)', 0) }),
  sleep: z.object({ wake: z.string().min(4, 'Required').regex(/^\d{2}:\d{2}$/, 'HH:MM format'), cycles: numField('Sleep Cycles', 1, 6) }),
  ergonomics: z.object({ height: numField('Your Height (cm)', 0) }),
  tv: z.object({ distance: numField('Viewing Distance (m)', 0), aspect: sel(['16:9', '4:3', '21:9']) }),
  paint: z.object({ width: numField('Wall Width (m)', 0), height: numField('Wall Height (m)', 0), coats: numField('Coats', 1) }),
  wallpaper: z.object({ width: numField('Wall Width (m)', 0), height: numField('Wall Height (m)', 0) }),
  tile: z.object({ area: numField('Area (m²)', 0), tileW: numField('Tile Width (m)', 0), tileH: numField('Tile Height (m)', 0), perBox: numField('Per Box', 1) }),
  flooring: z.object({ area: numField('Area (m²)', 0), plankW: numField('Plank Width (m)', 0), plankL: numField('Plank Length (m)', 0), perPack: numField('Per Pack', 1) }),
  rug: z.object({ roomW: numField('Room Width (m)', 0), roomL: numField('Room Length (m)', 0) }),
  curtain: z.object({ width: numField('Window Width (m)', 0), height: numField('Window Height (m)', 0), fullness: numField('Fullness Factor', 1), mount: sel(['floor', 'sill', 'apron']) }),
  furniture: z.object({ roomW: numField('Room Width (m)', 0), roomL: numField('Room Length (m)', 0), walkway: numField('Walkway Width (m)', 0) }),
  stairs: z.object({ rise: numField('Rise per Step (cm)', 0), run: numField('Run per Step (cm)', 0), totalRise: numField('Total Rise (cm)', 0) }),
  deck: z.object({ width: numField('Deck Width (m)', 0), length: numField('Deck Length (m)', 0) }),
  garden: z.object({ area: numField('Area (m²)', 0), depth: numField('Depth (m)', 0) }),
  planting: z.object({ area: numField('Area (m²)', 0), spacing: numField('Spacing (m)', 0) }),
  crop: z.object({ area: numField('Area (m²)', 0), yieldPerM2: numField('Yield per m² (kg)', 0) }),
  aquarium: z.object({ length: numField('Length (cm)', 0), width: numField('Width (cm)', 0), height: numField('Height (cm)', 0) }),
  storage: z.object({ size: numField('Unit Size (sqft)', 0), rate: numField('Rate ($/sqft)', 0), months: numField('Months', 1) }),
  delivery: z.object({ distance: numField('Distance (km)', 0), base: numField('Base Fee ($)', 0), perKm: numField('Per km ($)', 0), tip: numField('Tip ($)', 0) }),
  catering: z.object({ guests: numField('Guests', 0), perPerson: numField('Per Person ($)', 0) }),
  meal: z.object({ meals: numField('Total Meals', 0), cost: numField('Total Cost ($)', 0), prepTime: numField('Prep Time (min)', 0) }),
  pet_cost: z.object({ food: numField('Monthly Food ($)', 0), vet: numField('Annual Vet ($)', 0), supplies: numField('Monthly Supplies ($)', 0), other: numField('Other ($)', 0) }),
  childcare: z.object({ days: numField('Days/Week', 0), dailyRate: numField('Daily Rate ($)', 0), registration: numField('Registration ($)', 0) }),
  'gpa-calc': z.object({ grades: z.string().min(1, 'Required') }),
  'grade-calc': z.object({ grades: z.string().min(1, 'Required') }),
  'random-number': z.object({ min: numField('Min', 0), max: numField('Max', 1) }),
  'coin-flip': z.object({ trials: numField('Flips', 1, 1000) }),
  'dice-roller': z.object({ dice: numField('Dice', 1, 20), sides: sel(['4', '6', '8', '10', '12', '20']) }),
  'decision-maker': z.object({}),
  'name-generator': z.object({}),
  'password-gen': z.object({ length: numField('Length', 4, 128), upper: yesno, digits: yesno, symbols: yesno }),
  'password-check': z.object({ password: z.string().min(1, 'Enter a password') }),
  'run-pace': z.object({ distance: numField('Distance (km)', 0), hours: numField('Hours', 0), mins: numField('Minutes', 0) }),
  'swim-pace': z.object({ distance: numField('Distance (m)', 0), hours: numField('Hours', 0), mins: numField('Minutes', 0) }),
  'bike-pace': z.object({ distance: numField('Distance (km)', 0), hours: numField('Hours', 0), mins: numField('Minutes', 0) }),
  'tri-pace': z.object({ swim: numField('Swim (km)', 0), swimHrs: numField('Swim Hours', 0), swimMin: numField('Swim Minutes', 0), bike: numField('Bike (km)', 0), bikeHrs: numField('Bike Hours', 0), bikeMin: numField('Bike Minutes', 0), run: numField('Run (km)', 0), runHrs: numField('Run Hours', 0), runMin: numField('Run Minutes', 0) }),
  'step-counter': z.object({ steps: numField('Steps', 0), stride: numField('Stride (m)', 0) }),
  'steps-miles': z.object({ steps: numField('Steps', 0), stride: numField('Stride (m)', 0) }),
  'steps-km': z.object({ steps: numField('Steps', 0), stride: numField('Stride (m)', 0) }),
  'smoking-cost': z.object({ perDay: numField('Cost per Cigarette ($)', 0), packs: numField('Packs per Day', 0) }),
  'coffee-cost': z.object({ perDay: numField('Cost per Cup ($)', 0), cups: numField('Cups per Day', 0) }),
  'daily-affirm': z.object({}),
  gratitude: z.object({}),
  'habit-track': z.object({ habit: z.string().min(1, 'Enter habit name'), days: numField('Days Goal', 1), done: numField('Days Done', 0) }),
  'mood-track': z.object({ rating: numField('Mood Rating (1-10)', 1, 10) }),
  'pet-food': z.object({ weight: numField('Pet Weight (kg)', 0), type: sel(['dog', 'cat']) }),
  'cat-tree': z.object({ cats: numField('Number of Cats', 1) }),
  'dog-train': z.object({ age: numField('Dog Age (years)', 0) }),
  'dog-walk': z.object({ weight: numField('Dog Weight (kg)', 0) }),
  'pet-chip': z.object({ weight: numField('Pet Weight (kg)', 0), type: sel(['dog', 'cat']) }),
  'pet-vax': z.object({ age: numField('Pet Age (years)', 0) }),
  'pet-age': z.object({ years: numField('Pet Age (years)', 0), type: sel(['dog', 'cat']) }),
  'dog-years': z.object({ years: numField('Dog Age (years)', 0) }),
  'cat-years': z.object({ years: numField('Cat Age (years)', 0) }),
  'human-dog-years': z.object({ human: numField('Human Age (years)', 0) }),
  'party-planner': z.object({ guests: numField('Guests', 0), hours: numField('Hours', 0) }),
  'event-budget': z.object({ guests: numField('Guests', 0), budget: numField('Total Budget ($)', 0) }),
  'moving-cost': z.object({ distance: numField('Distance (km)', 0), items: numField('Items', 0), rooms: numField('Rooms', 0) }),
  'apt-search': z.object({ income: numField('Monthly Income ($)', 0), fees: numField('Application Fees ($)', 0) }),
  'closing-cost': z.object({ price: numField('Home Price ($)', 0), rate: numField('Closing Cost Rate (%)', 0) }),
  'home-buy': z.object({ price: numField('Home Price ($)', 0), downPct: numField('Down Payment %', 0), rate: numField('Interest Rate (%)', 0), term: numField('Loan Term (months)', 0) }),
  'mortgage-ok': z.object({ income: numField('Monthly Income ($)', 0), debts: numField('Monthly Debts ($)', 0) }),
  'moving-list': z.object({ days: numField('Days Until Move', 1) }),
  'rent-ok': z.object({ income: numField('Monthly Income ($)', 0), rent: numField('Monthly Rent ($)', 0) }),
  'elec-bill': z.object({ watts: numField('Wattage (W)', 0), hours: numField('Hours/Day', 0), rate: numField('Rate ($/kWh)', 0) }),
  'appliance-cost': z.object({ watts: numField('Wattage (W)', 0), hours: numField('Hours/Use', 0), rate: numField('Rate ($/kWh)', 0) }),
  'appliance-energy': z.object({ watts: numField('Wattage (W)', 0), hours: numField('Hours/Day', 0) }),
  'energy-bill': z.object({ kwh: numField('kWh Used', 0), rate: numField('Rate ($/kWh)', 0), base: numField('Base Fee ($)', 0) }),
  'bulb-save': z.object({ oldW: numField('Old Bulb (W)', 0), newW: numField('New Bulb (W)', 0), hours: numField('Hours/Day', 0), count: numField('Number of Bulbs', 1), rate: numField('Rate ($/kWh)', 0) }),
  'thermostat-save': z.object({ bill: numField('Monthly Bill ($)', 0), smartCost: numField('Smart Thermostat Cost ($)', 0) }),
  'grocery-budget': z.object({ people: numField('People', 1), perPerson: numField('Per Person/Week ($)', 0) }),
  'best-buy': z.object({ priceA: numField('Option A Price ($)', 0), qtyA: numField('Option A Qty', 1), priceB: numField('Option B Price ($)', 0), qtyB: numField('Option B Qty', 1) }),
  'bundle-save': z.object({ single: numField('Single Item Price ($)', 0), bundle: numField('Bundle Price ($)', 0) }),
  bogo: z.object({ price: numField('Regular Price ($)', 0), qty: numField('Items Received', 2) }),
  'cost-use': z.object({ price: numField('Item Price ($)', 0), uses: numField('Expected Uses', 1) }),
  coupon: z.object({ total: numField('Total ($)', 0), discount: numField('Discount %', 0) }),
  'price-comp': z.object({ priceA: numField('Store A Price ($)', 0), priceB: numField('Store B Price ($)', 0) }),
  'price-oz': z.object({ price: numField('Price ($)', 0), oz: numField('Ounces', 1) }),
  'price-lb': z.object({ price: numField('Price ($)', 0), lb: numField('Pounds', 1) }),
  'unit-price': z.object({ price: numField('Total Price ($)', 0), units: numField('Units', 1) }),
  'commute-fuel': z.object({ distance: numField('One-Way Distance (km)', 0), days: numField('Days/Week', 0), mpg: numField('Fuel Efficiency (mpg)', 0), gasPrice: numField('Gas Price ($/gal)', 0) }),
  parking: z.object({ daily: numField('Daily Parking ($)', 0), days: numField('Days/Week', 0) }),
  'rental-car': z.object({ daily: numField('Daily Rate ($)', 0), days: numField('Days', 0), insurance: numField('Daily Insurance ($)', 0), deposit: numField('Deposit ($)', 0) }),
  'taxi-fare': z.object({ distance: numField('Distance (km)', 0), base: numField('Base Fare ($)', 0), perKm: numField('Per km ($)', 0), tip: numField('Tip ($)', 0) }),
  toll: z.object({ tolls: numField('Daily Tolls ($)', 0), days: numField('Days/Week', 0) }),
  'soil-calc': z.object({ area: numField('Area (m²)', 0), depth: numField('Depth (m)', 0) }),
  mulch: z.object({ area: numField('Area (m²)', 0), depth: numField('Depth (m)', 0) }),
  compost: z.object({ area: numField('Area (m²)', 0), depth: numField('Depth (m)', 0) }),
  'cold-frame': z.object({ width: numField('Width (m)', 0), length: numField('Length (m)', 0) }),
  container: z.object({ pots: numField('Number of Pots', 0), size: sel(['small', 'medium', 'large']) }),
  greenhouse: z.object({ width: numField('Width (m)', 0), length: numField('Length (m)', 0) }),
  herb: z.object({ area: numField('Garden Area (m²)', 0) }),
  'indoor-herb': z.object({ pots: numField('Number of Pots', 0) }),
  microgreen: z.object({ trays: numField('Number of Trays', 0) }),
  'raised-bed': z.object({ width: numField('Width (m)', 0), length: numField('Length (m)', 0), height: numField('Height (m)', 0) }),
  trellis: z.object({ width: numField('Width (m)', 0), height: numField('Height (m)', 0) }),
  vertical: z.object({ area: numField('Wall Area (m²)', 0) }),
  worm: z.object({ people: numField('People in Household', 1) }),
  'storage-cost': z.object({ size: numField('Unit Size (sqft)', 0), rate: numField('Rate ($/sqft)', 0), months: numField('Months', 1) }),
  closet: z.object({ width: numField('Closet Width (m)', 0) }),
  konmari: z.object({ items: numField('Total Items', 0) }),
  garage: z.object({ cars: numField('Cars', 1) }),
  'home-inv': z.object({ rooms: numField('Rooms', 1) }),
  'home-org': z.object({ area: numField('Home Area (m²)', 0) }),
  shed: z.object({ width: numField('Width (m)', 0), length: numField('Length (m)', 0) }),
  workshop: z.object({ width: numField('Width (m)', 0), length: numField('Length (m)', 0) }),
  'delivery-fee': z.object({ distance: numField('Distance (km)', 0), base: numField('Base Fee ($)', 0), perKm: numField('Per km ($)', 0), tip: numField('Tip ($)', 0) }),
  baggage: z.object({ bags: numField('Checked Bags', 1), weight: numField('Bag Weight (kg)', 0) }),
  'hotel-cost': z.object({ nights: numField('Nights', 1), rate: numField('Nightly Rate ($)', 0) }),
  luggage: z.object({ height: numField('Height (cm)', 0), width: numField('Width (cm)', 0), depth: numField('Depth (cm)', 0) }),
  'packing-list': z.object({ days: numField('Trip Days', 1), climate: sel(['moderate', 'cold', 'hot']) }),
  'pack-vol': z.object({ outfits: numField('Outfits', 1), shoes: numField('Shoe Pairs', 0) }),
  'travel-budget': z.object({ days: numField('Days', 1), flight: numField('Flight Cost ($)', 0), hotel: numField('Hotel/Night ($)', 0), food: numField('Food/Day ($)', 0) }),
  'travel-time': z.object({ distance: numField('Distance (km)', 0), speed: numField('Speed (km/h)', 0), layovers: numField('Layovers', 0) }),
  'trip-cost': z.object({ transport: numField('Transport ($)', 0), lodging: numField('Lodging ($)', 0), food: numField('Food ($)', 0), activities: numField('Activities ($)', 0) }),
  weather: z.object({ tempA: numField('City A Temp (°C)', -50, 60), tempB: numField('City B Temp (°C)', -50, 60) }),
  'streaming-cost': z.object({ services: numField('Services', 0), avgCost: numField('Avg Cost ($)', 0) }),
  'subscription-calc': z.object({ subs: numField('Subscriptions', 0), avg: numField('Avg Cost ($)', 0) }),
  'sub-cost': z.object({ services: numField('Services', 0), avg: numField('Avg Cost ($)', 0) }),
  'sub-save': z.object({ current: numField('Current Monthly ($)', 0), bundle: numField('Bundle Monthly ($)', 0) }),
  'net-speed': z.object({ devices: numField('Devices', 0), streaming: yesno, gaming: yesno, work: yesno }),
  'data-usage': z.object({ devices: numField('Devices', 0), hd: numField('HD Streaming Hours', 0), sd: numField('SD Streaming Hours', 0) }),
  'internet-cost': z.object({ plan: numField('Plan Cost ($)', 0), equip: numField('Equipment ($)', 0) }),
  'salary-hourly': z.object({ annual: numField('Annual Salary ($)', 0) }),
  'hourly-salary': z.object({ hourly: numField('Hourly Rate ($)', 0) }),
  'billable-hrs': z.object({ rate: numField('Hourly Rate ($)', 0), hours: numField('Billable Hours', 0), expenses: numField('Annual Expenses ($)', 0) }),
  'meeting-cost2': z.object({ attendees: numField('Attendees', 1), duration: numField('Duration (min)', 0), avgSalary: numField('Avg Salary ($)', 0) }),
  pomodoro: z.object({ work: numField('Work Block (min)', 1), breaks: numField('Break (min)', 0), cycles: numField('Cycles', 1) }),
  'priority-matrix2': z.object({ tasks: numField('Total Tasks', 0), urgent: numField('Urgent Tasks', 0), important: numField('Important Tasks', 0) }),
  productivity: z.object({ done: numField('Tasks Done', 0), planned: numField('Tasks Planned', 0), focus: numField('Focus %', 0, 100) }),
  'project-deadline2': z.object({ tasks: numField('Total Tasks', 0), hoursPer: numField('Hours per Task', 0), hoursPerDay: numField('Hours/Day', 0) }),
  'task-est': z.object({ optimistic: numField('Optimistic (hrs)', 0), likely: numField('Likely (hrs)', 0), pessimistic: numField('Pessimistic (hrs)', 0) }),
  'time-block': z.object({ hours: numField('Work Hours', 0), blocks: numField('Blocks', 1), focus: numField('Focus %', 0, 100) }),
  'work-hours': z.object({ start: z.string().regex(/^\d{2}:\d{2}$/, 'HH:MM'), end: z.string().regex(/^\d{2}:\d{2}$/, 'HH:MM'), breaks: numField('Break Hours', 0) }),
  'file-size2': z.object({ size: numField('File Size', 0), speed: numField('Speed (Mbps)', 0), unit: sel(['MB', 'GB', 'KB']) }),
  'download-time': z.object({ size: numField('File Size', 0), speed: numField('Download Speed (Mbps)', 0), unit: sel(['MB', 'GB', 'KB']) }),
  'upload-time': z.object({ size: numField('File Size', 0), speed: numField('Upload Speed (Mbps)', 0), unit: sel(['MB', 'GB', 'KB']) }),
  'calories-burned': z.object({ met: numField('MET Value', 0), weight: numField('Weight (kg)', 0), minutes: numField('Duration (min)', 0), activity: z.string().optional() }),
  'walking-cal': z.object({ weight: numField('Weight (kg)', 0), minutes: numField('Minutes', 0) }),
  'running-cal': z.object({ weight: numField('Weight (kg)', 0), minutes: numField('Minutes', 0), speed: numField('Speed (km/h)', 0) }),
  'cycling-cal': z.object({ weight: numField('Weight (kg)', 0), minutes: numField('Minutes', 0), speed: numField('Speed (km/h)', 0) }),
  'swimming-cal': z.object({ weight: numField('Weight (kg)', 0), minutes: numField('Minutes', 0), intensity: sel(['light', 'moderate', 'vigorous']) }),
  'yoga-cal': z.object({ weight: numField('Weight (kg)', 0), minutes: numField('Minutes', 0), style: sel(['hatha', 'vinyasa', 'power']) }),
  'desk-ergo': z.object({ height: numField('Your Height (cm)', 0) }),
  'stand-desk': z.object({ height: numField('Your Height (cm)', 0) }),
  'monitor-ht': z.object({ height: numField('Your Height (cm)', 0) }),
  'tv-size': z.object({ distance: numField('Viewing Distance (m)', 0) }),
  'projector-screen': z.object({ distance: numField('Projector Distance (m)', 0), aspect: sel(['16:9', '4:3', '21:9']) }),
  'floor-mat': z.object({ area: numField('Area (m²)', 0), plankW: numField('Plank Width (m)', 0), plankL: numField('Plank Length (m)', 0), perPack: numField('Per Pack', 1) }),
  'carpet-room': z.object({ width: numField('Room Width (m)', 0), length: numField('Room Length (m)', 0) }),
  'deck-mat': z.object({ width: numField('Deck Width (m)', 0), length: numField('Deck Length (m)', 0) }),
  'fence-mat': z.object({ length: numField('Fence Length (m)', 0), height: numField('Fence Height (m)', 0) }),
  'seed-space': z.object({ area: numField('Area (m²)', 0), spacing: numField('Spacing (m)', 0) }),
  'plant-space': z.object({ area: numField('Area (m²)', 0), spacing: numField('Plant Spacing (m)', 0), rowSpacing: numField('Row Spacing (m)', 0) }),
  companion: z.object({ crop: sel(['tomato', 'carrot', 'basil', 'lettuce']) }),
  'seed-start': z.object({ weeks: numField('Weeks Before Frost', 1), trays: numField('Trays', 1) }),
  transplant: z.object({ plants: numField('Plants', 1), spacing: numField('Spacing (m)', 0) }),
  'crop-yield': z.object({ area: numField('Area (m²)', 0), yieldPerM2: numField('Yield per m² (kg)', 0) }),
  'crop-rotate': z.object({ beds: numField('Number of Beds', 1, 6) }),
  'aquarium-vol': z.object({ length: numField('Length (cm)', 0), width: numField('Width (cm)', 0), height: numField('Height (cm)', 0) }),
  'aquarium-heater': z.object({ volume: numField('Tank Volume (L)', 0), room: numField('Room Temp (°C)', 0), target: numField('Target Temp (°C)', 0) }),
  'aquarium-light': z.object({ volume: numField('Tank Volume (L)', 0), planted: yesno }),
  'aquarium-size2': z.object({ fish: numField('Number of Fish', 1), fishSize: numField('Fish Size (cm)', 0) }),
  'cleaning-time': z.object({ rooms: numField('Rooms', 0), bath: numField('Bathrooms', 0), type: sel(['deep', 'standard', 'quick']) }),
  'clean-supplies': z.object({ area: numField('Home Area (m²)', 0) }),
  'laundry-cost': z.object({ loads: numField('Loads/Week', 0), costPer: numField('Cost Per Load ($)', 0) }),
  'laundry-auto': z.object({ people: numField('People', 1), costPer: numField('Cost Per Load ($)', 0) }),
  'cater-cost': z.object({ guests: numField('Guests', 0), perPerson: numField('Per Person ($)', 0) }),
  'meal-prep': z.object({ meals: numField('Total Meals', 0), cost: numField('Total Cost ($)', 0), prepTime: numField('Prep Time (min)', 0) }),
  'leftover-calc': z.object({ portions: numField('Portions Made', 0), eaten: numField('Portions Eaten', 0), waste: numField('Wasted', 0) }),
  'pizza-calc': z.object({ pizzas: numField('Pizzas', 1), slices: numField('Slices per Pizza', 1), people: numField('People', 1) }),
  'coffee-calc2': z.object({ cups: numField('Cups', 0), costPer: numField('Cost per Cup ($)', 0) }),
  'takeout-calc': z.object({ meals: numField('Meals/Week', 0), avgCost: numField('Avg Cost ($)', 0) }),
  'util-est': z.object({ electricity: numField('Electricity ($)', 0), water: numField('Water ($)', 0), gas: numField('Gas ($)', 0), internet: numField('Internet ($)', 0), other: numField('Other ($)', 0) }),
  'auto-util': z.object({ sqft: numField('Home Size (sqft)', 0), people: numField('People', 1) }),
  'util-cost': z.object({ electricity: numField('Electricity ($)', 0), water: numField('Water ($)', 0), gas: numField('Gas ($)', 0), trash: numField('Trash ($)', 0) }),
  'cell-cost': z.object({ plan: numField('Plan Cost ($)', 0), lines: numField('Lines', 1), device: numField('Device Cost ($)', 0) }),
  'phone-bill': z.object({ plan: numField('Plan Cost ($)', 0), taxes: numField('Taxes/Fees ($)', 0) }),
  'pet-cost2': z.object({ food: numField('Monthly Food ($)', 0), vet: numField('Annual Vet ($)', 0), supplies: numField('Monthly Supplies ($)', 0), other: numField('Other ($)', 0) }),
  'pet-board': z.object({ days: numField('Days', 1), daily: numField('Daily Rate ($)', 0), deposit: numField('Deposit ($)', 0) }),
  'pet-groom': z.object({ visits: numField('Visits/Year', 1), costPer: numField('Cost Per Visit ($)', 0) }),
  'pet-sit': z.object({ days: numField('Days', 1), daily: numField('Daily Rate ($)', 0), visits: numField('Visits/Day', 1) }),
  'hex-color': z.object({ hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be #rrggbb') }),
  'color-pick': z.object({ r: numField('Red (0-255)', 0, 255), g: numField('Green (0-255)', 0, 255), b: numField('Blue (0-255)', 0, 255) }),
  'lotto-calc': z.object({ odds: numField('Odds (1 in X)', 0), ticket: numField('Ticket Price ($)', 0), jackpot: numField('Jackpot ($)', 0) }),
  'bingo-odds': z.object({ cards: numField('Your Cards', 1), players: numField('Players', 1) }),
  'lotto-odds': z.object({ mainBalls: numField('Main Balls', 1), picks: numField('Picks', 1), extraBalls: numField('Extra Balls', 1) }),
  'poker-odds': z.object({ outs: numField('Outs', 1), cards: numField('Cards Left', 2, 50) }),
  'carbon-foot': z.object({ electricity: numField('Electricity (kWh/mo)', 0), gas: numField('Gas (therms/mo)', 0), carKm: numField('Car (km/week)', 0), flights: numField('Flights/Year', 0) }),
  'flight-carbon2': z.object({ distance: numField('Flight Distance (km)', 0), passengers: numField('Passengers', 1) }),
  'flight-offset': z.object({ distance: numField('Flight Distance (km)', 0), passengers: numField('Passengers', 1), costPer: numField('Cost per kg CO2 ($)', 0) }),
  'furniture-arr': z.object({ roomW: numField('Room Width (m)', 0), roomL: numField('Room Length (m)', 0), walkway: numField('Walkway Width (m)', 0) }),
  'furniture-lay': z.object({ roomW: numField('Room Width (m)', 0), roomL: numField('Room Length (m)', 0), sofa: numField('Sofa Width (m)', 0), table: numField('Table Width (m)', 0) }),
  'room-size': z.object({ width: numField('Width (m)', 0), length: numField('Length (m)', 0) }),
  'curtain-len': z.object({ width: numField('Window Width (m)', 0), height: numField('Window Height (m)', 0), fullness: numField('Fullness', 1), mount: sel(['floor', 'sill', 'apron']) }),
  'curtain-size2': z.object({ width: numField('Window Width (m)', 0), height: numField('Window Height (m)', 0) }),
  '50-30-20-budget-2': z.object({ income: numField('Monthly After-Tax Income ($)', 0) }),
  'budget-planner-calc': z.object({ income: numField('Monthly Income ($)', 0), housing: numField('Housing ($)', 0), food: numField('Food ($)', 0), transport: numField('Transport ($)', 0), utilities: numField('Utilities ($)', 0), other: numField('Other ($)', 0), savingsGoal: numField('Savings Goal ($)', 0) }),
  'budget-envelope': z.object({ total: numField('Total Cash to Allocate ($)', 0), groceries: numField('Groceries ($)', 0), dining: numField('Dining Out ($)', 0), entertainment: numField('Entertainment ($)', 0), transport: numField('Transport ($)', 0), other: numField('Other ($)', 0) }),
  'emergency-fund-calc': z.object({ expenses: numField('Monthly Expenses ($)', 0), months: numField('Desired Months', 1, 24), current: numField('Current Savings ($)', 0) }),
  'net-worth-calc': z.object({ home: numField('Home Value ($)', 0), investments: numField('Investments ($)', 0), cash: numField('Cash & Savings ($)', 0), vehicles: numField('Vehicles ($)', 0), otherAssets: numField('Other Assets ($)', 0), mortgage: numField('Mortgage ($)', 0), loans: numField('Loans ($)', 0), creditCards: numField('Credit Cards ($)', 0), otherLiabilities: numField('Other Liabilities ($)', 0) }),
  'net-worth-calc-2': z.object({ assets: numField('Total Assets ($)', 0), liabilities: numField('Total Liabilities ($)', 0) }),
  'passive-income': z.object({ investment: numField('Total Investment Value ($)', 0), yieldRate: numField('Annual Yield (%)', 0, 30), monthlyAdd: numField('Monthly Additions ($)', 0) }),
  'debt-snowball': z.object({ debt1: numField('Debt 1 Balance ($)', 0), min1: numField('Debt 1 Min Payment ($)', 0), debt2: numField('Debt 2 Balance ($)', 0), min2: numField('Debt 2 Min Payment ($)', 0), debt3: numField('Debt 3 Balance ($)', 0), min3: numField('Debt 3 Min Payment ($)', 0), extra: numField('Extra Monthly Payment ($)', 0) }),
  'debt-avalanche': z.object({ debt1: numField('Debt 1 Balance ($)', 0), rate1: numField('Debt 1 APR (%)', 0, 36), min1: numField('Debt 1 Min Payment ($)', 0), debt2: numField('Debt 2 Balance ($)', 0), rate2: numField('Debt 2 APR (%)', 0, 36), min2: numField('Debt 2 Min Payment ($)', 0), debt3: numField('Debt 3 Balance ($)', 0), rate3: numField('Debt 3 APR (%)', 0, 36), min3: numField('Debt 3 Min Payment ($)', 0), extra: numField('Extra Monthly Payment ($)', 0) }),
  'zero-based-budget-2': z.object({ income: numField('Monthly Income ($)', 0), housing: numField('Housing ($)', 0), food: numField('Food ($)', 0), transport: numField('Transport ($)', 0), utilities: numField('Utilities ($)', 0), savings: numField('Savings ($)', 0), other: numField('Other Expenses ($)', 0) }),
  'paypal-fees': z.object({ amount: numField('Transaction Amount ($)', 0), type: sel(['domestic', 'international']) }),
  'stripe-fees': z.object({ amount: numField('Transaction Amount ($)', 0), cardType: sel(['credit', 'debit', 'amex']) }),
  'ebay-fees': z.object({ salePrice: numField('Sale Price ($)', 0), category: sel(['electronics', 'clothing', 'sports', 'home', 'general']), store: sel(['store-none', 'store-basic', 'store-premium']) }),
  'etsy-fees': z.object({ itemPrice: numField('Item Price ($)', 0), qty: numField('Quantity', 1), shipping: numField('Shipping ($)', 0) }),
  'amazon-fba': z.object({ itemPrice: numField('Item Price ($)', 0), category: sel(['electronics', 'clothing', 'books', 'home', 'general']), sizeTier: sel(['s-small', 's-standard', 's-large', 's-oversize']) }),
  'crowdfunding-fee': z.object({ goal: numField('Funding Goal ($)', 0), platform: sel(['kickstarter', 'indiegogo']) }),
  'pawn-loan': z.object({ itemValue: numField('Item Value ($)', 0), loanPct: numField('Loan % (25-50)', 25, 50), monthlyRate: numField('Monthly Interest Rate (%)', 0), months: numField('Duration (months)', 1) }),
  'craps-odds': z.object({ betAmount: numField('Bet Amount ($)', 0), betType: sel(['craps-pass', 'craps-dont-pass', 'craps-come', 'craps-dont-come', 'craps-field']) }),
  'roulette-odds': z.object({ betAmount: numField('Bet Amount ($)', 0), betType: sel(['roulette-red-black', 'roulette-single', 'roulette-split', 'roulette-street', 'roulette-corner']), wheelType: sel(['european', 'american']) }),
  'parlay-odds': z.object({ legs: numField('Number of Legs', 2, 10), oddsDecimal: numField('Decimal Odds per Leg', 1.01), stake: numField('Stake ($)', 0) }),
  'prop-bet': z.object({ stake: numField('Bet Amount ($)', 0), yesOdds: z.string().min(1, 'Required').refine(v => !isNaN(parseInt(v)), 'Must be a number'), noOdds: z.string().min(1, 'Required').refine(v => !isNaN(parseInt(v)), 'Must be a number') }),
  'sports-betting-odds': z.object({ stake: numField('Stake ($)', 0), oddsAmerican: z.string().min(1, 'Required').refine(v => !isNaN(parseInt(v)), 'Must be a number') }),
  'blackjack-basic': z.object({ handValue: numField('Your Hand Total', 4, 21), dealerUp: numField('Dealer Up-Card', 2, 11) }),
  'generator-sizing': z.object({ sqft: numField('Home Size (sqft)', 100), ac: yesno, fridge: yesno, wellPump: yesno, sump: yesno, lights: yesno }),
  'furnace-cost': z.object({ sqft: numField('Home Size (sqft)', 100), efficiency: sel(['80', '95']), region: sel(['northeast', 'south', 'midwest', 'west']) }),
  'pool-chemical-calc': z.object({ volume: numField('Pool Volume (gallons)', 100), chemical: sel(['chlorine', 'ph_up', 'ph_down', 'alkalinity_up', 'shock']), currentLevel: numField('Current Level (ppm)', 0), targetLevel: numField('Target Level (ppm)', 0) }),
  'pool-heating-cost': z.object({ volume: numField('Pool Volume (gallons)', 100), desiredTemp: numField('Desired Temp (°F)', 50, 100), currentTemp: numField('Current Temp (°F)', 30, 90), heaterType: sel(['gas', 'heat_pump', 'solar']), costPer: numField('Cost per Therm/kWh ($)', 0), months: numField('Months of Use', 1, 12) }),
  'solar-panel-calc': z.object({ monthlyBill: numField('Monthly Electric Bill ($)', 0), sunlight: numField('Daily Sunlight (hours)', 3, 8), systemEfficiency: numField('System Efficiency (%)', 50, 100) }),
  'space-heater-cost': z.object({ watts: numField('Heater Wattage (W)', 100, 5000), hours: numField('Hours Per Day', 0, 24), rate: numField('Electric Rate ($/kWh)', 0) }),
  'leak-detection': z.object({ dripsPerMin: numField('Drips Per Minute', 1), hoursPerDay: numField('Hours Per Day', 1, 24) }),
  'phantom-load': z.object({ devices: numField('Number of Devices', 1), avgStandby: numField('Avg Standby Watts (W)', 1, 100), rate: numField('Electric Rate ($/kWh)', 0) }),
  'pest-control-cost': z.object({ sqft: numField('Home Size (sqft)', 100), pestType: sel(['ants', 'roaches', 'termites', 'bed_bugs', 'rodents', 'mosquitoes']), treatmentType: sel(['one-time', 'quarterly', 'monthly']), severity: sel(['mild', 'moderate', 'severe']) }),
  'shower-time-cost': z.object({ showerMins: numField('Shower Length (min)', 1, 60), flowRate: numField('Flow Rate (GPM)', 1, 3), waterCost: numField('Water Cost ($/gal)', 0), heaterType: sel(['electric', 'gas', 'heat_pump']) }),
  'toilet-flush-cost': z.object({ flushesPerDay: numField('Flushes Per Day', 1), gallonsPerFlush: sel(['1.0', '1.28', '1.6']), waterCost: numField('Water Cost ($/gal)', 0) }),
  'cashback-calc': z.object({ annualSpend: numField('Annual Spending ($)', 0), cashbackRate: numField('Cashback Rate (%)', 0.1, 10), category: sel(['flat', 'rotating', 'travel', 'dining']) }),
  'rebate-calc': z.object({ purchasePrice: numField('Purchase Price ($)', 0), rebateAmount: numField('Rebate Amount ($)', 0), mailIn: yesno, taxRate: numField('Tax Rate (%)', 0) }),
  'loyalty-rewards': z.object({ pointsPerDollar: numField('Points Per Dollar', 1, 20), annualSpend: numField('Annual Spending ($)', 0), redemptionValue: numField('Redemption Value (cents)', 0.1, 5) }),
  'consignment-pricing': z.object({ itemPrice: numField('Item Price ($)', 0), commissionRate: numField('Commission Rate (%)', 10, 80), platform: sel(['online', 'brick-mortar']) }),
  'craigslist-pricing': z.object({ itemAge: numField('Item Age (months)', 0), originalPrice: numField('Original Price ($)', 0), condition: sel(['like-new', 'good', 'fair', 'poor']), demand: sel(['high', 'medium', 'low']) }),
  'auction-hammer': z.object({ hammerPrice: numField('Hammer Price ($)', 0), buyersPremium: numField("Buyer's Premium (%)", 0, 50), sellersCommission: numField("Seller's Commission (%)", 0, 50), vatOnPremium: yesno, vatRate: numField('VAT Rate (%)', 0) }),
  'diaper-cost': z.object({ babyAge: sel(['newborn', '1-2mo', '2-4mo', '4-6mo', '6-12mo', '12+mo']), diapersPerDay: numField('Diapers Per Day', 1, 20), costPerDiaper: numField('Cost Per Diaper ($)', 0), brand: sel(['generic', 'huggies', 'pampers', 'cloth']) }),
  'formula-cost': z.object({ babyAge: sel(['0-3mo', '3-6mo', '6-9mo', '9-12mo']), ozPerFeeding: numField('Ounces Per Feeding', 0), feedingsPerDay: numField('Feedings Per Day', 1), costPerOz: numField('Cost Per Oz ($)', 0) }),
  'baby-gear': z.object({ stroller: numField('Stroller ($)', 0), carSeat: numField('Car Seat ($)', 0), crib: numField('Crib ($)', 0), clothes: numField('Clothes ($)', 0), bottles: numField('Bottles/Gear ($)', 0), highChair: numField('High Chair ($)', 0), babyOther: numField('Other ($)', 0), preset: sel(['budget', 'mid-range', 'premium']) }),
  'college-fund': z.object({ childAge: numField('Child Age (years)', 0, 17), collegeAge: numField('College Age (years)', 18, 25), currentSavings: numField('Current Savings ($)', 0), monthlyContribution: numField('Monthly Contribution ($)', 0), expectedReturn: numField('Expected Return (%)', 0), tuitionCost: numField('Annual Tuition Cost ($)', 0) }),
  'college-savings-calc': z.object({ childAge: numField('Child Age (years)', 0, 17), stateTaxDeduction: numField('State Tax Deduction ($)', 0), monthlyContribution: numField('Monthly Contribution ($)', 0), expectedReturn: numField('Expected Return (%)', 0), tuitionInflation: numField('Tuition Inflation (%)', 0) }),
  'pet-insurance': z.object({ petType: sel(['dog', 'cat']), petAge: numField('Pet Age (years)', 0), coverageLevel: sel(['accident-only', 'accident+illness', 'comprehensive']), deductible: numField('Deductible ($)', 0), reimbursement: numField('Reimbursement (%)', 0), annualVetCost: numField('Annual Vet Cost ($)', 0) }),
  'towing-capacity': z.object({ gvwr: numField('GVWR (lbs)', 0), curbWeight: numField('Curb Weight (lbs)', 0), payload: numField('Payload (lbs)', 0), tongueWeightPercent: numField('Tongue Weight (%)', 0), trailerWeight: numField('Trailer Weight (lbs)', 0) }),
  'tire-pressure-calc': z.object({ currentPressure: numField('Current Pressure (PSI)', 0), recommendedPressure: numField('Recommended Pressure (PSI)', 0), load: sel(['normal', 'light', 'heavy']), temperature: sel(['summer', 'winter']) }),
  'qr-code-generator': z.object({ contentType: sel(['url', 'text', 'phone', 'email', 'wifi']), content: z.string().min(1, 'Required'), size: sel(['small', 'medium', 'large']), errorCorrection: sel(['L', 'M', 'Q', 'H']) }),
  'font-size-calc': z.object({ baseSize: numField('Base Size (px)', 0), scaleRatio: sel(['1.25', '1.333', '1.5']), level: sel(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'small']) }),
  'secret-santa': z.object({ participants: numField('Number of Participants', 3, 20), maxBudget: numField('Max Budget ($)', 0), names: z.string().optional() }),
  'yard-sale': z.object({ clothingValue: numField('Clothing ($)', 0), furnitureValue: numField('Furniture ($)', 0), booksValue: numField('Books ($)', 0), toysValue: numField('Toys ($)', 0), kitchenValue: numField('Kitchen ($)', 0), electronicsValue: numField('Electronics ($)', 0), strategy: sel(['cheap', 'fair', 'premium']) }),
  'raffle-tickets': z.object({ ticketsSold: numField('Tickets Sold', 0), yourTickets: numField('Your Tickets', 1), prizeValue: numField('Prize Value ($)', 0), ticketPrice: numField('Ticket Price ($)', 0) }),
  'sweepstakes-entry': z.object({ entriesSubmitted: numField('Entries Submitted', 1), totalEntriesEstimated: numField('Total Entries (est.)', 1), numberOfPrizes: numField('Number of Prizes', 1) }),
  'side-hustle': z.object({ hourlyRate: numField('Hourly Rate ($)', 0), hoursPerWeek: numField('Hours/Week', 0), weeksPerYear: numField('Weeks/Year', 0), expenses: numField('Annual Expenses ($)', 0), taxRate: numField('Tax Rate (%)', 0) }),
  'spending-habit': z.object({ coffee: numField('Coffee ($/day)', 0), lunch: numField('Lunch ($/day)', 0), snacks: numField('Snacks ($/day)', 0), drinks: numField('Drinks ($/day)', 0), transportation: numField('Transportation ($/day)', 0) }),
  'funeral-cost': z.object({ disposition: sel(['burial', 'cremation']), casketCost: numField('Casket/Urn ($)', 0), serviceFee: numField('Service Fee ($)', 0), burialPlot: numField('Burial Plot ($)', 0), headstone: numField('Headstone ($)', 0), funeralOther: numField('Other Costs ($)', 0) }),
  'charity-donation': z.object({ donationAmount: numField('Donation Amount ($)', 0), taxBracket: numField('Tax Bracket (%)', 0), itemized: yesno }),
  'dry-cleaning-cost': z.object({ shirtsPerWeek: numField('Shirts/Week', 0), suitsPerWeek: numField('Suits/Week', 0), dressesPerWeek: numField('Dresses/Week', 0), coatsPerWeek: numField('Coats/Week', 0), pantsPerWeek: numField('Pants/Week', 0), weeksPerYear: numField('Weeks/Year', 0) }),
  'travel-insurance': z.object({ tripCost: numField('Trip Cost ($)', 0), ageGroup: sel(['18-30', '31-50', '51-65', '66+']), coverageType: sel(['basic', 'standard', 'comprehensive']) }),
  'renters-insurance': z.object({ propertyValue: numField('Personal Property Value ($)', 0), deductible: numField('Deductible ($)', 0), liability: numField('Liability ($)', 0) }),
  'security-deposit': z.object({ monthlyRent: numField('Monthly Rent ($)', 0), depositMonths: numField('Deposit (months)', 1, 2), stateRequiresInterest: yesno }),
  'wedding-guest': z.object({ outfit: numField('Outfit ($)', 0), transportationCost: numField('Transportation ($)', 0), hotelNights: numField('Hotel Nights', 0), hotelRate: numField('Nightly Rate ($)', 0), gift: numField('Gift ($)', 0), hasPreWedding: yesno }),
  'holiday-budget-2': z.object({ totalBudget: numField('Total Budget ($)', 0), gifts: numField('Gifts ($)', 0), travel: numField('Travel ($)', 0), food: numField('Food ($)', 0), decorations: numField('Decorations ($)', 0), entertainment: numField('Entertainment ($)', 0) }),
  'fundraiser-goal': z.object({ targetAmount: numField('Target Amount ($)', 0), numberOfDonors: numField('Expected Donors', 0), averageDonation: numField('Average Donation ($)', 0), platform: sel(['gofundme', 'kickstarter']) }),
  'biweekly-monthly': z.object({ biweeklyAmount: numField('Biweekly Amount ($)', 0) }),
  'bonus-calc': z.object({ bonusAmount: numField('Bonus Amount ($)', 0), bonusTaxRate: numField('Fed Tax Rate (%)', 0), stateTax: numField('State Tax (%)', 0), fica: numField('FICA (%)', 0) }),
}

export const everydayDefaults: Record<string, Record<string, string>> = {
  clothing: { us: '8' },
  ring: { mm: '54' },
  cooking: { weight: '2', method: 'roast' },
  pace: { distance: '10', hours: '1', mins: '0' },
  steps: { steps: '10000', stride: '0.76' },
  water_intake: { weight: '70', activity: '30' },
  caffeine: { cups: '3', type: 'drip' },
  alcohol: { volume: '355', abv: '5' },
  bac: { drinks: '2', weight: '70', gender: 'male', hours: '1' },
  habit_cost: { perDay: '8', quantity: '1' },
  pet: { weight: '10', type: 'dog' },
  pet_age: { years: '5', type: 'dog' },
  party: { guests: '20', hours: '3' },
  wedding: { guests: '100', total: '30000' },
  moving: { distance: '50', items: '50', rooms: '2' },
  cleaning: { rooms: '3', bath: '1', type: 'deep' },
  laundry: { loads: '4', costPer: '1.50' },
  electricity: { watts: '100', hours: '8', rate: '0.12' },
  water_bill: { usage: '10000', rate: '3.5', base: '15' },
  internet: { devices: '4', streaming: 'yes', gaming: 'no', work: 'yes' },
  phone: { plan: '50', lines: '2', device: '800' },
  streaming: { services: '3', avgCost: '12.99' },
  grocery: { people: '2', perPerson: '100' },
  dining: { meals: '3', avgCost: '15', savings: '10' },
  gym: { monthly: '50', visits: '8', commute: '5' },
  maintenance: { homeValue: '350000', rule: '1' },
  car_payment: { price: '35000', down: '5000', rate: '5', term: '60' },
  car_cost: { payment: '500', insurance: '150', gas: '200', maintenance: '100', km: '1500' },
  commute: { distance: '25', days: '5', mpg: '25', gasPrice: '3.5' },
  tire: { width: '205', aspect: '55', rim: '16' },
  lottery: { odds: '292200000', ticket: '2', jackpot: '100000000' },
  battery: { mah: '3000', ma: '500', voltage: '3.7' },
  photo: { widthPx: '3000', heightPx: '2000', dpi: '300' },
  file: { size: '500', speed: '50', unit: 'MB' },
  color: { hex: '#1a3a8a' },
  prime: { number: '17' },
  exercise: { met: '3.5', weight: '70', minutes: '30', activity: 'walking' },
  fastfood: { meals: '2', avgCal: '800', avgCost: '10' },
  ev: { battery: '60', efficiency: '6', chargeKw: '7', rate: '0.12' },
  carbon: { electricity: '500', gas: '50', carKm: '200', flights: '2' },
  salary: { annual: '60000' },
  overtime: { rate: '25', regular: '40', overtime: '10' },
  commission: { sales: '100000', rate: '5', base: '40000' },
  freelance: { target: '80000', billable: '1500', expenses: '10000' },
  splitting: { total: '100', people: '2', tipPercent: '15' },
  utilities: { electricity: '120', water: '40', gas: '60', internet: '60', other: '30' },
  sleep: { wake: '07:00', cycles: '5' },
  ergonomics: { height: '170' },
  tv: { distance: '3', aspect: '16:9' },
  paint: { width: '5', height: '2.5', coats: '2' },
  wallpaper: { width: '5', height: '2.5' },
  tile: { area: '10', tileW: '0.3', tileH: '0.3', perBox: '10' },
  flooring: { area: '20', plankW: '0.15', plankL: '1.2', perPack: '8' },
  rug: { roomW: '4', roomL: '5' },
  curtain: { width: '2', height: '2.4', fullness: '2', mount: 'floor' },
  furniture: { roomW: '5', roomL: '4', walkway: '0.9' },
  stairs: { rise: '18', run: '28', totalRise: '260' },
  deck: { width: '4', length: '5' },
  garden: { area: '10', depth: '0.1' },
  planting: { area: '10', spacing: '0.3' },
  crop: { area: '100', yieldPerM2: '2.5' },
  aquarium: { length: '60', width: '30', height: '30' },
  storage: { size: '100', rate: '1.5', months: '12' },
  delivery: { distance: '5', base: '5', perKm: '1.5', tip: '3' },
  catering: { guests: '50', perPerson: '25' },
  meal: { meals: '14', cost: '70', prepTime: '30' },
  pet_cost: { food: '50', vet: '300', supplies: '20', other: '10' },
  childcare: { days: '5', dailyRate: '50', registration: '100' },
  'gpa-calc': { grades: 'A, B, B+, A-' },
  'grade-calc': { grades: 'A, B, B+, A-' },
  'random-number': { min: '1', max: '100' },
  'coin-flip': { trials: '1' },
  'dice-roller': { dice: '1', sides: '6' },
  'decision-maker': {},
  'name-generator': {},
  'password-gen': { length: '16', upper: 'yes', digits: 'yes', symbols: 'yes' },
  'password-check': { password: 'MyP@ssw0rd' },
  'run-pace': { distance: '10', hours: '1', mins: '0' },
  'swim-pace': { distance: '1500', hours: '0', mins: '30' },
  'bike-pace': { distance: '40', hours: '1', mins: '15' },
  'tri-pace': { swim: '1.5', swimHrs: '0', swimMin: '30', bike: '40', bikeHrs: '1', bikeMin: '15', run: '10', runHrs: '0', runMin: '45' },
  'step-counter': { steps: '10000', stride: '0.76' },
  'steps-miles': { steps: '10000', stride: '0.76' },
  'steps-km': { steps: '10000', stride: '0.76' },
  'smoking-cost': { perDay: '10', packs: '1' },
  'coffee-cost': { perDay: '5', cups: '1' },
  'daily-affirm': {},
  gratitude: {},
  'habit-track': { habit: 'Exercise', days: '21', done: '5' },
  'mood-track': { rating: '7' },
  'pet-food': { weight: '10', type: 'dog' },
  'cat-tree': { cats: '1' },
  'dog-train': { age: '2' },
  'dog-walk': { weight: '20' },
  'pet-chip': { weight: '10', type: 'dog' },
  'pet-vax': { age: '1' },
  'pet-age': { years: '5', type: 'dog' },
  'dog-years': { years: '5' },
  'cat-years': { years: '5' },
  'human-dog-years': { human: '30' },
  'party-planner': { guests: '20', hours: '3' },
  'event-budget': { guests: '50', budget: '1000' },
  'moving-cost': { distance: '50', items: '50', rooms: '2' },
  'apt-search': { income: '5000', fees: '100' },
  'closing-cost': { price: '300000', rate: '3' },
  'home-buy': { price: '300000', downPct: '20', rate: '6.5', term: '360' },
  'mortgage-ok': { income: '8000', debts: '500' },
  'moving-list': { days: '30' },
  'rent-ok': { income: '5000', rent: '1500' },
  'elec-bill': { watts: '100', hours: '8', rate: '0.12' },
  'appliance-cost': { watts: '1500', hours: '1', rate: '0.12' },
  'appliance-energy': { watts: '100', hours: '24' },
  'energy-bill': { kwh: '500', rate: '0.12', base: '10' },
  'bulb-save': { oldW: '60', newW: '10', hours: '5', count: '10', rate: '0.12' },
  'thermostat-save': { bill: '200', smartCost: '200' },
  'grocery-budget': { people: '2', perPerson: '100' },
  'best-buy': { priceA: '5.99', qtyA: '16', priceB: '4.99', qtyB: '12' },
  'bundle-save': { single: '10', bundle: '25' },
  bogo: { price: '5', qty: '2' },
  'cost-use': { price: '20', uses: '10' },
  coupon: { total: '50', discount: '10' },
  'price-comp': { priceA: '25', priceB: '22' },
  'price-oz': { price: '3.99', oz: '16' },
  'price-lb': { price: '5.99', lb: '1' },
  'unit-price': { price: '10', units: '5' },
  'commute-fuel': { distance: '25', days: '5', mpg: '25', gasPrice: '3.5' },
  parking: { daily: '15', days: '5' },
  'rental-car': { daily: '50', days: '3', insurance: '15', deposit: '200' },
  'taxi-fare': { distance: '5', base: '3.5', perKm: '2', tip: '0' },
  toll: { tolls: '5', days: '5' },
  'soil-calc': { area: '10', depth: '0.1' },
  mulch: { area: '10', depth: '0.075' },
  compost: { area: '10', depth: '0.05' },
  'cold-frame': { width: '1', length: '2' },
  container: { pots: '5', size: 'medium' },
  greenhouse: { width: '2', length: '3' },
  herb: { area: '1' },
  'indoor-herb': { pots: '3' },
  microgreen: { trays: '2' },
  'raised-bed': { width: '1.2', length: '2.4', height: '0.3' },
  trellis: { width: '1', height: '2' },
  vertical: { area: '1' },
  worm: { people: '2' },
  'storage-cost': { size: '100', rate: '1.5', months: '12' },
  closet: { width: '2' },
  konmari: { items: '100' },
  garage: { cars: '1' },
  'home-inv': { rooms: '3' },
  'home-org': { area: '100' },
  shed: { width: '2', length: '3' },
  workshop: { width: '4', length: '5' },
  'delivery-fee': { distance: '5', base: '5', perKm: '1.5', tip: '3' },
  baggage: { bags: '1', weight: '23' },
  'hotel-cost': { nights: '3', rate: '150' },
  luggage: { height: '55', width: '40', depth: '20' },
  'packing-list': { days: '3', climate: 'moderate' },
  'pack-vol': { outfits: '5', shoes: '2' },
  'travel-budget': { days: '7', flight: '500', hotel: '150', food: '100' },
  'travel-time': { distance: '1000', speed: '800', layovers: '0' },
  'trip-cost': { transport: '500', lodging: '600', food: '300', activities: '200' },
  weather: { tempA: '25', tempB: '10' },
  'streaming-cost': { services: '3', avgCost: '12.99' },
  'subscription-calc': { subs: '5', avg: '10' },
  'sub-cost': { services: '4', avg: '14.99' },
  'sub-save': { current: '60', bundle: '40' },
  'net-speed': { devices: '4', streaming: 'yes', gaming: 'no', work: 'yes' },
  'data-usage': { devices: '3', hd: '2', sd: '3' },
  'internet-cost': { plan: '60', equip: '10' },
  'salary-hourly': { annual: '60000' },
  'hourly-salary': { hourly: '30' },
  'billable-hrs': { rate: '100', hours: '1500', expenses: '30000' },
  'meeting-cost2': { attendees: '4', duration: '60', avgSalary: '60000' },
  pomodoro: { work: '25', breaks: '5', cycles: '4' },
  'priority-matrix2': { tasks: '10', urgent: '3', important: '4' },
  productivity: { done: '6', planned: '8', focus: '70' },
  'project-deadline2': { tasks: '20', hoursPer: '4', hoursPerDay: '6' },
  'task-est': { optimistic: '2', likely: '4', pessimistic: '8' },
  'time-block': { hours: '8', blocks: '4', focus: '80' },
  'work-hours': { start: '09:00', end: '17:00', breaks: '1' },
  'file-size2': { size: '500', speed: '50', unit: 'MB' },
  'download-time': { size: '5000', speed: '100', unit: 'MB' },
  'upload-time': { size: '100', speed: '20', unit: 'MB' },
  'calories-burned': { met: '3.5', weight: '70', minutes: '30', activity: 'walking' },
  'walking-cal': { weight: '70', minutes: '30' },
  'running-cal': { weight: '70', minutes: '30', speed: '8' },
  'cycling-cal': { weight: '70', minutes: '30', speed: '16' },
  'swimming-cal': { weight: '70', minutes: '30', intensity: 'moderate' },
  'yoga-cal': { weight: '70', minutes: '30', style: 'hatha' },
  'desk-ergo': { height: '170' },
  'stand-desk': { height: '170' },
  'monitor-ht': { height: '170' },
  'tv-size': { distance: '3' },
  'projector-screen': { distance: '3', aspect: '16:9' },
  'floor-mat': { area: '20', plankW: '0.15', plankL: '1.2', perPack: '8' },
  'carpet-room': { width: '4', length: '5' },
  'deck-mat': { width: '4', length: '5' },
  'fence-mat': { length: '10', height: '1.8' },
  'seed-space': { area: '10', spacing: '0.3' },
  'plant-space': { area: '10', spacing: '0.3', rowSpacing: '0.3' },
  companion: { crop: 'tomato' },
  'seed-start': { weeks: '8', trays: '2' },
  transplant: { plants: '20', spacing: '0.3' },
  'crop-yield': { area: '100', yieldPerM2: '2.5' },
  'crop-rotate': { beds: '4' },
  'aquarium-vol': { length: '60', width: '30', height: '30' },
  'aquarium-heater': { volume: '100', room: '20', target: '26' },
  'aquarium-light': { volume: '100', planted: 'no' },
  'aquarium-size2': { fish: '5', fishSize: '5' },
  'cleaning-time': { rooms: '3', bath: '1', type: 'deep' },
  'clean-supplies': { area: '100' },
  'laundry-cost': { loads: '4', costPer: '1.50' },
  'laundry-auto': { people: '2', costPer: '1.50' },
  'cater-cost': { guests: '50', perPerson: '25' },
  'meal-prep': { meals: '14', cost: '70', prepTime: '30' },
  'leftover-calc': { portions: '4', eaten: '3', waste: '0' },
  'pizza-calc': { pizzas: '2', slices: '8', people: '4' },
  'coffee-calc2': { cups: '10', costPer: '0.50' },
  'takeout-calc': { meals: '5', avgCost: '15' },
  'util-est': { electricity: '120', water: '40', gas: '60', internet: '60', other: '30' },
  'auto-util': { sqft: '1500', people: '2' },
  'util-cost': { electricity: '120', water: '40', gas: '60', trash: '25' },
  'cell-cost': { plan: '50', lines: '2', device: '800' },
  'phone-bill': { plan: '60', taxes: '15' },
  'pet-cost2': { food: '50', vet: '300', supplies: '20', other: '10' },
  'pet-board': { days: '7', daily: '35', deposit: '0' },
  'pet-groom': { visits: '6', costPer: '50' },
  'pet-sit': { days: '5', daily: '30', visits: '2' },
  'hex-color': { hex: '#1a3a8a' },
  'color-pick': { r: '52', g: '160', b: '164' },
  'lotto-calc': { odds: '292200000', ticket: '2', jackpot: '100000000' },
  'bingo-odds': { cards: '1', players: '20' },
  'lotto-odds': { mainBalls: '69', picks: '5', extraBalls: '26' },
  'poker-odds': { outs: '8', cards: '47' },
  'carbon-foot': { electricity: '500', gas: '50', carKm: '200', flights: '2' },
  'flight-carbon2': { distance: '5000', passengers: '1' },
  'flight-offset': { distance: '5000', passengers: '1', costPer: '0.02' },
  'furniture-arr': { roomW: '5', roomL: '4', walkway: '0.9' },
  'furniture-lay': { roomW: '5', roomL: '4', sofa: '2', table: '1' },
  'room-size': { width: '4', length: '5' },
  'curtain-len': { width: '2', height: '2.4', fullness: '2', mount: 'floor' },
  'curtain-size2': { width: '2', height: '2.4' },
  '50-30-20-budget-2': { income: '5000' },
  'budget-planner-calc': { income: '5000', housing: '1500', food: '600', transport: '300', utilities: '200', other: '400', savingsGoal: '500' },
  'budget-envelope': { total: '2000', groceries: '600', dining: '300', entertainment: '200', transport: '300', other: '200' },
  'emergency-fund-calc': { expenses: '3000', months: '6', current: '5000' },
  'net-worth-calc': { home: '350000', investments: '50000', cash: '10000', vehicles: '25000', otherAssets: '5000', mortgage: '250000', loans: '15000', creditCards: '5000', otherLiabilities: '2000' },
  'net-worth-calc-2': { assets: '500000', liabilities: '200000' },
  'passive-income': { investment: '100000', yieldRate: '5', monthlyAdd: '500' },
  'debt-snowball': { debt1: '5000', min1: '150', debt2: '2000', min2: '75', debt3: '10000', min3: '250', extra: '100' },
  'debt-avalanche': { debt1: '5000', rate1: '22', min1: '150', debt2: '2000', rate2: '18', min2: '75', debt3: '10000', rate3: '15', min3: '250', extra: '100' },
  'zero-based-budget-2': { income: '5000', housing: '1500', food: '600', transport: '300', utilities: '200', savings: '1000', other: '1400' },
  'paypal-fees': { amount: '100', type: 'domestic' },
  'stripe-fees': { amount: '100', cardType: 'credit' },
  'ebay-fees': { salePrice: '100', category: 'electronics', store: 'store-none' },
  'etsy-fees': { itemPrice: '25', qty: '1', shipping: '5' },
  'amazon-fba': { itemPrice: '20', category: 'electronics', sizeTier: 's-standard' },
  'crowdfunding-fee': { goal: '10000', platform: 'kickstarter' },
  'pawn-loan': { itemValue: '500', loanPct: '30', monthlyRate: '5', months: '3' },
  'craps-odds': { betAmount: '10', betType: 'craps-pass' },
  'roulette-odds': { betAmount: '10', betType: 'roulette-red-black', wheelType: 'european' },
  'parlay-odds': { legs: '3', oddsDecimal: '2.0', stake: '50' },
  'prop-bet': { stake: '50', yesOdds: '150', noOdds: '-170' },
  'sports-betting-odds': { stake: '100', oddsAmerican: '-110' },
  'blackjack-basic': { handValue: '16', dealerUp: '10' },
  'generator-sizing': { sqft: '1500', ac: 'yes', fridge: 'yes', wellPump: 'no', sump: 'no', lights: 'yes' },
  'furnace-cost': { sqft: '2000', efficiency: '80', region: 'midwest' },
  'pool-chemical-calc': { volume: '20000', chemical: 'chlorine', currentLevel: '1', targetLevel: '3' },
  'pool-heating-cost': { volume: '20000', desiredTemp: '82', currentTemp: '70', heaterType: 'gas', costPer: '1.5', months: '3' },
  'solar-panel-calc': { monthlyBill: '200', sunlight: '5', systemEfficiency: '80' },
  'space-heater-cost': { watts: '1500', hours: '8', rate: '0.12' },
  'leak-detection': { dripsPerMin: '60', hoursPerDay: '24' },
  'phantom-load': { devices: '10', avgStandby: '20', rate: '0.12' },
  'pest-control-cost': { sqft: '2000', pestType: 'ants', treatmentType: 'quarterly', severity: 'moderate' },
  'shower-time-cost': { showerMins: '10', flowRate: '2.0', waterCost: '0.005', heaterType: 'electric' },
  'toilet-flush-cost': { flushesPerDay: '5', gallonsPerFlush: '1.6', waterCost: '0.005' },
  'cashback-calc': { annualSpend: '20000', cashbackRate: '2', category: 'flat' },
  'rebate-calc': { purchasePrice: '500', rebateAmount: '50', mailIn: 'yes', taxRate: '8' },
  'loyalty-rewards': { pointsPerDollar: '2', annualSpend: '20000', redemptionValue: '1' },
  'consignment-pricing': { itemPrice: '100', commissionRate: '40', platform: 'online' },
  'craigslist-pricing': { itemAge: '12', originalPrice: '1000', condition: 'good', demand: 'medium' },
  'auction-hammer': { hammerPrice: '1000', buyersPremium: '20', sellersCommission: '15', vatOnPremium: 'no', vatRate: '20' },
  'diaper-cost': { babyAge: '6-12mo', diapersPerDay: '8', costPerDiaper: '0.25', brand: 'generic' },
  'formula-cost': { babyAge: '3-6mo', ozPerFeeding: '4', feedingsPerDay: '8', costPerOz: '0.15' },
  'baby-gear': { stroller: '300', carSeat: '250', crib: '400', clothes: '500', bottles: '50', highChair: '150', babyOther: '200', preset: 'mid-range' },
  'college-fund': { childAge: '5', collegeAge: '18', currentSavings: '5000', monthlyContribution: '200', expectedReturn: '6', tuitionCost: '20000' },
  'college-savings-calc': { childAge: '5', stateTaxDeduction: '5000', monthlyContribution: '250', expectedReturn: '6', tuitionInflation: '5' },
  'pet-insurance': { petType: 'dog', petAge: '3', coverageLevel: 'accident+illness', deductible: '250', reimbursement: '80', annualVetCost: '800' },
  'towing-capacity': { gvwr: '6000', curbWeight: '4000', payload: '500', tongueWeightPercent: '12', trailerWeight: '2000' },
  'tire-pressure-calc': { currentPressure: '30', recommendedPressure: '32', load: 'normal', temperature: 'summer' },
  'qr-code-generator': { contentType: 'url', content: 'https://example.com', size: 'medium', errorCorrection: 'M' },
  'font-size-calc': { baseSize: '16', scaleRatio: '1.25', level: 'body' },
  'secret-santa': { participants: '5', maxBudget: '25' },
  'yard-sale': { clothingValue: '200', furnitureValue: '300', booksValue: '50', toysValue: '100', kitchenValue: '150', electronicsValue: '200', strategy: 'fair' },
  'raffle-tickets': { ticketsSold: '100', yourTickets: '5', prizeValue: '500', ticketPrice: '2' },
  'sweepstakes-entry': { entriesSubmitted: '100', totalEntriesEstimated: '5000', numberOfPrizes: '3' },
  'side-hustle': { hourlyRate: '25', hoursPerWeek: '10', weeksPerYear: '48', expenses: '500', taxRate: '22' },
  'spending-habit': { coffee: '5', lunch: '12', snacks: '4', drinks: '3', transportation: '6' },
  'funeral-cost': { disposition: 'burial', casketCost: '2000', serviceFee: '2000', burialPlot: '3000', headstone: '1500', funeralOther: '1000' },
  'charity-donation': { donationAmount: '1000', taxBracket: '22', itemized: 'yes' },
  'dry-cleaning-cost': { shirtsPerWeek: '3', suitsPerWeek: '1', dressesPerWeek: '1', coatsPerWeek: '0', pantsPerWeek: '2', weeksPerYear: '48' },
  'travel-insurance': { tripCost: '2000', ageGroup: '31-50', coverageType: 'standard' },
  'renters-insurance': { propertyValue: '30000', deductible: '500', liability: '300000' },
  'security-deposit': { monthlyRent: '1500', depositMonths: '1', stateRequiresInterest: 'no' },
  'wedding-guest': { outfit: '150', transportationCost: '50', hotelNights: '1', hotelRate: '200', gift: '100', hasPreWedding: 'no' },
  'holiday-budget-2': { totalBudget: '1000', gifts: '500', travel: '250', food: '150', decorations: '50', entertainment: '50' },
  'fundraiser-goal': { targetAmount: '10000', numberOfDonors: '100', averageDonation: '50', platform: 'gofundme' },
  'biweekly-monthly': { biweeklyAmount: '1000' },
  'bonus-calc': { bonusAmount: '5000', bonusTaxRate: '22', stateTax: '5', fica: '7.65' },
}

export const everydayPresets: Record<string, { label: string; values: Record<string, string> }[]> = {
  pace: [
    { label: '10K Run', values: { distance: '10', hours: '0', mins: '50' } },
    { label: 'Half Marathon', values: { distance: '21.1', hours: '1', mins: '45' } },
    { label: 'Marathon', values: { distance: '42.2', hours: '3', mins: '30' } },
  ],
  steps: [
    { label: '10K Steps', values: { steps: '10000', stride: '0.76' } },
    { label: '8K Steps', values: { steps: '8000', stride: '0.76' } },
  ],
  water_intake: [
    { label: 'Light Activity', values: { weight: '70', activity: '15' } },
    { label: 'Heavy Activity', values: { weight: '70', activity: '60' } },
  ],
  caffeine: [
    { label: 'Morning Coffee', values: { cups: '2', type: 'drip' } },
    { label: 'Energy Drinks', values: { cups: '2', type: 'energy' } },
  ],
  bac: [
    { label: '2 Drinks (Male)', values: { drinks: '2', weight: '80', gender: 'male', hours: '1' } },
    { label: '3 Drinks (Female)', values: { drinks: '3', weight: '60', gender: 'female', hours: '2' } },
  ],
  habit_cost: [
    { label: 'Daily Coffee', values: { perDay: '5', quantity: '1' } },
    { label: 'Smoking Pack/Day', values: { perDay: '10', quantity: '1' } },
  ],
  pet: [
    { label: 'Medium Dog (10kg)', values: { weight: '10', type: 'dog' } },
    { label: 'Cat (5kg)', values: { weight: '5', type: 'cat' } },
  ],
  party: [
    { label: 'Small Gathering', values: { guests: '10', hours: '3' } },
    { label: 'Big Party', values: { guests: '50', hours: '5' } },
  ],
  wedding: [
    { label: 'Intimate Wedding', values: { guests: '50', total: '15000' } },
    { label: 'Grand Wedding', values: { guests: '200', total: '50000' } },
  ],
  car_payment: [
    { label: '$30K 5yr 5%', values: { price: '30000', down: '5000', rate: '5', term: '60' } },
    { label: '$40K 6yr 4%', values: { price: '40000', down: '8000', rate: '4', term: '72' } },
  ],
  salary: [
    { label: '$50K Annual', values: { annual: '50000' } },
    { label: '$80K Annual', values: { annual: '80000' } },
    { label: '$120K Annual', values: { annual: '120000' } },
  ],
  overtime: [
    { label: '5hr OT @ $25', values: { rate: '25', regular: '40', overtime: '5' } },
    { label: '10hr OT @ $30', values: { rate: '30', regular: '40', overtime: '10' } },
  ],
  splitting: [
    { label: 'Dinner for 2', values: { total: '80', people: '2', tipPercent: '18' } },
    { label: 'Group of 4', values: { total: '200', people: '4', tipPercent: '15' } },
  ],
  sleep: [
    { label: 'Wake 7 AM (5 cycles)', values: { wake: '07:00', cycles: '5' } },
    { label: 'Wake 6 AM (6 cycles)', values: { wake: '06:00', cycles: '6' } },
  ],
  ergonomics: [
    { label: 'Average Height (170cm)', values: { height: '170' } },
    { label: 'Tall (185cm)', values: { height: '185' } },
  ],
  tv: [
    { label: '3m Distance', values: { distance: '3', aspect: '16:9' } },
    { label: '2m Distance', values: { distance: '2', aspect: '16:9' } },
  ],
  paint: [
    { label: 'Small Room 5×-2.5m', values: { width: '5', height: '2.5', coats: '2' } },
    { label: 'Large Wall 8×-3m', values: { width: '8', height: '3', coats: '2' } },
  ],
  exercise: [
    { label: 'Walking 30min', values: { met: '3.5', weight: '70', minutes: '30', activity: 'walking' } },
    { label: 'Running 30min', values: { met: '9.8', weight: '70', minutes: '30', activity: 'running' } },
  ],
  carbon: [
    { label: 'Average Household', values: { electricity: '500', gas: '50', carKm: '200', flights: '2' } },
    { label: 'Low Carbon', values: { electricity: '300', gas: '20', carKm: '50', flights: '0' } },
  ],
  gym: [
    { label: 'Budget Gym', values: { monthly: '25', visits: '8', commute: '3' } },
    { label: 'Premium Gym', values: { monthly: '100', visits: '12', commute: '5' } },
  ],
  fastfood: [
    { label: '2x Week', values: { meals: '2', avgCal: '800', avgCost: '10' } },
    { label: '4x Week', values: { meals: '4', avgCal: '900', avgCost: '12' } },
  ],
  'gpa-calc': [
    { label: 'Straight As', values: { grades: 'A, A, A, A' } },
    { label: 'Mixed Grades', values: { grades: 'A, B, B+, A-, C+' } },
  ],
  'password-gen': [
    { label: 'Standard 16 chars', values: { length: '16', upper: 'yes', digits: 'yes', symbols: 'yes' } },
    { label: 'Strong 24 chars', values: { length: '24', upper: 'yes', digits: 'yes', symbols: 'yes' } },
  ],
  'run-pace': [
    { label: '10K Run', values: { distance: '10', hours: '0', mins: '50' } },
    { label: 'Half Marathon', values: { distance: '21.1', hours: '1', mins: '45' } },
  ],
  'step-counter': [
    { label: '10K Steps', values: { steps: '10000', stride: '0.76' } },
    { label: '8K Steps', values: { steps: '8000', stride: '0.76' } },
  ],
  'smoking-cost': [
    { label: 'Pack/Day', values: { perDay: '10', packs: '1' } },
    { label: 'Half Pack', values: { perDay: '10', packs: '0.5' } },
  ],
  'coffee-cost': [
    { label: 'Daily Coffee', values: { perDay: '5', cups: '1' } },
    { label: 'Double Shot', values: { perDay: '5', cups: '2' } },
  ],
  'pet-food': [
    { label: 'Medium Dog (10kg)', values: { weight: '10', type: 'dog' } },
    { label: 'Cat (5kg)', values: { weight: '5', type: 'cat' } },
  ],
  'party-planner': [
    { label: 'Small Gathering', values: { guests: '10', hours: '3' } },
    { label: 'Big Party', values: { guests: '50', hours: '5' } },
  ],
  'salary-hourly': [
    { label: '$50K Annual', values: { annual: '50000' } },
    { label: '$80K Annual', values: { annual: '80000' } },
  ],
  'grocery-budget': [
    { label: 'Family of 2', values: { people: '2', perPerson: '100' } },
    { label: 'Family of 4', values: { people: '4', perPerson: '80' } },
  ],
  'commute-fuel': [
    { label: 'Short Commute', values: { distance: '10', days: '5', mpg: '25', gasPrice: '3.5' } },
    { label: 'Long Commute', values: { distance: '40', days: '5', mpg: '30', gasPrice: '3.5' } },
  ],
  'storage-cost': [
    { label: 'Small Unit 5×-5', values: { size: '25', rate: '2', months: '12' } },
    { label: 'Large Unit 10×-10', values: { size: '100', rate: '1.5', months: '12' } },
  ],
  'moving-cost': [
    { label: 'Studio Apartment', values: { distance: '20', items: '30', rooms: '1' } },
    { label: '3BR House', values: { distance: '100', items: '100', rooms: '3' } },
  ],
  'elec-bill': [
    { label: 'LED Bulb 10W', values: { watts: '10', hours: '8', rate: '0.12' } },
    { label: 'Space Heater 1500W', values: { watts: '1500', hours: '4', rate: '0.12' } },
  ],
  'travel-budget': [
    { label: 'Weekend Trip', values: { days: '3', flight: '200', hotel: '120', food: '80' } },
    { label: 'Week-long', values: { days: '7', flight: '500', hotel: '150', food: '100' } },
  ],
  '50-30-20-budget-2': [
    { label: '$4K Income', values: { income: '4000' } },
    { label: '$6K Income', values: { income: '6000' } },
  ],
  'emergency-fund-calc': [
    { label: '6 Months (3K/mo)', values: { expenses: '3000', months: '6', current: '5000' } },
    { label: '3 Months (4K/mo)', values: { expenses: '4000', months: '3', current: '2000' } },
  ],
  'net-worth-calc': [
    { label: 'Young Professional', values: { home: '250000', investments: '20000', cash: '5000', vehicles: '20000', otherAssets: '3000', mortgage: '200000', loans: '10000', creditCards: '2000', otherLiabilities: '1000' } },
    { label: 'Established', values: { home: '500000', investments: '150000', cash: '30000', vehicles: '40000', otherAssets: '10000', mortgage: '250000', loans: '5000', creditCards: '3000', otherLiabilities: '2000' } },
  ],
  'passive-income': [
    { label: '$50K at 5%', values: { investment: '50000', yieldRate: '5', monthlyAdd: '200' } },
    { label: '$200K at 4%', values: { investment: '200000', yieldRate: '4', monthlyAdd: '1000' } },
  ],
  'debt-snowball': [
    { label: '3 Debts (by balance)', values: { debt1: '5000', min1: '150', debt2: '2000', min2: '75', debt3: '10000', min3: '250', extra: '100' } },
    { label: '2 Debts (small first)', values: { debt1: '800', min1: '50', debt2: '15000', min2: '300', debt3: '0', min3: '0', extra: '200' } },
  ],
  'debt-avalanche': [
    { label: '3 Debts (by rate)', values: { debt1: '5000', rate1: '22', min1: '150', debt2: '2000', rate2: '18', min2: '75', debt3: '10000', rate3: '15', min3: '250', extra: '100' } },
    { label: 'High rate first', values: { debt1: '3000', rate1: '29', min1: '100', debt2: '12000', rate2: '7', min2: '200', debt3: '0', rate3: '0', min3: '0', extra: '150' } },
  ],
  'zero-based-budget-2': [
    { label: '$5K Income', values: { income: '5000', housing: '1500', food: '600', transport: '300', utilities: '200', savings: '1000', other: '1400' } },
    { label: '$3K Income', values: { income: '3000', housing: '900', food: '400', transport: '200', utilities: '150', savings: '500', other: '850' } },
  ],
  'paypal-fees': [
    { label: 'Domestic $100 Sale', values: { amount: '100', type: 'domestic' } },
    { label: 'International $50 Sale', values: { amount: '50', type: 'international' } },
  ],
  'stripe-fees': [
    { label: '$100 Credit Card', values: { amount: '100', cardType: 'credit' } },
    { label: '$250 Amex', values: { amount: '250', cardType: 'amex' } },
  ],
  'ebay-fees': [
    { label: '$100 Electronics', values: { salePrice: '100', category: 'electronics', store: 'store-none' } },
    { label: '$50 Clothing Basic', values: { salePrice: '50', category: 'clothing', store: 'store-basic' } },
  ],
  'etsy-fees': [
    { label: '$25 Item + $5 Ship', values: { itemPrice: '25', qty: '1', shipping: '5' } },
    { label: '$15 Item × 3 Qty', values: { itemPrice: '15', qty: '3', shipping: '0' } },
  ],
  'amazon-fba': [
    { label: '$20 Small Electronics', values: { itemPrice: '20', category: 'electronics', sizeTier: 's-small' } },
    { label: '$50 Standard Book', values: { itemPrice: '50', category: 'books', sizeTier: 's-standard' } },
  ],
  'crowdfunding-fee': [
    { label: '$10K Kickstarter', values: { goal: '10000', platform: 'kickstarter' } },
    { label: '$5K Indiegogo', values: { goal: '5000', platform: 'indiegogo' } },
  ],
  'pawn-loan': [
    { label: '$500 Item 30% 5% 3mo', values: { itemValue: '500', loanPct: '30', monthlyRate: '5', months: '3' } },
    { label: '$1000 Item 40% 8% 2mo', values: { itemValue: '1000', loanPct: '40', monthlyRate: '8', months: '2' } },
  ],
  'craps-odds': [
    { label: '$10 Pass Line', values: { betAmount: '10', betType: 'craps-pass' } },
    { label: '$5 Field Bet', values: { betAmount: '5', betType: 'craps-field' } },
  ],
  'roulette-odds': [
    { label: '$10 Red/Black European', values: { betAmount: '10', betType: 'roulette-red-black', wheelType: 'european' } },
    { label: '$5 Single American', values: { betAmount: '5', betType: 'roulette-single', wheelType: 'american' } },
  ],
  'parlay-odds': [
    { label: '3 Legs @ 2.0', values: { legs: '3', oddsDecimal: '2.0', stake: '50' } },
    { label: '2 Legs @ 1.8', values: { legs: '2', oddsDecimal: '1.8', stake: '100' } },
  ],
  'prop-bet': [
    { label: '$50 Yes +150 No -170', values: { stake: '50', yesOdds: '150', noOdds: '-170' } },
    { label: '$100 Yes +200 No -240', values: { stake: '100', yesOdds: '200', noOdds: '-240' } },
  ],
  'sports-betting-odds': [
    { label: '$100 at -110 (NFL)', values: { stake: '100', oddsAmerican: '-110' } },
    { label: '$50 at +200 (Underdog)', values: { stake: '50', oddsAmerican: '200' } },
  ],
  'blackjack-basic': [
    { label: '16 vs Dealer 10', values: { handValue: '16', dealerUp: '10' } },
    { label: '12 vs Dealer 4', values: { handValue: '12', dealerUp: '4' } },
  ],
  'generator-sizing': [
    { label: '1500sqft Home', values: { sqft: '1500', ac: 'yes', fridge: 'yes', wellPump: 'no', sump: 'no', lights: 'yes' } },
    { label: '3000sqft Home', values: { sqft: '3000', ac: 'yes', fridge: 'yes', wellPump: 'yes', sump: 'yes', lights: 'yes' } },
  ],
  'furnace-cost': [
    { label: '2000sqft Northeast', values: { sqft: '2000', efficiency: '95', region: 'northeast' } },
    { label: '1500sqft South', values: { sqft: '1500', efficiency: '80', region: 'south' } },
  ],
  'pool-chemical-calc': [
    { label: '20000gal Chlorine', values: { volume: '20000', chemical: 'chlorine', currentLevel: '1', targetLevel: '3' } },
    { label: '10000gal pH Adjust', values: { volume: '10000', chemical: 'ph_up', currentLevel: '6.8', targetLevel: '7.4' } },
  ],
  'pool-heating-cost': [
    { label: '20000gal Gas Heater', values: { volume: '20000', desiredTemp: '82', currentTemp: '70', heaterType: 'gas', costPer: '1.5', months: '3' } },
    { label: '15000gal Heat Pump', values: { volume: '15000', desiredTemp: '85', currentTemp: '68', heaterType: 'heat_pump', costPer: '0.12', months: '4' } },
  ],
  'solar-panel-calc': [
    { label: '$200 Bill 5hr Sun', values: { monthlyBill: '200', sunlight: '5', systemEfficiency: '80' } },
    { label: '$150 Bill 6hr Sun', values: { monthlyBill: '150', sunlight: '6', systemEfficiency: '85' } },
  ],
  'space-heater-cost': [
    { label: '1500W 8hr/day', values: { watts: '1500', hours: '8', rate: '0.12' } },
    { label: '750W 4hr/day', values: { watts: '750', hours: '4', rate: '0.12' } },
  ],
  'leak-detection': [
    { label: '1 Drip/Sec (24hr)', values: { dripsPerMin: '60', hoursPerDay: '24' } },
    { label: '1 Drip/5Sec (24hr)', values: { dripsPerMin: '12', hoursPerDay: '24' } },
  ],
  'phantom-load': [
    { label: '10 Devices 20W Avg', values: { devices: '10', avgStandby: '20', rate: '0.12' } },
    { label: '5 Devices 10W Avg', values: { devices: '5', avgStandby: '10', rate: '0.12' } },
  ],
  'pest-control-cost': [
    { label: '2500sqft Termites', values: { sqft: '2500', pestType: 'termites', treatmentType: 'quarterly', severity: 'moderate' } },
    { label: '1500sqft Ants', values: { sqft: '1500', pestType: 'ants', treatmentType: 'monthly', severity: 'mild' } },
  ],
  'shower-time-cost': [
    { label: '10min 2.0 GPM Electric', values: { showerMins: '10', flowRate: '2.0', waterCost: '0.005', heaterType: 'electric' } },
    { label: '5min 1.5 GPM Gas', values: { showerMins: '5', flowRate: '1.5', waterCost: '0.005', heaterType: 'gas' } },
  ],
  'toilet-flush-cost': [
    { label: 'Old 1.6 GPF', values: { flushesPerDay: '5', gallonsPerFlush: '1.6', waterCost: '0.005' } },
    { label: 'WaterSense 1.28 GPF', values: { flushesPerDay: '5', gallonsPerFlush: '1.28', waterCost: '0.005' } },
  ],
  'cashback-calc': [
    { label: '$20K 2% Flat', values: { annualSpend: '20000', cashbackRate: '2', category: 'flat' } },
    { label: '$12K 5% Rotating', values: { annualSpend: '12000', cashbackRate: '5', category: 'rotating' } },
  ],
  'rebate-calc': [
    { label: '$500 Item $50 Rebate', values: { purchasePrice: '500', rebateAmount: '50', mailIn: 'yes', taxRate: '8' } },
    { label: '$200 Item $25 Rebate', values: { purchasePrice: '200', rebateAmount: '25', mailIn: 'no', taxRate: '10' } },
  ],
  'loyalty-rewards': [
    { label: '$20K 2x 1cent', values: { pointsPerDollar: '2', annualSpend: '20000', redemptionValue: '1' } },
    { label: '$15K 5x 1.5cents', values: { pointsPerDollar: '5', annualSpend: '15000', redemptionValue: '1.5' } },
  ],
  'consignment-pricing': [
    { label: '$100 40% Online', values: { itemPrice: '100', commissionRate: '40', platform: 'online' } },
    { label: '$500 50% Brick & Mortar', values: { itemPrice: '500', commissionRate: '50', platform: 'brick-mortar' } },
  ],
  'craigslist-pricing': [
    { label: '12mo $1000 Like New', values: { itemAge: '12', originalPrice: '1000', condition: 'like-new', demand: 'high' } },
    { label: '24mo $500 Good', values: { itemAge: '24', originalPrice: '500', condition: 'good', demand: 'medium' } },
  ],
  'auction-hammer': [
    { label: '$1000 20% BP 15% SC', values: { hammerPrice: '1000', buyersPremium: '20', sellersCommission: '15', vatOnPremium: 'no', vatRate: '20' } },
    { label: '$5000 25% BP 10% SC', values: { hammerPrice: '5000', buyersPremium: '25', sellersCommission: '10', vatOnPremium: 'no', vatRate: '20' } },
  ],
  'diaper-cost': [
    { label: 'Newborn 8/day generic', values: { babyAge: 'newborn', diapersPerDay: '8', costPerDiaper: '0.25', brand: 'generic' } },
    { label: '6mo 6/day premium', values: { babyAge: '6-12mo', diapersPerDay: '6', costPerDiaper: '0.35', brand: 'pampers' } },
  ],
  'formula-cost': [
    { label: '3mo 8x4oz', values: { babyAge: '3-6mo', ozPerFeeding: '4', feedingsPerDay: '8', costPerOz: '0.15' } },
    { label: '9mo 4x6oz', values: { babyAge: '9-12mo', ozPerFeeding: '6', feedingsPerDay: '4', costPerOz: '0.18' } },
  ],
  'baby-gear': [
    { label: 'Mid-range setup', values: { stroller: '300', carSeat: '250', crib: '400', clothes: '500', bottles: '50', highChair: '150', babyOther: '200', preset: 'mid-range' } },
    { label: 'Budget setup', values: { stroller: '100', carSeat: '150', crib: '200', clothes: '200', bottles: '25', highChair: '80', babyOther: '100', preset: 'budget' } },
  ],
  'college-fund': [
    { label: '5yo $200/mo @6%', values: { childAge: '5', collegeAge: '18', currentSavings: '5000', monthlyContribution: '200', expectedReturn: '6', tuitionCost: '20000' } },
    { label: '10yo $350/mo @5%', values: { childAge: '10', collegeAge: '18', currentSavings: '2000', monthlyContribution: '350', expectedReturn: '5', tuitionCost: '25000' } },
  ],
  'college-savings-calc': [
    { label: '5yo $250/mo 6%', values: { childAge: '5', stateTaxDeduction: '5000', monthlyContribution: '250', expectedReturn: '6', tuitionInflation: '5' } },
    { label: '1yo $500/mo 7%', values: { childAge: '1', stateTaxDeduction: '10000', monthlyContribution: '500', expectedReturn: '7', tuitionInflation: '5' } },
  ],
  'pet-insurance': [
    { label: 'Dog 3yr 80% $250', values: { petType: 'dog', petAge: '3', coverageLevel: 'accident+illness', deductible: '250', reimbursement: '80', annualVetCost: '800' } },
    { label: 'Cat 5yr 90% $100', values: { petType: 'cat', petAge: '5', coverageLevel: 'comprehensive', deductible: '100', reimbursement: '90', annualVetCost: '600' } },
  ],
  'towing-capacity': [
    { label: '6k GVWR 2k trailer', values: { gvwr: '6000', curbWeight: '4000', payload: '500', tongueWeightPercent: '12', trailerWeight: '2000' } },
    { label: '10k GVWR 5k trailer', values: { gvwr: '10000', curbWeight: '6000', payload: '1000', tongueWeightPercent: '10', trailerWeight: '5000' } },
  ],
  'tire-pressure-calc': [
    { label: 'Summer normal load', values: { currentPressure: '30', recommendedPressure: '32', load: 'normal', temperature: 'summer' } },
    { label: 'Winter heavy load', values: { currentPressure: '30', recommendedPressure: '32', load: 'heavy', temperature: 'winter' } },
  ],
  'qr-code-generator': [
    { label: 'URL medium M', values: { contentType: 'url', content: 'https://example.com', size: 'medium', errorCorrection: 'M' } },
    { label: 'Text large H', values: { contentType: 'text', content: 'Sample text content', size: 'large', errorCorrection: 'H' } },
  ],
  'font-size-calc': [
    { label: '16px 1.25 scale', values: { baseSize: '16', scaleRatio: '1.25', level: 'body' } },
    { label: '14px 1.333 scale', values: { baseSize: '14', scaleRatio: '1.333', level: 'h3' } },
  ],
  'secret-santa': [
    { label: '5ppl $25 budget', values: { participants: '5', maxBudget: '25' } },
    { label: '8ppl $15 budget', values: { participants: '8', maxBudget: '15' } },
  ],
  'yard-sale': [
    { label: 'Fair pricing total $1000', values: { clothingValue: '200', furnitureValue: '300', booksValue: '50', toysValue: '100', kitchenValue: '150', electronicsValue: '200', strategy: 'fair' } },
    { label: 'Cheap quick sale', values: { clothingValue: '200', furnitureValue: '300', booksValue: '50', toysValue: '100', kitchenValue: '150', electronicsValue: '200', strategy: 'cheap' } },
  ],
  'raffle-tickets': [
    { label: '5/100 tickets $500 prize', values: { ticketsSold: '100', yourTickets: '5', prizeValue: '500', ticketPrice: '2' } },
    { label: '1/50 tickets $1000 prize', values: { ticketsSold: '50', yourTickets: '1', prizeValue: '1000', ticketPrice: '5' } },
  ],
  'sweepstakes-entry': [
    { label: '100/5000 3 prizes', values: { entriesSubmitted: '100', totalEntriesEstimated: '5000', numberOfPrizes: '3' } },
    { label: '500/10000 5 prizes', values: { entriesSubmitted: '500', totalEntriesEstimated: '10000', numberOfPrizes: '5' } },
  ],
  'side-hustle': [
    { label: '$25/hr 10hr/wk', values: { hourlyRate: '25', hoursPerWeek: '10', weeksPerYear: '48', expenses: '500', taxRate: '22' } },
    { label: '$50/hr 5hr/wk', values: { hourlyRate: '50', hoursPerWeek: '5', weeksPerYear: '48', expenses: '300', taxRate: '30' } },
  ],
  'spending-habit': [
    { label: 'Typical daily spending', values: { coffee: '5', lunch: '12', snacks: '4', drinks: '3', transportation: '6' } },
    { label: 'High daily spending', values: { coffee: '8', lunch: '18', snacks: '7', drinks: '6', transportation: '10' } },
  ],
  'funeral-cost': [
    { label: 'Burial $9500', values: { disposition: 'burial', casketCost: '2000', serviceFee: '2000', burialPlot: '3000', headstone: '1500', funeralOther: '1000' } },
    { label: 'Cremation $6500', values: { disposition: 'cremation', casketCost: '1000', serviceFee: '2000', burialPlot: '1500', headstone: '1000', funeralOther: '1000' } },
  ],
  'charity-donation': [
    { label: '$1000 22% bracket', values: { donationAmount: '1000', taxBracket: '22', itemized: 'yes' } },
    { label: '$500 12% bracket', values: { donationAmount: '500', taxBracket: '12', itemized: 'yes' } },
  ],
  'dry-cleaning-cost': [
    { label: '3 shirts 1 suit weekly', values: { shirtsPerWeek: '3', suitsPerWeek: '1', dressesPerWeek: '0', coatsPerWeek: '0', pantsPerWeek: '2', weeksPerYear: '48' } },
    { label: 'Occasional weekly', values: { shirtsPerWeek: '2', suitsPerWeek: '0', dressesPerWeek: '1', coatsPerWeek: '0', pantsPerWeek: '1', weeksPerYear: '24' } },
  ],
  'travel-insurance': [
    { label: '$2k trip standard 31-50', values: { tripCost: '2000', ageGroup: '31-50', coverageType: 'standard' } },
    { label: '$5k trip comprehensive 66+', values: { tripCost: '5000', ageGroup: '66+', coverageType: 'comprehensive' } },
  ],
  'renters-insurance': [
    { label: '$30k property $500 ded', values: { propertyValue: '30000', deductible: '500', liability: '300000' } },
    { label: '$20k property $250 ded', values: { propertyValue: '20000', deductible: '250', liability: '100000' } },
  ],
  'security-deposit': [
    { label: '$1500/mo 1mo deposit', values: { monthlyRent: '1500', depositMonths: '1', stateRequiresInterest: 'no' } },
    { label: '$2000/mo 2mo deposit', values: { monthlyRent: '2000', depositMonths: '2', stateRequiresInterest: 'yes' } },
  ],
  'wedding-guest': [
    { label: 'Guest 1 night $150 gift', values: { outfit: '150', transportationCost: '50', hotelNights: '1', hotelRate: '200', gift: '100', hasPreWedding: 'no' } },
    { label: 'Guest w/ pre-wedding events', values: { outfit: '200', transportationCost: '100', hotelNights: '2', hotelRate: '250', gift: '200', hasPreWedding: 'yes' } },
  ],
  'holiday-budget-2': [
    { label: '$1k balanced holidays', values: { totalBudget: '1000', gifts: '500', travel: '250', food: '150', decorations: '50', entertainment: '50' } },
    { label: '$500 frugal holidays', values: { totalBudget: '500', gifts: '250', travel: '100', food: '100', decorations: '25', entertainment: '25' } },
  ],
  'fundraiser-goal': [
    { label: '$10k GoFundMe', values: { targetAmount: '10000', numberOfDonors: '100', averageDonation: '50', platform: 'gofundme' } },
    { label: '$50k Kickstarter', values: { targetAmount: '50000', numberOfDonors: '200', averageDonation: '25', platform: 'kickstarter' } },
  ],
  'biweekly-monthly': [
    { label: '$1000 biweekly', values: { biweeklyAmount: '1000' } },
    { label: '$1500 biweekly', values: { biweeklyAmount: '1500' } },
  ],
  'bonus-calc': [
    { label: '$5k bonus 22% fed', values: { bonusAmount: '5000', bonusTaxRate: '22', stateTax: '5', fica: '7.65' } },
    { label: '$10k bonus 32% fed', values: { bonusAmount: '10000', bonusTaxRate: '32', stateTax: '8', fica: '7.65' } },
  ],
}

export const everydayFormulas: Record<string, { formula: string; description: string }> = {
  clothing: { formula: 'EU = US ×- 2 + 32 | UK = US - 2', description: 'Clothing size conversion between US, EU, and UK sizing standards.' },
  ring: { formula: 'US = mm ×- 0.04 + 1 | UK = mm ×- 0.04 - 0.5', description: 'Ring size conversion from circumference measurement.' },
  cooking: { formula: 'Time = weight ×- minutes_per_kg', description: 'Cooking time estimation based on weight and method.' },
  pace: { formula: 'Pace = time / distance | Speed = distance / time', description: 'Running and fitness pace calculation for race planning.' },
  steps: { formula: 'Distance = steps ×- stride | Calories = steps ×- 0.04', description: 'Step counter conversion to distance and calories.' },
  water_intake: { formula: 'Water = weight ×- 0.033 + activity ×- 0.5', description: 'Daily water intake recommendation based on weight and activity.' },
  caffeine: { formula: 'Caffeine = cups ×- mg_per_cup', description: 'Caffeine intake tracking with safe limit of 400mg/day.' },
  alcohol: { formula: 'Pure_alc = vol ×- ABV% ×- 0.789 | Drinks = g / 10', description: 'Alcohol content and standard drinks calculation.' },
  bac: { formula: 'BAC = (drinks×-14)/(weight×-r) - 0.015× hours', description: 'Blood alcohol content estimation using Widmark formula.' },
  habit_cost: { formula: 'Daily = unit ×- qty | Yearly = daily ×- 365', description: 'Daily habit cost projection over time.' },
  pet: { formula: 'Food = weight ×- multiplier', description: 'Pet food portion sizing by weight.' },
  pet_age: { formula: 'Human_years = 16×-ln(dog_years+1) + 31', description: 'Pet age to human years conversion using logarithmic formula.' },
  party: { formula: 'Drinks = guests ×- hours ×- 1.5 | Servings = guests ×- 6', description: 'Party planning estimate for food and drinks.' },
  wedding: { formula: 'Budget = venue(35%) + catering(30%) + photo(12%) + attire(8%) + other(15%)', description: 'Wedding budget allocation across categories.' },
  moving: { formula: 'Cost = rooms×-200 + km×-2.5 + items×-3', description: 'Moving cost estimation including labor, transport, and supplies.' },
  cleaning: { formula: 'Time = rooms×-min_per_room + baths×-30', description: 'Cleaning time estimate by room count and type.' },
  laundry: { formula: 'Cost = loads ×- rate | Yearly = weekly ×- 52', description: 'Laundry cost calculation per load.' },
  electricity: { formula: 'kWh = watts× hours/1000 | Cost = kWh×-rate', description: 'Appliance energy consumption and cost calculation.' },
  water_bill: { formula: 'Bill = base + usage×-rate/1000', description: 'Water bill estimation based on consumption.' },
  internet: { formula: 'Speed = base + devices×-5 + streaming + gaming + work', description: 'Internet speed requirement estimation.' },
  phone: { formula: 'Monthly = plan×-lines + device/24', description: 'Cell phone plan cost including device amortization.' },
  streaming: { formula: 'Total = services ×- avg_cost', description: 'Streaming subscription cost tracking.' },
  grocery: { formula: 'Weekly = people ×- per_person | Monthly = weekly ×- 4.33', description: 'Grocery budget planning per household.' },
  dining: { formula: 'Monthly = meals ×- 4.33 ×- avg_cost', description: 'Dining out expense tracking with savings projection.' },
  gym: { formula: 'Per_visit = monthly / visits | Yearly = monthly×-12 + commute×-12', description: 'Gym membership cost per visit analysis.' },
  maintenance: { formula: 'Annual = value ×- rule% | Monthly = annual / 12', description: 'Home maintenance budget using the 1% rule.' },
  car_payment: { formula: 'M = P×-r(1+r)^n / (1+r)^n-1 | Total = M×-n', description: 'Car loan monthly payment using amortization formula.' },
  car_cost: { formula: 'Monthly = payment + insurance + gas + maintenance', description: 'Total car ownership cost including all expenses.' },
  commute: { formula: 'Daily = dist×-2/mpg×-gas | Monthly = daily×-days×-4.33', description: 'Daily commute fuel cost calculation.' },
  tire: { formula: 'Diameter = rim×-25.4 + 2×-sidewall | Circ = p×-D', description: 'Tire dimensions and speedometer impact calculation.' },
  lottery: { formula: 'EV = jackpot/odds - ticket | ROI = (EV/ticket-1)×-100', description: 'Lottery expected value and return analysis.' },
  battery: { formula: 'Hours = mAh / mA | Wh = mAh×-V/1000', description: 'Battery life estimation from capacity and load.' },
  photo: { formula: 'Print = px / dpi | MP = w×-h/1e6', description: 'Photo resolution to print size conversion.' },
  file: { formula: 'Time_sec = file_bits / speed_mbps', description: 'File transfer time estimation.' },
  color: { formula: 'Hex ? RGB ? HSL color space conversion', description: 'Hex color code to RGB and HSL conversion.' },
  prime: { formula: 'Check divisors from 2 to ×^sn', description: 'Prime number verification using trial division.' },
  exercise: { formula: 'Cal = MET ×- weight ×- 3.5 ×- min / 200', description: 'Calories burned during physical activity using MET values.' },
  fastfood: { formula: 'Cal/week = meals ×- avg_cal | Cost = meals ×- avg_cost', description: 'Fast food calorie and cost tracking.' },
  ev: { formula: 'Range = battery ×- efficiency | Charge = battery / charger_kW', description: 'Electric vehicle range and charging time.' },
  carbon: { formula: 'CO2 = elec×-0.4 + gas×-2.2 + car×-0.12 + flights×-200', description: 'Carbon footprint estimation across categories.' },
  salary: { formula: 'Hourly = annual / 2080 | Weekly = annual / 52', description: 'Annual salary to hourly, weekly, monthly conversion.' },
  overtime: { formula: 'OT_pay = rate ×- 1.5 ×- OT_hrs | Total = regular + OT', description: 'Overtime pay calculation at 1.5x regular rate.' },
  commission: { formula: 'Commission = sales ×- rate% | Total = base + commission', description: 'Sales commission earnings with base salary.' },
  freelance: { formula: 'Rate = (target + overhead + expenses) / billable_hrs', description: 'Freelance hourly rate calculation.' },
  splitting: { formula: 'Per_person = total / people | With_tip = total ×- (1+tip%) / people', description: 'Bill splitting with optional tip inclusion.' },
  utilities: { formula: 'Total = electricity + water + gas + internet + other', description: 'Monthly utility cost aggregation.' },
  sleep: { formula: 'Bedtime = wake_time - cycles ×- 90min', description: 'Optimal bedtime calculation based on 90-min sleep cycles.' },
  ergonomics: { formula: 'Desk = height×-0.45 | Seat = height×-0.27 | Monitor = height+8%', description: 'Ergonomic workstation setup based on body height.' },
  tv: { formula: 'Ideal_size = distance_cm / 2.5 / 2.54 | Range = /3 to /1.5', description: 'Optimal TV size for viewing distance.' },
  paint: { formula: 'Litres = area ×- coats / 11 | Cans = ceil(litres / 3.785)', description: 'Paint quantity needed for room walls.' },
  wallpaper: { formula: 'Rolls = ceil(strips_needed / strips_per_roll)', description: 'Wallpaper roll calculation for room coverage.' },
  tile: { formula: 'Tiles = ceil(area / tile_area) ×- 1.1 waste', description: 'Tile quantity including 10% waste factor.' },
  flooring: { formula: 'Planks = ceil(area / plank_area) ×- 1.1', description: 'Flooring material quantity with 10% waste.' },
  rug: { formula: 'Rug = room_dimensions - 0.6m border', description: 'Ideal rug size with standard border clearance.' },
  curtain: { formula: 'Fabric = width ×- fullness | Panels = fabric / 1.37', description: 'Curtain fabric and panel calculation.' },
  furniture: { formula: 'Usable = room - walkway×-2 each dimension', description: 'Furniture layout usable floor area.' },
  stairs: { formula: 'Steps = total_rise / rise | Stringer = v(rise² + run²)', description: 'Stair dimensions and stringer length calculation.' },
  deck: { formula: 'Boards = area / (0.14×-length) ×- 1.1 | Posts = ceil(w/2.4+1)×-2', description: 'Deck building material estimation.' },
  garden: { formula: 'Volume = area ×- depth | Bags = ceil(litres / 50)', description: 'Garden soil, mulch, or compost volume.' },
  planting: { formula: 'Plants = ceil(area / spacing²)', description: 'Plant and seed spacing grid calculation.' },
  crop: { formula: 'Yield = area ×- yield_per_m²', description: 'Garden crop yield estimation per area.' },
  aquarium: { formula: 'Vol = L×-W×-H/1000 | Heater = vol×-0.05+25 | Light = vol×-0.3', description: 'Aquarium volume, heater, and lighting calculation.' },
  storage: { formula: 'Monthly = size ×- rate | Total = monthly ×- months', description: 'Storage unit cost estimation.' },
  delivery: { formula: 'Fee = base + distance×-per_km + tip', description: 'Delivery fee calculation with distance.' },
  catering: { formula: 'Staff = ceil(guests/20) | Total = food×-pp + labor', description: 'Catering cost for events and parties.' },
  meal: { formula: 'Cost_per = total_cost / meals | Time_per = total_time / meals', description: 'Meal prep cost and time efficiency.' },
  pet_cost: { formula: 'Monthly = food + vet/12 + supplies + other', description: 'Pet ownership monthly and yearly cost.' },
  childcare: { formula: 'Monthly = days ×- 4.33 ×- rate + reg/12', description: 'Childcare cost estimation based on days and rate.' },
  'gpa-calc': { formula: 'GPA = ?(grade_points) / n', description: 'Grade Point Average is the mean of numeric grade values across all courses.' },
  'grade-calc': { formula: 'GPA = ?(grade_points) / n with letter grade', description: 'GPA calculation with letter grade conversion.' },
  'random-number': { formula: 'Random(min, max)', description: 'Generates a pseudo-random integer within a specified range.' },
  'coin-flip': { formula: 'P(heads) = 0.5 per flip', description: 'Simulates coin flips with equal probability for heads or tails.' },
  'dice-roller': { formula: 'Random(1, sides) per die', description: 'Rolls virtual dice with configurable number of sides.' },
  'decision-maker': { formula: 'Random choice from options', description: 'Picks a random decision from a predefined set of answers.' },
  'name-generator': { formula: 'Random pick from name list', description: 'Selects a random name from a curated list of popular names.' },
  'password-gen': { formula: 'Entropy ~ log2(char_set_size^length)', description: 'Generates a random password with configurable character types.' },
  'password-check': { formula: 'Score = upper(25) + digit(25) + symbol(25) + len(25)', description: 'Password strength scoring based on character variety and length.' },
  'run-pace': { formula: 'Pace = time / distance | Speed = distance / time', description: 'Running pace and speed calculation for race planning.' },
  'swim-pace': { formula: 'Pace = time / distance', description: 'Swimming pace per 100 meters calculation.' },
  'bike-pace': { formula: 'Speed = distance / time', description: 'Cycling average speed and pace calculation.' },
  'tri-pace': { formula: 'Total = swim + bike + run | Overall pace = time / dist', description: 'Triathlon leg times and overall pace calculation.' },
  'step-counter': { formula: 'Distance = steps ×- stride | Cal = steps ×- 0.04', description: 'Step counter converting steps to distance and calories.' },
  'steps-miles': { formula: 'Miles = steps ×- stride / 1609', description: 'Steps to miles conversion using stride length.' },
  'steps-km': { formula: 'KM = steps ×- stride / 1000', description: 'Steps to kilometers conversion using stride length.' },
  'smoking-cost': { formula: 'Daily = cost ×- packs | Yearly = daily ×- 365', description: 'Smoking habit cost projection over time.' },
  'coffee-cost': { formula: 'Daily = cost ×- cups | Yearly = daily ×- 365', description: 'Coffee habit cost projection over time.' },
  'daily-affirm': { formula: 'Random pick from affirmations', description: 'Generates a random positive affirmation message.' },
  gratitude: { formula: 'Random gratitude prompt', description: 'Generates a random gratitude journaling prompt.' },
  'habit-track': { formula: 'Progress = done / goal ×- 100 | Remaining = goal - done', description: 'Habit tracking progress percentage and remaining days.' },
  'mood-track': { formula: 'Wellness = rating/10 ×- 100%', description: 'Mood tracking with 1-10 rating scale and wellness index.' },
  'pet-food': { formula: 'Daily_g = weight ×- multiplier ×- 1000', description: 'Pet food portion sizing based on weight and type.' },
  'cat-tree': { formula: 'Height = cats ×- 45cm | Platforms = cats ×- 2.5', description: 'Cat tree size recommendation based on number of cats.' },
  'dog-train': { formula: 'Sessions = 8 - floor(age) | Duration = 20 - age×-2', description: 'Dog training schedule by age for optimal learning.' },
  'dog-walk': { formula: 'Minutes = weight ×- 1.5 | Cal = weight ×- 0.8 ×- min/60', description: 'Dog walking duration and calorie burn estimation.' },
  'pet-chip': { formula: 'Chip size depends on pet type', description: 'Microchip size recommendation and implant readiness check.' },
  'pet-vax': { formula: 'Schedule based on age and type', description: 'Pet vaccination schedule based on age and core vaccines.' },
  'pet-age': { formula: 'Human = 16×-ln(dog+1)+31 | Human = 15×-ln(cat+1)+20', description: 'Pet age to human years using logarithmic formula.' },
  'dog-years': { formula: 'Human = 16×-ln(years+1)+31', description: 'Dog years to human years conversion.' },
  'cat-years': { formula: 'Human = 15×-ln(years+1)+20', description: 'Cat years to human years conversion.' },
  'human-dog-years': { formula: 'Dog = exp((human-31)/16)-1', description: 'Human age expressed in dog years.' },
  'party-planner': { formula: 'Drinks = guests ×- hrs ×- 1.5 | Food = guests ×- 6', description: 'Party supplies estimation for food, drinks, and ice.' },
  'event-budget': { formula: 'Budget allocation: venue(40%) food(35%) decor(15%) misc(10%)', description: 'Event budget allocation across spending categories.' },
  'moving-cost': { formula: 'Cost = rooms×-200 + km×-2.5 + items×-3', description: 'Moving cost including labor, transport, and supplies.' },
  'apt-search': { formula: 'Budget = income ×- 0.3 | Deposit = budget ×- 2', description: 'Apartment budget based on 30% income rule.' },
  'closing-cost': { formula: 'Closing = price ×- rate% + escrow', description: 'Home closing cost estimation with escrow.' },
  'home-buy': { formula: 'M = P×-r(1+r)^n / (1+r)^n-1', description: 'Mortgage monthly payment using amortization formula.' },
  'mortgage-ok': { formula: 'Max = income ×- 0.36 - debts', description: 'Mortgage affordability using 28/36 debt-to-income rule.' },
  'moving-list': { formula: 'Checklist prioritized by days remaining', description: 'Moving day checklist generator with timeline.' },
  'rent-ok': { formula: 'Ratio = rent / income ×- 100', description: 'Rent affordability using the 30% income rule.' },
  'elec-bill': { formula: 'kWh = watts× hours/1000 | Cost = kWh×-rate', description: 'Appliance electricity cost calculation.' },
  'appliance-cost': { formula: 'Cost = watts× hours/1000×-rate', description: 'Per-use appliance energy cost calculation.' },
  'appliance-energy': { formula: 'kWh = watts× hours/1000', description: 'Appliance daily and monthly energy consumption.' },
  'energy-bill': { formula: 'Total = base + kWh×-rate', description: 'Monthly energy bill from usage and rate.' },
  'bulb-save': { formula: 'Savings = (oldW-newW)×-hrs×-count×-365/1000×-rate', description: 'LED bulb replacement yearly savings.' },
  'thermostat-save': { formula: 'Savings = bill ×- 10% | Payback = cost / savings', description: 'Smart thermostat savings with payback period.' },
  'grocery-budget': { formula: 'Weekly = people ×- per_person | Monthly = weekly ×- 4.33', description: 'Grocery budget planning per household size.' },
  'best-buy': { formula: 'Unit_price = price / qty | Compare A vs B', description: 'Unit price comparison between two product options.' },
  'bundle-save': { formula: 'Savings = single×-3 - bundle | Save% = savings/single/3', description: 'Bundle vs individual purchase savings comparison.' },
  bogo: { formula: 'Effective = price / items | Save = price - effective', description: 'Buy-one-get-one deal effective price calculation.' },
  'cost-use': { formula: 'Cost_per_use = price / expected_uses', description: 'Cost per use analysis for purchase decisions.' },
  coupon: { formula: 'Saved = total ×- discount% | Final = total - saved', description: 'Coupon discount savings calculation.' },
  'price-comp': { formula: 'Difference = |priceA - priceB|', description: 'Price comparison between two stores or products.' },
  'price-oz': { formula: '$/oz = price / ounces', description: 'Price per ounce unit cost calculation.' },
  'price-lb': { formula: '$/lb = price / pounds', description: 'Price per pound unit cost calculation.' },
  'unit-price': { formula: 'Per_unit = total_price / units', description: 'Unit price calculation for bulk items.' },
  'commute-fuel': { formula: 'Daily = dist×-2/mpg×-gas | Monthly = daily×-days×-4.33', description: 'Daily commute fuel cost calculation.' },
  parking: { formula: 'Weekly = daily×-days | Monthly = weekly×-4.33', description: 'Parking cost estimation by daily rate and frequency.' },
  'rental-car': { formula: 'Total = (daily+ins)×-days + deposit', description: 'Rental car total cost including insurance and deposit.' },
  'taxi-fare': { formula: 'Fare = base + dist×-per_km + tip', description: 'Taxi fare estimation with per-kilometer pricing.' },
  toll: { formula: 'Weekly = daily×-days | Monthly = weekly×-4.33', description: 'Toll road cost estimation by daily frequency.' },
  'soil-calc': { formula: 'Volume = area ×- depth | Bags = ceil(L/50)', description: 'Garden soil volume and bag quantity estimation.' },
  mulch: { formula: 'Volume = area ×- depth | Bags = ceil(L/50)', description: 'Mulch coverage area and bag calculation.' },
  compost: { formula: 'Volume = area ×- depth | Bags = ceil(L/30)', description: 'Compost quantity needed for garden amendment.' },
  'cold-frame': { formula: 'Area = width ×- length | Plants = area ×- 12', description: 'Cold frame sizing and planting capacity.' },
  container: { formula: 'Soil = pots ×- liters_per_pot | Bags = ceil(soil/50)', description: 'Container garden soil volume calculation.' },
  greenhouse: { formula: 'Area = w×-l | Vent = area×-15% | Heat = area×-0.5', description: 'Greenhouse sizing, ventilation, and heating needs.' },
  herb: { formula: 'Plants = area ×- 16 | Varieties = min(plants, 8)', description: 'Herb garden planting density calculation.' },
  'indoor-herb': { formula: 'Light = pots ×- 8hrs | Water = pots ×- 0.1L', description: 'Indoor herb garden light and water requirements.' },
  microgreen: { formula: 'Yield = trays ×- 200g | Weekly = yield/10×-7', description: 'Microgreen tray yield and harvest estimation.' },
  'raised-bed': { formula: 'Volume = w×-l×-h | Bags = ceil(L/50)', description: 'Raised bed soil volume calculation.' },
  trellis: { formula: 'Posts = ceil(w/1.5)+1 | Wire = (w×-3+h×-2)×-1.2', description: 'Trellis material estimation for garden support.' },
  vertical: { formula: 'Pockets = area ×- 24 | Plants = pockets ×- 0.8', description: 'Vertical garden wall planter capacity.' },
  worm: { formula: 'Bin = waste×-7×-2 | Worms = bin×-500', description: 'Worm bin sizing for kitchen composting.' },
  'storage-cost': { formula: 'Monthly = size ×- rate | Total = monthly ×- months', description: 'Storage unit monthly and total cost.' },
  closet: { formula: 'Rods = ceil(w/1.2) | Shelves = floor(w/0.6)', description: 'Closet organizer rod and shelf spacing.' },
  konmari: { formula: 'Keep=40% Donate=35% Discard=25% | Time = items×-3min', description: 'Decluttering estimate using KonMari categories.' },
  garage: { formula: 'Area = cars×-14m² | Shelves = area/3 | Hooks = area/2', description: 'Garage organization system sizing.' },
  'home-inv': { formula: 'Items = rooms ×- 50 | Value = items ×- $25', description: 'Home inventory item and value estimation.' },
  'home-org': { formula: 'Bins = ceil(area/10) | Time = area ×- 0.5hr', description: 'Home organization supply and time estimate.' },
  shed: { formula: 'Area = w×-l | Shelves = ceil(area/2)', description: 'Shed storage capacity and shelving layout.' },
  workshop: { formula: 'Bench = min(2, w×-0.4) | Aisle = w - bench', description: 'Workshop layout with workbench and aisle space.' },
  'delivery-fee': { formula: 'Fee = base + distance×-per_km + tip', description: 'Delivery fee calculation with distance and tip.' },
  baggage: { formula: 'Fee = (bags-1)×-35 + overweight_penalty', description: 'Checked baggage fee estimation for air travel.' },
  'hotel-cost': { formula: 'Total = (rate + tax) ×- nights', description: 'Hotel stay total cost with tax estimation.' },
  luggage: { formula: 'Volume = h×-w×-d/1000 | Carry-on = dimensions×%×56×-45×-25', description: 'Luggage volume and carry-on eligibility check.' },
  'packing-list': { formula: 'Outfits = ceil(days×-1.3) | Shoes = ceil(days×-0.6)', description: 'Packing list item quantity by trip length.' },
  'pack-vol': { formula: 'Volume = outfits×-2 + shoes×-3 + misc | Bag type by volume', description: 'Packing volume estimation for luggage choice.' },
  'travel-budget': { formula: 'Total = flight + hotel + food', description: 'Travel budget estimation across categories.' },
  'travel-time': { formula: 'Total_time = dist/speed + layovers×-2', description: 'Travel time including flight and layovers.' },
  'trip-cost': { formula: 'Total = transport + lodging + food + activities', description: 'Trip cost breakdown across spending categories.' },
  weather: { formula: 'Difference = |tempA - tempB|', description: 'Temperature comparison between two locations.' },
  'streaming-cost': { formula: 'Monthly = services ×- avg_cost | Yearly = monthly ×- 12', description: 'Streaming subscription monthly and yearly cost.' },
  'subscription-calc': { formula: 'Monthly = subs ×- avg_price', description: 'Subscription service cost tracking.' },
  'sub-cost': { formula: 'Monthly = services ×- avg_cost', description: 'Subscription cost aggregation across services.' },
  'sub-save': { formula: 'Savings = current - bundle | Yearly = monthly ×- 12', description: 'Bundle subscription savings comparison.' },
  'net-speed': { formula: 'Speed = 10 + devices×-5 + streaming + gaming + work', description: 'Internet speed requirement based on household usage.' },
  'data-usage': { formula: 'Daily = devices×-(HD×-3GB + SD×-0.7GB)', description: 'Monthly data usage estimation from streaming habits.' },
  'internet-cost': { formula: 'Monthly = plan + equipment | Yearly = monthly ×- 12', description: 'Internet service total cost with equipment rental.' },
  'salary-hourly': { formula: 'Hourly = annual / 2080 | Weekly = annual / 52', description: 'Annual salary to hourly wage conversion.' },
  'hourly-salary': { formula: 'Annual = hourly ×- 2080 | Monthly = annual / 12', description: 'Hourly wage to annual salary conversion.' },
  'billable-hrs': { formula: 'Revenue = rate ×- hours | Net = revenue - expenses', description: 'Billable hours revenue and net income calculation.' },
  'meeting-cost2': { formula: 'Cost = attendees ×- duration_hrs ×- hourly_rate', description: 'Meeting cost calculation based on attendee salaries.' },
  pomodoro: { formula: 'Total = cycles×-work + (cycles-1)×-break + 15min', description: 'Pomodoro technique timing with work blocks and breaks.' },
  'priority-matrix2': { formula: 'Eisenhower Matrix: urgent+important categories', description: 'Task prioritization using the Eisenhower Matrix method.' },
  productivity: { formula: 'Efficiency = done/planned ×- 100 | Index = eff×-focus/100', description: 'Productivity scoring combining efficiency and focus.' },
  'project-deadline2': { formula: 'Days = tasks×-hrs_per_task / hrs_per_day', description: 'Project deadline estimation from task breakdown.' },
  'task-est': { formula: 'PERT = (opt+4×-likely+pess)/6 | SD = (pess-opt)/6', description: 'Task time estimation using PERT weighted average.' },
  'time-block': { formula: 'Block_len = total_hrs/blocks | Focus = total ×- focus%', description: 'Time blocking schedule with focus time calculation.' },
  'work-hours': { formula: 'Net = total_hrs - breaks', description: 'Work hours tracker subtracting break time.' },
  'file-size2': { formula: 'Time_s = file_bits / speed_mbps', description: 'File transfer time estimation from size and speed.' },
  'download-time': { formula: 'Time = file_size / download_speed', description: 'Download completion time estimation.' },
  'upload-time': { formula: 'Time = file_size / upload_speed', description: 'Upload completion time estimation.' },
  'calories-burned': { formula: 'Cal = MET ×- weight ×- 3.5 ×- min / 200', description: 'Calories burned using MET values for any activity.' },
  'walking-cal': { formula: 'Cal = 3.5 ×- W ×- 3.5 ×- min / 200 | Steps = min ×- 100', description: 'Walking calorie burn with step count.' },
  'running-cal': { formula: 'MET by speed: 6-11.5 | Cal = MET ×- W ×- 3.5 ×- min/200', description: 'Running calorie burn based on speed and weight.' },
  'cycling-cal': { formula: 'MET by speed: 4-10 | Cal = MET ×- W ×- 3.5 ×- min/200', description: 'Cycling calorie burn based on speed and weight.' },
  'swimming-cal': { formula: 'MET by intensity: 3.5-9.8 | Cal = MET ×- W ×- 3.5 ×- min/200', description: 'Swimming calorie burn by intensity level.' },
  'yoga-cal': { formula: 'MET by style: 2.5-4 | Cal = MET ×- W ×- 3.5 ×- min/200', description: 'Yoga calorie burn by style (hatha/vinyasa/power).' },
  'desk-ergo': { formula: 'Desk = h×-0.45 | Seat = h×-0.27 | Monitor = h+8%h', description: 'Ergonomic desk setup measurements from body height.' },
  'stand-desk': { formula: 'Stand = h×-0.44 | Sit = h×-0.27 | Transition = h×-0.36', description: 'Standing desk height settings for sit-stand transition.' },
  'monitor-ht': { formula: 'Eye = h×-0.93 | Top = eye+5cm', description: 'Monitor height positioning for ergonomic viewing.' },
  'tv-size': { formula: 'Ideal = dist_cm/2.5/2.54 | Range = dist/3 to dist/1.5', description: 'Optimal TV size for viewing distance.' },
  'projector-screen': { formula: 'Diag = dist×-39.37×-0.5 | W = diag×-0.87 | H = diag×-0.49', description: 'Projector screen size from throw distance.' },
  'floor-mat': { formula: 'Planks = area/plank_area×-1.1 waste', description: 'Flooring material quantity with 10% waste factor.' },
  'carpet-room': { formula: 'Carpet = lengths ×- room_len | Waste = carpet - area', description: 'Carpet needed for room with roll width constraint.' },
  'deck-mat': { formula: 'Boards = area/(0.14×-L)×-1.1 | Posts = ceil(w/2.4+1)×-2', description: 'Deck board, post, and screw material estimation.' },
  'fence-mat': { formula: 'Panels = ceil(L/1.8) | Posts = panels+1', description: 'Fence panel and post count for perimeter.' },
  'seed-space': { formula: 'Plants = ceil(area/spacing²) | Seeds = plants×-2', description: 'Seed spacing calculation for garden beds.' },
  'plant-space': { formula: 'Plants = area / (spacing ×- row_spacing)', description: 'Plant spacing grid with row and plant spacing.' },
  companion: { formula: 'Companion planting lookup by crop type', description: 'Companion planting recommendations for common crops.' },
  'seed-start': { formula: 'Cells = trays×-72 | Germ = cells×-85% | Tplant = germ×-90%', description: 'Seed starting tray germination and transplant rates.' },
  transplant: { formula: 'Area = plants ×- spacing²', description: 'Transplant spacing area requirement.' },
  'crop-yield': { formula: 'Yield = area ×- yield_per_m²', description: 'Garden crop yield estimation by area.' },
  'crop-rotate': { formula: 'Rotation = beds-year cycle | Families per bed', description: 'Crop rotation planning across garden beds.' },
  'aquarium-vol': { formula: 'Vol_L = L×-W×-H/1000 | Vol_gal = vol/3.785', description: 'Aquarium water volume in liters and gallons.' },
  'aquarium-heater': { formula: 'Heater = vol×-0.05+25W | Boost if diff>5°C', description: 'Aquarium heater wattage by tank volume and temperature.' },
  'aquarium-light': { formula: 'Lumens = vol×-30 | Planted = ×-1.5 | Photo = 8-10hrs', description: 'Aquarium lighting needs by tank and plants.' },
  'aquarium-size2': { formula: 'Min_vol = fish ×- size_cm ×- 2', description: 'Aquarium size recommendation based on fish count.' },
  'cleaning-time': { formula: 'Time = rooms×-min_room + baths×-30', description: 'Home cleaning time estimate by room count.' },
  'clean-supplies': { formula: 'Cleaner = ceil(area/200) | Wipes = ceil(area/50)', description: 'Cleaning supply quantity by home area.' },
  'laundry-cost': { formula: 'Cost = loads ×- rate | Yearly = weekly ×- 52', description: 'Laundry cost per load and yearly projection.' },
  'laundry-auto': { formula: 'Loads = people ×- 2.5 | Weekly = loads ×- rate', description: 'Laundry load estimation per household size.' },
  'cater-cost': { formula: 'Staff = ceil(guests/20) | Total = food + labor', description: 'Catering cost with staffing for events.' },
  'meal-prep': { formula: 'Cost/meal = total_cost / meals | Time/meal = total_time / meals', description: 'Meal prep cost and time efficiency analysis.' },
  'leftover-calc': { formula: 'Leftover = portions - eaten - waste | Days = leftover×-0.5', description: 'Leftover tracking and safe consumption window.' },
  'pizza-calc': { formula: 'Slices/person = pizza×-slices / people | Enough if ×%×3', description: 'Pizza quantity for groups based on slices per person.' },
  'coffee-calc2': { formula: 'Grounds = cups×-10g | Water = cups×-200ml', description: 'Coffee brewing quantities for batch preparation.' },
  'takeout-calc': { formula: 'Weekly = meals×-avg_cost | Monthly = weekly×-4.33', description: 'Takeout food spending tracking and projection.' },
  'util-est': { formula: 'Total = electric + water + gas + internet + other', description: 'Monthly utility cost estimation across all services.' },
  'auto-util': { formula: 'Electric = sqft×-0.08 | Water = people×-20 | Gas = sqft×-0.04', description: 'Auto-estimated utility costs from home size.' },
  'util-cost': { formula: 'Total = electric + water + gas + trash', description: 'Utility cost breakdown by service type.' },
  'cell-cost': { formula: 'Monthly = plan×-lines + device/24 | Yearly = monthly×-12', description: 'Cell phone plan cost with device amortization.' },
  'phone-bill': { formula: 'Total = plan + taxes+ fees', description: 'Phone bill total including taxes and regulatory fees.' },
  'pet-cost2': { formula: 'Monthly = food + vet/12 + supplies + other', description: 'Pet ownership monthly and yearly cost breakdown.' },
  'pet-board': { formula: 'Total = days×-daily + deposit', description: 'Pet boarding cost for vacation stays.' },
  'pet-groom': { formula: 'Yearly = visits×-cost + 15% tip', description: 'Pet grooming annual cost with gratuity.' },
  'pet-sit': { formula: 'Total = days×-daily×-visits', description: 'Pet sitting cost by days and daily visits.' },
  'hex-color': { formula: 'Hex ? RGB conversion', description: 'Hex color code to RGB color value conversion.' },
  'color-pick': { formula: 'RGB ? Hex conversion', description: 'RGB color values to hex color code conversion.' },
  'lotto-calc': { formula: 'EV = jackpot/odds - ticket | ROI = (EV/ticket-1)×-100', description: 'Lottery expected value and return on investment.' },
  'bingo-odds': { formula: 'Win% = 100 / (players ×- cards)', description: 'Bingo win probability from players and cards.' },
  'lotto-odds': { formula: 'Combos = C(n,k) ×- extra | Odds = 1/combos', description: 'Lottery odds calculation using combination formula.' },
  'poker-odds': { formula: 'Turn% = outs/cards | River% = outs/(cards-1)', description: 'Poker hand odds for turn and river cards.' },
  'carbon-foot': { formula: 'CO2 = elec×-0.4 + gas×-2.2 + car×-0.12 + flights×-200', description: 'Carbon footprint estimate across home, travel, and transport.' },
  'flight-carbon2': { formula: 'CO2 = dist×-0.115×-passengers', description: 'Flight carbon emissions by distance and passengers.' },
  'flight-offset': { formula: 'Offset_cost = CO2 ×- cost_per_kg', description: 'Flight carbon offset purchase cost calculation.' },
  'furniture-arr': { formula: 'Usable = room - walkway×-2 each side', description: 'Furniture layout with walkway clearance.' },
  'furniture-lay': { formula: 'Remaining = room_width - sofa - table | Fit if ×%×1m', description: 'Furniture fit check in room by dimensions.' },
  'room-size': { formula: 'Area = w×-l | Usage determined by area', description: 'Room size area calculation with usage recommendation.' },
  'curtain-len': { formula: 'Fabric = width×-fullness | Panels = fabric/1.37', description: 'Curtain fabric width and panel count.' },
  'curtain-size2': { formula: 'Rec = window_width×-1.5 ×- height+10cm', description: 'Recommended curtain size slightly larger than window.' },
  '50-30-20-budget-2': { formula: 'Needs=income×-50% | Wants=income×-30% | Savings=income×-20%', description: 'The 50/30/20 budgeting rule allocates after-tax income to needs, wants, and savings.' },
  'budget-planner-calc': { formula: 'Remaining = income - expenses - savings_goal', description: 'Monthly budget planner tracking income against categorized expenses and savings goals.' },
  'budget-envelope': { formula: 'Allocated = groceries + dining + entertainment + transport + other | Unallocated = total - allocated', description: 'Cash envelope budgeting system allocating funds across spending categories.' },
  'emergency-fund-calc': { formula: 'Target = monthly_expenses ×- desired_months | Progress = current / target ×- 100', description: 'Emergency fund target based on monthly expenses and desired coverage period.' },
  'net-worth-calc': { formula: 'Net_worth = total_assets - total_liabilities', description: 'Net worth calculation summing all assets minus all liabilities for financial health.' },
  'net-worth-calc-2': { formula: 'Net_worth = assets - liabilities', description: 'Quick net worth snapshot comparing total assets against total liabilities.' },
  'passive-income': { formula: 'Annual_yield = investment ×- yield_rate% | Monthly = annual_yield/12 + monthly_add', description: 'Passive income estimation from investment portfolio yield and ongoing contributions.' },
  'debt-snowball': { formula: 'Payoff_order = sort_by_smallest_balance | Total_payment = min_payments + extra', description: 'Debt snowball method pays smallest balances first for psychological momentum.' },
  'debt-avalanche': { formula: 'Payoff_order = sort_by_highest_rate | Total_payment = min_payments + extra', description: 'Debt avalanche method pays highest interest rate debts first to minimize total interest.' },
  'zero-based-budget-2': { formula: 'Leftover = income - (housing + food + transport + utilities + savings + other) = 0', description: 'Zero-based budgeting assigns every dollar of income to expenses, savings, or investments.' },
  'paypal-fees': { formula: 'Fee = amount × pct + fixed | Net = amount - fee', description: 'PayPal transaction fee calculation for domestic (2.99%+$0.49) and international (4.49%+$0.49) payments.' },
  'stripe-fees': { formula: 'Fee = amount × pct + fixed | Net = amount - fee', description: 'Stripe payment processing fees by card type: credit (2.9%+$0.30), debit (flat $0.05), Amex (3.5%+$0.30).' },
  'ebay-fees': { formula: 'Fee = price × rate | Net = price - fee', description: 'eBay final value fee varies by category (~13.25%) with store subscription discounts (basic -0.9%, premium -2.65%).' },
  'etsy-fees': { formula: 'Total = listing + transaction(6.5%) + payment(3%+$0.25)', description: 'Etsy seller fees include $0.20 listing fee, 6.5% transaction fee, and 3%+$0.25 payment processing fee.' },
  'amazon-fba': { formula: 'Profit = price - referral(15%) - fulfillment fee', description: 'Amazon FBA fee breakdown: referral fee by category (15-17%) and fulfillment fee by size tier ($3-$15).' },
  'crowdfunding-fee': { formula: 'Net = goal - platform(5%) - payment(3%+fixed)', description: 'Crowdfunding platform fees: Kickstarter (5%+3%+$0.20) and Indiegogo (5%+3%+$0.30).' },
  'pawn-loan': { formula: 'Loan = value × pct | Interest = loan × monthly_rate × months', description: 'Pawn loan calculation: loan amount based on item value percentage with monthly interest accrual.' },
  'craps-odds': { formula: 'Payout varies by bet type | House edge: 1.36-2.78%', description: 'Craps odds calculation showing true odds vs payout odds and house edge for each bet type.' },
  'roulette-odds': { formula: 'EV = bet × (win_prob × payout - 1) | House edge: 2.7% EU, 5.26% US', description: 'Roulette probability and expected value calculation for European (37 slots) and American (38 slots) wheels.' },
  'parlay-odds': { formula: 'Parlay_odds = leg_odds^legs | Payout = stake × parlay_odds', description: 'Parlay bet calculation multiplying individual leg decimal odds for total payout and implied probability.' },
  'prop-bet': { formula: 'Break-even = yes_prob / (yes_prob + no_prob)', description: 'Proposition bet analysis comparing yes/no American odds to find break-even probability and payout.' },
  'sports-betting-odds': { formula: 'Profit = stake × (odds/100) | Return = stake + profit', description: 'Sports betting payout calculation for American odds: positive (underdog) and negative (favorite) formats.' },
  'blackjack-basic': { formula: 'Basic strategy chart lookup by hand total vs dealer up-card', description: 'Blackjack basic strategy suggests Hit, Stand, Double, or Split based on your hand value and the dealer up-card.' },
  'generator-sizing': { formula: 'Watts = sum(appliance_watts) × 1.2 safety margin | kW = W/1000', description: 'Generator sizing sums essential appliance wattages with 20% safety buffer for startup surge.' },
  'furnace-cost': { formula: 'Cost = (base + upgrade) × region_multiplier | Base = 3000 + sqft×0.5', description: 'Furnace replacement cost estimation based on home size, efficiency tier, and regional pricing.' },
  'pool-chemical-calc': { formula: 'Dose_oz = (target - current) × volume / factor', description: 'Pool chemical dosage calculation based on volume, current vs target levels, and chemical-specific factors.' },
  'pool-heating-cost': { formula: 'BTU = volume × 8.34 × temp_rise | Cost = BTU/100000 × cost × 30 / efficiency', description: 'Pool heating cost comparing gas, heat pump, and solar heater efficiency and fuel costs.' },
  'solar-panel-calc': { formula: 'kW = bill / (sun×30×eff×0.12) | Panels = kW×1000/400 | Payback = cost/(bill×12)', description: 'Solar panel system sizing from monthly electric bill, sun hours, and system efficiency.' },
  'space-heater-cost': { formula: 'Daily = W×hrs/1000 × rate | Monthly = daily×30', description: 'Space heater operating cost based on wattage, daily usage, and electric rate.' },
  'leak-detection': { formula: 'Gal/day = drips/min × 60 × hrs × 0.00025 | Cost = gal × 0.004', description: 'Water leak waste calculation converting drips per minute to gallons and annual cost.' },
  'phantom-load': { formula: 'kWh/day = devices × avg_W × 24/1000 | Cost = kWh × rate', description: 'Standby power consumption from electronics in sleep/off mode drawing continuous phantom load.' },
  'pest-control-cost': { formula: 'Cost = base × severity × frequency × size_factor', description: 'Pest control cost estimation by pest type, treatment frequency, severity, and home size.' },
  'shower-time-cost': { formula: 'Gal = mins × GPM | Cost = water_charge + energy(gal×kWh_factor×rate)', description: 'Shower cost combining water usage and water heating energy by heater type.' },
  'toilet-flush-cost': { formula: 'Cost = flushes × GPF × rate | Savings = old_gpf - new_gpf', description: 'Toilet water cost comparing standard 1.6 GPF vs WaterSense 1.28 GPF vs high-efficiency 1.0 GPF.' },
  'cashback-calc': { formula: 'Cashback = spend × rate% | Rotating: 5% on first $1500/quarter', description: 'Credit card cashback earnings comparing flat-rate, rotating category, travel, and dining rewards.' },
  'rebate-calc': { formula: 'Net = price + tax - rebate | Savings% = (gross - net)/gross×100', description: 'Rebate savings calculation comparing mail-in vs instant rebate with tax on full purchase price.' },
  'loyalty-rewards': { formula: 'Points = spend × rate | Value = points × redemption/100 | Return% = value/spend×100', description: 'Loyalty program points valuation converting points earned to dollar value and effective return rate.' },
  'consignment-pricing': { formula: 'Fee = price × commission% | Payout = price - fee', description: 'Consignment payout calculation after platform commission (online or brick & mortar surcharge).' },
  'craigslist-pricing': { formula: 'Fair_price = original × condition × demand × (1 - age×0.02)', description: 'Used item fair market price based on age, condition tier, demand level, and original price.' },
  'auction-hammer': { formula: 'Buyer = hammer + premium + VAT | Seller = hammer - commission', description: 'Auction transaction costs: buyer total with premium and VAT, seller net after commission deduction.' },
  'diaper-cost': { formula: 'Daily = diapers × unit cost | Monthly = daily × 30 | Total = monthly × 30', description: 'Diaper cost projection over daily, monthly, yearly, and full-potty-training timeline.' },
  'formula-cost': { formula: 'Daily cost = oz/feed × feeds × cost/oz | Monthly = daily × 30', description: 'Baby formula cost estimation based on feeding frequency, volume, and brand cost per ounce.' },
  'baby-gear': { formula: 'Total = stroller + car seat + crib + clothes + bottles + high chair + other', description: 'One-time baby gear setup cost breakdyn by essential item categories.' },
  'college-fund': { formula: 'FV = current × (1+r)^y + monthly × ((1+r/12)^(y×12)-1)/(r/12)', description: 'College savings projection using future value of lump sum and recurring monthly contributions.' },
  'college-savings-calc': { formula: 'FV = contribution × ((1+r)^n-1)/r | Covers = FV >= projected tuition', description: 'College savings plan growth projection with tuition inflation to determine contribution adequacy.' },
  'pet-insurance': { formula: 'Premium = base × age × coverage × deductible | Savings = vet cost - premium', description: 'Pet insurance premium estimate based on species, age, coverage tier, deductible, and reimbursement level.' },
  'towing-capacity': { formula: 'Max tow = GVWR - curb weight - payload | Safe = trailer <= max', description: 'Vehicle towing capacity calculation using GVWR, curb weight, payload, and tongue weight constraints.' },
  'tire-pressure-calc': { formula: 'Adj pressure = recommended + load adj + temperature adj', description: 'Recommended tire pressure adjusted for load conditions and ambient temperature.' },
  'qr-code-generator': { formula: 'Max chars = capacity × error correction factor', description: 'QR code data capacity estimate based on content type, version (size), and error correction level.' },
  'font-size-calc': { formula: 'Size = base × ratio^level | Modular scale typography', description: 'Modular scale typography: font size at any heading/body level using a geometric progression from a base size.' },
  'secret-santa': { formula: 'Total = participants × budget | Each participant buys 1 gift', description: 'Secret Santa budget estimator: total expenditure and number of gift exchanges in the pool.' },
  'yard-sale': { formula: 'Revenue = total value × pricing strategy % | Cheap=10% Fair=20% Premium=35%', description: 'Yard sale revenue estimate based on total item value and pricing strategy tier.' },
  'raffle-tickets': { formula: 'Probability = your tickets / total × 100 | EV = prize × prob - ticket price', description: 'Raffle win probability and expected value calculation based on tickets sold and your entries.' },
  'sweepstakes-entry': { formula: 'P(win any) = 1 - ((total-entries)/total)^prizes | Simple prob = entries / total', description: 'Sweepstakes winning probability with multiple prizes using combinatorial probability.' },
  'side-hustle': { formula: 'Net = gross - expenses - taxes | Effective rate = net / hours worked', description: 'Side hustle net income after deducting business expenses and estimated tax withholding.' },
  'spending-habit': { formula: 'Daily = coffee + lunch + snacks + drinks + transport | Annual = daily × 365', description: 'Daily discretionary spending tracker projecting monthly, yearly, and 10-year costs with investment opportunity cost.' },
  'funeral-cost': { formula: 'Total = base + casket/urn + service + plot + stone + other | Burial base=$5000 Cremation=$2500', description: 'Funeral cost estimate combining disposition choice, casket, service, burial plot, headstone, and other expenses.' },
  'charity-donation': { formula: 'Tax savings = donation × bracket% (if itemized) | Net cost = donation - tax savings', description: 'Charitable donation tax benefit calculation showing effective cost after itemized deduction savings.' },
  'dry-cleaning-cost': { formula: 'Weekly = shirts×3.50 + suits×15 + dresses×14 + coats×22.50 + pants×7.50', description: 'Dry cleaning cost projection based on weekly frequency of various garment types.' },
  'travel-insurance': { formula: 'Premium = trip cost × coverage rate × age multiplier', description: 'Travel insurance premium estimate based on trip cost, age group, and coverage tier selection.' },
  'renters-insurance': { formula: 'Premium = base + property + deductible adj + liability adj', description: 'Renters insurance monthly premium estimate based on property value, deductible, and liability coverage.' },
  'security-deposit': { formula: 'Return = deposit + interest - deductions | Deposit = rent × months', description: 'Security deposit return estimate projecting interest (if applicable) and typical cleaning/repair deductions.' },
  'wedding-guest': { formula: 'Total = outfit + transport + hotel + gift + pre-wedding events', description: 'Wedding guest cost calculator: total attendance cost including attire, travel, accommodation, and gifts.' },
  'holiday-budget-2': { formula: 'Planned = gifts + travel + food + decor + entertainment | Leftover = budget - planned', description: 'Holiday spending planner comparing planned category spending against total budget with recommended allocations.' },
  'fundraiser-goal': { formula: 'Net = target - (platform + payment fees) | Donors needed = target / avg donation', description: 'Fundraiser goal calculator showing net amount after fees and donor count needed to reach target.' },
  'biweekly-monthly': { formula: 'Monthly = biweekly × 26 / 12 | Annual = biweekly × 26', description: 'Biweekly to monthly income conversion using average month calculation (52 weeks × 2 pay periods / 12 months).' },
  'bonus-calc': { formula: 'Net = bonus - (federal + state + FICA withholding)', description: 'Bonus tax calculator showing net take-home after federal supplemental rate, state tax, and FICA deductions.' },
  default: { formula: 'Everyday calculation', description: 'Practical everyday calculation for common household or personal tasks.' },
}

