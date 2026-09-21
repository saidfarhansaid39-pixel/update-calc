import { getTranslations } from 'next-intl/server';

export interface CitationSource {
  title: string;
  url: string;
}

export async function CitationSources({ sources }: { sources: CitationSource[] }) {
  const t = await getTranslations('calculatorUI.chrome.trust');
  return (
    <section className="mt-6">
      <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">{t('sources')}</h3>
      <ul className="space-y-1 text-sm">
        {sources.map((s, i) => (
          <li key={i}>
            <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="text-[#06b6d4] hover:underline">
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}