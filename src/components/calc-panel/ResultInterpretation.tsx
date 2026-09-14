'use client'

import React from 'react'
import { Lightbulb, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react'

interface ResultInterpretationProps {
  type: 'loan' | 'mortgage' | 'investment' | 'retirement' | 'debt' | 'tax' | 'budget' | 'savings' | 'salary' | 'social_security'
  values: Record<string, number | string>
  currencySymbol?: string
}

function fmt(n: number, sym: string = '$') {
  return `${sym}${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function pct(n: number) {
  return `${n.toFixed(1)}%`
}

export function ResultInterpretation({ type, values, currencySymbol = '$' }: ResultInterpretationProps) {
  const insights: { icon: React.ReactNode; text: string; color: string }[] = []
  const v = values as Record<string, number>

  switch (type) {
    case 'mortgage':
    case 'loan': {
      const monthly = v.monthlyPayment || 0
      const totalInterest = v.totalInterest || 0
      const totalPayments = v.totalPayments || 0
      const principal = v.principal || v.loanAmount || 0
      const rate = v.rate || 0
      const term = v.term || 30
      const downPct = v.downPaymentPct || 0
      const extraPayment = v.extraPayment || 0

      if (principal > 0 && totalInterest > 0) {
        const interestPct = (totalInterest / principal) * 100
        insights.push({
          icon: <TrendingDown size={16} />,
          text: `Total interest of ${fmt(totalInterest, currencySymbol)} represents ${pct(interestPct)} of your loan amount — over ${term} years at ${pct(rate)} APR.`,
          color: 'text-blue-600 dark:text-blue-400',
        })
      }
      if (monthly > 0 && principal > 0) {
        const monthlyPct = (monthly / principal) * 100 * 12
        insights.push({
          icon: <Lightbulb size={16} />,
          text: `Your monthly payment of ${fmt(monthly, currencySymbol)} is ${pct(monthlyPct)} of the loan principal per year.`,
          color: 'text-amber-600 dark:text-amber-400',
        })
      }
      if (downPct > 0 && downPct < 20) {
        insights.push({
          icon: <AlertTriangle size={16} />,
          text: `Down payment of ${pct(downPct)} is below 20% — you may need PMI insurance (typically 0.3-1.9% of loan annually).`,
          color: 'text-red-600 dark:text-red-400',
        })
      }
      if (extraPayment > 0) {
        insights.push({
          icon: <TrendingUp size={16} />,
          text: `Extra ${fmt(extraPayment, currencySymbol)}/month accelerates payoff and reduces total interest significantly.`,
          color: 'text-emerald-600 dark:text-emerald-400',
        })
      }
      if (rate > 0) {
        const monthlyRate = rate / 12
        const firstYearInterest = principal * (monthlyRate / 100)
        const firstYearPct = monthly > 0 ? (firstYearInterest / (monthly * 12)) * 100 : 0
        if (firstYearPct > 50) {
          insights.push({
            icon: <AlertTriangle size={16} />,
            text: `In year 1, approximately ${pct(firstYearPct)} of your payments go toward interest — this decreases over time as principal is paid down.`,
            color: 'text-orange-600 dark:text-orange-400',
          })
        }
      }
      break
    }

    case 'investment': {
      const futureValue = v.futureValue || 0
      const totalContributions = v.totalContributions || 0
      const totalInterest = v.totalInterest || 0
      const rate = v.rate || 0
      const years = v.years || 0

      if (futureValue > 0 && totalContributions > 0) {
        const multiple = futureValue / totalContributions
        insights.push({
          icon: <TrendingUp size={16} />,
          text: `Your ${fmt(totalContributions, currencySymbol)} investment grows to ${fmt(futureValue, currencySymbol)} — a ${multiple.toFixed(2)}x return over ${years} years.`,
          color: 'text-emerald-600 dark:text-emerald-400',
        })
      }
      if (totalInterest > 0 && totalContributions > 0) {
        const interestPct = (totalInterest / futureValue) * 100
        insights.push({
          icon: <Lightbulb size={16} />,
          text: `Compound interest generates ${fmt(totalInterest, currencySymbol)}, which is ${pct(interestPct)} of your final portfolio value.`,
          color: 'text-blue-600 dark:text-blue-400',
        })
      }
      if (rate > 5) {
        insights.push({
          icon: <AlertTriangle size={16} />,
          text: `Assumed return of ${pct(rate)} is above historical market averages (7-10% before inflation). Consider using a more conservative rate.`,
          color: 'text-amber-600 dark:text-amber-400',
        })
      }
      break
    }

    case 'retirement': {
      const futureValue = v.futureValue || 0
      const monthly = v.monthly || 0
      const currentAge = v.currentAge || 30
      const retirementAge = v.retirementAge || 65
      const yearsToRetire = Math.max(0, retirementAge - currentAge)
      const monthlyDraw = v.monthlyDraw || futureValue * 0.04 / 12

      if (futureValue > 0 && yearsToRetire > 0) {
        insights.push({
          icon: <TrendingUp size={16} />,
          text: `By age ${retirementAge}, your savings grow to ${fmt(futureValue, currencySymbol)} — over ${yearsToRetire} years of growth.`,
          color: 'text-emerald-600 dark:text-emerald-400',
        })
      }
      if (monthlyDraw > 0) {
        insights.push({
          icon: <Lightbulb size={16} />,
          text: `Using the 4% rule, you can withdraw approximately ${fmt(monthlyDraw, currencySymbol)}/month in retirement.`,
          color: 'text-blue-600 dark:text-blue-400',
        })
      }
      break
    }

    case 'debt': {
      const balance = v.balance || 0
      const rate = v.rate || 0
      const monthly = v.monthly || 0
      const totalInterest = v.totalInterest || 0

      if (monthly > 0 && balance > 0) {
        const monthsToPayoff = Math.ceil(balance / monthly)
        insights.push({
          icon: <TrendingDown size={16} />,
          text: `At ${fmt(monthly, currencySymbol)}/month, you'll pay off ${fmt(balance, currencySymbol)} in ~${monthsToPayoff} months (${(monthsToPayoff / 12).toFixed(1)} years).`,
          color: 'text-blue-600 dark:text-blue-400',
        })
      }
      if (totalInterest > 0) {
        insights.push({
          icon: <AlertTriangle size={16} />,
          text: `You'll pay ${fmt(totalInterest, currencySymbol)} in interest — ${rate > 10 ? 'consider a consolidation loan at a lower rate.' : 'making extra payments can reduce this significantly.'}`,
          color: rate > 10 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400',
        })
      }
      break
    }

    case 'savings': {
      const goal = v.goal || 0
      const current = v.current || 0
      const monthly = v.monthly || 0
      const years = v.years || 0

      if (goal > 0 && monthly > 0) {
        const monthsNeeded = Math.ceil((goal - current) / monthly)
        insights.push({
          icon: <TrendingUp size={16} />,
          text: `Saving ${fmt(monthly, currencySymbol)}/month, you'll reach your goal of ${fmt(goal, currencySymbol)} in ~${monthsNeeded} months (${(monthsNeeded / 12).toFixed(1)} years).`,
          color: 'text-emerald-600 dark:text-emerald-400',
        })
      }
      break
    }

    case 'tax': {
      const income = v.income || 0
      const taxOwed = v.taxOwed || 0
      const fedWithheld = v.fedWithheld || 0
      const effectiveRate = v.effectiveRate || 0
      const isRefund = fedWithheld > taxOwed
      const difference = Math.abs(fedWithheld - taxOwed)

      if (income > 0 && effectiveRate > 0) {
        insights.push({
          icon: <Lightbulb size={16} />,
          text: `Your effective tax rate is ${pct(effectiveRate)} on ${fmt(income, currencySymbol)} of income.`,
          color: 'text-blue-600 dark:text-blue-400',
        })
      }
      if (isRefund && difference > 0) {
        insights.push({
          icon: <TrendingUp size={16} />,
          text: `You overpaid by ${fmt(difference, currencySymbol)} — consider adjusting your W-4 withholding.`,
          color: 'text-emerald-600 dark:text-emerald-400',
        })
      } else if (!isRefund && difference > 0) {
        insights.push({
          icon: <AlertTriangle size={16} />,
          text: `You owe ${fmt(difference, currencySymbol)} — consider increasing withholding to avoid a penalty.`,
          color: 'text-amber-600 dark:text-amber-400',
        })
      }
      break
    }

    case 'salary': {
      const hourly = v.hourly || 0
      const monthly = v.monthly || 0
      const annual = v.annual || 0

      if (annual > 0 && hourly > 0) {
        insights.push({
          icon: <Lightbulb size={16} />,
          text: `Annual salary of ${fmt(annual, currencySymbol)} equates to ${fmt(hourly, currencySymbol)}/hour based on standard full-time hours.`,
          color: 'text-blue-600 dark:text-blue-400',
        })
      }
      if (monthly > 0) {
        insights.push({
          icon: <TrendingUp size={16} />,
          text: `Your monthly pre-tax income is ${fmt(monthly, currencySymbol)}.`,
          color: 'text-emerald-600 dark:text-emerald-400',
        })
      }
      break
    }

    case 'social_security': {
      const bestAge = v.bestAge || 0
      const lifeExpectancy = v.lifeExpectancy || 0
      const monthlyBenefit = v.monthlyBenefit || 0

      if (bestAge > 0) {
        insights.push({
          icon: <Lightbulb size={16} />,
          text: `The optimal claiming age is ${bestAge}, maximizing lifetime benefits based on a life expectancy of ${lifeExpectancy}.`,
          color: 'text-blue-600 dark:text-blue-400',
        })
      }
      if (monthlyBenefit > 0) {
        insights.push({
          icon: <TrendingUp size={16} />,
          text: `Your estimated monthly benefit is ${fmt(monthlyBenefit, currencySymbol)}.`,
          color: 'text-emerald-600 dark:text-emerald-400',
        })
      }
      break
    }

    case 'budget': {
      const income = v.income || 0
      const needs = v.needs || 0
      const wants = v.wants || 0
      const savings = v.savings || 0

      if (income > 0) {
        const needsPct = (needs / income) * 100
        const wantsPct = (wants / income) * 100
        const savingsPct = (savings / income) * 100

        if (needsPct > 50) {
          insights.push({
            icon: <AlertTriangle size={16} />,
            text: `${pct(needsPct)} of income goes to needs — above the 50% guideline. Consider reducing fixed expenses.`,
            color: 'text-red-600 dark:text-red-400',
          })
        } else {
          insights.push({
            icon: <Lightbulb size={16} />,
            text: `${pct(needsPct)} of income goes to needs — within the recommended 50% guideline.`,
            color: 'text-emerald-600 dark:text-emerald-400',
          })
        }
        if (savingsPct < 20) {
          insights.push({
            icon: <TrendingUp size={16} />,
            text: `${pct(savingsPct)} savings rate is below the 20% target. Consider redirecting some wants spending.`,
            color: 'text-amber-600 dark:text-amber-400',
          })
        }
      }
      break
    }
  }

  if (insights.length === 0) return null

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1">
        <Lightbulb size={14} />
        Key Insights
      </p>
      {insights.map((item, i) => (
        <div key={i} className={`flex items-start gap-2 p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 ${item.color}`}>
          <span className="mt-0.5 flex-shrink-0">{item.icon}</span>
          <p className="text-xs leading-relaxed">{item.text}</p>
        </div>
      ))}
    </div>
  )
}
