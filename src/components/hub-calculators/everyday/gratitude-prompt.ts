import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ promptEmotion: z.string().min(1) }),
  fields: [
    { name: 'promptEmotion', label: 'Current Feeling', type: 'select', options: [{ label: 'Happy', value: 'happy' }, { label: 'Grateful', value: 'grateful' }, { label: 'Stressed', value: 'stressed' }, { label: 'Tired', value: 'tired' }, { label: 'Excited', value: 'excited' }, { label: 'Any', value: 'any' }] },
  ],
  compute: (v) => {
    const prompts: Record<string, string[]> = {
      happy: ['What made you smile today?', 'Who shared your joy?', 'What beauty did you notice?'],
      grateful: ['What went right this week?', 'Who showed you kindness?', 'What simple pleasure did you enjoy?'],
      stressed: ['What can you let go of?', 'What is one thing you control?', 'Who supports you?'],
      tired: ['What rest did you give yourself?', 'What can wait until tomorrow?', 'What comforted you today?'],
      excited: ['What are you looking forward to?', 'What possibility inspires you?', 'Who would you tell first?'],
      any: ['What made you laugh?', 'What are you proud of?', 'Who are you grateful for today?', 'What strength did you show today?', 'What lesson did you learn?']
}
    const pool = prompts[v.promptEmotion as keyof typeof prompts] || prompts.any
    const prompt = pool[Math.floor(Math.random() * pool.length)]
    return { result: 0, label: 'Today\'s Gratitude Prompt', unit: '', steps: [{ label: 'Your Prompt', value: prompt }] }
  },
  description: 'Generate a gratitude journaling prompt tailored to your current mood. Reflect on positive moments and personal growth.',
  formula: 'Random selection from curated prompt pool based on emotional context',
  interpretation: 'Daily gratitude practice improves mental health and life satisfaction. Writing down 3 things you are grateful for each day rewires the brain for positivity.'
}

export default calcDef
