'use client'

import dynamic from 'next/dynamic'

const SearchBarInner = dynamic(() => import('@/components/SearchBar').then(mod => ({ default: mod.SearchBar })), {
  loading: () => <div className="h-[52px] rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />,
  ssr: false,
})

export function SearchBarWrapper() {
  return <SearchBarInner />
}
