import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ garageLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), garageWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), cars: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), storageShelves: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'garageLength', label: 'Garage Length (ft)', type: 'number', min: 10, step: '1' },
    { name: 'garageWidth', label: 'Garage Width (ft)', type: 'number', min: 10, step: '1' },
    { name: 'cars', label: 'Number of Cars', type: 'number', min: 0, max: 4, step: '1' },
    { name: 'storageShelves', label: 'Storage Shelving Units', type: 'number', min: 0, step: '1' },
  ],
  defaults: { garageLength: '22', garageWidth: '22', cars: '2', storageShelves: '3' },
  presets: [
    { label: 'Standard 1-Car Garage', values: { garageLength: '20', garageWidth: '12', cars: '1', storageShelves: '2' } },
    { label: 'Standard 2-Car Garage', values: { garageLength: '22', garageWidth: '22', cars: '2', storageShelves: '3' } },
    { label: 'Compact 1-Car/Workshop', values: { garageLength: '20', garageWidth: '12', cars: '1', storageShelves: '4' } },
    { label: '3-Car Garage with Storage', values: { garageLength: '32', garageWidth: '22', cars: '3', storageShelves: '5' } },
  ],
  compute: (v) => {
    const area = v.garageLength * v.garageWidth
    const carSpace = v.cars * 140
    const shelfSpace = v.storageShelves * 12
    const usedSpace = carSpace + shelfSpace
    const remaining = area - usedSpace
    const pctUsed = (usedSpace / area) * 100
    const pctCars = (carSpace / area) * 100
    const pctShelves = (shelfSpace / area) * 100
    const maxCarLength = v.cars > 0 ? v.garageLength - 3 : 0
    const maxCarWidth = v.cars > 0 ? v.garageWidth / v.cars - 2.5 : 0
    const possibleBikes = Math.floor((remaining > 20 ? remaining - 10 : 0) / 6)
    const workbenchArea = 12
    const bikeStorage = Math.min(possibleBikes, 6) * 6
    const remainingWithWorkbench = remaining - workbenchArea - bikeStorage
    return { result: pctUsed, label: 'Garage Space Used', unit: '%', steps: [{ label: 'Total Garage Area', value: `${area} sq ft (${v.garageLength}×${v.garageWidth} ft)` }, { label: `Parking (${v.cars} car(s))`, value: `${carSpace} sq ft (${pctCars.toFixed(0)}% of garage)` }, { label: 'Storage Shelving', value: `${shelfSpace} sq ft (${pctShelves.toFixed(0)}%)` }, { label: 'Total Used Space', value: `${usedSpace.toFixed(0)} sq ft` }, { label: 'Remaining Open Space', value: `${remaining.toFixed(0)} sq ft (${(100 - pctUsed).toFixed(0)}%)` }, { label: 'Space Used Percentage', value: `${pctUsed.toFixed(0)}%` }, { label: 'Max Car Length Clearance', value: `${maxCarLength.toFixed(1)} ft (${(maxCarLength * 12).toFixed(0)} in)` }, { label: 'Max Car Width per Bay', value: `${maxCarWidth.toFixed(1)} ft (${(maxCarWidth * 12).toFixed(0)} in)` }] ,
    extras: [
      { label: 'Parking Clearance Check', value: `${v.cars > 0 ? 'Car ' + (v.cars === 1 ? 'bay' : 'bays') + ': ' + v.garageWidth + ' ft wide ÷ ' + v.cars + ' car(s) = ' + maxCarWidth.toFixed(1) + ' ft/car. Standard car width: 6 ft. SUV: 6.5-7 ft. Truck: 7-8 ft. Your width = ' + (maxCarWidth >= 7.5 ? 'generous — easy doors-open access for trucks ✓' : maxCarWidth >= 6.5 ? 'adequate for most vehicles — comfortable SUV/truck parking' : maxCarWidth >= 6 ? 'tight — door dings possible, park carefully' : 'too narrow for standard vehicles — reduce cars or widen garage') + '. Length clearance: ' + maxCarLength.toFixed(1) + ' ft. Standard car: 14 ft. SUV/Truck: 16-20 ft. ' + (maxCarLength >= 18 ? '✓' : maxCarLength >= 14 ? 'OK for cars' : 'too short for most vehicles') : 'No cars — all space available for workshop/storage.'}` },
      { label: 'Vertical Storage Potential', value: `Floor: ${v.storageShelves} shelves × 12 sq ft = ${shelfSpace} sq ft. Add vertical storage: ceiling racks (${area} sq ft ceiling × 0.3 = ${(area * 0.3).toFixed(0)} sq ft overhead storage), wall pegboard (${2 * (v.garageLength + v.garageWidth)} linear ft of wall × 4 ft high = ${(2 * (v.garageLength + v.garageWidth) * 4).toFixed(0)} sq ft potential wall storage). Cabinets: 4×2 ft per unit = 8 sq ft, holds 3× more than shelves. Ceiling-mounted bike hoists: use 0 floor space. Total vertical potential: up to ${(2 * (v.garageLength + v.garageWidth) * 4 + area * 0.3).toFixed(0)} sq ft equivalent — ${((2 * (v.garageLength + v.garageWidth) * 4 + area * 0.3) / area * 100).toFixed(0)}% more than your current ${pctUsed.toFixed(0)}% floor usage.` },
      { label: 'Workshop & Activity Zone', value: `Remaining space: ${remaining.toFixed(0)} sq ft. Workbench: 12 sq ft (6×2 ft bench + 3 ft walk space). Bicycle storage: ${Math.max(0, remaining - 10)} sq ft available = ~${possibleBikes} bikes (6 sq ft each). ${v.storageShelves > 0 ? 'With ' + v.storageShelves + ' shelf units you still have ' + Math.max(0, remaining - 12 - bikeStorage).toFixed(0) + ' sq ft for ' + (remaining >= 30 ? 'a hobby/work area, tool chest, and utility sink' : remaining >= 20 ? 'a workbench or small project area' : remaining >= 10 ? 'basic walk space — consider ceiling storage to free up floor' : 'limited space — optimize vertically') : 'No shelves — adding ' + Math.floor(remaining / 24) + ' shelf units would use ' + (Math.floor(remaining / 24) * 12).toFixed(0) + ' sq ft, leaving ' + (remaining - Math.floor(remaining / 24) * 12).toFixed(0) + ' sq ft.'}` },
      { label: 'Garage Door & Vehicle Access', value: `Standard single door: 8-9 ft wide × 7 ft tall. Double: 16 ft wide. Car ${v.cars >= 1 ? 'door width: ' + (v.garageWidth / v.cars).toFixed(1) + ' ft per bay. Door-to-car clearance: ' + ((v.garageWidth / v.cars - 6.5) / 2 * 12).toFixed(0) + ' in each side. Preferred: 18+ in for comfortable door opening. ' + ((v.garageWidth / v.cars - 6.5) / 2 * 12 >= 18 ? '✓ comfortable' : (v.garageWidth / v.cars - 6.5) / 2 * 12 >= 12 ? 'adequate' : 'tight — parallel park or reduce cars') : ''}. Depth ${v.garageLength} ft: parking + ${Math.max(0, v.garageLength - 18)} ft of front clearance. Standard car length 14-16 ft: ${v.garageLength >= 20 ? 'room for car + shelves/workbench in front' : v.garageLength >= 18 ? 'car fits + ' + (v.garageLength - 14).toFixed(0) + ' ft clearance' : 'car may not fully close garage door'}.` },
      { label: 'Organization System Cost Estimate', value: `Organize ${area} sq ft: basic (shelves only) = $${(v.storageShelves * 80).toFixed(0)} ($${v.storageShelves} shelves × $80). Mid-range (shelves + pegboard + cabinets) = $${(v.storageShelves * 80 + 300).toFixed(0)}. Premium (slatwall + overhead racks + modular cabinets) = $${(v.storageShelves * 80 + 1500).toFixed(0)}. Floor coating: epoxy $2-5/sq ft = $${(area * 2).toFixed(0)}-$${(area * 5).toFixed(0)}. Ceiling storage rack: $200-400. For ${area} sq ft garage: fully organized budget $${(v.storageShelves * 80 + 500).toFixed(0)}-$${(v.storageShelves * 80 + 2500).toFixed(0)}. ROI: organized garage adds $${(area * 5).toFixed(0)}-$${(area * 10).toFixed(0)} to home value.` },
      { label: 'Seasonal Storage Capacity', value: `${v.storageShelves} shelves × 12 sq ft = ${shelfSpace} sq ft. Total seasonal needs: 40-55 sq ft. You have ${shelfSpace} sq ft dedicated = ${shelfSpace >= 50 ? 'enough for all seasonal items ✓' : 'may need more shelf units or ceiling racks for overflow'}. Ceiling racks add ${(area * 0.2).toFixed(0)}-${(area * 0.3).toFixed(0)} sq ft for seasonal.` },
      { label: 'Car Wash & Utility Zone', value: `${remaining.toFixed(0)} sq ft open = ${remaining >= 50 ? 'room for a dedicated utility zone' : remaining >= 30 ? 'can add a compact workbench' : remaining >= 15 ? 'space for wall-mounted workbench' : 'minimal — focus on wall storage and ceiling racks'}. For ${v.cars} cars: leave at least ${v.cars * 10} sq ft for car care supplies.` },
      { label: 'Pct Optimization Recommendation', value: `${pctUsed.toFixed(0)}% used. Target: 50-70% for a functional garage. ${pctUsed < 50 ? 'Underutilized — add more shelf units or a workbench.' : pctUsed <= 70 ? 'Well-balanced ✓' : 'Overcrowded — remove shelves or reduce cars. Use ceiling racks to free floor space.'} Parking at ${pctCars.toFixed(0)}% of total space.` },
    ]} },
  description: 'Plan your garage organization by calculating space used for parking and storage. Includes vertical storage potential, workshop zones, vehicle clearance checks, and cost estimates for organization systems.',
  formula: 'Used % = (Cars × 140 + Shelves × 12) / (L × W) × 100 | Max Car Width = Width ÷ Cars − 2.5 ft | Max Car Length = Length − 3 ft | Possible Bikes = max(0, Remaining − 10) ÷ 6',
  interpretation: 'Standard one-car garage: 12×22 ft (264 sq ft). Two-car: 22×22 ft (484 sq ft). Each car takes ~140 sq ft and each shelving unit ~12 sq ft. Target 50-70% usage for a functional garage — enough room for cars, storage, and a workspace. Ceiling-mounted racks free up 30-50% of floor space for vertical storage. Pegboard walls provide flexible tool organization without floor footprint. A well-organized garage can reclaim 100-200 sq ft of usable space — equivalent to adding a small room to your home. Most garages have 7-12 ft ceilings — use every vertical inch.'
}

export default calcDef
