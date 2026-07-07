import { z } from 'zod'
import type { CalcDef } from './types'

function n(v: string | undefined): number { const x = parseFloat(v ?? ''); return isNaN(x) ? 0 : x }

export const calcDefsGroup4: Record<string, CalcDef> = {
'footing-calculator': {
    schema: z.object({ footingLength: z.string(), footingWidth: z.string(), footingDepth: z.string() }),
    fields: [
      { name: 'footingLength', label: 'Footing Length (ft)', step: 0.1, min: 0 },
      { name: 'footingWidth', label: 'Footing Width (ft)', step: 0.1, min: 0 },
      { name: 'footingDepth', label: 'Footing Depth (ft)', step: 0.1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const L = n(v.footingLength), W = n(v.footingWidth), D = n(v.footingDepth)
      const volumeCF = L * W * D
      const volumeCY = volumeCF / 27
      return { result: volumeCY, label: 'Concrete Volume', unit: 'cubic yd', steps: [`Volume CF: ${L} ft × ${W} ft × ${D} ft = ${volumeCF.toFixed(1)} cu ft`, `Volume CY: ${volumeCF.toFixed(1)} / 27 = ${volumeCY.toFixed(2)} cu yd`] }
    },
    description: 'Calculates concrete volume for isolated footings.',
    formula: 'Volume CY = (L × W × D) / 27',
    interpretation: 'Add 5-10% for over-excavation. Verify footer dimensions per local building code.',
  },
  'foundation-wall': {
    schema: z.object({ wallLength: z.string(), wallHeight: z.string(), wallThickness: z.string() }),
    fields: [
      { name: 'wallLength', label: 'Wall Length (ft)', step: 0.1, min: 0 },
      { name: 'wallHeight', label: 'Wall Height (ft)', step: 0.1, min: 0 },
      { name: 'wallThickness', label: 'Wall Thickness (in)', placeholder: '8', step: 0.5, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const L = n(v.wallLength), H = n(v.wallHeight), t = n(v.wallThickness)
      const volumeCF = L * H * (t / 12)
      const volumeCY = volumeCF / 27
      return { result: volumeCY, label: 'Concrete Volume', unit: 'cubic yd', steps: [`Volume CF: ${L} ft × ${H} ft × (${t} in / 12) = ${volumeCF.toFixed(1)} cu ft`, `Volume CY: ${volumeCF.toFixed(1)} / 27 = ${volumeCY.toFixed(2)} cu yd`] }
    },
    description: 'Calculates concrete volume for a foundation wall.',
    formula: 'Volume CY = (L × H × Thickness/12) / 27',
    interpretation: 'Deduct openings over 2 sq ft. Add 5% waste. Does not include rebar or formwork.',
  },
  'drainage-french': {
    schema: z.object({ drainLength: z.string(), trenchWidth: z.string(), trenchDepth: z.string(), pipeDiameter: z.string() }),
    fields: [
      { name: 'drainLength', label: 'Drain Length (ft)', step: 0.1, min: 0 },
      { name: 'trenchWidth', label: 'Trench Width (in)', placeholder: '12', step: 0.5, min: 0 },
      { name: 'trenchDepth', label: 'Trench Depth (in)', placeholder: '18', step: 0.5, min: 0 },
      { name: 'pipeDiameter', label: 'Pipe Diameter (in)', placeholder: '4', step: 1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const L = n(v.drainLength), tw = n(v.trenchWidth), td = n(v.trenchDepth)
      const volumeCF = L * (tw / 12) * (td / 12)
      const volumeCY = volumeCF / 27
      const gravelTons = volumeCY * 1.4
      return { result: volumeCY, label: 'Excavation Volume', unit: 'cubic yd', steps: [`Volume CF: ${L} ft × (${tw} in / 12) × (${td} in / 12) = ${volumeCF.toFixed(1)} cu ft`, `Volume CY: ${volumeCF.toFixed(1)} / 27 = ${volumeCY.toFixed(2)} cu yd`, `Gravel estimate: ${volumeCY.toFixed(2)} × 1.4 = ${gravelTons.toFixed(2)} tons`] }
    },
    description: 'Estimates excavation and gravel for a French drain.',
    formula: 'Excavation CY = (L × Trench Width/12 × Trench Depth/12) / 27; Gravel tons = CY × 1.4',
    interpretation: 'Gravel estimate includes 30% void space around pipe. Add filter fabric separately.',
  },
  'drainage-surface': {
    schema: z.object({ area: z.string(), slope: z.string(), rainfall: z.string() }),
    fields: [
      { name: 'area', label: 'Drainage Area (sq ft)', step: 1, min: 0 },
      { name: 'slope', label: 'Slope (%)', placeholder: '2', step: 0.1, min: 0 },
      { name: 'rainfall', label: 'Rainfall Intensity (in/hr)', placeholder: '2', step: 0.1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const A = n(v.area), r = n(v.rainfall)
      const runoffCFM = (A * r) / 12 / 60
      return { result: runoffCFM, label: 'Peak Runoff', unit: 'CFM', steps: [`Runoff CFM: (${A} sq ft × ${r} in/hr) / 12 / 60 = ${runoffCFM.toFixed(2)} CFM`] }
    },
    description: 'Estimates peak surface runoff using rational method.',
    formula: 'Runoff CFM = (Area × Rainfall) / 12 / 60',
    interpretation: 'Assumes impervious surface (C=1.0). Reduce for pervious areas. Use local IDF data.',
  },
  'downspout': {
    schema: z.object({ roofArea: z.string(), rainfallIntensity: z.string(), downspouts: z.string() }),
    fields: [
      { name: 'roofArea', label: 'Roof Area (sq ft)', step: 1, min: 0 },
      { name: 'rainfallIntensity', label: 'Rainfall Intensity (in/hr)', placeholder: '3', step: 0.1, min: 0 },
      { name: 'downspouts', label: 'Existing Downspouts', placeholder: '2', step: 1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const ra = n(v.roofArea), ri = n(v.rainfallIntensity), ds = n(v.downspouts)
      const capacityPerDS = 100 * ri
      const needed = Math.ceil(ra / capacityPerDS)
      return { result: Math.max(needed, ds), label: 'Recommended Downspouts', unit: 'downspouts', steps: [`Capacity per downspout: 100 sq ft × ${ri} in/hr = ${capacityPerDS} sq ft`, `Min needed: ceil(${ra} / ${capacityPerDS}) = ${needed}`, `Using ${ds} existing — recommend at least ${Math.max(needed, ds)}`] }
    },
    description: 'Determines number of downspouts needed for roof drainage.',
    formula: 'Downspouts = ceil(Roof Area / (100 × Rainfall Intensity))',
    interpretation: 'Each 2×3 downspout handles ~100 sq ft per in/hr. Place at roof valleys and ends.',
  },
  'grading-calculator': {
    schema: z.object({ area: z.string(), avgCutDepth: z.string() }),
    fields: [
      { name: 'area', label: 'Site Area (sq ft)', step: 1, min: 0 },
      { name: 'avgCutDepth', label: 'Average Cut/Fill Depth (in)', placeholder: '6', step: 0.5, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const A = n(v.area), d = n(v.avgCutDepth)
      const volumeCY = (A * (d / 12)) / 27
      return { result: volumeCY, label: 'Earthwork Volume', unit: 'cubic yd', steps: [`Volume CF: ${A} sq ft × (${d} in / 12) = ${(A * d / 12).toFixed(1)} cu ft`, `Volume CY: ${(A * d / 12).toFixed(1)} / 27 = ${volumeCY.toFixed(2)} cu yd`] }
    },
    description: 'Calculates cut/fill volume for site grading.',
    formula: 'Volume CY = (Area × Depth/12) / 27',
    interpretation: 'Positive = cut, negative = fill. Adjust for compaction factors on fill areas.',
  },
  'excavation': {
    schema: z.object({ length: z.string(), width: z.string(), depth: z.string() }),
    fields: [
      { name: 'length', label: 'Excavation Length (ft)', step: 0.1, min: 0 },
      { name: 'width', label: 'Excavation Width (ft)', step: 0.1, min: 0 },
      { name: 'depth', label: 'Excavation Depth (ft)', step: 0.1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const L = n(v.length), W = n(v.width), D = n(v.depth)
      const volumeCY = (L * W * D) / 27
      return { result: volumeCY, label: 'Excavation Volume', unit: 'cubic yd', steps: [`Volume CF: ${L} ft × ${W} ft × ${D} ft = ${(L * W * D).toFixed(1)} cu ft`, `Volume CY: ${(L * W * D).toFixed(1)} / 27 = ${volumeCY.toFixed(2)} cu yd`] }
    },
    description: 'Calculates excavation volume in cubic yards.',
    formula: 'Volume CY = (L × W × D) / 27',
    interpretation: 'Assumes vertical walls. Add 1:1 slope for open excavations or benching as needed.',
  },
  'backfill': {
    schema: z.object({ excavatedVolume: z.string(), structureVolume: z.string(), compactionFactor: z.string() }),
    fields: [
      { name: 'excavatedVolume', label: 'Excavated Volume (CY)', step: 0.1, min: 0 },
      { name: 'structureVolume', label: 'Structure Volume (CY)', step: 0.1, min: 0 },
      { name: 'compactionFactor', label: 'Compaction Factor (%)', placeholder: '15', step: 1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const ev = n(v.excavatedVolume), sv = n(v.structureVolume), cf = n(v.compactionFactor)
      const net = ev - sv
      const backfill = net * (1 + cf / 100)
      return { result: backfill, label: 'Backfill Required', unit: 'cubic yd', steps: [`Net void: ${ev} CY - ${sv} CY = ${net.toFixed(2)} CY`, `With ${cf}% compaction: ${net.toFixed(2)} × (1 + ${cf}/100) = ${backfill.toFixed(2)} CY`] }
    },
    description: 'Estimates backfill material needed accounting for compaction.',
    formula: 'Backfill = (Excavated - Structure) × (1 + Compaction/100)',
    interpretation: 'Compaction factor varies by soil type: 10-15% for sand, 20-30% for clay.',
  },
  'compaction': {
    schema: z.object({ looseVolume: z.string(), compactionRatio: z.string() }),
    fields: [
      { name: 'looseVolume', label: 'Loose Volume (CY)', step: 0.1, min: 0 },
      { name: 'compactionRatio', label: 'Compaction Ratio (%)', placeholder: '25', step: 1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const lv = n(v.looseVolume), cr = n(v.compactionRatio)
      const compacted = lv / (1 + cr / 100)
      return { result: compacted, label: 'Compacted Volume', unit: 'cubic yd', steps: [`Compacted: ${lv} CY / (1 + ${cr}/100) = ${compacted.toFixed(2)} CY`, `Swell/Shrink: ${lv} CY loose → ${compacted.toFixed(2)} CY compacted`] }
    },
    description: 'Converts loose fill volume to compacted volume.',
    formula: 'Compacted = Loose Volume / (1 + Compaction Ratio/100)',
    interpretation: 'Typical compaction ratios: 25% for gravel, 30% for topsoil, 15% for sand.',
  },

  'irrigation-drip': {
    schema: z.object({ bedArea: z.string(), plantSpacing: z.string(), emitterFlow: z.string(), runTime: z.string() }),
    fields: [
      { name: 'bedArea', label: 'Bed Area (sq ft)', step: 1, min: 0 },
      { name: 'plantSpacing', label: 'Plant Spacing (ft)', step: 0.1, min: 0, placeholder: '1.5' },
      { name: 'emitterFlow', label: 'Emitter Flow Rate (GPH)', step: 0.1, min: 0, placeholder: '0.5' },
      { name: 'runTime', label: 'Run Time (hrs)', step: 0.5, min: 0, placeholder: '1' },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.bedArea), spacing = n(v.plantSpacing), flow = n(v.emitterFlow), time = n(v.runTime);
      const spacingSq = spacing * spacing;
      const emitters = Math.ceil(area / spacingSq);
      const waterUsage = +(emitters * flow * time).toFixed(1);
      return { result: waterUsage, label: 'Water Usage', unit: 'gallons per cycle', steps: [`Emitter spacing area = ${spacing} ft × ${spacing} ft = ${spacingSq} sq ft`, `Emitters needed = ceil(${area} ÷ ${spacingSq}) = ${emitters}`, `Water usage = ${emitters} × ${flow} GPH × ${time} hrs = ${waterUsage} gallons`] }
    },
    description: 'Calculates water usage per irrigation cycle for drip irrigation systems.',
    formula: 'Water = ceil(Area / Spacing²) × Flow × Time',
    interpretation: 'Total gallons of water applied per irrigation cycle. Adjust run time to meet weekly watering needs.',
  },
  'irrigation-sprinkler': {
    schema: z.object({ lawnArea: z.string(), sprinklerRadius: z.string(), zoneCount: z.string() }),
    fields: [
      { name: 'lawnArea', label: 'Lawn Area (sq ft)', step: 1, min: 0 },
      { name: 'sprinklerRadius', label: 'Sprinkler Radius (ft)', step: 1, min: 0, placeholder: '15' },
      { name: 'zoneCount', label: 'Number of Zones', step: 1, min: 1, placeholder: '4' },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.lawnArea), radius = n(v.sprinklerRadius), zones = n(v.zoneCount);
      const coverage = Math.PI * radius * radius;
      const perZone = Math.ceil(area / coverage);
      const total = perZone * zones;
      return { result: total, label: 'Sprinkler Heads', unit: 'heads', steps: [`Coverage per sprinkler = π × ${radius}² = ${coverage.toFixed(1)} sq ft`, `Heads per zone = ceil(${area} ÷ ${coverage.toFixed(1)}) = ${perZone}`, `Total heads = ${perZone} × ${zones} zones = ${total}`] }
    },
    description: 'Estimates number of sprinkler heads needed for a lawn irrigation system.',
    formula: 'Sprinklers = ceil(Area / (π × r²)) × Zones',
    interpretation: 'Total sprinkler heads required. Adjust zone count for water pressure and coverage overlap.',
  },
  'masonry-wall': {
    schema: z.object({ wallLength: z.string(), wallHeight: z.string(), wallThickness: z.string(), mortarType: z.string() }),
    fields: [
      { name: 'wallLength', label: 'Wall Length (ft)', step: 1, min: 0 },
      { name: 'wallHeight', label: 'Wall Height (ft)', step: 1, min: 0 },
      { name: 'wallThickness', label: 'Wall Thickness (in)', step: 1, min: 0, placeholder: '8' },
      { name: 'mortarType', label: 'Mortar Type', type: 'select', options: [{ label: 'Type N', value: 'N' }, { label: 'Type S', value: 'S' }, { label: 'Type M', value: 'M' }] },
    ],
    compute: (v: Record<string, string>) => {
      const length = n(v.wallLength), height = n(v.wallHeight);
      const sqft = length * height;
      const blocks = Math.ceil(sqft * 1.125);
      return { result: blocks, label: 'Concrete Blocks', unit: 'blocks', steps: [`Wall area = ${length} ft × ${height} ft = ${sqft} sq ft`, `Blocks needed (1.125 per sq ft for 8×16 block) = ceil(${sqft} × 1.125) = ${blocks}`, `Mortar type selected: ${v.mortarType || 'N'}`] }
    },
    description: 'Estimates concrete blocks and mortar for a masonry wall.',
    formula: 'Blocks = ceil(Wall Area × 1.125)',
    interpretation: 'Number of standard 8×16 concrete blocks needed. Add 5-10% for waste and cuts.',
  },
  'stone-veneer': {
    schema: z.object({ wallArea: z.string(), stoneType: z.string() }),
    fields: [
      { name: 'wallArea', label: 'Wall Area (sq ft)', step: 1, min: 0 },
      { name: 'stoneType', label: 'Stone Type', type: 'select', options: [{ label: 'Natural', value: 'natural' }, { label: 'Cultured', value: 'cultured' }, { label: 'Ledgestone', value: 'ledgestone' }] },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.wallArea);
      return { result: area, label: 'Coverage Area', unit: 'sq ft', steps: [`Wall area = ${area} sq ft`, `Stone type: ${v.stoneType || 'natural'}`, `Coverage estimate: ${area} sq ft`] }
    },
    description: 'Calculates stone veneer coverage area for wall cladding.',
    formula: 'Coverage = Wall Area (sq ft)',
    interpretation: 'Total square footage of stone veneer needed. Order 10% extra for cuts and waste.',
  },
  'caulking': {
    schema: z.object({ totalGaps: z.string(), gapWidth: z.string(), gapDepth: z.string(), tubeSize: z.string() }),
    fields: [
      { name: 'totalGaps', label: 'Total Gap Length (linear ft)', step: 1, min: 0 },
      { name: 'gapWidth', label: 'Gap Width (in)', step: 0.125, min: 0, placeholder: '0.5' },
      { name: 'gapDepth', label: 'Gap Depth (in)', step: 0.125, min: 0, placeholder: '0.5' },
      { name: 'tubeSize', label: 'Tube Size (oz)', step: 1, min: 0, placeholder: '10' },
    ],
    compute: (v: Record<string, string>) => {
      const gaps = n(v.totalGaps), width = n(v.gapWidth), depth = n(v.gapDepth), tube = n(v.tubeSize);
      const linearFtPerTube = (tube * 0.5) / (width * depth);
      const tubes = Math.ceil(gaps / linearFtPerTube);
      return { result: tubes, label: 'Tubes Needed', unit: 'tubes', steps: [`Linear ft per tube = ${tube} oz × 0.5 ÷ (${width} × ${depth}) = ${linearFtPerTube.toFixed(1)} ft`, `Tubes = ceil(${gaps} ÷ ${linearFtPerTube.toFixed(1)}) = ${tubes}`] }
    },
    description: 'Estimates number of caulking tubes needed for sealing gaps.',
    formula: 'Tubes = ceil(Gap Length / (Tube Size × 0.5 / (Width × Depth)))',
    interpretation: 'Number of standard caulk tubes needed. Choose tube size closest to your application.',
  },
  'fascia-calculator': {
    schema: z.object({ roofEdgeLength: z.string(), boardWidth: z.string() }),
    fields: [
      { name: 'roofEdgeLength', label: 'Roof Edge Length (linear ft)', step: 1, min: 0 },
      { name: 'boardWidth', label: 'Board Width (in)', step: 1, min: 0, placeholder: '6' },
    ],
    compute: (v: Record<string, string>) => {
      const length = n(v.roofEdgeLength), width = n(v.boardWidth);
      const boards = Math.ceil(length / 12);
      return { result: length, label: 'Fascia Needed', unit: 'linear ft', steps: [`Total edge length = ${length} linear ft`, `Boards (12 ft each) = ceil(${length} ÷ 12) = ${boards}`, `Board width: ${width} in`] }
    },
    description: 'Calculates linear footage of fascia board needed for roof edges.',
    formula: 'Linear ft = Roof Edge Length, Boards = ceil(Length / 12)',
    interpretation: 'Total linear feet of fascia. Standard boards are 12 ft; round up for full boards.',
  },
  'gate-calculator': {
    schema: z.object({ gateWidth: z.string(), gateHeight: z.string(), gateType: z.string() }),
    fields: [
      { name: 'gateWidth', label: 'Gate Width (ft)', step: 0.5, min: 0 },
      { name: 'gateHeight', label: 'Gate Height (ft)', step: 0.5, min: 0, placeholder: '4' },
      { name: 'gateType', label: 'Gate Type', type: 'select', options: [{ label: 'Wood', value: 'wood' }, { label: 'Metal', value: 'metal' }, { label: 'Vinyl', value: 'vinyl' }] },
    ],
    compute: (v: Record<string, string>) => {
      const width = n(v.gateWidth), height = n(v.gateHeight);
      const sqft = width * height;
      return { result: sqft, label: 'Gate Area', unit: 'sq ft', steps: [`Gate area = ${width} ft × ${height} ft = ${sqft} sq ft`, `Gate type: ${v.gateType || 'wood'}`, `Frame perimeter = ${(2 * (width + height)).toFixed(1)} linear ft`] }
    },
    description: 'Estimates materials needed for building a gate.',
    formula: 'Area = Width × Height',
    interpretation: 'Total square footage of gate surface. Use to estimate framing, pickets, and hardware.',
  },
  'grout-calculator': {
    schema: z.object({ tileArea: z.string(), tileLength: z.string(), tileWidth: z.string(), groutJoint: z.string(), tileThickness: z.string() }),
    fields: [
      { name: 'tileArea', label: 'Tile Area (sq ft)', step: 1, min: 0 },
      { name: 'tileLength', label: 'Tile Length (in)', step: 0.5, min: 0, placeholder: '6' },
      { name: 'tileWidth', label: 'Tile Width (in)', step: 0.5, min: 0, placeholder: '6' },
      { name: 'groutJoint', label: 'Grout Joint Width (in)', step: 0.0625, min: 0, placeholder: '0.25' },
      { name: 'tileThickness', label: 'Tile Thickness (in)', step: 0.125, min: 0, placeholder: '0.375' },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.tileArea), tLen = n(v.tileLength), tWid = n(v.tileWidth), joint = n(v.groutJoint), thick = n(v.tileThickness);
      const tileFactor = (tLen + tWid) / (tLen * tWid);
      const groutLb = +(area * joint * thick * tileFactor * 1.5).toFixed(1);
      return { result: groutLb, label: 'Grout Needed', unit: 'lb', steps: [`Tile factor = (${tLen} + ${tWid}) ÷ (${tLen} × ${tWid}) = ${tileFactor.toFixed(4)}`, `Grout weight = ${area} × ${joint} × ${thick} × ${tileFactor.toFixed(4)} × 1.5 = ${groutLb} lb`] }
    },
    description: 'Estimates grout weight needed for tile installation.',
    formula: 'Grout lb = Area × Joint × Thickness × ((L+W)/(L×W)) × 1.5',
    interpretation: 'Pounds of sanded or unsanded grout needed. Round up to nearest full bag.',
  },
  'landscape-fabric': {
    schema: z.object({ bedArea: z.string(), rollWidth: z.string() }),
    fields: [
      { name: 'bedArea', label: 'Bed Area (sq ft)', step: 1, min: 0 },
      { name: 'rollWidth', label: 'Roll Width (ft)', step: 1, min: 0, placeholder: '6' },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.bedArea), width = n(v.rollWidth);
      const linearFt = Math.ceil(area / width);
      return { result: linearFt, label: 'Fabric Needed', unit: 'linear ft', steps: [`Linear ft = ${area} sq ft ÷ ${width} ft = ${linearFt} ft`, `Roll width: ${width} ft`] }
    },
    description: 'Calculates landscape fabric needed for garden beds.',
    formula: 'Linear ft = Area / Roll Width',
    interpretation: 'Linear footage of fabric at your chosen roll width. Add overlap allowance for seams.',
  },
  'soil-amendment': {
    schema: z.object({ bedArea: z.string(), amendmentDepth: z.string(), amendmentType: z.string() }),
    fields: [
      { name: 'bedArea', label: 'Bed Area (sq ft)', step: 1, min: 0 },
      { name: 'amendmentDepth', label: 'Amendment Depth (in)', step: 0.5, min: 0, placeholder: '2' },
      { name: 'amendmentType', label: 'Amendment Type', type: 'select', options: [{ label: 'Compost', value: 'compost' }, { label: 'Peat Moss', value: 'peat-moss' }, { label: 'Perlite', value: 'perlite' }, { label: 'Vermiculite', value: 'vermiculite' }] },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.bedArea), depth = n(v.amendmentDepth);
      const cy = +((area * (depth / 12)) / 27).toFixed(2);
      return { result: cy, label: 'Amendment Volume', unit: 'cubic yd', steps: [`Depth in ft = ${depth} in ÷ 12 = ${(depth / 12).toFixed(3)} ft`, `Volume CF = ${area} × ${(depth / 12).toFixed(3)} = ${+(area * depth / 12).toFixed(1)} CF`, `Volume CY = ${+(area * depth / 12).toFixed(1)} ÷ 27 = ${cy} CY`] }
    },
    description: 'Estimates soil amendment volume in cubic yards for garden beds.',
    formula: 'CY = (Area × Depth/12) / 27',
    interpretation: 'Cubic yards of amendment needed. One cubic yard covers ~162 sq ft at 2 in depth.',
  },
  'walkway-calculator': {
    schema: z.object({ walkwayLength: z.string(), walkwayWidth: z.string(), paverSize: z.string() }),
    fields: [
      { name: 'walkwayLength', label: 'Walkway Length (ft)', step: 1, min: 0 },
      { name: 'walkwayWidth', label: 'Walkway Width (ft)', step: 0.5, min: 0, placeholder: '3' },
      { name: 'paverSize', label: 'Paver Size', type: 'select', options: [{ label: '4×8 in', value: '4x8' }, { label: '6×6 in', value: '6x6' }, { label: '8×8 in', value: '8x8' }, { label: '12×12 in', value: '12x12' }] },
    ],
    compute: (v: Record<string, string>) => {
      const length = n(v.walkwayLength), width = n(v.walkwayWidth);
      const sizeMap = { '4x8': 32, '6x6': 36, '8x8': 64, '12x12': 144 };
      const sqIn = sizeMap[v.paverSize as keyof typeof sizeMap] || 36;
      const areaSqIn = length * width * 144;
      const pavers = Math.ceil(areaSqIn / sqIn);
      return { result: pavers, label: 'Pavers Needed', unit: 'pavers', steps: [`Walkway area = ${length} ft × ${width} ft = ${length * width} sq ft`, `Area in sq in = ${length * width} × 144 = ${areaSqIn} sq in`, `Paver area = ${sqIn} sq in (${v.paverSize})`, `Pavers = ceil(${areaSqIn} ÷ ${sqIn}) = ${pavers}`] }
    },
    description: 'Calculates number of pavers needed for a walkway.',
    formula: 'Pavers = ceil((L × W × 144) / Paver Sq In)',
    interpretation: 'Number of pavers required. Add 5-10% for cuts, breakage, and pattern adjustments.',
  },
  'weatherstripping': {
    schema: z.object({ doorWidth: z.string(), doorCount: z.string(), windowPerimeter: z.string(), windowCount: z.string() }),
    fields: [
      { name: 'doorWidth', label: 'Door Width (ft)', step: 0.5, min: 0, placeholder: '3' },
      { name: 'doorCount', label: 'Number of Doors', step: 1, min: 0, placeholder: '1' },
      { name: 'windowPerimeter', label: 'Window Perimeter (ft)', step: 1, min: 0, placeholder: '0' },
      { name: 'windowCount', label: 'Number of Windows', step: 1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      const doorW = n(v.doorWidth), doors = n(v.doorCount), winPerim = n(v.windowPerimeter), winCount = n(v.windowCount);
      const doorLF = doorW * 2 * doors;
      const winLF = winPerim * winCount;
      const totalLF = doorLF + winLF;
      return { result: totalLF, label: 'Weatherstripping Needed', unit: 'linear ft', steps: [`Doors: ${doorW} ft × 2 sides × ${doors} = ${doorLF} ft`, `Windows: ${winPerim} ft × ${winCount} = ${winLF} ft`, `Total = ${doorLF} + ${winLF} = ${totalLF} ft`] }
    },
    description: 'Estimates weatherstripping length needed for doors and windows.',
    formula: 'Total LF = (Door Width × 2 × Door Count) + (Window Perimeter × Window Count)',
    interpretation: 'Linear footage of weatherstripping. Measure each opening for accuracy.',
  },
  'hydroseed': {
    schema: z.object({ area: z.string(), seedMix: z.string(), slope: z.string() }),
    fields: [
      { name: 'area', label: 'Area (sq ft)', step: 1, min: 0 },
      { name: 'seedMix', label: 'Seed Mix', type: 'select', options: [{ label: 'Premium', value: 'premium' }, { label: 'Standard', value: 'standard' }, { label: 'Economy', value: 'economy' }] },
      { name: 'slope', label: 'Slope', type: 'select', options: [{ label: 'Flat', value: 'flat' }, { label: 'Moderate', value: 'moderate' }, { label: 'Steep', value: 'steep' }] },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.area);
      const coverageRates = { premium: 400, standard: 500, economy: 600 };
      const slopeFactors = { flat: 1, moderate: 1.15, steep: 1.3 };
      const rate = coverageRates[v.seedMix as keyof typeof coverageRates] || 500;
      const factor = slopeFactors[v.slope as keyof typeof slopeFactors] || 1;
      const seedLb = +(area / (rate / factor)).toFixed(1);
      return { result: seedLb, label: 'Seed Needed', unit: 'lb', steps: [`Coverage rate for ${v.seedMix} = ${rate} sq ft/lb`, `Slope factor for ${v.slope} = ${factor}`, `Seed = ${area} ÷ (${rate} ÷ ${factor}) = ${seedLb} lb`] }
    },
    description: 'Estimates hydroseeding seed quantity based on area, mix, and slope.',
    formula: 'Seed lb = Area / (Base Rate / Slope Factor)',
    interpretation: 'Pounds of seed for hydroseeding. Steep slopes require more seed for erosion control.',
  },
  'seed-calculator': {
    schema: z.object({ lawnArea: z.string(), grassType: z.string() }),
    fields: [
      { name: 'lawnArea', label: 'Lawn Area (sq ft)', step: 1, min: 0 },
      { name: 'grassType', label: 'Grass Type', type: 'select', options: [{ label: 'Fescue', value: 'fescue' }, { label: 'Bluegrass', value: 'bluegrass' }, { label: 'Rye', value: 'rye' }, { label: 'Bermuda', value: 'bermuda' }] },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.lawnArea);
      const rates = { fescue: 8, bluegrass: 3, rye: 10, bermuda: 2 };
      const rate = rates[v.grassType as keyof typeof rates] || 8;
      const lb = +(area / rate).toFixed(1);
      return { result: lb, label: 'Seed Needed', unit: 'lb', steps: [`Seeding rate for ${v.grassType} = 1 lb per ${rate} sq ft`, `Seed = ${area} ÷ ${rate} = ${lb} lb`] }
    },
    description: 'Calculates grass seed needed for lawn establishment or overseeding.',
    formula: 'Seed lb = Area / Seeding Rate (sq ft per lb)',
    interpretation: 'Pounds of seed for the selected grass type. Use for new lawns or overseeding.',
  },
  'exterior-insulation': {
    schema: z.object({ wallArea: z.string(), rValue: z.string(), furring: z.string() }),
    fields: [
      { name: 'wallArea', label: 'Wall Area (sq ft)', step: 1, min: 0 },
      { name: 'rValue', label: 'R-Value', type: 'select', options: [{ label: 'R-5', value: 'R-5' }, { label: 'R-10', value: 'R-10' }, { label: 'R-15', value: 'R-15' }, { label: 'R-20', value: 'R-20' }] },
      { name: 'furring', label: 'Furring Strips', type: 'select', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.wallArea);
      const boards = Math.ceil(area / 32);
      return { result: boards, label: 'Insulation Boards', unit: 'boards (4×8 sheets)', steps: [`Wall area = ${area} sq ft`, `Board coverage (4×8) = 32 sq ft`, `Boards = ceil(${area} ÷ 32) = ${boards}`] }
    },
    description: 'Estimates exterior rigid insulation boards needed for walls.',
    formula: 'Boards = ceil(Wall Area / 32)',
    interpretation: 'Number of 4×8 ft rigid insulation boards. R-value and furring affect installation method.',
  },
  'exterior-paint': {
    schema: z.object({ wallArea: z.string(), coats: z.string(), paintType: z.string() }),
    fields: [
      { name: 'wallArea', label: 'Wall Area (sq ft)', step: 1, min: 0 },
      { name: 'coats', label: 'Number of Coats', step: 1, min: 1, placeholder: '2' },
      { name: 'paintType', label: 'Paint Type', type: 'select', options: [{ label: 'Latex', value: 'latex' }, { label: 'Oil', value: 'oil' }, { label: 'Elastomeric', value: 'elastomeric' }] },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.wallArea), coats = n(v.coats);
      const gallons = Math.ceil((area * coats) / 350);
      return { result: gallons, label: 'Paint Needed', unit: 'gallons', steps: [`Total coverage = ${area} sq ft × ${coats} coats = ${area * coats} sq ft`, `Gallons = ceil(${area * coats} ÷ 350) = ${gallons}`] }
    },
    description: 'Estimates exterior paint needed for walls.',
    formula: 'Gallons = ceil((Area × Coats) / 350)',
    interpretation: 'Gallons of paint. Elastomeric may have different coverage; adjust if manufacturer specifies.',
  },
  'stamped-concrete': {
    schema: z.object({ slabArea: z.string(), thickness: z.string(), pattern: z.string() }),
    fields: [
      { name: 'slabArea', label: 'Slab Area (sq ft)', step: 1, min: 0 },
      { name: 'thickness', label: 'Thickness (in)', step: 1, min: 0, placeholder: '4' },
      { name: 'pattern', label: 'Pattern', type: 'select', options: [{ label: 'Ashlar Slate', value: 'ashlar-slate' }, { label: 'Basket Weave', value: 'basket-weave' }, { label: 'Cobblestone', value: 'cobblestone' }, { label: 'European Fan', value: 'european-fan' }] },
    ],
    compute: (v: Record<string, string>) => {
      const area = n(v.slabArea), thick = n(v.thickness);
      const cf = area * (thick / 12);
      const cy = +(cf / 27).toFixed(2);
      return { result: cy, label: 'Concrete Volume', unit: 'cubic yd', steps: [`Volume CF = ${area} sq ft × (${thick} in ÷ 12) = ${cf.toFixed(1)} CF`, `Volume CY = ${cf.toFixed(1)} ÷ 27 = ${cy} CY`, `Pattern: ${v.pattern || 'ashlar-slate'} — stamping adds ~$4-8/sq ft`] }
    },
    description: 'Calculates concrete volume and stamp pattern material estimate.',
    formula: 'CY = (Area × Thickness/12) / 27',
    interpretation: 'Cubic yards of concrete for stamped slab. Stamping adds material and labor costs per sq ft.',
  },
  'steps-concrete': {
    schema: z.object({ stepCount: z.string(), stepWidth: z.string(), stepRise: z.string(), stepRun: z.string() }),
    fields: [
      { name: 'stepCount', label: 'Number of Steps', step: 1, min: 1 },
      { name: 'stepWidth', label: 'Step Width (ft)', step: 0.5, min: 0, placeholder: '4' },
      { name: 'stepRise', label: 'Step Rise (in)', step: 0.5, min: 0, placeholder: '7' },
      { name: 'stepRun', label: 'Step Run (in)', step: 0.5, min: 0, placeholder: '11' },
    ],
    compute: (v: Record<string, string>) => {
      const count = n(v.stepCount), width = n(v.stepWidth), rise = n(v.stepRise), run = n(v.stepRun);
      const riseFt = rise / 12, runFt = run / 12;
      const volPerStep = width * riseFt * runFt;
      const totalCF = +(volPerStep * count).toFixed(2);
      return { result: totalCF, label: 'Concrete Volume', unit: 'cubic ft', steps: [`Step rise = ${rise} in ÷ 12 = ${riseFt.toFixed(3)} ft`, `Step run = ${run} in ÷ 12 = ${runFt.toFixed(3)} ft`, `Volume per step = ${width} × ${riseFt.toFixed(3)} × ${runFt.toFixed(3)} = ${volPerStep.toFixed(3)} CF`, `Total = ${volPerStep.toFixed(3)} × ${count} steps = ${totalCF} CF`] }
    },
    description: 'Calculates concrete volume in cubic feet for poured steps.',
    formula: 'CF = Step Count × Width × (Rise/12) × (Run/12)',
    interpretation: 'Cubic feet of concrete for steps. Does not include waste; add 5-10% for subgrade irregularities.',
  },
  'steps-stone': {
    schema: z.object({ stepCount: z.string(), stepWidth: z.string(), stoneThickness: z.string(), treadDepth: z.string() }),
    fields: [
      { name: 'stepCount', label: 'Number of Steps', step: 1, min: 1 },
      { name: 'stepWidth', label: 'Step Width (ft)', step: 0.5, min: 0, placeholder: '4' },
      { name: 'stoneThickness', label: 'Stone Thickness (in)', step: 0.5, min: 0, placeholder: '2' },
      { name: 'treadDepth', label: 'Tread Depth (in)', step: 0.5, min: 0, placeholder: '12' },
    ],
    compute: (v: Record<string, string>) => {
      const count = n(v.stepCount), width = n(v.stepWidth), thick = n(v.stoneThickness), tread = n(v.treadDepth);
      const treadFt = tread / 12;
      const sqftPerStep = width * treadFt;
      const totalSqFt = +(sqftPerStep * count).toFixed(1);
      return { result: totalSqFt, label: 'Stone Area', unit: 'sq ft', steps: [`Tread depth = ${tread} in ÷ 12 = ${treadFt.toFixed(3)} ft`, `Area per step = ${width} ft × ${treadFt.toFixed(3)} ft = ${sqftPerStep.toFixed(2)} sq ft`, `Total stone area = ${sqftPerStep.toFixed(2)} × ${count} steps = ${totalSqFt} sq ft`] }
    },
    description: 'Estimates stone surface area needed for stone steps.',
    formula: 'Sq ft = Step Count × Width × (Tread Depth/12)',
    interpretation: 'Square footage of stone tread material. Stone thickness affects sub-base preparation.',
  },
}