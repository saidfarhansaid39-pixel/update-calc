'use client'

import React, { useEffect, useRef, useState } from 'react'

interface AnimatedResultValueProps {
  value: string | number | React.ReactNode
  label?: string
  unit?: string
  className?: string
}

export function AnimatedResultValue({ value, label, unit, className = '' }: AnimatedResultValueProps) {
  const prevRef = useRef<string>('')
  const [pulsing, setPulsing] = useState(false)
  const current = String(value ?? '')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (prevRef.current && prevRef.current !== current) {
      setPulsing(true)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setPulsing(false), 600)
    }
    prevRef.current = current
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [current])

  return (
    <div className={`${className}`}>
      {label && <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>}
      <div className={`text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300 ${
        pulsing ? 'text-[#06b6d4] dark:text-[#0a1d4f]' : ''
      }`}>
        <span className={`inline-block transition-transform duration-300 ${pulsing ? 'scale-105' : 'scale-100'}`}>
          {value ?? '—'}
          {unit && <span className="text-lg sm:text-xl font-normal text-gray-500 dark:text-gray-400 ml-1.5">{unit}</span>}
        </span>
      </div>
    </div>
  )
}
