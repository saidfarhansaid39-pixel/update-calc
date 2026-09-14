import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ chestIn: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), waistIn: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), heightIn: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), hipIn: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), genderSize: z.string().min(1), fitPreference: z.string().min(1) }),
  fields: [
    { name: 'chestIn', label: 'Chest (inches)', type: 'number', min: 20, max: 70, step: '1' },
    { name: 'waistIn', label: 'Waist (inches)', type: 'number', min: 18, max: 60, step: '1' },
    { name: 'hipIn', label: 'Hip (inches)', type: 'number', min: 20, max: 70, step: '1' },
    { name: 'heightIn', label: 'Height (inches)', type: 'number', min: 36, max: 96, step: '1' },
    { name: 'genderSize', label: 'Gender', type: 'select', options: [{ label: 'Men', value: 'men' }, { label: 'Women', value: 'women' }] },
    { name: 'fitPreference', label: 'Fit Preference', type: 'select', options: [{ label: 'Slim', value: 'slim' }, { label: 'Regular', value: 'regular' }, { label: 'Relaxed', value: 'relaxed' }] },
  ],
  defaults: { chestIn: '40', waistIn: '32', hipIn: '38', heightIn: '68', genderSize: 'men', fitPreference: 'regular' },
  presets: [
    { label: 'Men - Athletic Build', values: { chestIn: '44', waistIn: '32', hipIn: '40', heightIn: '72', genderSize: 'men', fitPreference: 'slim' } },
    { label: 'Men - Standard Build', values: { chestIn: '42', waistIn: '36', hipIn: '42', heightIn: '70', genderSize: 'men', fitPreference: 'regular' } },
    { label: 'Women - Petite', values: { chestIn: '34', waistIn: '26', hipIn: '36', heightIn: '62', genderSize: 'women', fitPreference: 'slim' } },
    { label: 'Women - Curvy', values: { chestIn: '38', waistIn: '30', hipIn: '44', heightIn: '66', genderSize: 'women', fitPreference: 'relaxed' } },
  ],
  compute: (v) => {
    const chest = Number(v.chestIn); const waist = Number(v.waistIn); const hip = Number(v.hipIn); const height = Number(v.heightIn)
    const fitAdj = v.fitPreference === 'slim' ? -1 : v.fitPreference === 'relaxed' ? 1 : 0
    let topSize = ''; let bottomSize = ''; let dressSize = 0; let pantWaist = 0
    if (v.genderSize === 'men') {
      const chestAdj = chest + fitAdj
      topSize = chestAdj <= 34 ? 'XS' : chestAdj <= 38 ? 'S' : chestAdj <= 42 ? 'M' : chestAdj <= 46 ? 'L' : chestAdj <= 50 ? 'XL' : '2XL+'
      const waistAdj = waist + fitAdj
      bottomSize = waistAdj <= 28 ? 'XS' : waistAdj <= 32 ? 'S' : waistAdj <= 36 ? 'M' : waistAdj <= 40 ? 'L' : 'XL+'
      pantWaist = Math.round(waist)
      const neckIn = Math.round(waist * 0.43)
      const sleeveIn = Math.round((height * 0.41 + 4) / 0.5) * 0.5
      const chestToHeightRatio = (chest / height * 100).toFixed(1)
      return { result: chest, label: `Top: ${topSize} | Bottom: ${bottomSize}`, unit: '', steps: [
        { label: 'Chest Measurement', value: `${chest} in` },
        { label: 'Waist Measurement', value: `${waist} in` },
        { label: 'Hip Measurement', value: `${hip} in (for pant fit reference)` },
        { label: 'Height', value: `${height} in (${Math.floor(height / 12)}ft ${height % 12}in)` },
        { label: `Fit Preference (${v.fitPreference})`, value: `${fitAdj >= 0 ? '+' : ''}${fitAdj} in adjustment` },
        { label: 'Top Size (Jacket/Shirt)', value: `${topSize} (chest: ${chestAdj} in)` },
        { label: 'Bottom Size (Pants)', value: `${bottomSize} (waist: ${waistAdj} in) — ${pantWaist}×${Math.round(height * 0.45)} in inseam estimate` },
        { label: 'Chest/Height Ratio', value: `${chestToHeightRatio}% — ${parseFloat(chestToHeightRatio) > 58 ? 'athletic/broad build' : parseFloat(chestToHeightRatio) > 52 ? 'average build' : 'lean build'}` },
      ] ,
      extras: [
        { label: 'Vanity Sizing Across Brands', value: 'Brands vary wildly: a size M in H&M may fit like a size S in Ralph Lauren or a size L in Uniqlo. Always check the brand\'s specific size chart. General rule: European brands (H&M, Zara) run 1-2 sizes smaller than US brands (Levi\'s, Gap). Asian brands (Uniqlo Asia) run 1-2 sizes smaller than their Western counterparts.' },
        { label: 'Inseam & Suit Sizing', value: `For your height (${Math.floor(height / 12)}ft ${height % 12}in), a standard inseam is ${Math.round(height * 0.45)} in. Suit jacket length: ${Math.round(height * 0.78)} in (reg) or ${Math.round(height * 0.82)} in (long). Neck size: ${neckIn} in (${neckIn <= 14 ? 'small' : neckIn <= 16 ? 'medium' : neckIn <= 17.5 ? 'large' : 'XL'}).` },
        { label: 'Fit Preference Impact', value: `Choosing "${v.fitPreference}" fit shifts sizes by ${Math.abs(fitAdj)} size${Math.abs(fitAdj) !== 1 ? 's' : ''} ${fitAdj > 0 ? 'up' : 'down'}. For ${v.fitPreference} fit in tops, your chest measures ${chest} in — look for garments with ${chest + fitAdj * 2}-${chest + fitAdj * 4} in chest measurement for ideal fit.` },
        { label: 'Weight Fluctuation Buffer', value: 'Natural weight fluctuations of 3-5 lbs change waist by ~0.5 in and chest by ~0.25 in. Your current waist (32 in) could swing between 31.5-32.5 in. Buy pants with some stretch (2% spandex) or a slightly relaxed fit to accommodate normal variation.' },
        { label: 'Online Shopping Measurement Strategy', value: 'Don\'t rely on your "usual size." Measure a well-fitting garment from your closet (pit-to-pit, waist flat, inseam) and compare to the size chart. Use the chest measurement as the primary guide for tops (match within 1-2 in) and waist for bottoms (match within 0.5-1 in).' },
        { label: 'Athletic Build Adjustments', value: `Your chest-to-height ratio of ${(chest / height * 100).toFixed(1)}% indicates your build type. Athletic builds (chest/height > 58%) often need to size up in tops for shoulder room and size down in waist — look for "athletic fit" or "tapered" cuts that accommodate wider shoulders without excess fabric in the midsection.` },
        { label: 'Tailoring ROI', value: 'A $15-25 tailoring cost (hemming, waist taking in) transforms a good-enough fit into a perfect fit. For a $60-80 shirt or $80-120 pants, tailoring costs 15-20% of the purchase price but improves the look by 40-50%. Always buy for your largest measurement and tailor down.' },
        { label: 'International Size Conversion', value: 'US to EU: Men\'s tops — US S=EU 44, M=48, L=52, XL=56. Women\'s dresses — US 4=EU 34, US 6=EU 36, US 8=EU 38, US 10=EU 40. UK to US: UK sizing is typically 2 sizes smaller (US 8 = UK 12). Japanese sizing: 1-2 sizes smaller (US M = Japan L). Always check the brand\'s origin and corresponding conversion chart.' },
      ]}
    } else {
      dressSize = Math.round((chest + waist + hip) / 37 * 2) * 2
      const chestAdj = chest + fitAdj
      topSize = chestAdj <= 32 ? 'XS' : chestAdj <= 34 ? 'S' : chestAdj <= 36 ? 'M' : chestAdj <= 40 ? 'L' : 'XL+'
      const waistAdj = waist + fitAdj
      bottomSize = waistAdj <= 26 ? 'XS' : waistAdj <= 28 ? 'S' : waistAdj <= 31 ? 'M' : waistAdj <= 34 ? 'L' : 'XL+'
      const waistToHip = (waist / hip * 100).toFixed(1)
      const dressFormatted = `Dress ${dressSize}`
      return { result: dressSize, label: `Dress: ${dressSize} | Top: ${topSize} | Bottom: ${bottomSize}`, unit: '', steps: [
        { label: 'Chest/Bust', value: `${chest} in` },
        { label: 'Waist', value: `${waist} in` },
        { label: 'Hip', value: `${hip} in` },
        { label: 'Height', value: `${height} in (${Math.floor(height / 12)}ft ${height % 12}in)` },
        { label: `Fit Preference (${v.fitPreference})`, value: `${fitAdj >= 0 ? '+' : ''}${fitAdj} in adjustment` },
        { label: 'Dress Size', value: `${dressFormatted} (based on combined measurements)` },
        { label: 'Top Size', value: `${topSize} (bust: ${chestAdj} in)` },
        { label: 'Waist-to-Hip Ratio', value: `${waistToHip}% — ${parseFloat(waistToHip) > 85 ? 'straight/rectangular' : parseFloat(waistToHip) > 75 ? 'hourglass/pear' : 'defined waist'}` },
      ] ,
      extras: [
        { label: 'Vanity Sizing Across Brands', value: 'Brands vary wildly: a size 6 in Banana Republic fits like 4 in H&M or 8 in Anthropologie. European brands (Zara, Mango) run 1-2 sizes smaller than US brands. Premium brands often use "true" sizing while fast fashion adds 1-2" to measurements (vanity sizing trend is increasing ~0.5" per decade).' },
        { label: 'Dress Size Calculation Method', value: `Your dress size (${dressSize}) is calculated from the sum of chest + waist + hip (${chest + waist + hip} in) divided by 37 and doubled. Standard formula: (Chest + Waist + Hip) ÷ 36-38 × 2 for misses sizing. Junior sizing uses different proportions — subtract 1-2 sizes if under 5ft 4in.` },
        { label: 'Fit Preference Impact', value: `Choosing "${v.fitPreference}" shifts sizes by ${Math.abs(fitAdj)} size${Math.abs(fitAdj) !== 1 ? 's' : ''}. For ${v.fitPreference} fit, look for garments allowing ${chest + fitAdj * 2}-${chest + fitAdj * 3} in of ease at the bust and ${waist + fitAdj * 1}-${waist + fitAdj * 2} in at the waist. A proper fit should allow 1-2 fingers to slide under waistbands.` },
        { label: 'Waist-to-Hip Ratio & Fit', value: `Your waist-to-hip ratio of ${waistToHip}% helps determine bottom fit. Pear/hourglass shapes (ratio < 75%) need stretch fabrics or "curvy fit" pants with 2-3 in more hip room. Straight shapes (>85%) fit standard cuts well. If you're between sizes, buy for your hip measurement and take in the waist.` },
        { label: 'Online Shopping Adjustment', value: 'When buying online: check the fabric content — 100% cotton won\'t give like 2% elastane blends. Measure your best-fitting garment and compare to the size chart\'s garment measurements (not your body measurements — brands include 1-3 in of "ease"). Read reviews mentioning fit on similar body types.' },
        { label: 'Bras & Foundation Sizing', value: '80% of women wear the wrong bra size. Band size = underbust + 4 in (if even) or + 5 in (if odd). Cup size = bust − band. A 2-in difference = B cup, 3 in = C, 4 in = D, etc. Your chest measurement suggests a band size of ' + `${Math.round(chest)}` + ' if underbust is ~' + `${Math.round(chest * 0.8)}` + ' in.' },
        { label: 'Petite vs Regular vs Tall', value: `At ${Math.floor(height / 12)}ft ${height % 12}in, you're ${height < 64 ? 'petite' : height < 67 ? 'regular-petite' : height < 71 ? 'regular' : 'tall'}. Petite sizing adjusts proportions (shorter torso, higher waist), not just length. Tall sizes add 1-2 in to inseam and sleeve length. Never buy regular and hem — the proportions will be off.` },
        { label: 'Tailoring for Perfection', value: 'A $20-40 tailoring budget transforms 70% fits into 95% fits. Priority alterations: hemming ($10-15), waist take-in ($15-25), side seam adjustment ($20-30). A tailored garment looks 2× more expensive than its price tag. Buy for your largest measurement (usually hip for women) and tailor the rest.' },
      ]}
    }
  },
  description: 'Estimate your clothing size based on chest, waist, hip, and height measurements for men\'s and women\'s apparel. Includes dress size for women, inseam/neck estimates for men, waist-to-hip ratio analysis, and fit preference adjustments. Accounts for vanity sizing variations across brands.',
  formula: 'Men: Chest 34-50+ → XS-2XL+; Waist 28-40+ → XS-XL+; Inseam ≈ Height × 0.45. Women: Dress = round((Chest + Waist + Hip) ÷ 37 × 2) × 2. Fit adjustment: slim −1 size, regular 0, relaxed +1 size. WHR = Waist ÷ Hip × 100.',
  interpretation: 'Sizing varies significantly by brand due to vanity sizing — always check brand-specific size charts. Fit preference shifts sizes by ±1 for slim/relaxed fits. For men: 40 in chest = size M/L; 32 in waist = size M pants. For women: dress size formula averages to misses sizing; juniors and plus sizes use different scales. Athletic builds may need sizing up in shoulders/thighs. A $15-25 tailoring investment improves any garment fit by 40-50%.'
}

export default calcDef
