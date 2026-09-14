import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ gardenArea: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), mainCrop: z.string().min(1), companionChoice: z.string().min(1), pestIssue: z.string().min(1), sunExposure: z.string().min(1) }),
  fields: [
    { name: 'gardenArea', label: 'Garden Area (sq ft)', type: 'number', min: 10, step: '10' },
    { name: 'mainCrop', label: 'Main Crop', type: 'select', options: [{ label: 'Tomatoes', value: 'tomato' }, { label: 'Carrots', value: 'carrot' }, { label: 'Lettuce', value: 'lettuce' }, { label: 'Peppers', value: 'pepper' }, { label: 'Beans', value: 'beans' }, { label: 'Cucumbers', value: 'cucumber' }] },
    { name: 'companionChoice', label: 'Companion Plant', type: 'select', options: [{ label: 'Basil', value: 'basil' }, { label: 'Marigold', value: 'marigold' }, { label: 'Nasturtium', value: 'nasturtium' }, { label: 'Dill', value: 'dill' }, { label: 'Mint', value: 'mint' }, { label: 'Garlic', value: 'garlic' }] },
    { name: 'pestIssue', label: 'Target Pest Issue', type: 'select', options: [{ label: 'General prevention', value: 'general' }, { label: 'Aphids', value: 'aphids' }, { label: 'Hornworms', value: 'hornworms' }, { label: 'Nematodes', value: 'nematodes' }, { label: 'Squash bugs', value: 'squash' }, { label: 'Slugs/snails', value: 'slugs' }] },
    { name: 'sunExposure', label: 'Sun Exposure', type: 'select', options: [{ label: 'Full Sun (6+ hrs)', value: 'full' }, { label: 'Partial Shade (3-6 hrs)', value: 'partial' }, { label: 'Shade (under 3 hrs)', value: 'shade' }] },
  ],
  defaults: { gardenArea: '100', mainCrop: 'tomato', companionChoice: 'basil', pestIssue: 'general', sunExposure: 'full' },
  presets: [
    { label: 'Tomato + Basil (pest control)', values: { gardenArea: '80', mainCrop: 'tomato', companionChoice: 'basil', pestIssue: 'hornworms', sunExposure: 'full' } },
    { label: 'Carrot + Dill (shade management)', values: { gardenArea: '50', mainCrop: 'carrot', companionChoice: 'dill', pestIssue: 'general', sunExposure: 'full' } },
    { label: 'Cucumber + Nasturtium (trap crop)', values: { gardenArea: '60', mainCrop: 'cucumber', companionChoice: 'nasturtium', pestIssue: 'aphids', sunExposure: 'full' } },
    { label: 'Lettuce + Mint (shade tolerance)', values: { gardenArea: '40', mainCrop: 'lettuce', companionChoice: 'mint', pestIssue: 'slugs', sunExposure: 'partial' } },
  ],
  compute: (v) => {
    const companions: Record<string, string[]> = {
      tomato: ['basil', 'marigold', 'garlic'],
      carrot: ['dill', 'garlic'],
      lettuce: ['mint', 'garlic'],
      pepper: ['basil', 'marigold'],
      beans: ['nasturtium', 'marigold'],
      cucumber: ['dill', 'nasturtium']
    }
    const antagonists: Record<string, string[]> = {
      tomato: ['dill', 'mint'],
      carrot: ['marigold'],
      lettuce: ['basil', 'dill'],
      pepper: ['dill', 'mint'],
      beans: ['garlic', 'dill'],
      cucumber: ['marigold', 'mint']
    }
    const pestControl: Record<string, Record<string, string>> = {
      tomato: { basil: 'hornworms', marigold: 'nematodes', garlic: 'aphids' },
      carrot: { dill: 'general', garlic: 'aphids' },
      lettuce: { mint: 'slugs', garlic: 'aphids' },
      pepper: { basil: 'aphids', marigold: 'nematodes' },
      beans: { nasturtium: 'aphids', marigold: 'nematodes' },
      cucumber: { dill: 'general', nasturtium: 'aphids' }
    }
    const goodCompanions = companions[v.mainCrop] || []
    const badCompanions = antagonists[v.mainCrop] || []
    const isGood = goodCompanions.includes(v.companionChoice)
    const isBad = badCompanions.includes(v.companionChoice)
    const companionArea = v.gardenArea * 0.2
    const spacingNeeded = v.companionChoice === 'mint' ? '36' : v.companionChoice === 'dill' ? '24' : '12'
    const pestControlled = pestControl[v.mainCrop]?.[v.companionChoice] || ''
    const matchesPest = pestControlled === v.pestIssue || pestControlled === 'general'
    const fullSunPlants = ['tomato', 'pepper', 'beans', 'cucumber']
    const partialShadePlants = ['carrot', 'lettuce']
    const sunMatch = fullSunPlants.includes(v.mainCrop) ? v.sunExposure === 'full' : partialShadePlants.includes(v.mainCrop) ? v.sunExposure !== 'shade' : true
    return { result: isGood ? 2 : isBad ? 0 : 1, label: isGood ? 'Beneficial Companion' : isBad ? 'Avoid This Pair' : 'Neutral Pair', unit: '', steps: [
      { label: 'Main Crop', value: `${v.mainCrop.charAt(0).toUpperCase() + v.mainCrop.slice(1)}` },
      { label: 'Companion Plant', value: `${v.companionChoice.charAt(0).toUpperCase() + v.companionChoice.slice(1)}` },
      { label: 'Compatibility Verdict', value: isGood ? '✔ Beneficial — enhances growth, repels pests, or improves soil' : isBad ? '✘ Conflict — stunts growth or attracts shared pests' : '— Neutral — can be planted near but not directly adjacent' },
      { label: 'Pest Control Target', value: pestControlled ? `Repels: ${pestControlled}${matchesPest ? ' (matches your target pest!)' : ''}` : 'No specific pest control benefit' },
      { label: `Spacing Required`, value: `${spacingNeeded} in apart` },
      { label: 'Companion Area Needed', value: `${companionArea.toFixed(0)} sq ft (20% of ${v.gardenArea} sq ft)` },
      { label: 'Sun Compatibility', value: sunMatch ? 'Sun requirements compatible' : `⚠ ${v.mainCrop} prefers full sun — partial shade may reduce yield` },
      { label: 'Plants per Sq Ft', value: `${v.companionChoice === 'mint' ? '1' : v.companionChoice === 'dill' ? '2' : '4'}-${v.companionChoice === 'basil' ? '6' : '3'}` },
    ] ,
    extras: [
      { label: 'Why This Pair Works/Fails', value: isGood ? `Companion planting benefits: pest repellent (${pestControlled || 'general deterrent'}), shade provision, nutrient sharing, or improved pollination. ${v.mainCrop} and ${v.companionChoice} have complementary root depths and growth habits — they don't compete for the same soil layer.` : isBad ? `${v.mainCrop} and ${v.companionChoice} compete for resources or attract the same pests. They release allelopathic chemicals that inhibit each other's growth. Keep them in separate beds or at least 10ft apart.` : 'Neutral pairs don\'t strongly help or harm each other. They can share a bed with adequate spacing but won\'t provide pest control or growth enhancement. Use the space for a known beneficial companion instead.' },
      { label: 'Pest Management Strategy', value: matchesPest && pestControlled ? `Perfect match! ${v.companionChoice} targets your ${v.pestIssue} problem. Plant in clusters of 3-5 near ${v.mainCrop} for best effect. Replant ${v.companionChoice} every 3-4 weeks for season-long pest pressure.` : pestControlled ? `${v.companionChoice} repels ${pestControlled}, but you selected "${v.pestIssue}" as your concern. For ${v.pestIssue}: ${v.pestIssue === 'aphids' ? 'try nasturtium (trap crop) or garlic' : v.pestIssue === 'hornworms' ? 'basil or dill' : v.pestIssue === 'nematodes' ? 'marigolds are the best option' : v.pestIssue === 'squash' ? 'nasturtium or tansy' : 'mint or rosemary'}.` : `${v.companionChoice} doesn't specifically target ${v.pestIssue}. Consider rotating in a targeted companion next season.` },
      { label: 'Succession Planting Schedule', value: `Plant ${v.mainCrop} first, then sow ${v.companionChoice} 1-2 weeks later (or 3-4 weeks earlier for dill if it bolts fast). Succession plant fast-growing companions every 3 weeks for continuous pest protection. Remove dying companion plants promptly to prevent disease spread. Late-season: plant garlic between ${v.mainCrop} in fall for spring harvest before main crop fills in.` },
      { label: 'Row & Bed Layout Guide', value: `For best results: plant ${v.companionChoice} in a border around ${v.mainCrop} or intersperse every 3-5 plants. Mint must be in a container sunk into the ground (it spreads aggressively — 3ft/year). Basil: plant on the south side (doesn't shade tomatoes). Dill: let it go to seed to attract parasitic wasps. Marigolds: French varieties work best (dwarf, continuous bloom).` },
      { label: 'Soil & Nutrient Dynamics', value: `Companion planting affects soil: beans (legumes) fix nitrogen — great near heavy feeders like tomatoes. Garlic adds sulfur (natural fungicide). Mint suppresses weeds but competes heavily for water. Dill attracts beneficial insects that pollinate cucumbers. Deep-rooted companions (dill, sunflower) break up compacted soil for shallow-rooted crops (lettuce).` },
      { label: 'Sun & Microclimate', value: `In ${v.sunExposure} sun: ${v.mainCrop} and ${v.companionChoice} require specific positioning. Tall companions (dill, sunflowers) provide afternoon shade for lettuce — extend the season by 3-4 weeks. Low-growing companions (thyme, oregano) act as living mulch, keeping soil cool and moist. In partial shade, prioritize leafy crops (lettuce, spinach, kale) over fruiting ones.` },
      { label: 'Avoid These Combinations', value: `Never plant ${v.mainCrop} near: ${v.mainCrop === 'tomato' ? 'corn (same pest — corn earworm), potatoes (blight), fennel (inhibits growth), or dill (mature dill cross-pollinates).' : v.mainCrop === 'beans' ? 'onions, garlic, or chives (stunt growth) or fennel (allelopathic).' : v.mainCrop === 'cucumber' ? 'aromatic herbs like sage and oregano (reduce flavor) or potatoes (compete for nutrients).' : v.mainCrop === 'carrot' ? 'dill (mature dill cross-pollinates), parsnips (same pests), or celery.' : v.mainCrop === 'lettuce' ? 'broccoli, cauliflower (shade too much) or parsley.' : 'fennel (allelopathic to most plants), or potatoes.'} Keep these at opposite ends of your garden.` },
      { label: 'Season & Rotation Planning', value: 'Rotate companion groupings yearly to prevent soil-borne disease and pest buildup. Year 1: tomatoes + basil + marigolds. Year 2: beans + nasturtium (nitrogen fixers). Year 3: carrots + dill + garlic (root crops). Year 4: peppers + basil (nightshade family). Repeating companion pairs in the same bed >2 years reduces pest-repelling effectiveness by 30-50%.' },
    ]}
  },
  description: 'Check companion plant compatibility for your garden crops — find beneficial pairings that repel pests, improve soil, and boost yields. Covers tomatoes, carrots, lettuce, peppers, beans, and cucumbers with basil, marigold, nasturtium, dill, mint, and garlic. Includes pest-specific recommendations and spacing guidance.',
  formula: 'Compatibility matrix: match main crop (tomato, carrot, lettuce, pepper, beans, cucumber) with companion (basil, marigold, nasturtium, dill, mint, garlic). Companion area = Garden × 20%. Spacing: mint 36in, dill 24in, others 12in. Pest targeting: each companion deters specific pests. Sun compatibility: fruiting crops (tomato, pepper) need full sun; leafy (lettuce) tolerate partial shade.',
  interpretation: 'Companion planting improves yields by 10-30% and reduces pest damage by 40-60% vs monoculture. Key principles: basil with tomatoes repels hornworms and improves flavor; marigolds deter nematodes throughout the garden; nasturtiums act as trap crops for aphids; dill attracts beneficial wasps that prey on caterpillars. Never plant fennel near anything (strongly allelopathic), or tomatoes with corn (same pest). Mint must be containerized (invasive, spreads 3ft+/year). Rotate companion groups yearly to maintain soil health and pest control effectiveness.'
}

export default calcDef
