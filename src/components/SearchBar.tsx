'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Search, Loader2, History, TrendingUp, X } from 'lucide-react';
import { useRouter } from '@/lib/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { createSearch, type SearchResult } from '@/lib/search';
import { getLocalizedCalculator } from '@/lib/localized-registry';

const RECENT_KEY = 'jdcalc_recent_searches';
const MAX_RECENT = 5;

// Top calculators shown as default suggestions when the field is empty.
const POPULAR: SearchResult[] = [
  { slug: 'mortgage-calculator', hubSlug: 'financial-calculators', title: 'Mortgage Calculator' },
  { slug: 'bmi-calculator', hubSlug: 'health-calculators', title: 'BMI Calculator' },
  { slug: 'loan-calculator', hubSlug: 'financial-calculators', title: 'Loan Calculator' },
  { slug: 'compound-interest-calculator', hubSlug: 'financial-calculators', title: 'Compound Interest Calculator' },
  { slug: 'retirement-calculator', hubSlug: 'financial-calculators', title: 'Retirement Calculator' },
  { slug: 'salary-calculator', hubSlug: 'financial-calculators', title: 'Salary Calculator' },
  { slug: 'calorie-calculator', hubSlug: 'health-calculators', title: 'Calorie Calculator' },
  { slug: 'tip-calculator', hubSlug: 'math-calculators', title: 'Tip Calculator' },
];

const HUB_SLUGS = [
  'financial-calculators',
  'health-calculators',
  'math-calculators',
  'conversion-calculators',
  'date-time-calculators',
  'construction-calculators',
  'statistics-calculators',
  'education-calculators',
  'physics-calculators',
  'chemistry-calculators',
  'engineering-calculators',
  'everyday-calculators',
  'food-calculators',
  'biology-calculators',
  'ecology-calculators',
  'sports-calculators',
];

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let curr = new Array(n + 1).fill(0);
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

// Cache the full search-index documents per locale so "did you mean" can
// scan every calculator for the closest fuzzy match.
const poolCache = new Map<string, Promise<SearchResult[]>>();
function getSuggestionPool(locale: string): Promise<SearchResult[]> {
  if (!poolCache.has(locale)) {
    const p = fetch(`/search-index/${locale}.json`)
      .then((r) => r.json())
      .then((json: any) => {
        const docs = json.documents || [];
        return docs
          .filter((d: any) => d && d.slug && d.hubSlug && d.title)
          .map((d: any) => ({ slug: d.slug, hubSlug: d.hubSlug, title: d.title }));
      })
      .catch(() => []);
    poolCache.set(locale, p);
  }
  return poolCache.get(locale)!;
}

async function findDidYouMean(query: string, locale: string): Promise<SearchResult | null> {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return null;
  const pool = await getSuggestionPool(locale);
  if (pool.length === 0) return null;
  let best: SearchResult | null = null;
  let bestDist = Infinity;
  for (const d of pool) {
    const title = (d.title || '').toLowerCase();
    const slug = (d.slug || '').toLowerCase();
    const dist = Math.min(levenshtein(q, title), levenshtein(q, slug));
    if (dist < bestDist) {
      bestDist = dist;
      best = d;
    }
  }
  const threshold = Math.max(4, Math.floor(q.length * 0.6));
  return best && bestDist <= threshold ? best : null;
}

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeHub, setActiveHub] = useState<string>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const [didYouMean, setDidYouMean] = useState<SearchResult | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const search = useMemo(() => createSearch(locale), [locale]);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const t = useTranslations('hubs');
  const hubShortLabel = useCallback(
    (slug: string) => t(`name_${slug.replace('-calculators', '')}`),
    [t],
  );

  const hubFilters = useMemo(
    () => [{ slug: 'all', label: 'All' }, ...HUB_SLUGS.map((s) => ({ slug: s, label: hubShortLabel(s) }))],
    [hubShortLabel],
  );

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      if (stored) setRecent(JSON.parse(stored));
    } catch {
      /* ignore */
    }
  }, []);

  const addRecent = useCallback((term: string) => {
    const clean = term.trim();
    if (clean.length < 2) return;
    setRecent((prev) => {
      const next = [clean, ...prev.filter((r) => r.toLowerCase() !== clean.toLowerCase())].slice(0, MAX_RECENT);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const doSearch = useCallback(
    async (term: string) => {
      if (term.length < 2) {
        setResults([]);
        setDidYouMean(null);
        setShowDropdown(false);
        setLoading(false);
        return;
      }
      setLoading(true);
      const matches = await search(term);
      const localized = await Promise.all(
        matches.map(async (r) => {
          const loc = await getLocalizedCalculator(r.slug, locale);
          return loc ? { ...r, title: loc.title } : r;
        }),
      );
      setResults(localized);
      setShowDropdown(localized.length > 0 || term.length >= 2);
      setDidYouMean(localized.length === 0 ? await findDidYouMean(term, locale) : null);
      setLoading(false);
    },
    [search, locale],
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (searchTerm.trim().length < 2) {
      setResults([]);
      setDidYouMean(null);
      setLoading(false);
      if (!searchTerm) setShowDropdown(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(() => doSearch(searchTerm), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
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

  const trimmed = searchTerm.trim();
  const isSearching = trimmed.length >= 2;
  const showSuggestions = showDropdown && !isSearching;
  const filtered = useMemo(
    () => (activeHub === 'all' ? results : results.filter((r) => r.hubSlug === activeHub)),
    [results, activeHub],
  );

  const navItems: SearchResult[] = isSearching ? filtered : showSuggestions ? POPULAR : [];

  useEffect(() => {
    setActiveIndex(0);
  }, [showDropdown, isSearching, activeHub, results.length]);

  function handleSelect(slug: string, hubSlug: string) {
    addRecent(searchTerm);
    setSearchTerm('');
    setShowDropdown(false);
    setActiveHub('all');
    router.push(`/${hubSlug}/${slug}`);
  }

  function runRecent(term: string) {
    setSearchTerm(term);
    setShowDropdown(true);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      if (navItems.length === 0) return;
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % navItems.length);
    } else if (e.key === 'ArrowUp') {
      if (navItems.length === 0) return;
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + navItems.length) % navItems.length);
    } else if (e.key === 'Enter') {
      if (navItems.length > 0) {
        const item = navItems[activeIndex] || navItems[0];
        handleSelect(item.slug, item.hubSlug);
      } else if (didYouMean) {
        handleSelect(didYouMean.slug, didYouMean.hubSlug);
      }
    } else if (e.key === 'Escape') {
      setSearchTerm('');
      setShowDropdown(false);
      setActiveHub('all');
      setActiveIndex(0);
      inputRef.current?.blur();
    }
  }

  return (
    <div className="relative group" ref={dropdownRef}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1a3a8a] to-[#06b6d4] rounded-2xl opacity-20 blur group-hover:opacity-30 transition duration-300" />
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
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
          onFocus={() => setShowDropdown(true)}
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#06b6d4]/30 focus:border-[#06b6d4] text-base shadow-sm"
        />
        {searchTerm && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setSearchTerm('');
              setShowDropdown(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {loading && (
          <Loader2 className="absolute right-4 w-5 h-5 text-gray-400 animate-spin" />
        )}
      </div>

      {showDropdown && (
        <div
          id="search-results-listbox"
          role="listbox"
          aria-label="Search results"
          className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden max-h-[70vh] overflow-y-auto"
        >
          {/* Hub filter chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto px-3 py-2.5 border-b border-gray-100 dark:border-gray-700 [scrollbar-width:thin]">
            {hubFilters.map((f) => {
              const isActive = f.slug === activeHub;
              return (
                <button
                  key={f.slug}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveHub(f.slug)}
                  className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#1a3a8a] text-white dark:bg-[#06b6d4]'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {showSuggestions ? (
            <div className="py-1">
              {recent.length > 0 && (
                <div className="px-3 pt-2 pb-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1 flex items-center gap-1">
                    <History className="w-3 h-3" /> Recent searches
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {recent.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => runRecent(term)}
                        className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-1 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <History className="w-3 h-3" />
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="px-3 pt-2 pb-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Popular calculators
                </p>
                <ul>
                  {POPULAR.map((r, i) => (
                    <li key={`${r.hubSlug}/${r.slug}`}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={navItems[activeIndex] === r}
                        onMouseEnter={() => setActiveIndex(i)}
                        onClick={() => handleSelect(r.slug, r.hubSlug)}
                        className={`w-full text-left px-2 py-2 text-sm rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                          navItems[activeIndex] === r ? 'bg-gray-100 dark:bg-gray-700' : ''
                        }`}
                      >
                        {r.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="py-1">
              <div role="status" aria-live="polite" className="px-4 py-1.5 text-xs text-gray-500 dark:text-gray-300">
                {filtered.length} result{filtered.length === 1 ? '' : 's'} for &ldquo;{trimmed}&rdquo;
              </div>
              {filtered.length === 0 ? (
                didYouMean ? (
                  <button
                    type="button"
                    onClick={() => handleSelect(didYouMean.slug, didYouMean.hubSlug)}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Did you mean: <span className="font-semibold text-[#1a3a8a] dark:text-[#06b6d4]">{didYouMean.title}</span>?
                  </button>
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-400 text-center">No calculators found</div>
                )
              ) : (
                filtered.map((r, i) => (
                  <button
                    key={`${r.hubSlug}/${r.slug}`}
                    type="button"
                    role="option"
                    aria-selected={navItems[activeIndex] === r}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => handleSelect(r.slug, r.hubSlug)}
                    className={`w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 flex items-center justify-between gap-2 ${
                      navItems[activeIndex] === r ? 'bg-gray-100 dark:bg-gray-700' : ''
                    }`}
                  >
                    <span>{r.title}</span>
                    <span className="text-[10px] font-medium text-[#1a3a8a] dark:text-[#06b6d4] bg-[#1a3a8a]/5 dark:bg-[#06b6d4]/10 px-1.5 py-0.5 rounded flex-shrink-0">
                      {hubShortLabel(r.hubSlug)}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
