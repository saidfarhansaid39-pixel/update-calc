'use client'

import React, { useState, useEffect } from 'react'
import { Info } from 'lucide-react'
import { useCurrency } from '@/lib/context/CurrencyContext'

interface BiWeeklyToggleProps {
  monthlyPayment: number
  interestRate: number
  loanTerm: number
  loanBalance: number
}

export function BiWeeklyToggle({ monthlyPayment, interestRate, loanTerm, loanBalance }: BiWeeklyToggleProps) {
  const [enabled, setEnabled] = useState(false)
  const { currencySymbol } = useCurrency()

  useEffect(() => {
    try {
      const stored = localStorage.getItem('calculat_biweekly')
      if (stored === 'true') setEnabled(true)
    } catch {}
  }, [])

  const handleToggle = () => {
    const next = !enabled
    setEnabled(next)
    try { localStorage.setItem('calculat_biweekly', next.toString()) } catch {}
  }

  const mr = interestRate / 100 / 12
  const standardMonths = loanTerm * 12
  const biweeklyPayment = monthlyPayment / 2
  const biweeklyPeriods = loanTerm * 26
  const annualBiweekly = biweeklyPayment * 26
  const annualMonthly = monthlyPayment * 12
  const extraAnnual = annualBiweekly - annualMonthly

  let biweeklyMonths = standardMonths
  let totalBiweeklyInterest = 0
  if (mr > 0 && extraAnnual > 0) {
    let balance = loanBalance
    let totalInt = 0
    let months = 0
    const extraPerMonth = extraAnnual / 12
    while (balance > 0 && months < 600) {
      const interest = balance * mr
      let principalPortion = monthlyPayment - interest + extraPerMonth
      if (principalPortion > balance) principalPortion = balance
      balance -= principalPortion
      totalInt += interest
      months++
      if (balance < 0) balance = 0
    }
    biweeklyMonths = months
    totalBiweeklyInterest = totalInt
  } else if (mr > 0) {
    let balance = loanBalance
    let totalInt = 0
    for (let m = 0; m < standardMonths; m++) {
      const interest = balance * mr
      const principalPortion = Math.min(monthlyPayment - interest, balance)
      balance -= principalPortion
      totalInt += interest
    }
    totalBiweeklyInterest = totalInt
  }

  const standardTotalInterest = mr > 0
    ? (monthlyPayment * standardMonths - loanBalance)
    : 0

  const interestSaved = Math.max(0, standardTotalInterest - totalBiweeklyInterest)
  const yearsReduced = Math.max(0, (standardMonths - biweeklyMonths) / 12)

  if (!enabled) {
    return (
      <div className="mt-2">
        <button
          type="button"
          onClick={handleToggle}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="w-8 h-4 rounded-full bg-gray-200 dark:bg-gray-600 relative">
            <span className="absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow-sm" />
          </span>
          Try Bi-Weekly Payments
        </button>
      </div>
    )
  }

  return (
    <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-green-700 dark:text-green-300">Bi-Weekly Payments</span>
          <Info className="w-3 h-3 text-green-400" />
        </div>
        <button
          type="button"
          onClick={handleToggle}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            enabled ? 'bg-[#1a3a8a]' : 'bg-gray-300 dark:bg-gray-600'
          }`}
          role="switch"
          aria-checked={enabled}
        >
          <span
            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${
              enabled ? 'translate-x-4' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      <p className="text-xs text-green-700 dark:text-green-300">
        Bi-weekly saves <strong className="font-semibold">{currencySymbol}{interestSaved.toFixed(0)}</strong> in interest
        {yearsReduced > 0 && (
          <> and cuts <strong className="font-semibold">{yearsReduced.toFixed(1)} years</strong> off your loan</>
        )}
      </p>
      <p className="text-[11px] text-green-600 dark:text-green-400 mt-0.5">
        Bi-Weekly Payment: {currencySymbol}{biweeklyPayment.toFixed(2)}
      </p>
    </div>
  )
}
