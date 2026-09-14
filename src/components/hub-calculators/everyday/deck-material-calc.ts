import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ deckLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), deckWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), boardWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), materialType: z.string().min(1) }),
  fields: [
    { name: 'deckLength', label: 'Deck Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'deckWidth', label: 'Deck Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'boardWidth', label: 'Board Width (in)', type: 'number', min: 2, max: 12, step: '2' },
    { name: 'materialType', label: 'Material Type', type: 'select', options: [{ label: 'Pressure Treated Wood', value: 'pt' }, { label: 'Cedar/Redwood', value: 'cedar' }, { label: 'Composite', value: 'composite' }, { label: 'PVC', value: 'pvc' }] },
  ],
  defaults: { deckLength: '16', deckWidth: '12', boardWidth: '6', materialType: 'composite' },
  presets: [
    { label: 'Small Entry Deck', values: { deckLength: '8', deckWidth: '6', boardWidth: '6', materialType: 'pt' } },
    { label: 'Standard Back Deck', values: { deckLength: '16', deckWidth: '12', boardWidth: '6', materialType: 'composite' } },
    { label: 'Large Multi-Level', values: { deckLength: '24', deckWidth: '16', boardWidth: '4', materialType: 'cedar' } },
    { label: 'Wrap-Around Porch', values: { deckLength: '40', deckWidth: '8', boardWidth: '6', materialType: 'pvc' } },
  ],
  compute: (v) => {
    const deckArea = v.deckLength * v.deckWidth
    const boardWidthFt = v.boardWidth / 12
    const gap = 0.125 / 12
    const boardsNeeded = Math.ceil(v.deckWidth / (boardWidthFt + gap))
    const linearFt = v.deckLength
    const materialCosts: Record<string, { perBoardFt: number; name: string; wastePct: number }> = { pt: { perBoardFt: 1.5, name: 'Pressure Treated', wastePct: 15 }, cedar: { perBoardFt: 3, name: 'Cedar/Redwood', wastePct: 12 }, composite: { perBoardFt: 5, name: 'Composite', wastePct: 10 }, pvc: { perBoardFt: 6, name: 'PVC', wastePct: 8 } }
    const mat = materialCosts[v.materialType] || materialCosts.pt
    const totalBoardFt = linearFt * boardsNeeded
    const wasteBoardFt = totalBoardFt * (mat.wastePct / 100)
    const materialCost = totalBoardFt * mat.perBoardFt
    const withWasteCost = (totalBoardFt + wasteBoardFt) * mat.perBoardFt
    const joistCost = deckArea * 2.5
    const hiddenFastenerCost = deckArea * 0.75
    const totalWithJoists = withWasteCost + joistCost + hiddenFastenerCost
    return { result: materialCost, label: 'Deck Board Material Cost', unit: '$', steps: [{ label: 'Deck Area', value: `${deckArea} sq ft (${v.deckLength}×${v.deckWidth})` }, { label: 'Material', value: mat.name }, { label: 'Boards Needed', value: `${boardsNeeded} boards of ${v.boardWidth} in × ${v.deckLength} ft` }, { label: 'Board Feet Total', value: `${totalBoardFt.toFixed(0)} BF (${v.boardWidth} in × ${v.deckLength} ft × ${boardsNeeded} boards ÷ 12)` }, { label: 'Waste Allowance', value: `${mat.wastePct}% — add ${wasteBoardFt.toFixed(0)} BF` }, { label: 'Material Cost (boards)', value: `$${withWasteCost.toFixed(2)}` }, { label: 'Joists + Fasteners', value: `$${(joistCost + hiddenFastenerCost).toFixed(2)} (joists ~$2.50/sf + hidden clips ~$0.75/sf)` }, { label: 'Estimated Total', value: `$${totalWithJoists.toFixed(2)}` }] ,
    extras: [
      { label: "Material Price Ranges", value: "Pressure treated: $1-2/BF ($1.50-3/sq ft). Cedar: $2.50-4/BF ($3-5/sq ft). Composite: $4-7/BF ($5-9/sq ft). PVC: $5-8/BF ($6-11/sq ft). Prices vary by region." },
      { label: "Hidden Fastener Systems", value: "Add $0.50-1/sq ft for hidden clips (Camouflage, Trex Hideaway). These eliminate visible screws and prevent wood splitting at the board edges." },
      { label: "Joist Spacing", value: "Standard 16 in OC for PT boards, 12 in OC for composite/PVC (because they sag more in heat). Closer spacing adds 15-25% to joist cost." },
      { label: "Stairs and Railings", value: "Stairs add $30-60/step in materials. Railing costs $20-50/linear ft. A 12×16 deck with one set of stairs and 40 ft of railing adds $1,500-2,500." },
      { label: "Permits & Codes", value: "Most municipalities require permits for decks >200 sq ft and within 30 in of ground. Permit costs: $100-500. Code requires 36 in high rails if deck >30 in off ground." },
      { label: "Finishing & Sealing", value: "PT needs annual sealing ($0.10-0.30/sq ft for stain). Cedar naturally weathers to gray in 6-12 months. Composite/PVC needs no sealing—wash annually with soap and water." },
      { label: "Long-Term Value", value: "PT: 10-15 yr lifespan with annual maintenance. Cedar: 15-20 yr. Composite: 25-30 yr (lifetime of material, not structure). PVC: 25-30 yr. Higher upfront cost = lower TCO." },
      { label: "Installation Cost", value: "DIY saves 40-60% of total cost. Professional installation: $15-25/sq ft for PT, $25-40/sq ft for composite/PVC. A 192 sq ft deck costs $2,900-4,800 DIY vs $7,700+ pro." },
    ]}
  },
  description: 'Estimate deck material quantities and total project cost including boards, joists, hidden fasteners, and waste allowance. Compare pressure-treated wood, cedar, composite, and PVC with realistic pricing and lifespan data.',
  formula: 'Boards = Ceil(Deck Width ÷ (Board Width in ft + 0.0104)) | Board Feet = Board Count × Length × Width(in) ÷ 12 | Total Cost = Board Cost with Waste + Joist Cost($2.50/sf) + Fasteners($0.75/sf)',
  interpretation: 'Deck material choice is a classic upfront cost vs total cost of ownership trade-off. Pressure treated pine costs $1.50-3/sq ft but needs annual sealing and lasts 10-15 years. Composite ($5-9/sq ft) costs 2-3× more upfront but requires no maintenance beyond washing and lasts 25-30 years. Hidden fastening systems add $0.50-1/sq ft but eliminate visible screws and prevent moisture traps. Always add 10-15% for waste on angle cuts and pattern matching—this is higher for patterned composite or diagonal layouts. Professional installation typically doubles the total project cost.'
}

export default calcDef
