import { z } from 'zod'
import type { CalcDef } from './types'

function n(v: string | undefined): number { const x = parseFloat(v ?? ''); return isNaN(x) ? 0 : x }

export const calcDefsGroup1: Record<string, CalcDef> = {
'stucco-calculator': {
    schema: z.object({ wallArea: z.string(), numCoats: z.string() }),
    fields: [
      { name: 'wallArea', label: 'Wall Area (sq ft)', step: 1, min: 0 },
      { name: 'numCoats', label: 'Number of Coats', step: 1, min: 1, placeholder: '3' },
    ],
    compute: (v: Record<string, string>) => {
      const coats = n(v.numCoats || '3')
      const mixBags = Math.ceil(n(v.wallArea) * coats / 80)
      return { result: mixBags, label: 'Stucco Mix Bags (80 lb)', unit: 'bags', steps: [`Area: ${n(v.wallArea)} sq ft × ${coats} coats = ${(n(v.wallArea) * coats).toFixed(0)} sq ft total`, `Each 80 lb bag covers ~80 sq ft per coat`, `Bags: ~${mixBags}`] }
    },
    description: 'Estimate stucco materials for exterior walls.',
    formula: 'Bags = ⌈Area × Coats / 80⌉',
    interpretation: 'Traditional 3-coat stucco: scratch, brown, and finish coat. Each 80 lb bag covers ~80 sq ft per coat.',
  },

  'plaster-calculator': {
    schema: z.object({ wallArea: z.string(), plasterThickness: z.string() }),
    fields: [
      { name: 'wallArea', label: 'Wall Area (sq ft)', step: 1, min: 0 },
      { name: 'plasterThickness', label: 'Plaster Thickness (in)', placeholder: '0.5', step: 0.125, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const thick = (n(v.plasterThickness || '0.5')) / 12
      const volCF = n(v.wallArea) * thick
      const bags = Math.ceil(volCF / 0.5)
      return { result: bags, label: 'Plaster Bags (50 lb)', unit: 'bags', steps: [`Volume: ${n(v.wallArea)} sq ft × ${(n(v.plasterThickness || '0.5'))} in = ${volCF.toFixed(2)} ft³`, `Each 50 lb bag covers ~0.5 ft³`, `Bags: ~${bags}`] }
    },
    description: 'Estimate plaster needed for interior walls.',
    formula: 'Bags = ⌈(Area × Thickness/12) / 0.5⌉',
    interpretation: 'Gypsum plaster for interior use. Veneer plaster requires less material than traditional 3-coat work.',
  },

  'concrete-slab-calculator': {
    schema: z.object({ slabLength: z.string(), slabWidth: z.string(), slabThickness: z.string() }),
    fields: [
      { name: 'slabLength', label: 'Slab Length (ft)', step: 0.1, min: 0 },
      { name: 'slabWidth', label: 'Slab Width (ft)', step: 0.1, min: 0 },
      { name: 'slabThickness', label: 'Slab Thickness (in)', placeholder: '4', step: 0.5, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const thickFt = n(v.slabThickness || '4') / 12
      const volCF = n(v.slabLength) * n(v.slabWidth) * thickFt
      const volCY = volCF / 27
      return { result: volCY, label: 'Concrete Needed', unit: 'cubic yd', steps: [`Slab dimensions: ${n(v.slabLength)} × ${n(v.slabWidth)} × ${n(v.slabThickness || '4')} in`, `Volume: ${volCF.toFixed(2)} ft³`, `Concrete: ${volCY.toFixed(3)} yd³ (order ${Math.ceil(volCY * 1.1)} yd³ with waste)`] }
    },
    description: 'Estimate concrete volume for a slab.',
    formula: 'yd³ = (Length × Width × Thickness/12) / 27',
    interpretation: 'Add 10% for waste and uneven subgrade. 4" slab: standard for residential. 6" for garage/light commercial.',
  },

  'asphalt-calculator': {
    schema: z.object({ drivewayLength: z.string(), drivewayWidth: z.string(), asphaltDepth: z.string() }),
    fields: [
      { name: 'drivewayLength', label: 'Driveway Length (ft)', step: 0.1, min: 0 },
      { name: 'drivewayWidth', label: 'Driveway Width (ft)', step: 0.1, min: 0 },
      { name: 'asphaltDepth', label: 'Asphalt Depth (in)', placeholder: '3', step: 0.5, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const depthFt = n(v.asphaltDepth || '3') / 12
      const volCF = n(v.drivewayLength) * n(v.drivewayWidth) * depthFt
      const tons = volCF * 0.145
      return { result: tons, label: 'Asphalt Needed', unit: 'tons', steps: [`Volume: ${n(v.drivewayLength)} × ${n(v.drivewayWidth)} × ${(n(v.asphaltDepth || '3') / 12).toFixed(3)} ft = ${volCF.toFixed(2)} ft³`, `Asphalt density: ~145 lb/ft³`, `Weight: ${(volCF * 145).toFixed(0)} lb = ${tons.toFixed(2)} tons`] }
    },
    description: 'Estimate asphalt tonnage for a driveway or parking area.',
    formula: 'Tons = (L × W × D/12) × 145 / 2000',
    interpretation: 'Standard asphalt density: 145 lb/ft³. Residential: 2-3" depth. Commercial: 3-4" + 2" base. Add 5% for compaction.',
  },

  'gravel-driveway-calculator': {
    schema: z.object({ drivewayLength: z.string(), drivewayWidth: z.string(), gravelDepth: z.string() }),
    fields: [
      { name: 'drivewayLength', label: 'Driveway Length (ft)', step: 0.1, min: 0 },
      { name: 'drivewayWidth', label: 'Driveway Width (ft)', step: 0.1, min: 0 },
      { name: 'gravelDepth', label: 'Gravel Depth (in)', placeholder: '4', step: 0.5, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const depthFt = n(v.gravelDepth || '4') / 12
      const volCF = n(v.drivewayLength) * n(v.drivewayWidth) * depthFt
      const volCY = volCF / 27
      const tons = volCY * 1.4
      return { result: tons, label: 'Gravel Needed', unit: 'tons', steps: [`Volume: ${volCF.toFixed(2)} ft³ = ${volCY.toFixed(2)} yd³`, `Gravel density: ~1.4 tons/yd³`, `Total: ${tons.toFixed(2)} tons (order ${Math.ceil(tons)} tons)`] }
    },
    description: 'Estimate gravel tonnage for a driveway base.',
    formula: 'Tons = (L × W × D/12) / 27 × 1.4',
    interpretation: 'Base layer of 4-6" of crushed stone (#57 or #2). Top with 2-3" of #57 or pea gravel. Compact in layers.',
  },

  'sand-calculator': {
    schema: z.object({ area: z.string(), depth: z.string() }),
    fields: [
      { name: 'area', label: 'Area (sq ft)', step: 1, min: 0 },
      { name: 'depth', label: 'Depth (in)', step: 0.5, min: 0, placeholder: '2' },
    ],
    compute: (v: Record<string, string>) => {
      const depthFt = n(v.depth || '2') / 12
      const volCF = n(v.area) * depthFt
      const tons = volCF * 0.1
      return { result: tons, label: 'Sand Needed', unit: 'tons', steps: [`Volume: ${n(v.area)} sq ft × ${(n(v.depth || '2') / 12).toFixed(3)} ft = ${volCF.toFixed(2)} ft³`, `Sand: ~100 lb/ft³`, `Weight: ${(volCF * 100).toFixed(0)} lb = ${tons.toFixed(2)} tons`] }
    },
    description: 'Estimate sand tonnage for bedding or filling.',
    formula: 'Tons = (Area × Depth/12) × 100 / 2000',
    interpretation: 'Sand weighs ~100 lb/ft³. Use for paver bedding, mortar mix, or playground fill. Compacted volume is ~15% less.',
  },

  'topsoil-calculator': {
    schema: z.object({ gardenArea: z.string(), soilDepth: z.string() }),
    fields: [
      { name: 'gardenArea', label: 'Garden Area (sq ft)', step: 1, min: 0 },
      { name: 'soilDepth', label: 'Soil Depth (in)', step: 0.5, min: 0, placeholder: '6' },
    ],
    compute: (v: Record<string, string>) => {
      const depthFt = n(v.soilDepth || '6') / 12
      const volCF = n(v.gardenArea) * depthFt
      const volCY = volCF / 27
      return { result: volCY, label: 'Topsoil Needed', unit: 'cubic yd', steps: [`Volume: ${n(v.gardenArea)} sq ft × ${(n(v.soilDepth || '6') / 12).toFixed(2)} ft = ${volCF.toFixed(2)} ft³`, `Cubic yards: ${volCY.toFixed(2)} yd³`] }
    },
    description: 'Estimate topsoil volume for gardens and beds.',
    formula: 'yd³ = (Area × Depth/12) / 27',
    interpretation: 'Topsoil is sold by the cubic yard. A cubic yard covers ~54 sq ft at 6" deep. Add 10% for settling.',
  },

  'compost-calculator': {
    schema: z.object({ bedArea: z.string(), compostDepth: z.string() }),
    fields: [
      { name: 'bedArea', label: 'Bed Area (sq ft)', step: 1, min: 0 },
      { name: 'compostDepth', label: 'Compost Depth (in)', placeholder: '2', step: 0.5, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const depthFt = n(v.compostDepth || '2') / 12
      const volCF = n(v.bedArea) * depthFt
      const volCY = volCF / 27
      const bags = Math.ceil(volCF / 1)
      return { result: volCY, label: 'Compost Needed', unit: 'cubic yd', steps: [`Volume: ${volCF.toFixed(2)} ft³ = ${volCY.toFixed(3)} yd³`, `Or ~${bags} bags (1 ft³ each)`] }
    },
    description: 'Estimate compost volume for garden beds.',
    formula: 'yd³ = (Area × Depth/12) / 27',
    interpretation: 'Apply 1-3" of compost annually. Bagged compost is typically 1 ft³ per bag. Bulk is by the cubic yard.',
  },

  'landscaping-rock-calculator': {
    schema: z.object({ landscapeArea: z.string(), rockDepth: z.string() }),
    fields: [
      { name: 'landscapeArea', label: 'Area (sq ft)', step: 1, min: 0 },
      { name: 'rockDepth', label: 'Rock Depth (in)', placeholder: '3', step: 0.5, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const depthFt = n(v.rockDepth || '3') / 12
      const volCF = n(v.landscapeArea) * depthFt
      const tons = volCF * 0.075
      return { result: tons, label: 'Landscaping Rock Needed', unit: 'tons', steps: [`Volume: ${volCF.toFixed(2)} ft³`, `Rock: ~1.5 tons per 20 ft³ (varies by type)`, `Est. ${tons.toFixed(2)} tons`] }
    },
    description: 'Estimate landscaping rock tonnage.',
    formula: 'Tons = (Area × Depth/12) × 90 / 2000',
    interpretation: 'Rock coverage varies by size: 1/2" rock covers more than 3" rock. ~90 lb/ft³ for most decorative rock.',
  },

  'paver-calculator': {
    schema: z.object({ areaLength: z.string(), areaWidth: z.string(), paverLength: z.string(), paverWidth: z.string() }),
    fields: [
      { name: 'areaLength', label: 'Area Length (ft)', step: 0.1, min: 0 },
      { name: 'areaWidth', label: 'Area Width (ft)', step: 0.1, min: 0 },
      { name: 'paverLength', label: 'Paver Length (in)', placeholder: '8', step: 0.5, min: 0 },
      { name: 'paverWidth', label: 'Paver Width (in)', placeholder: '4', step: 0.5, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const areaSqIn = n(v.areaLength) * n(v.areaWidth) * 144
      const pl = n(v.paverLength || '8')
      const pw = n(v.paverWidth || '4')
      const paverAreaSqIn = pl * pw
      const pavers = Math.ceil(areaSqIn / paverAreaSqIn)
      return { result: pavers, label: 'Pavers Needed', unit: 'pavers', steps: [`Area: ${n(v.areaLength)} × ${n(v.areaWidth)} = ${(n(v.areaLength) * n(v.areaWidth)).toFixed(1)} sq ft = ${areaSqIn.toFixed(0)} sq in`, `Paver: ${pl} × ${pw} in = ${paverAreaSqIn} sq in`, `Pavers: ~${pavers} (add 5-10% for cuts)`] }
    },
    description: 'Estimate paver quantity for patios, walkways, and driveways.',
    formula: 'Pavers = ⌈(Area ft² × 144) / (Paver L × Paver W in)⌉',
    interpretation: 'Add 5% for simple patterns, 10% for herringbone or diagonal. Do not forget edge restraints and base material.',
  },

  'retaining-wall-calculator': {
    schema: z.object({ wallLength: z.string(), wallHeight: z.string(), blockHeight: z.string() }),
    fields: [
      { name: 'wallLength', label: 'Wall Length (ft)', step: 0.1, min: 0 },
      { name: 'wallHeight', label: 'Wall Height (ft)', step: 0.1, min: 0 },
      { name: 'blockHeight', label: 'Block Height (in)', placeholder: '8', step: 0.5, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const faceArea = n(v.wallLength) * n(v.wallHeight)
      const bh = (n(v.blockHeight || '8')) / 12
      const blocksPerRow = Math.ceil(n(v.wallLength) / 1.5)
      const rows = Math.ceil(n(v.wallHeight) / bh)
      const totalBlocks = blocksPerRow * rows
      return { result: totalBlocks, label: 'Retaining Wall Blocks', unit: 'blocks', steps: [`Face area: ${faceArea.toFixed(1)} sq ft`, `Blocks per row: ⌈${n(v.wallLength)} / 1.5⌉ = ${blocksPerRow}`, `Rows: ⌈${n(v.wallHeight)} / ${bh.toFixed(2)}⌉ = ${rows}`, `Total blocks: ${blocksPerRow} × ${rows} = ${totalBlocks}`] }
    },
    description: 'Estimate blocks for a retaining wall.',
    formula: 'Blocks = ⌈L / 1.5⌉ × ⌈H / (Block H/12)⌉',
    interpretation: 'Standard segmental block size: ~18" × 8". Walls over 4 ft require geogrid reinforcement. Drainage gravel required behind wall.',
  },

  'garden-bed-calculator': {
    schema: z.object({ bedLength: z.string(), bedWidth: z.string(), bedDepth: z.string() }),
    fields: [
      { name: 'bedLength', label: 'Bed Length (ft)', step: 0.1, min: 0 },
      { name: 'bedWidth', label: 'Bed Width (ft)', step: 0.1, min: 0 },
      { name: 'bedDepth', label: 'Bed Depth (ft)', step: 0.1, min: 0, placeholder: '1' },
    ],
    compute: (v: Record<string, string>) => {
      const volCF = n(v.bedLength) * n(v.bedWidth) * (n(v.bedDepth || '1'))
      const volCY = volCF / 27
      return { result: volCY, label: 'Garden Bed Soil Volume', unit: 'cubic yd', steps: [`Bed dimensions: ${n(v.bedLength)} × ${n(v.bedWidth)} × ${n(v.bedDepth || '1')} ft`, `Volume: ${volCF.toFixed(2)} ft³ = ${volCY.toFixed(3)} yd³`] }
    },
    description: 'Estimate soil volume for raised garden beds.',
    formula: 'yd³ = (Length × Width × Depth) / 27',
    interpretation: 'For raised beds, use a mix of 60% topsoil, 30% compost, 10% perlite or vermiculite for optimal drainage.',
  },

  'sod-calculator': {
    schema: z.object({ lawnLength: z.string(), lawnWidth: z.string() }),
    fields: [
      { name: 'lawnLength', label: 'Lawn Length (ft)', step: 0.1, min: 0 },
      { name: 'lawnWidth', label: 'Lawn Width (ft)', step: 0.1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.lawnLength) * n(v.lawnWidth)
      const rolls = Math.ceil(area / 10)
      return { result: rolls, label: 'Sod Rolls Needed', unit: 'rolls', steps: [`Lawn area: ${area.toFixed(1)} sq ft`, `Each roll: ~10 sq ft (varies by supplier)`, `Rolls needed: ~${rolls}`] }
    },
    description: 'Estimate sod rolls for a lawn.',
    formula: 'Rolls = ⌈Area / 10⌉',
    interpretation: 'Sod is sold by the roll (typically ~10 sq ft) or by the pallet (~450-500 sq ft). Install within 24 hours of delivery.',
  },

  'septic-tank-calculator': {
    schema: z.object({ bedrooms: z.string(), tankSize: z.string() }),
    fields: [
      { name: 'bedrooms', label: 'Number of Bedrooms', step: 1, min: 1, placeholder: '3' },
      { name: 'tankSize', label: 'Tank Size to Check (gal)', placeholder: '1000', step: 50, min: 500 },
    ],
    compute: (v: Record<string, string>) => {
      const beds = n(v.bedrooms || '3')
      const needed = Math.max(1000, beds * 250 + 250)
      const proposed = n(v.tankSize || '1000')
      const adequate = proposed >= needed
      return { result: needed, label: 'Minimum Tank Size Required', unit: 'gallons', steps: [`Based on ${beds} bedrooms: ${beds} × 250 + 250 = ${needed} gal minimum`, `Proposed tank: ${proposed} gal — ${adequate ? 'ADEQUATE' : 'UNDERSIZED — increase tank size'}`, `Standard sizes: 1000, 1250, 1500, 2000 gal`] }
    },
    description: 'Determine minimum septic tank size per code.',
    formula: 'Min Tank = max(1000, Bedrooms × 250 + 250)',
    interpretation: 'IRC requires minimum 1000 gal for a single-family dwelling. Add 250 gal per additional bedroom over 3.',
  },

  'pool-volume-calculator': {
    schema: z.object({ poolLength: z.string(), poolWidth: z.string(), avgDepth: z.string(), poolShape: z.string() }),
    fields: [
      { name: 'poolLength', label: 'Pool Length (ft)', step: 0.1, min: 0 },
      { name: 'poolWidth', label: 'Pool Width (ft)', step: 0.1, min: 0 },
      { name: 'avgDepth', label: 'Average Depth (ft)', step: 0.1, min: 0 },
      { name: 'poolShape', label: 'Pool Shape', type: 'select', options: [{ label: 'Rectangular', value: 'rect' }, { label: 'Round', value: 'round' }, { label: 'Oval', value: 'oval' }] },
    ],
    compute: (v: Record<string, string>) => {
      const shape = v.poolShape || 'rect'
      let volCF = 0
      if (shape === 'round') volCF = Math.PI * (n(v.poolWidth) / 2) ** 2 * n(v.avgDepth)
      else if (shape === 'oval') volCF = Math.PI * (n(v.poolLength) / 2) * (n(v.poolWidth) / 2) * n(v.avgDepth)
      else volCF = n(v.poolLength) * n(v.poolWidth) * n(v.avgDepth)
      const gallons = volCF * 7.481
      return { result: gallons, label: 'Pool Volume', unit: 'gallons', steps: [`Volume: ${volCF.toFixed(2)} ft³`, `Water: ${volCF.toFixed(2)} × 7.481 = ${gallons.toFixed(0)} gallons`] }
    },
    description: 'Calculate pool water volume in gallons.',
    formula: 'Rect: L×W×D×7.481 | Round: π×R²×D×7.481 | Oval: π×(L/2)×(W/2)×D×7.481',
    interpretation: '1 cubic foot = 7.481 gallons. For irregular pools, divide into sections and sum. Add 10% for spa/hot tub.',
  },

  'generator-sizing-calculator': {
    schema: z.object({ essentialLoads: z.string(), hvacLoad: z.string(), safetyFactor: z.string() }),
    fields: [
      { name: 'essentialLoads', label: 'Essential Lights & Outlets (W)', step: 100, min: 0, placeholder: '2000' },
      { name: 'hvacLoad', label: 'HVAC System (W)', step: 100, min: 0, placeholder: '3500' },
      { name: 'safetyFactor', label: 'Safety Factor (%)', placeholder: '20', step: 5, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const total = n(v.essentialLoads || '2000') + n(v.hvacLoad || '3500')
      const sf = n(v.safetyFactor || '20') / 100
      const genSize = total * (1 + sf)
      return { result: genSize, label: 'Minimum Generator Size', unit: 'watts', steps: [`Essential loads: ${n(v.essentialLoads || '2000')} W`, `HVAC: ${n(v.hvacLoad || '3500')} W`, `Subtotal: ${total.toFixed(0)} W`, `Safety factor (${n(v.safetyFactor || '20')}%): +${(total * sf).toFixed(0)} W`, `Minimum generator: ${genSize.toFixed(0)} W (${(genSize / 1000).toFixed(1)} kW)`] }
    },
    description: 'Size a backup generator for essential home loads.',
    formula: 'Generator (W) = (Essential + HVAC) × (1 + Safety/100)',
    interpretation: 'Startup surge for motors is 3-7× running watts. Consider a generator rated 20-30% above minimum. Prioritize circuits on a transfer switch.',
  },

  'solar-panel-calculator': {
    schema: z.object({ monthlyKwh: z.string(), panelWattage: z.string(), sunHours: z.string() }),
    fields: [
      { name: 'monthlyKwh', label: 'Monthly Usage (kWh)', step: 10, min: 0, placeholder: '900' },
      { name: 'panelWattage', label: 'Panel Wattage (W)', placeholder: '400', step: 10, min: 100 },
      { name: 'sunHours', label: 'Peak Sun Hours/Day', placeholder: '5', step: 0.5, min: 1 },
    ],
    compute: (v: Record<string, string>) => {
      const dailyKwh = (n(v.monthlyKwh || '900')) / 30
      const panelW = n(v.panelWattage || '400')
      const sun = n(v.sunHours || '5')
      const panelsNeeded = Math.ceil((dailyKwh * 1000) / (panelW * sun * 0.77))
      const systemKw = panelsNeeded * panelW / 1000
      return { result: panelsNeeded, label: 'Solar Panels Needed', unit: 'panels', steps: [`Daily usage: ${n(v.monthlyKwh || '900')} kWh/month ÷ 30 = ${dailyKwh.toFixed(2)} kWh/day`, `Each ${panelW}W panel produces: ${(panelW * sun * 0.77 / 1000).toFixed(2)} kWh/day (× ${sun} sun hrs × 0.77 system loss)`, `Panels: ⌈${(dailyKwh * 1000).toFixed(0)} / ${(panelW * sun * 0.77).toFixed(0)}⌉ = ${panelsNeeded}`, `System size: ${systemKw.toFixed(2)} kW`] }
    },
    description: 'Estimate solar panel count and system size.',
    formula: 'Panels = ⌈(Monthly kWh / 30 × 1000) / (Panel W × Sun Hrs × 0.77)⌉',
    interpretation: 'Assumes 23% system losses (inverter, wiring, temperature). Adjust peak sun hours by location (~3-6 hrs in US).',
  },

  'hvac-load-calculator': {
    schema: z.object({ floorArea: z.string(), ceilingHeight: z.string(), insulation: z.string(), windows: z.string() }),
    fields: [
      { name: 'floorArea', label: 'Floor Area (sq ft)', step: 10, min: 0 },
      { name: 'ceilingHeight', label: 'Ceiling Height (ft)', placeholder: '8', step: 0.5, min: 0 },
      { name: 'insulation', label: 'Insulation Level', type: 'select', options: [{ label: 'Poor', value: 'poor' }, { label: 'Average', value: 'avg' }, { label: 'Good', value: 'good' }] },
      { name: 'windows', label: 'Number of Windows', step: 1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const volume = n(v.floorArea) * (n(v.ceilingHeight || '8'))
      const btuPerSqFt = v.insulation === 'poor' ? 35 : v.insulation === 'good' ? 20 : 25
      const windowBtu = n(v.windows || '0') * 600
      const totalBtu = n(v.floorArea) * btuPerSqFt + windowBtu
      const tons = totalBtu / 12000
      return { result: totalBtu, label: 'Cooling Load', unit: 'BTU/hr', steps: [`Volume: ${n(v.floorArea)} sq ft × ${n(v.ceilingHeight || '8')} ft = ${volume.toFixed(0)} ft³`, `Base load: ${n(v.floorArea)} × ${btuPerSqFt} = ${(n(v.floorArea) * btuPerSqFt).toFixed(0)} BTU/hr`, `Windows: ${n(v.windows || '0')} × 600 = ${(n(v.windows || '0') * 600).toFixed(0)} BTU/hr`, `Total: ${totalBtu.toFixed(0)} BTU/hr = ${tons.toFixed(2)} tons`] }
    },
    description: 'Estimate HVAC cooling load for sizing AC systems.',
    formula: 'BTU/hr = Area × Factor + Windows × 600 | Tons = BTU / 12000',
    interpretation: 'Rule of thumb: 1 ton per 400-600 sq ft. This is a rough estimate — Manual J calculation is recommended for accurate sizing.',
  },

  'duct-sizing-calculator': {
    schema: z.object({ cfm: z.string(), ductType: z.string(), maxVelocity: z.string() }),
    fields: [
      { name: 'cfm', label: 'Airflow (CFM)', step: 10, min: 0, placeholder: '400' },
      { name: 'ductType', label: 'Duct Type', type: 'select', options: [{ label: 'Round', value: 'round' }, { label: 'Rectangular', value: 'rect' }] },
      { name: 'maxVelocity', label: 'Max Velocity (fpm)', placeholder: '900', step: 50, min: 300 },
    ],
    compute: (v: Record<string, string>) => {
      const cfm = n(v.cfm || '400')
      const vel = n(v.maxVelocity || '900')
      const areaSqFt = cfm / vel
      const areaSqIn = areaSqFt * 144
      const roundDia = Math.ceil(Math.sqrt(areaSqIn / Math.PI) * 2)
      return { result: roundDia, label: 'Round Duct Diameter', unit: 'inches', steps: [`Required area: ${cfm} / ${vel} = ${areaSqFt.toFixed(4)} sq ft = ${areaSqIn.toFixed(2)} sq in`, `Round diameter: ${roundDia} in (nearest inch)`, `Rectangular: e.g., ${Math.ceil(areaSqIn / 8)} × 8 in or ${Math.ceil(areaSqIn / 10)} × 10 in`] }
    },
    description: 'Size HVAC ductwork for desired airflow.',
    formula: 'D = 2 × √(CFM / (Velocity × 144 / π)) | Rect: A = CFM / Velocity',
    interpretation: 'Main trunks: 700-900 fpm. Branch runs: 400-600 fpm. Flex duct: reduce by 20% capacity vs rigid.',
  },

  'stairs-stringer-calculator': {
    schema: z.object({ totalRise: z.string(), desiredRise: z.string(), treadRun: z.string() }),
    fields: [
      { name: 'totalRise', label: 'Total Rise (in)', step: 0.125, min: 0 },
      { name: 'desiredRise', label: 'Desired Rise per Step (in)', placeholder: '7', step: 0.125, min: 0 },
      { name: 'treadRun', label: 'Tread Run (in)', placeholder: '11', step: 0.125, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const steps = Math.round(n(v.totalRise) / (n(v.desiredRise || '7')))
      const actualRise = n(v.totalRise) / steps
      const totalRun = steps * (n(v.treadRun || '11'))
      const stringerLen = Math.sqrt(n(v.totalRise) ** 2 + totalRun ** 2)
      return { result: steps, label: 'Number of Steps', unit: 'steps', steps: [`Steps: ${n(v.totalRise).toFixed(1)}" / ${n(v.desiredRise || '7')}" ≈ ${steps}`, `Actual rise per step: ${actualRise.toFixed(2)} in`, `Total run: ${steps} × ${n(v.treadRun || '11')}" = ${totalRun.toFixed(1)} in = ${(totalRun / 12).toFixed(1)} ft`, `Stringer length: ${stringerLen.toFixed(1)} in = ${(stringerLen / 12).toFixed(1)} ft`] }
    },
    description: 'Calculate stair stringer layout and step dimensions.',
    formula: 'Steps = round(Rise / Desired Rise) | Stringer = √(Rise² + Run²)',
    interpretation: 'Ideal: 7" rise, 11" run. Building code max rise: 7.75", min run: 10". 2×12 lumber typical for stringers.',
  },

  'handrail-calculator': {
    schema: z.object({ stairLength: z.string(), stairAngle: z.string() }),
    fields: [
      { name: 'stairLength', label: 'Stair Length (ft)', step: 0.1, min: 0 },
      { name: 'stairAngle', label: 'Stair Angle (degrees)', step: 1, min: 0, placeholder: '35' },
    ],
    compute: (v: Record<string, string>) => {
      const angleRad = (n(v.stairAngle || '35')) * Math.PI / 180
      const railLen = n(v.stairLength) / Math.cos(angleRad)
      return { result: railLen, label: 'Handrail Length', unit: 'ft', steps: [`Stair run: ${n(v.stairLength)} ft`, `Angle: ${n(v.stairAngle || '35')}°`, `Rail length: ${n(v.stairLength)} / cos(${n(v.stairAngle || '35')}°) = ${railLen.toFixed(2)} ft`] }
    },
    description: 'Calculate handrail length along stairs.',
    formula: 'Rail Length = Run / cos(Angle)',
    interpretation: 'Handrail must be 34-38" above stair nosing. Extend 12" beyond top and bottom riser per code. Brackets every 4 ft max.',
  },

  'ramp-calculator': {
    schema: z.object({ rampRise: z.string(), maxSlope: z.string() }),
    fields: [
      { name: 'rampRise', label: 'Vertical Rise (in)', step: 0.5, min: 0 },
      { name: 'maxSlope', label: 'Max Slope (rise:run)', type: 'select', options: [{ label: '1:12 (ADA)', value: '12' }, { label: '1:16 (gentle)', value: '16' }, { label: '1:20 (very gentle)', value: '20' }] },
    ],
    compute: (v: Record<string, string>) => {
      const slope = n(v.maxSlope || '12')
      const runInches = n(v.rampRise) * slope
      const runFeet = runInches / 12
      return { result: runFeet, label: 'Minimum Ramp Length', unit: 'ft', steps: [`Rise: ${n(v.rampRise)} in`, `Slope: 1:${slope.toFixed(0)}`, `Run: ${n(v.rampRise)} × ${slope.toFixed(0)} = ${runInches} in = ${runFeet.toFixed(1)} ft`] }
    },
    description: 'Calculate wheelchair ramp length per ADA.',
    formula: 'Run (ft) = Rise (in) × Slope Ratio / 12',
    interpretation: 'ADA maximum slope: 1:12 (8.33%). Landings required every 30 ft of horizontal run. Minimum width: 36".',
  },

  'concrete-mix-calculator': {
    schema: z.object({ volumeConcrete: z.string(), mixRatio: z.string() }),
    fields: [
      { name: 'volumeConcrete', label: 'Desired Concrete Volume (ft³)', step: 0.5, min: 0 },
      { name: 'mixRatio', label: 'Mix Ratio (cement:sand:gravel)', type: 'select', options: [{ label: '1:2:3 (standard)', value: '1:2:3' }, { label: '1:2.5:3.5 (structural)', value: '1:2.5:3.5' }, { label: '1:3:3 (foundation)', value: '1:3:3' }] },
    ],
    compute: (v: Record<string, string>) => {
      const parts = (v.mixRatio || '1:2:3').split(':').map(Number)
      const totalParts = parts.reduce((a: number, b: number) => a + b, 0)
      const cement = (n(v.volumeConcrete) * parts[0] / totalParts) * 94
      const sand = n(v.volumeConcrete) * parts[1] / totalParts
      const gravel = n(v.volumeConcrete) * parts[2] / totalParts
      return { result: cement, label: 'Cement Needed', unit: 'lb', steps: [`Mix: ${v.mixRatio} (${totalParts} total parts)`, `Cement: ${(n(v.volumeConcrete) * parts[0] / totalParts).toFixed(2)} ft³ × 94 lb/ft³ = ${cement.toFixed(0)} lb`, `Sand: ${sand.toFixed(2)} ft³`, `Gravel: ${gravel.toFixed(2)} ft³`] }
    },
    description: 'Calculate concrete mix proportions for a given volume.',
    formula: 'Cement = Vol × (C / Total) × 94 | Sand/Gravel = Vol × (S or G / Total)',
    interpretation: 'Standard 1:2:3 mix yields ~3000 psi. Water ratio ~0.5 by weight. One 94 lb bag cement = 1 ft³.',
  },

  'mortar-mix-calculator': {
    schema: z.object({ brickCount: z.string(), mortarType: z.string() }),
    fields: [
      { name: 'brickCount', label: 'Number of Bricks', step: 100, min: 0 },
      { name: 'mortarType', label: 'Mortar Type', type: 'select', options: [{ label: 'Type N (general)', value: 'N' }, { label: 'Type S (structural)', value: 'S' }, { label: 'Type M (heavy)', value: 'M' }] },
    ],
    compute: (v: Record<string, string>) => {
      const mortarPerBrick = 0.02
      const volCF = n(v.brickCount) * mortarPerBrick
      const bags = Math.ceil(volCF / 0.75)
      return { result: bags, label: 'Mortar Mix Bags (60 lb)', unit: 'bags', steps: [`Bricks: ${n(v.brickCount)}`, `Each brick requires ~${(mortarPerBrick * 1728).toFixed(1)} in³ of mortar`, `Total mortar: ${volCF.toFixed(2)} ft³`, `Each 60 lb bag yields ~0.75 ft³`, `Bags: ~${bags}`] }
    },
    description: 'Estimate mortar mix bags for brick/block walls.',
    formula: 'Bags = ⌈Bricks × 0.02 ft³ / 0.75⌉',
    interpretation: 'Type N: general purpose. Type S: below-grade/structural. Type M: heavy loads. Add 10% for waste.',
  },

  'wood-volume-calculator': {
    schema: z.object({ length: z.string(), width: z.string(), thickness: z.string(), quantity: z.string() }),
    fields: [
      { name: 'length', label: 'Length (ft)', step: 0.1, min: 0 },
      { name: 'width', label: 'Width (in)', step: 0.5, min: 0 },
      { name: 'thickness', label: 'Thickness (in)', step: 0.5, min: 0 },
      { name: 'quantity', label: 'Quantity', step: 1, min: 1, placeholder: '1' },
    ],
    compute: (v: Record<string, string>) => {
      const wt = (n(v.width) * n(v.thickness)) / 144
      const bdFt = wt * n(v.length) * n(v.quantity || '1')
      return { result: bdFt, label: 'Total Board Feet', unit: 'bd ft', steps: [`Each piece: ${n(v.width)}" × ${n(v.thickness)}" × ${n(v.length)} ft = ${(wt * n(v.length)).toFixed(3)} bd ft`, `${n(v.quantity || '1')} pieces: ${bdFt.toFixed(2)} bd ft`] }
    },
    description: 'Calculate board feet of lumber.',
    formula: 'Board Feet = (Width" × Thickness" × Length ft) / 144 × Quantity',
    interpretation: 'One board foot = 144 in³. Lumber is sold by the board foot. Nominal vs actual dimensions differ (e.g., 2×4 = 1.5" × 3.5").',
  },

  'plywood-calculator': {
    schema: z.object({ area: z.string(), sheetSize: z.string() }),
    fields: [
      { name: 'area', label: 'Total Area (sq ft)', step: 1, min: 0 },
      { name: 'sheetSize', label: 'Sheet Size', type: 'select', options: [{ label: '4×8 ft (32 sq ft)', value: '32' }, { label: '4×10 ft (40 sq ft)', value: '40' }, { label: '5×5 ft (25 sq ft)', value: '25' }] },
    ],
    compute: (v: Record<string, string>) => {
      const sheetArea = n(v.sheetSize || '32')
      const sheets = Math.ceil(n(v.area) / sheetArea)
      return { result: sheets, label: 'Plywood Sheets Needed', unit: 'sheets', steps: [`Coverage needed: ${n(v.area)} sq ft`, `Each sheet: ${sheetArea} sq ft`, `Sheets: ⌈${n(v.area)} / ${sheetArea}⌉ = ${sheets}`] }
    },
    description: 'Estimate plywood sheets for sheathing, subfloor, or roof decking.',
    formula: 'Sheets = ⌈Area / Sheet Size⌉',
    interpretation: '4×8 standard. 4×10 reduces seams on longer walls. Add 5-10% for waste, especially on roofs with hips and valleys.',
  },

  'shower-tile-calculator': {
    schema: z.object({ showerLength: z.string(), showerWidth: z.string(), showerHeight: z.string(), tileSize: z.string() }),
    fields: [
      { name: 'showerLength', label: 'Shower Length (ft)', step: 0.1, min: 0 },
      { name: 'showerWidth', label: 'Shower Width (ft)', step: 0.1, min: 0 },
      { name: 'showerHeight', label: 'Shower Height (ft)', step: 0.1, min: 0 },
      { name: 'tileSize', label: 'Tile Size', type: 'select', options: [{ label: '4×4 in', value: '16' }, { label: '6×6 in', value: '36' }, { label: '8×8 in', value: '64' }, { label: '12×12 in', value: '144' }, { label: '12×24 in', value: '288' }] },
    ],
    compute: (v: Record<string, string>) => {
      const wallArea = 2 * (n(v.showerLength) + n(v.showerWidth)) * n(v.showerHeight)
      const floorArea = n(v.showerLength) * n(v.showerWidth)
      const totalArea = wallArea + floorArea
      const tileArea = n(v.tileSize || '16') / 144
      const tiles = Math.ceil(totalArea / tileArea * 1.1)
      return { result: tiles, label: 'Tiles Needed', unit: 'tiles', steps: [`Wall area: 2 × (${n(v.showerLength)} + ${n(v.showerWidth)}) × ${n(v.showerHeight)} = ${wallArea.toFixed(1)} sq ft`, `Floor: ${floorArea.toFixed(1)} sq ft`, `Total: ${totalArea.toFixed(1)} sq ft`, `Tile: ${tileArea.toFixed(3)} sq ft each`, `Tiles incl. 10% waste: ~${tiles}`] }
    },
    description: 'Estimate tile count for a shower surround.',
    formula: 'Tiles = ⌈((2×(L+W)×H + L×W) / (Tile/144)) × 1.1⌉',
    interpretation: 'Includes all walls and floor. Add 10% for cuts. Niche, bench, and curb add-ons calculated separately.',
  },

  'vinyl-flooring-calculator': {
    schema: z.object({ roomLength: z.string(), roomWidth: z.string(), plankWidth: z.string() }),
    fields: [
      { name: 'roomLength', label: 'Room Length (ft)', step: 0.1, min: 0 },
      { name: 'roomWidth', label: 'Room Width (ft)', step: 0.1, min: 0 },
      { name: 'plankWidth', label: 'Plank Width (in)', placeholder: '6', step: 0.5, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.roomLength) * n(v.roomWidth)
      const wasteFactor = 0.1
      const total = area * (1 + wasteFactor)
      const boxes = Math.ceil(total / 20)
      return { result: boxes, label: 'Boxes of Vinyl Plank', unit: 'boxes', steps: [`Room area: ${area.toFixed(1)} sq ft`, `Waste (10%): +${(area * wasteFactor).toFixed(1)} sq ft`, `Total: ${total.toFixed(1)} sq ft`, `Each box covers ~20 sq ft`, `Boxes: ~${boxes}`] }
    },
    description: 'Estimate vinyl plank flooring needed.',
    formula: 'Boxes = ⌈(Length × Width × 1.1) / 20⌉',
    interpretation: 'Vinyl planks typically come 20 sq ft per box. Add 10% for waste and pattern matching. Plank width affects waste factor.',
  },

  'pergola-calculator': {
    schema: z.object({ pergolaLength: z.string(), pergolaWidth: z.string(), beamSpacing: z.string() }),
    fields: [
      { name: 'pergolaLength', label: 'Pergola Length (ft)', step: 0.1, min: 0 },
      { name: 'pergolaWidth', label: 'Pergola Width (ft)', step: 0.1, min: 0 },
      { name: 'beamSpacing', label: 'Beam Spacing (in)', placeholder: '24', step: 1, min: 1 },
    ],
    compute: (v: Record<string, string>) => {
      const sp = n(v.beamSpacing || '24') / 12
      const beams = Math.ceil(n(v.pergolaLength) / sp)
      const rafters = Math.ceil(n(v.pergolaWidth) / sp) * n(v.pergolaLength)
      return { result: beams, label: 'Main Beams Needed', unit: 'beams', steps: [`Span: ${n(v.pergolaLength)} ft × ${n(v.pergolaWidth)} ft`, `Beams @ ${n(v.beamSpacing || '24')}" OC: ≈${beams} beams`, `Rafters: ~${rafters} linear ft`, `Posts: 4 (corners) + any intermediate`] }
    },
    description: 'Estimate materials for a pergola structure.',
    formula: 'Beams = ⌈Length / (Spacing/12)⌉ | Rafters = ⌈Width / (Spacing/12)⌉ × Length',
    interpretation: 'Standard pergola: 4×4 or 6×6 posts, 2×8 or 2×10 beams, 2×4 or 2×6 rafters. Check local wind/snow loads.',
  },

  'garage-size-calculator': {
    schema: z.object({ carCount: z.string(), extraDepth: z.string(), extraWidth: z.string() }),
    fields: [
      { name: 'carCount', label: 'Number of Cars', step: 1, min: 1, placeholder: '2' },
      { name: 'extraDepth', label: 'Extra Depth (ft)', placeholder: '2', step: 1, min: 0 },
      { name: 'extraWidth', label: 'Extra Width (ft)', placeholder: '2', step: 1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const cars = n(v.carCount || '2')
      const width = cars * 12 + n(v.extraWidth || '2')
      const depth = 22 + n(v.extraDepth || '2')
      const area = width * depth
      return { result: area, label: 'Recommended Garage Area', unit: 'sq ft', steps: [`Minimum width per car: 12 ft × ${cars} = ${(cars * 12)} ft`, `Recommended width: ${width} ft (with ${n(v.extraWidth || '2')} ft extra)`, `Recommended depth: 22 + ${n(v.extraDepth || '2')} = ${depth} ft`, `Area estimate: ${width} × ${depth} = ${area} sq ft`] }
    },
    description: 'Determine recommended garage dimensions.',
    formula: 'Width = Cars × 12 + Extra | Depth = 22 + Extra | Area = W × D',
    interpretation: 'Standard single: 12×22 ft. Double: 24×22 ft. Add 2-4 ft for workbenches, storage, or larger vehicles.',
  },
}