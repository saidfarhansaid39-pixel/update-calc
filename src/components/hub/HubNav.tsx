import { Link } from '@/lib/navigation'
import { HubIcon } from '@/components/hub/HubIcon'
import { getAllHubSlugs } from '@/lib/hub-data'
import { getHubTheme } from '@/lib/hub-themes'
import { getLocale, getTranslations } from 'next-intl/server'

function shortKey(hubSlug: string): string {
  return hubSlug.replace('-calculators', '')
}

export async function HubNav({ activeSlug }: { activeSlug?: string }) {
  const locale = await getLocale()
  const t = await getTranslations('hubs')
  const { calculatorRegistry } = await import('@calcuniverse/calculator-registry')

  const slugs = getAllHubSlugs()
  const counts: Record<string, number> = {}
  for (const slug of slugs) {
    counts[slug] = calculatorRegistry.filter((c: { hubSlug: string }) => c.hubSlug === slug).length
  }

  const activeTheme = activeSlug ? getHubTheme(activeSlug) : null

  return (
    <nav
      aria-label="Calculator categories"
      className="w-full"
    >
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1 [scrollbar-width:thin]">
        {slugs.map((slug) => {
          const isActive = slug === activeSlug
          const name = t(`name_${shortKey(slug)}`)
          const count = counts[slug] || 0
          return (
            <Link
              key={slug}
              href={`/${slug}`}
              aria-current={isActive ? 'page' : undefined}
              className={`group flex items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-transparent text-white shadow-sm'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
              style={
                isActive && activeTheme
                  ? {
                      backgroundColor: activeTheme.accent,
                      boxShadow: `0 1px 2px rgb(${activeTheme.accentRgb} / 0.4)`,
                    }
                  : undefined
              }
            >
              <HubIcon slug={slug} className="w-4 h-4" />
              <span>{name}</span>
              <span
                className={`text-[10px] font-semibold ${
                  isActive ? 'text-white/80' : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {count}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
