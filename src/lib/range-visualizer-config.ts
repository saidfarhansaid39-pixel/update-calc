import type { RangeSegment } from '@/components/premium/RangeVisualizer'

interface RangeConfig {
  ranges: RangeSegment[]
  label?: string
  formatValue?: (v: number) => string
  mainValueField?: string
}

function fmt1(v: number) { return v.toFixed(1) }
function fmt0(v: number) { return v.toFixed(0) }
function fmtPct(v: number) { return v.toFixed(1) + '%' }

const rangeConfigs: Record<string, (value: number, inputs?: Record<string, string>) => RangeConfig | null> = {
  'bmi-calculator': (val) => ({
    label: 'BMI',
    formatValue: fmt1,
    ranges: [
      { label: 'Severely underweight', min: 0, max: 16, color: '#9b2c2c' },
      { label: 'Underweight', min: 16, max: 18.5, color: '#dd6b20' },
      { label: 'Normal', min: 18.5, max: 25, color: '#38a169' },
      { label: 'Overweight', min: 25, max: 30, color: '#d69e2e' },
      { label: 'Obese I', min: 30, max: 35, color: '#e53e3e' },
      { label: 'Obese II', min: 35, max: 40, color: '#c53030' },
      { label: 'Obese III', min: 40, max: 60, color: '#742a2a' },
    ],
  }),

  'blood-pressure-calculator': (val, inputs) => {
    const sys = inputs?.systolic ? parseFloat(inputs.systolic) : 120
    return {
      label: 'Systolic BP (mmHg)',
      formatValue: fmt0,
      ranges: [
        { label: 'Normal', min: 60, max: 120, color: '#38a169' },
        { label: 'Elevated', min: 120, max: 130, color: '#d69e2e' },
        { label: 'Stage 1 HTN', min: 130, max: 140, color: '#ed8936' },
        { label: 'Stage 2 HTN', min: 140, max: 180, color: '#e53e3e' },
        { label: 'Crisis', min: 180, max: 260, color: '#9b2c2c' },
      ],
    }
  },

  'body-fat-calculator': (val, inputs) => {
    const gender = inputs?.gender || 'male'
    const maleRanges: RangeSegment[] = [
      { label: 'Essential', min: 2, max: 6, color: '#38a169' },
      { label: 'Athletic', min: 6, max: 14, color: '#48bb78' },
      { label: 'Fitness', min: 14, max: 18, color: '#d69e2e' },
      { label: 'Average', min: 18, max: 25, color: '#ed8936' },
      { label: 'Obese', min: 25, max: 50, color: '#e53e3e' },
    ]
    const femaleRanges: RangeSegment[] = [
      { label: 'Essential', min: 10, max: 14, color: '#38a169' },
      { label: 'Athletic', min: 14, max: 21, color: '#48bb78' },
      { label: 'Fitness', min: 21, max: 25, color: '#d69e2e' },
      { label: 'Average', min: 25, max: 32, color: '#ed8936' },
      { label: 'Obese', min: 32, max: 50, color: '#e53e3e' },
    ]
    return {
      label: 'Body Fat %',
      formatValue: fmtPct,
      ranges: gender === 'female' ? femaleRanges : maleRanges,
    }
  },

  'heart-rate-zone': (_val, inputs) => {
    const age = inputs?.age ? parseInt(inputs.age) : 30
    const restHR = inputs?.restHR ? parseInt(inputs.restHR) : 70
    const maxHR = 220 - age
    return {
      label: `Heart Rate (max ${maxHR} bpm)`,
      formatValue: fmt0,
      ranges: [
        { label: 'Very Light', min: restHR, max: maxHR * 0.6, color: '#3182ce' },
        { label: 'Light', min: maxHR * 0.6, max: maxHR * 0.7, color: '#38a169' },
        { label: 'Moderate', min: maxHR * 0.7, max: maxHR * 0.8, color: '#d69e2e' },
        { label: 'Hard', min: maxHR * 0.8, max: maxHR * 0.9, color: '#ed8936' },
        { label: 'Maximum', min: maxHR * 0.9, max: maxHR, color: '#e53e3e' },
      ],
    }
  },

  'waist-to-hip-ratio': (val, inputs) => {
    const gender = inputs?.gender || 'male'
    const maleRanges: RangeSegment[] = [
      { label: 'Low risk', min: 0.6, max: 0.9, color: '#38a169' },
      { label: 'Moderate risk', min: 0.9, max: 0.95, color: '#d69e2e' },
      { label: 'High risk', min: 0.95, max: 1.5, color: '#e53e3e' },
    ]
    const femaleRanges: RangeSegment[] = [
      { label: 'Low risk', min: 0.6, max: 0.8, color: '#38a169' },
      { label: 'Moderate risk', min: 0.8, max: 0.85, color: '#d69e2e' },
      { label: 'High risk', min: 0.85, max: 1.5, color: '#e53e3e' },
    ]
    return {
      label: 'Waist-to-Hip Ratio',
      formatValue: (v: number) => v.toFixed(2),
      ranges: gender === 'female' ? femaleRanges : maleRanges,
    }
  },

  'waist-to-height-ratio': () => ({
    label: 'Waist-to-Height Ratio',
    formatValue: (v: number) => v.toFixed(2),
    ranges: [
      { label: 'Healthy', min: 0.3, max: 0.5, color: '#38a169' },
      { label: 'Increased risk', min: 0.5, max: 0.6, color: '#d69e2e' },
      { label: 'High risk', min: 0.6, max: 1.0, color: '#e53e3e' },
    ],
  }),

  'body-roundness-index': () => ({
    label: 'Body Roundness Index',
    formatValue: fmt1,
    ranges: [
      { label: 'Lean', min: 1, max: 4, color: '#38a169' },
      { label: 'Average', min: 4, max: 7, color: '#d69e2e' },
      { label: 'High', min: 7, max: 16, color: '#e53e3e' },
    ],
  }),

  'ponderal-index': () => ({
    label: 'Ponderal Index',
    formatValue: fmt1,
    ranges: [
      { label: 'Low', min: 8, max: 11, color: '#38a169' },
      { label: 'Normal', min: 11, max: 14, color: '#38a169' },
      { label: 'High', min: 14, max: 25, color: '#e53e3e' },
    ],
  }),

  'target-heart-rate': (val, inputs) => {
    const age = inputs?.age ? parseInt(inputs.age) : 30
    const restHR = inputs?.restHR ? parseInt(inputs.restHR) : 70
    const maxHR = 220 - age
    return {
      label: 'Target Heart Rate (bpm)',
      formatValue: fmt0,
      ranges: [
        { label: 'Very Light', min: restHR, max: maxHR * 0.6, color: '#3182ce' },
        { label: 'Light', min: maxHR * 0.6, max: maxHR * 0.7, color: '#38a169' },
        { label: 'Moderate', min: maxHR * 0.7, max: maxHR * 0.8, color: '#d69e2e' },
        { label: 'Hard', min: maxHR * 0.8, max: maxHR * 0.9, color: '#ed8936' },
        { label: 'Maximum', min: maxHR * 0.9, max: maxHR, color: '#e53e3e' },
      ],
    }
  },

  'bmr-calculator': () => ({
    label: 'BMR (kcal/day)',
    formatValue: fmt0,
    ranges: [
      { label: 'Low', min: 800, max: 1400, color: '#3182ce' },
      { label: 'Average', min: 1400, max: 1900, color: '#38a169' },
      { label: 'High', min: 1900, max: 2500, color: '#d69e2e' },
      { label: 'Very High', min: 2500, max: 4000, color: '#e53e3e' },
    ],
  }),

  'tdee-calculator': () => ({
    label: 'TDEE (kcal/day)',
    formatValue: fmt0,
    ranges: [
      { label: 'Low', min: 1200, max: 1800, color: '#3182ce' },
      { label: 'Average', min: 1800, max: 2600, color: '#38a169' },
      { label: 'High', min: 2600, max: 3500, color: '#d69e2e' },
      { label: 'Very High', min: 3500, max: 5000, color: '#e53e3e' },
    ],
  }),

  'frame-size': (val, inputs) => {
    const gender = inputs?.gender || 'male'
    const ranges: RangeSegment[] = gender === 'female'
      ? [
          { label: 'Small', min: 0, max: 9.9, color: '#3182ce' },
          { label: 'Medium', min: 9.9, max: 10.5, color: '#38a169' },
          { label: 'Large', min: 10.5, max: 15, color: '#d69e2e' },
        ]
      : [
          { label: 'Small', min: 0, max: 9.6, color: '#3182ce' },
          { label: 'Medium', min: 9.6, max: 10.4, color: '#38a169' },
          { label: 'Large', min: 10.4, max: 15, color: '#d69e2e' },
        ]
    return { label: 'Frame Size (wrist cm)', formatValue: fmt1, ranges }
  },

  'ideal-body-weight': () => ({
    label: 'Ideal Body Weight (kg)',
    formatValue: fmt1,
    ranges: [
      { label: 'Below IBW', min: 20, max: 45, color: '#3182ce' },
      { label: 'IBW Range', min: 45, max: 75, color: '#38a169' },
      { label: 'Above IBW', min: 75, max: 120, color: '#e53e3e' },
    ],
  }),

  'lean-body-mass': (val, inputs) => {
    const gender = inputs?.gender || 'male'
    const ranges: RangeSegment[] = gender === 'female'
      ? [{ label: 'Low', min: 15, max: 35, color: '#3182ce' }, { label: 'Normal', min: 35, max: 50, color: '#38a169' }, { label: 'High', min: 50, max: 80, color: '#d69e2e' }]
      : [{ label: 'Low', min: 30, max: 50, color: '#3182ce' }, { label: 'Normal', min: 50, max: 65, color: '#38a169' }, { label: 'High', min: 65, max: 100, color: '#d69e2e' }]
    return { label: 'Lean Body Mass (kg)', formatValue: fmt1, ranges }
  },

  'fat-free-mass-index': (val, inputs) => {
    const gender = inputs?.gender || 'male'
    const ranges: RangeSegment[] = gender === 'female'
      ? [{ label: 'Low', min: 10, max: 14, color: '#e53e3e' }, { label: 'Normal', min: 14, max: 17, color: '#38a169' }, { label: 'High', min: 17, max: 23, color: '#d69e2e' }]
      : [{ label: 'Low', min: 14, max: 17, color: '#e53e3e' }, { label: 'Normal', min: 17, max: 20, color: '#38a169' }, { label: 'High', min: 20, max: 26, color: '#d69e2e' }]
    return { label: 'FFMI', formatValue: fmt1, ranges }
  },

  'vo2-max-estimate': (val, inputs) => {
    const gender = inputs?.gender || 'male'
    const ages = inputs?.age ? parseInt(inputs.age) : 30
    const ranges: RangeSegment[] = gender === 'female'
      ? [{ label: 'Poor', min: 10, max: 28, color: '#e53e3e' }, { label: 'Fair', min: 28, max: 34, color: '#ed8936' }, { label: 'Average', min: 34, max: 40, color: '#d69e2e' }, { label: 'Good', min: 40, max: 46, color: '#38a169' }, { label: 'Excellent', min: 46, max: 60, color: '#2b6cb0' }]
      : [{ label: 'Poor', min: 10, max: 32, color: '#e53e3e' }, { label: 'Fair', min: 32, max: 38, color: '#ed8936' }, { label: 'Average', min: 38, max: 44, color: '#d69e2e' }, { label: 'Good', min: 44, max: 51, color: '#38a169' }, { label: 'Excellent', min: 51, max: 70, color: '#2b6cb0' }]
    return { label: 'VO₂ Max (mL/kg/min)', formatValue: fmt1, ranges }
  },

  'recovery-heart-rate': () => ({
    label: 'Recovery HR (bpm drop)',
    formatValue: fmt0,
    ranges: [
      { label: 'Poor', min: 0, max: 12, color: '#e53e3e' },
      { label: 'Average', min: 12, max: 22, color: '#d69e2e' },
      { label: 'Good', min: 22, max: 30, color: '#38a169' },
      { label: 'Excellent', min: 30, max: 60, color: '#2b6cb0' },
    ],
  }),

  'apgar-score': () => ({
    label: 'Apgar Score',
    formatValue: fmt0,
    ranges: [
      { label: 'Critical', min: 0, max: 3, color: '#e53e3e' },
      { label: 'Below Normal', min: 3, max: 7, color: '#d69e2e' },
      { label: 'Normal', min: 7, max: 10, color: '#38a169' },
    ],
  }),

  'glasgow-coma-scale': () => ({
    label: 'GCS Score',
    formatValue: fmt0,
    ranges: [
      { label: 'Severe', min: 3, max: 8, color: '#e53e3e' },
      { label: 'Moderate', min: 8, max: 13, color: '#d69e2e' },
      { label: 'Mild', min: 13, max: 15, color: '#38a169' },
    ],
  }),

  'egfr-calculator': () => ({
    label: 'eGFR (mL/min/1.73m²)',
    formatValue: fmt0,
    ranges: [
      { label: 'Kidney failure', min: 0, max: 15, color: '#e53e3e' },
      { label: 'Severe', min: 15, max: 30, color: '#ed8936' },
      { label: 'Moderate', min: 30, max: 60, color: '#d69e2e' },
      { label: 'Mild', min: 60, max: 90, color: '#3182ce' },
      { label: 'Normal', min: 90, max: 140, color: '#38a169' },
    ],
  }),

  'creatinine-clearance': () => ({
    label: 'CrCl (mL/min)',
    formatValue: fmt0,
    ranges: [
      { label: 'Severe', min: 0, max: 30, color: '#e53e3e' },
      { label: 'Moderate', min: 30, max: 60, color: '#d69e2e' },
      { label: 'Mild', min: 60, max: 90, color: '#3182ce' },
      { label: 'Normal', min: 90, max: 150, color: '#38a169' },
    ],
  }),

  'meld-score': () => ({
    label: 'MELD Score',
    formatValue: fmt0,
    ranges: [
      { label: 'Low risk', min: 6, max: 10, color: '#38a169' },
      { label: 'Moderate', min: 10, max: 20, color: '#d69e2e' },
      { label: 'High risk', min: 20, max: 40, color: '#e53e3e' },
    ],
  }),

  'child-pugh-score': () => ({
    label: 'Child-Pugh Score',
    formatValue: fmt0,
    ranges: [
      { label: 'Class A', min: 5, max: 6, color: '#38a169' },
      { label: 'Class B', min: 7, max: 9, color: '#d69e2e' },
      { label: 'Class C', min: 10, max: 15, color: '#e53e3e' },
    ],
  }),

  'curb65-score': () => ({
    label: 'CURB-65',
    formatValue: fmt0,
    ranges: [
      { label: 'Low risk', min: 0, max: 1, color: '#38a169' },
      { label: 'Moderate', min: 2, max: 2, color: '#d69e2e' },
      { label: 'Severe', min: 3, max: 5, color: '#e53e3e' },
    ],
  }),

  'phq9-depression-score': () => ({
    label: 'PHQ-9 Score',
    formatValue: fmt0,
    ranges: [
      { label: 'None/Minimal', min: 0, max: 4, color: '#38a169' },
      { label: 'Mild', min: 5, max: 9, color: '#3182ce' },
      { label: 'Moderate', min: 10, max: 14, color: '#d69e2e' },
      { label: 'Moderately Severe', min: 15, max: 19, color: '#ed8936' },
      { label: 'Severe', min: 20, max: 27, color: '#e53e3e' },
    ],
  }),

  'gad7-anxiety-score': () => ({
    label: 'GAD-7 Score',
    formatValue: fmt0,
    ranges: [
      { label: 'None/Minimal', min: 0, max: 4, color: '#38a169' },
      { label: 'Mild', min: 5, max: 9, color: '#3182ce' },
      { label: 'Moderate', min: 10, max: 14, color: '#d69e2e' },
      { label: 'Severe', min: 15, max: 21, color: '#e53e3e' },
    ],
  }),

  'oxygen-saturation': () => ({
    label: 'SpO₂ (%)',
    formatValue: fmt0,
    ranges: [
      { label: 'Critical', min: 0, max: 90, color: '#e53e3e' },
      { label: 'Low', min: 90, max: 95, color: '#ed8936' },
      { label: 'Normal', min: 95, max: 100, color: '#38a169' },
    ],
  }),

  'chads-vasc-score': () => ({
    label: 'CHA₂DS₂-VASc',
    formatValue: fmt0,
    ranges: [
      { label: 'Low risk', min: 0, max: 1, color: '#38a169' },
      { label: 'Moderate', min: 2, max: 3, color: '#d69e2e' },
      { label: 'High risk', min: 4, max: 9, color: '#e53e3e' },
    ],
  }),
}

export function getRangeConfig(slug: string, mainValue?: number, inputs?: Record<string, string>): RangeConfig | null {
  const fn = rangeConfigs[slug]
  if (!fn || mainValue === undefined || mainValue === null || isNaN(mainValue)) return null
  return fn(mainValue, inputs)
}

export function hasRangeConfig(slug: string): boolean {
  return slug in rangeConfigs
}
