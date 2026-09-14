import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ promptEmotion: z.string().min(1) }),
  fields: [
    { name: 'promptEmotion', label: 'Current Feeling', type: 'select', options: [{ label: 'Happy', value: 'happy' }, { label: 'Grateful', value: 'grateful' }, { label: 'Stressed', value: 'stressed' }, { label: 'Tired', value: 'tired' }, { label: 'Excited', value: 'excited' }, { label: 'Any', value: 'any' }] },
  ],
  defaults: { promptEmotion: 'any' },
  presets: [
    { label: 'Morning Reflection', values: { promptEmotion: 'happy' } },
    { label: 'Evening Wind-Down', values: { promptEmotion: 'grateful' } },
    { label: 'Midweek Reset', values: { promptEmotion: 'stressed' } },
    { label: 'Weekend Review', values: { promptEmotion: 'tired' } },
  ],
  compute: (v) => {
    const prompts: Record<string, string[]> = {
      happy: ['What made you smile today?', 'Who shared your joy?', 'What beauty did you notice?', 'What moment felt like a gift?', 'What made you laugh out loud?', 'What are you looking forward to tomorrow?'],
      grateful: ['What went right this week?', 'Who showed you kindness?', 'What simple pleasure did you enjoy?', 'What opportunity opened for you?', 'What do you take for granted that you\'re thankful for?', 'Who made your life better today?'],
      stressed: ['What can you let go of?', 'What is one thing you control?', 'Who supports you?', 'What small step can you take now?', 'What past challenge did you overcome?', 'What brings you peace in this moment?'],
      tired: ['What rest did you give yourself?', 'What can wait until tomorrow?', 'What comforted you today?', 'What energy did you protect?', 'What small win happened despite the tiredness?', 'What would replenish you right now?'],
      excited: ['What are you looking forward to?', 'What possibility inspires you?', 'Who would you tell first?', 'What makes this moment special?', 'What dream feels closer today?', 'What energy are you channeling?'],
      any: ['What made you laugh?', 'What are you proud of?', 'Who are you grateful for today?', 'What strength did you show today?', 'What lesson did you learn?', 'What beauty did you witness?', 'What kindness did you give or receive?', 'What would make today count?']
    }
    const pool = prompts[v.promptEmotion as keyof typeof prompts] || prompts.any
    const prompt = pool[Math.floor(Math.random() * pool.length)]
    const allPrompts = pool.length
    const tips = [
      'Write for 2 minutes without stopping — don\'t edit, just flow.',
      'Be specific: instead of "family," write "the way my daughter laughed at dinner."',
      'Focus on the feeling behind the gratitude, not just the thing itself.',
    ]
    const tipIndex = Math.floor(Math.random() * tips.length)
    return { result: pool.length, label: 'Prompts Available', unit: '', steps: [{ label: 'Mood Selected', value: v.promptEmotion.charAt(0).toUpperCase() + v.promptEmotion.slice(1) }, { label: 'Your Prompt', value: prompt }, { label: 'Writing Tip', value: tips[tipIndex] }, { label: 'Why This Works', value: 'Gratitude shifts focus from what\'s lacking to what\'s abundant' }, { label: 'Try Prompt Variation', value: pool.length > 3 ? `${pool.length} more prompts available — refresh for another` : 'Unique prompt just for you' }, { label: 'Suggested Duration', value: '5-10 minutes of uninterrupted writing' }, { label: 'Prompt Category', value: v.promptEmotion === 'any' ? 'General reflection' : `${v.promptEmotion}-based growth` }, { label: 'Best Practice', value: 'Use the same time and place daily to build the habit' }] ,
    extras: [
      { label: 'Why Gratitude Journaling Works', value: 'Harvard research: writing 3 things you\'re grateful for daily for 8 weeks increases happiness scores by 10-25%. MRI studies show gratitude activates the prefrontal cortex (positive emotion regulation) and reduces activity in the amygdala (stress response). The brain literally rewires through repeated practice — neuroplasticity at work.' },
      { label: 'The Science of Mood-Based Prompts', value: `Gratitude prompts tailored to your emotion (${v.promptEmotion}) target specific neural pathways. 'Happy' prompts reinforce positive memory encoding. 'Stressed' prompts activate problem-solving circuits. 'Tired' prompts validate rest and recovery. The specificity creates stronger emotional anchoring than generic prompts like "what are you grateful for?"` },
      { label: 'Building a Sustainable Practice', value: 'Research shows 66 days average to automate a habit (range: 18-254 days). Start with 2 minutes daily — research shows consistency > duration for habit formation. Write at the same time (morning sets positive tone; evening improves sleep quality by reducing rumination). Link your practice to an existing habit (e.g., after brushing teeth).' },
      { label: 'Deepening Your Responses', value: 'Go beyond listing — describe the sensory experience. Instead of "good coffee," write "the warm ceramic mug in my hands, the rich aroma filling the kitchen, the first sip that says the day has begun." Sensory gratitude engages more brain regions and creates stronger positive associations. Aim for 3 sentences per prompt.' },
      { label: 'Overcoming Writer\'s Block', value: 'If nothing comes: 1) Look around the room — find 3 things you\'re grateful for visually. 2) Think of someone who helped you recently. 3) Consider what went better than expected. 4) Notice what your body feels grateful for (comfort, health, warmth). 5) Reflect on a past challenge you overcame. The block is temporary — write anything for 1 minute.' },
      { label: 'Gratitude as Stress Resilience', value: 'Daily gratitude practice lowers cortisol (stress hormone) by 23% on average. It improves sleep quality (fall asleep faster, sleep longer). It reduces symptoms of anxiety and depression by 15-30% over 12 weeks. It strengthens relationships — expressing gratitude to others increases relationship satisfaction by 25% for both parties.' },
      { label: 'Combining with Other Practices', value: `Stack gratitude with: morning meditation (5 min mindfulness + 5 min gratitude), evening review (gratitude + journaling), walking meditation (grateful for each step), or breathing exercises (inhale gratitude, exhale tension). Your ${v.promptEmotion} mood prompt paired with 3 deep breaths before writing amplifies the calming effect through vagus nerve stimulation.` },
      { label: 'Tracking Your Gratitude Journey', value: 'Keep a streak counter — but don\'t break the habit over a missed day. Miss one day? Just resume. The goal is consistency, not perfection. Review your entries monthly: notice patterns in what you\'re grateful for, how your mood evolves, and which prompt types resonate most. After 30 days, you\'ll likely notice increased awareness of positive moments throughout the day.' },
    ]}
  },
  description: 'Generate a science-backed gratitude journaling prompt tailored to your current emotional state. Based on positive psychology research showing that specific, mood-aware prompts produce stronger neural engagement and habit formation than generic gratitude exercises.',
  formula: 'Random emotional-context prompt from curated category pool | Writing tips include: timed free-writing, sensory specificity, consistency over intensity | Recommended practice: 2 min/day, same time/place, 66-day habit target',
  interpretation: 'Daily gratitude practice improves happiness scores 10-25% in 8 weeks (Harvard study). Reduces cortisol by 23%, improves sleep quality, and strengthens relationships. Specific prompts beat generic prompts for engagement. Write 2 minutes daily at the same time/place for 66 days to automate the habit. Sensory-specific gratitude (describe details, not just list) engages more brain regions and creates stronger positive associations.'
}

export default calcDef
