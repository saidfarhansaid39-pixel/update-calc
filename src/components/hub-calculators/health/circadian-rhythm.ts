import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wakeTime: z.string().min(1,'Required'), bedTime: z.string().min(1,'Required') }),
  fields: [{ name:'wakeTime', label:'Wake Time (24h)', type:'number', min:0, max:24, step:'0.25' }, { name:'bedTime', label:'Bedtime (24h)', type:'number', min:0, max:24, step:'0.25' }],
  compute: (v) => { const wt=parseFloat(v.wakeTime)||7; const bt=parseFloat(v.bedTime)||23; let sleepHrs=bt>wt?24-bt+wt:wt-bt; const midSleep=bt>wt?(((bt+wt)/2)+24)%24:(bt+wt)/2; const misaligned=midSleep<2||midSleep>6; return { result:sleepHrs, label:'Sleep Duration', unit:'hours', steps:[{ label:'Duration', value:sleepHrs.toFixed(1) },{ label:'Mid-Sleep Time', value:midSleep.toFixed(1)+':00' },{ label:'Circadian Alignment', value:misaligned?'Disrupted - mid-sleep outside 2-6AM':'Normal' }] } },
  description: 'Circadian rhythm assessment from sleep-wake timing and mid-sleep point.',
  formula: 'Duration = wake-bed (adjusted for 24h). Mid-sleep ideally 2-6AM for optimal circadian alignment.',
  interpretation: 'Consistent bed/wake times improve circadian health. Mid-sleep outside 2-6AM suggests phase shift.'
}

export default calcDef
