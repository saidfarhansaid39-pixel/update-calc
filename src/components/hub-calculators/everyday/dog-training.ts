import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ sessions: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), sessionLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), trainerRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), selfTrain: z.string().min(1) }),
  fields: [
    { name: 'sessions', label: 'Training Sessions/Week', type: 'number', min: 1, step: '1' },
    { name: 'sessionLength', label: 'Minutes per Session', type: 'number', min: 5, step: '5' },
    { name: 'trainerRate', label: 'Private Trainer Cost/Session ($)', type: 'number', min: 0, step: '25' },
    { name: 'selfTrain', label: 'Training Method', type: 'select', options: [{ label: 'Self-Training', value: 'self' }, { label: 'Group Classes', value: 'group' }, { label: 'Private Trainer', value: 'private' }, { label: 'Board & Train', value: 'board' }] },
  ],
  defaults: { sessions: '3', sessionLength: '15', trainerRate: '75', selfTrain: 'self' },
  presets: [
    { label: 'Puppy Self-Training', values: { sessions: '5', sessionLength: '10', trainerRate: '75', selfTrain: 'self' } },
    { label: 'Group Obedience Classes', values: { sessions: '1', sessionLength: '60', trainerRate: '50', selfTrain: 'group' } },
    { label: 'Private Behaviorist', values: { sessions: '2', sessionLength: '45', trainerRate: '120', selfTrain: 'private' } },
    { label: 'Board & Train Intensive', values: { sessions: '7', sessionLength: '120', trainerRate: '100', selfTrain: 'board' } },
  ],
  compute: (v) => {
    const totalMinutesPerWeek = v.sessions * v.sessionLength
    const totalHoursForBasics = 40
    const weeksToComplete = totalHoursForBasics / (totalMinutesPerWeek / 60)
    const methodCosts: Record<string, number> = { self: 0, group: v.sessions * 25, private: v.trainerRate || 75, board: 1500 }
    const weeklyCost = methodCosts[v.selfTrain] || 0
    const totalCost = weeklyCost * weeksToComplete
    const sessionsNeeded = Math.ceil(weeksToComplete * v.sessions)
    const dailyMinCommit = totalMinutesPerWeek / 7
    return { result: weeksToComplete, label: 'Weeks to Basic Obedience', unit: 'weeks', steps: [
      { label: 'Weekly Training Volume', value: `${v.sessions} sessions × ${v.sessionLength} min = ${totalMinutesPerWeek} min/week` },
      { label: 'Daily Commitment', value: `~${dailyMinCommit.toFixed(0)} min/day` },
      { label: 'Basic Obedience Requirement', value: `${totalHoursForBasics} hours total` },
      { label: 'Estimated Duration', value: `${weeksToComplete.toFixed(1)} weeks (${sessionsNeeded} total sessions)` },
      { label: 'Weekly Cost', value: `$${weeklyCost.toFixed(2)}` },
      { label: 'Total Program Cost', value: `$${totalCost.toFixed(2)}` },
      { label: 'Method Selected', value: v.selfTrain === 'self' ? 'Self-Training ($0)' : v.selfTrain === 'group' ? 'Group Classes' : v.selfTrain === 'private' ? 'Private Trainer' : 'Board & Train' },
      { label: 'Cost per Training Hour', value: `$${(totalCost / totalHoursForBasics).toFixed(2)}/hr` },
    ] ,
    extras: [
      { label: "Puppy Socialization Window", value: "The critical socialization period is 3-16 weeks of age. Expose puppies to 100+ new people, surfaces, sounds, and animals before 16 weeks for best behavioral outcomes." },
      { label: "Breed Considerations", value: "Working breeds (GSD, Border Collie, Belgian Malinois) need 60-90 min mental stimulation daily. Brachycephalic breeds (Bulldog, Pug) overheat easily — keep sessions under 10 min in warm weather." },
      { label: "Positive Reinforcement Science", value: "Reward-based training (treats, praise, play) produces 30-50% faster learning and 70% fewer behavioral relapses than aversive methods (shock collars, prong collars). It also strengthens the human-animal bond." },
      { label: "AKC Canine Good Citizen", value: "The CGC program requires 10 skills (sitting politely, walking on loose leash, etc.). Most dogs need 8-12 weeks of consistent training to pass. Certification is recognized by many landlords and insurance companies." },
      { label: "Board & Train Realities", value: "Immersion programs ($1,200-3,000) deliver rapid results in 2-4 weeks but require 2-4 weeks of follow-up at home to maintain. The dog learns to obey the trainer — owner must learn the handling techniques too." },
      { label: "Service Dog Investment", value: "Professional service dog training costs $15,000-50,000 and takes 18-24 months. Owner-trained service dogs require 200+ hours of task-specific training plus public access testing." },
      { label: "Veterinary Behaviorist", value: "For aggression, severe anxiety, or compulsive disorders, a board-certified veterinary behaviorist (DVM + DACVB) costs $300-600 per session — more than a trainer but provides medication + behavior modification plans." },
      { label: "Tax Deductions", value: "Service dog training costs are tax-deductible as medical expenses. Guard dog expenses for business premises are deductible business expenses. Pet insurance for accident/illness costs $35-70/mo." },
    ]}
  },
  description: 'Model the full time and cost commitment of dog training across four methods — self-training, group classes, private sessions, or board-and-train. Calculates weeks to basic obedience, total sessions needed, daily time commitment, and total program cost.',
  formula: 'Weeks = 40 hours / (Sessions/Week × Session Length / 60) | Total Cost = Weekly Cost × Weeks | Sessions = Weeks × Sessions/Week',
  interpretation: 'Basic obedience (sit, stay, come, loose-leash walking) requires roughly 40 total training hours. Puppies aged 8-16 weeks are in a prime learning window — 5-minute sessions 5×/day are more effective than hour-long weekly classes. Professional rates: group classes $150-300 for 6 weeks, private $50-150/session, board & train $1,200-3,500. The cheapest method is self-training with YouTube resources (Zak George, Kikopup), but most owners benefit from at least 2-3 private sessions for personalized feedback.'
}

export default calcDef
