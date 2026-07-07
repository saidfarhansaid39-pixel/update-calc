'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useRouter } from '@/lib/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { createSearch } from '@/lib/search';
import { getLocalizedCalculator } from '@/lib/localized-registry';

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [results, setResults] = useState<{ slug: string; hubSlug: string; title: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const search = useMemo(() => createSearch(locale), [locale]);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const t = useTranslations('hubs')
  const hubLabels: Record<string, string> = {
    'financial-calculators': t('name_financial'),
    'health-calculators': t('name_health'),
    'math-calculators': t('name_math'),
    'conversion-calculators': t('name_conversion'),
    'date-time-calculators': t('name_date-time'),
    'construction-calculators': t('name_construction'),
    'statistics-calculators': t('name_statistics'),
    'education-calculators': t('name_education'),
    'physics-calculators': t('name_physics'),
    'chemistry-calculators': t('name_chemistry'),
    'engineering-calculators': t('name_engineering'),
    'everyday-calculators': t('name_everyday'),
    'food-calculators': t('name_food'),
    'biology-calculators': t('name_biology'),
    'ecology-calculators': t('name_ecology'),
    'sports-calculators': t('name_sports'),
  }

  const doSearch = useCallback(async (term: string) => {
    if (term.length < 2) {
      setResults([]);
      setShowDropdown(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    const matches = await search(term);
    const localized = await Promise.all(matches.map(async r => {
      const loc = await getLocalizedCalculator(r.slug, locale);
      return loc ? { ...r, title: loc.title } : r;
    }));
    setResults(localized);
    setShowDropdown(localized.length > 0 || term.length >= 2);
    setLoading(false);
  }, [search, locale]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (searchTerm.length < 2) {
      setResults([]);
      setShowDropdown(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(() => doSearch(searchTerm), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchTerm, doSearch]);

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  function handleSelect(slug: string, hubSlug: string) {
    setSearchTerm('');
    setShowDropdown(false);
    router.push(`/${hubSlug}/${slug}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && results.length > 0) {
      handleSelect(results[0].slug, results[0].hubSlug);
    }
    if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  }

  return (
    <div className="relative group" ref={dropdownRef}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1a3a8a] to-[#06b6d4] rounded-2xl opacity-20 blur group-hover:opacity-30 transition duration-300" />
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-gray-400" />
        <input
          type="text"
          role="combobox"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          aria-label="Search all calculators"
          aria-controls="search-results-listbox"
          aria-autocomplete="list"
          placeholder="Search all calculators..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => searchTerm.length >= 2 && setShowDropdown(true)}
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#06b6d4]/30 focus:border-[#06b6d4] text-base shadow-sm"
        />
        {loading && (
          <Loader2 className="absolute right-4 w-5 h-5 text-gray-400 animate-spin" />
        )}
      </div>
      {showDropdown && (
        <div
          id="search-results-listbox"
          role="listbox"
          aria-label="Search results"
          className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden"
        >
          {results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-400 text-center">No calculators found</div>
          ) : (
            results.map((r) => (
              <button
                key={`${r.hubSlug}/${r.slug}`}
                role="option"
                aria-selected={false}
                onClick={() => handleSelect(r.slug, r.hubSlug)}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 flex items-center justify-between gap-2"
              >
                <span>{r.title}</span>
                <span className="text-[10px] font-medium text-[#1a3a8a] dark:text-[#06b6d4] bg-[#1a3a8a]/5 dark:bg-[#06b6d4]/10 px-1.5 py-0.5 rounded flex-shrink-0">
                  {hubLabels[r.hubSlug] || r.hubSlug.replace('-calculators', '')}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
