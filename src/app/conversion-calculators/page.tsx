import { HubLandingContent, generateHubLandingMetadata } from '@/components/hub-pages/hub-landing'
import { getHubMeta } from '@/lib/hub-data'

export const revalidate = 3600

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const sp = await searchParams
  const page = Math.max(1, parseInt(sp.page as string) || 1)
  return generateHubLandingMetadata('conversion-calculators', page)
}

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  return <HubLandingContent hubSlug="conversion-calculators" searchParams={searchParams} />
}
