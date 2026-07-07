export interface ClusterFAQ {
  q: string
  a: string
}

export interface ClusterVariant {
  key: string
  title: string
  description: string
  h1: string
  intro: string
  searchIntent: string
  audience: string
  faqs: ClusterFAQ[]
  slugSuffix: string
}

export interface ClusterDefinition {
  primarySlug: string
  hubSlug: string
  variants: ClusterVariant[]
}

export interface ClusterFlatEntry {
  slug: string
  primarySlug: string
  hubSlug: string
  variant: ClusterVariant
}
