import { z } from 'zod'
import type { CalcDef } from './types'

function n(v: string | undefined): number { const x = parseFloat(v ?? ''); return isNaN(x) ? 0 : x }

export const calcDefsGroup2: Record<string, CalcDef> = {
'shed-calculator': {
    schema: z.object({ shedLength: z.string(), shedWidth: z.string(), shedHeight: z.string() }),
    fields: [
      { name: 'shedLength', label: 'Shed Length (ft)', step: 0.5, min: 0 },
      { name: 'shedWidth', label: 'Shed Width (ft)', step: 0.5, min: 0 },
      { name: 'shedHeight', label: 'Wall Height (ft)', step: 0.5, min: 0, placeholder: '8' },
    ],
    compute: (v: Record<string, string>) => {
      const floorArea = n(v.shedLength) * n(v.shedWidth)
      const wallArea = 2 * (n(v.shedLength) + n(v.shedWidth)) * (n(v.shedHeight || '8'))
      const total = floorArea + wallArea
      return { result: floorArea, label: 'Shed Floor Area', unit: 'sq ft', steps: [`Floor: ${n(v.shedLength)} × ${n(v.shedWidth)} = ${floorArea.toFixed(1)} sq ft`, `Walls: ${wallArea.toFixed(1)} sq ft`, `Total surface: ${total.toFixed(1)} sq ft`] }
    },
    description: 'Estimate shed materials based on dimensions.',
    formula: 'Floor = L × W | Walls = 2 × (L + W) × H',
    interpretation: 'Foundation options: gravel pad, concrete slab, or skids. Roof style (lean-to, gable, gambrel) affects materials significantly.',
  },

  'lumber-calculator': {
    schema: z.object({ length: z.string(), width: z.string(), thickness: z.string(), quantity: z.string() }),
    fields: [
      { name: 'length', label: 'Length (ft)', step: 0.1, min: 0 },
      { name: 'width', label: 'Width (in)', step: 0.5, min: 0 },
      { name: 'thickness', label: 'Thickness (in)', step: 0.5, min: 0 },
      { name: 'quantity', label: 'Quantity', step: 1, min: 1, placeholder: '1' },
    ],
    compute: (v: Record<string, string>) => {
      const bdFt = (n(v.width) * n(v.thickness) * n(v.length) / 144) * n(v.quantity || '1')
      return { result: bdFt, label: 'Total Board Feet', unit: 'bd ft', steps: [`Each: ${n(v.width)}" × ${n(v.thickness)}" × ${n(v.length)}' = ${(n(v.width) * n(v.thickness) * n(v.length) / 144).toFixed(2)} bd ft`, `Quantity: ${n(v.quantity || '1')}`, `Total: ${bdFt.toFixed(2)} bd ft`] }
    },
    description: 'Calculate board feet and convert to standard lumber units.',
    formula: 'Board Feet = (T" × W" × L ft) / 144 × Qty',
    interpretation: 'Nominal vs actual: 2×4 = 1.5"×3.5", 2×6 = 1.5"×5.5". Price per board foot varies by species and grade.',
  },

  'nail-calculator': {
    schema: z.object({ surfaceArea: z.string(), nailSpacing: z.string(), nailsPerFastener: z.string() }),
    fields: [
      { name: 'surfaceArea', label: 'Surface Area (sq ft)', step: 1, min: 0 },
      { name: 'nailSpacing', label: 'Nail Spacing (in)', placeholder: '6', step: 1, min: 1 },
      { name: 'nailsPerFastener', label: 'Nails per Fastener', placeholder: '2', step: 1, min: 1 },
    ],
    compute: (v: Record<string, string>) => {
      const sp = (n(v.nailSpacing || '6')) / 12
      const nailsPerSqFt = (n(v.nailsPerFastener || '2')) / (sp * sp)
      const totalNails = Math.ceil(n(v.surfaceArea) * nailsPerSqFt)
      const lb = Math.ceil(totalNails / 150)
      return { result: totalNails, label: 'Nails Needed', unit: 'nails', steps: [`Spacing: ${n(v.nailSpacing || '6')}" OC = ${sp.toFixed(2)} ft grid`, `Nails per sq ft: ~${nailsPerSqFt.toFixed(1)}`, `Total: ~${totalNails} nails`, `Approx. ${lb} lb (1 lb ≈ 150 nails)`] }
    },
    description: 'Estimate nail quantity for framing or sheathing.',
    formula: 'Nails = Area × (Nails/Fastener) / (Spacing/12)²',
    interpretation: 'Framing: 3-1/2" (16d) nails @ 2 per connection. Sheathing: 2-3/8" (8d) @ 6" OC edges, 12" OC field. ~150 16d nails per lb.',
  },

  // ===== AUTO COST ESTIMATORS =====
  'auto-foundation-cost': {
    schema: z.object({ length: z.string(), width: z.string(), depth: z.string(), costPerCuYd: z.string() }),
    fields: [
      { name: 'length', label: 'Footing Length (ft)', step: 0.1, min: 0 },
      { name: 'width', label: 'Footing Width (ft)', step: 0.1, min: 0 },
      { name: 'depth', label: 'Footing Depth (ft)', step: 0.1, min: 0 },
      { name: 'costPerCuYd', label: 'Cost per cu yd ($)', placeholder: '150', step: 5, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const volCY = n(v.length) * n(v.width) * n(v.depth) / 27
      const cost = volCY * n(v.costPerCuYd || '150')
      return { result: cost, label: 'Foundation Cost Estimate', unit: '$', steps: [`Volume: ${n(v.length)} × ${n(v.width)} × ${n(v.depth)} = ${(n(v.length) * n(v.width) * n(v.depth)).toFixed(2)} ft³ = ${volCY.toFixed(3)} yd³`, `Cost: ${volCY.toFixed(3)} × $${n(v.costPerCuYd || '150')} = $${cost.toFixed(2)}`] }
    },
    description: 'Estimate concrete foundation cost based on volume.',
    formula: 'Cost = (L × W × D ÷ 27) × Cost per cu yd',
    interpretation: 'Includes concrete material only. Add labor, rebar, formwork, and finishing separately.',
  },
  'auto-roofing-cost': {
    schema: z.object({ area: z.string(), costPerSqFt: z.string() }),
    fields: [
      { name: 'area', label: 'Roof Area (sq ft)', step: 10, min: 0 },
      { name: 'costPerSqFt', label: 'Cost per sq ft ($)', placeholder: '4.50', step: 0.25, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const cost = n(v.area) * n(v.costPerSqFt || '4.5')
      return { result: cost, label: 'Roofing Cost Estimate', unit: '$', steps: [`Roof area: ${n(v.area)} sq ft`, `Cost: ${n(v.area)} × $${n(v.costPerSqFt || '4.5')} = $${cost.toFixed(2)}`] }
    },
    description: 'Estimate roofing material and labor cost.',
    formula: 'Cost = Area × Cost per sq ft',
    interpretation: 'Cost per sq ft varies by material: asphalt shingle ($3-5), metal ($6-12), tile ($10-20). Includes basic labor.',
  },
  'auto-flooring-cost': {
    schema: z.object({ area: z.string(), costPerSqFt: z.string() }),
    fields: [
      { name: 'area', label: 'Floor Area (sq ft)', step: 10, min: 0 },
      { name: 'costPerSqFt', label: 'Cost per sq ft ($)', placeholder: '5', step: 0.25, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const cost = n(v.area) * n(v.costPerSqFt || '5')
      return { result: cost, label: 'Flooring Cost Estimate', unit: '$', steps: [`Floor area: ${n(v.area)} sq ft`, `Cost: ${n(v.area)} × $${n(v.costPerSqFt || '5')} = $${cost.toFixed(2)}`] }
    },
    description: 'Estimate flooring material and installation cost.',
    formula: 'Cost = Area × Cost per sq ft',
    interpretation: 'Cost per sq ft varies: laminate ($2-5), hardwood ($6-15), tile ($3-10), carpet ($2-7). Includes underlayment and install.',
  },
  'auto-framing-cost': {
    schema: z.object({ boardFeet: z.string(), costPerBdFt: z.string() }),
    fields: [
      { name: 'boardFeet', label: 'Board Feet Required', step: 10, min: 0 },
      { name: 'costPerBdFt', label: 'Cost per bd ft ($)', placeholder: '2.50', step: 0.1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const cost = n(v.boardFeet) * n(v.costPerBdFt || '2.5')
      return { result: cost, label: 'Framing Cost Estimate', unit: '$', steps: [`Board footage: ${n(v.boardFeet)} bd ft`, `Cost: ${n(v.boardFeet)} × $${n(v.costPerBdFt || '2.5')} = $${cost.toFixed(2)}`] }
    },
    description: 'Estimate lumber framing cost based on board footage.',
    formula: 'Cost = Board Feet × Cost per bd ft',
    interpretation: 'Cost per bd ft varies by species: SPF ($1.50-3), Douglas fir ($3-6), pressure-treated ($2-4). Add hardware and fasteners.',
  },
  'auto-drywall-cost': {
    schema: z.object({ area: z.string(), costPerSqFt: z.string() }),
    fields: [
      { name: 'area', label: 'Wall Area (sq ft)', step: 10, min: 0 },
      { name: 'costPerSqFt', label: 'Cost per sq ft ($)', placeholder: '1.50', step: 0.1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const cost = n(v.area) * n(v.costPerSqFt || '1.5')
      return { result: cost, label: 'Drywall Cost Estimate', unit: '$', steps: [`Wall area: ${n(v.area)} sq ft`, `Cost: ${n(v.area)} × $${n(v.costPerSqFt || '1.5')} = $${cost.toFixed(2)}`] }
    },
    description: 'Estimate drywall material and installation cost.',
    formula: 'Cost = Area × Cost per sq ft',
    interpretation: 'Cost includes 4×8 sheets, joint compound, tape, screws, and labor. Typical range: $1-2.50 per sq ft installed.',
  },
  'auto-siding-cost': {
    schema: z.object({ area: z.string(), costPerSqFt: z.string() }),
    fields: [
      { name: 'area', label: 'Siding Area (sq ft)', step: 10, min: 0 },
      { name: 'costPerSqFt', label: 'Cost per sq ft ($)', placeholder: '4', step: 0.25, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const cost = n(v.area) * n(v.costPerSqFt || '4')
      return { result: cost, label: 'Siding Cost Estimate', unit: '$', steps: [`Siding area: ${n(v.area)} sq ft`, `Cost: ${n(v.area)} × $${n(v.costPerSqFt || '4')} = $${cost.toFixed(2)}`] }
    },
    description: 'Estimate exterior siding material and labor cost.',
    formula: 'Cost = Area × Cost per sq ft',
    interpretation: 'Siding costs vary: vinyl ($3-7), fiber cement ($5-10), wood ($6-12), stucco ($7-14). Includes trim and fasteners.',
  },
  'auto-insulation-cost': {
    schema: z.object({ area: z.string(), costPerSqFt: z.string() }),
    fields: [
      { name: 'area', label: 'Area to Insulate (sq ft)', step: 10, min: 0 },
      { name: 'costPerSqFt', label: 'Cost per sq ft ($)', placeholder: '1', step: 0.1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const cost = n(v.area) * n(v.costPerSqFt || '1')
      return { result: cost, label: 'Insulation Cost Estimate', unit: '$', steps: [`Area: ${n(v.area)} sq ft`, `Cost: ${n(v.area)} × $${n(v.costPerSqFt || '1')} = $${cost.toFixed(2)}`] }
    },
    description: 'Estimate insulation material and labor cost.',
    formula: 'Cost = Area × Cost per sq ft',
    interpretation: 'Cost per sq ft: fiberglass batt ($0.50-1), blown-in ($0.75-1.50), spray foam ($2-5). R-value varies by material.',
  },
  'auto-plumbing-cost': {
    schema: z.object({ fixtureCount: z.string(), costPerFixture: z.string() }),
    fields: [
      { name: 'fixtureCount', label: 'Number of Fixtures', step: 1, min: 1 },
      { name: 'costPerFixture', label: 'Cost per Fixture ($)', placeholder: '800', step: 50, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const cost = n(v.fixtureCount) * n(v.costPerFixture || '800')
      return { result: cost, label: 'Plumbing Cost Estimate', unit: '$', steps: [`Fixtures: ${n(v.fixtureCount)}`, `Cost per fixture: $${n(v.costPerFixture || '800')}`, `Total: ${n(v.fixtureCount)} × $${n(v.costPerFixture || '800')} = $${cost.toFixed(2)}`] }
    },
    description: 'Estimate plumbing rough-in cost by fixture count.',
    formula: 'Cost = Fixture Count × Cost per Fixture',
    interpretation: 'Fixtures: toilet, sink, shower, tub, washing machine. Cost per fixture: $500-1500 depending on quality and complexity.',
  },
  'auto-electrical-cost': {
    schema: z.object({ outletCount: z.string(), costPerOutlet: z.string() }),
    fields: [
      { name: 'outletCount', label: 'Number of Outlets/Switches', step: 1, min: 1 },
      { name: 'costPerOutlet', label: 'Cost per Outlet ($)', placeholder: '150', step: 10, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const cost = n(v.outletCount) * n(v.costPerOutlet || '150')
      return { result: cost, label: 'Electrical Cost Estimate', unit: '$', steps: [`Outlets/switches: ${n(v.outletCount)}`, `Cost per outlet: $${n(v.costPerOutlet || '150')}`, `Total: ${n(v.outletCount)} × $${n(v.costPerOutlet || '150')} = $${cost.toFixed(2)}`] }
    },
    description: 'Estimate electrical rough-in cost by outlet count.',
    formula: 'Cost = Outlet Count × Cost per Outlet',
    interpretation: 'Includes outlets, switches, and basic lighting. Does not include panel upgrade, heavy appliances, or specialized circuits.',
  },
  'auto-hvac-cost': {
    schema: z.object({ area: z.string(), costPerSqFt: z.string() }),
    fields: [
      { name: 'area', label: 'Conditioned Area (sq ft)', step: 10, min: 0 },
      { name: 'costPerSqFt', label: 'Cost per sq ft ($)', placeholder: '5', step: 0.25, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const cost = n(v.area) * n(v.costPerSqFt || '5')
      return { result: cost, label: 'HVAC Cost Estimate', unit: '$', steps: [`Conditioned area: ${n(v.area)} sq ft`, `Cost: ${n(v.area)} × $${n(v.costPerSqFt || '5')} = $${cost.toFixed(2)}`] }
    },
    description: 'Estimate HVAC system cost by conditioned area.',
    formula: 'Cost = Area × Cost per sq ft',
    interpretation: 'Cost per sq ft: basic AC ($3-6), heat pump ($5-10), gas furnace + AC ($6-12). Includes ductwork and controls.',
  },
  'auto-foundation-cost-1': {
    schema: z.object({ length: z.string(), width: z.string(), depth: z.string(), costPerCuYd: z.string() }),
    fields: [
      { name: 'length', label: 'Footing Length (ft)', step: 0.1, min: 0 },
      { name: 'width', label: 'Footing Width (ft)', step: 0.1, min: 0 },
      { name: 'depth', label: 'Footing Depth (in)', step: 1, min: 0 },
      { name: 'costPerCuYd', label: 'Cost per cu yd ($)', placeholder: '150', step: 5, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const depthFt = n(v.depth) / 12
      const volCY = n(v.length) * n(v.width) * depthFt / 27
      const cost = volCY * n(v.costPerCuYd || '150')
      return { result: cost, label: 'Foundation Cost (depth in inches)', unit: '$', steps: [`Depth: ${n(v.depth)} in = ${depthFt.toFixed(3)} ft`, `Volume: ${n(v.length)} × ${n(v.width)} × ${depthFt.toFixed(3)} = ${(n(v.length) * n(v.width) * depthFt).toFixed(2)} ft³ = ${volCY.toFixed(3)} yd³`, `Cost: ${volCY.toFixed(3)} × $${n(v.costPerCuYd || '150')} = $${cost.toFixed(2)}`] }
    },
    description: 'Estimate concrete foundation cost with depth in inches.',
    formula: 'Cost = (L × W × D/12 ÷ 27) × Cost per cu yd',
    interpretation: 'Depth input in inches for convenience. Includes concrete material only.',
  },
  'auto-roofing-cost-1': {
    schema: z.object({ length: z.string(), width: z.string(), costPerSqFt: z.string() }),
    fields: [
      { name: 'length', label: 'Roof Length (ft)', step: 0.1, min: 0 },
      { name: 'width', label: 'Roof Width (ft)', step: 0.1, min: 0 },
      { name: 'costPerSqFt', label: 'Cost per sq ft ($)', placeholder: '4.50', step: 0.25, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.length) * n(v.width)
      const cost = area * n(v.costPerSqFt || '4.5')
      return { result: cost, label: 'Roofing Cost (from dimensions)', unit: '$', steps: [`Roof area: ${n(v.length)} × ${n(v.width)} = ${area.toFixed(1)} sq ft`, `Cost: ${area.toFixed(1)} × $${n(v.costPerSqFt || '4.5')} = $${cost.toFixed(2)}`] }
},
      description: 'Estimate roofing cost from length and width dimensions.',
      formula: 'Cost = (Length × Width) × Cost per sq ft',
      interpretation: 'Calculates area from simple length × width. For complex roofs, use total area directly. Cost varies by material.',
    },


  'ac-size': {
    schema: z.object({ floorArea: z.string(), ceilingHeight: z.string(), insulation: z.string(), occupants: z.string(), windows: z.string() }),
    fields: [
      { name: 'floorArea', label: 'Floor Area (sq ft)', step: 100, min: 100 },
      { name: 'ceilingHeight', label: 'Ceiling Height (ft)', step: 0.5, min: 7 },
      { name: 'insulation', label: 'Insulation Level', type: 'select', options: [{ label: 'Poor', value: 'poor' }, { label: 'Average', value: 'avg' }, { label: 'Good', value: 'good' }] },
      { name: 'occupants', label: 'Number of Occupants', step: 1, min: 1 },
      { name: 'windows', label: 'Number of Windows', step: 1, min: 0, mode: 'advanced' },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.floorArea);
      const height = n(v.ceilingHeight);
      const occ = n(v.occupants);
      const wins = n(v.windows);
      const ins = v.insulation ?? 'avg';
      const insFactor = ins === 'poor' ? 1.3 : ins === 'avg' ? 1.0 : 0.85;
      const baseBTU = area * 25 * insFactor * (height / 8);
      const occBTU = occ * 400;
      const winBTU = wins * 600;
      const totalBTU = baseBTU + occBTU + winBTU;
      const tons = Math.ceil(totalBTU / 12000 * 10) / 10;
      return { result: Math.round(totalBTU), label: 'Cooling Capacity', unit: 'BTU/hr', steps: [`Base BTU: ${Math.round(area)} × 25 × ${insFactor} × ${(height/8).toFixed(2)} = ${Math.round(baseBTU)}`, `Occupant adjustment: ${occ} × 400 = ${occBTU}`, `Window adjustment: ${wins} × 600 = ${winBTU}`, `Total: ${Math.round(totalBTU)} BTU/hr = ${tons} tons`] };
    },
    description: 'Calculate required AC cooling capacity based on floor area, insulation, occupants, and windows.',
    formula: 'BTU/hr = Area × 25 × InsulationFactor × (CeilHt/8) + Occupants × 400 + Windows × 600',
    interpretation: 'Divide total BTU by 12,000 to get tons. Round up to nearest half-ton for equipment selection.',
  },
  'boiler-size': {
    schema: z.object({ floorArea: z.string(), climateZone: z.string(), waterHeating: z.string() }),
    fields: [
      { name: 'floorArea', label: 'Floor Area (sq ft)', step: 100, min: 200 },
      { name: 'climateZone', label: 'Climate Zone', type: 'select', options: [{ label: 'Cold', value: 'cold' }, { label: 'Mild', value: 'mild' }, { label: 'Warm', value: 'warm' }] },
      { name: 'waterHeating', label: 'Include Water Heating?', type: 'select', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.floorArea);
      const zone = v.climateZone ?? 'mild';
      const zoneFactor = zone === 'cold' ? 50 : zone === 'mild' ? 40 : 30;
      const wh = v.waterHeating ?? 'no';
      const whSurcharge = wh === 'yes' ? 15000 : 0;
      const btu = area * zoneFactor + whSurcharge;
      return { result: Math.round(btu), label: 'Boiler Output', unit: 'BTU/hr', steps: [`Area × zone factor: ${Math.round(area)} × ${zoneFactor} = ${Math.round(area * zoneFactor)}`, `Water heating surcharge: ${wh === 'yes' ? '15,000' : '0'}`, `Total: ${Math.round(btu)} BTU/hr`] };
    },
    description: 'Calculate required boiler heating output based on floor area and climate zone.',
    formula: 'BTU/hr = FloorArea × ZoneFactor + (WaterHeating ? 15000 : 0)',
    interpretation: 'Zone factor: Cold = 50, Mild = 40, Warm = 30. Add 15,000 BTU/hr if boiler also supplies domestic hot water.',
  },
  'furnace-size': {
    schema: z.object({ floorArea: z.string(), insulation: z.string(), ceilingHeight: z.string() }),
    fields: [
      { name: 'floorArea', label: 'Floor Area (sq ft)', step: 100, min: 200 },
      { name: 'insulation', label: 'Insulation Level', type: 'select', options: [{ label: 'Poor', value: 'poor' }, { label: 'Average', value: 'avg' }, { label: 'Good', value: 'good' }] },
      { name: 'ceilingHeight', label: 'Ceiling Height (ft)', step: 0.5, min: 7 },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.floorArea);
      const height = n(v.ceilingHeight);
      const ins = v.insulation ?? 'avg';
      const insFactor = ins === 'poor' ? 1.3 : ins === 'avg' ? 1.0 : 0.8;
      const htFactor = height / 8;
      const btu = area * htFactor * insFactor * 30;
      return { result: Math.round(btu), label: 'Furnace Output', unit: 'BTU/hr', steps: [`Height factor: ${height} / 8 = ${htFactor.toFixed(2)}`, `Insulation factor: ${insFactor}`, `Total: ${Math.round(area)} × ${htFactor.toFixed(2)} × ${insFactor} × 30 = ${Math.round(btu)} BTU/hr`] };
    },
    description: 'Calculate required furnace heating capacity based on area, insulation, and ceiling height.',
    formula: 'BTU/hr = FloorArea × (CeilHt/8) × InsulationFactor × 30',
    interpretation: 'Higher ceilings increase volume. Poor insulation increases required capacity. Standard rule: ~30 BTU/hr per sq ft with 8ft ceilings and avg insulation.',
  },
  'heat-pump-size': {
    schema: z.object({ floorArea: z.string(), climate: z.string(), backupHeat: z.string() }),
    fields: [
      { name: 'floorArea', label: 'Floor Area (sq ft)', step: 100, min: 200 },
      { name: 'climate', label: 'Climate Type', type: 'select', options: [{ label: 'Cold', value: 'cold' }, { label: 'Mixed', value: 'mixed' }, { label: 'Mild', value: 'mild' }] },
      { name: 'backupHeat', label: 'Include Backup Heat?', type: 'select', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.floorArea);
      const c = v.climate ?? 'mixed';
      const cf = c === 'cold' ? 600 : c === 'mixed' ? 700 : 800;
      const tons = Math.ceil(area / cf * 10) / 10;
      const backup = v.backupHeat === 'yes';
      return { result: tons, label: 'Heat Pump Size', unit: 'tons', steps: [`Climate factor: ${cf}`, `Raw size: ${Math.round(area)} / ${cf} = ${(area/cf).toFixed(2)} tons`, `Rounded: ${tons} tons${backup ? ' (recommend electric backup)' : ''}`] };
    },
    description: 'Calculate heat pump size in tons based on floor area and climate zone.',
    formula: 'Tons = FloorArea / ClimateFactor',
    interpretation: 'Climate factors: Cold = 600, Mixed = 700, Mild = 800. In cold climates, backup heat is strongly recommended. Size to nearest 0.5 ton.',
  },
  'water-heater-size': {
    schema: z.object({ householdSize: z.string(), tankType: z.string() }),
    fields: [
      { name: 'householdSize', label: 'Household Size (people)', step: 1, min: 1 },
      { name: 'tankType', label: 'Tank Type', type: 'select', options: [{ label: 'Electric', value: 'electric' }, { label: 'Gas', value: 'gas' }, { label: 'Heat Pump', value: 'heat-pump' }, { label: 'Tankless', value: 'tankless' }] },
    ],
    compute: (v: Record<string, string>) => {
      const hh = n(v.householdSize);
      const tankType = v.tankType ?? 'electric';
      const fhr = hh * 12 + 20;
      const tankFactors = { electric: 1.0, gas: 1.2, 'heat-pump': 0.9, tankless: 0.5 };
      const tf = tankFactors[tankType as keyof typeof tankFactors] ?? 1.0;
      const adjFHR = Math.round(fhr * tf);
      return { result: adjFHR, label: 'First Hour Rating', unit: 'gallons (FHR)', steps: [`Base FHR: ${hh} × 12 + 20 = ${fhr}`, `${tankType} adjustment factor: ${tf}`, `Adjusted FHR: ${fhr} × ${tf} = ${adjFHR} gallons`] };
    },
    description: 'Calculate required water heater first-hour rating based on household size.',
    formula: 'FHR = HouseholdSize × 12 + 20 (adjusted by tank type factor)',
    interpretation: 'Match the calculated FHR to manufacturer ratings. Gas heaters have higher recovery; tankless has unlimited but limited flow rate.',
  },
  'hvac-duct': {
    schema: z.object({ rooms: z.string(), floorArea: z.string(), ductType: z.string() }),
    fields: [
      { name: 'rooms', label: 'Number of Rooms', step: 1, min: 1 },
      { name: 'floorArea', label: 'Floor Area (sq ft)', step: 100, min: 100 },
      { name: 'ductType', label: 'Duct Type', type: 'select', options: [{ label: 'Rigid', value: 'rigid' }, { label: 'Flex', value: 'flex' }] },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.floorArea);
      const rooms = n(v.rooms);
      const duct = v.ductType ?? 'rigid';
      const totalCFM = Math.round(area / 3);
      const friction = duct === 'rigid' ? 0.08 : 0.06;
      const perRoom = Math.round(totalCFM / rooms);
      const vel = 900;
      const dia = Math.round(Math.sqrt(totalCFM / (vel * Math.PI / 4)) * 144 / 12 * 2) / 2;
      return { result: totalCFM, label: 'Total Airflow', unit: 'CFM', steps: [`Total CFM: ${Math.round(area)} / 3 = ${totalCFM} CFM`, `Per room: ${totalCFM} / ${rooms} ≈ ${perRoom} CFM`, `Suggested trunk diameter: ${dia} inches (${duct})`] };
    },
    description: 'Estimate ductwork airflow requirements based on floor area and room count.',
    formula: 'Total CFM = FloorArea / 3; Per Room = Total / Rooms',
    interpretation: 'Rigid duct allows higher friction rate (0.08 in.wg). Flex duct requires larger diameter. Use Manual D for detailed design.',
  },
  'hvac-filter': {
    schema: z.object({ systemTons: z.string(), filterType: z.string() }),
    fields: [
      { name: 'systemTons', label: 'System Size (tons)', step: 0.5, min: 1 },
      { name: 'filterType', label: 'Filter Type', type: 'select', options: [{ label: '1-inch', value: '1-inch' }, { label: '2-inch', value: '2-inch' }, { label: '4-inch', value: '4-inch' }, { label: 'Pleated', value: 'pleated' }] },
    ],
    compute: (v: Record<string, string>) => {
      const tons = n(v.systemTons);
      const ft = v.filterType ?? '1-inch';
      const depthFactors: Record<string, number> = { '1-inch': 0.5, '2-inch': 0.75, '4-inch': 1.0, pleated: 0.6 };
      const df = depthFactors[ft] ?? 0.5;
      const sqft = Math.round(tons * 0.5 * df * 100) / 100;
      const dim = Math.ceil(Math.sqrt(sqft) * 12 / 2) * 2;
      return { result: sqft, label: 'Filter Area Needed', unit: 'sq ft', steps: [`Base area: ${tons} × 0.5 = ${(tons * 0.5).toFixed(2)} sq ft`, `${ft} depth factor: ${df}`, `Adjusted: ${sqft} sq ft — suggest ${dim}×${dim} inch filter`] };
    },
    description: 'Calculate minimum filter area needed for an HVAC system.',
    formula: 'FilterArea = SystemTons × 0.5 × DepthFactor',
    interpretation: 'Minimum filter face velocity should not exceed 300 fpm for 1-inch, 500 fpm for 4-inch. Larger filters last longer between changes.',
  },
  'hvac-vent': {
    schema: z.object({ roomArea: z.string(), ventType: z.string() }),
    fields: [
      { name: 'roomArea', label: 'Room Area (sq ft)', step: 50, min: 50 },
      { name: 'ventType', label: 'Vent Type', type: 'select', options: [{ label: 'Supply', value: 'supply' }, { label: 'Return', value: 'return' }, { label: 'Exhaust', value: 'exhaust' }] },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.roomArea);
      const vt = v.ventType ?? 'supply';
      const factors: Record<string, number> = { supply: 1.0, return: 0.8, exhaust: 0.5 };
      const factor = factors[vt] ?? 1.0;
      const cfm = Math.round(area * factor);
      const grilleSize = vt === 'supply' ? Math.round(cfm / 200 * 144) : vt === 'return' ? Math.round(cfm / 300 * 144) : Math.round(cfm / 150 * 144);
      return { result: cfm, label: 'Required Ventilation', unit: 'CFM', steps: [`${vt} factor: ${factor}`, `CFM: ${Math.round(area)} × ${factor} = ${cfm}`, `Suggested grille size: ${grilleSize} sq in`] };
    },
    description: 'Calculate required ventilation CFM for a room based on its area and vent type.',
    formula: 'CFM = RoomArea × VentFactor',
    interpretation: 'Supply vents serve conditioned air; return vents pull air back; exhaust vents remove air. Grille sizing based on face velocity (200-300 fpm).',
  },
  'roof-area': {
    schema: z.object({ buildingLength: z.string(), buildingWidth: z.string(), roofPitch: z.string(), overhang: z.string() }),
    fields: [
      { name: 'buildingLength', label: 'Building Length (ft)', step: 5, min: 10 },
      { name: 'buildingWidth', label: 'Building Width (ft)', step: 5, min: 10 },
      { name: 'roofPitch', label: 'Roof Pitch', type: 'select', options: [{ label: '3:12', value: '3:12' }, { label: '4:12', value: '4:12' }, { label: '5:12', value: '5:12' }, { label: '6:12', value: '6:12' }, { label: '7:12', value: '7:12' }, { label: '8:12', value: '8:12' }, { label: '9:12', value: '9:12' }, { label: '10:12', value: '10:12' }, { label: '12:12', value: '12:12' }] },
      { name: 'overhang', label: 'Overhang (ft)', step: 0.5, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const len = n(v.buildingLength);
      const wid = n(v.buildingWidth);
      const oh = n(v.overhang);
      const pitch = v.roofPitch ?? '6:12';
      const pitchMult: Record<string, number> = { '3:12': 1.0308, '4:12': 1.0541, '5:12': 1.0833, '6:12': 1.1180, '7:12': 1.1577, '8:12': 1.2019, '9:12': 1.2500, '10:12': 1.3017, '12:12': 1.4142 };
      const pm = pitchMult[pitch] ?? 1.118;
      const effLen = len + oh * 2;
      const effWid = wid + oh * 2;
      const fp = effLen * effWid;
      const roofArea = Math.round(fp * pm);
      const squares = roofArea / 100;
      return { result: roofArea, label: 'Total Roof Area', unit: 'sq ft', steps: [`Footprint: ${effLen} × ${effWid} = ${Math.round(fp)} sq ft`, `Pitch multiplier for ${pitch}: ${pm}`, `Total: ${Math.round(fp)} × ${pm} = ${roofArea} sq ft (${squares.toFixed(1)} squares)`] };
    },
    description: 'Calculate total roof surface area from building footprint and roof pitch.',
    formula: 'RoofArea = (Length + 2×Overhang) × (Width + 2×Overhang) × PitchMultiplier',
    interpretation: 'Pitch multipliers increase area based on slope steepness. Result in sq ft and roofing squares (100 sq ft per square).',
  },
  'roof-pitch': {
    schema: z.object({ rise: z.string(), run: z.string() }),
    fields: [
      { name: 'rise', label: 'Rise (inches)', step: 0.5, min: 0.5 },
      { name: 'run', label: 'Run (inches)', step: 1, min: 1, placeholder: '12' },
    ],
    compute: (v: Record<string, string>) => {
      const rise = n(v.rise);
      const run = n(v.run) || 12;
      const angle = Math.atan(rise / run) * 180 / Math.PI;
      const pitchRatio = rise / run;
      const pitch12 = Math.round(pitchRatio * 12 * 10) / 10;
      return { result: Math.round(angle * 10) / 10, label: 'Roof Angle', unit: 'degrees', steps: [`Ratio: ${rise}/${run} = ${pitchRatio.toFixed(3)}`, `Angle: atan(${rise}/${run}) = ${(Math.round(angle * 10) / 10)}°`, `Pitch: ${pitch12}:12`] };
    },
    description: 'Convert roof rise and run to degrees and pitch ratio.',
    formula: 'Angle = arctan(Rise / Run); Pitch = Rise/12',
    interpretation: 'Standard run is 12 inches. A 6:12 pitch means 6" rise per 12" run = 26.6°. Common pitches: 3:12 (14°), 6:12 (26.6°), 9:12 (36.9°), 12:12 (45°).',
  },
  'roof-snow-load': {
    schema: z.object({ roofPitch: z.string(), groundSnowLoad: z.string(), roofType: z.string() }),
    fields: [
      { name: 'roofPitch', label: 'Roof Pitch', type: 'select', options: [{ label: 'Low (≤3:12)', value: 'low' }, { label: 'Medium (4:12-7:12)', value: 'medium' }, { label: 'Steep (≥8:12)', value: 'steep' }] },
      { name: 'groundSnowLoad', label: 'Ground Snow Load (psf)', step: 5, min: 10, placeholder: '30' },
      { name: 'roofType', label: 'Roof Type', type: 'select', options: [{ label: 'Cold (vented)', value: 'cold' }, { label: 'Warm (unvented)', value: 'warm' }] },
    ],
    compute: (v: Record<string, string>) => {
      const pg = n(v.groundSnowLoad) || 30;
      const pitch = v.roofPitch ?? 'medium';
      const rt = v.roofType ?? 'cold';
      const expFactor = pitch === 'low' ? 1.0 : pitch === 'medium' ? 0.9 : 0.7;
      const thermalFactor = rt === 'cold' ? 1.2 : 1.0;
      const shapeFactor = 1.0;
      const ps = pg * expFactor * thermalFactor * shapeFactor;
      return { result: Math.round(ps * 10) / 10, label: 'Design Snow Load', unit: 'psf', steps: [`Ground snow: ${pg} psf`, `Exposure factor (${pitch}): ${expFactor}`, `Thermal factor (${rt}): ${thermalFactor}`, `Design: ${pg} × ${expFactor} × ${thermalFactor} × ${shapeFactor} = ${(Math.round(ps * 10) / 10)} psf`] };
    },
    description: 'Calculate design roof snow load per ASCE 7.',
    formula: 'DesignLoad = GroundSnow × Exposure × Thermal × Shape',
    interpretation: 'Steeper pitches shed snow (lower factor). Cold roofs accumulate more. This is a simplified version — consult code for site-specific factors.',
  },
  'roof-ventilation': {
    schema: z.object({ atticArea: z.string(), ventType: z.string() }),
    fields: [
      { name: 'atticArea', label: 'Attic Floor Area (sq ft)', step: 100, min: 100 },
      { name: 'ventType', label: 'Vent Type', type: 'select', options: [{ label: 'Ridge', value: 'ridge' }, { label: 'Soffit', value: 'soffit' }, { label: 'Gable', value: 'gable' }, { label: 'Power', value: 'power' }] },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.atticArea);
      const vt = v.ventType ?? 'ridge';
      const ratio = 300;
      const nfa = area / ratio;
      const factors: Record<string, number> = { ridge: 1.0, soffit: 0.9, gable: 0.8, power: 2.5 };
      const ef = factors[vt] ?? 1.0;
      const adj = nfa * ef;
      return { result: Math.round(adj * 100) / 100, label: 'Net Free Area Needed', unit: 'sq ft', steps: [`Ratio 1:${ratio} — ${Math.round(area)} / ${ratio} = ${nfa.toFixed(2)} sq ft`, `${vt} efficiency factor: ${ef}`, `Adjusted NFA: ${adj.toFixed(2)} sq ft (${(adj * 144).toFixed(0)} sq in)`] };
    },
    description: 'Calculate required net free vent area for attic ventilation.',
    formula: 'NFA = AtticArea / 300',
    interpretation: 'Standard 1:300 ratio (1 sq ft vent per 300 sq ft attic). Power vents can reduce needed NFA but require thermostat/humidistat control.',
  },
  'ridge-vent': {
    schema: z.object({ roofLength: z.string(), roofSlope: z.string() }),
    fields: [
      { name: 'roofLength', label: 'Ridge Length (ft)', step: 5, min: 10 },
      { name: 'roofSlope', label: 'Roof Slope', type: 'select', options: [{ label: '3:12', value: '3:12' }, { label: '4:12', value: '4:12' }, { label: '5:12', value: '5:12' }, { label: '6:12', value: '6:12' }, { label: '7:12', value: '7:12' }, { label: '8:12', value: '8:12' }] },
    ],
    compute: (v: Record<string, string>) => {
      const len = n(v.roofLength);
      const slope = v.roofSlope ?? '6:12';
      const ventFactors: Record<string, number> = { '3:12': 0.5, '4:12': 0.6, '5:12': 0.7, '6:12': 0.8, '7:12': 0.9, '8:12': 1.0 };
      const vf = ventFactors[slope] ?? 0.8;
      const nfaPerLF = 0.5 * vf;
      const totalNFA = len * nfaPerLF;
      const ridgeNeeded = Math.ceil(len);
      return { result: ridgeNeeded, label: 'Ridge Vent Length Needed', unit: 'linear ft', steps: [`NFA per linear ft (${slope}): ${nfaPerLF.toFixed(2)} sq ft`, `Total NFA: ${len} × ${nfaPerLF.toFixed(2)} = ${totalNFA.toFixed(2)} sq ft`, `Ridge vent: ${ridgeNeeded} linear ft (full ridge length)`] };
    },
    description: 'Determine ridge vent length needed based on roof slope.',
    formula: 'NFA = RidgeLength × VentFactor × 0.5',
    interpretation: 'Most ridge vents provide 12-18 sq in NFA per linear ft. Steeper slopes allow more effective ventilation. Usually install along full ridge length.',
  },
  'ice-dam': {
    schema: z.object({ roofLength: z.string(), eaveOverhang: z.string(), heatCable: z.string() }),
    fields: [
      { name: 'roofLength', label: 'Roof Edge Length (ft)', step: 5, min: 10 },
      { name: 'eaveOverhang', label: 'Eave Overhang (ft)', step: 0.5, min: 1 },
      { name: 'heatCable', label: 'Include Heat Cable?', type: 'select', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
    ],
    compute: (v: Record<string, string>) => {
      const len = n(v.roofLength);
      const oh = n(v.eaveOverhang);
      const hc = v.heatCable === 'yes';
      const linearFt = oh + 2;
      const total = len;
      const membrane = len * linearFt;
      const cable = hc ? Math.round(len * 3.5) : 0;
      return { result: total, label: 'Protection Length', unit: 'linear ft', steps: [`Protection width: ${oh} ft overhang + 2 ft = ${linearFt} ft`, `Membrane needed: ${len} × ${linearFt} = ${membrane} sq ft`, `Heat cable${hc ? `: ~${cable} ft (zig-zag pattern)` : ': not included'}`] };
    },
    description: 'Calculate ice dam protection requirements along roof eaves.',
    formula: 'ProtectionWidth = Overhang + 2; Total = RoofEdgeLength',
    interpretation: 'Ice and water shield required 2 ft inside the exterior wall line. Heat cable recommended in severe climate zones. Check local building code for minimums.',
  },
  'roofing-metal': {
    schema: z.object({ roofArea: z.string(), panelWidth: z.string(), panelLength: z.string() }),
    fields: [
      { name: 'roofArea', label: 'Roof Area (sq ft)', step: 100, min: 100 },
      { name: 'panelWidth', label: 'Panel Width (inches)', step: 6, min: 12, placeholder: '36' },
      { name: 'panelLength', label: 'Panel Length (ft)', step: 2, min: 6, placeholder: '12' },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.roofArea);
      const pw = n(v.panelWidth) || 36;
      const pl = n(v.panelLength) || 12;
      const panelSqFt = (pw / 12) * pl;
      const panels = Math.ceil(area / panelSqFt);
      const waste = Math.ceil(panels * 0.1);
      return { result: panels + waste, label: 'Total Panels Needed', unit: 'panels', steps: [`Panel coverage: ${pw}\" × ${pl}' = ${panelSqFt.toFixed(2)} sq ft`, `Panels: ${Math.round(area)} / ${panelSqFt.toFixed(2)} = ${panels}`, `Adding 10% waste: ${waste}`, `Total: ${panels + waste} panels`] };
    },
    description: 'Estimate number of metal roofing panels needed for a roof.',
    formula: 'Panels = Ceil(RoofArea / (PanelWidth/12 × PanelLength))',
    interpretation: 'Add 10-15% for waste, flashing, and ridge caps. Standing seam panels cover 12-24" actual width. Exposed fastener panels cover 24-42" actual width.',
  },
}