import { notFound } from 'next/navigation'
import { getHubMeta, isValidHubSlug, getAllHubSlugs } from '@/lib/hub-data'
import { CalculatorPageContent, generateCalculatorMetadata } from '@/components/hub-pages/calculator-page-content'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  if (slug.length !== 2) return {}
  if (!isValidHubSlug(slug[0])) return {}
  return generateCalculatorMetadata(slug[0], slug[1])
}

export default async function CatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  if (slug.length !== 2) notFound()
  if (!isValidHubSlug(slug[0])) notFound()
  return <CalculatorPageContent hubSlug={slug[0]} slug={slug[1]} />
}
