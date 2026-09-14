import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ frostDate: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), weeksBefore: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), daysToGerminate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), hardeningDays: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'frostDate', label: 'Last Frost Date (day of year 1-365)', type: 'number', min: 1, max: 365, step: '1' },
    { name: 'weeksBefore', label: 'Start Seeds X Weeks Before Frost', type: 'number', min: 1, max: 16, step: '1' },
    { name: 'daysToGerminate', label: 'Days to Germinate', type: 'number', min: 1, max: 30, step: '1' },
    { name: 'hardeningDays', label: 'Hardening Off Days', type: 'number', min: 0, max: 14, step: '1' },
  ],
  defaults: { frostDate: '120', weeksBefore: '8', daysToGerminate: '7', hardeningDays: '7' },
  presets: [
    { label: 'Tomatoes (warm season)', values: { frostDate: '120', weeksBefore: '8', daysToGerminate: '7', hardeningDays: '10' } },
    { label: 'Broccoli (cool season)', values: { frostDate: '120', weeksBefore: '6', daysToGerminate: '5', hardeningDays: '7' } },
    { label: 'Peppers (long season)', values: { frostDate: '120', weeksBefore: '10', daysToGerminate: '14', hardeningDays: '10' } },
    { label: 'Squash/Melons (quick)', values: { frostDate: '120', weeksBefore: '3', daysToGerminate: '5', hardeningDays: '5' } },
  ],
  compute: (v) => {
    const startDay = v.frostDate - v.weeksBefore * 7
    const germEndDay = startDay + v.daysToGerminate
    const transplantDay = v.frostDate + v.hardeningDays
    return { result: startDay, label: 'Start Seeds on Day', unit: '', steps: [{ label: 'Seed Start Date', value: `Day ${Math.max(1, Math.round(startDay))}` }, { label: 'Germination Ends', value: `Day ${Math.round(germEndDay)}` }, { label: 'Hardening Begins', value: `Day ${Math.round(v.frostDate)}` }, { label: 'Transplant Outdoors', value: `Day ${Math.round(transplantDay)}` }] ,
    extras: [
      { label: 'Crop Timing Guide', value: 'Cool season (broccoli, lettuce, kale): 6-8 weeks before frost. Warm season (tomatoes, peppers): 8-10 weeks. Melons/squash: 3-4 weeks. Onions/leeks: 10-12 weeks. Celery: 12-14 weeks' },
      { label: 'Germination Temperature', value: 'Warm season crops need 70-85°F soil temp. Cool season: 50-65°F. Use a heat mat ($20-30) to speed germination by 30-50% for warm season crops' },
      { label: 'Hardening Off Process', value: 'Over 7-10 days: Day 1-2: shade outside 2-3 hrs. Day 3-4: morning sun 3-4 hrs. Day 5-6: full sun 5-6 hrs. Day 7+: overnight if above 50°F. Bring in if frost threatens' },
      { label: 'Seed Starting Setup', value: 'Essential: seed starting mix (sterile), containers with drainage, humidity dome or plastic wrap, grow lights or bright south window, fan for air circulation' },
      { label: 'Light Requirements', value: 'Seedlings need 14-16 hrs of bright light daily. Place grow lights 2-4 in above seedlings — adjust as they grow. Insufficient light = leggy, weak seedlings' },
      { label: 'Average Frost Dates by Zone', value: 'Zone 3: May 15-30. Zone 4: May 1-15. Zone 5: April 15-30. Zone 6: April 1-15. Zone 7: March 15-31. Zone 8: Feb 28-Mar 15. Check USDA zone map for your area' },
      { label: 'Thinning & Potting Up', value: 'Thin to 1 seedling per cell after first true leaves appear. Pot up to 4 in pots when roots fill cells (about 2-3 weeks after germination). Bury tomato stems deep — roots form along stem' },
    ]}
  },
  description: 'Calculate optimal seed starting and transplanting dates based on your last frost date. Schedule indoor seed starting, germination tracking, hardening off, and outdoor transplanting.',
  formula: 'SeedStartDay = LastFrostDay − (WeeksBefore × 7). GerminationEnd = SeedStartDay + DaysToGerminate. TransplantDay = LastFrostDay + HardeningDays. Frost date: day of year (1-365).',
  interpretation: 'For a May 1 frost date (day 120 depending on year): a warm-season crop like tomatoes (start 8 weeks before, germinate 7 days, harden 10 days) would be started on day 64 (March 5), germinate by day 71 (March 12), begin hardening on day 120 (May 1), and transplant outdoors on day 130 (May 10). Cool-season crops can be started earlier and transplanted before the last frost with protection. The key to timing: count backwards from your last frost date, accounting for germination time and hardening off period. Use the USDA Plant Hardiness Zone Map to find your average frost dates.'
}

export default calcDef
