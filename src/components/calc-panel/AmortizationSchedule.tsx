'use client'

import React, { useState, useMemo } from 'react'
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react'
import { DynamicAmortizationChart } from '@/components/premium/DynamicCharts'

interface AmortizationRow {
  period: number
  date: string
  payment: number
  principal: number
  interest: number
  balance: number
}

interface YearSummary {
  year: number
  totalInterest: number
  totalPrincipal: number
  endingBalance: number
}

interface AmortizationScheduleProps {
  principal: number
  rate: number
  term: number
  periodsPerYear?: number
  extraPayment?: number
  monthlyFees?: number
  currencySymbol?: string
  startDate?: Date
}

function fmt(n: number, sym: string = '$') {
  return `${sym}${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function buildSchedule(
  principal: number,
  annualRate: number,
  termYears: number,
  periodsPerYear: number,
  extraPerPeriod: number,
  monthlyFees: number,
  startDate: Date
): { rows: AmortizationRow[]; years: YearSummary[]; payoffPeriods: number; totalInterest: number } {
  const periodicRate = annualRate / 100 / periodsPerYear
  const numPeriods = termYears * periodsPerYear
  const totalPeriods = Math.min(numPeriods, 600)

  let payment = 0
  if (periodicRate > 0 && numPeriods > 0 && principal > 0) {
    const factor = Math.pow(1 + periodicRate, numPeriods)
    payment = principal * (periodicRate * factor) / (factor - 1)
  } else if (numPeriods > 0 && principal > 0) {
    payment = principal / numPeriods
  }

  const rows: AmortizationRow[] = []
  const yearMap = new Map<number, YearSummary>()
  let balance = principal
  let totalInt = 0
  let period = 0

  while (balance > 0.005 && period < totalPeriods) {
    const interest = balance * periodicRate
    let princPortion = payment - interest + extraPerPeriod
    if (princPortion > balance) princPortion = balance
    balance -= princPortion
    totalInt += interest
    period++

    const d = new Date(startDate)
    d.setMonth(d.getMonth() + period)
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    const yearNum = Math.ceil(period / periodsPerYear)

    rows.push({
      period,
      date: dateStr,
      payment: payment + monthlyFees,
      principal: Math.max(0, princPortion),
      interest,
      balance: Math.max(0, balance),
    })

    if (!yearMap.has(yearNum)) {
      yearMap.set(yearNum, { year: yearNum, totalInterest: 0, totalPrincipal: 0, endingBalance: 0 })
    }
    const yr = yearMap.get(yearNum)!
    yr.totalInterest += interest
    yr.totalPrincipal += princPortion
    yr.endingBalance = Math.max(0, balance)
  }

  return {
    rows,
    years: Array.from(yearMap.values()),
    payoffPeriods: period,
    totalInterest: totalInt,
  }
}

export function AmortizationSchedule(props: AmortizationScheduleProps) {
  const {
    principal,
    rate,
    term,
    periodsPerYear = 12,
    extraPayment = 0,
    monthlyFees = 0,
    currencySymbol = '$',
    startDate = new Date(),
  } = props

  const [showMonthly, setShowMonthly] = useState(false)
  const extraPerPeriod = periodsPerYear === 26 ? extraPayment / 2 : extraPayment

  const schedule = useMemo(
    () => buildSchedule(principal, rate, term, periodsPerYear, extraPerPeriod, monthlyFees, startDate),
    [principal, rate, term, periodsPerYear, extraPerPeriod, monthlyFees, startDate]
  )

  if (principal <= 0 || rate < 0 || term <= 0) {
    return (
      <div className="w-full min-h-[80px] flex items-center justify-center text-xs text-gray-400 dark:text-gray-500">
        Enter loan details to see amortization schedule
      </div>
    )
  }

  const chartData = schedule.years.map(y => ({ year: y.year, balance: y.endingBalance }))
  const standardPeriods = term * periodsPerYear
  const paymentsSaved = Math.max(0, standardPeriods - schedule.payoffPeriods)
  const interestSaved = schedule.totalInterest // This is actual with extra; we need "without extra" too
  const monthlyPayment = schedule.rows[0]?.payment ?? 0
  const totalPaid = schedule.rows.reduce((s, r) => s + r.payment, 0)

  return (
    <div className="space-y-4">
      {/* Payoff summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400">Payoff Date</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">
            <Calendar size={14} className="text-[#06b6d4]" />
            {schedule.rows.length > 0 ? schedule.rows[schedule.rows.length - 1].date : '—'}
          </p>
        </div>
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400">Total Payments</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{schedule.payoffPeriods}</p>
        </div>
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400">Total Interest</p>
          <p className="text-sm font-bold text-[#d62828]">{fmt(schedule.totalInterest, currencySymbol)}</p>
        </div>
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400">Total Paid</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{fmt(totalPaid, currencySymbol)}</p>
        </div>
      </div>

      {/* Extra payments impact */}
      {extraPerPeriod > 0 && paymentsSaved > 0 && (
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
            Extra {fmt(extraPerPeriod, currencySymbol)}/{periodsPerYear === 26 ? '2wks' : 'mo'} saves you {paymentsSaved} payments and{' '}
            <strong>{fmt(interestSaved, currencySymbol)}</strong> in interest — payoff {Math.floor(paymentsSaved / periodsPerYear)}y {paymentsSaved % periodsPerYear}mo sooner
          </p>
        </div>
      )}

      {/* Amortization chart */}
      <DynamicAmortizationChart data={chartData} />

      {/* Yearly summary */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">Year-by-Year Summary</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="p-1.5 text-left font-medium text-gray-500">Year</th>
                <th className="p-1.5 text-right font-medium text-gray-500">Interest</th>
                <th className="p-1.5 text-right font-medium text-gray-500">Principal</th>
                <th className="p-1.5 text-right font-medium text-gray-500">Ending Balance</th>
              </tr>
            </thead>
            <tbody>
              {schedule.years.map((y) => (
                <tr key={y.year} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-1.5 text-left font-medium text-gray-700 dark:text-gray-300">{y.year}</td>
                  <td className="p-1.5 text-right text-gray-600 dark:text-gray-400">{fmt(y.totalInterest, currencySymbol)}</td>
                  <td className="p-1.5 text-right text-gray-600 dark:text-gray-400">{fmt(y.totalPrincipal, currencySymbol)}</td>
                  <td className="p-1.5 text-right font-medium text-gray-800 dark:text-gray-200">{fmt(y.endingBalance, currencySymbol)}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 dark:bg-gray-800/50 font-semibold border-t-2 border-gray-300 dark:border-gray-600">
                <td className="p-1.5 text-left text-gray-800 dark:text-gray-200">Total</td>
                <td className="p-1.5 text-right text-[#d62828]">{fmt(schedule.years.reduce((s, y) => s + y.totalInterest, 0), currencySymbol)}</td>
                <td className="p-1.5 text-right text-gray-800 dark:text-gray-200">{fmt(schedule.years.reduce((s, y) => s + y.totalPrincipal, 0), currencySymbol)}</td>
                <td className="p-1.5 text-right text-gray-400">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly detail (collapsible) */}
      <div>
        <button
          onClick={() => setShowMonthly(!showMonthly)}
          className="flex items-center gap-1 text-xs font-medium text-[#06b6d4] hover:text-[#1a759f] transition-colors"
        >
          {showMonthly ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {showMonthly ? 'Hide Monthly Details' : `Show Monthly Details (${schedule.rows.length} payments)`}
        </button>
        {showMonthly && (
          <div className="overflow-x-auto mt-2 max-h-[400px] overflow-y-auto">
            <table className="w-full text-xs border-collapse">
              <thead className="sticky top-0">
                <tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <th className="p-1 text-left font-medium text-gray-500">#</th>
                  <th className="p-1 text-left font-medium text-gray-500">Date</th>
                  <th className="p-1 text-right font-medium text-gray-500">Payment</th>
                  <th className="p-1 text-right font-medium text-gray-500">Principal</th>
                  <th className="p-1 text-right font-medium text-gray-500">Interest</th>
                  <th className="p-1 text-right font-medium text-gray-500">Balance</th>
                </tr>
              </thead>
              <tbody>
                {schedule.rows.map((r) => (
                  <tr key={r.period} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-1 text-left text-gray-400">{r.period}</td>
                    <td className="p-1 text-left text-gray-600 dark:text-gray-400">{r.date}</td>
                    <td className="p-1 text-right text-gray-700 dark:text-gray-300">{fmt(r.payment, currencySymbol)}</td>
                    <td className="p-1 text-right text-gray-600 dark:text-gray-400">{fmt(r.principal, currencySymbol)}</td>
                    <td className="p-1 text-right text-gray-600 dark:text-gray-400">{fmt(r.interest, currencySymbol)}</td>
                    <td className="p-1 text-right font-medium text-gray-800 dark:text-gray-200">{fmt(r.balance, currencySymbol)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
