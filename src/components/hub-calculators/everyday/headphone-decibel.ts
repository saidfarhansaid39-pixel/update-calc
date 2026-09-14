import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ sensitivity: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), powerMw: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'sensitivity', label: 'Headphone Sensitivity (dB/mW)', type: 'number', min: 80, step: '1' },
    { name: 'powerMw', label: 'Output Power (mW)', type: 'number', min: 0.1, step: '10' },
  ],
  defaults: { sensitivity: "102", powerMw: "100" },
  presets: [
    { label: "Phone + Earbuds", values: { sensitivity: "108", powerMw: "15" } },
    { label: "USB DAC + IEMs", values: { sensitivity: "115", powerMw: "30" } },
    { label: "Desktop Amp + Planars", values: { sensitivity: "92", powerMw: "500" } },
    { label: "Studio Monitoring", values: { sensitivity: "96", powerMw: "250" } },
  ],
  compute: (v) => { const sen = parseFloat(v.sensitivity)||0; const pwr = parseFloat(v.powerMw)||0; const db = sen + 10 * Math.log10(pwr); const safeMinutes = db <= 80 ? 480 : db <= 85 ? 120 : db <= 90 ? 60 : db <= 95 ? 15 : db <= 100 ? 5 : 1; const pctOfPain = Math.min(100, (db / 130) * 100); return { result: db, label: 'Maximum SPL', unit: 'dB', steps: [{ label: 'Sensitivity Rating', value: `${sen} dB/mW` }, { label: 'Input Power', value: `${pwr} mW` }, { label: 'Volume Gain from Power', value: `+${(10 * Math.log10(pwr)).toFixed(1)} dB` }, { label: 'Maximum SPL', value: `${db.toFixed(1)} dB` }, { label: 'Safe Listening Time', value: `${safeMinutes} min` }, { label: 'Pain Threshold Scale', value: `${pctOfPain.toFixed(0)}% of 130 dB pain threshold` }] ,
    extras: [
      { label: "Safe Listening Limits", value: "Below 85 dB: unlimited | 85-90 dB: ≤60 min | 90-100 dB: ≤15 min | 100+ dB: ≤5 min" },
      { label: "Headphone Types & Needs", value: "High-sensitivity (105+ dB/mW): great for phones | Low-sensitivity planars (<95 dB/mW): need dedicated amps" },
      { label: "Hearing Damage Warning", value: "Prolonged exposure above 100 dB causes permanent damage. NIHL is cumulative and irreversible." },
      { label: "Impedance & Power", value: "Low impedance (16-32Ω) headphones need less voltage; high impedance (250-600Ω) need more voltage for same SPL" },
      { label: "Amplifier Matching", value: "Rule of thumb: amp should deliver at least 2× the power needed to reach your listening level" },
      { label: "Volume Creep", value: "Our ears adjust to loudness — what sounds normal after 30 min may be 90+ dB" },
      { label: "Balanced vs Single-Ended", value: "Balanced connections can deliver 2-4× more power, useful for power-hungry planars" },
      { label: "Hearing Protection", value: "Use volume limiters (85 dB max for kids). Take 5-min breaks every hour." },
    ]} },
  description: 'Calculate the maximum sound pressure level (SPL) your headphones can produce given their sensitivity and amplifier power. Essential for matching headphones to audio sources and protecting your hearing.',
  formula: 'SPL (dB) = Sensitivity (dB/mW) + 10 × log₁₀(Power in mW) | Safe Time = function of SPL per OSHA guidelines',
  interpretation: 'For safe listening, keep volume below 85 dB for extended periods. Every 3 dB increase doubles the sound energy. High-sensitivity headphones (105+ dB/mW) work well with phones and dongles, while low-sensitivity planars and high-impedance dynamics need dedicated headphone amplifiers. Hearing damage is cumulative and permanent — use the 60/60 rule: 60% volume for 60 minutes max.'
}

export default calcDef
