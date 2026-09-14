import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ batteryCapacity: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), deviceWattage: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), efficiency: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'batteryCapacity', label: 'Battery Capacity (mAh)', type: 'number', min: 100, step: '100' },
    { name: 'deviceWattage', label: 'Device Power Draw (W)', type: 'number', min: 0.1, step: '0.5' },
    { name: 'efficiency', label: 'Efficiency Loss (%)', type: 'number', min: 0, max: 50, step: '5' },
  ],
  defaults: { batteryCapacity: '5000', deviceWattage: '5', efficiency: '15' },
  presets: [
    { label: 'Smartphone', values: { batteryCapacity: '5000', deviceWattage: '5', efficiency: '15' } },
    { label: 'Laptop', values: { batteryCapacity: '56000', deviceWattage: '30', efficiency: '10' } },
    { label: 'Power Bank', values: { batteryCapacity: '20000', deviceWattage: '10', efficiency: '20' } },
    { label: 'Tablet', values: { batteryCapacity: '10000', deviceWattage: '8', efficiency: '12' } },
  ],
  compute: (v) => {
    const batteryWh = (v.batteryCapacity / 1000) * 3.7
    const usableWh = batteryWh * (1 - v.efficiency / 100)
    const hours = usableWh / v.deviceWattage
    return { result: hours, label: 'Battery Life', unit: 'hours', steps: [
      { label: 'Convert mAh to Wh', value: `${v.batteryCapacity} mAh ÷ 1000 x 3.7V = ${batteryWh.toFixed(1)} Wh` },
      { label: 'Apply Efficiency Loss', value: `${batteryWh.toFixed(1)} Wh x (1 - ${v.efficiency}%) = ${usableWh.toFixed(1)} Wh usable` },
      { label: 'Estimate Runtime', value: `${usableWh.toFixed(1)} Wh ÷ ${v.deviceWattage} W = ${hours.toFixed(1)} hours` },
    ] ,
    extras: [
      { label: "Lithium-ion fundamentals", value: "Li-ion cells have a 3.7V nominal voltage (3.6–4.2V range). Converting mAh to Wh: (mAh ÷ 1000) x 3.7 = Wh. A 5,000 mAh battery holds 18.5 Wh of energy. Higher voltage devices (power tools, e-bikes) use series cells and multiply voltage accordingly." },
      { label: "Efficiency loss sources", value: "DC-DC conversion (5–15% loss), voltage regulation (2–5%), circuit overhead (3–8%), heat dissipation (2–5%). Total: 10–25% typical loss. High-drain devices (gaming laptops, drones) experience more loss than low-drain ones (e-readers, smartwatches)." },
      { label: "Real-world vs theoretical", value: "Spec sheet battery life is measured in ideal lab conditions (25 C, low drain, 50% brightness). Real-world runtime is 60–85% of theoretical. Screen brightness alone can double power draw. Cellular/WiFi radios add 0.5–2W when actively transmitting." },
      { label: "Device power profiles", value: "Smartphone: 3–8W (idle 0.5W, video 3W, gaming 7W). Laptop: 15–60W (web browsing 15W, video editing 45W, gaming 60W). Tablet: 3–10W. E-reader: 0.5–1W (only during page turns). Wireless earbuds: 0.05–0.1W." },
      { label: "Battery aging effect", value: "Li-ion batteries lose 10–15% capacity per year (or ~300–500 full cycles). A 2-year-old phone battery at 80% capacity gives 20% less runtime. After 500 cycles (1.5–2 years of daily charging), expect ~70–75% of original capacity." },
      { label: "Temperature impact", value: "Cold (below 0 C / 32 F): battery capacity drops 20–50% temporarily, voltage sags under load. Heat (above 40 C / 104 F): accelerates permanent degradation by 2–3x. Ideal operating range: 10–30 C (50–86 F). Charge at room temperature for best longevity." },
      { label: "USB power bank math", value: "A 20,000 mAh power bank at 3.7V holds 74 Wh. After DC-DC boost to 5V (10–15% loss): ~63–67 Wh usable. Charging a 5,000 mAh phone (18.5 Wh): 3–3.5 full charges. A 30W laptop (56 Wh battery): about 1 full charge." },
      { label: "Charging speed vs battery life", value: "Fast charging (18W–65W) generates more heat than slow charging (5W–10W), accelerating degradation by 10–20% over 2 years. Overnight slow charging (5W) extends cycle life. Wireless charging adds 5–10% more heat than wired at the same wattage." },
    ]}
  },
  description: 'Estimate battery runtime for any device using mAh capacity, wattage draw, and efficiency losses. Understand real-world vs theoretical battery life with conversions and aging factors.',
  formula: 'Battery Life (hours) = ((mAh / 1000) x 3.7 x (1 - Efficiency/100)) / Power Draw (W)',
  interpretation: 'A 5,000 mAh smartphone (5W, 15% loss): ~3.1 hours intensive use. A 56 Wh laptop battery (30W, 10% loss): ~1.7 hours under load. A 20,000 mAh power bank (10W output, 20% loss): ~5.9 hours of device charging. Real-world runtime is typically 10–30% less than calculated due to variable power draw.'
}

export default calcDef
