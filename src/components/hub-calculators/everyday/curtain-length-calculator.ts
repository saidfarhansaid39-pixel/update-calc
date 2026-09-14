import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ windowHeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), rodHeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), mountType: z.string().min(1), fullness: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'windowHeight', label: 'Window Height (in)', type: 'number', min: 12, step: '6' },
    { name: 'rodHeight', label: 'Rod Height from Floor (in)', type: 'number', min: 1, step: '1' },
    { name: 'mountType', label: 'Mount Type', type: 'select', options: [{ label: 'Inside Mount', value: 'inside' }, { label: 'Outside Mount', value: 'outside' }] },
    { name: 'fullness', label: 'Fullness Factor', type: 'number', min: 1, max: 3, step: '0.5' },
  ],
  defaults: { windowHeight: '48', rodHeight: '84', mountType: 'outside', fullness: '2' },
  presets: [
    { label: 'Standard Living Room', values: { windowHeight: '48', rodHeight: '84', mountType: 'outside', fullness: '2' } },
    { label: 'Large Patio Door', values: { windowHeight: '80', rodHeight: '96', mountType: 'outside', fullness: '2.5' } },
    { label: 'Small Bathroom Window', values: { windowHeight: '36', rodHeight: '60', mountType: 'inside', fullness: '1.5' } },
    { label: 'Floor-to-Ceiling', values: { windowHeight: '72', rodHeight: '96', mountType: 'outside', fullness: '3' } },
  ],
  compute: (v) => {
    const curtainLength = v.mountType === 'inside' ? v.windowHeight : v.rodHeight
    const windowWidth = v.windowHeight * 0.5
    const totalFabricWidth = v.fullness * windowWidth
    const panels = Math.ceil(totalFabricWidth / 54)
    const curtainLengthInches = curtainLength + (v.mountType === 'outside' ? 6 : 0)
    const fabricYards = (panels * (curtainLengthInches + 8)) / 36
    return { result: curtainLength, label: 'Curtain Length Needed', unit: 'in', steps: [{ label: 'Mount Style', value: v.mountType === 'inside' ? 'Inside mount (fits inside window frame, clean look)' : 'Outside mount (covers frame + 3-6in overlap)' }, { label: 'Assumed Window Width', value: `~${windowWidth.toFixed(0)} in (50% of height)` }, { label: 'Fullness Level', value: `${v.fullness}x gathers — ${v.fullness <= 1.5 ? 'minimal/light' : v.fullness <= 2 ? 'standard' : 'luxurious/full'}` }, { label: 'Fabric Width Needed', value: `${totalFabricWidth.toFixed(0)} in` }, { label: 'Panels Required', value: `${panels} panel(s) at 54 in standard width` }, { label: 'Cut Length Each', value: `${curtainLengthInches.toFixed(0)} in (${curtainLength.toFixed(0)} finished + 8 in hems)` }, { label: 'Total Fabric Needed', value: `${fabricYards.toFixed(1)} yards` }] ,
    extras: [
      { label: "Standard Lengths", value: "63, 84, 96, and 108 in are standard. If your calculated length falls between sizes, choose longer and hem—it's easier than adding length." },
      { label: "Fullness Guide", value: "1.5x = minimalist/flat panel. 2x = standard gathers (most common). 2.5x = generous gathers. 3x = luxurious/formal. Higher fullness needs more panels." },
      { label: "Mount Height", value: "Install the rod 4-6 in above the window frame—this makes ceilings look higher. For floor-length, position 0.5-1 in above the floor or puddle 1-2 in." },
      { label: "Inside Mount Requirements", value: "Requires 2-4 in of flat clearance above the window and a frame at least 1.5 in deep for the bracket. Best for small or recessed windows." },
      { label: "Outside Mount Overlap", value: "Add 3-6 in on each side of the window to block light gaps. Minimum 2 in of wall space on each side required for mounting brackets." },
      { label: "Light Control", value: "Lined curtains block 80-99% of light. Blackout coating adds $5-10/panel but reduces light bleed and adds thermal insulation (R-1.5)." },
      { label: "Rod Diameter", value: "1 in rods for standard panels, 1.5-2 in for heavy drapes. Grommet top panels need a rod that fits through the rings (typically 1-1.5 in)." },
      { label: "Header Types", value: "Rod pocket (cheap, hard to draw), grommet (easiest to draw, modern look), pinch pleat (formal, classic), back tab (hides rod, clean look)." },
    ]}
  },
  description: 'Determine the exact curtain length, number of panels, and total fabric yardage needed for any window. Choose between inside and outside mounts, adjust fullness for your preferred gathered look, and get pro guidance on rod placement and header styles.',
  formula: 'Inside Length = Window H | Outside Length = Rod H | Panels = Ceil(Fullness × Window W × 0.5 ÷ 54) | Fabric Yards = Panels × (Finished Length + 8) ÷ 36',
  interpretation: 'Standard curtain panels are 54 in wide. For a polished look, mount the rod 4-6 in above the window frame and extend 3-6 in past each side. A fullness factor of 2x is standard and requires fabric width roughly double the window width. Floor-length curtains make rooms feel taller; choose 84 in for standard 8 ft ceilings or 96 in for 9 ft ceilings. Always buy one extra panel for returns or pattern matching on patterned fabric.'
}

export default calcDef
