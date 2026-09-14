import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ inventoryRooms: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), itemsPerRoom: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), avgItemValue: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), hasReceipts: z.string().min(1) }),
  fields: [
    { name: 'inventoryRooms', label: 'Number of Rooms', type: 'number', min: 1, step: '1' },
    { name: 'itemsPerRoom', label: 'Items per Room', type: 'number', min: 1, step: '5' },
    { name: 'avgItemValue', label: 'Average Item Value ($)', type: 'number', min: 1, step: '10' },
    { name: 'hasReceipts', label: 'Receipts/Photos', type: 'select', options: [{ label: 'Yes', value: 'yes' }, { label: 'Some', value: 'some' }, { label: 'No', value: 'no' }] },
  ],
  defaults: { inventoryRooms: "8", itemsPerRoom: "25", avgItemValue: "35", hasReceipts: "some" },
  presets: [
    { label: "Small Apartment", values: { inventoryRooms: "4", itemsPerRoom: "20", avgItemValue: "40", hasReceipts: "some" } },
    { label: "Family Home", values: { inventoryRooms: "10", itemsPerRoom: "30", avgItemValue: "35", hasReceipts: "yes" } },
    { label: "Renter (Basic)", values: { inventoryRooms: "5", itemsPerRoom: "15", avgItemValue: "25", hasReceipts: "no" } },
    { label: "High-Value Collection", values: { inventoryRooms: "8", itemsPerRoom: "20", avgItemValue: "150", hasReceipts: "yes" } },
  ],
  compute: (v) => {
    const totalItems = v.inventoryRooms * v.itemsPerRoom
    const totalValue = totalItems * v.avgItemValue
    const estimateTime = totalItems * 2
    const hours = Math.floor(estimateTime / 60)
    const mins = estimateTime % 60
    const premiumFactor = v.hasReceipts === 'yes' ? 1 : v.hasReceipts === 'some' ? 0.7 : 0.5
    const claimableValue = totalValue * premiumFactor
    const highValueItems = Math.round(totalItems * 0.05)
    const highValueTotal = highValueItems * v.avgItemValue * 5
    return { result: totalItems, label: 'Total Items', unit: '', steps: [{ label: 'Rooms Inventoried', value: `${v.inventoryRooms}` }, { label: 'Estimated Total Items', value: `${totalItems}` }, { label: 'Avg Value per Item', value: `$${v.avgItemValue.toFixed(0)}` }, { label: 'Estimated Total Value', value: `$${totalValue.toFixed(0)}` }, { label: 'High-Value Items (5%)', value: `~${highValueItems} items worth ~$${highValueTotal.toFixed(0)}` }, { label: 'Claimable Value (with docs)', value: `$${claimableValue.toFixed(0)} (${(premiumFactor * 100).toFixed(0)}% recovery factor)` }, { label: 'Time to Document', value: `${hours}h ${mins}m (${estimateTime} min total)` }] ,
    extras: [
      { label: "Why Home Inventory Matters", value: "68% of homeowners don't have a current inventory. After a disaster, documented claims pay 2-3× more than undocumented ones." },
      { label: "Documentation Best Practice", value: "Walk through each room with a video camera, narrating items. Photograph serial numbers for electronics. Store documentation off-site (cloud, safety deposit box)." },
      { label: "High-Value Item Schedules", value: "Jewelry, art, watches, and collectibles over $1,000 often require separate riders on your policy. Standard policies cap at $1,500-2,500 for these categories." },
      { label: "Replacement Cost vs ACV", value: "Replacement Cost Value (RCV) pays what it costs to buy new. Actual Cash Value (ACV) deducts depreciation. RCV premiums are ~20% higher but pay 2-5× more on claims." },
      { label: "Room-by-Room Guide", value: "Living room: 40-60 items | Kitchen: 100-200 items | Bedroom: 50-100 items | Bathroom: 30-60 items | Garage: 100-300 items | Closet: 50-150 items" },
      { label: "Digital Inventory Tools", value: "Apps like Encircle, Sortly, and Nest Egg streamline inventory with photo capture, receipt OCR, and cloud backup — most are free for basic use." },
      { label: "Annual Update Required", value: "Review and update your inventory annually. Major purchases (TVs, computers, furniture) should be added within 30 days of purchase." },
      { label: "Renters Insurance Gap", value: "A standard renters policy covers $15,000-30,000 personal property. Most renters underestimate their belongings — the 4-room average here helps right-size coverage." },
    ]}
  },
  description: 'Create a comprehensive home inventory estimate for insurance purposes. See the total value of your belongings, how much is claimable, and how long documentation takes.',
  formula: 'Total Items = Rooms × Items per Room | Total Value = Items × Avg Value | Claimable = Total Value × Documentation Factor (Yes: 100%, Some: 70%, No: 50%)',
  interpretation: 'The average home contains 20,000-30,000 items worth $20,000-100,000+. Most people dramatically underestimate the replacement value of their belongings. Without a documented inventory, insurance claims after a fire or burglary typically pay only 50-70% of actual losses because you cannot prove what you owned. A thorough video walkthrough and receipt scan takes about 2 minutes per item but can increase your claim payout by 2-3×. Remember that high-value items like jewelry, art, and collectibles need separate scheduled coverage.'
}

export default calcDef
