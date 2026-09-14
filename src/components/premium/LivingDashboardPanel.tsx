'use client'

import React, { useMemo, useState, useEffect, useRef } from 'react'
import { useForm, FormProvider, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Home, Percent, Calendar, Shield, DollarSign, TrendingDown, Sparkles, Banknote, ArrowRight, Plus, Info } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { useCurrency } from '@/lib/context/CurrencyContext'

const schema = z.object({
  homePrice: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  downPayment: z.string().min(1, 'Required'),
  rate: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
  term: z.string().min(1, 'Required').refine(v => parseInt(v) >= 1, 'Min 1 year'),
  propertyTax: z.string().optional(),
  homeInsurance: z.string().optional(),
  pmiRate: z.string().optional(),
  hoa: z.string().optional(),
  extraPayment: z.string().optional(),
  frequency: z.string().optional(),
})

const DEFAULTS = {
  homePrice: '350000',
  downPayment: '70000',
  rate: '6.5',
  term: '30',
  propertyTax: '3500',
  homeInsurance: '1200',
  pmiRate: '0.5',
  hoa: '0',
  extraPayment: '0',
  frequency: 'monthly',
}

const ACCENT = '#1a3a8a'
const ACCENT_LIGHT = '#06b6d4'
const ACCENT_GRADIENT = 'from-[#1a3a8a] to-[#06b6d4]'

function computeMortgage(vals: Record<string, string>) {
  const n = (v: string | undefined) => { const p = parseFloat(v || '0'); return isNaN(p) ? 0 : p }
  const price = n(vals.homePrice)
  const down = n(vals.downPayment)
  const principal = price - down
  const rate = n(vals.rate)
  const term = n(vals.term)
  const propertyTax = n(vals.propertyTax)
  const homeInsurance = n(vals.homeInsurance)
  const pmiRate = n(vals.pmiRate)
  const hoa = n(vals.hoa)
  const extraPayment = n(vals.extraPayment)
  const freq = vals.frequency || 'monthly'
  const isBiweekly = freq === 'biweekly' || freq === 'accelerated'
  const periodsPerYear = isBiweekly ? 26 : 12
  const periodicRate = rate / 100 / periodsPerYear
  const numPeriods = term * periodsPerYear
  let periodicPayment = 0
  if (periodicRate > 0 && numPeriods > 0 && principal > 0) {
    const factor = Math.pow(1 + periodicRate, numPeriods)
    periodicPayment = principal * (periodicRate * factor) / (factor - 1)
  } else if (numPeriods > 0 && principal > 0) {
    periodicPayment = principal / numPeriods
  }
  const totalPayment = periodicPayment * numPeriods
  const totalInterest = totalPayment - principal
  const monthlyTax = propertyTax / 12
  const monthlyInsurance = homeInsurance / 12
  const monthlyPMI = pmiRate > 0 ? (principal * (pmiRate / 100)) / 12 : 0
  const monthlyPITI = monthlyTax + monthlyInsurance + monthlyPMI + hoa
  const annualPaymentTotal = periodicPayment * periodsPerYear
  const monthlyEquivalent = annualPaymentTotal / 12
  const totalMonthly = monthlyEquivalent + monthlyPITI + extraPayment
  const downPct = price > 0 ? (down / price) * 100 : 0

  let payoffPeriods = numPeriods
  let totalWithExtra = totalPayment
  const extraPerPeriod = isBiweekly ? extraPayment / 2 : extraPayment
  if (extraPerPeriod > 0 && periodicRate >= 0) {
    let balance = principal; let totalInt = 0; let count = 0
    while (balance > 0 && count < 600) {
      const interest = balance * periodicRate
      let princPortion = periodicPayment - interest + extraPerPeriod
      if (princPortion > balance) princPortion = balance
      balance -= princPortion; totalInt += interest; count++
      if (balance < 0) balance = 0
    }
    payoffPeriods = count; totalWithExtra = principal + totalInt
  }

  const sensitivityData = []
  const baseRate = rate
  for (let r = Math.max(0.5, baseRate - 2); r <= baseRate + 2; r += 0.5) {
    const mr = r / 100 / 12
    const np = term * 12
    let p = 0
    if (mr > 0 && np > 0 && principal > 0) {
      const f = Math.pow(1 + mr, np)
      p = principal * (mr * f) / (f - 1)
    }
    sensitivityData.push({ rate: r, payment: Math.round(p * 100) / 100 })
  }

  return {
    monthlyPayment: periodicPayment,
    totalMonthly,
    principal,
    totalInterest,
    downPct,
    monthlyTax,
    monthlyInsurance,
    monthlyPMI,
    hoa,
    monthlyPITI,
    down,
    price,
    rate,
    term,
    extraPayment,
    isBiweekly,
    payoffPeriods,
    totalWithExtra,
    monthsSaved: extraPerPeriod > 0 ? numPeriods - payoffPeriods : 0,
    interestSaved: extraPerPeriod > 0 ? totalPayment - totalWithExtra : 0,
    sensitivityData,
    loanToValue: price > 0 ? (principal / price) * 100 : 0,
  }
}

function AnimatedCounter({ value, prefix = '$', decimals = 0 }: { value: number; prefix?: string; decimals?: number }) {
  const [display, setDisplay] = useState(value)
  const ref = useRef<number>(value)
  useEffect(() => {
    const start = ref.current
    if (Math.abs(value - start) < 0.5) { setDisplay(value); ref.current = value; return }
    const diff = value - start
    const startTime = performance.now()
    let raf: number
    function animate(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / 600, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      ref.current = start + diff * eased
      setDisplay(ref.current)
      if (progress < 1) raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [value])
  return <>{prefix}{display.toFixed(decimals)}</>
}

function useFloatingLabel(focused: boolean, filled: boolean) {
  return focused || filled ? 'text-xs -translate-y-5' : 'text-sm translate-y-0'
}

function GlassField({ label, placeholder, prefix, ...props }: {
  label: string; placeholder?: string; prefix?: string
}) {
  const [focused, setFocused] = useState(false)
  const inputId = (props as any).name as string | undefined
  const hasValue = (props as any).value !== undefined && (props as any).value !== ''
  return (
    <div className="relative">
      <label
        htmlFor={inputId}
        className={`absolute left-3 top-3.5 text-gray-400 pointer-events-none transition-all duration-200 bg-white dark:bg-gray-800 px-1 z-10 ${focused || hasValue ? 'text-xs -translate-y-5 text-[#06b6d4]' : 'text-sm translate-y-0'}`}
      >
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium z-10">{prefix}</span>
        )}
        <input
          id={inputId}
          placeholder={focused ? '' : placeholder || ''}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full h-12 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 outline-none
            ${focused ? 'border-[#06b6d4] ring-2 ring-[#06b6d4]/20 shadow-sm' : 'border-gray-200 dark:border-gray-600'}
            ${prefix ? 'pl-8 pr-4' : 'px-4'} py-3 text-sm`}
          {...props}
        />
      </div>
    </div>
  )
}

export function LivingMortgageDashboard() {
  const { locale } = useCurrency()
  const form = useForm({ defaultValues: DEFAULTS, resolver: zodResolver(schema) })
  const vals = useWatch({ control: form.control })
  const [expertOpen, setExpertOpen] = useState(false)

  const result = useMemo(() => computeMortgage(vals as Record<string, string>), [vals.homePrice, vals.downPayment, vals.rate, vals.term, vals.propertyTax, vals.homeInsurance, vals.pmiRate, vals.hoa, vals.extraPayment, vals.frequency])

  const insight = useMemo(() => {
    if (!result.monthlyPayment || !result.rate) return ''
    const totalCost = result.totalMonthly * 12 * result.term
    const altRate = result.rate + 1
    const mr = altRate / 100 / 12
    const np = result.term * 12
    const f = Math.pow(1 + mr, np)
    const altPayment = result.principal * (mr * f) / (f - 1)
    const altTotal = (altPayment * np) + (result.monthlyPITI * 12 * result.term)
    const diff = Math.round(altTotal - totalCost)
    return `At ${result.rate}% over ${result.term} years, your monthly payment is $${Math.round(result.monthlyPayment)} — that's $${diff.toLocaleString()} less in total than at ${altRate}%.`
  }, [result])

  const fcurr = (v: number) => new Intl.NumberFormat(locale || 'en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v)

  return (
    <FormProvider {...form}>
      <div className="space-y-6" suppressHydrationWarning>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl border border-white/30 dark:border-gray-700/30 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Home className="w-4 h-4 text-[#1a3a8a]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Property Details</span>
              </div>
              <div className="space-y-3">
                <GlassField label="Home Price" placeholder="e.g. 350000" prefix="$" {...form.register('homePrice')} />
                <GlassField label="Down Payment" placeholder="e.g. 70000" prefix="$" {...form.register('downPayment')} />
                <div className="grid grid-cols-2 gap-3">
                  <GlassField label="Interest Rate" placeholder="e.g. 6.5" prefix="%" {...form.register('rate')} />
                  <GlassField label="Loan Term" placeholder="e.g. 30" {...form.register('term')} />
                </div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl border border-white/30 dark:border-gray-700/30 p-5 shadow-sm">
              <button
                type="button"
                onClick={() => setExpertOpen(!expertOpen)}
                className="flex items-center justify-between w-full"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#06b6d4]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Additional Costs</span>
                </div>
                <span className={`text-xs text-[#06b6d4] font-medium transition-transform ${expertOpen ? 'rotate-45' : ''}`}>
                  <Plus className="w-3.5 h-3.5" />
                </span>
              </button>
              {expertOpen && (
                <div className="mt-4 space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <GlassField label="Annual Property Tax" prefix="$" {...form.register('propertyTax')} />
                  <GlassField label="Annual Insurance" prefix="$" {...form.register('homeInsurance')} />
                  <GlassField label="PMI Rate" prefix="%" {...form.register('pmiRate')} />
                  <GlassField label="Monthly HOA" prefix="$" {...form.register('hoa')} />
                  <GlassField label="Extra Payment" prefix="$" {...form.register('extraPayment')} />
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#06b6d4]/5 to-transparent rounded-full -mr-10 -mt-10 pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Monthly Payment</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gradient-to-r from-[#06b6d4]/10 to-[#1a3a8a]/10 text-[#1a3a8a] dark:text-[#06b6d4] border border-[#06b6d4]/20">Principal & Interest</span>
                </div>
                <div className="text-5xl sm:text-6xl font-bold tracking-tight bg-gradient-to-b from-[#1a3a8a] to-[#06b6d4] bg-clip-text text-transparent">
                  <AnimatedCounter value={result.monthlyPayment} decimals={0} />
                  <span className="text-2xl text-gray-400 font-normal ml-1">/mo</span>
                </div>

                <div className="mt-4 h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={result.sensitivityData}>
                      <defs>
                        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="rate" hide />
                      <YAxis hide domain={['dataMin - 50', 'dataMax + 50']} />
                      <Tooltip
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                        formatter={(v: number) => [`$${Math.round(v)}`, 'Payment']}
                        labelFormatter={(v: number) => `${v}% rate`}
                      />
                      <Area type="monotone" dataKey="payment" stroke="#06b6d4" strokeWidth={2} fill="url(#sparkGrad)" dot={false} activeDot={{ r: 4, fill: '#1a3a8a', stroke: '#fff', strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[10px] text-gray-400 mt-1 text-right">Payment sensitivity by interest rate</p>
              </div>
            </div>

            {insight && (
              <div className="flex items-start gap-2 rounded-xl bg-gradient-to-r from-[#1a3a8a]/5 to-[#06b6d4]/5 border border-[#06b6d4]/10 p-3">
                <Info className="w-4 h-4 text-[#06b6d4] mt-0.5 shrink-0" />
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{insight}</p>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <ResultCard icon={Banknote} label="Total Monthly" value={fcurr(result.totalMonthly)} accent={ACCENT} />
              <ResultCard icon={TrendingDown} label="Total Interest" value={fcurr(result.totalInterest)} accent="#d62828" />
              <ResultCard icon={Percent} label="Down Payment" value={`${result.downPct.toFixed(0)}%`} sub={fcurr(result.down)} accent={ACCENT_LIGHT} />
              <ResultCard icon={Shield} label="Loan-to-Value" value={`${result.loanToValue.toFixed(0)}%`} sub={fcurr(result.principal)} accent={ACCENT} />
            </div>

            {result.extraPayment > 0 && (
              <div className="rounded-xl bg-gradient-to-r from-amber-50 to-amber-50/50 dark:from-amber-900/10 dark:to-amber-900/5 border border-amber-200/50 dark:border-amber-700/30 p-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                    Extra ${result.extraPayment}/mo saves {result.interestSaved > 0 ? `$${Math.round(result.interestSaved).toLocaleString()} in interest` : 'interest'} and {result.monthsSaved > 0 ? `cuts ${result.monthsSaved} payments` : 'shortens your term'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  )
}

function ResultCard({ icon: Icon, label, value, sub, accent }: {
  icon: React.ComponentType<{ className?: string }>
  label: string; value: string; sub?: string; accent: string
}) {
  return (
    <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 hover:shadow-sm transition-shadow duration-200">
      <div className="flex items-center gap-2 mb-1.5">
        <div style={{ color: accent }}><Icon className="w-3.5 h-3.5" /></div>
        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-base font-bold" style={{ color: accent }}>
        {value}
      </p>
      {sub && (
        <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
      )}
    </div>
  )
}
