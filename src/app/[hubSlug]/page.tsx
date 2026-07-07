import { HubLandingContent, generateHubLandingMetadata } from '@/components/hub-pages/hub-landing'

export const revalidate = 3600

export async function generateMetadata({ params, searchParams }: { params: Promise<{ hubSlug: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { hubSlug } = await params
  const sp = await searchParams
  const page = Math.max(1, parseInt(sp.page as string) || 1)
  return generateHubLandingMetadata(hubSlug, page)
}

export default async function HubLandingPage({ params, searchParams }: { params: Promise<{ hubSlug: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { hubSlug } = await params
  return <HubLandingContent hubSlug={hubSlug} searchParams={searchParams} />
}
