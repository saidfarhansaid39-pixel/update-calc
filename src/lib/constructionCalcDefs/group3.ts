import { z } from 'zod'
import type { CalcDef } from './types'

function n(v: string | undefined): number { const x = parseFloat(v ?? ''); return isNaN(x) ? 0 : x }

export const calcDefsGroup3: Record<string, CalcDef> = {
'roofing-shingle': {
    schema: z.object({ roofArea: z.string(), shingleType: z.string() }),
    fields: [
      { name: 'roofArea', label: 'Roof Area (sq ft)', step: 100, min: 100 },
      { name: 'shingleType', label: 'Shingle Type', type: 'select', options: [{ label: '3-Tab', value: '3-tab' }, { label: 'Architectural', value: 'architectural' }, { label: 'Luxury', value: 'luxury' }] },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.roofArea);
      const st = v.shingleType ?? '3-tab';
      const coverage: Record<string, number> = { '3-tab': 33.33, architectural: 33.33, luxury: 20 };
      const cpg = coverage[st] ?? 33.33;
      const bundles = Math.ceil(area / cpg);
      const squares = area / 100;
      const waste = st === '3-tab' ? 5 : st === 'architectural' ? 10 : 15;
      const total = Math.ceil(bundles * (1 + waste / 100));
      return { result: total, label: 'Shingle Bundles Needed', unit: 'bundles', steps: [`Roof area: ${Math.round(area)} sq ft (${squares.toFixed(1)} squares)`, `${st} covers ${cpg} sq ft per bundle`, `Base bundles: ${Math.round(area)} / ${cpg} = ${bundles}`, `Adding ${waste}% waste: ${total} bundles`] };
    },
    description: 'Estimate number of asphalt shingle bundles needed for a roof.',
    formula: 'Bundles = Ceil(RoofArea / CoveragePerBundle); Add 5-15% waste',
    interpretation: '3-tab and architectural cover ~33.3 sq ft per bundle (3 bundles per square). Luxury cover ~20 sq ft per bundle (5 bundles per square). Include ridge caps and starter strips.',
  },
  'roofing-tile': {
    schema: z.object({ roofArea: z.string(), tileType: z.string() }),
    fields: [
      { name: 'roofArea', label: 'Roof Area (sq ft)', step: 100, min: 100 },
      { name: 'tileType', label: 'Tile Type', type: 'select', options: [{ label: 'Concrete', value: 'concrete' }, { label: 'Clay', value: 'clay' }, { label: 'Slate', value: 'slate' }] },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.roofArea);
      const tt = v.tileType ?? 'concrete';
      const tpsf: Record<string, number> = { concrete: 9, clay: 11, slate: 10 };
      const tpsfVal = tpsf[tt] ?? 9;
      const tiles = Math.ceil(area * tpsfVal);
      const waste = Math.ceil(tiles * 0.05);
      return { result: tiles + waste, label: 'Tiles Needed', unit: 'tiles', steps: [`${tt}: ${tpsfVal} tiles per sq ft`, `Base: ${Math.round(area)} × ${tpsfVal} = ${tiles} tiles`, `Adding 5% waste: ${waste}`, `Total: ${tiles + waste} tiles`] };
    },
    description: 'Estimate number of roof tiles needed including waste.',
    formula: 'Tiles = Ceil(RoofArea × TilesPerSqFt) × 1.05',
    interpretation: 'Concrete tiles ~9/sq ft, clay ~11/sq ft, slate ~10/sq ft. Add 5% breakage/waste. Also need ridge tiles, hip tiles, and underlayment.',
  },
  'roofing-flat': {
    schema: z.object({ roofArea: z.string(), material: z.string() }),
    fields: [
      { name: 'roofArea', label: 'Roof Area (sq ft)', step: 100, min: 100 },
      { name: 'material', label: 'Material', type: 'select', options: [{ label: 'Modified Bitumen', value: 'modified-bitumen' }, { label: 'EPDM', value: 'EPDM' }, { label: 'TPO', value: 'TPO' }, { label: 'PVC', value: 'PVC' }] },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.roofArea);
      const mat = v.material ?? 'EPDM';
      const rc: Record<string, number> = { 'modified-bitumen': 100, EPDM: 100, TPO: 100, PVC: 100 };
      const rollCover = rc[mat] ?? 100;
      const rolls = Math.ceil(area / rollCover);
      const lap = area * 0.05;
      return { result: rolls, label: 'Rolls Needed', unit: 'rolls', steps: [`Coverage per roll (${mat}): ${rollCover} sq ft`, `Base rolls: ${Math.round(area)} / ${rollCover} = ${rolls}`, `Include lap/trim allowance: +${Math.round(lap)} sq ft`, `Total: ${rolls} rolls`] };
    },
    description: 'Estimate number of membrane rolls needed for a flat roof.',
    formula: 'Rolls = Ceil(RoofArea / RollCoverage)',
    interpretation: 'Standard rolls cover 100 sq ft. EPDM comes in wider sheets reducing seams. TPO/PVC require heat welding. Add 5-10% for laps, flashings, and waste.',
  },

  'siding-aluminum': {
    schema: z.object({ wallLength: z.string(), wallHeight: z.string(), wasteFactor: z.string() }),
    fields: [
      { name: 'wallLength', label: 'Wall Length', step: 0.1, min: 0, placeholder: '40' },
      { name: 'wallHeight', label: 'Wall Height', step: 0.1, min: 0, placeholder: '10' },
      { name: 'wasteFactor', label: 'Waste Factor', step: 0.5, min: 0, placeholder: '10', mode: 'advanced' },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.wallLength) * n(v.wallHeight);
      const waste = area * n(v.wasteFactor) / 100;
      return { result: Math.ceil(area + waste), label: 'Siding Area', unit: 'sq ft', steps: [`Area = ${n(v.wallLength)} × ${n(v.wallHeight)} = ${area} sq ft`, `Waste = ${area} × ${n(v.wasteFactor)}% = ${waste.toFixed(1)} sq ft`, `Total = ${area} + ${waste.toFixed(1)} = ${Math.ceil(area + waste)} sq ft`, 'Aluminum siding: use galvanized nails, overlap 1"', 'Allow for trim, J-channel, and soffit separately'] }
    },
    description: 'Calculates aluminum siding material needs including waste.',
    formula: '(L × H) × (1 + waste/100)',
    interpretation: 'Order this many square feet of aluminum siding panels; add 5% for trim waste.',
  },
  'siding-brick': {
    schema: z.object({ wallLength: z.string(), wallHeight: z.string() }),
    fields: [
      { name: 'wallLength', label: 'Wall Length', step: 0.1, min: 0, placeholder: '40' },
      { name: 'wallHeight', label: 'Wall Height', step: 0.1, min: 0, placeholder: '8' },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.wallLength) * n(v.wallHeight);
      const bricks = Math.ceil(area * 7);
      return { result: bricks, label: 'Bricks Needed', unit: 'bricks', steps: [`Area = ${n(v.wallLength)} × ${n(v.wallHeight)} = ${area} sq ft`, `Bricks = ${area} × 7 bricks/sq ft = ${bricks}`] }
    },
    description: 'Calculates brick count for brick veneer siding at 7 bricks per sq ft.',
    formula: 'L × H × 7',
    interpretation: 'Order this many standard modular bricks; add 5% for waste and cuts.',
  },
  'siding-fiber-cement': {
    schema: z.object({ wallLength: z.string(), wallHeight: z.string(), wasteFactor: z.string() }),
    fields: [
      { name: 'wallLength', label: 'Wall Length', step: 0.1, min: 0, placeholder: '40' },
      { name: 'wallHeight', label: 'Wall Height', step: 0.1, min: 0, placeholder: '10' },
      { name: 'wasteFactor', label: 'Waste Factor', step: 0.5, min: 0, placeholder: '10', mode: 'advanced' },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.wallLength) * n(v.wallHeight);
      const overlap = area * 1.1;
      const waste = overlap * n(v.wasteFactor) / 100;
      return { result: Math.ceil(overlap + waste), label: 'Fiber Cement Siding', unit: 'sq ft', steps: [`Area = ${n(v.wallLength)} × ${n(v.wallHeight)} = ${area} sq ft`, `With 10% lap overlap = ${area} × 1.1 = ${overlap.toFixed(1)} sq ft`, `Waste = ${overlap.toFixed(1)} × ${n(v.wasteFactor)}% = ${waste.toFixed(1)} sq ft`, `Total = ${Math.ceil(overlap + waste)} sq ft`] }
    },
    description: 'Calculates fiber cement siding with lap overlap factor.',
    formula: 'L × H × 1.1 × (1 + waste/100)',
    interpretation: 'Fiber cement planks overlap 1-1.25"; use corrosion-resistant fasteners.',
  },
  'siding-vinyl': {
    schema: z.object({ wallLength: z.string(), wallHeight: z.string() }),
    fields: [
      { name: 'wallLength', label: 'Wall Length', step: 0.1, min: 0, placeholder: '40' },
      { name: 'wallHeight', label: 'Wall Height', step: 0.1, min: 0, placeholder: '10' },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.wallLength) * n(v.wallHeight);
      const squares = area / 100;
      return { result: squares, label: 'Siding Squares', unit: 'squares', steps: [`Area = ${n(v.wallLength)} × ${n(v.wallHeight)} = ${area} sq ft`, `Squares = ${area} ÷ 100 = ${squares.toFixed(2)} squares`] }
    },
    description: 'Calculates vinyl siding in squares (100 sq ft units).',
    formula: '(L × H) / 100',
    interpretation: 'Each square covers 100 sq ft; order 1 extra square for starter strips and waste.',
  },
  'siding-wood': {
    schema: z.object({ wallLength: z.string(), wallHeight: z.string(), boardWidth: z.string() }),
    fields: [
      { name: 'wallLength', label: 'Wall Length', step: 0.1, min: 0, placeholder: '40' },
      { name: 'wallHeight', label: 'Wall Height', step: 0.1, min: 0, placeholder: '10' },
      { name: 'boardWidth', label: 'Board Width', step: 0.5, min: 2, placeholder: '6', mode: 'advanced' },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.wallLength) * n(v.wallHeight);
      const bwFt = n(v.boardWidth) / 12;
      const boards = Math.ceil(area / bwFt);
      return { result: boards, label: 'Linear Feet of Boards', unit: 'linear ft', steps: [`Area = ${n(v.wallLength)} × ${n(v.wallHeight)} = ${area} sq ft`, `Board width = ${n(v.boardWidth)} in = ${bwFt.toFixed(3)} ft`, `Linear ft = ceil(${area} ÷ ${bwFt.toFixed(3)}) = ${boards} linear ft`] }
    },
    description: 'Calculates wood siding boards needed based on exposed width.',
    formula: 'ceil((L × H) / (boardWidth/12))',
    interpretation: 'Boards are typically installed with 1" overlap; actual coverage width = boardWidth - 1".',
  },
  'concrete-beam': {
    schema: z.object({ beamLength: z.string(), beamWidth: z.string(), beamDepth: z.string() }),
    fields: [
      { name: 'beamLength', label: 'Beam Length', step: 0.1, min: 0, placeholder: '20' },
      { name: 'beamWidth', label: 'Beam Width', step: 1, min: 4, placeholder: '12' },
      { name: 'beamDepth', label: 'Beam Depth', step: 1, min: 4, placeholder: '24' },
    ],
    compute: (v: Record<string, string>) => {
      const cf = n(v.beamLength) * (n(v.beamWidth) / 12) * (n(v.beamDepth) / 12);
      const cy = cf / 27;
      return { result: Math.ceil(cy * 100) / 100, label: 'Concrete Volume', unit: 'cubic yd', steps: [`Volume CF = ${n(v.beamLength)} × (${n(v.beamWidth)}÷12) × (${n(v.beamDepth)}÷12) = ${cf.toFixed(2)} CF`, `Volume CY = ${cf.toFixed(2)} ÷ 27 = ${(cf / 27).toFixed(3)} CY`, `Order ${Math.ceil(cy * 100) / 100} CY`] }
    },
    description: 'Calculates concrete volume for a beam in cubic yards.',
    formula: '(L × W/12 × D/12) / 27',
    interpretation: 'Add 10% for over-excavation and spillage; use 4000 PSI mix for structural beams.',
  },
  'concrete-column': {
    schema: z.object({ columnHeight: z.string(), columnDiameter: z.string() }),
    fields: [
      { name: 'columnHeight', label: 'Column Height', step: 0.1, min: 0, placeholder: '10' },
      { name: 'columnDiameter', label: 'Column Diameter', step: 1, min: 6, placeholder: '12' },
    ],
    compute: (v: Record<string, string>) => {
      const rFt = (n(v.columnDiameter) / 2) / 12;
      const cf = Math.PI * rFt * rFt * n(v.columnHeight);
      const cy = cf / 27;
      return { result: Math.ceil(cy * 100) / 100, label: 'Concrete Volume', unit: 'cubic yd', steps: [`Radius = ${n(v.columnDiameter)}÷2 = ${n(v.columnDiameter) / 2} in = ${rFt.toFixed(3)} ft`, `Volume CF = π × ${rFt.toFixed(3)}² × ${n(v.columnHeight)} = ${cf.toFixed(2)} CF`, `Volume CY = ${cf.toFixed(2)} ÷ 27 = ${cy.toFixed(3)} CY`] }
    },
    description: 'Calculates round column concrete volume in cubic yards.',
    formula: '(π × (D/24)² × H) / 27',
    interpretation: 'Use sonotube forms; brace plumb before pouring; order extra 0.5 CY for small columns.',
  },
  'concrete-crack-repair': {
    schema: z.object({ crackLength: z.string(), crackWidth: z.string(), crackDepth: z.string() }),
    fields: [
      { name: 'crackLength', label: 'Crack Length', step: 0.1, min: 0, placeholder: '10' },
      { name: 'crackWidth', label: 'Crack Width', step: 0.0625, min: 0.125, placeholder: '0.25', mode: 'advanced' },
      { name: 'crackDepth', label: 'Crack Depth', step: 0.25, min: 0.5, placeholder: '1', mode: 'advanced' },
    ],
    compute: (v: Record<string, string>) => {
      const ci = n(v.crackLength) * 12 * n(v.crackWidth) * n(v.crackDepth);
      const gal = ci / 231;
      return { result: Math.ceil(gal * 16) / 16, label: 'Epoxy Needed', unit: 'gallons', steps: [`Volume = ${n(v.crackLength)} ft × ${n(v.crackWidth)} in × ${n(v.crackDepth)} in → CI = ${n(v.crackLength)}×12×${n(v.crackWidth)}×${n(v.crackDepth)} = ${ci.toFixed(1)} in³`, `Gallons = ${ci.toFixed(1)} ÷ 231 = ${gal.toFixed(3)} gal`] }
    },
    description: 'Estimates epoxy or filler volume for concrete crack repair.',
    formula: '(L × 12 × W × D) / 231',
    interpretation: 'For epoxy injection, order cartridges rated for this volume; clean cracks thoroughly before filling.',
  },
  'concrete-finish': {
    schema: z.object({ slabArea: z.string(), finishType: z.string() }),
    fields: [
      { name: 'slabArea', label: 'Slab Area', step: 10, min: 0, placeholder: '500' },
      { name: 'finishType', label: 'Finish Type', type: 'select', options: [{ label: 'Broom', value: 'broom' }, { label: 'Trowel', value: 'trowel' }, { label: 'Stamped', value: 'stamped' }, { label: 'Exposed Aggregate', value: 'exposed' }] },
    ],
    compute: (v: Record<string, string>) => {
      const rates = { broom: 200, trowel: 150, stamped: 80, exposed: 60 };
      const rate = rates[v.finishType as keyof typeof rates] || 150;
      const area = n(v.slabArea);
      const hours = area / rate;
      return { result: Math.ceil(hours * 4) / 4, label: 'Labor Hours', unit: 'hours', steps: [`Area = ${area} sq ft`, `Finish rate for ${v.finishType} = ${rate} sq ft/hr`, `Hours = ${area} ÷ ${rate} = ${hours.toFixed(2)} hrs`] }
    },
    description: 'Estimates labor hours for concrete finishing based on finish type.',
    formula: 'Area / rate (broom=200, trowel=150, stamped=80, exposed=60)',
    interpretation: 'Stamped and exposed require additional crew and materials; get finish-specific bids.',
  },
  'concrete-forms': {
    schema: z.object({ slabPerimeter: z.string(), formHeight: z.string() }),
    fields: [
      { name: 'slabPerimeter', label: 'Slab Perimeter', step: 1, min: 0, placeholder: '120' },
      { name: 'formHeight', label: 'Form Height', step: 2, min: 2, placeholder: '12', mode: 'advanced' },
    ],
    compute: (v: Record<string, string>) => {
      return { result: n(v.slabPerimeter), label: 'Form Material Needed', unit: 'linear ft', steps: [`Perimeter = ${n(v.slabPerimeter)} ft`, `Form height = ${n(v.formHeight)} in`, `Use ${n(v.slabPerimeter)} linear ft of 2×${n(v.formHeight)} lumber or metal forms`, `Stakes every 3 ft = ${Math.ceil(n(v.slabPerimeter) / 3)} stakes needed`] };
    },
    description: 'Calculates linear feet of form material for a concrete slab.',
    formula: 'Perimeter (forms match perimeter length)',
    interpretation: 'Use 2× lumber or steel forms; brace with stakes every 3 ft; double forms for thick slabs.',
  },
  'concrete-sealer': {
    schema: z.object({ slabArea: z.string(), coats: z.string() }),
    fields: [
      { name: 'slabArea', label: 'Slab Area', step: 10, min: 0, placeholder: '500' },
      { name: 'coats', label: 'Number of Coats', step: 1, min: 1, placeholder: '2', mode: 'advanced' },
    ],
    compute: (v: Record<string, string>) => {
      const coverage = 250;
      const area = n(v.slabArea);
      const coatsNum = n(v.coats);
      const gal = (area * coatsNum) / coverage;
      return { result: Math.ceil(gal * 4) / 4, label: 'Sealer Needed', unit: 'gallons', steps: [`Coverage rate = ${coverage} sq ft/gal per coat`, `Total area to cover = ${area} × ${coatsNum} coats = ${area * coatsNum} sq ft`, `Gallons = ${area * coatsNum} ÷ ${coverage} = ${gal.toFixed(2)} gal`] }
    },
    description: 'Calculates concrete sealer gallons for slab area and number of coats.',
    formula: '(Area × coats) / 250',
    interpretation: 'Apply in thin, even coats; allow 24 hrs between coats; avoid pooling.',
  },
  'concrete-steps': {
    schema: z.object({ stepCount: z.string(), stepWidth: z.string(), stepRise: z.string(), stepRun: z.string() }),
    fields: [
      { name: 'stepCount', label: 'Number of Steps', step: 1, min: 1, placeholder: '4' },
      { name: 'stepWidth', label: 'Step Width', step: 0.5, min: 2, placeholder: '4' },
      { name: 'stepRise', label: 'Step Rise', step: 0.5, min: 4, placeholder: '7', mode: 'advanced' },
      { name: 'stepRun', label: 'Step Run', step: 0.5, min: 10, placeholder: '11', mode: 'advanced' },
    ],
    compute: (v: Record<string, string>) => {
      const count = n(v.stepCount);
      const w = n(v.stepWidth);
      const rise = n(v.stepRise);
      const run = n(v.stepRun);
      const volPerStep = w * (rise / 12) * (run / 12);
      const totalVol = volPerStep * count + (w * (rise / 12) * (run / 12));
      return { result: Math.ceil(totalVol * 100) / 100, label: 'Concrete Volume', unit: 'cubic ft', steps: [`Each step volume = ${w} × (${rise}÷12) × (${run}÷12) = ${volPerStep.toFixed(3)} CF`, `All steps = ${volPerStep.toFixed(3)} × ${count} = ${(volPerStep * count).toFixed(3)} CF`, `Add landing/tread extension ~ ${(w * (rise / 12) * (run / 12)).toFixed(3)} CF`, `Total = ${totalVol.toFixed(3)} CF`] }
    },
    description: 'Calculates concrete volume for poured steps.',
    formula: 'StepWidth × (Rise/12) × (Run/12) × (Steps + 1)',
    interpretation: 'Add 10% for waste; reinforce with rebar; each step should have 1" nosing.',
  },
  'concrete-wall': {
    schema: z.object({ wallLength: z.string(), wallHeight: z.string(), wallThickness: z.string() }),
    fields: [
      { name: 'wallLength', label: 'Wall Length', step: 0.5, min: 0, placeholder: '30' },
      { name: 'wallHeight', label: 'Wall Height', step: 0.5, min: 0, placeholder: '8' },
      { name: 'wallThickness', label: 'Wall Thickness', step: 2, min: 6, placeholder: '8', mode: 'advanced' },
    ],
    compute: (v: Record<string, string>) => {
      const cf = n(v.wallLength) * n(v.wallHeight) * (n(v.wallThickness) / 12);
      const cy = cf / 27;
      return { result: Math.ceil(cy * 100) / 100, label: 'Concrete Volume', unit: 'cubic yd', steps: [`Volume CF = ${n(v.wallLength)} × ${n(v.wallHeight)} × (${n(v.wallThickness)}÷12) = ${cf.toFixed(2)} CF`, `Volume CY = ${cf.toFixed(2)} ÷ 27 = ${cy.toFixed(3)} CY`] }
    },
    description: 'Calculates concrete volume for a wall in cubic yards.',
    formula: '(L × H × T/12) / 27',
    interpretation: 'Double pour walls over 4 ft; use form ties every 16"; vibrate thoroughly.',
  },
  'driveway-asphalt': {
    schema: z.object({ drivewayLength: z.string(), drivewayWidth: z.string(), asphaltDepth: z.string() }),
    fields: [
      { name: 'drivewayLength', label: 'Driveway Length', step: 1, min: 0, placeholder: '60' },
      { name: 'drivewayWidth', label: 'Driveway Width', step: 0.5, min: 8, placeholder: '12' },
      { name: 'asphaltDepth', label: 'Asphalt Depth', step: 0.5, min: 2, placeholder: '3', mode: 'advanced' },
    ],
    compute: (v: Record<string, string>) => {
      const cf = n(v.drivewayLength) * n(v.drivewayWidth) * (n(v.asphaltDepth) / 12);
      const tons = cf * 145 / 2000;
      return { result: Math.ceil(tons * 2) / 2, label: 'Asphalt Needed', unit: 'tons', steps: [`Volume CF = ${n(v.drivewayLength)} × ${n(v.drivewayWidth)} × (${n(v.asphaltDepth)}÷12) = ${cf.toFixed(2)} CF`, `Weight = ${cf.toFixed(2)} × 145 lbs/CF = ${(cf * 145).toFixed(0)} lbs`, `Tons = ${(cf * 145).toFixed(0)} ÷ 2000 = ${tons.toFixed(2)} tons`] }
    },
    description: 'Calculates asphalt tonnage for a driveway.',
    formula: '(L × W × D/12) × 145 / 2000',
    interpretation: 'Compact in 2" lifts; add tack coat between layers; seal after 6 months.',
  },
  'driveway-concrete': {
    schema: z.object({ drivewayLength: z.string(), drivewayWidth: z.string(), thickness: z.string(), reinforcement: z.string() }),
    fields: [
      { name: 'drivewayLength', label: 'Driveway Length', step: 1, min: 0, placeholder: '60' },
      { name: 'drivewayWidth', label: 'Driveway Width', step: 0.5, min: 8, placeholder: '12' },
      { name: 'thickness', label: 'Thickness', step: 0.5, min: 4, placeholder: '4', mode: 'advanced' },
      { name: 'reinforcement', label: 'Reinforcement', type: 'select', options: [{ label: 'Wire Mesh', value: 'wire' }, { label: 'Rebar', value: 'rebar' }, { label: 'Fiber Mesh', value: 'mesh' }, { label: 'None', value: 'none' }] },
    ],
    compute: (v: Record<string, string>) => {
      const cf = n(v.drivewayLength) * n(v.drivewayWidth) * (n(v.thickness) / 12);
      const cy = cf / 27;
      const costs = { wire: 0.50, rebar: 1.00, mesh: 0.35, none: 0 };
      const costPerSf = costs[v.reinforcement as keyof typeof costs] || 0;
      const area = n(v.drivewayLength) * n(v.drivewayWidth);
      const rebarCost = area * costPerSf;
      return { result: Math.ceil(cy * 100) / 100, label: 'Concrete Volume', unit: 'cubic yd', steps: [`Volume CF = ${n(v.drivewayLength)} × ${n(v.drivewayWidth)} × (${n(v.thickness)}÷12) = ${cf.toFixed(2)} CF`, `Volume CY = ${cf.toFixed(2)} ÷ 27 = ${cy.toFixed(3)} CY`, `${v.reinforcement} reinforcement: ~${rebarCost.toFixed(0)} for materials`] }
    },
    description: 'Calculates concrete driveway volume with reinforcement options.',
    formula: '(L × W × T/12) / 27',
    interpretation: 'Use 4000 PSI mix; cut control joints every 8-10 ft; cure 7 days before loading.',
  },
  'driveway-gravel': {
    schema: z.object({ drivewayLength: z.string(), drivewayWidth: z.string(), gravelDepth: z.string(), gravelType: z.string() }),
    fields: [
      { name: 'drivewayLength', label: 'Driveway Length', step: 1, min: 0, placeholder: '60' },
      { name: 'drivewayWidth', label: 'Driveway Width', step: 0.5, min: 8, placeholder: '12' },
      { name: 'gravelDepth', label: 'Gravel Depth', step: 0.5, min: 2, placeholder: '4', mode: 'advanced' },
      { name: 'gravelType', label: 'Gravel Type', type: 'select', options: [{ label: 'Crushed Stone', value: 'crushed-stone' }, { label: 'Pea Gravel', value: 'pea-gravel' }, { label: 'Recycled', value: 'recycled' }] },
    ],
    compute: (v: Record<string, string>) => {
      const densities = { 'crushed-stone': 1.4, 'pea-gravel': 1.2, recycled: 1.3 };
      const density = densities[v.gravelType as keyof typeof densities] || 1.4;
      const cy = n(v.drivewayLength) * n(v.drivewayWidth) * (n(v.gravelDepth) / 12) / 27;
      const tons = cy * density;
      return { result: Math.ceil(tons * 2) / 2, label: 'Gravel Needed', unit: 'tons', steps: [`Volume CY = ${n(v.drivewayLength)} × ${n(v.drivewayWidth)} × (${n(v.gravelDepth)}÷12) ÷ 27 = ${cy.toFixed(3)} CY`, `Density (${v.gravelType}) = ${density} tons/CY`, `Tons = ${cy.toFixed(3)} × ${density} = ${tons.toFixed(2)} tons`] }
    },
    description: 'Calculates gravel tonnage for a driveway based on type and depth.',
    formula: '((L × W × D/12) / 27) × density',
    interpretation: 'Compact in 4" lifts; crushed stone performs best under load; add geotextile fabric.',
  },
  'fence-chain-link': {
    schema: z.object({ perimeter: z.string(), gateWidth: z.string(), height: z.string() }),
    fields: [
      { name: 'perimeter', label: 'Fence Perimeter', step: 1, min: 0, placeholder: '200' },
      { name: 'gateWidth', label: 'Gate Width', step: 1, min: 0, placeholder: '4' },
      { name: 'height', label: 'Fence Height', step: 1, min: 3, placeholder: '4' },
    ],
    compute: (v: Record<string, string>) => {
      const p = n(v.perimeter);
      const rolls = Math.ceil(p / 50);
      const posts = Math.ceil(p / 10) + 1;
      return { result: rolls, label: 'Chain Link Rolls', unit: 'rolls', steps: [`Perimeter = ${p} ft`, `Rolls = ceil(${p} ÷ 50) = ${rolls} rolls (50 ft each)`, `Posts = ceil(${p} ÷ 10) + 1 = ${posts} posts (10 ft spacing)`] }
    },
    description: 'Calculates chain link fence materials — rolls and posts.',
    formula: 'Rolls = ceil(perimeter/50), Posts = ceil(perimeter/10) + 1',
    interpretation: 'Each roll covers 50 ft; set posts in concrete 3 ft deep; tension wire top and bottom.',
  },
  'fence-vinyl': {
    schema: z.object({ perimeter: z.string(), gateWidth: z.string(), panelWidth: z.string() }),
    fields: [
      { name: 'perimeter', label: 'Fence Perimeter', step: 1, min: 0, placeholder: '200' },
      { name: 'gateWidth', label: 'Gate Width', step: 1, min: 0, placeholder: '4' },
      { name: 'panelWidth', label: 'Panel Width', step: 0.5, min: 4, placeholder: '6', mode: 'advanced' },
    ],
    compute: (v: Record<string, string>) => {
      const p = n(v.perimeter);
      const pw = n(v.panelWidth);
      const panels = Math.ceil(p / pw);
      const posts = panels + 1;
      return { result: panels, label: 'Vinyl Panels Needed', unit: 'panels', steps: [`Perimeter = ${p} ft`, `Panels = ceil(${p} ÷ ${pw}) = ${panels} panels`, `Posts = ${panels} + 1 = ${posts} posts`] }
    },
    description: 'Calculates vinyl fence panels and posts needed.',
    formula: 'ceil(perimeter / panelWidth) panels, panels + 1 posts',
    interpretation: 'Vinyl expands with heat; leave 1/4" gap at joints; set posts 30" deep in concrete.',
  },


  'fence-wood': {
    schema: z.object({ perimeter: z.string(), gateWidth: z.string(), panelWidth: z.string(), railCount: z.string() }),
    fields: [
      { name: 'perimeter', label: 'Total Perimeter (ft)', step: 0.1, min: 0 },
      { name: 'gateWidth', label: 'Gate Width (ft)', step: 0.1, min: 0 },
      { name: 'panelWidth', label: 'Panel Width (ft)', placeholder: '8', step: 0.1, min: 0 },
      { name: 'railCount', label: 'Number of Rails per Section', placeholder: '3', step: 1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const p = n(v.perimeter), gw = n(v.gateWidth), pw = n(v.panelWidth), rc = n(v.railCount)
      const netPerimeter = p - gw
      const panels = Math.ceil(netPerimeter / pw)
      const boards = panels * rc
      return { result: panels, label: 'Panels Needed', unit: 'panels', steps: [`Net perimeter: ${p} ft - ${gw} ft gate = ${netPerimeter} ft`, `Panels: ceil(${netPerimeter} / ${pw}) = ${panels}`, `Total boards: ${panels} × ${rc} rails = ${boards} boards`] }
    },
    description: 'Calculates wood fence panels and boards needed.',
    formula: 'Panels = ceil((Perimeter - Gate Width) / Panel Width); Boards = Panels × Rails',
    interpretation: 'Order this many fence panels. Each panel requires the specified number of rails.',
  },
  'fence-wrought-iron': {
    schema: z.object({ perimeter: z.string(), gateWidth: z.string(), sectionWidth: z.string(), height: z.string() }),
    fields: [
      { name: 'perimeter', label: 'Total Perimeter (ft)', step: 0.1, min: 0 },
      { name: 'gateWidth', label: 'Gate Width (ft)', step: 0.1, min: 0 },
      { name: 'sectionWidth', label: 'Section Width (ft)', placeholder: '8', step: 0.1, min: 0 },
      { name: 'height', label: 'Fence Height (ft)', placeholder: '4', step: 0.1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const p = n(v.perimeter), gw = n(v.gateWidth), sw = n(v.sectionWidth), h = n(v.height)
      const netPerimeter = p - gw
      const sections = Math.ceil(netPerimeter / sw)
      const posts = sections + 1
      return { result: sections, label: 'Sections Needed', unit: 'sections', steps: [`Net perimeter: ${p} ft - ${gw} ft gate = ${netPerimeter} ft`, `Sections: ceil(${netPerimeter} / ${sw}) = ${sections}`, `Posts: ${sections} + 1 = ${posts}`] }
    },
    description: 'Calculates wrought iron fence sections and posts.',
    formula: 'Sections = ceil((Perimeter - Gate Width) / Section Width); Posts = Sections + 1',
    interpretation: 'Order this many prefabricated sections plus one extra end post.',
  },
  'deck-composite': {
    schema: z.object({ deckLength: z.string(), deckWidth: z.string(), boardWidth: z.string(), hiddenFasteners: z.string() }),
    fields: [
      { name: 'deckLength', label: 'Deck Length (ft)', step: 0.1, min: 0 },
      { name: 'deckWidth', label: 'Deck Width (ft)', step: 0.1, min: 0 },
      { name: 'boardWidth', label: 'Board Width (in)', placeholder: '5.5', step: 0.1, min: 0 },
      { name: 'hiddenFasteners', label: 'Hidden Fasteners', type: 'select', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
    ],
    compute: (v: Record<string, string>) => {
      const L = n(v.deckLength), W = n(v.deckWidth), bw = n(v.boardWidth)
      const area = L * W
      const boardRows = Math.ceil(W / (bw / 12))
      const boardLF = boardRows * L
      return { result: area, label: 'Deck Area', unit: 'sq ft', steps: [`Area: ${L} ft × ${W} ft = ${area} sq ft`, `Board rows: ceil(${W} ft / (${bw} in / 12)) = ${boardRows}`, `Total board LF: ${boardRows} × ${L} ft = ${boardLF} LF`] }
    },
    description: 'Calculates composite decking area and board footage.',
    formula: 'Area = L × W; Board LF = ceil(W / (Board Width / 12)) × L',
    interpretation: 'Covers total deck square footage. Add 10% waste for cuts and miters.',
  },
  'deck-railing': {
    schema: z.object({ deckPerimeter: z.string(), railHeight: z.string(), balusterSpacing: z.string() }),
    fields: [
      { name: 'deckPerimeter', label: 'Deck Perimeter (ft)', step: 0.1, min: 0 },
      { name: 'railHeight', label: 'Rail Height (ft)', placeholder: '3', step: 0.1, min: 0 },
      { name: 'balusterSpacing', label: 'Baluster Spacing (in)', placeholder: '4', step: 0.1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const p = n(v.deckPerimeter), rh = n(v.railHeight), bs = n(v.balusterSpacing)
      const railLF = p
      const balusters = Math.ceil((p * 12) / bs) - 1
      return { result: railLF, label: 'Top Rail Length', unit: 'linear ft', steps: [`Top rail: ${p} linear ft`, `Balusters: ceil((${p} ft × 12) / ${bs} in) - 1 = ${balusters}`] }
    },
    description: 'Calculates railing linear footage and baluster count.',
    formula: 'Rail LF = Perimeter; Balusters = ceil((Perimeter × 12) / Spacing) - 1',
    interpretation: 'Covers top rail and baluster quantities. Add corner posts and hardware separately.',
  },
  'deck-stairs': {
    schema: z.object({ totalRise: z.string(), desiredRise: z.string(), stairWidth: z.string(), treadMaterial: z.string() }),
    fields: [
      { name: 'totalRise', label: 'Total Rise (in)', step: 0.1, min: 0 },
      { name: 'desiredRise', label: 'Desired Riser Height (in)', placeholder: '7', step: 0.1, min: 0 },
      { name: 'stairWidth', label: 'Stair Width (ft)', placeholder: '3', step: 0.1, min: 0 },
      { name: 'treadMaterial', label: 'Tread Material', type: 'select', options: [{ label: 'Wood', value: 'wood' }, { label: 'Composite', value: 'composite' }] },
    ],
    compute: (v: Record<string, string>) => {
      const tr = n(v.totalRise), dr = n(v.desiredRise), sw = n(v.stairWidth)
      const steps = Math.round(tr / dr)
      const actualRise = tr / steps
      const stringers = sw > 3 ? Math.ceil(sw / 2) + 1 : 2
      return { result: steps, label: 'Number of Steps', unit: 'steps', steps: [`Steps: round(${tr} in / ${dr} in) = ${steps}`, `Actual rise: ${tr} in / ${steps} = ${actualRise.toFixed(1)} in`, `Stringers needed: ${stringers}`] }
    },
    description: 'Calculates stair step count and stringer requirements.',
    formula: 'Steps = round(Total Rise / Desired Rise); Stringers = Width > 3 ft ? ceil(W / 2) + 1 : 2',
    interpretation: 'Verify actual rise meets local code (max 7.75 in typical). Adjust desired rise if needed.',
  },
  'deck-wood': {
    schema: z.object({ deckLength: z.string(), deckWidth: z.string(), boardWidth: z.string(), woodType: z.string() }),
    fields: [
      { name: 'deckLength', label: 'Deck Length (ft)', step: 0.1, min: 0 },
      { name: 'deckWidth', label: 'Deck Width (ft)', step: 0.1, min: 0 },
      { name: 'boardWidth', label: 'Board Width (in)', placeholder: '5.5', step: 0.1, min: 0 },
      { name: 'woodType', label: 'Wood Type', type: 'select', options: [{ label: 'Pressure Treated', value: 'pressure-treated' }, { label: 'Cedar', value: 'cedar' }, { label: 'Redwood', value: 'redwood' }, { label: 'Ipê', value: 'ipe' }] },
    ],
    compute: (v: Record<string, string>) => {
      const L = n(v.deckLength), W = n(v.deckWidth), bw = n(v.boardWidth)
      const area = L * W
      const boardRows = Math.ceil(W / (bw / 12))
      const boardLF = boardRows * L
      return { result: area, label: 'Deck Area', unit: 'sq ft', steps: [`Area: ${L} ft × ${W} ft = ${area} sq ft`, `Board rows: ceil(${W} ft / (${bw} in / 12)) = ${boardRows}`, `Total board LF: ${boardRows} × ${L} ft = ${boardLF} LF`] }
    },
    description: 'Calculates wood deck area and board footage by species.',
    formula: 'Area = L × W; Board LF = ceil(W / (Board Width / 12)) × L',
    interpretation: 'Use #1 or Select grade for visible decking. Add 15% waste for irregular layouts.',
  },
  'patio-concrete': {
    schema: z.object({ patioLength: z.string(), patioWidth: z.string(), thickness: z.string(), finish: z.string() }),
    fields: [
      { name: 'patioLength', label: 'Patio Length (ft)', step: 0.1, min: 0 },
      { name: 'patioWidth', label: 'Patio Width (ft)', step: 0.1, min: 0 },
      { name: 'thickness', label: 'Slab Thickness (in)', placeholder: '4', step: 0.5, min: 0 },
      { name: 'finish', label: 'Finish Type', type: 'select', options: [{ label: 'Broom', value: 'broom' }, { label: 'Trowel', value: 'trowel' }, { label: 'Stamped', value: 'stamped' }] },
    ],
    compute: (v: Record<string, string>) => {
      const L = n(v.patioLength), W = n(v.patioWidth), t = n(v.thickness)
      const volumeCF = L * W * (t / 12)
      const volumeCY = volumeCF / 27
      return { result: volumeCY, label: 'Concrete Volume', unit: 'cubic yd', steps: [`Volume CF: ${L} ft × ${W} ft × (${t} in / 12) = ${volumeCF.toFixed(1)} cu ft`, `Volume CY: ${volumeCF.toFixed(1)} / 27 = ${volumeCY.toFixed(2)} cu yd`] }
    },
    description: 'Estimates concrete volume needed for a patio slab.',
    formula: 'Volume CY = (L × W × Thickness/12) / 27',
    interpretation: 'Order 10% extra for waste and grade changes. Stamped finish requires special mix.',
  },
  'patio-stone': {
    schema: z.object({ patioLength: z.string(), patioWidth: z.string(), stoneSize: z.string() }),
    fields: [
      { name: 'patioLength', label: 'Patio Length (ft)', step: 0.1, min: 0 },
      { name: 'patioWidth', label: 'Patio Width (ft)', step: 0.1, min: 0 },
      { name: 'stoneSize', label: 'Stone Size', type: 'select', options: [{ label: '12×12 in', value: '12x12' }, { label: '12×24 in', value: '12x24' }, { label: '18×18 in', value: '18x18' }, { label: '24×24 in', value: '24x24' }] },
    ],
    compute: (v: Record<string, string>) => {
      const L = n(v.patioLength), W = n(v.patioWidth)
      const sizes = { '12x12': 144, '12x24': 288, '18x18': 324, '24x24': 576 }
      const sqIn = sizes[v.stoneSize as keyof typeof sizes] || 144
      const area = L * W
      const stones = Math.ceil((area * 144) / sqIn)
      return { result: stones, label: 'Stones Needed', unit: 'stones', steps: [`Area: ${L} ft × ${W} ft = ${area} sq ft`, `Stone area: ${sqIn} sq in`, `Stones: ceil((${area} × 144) / ${sqIn}) = ${stones}`] }
    },
    description: 'Calculates number of patio stones or pavers.',
    formula: 'Area sq in = L × W × 144; Stones = ceil(Area / Stone Area)',
    interpretation: 'Add 5-10% for cuts and breakage. Consider pattern repeat for mixed sizes.',
  },
  'retaining-wall-block': {
    schema: z.object({ wallLength: z.string(), wallHeight: z.string(), blockType: z.string() }),
    fields: [
      { name: 'wallLength', label: 'Wall Length (ft)', step: 0.1, min: 0 },
      { name: 'wallHeight', label: 'Wall Height (ft)', step: 0.1, min: 0 },
      { name: 'blockType', label: 'Block Type', type: 'select', options: [{ label: 'Standard (8×4 in)', value: 'standard' }, { label: 'Segmental (12×4 in)', value: 'segmental' }, { label: 'Large (16×8 in)', value: 'large' }] },
    ],
    compute: (v: Record<string, string>) => {
      const L = n(v.wallLength), H = n(v.wallHeight)
      const blocks = { standard: { l: 8 / 12, h: 4 / 12 }, segmental: { l: 12 / 12, h: 4 / 12 }, large: { l: 16 / 12, h: 8 / 12 } }
      const b = blocks[v.blockType as keyof typeof blocks] || blocks.standard
      const count = Math.ceil((L / b.l) * (H / b.h))
      return { result: count, label: 'Blocks Required', unit: 'blocks', steps: [`Block size: ${(b.l * 12).toFixed(0)}×${(b.h * 12).toFixed(0)} in`, `Blocks: ceil((${L} ft / ${b.l.toFixed(2)} ft) × (${H} ft / ${b.h.toFixed(2)} ft)) = ${count}`] }
    },
    description: 'Estimates retaining wall block quantities.',
    formula: 'Blocks = ceil((L / Block Length) × (H / Block Height))',
    interpretation: 'Does not include cap blocks or base material. Walls over 4 ft need engineering review.',
  },
}