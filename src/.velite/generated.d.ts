declare module '@/.velite/generated' {
  export interface CalculatorContent {
    slug: string
    title: string
    description: string
    category: string
    body: string
  }
  export interface GuideContent {
    slug: string
    title: string
    description: string
    body: string
  }
  export const calculators: CalculatorContent[]
  export const guides: GuideContent[]
}
