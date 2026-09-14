import { getAuthorForHub, type Author } from '@/lib/authors'
import { getReviewKind, getReviewedDate } from '@/lib/trust'
import { getTranslations } from 'next-intl/server'
import { Linkedin, Twitter, Globe, ExternalLink } from 'lucide-react'

function AuthorAvatar({ author }: { author: Author }) {
  if (author.avatar) {
    return (
      <img
        src={author.avatar}
        alt={author.name}
        className="h-16 w-16 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
        loading="lazy"
      />
    )
  }
  const initials = author.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700 ring-2 ring-gray-200 dark:bg-blue-900/50 dark:text-blue-300 dark:ring-gray-700">
      {initials}
    </div>
  )
}

export async function AuthorBioCard({ hub, slug }: { hub: string; slug?: string }) {
  const t = await getTranslations()
  const author = getAuthorForHub(hub)
  const reviewKind = getReviewKind(hub)
  const reviewKindLabel =
    reviewKind === 'medical' ? t('guide.labels.medicallyReviewed')
    : reviewKind === 'financial' ? t('guide.labels.financiallyReviewed')
    : t('guide.labels.expertReviewed')
  const date = getReviewedDate(hub, slug)
  const reviewLabel = t('guide.labels.lastReviewed', { date })

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-start gap-4">
        <AuthorAvatar author={author} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {reviewKindLabel}
          </p>
          <p className="text-base font-bold text-gray-900 dark:text-white">
            {author.name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {author.credentials}
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {author.bio}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {reviewLabel}
          </p>
        </div>
      </div>

      {author.sameAs && (
        <div className="mt-4 flex items-center gap-3 border-t border-gray-100 pt-3 dark:border-gray-800">
          <span className="text-xs font-medium text-gray-500">{t('guide.labels.follow')}</span>
          <div className="flex items-center gap-2">
            {author.sameAs.linkedin && (
              <a
                href={author.sameAs.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                aria-label={`${author.name} on LinkedIn`}
              >
                <Linkedin className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">LinkedIn</span>
              </a>
            )}
            {author.sameAs.twitter && (
              <a
                href={author.sameAs.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                aria-label={`${author.name} on X / Twitter`}
              >
                <Twitter className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">X / Twitter</span>
              </a>
            )}
            {author.sameAs.website && (
              <a
                href={author.sameAs.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                aria-label={`${author.name} website`}
              >
                <Globe className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Website</span>
              </a>
            )}
          </div>
          <a
            href="/editorial-policy"
            className="ml-auto inline-flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 transition-colors"
          >
            {t('guide.labels.editorialPolicy')}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
    </div>
  )
}
