import { z } from 'zod'
import type { CalcDef } from './types'

function n(v: string | undefined): number { const x = parseFloat(v ?? ''); return isNaN(x) ? 0 : x }

export const calcDefsGroup5: Record<string, CalcDef> = {

'foundation-volume': { schema: z.object({ length: z.string(), width: z.string(), depth: z.string() }), fields: [{ name: 'length', label: 'Length (ft)', step: 0.1, min: 0 }, { name: 'width', label: 'Width (ft)', step: 0.1, min: 0 }, { name: 'depth', label: 'Depth (ft)', step: 0.1, min: 0 }], compute: (v) => { const vol = n(v.length) * n(v.width) * n(v.depth); return { result: vol, label: 'Foundation Volume', unit: 'cu ft', steps: [`${n(v.length)} × ${n(v.width)} × ${n(v.depth)} = ${vol.toFixed(2)} cu ft`] } }, description: 'Calculate concrete volume for a foundation.', formula: 'V = L × W × D', interpretation: 'Multiply length by width by depth for total cubic footage.' },

'footing-size': { schema: z.object({ load: z.string(), soilCapacity: z.string() }), fields: [{ name: 'load', label: 'Total Load (lbs)', step: 100, min: 0 }, { name: 'soilCapacity', label: 'Soil Bearing Capacity (psf)', placeholder: '1500', step: 100, min: 0 }], compute: (v) => { const area = n(v.soilCapacity) > 0 ? n(v.load) / n(v.soilCapacity) : 0; const size = Math.sqrt(area); return { result: size, label: 'Minimum Footing Size', unit: 'ft (square)', steps: [`Area needed: ${n(v.load).toFixed(0)} / ${n(v.soilCapacity).toFixed(0)} = ${area.toFixed(2)} sq ft`, `Square footing: ${size.toFixed(2)} ft × ${size.toFixed(2)} ft`] } }, description: 'Calculate minimum footing size based on load and soil capacity.', formula: 'Area = Load / SoilCapacity, Side = √Area', interpretation: 'Footing must distribute building load within soil bearing capacity.' },

'retaining-wall-thickness': { schema: z.object({ height: z.string(), soilPressure: z.string() }), fields: [{ name: 'height', label: 'Wall Height (ft)', step: 0.5, min: 0 }, { name: 'soilPressure', label: 'Soil Pressure (psf)', placeholder: '60', step: 5, min: 0 }], compute: (v) => { const thick = Math.max(0.5, n(v.height) * 0.1 + n(v.soilPressure) / 1000); return { result: thick, label: 'Min Wall Thickness', unit: 'ft', steps: [`Height: ${n(v.height)} ft, Soil pressure: ${n(v.soilPressure)} psf`, `Min thickness: ${thick.toFixed(3)} ft (${(thick * 12).toFixed(1)} in)`] } }, description: 'Calculate minimum retaining wall thickness.', formula: 'T = H × 0.1 + P/1000', interpretation: 'Thicker walls needed for taller heights and higher soil pressure.' },

'shear-wall-design': { schema: z.object({ length: z.string(), height: z.string(), seismicLoad: z.string() }), fields: [{ name: 'length', label: 'Wall Length (ft)', step: 1, min: 0 }, { name: 'height', label: 'Wall Height (ft)', step: 1, min: 0 }, { name: 'seismicLoad', label: 'Seismic Load (kips)', step: 0.5, min: 0 }], compute: (v) => { const area = n(v.length) * n(v.height) / 144; const shear = area > 0 ? n(v.seismicLoad) / area : 0; return { result: shear, label: 'Shear Stress', unit: 'ksi', steps: [`Wall area: ${n(v.length)} × ${n(v.height)} = ${area.toFixed(2)} sq ft (${(area * 144).toFixed(0)} sq in)`, `Shear stress: ${n(v.seismicLoad).toFixed(1)} / ${(area * 144).toFixed(0)} = ${shear.toFixed(3)} ksi`] } }, description: 'Calculate shear wall stress under seismic loads.', formula: 'τ = V / (L × H)', interpretation: 'Shear stress must be below material capacity (typical plywood: 0.5-1.0 ksi).' },

'formwork-area': { schema: z.object({ length: z.string(), width: z.string(), height: z.string() }), fields: [{ name: 'length', label: 'Length (ft)', step: 1, min: 0 }, { name: 'width', label: 'Width (ft)', step: 1, min: 0 }, { name: 'height', label: 'Height (ft)', step: 0.5, min: 0 }], compute: (v) => { const sides = 2 * n(v.length) * n(v.height) + 2 * n(v.width) * n(v.height); return { result: sides, label: 'Formwork Contact Area', unit: 'sq ft', steps: [`Side walls: 2 × ${n(v.length)} × ${n(v.height)} = ${(2 * n(v.length) * n(v.height)).toFixed(1)}`, `End walls: 2 × ${n(v.width)} × ${n(v.height)} = ${(2 * n(v.width) * n(v.height)).toFixed(1)}`, `Total: ${sides.toFixed(1)} sq ft`] } }, description: 'Calculate formwork contact area for concrete placement.', formula: 'A = 2(L×H + W×H)', interpretation: 'Contact area determines plywood and bracing material needed.' },

'rebar-spacing': { schema: z.object({ slabThick: z.string(), rebarSize: z.string(), maxSpacing: z.string() }), fields: [{ name: 'slabThick', label: 'Slab Thickness (in)', step: 0.5, min: 4 }, { name: 'rebarSize', label: 'Rebar Size (#)', type: 'select', options: [{ label: '#3 (3/8")', value: '3' }, { label: '#4 (1/2")', value: '4' }, { label: '#5 (5/8")', value: '5' }, { label: '#6 (3/4")', value: '6' }] }, { name: 'maxSpacing', label: 'Max Spacing (in)', placeholder: '18', step: 1, min: 6 }], compute: (v) => { const spacing = Math.min(n(v.maxSpacing || '18'), n(v.slabThick) * 3); return { result: spacing, label: 'Recommended Rebar Spacing', unit: 'in OC', steps: [`Based on ${n(v.slabThick)}" slab and #${n(v.rebarSize)} rebar`, `Max spacing: ${spacing.toFixed(0)} in on center`] } }, description: 'Calculate recommended rebar spacing for slabs.', formula: 'Spacing = min(MaxDesign, 3×Thickness)', interpretation: 'Rebar spacing should not exceed 3× slab thickness or 18 in per ACI 318.' },

'rebar-weight': { schema: z.object({ length: z.string(), rebarSize: z.string(), quantity: z.string() }), fields: [{ name: 'length', label: 'Length per Bar (ft)', step: 1, min: 0 }, { name: 'rebarSize', label: 'Rebar Size', type: 'select', options: [{ label: '#3 (0.376 lb/ft)', value: '3' }, { label: '#4 (0.668 lb/ft)', value: '4' }, { label: '#5 (1.043 lb/ft)', value: '5' }, { label: '#6 (1.502 lb/ft)', value: '6' }, { label: '#7 (2.044 lb/ft)', value: '7' }, { label: '#8 (2.670 lb/ft)', value: '8' }] }, { name: 'quantity', label: 'Number of Bars', step: 1, min: 1 }], compute: (v) => { const weights: Record<string, number> = { '3': 0.376, '4': 0.668, '5': 1.043, '6': 1.502, '7': 2.044, '8': 2.670 }; const w = weights[n(v.rebarSize)] || 0.668; const total = n(v.length) * n(v.quantity) * w; return { result: total, label: 'Total Rebar Weight', unit: 'lbs', steps: [`Bar weight: ${w.toFixed(3)} lb/ft × ${n(v.length)} ft × ${n(v.quantity)} bars`, `Total: ${total.toFixed(1)} lbs`] } }, description: 'Calculate total rebar weight for a project.', formula: 'Wt = Length × Qty × UnitWeight', interpretation: 'Rebar weight varies by diameter. Use for estimating shipping and handling.' },

'rebar-lap-splice': { schema: z.object({ rebarSize: z.string(), concreteStrength: z.string() }), fields: [{ name: 'rebarSize', label: 'Rebar Size', type: 'select', options: [{ label: '#3', value: '3' }, { label: '#4', value: '4' }, { label: '#5', value: '5' }, { label: '#6', value: '6' }, { label: '#7', value: '7' }, { label: '#8', value: '8' }] }, { name: 'concreteStrength', label: 'Concrete Strength (psi)', placeholder: '4000', type: 'select', options: [{ label: '3000 psi', value: '3000' }, { label: '4000 psi', value: '4000' }, { label: '5000 psi', value: '5000' }] }], compute: (v) => { const diaInches = n(v.rebarSize) / 8; const factor = n(v.concreteStrength) > 4000 ? 1 : 1.3; const lap = 40 * diaInches * factor; return { result: lap, label: 'Required Lap Splice Length', unit: 'in', steps: [`Bar dia: #${n(v.rebarSize)} = ${diaInches.toFixed(3)}"`, `Lap length (40db × ${factor.toFixed(2)}): ${lap.toFixed(1)} in (${(lap / 12).toFixed(2)} ft)`] } }, description: 'Calculate required rebar lap splice length.', formula: 'Lap = 40 × db × factor', interpretation: 'ACI 318 requires minimum lap length based on bar diameter and concrete strength.' },

'concrete-cylinder-strength': { schema: z.object({ load: z.string(), diameter: z.string() }), fields: [{ name: 'load', label: 'Max Load (lbs)', step: 100, min: 0 }, { name: 'diameter', label: 'Cylinder Diameter (in)', step: 0.1, placeholder: '6', min: 2 }], compute: (v) => { const area = Math.PI * Math.pow((n(v.diameter) || 6) / 2, 2); const psi = area > 0 ? n(v.load) / area : 0; return { result: psi, label: 'Compressive Strength', unit: 'psi', steps: [`Cylinder area: π × ${((n(v.diameter) || 6) / 2).toFixed(2)}² = ${area.toFixed(2)} sq in`, `Strength: ${n(v.load).toFixed(0)} / ${area.toFixed(2)} = ${psi.toFixed(0)} psi`] } }, description: 'Calculate concrete compressive strength from cylinder test.', formula: 'fc = P / A', interpretation: 'Standard 6in × 12in cylinder tested at 28 days. Min 3000 psi typical.' },

'concrete-slump': { schema: z.object({ water: z.string(), cement: z.string(), aggregate: z.string() }), fields: [{ name: 'water', label: 'Water Content (lbs/cy)', step: 5, min: 200 }, { name: 'cement', label: 'Cement Content (lbs/cy)', step: 10, min: 400 }, { name: 'aggregate', label: 'Aggregate Content (lbs/cy)', step: 50, min: 1000 }], compute: (v) => { const wcRatio = n(v.cement) > 0 ? n(v.water) / n(v.cement) : 0; const slump = Math.max(0.5, (wcRatio - 0.4) * 10); return { result: slump, label: 'Estimated Slump', unit: 'in', steps: [`W/C ratio: ${n(v.water)} / ${n(v.cement)} = ${wcRatio.toFixed(3)}`, `Estimated slump: ${slump.toFixed(1)} in`] } }, description: 'Estimate concrete slump from mix proportions.', formula: 'Slump ≈ (W/C - 0.4) × 10', interpretation: 'Higher W/C ratio yields higher slump (more workable but weaker).' },

'concrete-curing-time': { schema: z.object({ temp: z.string(), strength: z.string() }), fields: [{ name: 'temp', label: 'Curing Temperature (°F)', step: 5, min: 40, max: 100 }, { name: 'strength', label: 'Target Strength (%)', step: 5, min: 50, max: 100, placeholder: '70' }], compute: (v) => { const days = n(v.temp) >= 70 ? Math.ceil(n(v.strength || '70') / 15) : Math.ceil(n(v.strength || '70') / (8 + n(v.temp) * 0.1)); return { result: days, label: 'Estimated Curing Time', unit: 'days', steps: [`Temp: ${n(v.temp)}°F, Target: ${n(v.strength || '70')}%`, `Est. curing: ${days} days`] } }, description: 'Estimate concrete curing time based on temperature.', formula: 'Days ≈ Strength% / (8 + T × 0.1)', interpretation: 'Higher temperatures accelerate curing. 70°F: ~5 days for 70% strength.' },

'mortar-mix': { schema: z.object({ cement: z.string(), lime: z.string(), sand: z.string() }), fields: [{ name: 'cement', label: 'Cement (parts)', step: 0.5, min: 0.5, placeholder: '1' }, { name: 'lime', label: 'Lime (parts)', step: 0.25, min: 0, placeholder: '0.5' }, { name: 'sand', label: 'Sand (parts)', step: 0.5, min: 0.5, placeholder: '4.5' }], compute: (v) => { const total = n(v.cement) + n(v.lime || '0.5') + n(v.sand || '4.5'); const cRatio = total > 0 ? n(v.cement) / total * 100 : 0; return { result: cRatio, label: 'Cement Proportion', unit: '%', steps: [`Mix: ${n(v.cement)} : ${n(v.lime || '0.5')} : ${n(v.sand || '4.5')}`, `Type ${cRatio > 15 ? 'N' : cRatio > 10 ? 'S' : 'M'} mortar ratio`] } }, description: 'Calculate mortar mix proportions.', formula: 'Type N=1:0.5:4.5, Type S=1:0.3:4, Type M=1:0.25:3.5', interpretation: 'Mortar type determines strength: M > S > N for structural applications.' },

'grout-volume': { schema: z.object({ tileLen: z.string(), tileWid: z.string(), jointWid: z.string(), jointDep: z.string(), area: z.string() }), fields: [{ name: 'tileLen', label: 'Tile Length (in)', step: 0.5, min: 1 }, { name: 'tileWid', label: 'Tile Width (in)', step: 0.5, min: 1 }, { name: 'jointWid', label: 'Joint Width (in)', step: 0.0625, min: 0.0625, placeholder: '0.125' }, { name: 'jointDep', label: 'Joint Depth (in)', step: 0.0625, min: 0.0625, placeholder: '0.125' }, { name: 'area', label: 'Total Area (sq ft)', step: 1, min: 1 }], compute: (v) => { const tileArea = n(v.tileLen) * n(v.tileWid); const tilesPerSqFt = tileArea > 0 ? 144 / tileArea : 0; const jointsPerTile = 2 * (n(v.tileLen) + n(v.tileWid)); const groutVol = tilesPerSqFt * jointsPerTile * n(v.jointWid || '0.125') * n(v.jointDep || '0.125') / 144 * n(v.area); return { result: groutVol, label: 'Grout Volume Needed', unit: 'cu ft', steps: [`Tiles per sq ft: ${tilesPerSqFt.toFixed(1)}`, `Grout vol/sq ft: ${(tilesPerSqFt * jointsPerTile * n(v.jointWid || '0.125') * n(v.jointDep || '0.125') / 144).toFixed(4)} cu ft`, `Total: ${groutVol.toFixed(3)} cu ft (${(groutVol * 1728).toFixed(1)} cu in)`] } }, description: 'Calculate grout volume needed for tile installation.', formula: 'V = (Tiles/sqft × JointLength × Width × Depth) × Area', interpretation: 'Grout volume depends on tile size, joint width, and depth.' },

'brick-estimate': { schema: z.object({ wallLength: z.string(), wallHeight: z.string(), brickType: z.string() }), fields: [{ name: 'wallLength', label: 'Wall Length (ft)', step: 1, min: 0 }, { name: 'wallHeight', label: 'Wall Height (ft)', step: 1, min: 0 }, { name: 'brickType', label: 'Brick Type', type: 'select', options: [{ label: 'Modular (3.6×2.25×7.6)', value: 'modular' }, { label: 'Queen (3×2.75×8)', value: 'queen' }, { label: 'King (3×3×9)', value: 'king' }, { label: 'Engineer (4×3.2×7.6)', value: 'engineer' }] }], compute: (v) => { const rates: Record<string, number> = { modular: 6.85, queen: 5.45, king: 4.85, engineer: 5.75 }; const rate = rates[n(v.brickType)] || 6.85; const area = n(v.wallLength) * n(v.wallHeight); const bricks = Math.ceil(area * rate); return { result: bricks, label: 'Bricks Needed', unit: 'bricks', steps: [`Wall area: ${n(v.wallLength)} × ${n(v.wallHeight)} = ${area.toFixed(1)} sq ft`, `${rate.toFixed(2)} bricks/sq ft`, `Total: ~${bricks} bricks`] } }, description: 'Estimate bricks needed for a wall.', formula: 'Bricks = Area × Bricks/sqft', interpretation: 'Modular bricks: ~6.85 per sq ft with 3/8" mortar joint. Add 5% waste.' },

'block-estimate': { schema: z.object({ wallLength: z.string(), wallHeight: z.string() }), fields: [{ name: 'wallLength', label: 'Wall Length (ft)', step: 1, min: 0 }, { name: 'wallHeight', label: 'Wall Height (ft)', step: 1, min: 0 }], compute: (v) => { const area = n(v.wallLength) * n(v.wallHeight); const blocks = Math.ceil(area * 1.125); const mortar = area * 0.037; return { result: blocks, label: 'Concrete Blocks Needed', unit: 'blocks', steps: [`Wall area: ${area.toFixed(1)} sq ft`, `Blocks (1.125/sq ft): ~${blocks}`, `Mortar: ~${mortar.toFixed(2)} cu yd`] } }, description: 'Estimate concrete blocks and mortar for a wall.', formula: 'Blocks = Area × 1.125 (8×16 blocks with 3/8" joint)', interpretation: 'Standard 8×16 CMU blocks. One block covers 0.89 sq ft including mortar joint.' },

'paver-base-thickness': { schema: z.object({ pavType: z.string(), soilType: z.string(), traffic: z.string() }), fields: [{ name: 'pavType', label: 'Paver Type', type: 'select', options: [{ label: 'Brick/Concrete', value: 'concrete' }, { label: 'Natural Stone', value: 'stone' }] }, { name: 'soilType', label: 'Soil Type', type: 'select', options: [{ label: 'Well-drained (sand)', value: 'sand' }, { label: 'Average (silt/loam)', value: 'silt' }, { label: 'Poor (clay)', value: 'clay' }] }, { name: 'traffic', label: 'Traffic', type: 'select', options: [{ label: 'Pedestrian only', value: 'ped' }, { label: 'Light vehicle', value: 'light' }, { label: 'Heavy vehicle', value: 'heavy' }] }], compute: (v) => { const baseMin: Record<string, number> = { sand: 4, silt: 6, clay: 8 }; const trafficAdd: Record<string, number> = { ped: 0, light: 4, heavy: 8 }; const thick = (baseMin[n(v.soilType)] || 6) + (trafficAdd[n(v.traffic)] || 0); return { result: thick, label: 'Base Thickness Required', unit: 'in', steps: [`Soil: ${n(v.soilType)}, Traffic: ${n(v.traffic)}`, `Base thickness: ${thick} in`] } }, description: 'Calculate required paver base thickness.', formula: 'Thickness = SoilBase + TrafficAdd', interpretation: 'Proper base compaction is critical. Minimum 4" for pedestrian, 8-12" for vehicle traffic.' },

'gravel-estimate': { schema: z.object({ length: z.string(), width: z.string(), depth: z.string() }), fields: [{ name: 'length', label: 'Length (ft)', step: 1, min: 0 }, { name: 'width', label: 'Width (ft)', step: 1, min: 0 }, { name: 'depth', label: 'Depth (in)', step: 0.5, min: 1 }], compute: (v) => { const cf = n(v.length) * n(v.width) * (n(v.depth) / 12); const cy = cf / 27; return { result: cy, label: 'Gravel Needed', unit: 'cu yd', steps: [`${n(v.length)} × ${n(v.width)} × ${(n(v.depth) / 12).toFixed(2)} ft = ${cf.toFixed(2)} cu ft`, `${cf.toFixed(2)} / 27 = ${cy.toFixed(3)} cu yd`] } }, description: 'Estimate gravel volume needed for a project.', formula: 'V = L × W × (D/12) / 27', interpretation: 'Compacted gravel settles ~10%. Order 10% extra.' },

'crushed-stone-volume': { schema: z.object({ length: z.string(), width: z.string(), depth: z.string() }), fields: [{ name: 'length', label: 'Length (ft)', step: 1, min: 0 }, { name: 'width', label: 'Width (ft)', step: 1, min: 0 }, { name: 'depth', label: 'Depth (in)', step: 0.5, min: 1 }], compute: (v) => { const cf = n(v.length) * n(v.width) * (n(v.depth) / 12); const tons = cf * 0.055; return { result: tons, label: 'Crushed Stone Needed', unit: 'tons', steps: [`Volume: ${cf.toFixed(2)} cu ft`, `Weight: ${cf.toFixed(2)} × 0.055 = ${tons.toFixed(2)} tons`, `Add 10% waste: ${(tons * 1.1).toFixed(2)} tons`] } }, description: 'Calculate crushed stone tonnage needed.', formula: 'Tons = L × W × D/12 × 0.055', interpretation: 'Crushed stone weighs ~110 lb/cu ft. Varies by stone type and compaction.' },

'sand-volume': { schema: z.object({ length: z.string(), width: z.string(), depth: z.string() }), fields: [{ name: 'length', label: 'Length (ft)', step: 1, min: 0 }, { name: 'width', label: 'Width (ft)', step: 1, min: 0 }, { name: 'depth', label: 'Depth (in)', step: 0.5, min: 1 }], compute: (v) => { const cf = n(v.length) * n(v.width) * (n(v.depth) / 12); const tons = cf * 0.054; return { result: tons, label: 'Sand Needed', unit: 'tons', steps: [`Volume: ${cf.toFixed(2)} cu ft`, `Weight: ${cf.toFixed(2)} × 0.054 = ${tons.toFixed(2)} tons`] } }, description: 'Calculate sand tonnage needed for construction.', formula: 'Tons = L × W × D/12 × 0.054', interpretation: 'Dry sand weighs ~100 lb/cu ft, wet sand ~120 lb/cu ft.' },

'topsoil-volume': { schema: z.object({ length: z.string(), width: z.string(), depth: z.string() }), fields: [{ name: 'length', label: 'Length (ft)', step: 1, min: 0 }, { name: 'width', label: 'Width (ft)', step: 1, min: 0 }, { name: 'depth', label: 'Depth (in)', step: 0.5, min: 2 }], compute: (v) => { const cf = n(v.length) * n(v.width) * (n(v.depth) / 12); const cy = cf / 27; return { result: cy, label: 'Topsoil Needed', unit: 'cu yd', steps: [`${n(v.length)} × ${n(v.width)} × ${(n(v.depth) / 12).toFixed(2)} ft = ${cf.toFixed(2)} cu ft`, `${cf.toFixed(2)} / 27 = ${cy.toFixed(3)} cu yd`] } }, description: 'Calculate topsoil volume needed for landscaping.', formula: 'V = L × W × (D/12) / 27', interpretation: 'One cubic yard covers ~100 sq ft at 3" depth.' },

'conductor-sizing': { schema: z.object({ amps: z.string(), material: z.string(), length: z.string() }), fields: [{ name: 'amps', label: 'Current (A)', step: 5, min: 0 }, { name: 'material', label: 'Conductor Material', type: 'select', options: [{ label: 'Copper', value: 'cu' }, { label: 'Aluminum', value: 'al' }] }, { name: 'length', label: 'One-Way Length (ft)', step: 10, min: 0 }], compute: (v) => { const i = n(v.amps);       const isCu = String(v.material) === 'cu'; const ampsMap = [15,20,30,40,55,70,85,95,110,125,150,175,200,230,260,300,350,400]; const labels = ['14 AWG','12 AWG','10 AWG','8 AWG','6 AWG','4 AWG','3 AWG','2 AWG','1 AWG','1/0','2/0','3/0','4/0','250kcmil','300kcmil','350kcmil','400kcmil','500kcmil']; let g = 0; const limit = isCu ? 0.8 : 0.65; while (g < ampsMap.length && i > ampsMap[g] * limit) g++; g = Math.min(g, labels.length - 1); const vd = 2 * 12.9 * n(v.length) * i / [4110,6530,10380,16510,26240,41740,52620,66360,83690,105600,133100,167800,211600,268000,339000,424000,526000,653000][Math.min(g, 17)]; return { result: labels[g], label: 'Rec Conductor', unit: '', steps: [`Load: ${i} A, Material: ${isCu ? 'Cu' : 'Al'}`, `Rec: ${labels[g]}, Est VD: ${vd.toFixed(1)} V`] } }, description: 'Size electrical conductor per NEC ampacity.', formula: 'NEC Table 310.15(B)(16) w/ 80% derating', interpretation: 'Continuous loads limited to 80% of rated ampacity.' },

'voltage-drop': { schema: z.object({ amps: z.string(), length: z.string(), size: z.string(), material: z.string() }), fields: [{ name: 'amps', label: 'Current (A)', step: 1, min: 0 }, { name: 'length', label: 'One-Way Length (ft)', step: 10, min: 0 }, { name: 'size', label: 'Conductor Size', type: 'select', options: [{ label: '14 AWG', value: '14' }, { label: '12 AWG', value: '12' }, { label: '10 AWG', value: '10' }, { label: '8 AWG', value: '8' }, { label: '6 AWG', value: '6' }, { label: '4 AWG', value: '4' }, { label: '2 AWG', value: '2' }, { label: '1/0', value: '0' }] }, { name: 'material', label: 'Material', type: 'select', options: [{ label: 'Copper', value: 'cu' }, { label: 'Aluminum', value: 'al' }] }], compute: (v) => {       const k = String(v.material) === 'al' ? 21.2 : 12.9; const cmil: Record<string,number> = {'14':4110,'12':6530,'10':10380,'8':16510,'6':26240,'4':41740,'2':66360,'0':105600}; const vd = 2 * k * n(v.length) * n(v.amps) / (cmil[n(v.size)]||6530); const pct = vd / 240 * 100; return { result: vd, label: 'Voltage Drop', unit: 'V', steps: [`VD=2×${k}×${n(v.length)}×${n(v.amps)}/${cmil[n(v.size)]||6530}`, `${vd.toFixed(2)} V (${pct.toFixed(1)}% at 240V)`] } }, description: 'Calculate voltage drop over conductor length.', formula: 'VD = 2 × K × L × I / CM', interpretation: 'NEC recommends <3% drop for branch circuits, <5% total.' },

'wire-ampacity': { schema: z.object({ size: z.string(), material: z.string() }), fields: [{ name: 'size', label: 'Conductor Size', type: 'select', options: [{ label: '14 AWG', value: '14' }, { label: '12 AWG', value: '12' }, { label: '10 AWG', value: '10' }, { label: '8 AWG', value: '8' }, { label: '6 AWG', value: '6' }, { label: '4 AWG', value: '4' }, { label: '2 AWG', value: '2' }, { label: '1/0', value: '0' }] }, { name: 'material', label: 'Material', type: 'select', options: [{ label: 'Cu 60C', value: 'cu60' }, { label: 'Cu 75C', value: 'cu75' }, { label: 'Cu 90C', value: 'cu90' }, { label: 'Al 75C', value: 'al75' }] }], compute: (v) => { const base: Record<string,number> = {'14':20,'12':25,'10':35,'8':55,'6':75,'4':100,'2':135,'0':195}; const factors: Record<string,number> = {cu60:0.8,cu75:1,cu90:1.1,al75:0.75}; const a = Math.round((base[n(v.size)]||20) * (factors[n(v.material)]||1)); return { result: a, label: 'Max Ampacity', unit: 'A', steps: [`Size: ${n(v.size)}, Material: ${n(v.material)}`, `Ampacity: ${a} A`] } }, description: 'Look up wire ampacity per NEC.', formula: 'NEC Table 310.15(B)(16)', interpretation: 'Continuous loads <= 80% of rating. 90C limited to 75C terminations.' },

'conduit-fill': { schema: z.object({ conductors: z.string(), wireSize: z.string(), conduitType: z.string() }), fields: [{ name: 'conductors', label: 'Conductors', step: 1, min: 1 }, { name: 'wireSize', label: 'Wire Size', type: 'select', options: [{ label: '12 AWG THHN', value: '12' }, { label: '10 AWG THHN', value: '10' }, { label: '8 AWG THHN', value: '8' }, { label: '6 AWG THHN', value: '6' }, { label: '4 AWG THHN', value: '4' }] }, { name: 'conduitType', label: 'Conduit', type: 'select', options: [{ label: '1/2" EMT', value: 'emt05' }, { label: '3/4" EMT', value: 'emt075' }, { label: '1" EMT', value: 'emt1' }, { label: '1" PVC-40', value: 'pvc1' }] }], compute: (v) => { const areas: Record<string,number> = {'12':0.0133,'10':0.0211,'8':0.0366,'6':0.0507,'4':0.0824}; const ca: Record<string,number> = {emt05:0.304,emt075:0.533,emt1:0.864,pvc1:0.777}; const nCond = n(v.conductors); const fillFactor = nCond <= 2 ? 0.31 : nCond <= 9 ? 0.4 : 0.35; const maxCond = Math.floor((ca[n(v.conduitType)]||0.864) * fillFactor / (areas[n(v.wireSize)]||0.0133)); return { result: maxCond, label: 'Max Conductors', unit: '', steps: [`Wire: ${n(v.wireSize)}, Conduit: ${n(v.conduitType)}`, `${Math.min(nCond, maxCond)}/${maxCond} — ${nCond <= maxCond ? 'PASS' : 'OVER FILL'}`] } }, description: 'Check conduit fill capacity per NEC.', formula: 'NEC Ch 9 Tables 1-4', interpretation: 'Max fill: 53% (1 wire), 31% (2), 40% (3+).' },

'panel-load': { schema: z.object({ sqft: z.string(), circuits: z.string(), appliances: z.string(), hvac: z.string() }), fields: [{ name: 'sqft', label: 'Floor Area (sq ft)', step: 100, min: 0 }, { name: 'circuits', label: 'Small Appliance Circuits', placeholder: '2', step: 1, min: 0 }, { name: 'appliances', label: 'Appliance Load (VA)', placeholder: '5000', step: 500, min: 0 }, { name: 'hvac', label: 'HVAC Load (VA)', placeholder: '4000', step: 500, min: 0 }], compute: (v) => { const gl = n(v.sqft) * 3; const sc = n(v.circuits||'2') * 1500; const tot = gl + sc + n(v.appliances||'5000') + n(v.hvac||'4000'); const demand = Math.min(tot, 10000) + Math.max(0, tot - 10000) * 0.4; const panelA = Math.ceil(demand / 240) * 2; return { result: demand, label: 'Demand Load', unit: 'VA', steps: [`Lighting: ${n(v.sqft)}×3=${gl} VA, Kit: ${sc} VA`, `Total: ${tot.toFixed(0)} VA, Demand: ${demand.toFixed(0)} VA`, `Min panel: ${panelA >= 200 ? 200 : 100} A`] } }, description: 'Calc residential panel load per NEC 220.82.', formula: 'NEC 220.82', interpretation: '100 A for most homes, 200 A for >2500 sqft.' },

'trench-excavation': { schema: z.object({ length: z.string(), depth: z.string(), width: z.string() }), fields: [{ name: 'length', label: 'Length (ft)', step: 1, min: 0 }, { name: 'depth', label: 'Depth (ft)', step: 0.5, min: 0 }, { name: 'width', label: 'Width (ft)', step: 0.5, min: 0 }], compute: (v) => { const cy = n(v.length) * n(v.depth) * n(v.width) / 27; return { result: cy, label: 'Excavation Volume', unit: 'cu yd', steps: [`${n(v.length)}×${n(v.depth)}×${n(v.width)}=${(n(v.length)*n(v.depth)*n(v.width)).toFixed(1)} cf`, `${(n(v.length)*n(v.depth)*n(v.width)).toFixed(1)}/27=${cy.toFixed(2)} cy`] } }, description: 'Calculate trench excavation volume.', formula: 'V=L×W×D/27', interpretation: 'Excavated material swells 20-30% (bank to loose).'},

'bulk-excavation': { schema: z.object({ area: z.string(), depth: z.string(), swell: z.string() }), fields: [{ name: 'area', label: 'Site Area (sq ft)', step: 100, min: 0 }, { name: 'depth', label: 'Avg Depth (ft)', step: 0.5, min: 0 }, { name: 'swell', label: 'Swell Factor (%)', placeholder: '25', step: 5, min: 0 }], compute: (v) => { const bank = n(v.area) * n(v.depth) / 27; const loose = bank * (1 + (n(v.swell||'25')/100)); return { result: loose, label: 'Loose Volume', unit: 'cu yd', steps: [`Bank: ${bank.toFixed(2)} cy`, `Swell ${n(v.swell||'25')}%: ${loose.toFixed(2)} cy`] } }, description: 'Bulk excavation with swell factor.', formula: 'Loose = Bank × (1+Swell/100)', interpretation: 'Clay ~30%, sand ~15%, rock ~50% swell.' },

'shoring-height': { schema: z.object({ depth: z.string(), soil: z.string() }), fields: [{ name: 'depth', label: 'Trench Depth (ft)', step: 0.5, min: 0 }, { name: 'soil', label: 'Soil Type', type: 'select', options: [{ label: 'Type A (stable)', value: 'a' }, { label: 'Type B (moderate)', value: 'b' }, { label: 'Type C (unstable)', value: 'c' }] }], compute: (v) => { const slope: Record<string,number> = {a:1.5,b:1,c:0.5};       const safe = n(v.depth) * (slope[String(v.soil)]||1); return { result: safe, label: 'Safe Depth w/ Slope', unit: 'ft', steps: [`Depth: ${n(v.depth)} ft, Soil: Type ${String(v.soil).toUpperCase()}`, `Shoring req above ${n(v.depth)} ft per OSHA`] } }, description: 'Shoring requirements per OSHA.', formula: 'OSHA 29 CFR 1926 Subpart P', interpretation: 'OSHA requires protection for trenches ≥5 ft.' },

'sheet-pile-design': { schema: z.object({ height: z.string(), waterTable: z.string(), density: z.string() }), fields: [{ name: 'height', label: 'Retained Height (ft)', step: 1, min: 0 }, { name: 'waterTable', label: 'Water Table Height (ft)', step: 1, min: 0 }, { name: 'density', label: 'Soil Density (pcf)', placeholder: '120', step: 10, min: 60 }], compute: (v) => { const ep = 0.5 * (n(v.density)||120) * n(v.height) * n(v.height); const wp = n(v.waterTable) > 0 ? 0.5 * 62.4 * n(v.waterTable) * n(v.waterTable) : 0; return { result: ep+wp, label: 'Lateral Pressure', unit: 'lb/ft', steps: [`Earth: ${ep.toFixed(0)} lb/ft`, `Water: ${wp.toFixed(0)} lb/ft`, `Total: ${(ep+wp).toFixed(0)} lb/ft`] } }, description: 'Sheet pile lateral earth+water pressure.', formula: 'P = 0.5γH² + 0.5γwHw²', interpretation: 'Total pressure determines pile section modulus.' },

'soil-bearing-capacity': { schema: z.object({ soilType: z.string(), depth: z.string() }), fields: [{ name: 'soilType', label: 'Soil Type', type: 'select', options: [{ label: 'Bedrock', value: 'bedrock' }, { label: 'Gravel/sand', value: 'gravel' }, { label: 'Medium sand', value: 'sand' }, { label: 'Silt', value: 'silt' }, { label: 'Clay', value: 'clay' }] }, { name: 'depth', label: 'Depth (ft)', placeholder: '3', step: 1, min: 0 }], compute: (v) => { const b: Record<string,number> = {bedrock:12000,gravel:5000,sand:3000,silt:2000,clay:1500}; const cap = (b[n(v.soilType)]||3000) * (1 + (n(v.depth||'3')*0.05)); return { result: cap, label: 'Allowable Bearing', unit: 'psf', steps: [`Soil: ${n(v.soilType)}, Depth: ${n(v.depth||'3')} ft`, `Capacity: ${cap.toFixed(0)} psf`] } }, description: 'Estimate soil bearing capacity.', formula: 'q_allow = q_base × (1+0.05D)', interpretation: 'Always verify with geotechnical survey.' },

'pile-capacity': { schema: z.object({ pileType: z.string(), length: z.string(), skinFriction: z.string(), endBearing: z.string() }), fields: [{ name: 'pileType', label: 'Pile Type', type: 'select', options: [{ label: 'Friction', value: 'friction' }, { label: 'End-bearing', value: 'end' }, { label: 'Combination', value: 'comb' }] }, { name: 'length', label: 'Pile Length (ft)', step: 1, min: 0 }, { name: 'skinFriction', label: 'Skin Friction (psf)', placeholder: '1000', step: 100, min: 0 }, { name: 'endBearing', label: 'End Bearing (psf)', placeholder: '4000', step: 500, min: 0 }], compute: (v) => {       const skin = n(v.length) * 4 * (n(v.skinFriction)||1000); const end = String(v.pileType)==='friction' ? 0 : 144 * (n(v.endBearing)||4000)/144; const cap = String(v.pileType)==='end' ? end : String(v.pileType)==='friction' ? skin : skin+end; return { result: cap, label: 'Pile Capacity', unit: 'lbs', steps: [`Skin: ${skin.toFixed(0)} lbs`, `End: ${end.toFixed(0)} lbs`, `Total: ${cap.toFixed(0)} lbs (${(cap/2000).toFixed(1)} tons)`] } }, description: 'Pile capacity (friction + end bearing).', formula: 'Q=ΣqsAs+qpAp', interpretation: 'Safety factor of 2-3 on ultimate capacity.' },

'grade-stake-elevation': { schema: z.object({ bench: z.string(), rod: z.string(), grade: z.string() }), fields: [{ name: 'bench', label: 'Benchmark (ft)', step: 0.1, min: 0 }, { name: 'rod', label: 'Rod Reading (ft)', step: 0.01, min: 0 }, { name: 'grade', label: 'Desired Grade (ft)', step: 0.1, min: 0 }], compute: (v) => { const hi = n(v.bench) + n(v.rod); const cut = hi - n(v.grade); return { result: cut, label: 'Cut/Fill', unit: 'ft', steps: [`HI=${n(v.bench)}+${n(v.rod)}=${hi.toFixed(3)}`, `${cut>=0?'Cut':'Fill'}: ${Math.abs(cut).toFixed(3)} ft`] } }, description: 'Cut/fill from grade stake readings.', formula: 'Cut=(BM+BS)-Grade', interpretation: 'Positive=cut, negative=fill.' },

'slope-ratio': { schema: z.object({ rise: z.string(), run: z.string() }), fields: [{ name: 'rise', label: 'Rise (ft)', step: 0.5, min: 0 }, { name: 'run', label: 'Run (ft)', step: 0.5, min: 0 }], compute: (v) => { const pct = n(v.run)>0?(n(v.rise)/n(v.run))*100:0; const deg = n(v.run)>0?Math.atan2(n(v.rise),n(v.run))*180/Math.PI:0; return { result: pct, label: 'Slope', unit: '%', steps: [`Grade: ${pct.toFixed(1)}%`, `Ratio 1:${n(v.run)>0?(n(v.run)/n(v.rise)).toFixed(1):'N/A'}`, `${deg.toFixed(1)}°`] } }, description: 'Calculate slope % ratio and angle.', formula: 'Grade%=(Rise/Run)×100', interpretation: '10% = 1:10 = 5.7°. ADA max 8.33%.' },

'cross-slope': { schema: z.object({ width: z.string(), slopePct: z.string() }), fields: [{ name: 'width', label: 'Width (ft)', step: 1, min: 0 }, { name: 'slopePct', label: 'Cross Slope (%)', placeholder: '2', step: 0.25, min: 0.25 }], compute: (v) => { const drop = n(v.width)*(n(v.slopePct||'2')/100); return { result: drop, label: 'Elevation Diff', unit: 'ft', steps: [`Drop=${n(v.width)}×${(n(v.slopePct||'2')/100).toFixed(3)}`, `${drop.toFixed(4)} ft (${(drop*12).toFixed(2)} in)`] } }, description: 'Cross slope elevation difference.', formula: 'ΔH=W×S%', interpretation: 'Pavement: 1.5-2.5% cross slope for drainage.' },

'drainage-pipe-slope': { schema: z.object({ length: z.string(), drop: z.string() }), fields: [{ name: 'length', label: 'Pipe Length (ft)', step: 10, min: 0 }, { name: 'drop', label: 'Total Drop (ft)', step: 0.5, min: 0 }], compute: (v) => { const pct = n(v.length)>0?(n(v.drop)/n(v.length))*100:0; return { result: pct, label: 'Pipe Slope', unit: '%', steps: [`Slope: ${pct.toFixed(2)}%`, `${pct>=1?'Adequate':'<1% — poor drainage'}`] } }, description: 'Drainage pipe slope calculation.', formula: 'S=Drop/Length×100', interpretation: 'Min 1% (1/8 in/ft) recommended 2%.' },

'catchment-area': { schema: z.object({ area: z.string(), intensity: z.string(), coeff: z.string() }), fields: [{ name: 'area', label: 'Drainage Area (sq ft)', step: 100, min: 0 }, { name: 'intensity', label: 'Rainfall (in/hr)', placeholder: '3', step: 0.5, min: 0 }, { name: 'coeff', label: 'Runoff Coeff (C)', placeholder: '0.9', step: 0.05, min: 0, max: 1 }], compute: (v) => { const cfs = n(v.area)*(n(v.intensity||'3')/12)*(n(v.coeff||'0.9'))/3600; const gpm = cfs*448.83; return { result: gpm, label: 'Stormwater Flow', unit: 'GPM', steps: [`Q=${cfs.toFixed(3)} cfs`, `${gpm.toFixed(1)} GPM`] } }, description: 'Stormwater runoff via Rational Method.', formula: 'Q=C×I×A', interpretation: 'Use local IDF curves for design storm intensity.' },

'roof-pitch': { schema: z.object({ rise: z.string(), run: z.string() }), fields: [{ name: 'rise', label: 'Rise (in)', step: 0.5, min: 0 }, { name: 'run', label: 'Run (in)', placeholder: '12', step: 0.5, min: 1 }], compute: (v) => { const pitch = n(v.run)>0?(n(v.rise)/(n(v.run)||12))*12:0; const deg = n(v.run)>0?Math.atan2(n(v.rise),n(v.run)||12)*180/Math.PI:0; return { result: pitch, label: 'Roof Pitch', unit: ':12', steps: [`${pitch.toFixed(1)}:12 pitch (${deg.toFixed(1)}°)`] } }, description: 'Calculate roof pitch from rise/run.', formula: 'Pitch=(Rise/Run)×12', interpretation: '4:12=18.4° low slope. 12:12=45° steep.' },

'roof-area': { schema: z.object({ footprint: z.string(), pitch: z.string() }), fields: [{ name: 'footprint', label: 'Footprint (sq ft)', step: 100, min: 0 }, { name: 'pitch', label: 'Pitch (e.g. 6)', placeholder: '6', step: 1, min: 0 }], compute: (v) => { const m = 1/Math.cos(Math.atan2(n(v.pitch||'6'),12)); const area = n(v.footprint)*m; return { result: area, label: 'Roof Surface Area', unit: 'sq ft', steps: [`Multiplier: ×${m.toFixed(3)}`, `Area: ${area.toFixed(1)} sq ft`] } }, description: 'Roof surface area from footprint and pitch.', formula: 'Area=Footprint×Multiplier', interpretation: '4:12=×1.054, 12:12=×1.414.' },

'rafter-length': { schema: z.object({ span: z.string(), pitch: z.string(), overhang: z.string() }), fields: [{ name: 'span', label: 'Building Span (ft)', step: 1, min: 0 }, { name: 'pitch', label: 'Pitch', placeholder: '6', step: 1, min: 0 }, { name: 'overhang', label: 'Overhang (ft)', placeholder: '1', step: 0.5, min: 0 }], compute: (v) => { const hs = n(v.span)/2; const s = (n(v.pitch||'6')/12); const r = Math.sqrt(hs*hs+(hs*s)*(hs*s))+(n(v.overhang||'1')/Math.cos(Math.atan(s))); return { result: r, label: 'Rafter Length', unit: 'ft', steps: [`Half span: ${hs} ft`, `Rafter: ${r.toFixed(2)} ft`] } }, description: 'Rafter length for roof framing.', formula: 'R=√(S²+(S×P/12)²)+Overhang', interpretation: 'Measure from ridge to birdsmouth.' },

'stud-wall-layout': { schema: z.object({ wallLength: z.string(), spacing: z.string() }), fields: [{ name: 'wallLength', label: 'Wall Length (ft)', step: 1, min: 0 }, { name: 'spacing', label: 'Spacing', type: 'select', options: [{ label: '16" OC', value: '16' }, { label: '24" OC', value: '24' }] }], compute: (v) => { const sp = n(v.spacing)||16; const studs = Math.ceil((n(v.wallLength)*12)/sp)+1; return { result: studs, label: 'Studs Needed', unit: '', steps: [`Studs: ${studs}`, `Add for openings/corners`] } }, description: 'Stud count for wall layout.', formula: '(L×12/Spacing)+1', interpretation: 'Add 1 per corner, 2 per door/window.' },

'floor-joist-span': { schema: z.object({ lumber: z.string(), spacing: z.string(), load: z.string() }), fields: [{ name: 'lumber', label: 'Lumber', type: 'select', options: [{ label: '2×6', value: '2x6' }, { label: '2×8', value: '2x8' }, { label: '2×10', value: '2x10' }, { label: '2×12', value: '2x12' }] }, { name: 'spacing', label: 'Spacing', type: 'select', options: [{ label: '12"', value: '12' }, { label: '16"', value: '16' }, { label: '24"', value: '24' }] }, { name: 'load', label: 'Total Load (psf)', placeholder: '50', step: 10, min: 30 }], compute: (v) => { const spans: Record<string,Record<string,number>> = {'2x6':{'12':11.2,'16':10.1,'24':8.3},'2x8':{'12':14.7,'16':13.3,'24':11},'2x10':{'12':18.8,'16':17,'24':14.1},'2x12':{'12':22.7,'16':20.5,'24':17}}; const span = (spans[n(v.lumber)]?.[n(v.spacing)]||10)*Math.sqrt(40/(n(v.load)||50)); return { result: span, label: 'Max Joist Span', unit: 'ft', steps: [`Lumber: ${n(v.lumber)}, ${n(v.spacing)}" OC`, `Span: ${span.toFixed(1)} ft`] } }, description: 'Max floor joist span per IRC.', formula: 'IRC Table R502.3.1', interpretation: 'Spans for #2 SPF. LVL/I-joist can span longer.' },

'header-sizing': { schema: z.object({ opening: z.string(), loadType: z.string() }), fields: [{ name: 'opening', label: 'Opening Width (ft)', step: 0.5, min: 0 }, { name: 'loadType', label: 'Wall Type', type: 'select', options: [{ label: 'Load-bearing', value: 'bearing' }, { label: 'Non-load-bearing', value: 'nonBearing' }] }], compute: (v) => {       const isBearing = String(v.loadType)==='bearing'; const depth = isBearing ? Math.ceil(n(v.opening)*0.5)*2 : 4; return { result: depth, label: 'Header Depth', unit: 'in', steps: [`Opening: ${n(v.opening)} ft`, `Header: ${depth} in ${isBearing?'(2-ply)':'(2×4)'}`] } }, description: 'Header size for wall openings.', formula: 'IRC R602.7 — 1 in per ft span', interpretation: '2-2×6 for 6-8ft, 2-2×8 for 8-10ft.' },

'deck-post-spacing': { schema: z.object({ height: z.string(), postSize: z.string() }), fields: [{ name: 'height', label: 'Deck Height (ft)', step: 0.5, min: 0 }, { name: 'postSize', label: 'Post Size', type: 'select', options: [{ label: '4×4', value: '44' }, { label: '6×6', value: '66' }] }], compute: (v) => {       const max: Record<string,number> = {'44':6,'66':10}; const sp = (max[String(v.postSize)]||6)-Math.max(0,(n(v.height)-8)*0.5); return { result: Math.max(4,sp), label: 'Max Post Spacing', unit: 'ft', steps: [`Post: ${n(v.postSize)}, Height: ${n(v.height)} ft`, `Spacing: ${Math.max(4,sp).toFixed(1)} ft`] } }, description: 'Deck post spacing per IRC.', formula: 'IRC Table R507.3', interpretation: '6×6 posts span further than 4×4.' },

'stair-stringer': { schema: z.object({ totalRise: z.string(), riserHeight: z.string() }), fields: [{ name: 'totalRise', label: 'Total Rise (in)', step: 1, min: 0 }, { name: 'riserHeight', label: 'Riser Height (in)', placeholder: '7.5', step: 0.25, min: 4, max: 8 }], compute: (v) => { const r = n(v.riserHeight||'7.5'); const t = Math.max(10,25-r*2.5); const steps = Math.round(n(v.totalRise)/r); const run = (steps-1)*t; const stringer = Math.sqrt(n(v.totalRise)**2+run**2); return { result: stringer, label: 'Stringer Length', unit: 'in', steps: [`Steps: ${steps}, Tread: ${t.toFixed(1)} in`, `Stringer: ${stringer.toFixed(1)} in (${(stringer/12).toFixed(1)} ft)`] } }, description: 'Stair stringer for safe stairs.', formula: '2R+T=24-25 in', interpretation: 'Riser max 7.75", tread min 10" per IRC.' },

'concrete-bag-mix': { schema: z.object({ volume: z.string(), bagSize: z.string() }), fields: [{ name: 'volume', label: 'Volume Needed (cu ft)', step: 0.5, min: 0 }, { name: 'bagSize', label: 'Bag Size', type: 'select', options: [{ label: '60 lb (0.45 cf)', value: '60' }, { label: '80 lb (0.6 cf)', value: '80' }, { label: '94 lb (1.0 cf)', value: '94' }] }], compute: (v) => { const y: Record<string,number> = {'60':0.45,'80':0.6,'94':1};       const bags = Math.ceil(n(v.volume)/(y[String(v.bagSize)]||0.45)); return { result: bags, label: 'Bags Required', unit: '', steps: [`Bags: ${bags}`, `Water: ~${(bags*(String(v.bagSize)=='60'?0.25:String(v.bagSize)=='80'?0.33:0.4)).toFixed(1)} gal`] } }, description: 'Concrete bags needed for project.', formula: 'Bags=Volume/YieldPerBag', interpretation: '60lb=0.45cf, 80lb=0.6cf, 94lb=1.0cf.' },

'concrete-mix-design': { schema: z.object({ strength: z.string(), slump: z.string(), cement: z.string() }), fields: [{ name: 'strength', label: 'Target (psi)', type: 'select', options: [{ label: '3000 psi', value: '3000' }, { label: '4000 psi', value: '4000' }, { label: '5000 psi', value: '5000' }] }, { name: 'slump', label: 'Target Slump (in)', placeholder: '4', step: 0.5, min: 1 }, { name: 'cement', label: 'Cement (sacks/cy)', placeholder: '6', step: 0.5, min: 4 }], compute: (v) => { const wc = n(v.strength)>=5000?0.4:n(v.strength)>=4000?0.45:0.55; return { result: wc, label: 'W/C Ratio', unit: '', steps: [`W/C: ${wc.toFixed(2)}`, `Est water: ${(((n(v.cement)||6)*94*wc)).toFixed(0)} lb/cy`] } }, description: 'Concrete mix design per ACI 211.', formula: 'Water-Cement Ratio Law', interpretation: '0.45 W/C ≈ 4000 psi. Lower W/C=stronger.' },

'concrete-slab-load': { schema: z.object({ thick: z.string(), strength: z.string(), contactArea: z.string() }), fields: [{ name: 'thick', label: 'Slab Thickness (in)', step: 0.5, min: 4 }, { name: 'strength', label: 'Strength (psi)', placeholder: '4000', step: 500, min: 2000 }, { name: 'contactArea', label: 'Contact Area (sq in)', step: 10, min: 1 }], compute: (v) => { const cap = 0.85*(n(v.strength)||4000)*Math.min(Math.sqrt((n(v.contactArea)||100)/144),2); return { result: cap, label: 'Bearing Capacity', unit: 'psi', steps: [`Capacity: ${cap.toFixed(0)} psi`, `${(cap/144).toFixed(1)} psf`] } }, description: 'Slab bearing capacity per ACI 318.', formula: 'φPn=0.85fc√(A2/A1)', interpretation: 'Min 4" slab with proper subgrade.' },

'column-load': { schema: z.object({ length: z.string(), width: z.string(), height: z.string(), material: z.string() }), fields: [{ name: 'length', label: 'Length (in)', step: 0.5, min: 0 }, { name: 'width', label: 'Width (in)', step: 0.5, min: 0 }, { name: 'height', label: 'Height (ft)', step: 0.5, min: 0 }, { name: 'material', label: 'Material', type: 'select', options: [{ label: 'Concrete', value: 'conc' }, { label: 'Steel', value: 'steel' }, { label: 'Wood', value: 'wood' }] }], compute: (v) => { const a = (n(v.length)/12)*(n(v.width)/12);       const capacity = String(v.material)==='steel'?a*144*36000*0.6:String(v.material)==='conc'?a*144*3000*0.22:a*144*1200*0.6; return { result: capacity, label: 'Approx Column Capacity', unit: 'lbs', steps: [`Section: ${n(v.length)}×${n(v.width)} in`, `Capacity: ${capacity.toFixed(0)} lbs (${(capacity/2000).toFixed(1)} tons)`] } }, description: 'Column load capacity estimate.', formula: 'P=φFyA (steel) or φ0.85fcA (concrete)', interpretation: 'Depends on slenderness, bracing, connections.' },

'beam-deflection': { schema: z.object({ span: z.string(), load: z.string(), width: z.string(), depth: z.string(), material: z.string() }), fields: [{ name: 'span', label: 'Span (ft)', step: 0.5, min: 0 }, { name: 'load', label: 'Load (lbs)', step: 100, min: 0 }, { name: 'width', label: 'Beam Width (in)', step: 0.5, min: 0 }, { name: 'depth', label: 'Beam Depth (in)', step: 0.5, min: 0 }, { name: 'material', label: 'Material', type: 'select', options: [{ label: 'Steel (E=29M)', value: 'steel' }, { label: 'Wood (E=1.6M)', value: 'wood' }, { label: 'Concrete (E=4M)', value: 'conc' }] }], compute: (v) => { const e: Record<string,number> = {steel:29000000,wood:1600000,conc:4000000}; const I = (n(v.width)**3*n(v.depth)/12)/1728; const d = (n(v.load)*n(v.span)**3)/(48*(e[n(v.material)]||29000000)*12*I); const allow = n(v.span)*12/360; return { result: d, label: 'Max Deflection', unit: 'in', steps: [`δ: ${d.toFixed(4)} in`, `Allow L/360: ${allow.toFixed(3)} in — ${d<=allow?'PASS':'FAIL'}`] } }, description: 'Beam deflection under point load.', formula: 'δ=PL³/(48EI)', interpretation: 'L/360 for floors, L/240 for roofs.' },

'cantilever-beam': { schema: z.object({ length: z.string(), load: z.string(), width: z.string(), depth: z.string() }), fields: [{ name: 'length', label: 'Cantilever Length (ft)', step: 0.5, min: 0 }, { name: 'load', label: 'End Load (lbs)', step: 100, min: 0 }, { name: 'width', label: 'Width (in)', step: 0.5, min: 0 }, { name: 'depth', label: 'Depth (in)', step: 0.5, min: 0 }], compute: (v) => { const I = (n(v.width)**3*n(v.depth)/12)/1728; const d = (n(v.load)*n(v.length)**3)/(3*29000000*12*I); return { result: d, label: 'End Deflection', unit: 'in', steps: [`δ: ${d.toFixed(4)} in`, `Allow L/180: ${(n(v.length)*12/180).toFixed(3)} in`] } }, description: 'Cantilever beam end deflection.', formula: 'δ=PL³/(3EI)', interpretation: 'Cantilevers flexible. Limit L/180.' },

'lintel-design': { schema: z.object({ span: z.string(), depth: z.string(), wallAbove: z.string() }), fields: [{ name: 'span', label: 'Opening Width (ft)', step: 0.5, min: 0 }, { name: 'depth', label: 'Lintel Depth (in)', step: 1, min: 4 }, { name: 'wallAbove', label: 'Wall Above (ft)', step: 1, min: 0 }], compute: (v) => { const load = n(v.wallAbove)*(n(v.span)/2)*40+n(v.span)*15; const M = load*n(v.span)*12/8; const S = (n(v.depth)/12)*(n(v.depth)/12)**2*12/6; const stress = M/144/S; return { result: stress, label: 'Bending Stress', unit: 'psi', steps: [`Stress: ${stress.toFixed(0)} psi`, `Allow: 1800 conc, 24000 steel`] } }, description: 'Lintel bending stress over opening.', formula: 'M=wL²/8, fb=M/S', interpretation: 'Triangular masonry load distribution.' },

'propping-load': { schema: z.object({ area: z.string(), thick: z.string(), age: z.string() }), fields: [{ name: 'area', label: 'Slab Area (sq ft)', step: 50, min: 0 }, { name: 'thick', label: 'Thickness (in)', step: 0.5, min: 4 }, { name: 'age', label: 'Concrete Age (days)', step: 1, min: 1, max: 28 }], compute: (v) => { const wt = n(v.area)*(n(v.thick)/12)*150; const p = n(v.age)<7?wt:n(v.age)<14?wt*0.7:wt*0.4; return { result: p, label: 'Prop Load Required', unit: 'lbs', steps: [`Slab wt: ${wt.toFixed(0)} lbs`, `Age ${n(v.age)}d: ${p.toFixed(0)} lbs (${(p/2000).toFixed(1)} tons)`] } }, description: 'Propping load for formwork removal.', formula: 'W=A×T/12×150, reduce by strength', interpretation: 'Props until 75% strength (7-14 days).' },

'formwork-pressure': { schema: z.object({ height: z.string(), pourRate: z.string(), temp: z.string() }), fields: [{ name: 'height', label: 'Form Height (ft)', step: 1, min: 0 }, { name: 'pourRate', label: 'Pour Rate (ft/hr)', placeholder: '4', step: 1, min: 0 }, { name: 'temp', label: 'Concrete Temp (°F)', placeholder: '70', step: 5, min: 50 }], compute: (v) => { const P = Math.min(150+9000*n(v.pourRate||'4')/(n(v.temp||'70')+17),150*n(v.height)); return { result: P, label: 'Max Form Pressure', unit: 'psf', steps: [`Pressure: ${P.toFixed(0)} psf`, `Per ACI 347`] } }, description: 'Formwork lateral pressure per ACI 347.', formula: 'Pmin(150+9000R/T, 150H)', interpretation: 'Increases with pour rate, decreases with temp.' },

'crane-safety': { schema: z.object({ capacity: z.string(), loadWeight: z.string(), radius: z.string() }), fields: [{ name: 'capacity', label: 'Rated Capacity (tons)', step: 1, min: 0 }, { name: 'loadWeight', label: 'Load Weight (lbs)', step: 100, min: 0 }, { name: 'radius', label: 'Radius (ft)', step: 5, min: 0 }], compute: (v) => { const rated = (n(v.capacity)||0)*2000; const pct = rated>0?(n(v.loadWeight)/rated)*100:0; return { result: pct, label: 'Capacity Utilization', unit: '%', steps: [`Usage: ${pct.toFixed(1)}%`, `${pct<=75?'SAFE':pct<=90?'CAUTION':'OVERLOAD'}`] } }, description: 'Crane utilization check.', formula: '% = Load/Rated × 100', interpretation: 'Safe limit: 75%. OSHA max: 100%.' },

'rigging-sling-angle': { schema: z.object({ loadWeight: z.string(), slingLegs: z.string(), slingAngle: z.string() }), fields: [{ name: 'loadWeight', label: 'Load Weight (lbs)', step: 100, min: 0 }, { name: 'slingLegs', label: 'Legs', type: 'select', options: [{ label: '2 legs', value: '2' }, { label: '3 legs', value: '3' }, { label: '4 legs', value: '4' }] }, { name: 'slingAngle', label: 'Angle from H (°)', placeholder: '60', step: 5, min: 0, max: 90 }], compute: (v) => { const rad = (n(v.slingAngle||'60')||60)*Math.PI/180; const t = n(v.loadWeight)/n(v.slingLegs)/Math.sin(rad); return { result: t, label: 'Tension per Leg', unit: 'lbs', steps: [`Tension: ${t.toFixed(0)} lbs/leg`, `Min angle: 30°`] } }, description: 'Sling tension per leg.', formula: 'T=W/N/sin(θ)', interpretation: 'Angle <30° = excessive tension.' },

'scaffold-load': { schema: z.object({ area: z.string(), workers: z.string(), material: z.string() }), fields: [{ name: 'area', label: 'Platform Area (sq ft)', step: 10, min: 0 }, { name: 'workers', label: 'Workers', step: 1, min: 1 }, { name: 'material', label: 'Material Load (lbs)', step: 50, min: 0 }], compute: (v) => { const tot = n(v.workers)*250+n(v.material); const psf = n(v.area)>0?tot/n(v.area):0; const rating = psf<=25?'Light':psf<=50?'Medium':psf<=75?'Heavy':'Special'; return { result: psf, label: 'Load Intensity', unit: 'psf', steps: [`Total: ${tot} lbs`, `${psf.toFixed(0)} psf — ${rating} Duty`] } }, description: 'Scaffold load rating per OSHA.', formula: 'OSHA 1926.451', interpretation: 'Light<25, Medium<50, Heavy<75 psf.' },

'formwork-tie-spacing': { schema: z.object({ pressure: z.string(), tieCapacity: z.string() }), fields: [{ name: 'pressure', label: 'Form Pressure (psf)', step: 50, min: 0 }, { name: 'tieCapacity', label: 'Tie Capacity (lbs)', placeholder: '3000', step: 500, min: 500 }], compute: (v) => { const sp = Math.sqrt((n(v.tieCapacity)||3000)/(n(v.pressure)*1.5)); return { result: sp, label: 'Max Tie Spacing', unit: 'ft', steps: [`Spacing: ${sp.toFixed(2)} ft`, `${(sp*12).toFixed(0)} in OC`] } }, description: 'Formwork tie spacing.', formula: 'S=√(TieCap/(P×1.5))', interpretation: 'Ties: 3000-5000 lb capacity. SF=1.5.' },

'expansion-joint': { schema: z.object({ slabLength: z.string(), tempRange: z.string() }), fields: [{ name: 'slabLength', label: 'Slab Length (ft)', step: 10, min: 0 }, { name: 'tempRange', label: 'Temp Range (°F)', placeholder: '70', step: 10, min: 30 }], compute: (v) => { const exp = n(v.slabLength)*12*0.0000055*(n(v.tempRange)||70); return { result: Math.ceil(exp*10)/10, label: 'Joint Width', unit: 'in', steps: [`Expansion: ${exp.toFixed(3)} in`, `Joint: ${Math.ceil(exp*10)/10} in`] } }, description: 'Expansion joint width for concrete.', formula: 'ΔL=L×12×α×ΔT', interpretation: 'Joint spacing 15-20 ft sidewalks, 10-15 ft slabs.' },

'control-joint-spacing': { schema: z.object({ thick: z.string(), width: z.string() }), fields: [{ name: 'thick', label: 'Slab Thickness (in)', step: 0.5, min: 4 }, { name: 'width', label: 'Slab Width (ft)', step: 2, min: 4 }], compute: (v) => { const sp = Math.min(n(v.thick)*2.5,15); return { result: sp, label: 'Max Joint Spacing', unit: 'ft', steps: [`Spacing: ${sp.toFixed(1)} ft`, `Joints across ${n(v.width)}ft: ${Math.max(0,Math.ceil(n(v.width)/sp)-1)}`] } }, description: 'Control joint spacing per ACI.', formula: 'min(Thick×2.5, 15) ft', interpretation: 'Cut at 1/4 depth within 6-12 hr. Max 15ft.' },

'waterstop-selection': { schema: z.object({ jointType: z.string(), hydrostatic: z.string() }), fields: [{ name: 'jointType', label: 'Joint Type', type: 'select', options: [{ label: 'Construction', value: 'cj' }, { label: 'Expansion', value: 'ej' }, { label: 'Contraction', value: 'ccj' }] }, { name: 'hydrostatic', label: 'Hydrostatic Pressure', type: 'select', options: [{ label: 'Low', value: 'low' }, { label: 'Moderate', value: 'mod' }, { label: 'High', value: 'high' }] }], compute: (v) => {       const rec = String(v.jointType)==='ej'&&String(v.hydrostatic)!=='low'?'PVC waterstop 6-9in':String(v.jointType)==='cj'&&String(v.hydrostatic)==='high'?'Bentonite + PVC':String(v.hydrostatic)==='high'?'PVC waterstop 6in min':String(v.hydrostatic)==='mod'?'PVC/rubber 4-6in':'Keyed joint, no waterstop'; return { result: 0, label: 'Recommendation', unit: '', steps: [`Joint: ${String(v.jointType)}, Press: ${String(v.hydrostatic)}`, rec] } }, description: 'Waterstop selection per ACI 224.3R.', formula: 'Based on joint type and hydrostatic pressure', interpretation: 'PVC most common. Bentonite for active cracks.' },

'masonry-wall-thickness': { schema: z.object({ height: z.string(), wind: z.string(), seismic: z.string() }), fields: [{ name: 'height', label: 'Wall Height (ft)', step: 1, min: 0 }, { name: 'wind', label: 'Wind Load (psf)', placeholder: '25', step: 5, min: 10 }, { name: 'seismic', label: 'Seismic Zone', type: 'select', options: [{ label: 'Z0-1 low', value: '0' }, { label: 'Z2 moderate', value: '2' }, { label: 'Z3-4 high', value: '3' }] }], compute: (v) => { const b = n(v.height)<=8?8:n(v.height)<=12?10:12; const t = b+(n(v.seismic)>2?2:0)+(Math.max(0,(n(v.wind)||25)-25)>0?Math.ceil((n(v.wind)||25)-25)/20*2:0); return { result: t, label: 'Min Thickness', unit: 'in', steps: [`Height ${n(v.height)} ft`, `Min: ${t} in`] } }, description: 'Masonry wall thickness per TMS 402.', formula: 'TMS 402 — height and load based', interpretation: '8" min bearing walls ≤8ft. 10" 8-12ft.' },

'masonry-reinforcement': { schema: z.object({ height: z.string(), length: z.string(), seismic: z.string() }), fields: [{ name: 'height', label: 'Wall Height (ft)', step: 1, min: 0 }, { name: 'length', label: 'Wall Length (ft)', step: 5, min: 0 }, { name: 'seismic', label: 'Seismic Zone', type: 'select', options: [{ label: 'Z0-1', value: '0' }, { label: 'Z2', value: '2' }, { label: 'Z3-4', value: '3' }] }], compute: (v) => { const vert = n(v.seismic)>2?24:n(v.seismic)>0?48:72; return { result: vert, label: 'Vertical Rebar @', unit: 'in OC', steps: [`Vertical: #4 @ ${vert}" OC`, `Horizontal: #4 @ ${n(v.seismic)>2?24:32}" OC`] } }, description: 'Masonry reinforcement spacing.', formula: 'TMS 402 — max 48" low, 24" high seismic', interpretation: 'High seismic: #4 @ 24" with bond beams @ 4ft.' },

'masonry-mortar-estimate': { schema: z.object({ brickType: z.string(), brickCount: z.string() }), fields: [{ name: 'brickType', label: 'Brick Type', type: 'select', options: [{ label: 'Modular', value: 'modular' }, { label: 'Standard', value: 'standard' }, { label: 'Roman', value: 'roman' }] }, { name: 'brickCount', label: 'Brick Count', step: 100, min: 0 }], compute: (v) => { const per: Record<string,number> = {modular:0.022,standard:0.025,roman:0.028}; const cuft = (per[n(v.brickType)]||0.022)*n(v.brickCount); return { result: Math.ceil(cuft), label: 'Mortar Needed', unit: 'cu ft', steps: [`Mortar: ${cuft.toFixed(2)} cf`, `Bags: ${Math.ceil(cuft/1.0)} (70lb)`] } }, description: 'Mortar estimate for brickwork.', formula: '~0.022 cf/modular brick', interpretation: '1 bag (70lb) = ~1 cf mortar + 10% waste.' },

'stone-veneer-estimate': { schema: z.object({ wallArea: z.string(), stoneType: z.string() }), fields: [{ name: 'wallArea', label: 'Wall Area (sq ft)', step: 25, min: 0 }, { name: 'stoneType', label: 'Veneer Type', type: 'select', options: [{ label: 'Thin (1-2 in)', value: 'thin' }, { label: 'Full (4-6 in)', value: 'full' }] }], compute: (v) => {       const cov = String(v.stoneType)==='thin'?1.5:3; const stone = Math.ceil(n(v.wallArea)/cov); return { result: stone, label: 'Stone Needed', unit: 'sq ft', steps: [`Area: ${n(v.wallArea)} sf`, `Stone: ~${stone} sf of ${String(v.stoneType)} veneer`] } }, description: 'Stone veneer material estimate.', formula: 'Coverage varies by stone type', interpretation: 'Thin: ~1.5 sf/sf wall. Full: ~3 sf/sf wall.' },

'tile-estimate': { schema: z.object({ flrArea: z.string(), tileSize: z.string(), pattern: z.string() }), fields: [{ name: 'flrArea', label: 'Floor Area (sq ft)', step: 25, min: 0 }, { name: 'tileSize', label: 'Tile Size', type: 'select', options: [{ label: '12×12', value: '12' }, { label: '18×18', value: '18' }, { label: '12×24', value: '1224' }] }, { name: 'pattern', label: 'Pattern', type: 'select', options: [{ label: 'Straight', value: 'straight' }, { label: 'Diagonal', value: 'diag' }, { label: 'Herringbone', value: 'herring' }] }], compute: (v) => {       const sf = String(v.tileSize)=='12'?1:String(v.tileSize)=='18'?2.25:2; const w = String(v.pattern)=='diag'?0.15:String(v.pattern)=='herring'?0.2:0.1; const tiles = Math.ceil(n(v.flrArea)*(1+w)/sf); return { result: tiles, label: 'Tiles Needed', unit: '', steps: [`Tiles: ${tiles}`, `Waste: ${w*100}%`] } }, description: 'Tile count with waste factor.', formula: 'Tiles=Area×(1+Waste)/TileSF', interpretation: 'Diagonal 15%, herringbone 20%, straight 10%.' },

'paint-estimate': { schema: z.object({ wallArea: z.string(), coats: z.string() }), fields: [{ name: 'wallArea', label: 'Wall Area (sq ft)', step: 50, min: 0 }, { name: 'coats', label: 'Coats', type: 'select', options: [{ label: '1', value: '1' }, { label: '2', value: '2' }, { label: '3', value: '3' }] }], compute: (v) => { const gal = Math.ceil(n(v.wallArea)*n(v.coats)/350); return { result: gal, label: 'Paint Needed', unit: 'gal', steps: [`Area: ${n(v.wallArea)} sf × ${n(v.coats)} coats`, `${gal} gal(s) @ 350 sf/gal`] } }, description: 'Paint quantity estimate.', formula: 'Gal=(Area×Coats)/350', interpretation: 'Rough surfaces +20-30%. 1 gal covers ~350 sf.' },

'drywall-sheets': { schema: z.object({ wallArea: z.string(), sheetSize: z.string(), hasCeiling: z.string() }), fields: [{ name: 'wallArea', label: 'Wall Area (sq ft)', step: 50, min: 0 }, { name: 'sheetSize', label: 'Sheet Size', type: 'select', options: [{ label: '4×8 (32 sf)', value: '48' }, { label: '4×10 (40 sf)', value: '410' }, { label: '4×12 (48 sf)', value: '412' }] }, { name: 'hasCeiling', label: 'Includes Ceiling?', type: 'select', options: [{ label: 'Walls only', value: 'no' }, { label: '+ Ceiling', value: 'yes' }] }], compute: (v) => {       const ssf = String(v.sheetSize)=='48'?32:String(v.sheetSize)=='410'?40:48; const ta = n(v.wallArea)*(String(v.hasCeiling)=='yes'?1.5:1); return { result: Math.ceil(ta*1.1/ssf), label: 'Sheets Needed', unit: '', steps: [`Sheets: ${Math.ceil(ta*1.1/ssf)}`, `Screws: ~${Math.ceil(ta*1.1/ssf)*(String(v.sheetSize)=='48'?32:28)}`] } }, description: 'Drywall sheet count estimate.', formula: 'Sheets=Area×1.1/SheetSF', interpretation: '4×12 sheets reduce joints. 1/2" walls, 5/8" ceilings.' },

'drywall-tape-compound': { schema: z.object({ sheetCount: z.string(), finishLevel: z.string() }), fields: [{ name: 'sheetCount', label: 'Sheets', step: 5, min: 1 }, { name: 'finishLevel', label: 'Finish Level', type: 'select', options: [{ label: 'Level 3 (texture)', value: '3' }, { label: 'Level 4 (smooth)', value: '4' }, { label: 'Level 5 (gloss)', value: '5' }] }], compute: (v) => { const c = n(v.sheetCount)*(n(v.finishLevel)>=5?0.4:n(v.finishLevel)>=4?0.3:0.25); return { result: c, label: 'Compound Needed', unit: 'gal', steps: [`Tape: ~${n(v.sheetCount)*4} ft`, `Compound: ${c.toFixed(1)} gal`] } }, description: 'Joint compound estimate.', formula: 'Compound=Sheets×0.3 (L4)', interpretation: 'Level 4: 3 coats. Level 5: full skim.' },

'crown-molding-angle': { schema: z.object({ spring: z.string(), wallAngle: z.string() }), fields: [{ name: 'spring', label: 'Spring Angle', type: 'select', options: [{ label: '38° (standard)', value: '38' }, { label: '45° (flat)', value: '45' }, { label: '52° (steep)', value: '52' }] }, { name: 'wallAngle', label: 'Wall Corner (°)', placeholder: '90', step: 5, min: 45, max: 135 }], compute: (v) => { const s = (n(v.spring)||38)*Math.PI/180; const w = (n(v.wallAngle)||90)*Math.PI/180; const m = Math.atan(Math.tan(s)*Math.cos(w/2))*180/Math.PI; const b = Math.asin(Math.sin(s)*Math.sin(w/2))*180/Math.PI; return { result: m, label: 'Miter Angle', unit: '°', steps: [`Miter: ${m.toFixed(1)}°`, `Bevel: ${b.toFixed(1)}°`] } }, description: 'Crown molding compound angles.', formula: 'Standard compound miter saw formulas', interpretation: '38° spring, 90° wall: ~31.6° miter, 33.9° bevel.' },

'molding-linear-footage': { schema: z.object({ length: z.string(), width: z.string(), type: z.string() }), fields: [{ name: 'length', label: 'Room Length (ft)', step: 1, min: 0 }, { name: 'width', label: 'Room Width (ft)', step: 1, min: 0 }, { name: 'type', label: 'Molding Type', type: 'select', options: [{ label: 'Baseboard', value: 'base' }, { label: 'Crown', value: 'crown' }, { label: 'Chair rail', value: 'chair' }, { label: 'Door casing', value: 'door' }] }], compute: (v) => { const perim = 2*(n(v.length)+n(v.width));       const f = String(v.type)=='door'?0.15:1; return { result: perim*f*1.1, label: 'Molding Needed', unit: 'LF', steps: [`Perimeter: ${perim} ft`, `Net: ${(perim*f*1.1).toFixed(1)} LF w/ 10% waste`] } }, description: 'Molding linear footage estimate.', formula: 'LF=Perimeter×Factor×1.1', interpretation: '10-12 ft pieces. Order 10% extra for waste.' },

'framing-square': { schema: z.object({ span: z.string(), pitch: z.string() }), fields: [{ name: 'span', label: 'Span (ft)', step: 1, min: 0 }, { name: 'pitch', label: 'Pitch', placeholder: '6', step: 1, min: 0 }], compute: (v) => { const h = n(v.span)/2; const p = n(v.pitch)||6; const rise = h*p/12; const rafter = Math.sqrt(h*h+rise*rise); return { result: rafter, label: 'Common Rafter', unit: 'ft', steps: [`Half span: ${h} ft, Rise: ${rise.toFixed(2)} ft`, `Rafter: ${rafter.toFixed(2)} ft`] } }, description: 'Common rafter length via framing square.', formula: 'Rafter=√((S/2)²+((S/2)×P/12)²)', interpretation: 'Step down each foot of run on square.' },

'jack-rafter': { schema: z.object({ span: z.string(), pitch: z.string(), spacing: z.string() }), fields: [{ name: 'span', label: 'Span (ft)', step: 1, min: 0 }, { name: 'pitch', label: 'Pitch', placeholder: '6', step: 1, min: 0 }, { name: 'spacing', label: 'Spacing', type: 'select', options: [{ label: '16"', value: '16' }, { label: '24"', value: '24' }] }], compute: (v) => { const h = n(v.span)/2; const sp = n(v.spacing)||16; const count = Math.ceil((h*12)/sp); return { result: count-1, label: 'Jack Rafters/Side', unit: '', steps: [`Jack rafters: ~${count-1} per side`, `Shortens by ${(sp/12).toFixed(2)} ft each step`] } }, description: 'Jack rafter count for hip roof.', formula: 'Shortens by spacing×pitch/12 per step', interpretation: 'Shortest at hip, longest at valley.' },

'hip-rafter': { schema: z.object({ span: z.string(), pitch: z.string() }), fields: [{ name: 'span', label: 'Span (ft)', step: 1, min: 0 }, { name: 'pitch', label: 'Pitch', placeholder: '6', step: 1, min: 0 }], compute: (v) => { const h = n(v.span)/2; const rise = h*(n(v.pitch)||6)/12; const hip = Math.sqrt(h*h+h*h+rise*rise); return { result: hip, label: 'Hip Rafter', unit: 'ft', steps: [`Common rise: ${rise.toFixed(2)} ft`, `Hip: ${hip.toFixed(2)} ft`] } }, description: 'Hip rafter length calculation.', formula: 'Hip=√(S²+S²+Rise²)', interpretation: 'Hip runs at 45° to commons at reduced slope.' },

'valley-rafter': { schema: z.object({ span: z.string(), pitch1: z.string(), pitch2: z.string() }), fields: [{ name: 'span', label: 'Intersection Span (ft)', step: 1, min: 0 }, { name: 'pitch1', label: 'Main Pitch', placeholder: '8', step: 1, min: 1 }, { name: 'pitch2', label: 'Inter Pitch', placeholder: '6', step: 1, min: 1 }], compute: (v) => { const h = n(v.span); const r1 = h*(n(v.pitch1)||8)/12; const r2 = h*(n(v.pitch2)||6)/12; const val = Math.sqrt((h/Math.SQRT2)**2+((r1+r2)/2)**2); return { result: val, label: 'Valley Rafter', unit: 'ft', steps: [`Valley: ${val.toFixed(2)} ft`, `At intersection of two roof planes`] } }, description: 'Valley rafter at roof intersection.', formula: 'Diagonal at intersection of two slopes', interpretation: 'Supports intersection of two sloping roofs.' },

'soffit-fascia': { schema: z.object({ perimeter: z.string(), soffitDepth: z.string() }), fields: [{ name: 'perimeter', label: 'Roof Perimeter (ft)', step: 10, min: 0 }, { name: 'soffitDepth', label: 'Soffit Depth (ft)', placeholder: '2', step: 0.5, min: 0 }], compute: (v) => { const fa = n(v.perimeter); const sa = n(v.perimeter)*(n(v.soffitDepth)||2); return { result: sa, label: 'Soffit Area', unit: 'sq ft', steps: [`Soffit: ${sa.toFixed(1)} sf`, `Fascia: ${fa} LF`] } }, description: 'Soffit and fascia material quantities.', formula: 'Soffit=P×D, Fascia=P', interpretation: 'Soffit vent 1sf/150sf attic.' },

'gutter-sizing': { schema: z.object({ roofArea: z.string(), pitch: z.string(), rainfall: z.string() }), fields: [{ name: 'roofArea', label: 'Roof Area (sq ft)', step: 200, min: 0 }, { name: 'pitch', label: 'Roof Pitch', type: 'select', options: [{ label: 'Low (1-3:12)', value: '2' }, { label: 'Med (4-7:12)', value: '5' }, { label: 'Steep (8+:12)', value: '10' }] }, { name: 'rainfall', label: 'Rainfall (in/hr)', placeholder: '3', step: 0.5, min: 1 }], compute: (v) => { const pf = n(v.pitch)<=2?1:n(v.pitch)<=5?1.1:1.2; const gpm = n(v.roofArea)*pf*(n(v.rainfall)||3)/12*0.75; const size = gpm<=45?'5" K':gpm<=70?'6" K':gpm<=100?'7" half':'Custom/trench'; return { result: gpm, label: 'Flow Rate', unit: 'GPM', steps: [`Flow: ${gpm.toFixed(0)} GPM`, `Gutter: ${size}, Downspouts: ${Math.max(2,Math.ceil(n(v.roofArea)/600))}`] } }, description: 'Gutter sizing for roof drainage.', formula: 'GPM=EffArea×Rain/12×0.75', interpretation: '5" K-style: ~45 GPM. Downspout per 600sf.' },

'downspout-scheduling': { schema: z.object({ gutterLength: z.string(), roofArea: z.string() }), fields: [{ name: 'gutterLength', label: 'Gutter Length (ft)', step: 20, min: 0 }, { name: 'roofArea', label: 'Roof Area (sq ft)', step: 200, min: 0 }], compute: (v) => { const byLen = Math.max(2,Math.ceil(n(v.gutterLength)/32)); const byArea = Math.max(2,Math.ceil(n(v.roofArea)/600)); return { result: Math.max(byLen,byArea), label: 'Downspouts Needed', unit: '', steps: [`By length: ${byLen}`, `By area: ${byArea}`, `Required: ${Math.max(byLen,byArea)}`] } }, description: 'Downspout count for gutter system.', formula: '1 per 32ft length, 1 per 600sf roof', interpretation: 'Min 2. Place at corners and low points.' },

'floor-level-transition': { schema: z.object({ thick: z.string(), floor1: z.string(), floor2: z.string() }), fields: [{ name: 'thick', label: 'New Floor Thick (in)', step: 0.125, min: 0.125 }, { name: 'floor1', label: 'New Floor Type', type: 'select', options: [{ label: 'Tile', value: 'tile' }, { label: 'Hardwood', value: 'wood' }, { label: 'Laminate', value: 'laminate' }, { label: 'Carpet', value: 'carpet' }, { label: 'Vinyl', value: 'vinyl' }] }, { name: 'floor2', label: 'Adjacent Floor', type: 'select', options: [{ label: 'Tile', value: 'tile' }, { label: 'Hardwood', value: 'wood' }, { label: 'Laminate', value: 'laminate' }, { label: 'Carpet', value: 'carpet' }, { label: 'Vinyl', value: 'vinyl' }] }], compute: (v) => { const t: Record<string,Record<string,string>> = {tile:{wood:'T-molding',carpet:'Z-bar',laminate:'T-molding',tile:'Flush reducer'}, wood:{tile:'T-molding',carpet:'Reducer',laminate:'Match strip',wood:'Flush'}, carpet:{tile:'Z-bar',wood:'Reducer'}}; const rec = t[n(v.floor1)]?.[n(v.floor2)]||t[n(v.floor2)]?.[n(v.floor1)]||'T-molding'; return { result: 0, label: 'Recommendation', unit: '', steps: [`${n(v.floor1)} → ${n(v.floor2)}, ΔH=${n(v.thick)}"`, rec] } }, description: 'Floor transition type recommendation.', formula: 'NRFC guidelines for floor height differentials', interpretation: '<1/4": flush. 1/4"-3/4": reducer. >3/4": ramp.' },

'chimney-flue': { schema: z.object({ appliance: z.string(), height: z.string(), connArea: z.string() }), fields: [{ name: 'appliance', label: 'Appliance', type: 'select', options: [{ label: 'Fireplace', value: 'fp' }, { label: 'Wood stove', value: 'ws' }, { label: 'Furnace', value: 'furn' }, { label: 'Water heater', value: 'wh' }] }, { name: 'height', label: 'Flue Height (ft)', step: 2, min: 10 }, { name: 'connArea', label: 'Connector Area (sq in)', step: 5, min: 0 }], compute: (v) => { const min: Record<string,number> = {fp:144,ws:64,furn:Math.ceil((n(v.connArea)||50)*0.7),wh:Math.ceil((n(v.connArea)||28)*0.5)}; const area = min[n(v.appliance)]||64; const dia = Math.ceil(Math.sqrt(area/Math.PI)*2); return { result: dia, label: 'Min Flue Diameter', unit: 'in', steps: [`Area: ${area} sq in`, `Diameter: ${dia} in`] } }, description: 'Chimney flue size per NFPA 211.', formula: 'NFPA 211 — min area per appliance', interpretation: 'Round preferred. Min flue height 10ft.' },

'fireplace-sizing': { schema: z.object({ roomLength: z.string(), roomWidth: z.string(), ceiling: z.string() }), fields: [{ name: 'roomLength', label: 'Room Length (ft)', step: 2, min: 0 }, { name: 'roomWidth', label: 'Room Width (ft)', step: 2, min: 0 }, { name: 'ceiling', label: 'Ceiling Height (ft)', step: 1, min: 0 }], compute: (v) => { const vol = n(v.roomLength)*n(v.roomWidth)*n(v.ceiling); const opening = vol/50; const h = Math.sqrt(opening/0.7); const w = opening/h; return { result: w, label: 'Firebox Width', unit: 'in', steps: [`Opening: ${opening.toFixed(0)} sq in`, `${w.toFixed(1)}"W×${h.toFixed(1)}"H`] } }, description: 'Firebox size for room volume.', formula: 'Opening=RoomVol/50, W/H=0.7', interpretation: 'Standard 36×24 for 12×20 room.' },

'fire-stopping': { schema: z.object({ wallHeight: z.string(), buildingType: z.string() }), fields: [{ name: 'wallHeight', label: 'Wall Height (ft)', step: 2, min: 0 }, { name: 'buildingType', label: 'Building Type', type: 'select', options: [{ label: 'Wood (Type V)', value: 'v' }, { label: 'Steel (II/IV)', value: 'ii' }, { label: 'Concrete (I)', value: 'i' }] }], compute: (v) => {       const stops = String(v.buildingType)=='v'?Math.ceil(n(v.wallHeight)/10)*2:String(v.buildingType)=='i'?0:Math.ceil(n(v.wallHeight)/26)*2; return { result: stops, label: 'Fire Stops/Wall', unit: '', steps: [`Type ${String(v.buildingType).toUpperCase()}`, `Fire stops: ${stops} per wall`] } }, description: 'Fire stop requirements per IBC 718.', formula: 'IBC 718 — every 10ft in stud cavities', interpretation: 'Required at floors, ceilings, 10ft intervals.' },

'insulation-r-value': { schema: z.object({ material: z.string(), thickness: z.string() }), fields: [{ name: 'material', label: 'Insulation', type: 'select', options: [{ label: 'Fiberglass batt', value: 'fg' }, { label: 'Rockwool', value: 'rw' }, { label: 'Cellulose', value: 'cell' }, { label: 'Spray foam open', value: 'oc' }, { label: 'Spray foam closed', value: 'cc' }, { label: 'XPS rigid', value: 'xps' }, { label: 'Polyiso rigid', value: 'poly' }] }, { name: 'thickness', label: 'Thickness (in)', step: 0.5, min: 1 }], compute: (v) => { const r: Record<string,number> = {fg:3.2,rw:3.3,cell:3.7,oc:3.5,cc:6.5,xps:5,poly:6}; return { result: (r[n(v.material)]||3.2)*n(v.thickness), label: 'R-Value', unit: '', steps: [`R=${n(v.material)}: ${r[n(v.material)]||3.2} R/in × ${n(v.thickness)} in`, `Total R: ${((r[n(v.material)]||3.2)*n(v.thickness)).toFixed(1)}`] } }, description: 'Insulation R-value calculation.', formula: 'Rtotal=R/inch×Thickness', interpretation: 'IBC min attic R-38, wall R-13.' },

'u-value': { schema: z.object({ rVal: z.string() }), fields: [{ name: 'rVal', label: 'Total R-Value', placeholder: '19', step: 1, min: 1 }], compute: (v) => { const u = n(v.rVal||'19')>0?1/n(v.rVal||'19'):0; return { result: u, label: 'U-Value', unit: '', steps: [`U=1/${n(v.rVal||'19')}`, `${u.toFixed(4)} Btu/hr·ft²·°F`] } }, description: 'U-value from R-value.', formula: 'U=1/Rtotal', interpretation: 'Lower U = better. IECC windows ≤0.30, walls ≤0.064.' },

'window-u-factor': { schema: z.object({ frame: z.string(), glass: z.string(), lowE: z.string() }), fields: [{ name: 'frame', label: 'Frame', type: 'select', options: [{ label: 'Aluminum', value: 'al' }, { label: 'Vinyl', value: 'vinyl' }, { label: 'Wood', value: 'wood' }, { label: 'Fiberglass', value: 'fg' }] }, { name: 'glass', label: 'Glazing', type: 'select', options: [{ label: 'Single', value: 'single' }, { label: 'Double', value: 'double' }, { label: 'Triple', value: 'triple' }] }, { name: 'lowE', label: 'Low-E', type: 'select', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] }], compute: (v) => { const u: Record<string,Record<string,Record<string,number>>> = {al:{single:{yes:1.2,no:1.3},double:{yes:0.65,no:0.85},triple:{yes:0.45,no:0.55}},vinyl:{single:{yes:1.1,no:1.2},double:{yes:0.35,no:0.55},triple:{yes:0.25,no:0.35}},wood:{single:{yes:1,no:1.1},double:{yes:0.45,no:0.6},triple:{yes:0.3,no:0.4}}}; return { result: u[n(v.frame)]?.[n(v.glass)]?.[n(v.lowE)]||0.5, label: 'U-Factor', unit: '', steps: [`Frame: ${n(v.frame)}, Glass: ${n(v.glass)}, Low-E: ${n(v.lowE)}`, `U: ${u[n(v.frame)]?.[n(v.glass)]?.[n(v.lowE)]||0.5}`] } }, description: 'Window U-factor estimate per NFRC.', formula: 'NFRC rated, lower is better', interpretation: 'IECC 2021: max U 0.30 Z4-8.' },

'window-shgc': { schema: z.object({ glass: z.string(), tint: z.string() }), fields: [{ name: 'glass', label: 'Glazing', type: 'select', options: [{ label: 'Single clear', value: 'sc' }, { label: 'Double clear', value: 'dc' }, { label: 'Double low-E', value: 'dle' }, { label: 'Triple low-E', value: 'tle' }] }, { name: 'tint', label: 'Tint', type: 'select', options: [{ label: 'Clear', value: 'clear' }, { label: 'Bronze', value: 'bronze' }, { label: 'Gray', value: 'gray' }, { label: 'Reflective', value: 'reflective' }] }], compute: (v) => { const base: Record<string,number> = {sc:0.86,dc:0.76,dle:0.42,tle:0.31}; const tf: Record<string,number> = {clear:1,bronze:0.75,gray:0.7,reflective:0.35}; return { result: (base[n(v.glass)]||0.76)*(tf[n(v.tint)]||1), label: 'SHGC', unit: '', steps: [`SHGC: ${((base[n(v.glass)]||0.76)*(tf[n(v.tint)]||1)).toFixed(2)}`, `0-1 scale, lower=less solar gain`] } }, description: 'Window SHGC estimate.', formula: 'NFRC rated 0-1', interpretation: 'Low SHGC (0.2-0.4) for hot climates. High (0.5+) for cold.' },

'hvac-load': { schema: z.object({ sqft: z.string(), ins: z.string(), windows: z.string(), occupants: z.string() }), fields: [{ name: 'sqft', label: 'Floor Area (sq ft)', step: 100, min: 0 }, { name: 'ins', label: 'Insulation', type: 'select', options: [{ label: 'Poor', value: 'poor' }, { label: 'Average', value: 'avg' }, { label: 'Good', value: 'good' }, { label: 'Excellent', value: 'excellent' }] }, { name: 'windows', label: 'Window Area (sq ft)', step: 25, min: 0 }, { name: 'occupants', label: 'Occupants', step: 1, min: 1, placeholder: '2' }], compute: (v) => { const f: Record<string,number> = {poor:35,avg:25,good:18,excellent:12}; const btu = n(v.sqft)*(f[n(v.ins)]||25)+n(v.windows)*50+(n(v.occupants)||2)*600; return { result: btu, label: 'Cooling Load', unit: 'BTU/hr', steps: [`BTU: ${btu.toFixed(0)}`, `${(btu/12000).toFixed(1)} tons`] } }, description: 'HVAC cooling load estimate (simplified Manual J).', formula: 'BTU=Area×Factor+Windows×50+Occ×600', interpretation: '~500-600 sqft/ton. Always do Manual J.' },

'hvac-duct-size': { schema: z.object({ cfm: z.string(), velocity: z.string() }), fields: [{ name: 'cfm', label: 'CFM', step: 25, min: 0 }, { name: 'velocity', label: 'Max Velocity (fpm)', type: 'select', options: [{ label: '600 quiet', value: '600' }, { label: '800 standard', value: '800' }, { label: '1000 commercial', value: '1000' }] }], compute: (v) => { const vel = n(v.velocity)||800; const a = n(v.cfm)/vel*144; const d = Math.sqrt(a/Math.PI)*2; return { result: d, label: 'Min Round Duct Dia', unit: 'in', steps: [`CFM: ${n(v.cfm)}, Vel: ${vel} fpm`, `Diameter: ${d.toFixed(1)} in`] } }, description: 'HVAC duct sizing by CFM and velocity.', formula: 'A=CFM/V, D=2√(A/π)', interpretation: '6" round per 100 CFM typical.' },

'hvac-diffuser': { schema: z.object({ roomArea: z.string(), ceiling: z.string(), coolingLoad: z.string() }), fields: [{ name: 'roomArea', label: 'Room Area (sq ft)', step: 25, min: 0 }, { name: 'ceiling', label: 'Ceiling Height (ft)', placeholder: '8', step: 1, min: 0 }, { name: 'coolingLoad', label: 'Cooling Load (BTU/hr)', step: 500, min: 0 }], compute: (v) => { const cfm = (n(v.coolingLoad)/12000)*400; const vol = n(v.roomArea)*(n(v.ceiling)||8); const ach = vol>0?cfm*60/vol:0; return { result: ach, label: 'Air Changes/Hour', unit: 'ACH', steps: [`CFM: ${cfm.toFixed(0)}`, `ACH: ${ach.toFixed(1)} (rec: 4-8)`] } }, description: 'Room air changes per hour.', formula: 'ACH=CFM×60/RoomVol', interpretation: 'ASHRAE 62.2: 0.35 ACH min. 4-8 for comfort.' },

'plumbing-fixture-count': { schema: z.object({ buildingType: z.string(), occupancy: z.string() }), fields: [{ name: 'buildingType', label: 'Building Type', type: 'select', options: [{ label: 'Office', value: 'office' }, { label: 'Retail', value: 'retail' }, { label: 'School', value: 'school' }, { label: 'Assembly', value: 'assembly' }] }, { name: 'occupancy', label: 'Occupancy', step: 5, min: 0 }], compute: (v) => { const r: Record<string,number> = {office:1,retail:1,school:1,assembly:1}; return { result: Math.ceil((n(v.occupancy)/2)/(r[n(v.buildingType)]||1)), label: 'WCs Needed (men)', unit: '', steps: [`Occ: ${n(v.occupancy)}`, `Min WCs: ${Math.ceil((n(v.occupancy)/2)/(r[n(v.buildingType)]||1))}`] } }, description: 'Plumbing fixture count per IPC 403.1.', formula: 'IPC Table 403.1', interpretation: 'Women need 2× fixtures per IPC.' },

'pipe-flow': { schema: z.object({ diameter: z.string(), material: z.string(), length: z.string(), head: z.string() }), fields: [{ name: 'diameter', label: 'Diameter (in)', step: 0.25, min: 0.5 }, { name: 'material', label: 'Material', type: 'select', options: [{ label: 'PVC (C=150)', value: 'pvc' }, { label: 'Copper (C=130)', value: 'cu' }, { label: 'Steel (C=100)', value: 'steel' }, { label: 'PEX (C=150)', value: 'pex' }] }, { name: 'length', label: 'Length (ft)', step: 10, min: 0 }, { name: 'head', label: 'Head (ft)', step: 5, min: 0 }], compute: (v) => { const c: Record<string,number> = {pvc:150,cu:130,steel:100,pex:150}; const C = c[n(v.material)]||130; const s = n(v.length)>0?n(v.head)/n(v.length):0; const gpm = 0.115*C*Math.pow(n(v.diameter),2.63)*Math.pow(s,0.54); return { result: gpm, label: 'Flow Rate', unit: 'GPM', steps: [`C=${C}, D=${n(v.diameter)}in`, `Flow: ${gpm.toFixed(1)} GPM`] } }, description: 'Pipe flow via Hazen-Williams.', formula: 'Q=0.115×C×d²·⁶³×s⁰·⁵⁴', interpretation: 'Full pipe flow. Partially full: ×area ratio.' },

'pipe-slope-drainage': { schema: z.object({ flow: z.string(), diameter: z.string(), material: z.string() }), fields: [{ name: 'flow', label: 'Flow (GPM)', step: 10, min: 0 }, { name: 'diameter', label: 'Diameter (in)', step: 1, min: 3 }, { name: 'material', label: 'Material', type: 'select', options: [{ label: 'Concrete n=0.013', value: 'conc' }, { label: 'PVC n=0.009', value: 'pvc' }, { label: 'HDPE n=0.024', value: 'hdpe' }] }], compute: (v) => { const nMap: Record<string,number> = {conc:0.013,pvc:0.009,hdpe:0.024}; const nV = nMap[String(v.material)]||0.013; const a = Math.PI*(n(v.diameter)/24)**2/4; const r = n(v.diameter)/(24*4); const q = n(v.flow)/448.83; const vel = a>0?q/a:0; const s = ((vel*nV)/Math.pow(r,2/3))**2; return { result: s*100, label: 'Required Slope', unit: '%', steps: [`V: ${vel.toFixed(2)} ft/s`, `Slope: ${(s*100).toFixed(3)}%`] } }, description: 'Drainage pipe slope via Manning.', formula: 'V=1.486/n×R²/³×S¹/²', interpretation: 'Min 2 ft/s self-cleansing.' },

'septic-tank': { schema: z.object({ bedrooms: z.string(), fixtures: z.string() }), fields: [{ name: 'bedrooms', label: 'Bedrooms', step: 1, min: 1 }, { name: 'fixtures', label: 'Fixtures', step: 1, min: 1 }], compute: (v) => { const vol = Math.max(1000, (n(v.bedrooms)*150+n(v.fixtures)*25)*1.5); return { result: vol, label: 'Min Septic Tank Vol', unit: 'gal', steps: [`Volume: ${vol.toFixed(0)} gal`, `Min 1000 gal`] } }, description: 'Septic tank sizing.', formula: 'V=((Beds×150+Fixtures×25)×1.5, min 1000', interpretation: 'Add 250 gal per bedroom over 3.' },

'leach-field': { schema: z.object({ flow: z.string(), soilType: z.string() }), fields: [{ name: 'flow', label: 'Daily Flow (GPD)', step: 100, min: 0 }, { name: 'soilType', label: 'Soil Type', type: 'select', options: [{ label: 'Sand', value: 'sand' }, { label: 'Sandy loam', value: 'sandy' }, { label: 'Loam', value: 'loam' }, { label: 'Clay loam', value: 'clayey' }, { label: 'Clay', value: 'clay' }] }], compute: (v) => { const r: Record<string,number> = {sand:1.2,sandy:0.8,loam:0.5,clayey:0.3,clay:0.15}; const area = n(v.flow)/(r[n(v.soilType)]||0.5); return { result: area, label: 'Trench Area Req', unit: 'sq ft', steps: [`Area: ${area.toFixed(0)} sq ft`, `Trenches: ~${Math.ceil(area/400)} (50ft×4ft)`] } }, description: 'Leach field area sizing.', formula: 'Area = Flow / AbsorptionRate', interpretation: 'Min 100 sqft/bedroom. ≥2ft above water table.' },

'water-heater-sizing': { schema: z.object({ occupants: z.string(), type: z.string() }), fields: [{ name: 'occupants', label: 'Occupants', step: 1, min: 1 }, { name: 'type', label: 'Heater Type', type: 'select', options: [{ label: 'Electric tank', value: 'elec' }, { label: 'Gas tank', value: 'gas' }, { label: 'Tankless electric', value: 'tankless-e' }, { label: 'Tankless gas', value: 'tankless-g' }, { label: 'Heat pump', value: 'hp' }] }], compute: (v) => { const firstHr: Record<string,Record<string,number>> = {elec:{1:40,2:40,3:50,4:66,5:80},gas:{1:30,2:30,3:40,4:50,5:75}}; const f = firstHr[n(v.type)]||{1:40,2:40,3:50,4:66,5:80}; const cap = f[Math.min(n(v.occupants),5)]||66; return { result: cap, label: 'Min First-Hour Rating', unit: 'gal', steps: [`Type: ${n(v.type)}, Occ: ${n(v.occupants)}`, `Min FHR: ${cap} gal`] } }, description: 'Water heater sizing by occupancy.', formula: 'DOE FHR ratings per occupancy', interpretation: 'Gas: ~30-75 gal FHR. Electric: ~40-80 gal FHR.' },
'paver-sand': {
    schema: z.object({area: z.string(), depth: z.string() }),
    fields: [
      { name: 'area', label: 'Area (sq ft)', step: 0.1, min: 0 },
      { name: 'depth', label: 'Depth (in)', step: 0.25, min: 0.5 },
    ],
    compute: (v: Record<string, string>) => {
      var a=n(v.area),d=n(v.depth||"1.5");var cf=a*d/12;var tons=cf*0.1;return{result:tons,label:"Sand Needed",unit:"tons",steps:["Area: "+a+" sq ft","Depth: "+d+" in = "+(d/12).toFixed(3)+" ft","Volume: "+cf.toFixed(1)+" cu ft","Sand: "+tons.toFixed(2)+" tons"]}
    },
    description: 'Estimate sand needed for paver base and joints.',
    formula: 'Sand (tons) = Area x depth x density',
    interpretation: 'Covers both base sand and joint sand. Average depth 1in base + 0.5in joints.',
  },
'asphalt-tonnage': {
    schema: z.object({length: z.string(), width: z.string(), depth: z.string() }),
    fields: [
      { name: 'length', label: 'Length (ft)', step: 1, min: 0 },
      { name: 'width', label: 'Width (ft)', step: 1, min: 0 },
      { name: 'depth', label: 'Depth (in)', step: 0.5, min: 2 },
    ],
    compute: (v: Record<string, string>) => {
      var l=n(v.length),w=n(v.width),d=n(v.depth||"3");var tons=l*w*d*0.055;return{result:tons,label:"Asphalt Needed",unit:"tons",steps:["Area: "+l+"x"+w+" = "+(l*w)+" sq ft","Depth: "+d+" in","Tons: "+tons.toFixed(2)+" tons"]}
    },
    description: 'Estimate asphalt tonnage for paving projects.',
    formula: 'Tons = Length x Width x Depth x 0.055',
    interpretation: 'Assumes 110 lbs per sq ft per inch of depth. Adjust for compaction factor of 1.05.',
  },
'gravel-base': {
    schema: z.object({area: z.string(), depth: z.string() }),
    fields: [
      { name: 'area', label: 'Area (sq ft)', step: 1, min: 0 },
      { name: 'depth', label: 'Depth (in)', step: 0.5, min: 4 },
    ],
    compute: (v: Record<string, string>) => {
      var a=n(v.area),d=n(v.depth||"6");var tons=a*(d/12)*1.4;return{result:tons,label:"Gravel Needed",unit:"tons",steps:["Area: "+a+" sq ft","Depth: "+d+" in = "+(d/12).toFixed(2)+" ft","Gravel: "+tons.toFixed(2)+" tons"]}
    },
    description: 'Estimate gravel base material for driveways and foundations.',
    formula: 'Gravel = Area x Depth x 1.4 (tons)',
    interpretation: 'Base gravel typically 6-8in deep for driveways. Includes 15% compaction factor.',
  },
'crushed-stone': {
    schema: z.object({area: z.string(), depth: z.string() }),
    fields: [
      { name: 'area', label: 'Area (sq ft)', step: 1, min: 0 },
      { name: 'depth', label: 'Depth (in)', step: 0.5, min: 3 },
    ],
    compute: (v: Record<string, string>) => {
      var a=n(v.area),d=n(v.depth||"4");var cYds=a*(d/12)/27;var tons=cYds*1.35;return{result:tons,label:"Crushed Stone",unit:"tons",steps:["Area: "+a+" sq ft","Depth: "+d+" in","Volume: "+cYds.toFixed(2)+" cu yd","Stone: "+tons.toFixed(2)+" tons"]}
    },
    description: 'Estimate crushed stone needed for construction.',
    formula: 'Stone (tons) = Area x Depth x 1.35',
    interpretation: 'Crushed stone density ~1.35 tons per cubic yard. Add 5-10% for compaction.',
  },
'mulch-coverage': {
    schema: z.object({area: z.string(), depth: z.string() }),
    fields: [
      { name: 'area', label: 'Area (sq ft)', step: 1, min: 0 },
      { name: 'depth', label: 'Depth (in)', step: 0.5, min: 2 },
    ],
    compute: (v: Record<string, string>) => {
      var a=n(v.area),d=n(v.depth||"3");var cYds=a*(d/12)/27;return{result:cYds,label:"Mulch Needed",unit:"cu yd",steps:["Area: "+a+" sq ft","Depth: "+d+" in","Mulch: "+cYds.toFixed(2)+" cu yd","Bags (2cf): "+Math.ceil(cYds*13.5)+" bags"]}
    },
    description: 'Calculate mulch needed for garden beds.',
    formula: 'Mulch = Area x Depth / 324 (cubic yards)',
    interpretation: 'Standard depth is 2-3in. One cubic yard covers ~108 sq ft at 3in depth.',
  },
'sod-estimate': {
    schema: z.object({length: z.string(), width: z.string() }),
    fields: [
      { name: 'length', label: 'Length (ft)', step: 1, min: 0 },
      { name: 'width', label: 'Width (ft)', step: 1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      var l=n(v.length),w=n(v.width);var area=l*w;var waste=area*0.1;return{result:area,label:"Sod Area",unit:"sq ft",steps:["Area: "+l+"x"+w+" = "+area+" sq ft","With 10% waste: "+(area+waste).toFixed(0)+" sq ft","Pallets: ~"+Math.ceil((area+waste)/500)+" pallets"]}
    },
    description: 'Estimate sod needed for lawn installation.',
    formula: 'Sod = Length x Width (sq ft) + 5-10% waste',
    interpretation: 'One pallet covers ~450-500 sq ft. Add 5-10% for cutting/waste.',
  },
'seed-coverage': {
    schema: z.object({area: z.string(), rate: z.string() }),
    fields: [
      { name: 'area', label: 'Area (sq ft)', step: 100, min: 0 },
      { name: 'rate', label: 'Rate (lbs/1000sqft)', step: 0.5, min: 5 },
    ],
    compute: (v: Record<string, string>) => {
      var a=n(v.area),r=n(v.rate||"5");var seed=a/1000*r;return{result:seed,label:"Seed Needed",unit:"lbs",steps:["Area: "+a+" sq ft","Rate: "+r+" lbs/1000 sq ft","Seed: "+seed.toFixed(1)+" lbs"]}
    },
    description: 'Calculate grass seed needed for lawn.',
    formula: 'Seed (lbs) = Area x Rate per 1000 sq ft',
    interpretation: 'Kentucky bluegrass: 2-3lbs/1000sqft, fescue: 5-8lbs/1000sqft, ryegrass: 5-7lbs/1000sqft.',
  },
'fence-post-depth': {
    schema: z.object({postHeight: z.string(), postWidth: z.string() }),
    fields: [
      { name: 'postHeight', label: 'Post Height (ft)', step: 0.5, min: 4 },
      { name: 'postWidth', label: 'Post Width (in)', step: 0.5, min: 4 },
    ],
    compute: (v: Record<string, string>) => {
      var h=n(v.postHeight),w=n(v.postWidth||"4");var depth=Math.max(h*12*0.33,24);var concrete=depth*w*w/144*0.5;return{result:depth,label:"Post Depth",unit:"in",steps:["Post height: "+h+" ft = "+(h*12)+" in","Min depth: "+(h*12*0.33).toFixed(0)+" in (1/3 rule)","Use: "+Math.round(depth)+" in"]}
    },
    description: 'Determine proper fence post depth and concrete needs.',
    formula: 'Depth = Post height x 0.33 + 6in minimum',
    interpretation: 'General rule: 1/3 of post height below ground. Minimum 24in for 6ft fence.',
  },
'deck-beam-span': {
    schema: z.object({beamSize: z.string(), load: z.string() }),
    fields: [
      { name: 'beamSize', label: 'Beam Size (inches)', step: 1, min: 6 },
      { name: 'load', label: 'Load (psf)', step: 5, min: 40 },
    ],
    compute: (v: Record<string, string>) => {
      var b=n(v.beamSize),l=n(v.load||"40");var span=b*1.5*(40/l);return{result:span,label:"Max Beam Span",unit:"ft",steps:["Beam depth: "+b+" in","Load: "+l+" psf","Span: "+span.toFixed(1)+" ft"]}
    },
    description: 'Determine maximum beam span for deck construction.',
    formula: 'Max span = Beam depth x 1.5 (for 40psf live load)',
    interpretation: '2x8 beam max ~6ft, 2x10 beam max ~8ft, 2x12 beam max ~10ft span between posts.',
  },
'deck-joist-span': {
    schema: z.object({joistSize: z.string(), spacing: z.string(), load: z.string() }),
    fields: [
      { name: 'joistSize', label: 'Joist Size (in)', step: 1, min: 6 },
      { name: 'spacing', label: 'Spacing (in)', step: 2, min: 12 },
      { name: 'load', label: 'Load (psf)', step: 5, min: 40 },
    ],
    compute: (v: Record<string, string>) => {
      var j=n(v.joistSize),s=n(v.spacing||"16"),l=n(v.load||"40");var span=j*1.8*(40/l)*Math.sqrt(16/s);return{result:span,label:"Max Joist Span",unit:"ft",steps:["Joist: "+j+"in at "+s+"in OC","Load: "+l+" psf","Span: "+span.toFixed(1)+" ft"]}
    },
    description: 'Calculate maximum joist span for deck framing.',
    formula: 'Max span = Joist depth x 1.8 (16in OC, 40psf)',
    interpretation: '2x6 max ~8ft, 2x8 max ~10ft, 2x10 max ~13ft at 16in OC. Reduce for 12in OC.',
  },
'railing-post-spacing': {
    schema: z.object({postSize: z.string() }),
    fields: [
      { name: 'postSize', label: 'Post Size', step: 1, min: 4 },
    ],
    compute: (v: Record<string, string>) => {
      var p=n(v.postSize||"4");var max=p==6?8:p==4?6:4;return{result:max,label:"Max Post Spacing",unit:"ft",steps:["Post: "+p+"x"+p,"Max spacing: "+max+" ft"]}
    },
    description: 'Determine proper railing post spacing for safety.',
    formula: 'Max spacing = 6ft for 4x4 posts, 8ft for 6x6 posts',
    interpretation: 'IRC code: max 6ft between posts for 4x4. Max 4in between balusters. Post must resist 200lb lateral load.',
  },
'stair-runner-length': {
    schema: z.object({steps: z.string(), rise: z.string(), tread: z.string() }),
    fields: [
      { name: 'steps', label: 'Number of Steps', step: 1, min: 1 },
      { name: 'rise', label: 'Rise (in)', step: 0.25, min: 7 },
      { name: 'tread', label: 'Tread Depth (in)', step: 0.25, min: 11 },
    ],
    compute: (v: Record<string, string>) => {
      var s=n(v.steps),r=n(v.rise||"7"),t=n(v.tread||"11");var len=s*(r+t)/12*1.1;return{result:len,label:"Runner Length",unit:"ft",steps:["Steps: "+s,"Per step: "+(r+t).toFixed(1)+" in","Length: "+len.toFixed(1)+" ft (with waste)"]}
    },
    description: 'Calculate stair runner carpet length.',
    formula: 'Runner = (Riser x tread) x steps x 1.1',
    interpretation: 'Standard stair: 7in rise, 11in run. Add 10% for waste and pattern matching.',
  },
'handrail-angle': {
    schema: z.object({riseTotal: z.string(), runTotal: z.string() }),
    fields: [
      { name: 'riseTotal', label: 'Total Rise (in)', step: 1, min: 0 },
      { name: 'runTotal', label: 'Total Run (in)', step: 1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      var r=n(v.riseTotal),u=n(v.runTotal);var angle=Math.atan2(r,u)*180/Math.PI;var len=Math.sqrt(r*r+u*u)/12;return{result:angle,label:"Handrail Angle",unit:"deg",steps:["Rise: "+r+" in","Run: "+u+" in","Angle: "+angle.toFixed(1)+" deg","Rail length: "+len.toFixed(1)+" ft"]}
    },
    description: 'Calculate handrail angle for stairs and ramps.',
    formula: 'Angle = atan(rise / run)',
    interpretation: 'Max stair angle: 42 degrees for residential, 32 degrees for commercial. Optimal: 30-35 degrees.',
  },
'roof-sheathing': {
    schema: z.object({length: z.string(), width: z.string(), pitch: z.string() }),
    fields: [
      { name: 'length', label: 'Roof Length (ft)', step: 1, min: 0 },
      { name: 'width', label: 'Roof Width (ft)', step: 1, min: 0 },
      { name: 'pitch', label: 'Roof Pitch (in12)', step: 1, min: 4 },
    ],
    compute: (v: Record<string, string>) => {
      var l=n(v.length),w=n(v.width),p=n(v.pitch||"6");var pf=Math.sqrt(144+p*p)/12;var area=l*w*pf;var sheets=Math.ceil(area/32*1.1);return{result:sheets,label:"Sheets Needed",unit:"4x8 sheets",steps:["Base area: "+l+"x"+w+" = "+(l*w)+" sq ft","Pitch factor: "+pf.toFixed(2),"Actual area: "+area.toFixed(0)+" sq ft","Sheets: "+sheets+" (4x8)"]}
    },
    description: 'Estimate roof sheathing (plywood/OSB) needed.',
    formula: 'Sheets = Roof area / 32 (4x8 sheets)',
    interpretation: 'Standard sheet is 4x8ft = 32sqft. Add 10% for waste and hips/valleys. Roof pitch increases effective area.',
  },
'downspout-spacing': {
    schema: z.object({roofArea: z.string(), gutterLength: z.string() }),
    fields: [
      { name: 'roofArea', label: 'Roof Area (sq ft)', step: 100, min: 0 },
      { name: 'gutterLength', label: 'Gutter Length (ft)', step: 5, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      var a=n(v.roofArea),l=n(v.gutterLength);var perDrain=a<1200?1:a<2400?2:3;var spacing=l/perDrain;return{result:spacing,label:"Downspout Spacing",unit:"ft",steps:["Roof area: "+a+" sq ft","Gutter length: "+l+" ft","Downspouts: "+perDrain,"Spacing: "+spacing.toFixed(0)+" ft OC"]}
    },
    description: 'Calculate recommended downspout placement.',
    formula: 'Max spacing = 40ft per downspout (standard roof)',
    interpretation: 'IRC: max 40ft between downspouts. Each downspout handles ~600sqft of roof area. Minimum 2 per building side.',
  },
'snow-guard': {
    schema: z.object({roofLength: z.string(), roofPitch: z.string() }),
    fields: [
      { name: 'roofLength', label: 'Roof Edge Length (ft)', step: 1, min: 0 },
      { name: 'roofPitch', label: 'Roof Pitch (in12)', step: 1, min: 4 },
    ],
    compute: (v: Record<string, string>) => {
      var l=n(v.roofLength),p=n(v.roofPitch||"6");var perRow=Math.ceil(l*2);var rows=Math.ceil(Math.sqrt(144+p*p)/12*2);var total=perRow*rows;return{result:total,label:"Snow Guards",unit:"pcs",steps:["Edge: "+l+" ft","Guards per row: "+perRow,"Rows up roof: "+rows,"Total: "+total+" guards"]}
    },
    description: 'Calculate snow guard placement for metal roofs.',
    formula: 'Guards = Roof length x 2 (per row) + staggered rows',
    interpretation: 'Metal roofs need snow guards at eave edge + every 4ft up roof. Use 2 guards per 12in of roof edge.',
  },
'skylight-size': {
    schema: z.object({roomArea: z.string(), wellDepth: z.string() }),
    fields: [
      { name: 'roomArea', label: 'Room Area (sq ft)', step: 10, min: 0 },
      { name: 'wellDepth', label: 'Well Depth (ft)', step: 0.5, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      var a=n(v.roomArea),d=n(v.wellDepth||"0");var effArea=a*0.05;var wellLoss=Math.min(d*0.1,0.5);var skylight=effArea*(1+wellLoss);return{result:skylight,label:"Skylight Size",unit:"sq ft",steps:["Room: "+a+" sq ft","5% of room: "+(a*0.05).toFixed(0)+" sq ft","Skylight: "+skylight.toFixed(0)+" sq ft"]}
    },
    description: 'Determine optimal skylight size for room lighting.',
    formula: 'Skylight area = Room area x 0.05 (well factor)',
    interpretation: 'Standard: skylight should be 5% of room area for good daylighting. Max 15% to avoid overheating. Well depth reduces effective area.',
  },
'door-jamb': {
    schema: z.object({doorHeight: z.string(), doorWidth: z.string(), wallThick: z.string() }),
    fields: [
      { name: 'doorHeight', label: 'Door Height (in)', step: 1, min: 80 },
      { name: 'doorWidth', label: 'Door Width (in)', step: 1, min: 30 },
      { name: 'wallThick', label: 'Wall Thickness (in)', step: 0.5, min: 5.5 },
    ],
    compute: (v: Record<string, string>) => {
      var h=n(v.doorHeight),w=n(v.doorWidth),t=n(v.wallThick||"4.5");var jambLen=2*h+w+w*0.1;return{result:jambLen,label:"Jamb Length",unit:"in",steps:["Door: "+h+"x"+w+" in","Wall: "+t+" in thick","Jamb material: "+(jambLen/12).toFixed(1)+" ft"]}
    },
    description: 'Calculate door jamb dimensions and material.',
    formula: 'Jamb length = 2 x height + width + 10% waste',
    interpretation: 'Standard interior door: 80in height, 30-36in width. Jamb depth = wall thickness + 2 x 0.5in.',
  },
'door-header': {
    schema: z.object({span: z.string(), loadType: z.string() }),
    fields: [
      { name: 'span', label: 'Span (in)', step: 1, min: 36 },
      { name: 'loadType', label: 'Load Type', step: 1, min: 1 },
    ],
    compute: (v: Record<string, string>) => {
      var s=n(v.span),lt=n(v.loadType||"1");var factor=lt==1?1.5:1.0;var depth=s/12*factor;return{result:depth,label:"Header Depth",unit:"in",steps:["Span: "+s+" in = "+(s/12).toFixed(1)+" ft","Load factor: "+factor,"Depth: "+depth.toFixed(0)+" in"]}
    },
    description: 'Size door header for load-bearing walls.',
    formula: 'Header size = span x 1.5 (roof load) or span x 1.0 (floor load)',
    interpretation: 'For 6ft span roof load: use 2x8. For 8ft span: use 2x10. Doubled 2x with 0.5in plywood spacer.',
  },
'window-header': {
    schema: z.object({span: z.string() }),
    fields: [
      { name: 'span', label: 'Rough Opening Width (in)', step: 1, min: 24 },
    ],
    compute: (v: Record<string, string>) => {
      var s=n(v.span);var depth=Math.ceil(s/12*1.25);return{result:depth,label:"Header Depth",unit:"in",steps:["Opening: "+s+" in = "+(s/12).toFixed(1)+" ft","Use: "+depth+"in (e.g. 2x"+depth+")"]}
    },
    description: 'Size window header for load-bearing walls.',
    formula: 'Header depth = Span / 12 x 1.25',
    interpretation: 'Use doubled 2x lumber with plywood spacer. 2x4 for up to 3ft, 2x6 for 4-5ft, 2x8 for 6ft span.',
  },
'window-well': {
    schema: z.object({windowWidth: z.string(), windowHeight: z.string(), wellDepth: z.string() }),
    fields: [
      { name: 'windowWidth', label: 'Window Width (in)', step: 1, min: 28 },
      { name: 'windowHeight', label: 'Window Height (in)', step: 1, min: 20 },
      { name: 'wellDepth', label: 'Well Depth (in)', step: 1, min: 44 },
    ],
    compute: (v: Record<string, string>) => {
      var w=n(v.windowWidth),h=n(v.windowHeight),d=n(v.wellDepth||"44");var minArea=Math.max(w*h/144*1.5,9);return{result:minArea,label:"Min Well Floor Area",unit:"sq ft",steps:["Window: "+w+"x"+h+" in = "+(w*h/144).toFixed(0)+" sq ft","Min area: "+minArea.toFixed(1)+" sq ft"]}
    },
    description: 'Size window well for egress windows.',
    formula: 'Well area = Window area x 1.5 (min 9sqft total)',
    interpretation: 'IRC: egress well must provide min 9sqft at bottom. Project at least 36in from window. Ladder required if >44in deep.',
  },
'drywall-tape': {
    schema: z.object({sheets: z.string() }),
    fields: [
      { name: 'sheets', label: 'Number of 4x8 Sheets', step: 1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      var s=n(v.sheets);var jointLen=s*16;var rolls=Math.ceil(jointLen/500);return{result:rolls,label:"Tape Rolls",unit:"500ft rolls",steps:["Sheets: "+s,"Joint length: "+jointLen+" ft","Tape: "+rolls+" rolls"]}
    },
    description: 'Estimate drywall tape needed.',
    formula: 'Tape (rolls) = Total joint length / 500 (ft per roll)',
    interpretation: 'Standard rolls 500ft. Each 4x8 sheet has ~16ft of joints. Includes inside/outside corners.',
  },
'drywall-mud': {
    schema: z.object({sheets: z.string(), coats: z.string() }),
    fields: [
      { name: 'sheets', label: 'Number of 4x8 Sheets', step: 1, min: 0 },
      { name: 'coats', label: 'Number of Coats', step: 1, min: 3 },
    ],
    compute: (v: Record<string, string>) => {
      var s=n(v.sheets),c=n(v.coats||"3");var gal=s*0.1*c;return{result:gal,label:"Joint Compound",unit:"gal",steps:["Sheets: "+s+" sq ft = "+(s*32)+" sq ft","Coats: "+c,"Compound: "+gal.toFixed(1)+" gallons"]}
    },
    description: 'Calculate drywall joint compound (mud) needed.',
    formula: 'Mud (gallons) = Sheets x 0.1 (first coat)',
    interpretation: 'Standard: 1 gal per 100 sq ft per coat. 3 coats: tape, fill, finish. Lightweight compound for best results.',
  },
'corner-bead': {
    schema: z.object({corners: z.string(), ceilingHeight: z.string() }),
    fields: [
      { name: 'corners', label: 'Number of Outside Corners', step: 1, min: 0 },
      { name: 'ceilingHeight', label: 'Ceiling Height (ft)', step: 0.5, min: 8 },
    ],
    compute: (v: Record<string, string>) => {
      var c=n(v.corners),h=n(v.ceilingHeight||"8");var len=c*h;var pieces=Math.ceil(c*h/10);return{result:len,label:"Corner Bead",unit:"ft",steps:["Corners: "+c,"Height: "+h+" ft","Length: "+len+" ft","Pieces (10ft): "+pieces]}
    },
    description: 'Estimate corner bead lengths needed.',
    formula: 'Bead (ft) = Outside corners x 8ft (per story)',
    interpretation: 'Standard 8ft or 10ft lengths. Each outside corner needs one piece per floor. Use 1.5in bullnose for rounded corners.',
  },
'wainscoting-layout': {
    schema: z.object({wallLength: z.string(), panelWidth: z.string(), spacing: z.string() }),
    fields: [
      { name: 'wallLength', label: 'Wall Length (in)', step: 1, min: 0 },
      { name: 'panelWidth', label: 'Panel Width (in)', step: 1, min: 24 },
      { name: 'spacing', label: 'Spacing (in)', step: 0.5, min: 2 },
    ],
    compute: (v: Record<string, string>) => {
      var l=n(v.wallLength),w=n(v.panelWidth||"24"),s=n(v.spacing||"2");var panels=Math.floor((l+s)/(w+s));var leftover=l-(panels*w+(panels-1)*s);return{result:panels,label:"Number of Panels",unit:"",steps:["Wall: "+l+" in","Panel width: "+w+" in at "+s+"in spacing","Panels: "+panels,"Remainder: "+leftover.toFixed(1)+" in"]}
    },
    description: 'Plan wainscoting panel layout.',
    formula: 'Panels = Wall length / (panel_width + spacing)',
    interpretation: 'Standard wainscoting: 32-42in height. Panel width typically 2-3ft. Equal spacing to avoid narrow end panels.',
  },
'chair-rail-height': {
    schema: z.object({ceilingHeight: z.string() }),
    fields: [
      { name: 'ceilingHeight', label: 'Ceiling Height (ft)', step: 0.5, min: 8 },
    ],
    compute: (v: Record<string, string>) => {
      var h=n(v.ceilingHeight||"8");var classic=h*12*0.33;var modern=Math.min(42,Math.max(32,classic));return{result:modern,label:"Chair Rail Height",unit:"in",steps:["Ceiling: "+h+" ft = "+(h*12)+" in","Classic (1/3): "+classic.toFixed(0)+" in","Recommended: "+modern+" in"]}
    },
    description: 'Calculate optimal chair rail height.',
    formula: 'Classic height = Wall height x 0.33 | Modern = 36-42in',
    interpretation: 'Traditional: 1/3 wall height. Standard: 32-36in for 8ft ceiling, 36-42in for 9ft+. Consider window trim alignment.',
  },
'baseboard-length': {
    schema: z.object({perimeter: z.string(), doors: z.string() }),
    fields: [
      { name: 'perimeter', label: 'Room Perimeter (ft)', step: 1, min: 0 },
      { name: 'doors', label: 'Number of Doors', step: 1, min: 1 },
    ],
    compute: (v: Record<string, string>) => {
      var p=n(v.perimeter),d=n(v.doors||"1");var net=p-d*3;var total=net*1.1;return{result:total,label:"Baseboard Length",unit:"ft",steps:["Perimeter: "+p+" ft","Less doors: "+(d*3)+" ft","Net: "+net+" ft","With 10% waste: "+total.toFixed(0)+" ft"]}
    },
    description: 'Calculate baseboard trim needed.',
    formula: 'Baseboard = Perimeter - door_widths + 10% waste',
    interpretation: 'Measure each wall separately. Subtract door openings at base. Add 10% for miters and waste.',
  },
'shoe-molding': {
    schema: z.object({perimeter: z.string() }),
    fields: [
      { name: 'perimeter', label: 'Room Perimeter (ft)', step: 1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      var p=n(v.perimeter);var total=p*1.1;return{result:total,label:"Shoe Molding",unit:"ft",steps:["Perimeter: "+p+" ft","With waste: "+total.toFixed(0)+" ft"]}
    },
    description: 'Calculate shoe molding (quarter round) needed.',
    formula: 'Shoe = Perimeter + 10% waste',
    interpretation: 'Shoe molding covers expansion gap between floor and baseboard. Same length as baseboard minus doorways. Miter at corners.',
  },
'door-casing': {
    schema: z.object({doorHeight: z.string(), doorWidth: z.string() }),
    fields: [
      { name: 'doorHeight', label: 'Door Height (in)', step: 1, min: 80 },
      { name: 'doorWidth', label: 'Door Width (in)', step: 1, min: 30 },
    ],
    compute: (v: Record<string, string>) => {
      var h=n(v.doorHeight),w=n(v.doorWidth);var len=(2*h+w)/12*1.15;return{result:len,label:"Casing Length",unit:"ft",steps:["Door: "+h+"x"+w+" in","Casing length: "+len.toFixed(1)+" ft"]}
    },
    description: 'Calculate door casing trim lengths.',
    formula: 'Casing = 2 x height + width + 15% waste',
    interpretation: 'Standard casing: 2.25-3.5in wide. Mitered corners at 45 degrees. Add length for returns.',
  },
'window-trim': {
    schema: z.object({windowHeight: z.string(), windowWidth: z.string() }),
    fields: [
      { name: 'windowHeight', label: 'Window Height (in)', step: 1, min: 36 },
      { name: 'windowWidth', label: 'Window Width (in)', step: 1, min: 30 },
    ],
    compute: (v: Record<string, string>) => {
      var h=n(v.windowHeight),w=n(v.windowWidth);var len=(2*h+2*w)/12*1.15;return{result:len,label:"Window Trim",unit:"ft",steps:["Window: "+h+"x"+w+" in","Trim length: "+len.toFixed(1)+" ft"]}
    },
    description: 'Calculate window casing and stool trim.',
    formula: 'Trim = 2 x height + 2 x width + 15% waste',
    interpretation: 'Includes casing (sides/top) and stool (bottom). Standard stool projects 1-2in beyond casing.',
  },
'picture-rail': {
    schema: z.object({perimeter: z.string(), ceilingHeight: z.string() }),
    fields: [
      { name: 'perimeter', label: 'Room Perimeter (ft)', step: 1, min: 0 },
      { name: 'ceilingHeight', label: 'Ceiling Height (ft)', step: 0.5, min: 8 },
    ],
    compute: (v: Record<string, string>) => {
      var p=n(v.perimeter),h=n(v.ceilingHeight||"8");var height=h*12/6;var len=p*1.1;return{result:len,label:"Picture Rail",unit:"ft",steps:["Perimeter: "+p+" ft","Install at: "+height.toFixed(0)+" in from ceiling","Length: "+len.toFixed(0)+" ft"]}
    },
    description: 'Calculate picture rail molding needed.',
    formula: 'Rail = Perimeter + 10% waste, at 1/6 wall height from ceiling',
    interpretation: 'Victorian style: installed 6-18in below ceiling. Width 1.5-3in. Supports hanging wires with hooks.',
  },
'built-in-shelving': {
    schema: z.object({width: z.string(), height: z.string(), depth: z.string() }),
    fields: [
      { name: 'width', label: 'Unit Width (in)', step: 1, min: 48 },
      { name: 'height', label: 'Unit Height (in)', step: 1, min: 84 },
      { name: 'depth', label: 'Shelf Depth (in)', step: 1, min: 12 },
    ],
    compute: (v: Record<string, string>) => {
      var w=n(v.width),h=n(v.height),d=n(v.depth||"12");var shelves=Math.floor(h/14);var boardFt=w*h/144*1.15;return{result:shelves,label:"Number of Shelves",unit:"",steps:["Opening: "+w+"x"+h+"in depth "+d+"in","Max shelves: "+shelves+" at 14in spacing","Plywood: "+boardFt.toFixed(0)+" sq ft"]}
    },
    description: 'Plan built-in shelving dimensions and materials.',
    formula: 'Shelves = Width x depth x shelves x material_factor',
    interpretation: 'Standard shelf depth: 12in for books, 16in for storage. Shelf span max 36in for 0.75in material. Adjustable shelf pins every 2in.',
  },
'closet-rod-length': {
    schema: z.object({closetWidth: z.string() }),
    fields: [
      { name: 'closetWidth', label: 'Closet Width (in)', step: 1, min: 60 },
    ],
    compute: (v: Record<string, string>) => {
      var w=n(v.closetWidth);var supports=Math.ceil(w/48);return{result:supports,label:"Rod Supports",unit:"",steps:["Closet width: "+w+" in","Rod length: "+w+" in","Supports: "+supports]}
    },
    description: 'Calculate closet rod length and support spacing.',
    formula: 'Rod supports = Rod length / 48in intervals',
    interpretation: 'Max unsupported rod span: 48in for wood, 60in for metal. Heavy coats: reduce to 36in. Double rod: upper at 80in, lower at 42in.',
  },
'garage-shelving': {
    schema: z.object({wallWidth: z.string(), shelfDepth: z.string(), levels: z.string() }),
    fields: [
      { name: 'wallWidth', label: 'Available Wall Width (ft)', step: 1, min: 0 },
      { name: 'shelfDepth', label: 'Shelf Depth (in)', step: 1, min: 24 },
      { name: 'levels', label: 'Number of Shelf Levels', step: 1, min: 3 },
    ],
    compute: (v: Record<string, string>) => {
      var w=n(v.wallWidth),d=n(v.shelfDepth||"24"),l=n(v.levels||"3");var area=w*d/12*l;return{result:area,label:"Shelf Area",unit:"sq ft",steps:["Wall: "+w+" ft, depth "+d+" in","Levels: "+l,"Total shelf area: "+area.toFixed(0)+" sq ft"]}
    },
    description: 'Plan garage shelving layout.',
    formula: 'Shelf area = Width x depth x levels',
    interpretation: 'Standard garage shelf: 24in deep, 48-96in long, mounted 18in above floor. Heavy items: max 50lbs per linear ft.',
  },
'workbench-height': {
    schema: z.object({userHeight: z.string(), workType: z.string() }),
    fields: [
      { name: 'userHeight', label: 'Your Height (in)', step: 1, min: 69 },
      { name: 'workType', label: 'Work Type', step: 1, min: 1 },
    ],
    compute: (v: Record<string, string>) => {
      var h=n(v.userHeight),wt=n(v.workType||"1");var labels=["Precision (fine work)","General (light assembly)","Heavy (woodworking)"];var factors=[0.53,0.57,0.61];var bench=h*factors[Math.min(wt,3)-1];return{result:bench,label:"Bench Height",unit:"in",steps:["Height: "+h+" in","Type: "+labels[Math.min(wt,3)-1],"Bench height: "+bench.toFixed(0)+" in"]}
    },
    description: 'Calculate optimal workbench height for tasks.',
    formula: 'Bench height = 0.53 x height (precision) to 0.61 x height (heavy)',
    interpretation: 'Precision (36-42in): 0.53xheight. Light (34-37in): 0.57xheight. Heavy (30-34in): 0.61xheight.',
  },
'shop-lighting': {
    schema: z.object({length: z.string(), width: z.string(), fc: z.string() }),
    fields: [
      { name: 'length', label: 'Room Length (ft)', step: 1, min: 0 },
      { name: 'width', label: 'Room Width (ft)', step: 1, min: 0 },
      { name: 'fc', label: 'Target Foot-Candles', step: 10, min: 50 },
    ],
    compute: (v: Record<string, string>) => {
      var l=n(v.length),w=n(v.width),fc=n(v.fc||"75");var area=l*w;var lumens=area*fc;var fixtures=Math.ceil(lumens/4000);return{result:lumens,label:"Required Lumens",unit:"lm",steps:["Area: "+l+"x"+w+" = "+area+" sq ft","Target: "+fc+" fc","Lumens: "+lumens.toFixed(0)+" lm","4ft LED strips: "+fixtures]}
    },
    description: 'Calculate workshop lighting requirements.',
    formula: 'Lumens = Area x foot-candle requirement',
    interpretation: 'General workshop: 50-75 fc. Detail work: 100-150 fc. LED: ~100 lumens/watt. 4ft LED strip: ~4000 lumens.',
  },
'driveway-slope': {
    schema: z.object({rise: z.string(), run: z.string() }),
    fields: [
      { name: 'rise', label: 'Total Rise (in)', step: 0.25, min: 0 },
      { name: 'run', label: 'Total Run (in)', step: 12, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      var r=n(v.rise),u=n(v.run);var grade=r/u*100;var fpt=r/(u/12);var msg=grade<1?"Too flat, add slope":grade>15?"Too steep for cars":"Acceptable";return{result:grade,label:"Slope",unit:"%",steps:["Rise: "+r+" in over "+u+" in run","Grade: "+grade.toFixed(2)+"% = "+fpt.toFixed(3)+" in/ft",msg]}
    },
    description: 'Calculate driveway slope for proper drainage.',
    formula: 'Grade (%) = Rise / Run x 100',
    interpretation: 'Recommended: 1-5% slope (1/8-5/8in per ft). Min 1% for drainage. Max 15% for passenger vehicles.',
  },
'driveway-thickness': {
    schema: z.object({vehicle: z.string(), baseType: z.string() }),
    fields: [
      { name: 'vehicle', label: 'Vehicle Type', step: 1, min: 1 },
      { name: 'baseType', label: 'Base Type', step: 1, min: 1 },
    ],
    compute: (v: Record<string, string>) => {
      var vt=n(v.vehicle||"1");var thick=[4,5,6];var labels=["Passenger cars","Light trucks","Heavy vehicles"];return{result:thick[Math.min(vt,3)-1],label:"Slab Thickness",unit:"in",steps:["Use: "+labels[Math.min(vt,3)-1],"Concrete: "+thick[Math.min(vt,3)-1]+"in"]}
    },
    description: 'Determine concrete driveway thickness.',
    formula: 'Thickness = 4in (cars) to 6in (trucks) + base',
    interpretation: 'Passenger cars: 4in concrete + 4in base. Light trucks: 5in + 4in base. Heavy vehicles: 6in + 6in base.',
  },
'parking-stall': {
    schema: z.object({angle: z.string() }),
    fields: [
      { name: 'angle', label: 'Angle (degrees)', step: 1, min: 90 },
    ],
    compute: (v: Record<string, string>) => {
      var a=n(v.angle||"90");var w=a==90?9:a==60?9:8;var l=a==90?18:a==60?20:22;return{result:w+"x"+l,label:"Stall Size",unit:"ft",steps:["Angle: "+a+" degrees","Width: "+w+" ft","Length: "+l+" ft"]}
    },
    description: 'Calculate parking stall dimensions.',
    formula: 'Standard stall: 9ft x 18ft (90deg) | Compact: 8ft x 16ft',
    interpretation: 'Standard: 9x18ft (9x20ft for ADA accessible). 60deg: 9x20ft. Parallel: 8x22ft. ADA: 8ft + 5ft access aisle.',
  },
'sidewalk-slope': {
    schema: z.object({length: z.string(), desiredSlope: z.string() }),
    fields: [
      { name: 'length', label: 'Sidewalk Length (ft)', step: 1, min: 0 },
      { name: 'desiredSlope', label: 'Desired Slope (in/ft)', step: 0.125, min: 0.25 },
    ],
    compute: (v: Record<string, string>) => {
      var l=n(v.length),s=n(v.desiredSlope||"0.25");var rise=l*s;var grade=s/12*100;return{result:rise,label:"Total Rise",unit:"in",steps:["Length: "+l+" ft","Slope: "+s+" in/ft = "+grade.toFixed(2)+"%","Rise: "+rise.toFixed(1)+" in"]}
    },
    description: 'Calculate proper sidewalk slope for drainage and ADA.',
    formula: 'Slope = 1/4in per ft (2%) max for ADA, 1/8in per ft (1%) min',
    interpretation: 'ADA max cross slope: 2% (1/4in per ft). Min for drainage: 1% (1/8in per ft). Running slope max 5% without landing.',
  },
'curb-ramp': {
    schema: z.object({curbHeight: z.string(), width: z.string() }),
    fields: [
      { name: 'curbHeight', label: 'Curb Height (in)', step: 0.5, min: 6 },
      { name: 'width', label: 'Ramp Width (in)', step: 1, min: 48 },
    ],
    compute: (v: Record<string, string>) => {
      var h=n(v.curbHeight),w=n(v.width||"48");var rampLen=h*12;return{result:rampLen,label:"Ramp Length",unit:"in",steps:["Curb: "+h+" in","Min length (1:12): "+rampLen+" in = "+(rampLen/12).toFixed(1)+" ft","Width: "+w+" in = "+(w/12).toFixed(0)+" ft"]}
    },
    description: 'Design ADA-compliant curb ramp dimensions.',
    formula: 'Ramp length = Curb height x 12 (ADA 1:12 max)',
    interpretation: 'ADA: max 1:12 slope (8.33%). Min width 36in. Flared sides max 1:10. Detectable warning required.',
  },
'as-built': {
    schema: z.object({measured: z.string(), corrFactor: z.string() }),
    fields: [
      { name: 'measured', label: 'Measured Distance (ft)', step: 1, min: 0 },
      { name: 'corrFactor', label: 'Correction Factor', step: 0.00001, min: 1 },
    ],
    compute: (v: Record<string, string>) => {
      var m=n(v.measured),c=n(v.corrFactor||"1");var trueDist=m*c;return{result:trueDist,label:"True Distance",unit:"ft",steps:["Measured: "+m+" ft","Factor: "+c,"True: "+trueDist.toFixed(2)+" ft"]}
    },
    description: 'Calculate as-built measurement adjustments.',
    formula: 'True distance = Measured x tape_correction factor',
    interpretation: 'Tape correction accounts for temperature, tension, and sag. Standard: 100ft steel tape at 68F, 10lb tension, fully supported.',
  },
'tape-correction': {
    schema: z.object({length: z.string(), temp: z.string() }),
    fields: [
      { name: 'length', label: 'Measured Length (ft)', step: 1, min: 0 },
      { name: 'temp', label: 'Temperature (F)', step: 1, min: 68 },
    ],
    compute: (v: Record<string, string>) => {
      var l=n(v.length),t=n(v.temp||"68");var ct=0.00000645*l*(t-68);var corr=l+ct;return{result:corr,label:"Corrected Length",unit:"ft",steps:["Measured: "+l+" ft at "+t+"F","Correction: "+ct.toFixed(4)+" ft","True: "+corr.toFixed(2)+" ft"]}
    },
    description: 'Calculate steel tape temperature correction.',
    formula: 'Ct = 0.00000645 x L x (T - 68)',
    interpretation: 'Steel expansion coefficient: 0.00000645 per deg F. Add to measured length if above 68F, subtract if below.',
  },
'survey-baseline': {
    schema: z.object({measured: z.string() }),
    fields: [
      { name: 'measured', label: 'Measured Distance (m)', step: 1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      var m=n(v.measured);var corr=m*(1+1/1000000);var error=m/1000000;return{result:corr,label:"Baseline Distance",unit:"m",steps:["Measured: "+m+" m","Error: "+error.toFixed(3)+" m","Corrected: "+corr.toFixed(3)+" m"]}
    },
    description: 'Calculate survey baseline distance and accuracy.',
    formula: 'Baseline = Measured x (1 + 1/1000000)',
    interpretation: 'EGP baseline accuracy: 1:1,000,000 or better. Multiple measurements required. Temperature and pressure correction applied.',
  },
'traverse-closure': {
    schema: z.object({dE: z.string(), dN: z.string(), perimeter: z.string() }),
    fields: [
      { name: 'dE', label: 'Latitude Error (ft)', step: 0.001, min: 0 },
      { name: 'dN', label: 'Departure Error (ft)', step: 0.001, min: 0 },
      { name: 'perimeter', label: 'Traverse Perimeter (ft)', step: 1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      var de=n(v.dE),dn=n(v.dN),p=n(v.perimeter);var closure=Math.sqrt(de*de+dn*dn)/p;var ratio=closure>0?1/closure:0;return{result:ratio>0?ratio:0,label:"Closure Ratio",unit:"1:",steps:["dE: "+de+" ft, dN: "+dn+" ft","Closure: "+(closure*100).toFixed(4)+"%","Ratio: 1:"+(ratio>0?ratio.toFixed(0):"N/A")]}
    },
    description: 'Calculate traverse closure error and adjustment.',
    formula: 'Closure = sqrt(dE2 + dN2) / Perimeter',
    interpretation: 'Allowable error depends on survey class. First-order: 1:10,000. Second-order: 1:5,000. Third-order: 1:2,000.',
  },
'leveling-net': {
    schema: z.object({bsSum: z.string(), fsSum: z.string(), knownDH: z.string() }),
    fields: [
      { name: 'bsSum', label: 'Sum of Backsights (ft)', step: 0.001, min: 0 },
      { name: 'fsSum', label: 'Sum of Foresights (ft)', step: 0.001, min: 0 },
      { name: 'knownDH', label: 'Known Elevation Diff (ft)', step: 0.001, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      var bs=n(v.bsSum),fs=n(v.fsSum),kdh=n(v.knownDH);var mis=bs-fs-kdh;return{result:mis,label:"Misclosure",unit:"ft",steps:["BS sum: "+bs.toFixed(3)+" ft","FS sum: "+fs.toFixed(3)+" ft","Misclosure: "+mis.toFixed(3)+" ft"]}
    },
    description: 'Calculate leveling network adjustment.',
    formula: 'Misclosure = Σ backsight - Σ foresight - known ΔH',
    interpretation: 'Allowable: ±0.007ft x sqrt(distance in miles) for first-order. Differential leveling with turning points.',
  },
'contour-interval': {
    schema: z.object({scale: z.string(), terrain: z.string() }),
    fields: [
      { name: 'scale', label: 'Map Scale Denominator', step: 1000, min: 24000 },
      { name: 'terrain', label: 'Terrain Type', step: 1, min: 1 },
    ],
    compute: (v: Record<string, string>) => {
      var s=n(v.scale),t=n(v.terrain||"1");var factors=[1,2,5,10];var ci=Math.round(s/2000)*factors[Math.min(t,4)-1]/10;return{result:ci,label:"Contour Interval",unit:"ft",steps:["Scale: 1:"+s,"CI: "+ci.toFixed(1)+" ft"]}
    },
    description: 'Determine contour interval for topographic maps.',
    formula: 'CI = 1/2000 x scale denominator (imperial: 1/1000)',
    interpretation: 'Flat terrain: 1ft, Rolling: 2-5ft, Mountainous: 10-25ft. Map scale 1:24000 typically uses 5-10ft CI.',
  },
'slope-stake': {
    schema: z.object({height: z.string(), slopeRatio: z.string() }),
    fields: [
      { name: 'height', label: 'Cut/Fill Height (ft)', step: 0.5, min: 0 },
      { name: 'slopeRatio', label: 'Slope Ratio (H:V)', step: 0.5, min: 1.5 },
    ],
    compute: (v: Record<string, string>) => {
      var h=n(v.height),sr=n(v.slopeRatio||"1.5");var offset=h*sr;return{result:offset,label:"Slope Stake Offset",unit:"ft",steps:["Cut/Fill: "+h+" ft","Slope: "+sr+":1","Offset: "+offset.toFixed(2)+" ft from hinge"]}
    },
    description: 'Calculate slope stake offset for construction.',
    formula: 'Offset = Cut/Fill x slope_ratio',
    interpretation: 'Common slopes: 1:1 (45 deg), 1.5:1 (34 deg), 2:1 (26 deg). Stake offset from centerline at each station.',
  },
'cut-fill-calc': {
    schema: z.object({area1: z.string(), area2: z.string(), stationDist: z.string() }),
    fields: [
      { name: 'area1', label: 'Cross-section Area 1 (sq ft)', step: 1, min: 0 },
      { name: 'area2', label: 'Cross-section Area 2 (sq ft)', step: 1, min: 0 },
      { name: 'stationDist', label: 'Station Distance (ft)', step: 1, min: 50 },
    ],
    compute: (v: Record<string, string>) => {
      var a1=n(v.area1),a2=n(v.area2),d=n(v.stationDist||"50");var vol=(a1+a2)/2*d/27;return{result:vol,label:"Volume",unit:"cu yd",steps:["Area 1: "+a1+" sq ft, Area 2: "+a2+" sq ft","Avg area: "+((a1+a2)/2).toFixed(0)+" sq ft","Volume: "+vol.toFixed(1)+" cu yd"]}
    },
    description: 'Calculate cut and fill volumes for earthwork.',
    formula: 'Volume = Area x Average depth (end area method)',
    interpretation: 'Use cross-section end areas at regular stations. Cut and fill balanced for mass haul. Shrinkage/swell factor: 1.25 for clay, 1.15 for sand.',
  },
'excavation-slope': {
    schema: z.object({soilType: z.string(), depth: z.string() }),
    fields: [
      { name: 'soilType', label: 'Soil Type', step: 1, min: 1 },
      { name: 'depth', label: 'Excavation Depth (ft)', step: 1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      var st=n(v.soilType||"1"),d=n(v.depth);var ratios=[0.75,1,1.5];var labels=["Type A (stable)","Type B (moderate)","Type C (unstable)"];var r=ratios[Math.min(st,3)-1];var angle=Math.atan2(1,r)*180/Math.PI;var width=d*r;return{result:angle,label:"Slope Angle",unit:"deg",steps:["Soil: "+labels[Math.min(st,3)-1],"Ratio: "+r+":1","Angle: "+angle.toFixed(1)+" deg","Width at top: "+width.toFixed(1)+" ft"]}
    },
    description: 'Calculate excavation slope angles for safety.',
    formula: 'Slope angle = atan(1/slope_ratio) | Max = 1.5:1 (34 deg)',
    interpretation: 'OSHA Type A: 0.75:1 (53 deg). Type B: 1:1 (45 deg). Type C: 1.5:1 (34 deg). Benching required >20ft depth.',
  },
'trench-safety': {
    schema: z.object({depth: z.string(), length: z.string(), soilType: z.string() }),
    fields: [
      { name: 'depth', label: 'Trench Depth (ft)', step: 0.5, min: 0 },
      { name: 'length', label: 'Trench Length (ft)', step: 1, min: 0 },
      { name: 'soilType', label: 'Soil Type', step: 1, min: 1 },
    ],
    compute: (v: Record<string, string>) => {
      var d=n(v.depth),l=n(v.length),st=n(v.soilType);var req=d>5?(d>20?"Engineered design required":"Shoring/shielding/sloping required"):"No protection required";var spoil=d*2;return{result:req,label:"Protection Requirement",unit:"",steps:["Depth: "+d+" ft","Spoil min distance: "+spoil.toFixed(0)+" ft",req]}
    },
    description: 'Calculate trench safety requirements per OSHA.',
    formula: 'Protection required >5ft depth >20ft = engineered',
    interpretation: 'OSHA: less than 5ft can be stable. 5-20ft requires shoring, shielding, or sloping. Over 20ft requires engineered design.',
  },
'cofferdam-design': {
    schema: z.object({waterDepth: z.string(), excavDepth: z.string() }),
    fields: [
      { name: 'waterDepth', label: 'Water Depth (ft)', step: 1, min: 0 },
      { name: 'excavDepth', label: 'Excavation Depth (ft)', step: 1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      var wd=n(v.waterDepth),ed=n(v.excavDepth);var pileDepth=Math.max(wd+ed,wd*1.5)+5;return{result:pileDepth,label:"Pile Depth",unit:"ft",steps:["Water: "+wd+" ft, Excavation: "+ed+" ft","Estimated pile depth: "+pileDepth.toFixed(0)+" ft"]}
    },
    description: 'Calculate cofferdam sheet pile requirements.',
    formula: 'Depth = H x (gw / geff) x FS',
    interpretation: 'Sheet pile cofferdam: cantilever or braced. Cantilever max ~15ft for light conditions. Braced for deeper excavations.',
  },
'dewatering-flow': {
    schema: z.object({k: z.string(), head: z.string(), length: z.string() }),
    fields: [
      { name: 'k', label: 'Hydraulic Conductivity (ft/day)', step: 0.1, min: 10 },
      { name: 'head', label: 'Head Difference (ft)', step: 1, min: 0 },
      { name: 'length', label: 'Excavation Length (ft)', step: 1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      var k=n(v.k||"10"),h=n(v.head),l=n(v.length);var q=k*h*l/200;return{result:q,label:"Flow Rate",unit:"gpm",steps:["k="+k+" ft/day, head="+h+" ft","Q: "+q.toFixed(1)+" gpm"]}
    },
    description: 'Calculate dewatering flow rate for excavations.',
    formula: 'Q = k x H x L / R (Dupuit equation)',
    interpretation: 'k = hydraulic conductivity (ft/day). H = head (ft). L = excavation length (ft). R = radius of influence (~100-1000ft for sand).',
  },
'pile-driving': {
    schema: z.object({hammerWt: z.string(), drop: z.string(), setSet: z.string() }),
    fields: [
      { name: 'hammerWt', label: 'Hammer Weight (kips)', step: 0.5, min: 5 },
      { name: 'drop', label: 'Hammer Drop (ft)', step: 0.5, min: 3 },
      { name: 'setSet', label: 'Set (in/blow)', step: 0.01, min: 0.25 },
    ],
    compute: (v: Record<string, string>) => {
      var w=n(v.hammerWt),h=n(v.drop),s=n(v.setSet||"0.1");var cap=2*w*h/(s+0.1);return{result:cap,label:"Allowable Capacity",unit:"kips",steps:["Hammer: "+w+" kips, drop "+h+" ft","Set: "+s+" in/blow","Capacity: "+cap.toFixed(1)+" kips"]}
    },
    description: 'Estimate pile driving capacity and requirements.',
    formula: 'Capacity = (Wxh)/(S+0.1) x 2 (Engineering News formula)',
    interpretation: 'ENR formula: allowable capacity = 2Wh/(S+0.1). W=hammer weight (kips), h=fall (ft), S=set (in/blow). Safety factor 2-6.',
  },
'drilled-shaft': {
    schema: z.object({diameter: z.string(), depth: z.string(), endBearing: z.string() }),
    fields: [
      { name: 'diameter', label: 'Shaft Diameter (ft)', step: 0.5, min: 3 },
      { name: 'depth', label: 'Shaft Depth (ft)', step: 1, min: 0 },
      { name: 'endBearing', label: 'End Bearing Capacity (ksf)', step: 1, min: 50 },
    ],
    compute: (v: Record<string, string>) => {
      var d=n(v.diameter),dep=n(v.depth),eb=n(v.endBearing||"50");var endArea=Math.PI*d*d/4;var endCap=endArea*eb;var skinCap=dep*Math.PI*d*2;return{result:endCap+skinCap,label:"Estimated Capacity",unit:"kips",steps:["Diameter: "+d+" ft, Depth: "+dep+" ft","End bearing: "+endCap.toFixed(0)+" kips","Skin friction: "+skinCap.toFixed(0)+" kips"]}
    },
    description: 'Calculate drilled shaft (caisson) dimensions.',
    formula: 'Capacity = End bearing + Skin friction (alpha-method)',
    interpretation: 'Drilled shafts: 2-10ft diameter, up to 100ft+ deep. End bearing in rock: 50-100ksf. Skin friction varies by soil type.',
  },
'helical-pile': {
    schema: z.object({helixDiam: z.string(), numHelix: z.string(), torqueM: z.string() }),
    fields: [
      { name: 'helixDiam', label: 'Helix Diameter (in)', step: 1, min: 10 },
      { name: 'numHelix', label: 'Number of Helices', step: 1, min: 2 },
      { name: 'torqueM', label: 'Installation Torque (ft-lbs)', step: 100, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      var d=n(v.helixDiam||"10"),nh=n(v.numHelix||"2"),t=n(v.torqueM);var area=nh*Math.PI*d*d/4/144;var cap=t*10/1000;return{result:cap,label:"Compression Capacity",unit:"kips",steps:["Helix: "+d+"in x "+nh+" = "+area.toFixed(2)+" sq ft","Torque: "+t+" ft-lbs","Capacity: "+cap.toFixed(1)+" kips"]}
    },
    description: 'Calculate helical pile capacity and sizing.',
    formula: 'Capacity = sum(helix_area x bearing_capacity)',
    interpretation: 'Helical piles: 1.5-3in shaft, 8-14in helix plates. Min 2 helixes, 3D spacing. Torque correlation: capacity = torque x 10 (kips).',
  },
'tieback-anchor': {
    schema: z.object({bondLen: z.string(), groutDiam: z.string(), bondStress: z.string() }),
    fields: [
      { name: 'bondLen', label: 'Bond Length (ft)', step: 1, min: 20 },
      { name: 'groutDiam', label: 'Grout Hole Diameter (in)', step: 1, min: 8 },
      { name: 'bondStress', label: 'Bond Stress (psi)', step: 1, min: 10 },
    ],
    compute: (v: Record<string, string>) => {
      var l=n(v.bondLen),d=n(v.groutDiam||"8"),s=n(v.bondStress||"10");var area=l*d/12*Math.PI*144;var cap=area*s/1000;return{result:cap,label:"Anchor Capacity",unit:"kips",steps:["Bond length: "+l+" ft, diameter: "+d+" in","Capacity: "+cap.toFixed(0)+" kips"]}
    },
    description: 'Design tieback anchor for retaining walls.',
    formula: 'Capacity = Bond_length x grout_diameter x bond_stress',
    interpretation: 'Tiebacks: 15-30 degree inclination. Bond zone in competent soil/rock. Grout diameter: 6-12in. Bond stress: 5-20psi.',
  },
'shotcrete-thickness': {
    schema: z.object({type: z.string(), slopeHeight: z.string() }),
    fields: [
      { name: 'type', label: 'Application Type', step: 1, min: 1 },
      { name: 'slopeHeight', label: 'Slope Height (ft)', step: 1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      var t=n(v.type||"1"),sh=n(v.slopeHeight);var thick=t==1?6:10;var rebar=thick>6?"#4 @ 12in OC":"WWF 6x6 W2.9";return{result:thick,label:"Shotcrete Thickness",unit:"in",steps:["Type: "+(t==1?"Temporary":"Permanent"),"Thickness: "+thick+" in","Reinforcement: "+rebar]}
    },
    description: 'Calculate shotcrete thickness for slope stabilization.',
    formula: 'Thickness = 4-6in for temporary, 6-12in for permanent',
    interpretation: 'Temporary slope stabilization: 4-6in with WWF. Permanent: 6-12in with rebar. Max unsupported span: 15ft.',
  },
'grout-consolidation': {
    schema: z.object({porosity: z.string(), length: z.string(), width: z.string(), depth: z.string() }),
    fields: [
      { name: 'porosity', label: 'Soil Porosity (%)', step: 1, min: 20 },
      { name: 'length', label: 'Treatment Length (ft)', step: 1, min: 0 },
      { name: 'width', label: 'Treatment Width (ft)', step: 1, min: 0 },
      { name: 'depth', label: 'Treatment Depth (ft)', step: 1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      var p=n(v.porosity||"20"),l=n(v.length),w=n(v.width),d=n(v.depth);var vol=l*w*d*p/100*1.25;return{result:vol,label:"Grout Volume",unit:"cu ft",steps:["Treatment: "+l+"x"+w+"x"+d+" ft","Porosity: "+p+"%","Grout: "+vol.toFixed(0)+" cu ft"]}
    },
    description: 'Estimate grout volume for soil consolidation.',
    formula: 'Grout = Porosity x treatment_volume x (1 + waste)',
    interpretation: 'Permeation grouting: fine sand 20-40% porosity. Fracture grouting: larger volume. Waste factor: 20-30% for bleed/leakage.',
  },
'cold-joint': {
    schema: z.object({setTime: z.string(), pourRate: z.string() }),
    fields: [
      { name: 'setTime', label: 'Initial Set Time (hours)', step: 0.25, min: 2 },
      { name: 'pourRate', label: 'Placement Rate (cu yd/hr)', step: 1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      var st=n(v.setTime||"2"),pr=n(v.pourRate);var maxVol=st*pr;return{result:maxVol,label:"Max Volume per Lift",unit:"cu yd",steps:["Set time: "+st+" hours","Rate: "+pr+" cu yd/hr","Max: "+maxVol.toFixed(0)+" cu yd"]}
    },
    description: 'Calculate cold joint spacing in concrete placement.',
    formula: 'Max interval = Initial set time / placement rate',
    interpretation: 'Cold joint occurs when new concrete placed on partially set concrete (typically >2 hours delay in hot weather).',
  },
'control-joint': {
    schema: z.object({slabThick: z.string(), exposure: z.string() }),
    fields: [
      { name: 'slabThick', label: 'Slab Thickness (in)', step: 0.5, min: 4 },
      { name: 'exposure', label: 'Exposure', step: 1, min: 1 },
    ],
    compute: (v: Record<string, string>) => {
      var t=n(v.slabThick),e=n(v.exposure||"1");var factor=e==1?30:24;var spacing=t*factor/12;return{result:spacing,label:"Joint Spacing",unit:"ft",steps:["Slab: "+t+" in "+(e==1?"interior":"exterior"),"Spacing: "+spacing.toFixed(0)+" ft"]}
    },
    description: 'Calculate control joint spacing for concrete slabs.',
    formula: 'Joint spacing = Slab thickness x 24-36 (in)',
    interpretation: 'Interior slabs: 2-3x thickness in feet (e.g., 4in slab to 8-12ft). Exterior: 1.5x. Max 15ft. Cut 1/4 depth within 24hrs.',
  },
'isolation-joint': {
    schema: z.object({perimeter: z.string(), jointThick: z.string() }),
    fields: [
      { name: 'perimeter', label: 'Perimeter (ft)', step: 1, min: 0 },
      { name: 'jointThick', label: 'Joint Thickness (in)', step: 0.25, min: 0.5 },
    ],
    compute: (v: Record<string, string>) => {
      var p=n(v.perimeter),jt=n(v.jointThick||"0.5");var area=p*jt/12;return{result:area,label:"Joint Material",unit:"sq ft",steps:["Perimeter: "+p+" ft","Thickness: "+jt+" in","Material: "+area.toFixed(2)+" sq ft"]}
    },
    description: 'Calculate isolation joint material needs.',
    formula: 'Joint material = Perimeter x joint_thickness',
    interpretation: 'Isolate slabs from columns, walls, and footings. Use 0.5-1in compressible filler (asphalt-impregnated fiberboard).',
  },
'waterstop': {
    schema: z.object({jointLength: z.string(), jointType: z.string() }),
    fields: [
      { name: 'jointLength', label: 'Joint Length (ft)', step: 1, min: 0 },
      { name: 'jointType', label: 'Joint Type', step: 1, min: 1 },
    ],
    compute: (v: Record<string, string>) => {
      var l=n(v.jointLength),jt=n(v.jointType||"1");var len=l*1.1;return{result:len,label:"Waterstop Length",unit:"ft",steps:["Joint: "+l+" ft","With laps: "+len.toFixed(1)+" ft"]}
    },
    description: 'Calculate waterstop requirements for construction joints.',
    formula: 'Waterstop length = Joint length x 1.1 (overlaps)',
    interpretation: 'PVC waterstop: 6-9in wide. Minimum 4in embedment each side. Lap splices: 4in minimum. Use at below-grade construction joints.',
  },
'scaffold-ties': {
    schema: z.object({scaffoldHeight: z.string(), scaffoldWidth: z.string() }),
    fields: [
      { name: 'scaffoldHeight', label: 'Scaffold Height (ft)', step: 1, min: 0 },
      { name: 'scaffoldWidth', label: 'Scaffold Width (ft)', step: 1, min: 5 },
    ],
    compute: (v: Record<string, string>) => {
      var h=n(v.scaffoldHeight),w=n(v.scaffoldWidth);var req=h>4*w;return{result:req?"Ties required":"No ties needed",label:"Result",unit:"",steps:["Height: "+h+" ft, width: "+w+" ft",req?"Ties required at max 26ft vertical":"No ties needed - height less than 4x width"]}
    },
    description: 'Calculate scaffold tie spacing and requirements.',
    formula: 'Tie spacing = 30ft horizontal x 26ft vertical (light duty)',
    interpretation: 'OSHA: ties required when height > 4x base width. Max horizontal: 30ft. Max vertical: 26ft. Use 5000lb rated ties.',
  },
'ladder-angle': {
    schema: z.object({ladderHeight: z.string() }),
    fields: [
      { name: 'ladderHeight', label: 'Ladder Working Height (ft)', step: 1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      var h=n(v.ladderHeight);var base=h/4;var angle=Math.acos(base/h)*180/Math.PI;return{result:angle,label:"Safe Angle",unit:"deg",steps:["Ladder: "+h+" ft","Base out: "+base.toFixed(1)+" ft (4:1 rule)","Angle: "+angle.toFixed(1)+" deg"]}
    },
    description: 'Calculate safe ladder angle and placement.',
    formula: 'Angle = arccos(base/height) | 4:1 rule: base at 1ft for 4ft height',
    interpretation: 'OSHA 4:1 rule: base 1ft out for every 4ft of height (about 75.5 degrees). Extension ladder: extend 3ft above landing.',
  },
'fall-protection': {
    schema: z.object({lanyardLen: z.string(), workingHeight: z.string() }),
    fields: [
      { name: 'lanyardLen', label: 'Lanyard Length (ft)', step: 0.5, min: 6 },
      { name: 'workingHeight', label: 'Working Height (ft)', step: 1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      var ll=n(v.lanyardLen||"6"),wh=n(v.workingHeight);var fallDist=ll+3.5+5+2;return{result:fallDist,label:"Min Clearance",unit:"ft",steps:["Lanyard: "+ll+" ft, decel: 3.5 ft, D-ring: 5 ft, safety: 2 ft","Total fall distance: "+fallDist.toFixed(1)+" ft",wh>fallDist?"SAFE":"NEED SHORTER LANYARD"]}
    },
    description: 'Calculate fall protection lanyard requirements.',
    formula: 'Total fall distance = lanyard + deceleration + D-ring to feet + safety factor',
    interpretation: '6ft lanyard + 3.5ft deceleration + 5ft D-ring height + 2ft safety = 16.5ft min clearance. PFAS required for >6ft in construction.',
  },
'confined-space': {
    schema: z.object({length: z.string(), width: z.string(), height: z.string() }),
    fields: [
      { name: 'length', label: 'Space Length (ft)', step: 1, min: 0 },
      { name: 'width', label: 'Space Width (ft)', step: 1, min: 0 },
      { name: 'height', label: 'Space Height (ft)', step: 1, min: 0 },
    ],
    compute: (v: Record<string, string>) => {
      var l=n(v.length),w=n(v.width),h=n(v.height);var vol=l*w*h;var cfm=vol*6/60;return{result:cfm,label:"Required Ventilation",unit:"cfm",steps:["Space: "+l+"x"+w+"x"+h+" = "+vol+" cu ft","Changes: 6/hour = "+cfm.toFixed(0)+" cfm"]}
    },
    description: 'Calculate confined space ventilation requirements.',
    formula: 'Ventilation = 6 air changes/hour min',
    interpretation: 'OSHA: 19.5-23.5% O2. Ventilation rate: 2000 cfm minimum for general space. Continuous monitoring required for permit spaces.',
  },
'lockout-tagout': {
    schema: z.object({energySources: z.string(), workers: z.string() }),
    fields: [
      { name: 'energySources', label: 'Energy Sources', step: 1, min: 1 },
      { name: 'workers', label: 'Number of Workers', step: 1, min: 1 },
    ],
    compute: (v: Record<string, string>) => {
      var es=n(v.energySources),wk=n(v.workers);var locks=es*wk+1;return{result:locks,label:"Locks Required",unit:"",steps:["Energy sources: "+es+", workers: "+wk,"Locks: "+locks]}
    },
    description: 'Calculate lockout/tagout device requirements.',
    formula: 'Locks = Energy sources x workers + 1 group lock',
    interpretation: 'OSHA: each worker needs personal lock. Group LOTO uses hasp with multiple locks. Verify zero energy state after application.',
  },
'hoist-speed': {
    schema: z.object({load: z.string(), motorHP: z.string() }),
    fields: [
      { name: 'load', label: 'Load Weight (lbs)', step: 100, min: 0 },
      { name: 'motorHP', label: 'Motor Power (HP)', step: 1, min: 5 },
    ],
    compute: (v: Record<string, string>) => {
      var l=n(v.load),hp=n(v.motorHP||"5");var speed=hp*33000*0.8/l;return{result:speed,label:"Lifting Speed",unit:"ft/min",steps:["Load: "+l+" lbs, motor: "+hp+" HP","Speed: "+speed.toFixed(0)+" ft/min"]}
    },
    description: 'Calculate hoist lifting speed and capacity.',
    formula: 'Speed = Motor power x efficiency / Load',
    interpretation: 'Typical construction hoist: 100-200 ft/min. Material hoist: 50-100 ft/min. Factor of safety: 5:1 for personnel, 3:1 for material.',
  },
}
