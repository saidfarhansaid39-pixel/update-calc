import { z } from 'zod'
import type { CalcDef } from './types'

function n(v: string | undefined): number { const x = parseFloat(v ?? ''); return isNaN(x) ? 0 : x }

export const calcDefsGroup0: Record<string, CalcDef> = {
'siding-calculator': {
    schema: z.object({ wallLength: z.string(), wallHeight: z.string(), wasteFactor: z.string() }),
    fields: [
      { name: 'wallLength', label: 'Wall Length (ft)', step: 0.1, min: 0 },
      { name: 'wallHeight', label: 'Wall Height (ft)', step: 0.1, min: 0 },
      { name: 'wasteFactor', label: 'Waste Factor (%)', placeholder: '10', step: 1, min: 0, mode: 'advanced' },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.wallLength) * n(v.wallHeight)
      const waste = n(v.wasteFactor || '10') / 100
      const total = area * (1 + waste)
      return { result: total, label: 'Total Siding Area', unit: 'sq ft', steps: [`Wall area: ${n(v.wallLength)} × ${n(v.wallHeight)} = ${area.toFixed(1)} sq ft`, `Waste (${n(v.wasteFactor || '10')}%): +${(area * waste).toFixed(1)} sq ft`, `Total: ${total.toFixed(1)} sq ft`] }
    },
    description: 'Estimate siding material needed for exterior walls.',
    formula: 'Total = (Length × Height) × (1 + Waste/100)',
    interpretation: 'This gives total siding area including waste. Divide by coverage per unit (typically 100 sq ft per square) to order panels.',
  },

  'drywall-calculator': {
    schema: z.object({ wallLength: z.string(), wallHeight: z.string(), numWalls: z.string() }),
    fields: [
      { name: 'wallLength', label: 'Wall Length (ft)', step: 0.1, min: 0 },
      { name: 'wallHeight', label: 'Ceiling Height (ft)', step: 0.1, min: 0 },
      { name: 'numWalls', label: 'Number of Walls', step: 1, min: 1, placeholder: '4' },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.wallLength) * n(v.wallHeight) * n(v.numWalls)
      const sheets = Math.ceil(area / 32)
      return { result: sheets, label: 'Drywall Sheets Needed', unit: '4×8 sheets', steps: [`Total area: ${n(v.wallLength)} × ${n(v.wallHeight)} × ${n(v.numWalls)} walls = ${area.toFixed(1)} sq ft`, `Each 4×8 sheet covers 32 sq ft`, `Sheets: ${sheets} (rounded up)`] }
    },
    description: 'Estimate the number of drywall sheets for a room.',
    formula: 'Sheets = ⌈(Length × Height × Walls) / 32⌉',
    interpretation: 'Standard 4×8 ft drywall sheets cover 32 sq ft each. Add 10% for waste and cutouts.',
  },

  'paint-calculator': {
    schema: z.object({ wallLength: z.string(), wallHeight: z.string(), numCoats: z.string() }),
    fields: [
      { name: 'wallLength', label: 'Total Wall Length (ft)', step: 0.1, min: 0 },
      { name: 'wallHeight', label: 'Wall Height (ft)', step: 0.1, min: 0 },
      { name: 'numCoats', label: 'Number of Coats', step: 1, min: 1, placeholder: '2' },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.wallLength) * n(v.wallHeight) * n(v.numCoats)
      const gallons = area / 350
      return { result: Math.ceil(gallons * 2) / 2, label: 'Paint Needed', unit: 'gallons', steps: [`Total surface area: ${n(v.wallLength)} × ${n(v.wallHeight)} = ${(n(v.wallLength) * n(v.wallHeight)).toFixed(1)} sq ft`, `Coats: ${n(v.numCoats)}, total: ${area.toFixed(1)} sq ft`, `1 gallon covers ~350 sq ft → ${(area / 350).toFixed(2)} gal`, `Rounded: ${(Math.ceil(gallons * 2) / 2).toFixed(1)} gal`] }
    },
    description: 'Estimate paint gallons needed for interior walls.',
    formula: 'Gallons = ⌈(Length × Height × Coats) / 350 × 2⌉ / 2',
    interpretation: 'One gallon of paint covers approximately 350 sq ft. Result is rounded to the nearest half-gallon.',
  },

  'flooring-calculator': {
    schema: z.object({ roomLength: z.string(), roomWidth: z.string(), wasteFactor: z.string() }),
    fields: [
      { name: 'roomLength', label: 'Room Length (ft)', step: 0.1, min: 0 },
      { name: 'roomWidth', label: 'Room Width (ft)', step: 0.1, min: 0 },
      { name: 'wasteFactor', label: 'Waste Factor (%)', placeholder: '10', step: 1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.roomLength) * n(v.roomWidth)
      const waste = n(v.wasteFactor || '10') / 100
      const total = area * (1 + waste)
      return { result: total, label: 'Flooring Needed', unit: 'sq ft', steps: [`Room area: ${n(v.roomLength)} × ${n(v.roomWidth)} = ${area.toFixed(1)} sq ft`, `Waste (${n(v.wasteFactor || '10')}%): +${(area * waste).toFixed(1)} sq ft`, `Total to order: ${total.toFixed(1)} sq ft`] }
    },
    description: 'Estimate flooring material needed for a room.',
    formula: 'Total = (Length × Width) × (1 + Waste/100)',
    interpretation: 'Includes recommended waste factor for cutting and fitting. Add 5-10% for straight lay, 15% for diagonal or patterned installation.',
  },

  'carpet-calculator': {
    schema: z.object({ roomLength: z.string(), roomWidth: z.string(), wasteFactor: z.string() }),
    fields: [
      { name: 'roomLength', label: 'Room Length (ft)', step: 0.1, min: 0 },
      { name: 'roomWidth', label: 'Room Width (ft)', step: 0.1, min: 0 },
      { name: 'wasteFactor', label: 'Waste Factor (%)', placeholder: '5', step: 1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.roomLength) * n(v.roomWidth)
      const waste = n(v.wasteFactor || '5') / 100
      const total = area * (1 + waste)
      const sqYds = total / 9
      return { result: sqYds, label: 'Carpet Needed', unit: 'sq yd', steps: [`Room area: ${area.toFixed(1)} sq ft`, `Waste (${n(v.wasteFactor || '5')}%): +${(area * waste).toFixed(1)} sq ft`, `Total: ${total.toFixed(1)} sq ft = ${sqYds.toFixed(2)} sq yd`] }
    },
    description: 'Estimate carpet yardage needed for a room.',
    formula: 'sq yd = ⌈(Length × Width × (1 + Waste)) / 9⌉',
    interpretation: 'Carpet is sold by the square yard (9 sq ft = 1 sq yd). Add 5% for waste and pattern matching.',
  },

  'wallpaper-calculator': {
    schema: z.object({ wallLength: z.string(), wallHeight: z.string(), rollCoverage: z.string() }),
    fields: [
      { name: 'wallLength', label: 'Total Wall Length (ft)', step: 0.1, min: 0 },
      { name: 'wallHeight', label: 'Wall Height (ft)', step: 0.1, min: 0 },
      { name: 'rollCoverage', label: 'Roll Coverage (sq ft)', placeholder: '56', step: 1, min: 1 },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.wallLength) * n(v.wallHeight)
      const coverage = n(v.rollCoverage || '56')
      const rolls = Math.ceil(area / coverage)
      return { result: rolls, label: 'Wallpaper Rolls Needed', unit: 'rolls', steps: [`Wall area: ${area.toFixed(1)} sq ft`, `Each roll covers ${coverage} sq ft`, `Rolls needed: ${rolls}`] }
    },
    description: 'Estimate wallpaper rolls for a room.',
    formula: 'Rolls = ⌈(Length × Height) / Roll Coverage⌉',
    interpretation: 'Standard wallpaper rolls cover ~56 sq ft. Add 1-2 rolls for pattern matching waste.',
  },

  'fence-calculator': {
    schema: z.object({ perimeter: z.string(), gateWidth: z.string(), panelWidth: z.string() }),
    fields: [
      { name: 'perimeter', label: 'Property Perimeter (ft)', step: 0.1, min: 0 },
      { name: 'gateWidth', label: 'Gate Width (ft)', step: 0.1, min: 0 },
      { name: 'panelWidth', label: 'Panel Width (ft)', placeholder: '8', step: 0.5, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const fenceLength = n(v.perimeter) - n(v.gateWidth)
      const pw = n(v.panelWidth || '8')
      const panels = Math.ceil(fenceLength / pw)
      return { result: panels, label: 'Fence Panels Needed', unit: 'panels', steps: [`Fence length: ${n(v.perimeter)} - ${n(v.gateWidth)} (gate) = ${fenceLength.toFixed(1)} ft`, `${fenceLength.toFixed(1)} ft ÷ ${pw} ft per panel = ${(fenceLength / pw).toFixed(1)}`, `Panels needed: ${panels}`] }
    },
    description: 'Estimate fence panels and posts needed.',
    formula: 'Panels = ⌈(Perimeter - Gate Width) / Panel Width⌉',
    interpretation: 'Posts needed = panels + 1 (corner posts). Add gate hardware separately.',
  },

  'deck-calculator': {
    schema: z.object({ deckLength: z.string(), deckWidth: z.string(), boardWidth: z.string() }),
    fields: [
      { name: 'deckLength', label: 'Deck Length (ft)', step: 0.1, min: 0 },
      { name: 'deckWidth', label: 'Deck Width (ft)', step: 0.1, min: 0 },
      { name: 'boardWidth', label: 'Deck Board Width (in)', placeholder: '5.5', step: 0.5, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.deckLength) * n(v.deckWidth)
      const bw = (n(v.boardWidth || '5.5')) / 12
      const boardsNeeded = Math.ceil(n(v.deckWidth) / bw) * n(v.deckLength)
      return { result: area, label: 'Deck Area', unit: 'sq ft', steps: [`Deck area: ${n(v.deckLength)} × ${n(v.deckWidth)} = ${area.toFixed(1)} sq ft`, `Board width: ${n(v.boardWidth || '5.5')} in = ${bw.toFixed(3)} ft`, `Approx. ${boardsNeeded} linear ft of decking`] }
    },
    description: 'Estimate deck materials including area and board count.',
    formula: 'Area = Length × Width | Boards = Width / Board Width × Length',
    interpretation: 'Additional materials: joists (16" OC), beams, posts, hardware, and fasteners. Add 10% for waste.',
  },

  'patio-calculator': {
    schema: z.object({ patioLength: z.string(), patioWidth: z.string(), paverSize: z.string() }),
    fields: [
      { name: 'patioLength', label: 'Patio Length (ft)', step: 0.1, min: 0 },
      { name: 'patioWidth', label: 'Patio Width (ft)', step: 0.1, min: 0 },
      { name: 'paverSize', label: 'Paver Size (sq in)', placeholder: '36', step: 1, min: 1 },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.patioLength) * n(v.patioWidth)
      const paverSqIn = n(v.paverSize || '36')
      const pavers = Math.ceil((area * 144) / paverSqIn)
      return { result: pavers, label: 'Pavers Needed', unit: 'pavers', steps: [`Patio area: ${area.toFixed(1)} sq ft = ${(area * 144).toFixed(0)} sq in`, `Each paver: ${paverSqIn} sq in`, `Pavers: ~${pavers}`] }
    },
    description: 'Estimate number of pavers needed for a patio.',
    formula: 'Pavers = ⌈(Length × Width × 144) / Paver Area⌉',
    interpretation: 'Add 5-10% for cuts and breakage. Includes base material (gravel + sand) needed separately.',
  },

  'driveway-calculator': {
    schema: z.object({ drivewayLength: z.string(), drivewayWidth: z.string(), thickness: z.string() }),
    fields: [
      { name: 'drivewayLength', label: 'Driveway Length (ft)', step: 0.1, min: 0 },
      { name: 'drivewayWidth', label: 'Driveway Width (ft)', step: 0.1, min: 0 },
      { name: 'thickness', label: 'Thickness (in)', placeholder: '4', step: 0.5, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.drivewayLength) * n(v.drivewayWidth)
      const thickFt = n(v.thickness || '4') / 12
      const volCF = area * thickFt
      const volCY = volCF / 27
      return { result: volCY, label: 'Concrete Volume', unit: 'cubic yd', steps: [`Area: ${area.toFixed(1)} sq ft`, `Thickness: ${n(v.thickness || '4')} in = ${thickFt.toFixed(3)} ft`, `Volume: ${volCF.toFixed(2)} ft³ = ${volCY.toFixed(2)} yd³`] }
    },
    description: 'Estimate concrete volume for a driveway slab.',
    formula: 'Volume (yd³) = (Length × Width × Thickness) / 324',
    interpretation: 'Thickness in inches. Divide by 12 to get feet, then by 27 for cubic yards. Standard driveway: 4-6 inches thick.',
  },

  'brick-calculator': {
    schema: z.object({ wallLength: z.string(), wallHeight: z.string(), mortarJoint: z.string() }),
    fields: [
      { name: 'wallLength', label: 'Wall Length (ft)', step: 0.1, min: 0 },
      { name: 'wallHeight', label: 'Wall Height (ft)', step: 0.1, min: 0 },
      { name: 'mortarJoint', label: 'Mortar Joint (in)', placeholder: '0.375', step: 0.125, min: 0, mode: 'advanced' },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.wallLength) * n(v.wallHeight)
      const joint = n(v.mortarJoint || '0.375')
      const brickHeight = (2.25 + joint) / 12
      const brickLength = (7.5 + joint) / 12
      const bricks = Math.ceil(area / (brickHeight * brickLength))
      return { result: bricks, label: 'Bricks Needed', unit: 'bricks', steps: [`Wall area: ${area.toFixed(1)} sq ft`, `Each brick (incl. ${joint} in joint) covers ${(brickHeight * brickLength).toFixed(4)} sq ft`, `Bricks needed: ~${bricks}`] }
    },
    description: 'Estimate number of modular bricks for a wall.',
    formula: 'Bricks = ⌈Area / ((2.25 + Joint) × (7.5 + Joint) / 144)⌉',
    interpretation: 'Based on standard modular brick (7.5 × 2.25 in face). Add 5% for waste. Includes mortar joint thickness.',
  },

  'block-calculator': {
    schema: z.object({ wallLength: z.string(), wallHeight: z.string() }),
    fields: [
      { name: 'wallLength', label: 'Wall Length (ft)', step: 0.1, min: 0 },
      { name: 'wallHeight', label: 'Wall Height (ft)', step: 0.1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.wallLength) * n(v.wallHeight)
      const blocks = Math.ceil(area / 1.125)
      return { result: blocks, label: 'Concrete Blocks Needed', unit: '8×16 blocks', steps: [`Wall area: ${area.toFixed(1)} sq ft`, `Standard block covers 1.125 sq ft (including mortar)`, `Blocks: ~${blocks}`] }
    },
    description: 'Estimate 8×16 concrete blocks for a wall.',
    formula: 'Blocks = ⌈(Length × Height) / 1.125⌉',
    interpretation: 'Standard 8×16 CMU block covers 1.125 sq ft with 3/8" mortar joint. Add 5% for waste and lintels.',
  },

  'rebar-calculator': {
    schema: z.object({ slabLength: z.string(), slabWidth: z.string(), spacing: z.string() }),
    fields: [
      { name: 'slabLength', label: 'Slab Length (ft)', step: 0.1, min: 0 },
      { name: 'slabWidth', label: 'Slab Width (ft)', step: 0.1, min: 0 },
      { name: 'spacing', label: 'Rebar Spacing (in)', placeholder: '12', step: 1, min: 1 },
    ],
    compute: (v: Record<string, string>) => {
      const sp = n(v.spacing || '12') / 12
      const lenBars = Math.ceil(n(v.slabWidth) / sp) * n(v.slabLength)
      const widBars = Math.ceil(n(v.slabLength) / sp) * n(v.slabWidth)
      const totalLF = lenBars + widBars
      return { result: totalLF, label: 'Total Rebar Length', unit: 'linear ft', steps: [`Longitudinal bars: ⌈${n(v.slabWidth)} / ${sp.toFixed(1)}⌉ × ${n(v.slabLength).toFixed(1)} = ${lenBars.toFixed(0)} ft`, `Transverse bars: ⌈${n(v.slabLength)} / ${sp.toFixed(1)}⌉ × ${n(v.slabWidth).toFixed(1)} = ${widBars.toFixed(0)} ft`, `Total: ${totalLF.toFixed(0)} ft`] }
    },
    description: 'Estimate rebar length needed for a concrete slab.',
    formula: 'Total LF = (⌈Width/Spacing⌉ × Length) + (⌈Length/Spacing⌉ × Width)',
    interpretation: 'Assumes a standard grid pattern. Add 6" lap splice at each joint for #4 bars. Adjust spacing for code requirements.',
  },

  'foundation-calculator': {
    schema: z.object({ footingLength: z.string(), footingWidth: z.string(), footingDepth: z.string() }),
    fields: [
      { name: 'footingLength', label: 'Footing Length (ft)', step: 0.1, min: 0 },
      { name: 'footingWidth', label: 'Footing Width (ft)', step: 0.1, min: 0 },
      { name: 'footingDepth', label: 'Footing Depth (ft)', step: 0.1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const volCF = n(v.footingLength) * n(v.footingWidth) * n(v.footingDepth)
      const volCY = volCF / 27
      return { result: volCY, label: 'Foundation Concrete', unit: 'cubic yd', steps: [`Footing dimensions: ${n(v.footingLength)} × ${n(v.footingWidth)} × ${n(v.footingDepth)} ft`, `Volume: ${volCF.toFixed(2)} ft³ = ${volCY.toFixed(2)} yd³`] }
    },
    description: 'Estimate concrete volume for strip footings.',
    formula: 'Volume (yd³) = (Length × Width × Depth) / 27',
    interpretation: 'For continuous footings. Add 10% for waste and uneven excavation. Verify soil bearing capacity before pouring.',
  },

  'column-calculator': {
    schema: z.object({ columnHeight: z.string(), columnDiameter: z.string() }),
    fields: [
      { name: 'columnHeight', label: 'Column Height (ft)', step: 0.1, min: 0 },
      { name: 'columnDiameter', label: 'Column Diameter (in)', step: 0.5, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const h = n(v.columnHeight)
      const r = n(v.columnDiameter) / 24
      const volCF = Math.PI * r * r * h
      const volCY = volCF / 27
      return { result: volCY, label: 'Column Concrete Volume', unit: 'cubic yd', steps: [`Radius: ${n(v.columnDiameter)} in / 2 = ${(n(v.columnDiameter) / 2).toFixed(1)} in = ${r.toFixed(3)} ft`, `Volume: π × ${r.toFixed(3)}² × ${h.toFixed(1)} = ${volCF.toFixed(3)} ft³`, `Concrete: ${volCY.toFixed(3)} yd³`] }
    },
    description: 'Estimate concrete volume for round columns.',
    formula: 'Volume = π × (Diameter/24)² × Height | yd³ = ft³ / 27',
    interpretation: 'For round concrete columns/piles. Use cased or uncased based on soil conditions. Add 5% for over-excavation.',
  },

  'beam-calculator': {
    schema: z.object({ beamLength: z.string(), beamWidth: z.string(), beamDepth: z.string() }),
    fields: [
      { name: 'beamLength', label: 'Beam Length (ft)', step: 0.1, min: 0 },
      { name: 'beamWidth', label: 'Beam Width (in)', step: 0.5, min: 0 },
      { name: 'beamDepth', label: 'Beam Depth (in)', step: 0.5, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const w = n(v.beamWidth) / 12
      const d = n(v.beamDepth) / 12
      const volCF = n(v.beamLength) * w * d
      const volCY = volCF / 27
      return { result: volCY, label: 'Beam Concrete Volume', unit: 'cubic yd', steps: [`Beam section: ${n(v.beamWidth)} × ${n(v.beamDepth)} in = ${w.toFixed(3)} × ${d.toFixed(3)} ft`, `Volume: ${n(v.beamLength)} × ${w.toFixed(3)} × ${d.toFixed(3)} = ${volCF.toFixed(3)} ft³`, `Concrete: ${volCY.toFixed(3)} yd³`] }
    },
    description: 'Estimate concrete volume for rectangular beams.',
    formula: 'Volume (yd³) = (Length × Width/12 × Depth/12) / 27',
    interpretation: 'For tie beams, grade beams, and lintels. Stirrup and main reinforcement calculated separately.',
  },

  'floor-joist-calculator': {
    schema: z.object({ span: z.string(), spacing: z.string(), roomLength: z.string() }),
    fields: [
      { name: 'span', label: 'Joist Span (ft)', step: 0.1, min: 0 },
      { name: 'spacing', label: 'Spacing (in)', placeholder: '16', step: 1, min: 1 },
      { name: 'roomLength', label: 'Room Length (ft)', step: 0.1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const sp = n(v.spacing || '16') / 12
      const joists = Math.ceil(n(v.roomLength) / sp) + 1
      const totalLF = joists * n(v.span)
      return { result: joists, label: 'Joists Needed', unit: 'joists', steps: [`Joist spacing: ${n(v.spacing || '16')} in = ${sp.toFixed(2)} ft`, `Number of joists: ⌈${n(v.roomLength)} / ${sp.toFixed(2)}⌉ + 1 = ${joists}`, `Total lumber: ${joists} × ${n(v.span)} ft = ${totalLF.toFixed(0)} linear ft`] }
    },
    description: 'Estimate floor joist quantity and lumber needed.',
    formula: 'Joists = ⌈Room Length / (Spacing/12)⌉ + 1',
    interpretation: 'Add 1 for the starting joist. Includes standard 16" or 24" OC spacing. Verify span ratings for your lumber grade.',
  },

  'roof-truss-calculator': {
    schema: z.object({ buildingWidth: z.string(), roofPitch: z.string(), trussSpacing: z.string() }),
    fields: [
      { name: 'buildingWidth', label: 'Building Width (ft)', step: 0.1, min: 0 },
      { name: 'roofPitch', label: 'Roof Pitch (rise/12)', step: 0.5, min: 0, placeholder: '6' },
      { name: 'trussSpacing', label: 'Truss Spacing (in)', placeholder: '24', step: 1, min: 1 },
    ],
    compute: (v: Record<string, string>) => {
      const pitch = n(v.roofPitch || '6')
      const sp = n(v.trussSpacing || '24') / 12
      const span = n(v.buildingWidth)
      const raftLen = Math.sqrt((span / 2) ** 2 + ((span / 2) * pitch / 12) ** 2) * 2
      return { result: raftLen, label: 'Rafter Length per Truss', unit: 'ft', steps: [`Half-span: ${(span / 2).toFixed(1)} ft`, `Rise: ${(span / 2 * pitch / 12).toFixed(2)} ft`, `Rafter: √(${(span / 2).toFixed(1)}² + ${(span / 2 * pitch / 12).toFixed(2)}²) × 2 = ${raftLen.toFixed(2)} ft`] }
    },
    description: 'Estimate roof truss count and rafter length.',
    formula: 'Rafter = 2 × √((W/2)² + (W/2 × Pitch/12)²)',
    interpretation: 'Pitch is rise per 12" of run. Trusses are typically spaced 24" OC. Verify with a structural engineer for your snow/wind loads.',
  },

  'rafter-calculator': {
    schema: z.object({ buildingWidth: z.string(), roofPitch: z.string(), overhang: z.string() }),
    fields: [
      { name: 'buildingWidth', label: 'Building Width (ft)', step: 0.1, min: 0 },
      { name: 'roofPitch', label: 'Roof Pitch (rise/12)', step: 0.5, min: 0, placeholder: '6' },
      { name: 'overhang', label: 'Overhang (ft)', step: 0.1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const span = n(v.buildingWidth)
      const pitch = n(v.roofPitch || '6')
      const over = n(v.overhang || '0')
      const run = span / 2 + over
      const rise = run * pitch / 12
      const rafterLen = Math.sqrt(run * run + rise * rise)
      return { result: rafterLen, label: 'Rafter Length', unit: 'ft', steps: [`Total run: ${span / 2} + ${over} (overhang) = ${run.toFixed(2)} ft`, `Rise: ${run.toFixed(2)} × ${pitch}/12 = ${rise.toFixed(2)} ft`, `Rafter: √(${run.toFixed(2)}² + ${rise.toFixed(2)}²) = ${rafterLen.toFixed(2)} ft`] }
    },
    description: 'Calculate rafter length for a gable roof.',
    formula: 'Rafter = √((W/2 + Overhang)² + ((W/2 + Overhang) × Pitch/12)²)',
    interpretation: 'Does not include ridge board thickness or birdsmouth cut. Add 12-18" for ridge overhang if needed.',
  },

  'gutter-calculator': {
    schema: z.object({ roofLength: z.string(), roofWidth: z.string(), numDownspouts: z.string() }),
    fields: [
      { name: 'roofLength', label: 'Roof Edge Length (ft)', step: 0.1, min: 0 },
      { name: 'roofWidth', label: 'Building Width (ft)', step: 0.1, min: 0 },
      { name: 'numDownspouts', label: 'Number of Downspouts', step: 1, min: 1, placeholder: '2' },
    ],
    compute: (v: Record<string, string>) => {
      const gutterLF = n(v.roofLength) * 2
      const downspouts = n(v.numDownspouts || '2')
      return { result: gutterLF, label: 'Gutter Length Needed', unit: 'linear ft', steps: [`Gutter along ${n(v.roofLength)} ft edge × 2 sides = ${gutterLF} ft`, `Downspouts: ${downspouts}`, `Accessories: ${downspouts} elbows, ${downspouts} outlets, ${gutterLF} ft of hangers`] }
    },
    description: 'Estimate gutter and downspout materials.',
    formula: 'Gutter Length = Roof Edge × 2 | Downspouts = 1 per 40 ft of gutter',
    interpretation: 'Standard K-style gutters in 5" or 6". Downspouts every 30-40 ft. Add miters for corners.',
  },

  'soffit-calculator': {
    schema: z.object({ buildingLength: z.string(), buildingWidth: z.string(), overhang: z.string() }),
    fields: [
      { name: 'buildingLength', label: 'Building Length (ft)', step: 0.1, min: 0 },
      { name: 'buildingWidth', label: 'Building Width (ft)', step: 0.1, min: 0 },
      { name: 'overhang', label: 'Eave Overhang (ft)', step: 0.1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const over = n(v.overhang || '0')
      const perimeter = 2 * (n(v.buildingLength) + n(v.buildingWidth))
      const area = perimeter * over
      return { result: area, label: 'Soffit Area', unit: 'sq ft', steps: [`Perimeter: 2 × (${n(v.buildingLength)} + ${n(v.buildingWidth)}) = ${perimeter} ft`, `Soffit area: ${perimeter} × ${over} = ${area.toFixed(1)} sq ft`] }
    },
    description: 'Estimate soffit material for eaves.',
    formula: 'Soffit Area = 2 × (L + W) × Overhang',
    interpretation: 'Vented soffit panels are recommended at 1 sq ft of vent per 150 sq ft of attic space.',
  },

  'insulation-calculator': {
    schema: z.object({ wallArea: z.string(), rValue: z.string(), existingR: z.string() }),
    fields: [
      { name: 'wallArea', label: 'Wall Area (sq ft)', step: 1, min: 0 },
      { name: 'rValue', label: 'Insulation R-Value', step: 1, min: 1, placeholder: '19' },
      { name: 'existingR', label: 'Existing R-Value', step: 1, min: 0, placeholder: '0' },
    ],
    compute: (v: Record<string, string>) => {
      const r = n(v.rValue || '19')
      const existing = n(v.existingR || '0')
      const bags = Math.ceil(n(v.wallArea) / (r * 0.8))
      const rGain = r - existing
      return { result: rGain, label: 'R-Value Increase', unit: `R-${rGain.toFixed(0)}`, steps: [`Desired R-${r.toFixed(0)} - Existing R-${existing.toFixed(0)} = ${rGain.toFixed(0)} gain`, `Approx. ${bags} bags blown-in for ${n(v.wallArea)} sq ft at R-${r.toFixed(0)}`] }
    },
    description: 'Estimate insulation needed for walls or attic.',
    formula: 'R-Gain = New R-Value - Existing R-Value',
    interpretation: 'Recommended attic R-values: R-49 (cold), R-38 (mixed), R-30 (warm). Wall R-values: R-13 to R-21.',
  },

  'ventilation-calculator': {
    schema: z.object({ atticArea: z.string(), ventType: z.string() }),
    fields: [
      { name: 'atticArea', label: 'Attic Floor Area (sq ft)', step: 1, min: 0 },
      { name: 'ventType', label: 'Vent Type', type: 'select', options: [{ label: 'Standard (1:150)', value: '150' }, { label: 'Balanced (1:300)', value: '300' }] },
    ],
    compute: (v: Record<string, string>) => {
      const ratio = n(v.ventType || '150')
      const netFreeArea = n(v.atticArea) / ratio
      const soffitNeeded = netFreeArea / 2
      return { result: netFreeArea, label: 'Net Free Vent Area Needed', unit: 'sq ft', steps: [`Attic area: ${n(v.atticArea)} sq ft`, `Ratio: 1:${ratio.toFixed(0)}`, `Total NFA: ${n(v.atticArea)} / ${ratio.toFixed(0)} = ${netFreeArea.toFixed(2)} sq ft`, `Soffit vents (50%): ${soffitNeeded.toFixed(2)} sq ft | Ridge vents (50%): ${soffitNeeded.toFixed(2)} sq ft`] }
    },
    description: 'Calculate attic ventilation requirements per IRC.',
    formula: 'NFA = Attic Area / Ratio | 50% intake (soffit), 50% exhaust (ridge)',
    interpretation: 'IRC requires 1:150 or 1:300 ratio depending on vapor barrier. 50% at soffit (intake), 50% at ridge (exhaust).',
  },

  'window-calculator': {
    schema: z.object({ windowWidth: z.string(), windowHeight: z.string(), numWindows: z.string() }),
    fields: [
      { name: 'windowWidth', label: 'Window Width (ft)', step: 0.1, min: 0 },
      { name: 'windowHeight', label: 'Window Height (ft)', step: 0.1, min: 0 },
      { name: 'numWindows', label: 'Number of Windows', step: 1, min: 1, placeholder: '1' },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.windowWidth) * n(v.windowHeight) * n(v.numWindows)
      return { result: area, label: 'Total Window Area', unit: 'sq ft', steps: [`Each window: ${n(v.windowWidth)} × ${n(v.windowHeight)} = ${(n(v.windowWidth) * n(v.windowHeight)).toFixed(1)} sq ft`, `${n(v.numWindows)} windows: ${area.toFixed(1)} sq ft`] }
    },
    description: 'Calculate total window area for ordering or glazing calculations.',
    formula: 'Total Area = Width × Height × Quantity',
    interpretation: 'Window sizes are nominal. Verify rough opening dimensions before ordering. Add 1/2" to each dimension for shim space.',
  },

  'door-calculator': {
    schema: z.object({ doorWidth: z.string(), doorHeight: z.string(), numDoors: z.string() }),
    fields: [
      { name: 'doorWidth', label: 'Door Width (ft)', step: 0.1, min: 0 },
      { name: 'doorHeight', label: 'Door Height (ft)', step: 0.1, min: 0 },
      { name: 'numDoors', label: 'Number of Doors', step: 1, min: 1, placeholder: '1' },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.doorWidth) * n(v.doorHeight) * n(v.numDoors)
      return { result: area, label: 'Total Door Area', unit: 'sq ft', steps: [`Each door: ${n(v.doorWidth)} × ${n(v.doorHeight)} = ${(n(v.doorWidth) * n(v.doorHeight)).toFixed(1)} sq ft`, `${n(v.numDoors)} doors: ${area.toFixed(1)} sq ft`] }
    },
    description: 'Calculate total door area for ordering or painting.',
    formula: 'Total Area = Width × Height × Quantity',
    interpretation: 'Standard interior doors: 2\'8" × 6\'8". Standard exterior: 3\'0" × 6\'8". Rough opening is typically 2" wider and 2" taller.',
  },

  'cabinet-calculator': {
    schema: z.object({ wallLength: z.string(), cabinetDepth: z.string(), cabinetHeight: z.string() }),
    fields: [
      { name: 'wallLength', label: 'Wall Length (ft)', step: 0.1, min: 0 },
      { name: 'cabinetDepth', label: 'Cabinet Depth (ft)', placeholder: '2', step: 0.1, min: 0 },
      { name: 'cabinetHeight', label: 'Cabinet Height (ft)', placeholder: '3', step: 0.1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.wallLength) * (n(v.cabinetDepth || '2')) * (n(v.cabinetHeight || '3'))
      return { result: area, label: 'Cabinet Volume', unit: 'cubic ft', steps: [`Wall coverage: ${n(v.wallLength)} ft`, `Depth: ${n(v.cabinetDepth || '2')} ft × Height: ${n(v.cabinetHeight || '3')} ft`, `Volume: ${area.toFixed(1)} ft³`] }
    },
    description: 'Estimate cabinet storage volume.',
    formula: 'Volume = Wall Length × Depth × Height',
    interpretation: 'Base cabinets: 24" deep × 34-36" tall. Wall cabinets: 12" deep × 30-42" tall. Standard uppers cover 40-50% of wall length.',
  },

  'countertop-calculator': {
    schema: z.object({ counterLength: z.string(), counterWidth: z.string(), backsplashHeight: z.string() }),
    fields: [
      { name: 'counterLength', label: 'Counter Length (ft)', step: 0.1, min: 0 },
      { name: 'counterWidth', label: 'Counter Width (ft)', placeholder: '2', step: 0.1, min: 0 },
      { name: 'backsplashHeight', label: 'Backsplash Height (in)', placeholder: '4', step: 0.5, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const counterArea = n(v.counterLength) * (n(v.counterWidth || '2'))
      const backsplashArea = n(v.counterLength) * (n(v.backsplashHeight || '4') / 12)
      const total = counterArea + backsplashArea
      return { result: total, label: 'Total Countertop Area', unit: 'sq ft', steps: [`Counter area: ${n(v.counterLength)} × ${n(v.counterWidth || '2')} = ${counterArea.toFixed(1)} sq ft`, `Backsplash: ${n(v.counterLength)} × ${(n(v.backsplashHeight || '4') / 12).toFixed(2)} = ${backsplashArea.toFixed(2)} sq ft`, `Total: ${total.toFixed(2)} sq ft`] }
    },
    description: 'Estimate countertop area including backsplash.',
    formula: 'Total = (Length × Width) + (Length × Backsplash/12)',
    interpretation: 'Standard counter depth is 25.5" (countertop) or 24" (base cabinet). Add 10% for waste on stone/quartz templates.',
  },

  'backsplash-calculator': {
    schema: z.object({ backsplashLength: z.string(), backsplashHeight: z.string() }),
    fields: [
      { name: 'backsplashLength', label: 'Wall Length (ft)', step: 0.1, min: 0 },
      { name: 'backsplashHeight', label: 'Backsplash Height (in)', placeholder: '18', step: 0.5, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.backsplashLength) * (n(v.backsplashHeight || '18') / 12)
      return { result: area, label: 'Backsplash Area', unit: 'sq ft', steps: [`Length: ${n(v.backsplashLength)} ft`, `Height: ${n(v.backsplashHeight || '18')} in = ${(n(v.backsplashHeight || '18') / 12).toFixed(2)} ft`, `Area: ${area.toFixed(2)} sq ft`] }
    },
    description: 'Estimate backsplash tile area.',
    formula: 'Area = Length × (Height in / 12)',
    interpretation: 'Standard backsplash height is 18" above counter. Add 10-15% for tile cuts and pattern matching.',
  },

  'baseboard-calculator': {
    schema: z.object({ roomLength: z.string(), roomWidth: z.string(), doorWidth: z.string() }),
    fields: [
      { name: 'roomLength', label: 'Room Length (ft)', step: 0.1, min: 0 },
      { name: 'roomWidth', label: 'Room Width (ft)', step: 0.1, min: 0 },
      { name: 'doorWidth', label: 'Doorway Width (ft)', placeholder: '3', step: 0.1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const perimeter = 2 * (n(v.roomLength) + n(v.roomWidth))
      const doors = n(v.doorWidth || '3')
      const net = perimeter - doors
      const pieces = Math.ceil(net / 12)
      return { result: net, label: 'Baseboard Needed', unit: 'linear ft', steps: [`Room perimeter: 2 × (${n(v.roomLength)} + ${n(v.roomWidth)}) = ${perimeter} ft`, `Subtract doorway: -${doors} ft`, `Net: ${net.toFixed(1)} ft = ${pieces} pieces (12 ft each)`] }
    },
    description: 'Estimate baseboard molding needed for a room.',
    formula: 'Baseboard ft = 2 × (L + W) - Door Widths',
    interpretation: 'Standard baseboard is 3-5" tall, sold in 12-16 ft lengths. Subtract door widths that have casing to the floor.',
  },

  'crown-molding-calculator': {
    schema: z.object({ roomPerimeter: z.string(), corners: z.string(), wasteFactor: z.string() }),
    fields: [
      { name: 'roomPerimeter', label: 'Room Perimeter (ft)', step: 0.1, min: 0 },
      { name: 'corners', label: 'Number of Corners', step: 1, min: 0, placeholder: '4' },
      { name: 'wasteFactor', label: 'Waste Factor (%)', placeholder: '10', step: 1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const waste = n(v.wasteFactor || '10') / 100
      const total = n(v.roomPerimeter) * (1 + waste)
      const corners = n(v.corners || '4')
      return { result: total, label: 'Crown Molding Needed', unit: 'linear ft', steps: [`Perimeter: ${n(v.roomPerimeter)} ft`, `Waste (${n(v.wasteFactor || '10')}%): +${(n(v.roomPerimeter) * waste).toFixed(1)} ft`, `Total: ${total.toFixed(1)} ft | ${corners} inside/outside corners to cut`] }
    },
    description: 'Estimate crown molding with corner count.',
    formula: 'Total = Perimeter × (1 + Waste/100)',
    interpretation: 'Crown molding requires miter cuts at corners. Inside corners are coped, outside corners are mitered at 45°.',
  },
}