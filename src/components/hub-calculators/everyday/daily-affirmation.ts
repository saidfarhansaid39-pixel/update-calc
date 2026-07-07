import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ category: z.string().min(1) }),
  fields: [
    { name: 'category', label: 'Affirmation Category', type: 'select', options: [{ label: 'Confidence', value: 'confidence' }, { label: 'Calm', value: 'calm' }, { label: 'Gratitude', value: 'gratitude' }, { label: 'Motivation', value: 'motivation' }, { label: 'Self-Love', value: 'selflove' }, { label: 'Success', value: 'success' }] },
  ],
  compute: (v) => {
    const affirmations: Record<string, string> = { confidence: 'I am capable, strong, and ready to take on any challenge.', calm: 'I breathe in peace and exhale tension. I am centered and calm.', gratitude: 'I am grateful for all the abundance, love, and joy in my life.', motivation: 'Every step I take brings me closer to my goals. I keep going.', selflove: 'I love and accept myself exactly as I am. I am worthy.', success: 'I attract success through my actions, mindset, and persistence.' }
    const aff = affirmations[v.category] || 'I am grateful for today and all the possibilities it brings.'
    const timestamp = new Date().toLocaleDateString()
    return { result: 1, label: 'Today\'s Affirmation', unit: '', steps: [{ label: 'Category', value: v.category.charAt(0).toUpperCase() + v.category.slice(1) }, { label: 'Your Affirmation', value: aff }, { label: 'Date', value: timestamp }] }
  },
  description: 'Generate a positive daily affirmation based on your chosen category. Use affirmations to build confidence, reduce stress, and maintain focus.',
  formula: 'Daily Affirmation = Category-based positive statement for mental well-being.',
  interpretation: 'Say your affirmation out loud in front of a mirror each morning. Repeat it 3-5 times. Write it down in a journal. Consistent practice rewires neural pathways (neuroplasticity) over 21-66 days.'
}

export default calcDef
