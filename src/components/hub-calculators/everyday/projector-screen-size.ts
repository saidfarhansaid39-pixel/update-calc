import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ throwDistance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), aspectRatio: z.string().min(1), screenType: z.string().min(1) }),
  fields: [
    { name: 'throwDistance', label: 'Throw Distance (ft)', type: 'number', min: 3, max: 100, step: '1' },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: [{ label: '16:9 (Widescreen)', value: '16:9' }, { label: '4:3 (Standard)', value: '4:3' }, { label: '2.35:1 (CinemaScope)', value: '2.35:1' }] },
    { name: 'screenType', label: 'Screen Type', type: 'select', options: [{ label: 'Standard Throw (1.5:1 ratio)', value: 'standard' }, { label: 'Short Throw (0.5:1 ratio)', value: 'short' }, { label: 'Ultra Short Throw (0.25:1 ratio)', value: 'ultraShort' }] },
  ],
  defaults: { throwDistance: '12', aspectRatio: '16:9', screenType: 'standard' },
  presets: [
    { label: 'Home Theater 100"', values: { throwDistance: '11', aspectRatio: '16:9', screenType: 'standard' } },
    { label: 'Living Room Short Throw', values: { throwDistance: '5', aspectRatio: '16:9', screenType: 'short' } },
    { label: 'CinemaScope Movie Night', values: { throwDistance: '15', aspectRatio: '2.35:1', screenType: 'standard' } },
    { label: 'Office Presentation', values: { throwDistance: '8', aspectRatio: '4:3', screenType: 'short' } },
  ],
  compute: (v) => {
    const throwRatios: Record<string, number> = { standard: 1.5, short: 0.5, ultraShort: 0.25 }
    const ratio = throwRatios[v.screenType as keyof typeof throwRatios] || 1.5
    const width = v.throwDistance / ratio
    const aspectParts = v.aspectRatio.split(':').map(Number)
    const aspect = aspectParts[0] / aspectParts[1]
    const height = width / aspect
    const diagonal = Math.sqrt(width * width + height * height)
    return { result: diagonal, label: 'Screen Diagonal', unit: 'in',
      steps: [
        { label: 'Throw Distance', value: `${v.throwDistance} ft` },
        { label: 'Throw Ratio Used', value: `${ratio}:1 (${v.screenType} projector)` },
        { label: 'Screen Width', value: `W = ${v.throwDistance} ÷ ${ratio} = ${width.toFixed(2)} ft (${(width * 12).toFixed(1)} in)` },
        { label: 'Aspect Ratio', value: `${v.aspectRatio} (W:H = ${aspectParts[0]}:${aspectParts[1]})` },
        { label: 'Screen Height', value: `H = ${width.toFixed(2)} ÷ ${aspect.toFixed(2)} = ${height.toFixed(2)} ft (${(height * 12).toFixed(1)} in)` },
        { label: 'Diagonal Calculation', value: `√(${width.toFixed(2)}² + ${height.toFixed(2)}²) = ${diagonal.toFixed(2)} ft` },
        { label: 'Diagonal in Inches', value: `${(diagonal * 12).toFixed(0)} in` },
        { label: 'Viewing Area', value: `${(width * height).toFixed(1)} ft² (${(width * height * 144).toFixed(0)} in²)` },
      ],
      extras: [
        { label: '📐 Throw Ratio Explained', value: 'Standard (1.5:1): projector 1.5 ft back per 1 ft of width. Short throw (0.5:1): 0.5 ft back per 1 ft. Ultra short: sits on media console just below screen.' },
        { label: '📺 16:9 is the Standard', value: '16:9 is the native aspect ratio for HDTV, Blu-ray, and most streaming content. 4:3 fits older content. 2.35:1 matches theatrical widescreen films.' },
        { label: '👀 Optimal Viewing Distance', value: 'For 16:9, sit 1.5-2.5× the screen height away. For a 120" diagonal (104" wide), optimal is 10-17 ft from the screen.' },
        { label: '💡 Room Lighting Matters', value: 'Standard projectors need dark rooms. Short throw works better in ambient light. Ultra-short throw screens use ambient-light-rejecting (ALR) material.' },
        { label: '🔊 Speaker Placement', value: 'Center channel speaker should be directly below or behind the screen. For acoustically transparent screens, place speakers behind the screen for perfect center imaging.' },
        { label: '💵 Projector Pricing', value: 'Standard throw: $400-3,000. Short throw: $600-1,500. Ultra short throw: $1,500-5,000+. UST projectors have built-in speakers and smart TV features.' },
        { label: '📏 Screen Size Limits', value: 'Maximum practical diagonal for UST: 150". Standard throw: 300"+. For most living rooms, 100-120" diagonal at 16:9 is the sweet spot.' },
        { label: '🖼️ Fixed vs Motorized Screen', value: 'Fixed screens ($200-800) offer the best picture. Motorized screens ($400-2,000) retract when not in use. Portable tripod screens ($100-300) for occasional use.' },
      ]
    }
  },
  description: 'Calculate the projected screen diagonal size, width, height, and viewing area based on throw distance, aspect ratio, and projector type. Plan your home theater or presentation setup with precision.',
  formula: 'Width = Distance / ThrowRatio | Height = Width / AspectRatio | Diagonal = √(Width² + Height²) | Area = Width × Height | For 16:9 at 12 ft with standard throw (1.5:1): Width = 8 ft, Height = 4.5 ft, Diagonal = 110"',
  interpretation: 'Standard throw projectors (1.5:1) require the most distance — place the projector 1.5 ft back for every 1 ft of screen width. Short throw (0.5:1) works in smaller rooms. Ultra-short throw (0.25:1) sits just inches from the wall or on a media console. For a 100" diagonal 16:9 screen, a standard projector needs ~11 ft of throw distance, while a short throw needs only ~4 ft. Choose UST for living rooms where ceiling mounting isn\'t practical.'
}

export default calcDef
