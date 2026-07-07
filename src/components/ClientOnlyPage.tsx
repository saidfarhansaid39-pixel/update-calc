'use client'

import { useEffect, useState, type ReactNode } from 'react'

export function ClientOnlyPage({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return <div className="min-h-screen bg-white dark:bg-gray-900" />
  return <>{children}</>
}
