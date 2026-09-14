import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), width: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), thickness: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wastePct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), concretePrice: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), reinforcement: z.string().min(1) }),
  fields: [
    { name: 'length', label: 'Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'width', label: 'Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'thickness', label: 'Thickness (in)', type: 'number', min: 2, step: '1' },
    { name: 'wastePct', label: 'Waste Factor (%)', type: 'number', min: 0, max: 25, step: '2' },
    { name: 'concretePrice', label: 'Concrete Price ($/cu yd)', type: 'number', min: 0, step: '20' },
    { name: 'reinforcement', label: 'Reinforcement', type: 'select', options: [{ label: 'None', value: 'none' }, { label: 'Wire Mesh', value: 'mesh' }, { label: 'Rebar (1/2in @ 18in)', value: 'rebar' }] },
  ],
  defaults: { length: '10', width: '12', thickness: '4', wastePct: '10', concretePrice: '150', reinforcement: 'mesh' },
  presets: [
    { label: 'Patio Slab', values: { length: '12', width: '14', thickness: '4', wastePct: '10', concretePrice: '155', reinforcement: 'mesh' } },
    { label: 'Driveway', values: { length: '20', width: '12', thickness: '6', wastePct: '10', concretePrice: '150', reinforcement: 'rebar' } },
    { label: 'Walkway Path', values: { length: '30', width: '3', thickness: '4', wastePct: '8', concretePrice: '145', reinforcement: 'none' } },
    { label: 'Foundation Footing', values: { length: '40', width: '1.5', thickness: '8', wastePct: '5', concretePrice: '160', reinforcement: 'rebar' } },
  ],
  compute: (v) => {
    const volumeCF = v.length * v.width * (v.thickness / 12)
    const volumeCY = volumeCF / 27
    const wasteMultiplier = 1 + v.wastePct / 100
    const volumeCYwithWaste = volumeCY * wasteMultiplier
    const areaSqFt = v.length * v.width
    const coverageSqFtPerYard = 27 / (v.thickness / 12)
    const bags80lb = Math.ceil(volumeCYwithWaste * 45)
    const bags60lb = Math.ceil(volumeCYwithWaste * 60)
    const materialCost = volumeCYwithWaste * v.concretePrice
    const rebarCost = v.reinforcement === 'rebar' ? areaSqFt * 1.5 : v.reinforcement === 'mesh' ? areaSqFt * 0.85 : 0
    const totalCost = materialCost + rebarCost
    const costPerSqFt = totalCost / areaSqFt
    const weightLbs = volumeCYwithWaste * 4000
    const trucksNeeded = Math.ceil(volumeCYwithWaste / 10)
    return { result: volumeCY, label: 'Concrete Volume', unit: 'cu yd', steps: [
      { label: 'Slab Area', value: `${v.length}ft × ${v.width}ft = ${areaSqFt.toFixed(1)} sq ft` },
      { label: 'Thickness (depth)', value: `${v.thickness} in = ${(v.thickness / 12).toFixed(3)} ft` },
      { label: 'Gross Volume (cu ft)', value: `${areaSqFt.toFixed(1)} × ${(v.thickness / 12).toFixed(3)}ft = ${volumeCF.toFixed(1)} cu ft` },
      { label: 'Gross Volume (cu yd)', value: `${volumeCF.toFixed(1)} ÷ 27 = ${volumeCY.toFixed(2)} cu yd` },
      { label: `Waste Factor (+${v.wastePct}%)`, value: `+${(volumeCYwithWaste - volumeCY).toFixed(2)} cu yd = ${volumeCYwithWaste.toFixed(2)} cu yd to order` },
      { label: 'Ready-Mix Trucks', value: trucksNeeded > 0 ? `${trucksNeeded} truck${trucksNeeded > 1 ? 's' : ''} (10 cu yd max per truck)` : 'Less than 1 truck — consider mixing onsite' },
      { label: 'Bagged Alternative', value: `${bags80lb} × 80lb bags (or ${bags60lb} × 60lb bags)` },
      { label: 'Total Cost Estimate', value: v.concretePrice > 0 ? `$${materialCost.toFixed(2)} concrete + $${rebarCost.toFixed(2)} reinforcement = $${totalCost.toFixed(2)} ($${costPerSqFt.toFixed(2)}/sq ft)` : 'Enter concrete price for cost estimate' },
    ] ,
    extras: [
      { label: 'Coverage Reference', value: `1 cu yd of concrete covers: ${coverageSqFtPerYard.toFixed(0)} sq ft at ${v.thickness}in thick. Common applications: 4in (patios, walkways, interior floors), 5-6in (driveways, garage floors), 6-8in (foundations, retaining walls), 8-12in (heavy commercial/industrial). Your slab at ${v.thickness}in is ${v.thickness < 4 ? 'too thin for most applications' : v.thickness >= 6 ? 'heavy-duty' : 'standard grade'}.` },
      { label: 'Waste Factor Reality', value: `At ${v.wastePct}%, you're ordering ${(volumeCYwithWaste / volumeCY - 1) * 100}% extra. Recommended waste: 5-10% for slabs on grade, 10-15% for footings/curbs (form blowouts), 15-20% for colored/stamped concrete (cleanout waste). Your ${v.wastePct}% = ${(volumeCYwithWaste - volumeCY).toFixed(2)} extra cu yd = $${((volumeCYwithWaste - volumeCY) * v.concretePrice).toFixed(0)} extra. Better to order extra (pre-paid return) than run short.` },
      { label: 'Reinforcement Cost/Benefit', value: v.reinforcement === 'none' ? 'No reinforcement: suitable only for non-structural, non-load-bearing slabs under 100 sq ft. Risk: cracking from soil movement and temperature changes. For any slab > 100 sq ft or with vehicle traffic, add wire mesh ($${areaSqFt.toFixed(0)} × $0.85 = $${(areaSqFt * 0.85).toFixed(0)}) — cheap insurance against cracks.' : v.reinforcement === 'mesh' ? `Wire mesh ($${(areaSqFt * 0.85).toFixed(0)} total) controls cracking from shrinkage and temperature. Position mesh in the middle third of the slab — not on the ground where it's useless. Overlap sheets by 6in and tie at intersections. Meshed slabs last 10-15 years longer than unreinforced.` : `Rebar at 1/2in diameter ($${(areaSqFt * 1.5).toFixed(0)} total) provides structural reinforcement for load-bearing slabs. Space: 18in each way, 2in from edges, supported on chairs. Rebar adds 30-50% to slab strength vs mesh. Required for: driveways, foundations, any slab with vehicle or heavy loads.` },
      { label: 'Cost Breakdown: Ready-Mix vs Bagged', value: `Ready-mix: $${v.concretePrice.toFixed(0)}/cu yd delivered (min load 3-5 cu yd). Bagged: 80lb @ $6-8/bag = $270-360/cu yd equivalent. At ${volumeCYwithWaste.toFixed(2)} cu yd: ready-mix $${materialCost.toFixed(0)} vs bagged $${(bags80lb * 7).toFixed(0)}. Bagged is ${bags80lb * 7 > materialCost ? 'more expensive for this size' : 'cheaper for small jobs'}. Breakeven: ~1.5 cu yd (67 bags). Under that: bagged. Over: ready-mix.` },
      { label: 'Curing & Control Joints', value: `For a ${v.length}ft × ${v.width}ft slab: cut control joints every ${v.thickness * 2.5}ft (10-12ft max) to control cracking. Cut 1/4 slab depth within 24 hours of pouring. Wet-cure for 7 days (keep damp, cover with burlap) — proper curing increases concrete strength by 50%. Seal after 28 days to prevent freeze-thaw damage and staining.` },
      { label: 'Forming & Sub-Base Preparation', value: `Excavate ${v.thickness + 4}in (${v.thickness}in concrete + 4in gravel base). Add 4in of compacted crushed stone ($$${(areaSqFt * 0.5).toFixed(0)} for gravel). Tamp to 95% compaction. Forms: 2×4 or 2×6 lumber staked every 3ft. Slope: 1/4in per ft for drainage on outdoor slabs. Vapor barrier (6mil poly) under interior slabs prevents moisture migration.` },
      { label: 'Weight & Logistics', value: `Your slab weighs ~${weightLbs.toFixed(0)} lbs (${(weightLbs / 2000).toFixed(1)} tons). Equivalent to ${(weightLbs / 4000).toFixed(1)} cars. For reference: a 10×10×4in slab = 1.23 cu yd = 4,900 lbs. Ensure access for concrete truck (10ft wide, 11ft height clearance). For limited-access areas, use a concrete pump ($200-400) or conveyor truck.` },
      { label: 'Seasonal Considerations', value: 'Pour concrete in 50-85°F for optimal curing. Hot weather (>85°F): use chilled water, retarder admixture, and wet cure immediately — risk of plastic shrinkage cracks. Cold weather (<40°F): use accelerators, heated water, insulating blankets — protect from freezing for 48 hours. Never pour on frozen ground (thaw creates settlement cracks). Best months: April-June and September-October.' },
    ]}
  },
  description: 'Calculate concrete volume needed for slabs, driveways, patios, walkways, and foundations in cubic yards, cubic feet, and bag counts (60lb/80lb). Includes waste factor, ready-mix vs bagged cost comparison, reinforcement options (wire mesh, rebar), and complete cost estimates.',
  formula: 'Volume (cu yd) = (L × W × T/12) ÷ 27. Ordered = Volume × (1 + Waste%). Weight = Volume × 4,000 lbs/cu yd. Reinforcement: Mesh ≈ $0.85/sq ft, Rebar ≈ $1.50/sq ft. Ready-mix cost = Ordered × $/cu yd. Coverage = 27 ÷ (T/12) sq ft per cu yd. 1 cu yd ≈ 45 × 80lb bags ≈ 60 × 60lb bags.',
  interpretation: 'One cubic yard covers 81 sq ft at 4in thick. Standard slabs: 4in for patios/walkways (no vehicles), 5-6in for driveways (light vehicle), 6-8in for heavy vehicle/structural. Add 5-10% waste for slabs on grade, 10-15% for formed work. Breakeven between bagged vs ready-mix: ~1.5 cu yd (67 bags). Always use reinforcement: wire mesh for non-structural slabs (controls cracking), rebar for load-bearing. Control joints every 10-12ft, cut 1/4 slab depth within 24 hours. Proper curing (7 days wet) increases strength by 50%. Never pour in freezing or >90°F conditions.'
}

export default calcDef
