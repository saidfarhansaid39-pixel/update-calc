import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'thickness', label: 'Thickness', type: 'select', options: [
        { label: '1 cm (thin cut)', value: '1' }, { label: '2 cm (standard steak)', value: '2' },
        { label: '3 cm (thick cut)', value: '3' }, { label: '4 cm (roast)', value: '4' },
        { label: '5 cm (large roast)', value: '5' },
      ] },
      { name: 'doneness', label: 'Doneness', type: 'select', options: [
        { label: 'Rare (49°C)', value: '45_rare' }, { label: 'Medium-rare (54°C)', value: '60_mrare' },
        { label: 'Medium (58°C)', value: '75_med' }, { label: 'Medium-well (62°C)', value: '90_mwell' },
        { label: 'Well done (68°C)', value: '120_well' },
      ] },
    ],
    compute: (v) => {
      const parts = v.doneness.split('_'); const baseMin = parseFloat(parts[0]); const time = baseMin * parseFloat(v.thickness) / 2.5
      return { result: time, label: 'Sous Vide Time', unit: 'min', steps: [
        { label: 'Thickness', value: `${v.thickness} cm` },
        { label: 'Doneness temp', value: `${parts.slice(1).join(' ')} (${baseMin}°C)` },
        { label: 'Recommended time', value: `${time.toFixed(0)} min` },
        { label: 'Sear after', value: 'Pat dry and sear 30-60s per side for crust' },
      ]}
    },
    description: 'Sous vide cooking times based on thickness and desired doneness. The water bath ensures precise, consistent results. Always sear after sous vide for a golden crust.',
    example: { label: '3cm steak, medium-rare', value: '~72 min at 54°C' }
}

export default calcDef
