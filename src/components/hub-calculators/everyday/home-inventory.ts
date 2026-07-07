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
  compute: (v) => {
    const totalItems = v.inventoryRooms * v.itemsPerRoom
    const totalValue = totalItems * v.avgItemValue
    const estimateTime = totalItems * 2
    const hours = Math.floor(estimateTime / 60)
    const mins = estimateTime % 60
    const premiumFactor = v.hasReceipts === 'yes' ? 1 : v.hasReceipts === 'some' ? 0.7 : 0.5
    const claimableValue = totalValue * premiumFactor
    return { result: totalItems, label: 'Total Items', unit: '', steps: [{ label: 'Rooms', value: `${v.inventoryRooms}` }, { label: 'Total Items', value: `${totalItems}` }, { label: 'Estimated Value', value: `$${totalValue.toFixed(0)}` }, { label: 'Claimable (insurance)', value: `$${claimableValue.toFixed(0)}` }, { label: 'Time to Inventory', value: `${hours}h ${mins}m` }] }
  },
  description: 'Estimate the number and value of items in your home for insurance purposes. A home inventory helps ensure adequate coverage.',
  formula: 'Items = Rooms × Items/Room | Value = Items × Avg Value | Time = Items × 2 min',
  interpretation: 'Average home has 20,000-30,000 items. Renters should inventory for policy verification. Homeowners need proof for claims. Document with video and store receipts in cloud storage.'
}

export default calcDef
