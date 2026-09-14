import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ perimeterFt: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), heightFt: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), postSpacing: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), gates: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'perimeterFt', label: 'Fence Perimeter (ft)', type: 'number', min: 10, step: '10' },
    { name: 'heightFt', label: 'Fence Height (ft)', type: 'number', min: 1, step: '1' },
    { name: 'postSpacing', label: 'Post Spacing (ft)', type: 'number', min: 4, max: 12, step: '1' },
    { name: 'gates', label: 'Number of Gates', type: 'number', min: 0, step: '1' },
  ],
  defaults: { perimeterFt: '200', heightFt: '6', postSpacing: '8', gates: '1' },
  presets: [
    { label: 'Standard Backyard (200 ft)', values: { perimeterFt: '200', heightFt: '6', postSpacing: '8', gates: '1' } },
    { label: 'Small Front Yard (60 ft)', values: { perimeterFt: '60', heightFt: '4', postSpacing: '6', gates: '1' } },
    { label: 'Large Acreage (500 ft)', values: { perimeterFt: '500', heightFt: '6', postSpacing: '10', gates: '2' } },
    { label: 'Pool Enclosure (120 ft)', values: { perimeterFt: '120', heightFt: '5', postSpacing: '6', gates: '1' } },
  ],
  compute: (v) => {
    const posts = Math.ceil(v.perimeterFt / v.postSpacing) + 1
    const rails = Math.ceil(v.heightFt / 2) * 2
    const totalRailLength = v.perimeterFt * rails
    const picketsPerFt = 12 / 5.5
    const pickets = Math.ceil(v.perimeterFt * picketsPerFt)
    const concreteBags = Math.ceil(posts * 1.5)
    const gatePosts = v.gates * 2
    const totalPosts = posts + gatePosts
    const screwsPerPicket = Math.ceil(v.heightFt * 12 / 16) * 2
    const totalScrews = pickets * screwsPerPicket
    const lumberBoardFeet = (totalPosts * v.heightFt * 4 / 12) + (totalRailLength * 2 / 12) + (pickets * v.heightFt * 1 / 12)
    const postHoleVolume = Math.PI * (0.375 ** 2) * v.heightFt * 0.33
    const totalConcreteCuFt = postHoleVolume * totalPosts
    return { result: totalPosts, label: 'Total Posts', unit: '', steps: [
      { label: 'Fence Perimeter', value: `${v.perimeterFt} ft` },
      { label: 'Fence Height', value: `${v.heightFt} ft` },
      { label: 'Post Spacing', value: `${v.postSpacing} ft` },
      { label: 'Line Posts', value: `${posts} at ${v.postSpacing} ft spacing` },
      { label: 'Gate Posts', value: `${gatePosts} (${v.gates} gate${v.gates > 1 ? 's' : ''})` },
      { label: 'Total Posts', value: `${totalPosts}` },
      { label: 'Rails Needed', value: `${totalRailLength.toFixed(0)} ft (${rails} horizontal runs)` },
      { label: 'Pickets', value: `${pickets} (${v.perimeterFt} ft × 2.18 pickets/ft)` },
      { label: 'Concrete Bags (60 lb)', value: `${concreteBags} bags` },
      { label: 'Screws Estimate', value: `${totalScrews.toLocaleString()} screws (${screwsPerPicket}/picket)` },
    ] ,
    extras: [
      { label: "Material Cost Estimate", value: "Pressure-treated pine: $2-3/linear ft for 6 ft fence. Cedar: $3-5/lf. Vinyl: $5-8/lf. Wrought iron: $15-30/lf. Total installed cost: pressure-treated $20-35/lf, cedar $30-45/lf, vinyl $35-55/lf, iron $40-70/lf. A 200 ft pressure-treated fence: $4,000-7,000 installed. Material is 30-40% of total; labor 60-70%." },
      { label: "Post Hole Depth by Frost Line", value: "Posts must be 1/3 of above-ground height + below frost line. 6 ft fence: holes 2.5-3 ft deep. Frost line varies: FL 0 in, TX 6 in, IL 36 in, MN 48 in. Below frost line prevents frost heave (can push posts 1-4 inches/year). Use gravel at hole bottom for drainage (6 inches). Concrete collar should slope away from post." },
      { label: "Picket Spacing & Gap Math", value: "Standard privacy fence: 5.5 in picket with 0.5 in gap = 6 in center-to-center = 2 pickets per linear foot. Board-on-board (overlap): 5.5 in pickets with 1 in overlap = 6.5 in actual coverage per picket = 1.85 pickets/lf — uses 8% more pickets but looks better from both sides. Shadowbox: alternating sides, 5.5 in with 2 in gap = 2.7 pickets/lf." },
      { label: "Gate Construction Specifications", value: "Walk gate (3-4 ft wide): 2 gate posts (post size: 4×4 or 6×6), 2×4 frame with diagonal brace (upward from hinge side). Drive gate (10-16 ft): requires 6×6 or 8×8 posts set 4 ft deep with concrete, heavy-duty hinges and latch, wheel kit for >12 ft. Single gates <4 ft, double gates for >5 ft openings. Add $200-800 per gate in materials." },
      { label: "Permit & Property Line Essentials", value: "Most municipalities require permits for fences >4 ft in front yard or >6 ft in backyard. Cost: $30-150. Setback requirements: typically 2-6 inches from property line. Always get a property survey ($300-800) before building. Encroaching on neighbor's land can result in forced removal at your expense. HOA approval adds $50-200 and 2-6 week review." },
      { label: "Wood Types & Lifespan", value: "Pressure-treated pine: 10-15 years, $2-3/lf, best value, contains copper preservative (safe for gardens after 60 days). Cedar: 15-20 years, $3-5/lf, naturally rot-resistant, ages to silver-gray. Redwood: 20-30 years, $5-8/lf, premium but declining availability. Tropical hardwoods (Ipe, Tigerwood): 30-50 years, $6-12/lf, extremely durable, $3,000-5,000 for 200 ft." },
      { label: "Concrete Mix Guide", value: "Each post hole (10 in diameter, 2.5 ft deep) needs ~1.5 bags of 60 lb fast-setting concrete (Quikrete). Triple the post depth for hole depth (e.g., 6 ft post = 2 ft hole). Concrete sets in 20-40 min (fast-setting) — adjust post plumb immediately. Total for 200 ft fence (25 posts + 2 gate): ~40-45 bags = $120-180." },
      { label: "Maintenance & Longevity Tips", value: "Pressure-treated fence: stain/seal every 2-3 years ($200-400 material for 200 ft). Cedar: stain every 3-4 years. Power wash before staining — gentle setting (1,500-2,000 PSI) to avoid wood damage. Check posts for rot at ground level annually — most fence failures start at the post-ground interface. Replace rotted posts immediately to prevent fence sections from collapsing." },
    ]}
  },
  description: 'Calculate all materials needed for a privacy fence — posts, pickets, rails, concrete, and screws — based on perimeter, height, post spacing, and number of gates. Includes material cost and labor benchmarks.',
  formula: 'Posts = Perimeter/Spacing + 1 + (Gates×2) | Pickets = Perimeter × 12/5.5 | Rails = Ceil(Height/2)×2×Perimeter | Concrete = Posts × 1.5 bags | Screws = Pickets × Ceil(Height×12/16)×2',
  interpretation: 'A standard 200 ft, 6 ft privacy fence with 8 ft post spacing needs 26 line posts + 2 gate posts = 28 total posts, 112 rails (3,600+ ft of 2×4), ~440 pickets, and 42 bags of concrete. Total raw materials: ~$1,500-2,500 for pressure-treated pine. The biggest mistake DIYers make is underestimating post hole digging — 28 holes at 2.5 ft deep = 70 ft of digging (more than the fence is tall). Rent a gas-powered auger ($80-150/day) for any project over 100 ft.'
}

export default calcDef
