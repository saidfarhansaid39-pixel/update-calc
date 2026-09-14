export interface HubTemplate {
  description: string
}

const hubTemplates: Record<string, (title: string) => HubTemplate> = {
  financial: (title) => ({
    description: `The ${title} helps you make informed financial decisions by providing accurate, real-time calculations. Whether you're planning a major purchase, evaluating investment options, or managing debt, this tool delivers precise results with clear explanations.`,
  }),
  health: (title) => ({
    description: `The ${title} provides evidence-based health metrics to help you understand and track your wellness. Use it alongside professional medical advice for a clearer picture of your health status.`,
  }),
  math: (title) => ({
    description: `The ${title} simplifies complex mathematical computations into a clear, step-by-step process. Students, educators, and professionals can use it to verify work and explore mathematical concepts.`,
  }),
  conversion: (title) => ({
    description: `The ${title} converts between units instantly and accurately. Whether you're working with imperial and metric systems or specialized units, this tool gives you reliable conversions.`,
  }),
  'date-time': (title) => ({
    description: `The ${title} helps you calculate durations, add or subtract time periods, and convert between time zones with precision.`,
  }),
  construction: (title) => ({
    description: `The ${title} assists builders, architects, and DIY enthusiasts with accurate material estimates, dimension calculations, and cost projections.`,
  }),
  statistics: (title) => ({
    description: `The ${title} performs rigorous statistical analyses, from basic descriptive measures to advanced hypothesis tests and regression models, with clear interpretations of results.`,
  }),
  education: (title) => ({
    description: `The ${title} supports students and educators with grade calculations, academic planning, and performance tracking tools.`,
  }),
  physics: (title) => ({
    description: `The ${title} applies fundamental physics principles to solve problems in mechanics, thermodynamics, electromagnetism, and more.`,
  }),
  chemistry: (title) => ({
    description: `The ${title} helps with molecular calculations, stoichiometry, solution preparation, and chemical equilibrium computations.`,
  }),
  engineering: (title) => ({
    description: `The ${title} supports engineering professionals with precise calculations for structural, electrical, thermal, and fluid mechanics applications.`,
  }),
  everyday: (title) => ({
    description: `The ${title} simplifies everyday calculations so you can make quick, informed decisions in your daily life.`,
  }),
  food: (title) => ({
    description: `The ${title} helps you analyze nutritional content, plan meals, and understand the dietary impact of your food choices.`,
  }),
  biology: (title) => ({
    description: `The ${title} supports biological research and learning with tools for population genetics, enzyme kinetics, and ecological modeling.`,
  }),
  ecology: (title) => ({
    description: `The ${title} provides ecological metrics for environmental assessment, biodiversity analysis, and sustainability planning.`,
  }),
  sports: (title) => ({
    description: `The ${title} calculates athletic performance metrics, training zones, and sport-specific statistics for athletes and coaches.`,
  }),
}

export function getTemplateContent(category: string, title: string): HubTemplate {
  const factory = hubTemplates[category]
  if (factory) return factory(title)
  return { description: `The ${title} provides accurate calculations and clear results to support your decision-making.` }
}
