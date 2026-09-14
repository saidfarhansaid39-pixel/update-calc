import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ temperature: z.string().min(1).refine(v => parseFloat(v) > -50, '>-50'), dewPoint: z.string().min(1).refine(v => parseFloat(v) > -50, '>-50') }),
  fields: [
    { name: 'temperature', label: 'Air Temperature (°F)', type: 'number', min: -20, max: 130, step: '1' },
    { name: 'dewPoint', label: 'Dew Point (°F)', type: 'number', min: -20, max: 130, step: '1' },
  ],
  defaults: { temperature: "80", dewPoint: "62" },
  presets: [
    { label: "Perfect Summer Day", values: { temperature: "75", dewPoint: "55" } },
    { label: "Humid & Stuffy", values: { temperature: "90", dewPoint: "72" } },
    { label: "Dry Winter Air", values: { temperature: "35", dewPoint: "15" } },
    { label: "Tropical Monsoon", values: { temperature: "85", dewPoint: "78" } },
  ],
  compute: (v) => { const t = parseFloat(v.temperature)||0; const dp = parseFloat(v.dewPoint)||0; const es = 6.112 * Math.exp((17.67 * t) / (t + 243.5)); const e = 6.112 * Math.exp((17.67 * dp) / (dp + 243.5)); const rh = (e / es) * 100; const comfortLevel = dp < 50 ? 'Comfortable' : dp < 55 ? 'Slightly dry' : dp < 60 ? 'Comfortable' : dp < 65 ? 'Noticeably humid' : dp < 70 ? 'Humid, uncomfortable' : dp < 75 ? 'Very humid, oppressive' : 'Extremely humid, dangerous'; const moldRisk = rh > 60 ? 'Elevated (60%+). Use dehumidifier.' : rh > 50 ? 'Moderate (50-60%). Ventilate.' : 'Low (<50%). Safe.'; const heatIndex = t >= 80 ? t - 0.55 * (1 - rh / 100) * (t - 58) + (rh / 100 < 0.5 ? 0 : (rh / 100 - 0.5) * (1.2 * t + 2)) : t; return { result: rh, label: 'Relative Humidity', unit: '%', steps: [{ label: 'Air Temperature', value: `${t}°F` }, { label: 'Dew Point', value: `${dp}°F` }, { label: 'Saturation Vapor Pressure', value: `${es.toFixed(2)} hPa` }, { label: 'Actual Vapor Pressure', value: `${e.toFixed(2)} hPa` }, { label: 'Relative Humidity', value: `${rh.toFixed(1)}%` }, { label: 'Comfort Description', value: comfortLevel }, { label: 'Mold Risk Assessment', value: moldRisk }, { label: 'Heat Index (approx)', value: t >= 80 ? `${heatIndex.toFixed(0)}°F feels like` : 'N/A (below 80°F)' }] ,
    extras: [
      { label: "Dew Point Comfort Scale", value: "<50°F: comfortable/dry | 50-55°F: slightly dry | 55-60°F: pleasant | 60-65°F: noticeable humidity | 65-70°F: humid/uncomfortable | 70-75°F: oppressive | >75°F: extremely humid, dangerous" },
      { label: "Relative Humidity Guide", value: "Below 30%: dry air (static shock, cracked skin, respiratory irritation) | 30-50%: ideal comfort range | 50-60%: acceptable but monitor for mold | Above 60%: mold risk, dust mites thrive | Above 70%: condensation on windows, structural concerns" },
      { label: "Health Impacts", value: "Low RH (<30%): dry eyes, throat, skin; increased virus transmission | High RH (>60%): mold allergy, asthma triggers, dust mites | Optimal for health: 40-60% RH" },
      { label: "Mold Prevention", value: "Use bathroom exhaust fans during showers (remove 90%+ of moisture). Keep indoor RH below 60%. Dehumidifiers for basements. Fix leaks immediately — mold colonizes within 24-48 hours of moisture." },
      { label: "Humidity & HVAC", value: "AC naturally dehumidifies — a properly sized system removes 2-4 gallons of moisture per day in humid climates. Oversized ACs cool too quickly without adequate dehumidification." },
      { label: "Seasonal RH Patterns", value: "Winter: indoor RH can drop to 10-20% with heating. Use humidifiers for comfort and to protect wood furniture. Summer: can exceed 65+% indoor without AC or dehumidifier." },
      { label: "Measuring Instruments", value: "Hygrometer: $10-30 digital models are accurate ±3-5% RH. Smart thermostats (Ecobee, Nest) include humidity sensors. Wet-bulb psychrometer: most accurate but manual." },
      { label: "Climate Change Impact", value: "Warmer air holds more moisture (Clausius-Clapeyron: ~7% more water vapor per °C). This intensifies both drought (higher evaporation) and extreme precipitation (atmospheric rivers)." },
    ]} },
  description: 'Calculate relative humidity from temperature and dew point using the Magnus formula. Get comfort ratings, mold risk assessment, and apparent (feels-like) temperature.',
  formula: 'RH = 100 × Actual Vapor Pressure ÷ Saturation Vapor Pressure | Vapor Pressure e = 6.112 × exp(17.67 × T ÷ (T + 243.5)) for both T and Dew Point',
  interpretation: 'Relative humidity tells you how close the air is to saturation, but dew point is actually the better measure of how humid it feels. A dew point below 55°F feels comfortable; above 65°F feels sticky and unpleasant. The ideal RH for human comfort and health is 30-50%. Below 30%, you risk dry skin and increased virus transmission; above 60%, you risk mold growth and dust mite proliferation. In summer, your air conditioner is also a dehumidifier — if your home feels clammy at 72°F, the RH is likely above 60%. A standalone dehumidifier can help in basements or humid climates.'
}

export default calcDef
