import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), unit: z.string().min(1), minPerLb: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), restTime: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), meatType: z.string().min(1), targetTemp: z.string().min(1) }),
  fields: [
    { name: 'weight', label: 'Weight', type: 'number', min: 0.5, step: '0.5' },
    { name: 'unit', label: 'Weight Unit', type: 'select', options: [{ label: 'Pounds (lb)', value: 'lb' }, { label: 'Kilograms (kg)', value: 'kg' }] },
    { name: 'meatType', label: 'Meat Type', type: 'select', options: [{ label: 'Beef/Lamb Roast', value: 'beef' }, { label: 'Pork Roast', value: 'pork' }, { label: 'Whole Chicken/Turkey', value: 'poultry' }, { label: 'Fish Fillet', value: 'fish' }] },
    { name: 'targetTemp', label: 'Target Doneness', type: 'select', options: [{ label: 'Rare (125°F)', value: 'rare' }, { label: 'Medium-Rare (135°F)', value: 'medrare' }, { label: 'Medium (145°F)', value: 'medium' }, { label: 'Medium-Well (155°F)', value: 'medwell' }, { label: 'Well Done (165°F)', value: 'welldone' }] },
    { name: 'minPerLb', label: 'Minutes per lb', type: 'number', min: 1, step: '1' },
    { name: 'restTime', label: 'Rest Time (min)', type: 'number', min: 0, step: '5' },
  ],
  defaults: { weight: '5', unit: 'lb', meatType: 'beef', targetTemp: 'medrare', minPerLb: '15', restTime: '15' },
  presets: [
    { label: 'Sunday Roast Beef (5lb)', values: { weight: '5', unit: 'lb', meatType: 'beef', targetTemp: 'medrare', minPerLb: '15', restTime: '15' } },
    { label: 'Thanksgiving Turkey (14lb)', values: { weight: '14', unit: 'lb', meatType: 'poultry', targetTemp: 'welldone', minPerLb: '13', restTime: '25' } },
    { label: 'Pork Shoulder (8lb)', values: { weight: '8', unit: 'lb', meatType: 'pork', targetTemp: 'welldone', minPerLb: '30', restTime: '20' } },
    { label: 'Salmon Fillet (2lb)', values: { weight: '2', unit: 'lb', meatType: 'fish', targetTemp: 'medium', minPerLb: '10', restTime: '5' } },
  ],
  compute: (v) => {
    const w = v.weight * (v.unit === 'kg' ? 2.205 : 1)
    const cookMin = w * v.minPerLb
    const totalMin = cookMin + v.restTime
    const hours = Math.floor(totalMin / 60)
    const mins = Math.round(totalMin % 60)
    const finalTemps: Record<string, number> = { rare: 125, medrare: 135, medium: 145, medwell: 155, welldone: 165 }
    const carryOver: Record<string, number> = { rare: 5, medrare: 7, medium: 8, medwell: 5, welldone: 3 }
    const pullTemp = finalTemps[v.targetTemp] - carryOver[v.targetTemp]
    const timePerLbAdjusted = w * v.minPerLb
    const startTimeNow = new Date()
    const finishTime = new Date(startTimeNow.getTime() + totalMin * 60000)
    return { result: totalMin, label: 'Total Time', unit: 'min', steps: [
      { label: `Weight (${v.unit === 'kg' ? `${v.weight} kg` : `${v.weight} lb`})`, value: v.unit === 'kg' ? `${v.weight} kg = ${w.toFixed(2)} lb` : `${v.weight} lb` },
      { label: `${v.meatType === 'fish' ? 'Cooking' : 'Roasting'} Time Formula`, value: `${w.toFixed(1)} lb × ${v.minPerLb} min/lb = ${cookMin.toFixed(1)} min` },
      { label: 'Cook Time', value: `${Math.floor(cookMin / 60) > 0 ? `${Math.floor(cookMin / 60)}h ${Math.round(cookMin % 60)}m` : `${Math.round(cookMin)} min`}` },
      { label: 'Rest Time', value: `${v.restTime} min (carry-over: +${carryOver[v.targetTemp]}°F)` },
      { label: 'Pull-From-Oven Temp', value: `${pullTemp}°F (will rise to ${finalTemps[v.targetTemp]}°F during rest)` },
      { label: 'Total Time', value: `${hours > 0 ? `${hours}h ${mins}m` : `${mins} min`}` },
      { label: 'Serve Time (approx)', value: `${finishTime.getHours().toString().padStart(2,'0')}:${finishTime.getMinutes().toString().padStart(2,'0')}` },
      { label: 'Safe Temp Reminder', value: `${v.meatType === 'poultry' ? 'Poultry: 165°F (thigh, not breast — dark meat takes longer)' : v.meatType === 'beef' ? `Beef/lamb: ${finalTemps[v.targetTemp]}°F. USDA safe: 145°F + 3min rest` : v.meatType === 'pork' ? 'Pork: 145°F (modern safe temp — no longer needs 160°F)' : 'Fish: 145°F or flake easily with fork'}` },
    ] ,
    extras: [
      { label: 'Carry-Over Cooking Explained', value: `Internal temperature rises ${carryOver[v.targetTemp]}°F during rest due to residual heat. That's why you PULL at ${pullTemp}°F to FINISH at ${finalTemps[v.targetTemp]}°F. Larger roasts carry over more — a 14lb turkey rises 10-15°F. Never skip rest time: it lets juices redistribute, making meat 30-50% more tender and juicy. Tent loosely with foil to retain heat without steaming the crust.` },
      { label: 'Meat Thermometer Best Practices', value: 'Always use an instant-read thermometer ($15-30) or leave-in probe with alarm for large roasts ($40-80). Insert into thickest part, avoiding bone and fat pockets. For poultry: check inner thigh (165°F), NOT breast (breast dries out at 165°F — pull at 155°F and let carry-over finish it). Calibrate your thermometer annually in ice water (should read 32°F). Disposable thermometers are inaccurate — don\'t rely on pop-up indicators.' },
      { label: `${v.meatType === 'beef' ? 'Beef & Lamb Doneness Guide' : v.meatType === 'pork' ? 'Pork Modern Cooking' : v.meatType === 'poultry' ? 'Poultry Safety & Moisture' : 'Fish Perfect Doneness'}`,
        value: v.meatType === 'beef' ? `Rare (125°F): cool red center, soft texture. M-Rare (135°F): warm red center, very tender — the gold standard for prime rib & tenderloin. Medium (145°F): pink center, firmer. M-Well (155°F): slight pink, firm. Well (165°F): no pink, drier. For best results: choose prime-grade beef (marbling = tenderness) and let it come to room temp for 45-60 min before cooking.` : v.meatType === 'pork' ? 'Modern pork is safe at 145°F (USDA updated in 2011). At 145°F, pork has a slight blush of pink — it\'s done, juicy, and safe. Shoulder/pulled pork needs 200-205°F (collagen breakdown = tenderness). Brining pork chops for 30 min in salt water improves moisture retention by 15%.' : v.meatType === 'poultry' ? 'Whole poultry: cook to 165°F in thigh (dark meat takes longer than white). Breast-only roasts: pull at 155°F (carry-over + USDA post-rest allows 5°F). Spatchcock (butterfly) cuts cooking time by 25-30% and cooks more evenly. Brining adds 10-15% moisture retention. Let turkey rest 20-30 min (not 10-15).' : 'Fish is done at 145°F or when it flakes easily with a fork. Rule of thumb: cook 10 min per inch of thickness. Salmon: 125°F for medium (translucent center, silky), 140°F for well-done (opaque, flaky). Overcooked fish = dry, tough, and fishy. Remove from heat just before it flakes — residual heat finishes the cook.' },
      { label: 'High-Altitude Cooking Adjustments', value: 'At 5,000+ ft elevation: boiling point drops ~2°F per 1,000 ft. Moist heat methods (braising, stewing) need 20-30% more time. Dry heat (roasting) is less affected. Check doneness by temp, not time. At 7,000 ft, a 5lb roast may need 25% more cooking time. Meat also dries faster — consider larding or barding (adding fat) to compensate.' },
      { label: 'Oven Calibration & Hot Spots', value: 'Most home ovens are 25-50°F off from set temp. Use an oven thermometer ($10) hanging on the center rack to verify. Rotate large roasts halfway through — front-to-back hot spots vary by 25°F. Convection mode: reduce cooking time by 25% and temp by 25°F. If your roast cooks faster than expected, your oven runs hot — cook by thermometer, not timer.' },
      { label: 'Sear-First vs Reverse-Sear', value: 'Traditional: sear first at high heat (450°F+), then roast low. Reverse-sear: roast at low temp (225-250°F) until 10-15°F below target, then sear. Reverse-sear produces more even doneness (no gray band under the crust) and better crust (dry surface from low roasting). Takes 30-45 min longer but worth it for thick steaks (1.5in+) and roasts.' },
      { label: 'Timesaving Strategies', value: `Your ${v.weight}lb ${v.meatType} takes ${totalMin} min total. To save time: spatchcock poultry (cut 30%), high-temp roasting (425-450°F — cut 20% but watch closely), use convection (cut 25%). Never rush by raising temp more than 25°F above recommended — it dries the outer 1/2in while the center stays raw. Use a leave-in probe thermometer with alarm — no need to open the oven and lose heat.` },
      { label: 'Rest & Carry-Over by Cut', value: `Rest time guidelines: whole roast (15-20 min), chicken/turkey (15-25 min), steak (5-8 min), fish (3-5 min). Carry-over: large roast (10-15°F), whole poultry (10-15°F), steak (5-7°F), thin cuts (2-3°F). Your ${v.restTime} min rest with ${carryOver[v.targetTemp]}°F carry-over allows pulling at ${pullTemp}°F. Never slice before rest time is up — you'll lose 30% of juices on the cutting board.` },
    ]}
  },
  description: 'Calculate precise cooking times for beef, lamb, pork, poultry, and fish based on weight, doneness target, and meat type. Includes carry-over cooking, oven pull temperatures, rest time guidance, and approximate serve time. Supports pounds and kilograms.',
  formula: 'Cook Time = Weight(lb) × Min/lb. Pull Temp = Target − Carry-Over (rare 5°F, medium-rare 7°F, medium 8°F, medium-well 5°F, well-done 3°F). Total = Cook Time + Rest Time. Safe temps: poultry 165°F, beef/lamb 145°F (med), pork 145°F, fish 145°F.',
  interpretation: 'Rest time is critical: roasts continue cooking (carry-over) by 5-15°F after removal depending on size. Always use a calibrated instant-read meat thermometer — don\'t rely on timing alone. USDA safe minimums: poultry 165°F (thigh), beef 145°F (medium) with 3-min rest, pork 145°F, fish 145°F. Pull meat 5-10°F below target temp before resting. Convection ovens cook 25% faster. For perfect results: pat meat dry, bring to room temp (45-60 min), season generously, and rest uncovered for best crust. Reverse-sear method produces the most even doneness for roasts and thick steaks.'
}

export default calcDef
