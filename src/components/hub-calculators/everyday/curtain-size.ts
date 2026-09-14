import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ windowWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), windowHeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), rodOverhang: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), fullness: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'windowWidth', label: 'Window Width (in)', type: 'number', min: 12, step: '6' },
    { name: 'windowHeight', label: 'Window Height (in)', type: 'number', min: 12, step: '6' },
    { name: 'rodOverhang', label: 'Rod Overhang Each Side (in)', type: 'number', min: 0, step: '3' },
    { name: 'fullness', label: 'Fullness Factor', type: 'number', min: 1, max: 3, step: '0.5' },
  ],
  defaults: { windowWidth: '36', windowHeight: '48', rodOverhang: '6', fullness: '2' },
  presets: [
    { label: 'Standard 3ft Window', values: { windowWidth: '36', windowHeight: '48', rodOverhang: '6', fullness: '2' } },
    { label: 'Wide Picture Window', values: { windowWidth: '72', windowHeight: '60', rodOverhang: '8', fullness: '2.5' } },
    { label: 'Double Window Set', values: { windowWidth: '60', windowHeight: '48', rodOverhang: '6', fullness: '2' } },
    { label: 'Sliding Glass Door', values: { windowWidth: '96', windowHeight: '80', rodOverhang: '4', fullness: '2' } },
  ],
  compute: (v) => {
    const totalRodWidth = v.windowWidth + (v.rodOverhang * 2)
    const fabricWidth = totalRodWidth * v.fullness
    const panelsNeeded = Math.ceil(fabricWidth / 54)
    const fabricPerPanel = v.windowHeight + 8
    const totalFabric = panelsNeeded * fabricPerPanel / 36
    const recommendedLength = v.windowHeight >= 72 ? 96 : v.windowHeight >= 60 ? 84 : 63
    const priceEstimate = panelsNeeded * (totalFabric * 12)
    return { result: panelsNeeded, label: 'Panels Needed', unit: 'panels', steps: [{ label: 'Window Width', value: `${v.windowWidth} in` }, { label: 'Rod Overhang per Side', value: `${v.rodOverhang} in` }, { label: 'Total Rod Width', value: `${totalRodWidth.toFixed(0)} in (covers light gap)` }, { label: 'Fabric Width with Fullness', value: `${fabricWidth.toFixed(0)} in (${v.fullness}x)` }, { label: 'Standard Panels (54 in)', value: `${panelsNeeded} panel(s)` }, { label: 'Panel Cut Length', value: `${fabricPerPanel.toFixed(0)} in (height + 8 in hems)` }, { label: 'Total Fabric Needed', value: `${totalFabric.toFixed(1)} yards` }, { label: 'Standard Ready-Made', value: `Buy ${panelsNeeded} panels at ${recommendedLength} in length` }] ,
    extras: [
      { label: "Rod Overhang Rule", value: "Extend rod 6-12 in past the window on each side. This allows curtains to stack fully off the glass, maximizing light entry." },
      { label: "Standard Sizes", value: "Ready-made curtain lengths: 63 in (short), 84 in (standard 8ft ceiling), 96 in (9ft ceiling), 108 in (10ft+). Choose the next size up and hem." },
      { label: "Pattern Matching", value: "For patterned fabric with a vertical repeat, add one extra repeat per panel. A 24 in pattern repeat adds 20-30% more fabric per panel." },
      { label: "Stack-Back Width", value: "The stack of drawn curtains occupies 25-35% of the total rod width. For a 72 in rod, expect curtains to cover 18-25 in on each side when open." },
      { label: "Lining Options", value: "Unlined: $10-20/panel (sheer, light). Standard lining: $5-10 extra (privacy). Blackout: $10-20 extra (R-1.5 insulation, 99% light block)." },
      { label: "Header Types", value: "Rod pocket: visible rod, hard to draw. Grommet: modern, easy to slide. Pinch pleat: formal, requires rings. Back tab: clean, hides rod." },
      { label: "Curtain Width vs Panel", value: "One 54 in panel provides 27 in of coverage at 2x fullness. For a 48 in window + 6 in overhang = 60 in rod ÷ 27 in per panel = ~2.2 → 3 panels." },
      { label: "Ceiling Height Illusion", value: "Mounting the rod 2-4 in below the ceiling (not the window top) visually raises the ceiling by 6-12 in. Use 96 in panels on 8ft ceilings." },
    ]}
  },
  description: 'Calculate the exact number of curtain panels and fabric yardage needed for any window size. Account for rod overhang to block light gaps, choose your gather fullness, and determine the best standard ready-made size to buy.',
  formula: 'Rod Width = Window W + (2 × Overhang) | Fabric Width = Rod Width × Fullness | Panels = Ceil(Fabric Width ÷ 54) | Fabric Yards = Panels × (Height + 8) ÷ 36',
  interpretation: 'For a professional look, extend the curtain rod 6-12 in past the window frame on each side so panels stack off the glass when open. Standard panel width is 54 in; at 2x fullness each panel covers about 27 in of rod width. A 36 in window with 6 in overhang needs a 48 in rod and 3 panels (or 2 wider panels at 72+ in). Choose ready-made lengths: 63 in for short windows, 84 in for 8 ft ceilings, 96 in for 9 ft ceilings. Always round up to avoid insufficient fabric.'
}

export default calcDef
