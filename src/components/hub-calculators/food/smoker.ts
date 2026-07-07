import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'weight', label: 'Meat Weight', type: 'number', unit: 'kg', units: [{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }], defaultUnit: 'kg', min: 0.5, step: '0.5' },
      { name: 'meatType', label: 'Meat Type', type: 'select', options: [
        { label: 'Brisket (1.5 hr/kg at 110°C)', value: '1.5_93' }, { label: 'Pork shoulder (1.5 hr/kg at 110°C)', value: '1.5_93' },
        { label: 'Pork ribs (6 hrs total at 110°C)', value: '6_93' }, { label: 'Chicken whole (1 hr/kg at 135°C)', value: '1_74' },
        { label: 'Beef ribs (1.5 hr/kg at 110°C)', value: '1.5_93' }, { label: 'Fish (45 min total at 100°C)', value: '0.75_63' },
      ] },
    ],
    compute: (v) => {
      const parts = v.meatType.split('_'); const hrPerKg = parseFloat(parts[0]); const targetTemp = parseFloat(parts[1])
      const totalHrs = v.meatType.includes('ribs') || v.meatType.includes('fish') ? hrPerKg : hrPerKg * v.weight
      return { result: totalHrs * 60, label: 'Smoking Time', unit: 'min', steps: [
        { label: 'Meat type', value: `${v.meatType.includes('ribs') || v.meatType.includes('fish') ? '' : v.weight + ' kg '}${v.meatType.split('_').slice(1).join(' ')}` },
        { label: 'Smoker temp', value: `${targetTemp}°C (225-275°F range)` },
        { label: 'Estimated time', value: `~${totalHrs.toFixed(1)} hr${totalHrs !== 1 ? 's' : ''} (${(totalHrs * 60).toFixed(0)} min)` },
        { label: 'Target internal temp', value: `${targetTemp}°C` },
        { label: 'Wood choice', value: 'Hickory (pork/beef), Apple (chicken/fish), Mesquite (bold flavor)' },
      ]}
    },
    description: 'Smoking times for popular meats. Low and slow cooking at 110-135°C breaks down collagen for tender results. Always verify internal temperature with a probe thermometer.',
    example: { label: '5kg brisket', value: '~7.5 hours at 110°C' }
}

export default calcDef
