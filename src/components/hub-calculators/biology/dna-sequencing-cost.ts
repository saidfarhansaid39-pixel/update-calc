import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    genomeGb: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    coverage: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    costGb: z.string().optional().refine(v => !v || parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'genomeGb', label: 'Genome/Target Size', type: 'number', unit: 'Gb', min: 0.001, step: '0.1' },
    { name: 'coverage', label: 'Desired Read Depth', type: 'number', unit: '×', min: 1, step: '1' },
    { name: 'costGb', label: 'Cost per Gb (optional)', type: 'number', unit: 'USD', min: 0.1, step: '1' },
  ],
  compute: (v) => {
    const cpg = v.costGb || 7
    const totalGb = v.genomeGb * v.coverage
    const total = totalGb * cpg
    return {
      result: total, label: 'Estimated Sequencing Cost', unit: 'USD',
      steps: [
        { label: 'Genome/target size', value: `${v.genomeGb} Gb` },
        { label: 'Coverage', value: `${v.coverage}×` },
        { label: 'Total data needed', value: `${totalGb.toFixed(1)} Gb` },
        { label: 'Cost per Gb', value: `$${cpg.toFixed(2)}` },
        { label: 'Total cost', value: `$${total.toFixed(2)}` },
        { label: 'Context', value: 'Human WGS 30× ˜ $672 (at $7/Gb)' },
      ]
}
  },
  description: "Estimate sequencing project costs: data output = genome size \u00d7 coverage. NGS costs have dropped dramatically (Moore's law of sequencing) making WGS increasingly affordable.",
  formula: 'Total data (Gb) = Genome size (Gb) × Coverage | Cost = Total Gb × $/Gb | Human genome 3.2 Gb × 30× ˜ 96 Gb',
  interpretation: 'Typical coverage: WGS 30× (germline), 60-100× (tumor/normal), RNA-seq 20-50M reads, ChIP-seq 20-40M reads, Targeted 500-1000×. Costs vary by platform and throughput (NovaSeq most economical per Gb).'
}

export default calcDef
