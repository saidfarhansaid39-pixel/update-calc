import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ tvsdViewingDist: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tvsdResolution: z.string().min(1), tvsdAspectRatio: z.string().min(1) }),
  fields: [
    { name: 'tvsdViewingDist', label: 'Viewing Distance (ft)', type: 'number', min: 3, step: '1' },
    { name: 'tvsdResolution', label: 'Screen Resolution', type: 'select', options: [{ label: '1080p (HD)', value: '1080p' }, { label: '4K (UHD)', value: '4k' }, { label: '8K', value: '8k' }] },
    { name: 'tvsdAspectRatio', label: 'Aspect Ratio', type: 'select', options: [{ label: '16:9 (Standard)', value: '16:9' }, { label: '21:9 (Ultrawide)', value: '21:9' }] },
  ],
  compute: (v) => {
    const resolutionMap: Record<string, { minFactor: number; maxFactor: number; idealFactor: number }> = { '1080p': { minFactor: 1.5, maxFactor: 3, idealFactor: 2.5 }, '4k': { minFactor: 1, maxFactor: 2, idealFactor: 1.5 }, '8k': { minFactor: 0.75, maxFactor: 1.5, idealFactor: 1 } }
    const res = resolutionMap[v.tvsdResolution] || { minFactor: 1, maxFactor: 2, idealFactor: 1.5 }
    const minSize = v.tvsdViewingDist * 12 / res.maxFactor
    const maxSize = v.tvsdViewingDist * 12 / res.minFactor
    const idealSize = v.tvsdViewingDist * 12 / res.idealFactor
    const aspectRatio = v.tvsdAspectRatio === '21:9' ? 21 / 9 : 16 / 9
    const diagFactor = Math.sqrt(1 + 1 / (aspectRatio * aspectRatio)) * aspectRatio
    const minDiagonal = minSize * diagFactor
    const maxDiagonal = maxSize * diagFactor
    const idealDiagonal = idealSize * diagFactor
    const fovDeg = 2 * Math.atan((idealSize / 2) / (v.tvsdViewingDist * 12)) * (180 / Math.PI)
    return { result: idealDiagonal, label: 'Ideal TV Size', unit: 'in', steps: [{ label: 'Resolution', value: v.tvsdResolution }, { label: 'Min Size', value: minDiagonal.toFixed(0) + ' in' }, { label: 'Ideal Size', value: idealDiagonal.toFixed(0) + ' in' }, { label: 'Max Size', value: maxDiagonal.toFixed(0) + ' in' }, { label: 'Field of View', value: fovDeg.toFixed(1) + ' deg (ideal: 30-40 deg)' }] }
  },
  description: 'Find the optimal TV size for your viewing distance based on screen resolution and aspect ratio. Matches THX and SMPTE recommendations.',
  formula: 'IdealDiagonal = Distance x 12 / ResolutionFactor / cos(atan(9/16)) | 4K: 1-2x distance | 1080p: 1.5-3x distance',
  interpretation: 'THX recommends 30-40 deg field of view. For 8 ft distance: 65 in (4K), 55 in (1080p). 4K allows sitting closer without pixels visible. Too large = eye fatigue, too small = squinting. Bigger is generally better for 4K content.'
}

export default calcDef
