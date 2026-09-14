import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), width: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), depth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), unit: z.enum(['ft', 'm']) }),
  fields: [
    { name: 'length', label: 'Length', type: 'number', min: 1, step: '1' },
    { name: 'width', label: 'Width', type: 'number', min: 1, step: '1' },
    { name: 'depth', label: 'Depth', type: 'number', min: 0.5, step: '0.5' },
    { name: 'unit', label: 'Unit', type: 'select', options: [{ label: 'Feet (cu yd result)', value: 'ft' }, { label: 'Meters (cu m result)', value: 'm' }] },
  ],
  defaults: { length: '20', width: '10', depth: '3', unit: 'ft' },
  presets: [
    { label: 'Small Flower Bed', values: { length: '10', width: '5', depth: '3', unit: 'ft' } },
    { label: 'Medium Garden', values: { length: '20', width: '10', depth: '3', unit: 'ft' } },
    { label: 'Large Landscape', values: { length: '50', width: '20', depth: '4', unit: 'ft' } },
    { label: 'Tree Ring (2 ft radius)', values: { length: '4', width: '4', depth: '3', unit: 'ft' } },
  ],
  compute: (v) => { if (v.unit === 'ft') { const depthFt = v.depth / 12; const volumeCF = v.length * v.width * depthFt; const volumeCY = volumeCF / 27; const bags2cf = Math.ceil(volumeCY * 13.5); const bags3cf = Math.ceil(volumeCY * 9); const bulkCost = volumeCY * 40; const bag2Cost = bags2cf * 4; const bag3Cost = bags3cf * 5; return { result: volumeCY, label: 'Mulch Volume', unit: 'cu yd', steps: [
    { label: 'Bed Area', value: `${v.length} ft × ${v.width} ft = ${(v.length * v.width)} sq ft` },
    { label: 'Depth in Feet', value: `${v.depth} in / 12 = ${depthFt.toFixed(3)} ft` },
    { label: 'Volume (cubic ft)', value: `${(v.length * v.width).toFixed(0)} sq ft × ${depthFt.toFixed(3)} ft = ${volumeCF.toFixed(1)} cu ft` },
    { label: 'Volume (cubic yd)', value: `${volumeCF.toFixed(1)} cu ft / 27 = ${volumeCY.toFixed(2)} cu yd` },
    { label: 'Coverage', value: `1 cu yd covers ~${(27 / depthFt).toFixed(0)} sq ft at ${v.depth} in depth` },
    { label: '2 cu ft Bags Needed', value: `${bags2cf} bags (~$${bag2Cost.toFixed(0)})` },
    { label: '3 cu ft Bags Needed', value: `${bags3cf} bags (~$${bag3Cost.toFixed(0)})` },
    { label: 'Bulk (cu yd)', value: `${volumeCY.toFixed(2)} cu yd (~$${bulkCost.toFixed(0)})` },
  ] ,
    extras: [
      { label: 'Bulk vs Bagged Savings', value: `Bulk mulch costs $30-50/cu yd vs bagged at $70-120/cu yd equivalent — bulk saves 40-60%.` },
      { label: 'Standard Depth', value: '2-3 inches for flower beds, 3-4 inches for walkways and play areas. Never exceed 4 inches to avoid root rot.' },
      { label: 'Coverage Reference', value: '1 cubic yard covers ~100 sq ft at 3 inches deep, ~160 sq ft at 2 inches deep.' },
      { label: 'Dyed vs Natural', value: 'Dyed mulch (black, red, brown) lasts longer without fading but does not enrich soil. Natural mulch decomposes and adds nutrients.' },
      { label: 'Best Mulch Types', value: 'Hardwood: best for ornamentals. Pine bark: acid-loving plants. Cedar: repels insects. Rubber: permanent but no soil benefit.' },
      { label: 'Delivery Costs', value: 'Bulk mulch delivery: $40-75 flat fee or free over $200. Bagged: transport in your vehicle.' },
      { label: 'Mulch Math', value: `Your ${(v.length * v.width).toFixed(0)} sq ft bed needs ${volumeCY.toFixed(2)} cu yd. Bagged: ${bags2cf} bags (2cf) or ${bags3cf} bags (3cf).` },
    ]} } else { const depthM = v.depth / 100; const volumeM3 = v.length * v.width * depthM; return { result: volumeM3, label: 'Mulch Volume', unit: 'cu m', steps: [
    { label: 'Area', value: `${(v.length * v.width).toFixed(1)} sq m` },
    { label: 'Depth in Meters', value: `${v.depth} cm = ${depthM.toFixed(3)} m` },
    { label: 'Volume', value: `${volumeM3.toFixed(2)} cu m` },
    { label: 'Coverage', value: `1 cu m covers ~${(1 / depthM).toFixed(0)} sq m at ${v.depth} cm depth` },
  ] } } },
  description: 'Calculate exactly how much mulch you need for garden beds and landscaping. Get volume in cubic yards or cubic meters, plus bag counts for 2 cu ft and 3 cu ft bags with cost comparisons between bagged and bulk mulch.',
  formula: 'cu_yd = (L_ft × W_ft × Depth_in/12) / 27 | Bags_2cf = Ceil(cu_yd × 13.5) | Bags_3cf = Ceil(cu_yd × 9)',
  interpretation: 'Standard depth: 2-4 inches. One cubic yard covers ~100 sq ft at 3 inches deep or ~162 sq ft at 2 inches. For a 20×10 ft bed at 3 inches deep you need ~1.85 cu yd — that is ~25 bags (2cf) or ~$100 bagged vs ~$74 bulk. Bulk mulch is significantly cheaper for larger areas. Dyed mulch lasts longer aesthetically but natural mulch improves soil structure as it decomposes.'
}

export default calcDef
