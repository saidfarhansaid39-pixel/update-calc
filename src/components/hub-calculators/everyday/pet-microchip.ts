import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ implantCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), registrationFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), vetVisit: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), yearsOwned: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), lostPetCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'implantCost', label: 'Microchip Implant Cost ($)', type: 'number', min: 0, step: '10' },
    { name: 'registrationFee', label: 'Registration Fee ($)', type: 'number', min: 0, step: '10' },
    { name: 'vetVisit', label: 'Vet Visit for Implant ($)', type: 'number', min: 0, step: '20' },
    { name: 'yearsOwned', label: 'Expected Years Owned', type: 'number', min: 1, step: '5' },
    { name: 'lostPetCost', label: 'Cost if Lost (flyers, reward, etc.)', type: 'number', min: 0, step: '100' },
  ],
  defaults: { implantCost: '45', registrationFee: '10', vetVisit: '20', yearsOwned: '15', lostPetCost: '500' },
  presets: [
    { label: 'Dog Microchip (at vet)', values: { implantCost: '50', registrationFee: '15', vetVisit: '25', yearsOwned: '15', lostPetCost: '500' } },
    { label: 'Cat Microchip (shelter)', values: { implantCost: '25', registrationFee: '10', vetVisit: '0', yearsOwned: '18', lostPetCost: '300' } },
    { label: 'Adoption (included)', values: { implantCost: '0', registrationFee: '0', vetVisit: '0', yearsOwned: '15', lostPetCost: '500' } },
    { label: 'Premium with Lifetime Reg', values: { implantCost: '60', registrationFee: '50', vetVisit: '30', yearsOwned: '20', lostPetCost: '1000' } },
  ],
  compute: (v) => { const chipTotal = v.implantCost + v.registrationFee + v.vetVisit; const annualCost = chipTotal / v.yearsOwned; const avoidedLossCost = v.lostPetCost; const potentialSavings = avoidedLossCost - chipTotal; const roiPct = chipTotal > 0 ? (potentialSavings / chipTotal) * 100 : 0; return { result: chipTotal, label: 'Total Microchip Cost', unit: '$',
    steps: [
      { label: 'Implant Cost', value: `$${v.implantCost.toFixed(0)}` },
      { label: 'Registration Fee', value: `$${v.registrationFee.toFixed(0)}` },
      { label: 'Vet Visit Fee', value: `$${v.vetVisit.toFixed(0)}` },
      { label: 'Total Chip Cost', value: `$${v.implantCost} + $${v.registrationFee} + $${v.vetVisit} = $${chipTotal.toFixed(0)}` },
      { label: 'Annualized Cost', value: `$${chipTotal.toFixed(0)} ÷ ${v.yearsOwned} years = $${annualCost.toFixed(2)}/year` },
      { label: 'Cost if Pet Lost', value: `$${v.lostPetCost.toFixed(0)} (flyers, reward, shelter fees, emotional cost)` },
      { label: 'Potential Savings', value: `$${v.lostPetCost.toFixed(0)} - $${chipTotal.toFixed(0)} = $${potentialSavings.toFixed(0)}` },
      { label: 'Return on Investment', value: `${roiPct.toFixed(0)}% ROI over ${v.yearsOwned} years` },
    ],
    extras: [
      { label: '💉 How Microchipping Works', value: 'A rice-sized chip (ISO 11784/11785 standard) is injected under the skin between the shoulder blades. No anesthesia needed — similar to a vaccination. The chip is passive (no battery) and lasts the pet\'s lifetime.' },
      { label: '🏠 Return Rate Statistics', value: 'Microchipped dogs have a 52.2% return-to-owner rate vs 13.7% for non-chipped. For cats: 38.5% vs 1.7%. Shelters and vets universally scan for chips as standard protocol.' },
      { label: '💰 The True Cost of a Lost Pet', value: 'Lost pet costs: flyers ($50-200), reward ($100-500), shelter searches (gas/time), microchip look-up services ($5-15), emergency vet if injured ($150-1,000+). Emotional cost is immeasurable.' },
      { label: '🔑 Registration Is Critical', value: 'A chip is useless without current registration. ~40% of microchipped pets never get reunited because owner info is outdated. Always update registration when you move or change phone numbers.' },
      { label: '🏪 Free Microchip Events', value: 'Many shelters and pet stores host free or $10 microchip events during National Pet ID Week (April). Check with local animal shelters, Petco, and Tractor Supply for upcoming clinics.' },
      { label: '📋 Microchip Registries', value: 'National databases: HomeAgain ($20/yr or $100 lifetime), Avid ($15 lifetime), AKC Reunite ($19.50 lifetime), 24PetWatch ($19.50 lifetime). Free registry option: FoundAnimals.org (no fee).' },
      { label: '🔬 Universal Scanner Compatibility', value: 'The US uses ISO 134.2 kHz chips (since 2019). Older chips may use 125 kHz. Universal scanners read both frequencies. When microchipping, ask for an ISO-compatible chip for international travel.' },
      { label: '✈️ Travel Requirement', value: 'Microchipping is required for: international pet travel (EU, UK, Australia, Japan), airline pet cargo, and many boarding facilities. The chip must be ISO standard and implanted before rabies vaccination for EU pet passports.' },
    ]
  } },
  description: 'Calculate the total cost of microchipping your pet — implant, registration, and vet visit — and understand the ROI as lost pet prevention. Includes annualized cost and potential savings analysis.',
  formula: 'Total Chip Cost = Implant Cost + Registration Fee + Vet Visit Fee | Annualized Cost = Total ÷ Years Owned | ROI = (Lost Pet Cost − Total Chip Cost) ÷ Total Chip Cost × 100%',
  interpretation: 'Microchipping is a one-time cost of $25-60 (often included in adoption fees) that dramatically increases the chances of being reunited with a lost pet — from 14% to 52% for dogs and from 2% to 39% for cats. The annualized cost is typically $2-4/year over your pet\'s lifetime. Registration is critical: 40% of chip reunions fail due to outdated contact information. Many registries offer lifetime registration for $15-20. Free microchip events are common at shelters and pet stores.'
}

export default calcDef
