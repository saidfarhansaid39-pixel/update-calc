'use client'

import React, { useMemo, useCallback, useState } from 'react'
import { useForm, FormProvider, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CalculatorFormField } from '@/components/forms/CalculatorFormField'
import { CalculatorSlider } from '@/components/forms/CalculatorSlider'
import { UnitToggle } from '@/components/forms/UnitToggle'
import { PremiumCalculatorShell } from '@/components/premium/PremiumCalculatorShell.dynamic'
import type { UnitSystem } from '@/components/premium/PremiumCalculatorShell'
import { ModeFieldGroup } from '@/components/premium/ModeFieldGroup'
import { getFinFormula, finSlugOverrides } from '@/lib/seo/formula-generator'
import { DynamicLoanDonutChart as LoanDonutChart, DynamicInvestmentGrowthChart as InvestmentGrowthChart, DynamicAmortizationChart as AmortizationChart, DynamicComparisonBarChart as ComparisonBarChart } from '@/components/premium/DynamicCharts'
import { loanSchema, investmentSchema, mortgageSchema, retirementSchema } from '@/lib/forms/schemas'

type CalcType =
  | 'loan' | 'investment' | 'mortgage' | 'retirement' | 'salary' | 'tax' | 'budget' | 'debt'
  | 'simpleInterest' | 'apyCalc' | 'aprCalc' | 'futureValue' | 'presentValue'
  | 'roi' | 'npv' | 'irr' | 'paybackPeriod' | 'breakEven'
  | 'bondYield' | 'bondPrice' | 'couponPayment' | 'taxEquivalentYield'
  | 'dividendYield' | 'dividendPayout' | 'eps' | 'pe' | 'pb' | 'ps' | 'peg'
  | 'dividendGrowthRate' | 'payoutRatio' | 'retentionRatio'
  | 'stockAverageCost' | 'costBasis' | 'dollarCostAveraging'
  | 'portfolioReturn' | 'sharpeRatio' | 'sortinoRatio' | 'alpha' | 'beta' | 'rSquared' | 'valueAtRisk'
  | 'dti' | 'ltv' | 'dscr' | 'interestCoverage' | 'fixedChargeCoverage' | 'tie'
  | 'workingCapital' | 'currentRatio' | 'quickRatio' | 'cashRatio'
  | 'inventoryTurnover' | 'assetTurnover' | 'roa' | 'roe'
  | 'debtToAsset' | 'debtToEquity'
  | 'rentVsBuy' | 'houseAffordability' | 'closingCosts' | 'rentalIncome' | 'capRate' | 'cashOnCash' | 'noiCalc' | 'roiRental'
  | 'incomeTax' | 'taxBracket' | 'marginalTaxRate' | 'effectiveTaxRate'
  | 'capitalGainsTax' | 'dividendTax' | 'selfEmploymentTax'
  | 'salesTax' | 'vat' | 'estateTax'
  | 'taxRefundEstimator' | 'itemizedVsStandardDeduction' | 'amt'
  | 'cryptoProfit' | 'cryptoMining' | 'cryptoStaking' | 'impermanentLoss' | 'cryptoTax'
  | 'lifeInsurance' | 'termVsWholeLife' | 'disability'
  | 'creditUtilization' | 'creditScore' | 'balanceTransfer'
  | 'emergencyFund' | 'sinkingFund' | 'savingsGoal' | 'collegeSavings' | 'netWorth'
  | 'debtSnowball' | 'debtAvalanche' | 'debtPayoffPlan' | 'debtConsolidationSavings'
  | 'pension' | 'socialSecurity' | 'annuity' | 'safeWithdrawalRate' | 'rmd'
  | 'businessValuation' | 'startupCosts' | 'runway' | 'burnRate'
  | 'cac' | 'ltvCalc' | 'ltvCacRatio' | 'churnRate' | 'mrr' | 'arr'
  | 'unitEconomics' | 'contributionMargin' | 'operatingLeverage' | 'financialLeverage'
  | 'grossProfit' | 'netProfit' | 'profitMargin' | 'costVolumeProfit' | 'markupCalc'
  | 'carAffordability' | 'childCare' | 'petExpense'
  | 'fiftyThirtyTwenty' | 'zeroBasedBudget' | 'envelopeSystem' | 'payYourselfFirst'
  | 'weddingBudget' | 'vacationBudget' | 'holidayBudget' | 'groceryBudget'
  | 'monthlyBudget' | 'annualBudget'
  | 'homeInsurance' | 'autoInsurance' | 'healthInsuranceComparison' | 'deductibleVsPremium' | 'outOfPocketMaximum'
  | 'propertyTaxDeduction' | 'giftTax' | 'inheritanceTax' | 'sideHustleTax' | 'gigEconomyTax' | 'interestIncomeTax' | 'rentalIncomeTax'
  | 'amortization' | 'loanComparison' | 'biweeklyPayment'

const calcTypeMap: Record<string, CalcType> = {
  '401k-calculator': 'pension',
  'amortization-calculator': 'amortization',
  'annuity-payout-calculator': 'annuity',
  'auto-loan-calculator': 'loan',
  'boat-loan-calculator': 'loan',
  'compound-interest-calculator': 'investment',
  'credit-card-payoff-calculator': 'debt',
  'currency-calculator': 'loan',
  'debt-consolidation-calculator': 'loan',
  'debt-payoff-calculator': 'debt',
  'estate-tax-calculator': 'estateTax',
  'fha-loan-calculator': 'mortgage',
  'home-equity-loan-calculator': 'loan',
  'house-affordability-calculator': 'houseAffordability',
  'income-tax-calculator': 'incomeTax',
  'interest-rate-calculator': 'aprCalc',
  'investment-calculator': 'investment',
  'loan-calculator': 'loan',
  'mortgage-calculator': 'mortgage',
  'mortgage-payoff-calculator': 'mortgage',
  'payment-calculator': 'loan',
  'personal-loan-calculator': 'loan',
  'refinance-calculator': 'loan',
  'rent-calculator': 'loan',
  'rent-vs-buy-calculator': 'rentVsBuy',
  'retirement-calculator': 'retirement',
  'salary-calculator': 'salary',
  'social-security-calculator': 'socialSecurity',
  'student-loan-calculator': 'loan',
  'va-mortgage-calculator': 'mortgage',
  'simple-interest-calculator': 'simpleInterest',
  'apy-calculator': 'apyCalc',
  'apr-calculator': 'aprCalc',
  'rule-of-72-calculator': 'apyCalc',
  'doubling-time-calculator-finance': 'apyCalc',
  'present-value-calculator': 'presentValue',
  'future-value-calculator': 'futureValue',
  'npv-calculator': 'npv',
  'irr-calculator': 'irr',
  'payback-period-calculator': 'paybackPeriod',
  'roi-calculator': 'roi',
  'profit-margin-calculator': 'profitMargin',
  'gross-profit-calculator': 'grossProfit',
  'net-profit-calculator': 'netProfit',
  'break-even-analysis': 'breakEven',
  'cost-volume-profit': 'costVolumeProfit',
  'debt-to-income-ratio': 'dti',
  'credit-utilization-calculator': 'creditUtilization',
  'credit-score-estimator': 'creditScore',
  'loan-to-value-ratio': 'ltv',
  'debt-service-coverage': 'dscr',
  'interest-coverage-ratio': 'interestCoverage',
  'fixed-charge-coverage': 'fixedChargeCoverage',
  'times-interest-earned': 'tie',
  'working-capital-calculator': 'workingCapital',
  'current-ratio-calculator': 'currentRatio',
  'quick-ratio-calculator': 'quickRatio',
  'cash-ratio-calculator': 'cashRatio',
  'inventory-turnover-calculator': 'inventoryTurnover',
  'asset-turnover-calculator': 'assetTurnover',
  'return-on-assets': 'roa',
  'return-on-equity': 'roe',
  'earnings-per-share': 'eps',
  'price-to-earnings': 'pe',
  'dividend-yield-calculator': 'dividendYield',
  'dividend-payout-ratio': 'dividendPayout',
  'bond-yield-calculator': 'bondYield',
  'bond-price-calculator': 'bondPrice',
  'coupon-payment-calculator': 'couponPayment',
  'tax-equivalent-yield': 'taxEquivalentYield',
  'capital-gains-calculator': 'capitalGainsTax',
  'cost-basis-calculator': 'costBasis',
  'stock-average-cost': 'stockAverageCost',
  'dollar-cost-averaging': 'dollarCostAveraging',
  'portfolio-return-calculator': 'portfolioReturn',
  'sharpe-ratio-calculator': 'sharpeRatio',
  'sortino-ratio-calculator': 'sortinoRatio',
  'alpha-calculator': 'alpha',
  'beta-calculator': 'beta',
  'r-squared-calculator': 'rSquared',
  'value-at-risk-calculator': 'valueAtRisk',
  'basic-loan-1': 'loan',
  'advanced-mortgage-1': 'mortgage',
  'pro-investment-1': 'investment',
  'professional-retirement-1': 'retirement',
  'ultimate-savings-1': 'savingsGoal',
  'premium-budget-1': 'budget',
  'standard-debt-1': 'debt',
  'deluxe-tax-1': 'incomeTax',
  'basic-insurance-1': 'lifeInsurance',
  'advanced-credit-1': 'creditScore',
  'pro-loan-2': 'loan',
  'professional-mortgage-2': 'mortgage',
  'ultimate-investment-2': 'investment',
  'premium-retirement-2': 'retirement',
  'standard-savings-2': 'savingsGoal',
  'deluxe-budget-2': 'budget',
  'basic-debt-2': 'debt',
  'advanced-tax-2': 'incomeTax',
  'pro-insurance-2': 'lifeInsurance',
  'professional-credit-2': 'creditScore',
  'ultimate-loan-3': 'loan',
  'premium-mortgage-3': 'mortgage',
  'standard-investment-3': 'investment',
  'deluxe-retirement-3': 'retirement',
  'basic-savings-3': 'savingsGoal',
  'advanced-budget-3': 'budget',
  'pro-debt-3': 'debt',
  'professional-tax-3': 'incomeTax',
  'ultimate-insurance-3': 'lifeInsurance',
  'premium-credit-3': 'creditScore',
  'standard-loan-4': 'loan',
  'deluxe-mortgage-4': 'mortgage',
  'basic-investment-4': 'investment',
  'advanced-retirement-4': 'retirement',
  'pro-savings-4': 'savingsGoal',
  'professional-budget-4': 'budget',
  'ultimate-debt-4': 'debt',
  'premium-tax-4': 'incomeTax',
  'standard-insurance-4': 'lifeInsurance',
  'deluxe-credit-4': 'creditScore',
  'basic-loan-5': 'loan',
  'advanced-mortgage-5': 'mortgage',
  'pro-investment-5': 'investment',
  'professional-retirement-5': 'retirement',
  'ultimate-savings-5': 'savingsGoal',
  'premium-budget-5': 'budget',
  'standard-debt-5': 'debt',
  'deluxe-tax-5': 'incomeTax',
  'basic-insurance-5': 'lifeInsurance',
  'advanced-credit-5': 'creditScore',
  'pro-loan-6': 'loan',
  'professional-mortgage-6': 'mortgage',
  'ultimate-investment-6': 'investment',
  'premium-retirement-6': 'retirement',
  'standard-savings-6': 'savingsGoal',
  'deluxe-budget-6': 'budget',
  'basic-debt-6': 'debt',
  'advanced-tax-6': 'incomeTax',
  'pro-insurance-6': 'lifeInsurance',
  'professional-credit-6': 'creditScore',
  'ultimate-loan-7': 'loan',
  'premium-mortgage-7': 'mortgage',
  'standard-investment-7': 'investment',
  'deluxe-retirement-7': 'retirement',
  'basic-savings-7': 'savingsGoal',
  'advanced-budget-7': 'budget',
  'pro-debt-7': 'debt',
  'professional-tax-7': 'incomeTax',
  'ultimate-insurance-7': 'lifeInsurance',
  'debt-snowball-calculator': 'debtSnowball',
  'debt-avalanche-calculator': 'debtAvalanche',
  'debt-payoff-plan': 'debtPayoffPlan',
  'debt-consolidation-savings': 'debtConsolidationSavings',
  'balance-transfer-calculator': 'balanceTransfer',
  'emergency-fund-calculator': 'emergencyFund',
  'sinking-fund-calculator': 'sinkingFund',
  'savings-goal-calculator': 'savingsGoal',
  'college-savings': 'collegeSavings',
  '529-calculator': 'collegeSavings',
  'esa-calculator': 'collegeSavings',
  'net-worth-tracker': 'netWorth',
  'wedding-budget': 'weddingBudget',
  'vacation-budget': 'vacationBudget',
  'holiday-budget': 'holidayBudget',
  'grocery-budget': 'groceryBudget',
  'monthly-budget': 'monthlyBudget',
  'annual-budget': 'annualBudget',
  'child-care-cost': 'childCare',
  'pet-expense-calculator': 'petExpense',
  'car-affordability': 'carAffordability',
  'business-valuation-calculator': 'businessValuation',
  'startup-costs-calculator': 'startupCosts',
  'runway-calculator': 'runway',
  'burn-rate-calculator': 'burnRate',
  'customer-acquisition-cost': 'cac',
  'lifetime-value': 'ltvCalc',
  'ltv-cac-ratio': 'ltvCacRatio',
  'churn-rate': 'churnRate',
  'monthly-recurring-revenue': 'mrr',
  'annual-recurring-revenue': 'arr',
  'saas-metrics-calculator': 'mrr',
  'unit-economics': 'unitEconomics',
  'contribution-margin': 'contributionMargin',
  'operating-leverage': 'operatingLeverage',
  'financial-leverage': 'financialLeverage',
  'life-insurance-needs': 'lifeInsurance',
  'term-vs-whole-life': 'termVsWholeLife',
  'disability-insurance': 'disability',
  'long-term-disability': 'disability',
  'short-term-disability': 'disability',
  'home-insurance-estimator': 'homeInsurance',
  'auto-insurance-estimator': 'autoInsurance',
  'health-insurance-comparison': 'healthInsuranceComparison',
  'deductible-vs-premium': 'deductibleVsPremium',
  'out-of-pocket-maximum': 'outOfPocketMaximum',
  'debt-to-asset-ratio': 'debtToAsset',
  'debt-to-equity-ratio': 'debtToEquity',
  'price-to-book-ratio': 'pb',
  'price-to-sales-ratio': 'ps',
  'peg-ratio': 'peg',
  'dividend-growth-rate': 'dividendGrowthRate',
  'payout-ratio': 'payoutRatio',
  'retention-ratio': 'retentionRatio',
  'plowback-ratio': 'retentionRatio',
  'capital-gains-tax': 'capitalGainsTax',
  'dividend-tax-calculator': 'dividendTax',
  'interest-income-tax': 'interestIncomeTax',
  'rental-income-tax': 'rentalIncomeTax',
  'side-hustle-tax-calculator': 'sideHustleTax',
  'gig-economy-tax': 'gigEconomyTax',
  'tax-bracket-calculator': 'taxBracket',
  'marginal-tax-rate': 'marginalTaxRate',
  'effective-tax-rate': 'effectiveTaxRate',
  'tax-refund-estimator': 'taxRefundEstimator',
  'itemized-vs-standard-deduction': 'itemizedVsStandardDeduction',
  'amt-calculator': 'amt',
  'cryptocurrency-profit-calculator': 'cryptoProfit',
  'crypto-mining-calculator': 'cryptoMining',
  'crypto-staking-calculator': 'cryptoStaking',
  'impermanent-loss-calculator': 'impermanentLoss',
  'crypto-tax-calculator': 'cryptoTax',
  '50-30-20-budget': 'fiftyThirtyTwenty',
  'zero-based-budget': 'zeroBasedBudget',
  'envelope-system-budget': 'envelopeSystem',
  'pay-yourself-first-budget': 'payYourselfFirst',
  'rental-income': 'rentalIncome',
  'cap-rate': 'capRate',
  'cash-on-cash-return': 'cashOnCash',
  'noi-calculator': 'noiCalc',
  'roi-rental': 'roiRental',
  'closing-costs': 'closingCosts',
  'sales-tax-calculator': 'salesTax',
  'vat-calculator': 'vat',
  'self-employment-tax': 'selfEmploymentTax',
  'property-tax-deduction': 'propertyTaxDeduction',
  'markup-calculator': 'markupCalc',
  'gift-tax': 'giftTax',
  'inheritance-tax': 'inheritanceTax',
  'pension-calculator': 'pension',
  'roth-ira-calculator': 'pension',
  'ira-calculator': 'pension',
  'rmd-calculator': 'rmd',
  'safe-withdrawal-rate': 'safeWithdrawalRate',
  '403b-calculator': 'pension',
  '457-calculator': 'pension',
  'advanced-budget-11': 'budget',
  'advanced-budget-15': 'budget',
  'advanced-credit-13': 'creditScore',
  'advanced-credit-17': 'creditScore',
  'advanced-credit-9': 'creditScore',
  'advanced-mortgage-13': 'mortgage',
  'advanced-mortgage-17': 'mortgage',
  'advanced-mortgage-9': 'mortgage',
  'advanced-retirement-12': 'retirement',
  'advanced-retirement-16': 'retirement',
  'advanced-retirement-8': 'retirement',
  'advanced-tax-10': 'incomeTax',
  'advanced-tax-14': 'incomeTax',
  'annuity-calculator': 'annuity',
  'backdoor-roth-ira': 'pension',
  'basic-debt-10': 'debt',
  'basic-debt-14': 'debt',
  'basic-insurance-13': 'lifeInsurance',
  'basic-insurance-17': 'lifeInsurance',
  'basic-insurance-9': 'lifeInsurance',
  'basic-investment-12': 'investment',
  'basic-investment-16': 'investment',
  'basic-investment-8': 'investment',
  'basic-loan-13': 'loan',
  'basic-loan-17': 'loan',
  'basic-loan-9': 'loan',
  'basic-savings-11': 'savingsGoal',
  'basic-savings-15': 'savingsGoal',
  'blanket-loan': 'loan',
  'bond-calculator': 'bondYield',
  'bridge-loan-calculator': 'loan',
  'brrrr-method-calculator': 'rentalIncome',
  'cagr-calculator': 'roi',
  'capital-gains-tax-calculator': 'capitalGainsTax',
  'cap-rate-calculator': 'capRate',
  'capm-calculator': 'investment',
  'cash-advance-calculator': 'loan',
  'charitable-remainder-trust': 'retirement',
  'conforming-loan': 'loan',
  'construction-loan-calculator': 'loan',
  'contract-for-deed': 'loan',
  'dcf-calculator': 'npv',
  'deluxe-budget-10': 'budget',
  'deluxe-budget-14': 'budget',
  'deluxe-credit-12': 'creditScore',
  'deluxe-credit-16': 'creditScore',
  'deluxe-credit-8': 'creditScore',
  'deluxe-mortgage-12': 'mortgage',
  'deluxe-mortgage-16': 'mortgage',
  'deluxe-mortgage-8': 'mortgage',
  'deluxe-retirement-11': 'retirement',
  'deluxe-retirement-15': 'retirement',
  'deluxe-tax-13': 'incomeTax',
  'deluxe-tax-17': 'incomeTax',
  'deluxe-tax-9': 'incomeTax',
  'dividend-reinvestment': 'investment',
  'enterprise-value': 'businessValuation',
  'equipment-loan-calculator': 'loan',
  'equity-value': 'businessValuation',
  'estimated-tax-calculator': 'incomeTax',
  'etf-calculator': 'investment',
  'fix-and-flip-calculator': 'rentalIncome',
  'graduated-payment': 'loan',
  'growing-perpetuity': 'npv',
  'hard-money-loan': 'loan',
  'health-savings-account': 'savingsGoal',
  'hecm-calculator': 'mortgage',
  'hsa-vs-traditional': 'savingsGoal',
  'index-fund-calculator': 'investment',
  'inherited-ira': 'pension',
  'interest-only-loan': 'loan',
  'jumbo-loan': 'loan',
  'land-loan-calculator': 'loan',
  'lease-to-own': 'loan',
  'long-term-care-calculator': 'lifeInsurance',
  'medicare-cost-calculator': 'incomeTax',
  'mega-backdoor-roth': 'pension',
  'microloan-calculator': 'loan',
  'mutual-fund-calculator': 'investment',
  'negative-amortization': 'loan',
  'payday-loan-calculator': 'loan',
  'pension-lump-sum-vs-annuity': 'pension',
  'perpetuity-calculator': 'npv',
  'portfolio-loan': 'loan',
  'pre-money-post-money-valuation': 'businessValuation',
  'premium-budget-13': 'budget',
  'premium-budget-17': 'budget',
  'premium-budget-9': 'budget',
  'premium-credit-11': 'creditScore',
  'premium-credit-15': 'creditScore',
  'premium-credit-7': 'creditScore',
  'premium-mortgage-11': 'mortgage',
  'premium-mortgage-15': 'mortgage',
  'premium-retirement-10': 'retirement',
  'premium-retirement-14': 'retirement',
  'premium-tax-12': 'incomeTax',
  'premium-tax-16': 'incomeTax',
  'premium-tax-8': 'incomeTax',
  'pro-debt-11': 'debt',
  'pro-debt-15': 'debt',
  'professional-budget-12': 'budget',
  'professional-budget-16': 'budget',
  'professional-budget-8': 'budget',
  'professional-credit-10': 'creditScore',
  'professional-credit-14': 'creditScore',
  'professional-mortgage-10': 'mortgage',
  'professional-mortgage-14': 'mortgage',
  'professional-retirement-13': 'retirement',
  'professional-retirement-17': 'retirement',
  'professional-retirement-9': 'retirement',
  'professional-tax-11': 'incomeTax',
  'professional-tax-15': 'incomeTax',
  'pro-insurance-10': 'lifeInsurance',
  'pro-insurance-14': 'lifeInsurance',
  'pro-investment-13': 'investment',
  'pro-investment-17': 'investment',
  'pro-investment-9': 'investment',
  'pro-loan-10': 'loan',
  'pro-loan-14': 'loan',
  'pro-savings-12': 'savingsGoal',
  'pro-savings-16': 'savingsGoal',
  'pro-savings-8': 'savingsGoal',
  'quarterly-tax-calculator': 'incomeTax',
  'real-estate-investment': 'rentalIncome',
  'reit-calculator': 'investment',
  'rental-property-roi': 'roiRental',
  'rent-to-own': 'loan',
  'required-minimum-distribution-beneficiaries': 'rmd',
  'reverse-mortgage': 'mortgage',
  'roth-vs-traditional-ira': 'pension',
  'rv-loan-calculator': 'loan',
  'sba-loan-calculator': 'loan',
  'self-employment-tax-calculator': 'selfEmploymentTax',
  'seller-financing': 'loan',
  'sep-ira-calculator': 'pension',
  'shared-appreciation': 'loan',
  'simple-ira-calculator': 'pension',
  'small-business-loan': 'loan',
  'social-security-break-even': 'socialSecurity',
  'social-security-disability': 'socialSecurity',
  'social-security-spousal-benefits': 'socialSecurity',
  'solo-401k-calculator': 'pension',
  'standard-debt-13': 'debt',
  'standard-debt-17': 'debt',
  'standard-debt-9': 'debt',
  'standard-insurance-12': 'lifeInsurance',
  'standard-insurance-16': 'lifeInsurance',
  'standard-insurance-8': 'lifeInsurance',
  'standard-investment-11': 'investment',
  'standard-investment-15': 'investment',
  'standard-loan-12': 'loan',
  'standard-loan-16': 'loan',
  'standard-loan-8': 'loan',
  'standard-savings-10': 'savingsGoal',
  'standard-savings-14': 'savingsGoal',
  'stock-calculator': 'investment',
  'stretch-ira': 'pension',
  'tax-lien-calculator': 'incomeTax',
  'terminal-value': 'businessValuation',
  'ultimate-debt-12': 'debt',
  'ultimate-debt-16': 'debt',
  'ultimate-debt-8': 'debt',
  'ultimate-insurance-11': 'lifeInsurance',
  'ultimate-insurance-15': 'lifeInsurance',
  'ultimate-investment-10': 'investment',
  'ultimate-investment-14': 'investment',
  'ultimate-loan-11': 'loan',
  'ultimate-loan-15': 'loan',
  'ultimate-savings-13': 'savingsGoal',
  'ultimate-savings-17': 'savingsGoal',
  'ultimate-savings-9': 'savingsGoal',
  'wacc-calculator': 'investment',
  'wholesaling-calculator': 'rentalIncome',
  // --- 91 missing financial calculators ---
  '1031-exchange': 'incomeTax',
  '403b-plan': 'pension',
  '457-plan': 'pension',
  '529-prepaid': 'savingsGoal',
  '529-savings-plan': 'savingsGoal',
  '72t-sepp': 'pension',
  'after-tax-401k': 'pension',
  'annual-gift': 'incomeTax',
  'backdoor-roth': 'pension',
  'bonus-depreciation': 'incomeTax',
  'bridge-loan': 'loan',
  'bypass-trust': 'incomeTax',
  'cash-balance-plan': 'pension',
  'charitable-lead': 'incomeTax',
  'charitable-remainder': 'incomeTax',
  'child-tax-credit': 'incomeTax',
  'consolidation-loan': 'loan',
  'cost-segregation': 'incomeTax',
  'coverdell-esa': 'savingsGoal',
  'crummey': 'incomeTax',
  'deferment': 'loan',
  'defined-benefit-lump': 'pension',
  'distressed-property': 'rentalIncome',
  'donor-advised': 'incomeTax',
  'earned-income-credit': 'incomeTax',
  'education-savings-bond': 'savingsGoal',
  'education-tax-credit': 'incomeTax',
  'energy-tax-credit': 'incomeTax',
  'estimated-tax-penalty': 'incomeTax',
  'executive-bonus': 'salary',
  'federal-pension': 'pension',
  'forbearance': 'loan',
  'foreign-tax-credit': 'incomeTax',
  'generation-skipping': 'incomeTax',
  'grantor-retained': 'incomeTax',
  'growing-equity': 'loan',
  'historic-rehab': 'incomeTax',
  'idgt': 'incomeTax',
  'inherited-ira-rmd': 'pension',
  'innocent-spouse': 'incomeTax',
  'installment-agreement': 'incomeTax',
  'ira-protection': 'pension',
  'ira-rollover': 'pension',
  'ira-transfer': 'pension',
  'life-insurance-trust': 'lifeInsurance',
  'lifetime-gift': 'incomeTax',
  'lihtc': 'incomeTax',
  'marital-deduction': 'incomeTax',
  'medicaid-planning': 'incomeTax',
  'mezzanine-debt': 'debt',
  'military-forgiveness': 'loan',
  'military-pension': 'pension',
  'nonqualified-deferred': 'pension',
  'nurse-forgiveness': 'loan',
  'offer-in-compromise': 'incomeTax',
  'opportunity-zone': 'incomeTax',
  'parent-plus': 'loan',
  'penalty-abatement': 'incomeTax',
  'police-pension': 'pension',
  'portability': 'incomeTax',
  'property-tax': 'incomeTax',
  'pslf-certification': 'loan',
  'qprt': 'incomeTax',
  'qualified-charitable': 'pension',
  'recharacterization': 'pension',
  'required-minimum': 'pension',
  'research-credit': 'incomeTax',
  'roth-401k': 'pension',
  'roth-conversion-tax': 'pension',
  'safe-harbor-401k': 'pension',
  'saver-credit': 'incomeTax',
  'simple-401k': 'pension',
  'social-security-delay': 'socialSecurity',
  'social-security-divorce': 'socialSecurity',
  'social-security-early': 'socialSecurity',
  'social-security-ssi': 'socialSecurity',
  'social-security-survivor': 'socialSecurity',
  'solo-401k': 'pension',
  'special-needs-trust': 'incomeTax',
  'state-pension': 'pension',
  'student-loan-default': 'loan',
  'student-loan-interest': 'loan',
  'tax-loss-harvest': 'incomeTax',
  'tax-sale': 'incomeTax',
  'teacher-forgiveness': 'loan',
  'teacher-pension': 'pension',
  'trust-beneficiary': 'pension',
  'ugma-utma': 'savingsGoal',
  'variable-rate-loan': 'loan',
  'veterans-pension': 'pension',
  'wash-sale': 'incomeTax',
}

function getCalcType(slug: string): CalcType {
  const mapped = calcTypeMap[slug]
  if (mapped) return mapped
  if (slug.includes('loan') || slug.includes('mortgage')) return 'loan'
  if (slug.includes('invest') || slug.includes('fund') || slug.includes('stock') || slug.includes('etf') || slug.includes('reit')) return 'investment'
  if (slug.includes('tax') || slug.includes('irs')) return 'incomeTax'
  if (slug.includes('retire') || slug.includes('pension') || slug.includes('ira') || slug.includes('401k') || slug.includes('roth')) return 'pension'
  if (slug.includes('budget') || slug.includes('spending')) return 'budget'
  if (slug.includes('debt') || slug.includes('credit-card')) return 'debt'
  if (slug.includes('insurance') || slug.includes('life-insurance')) return 'lifeInsurance'
  if (slug.includes('savings') || slug.includes('college') || slug.includes('529') || slug.includes('esa')) return 'savingsGoal'
  if (slug.includes('salary') || slug.includes('income')) return 'salary'
  if (slug.includes('social') || slug.includes('medicare')) return 'socialSecurity'
  if (slug.includes('bond')) return 'bondYield'
  if (slug.includes('crypto') || slug.includes('cryptocurrency')) return 'cryptoProfit'
  if (slug.includes('real-estate') || slug.includes('rental') || slug.includes('rent') || slug.includes('property')) return 'rentalIncome'
  if (slug.includes('business') || slug.includes('startup') || slug.includes('valuation')) return 'businessValuation'
  if (slug.includes('insurance')) return 'lifeInsurance'
  if (slug.includes('mortgage')) return 'mortgage'
  if (slug.includes('budget')) return 'budget'
  return 'loan'
}

const defaultSchema = z.object({ val: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') })

const salarySchema = z.object({
  amount: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0'),
  period: z.enum(['hourly', 'weekly', 'monthly', 'annual']),
})

const debtSchema = z.object({
  balance: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0'),
  rate: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, 'Must be >= 0'),
  monthly: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0'),
})

const taxSchema = z.object({
  income: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, 'Must be >= 0'),
  rate: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 100, '0-100'),
})

const budgetSchema = z.object({
  income: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0'),
  housing: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, 'Must be >= 0'),
  food: z.string().optional(),
  transport: z.string().optional(),
  utilities: z.string().optional(),
  other: z.string().optional(),
})

const num = (label: string) => z.string().min(1, `${label} required`).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, `${label} must be >= 0`)
const optNum = (label: string) => z.string().optional()
const select = <T extends string>(opts: Record<T, string>, label: string) => z.enum(Object.keys(opts) as [T, ...T[]])

const simpleInterestSchema = z.object({ principal: num('Principal ($)'), rate: num('Annual Rate (%)'), years: num('Years') })
const apyCalcSchema = z.object({ rate: num('Annual Rate (%)'), compound: select({ monthly: 'Monthly', quarterly: 'Quarterly', yearly: 'Yearly' }, 'Compound'), years: num('Years') })
const fvPvSchema = z.object({ present: num('Present Value ($)'), rate: num('Rate (%)'), years: num('Years'), monthlyAdd: num('Monthly Addition ($)') })
const roiSchema = z.object({ initial: num('Initial Investment ($)'), final: num('Final Value ($)'), years: num('Years') })
const npvSchema = z.object({ initial: num('Initial Investment ($)'), cashFlows: num('Annual Cash Flow ($)'), rate: num('Discount Rate (%)'), years: num('Years') })
const irrSchema = z.object({ initial: num('Initial Investment ($)'), cashFlow: num('Annual Cash Flow ($)'), years: num('Years') })
const paybackSchema = z.object({ initial: num('Initial Investment ($)'), cashFlow: num('Annual Cash Flow ($)') })
const breakEvenSchema = z.object({ fixedCosts: num('Fixed Costs ($)'), pricePerUnit: num('Price Per Unit ($)'), varCostPerUnit: num('Variable Cost Per Unit ($)') })
const bondYieldSchema = z.object({ price: num('Current Price ($)'), faceValue: num('Face Value ($)'), coupon: num('Annual Coupon ($)'), years: num('Years to Maturity') })
const bondPriceSchema = z.object({ faceValue: num('Face Value ($)'), coupon: num('Annual Coupon ($)'), rate: num('Yield to Maturity (%)'), years: num('Years to Maturity') })
const couponPaySchema = z.object({ faceValue: num('Face Value ($)'), couponRate: num('Coupon Rate (%)'), freq: select({ annual: 'Annual', semiannual: 'Semi-Annual', quarterly: 'Quarterly' }, 'Frequency') })
const taxEquivYieldSchema = z.object({ muniYield: num('Municipal Bond Yield (%)'), taxRate: num('Tax Rate (%)') })
const dividendYieldSchema = z.object({ pricePerShare: num('Price Per Share ($)'), annualDividend: num('Annual Dividend Per Share ($)') })
const dividendPayoutSchema = z.object({ dividends: num('Total Dividends ($)'), netIncome: num('Net Income ($)') })
const epsSchema = z.object({ netIncome: num('Net Income ($)'), shares: num('Shares Outstanding') })
const peSchema = z.object({ price: num('Stock Price ($)'), eps: num('Earnings Per Share ($)') })
const pbSchema = z.object({ price: num('Stock Price ($)'), bookValue: num('Book Value Per Share ($)') })
const psSchema = z.object({ price: num('Stock Price ($)'), salesPerShare: num('Sales Per Share ($)') })
const pegSchema = z.object({ pe: num('P/E Ratio'), growth: num('Earnings Growth Rate (%)') })
const dividendGrowthSchema = z.object({ currentDividend: num('Current Dividend ($)'), years: num('Years Ago'), priorDividend: num('Dividend ($) years ago') })
const payoutRatioSchema = z.object({ dividendsPerShare: num('Dividends Per Share ($)'), eps: num('EPS ($)') })
const retentionRatioSchema = z.object({ payoutRatio: num('Payout Ratio (%)') })
const stockAvgCostSchema = z.object({ shares: num('Total Shares'), totalCost: num('Total Cost ($)'), newShares: num('New Shares'), newPrice: num('New Price Per Share ($)') })
const dcaSchema = z.object({ monthlyInvest: num('Monthly Investment ($)'), pricePerShare: num('Price Per Share ($)'), months: num('Months') })
const costBasisSchema = z.object({ purchasePrice: num('Purchase Price ($)'), shares: num('Shares'), commissions: num('Commissions ($)') })
const portfolioReturnSchema = z.object({ return1: num('Asset 1 Return (%)'), weight1: num('Asset 1 Weight (%)'), return2: num('Asset 2 Return (%)'), weight2: num('Asset 2 Weight (%)') })
const sharpeSchema = z.object({ portfolioReturn: num('Portfolio Return (%)'), riskFreeRate: num('Risk-Free Rate (%)'), stdDev: num('Standard Deviation (%)') })
const sortinoSchema = z.object({ portfolioReturn: num('Portfolio Return (%)'), riskFreeRate: num('Risk-Free Rate (%)'), downsideDev: num('Downside Deviation (%)') })
const alphaSchema = z.object({ portfolioReturn: num('Portfolio Return (%)'), riskFreeRate: num('Risk-Free Rate (%)'), beta: num('Beta'), marketReturn: num('Market Return (%)') })
const betaSchema = z.object({ stockReturn: num('Stock Return (%)'), marketReturn: num('Market Return (%)') })
const rSquaredSchema = z.object({ correlation: num('Corfficient r') })
const varSchema = z.object({ portfolioValue: num('Portfolio Value ($)'), meanReturn: num('Mean Return (%)'), stdDev: num('Standard Deviation (%)'), confidence: select({ '95': '95%', '99': '99%' }, 'Confidence Level') })
const dtiSchema = z.object({ monthlyDebt: num('Monthly Debt Payments ($)'), monthlyIncome: num('Monthly Income ($)') })
const ltvSchema = z.object({ loanAmount: num('Loan Amount ($)'), propertyValue: num('Property Value ($)') })
const dscrSchema = z.object({ noi: num('Net Operating Income ($)'), debtService: num('Annual Debt Service ($)') })
const coverageSchema = z.object({ ebit: num('EBIT ($)'), interestExpense: num('Interest Expense ($)') })
const workingCapitalSchema = z.object({ currentAssets: num('Current Assets ($)'), currentLiabilities: num('Current Liabilities ($)') })
const turnoverSchema = z.object({ cogs: num('COGS ($)'), avgInventory: num('Average Inventory ($)') })
const assetTurnoverSchema = z.object({ revenue: num('Revenue ($)'), avgAssets: num('Average Total Assets ($)') })
const roaRoeSchema = z.object({ netIncome: num('Net Income ($)'), avgEquity: num('Average Equity ($)'), avgAssets: num('Average Assets ($)') })
const debtRatioSchema = z.object({ totalDebt: num('Total Debt ($)'), totalEquity: num('Total Equity ($)'), totalAssets: num('Total Assets ($)') })
const rentVsBuySchema = z.object({ rent: num('Monthly Rent ($)'), homePrice: num('Home Price ($)'), downPayment: num('Down Payment ($)'), rate: num('Mortgage Rate (%)'), years: num('Years'), propertyTax: num('Annual Property Tax ($)') })
const affordabilitySchema = z.object({ income: num('Annual Income ($)'), rate: num('Interest Rate (%)'), downPayment: num('Down Payment ($)'), term: num('Loan Term (years)') })
const closingCostsSchema = z.object({ homePrice: num('Home Price ($)'), downPayment: num('Down Payment ($)') })
const rentalIncomeSchema = z.object({ monthlyRent: num('Monthly Rent ($)'), expenses: num('Monthly Expenses ($)'), downPayment: num('Down Payment ($)'), propertyValue: num('Property Value ($)') })
const capRateSchema = z.object({ noi: num('Annual NOI ($)'), propertyValue: num('Property Value ($)') })
const cashOnCashSchema = z.object({ annualCashFlow: num('Annual Cash Flow ($)'), totalInvested: num('Total Cash Invested ($)') })
const noiCalcSchema = z.object({ rentalIncome: num('Monthly Rental Income ($)'), vacancyRate: num('Vacancy Rate (%)'), operatingExpenses: num('Annual Operating Expenses ($)') })
const taxBracketSchema = z.object({ income: num('Taxable Income ($)'), bracketStart: num('Bracket Threshold ($)'), bracketRate: num('Bracket Rate (%)'), baseTax: num('Base Tax ($)') })
const marginalTaxSchema = z.object({ income: num('Income ($)'), additionalIncome: num('Additional Income ($)'), rate: num('Marginal Rate (%)') })
const effectiveTaxSchema = z.object({ totalTax: num('Total Tax Paid ($)'), totalIncome: num('Total Income ($)') })
const capitalGainsSchema = z.object({ costBasis: num('Cost Basis ($)'), salePrice: num('Sale Price ($)'), taxRate: num('Capital Gains Tax Rate (%)') })
const dividendTaxSchema = z.object({ dividends: num('Qualified Dividends ($)'), taxRate: num('Tax Rate (%)') })
const selfEmploymentSchema = z.object({ netEarnings: num('Net Earnings ($)'), expenseRate: num('Expense Deduction %') })
const salesTaxSchema = z.object({ price: num('Price ($)'), taxRate: num('Sales Tax Rate (%)') })
const vatSchema = z.object({ price: num('Price ($)'), vatRate: num('VAT Rate (%)') })
const estateTaxSchema = z.object({ estateValue: num('Estate Value ($)'), exemption: num('Exemption ($)'), taxRate: num('Estate Tax Rate (%)') })
const taxRefundSchema = z.object({ withheld: num('Total Withheld ($)'), taxLiability: num('Total Tax Liability ($)') })
const itemizedSchema = z.object({ income: num('Income ($)'), itemized: num('Itemized Deductions ($)'), standard: num('Standard Deduction ($)') })
const amtSchema = z.object({ income: num('AMT Income ($)'), exemption: num('AMT Exemption ($)'), rate: num('AMT Rate (%)') })
const cryptoProfitSchema = z.object({ buyPrice: num('Buy Price ($)'), sellPrice: num('Sell Price ($)'), quantity: num('Quantity') })
const cryptoMiningSchema = z.object({ hashRate: num('Hash Rate (MH/s)'), power: num('Power (Watts)') })
const cryptoStakingSchema = z.object({ amount: num('Stake Amount ($)'), apy: num('APY (%)'), years: num('Years') })
const impermanentLossSchema = z.object({ priceRatio: num('Price Ratio (new/old)'), investA: num('Initial A ($)'), investB: num('Initial B ($)') })
const lifeInsuranceSchema = z.object({ income: num('Annual Income ($)'), years: num('Years to Cover'), debts: num('Total Debts ($)'), funeral: num('Funeral Costs ($)') })
const termVsWholeLifeSchema = z.object({ age: num('Your Age'), termPremium: num('Term Premium ($/mo)'), wholePremium: num('Whole Life Premium ($/mo)'), years: num('Years') })
const disabilitySchema = z.object({ income: num('Monthly Income ($)'), benefitPct: num('Benefit Percentage (%)'), elimination: num('Elimination Period (months)') })
const homeInsSchema = z.object({ homeValue: num('Home Value ($)'), deductible: num('Deductible ($)') })
const autoInsSchema = z.object({ carValue: num('Car Value ($)'), deductible: num('Deductible ($)') })
const healthInsCompSchema = z.object({ premium1: num('Plan A Premium ($/mo)'), deductible1: num('Plan A Deductible ($)'), oopMax1: num('Plan A OOP Max ($)'), premium2: num('Plan B Premium ($/mo)'), deductible2: num('Plan B Deductible ($)'), oopMax2: num('Plan B OOP Max ($)') })
const deductibleVsPremiumSchema = z.object({ lowPremium: num('Low Premium ($/mo)'), lowDeductible: num('Low Deductible ($)'), highPremium: num('High Premium ($/mo)'), highDeductible: num('High Deductible ($)') })
const oopSchema = z.object({ deductible: num('Deductible ($)'), coinsurance: num('Coinsurance (%)'), oopMax: num('OOP Maximum ($)') })
const creditUtilSchema = z.object({ totalBalance: num('Total Balance ($)'), totalLimit: num('Total Credit Limit ($)') })
const creditScoreSchema = z.object({ paymentHistory: num('Payment History (35%)',), utilization: num('Credit Utilization (30%)',), length: num('Credit History (15%)',), mix: num('Credit Mix (10%)',), inquiries: num('New Credit (10%)',) })
const balanceTransferSchema = z.object({ balance: num('Transfer Balance ($)'), promoRate: num('Promo APR (%)'), promoMonths: num('Promo Months'), feeRate: num('Transfer Fee (%)') })
const emergencyFundSchema = z.object({ monthlyExpenses: num('Monthly Expenses ($)'), months: num('Months to Cover') })
const sinkingFundSchema = z.object({ goal: num('Savings Goal ($)'), rate: num('Annual Rate (%)'), years: num('Years') })
const savingsGoalSchema = z.object({ goal: num('Target Amount ($)'), current: num('Current Savings ($)'), rate: num('Annual Return (%)'), years: num('Years'), monthlyAdd: num('Monthly Addition ($)') })
const collegeSavingsSchema = z.object({ goal: num('College Cost ($)'), current: num('Current Savings ($)'), years: num('Years Until College'), rate: num('Expected Return (%)'), monthly: num('Monthly Contribution ($)') })
const netWorthSchema = z.object({ assets: num('Total Assets ($)'), liabilities: num('Total Liabilities ($)') })
const debtSnowballSchema = z.object({ totalDebt: num('Total Debt ($)'), minPayment: num('Min Monthly Payment ($)'), extraPayment: num('Extra Payment ($)'), rate: num('Average Rate (%)') })
const debtAvalancheSchema = z.object({ totalDebt: num('Total Debt ($)'), minPayment: num('Min Monthly Payment ($)'), extraPayment: num('Extra Payment ($)'), rate: num('Average Rate (%)') })
const debtPayoffPlanSchema = z.object({ balance: num('Balance ($)'), rate: num('Rate (%)'), monthly: num('Monthly Payment ($)'), goalMonths: num('Goal Months') })
const consolidationSavingsSchema = z.object({ totalDebt: num('Total Debt ($)'), currentRate: num('Current Avg Rate (%)'), newRate: num('New Rate (%)'), term: num('New Term (years)') })
const pensionSchema = z.object({ currentSavings: num('Current Savings ($)'), monthlyContrib: num('Monthly Contribution ($)'), rate: num('Annual Return (%)'), years: num('Years Until Retirement') })
const socialSecuritySchema = z.object({ age: num('Your Age'), earnings: num('Annual Income ($)'), retirementAge: num('Retirement Age') })
const annuitySchema = z.object({ principal: num('Principal ($)'), rate: num('Annual Rate (%)'), years: num('Years') })
const safeWithdrawalSchema = z.object({ savings: num('Total Savings ($)'), withdrawalRate: num('Withdrawal Rate (%)') })
const rmdSchema = z.object({ balance: num('Account Balance ($)'), age: num('Your Age') })
const businessValSchema = z.object({ revenue: num('Annual Revenue ($)'), ebitda: num('EBITDA ($)'), multiple: num('Valuation Multiple') })
const startupCostsSchema = z.object({ equipment: num('Equipment ($)'), license: num('Licenses ($)'), marketing: num('Marketing ($)'), legal: num('Legal ($)'), inventory: num('Inventory ($)') })
const runwaySchema = z.object({ cash: num('Cash on Hand ($)'), monthlyBurn: num('Monthly Burn Rate ($)'), monthlyRevenue: num('Monthly Revenue ($)') })
const burnRateSchema = z.object({ startCash: num('Starting Cash ($)'), endCash: num('Ending Cash ($)'), months: num('Months') })
const cacSchema = z.object({ salesCost: num('Sales & Marketing ($)'), newCustomers: num('New Customers') })
const ltvCalcSchema = z.object({ avgRevenue: num('Avg Revenue Per Customer ($)'), churnRate: num('Customer Churn Rate (%)') })
const ltvCacSchema = z.object({ ltv: num('LTV ($)'), cac: num('CAC ($)') })
const churnSchema = z.object({ lostCustomers: num('Lost Customers'), startCustomers: num('Starting Customers') })
const mrrSchema = z.object({ subscribers: num('Paying Subscribers'), avgPrice: num('Avg Price Per Month ($)') })
const arrSchema = z.object({ mrr: num('Monthly Recurring Revenue ($)') })
const unitEconSchema = z.object({ price: num('Price Per Unit ($)'), varCost: num('Variable Cost Per Unit ($)'), fixedCost: num('Total Fixed Costs ($)'), units: num('Units Sold') })
const contributionMarginSchema = z.object({ revenue: num('Total Revenue ($)'), varCosts: num('Total Variable Costs ($)') })
const operatingLeverageSchema = z.object({ revenue: num('Revenue ($)'), varCosts: num('Variable Costs ($)'), fixedCosts: num('Fixed Costs ($)') })
const finLeverageSchema = z.object({ ebit: num('EBIT ($)'), interest: num('Interest Expense ($)') })
const costVolumeSchema = z.object({ fixedCosts: num('Fixed Costs ($)'), pricePerUnit: num('Price Per Unit ($)'), varCostPerUnit: num('Variable Cost Per Unit ($)'), units: num('Units Sold') })
const markupSchema = z.object({ cost: num('Cost ($)'), markup: num('Markup Percentage (%)') })
const childCareSchema = z.object({ weeklyCost: num('Weekly Cost ($)'), weeksPerYear: num('Weeks Per Year') })
const petExpenseSchema = z.object({ food: num('Annual Food ($)'), vet: num('Annual Vet ($)'), supplies: num('Annual Supplies ($)'), other: num('Annual Other ($)') })
const carAffordSchema = z.object({ monthlyPayment: num('Target Monthly Payment ($)'), rate: num('Interest Rate (%)'), term: num('Term (months)') })
const budgetRuleSchema = z.object({ income: num('Income ($)'), needs: num('Needs ($)'), wants: num('Wants ($)'), savings: num('Savings ($)') })
const zeroBasedBudgetSchema = z.object({ income: num('Income ($)'), category1: num('Category 1 ($)'), category2: num('Category 2 ($)'), category3: num('Category 3 ($)'), category4: num('Category 4 ($)') })
const envelopeBudgetSchema = z.object({ income: num('Income ($)'), envelopes: num('Number of Envelopes'), perEnvelope: num('Per Envelope ($)') })
const payYourselfFirstSchema = z.object({ income: num('Income ($)'), savingsPct: num('Savings Percentage (%)') })
const weddingBudgetSchema = z.object({ guestCount: num('Guests'), budget: num('Total Budget ($)') })
const vacationBudgetSchema = z.object({ transport: num('Transport ($)'), lodging: num('Lodging ($)'), food: num('Food ($)'), activities: num('Activities ($)') })
const holidayBudgetSchema = z.object({ gifts: num('Gifts ($)'), travel: num('Travel ($)'), food: num('Food ($)'), decorations: num('Decorations ($)') })
const groceryBudgetSchema = z.object({ householdSize: num('Household Size'), weeklyTarget: num('Weekly Target ($)') })
const monthlyBudgetSchema = z.object({ income: num('Income ($)'), housing: num('Housing ($)'), food: num('Food ($)'), transport: num('Transport ($)'), utilities: num('Utilities ($)'), other: num('Other ($)') })
const annualBudgetSchema = z.object({ income: num('Annual Income ($)'), housing: num('Housing ($)'), food: num('Food ($)'), transport: num('Transport ($)'), utilities: num('Utilities ($)'), savings: num('Savings ($)') })
const propertyTaxDeductionSchema = z.object({ propertyTaxPaid: num('Property Tax Paid ($)'), marginalRate: num('Marginal Tax Rate (%)') })
const giftTaxSchema = z.object({ giftAmount: num('Gift Amount ($)'), annualExclusion: num('Annual Exclusion ($)') })
const inheritanceTaxSchema = z.object({ inheritanceAmount: num('Inheritance Amount ($)'), stateExemption: num('State Exemption ($)'), taxRate: num('Tax Rate (%)') })
const sideHustleTaxSchema = z.object({ income: num('Side Hustle Income ($)'), expenses: num('Business Expenses ($)'), otherIncome: num('Other W2 Income ($)') })
const rentIncomeTaxSchema = z.object({ rentIncome: num('Rental Income ($)'), expenses: num('Total Expenses ($)'), depreciation: num('Depreciation ($)') })
const loanComparisonSchema = z.object({ amount: num('Loan Amount ($)'), rate1: num('Loan 1 Rate (%)'), term1: num('Loan 1 Term (years)'), rate2: num('Loan 2 Rate (%)'), term2: num('Loan 2 Term (years)') })
const biweeklyPaySchema = z.object({ principal: num('Loan Amount ($)'), rate: num('Interest Rate (%)'), term: num('Term (years)') })
const grossProfitSchema = z.object({ revenue: num('Revenue ($)'), cogs: num('Cost of Goods Sold ($)') })
const profitMarginSchema = z.object({ revenue: num('Revenue ($)'), profit: num('Net Profit ($)') })
const netProfitSchema = z.object({ revenue: num('Total Revenue ($)'), expenses: num('Total Expenses ($)') })

function PaymentResults({ p, r, t }: { p: number; r: number; t: number }) {
  const monthlyRate = r / 100 / 12
  const numPayments = t * 12
  let monthlyPayment = 0
  if (monthlyRate > 0 && numPayments > 0 && p > 0) {
    const factor = Math.pow(1 + monthlyRate, numPayments)
    monthlyPayment = p * (monthlyRate * factor) / (factor - 1)
  } else if (numPayments > 0 && p > 0) {
    monthlyPayment = p / numPayments
  }
  const totalPayment = monthlyPayment * numPayments
  const totalInterest = totalPayment - p
  const amortData = Array.from({ length: Math.min(t, 30) }, (_, i) => {
    const year = i + 1
    const remainingMonths = numPayments - year * 12
    let balance = 0
    if (monthlyRate > 0) {
      balance = p * (Math.pow(1 + monthlyRate, remainingMonths) - 1) / (Math.pow(1 + monthlyRate, numPayments) - 1) * Math.pow(1 + monthlyRate, numPayments)
    } else {
      balance = p * (remainingMonths / numPayments)
    }
    return { year, balance: Math.max(0, balance) }
  })
  return (
    <div className="space-y-4">
      <div className="text-center space-y-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Payment</p>
          <p className="text-3xl font-bold text-[#1a3a8a]">${monthlyPayment.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Payment</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">${totalPayment.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Interest</p>
          <p className="text-xl font-bold text-[#d62828]">${totalInterest.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Interest / Principal</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{p > 0 ? ((totalInterest / p) * 100).toFixed(1) : 0}% of loan amount</p>
        </div>
      </div>
      <LoanDonutChart principal={p} totalInterest={totalInterest} />
      <AmortizationChart data={amortData} />
      {t > 0 && (
        <div className="text-xs text-gray-400 text-center space-y-1">
          <p>Term: {t} years ({numPayments} payments) | Rate: {r}%</p>
        </div>
      )}
    </div>
  )
}

function InvestmentResults({ initial, monthly, rate, years, extraFields }: { initial: number; monthly: number; rate: number; years: number; extraFields?: Record<string, string> }) {
  const n = (v: string | undefined) => { const p = parseFloat(v || ''); return isNaN(p) ? undefined : p }
  const inflationRate = n(extraFields?.extra_inflation_rate)
  const taxRate = n(extraFields?.extra_tax_rate)
  const feePercent = n(extraFields?.extra_fee_percent)
  const compoundFreq = extraFields?.extra_compound_frequency
  const effectiveRate = feePercent !== undefined ? rate - feePercent : rate
  const months = years * 12
  let monthlyRate = effectiveRate / 100 / 12
  if (compoundFreq && compoundFreq !== '12' && !isNaN(parseInt(compoundFreq)) && parseInt(compoundFreq) > 0) {
    const nPeriods = parseInt(compoundFreq)
    monthlyRate = Math.pow(1 + effectiveRate / 100 / nPeriods, nPeriods / 12) - 1
  }
  let futureValue = 0
  if (monthlyRate > 0) {
    futureValue = initial * Math.pow(1 + monthlyRate, months) + monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
  } else {
    futureValue = initial + monthly * months
  }
  const totalContributions = initial + monthly * months
  const totalInterest = futureValue - totalContributions
  const realFutureValue = inflationRate !== undefined ? futureValue / Math.pow(1 + inflationRate / 100, years) : futureValue
  const afterTaxValue = taxRate !== undefined ? futureValue - (totalInterest * taxRate / 100) : futureValue
  const growthData = Array.from({ length: years }, (_, i) => {
    const y = i + 1
    const m = y * 12
    let val = 0
    if (monthlyRate > 0) {
      val = initial * Math.pow(1 + monthlyRate, m) + monthly * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate)
    } else {
      val = initial + monthly * m
    }
    return { year: y, value: val, contributions: initial + monthly * m }
  })
  const hasAdjustments = inflationRate !== undefined || taxRate !== undefined || feePercent !== undefined
  return (
    <div className="space-y-4">
      <div className="text-center space-y-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Future Value</p>
          <p className="text-3xl font-bold text-[#1a3a8a]">${futureValue.toFixed(2)}</p>
        </div>
        {inflationRate !== undefined && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Inflation-Adjusted (Real) Value</p>
            <p className="text-xl font-bold text-amber-600">${realFutureValue.toFixed(2)}</p>
          </div>
        )}
        {taxRate !== undefined && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">After-Tax Value ({taxRate}% rate)</p>
            <p className="text-xl font-bold text-[#06b6d4]">${afterTaxValue.toFixed(2)}</p>
          </div>
        )}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Contributions</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">${totalContributions.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Interest</p>
          <p className="text-xl font-bold text-[#1a3a8a]">${Math.max(0, totalInterest).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Return Multiple</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{totalContributions > 0 ? (futureValue / totalContributions).toFixed(2) : 1.00}x</p>
        </div>
        {hasAdjustments && (
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs text-blue-700 dark:text-blue-300">
            {feePercent !== undefined && <p>Fee adjustment: {feePercent}%</p>}
            {inflationRate !== undefined && <p>Inflation adjustment: {inflationRate}%</p>}
            {taxRate !== undefined && <p>Tax adjustment: {taxRate}%</p>}
          </div>
        )}
      </div>
      <InvestmentGrowthChart data={growthData} />
    </div>
  )
}

function MortgageResults({ price, down, rate, term, propertyTax, homeInsurance, pmiRate, hoa, extraPayment, frequency, extraFields }: {
  price: number; down: number; rate: number; term: number
  propertyTax: number; homeInsurance: number; pmiRate: number; hoa: number; extraPayment: number
  frequency?: string
  extraFields?: Record<string, string>
}) {
  const n = (v: string | undefined) => { const p = parseFloat(v || ''); return isNaN(p) ? undefined : p }
  const inflationRate = n(extraFields?.extra_inflation_rate)
  const effectiveRate = inflationRate !== undefined ? rate - inflationRate : rate
  const principal = price - down
  const freq = frequency || 'monthly'
  const isBiweekly = freq === 'biweekly' || freq === 'accelerated'
  const periodsPerYear = isBiweekly ? 26 : 12
  const periodicRate = effectiveRate / 100 / periodsPerYear
  const numPeriods = term * periodsPerYear
  let periodicPayment = 0
  if (periodicRate > 0 && numPeriods > 0 && principal > 0) {
    const factor = Math.pow(1 + periodicRate, numPeriods)
    periodicPayment = principal * (periodicRate * factor) / (factor - 1)
  } else if (numPeriods > 0 && principal > 0) {
    periodicPayment = principal / numPeriods
  }
  const monthlyTax = propertyTax / 12
  const monthlyInsurance = homeInsurance / 12
  const monthlyPMI = pmiRate > 0 ? (principal * (pmiRate / 100)) / 12 : 0
  const monthlyPITI = monthlyTax + monthlyInsurance + monthlyPMI + hoa
  const paymentLabel = isBiweekly ? 'Bi-Weekly Payment' : 'Monthly Payment'
  const paymentPeriodLabel = isBiweekly ? 'bi-weekly' : '/mo'
  const totalPayment = periodicPayment * numPeriods
  const totalInterest = totalPayment - principal

  // Extra payment impact
  let payoffPeriods = numPeriods
  let totalWithExtra = totalPayment
  const extraPerPeriod = isBiweekly ? extraPayment / 2 : extraPayment
  if (extraPerPeriod > 0 && periodicRate >= 0) {
    let balance = principal
    let totalInt = 0
    let count = 0
    while (balance > 0 && count < 600) {
      const interest = balance * periodicRate
      let princPortion = periodicPayment - interest + extraPerPeriod
      if (princPortion > balance) princPortion = balance
      balance -= princPortion
      totalInt += interest
      count++
      if (balance < 0) balance = 0
    }
    payoffPeriods = count
    totalWithExtra = principal + totalInt
  }

  const annualPaymentTotal = periodicPayment * periodsPerYear
  const monthlyEquivalent = annualPaymentTotal / 12
  const totalMonthly = monthlyEquivalent + monthlyPITI + extraPayment

  return (
    <div className="space-y-4">
      <div className="text-center space-y-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{paymentLabel}</p>
          <p className="text-3xl font-bold text-[#1a3a8a]">${periodicPayment.toFixed(2)}</p>
          {isBiweekly && <p className="text-xs text-gray-400 mt-1">˜ ${monthlyEquivalent.toFixed(2)}/mo equivalent</p>}
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-gray-400">Principal + Interest</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">${periodicPayment.toFixed(2)} {paymentPeriodLabel}</p>
          </div>
          <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-gray-400">Total Monthly (inc. taxes/fees)</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">${totalMonthly.toFixed(2)}</p>
          </div>
          {propertyTax > 0 && <div className="p-2 bg-white dark:bg-gray-800 rounded-lg"><p className="text-gray-400">Property Tax</p><p className="text-sm font-bold text-gray-900 dark:text-white">${monthlyTax.toFixed(2)}/mo</p></div>}
          {homeInsurance > 0 && <div className="p-2 bg-white dark:bg-gray-800 rounded-lg"><p className="text-gray-400">Insurance</p><p className="text-sm font-bold text-gray-900 dark:text-white">${monthlyInsurance.toFixed(2)}/mo</p></div>}
          {pmiRate > 0 && <div className="p-2 bg-white dark:bg-gray-800 rounded-lg"><p className="text-gray-400">PMI</p><p className="text-sm font-bold text-amber-500">${monthlyPMI.toFixed(2)}/mo</p></div>}
          {hoa > 0 && <div className="p-2 bg-white dark:bg-gray-800 rounded-lg"><p className="text-gray-400">HOA</p><p className="text-sm font-bold text-gray-900 dark:text-white">${hoa.toFixed(2)}/mo</p></div>}
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loan Amount</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">${principal.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Interest</p>
          <p className="text-xl font-bold text-[#d62828]">${totalInterest.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Down Payment</p>
          <p className="text-lg font-bold text-[#06b6d4]">${down.toFixed(2)} ({price > 0 ? ((down / price) * 100).toFixed(1) : 0}%)</p>
        </div>
        {periodsPerYear > 12 && (
          <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm font-medium text-green-700 dark:text-green-300">{periodsPerYear} payments/year — saves ${(monthlyEquivalent * term * 12 - totalPayment).toFixed(0)} in interest vs monthly</p>
          </div>
        )}
        {extraPerPeriod > 0 && (
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Extra ${extraPerPeriod.toFixed(2)}/{isBiweekly ? '2wks' : 'mo'} saves {numPeriods > 0 ? Math.round(numPeriods - payoffPeriods) : 0} payments & ${(totalPayment - totalWithExtra).toFixed(0)} in interest</p>
          </div>
        )}
      </div>
      <LoanDonutChart principal={principal} totalInterest={totalInterest} />
    </div>
  )
}

function RetirementResults({ age, retirementAge, savings, monthly, rate, extraFields }: { age: number; retirementAge: number; savings: number; monthly: number; rate: number; extraFields?: Record<string, string> }) {
  const years = Math.max(0, retirementAge - age)
  const monthlyRate = rate / 100 / 12
  const months = years * 12
  let futureValue = savings
  if (monthlyRate > 0) {
    futureValue = savings * Math.pow(1 + monthlyRate, months) + monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
  } else {
    futureValue = savings + monthly * months
  }
  const withdrawalRate = futureValue * 0.04
  const growthData = Array.from({ length: Math.max(years, 1) }, (_, i) => {
    const y = i + 1
    const m = y * 12
    let val = savings
    if (monthlyRate > 0) {
      val = savings * Math.pow(1 + monthlyRate, m) + monthly * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate)
    } else {
      val = savings + monthly * m
    }
    return { year: age + y, value: val, contributions: savings + monthly * m }
  })
  return (
    <div className="space-y-4">
      <div className="text-center space-y-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Projected Savings at {retirementAge}</p>
          <p className="text-3xl font-bold text-[#1a3a8a]">${futureValue.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Est. Annual Income (4% Rule)</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">${withdrawalRate.toFixed(2)}/yr</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Contribution</p>
          <p className="text-xl font-bold text-[#1a3a8a]">${monthly.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Years to Retirement</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{years} years</p>
        </div>
      </div>
      {growthData.length > 0 && <InvestmentGrowthChart data={growthData} />}
    </div>
  )
}

function SalaryResults({ amount, period, extraFields }: { amount: number; period: string; extraFields?: Record<string, string> }) {
  const annualMap: Record<string, number> = {
    hourly: amount * 2080,
    weekly: amount * 52,
    monthly: amount * 12,
    annual: amount,
  }
  const annual = annualMap[period] || amount
  const monthly = annual / 12
  const weekly = annual / 52
  const hourly = annual / 2080
  return (
    <div className="text-center space-y-3">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Annual Salary</p>
        <p className="text-2xl font-bold text-[#1a3a8a]">${annual.toFixed(2)}</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg"><p className="text-xs text-gray-500">Monthly</p><p className="text-sm font-bold text-gray-900 dark:text-white">${monthly.toFixed(2)}</p></div>
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg"><p className="text-xs text-gray-500">Weekly</p><p className="text-sm font-bold text-gray-900 dark:text-white">${weekly.toFixed(2)}</p></div>
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg"><p className="text-xs text-gray-500">Hourly</p><p className="text-sm font-bold text-gray-900 dark:text-white">${hourly.toFixed(2)}</p></div>
      </div>
    </div>
  )
}

function DebtResults({ balance, rate, monthly, extraFields }: { balance: number; rate: number; monthly: number; extraFields?: Record<string, string> }) {
  const monthlyRate = rate / 100 / 12
  let months = 0
  let totalInterest = 0
  let remaining = balance
  if (monthlyRate > 0 && monthly > remaining * monthlyRate) {
    while (remaining > 0 && months < 600) {
      const interest = remaining * monthlyRate
      const principal = monthly - interest
      remaining -= principal
      totalInterest += interest
      months++
      if (remaining < 0) remaining = 0
    }
  } else if (monthlyRate <= 0) {
    months = Math.ceil(balance / monthly)
  }
  return (
    <div className="text-center space-y-4">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Payoff Time</p>
        <p className="text-3xl font-bold text-[#1a3a8a]">{months} months ({Math.floor(months / 12)}yr {months % 12}mo)</p>
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Total Interest</p>
        <p className="text-xl font-bold text-[#d62828]">${totalInterest.toFixed(2)}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Total Cost</p>
        <p className="text-xl font-bold text-gray-900 dark:text-white">${(balance + totalInterest).toFixed(2)}</p>
      </div>
    </div>
  )
}

function BudgetResults({ income, housing, food, transport, utilities, other }: { income: number; housing: number; food: number; transport: number; utilities: number; other: number }) {
  const totalExpenses = housing + food + transport + utilities + other
  const remaining = income - totalExpenses
  const categories = [
    { name: 'Housing', value: housing, color: '#06b6d4' },
    { name: 'Food', value: food, color: '#06b6d4' },
    { name: 'Transport', value: transport, color: '#f77f00' },
    { name: 'Utilities', value: utilities, color: '#d62828' },
    { name: 'Other', value: other, color: '#6b7280' },
  ].filter(c => c.value > 0)
  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalExpenses.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Remaining</p>
          <p className={`text-xl font-bold ${remaining >= 0 ? 'text-[#1a3a8a]' : 'text-[#d62828]'}`}>${remaining.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Savings Rate</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{income > 0 ? ((remaining / income) * 100).toFixed(1) : 0}%</p>
        </div>
      </div>
      {categories.length > 0 && (
        <div className="h-40">
          <ComparisonBarChart data={categories} />
        </div>
      )}
    </div>
  )
}

function TaxResults({ income, rate, extraFields }: { income: number; rate: number; extraFields?: Record<string, string> }) {
  const tax = income * (rate / 100)
  const afterTax = income - tax
  return (
    <div className="text-center space-y-4">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Tax Amount</p>
        <p className="text-3xl font-bold text-[#d62828]">${tax.toFixed(2)}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">After-Tax Income</p>
        <p className="text-xl font-bold text-[#1a3a8a]">${afterTax.toFixed(2)}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Effective Rate</p>
        <p className="text-lg font-bold text-gray-900 dark:text-white">{rate}%</p>
      </div>
    </div>
  )
}

function SimpleInterestResults({ principal, rate, years }: { principal: number; rate: number; years: number }) {
  const interest = principal * (rate / 100) * years; const total = principal + interest
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Interest Earned</p><p className="text-3xl font-bold text-[#1a3a8a]">${interest.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Total Amount</p><p className="text-xl font-bold text-gray-900">${total.toFixed(2)}</p></div><div className="text-xs text-gray-400">I = ${principal.toFixed(0)} × {rate}% × {years}yr = ${interest.toFixed(2)}<br/>A = ${principal.toFixed(0)} + ${interest.toFixed(2)} = ${total.toFixed(2)}</div></div>
}
function ApyCalcResults({ rate, compound, years }: { rate: number; compound: string; years: number }) {
  const r = rate / 100; const n = compound === 'monthly' ? 12 : compound === 'quarterly' ? 4 : 1
  const apy = (Math.pow(1 + r / n, n) - 1) * 100; const doublingTime = 72 / rate; const growth = Math.pow(1 + r / n, n * years)
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">APY</p><p className="text-3xl font-bold text-[#1a3a8a]">{apy.toFixed(3)}%</p></div><div><p className="text-sm text-gray-500">Growth Factor ({years}yr)</p><p className="text-xl font-bold text-gray-900">{(growth).toFixed(4)}x</p></div><div><p className="text-sm text-gray-500">Rule of 72 Doubling</p><p className="text-lg font-bold text-gray-900">~{doublingTime.toFixed(1)} years</p></div></div>
}
function FutureValueResults({ present, rate, years, monthlyAdd }: { present: number; rate: number; years: number; monthlyAdd: number }) {
  const mr = rate / 100 / 12; const m = years * 12; let fv = 0
  if (mr > 0) fv = present * Math.pow(1 + mr, m) + monthlyAdd * ((Math.pow(1 + mr, m) - 1) / mr); else fv = present + monthlyAdd * m
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Future Value</p><p className="text-3xl font-bold text-[#1a3a8a]">${fv.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Total Contributions</p><p className="text-xl font-bold text-gray-900">${(present + monthlyAdd * m).toFixed(2)}</p></div></div>
}
function PresentValueResults({ present, rate, years }: { present: number; rate: number; years: number }) {
  const r = rate / 100; const pv = present / Math.pow(1 + r, years)
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Present Value</p><p className="text-3xl font-bold text-[#1a3a8a]">${pv.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Discount Factor</p><p className="text-xl font-bold text-gray-900">{(1 / Math.pow(1 + r, years)).toFixed(4)}</p></div><div className="text-xs text-gray-400">PV = ${present.toFixed(0)} / (1+{rate}%)^{years} = ${pv.toFixed(2)}</div></div>
}
function RoiResults({ initial, final, years }: { initial: number; final: number; years: number }) {
  const roi = ((final - initial) / initial) * 100; const annualRoi = years > 0 ? (Math.pow(final / initial, 1 / years) - 1) * 100 : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Total ROI</p><p className="text-3xl font-bold text-[#1a3a8a]">{roi.toFixed(2)}%</p></div><div><p className="text-sm text-gray-500">Annualized (CAGR)</p><p className="text-xl font-bold text-gray-900">{annualRoi.toFixed(2)}%</p></div><div><p className="text-sm text-gray-500">Total Gain</p><p className="text-lg font-bold text-[#06b6d4]">${(final - initial).toFixed(2)}</p></div></div>
}
function NpvResults({ initial, cashFlows, rate, years }: { initial: number; cashFlows: number; rate: number; years: number }) {
  const r = rate / 100; let npv = -initial; for (let y = 1; y <= years; y++) npv += cashFlows / Math.pow(1 + r, y)
  return <div className="text-center space-y-3"><div><p className={`text-sm ${npv >= 0 ? 'text-[#1a3a8a]' : 'text-[#d62828]'}`}>NPV</p><p className={`text-3xl font-bold ${npv >= 0 ? 'text-[#1a3a8a]' : 'text-[#d62828]'}`}>${npv.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">{npv >= 0 ? 'Accept investment' : 'Reject investment'}</p></div></div>
}
function IrrResults({ initial, cashFlow, years }: { initial: number; cashFlow: number; years: number }) {
  let irr = 0.1; for (let it = 0; it < 1000; it++) { let npv = -initial; for (let y = 1; y <= years; y++) npv += cashFlow / Math.pow(1 + irr, y); const d = -years * cashFlow / Math.pow(1 + irr, years + 1); if (Math.abs(npv) < 0.001) break; if (d !== 0) irr -= npv / d; if (irr <= 0) { irr = 0.05; break } }
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">IRR</p><p className="text-3xl font-bold text-[#1a3a8a]}">{(irr * 100).toFixed(2)}%</p></div><div><p className="text-sm text-gray-500">{irr > 0 ? 'Profitable' : 'Not profitable'}</p></div></div>
}
function PaybackResults({ initial, cashFlow }: { initial: number; cashFlow: number }) {
  const payback = cashFlow > 0 ? initial / cashFlow : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Payback Period</p><p className="text-3xl font-bold text-[#1a3a8a]">{payback > 0 ? payback.toFixed(1) : 'N/A'} years</p></div><div><p className="text-sm text-gray-500">{(payback * 12).toFixed(0)} months</p></div></div>
}
function BreakEvenResults({ fixedCosts, pricePerUnit, varCostPerUnit }: { fixedCosts: number; pricePerUnit: number; varCostPerUnit: number }) {
  const cm = pricePerUnit - varCostPerUnit; const beUnits = cm > 0 ? Math.ceil(fixedCosts / cm) : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Break-Even Units</p><p className="text-3xl font-bold text-[#1a3a8a]">{beUnits.toLocaleString()} units</p></div><div><p className="text-sm text-gray-500">Break-Even Revenue</p><p className="text-xl font-bold text-gray-900">${(beUnits * pricePerUnit).toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Contribution Margin</p><p className="text-lg font-bold text-[#06b6d4]">${cm.toFixed(2)}/unit</p></div></div>
}
function BondYieldResults({ price, faceValue, coupon, years }: { price: number; faceValue: number; coupon: number; years: number }) {
  const curYield = price > 0 ? (coupon / price) * 100 : 0; const ytm = years > 0 ? ((faceValue - price) / years + coupon) / ((faceValue + price) / 2) * 100 : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Current Yield</p><p className="text-3xl font-bold text-[#1a3a8a]">{curYield.toFixed(2)}%</p></div><div><p className="text-sm text-gray-500">Est. YTM</p><p className="text-xl font-bold text-gray-900">{ytm.toFixed(2)}%</p></div><div><p className="text-sm text-gray-500">Annual Coupon</p><p className="text-lg font-bold text-[#06b6d4]">${coupon.toFixed(2)}</p></div></div>
}
function BondPriceResults({ faceValue, coupon, rate, years }: { faceValue: number; coupon: number; rate: number; years: number }) {
  const r = rate / 100; let pvC = 0; for (let y = 1; y <= years; y++) pvC += coupon / Math.pow(1 + r, y); const pvF = faceValue / Math.pow(1 + r, years); const bp = pvC + pvF
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Bond Price</p><p className="text-3xl font-bold text-[#1a3a8a]">${bp.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">{bp > faceValue ? 'Premium' : bp < faceValue ? 'Discount' : 'Par'}</p></div></div>
}
function CouponPaymentResults({ faceValue, couponRate, freq }: { faceValue: number; couponRate: number; freq: string }) {
  const perYear = freq === 'annual' ? 1 : freq === 'semiannual' ? 2 : 4; const pmt = faceValue * (couponRate / 100) / perYear
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Coupon Payment</p><p className="text-3xl font-bold text-[#1a3a8a]">${pmt.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Annual Income</p><p className="text-xl font-bold text-gray-900">${(pmt * perYear).toFixed(2)}</p></div></div>
}
function TaxEquivYieldResults({ muniYield, taxRate }: { muniYield: number; taxRate: number }) {
  const tey = muniYield / (1 - taxRate / 100)
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Tax-Equivalent Yield</p><p className="text-3xl font-bold text-[#1a3a8a]">{tey.toFixed(3)}%</p></div><div><p className="text-sm text-gray-500">Need {tey.toFixed(2)}% taxable to match {muniYield}% muni at {taxRate}% bracket</p></div></div>
}
function DividendYieldResults({ pricePerShare, annualDividend }: { pricePerShare: number; annualDividend: number }) {
  const y = pricePerShare > 0 ? (annualDividend / pricePerShare) * 100 : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Dividend Yield</p><p className="text-3xl font-bold text-[#1a3a8a]">{y.toFixed(2)}%</p></div><div><p className="text-sm text-gray-500">Annual Income/Share</p><p className="text-xl font-bold text-gray-900">${annualDividend.toFixed(2)}</p></div></div>
}
function DividendPayoutResults({ dividends, netIncome }: { dividends: number; netIncome: number }) {
  const r = netIncome > 0 ? (dividends / netIncome) * 100 : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Payout Ratio</p><p className="text-3xl font-bold text-[#1a3a8a]">{r.toFixed(1)}%</p></div><div><p className="text-sm text-gray-500">Retention Ratio</p><p className="text-xl font-bold text-gray-900">{(100 - r).toFixed(1)}%</p></div></div>
}
function EpsResults({ netIncome, shares }: { netIncome: number; shares: number }) {
  const eps = shares > 0 ? netIncome / shares : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Earnings Per Share</p><p className="text-3xl font-bold text-[#1a3a8a]">${eps.toFixed(2)}</p></div></div>
}
function PeResults({ price, eps }: { price: number; eps: number }) {
  const pe = eps > 0 ? price / eps : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">P/E Ratio</p><p className="text-3xl font-bold text-[#1a3a8a]">{pe.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Earnings Yield</p><p className="text-lg font-bold text-gray-900">{pe > 0 ? `${(1/pe*100).toFixed(2)}%` : 'N/A'}</p></div></div>
}
function PbResults({ price, bookValue }: { price: number; bookValue: number }) {
  const pb = bookValue > 0 ? price / bookValue : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">P/B Ratio</p><p className="text-3xl font-bold text-[#1a3a8a]">{pb.toFixed(2)}</p></div></div>
}
function PsResults({ price, salesPerShare }: { price: number; salesPerShare: number }) {
  const ps = salesPerShare > 0 ? price / salesPerShare : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">P/S Ratio</p><p className="text-3xl font-bold text-[#1a3a8a]">{ps.toFixed(2)}</p></div></div>
}
function PegResults({ pe, growth }: { pe: number; growth: number }) {
  const peg = growth > 0 ? pe / growth : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">PEG Ratio</p><p className="text-3xl font-bold text-[#1a3a8a]">{peg.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">{peg < 1 ? 'Undervalued' : peg < 2 ? 'Fair' : 'Overvalued'}</p></div></div>
}
function DividendGrowthResults({ currentDividend, years, priorDividend }: { currentDividend: number; years: number; priorDividend: number }) {
  const cagr = priorDividend > 0 && years > 0 ? (Math.pow(currentDividend / priorDividend, 1 / years) - 1) * 100 : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Dividend Growth Rate (CAGR)</p><p className="text-3xl font-bold text-[#1a3a8a]">{cagr.toFixed(2)}%</p></div></div>
}
function PayoutRatioResults({ dividendsPerShare, eps }: { dividendsPerShare: number; eps: number }) {
  const r = eps > 0 ? (dividendsPerShare / eps) * 100 : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Payout Ratio</p><p className="text-3xl font-bold text-[#1a3a8a]">{r.toFixed(1)}%</p></div></div>
}
function RetentionRatioResults({ payoutRatio }: { payoutRatio: number }) {
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Retention Ratio</p><p className="text-3xl font-bold text-[#1a3a8a]">{(100 - payoutRatio).toFixed(1)}%</p></div></div>
}
function StockAvgCostResults({ shares, totalCost, newShares, newPrice }: { shares: number; totalCost: number; newShares: number; newPrice: number }) {
  const oldAvg = shares > 0 ? totalCost / shares : 0; const tshares = shares + newShares; const tcost = totalCost + newShares * newPrice; const navg = tshares > 0 ? tcost / tshares : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">New Average Cost</p><p className="text-3xl font-bold text-[#1a3a8a]">${navg.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Original Avg: ${oldAvg.toFixed(2)} | Total Shares: {tshares}</p></div></div>
}
function DcaResults({ monthlyInvest, pricePerShare, months }: { monthlyInvest: number; pricePerShare: number; months: number }) {
  const tshares = pricePerShare > 0 ? (monthlyInvest / pricePerShare) * months : 0; const tInvested = monthlyInvest * months; const avgCost = tshares > 0 ? tInvested / tshares : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Shares Accumulated</p><p className="text-3xl font-bold text-[#1a3a8a]">{tshares.toFixed(4)}</p></div><div><p className="text-sm text-gray-500">Invested: ${tInvested.toFixed(2)} | Avg Cost: ${avgCost.toFixed(2)}</p></div></div>
}
function CostBasisResults({ purchasePrice, shares, commissions }: { purchasePrice: number; shares: number; commissions: number }) {
  const tc = purchasePrice * shares + commissions
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Cost Basis</p><p className="text-3xl font-bold text-[#1a3a8a]">${tc.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">${(tc / shares).toFixed(2)}/share</p></div></div>
}
function PortfolioReturnResults({ return1, weight1, return2, weight2 }: { return1: number; weight1: number; weight2: number; return2: number }) {
  const tw = weight1 + weight2; const w1 = tw > 0 ? weight1 / tw : 0; const w2 = tw > 0 ? weight2 / tw : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Portfolio Return</p><p className="text-3xl font-bold text-[#1a3a8a]">{(w1 * return1 + w2 * return2).toFixed(2)}%</p></div><div><p className="text-sm text-gray-500">Allocation: {(w1*100).toFixed(0)}% / {(w2*100).toFixed(0)}%</p></div></div>
}
function SharpeResults({ portfolioReturn, riskFreeRate, stdDev }: { portfolioReturn: number; riskFreeRate: number; stdDev: number }) {
  const s = stdDev > 0 ? (portfolioReturn - riskFreeRate) / stdDev : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Sharpe Ratio</p><p className="text-3xl font-bold text-[#1a3a8a]">{s.toFixed(2)}</p></div></div>
}
function SortinoResults({ portfolioReturn, riskFreeRate, downsideDev }: { portfolioReturn: number; riskFreeRate: number; downsideDev: number }) {
  const s = downsideDev > 0 ? (portfolioReturn - riskFreeRate) / downsideDev : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Sortino Ratio</p><p className="text-3xl font-bold text-[#1a3a8a]">{s.toFixed(2)}</p></div></div>
}
function AlphaResults({ portfolioReturn, riskFreeRate, beta, marketReturn }: { portfolioReturn: number; riskFreeRate: number; beta: number; marketReturn: number }) {
  const expected = riskFreeRate + beta * (marketReturn - riskFreeRate); const alpha = portfolioReturn - expected
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Alpha (Jensen's)</p><p className="text-3xl font-bold text-[#1a3a8a]">{alpha.toFixed(2)}%</p></div></div>
}
function BetaResults({ stockReturn, marketReturn }: { stockReturn: number; marketReturn: number }) {
  const b = marketReturn !== 0 ? stockReturn / marketReturn : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Beta</p><p className="text-3xl font-bold text-[#1a3a8a]">{b.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">{b > 1 ? 'More volatile' : b < 1 ? 'Less volatile' : 'In line with market'}</p></div></div>
}
function RSquaredResults({ correlation }: { correlation: number }) {
  const r2 = correlation * correlation
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">R-Squared</p><p className="text-3xl font-bold text-[#1a3a8a]">{r2.toFixed(4)}</p></div><div><p className="text-sm text-gray-500">{(r2*100).toFixed(1)}% of variance explained</p></div></div>
}
function VaRResults({ portfolioValue, meanReturn, stdDev, confidence }: { portfolioValue: number; meanReturn: number; stdDev: number; confidence: string }) {
  const z = confidence === '99' ? 2.326 : 1.645; const varPct = meanReturn - z * stdDev; const varAmt = portfolioValue * (varPct / 100)
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">VaR ({confidence}% confidence)</p><p className="text-3xl font-bold text-[#d62828]">${Math.abs(varAmt).toFixed(2)}</p></div></div>
}
function DtiResults({ monthlyDebt, monthlyIncome }: { monthlyDebt: number; monthlyIncome: number }) {
  const dti = monthlyIncome > 0 ? (monthlyDebt / monthlyIncome) * 100 : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">DTI Ratio</p><p className={`text-3xl font-bold ${dti > 43 ? 'text-[#d62828]' : dti > 36 ? 'text-amber-500' : 'text-[#1a3a8a]'}`}>{dti.toFixed(1)}%</p></div><div><p className="text-sm text-gray-500">{dti > 43 ? 'High risk' : dti > 36 ? 'Moderate' : 'Healthy'}</p></div></div>
}
function LtvResults({ loanAmount, propertyValue }: { loanAmount: number; propertyValue: number }) {
  const ltv = propertyValue > 0 ? (loanAmount / propertyValue) * 100 : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">LTV Ratio</p><p className={`text-3xl font-bold ${ltv > 80 ? 'text-amber-500' : 'text-[#1a3a8a]'}`}>{ltv.toFixed(1)}%</p></div></div>
}
function DscrResults({ noi, debtService }: { noi: number; debtService: number }) {
  const r = debtService > 0 ? noi / debtService : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">DSCR</p><p className={`text-3xl font-bold ${r >= 1.25 ? 'text-[#1a3a8a]' : 'text-amber-500'}`}>{r.toFixed(2)}</p></div></div>
}
function CoverageResults({ ebit, interestExpense }: { ebit: number; interestExpense: number }) {
  const r = interestExpense > 0 ? ebit / interestExpense : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Interest Coverage</p><p className={`text-3xl font-bold ${r >= 2 ? 'text-[#1a3a8a]' : 'text-amber-500'}`}>{r.toFixed(2)}x</p></div></div>
}
function WorkingCapitalResults({ currentAssets, currentLiabilities }: { currentAssets: number; currentLiabilities: number }) {
  const wc = currentAssets - currentLiabilities; const cr = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Working Capital</p><p className="text-3xl font-bold text-[#1a3a8a]">${wc.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Current Ratio: {cr.toFixed(2)}</p></div></div>
}
function TurnoverResults({ cogs, avgInventory }: { cogs: number; avgInventory: number }) {
  const t = avgInventory > 0 ? cogs / avgInventory : 0; const days = t > 0 ? 365 / t : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Inventory Turnover</p><p className="text-3xl font-bold text-[#1a3a8a]">{t.toFixed(1)}x</p></div><div><p className="text-sm text-gray-500">{days.toFixed(0)} days in inventory</p></div></div>
}
function AssetTurnoverResults({ revenue, avgAssets }: { revenue: number; avgAssets: number }) {
  const r = avgAssets > 0 ? revenue / avgAssets : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Asset Turnover</p><p className="text-3xl font-bold text-[#1a3a8a]">{r.toFixed(3)}x</p></div></div>
}
function RoaRoeResults({ netIncome, avgEquity, avgAssets }: { netIncome: number; avgEquity: number; avgAssets: number }) {
  const roa = avgAssets > 0 ? (netIncome / avgAssets) * 100 : 0; const roe = avgEquity > 0 ? (netIncome / avgEquity) * 100 : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">ROA</p><p className="text-2xl font-bold text-[#1a3a8a]">{roa.toFixed(2)}%</p></div><div><p className="text-sm text-gray-500">ROE</p><p className="text-2xl font-bold text-gray-900">{roe.toFixed(2)}%</p></div></div>
}
function DebtRatioResults({ totalDebt, totalEquity, totalAssets }: { totalDebt: number; totalEquity: number; totalAssets: number }) {
  const dte = totalEquity > 0 ? (totalDebt / totalEquity) * 100 : 0; const dta = totalAssets > 0 ? (totalDebt / totalAssets) * 100 : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">D/E</p><p className="text-2xl font-bold text-[#1a3a8a]">{dte.toFixed(1)}%</p></div><div><p className="text-sm text-gray-500">D/A</p><p className="text-2xl font-bold text-gray-900">{dta.toFixed(1)}%</p></div></div>
}
function RentVsBuyResults({ rent, homePrice, downPayment, rate, years, propertyTax }: { rent: number; homePrice: number; downPayment: number; rate: number; years: number; propertyTax: number }) {
  const principal = homePrice - downPayment; const mr = rate / 100 / 12; const np = years * 12; let mp = 0
  if (mr > 0 && np > 0 && principal > 0) { const f = Math.pow(1 + mr, np); mp = principal * (mr * f) / (f - 1) }
  const totalRent = rent * 12 * years; const totalBuy = mp * np + downPayment + propertyTax * years
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Total Rent ({years}yr)</p><p className="text-2xl font-bold text-[#d62828]">${totalRent.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Total Buy</p><p className="text-2xl font-bold text-[#1a3a8a]">${totalBuy.toFixed(2)}</p></div><div><p className={`text-sm font-bold ${totalBuy < totalRent ? 'text-[#1a3a8a]' : 'text-[#d62828]'}`}>{totalBuy < totalRent ? 'Buying wins' : 'Renting wins'}</p></div></div>
}
function AffordabilityResults({ income, rate, downPayment, term }: { income: number; rate: number; downPayment: number; term: number }) {
  const maxPmt = (income / 12) * 0.28; const mr = rate / 100 / 12; const np = term * 12; let maxLoan = 0
  if (mr > 0) maxLoan = maxPmt * ((Math.pow(1 + mr, np) - 1) / (mr * Math.pow(1 + mr, np))); else if (np > 0) maxLoan = maxPmt * np
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Max Home Price</p><p className="text-3xl font-bold text-[#1a3a8a]">${(maxLoan + downPayment).toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Max Loan: ${maxLoan.toFixed(2)} | Max Payment: ${maxPmt.toFixed(2)}</p></div></div>
}
function ClosingCostsResults({ homePrice, downPayment }: { homePrice: number; downPayment: number }) {
  const loan = homePrice - downPayment; const orig = loan * 0.01; const costs = orig + 500 + 1200 + 400 + 800
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Total Closing Costs</p><p className="text-3xl font-bold text-[#1a3a8a]">${costs.toFixed(2)}</p></div></div>
}
function RentalIncomeResults({ monthlyRent, expenses, downPayment, propertyValue }: { monthlyRent: number; expenses: number; downPayment: number; propertyValue: number }) {
  const ano = (monthlyRent - expenses) * 12; const cr = propertyValue > 0 ? (ano / propertyValue) * 100 : 0; const coc = downPayment > 0 ? (ano / downPayment) * 100 : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Annual NOI</p><p className="text-2xl font-bold text-[#1a3a8a]">${ano.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Cap Rate: {cr.toFixed(2)}% | CoC: {coc.toFixed(2)}%</p></div></div>
}
function CapRateResults({ noi, propertyValue }: { noi: number; propertyValue: number }) {
  const r = propertyValue > 0 ? (noi / propertyValue) * 100 : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Cap Rate</p><p className="text-3xl font-bold text-[#1a3a8a]">{r.toFixed(2)}%</p></div></div>
}
function CashOnCashResults({ annualCashFlow, totalInvested }: { annualCashFlow: number; totalInvested: number }) {
  const r = totalInvested > 0 ? (annualCashFlow / totalInvested) * 100 : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Cash-on-Cash Return</p><p className="text-3xl font-bold text-[#1a3a8a]">{r.toFixed(2)}%</p></div></div>
}
function NoiResults({ rentalIncome, vacancyRate, operatingExpenses }: { rentalIncome: number; vacancyRate: number; operatingExpenses: number }) {
  const eff = rentalIncome * (1 - vacancyRate / 100); const noi = eff - operatingExpenses
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Net Operating Income</p><p className="text-3xl font-bold text-[#1a3a8a]">${noi.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Effective Income: ${eff.toFixed(2)}</p></div></div>
}
function TaxBracketResults({ income, bracketStart, bracketRate, baseTax }: { income: number; bracketStart: number; bracketRate: number; baseTax: number }) {
  const marginal = Math.max(0, income - bracketStart) * (bracketRate / 100); const total = baseTax + marginal
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Total Tax</p><p className="text-3xl font-bold text-[#d62828]">${total.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Marginal Tax: ${marginal.toFixed(2)} | Effective: {income > 0 ? `${(total/income*100).toFixed(2)}%` : 'N/A'}</p></div></div>
}
function MarginalTaxResults({ income, additionalIncome, rate }: { income: number; additionalIncome: number; rate: number }) {
  const extraTax = additionalIncome * (rate / 100)
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Extra Tax on ${additionalIncome.toFixed(0)}</p><p className="text-3xl font-bold text-[#d62828]">${extraTax.toFixed(2)}</p></div></div>
}
function EffectiveTaxResults({ totalTax, totalIncome }: { totalTax: number; totalIncome: number }) {
  const r = totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Effective Tax Rate</p><p className="text-3xl font-bold text-[#1a3a8a]">{r.toFixed(2)}%</p></div></div>
}
function CapitalGainsResults({ costBasis, salePrice, taxRate }: { costBasis: number; salePrice: number; taxRate: number }) {
  const gain = salePrice - costBasis; const tax = gain > 0 ? gain * (taxRate / 100) : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Capital Gain</p><p className="text-2xl font-bold text-[#1a3a8a]">${gain.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Tax Due</p><p className="text-2xl font-bold text-[#d62828]">${tax.toFixed(2)}</p></div></div>
}
function DividendTaxResults({ dividends, taxRate }: { dividends: number; taxRate: number }) {
  const tax = dividends * (taxRate / 100)
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Dividend Tax</p><p className="text-3xl font-bold text-[#d62828]">${tax.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">After-Tax: ${(dividends - tax).toFixed(2)}</p></div></div>
}
function SelfEmploymentResults({ netEarnings, expenseRate }: { netEarnings: number; expenseRate: number }) {
  const taxable = netEarnings * (1 - expenseRate / 100); const seTax = taxable * 0.153
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Self-Employment Tax</p><p className="text-3xl font-bold text-[#d62828]">${seTax.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Taxable Income: ${taxable.toFixed(2)}</p></div></div>
}
function SalesTaxResults({ price, taxRate }: { price: number; taxRate: number }) {
  const tax = price * (taxRate / 100)
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Sales Tax</p><p className="text-3xl font-bold text-[#d62828]">${tax.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Total: ${(price + tax).toFixed(2)}</p></div></div>
}
function VatResults({ price, vatRate }: { price: number; vatRate: number }) {
  const vat = price * (vatRate / 100)
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">VAT Amount</p><p className="text-3xl font-bold text-[#d62828]">${vat.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Total: ${(price + vat).toFixed(2)}</p></div></div>
}
function EstateTaxResults({ estateValue, exemption, taxRate }: { estateValue: number; exemption: number; taxRate: number }) {
  const taxable = Math.max(0, estateValue - exemption); const tax = taxable * (taxRate / 100)
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Taxable Estate</p><p className="text-2xl font-bold text-[#1a3a8a]">${taxable.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Tax Due</p><p className="text-2xl font-bold text-[#d62828]">${tax.toFixed(2)}</p></div></div>
}
function TaxRefundResults({ withheld, taxLiability }: { withheld: number; taxLiability: number }) {
  const diff = withheld - taxLiability
  return <div className="text-center space-y-3"><div><p className={`text-sm ${diff >= 0 ? 'text-[#1a3a8a]' : 'text-[#d62828]'}`}>{diff >= 0 ? 'Refund' : 'Amount Due'}</p><p className={`text-3xl font-bold ${diff >= 0 ? 'text-[#1a3a8a]' : 'text-[#d62828]'}`}>${Math.abs(diff).toFixed(2)}</p></div></div>
}
function ItemizedResults({ income, itemized, standard }: { income: number; itemized: number; standard: number }) {
  const best = Math.max(itemized, standard); const savings = itemized - standard
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Best Deduction</p><p className="text-3xl font-bold text-[#1a3a8a]">${best.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">{savings > 0 ? `Itemizing saves $${savings.toFixed(2)}` : 'Standard is better'}</p></div></div>
}
function AmtResults({ income, exemption, rate }: { income: number; exemption: number; rate: number }) {
  const ami = Math.max(0, income - exemption); const tax = ami * (rate / 100)
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">AMT Income</p><p className="text-2xl font-bold text-[#1a3a8a]">${ami.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">AMT Tax</p><p className="text-2xl font-bold text-[#d62828]">${tax.toFixed(2)}</p></div></div>
}
function CryptoProfitResults({ buyPrice, sellPrice, quantity }: { buyPrice: number; sellPrice: number; quantity: number }) {
  const pl = (sellPrice - buyPrice) * quantity; const roi = (buyPrice * quantity) > 0 ? (pl / (buyPrice * quantity)) * 100 : 0
  return <div className="text-center space-y-3"><div><p className={`text-sm ${pl >= 0 ? 'text-[#1a3a8a]' : 'text-[#d62828]'}`}>P/L</p><p className={`text-3xl font-bold ${pl >= 0 ? 'text-[#1a3a8a]' : 'text-[#d62828]'}`}>${pl.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">ROI: {roi.toFixed(2)}%</p></div></div>
}
function CryptoMiningResults({ hashRate, power }: { hashRate: number; power: number }) {
  const dkwh = power * 24 / 1000
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Power Usage</p><p className="text-2xl font-bold text-[#1a3a8a]">{power}W ({dkwh.toFixed(1)} kWh/day)</p></div><div><p className="text-sm text-gray-500">{(dkwh * 30).toFixed(0)} kWh/month</p></div></div>
}
function CryptoStakingResults({ amount, apy, years }: { amount: number; apy: number; years: number }) {
  const fv = amount * Math.pow(1 + apy / 100, years); const rewards = fv - amount
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Staking Rewards</p><p className="text-3xl font-bold text-[#1a3a8a]">${rewards.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Future Value: ${fv.toFixed(2)}</p></div></div>
}
function ImpermanentLossResults({ priceRatio, investA, investB }: { priceRatio: number; investA: number; investB: number }) {
  const total = investA + investB; const hold = investA * priceRatio + investB; const pool = 2 * Math.sqrt(investA * investB * priceRatio); const il = hold > 0 ? ((pool - hold) / hold) * 100 : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Impermanent Loss</p><p className={`text-3xl font-bold ${il >= 0 ? 'text-[#1a3a8a]' : 'text-[#d62828]'}`}>{il.toFixed(2)}%</p></div></div>
}
function LifeInsuranceResults({ income, years, debts, funeral }: { income: number; years: number; debts: number; funeral: number }) {
  const total = income * years + debts + funeral
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Insurance Needed</p><p className="text-3xl font-bold text-[#1a3a8a]">${total.toFixed(2)}</p></div></div>
}
function TermVsWholeLifeResults({ age, termPremium, wholePremium, years }: { age: number; termPremium: number; wholePremium: number; years: number }) {
  const termCost = termPremium * 12 * years; const wholeCost = wholePremium * 12 * years; const diff = wholeCost - termCost
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Term Total Cost</p><p className="text-2xl font-bold text-[#1a3a8a]">${termCost.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Whole Life Total</p><p className="text-2xl font-bold text-amber-500">${wholeCost.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Difference: ${diff.toFixed(2)}</p></div></div>
}
function DisabilityResults({ income, benefitPct, elimination }: { income: number; benefitPct: number; elimination: number }) {
  const benefit = income * (benefitPct / 100)
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Monthly Benefit</p><p className="text-3xl font-bold text-[#1a3a8a]">${benefit.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">{elimination}-month elimination period</p></div></div>
}
function HomeInsResults({ homeValue, deductible }: { homeValue: number; deductible: number }) {
  const premium = homeValue * 0.0035
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Est. Annual Premium</p><p className="text-3xl font-bold text-[#1a3a8a]">${premium.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Deductible: ${deductible.toFixed(0)}</p></div></div>
}
function AutoInsResults({ carValue, deductible }: { carValue: number; deductible: number }) {
  const premium = carValue * 0.05
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Est. Annual Premium</p><p className="text-3xl font-bold text-[#1a3a8a]">${premium.toFixed(2)}</p></div></div>
}
function HealthInsCompResults({ premium1, deductible1, oopMax1, premium2, deductible2, oopMax2 }: { premium1: number; deductible1: number; oopMax1: number; premium2: number; deductible2: number; oopMax2: number }) {
  const total1 = premium1 * 12 + oopMax1; const total2 = premium2 * 12 + oopMax2
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Plan A Worst-Case: ${total1.toFixed(2)}</p><p className="text-sm text-gray-500">Plan B Worst-Case: ${total2.toFixed(2)}</p><p className={`text-lg font-bold ${total1 < total2 ? 'text-[#1a3a8a]' : 'text-amber-500'}`}>{total1 < total2 ? 'Plan A is cheaper' : 'Plan B is cheaper'}</p></div></div>
}
function DeductibleVsPremiumResults({ lowPremium, lowDeductible, highPremium, highDeductible }: { lowPremium: number; lowDeductible: number; highPremium: number; highDeductible: number }) {
  const lowTotal = lowPremium * 12 + lowDeductible; const highTotal = highPremium * 12 + highDeductible; const savings = lowTotal - highTotal
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Low Deductible Plan: ${lowTotal.toFixed(2)}</p><p className="text-sm text-gray-500">High Deductible Plan: ${highTotal.toFixed(2)}</p></div></div>
}
function OopResults({ deductible, coinsurance, oopMax }: { deductible: number; coinsurance: number; oopMax: number }) {
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">OOP Maximum</p><p className="text-3xl font-bold text-[#1a3a8a]">${oopMax.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Deductible: ${deductible.toFixed(0)} | Coinsurance: {coinsurance}%</p></div></div>
}
function CreditUtilResults({ totalBalance, totalLimit }: { totalBalance: number; totalLimit: number }) {
  const util = totalLimit > 0 ? (totalBalance / totalLimit) * 100 : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Credit Utilization</p><p className={`text-3xl font-bold ${util <= 30 ? 'text-[#1a3a8a]' : 'text-[#d62828]'}`}>{util.toFixed(1)}%</p></div></div>
}
function CreditScoreResults({ paymentHistory, utilization, length, mix, inquiries }: { paymentHistory: number; utilization: number; length: number; mix: number; inquiries: number }) {
  const score = Math.min(850, Math.max(300, paymentHistory + utilization + length + mix - inquiries))
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Estimated Score</p><p className={`text-3xl font-bold ${score >= 740 ? 'text-[#1a3a8a]' : score >= 670 ? 'text-amber-500' : 'text-[#d62828]'}`}>{score}</p></div></div>
}
function BalanceTransferResults({ balance, promoRate, promoMonths, feeRate }: { balance: number; promoRate: number; promoMonths: number; feeRate: number }) {
  const fee = balance * (feeRate / 100); const mr = promoRate / 100 / 12; let mp = 0
  if (mr > 0 && promoMonths > 0) { const f = Math.pow(1 + mr, promoMonths); mp = balance * (mr * f) / (f - 1) } else if (promoMonths > 0) mp = balance / promoMonths
  const totalCost = mp * promoMonths + fee; const savings = balance * 1.18 - totalCost
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Monthly Payment</p><p className="text-2xl font-bold text-[#1a3a8a]">${mp.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Total Cost: ${totalCost.toFixed(2)} | Savings: ${Math.max(0, savings).toFixed(2)}</p></div></div>
}
function EmergencyFundResults({ monthlyExpenses, months }: { monthlyExpenses: number; months: number }) {
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Emergency Fund Target</p><p className="text-3xl font-bold text-[#1a3a8a]">${(monthlyExpenses * months).toFixed(2)}</p></div><div><p className="text-sm text-gray-500">{months} months of expenses</p></div></div>
}
function SinkingFundResults({ goal, rate, years }: { goal: number; rate: number; years: number }) {
  const mr = rate / 100 / 12; const m = years * 12; let monthly = 0
  if (mr > 0) monthly = goal * (mr / (Math.pow(1 + mr, m) - 1)); else if (m > 0) monthly = goal / m
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Monthly Contribution</p><p className="text-3xl font-bold text-[#1a3a8a]">${monthly.toFixed(2)}</p></div></div>
}
function SavingsGoalResults({ goal, current, rate, years, monthlyAdd }: { goal: number; current: number; rate: number; years: number; monthlyAdd: number }) {
  const mr = rate / 100 / 12; const m = years * 12; let proj = current
  if (mr > 0) proj = current * Math.pow(1 + mr, m) + monthlyAdd * ((Math.pow(1 + mr, m) - 1) / mr); else proj = current + monthlyAdd * m
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Projected</p><p className={`text-3xl font-bold ${proj >= goal ? 'text-[#1a3a8a]' : 'text-amber-500'}`}>${proj.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Goal: ${goal.toFixed(2)} | {proj >= goal ? 'On track!' : `Short $${(goal - proj).toFixed(2)}`}</p></div></div>
}
function CollegeSavingsResults({ goal, current, years, rate, monthly }: { goal: number; current: number; years: number; rate: number; monthly: number }) {
  const mr = rate / 100 / 12; const m = years * 12; let proj = current
  if (mr > 0) proj = current * Math.pow(1 + mr, m) + monthly * ((Math.pow(1 + mr, m) - 1) / mr); else proj = current + monthly * m
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Projected College Fund</p><p className="text-3xl font-bold text-[#1a3a8a]">${proj.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Gap: ${Math.max(0, goal - proj).toFixed(2)}</p></div></div>
}
function NetWorthResults({ assets, liabilities }: { assets: number; liabilities: number }) {
  const nw = assets - liabilities
  return <div className="text-center space-y-3"><div><p className={`text-sm ${nw >= 0 ? 'text-[#1a3a8a]' : 'text-[#d62828]'}`}>Net Worth</p><p className={`text-3xl font-bold ${nw >= 0 ? 'text-[#1a3a8a]' : 'text-[#d62828]'}`}>${nw.toFixed(2)}</p></div></div>
}
function DebtSnowballResults({ totalDebt, minPayment, extraPayment, rate }: { totalDebt: number; minPayment: number; extraPayment: number; rate: number }) {
  const totalMonthly = minPayment + extraPayment; const mr = rate / 100 / 12; let m = 0; let r2 = totalDebt; let ti = 0
  if (mr > 0 && totalMonthly > r2 * mr) { while (r2 > 0 && m < 600) { const i = r2 * mr; r2 -= totalMonthly - i; ti += i; m++ } } else { m = Math.ceil(totalDebt / totalMonthly) }
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Payoff Time (Snowball)</p><p className="text-3xl font-bold text-[#1a3a8a]">{m} months</p></div><div><p className="text-sm text-gray-500">Total Interest: ${ti.toFixed(2)}</p></div></div>
}
function DebtAvalancheResults({ totalDebt, minPayment, extraPayment, rate }: { totalDebt: number; minPayment: number; extraPayment: number; rate: number }) {
  const totalMonthly = minPayment + extraPayment; const mr = rate / 100 / 12; let m = 0; let r2 = totalDebt; let ti = 0
  if (mr > 0 && totalMonthly > r2 * mr) { while (r2 > 0 && m < 600) { const i = r2 * mr; r2 -= totalMonthly - i; ti += i; m++ } } else { m = Math.ceil(totalDebt / totalMonthly) }
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Payoff Time (Avalanche)</p><p className="text-3xl font-bold text-[#1a3a8a]">{m} months</p></div><div><p className="text-sm text-gray-500">Total Interest: ${ti.toFixed(2)}</p></div></div>
}
function DebtPayoffPlanResults({ balance, rate, monthly, goalMonths }: { balance: number; rate: number; monthly: number; goalMonths: number }) {
  const mr = rate / 100 / 12; let am = 0; let r2 = balance
  if (mr > 0 && monthly > r2 * mr) { while (r2 > 0 && am < 600) { r2 -= monthly - r2 * mr; am++ } } else { am = Math.ceil(balance / monthly) }
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Actual Payoff</p><p className={`text-2xl font-bold ${am <= goalMonths ? 'text-[#1a3a8a]' : 'text-amber-500'}`}>{am} months</p></div><div><p className="text-sm text-gray-500">{am <= goalMonths ? 'On track!' : `Need $${(balance/goalMonths).toFixed(2)}/mo`}</p></div></div>
}
function ConsolidationSavingsResults({ totalDebt, currentRate, newRate, term }: { totalDebt: number; currentRate: number; newRate: number; term: number }) {
  const cmr = currentRate / 100 / 12; const nmr = newRate / 100 / 12; const np = term * 12; let cp = 0; let nwp = 0
  if (cmr > 0) { const f = Math.pow(1 + cmr, np); cp = totalDebt * (cmr * f) / (f - 1) }
  if (nmr > 0) { const f = Math.pow(1 + nmr, np); nwp = totalDebt * (nmr * f) / (f - 1) }
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Savings from Consolidation</p><p className="text-3xl font-bold text-[#1a3a8a]">${(cp * np - nwp * np).toFixed(2)}</p></div></div>
}
function PensionResults({ currentSavings, monthlyContrib, rate, years }: { currentSavings: number; monthlyContrib: number; rate: number; years: number }) {
  const mr = rate / 100 / 12; const m = years * 12; let fv = currentSavings
  if (mr > 0) fv = currentSavings * Math.pow(1 + mr, m) + monthlyContrib * ((Math.pow(1 + mr, m) - 1) / mr); else fv = currentSavings + monthlyContrib * m
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Projected Balance</p><p className="text-3xl font-bold text-[#1a3a8a]">${fv.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Est. Income/yr (4% Rule): ${(fv*0.04).toFixed(2)}</p></div></div>
}
function SocialSecurityResults({ age, earnings, retirementAge }: { age: number; earnings: number; retirementAge: number }) {
  const pia = earnings * 0.35; const penalty = retirementAge < 67 ? (67 - retirementAge) * 0.0667 * pia : 0; const benefit = Math.max(0, retirementAge >= 67 ? pia : pia - penalty)
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Est. Monthly Benefit</p><p className="text-3xl font-bold text-[#1a3a8a]">${benefit.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">At age {retirementAge} ({(retirementAge - age)} years away)</p></div></div>
}
function AnnuityResults({ principal, rate, years }: { principal: number; rate: number; years: number }) {
  const mr = rate / 100 / 12; const m = years * 12; let pmt = 0
  if (mr > 0) pmt = principal * (mr * Math.pow(1 + mr, m)) / (Math.pow(1 + mr, m) - 1); else if (m > 0) pmt = principal / m
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Monthly Payout</p><p className="text-3xl font-bold text-[#1a3a8a]">${pmt.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">For {years} years | Total: ${(pmt*m).toFixed(2)}</p></div></div>
}
function SafeWithdrawalResults({ savings, withdrawalRate }: { savings: number; withdrawalRate: number }) {
  const annual = savings * (withdrawalRate / 100); const monthly = annual / 12
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Annual Withdrawal</p><p className="text-3xl font-bold text-[#1a3a8a]">${annual.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Monthly: ${monthly.toFixed(2)}</p></div></div>
}
function RmdResults({ balance, age }: { balance: number; age: number }) {
  const le = age >= 95 ? 8.2 : age >= 90 ? 9.6 : age >= 85 ? 11.4 : age >= 80 ? 13.7 : age >= 75 ? 16.7 : age >= 70 ? 20.2 : 25; const rmd = balance / le
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Required Minimum Distribution</p><p className="text-3xl font-bold text-[#1a3a8a]">${rmd.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Life Expectancy Factor: {le.toFixed(1)}</p></div></div>
}
function BusinessValResults({ revenue, ebitda, multiple }: { revenue: number; ebitda: number; multiple: number }) {
  const ev = ebitda * multiple; const revMultiple = revenue > 0 ? (ev / revenue) : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Enterprise Value</p><p className="text-3xl font-bold text-[#1a3a8a]">${ev.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">EV/Revenue: {revMultiple.toFixed(2)}x</p></div></div>
}
function StartupCostsResults({ equipment, license, marketing, legal, inventory }: { equipment: number; license: number; marketing: number; legal: number; inventory: number }) {
  const total = equipment + license + marketing + legal + inventory
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Total Startup Costs</p><p className="text-3xl font-bold text-[#1a3a8a]">${total.toFixed(2)}</p></div></div>
}
function RunwayResults({ cash, monthlyBurn, monthlyRevenue }: { cash: number; monthlyBurn: number; monthlyRevenue: number }) {
  const netBurn = monthlyBurn - monthlyRevenue; const months = netBurn > 0 ? cash / netBurn : Infinity
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Runway</p><p className={`text-3xl font-bold ${months === Infinity ? 'text-[#1a3a8a]' : 'text-amber-500'}`}>{months === Infinity ? 'Profitable' : `${months.toFixed(1)} months`}</p></div></div>
}
function BurnRateResults({ startCash, endCash, months }: { startCash: number; endCash: number; months: number }) {
  const burn = (startCash - endCash) / months
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Monthly Burn Rate</p><p className="text-3xl font-bold text-[#d62828]">${burn.toFixed(2)}</p></div></div>
}
function CACResults({ salesCost, newCustomers }: { salesCost: number; newCustomers: number }) {
  const cac = newCustomers > 0 ? salesCost / newCustomers : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Customer Acquisition Cost</p><p className="text-3xl font-bold text-[#1a3a8a]">${cac.toFixed(2)}</p></div></div>
}
function LTVCResults({ avgRevenue, churnRate }: { avgRevenue: number; churnRate: number }) {
  const ltv = churnRate > 0 ? avgRevenue * (1 / (churnRate / 100)) : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Customer LTV</p><p className="text-3xl font-bold text-[#1a3a8a]">${ltv.toFixed(2)}</p></div></div>
}
function LTVCACRatioResults({ ltv, cac }: { ltv: number; cac: number }) {
  const r = cac > 0 ? ltv / cac : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">LTV/CAC Ratio</p><p className={`text-3xl font-bold ${r >= 3 ? 'text-[#1a3a8a]' : 'text-amber-500'}`}>{r.toFixed(2)}x</p></div><div><p className="text-sm text-gray-500">{r >= 3 ? 'Healthy SaaS metric' : r >= 1 ? 'Adequate' : 'Needs improvement'}</p></div></div>
}
function ChurnResults({ lostCustomers, startCustomers }: { lostCustomers: number; startCustomers: number }) {
  const r = startCustomers > 0 ? (lostCustomers / startCustomers) * 100 : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Churn Rate</p><p className={`text-3xl font-bold ${r <= 5 ? 'text-[#1a3a8a]' : 'text-[#d62828]'}`}>{r.toFixed(2)}%</p></div></div>
}
function MRRResults({ subscribers, avgPrice }: { subscribers: number; avgPrice: number }) {
  const mrr = subscribers * avgPrice; const arr = mrr * 12
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Monthly Recurring Revenue</p><p className="text-3xl font-bold text-[#1a3a8a]">${mrr.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">ARR: ${arr.toFixed(2)}</p></div></div>
}
function ARRResults({ mrr }: { mrr: number }) {
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Annual Recurring Revenue</p><p className="text-3xl font-bold text-[#1a3a8a]">${(mrr * 12).toFixed(2)}</p></div></div>
}
function UnitEconResults({ price, varCost, fixedCost, units }: { price: number; varCost: number; fixedCost: number; units: number }) {
  const contrib = price - varCost; const totalContrib = contrib * units; const profit = totalContrib - fixedCost; const cmRatio = price > 0 ? (contrib / price) * 100 : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Unit Contribution</p><p className="text-2xl font-bold text-[#1a3a8a]">${contrib.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Total Profit: ${profit.toFixed(2)} | CM Ratio: {cmRatio.toFixed(1)}%</p></div></div>
}
function ContributionMarginResults({ revenue, varCosts }: { revenue: number; varCosts: number }) {
  const cm = revenue - varCosts; const ratio = revenue > 0 ? (cm / revenue) * 100 : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Contribution Margin</p><p className="text-2xl font-bold text-[#1a3a8a]">${cm.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">CM Ratio: {ratio.toFixed(1)}%</p></div></div>
}
function OperatingLeverageResults({ revenue, varCosts, fixedCosts }: { revenue: number; varCosts: number; fixedCosts: number }) {
  const contrib = revenue - varCosts; const dol = (contrib) > 0 ? contrib / (contrib - fixedCosts) : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Degree of Operating Leverage</p><p className="text-3xl font-bold text-[#1a3a8a]">{dol.toFixed(2)}</p></div></div>
}
function FinLeverageResults({ ebit, interest }: { ebit: number; interest: number }) {
  const dfl = (ebit - interest) > 0 ? ebit / (ebit - interest) : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Degree of Financial Leverage</p><p className="text-3xl font-bold text-[#1a3a8a]">{dfl.toFixed(2)}</p></div></div>
}
function CostVolumeResults({ fixedCosts, pricePerUnit, varCostPerUnit, units }: { fixedCosts: number; pricePerUnit: number; varCostPerUnit: number; units: number }) {
  const cm = pricePerUnit - varCostPerUnit; const be = cm > 0 ? Math.ceil(fixedCosts / cm) : 0; const profit = cm * units - fixedCosts
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Profit at {units} units</p><p className={`text-3xl font-bold ${profit >= 0 ? 'text-[#1a3a8a]' : 'text-[#d62828]'}`}>${profit.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">B/E: {be} units | CM: ${cm.toFixed(2)}</p></div></div>
}
function MarkupResults({ cost, markup }: { cost: number; markup: number }) {
  const price = cost * (1 + markup / 100); const profit = price - cost; const margin = price > 0 ? (profit / price) * 100 : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Selling Price</p><p className="text-3xl font-bold text-[#1a3a8a]">${price.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Profit: ${profit.toFixed(2)} | Margin: {margin.toFixed(1)}%</p></div></div>
}
function GrossProfitResults({ revenue, cogs }: { revenue: number; cogs: number }) {
  return function GrossProfitDisplay() { const gp = revenue - cogs; const gm = revenue > 0 ? (gp / revenue) * 100 : 0; return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Gross Profit</p><p className="text-2xl font-bold text-[#1a3a8a]">${gp.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Gross Margin: {gm.toFixed(1)}%</p></div></div> }
}
function ProfitMarginResults({ revenue, profit }: { revenue: number; profit: number }) {
  const pm = revenue > 0 ? (profit / revenue) * 100 : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Profit Margin</p><p className="text-3xl font-bold text-[#1a3a8a]">{pm.toFixed(2)}%</p></div></div>
}
function NetProfitResults({ revenue, expenses }: { revenue: number; expenses: number }) {
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Net Profit</p><p className={`text-3xl font-bold ${(revenue - expenses) >= 0 ? 'text-[#1a3a8a]' : 'text-[#d62828]'}`}>${(revenue - expenses).toFixed(2)}</p></div></div>
}
function CarAffordResults({ monthlyPayment, rate, term }: { monthlyPayment: number; rate: number; term: number }) {
  const mr = rate / 100 / 12; let maxLoan = 0
  if (mr > 0) maxLoan = monthlyPayment * ((Math.pow(1 + mr, term) - 1) / (mr * Math.pow(1 + mr, term))); else maxLoan = monthlyPayment * term
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Max Car Loan</p><p className="text-3xl font-bold text-[#1a3a8a]">${maxLoan.toFixed(2)}</p></div></div>
}
function ChildCareResults({ weeklyCost, weeksPerYear }: { weeklyCost: number; weeksPerYear: number }) {
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Annual Child Care Cost</p><p className="text-3xl font-bold text-[#1a3a8a]">${(weeklyCost * weeksPerYear).toFixed(2)}</p></div></div>
}
function PetExpenseResults({ food, vet, supplies, other }: { food: number; vet: number; supplies: number; other: number }) {
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Total Annual Pet Cost</p><p className="text-3xl font-bold text-[#1a3a8a]">${(food + vet + supplies + other).toFixed(2)}</p></div></div>
}
function BudgetRuleResults({ income, needs, wants, savings }: { income: number; needs: number; wants: number; savings: number }) {
  const npct = income > 0 ? (needs / income) * 100 : 0; const wpct = income > 0 ? (wants / income) * 100 : 0; const spct = income > 0 ? (savings / income) * 100 : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Needs: {npct.toFixed(1)}% | Wants: {wpct.toFixed(1)}% | Savings: {spct.toFixed(1)}%</p></div><div><p className={`${npct <= 50 && spct >= 20 ? 'text-[#1a3a8a]' : 'text-amber-500'} font-bold`}>{npct <= 50 && spct >= 20 ? 'Following 50/30/20 rule!' : 'Adjust your budget'}</p></div></div>
}
function ZeroBasedBudgetResults({ income, category1, category2, category3, category4 }: { income: number; category1: number; category2: number; category3: number; category4: number }) {
  const total = category1 + category2 + category3 + category4; const remaining = income - total
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Total Allocated</p><p className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</p></div><div><p className={`text-xl font-bold ${remaining === 0 ? 'text-[#1a3a8a]' : 'text-amber-500'}`}>{remaining === 0 ? 'Zero-based! $0 remaining' : `$${remaining.toFixed(2)} remaining`}</p></div></div>
}
function EnvelopeBudgetResults({ income, envelopes, perEnvelope }: { income: number; envelopes: number; perEnvelope: number }) {
  const totalBudget = envelopes * perEnvelope; const remaining = income - totalBudget
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Total Budgeted</p><p className="text-2xl font-bold text-[#1a3a8a]">${totalBudget.toFixed(2)}</p></div></div>
}
function PayYourselfFirstResults({ income, savingsPct }: { income: number; savingsPct: number }) {
  const saveAmt = income * (savingsPct / 100); const spendAmt = income - saveAmt
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Save First</p><p className="text-3xl font-bold text-[#1a3a8a]">${saveAmt.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Remaining to spend: ${spendAmt.toFixed(2)}</p></div></div>
}
function WeddingBudgetResults({ guestCount, budget }: { guestCount: number; budget: number }) {
  const perGuest = guestCount > 0 ? budget / guestCount : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Total Budget</p><p className="text-3xl font-bold text-[#1a3a8a]">${budget.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">${perGuest.toFixed(2)} per guest</p></div></div>
}
function VacationBudgetResults({ transport, lodging, food, activities }: { transport: number; lodging: number; food: number; activities: number }) {
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Total Vacation Cost</p><p className="text-3xl font-bold text-[#1a3a8a]">${(transport + lodging + food + activities).toFixed(2)}</p></div></div>
}
function HolidayBudgetResults({ gifts, travel, food, decorations }: { gifts: number; travel: number; food: number; decorations: number }) {
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Total Holiday Cost</p><p className="text-3xl font-bold text-[#1a3a8a]">${(gifts + travel + food + decorations).toFixed(2)}</p></div></div>
}
function GroceryBudgetResults({ householdSize, weeklyTarget }: { householdSize: number; weeklyTarget: number }) {
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Monthly Grocery Budget</p><p className="text-3xl font-bold text-[#1a3a8a]">${(weeklyTarget * 4.33).toFixed(2)}</p></div><div><p className="text-sm text-gray-500">${(weeklyTarget / householdSize).toFixed(2)}/person/week</p></div></div>
}
function MonthlyBudgetResults({ income, housing, food, transport, utilities, other }: { income: number; housing: number; food: number; transport: number; utilities: number; other: number }) {
  const total = housing + food + transport + utilities + other
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Total Expenses</p><p className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</p></div><div><p className={`text-lg font-bold ${income - total >= 0 ? 'text-[#1a3a8a]' : 'text-[#d62828]'}`}>${(income - total).toFixed(2)} remaining</p></div></div>
}
function AnnualBudgetResults({ income, housing, food, transport, utilities, savings }: { income: number; housing: number; food: number; transport: number; utilities: number; savings: number }) {
  const total = housing + food + transport + utilities + savings
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Total Annual</p><p className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</p></div><div><p className={`text-lg font-bold ${income - total >= 0 ? 'text-[#1a3a8a]' : 'text-[#d62828]'}`}>${(income - total).toFixed(2)} remaining</p></div></div>
}
function PropertyTaxDeductionResults({ propertyTaxPaid, marginalRate }: { propertyTaxPaid: number; marginalRate: number }) {
  const savings = propertyTaxPaid * (marginalRate / 100)
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Tax Savings from Deduction</p><p className="text-3xl font-bold text-[#1a3a8a]">${savings.toFixed(2)}</p></div></div>
}
function GiftTaxResults({ giftAmount, annualExclusion }: { giftAmount: number; annualExclusion: number }) {
  const taxable = Math.max(0, giftAmount - annualExclusion)
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Taxable Gift Amount</p><p className={`text-3xl font-bold ${taxable > 0 ? 'text-amber-500' : 'text-[#1a3a8a]'}`}>${taxable.toFixed(2)}</p></div></div>
}
function InheritanceTaxResults({ inheritanceAmount, stateExemption, taxRate }: { inheritanceAmount: number; stateExemption: number; taxRate: number }) {
  const taxable = Math.max(0, inheritanceAmount - stateExemption); const tax = taxable * (taxRate / 100)
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Inheritance Tax Due</p><p className="text-3xl font-bold text-[#d62828]">${tax.toFixed(2)}</p></div></div>
}
function SideHustleTaxResults({ income, expenses, otherIncome }: { income: number; expenses: number; otherIncome: number }) {
  const netBusiness = income - expenses; const totalIncome = netBusiness + otherIncome; const seTax = netBusiness * 0.153; const totalTax = seTax
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Net Business Income</p><p className="text-2xl font-bold text-[#1a3a8a]">${netBusiness.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">SE Tax: ${seTax.toFixed(2)}</p></div></div>
}
function RentIncomeTaxResults({ rentIncome, expenses, depreciation }: { rentIncome: number; expenses: number; depreciation: number }) {
  const netRental = rentIncome - expenses - depreciation; const tax = netRental > 0 ? netRental * 0.32 : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Net Rental Income</p><p className="text-2xl font-bold text-[#1a3a8a]">${netRental.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Est. Tax: ${tax.toFixed(2)}</p></div></div>
}
function LoanComparisonResults({ amount, rate1, term1, rate2, term2 }: { amount: number; rate1: number; term1: number; rate2: number; term2: number }) {
  const mr1 = rate1 / 100 / 12; const np1 = term1 * 12; const mr2 = rate2 / 100 / 12; const np2 = term2 * 12
  let p1 = 0; let p2 = 0
  if (mr1 > 0) { const f = Math.pow(1 + mr1, np1); p1 = amount * (mr1 * f) / (f - 1) } else if (np1 > 0) p1 = amount / np1
  if (mr2 > 0) { const f = Math.pow(1 + mr2, np2); p2 = amount * (mr2 * f) / (f - 1) } else if (np2 > 0) p2 = amount / np2
  const t1 = p1 * np1; const t2 = p2 * np2
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Loan 1: ${p1.toFixed(2)}/mo (${t1.toFixed(2)} total)</p><p className="text-sm text-gray-500">Loan 2: ${p2.toFixed(2)}/mo (${t2.toFixed(2)} total)</p><p className={`text-lg font-bold ${t1 < t2 ? 'text-[#1a3a8a]' : 'text-[#d62828]'}`}>{t1 < t2 ? 'Loan 1 is cheaper' : 'Loan 2 is cheaper'}</p></div></div>
}
function BiweeklyPayResults({ principal, rate, term }: { principal: number; rate: number; term: number }) {
  const mr = rate / 100 / 12; const np = term * 12; let monthlyPay = 0
  if (mr > 0 && np > 0 && principal > 0) { const f = Math.pow(1 + mr, np); monthlyPay = principal * (mr * f) / (f - 1) } else if (np > 0) monthlyPay = principal / np
  const biweeklyPay = monthlyPay / 2
  const totalMonthly = monthlyPay * np; const biweeklyPayments = term * 26; const totalBiweekly = biweeklyPay * biweeklyPayments
  const interestSaved = totalMonthly - totalBiweekly; const monthsSaved = Math.round(np - (biweeklyPayments / 26 * 12))
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Bi-Weekly Payment</p><p className="text-3xl font-bold text-[#1a3a8a]">${biweeklyPay.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Interest Saved: ${Math.max(0, interestSaved).toFixed(2)} | Payoff: ~{monthsSaved} months sooner</p></div></div>
}
function GrossProfitFunc({ revenue, cogs }: { revenue: number; cogs: number }) {
  const gp = revenue - cogs; const gm = revenue > 0 ? (gp / revenue) * 100 : 0
  return <div className="text-center space-y-3"><div><p className="text-sm text-gray-500">Gross Profit</p><p className="text-2xl font-bold text-[#1a3a8a]">${gp.toFixed(2)}</p></div><div><p className="text-sm text-gray-500">Gross Margin: {gm.toFixed(1)}%</p></div></div>
}

interface FieldDef {
  name: string; label: string; type: 'number' | 'select'
  options?: { label: string; value: string }[]; unit?: string; min?: number; max?: number; step?: string
}
import { buildGenericDef } from '@/lib/generic-fallback'
import { calcDefs } from './financial'
import type { CalcDef } from '@/lib/generic-fallback'
import type { CalculatorEntry } from '@calcuniverse/calculator-registry'

type Props = { calculator: CalculatorEntry }

function calcSchema(slug: string, calc?: CalculatorEntry): z.ZodType<any> {
  const def = calcDefs[slug]
  if (def?.schema) return def.schema
  const m: Record<string, z.ZodType<any>> = {
    'simple-interest-calculator': simpleInterestSchema,
    'apy-calculator': apyCalcSchema, 'apr-calculator': apyCalcSchema, 'rule-of-72-calculator': apyCalcSchema, 'doubling-time-calculator-finance': apyCalcSchema,
    'present-value-calculator': fvPvSchema, 'future-value-calculator': fvPvSchema,
    'roi-calculator': roiSchema, 'npv-calculator': npvSchema, 'irr-calculator': irrSchema,
    'payback-period-calculator': paybackSchema, 'break-even-analysis': breakEvenSchema,
    'bond-yield-calculator': bondYieldSchema, 'bond-price-calculator': bondPriceSchema, 'coupon-payment-calculator': couponPaySchema,
    'tax-equivalent-yield': taxEquivYieldSchema,
    'dividend-yield-calculator': dividendYieldSchema, 'dividend-payout-ratio': dividendPayoutSchema,
    'earnings-per-share': epsSchema, 'price-to-earnings': peSchema,
    'stock-average-cost': stockAvgCostSchema, 'dollar-cost-averaging': dcaSchema, 'cost-basis-calculator': costBasisSchema,
    'portfolio-return-calculator': portfolioReturnSchema,
    'sharpe-ratio-calculator': sharpeSchema, 'sortino-ratio-calculator': sortinoSchema,
    'alpha-calculator': alphaSchema, 'beta-calculator': betaSchema, 'r-squared-calculator': rSquaredSchema,
    'value-at-risk-calculator': varSchema,
    'debt-to-income-ratio': dtiSchema, 'loan-to-value-ratio': ltvSchema, 'debt-service-coverage': dscrSchema,
    'interest-coverage-ratio': coverageSchema, 'times-interest-earned': coverageSchema, 'fixed-charge-coverage': coverageSchema,
    'working-capital-calculator': workingCapitalSchema, 'inventory-turnover-calculator': turnoverSchema,
    'asset-turnover-calculator': assetTurnoverSchema,
    'return-on-assets': roaRoeSchema, 'return-on-equity': roaRoeSchema,
    'capital-gains-calculator': capitalGainsSchema, 'cost-basis': costBasisSchema,
    'credit-utilization-calculator': creditUtilSchema, 'credit-score-estimator': creditScoreSchema,
    'debt-snowball-calculator': debtSnowballSchema, 'debt-avalanche-calculator': debtAvalancheSchema,
    'debt-payoff-plan-calculator': debtPayoffPlanSchema, 'consolidation-savings-calculator': consolidationSavingsSchema,
    'pension-calculator': pensionSchema, 'social-security-calculator': socialSecuritySchema,
    'annuity-payout-calculator': annuitySchema, 'safe-withdrawal-rate-calculator': safeWithdrawalSchema,
    'required-minimum-distribution': rmdSchema, 'business-valuation-calculator': businessValSchema,
    'startup-costs-calculator': startupCostsSchema, 'runway-calculator': runwaySchema,
    'burn-rate-calculator': burnRateSchema, 'customer-acquisition-cost': cacSchema,
    'ltv-cac-ratio': ltvCacSchema, 'churn-rate-calculator': churnSchema,
    'mrr-calculator': mrrSchema, 'arr-calculator': arrSchema, 'unit-economics-calculator': unitEconSchema,
    'contribution-margin-calculator': contributionMarginSchema,
    'operating-leverage-calculator': operatingLeverageSchema, 'financial-leverage-calculator': finLeverageSchema,
    'cost-volume-profit': costVolumeSchema, 'markup-calculator': markupSchema,
    'debt-consolidation-calculator': loanComparisonSchema, 'biweekly-payment-calculator': biweeklyPaySchema,
    'gross-profit-calculator': grossProfitSchema, 'profit-margin-calculator': profitMarginSchema, 'net-profit-calculator': netProfitSchema,
    'salary-calculator': salarySchema, 'income-tax-calculator': taxSchema,
    'estate-tax-calculator': estateTaxSchema, 'rent-vs-buy-calculator': rentVsBuySchema,
    'house-affordability-calculator': affordabilitySchema, 'closing-costs-calculator': closingCostsSchema,
    'rental-income-calculator': rentalIncomeSchema, 'cap-rate-calculator': capRateSchema,
    'cash-on-cash-return': cashOnCashSchema, 'noi-calculator': noiCalcSchema,
    'tax-bracket-calculator': taxBracketSchema, 'marginal-tax-rate-calculator': marginalTaxSchema,
    'effective-tax-rate-calculator': effectiveTaxSchema, 'dividend-tax-calculator': dividendTaxSchema,
    'self-employment-tax-calculator': selfEmploymentSchema, 'sales-tax-calculator': salesTaxSchema,
    'vat-calculator': vatSchema, 'tax-refund-calculator': taxRefundSchema,
    'itemized-deductions-calculator': itemizedSchema, 'amt-calculator': amtSchema,
    'crypto-profit-calculator': cryptoProfitSchema, 'crypto-mining-calculator': cryptoMiningSchema,
    'crypto-staking-calculator': cryptoStakingSchema, 'impermanent-loss-calculator': impermanentLossSchema,
    'life-insurance-calculator': lifeInsuranceSchema, 'term-vs-whole-life': termVsWholeLifeSchema,
    'disability-insurance-calculator': disabilitySchema, 'home-insurance-calculator': homeInsSchema,
    'auto-insurance-calculator': autoInsSchema, 'health-insurance-comparison': healthInsCompSchema,
    'deductible-vs-premium': deductibleVsPremiumSchema, 'out-of-pocket-max-calculator': oopSchema,
    'balance-transfer-calculator': balanceTransferSchema, 'emergency-fund-calculator': emergencyFundSchema,
    'sinking-fund-calculator': sinkingFundSchema, 'savings-goal-calculator': savingsGoalSchema,
    'college-savings-calculator': collegeSavingsSchema, 'net-worth-calculator': netWorthSchema,
    'property-tax-deduction': propertyTaxDeductionSchema, 'gift-tax-calculator': giftTaxSchema,
    'inheritance-tax-calculator': inheritanceTaxSchema, 'side-hustle-tax-calculator': sideHustleTaxSchema,
    'rental-income-tax-calculator': rentIncomeTaxSchema,
    'childcare-cost-calculator': childCareSchema, 'pet-expense-calculator': petExpenseSchema,
    'car-affordability-calculator': carAffordSchema,
    '50-30-20-budget': budgetRuleSchema, 'zero-based-budget': zeroBasedBudgetSchema,
    'envelope-budget': envelopeBudgetSchema, 'pay-yourself-first': payYourselfFirstSchema,
    'wedding-budget-calculator': weddingBudgetSchema, 'vacation-budget-calculator': vacationBudgetSchema,
    'holiday-budget-calculator': holidayBudgetSchema,
    'grocery-budget-calculator': groceryBudgetSchema, 'monthly-budget-calculator': monthlyBudgetSchema,
    'annual-budget-calculator': annualBudgetSchema,
    'loan-calculator': loanComparisonSchema, 'payment-calculator': loanComparisonSchema,
    'personal-loan-calculator': loanComparisonSchema, 'auto-loan-calculator': loanComparisonSchema,
    'boat-loan-calculator': loanComparisonSchema, 'home-equity-loan-calculator': loanComparisonSchema,
    'student-loan-calculator': loanComparisonSchema, 'refinance-calculator': loanComparisonSchema,
    'rent-calculator': affordabilitySchema,
    'mortgage-calculator': rentVsBuySchema, 'mortgage-payoff-calculator': biweeklyPaySchema,
    'fha-loan-calculator': rentVsBuySchema, 'va-mortgage-calculator': rentVsBuySchema,
    'amortization-calculator': loanComparisonSchema,
    'investment-calculator': fvPvSchema, 'retirement-calculator': pensionSchema,
    'credit-card-payoff-calculator': debtSchema, 'debt-payoff-calculator': debtSchema,
    'compound-interest-calculator': fvPvSchema,
    'currency-calculator': defaultSchema,
  }
  if (m[slug]) return m[slug]
  if (calc && !calcTypeMap[slug]) {
    const genericDef = buildGenericDef(calc)
    if (genericDef.schema) return genericDef.schema as z.ZodType<any>
  }
  return defaultSchema
}

function calcDefaults(slug: string, calc?: CalculatorEntry): Record<string, string> {
  const def = calcDefs[slug]
  if (def?.defaults) return def.defaults
  if (calc && !calcTypeMap[slug]) {
    const genericDef = buildGenericDef(calc)
    if (genericDef.defaults) return genericDef.defaults as Record<string, string>
  }
  return {}
}

function getPresets(calcType: string): { label: string; values: Record<string, string> }[] {
  return []
}

export function GenericFinancialCalculator({ calculator }: Props) {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('us')
  const [useSlider, setUseSlider] = useState(true)
  const formSchema = calcSchema(calculator.slug, calculator)
  const defaults = calcDefaults(calculator.slug, calculator)
  const [lockedFields, setLockedFields] = useState<Set<string>>(new Set())
  const [extraFields, setExtraFields] = useState<Record<string, string>>({})

  const toggleLock = useCallback((name: string) => {
    setLockedFields(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }, [])

  const calcType = getCalcType(calculator.slug)
  const presets = getPresets(calcType)

  const form = useForm({
    resolver: zodResolver(formSchema as any),
    defaultValues: defaults as any,
    mode: 'onChange',
  })

  const watched = useWatch({ control: form.control })
  const v = watched as any

  const result = useMemo(() => {
    const vals = watched as any
    const n = (v: any) => parseFloat(v) || 0
    switch (calcType) {
      case 'mortgage': return <MortgageResults price={n(vals.homePrice)} down={n(vals.downPayment)} rate={n(vals.rate)} term={n(vals.term)} propertyTax={n(vals.propertyTax)} homeInsurance={n(vals.homeInsurance)} pmiRate={n(vals.pmiRate)} hoa={n(vals.hoa)} extraPayment={n(vals.extraPayment)} frequency={vals.frequency} extraFields={extraFields} />
      case 'investment': return <InvestmentResults initial={n(vals.initial)} monthly={n(vals.monthly)} rate={n(vals.rate)} years={n(vals.years)} extraFields={extraFields} />
      case 'retirement': return <RetirementResults age={n(vals.age)} retirementAge={n(vals.retirementAge)} savings={n(vals.savings)} monthly={n(vals.monthly)} rate={n(vals.rate)} extraFields={extraFields} />
      case 'salary': return <SalaryResults amount={n(vals.amount)} period={vals.period || 'annual'} extraFields={extraFields} />
      case 'debt': return <DebtResults balance={n(vals.balance)} rate={n(vals.rate)} monthly={n(vals.monthly)} extraFields={extraFields} />
      case 'tax': return <TaxResults income={n(vals.income)} rate={n(vals.rate)} extraFields={extraFields} />
      case 'budget': return <BudgetResults income={n(vals.income)} housing={n(vals.housing)} food={n(vals.food)} transport={n(vals.transport)} utilities={n(vals.utilities)} other={n(vals.other)} />
      case 'simpleInterest': return <SimpleInterestResults principal={n(vals.principal)} rate={n(vals.rate)} years={n(vals.years)} />
      case 'apyCalc': return <ApyCalcResults rate={n(vals.rate)} compound={vals.compound || 'monthly'} years={n(vals.years)} />
      case 'aprCalc': return <ApyCalcResults rate={n(vals.rate)} compound={vals.compound || 'monthly'} years={n(vals.years)} />
      case 'futureValue': return <FutureValueResults present={n(vals.present)} rate={n(vals.rate)} years={n(vals.years)} monthlyAdd={n(vals.monthlyAdd)} />
      case 'presentValue': return <PresentValueResults present={n(vals.present)} rate={n(vals.rate)} years={n(vals.years)} />
      case 'roi': return <RoiResults initial={n(vals.initial)} final={n(vals.final)} years={n(vals.years)} />
      case 'npv': return <NpvResults initial={n(vals.initial)} cashFlows={n(vals.cashFlows)} rate={n(vals.rate)} years={n(vals.years)} />
      case 'irr': return <IrrResults initial={n(vals.initial)} cashFlow={n(vals.cashFlow)} years={n(vals.years)} />
      case 'paybackPeriod': return <PaybackResults initial={n(vals.initial)} cashFlow={n(vals.cashFlow)} />
      case 'breakEven': return <BreakEvenResults fixedCosts={n(vals.fixedCosts)} pricePerUnit={n(vals.pricePerUnit)} varCostPerUnit={n(vals.varCostPerUnit)} />
      case 'bondYield': return <BondYieldResults price={n(vals.price)} faceValue={n(vals.faceValue)} coupon={n(vals.coupon)} years={n(vals.years)} />
      case 'bondPrice': return <BondPriceResults faceValue={n(vals.faceValue)} coupon={n(vals.coupon)} rate={n(vals.rate)} years={n(vals.years)} />
      case 'couponPayment': return <CouponPaymentResults faceValue={n(vals.faceValue)} couponRate={n(vals.couponRate)} freq={vals.freq || 'semiannual'} />
      case 'taxEquivalentYield': return <TaxEquivYieldResults muniYield={n(vals.muniYield)} taxRate={n(vals.taxRate)} />
      case 'dividendYield': return <DividendYieldResults pricePerShare={n(vals.pricePerShare)} annualDividend={n(vals.annualDividend)} />
      case 'dividendPayout': return <DividendPayoutResults dividends={n(vals.dividends)} netIncome={n(vals.netIncome)} />
      case 'eps': return <EpsResults netIncome={n(vals.netIncome)} shares={n(vals.shares)} />
      case 'pe': return <PeResults price={n(vals.price)} eps={n(vals.eps)} />
      case 'pb': return <PbResults price={n(vals.price)} bookValue={n(vals.bookValue)} />
      case 'ps': return <PsResults price={n(vals.price)} salesPerShare={n(vals.salesPerShare)} />
      case 'peg': return <PegResults pe={n(vals.pe)} growth={n(vals.growth)} />
      case 'dividendGrowthRate': return <DividendGrowthResults currentDividend={n(vals.currentDividend)} years={n(vals.years)} priorDividend={n(vals.priorDividend)} />
      case 'payoutRatio': return <PayoutRatioResults dividendsPerShare={n(vals.dividendsPerShare)} eps={n(vals.eps)} />
      case 'retentionRatio': return <RetentionRatioResults payoutRatio={n(vals.payoutRatio)} />
      case 'stockAverageCost': return <StockAvgCostResults shares={n(vals.shares)} totalCost={n(vals.totalCost)} newShares={n(vals.newShares)} newPrice={n(vals.newPrice)} />
      case 'dollarCostAveraging': return <DcaResults monthlyInvest={n(vals.monthlyInvest)} pricePerShare={n(vals.pricePerShare)} months={n(vals.months)} />
      case 'costBasis': return <CostBasisResults purchasePrice={n(vals.purchasePrice)} shares={n(vals.shares)} commissions={n(vals.commissions)} />
      case 'portfolioReturn': return <PortfolioReturnResults return1={n(vals.return1)} weight1={n(vals.weight1)} return2={n(vals.return2)} weight2={n(vals.weight2)} />
      case 'sharpeRatio': return <SharpeResults portfolioReturn={n(vals.portfolioReturn)} riskFreeRate={n(vals.riskFreeRate)} stdDev={n(vals.stdDev)} />
      case 'sortinoRatio': return <SortinoResults portfolioReturn={n(vals.portfolioReturn)} riskFreeRate={n(vals.riskFreeRate)} downsideDev={n(vals.downsideDev)} />
      case 'alpha': return <AlphaResults portfolioReturn={n(vals.portfolioReturn)} riskFreeRate={n(vals.riskFreeRate)} beta={n(vals.beta)} marketReturn={n(vals.marketReturn)} />
      case 'beta': return <BetaResults stockReturn={n(vals.stockReturn)} marketReturn={n(vals.marketReturn)} />
      case 'rSquared': return <RSquaredResults correlation={n(vals.correlation)} />
      case 'valueAtRisk': return <VaRResults portfolioValue={n(vals.portfolioValue)} meanReturn={n(vals.meanReturn)} stdDev={n(vals.stdDev)} confidence={vals.confidence || '95'} />
      case 'dti': return <DtiResults monthlyDebt={n(vals.monthlyDebt)} monthlyIncome={n(vals.monthlyIncome)} />
      case 'ltv': return <LtvResults loanAmount={n(vals.loanAmount)} propertyValue={n(vals.propertyValue)} />
      case 'dscr': return <DscrResults noi={n(vals.noi)} debtService={n(vals.debtService)} />
      case 'interestCoverage': return <CoverageResults ebit={n(vals.ebit)} interestExpense={n(vals.interestExpense)} />
      case 'fixedChargeCoverage': return <CoverageResults ebit={n(vals.ebit)} interestExpense={n(vals.interestExpense)} />
      case 'tie': return <CoverageResults ebit={n(vals.ebit)} interestExpense={n(vals.interestExpense)} />
      case 'workingCapital': return <WorkingCapitalResults currentAssets={n(vals.currentAssets)} currentLiabilities={n(vals.currentLiabilities)} />
      case 'currentRatio': return <WorkingCapitalResults currentAssets={n(vals.currentAssets)} currentLiabilities={n(vals.currentLiabilities)} />
      case 'quickRatio': return <WorkingCapitalResults currentAssets={n(vals.currentAssets)} currentLiabilities={n(vals.currentLiabilities)} />
      case 'cashRatio': return <WorkingCapitalResults currentAssets={n(vals.currentAssets)} currentLiabilities={n(vals.currentLiabilities)} />
      case 'inventoryTurnover': return <TurnoverResults cogs={n(vals.cogs)} avgInventory={n(vals.avgInventory)} />
      case 'assetTurnover': return <AssetTurnoverResults revenue={n(vals.revenue)} avgAssets={n(vals.avgAssets)} />
      case 'roa': return <RoaRoeResults netIncome={n(vals.netIncome)} avgEquity={n(vals.avgEquity)} avgAssets={n(vals.avgAssets)} />
      case 'roe': return <RoaRoeResults netIncome={n(vals.netIncome)} avgEquity={n(vals.avgEquity)} avgAssets={n(vals.avgAssets)} />
      case 'debtToAsset': return <DebtRatioResults totalDebt={n(vals.totalDebt)} totalEquity={n(vals.totalEquity)} totalAssets={n(vals.totalAssets)} />
      case 'debtToEquity': return <DebtRatioResults totalDebt={n(vals.totalDebt)} totalEquity={n(vals.totalEquity)} totalAssets={n(vals.totalAssets)} />
      case 'rentVsBuy': return <RentVsBuyResults rent={n(vals.rent)} homePrice={n(vals.homePrice)} downPayment={n(vals.downPayment)} rate={n(vals.rate)} years={n(vals.years)} propertyTax={n(vals.propertyTax)} />
      case 'houseAffordability': return <AffordabilityResults income={n(vals.income)} rate={n(vals.rate)} downPayment={n(vals.downPayment)} term={n(vals.term)} />
      case 'closingCosts': return <ClosingCostsResults homePrice={n(vals.homePrice)} downPayment={n(vals.downPayment)} />
      case 'rentalIncome': return <RentalIncomeResults monthlyRent={n(vals.monthlyRent)} expenses={n(vals.expenses)} downPayment={n(vals.downPayment)} propertyValue={n(vals.propertyValue)} />
      case 'capRate': return <CapRateResults noi={n(vals.noi)} propertyValue={n(vals.propertyValue)} />
      case 'cashOnCash': return <CashOnCashResults annualCashFlow={n(vals.annualCashFlow)} totalInvested={n(vals.totalInvested)} />
      case 'noiCalc': return <NoiResults rentalIncome={n(vals.rentalIncome)} vacancyRate={n(vals.vacancyRate)} operatingExpenses={n(vals.operatingExpenses)} />
      case 'roiRental': return <RentalIncomeResults monthlyRent={n(vals.monthlyRent)} expenses={n(vals.expenses)} downPayment={n(vals.downPayment)} propertyValue={n(vals.propertyValue)} />
      case 'incomeTax': return <TaxResults income={n(vals.income)} rate={n(vals.rate)} />
      case 'taxBracket': return <TaxBracketResults income={n(vals.income)} bracketStart={n(vals.bracketStart)} bracketRate={n(vals.bracketRate)} baseTax={n(vals.baseTax)} />
      case 'marginalTaxRate': return <MarginalTaxResults income={n(vals.income)} additionalIncome={n(vals.additionalIncome)} rate={n(vals.rate)} />
      case 'effectiveTaxRate': return <EffectiveTaxResults totalTax={n(vals.totalTax)} totalIncome={n(vals.totalIncome)} />
      case 'capitalGainsTax': return <CapitalGainsResults costBasis={n(vals.costBasis)} salePrice={n(vals.salePrice)} taxRate={n(vals.taxRate)} />
      case 'dividendTax': return <DividendTaxResults dividends={n(vals.dividends)} taxRate={n(vals.taxRate)} />
      case 'selfEmploymentTax': return <SelfEmploymentResults netEarnings={n(vals.netEarnings)} expenseRate={n(vals.expenseRate)} />
      case 'salesTax': return <SalesTaxResults price={n(vals.price)} taxRate={n(vals.taxRate)} />
      case 'vat': return <VatResults price={n(vals.price)} vatRate={n(vals.vatRate)} />
      case 'estateTax': return <EstateTaxResults estateValue={n(vals.estateValue)} exemption={n(vals.exemption)} taxRate={n(vals.taxRate)} />
      case 'taxRefundEstimator': return <TaxRefundResults withheld={n(vals.withheld)} taxLiability={n(vals.taxLiability)} />
      case 'itemizedVsStandardDeduction': return <ItemizedResults income={n(vals.income)} itemized={n(vals.itemized)} standard={n(vals.standard)} />
      case 'amt': return <AmtResults income={n(vals.income)} exemption={n(vals.exemption)} rate={n(vals.rate)} />
      case 'cryptoProfit': return <CryptoProfitResults buyPrice={n(vals.buyPrice)} sellPrice={n(vals.sellPrice)} quantity={n(vals.quantity)} />
      case 'cryptoMining': return <CryptoMiningResults hashRate={n(vals.hashRate)} power={n(vals.power)} />
      case 'cryptoStaking': return <CryptoStakingResults amount={n(vals.amount)} apy={n(vals.apy)} years={n(vals.years)} />
      case 'impermanentLoss': return <ImpermanentLossResults priceRatio={n(vals.priceRatio)} investA={n(vals.investA)} investB={n(vals.investB)} />
      case 'cryptoTax': return <CryptoProfitResults buyPrice={n(vals.buyPrice)} sellPrice={n(vals.sellPrice)} quantity={n(vals.quantity)} />
      case 'lifeInsurance': return <LifeInsuranceResults income={n(vals.income)} years={n(vals.years)} debts={n(vals.debts)} funeral={n(vals.funeral)} />
      case 'termVsWholeLife': return <TermVsWholeLifeResults age={n(vals.age)} termPremium={n(vals.termPremium)} wholePremium={n(vals.wholePremium)} years={n(vals.years)} />
      case 'disability': return <DisabilityResults income={n(vals.income)} benefitPct={n(vals.benefitPct)} elimination={n(vals.elimination)} />
      case 'creditUtilization': return <CreditUtilResults totalBalance={n(vals.totalBalance)} totalLimit={n(vals.totalLimit)} />
      case 'creditScore': return <CreditScoreResults paymentHistory={n(vals.paymentHistory)} utilization={n(vals.utilization)} length={n(vals.length)} mix={n(vals.mix)} inquiries={n(vals.inquiries)} />
      case 'balanceTransfer': return <BalanceTransferResults balance={n(vals.balance)} promoRate={n(vals.promoRate)} promoMonths={n(vals.promoMonths)} feeRate={n(vals.feeRate)} />
      case 'emergencyFund': return <EmergencyFundResults monthlyExpenses={n(vals.monthlyExpenses)} months={n(vals.months)} />
      case 'sinkingFund': return <SinkingFundResults goal={n(vals.goal)} rate={n(vals.rate)} years={n(vals.years)} />
      case 'savingsGoal': return <SavingsGoalResults goal={n(vals.goal)} current={n(vals.current)} rate={n(vals.rate)} years={n(vals.years)} monthlyAdd={n(vals.monthlyAdd)} />
      case 'collegeSavings': return <CollegeSavingsResults goal={n(vals.goal)} current={n(vals.current)} years={n(vals.years)} rate={n(vals.rate)} monthly={n(vals.monthly)} />
      case 'netWorth': return <NetWorthResults assets={n(vals.assets)} liabilities={n(vals.liabilities)} />
      case 'debtSnowball': return <DebtSnowballResults totalDebt={n(vals.totalDebt)} minPayment={n(vals.minPayment)} extraPayment={n(vals.extraPayment)} rate={n(vals.rate)} />
      case 'debtAvalanche': return <DebtAvalancheResults totalDebt={n(vals.totalDebt)} minPayment={n(vals.minPayment)} extraPayment={n(vals.extraPayment)} rate={n(vals.rate)} />
      case 'debtPayoffPlan': return <DebtPayoffPlanResults balance={n(vals.balance)} rate={n(vals.rate)} monthly={n(vals.monthly)} goalMonths={n(vals.goalMonths)} />
      case 'debtConsolidationSavings': return <ConsolidationSavingsResults totalDebt={n(vals.totalDebt)} currentRate={n(vals.currentRate)} newRate={n(vals.newRate)} term={n(vals.term)} />
      case 'pension': return <PensionResults currentSavings={n(vals.currentSavings)} monthlyContrib={n(vals.monthlyContrib)} rate={n(vals.rate)} years={n(vals.years)} />
      case 'socialSecurity': return <SocialSecurityResults age={n(vals.age)} earnings={n(vals.earnings)} retirementAge={n(vals.retirementAge)} />
      case 'annuity': return <AnnuityResults principal={n(vals.principal)} rate={n(vals.rate)} years={n(vals.years)} />
      case 'safeWithdrawalRate': return <SafeWithdrawalResults savings={n(vals.savings)} withdrawalRate={n(vals.withdrawalRate)} />
      case 'rmd': return <RmdResults balance={n(vals.balance)} age={n(vals.age)} />
      case 'businessValuation': return <BusinessValResults revenue={n(vals.revenue)} ebitda={n(vals.ebitda)} multiple={n(vals.multiple)} />
      case 'startupCosts': return <StartupCostsResults equipment={n(vals.equipment)} license={n(vals.license)} marketing={n(vals.marketing)} legal={n(vals.legal)} inventory={n(vals.inventory)} />
      case 'runway': return <RunwayResults cash={n(vals.cash)} monthlyBurn={n(vals.monthlyBurn)} monthlyRevenue={n(vals.monthlyRevenue)} />
      case 'burnRate': return <BurnRateResults startCash={n(vals.startCash)} endCash={n(vals.endCash)} months={n(vals.months)} />
      case 'cac': return <CACResults salesCost={n(vals.salesCost)} newCustomers={n(vals.newCustomers)} />
      case 'ltvCalc': return <LTVCResults avgRevenue={n(vals.avgRevenue)} churnRate={n(vals.churnRate)} />
      case 'ltvCacRatio': return <LTVCACRatioResults ltv={n(vals.ltv)} cac={n(vals.cac)} />
      case 'churnRate': return <ChurnResults lostCustomers={n(vals.lostCustomers)} startCustomers={n(vals.startCustomers)} />
      case 'mrr': return <MRRResults subscribers={n(vals.subscribers)} avgPrice={n(vals.avgPrice)} />
      case 'arr': return <ARRResults mrr={n(vals.mrr)} />
      case 'unitEconomics': return <UnitEconResults price={n(vals.price)} varCost={n(vals.varCost)} fixedCost={n(vals.fixedCost)} units={n(vals.units)} />
      case 'contributionMargin': return <ContributionMarginResults revenue={n(vals.revenue)} varCosts={n(vals.varCosts)} />
      case 'operatingLeverage': return <OperatingLeverageResults revenue={n(vals.revenue)} varCosts={n(vals.varCosts)} fixedCosts={n(vals.fixedCosts)} />
      case 'financialLeverage': return <FinLeverageResults ebit={n(vals.ebit)} interest={n(vals.interest)} />
      case 'grossProfit': return <GrossProfitFunc revenue={n(vals.revenue)} cogs={n(vals.cogs)} />
      case 'netProfit': return <NetProfitResults revenue={n(vals.revenue)} expenses={n(vals.expenses)} />
      case 'profitMargin': return <ProfitMarginResults revenue={n(vals.revenue)} profit={n(vals.profit)} />
      case 'costVolumeProfit': return <CostVolumeResults fixedCosts={n(vals.fixedCosts)} pricePerUnit={n(vals.pricePerUnit)} varCostPerUnit={n(vals.varCostPerUnit)} units={n(vals.units)} />
      case 'markupCalc': return <MarkupResults cost={n(vals.cost)} markup={n(vals.markup)} />
      case 'carAffordability': return <CarAffordResults monthlyPayment={n(vals.monthlyPayment)} rate={n(vals.rate)} term={n(vals.term)} />
      case 'childCare': return <ChildCareResults weeklyCost={n(vals.weeklyCost)} weeksPerYear={n(vals.weeksPerYear)} />
      case 'petExpense': return <PetExpenseResults food={n(vals.food)} vet={n(vals.vet)} supplies={n(vals.supplies)} other={n(vals.other)} />
      case 'fiftyThirtyTwenty': return <BudgetRuleResults income={n(vals.income)} needs={n(vals.needs)} wants={n(vals.wants)} savings={n(vals.savings)} />
      case 'zeroBasedBudget': return <ZeroBasedBudgetResults income={n(vals.income)} category1={n(vals.category1)} category2={n(vals.category2)} category3={n(vals.category3)} category4={n(vals.category4)} />
      case 'envelopeSystem': return <EnvelopeBudgetResults income={n(vals.income)} envelopes={n(vals.envelopes)} perEnvelope={n(vals.perEnvelope)} />
      case 'payYourselfFirst': return <PayYourselfFirstResults income={n(vals.income)} savingsPct={n(vals.savingsPct)} />
      case 'weddingBudget': return <WeddingBudgetResults guestCount={n(vals.guestCount)} budget={n(vals.budget)} />
      case 'vacationBudget': return <VacationBudgetResults transport={n(vals.transport)} lodging={n(vals.lodging)} food={n(vals.food)} activities={n(vals.activities)} />
      case 'holidayBudget': return <HolidayBudgetResults gifts={n(vals.gifts)} travel={n(vals.travel)} food={n(vals.food)} decorations={n(vals.decorations)} />
      case 'groceryBudget': return <GroceryBudgetResults householdSize={n(vals.householdSize)} weeklyTarget={n(vals.weeklyTarget)} />
      case 'monthlyBudget': return <MonthlyBudgetResults income={n(vals.income)} housing={n(vals.housing)} food={n(vals.food)} transport={n(vals.transport)} utilities={n(vals.utilities)} other={n(vals.other)} />
      case 'annualBudget': return <AnnualBudgetResults income={n(vals.income)} housing={n(vals.housing)} food={n(vals.food)} transport={n(vals.transport)} utilities={n(vals.utilities)} savings={n(vals.savings)} />
      case 'homeInsurance': return <HomeInsResults homeValue={n(vals.homeValue)} deductible={n(vals.deductible)} />
      case 'autoInsurance': return <AutoInsResults carValue={n(vals.carValue)} deductible={n(vals.deductible)} />
      case 'healthInsuranceComparison': return <HealthInsCompResults premium1={n(vals.premium1)} deductible1={n(vals.deductible1)} oopMax1={n(vals.oopMax1)} premium2={n(vals.premium2)} deductible2={n(vals.deductible2)} oopMax2={n(vals.oopMax2)} />
      case 'deductibleVsPremium': return <DeductibleVsPremiumResults lowPremium={n(vals.lowPremium)} lowDeductible={n(vals.lowDeductible)} highPremium={n(vals.highPremium)} highDeductible={n(vals.highDeductible)} />
      case 'outOfPocketMaximum': return <OopResults deductible={n(vals.deductible)} coinsurance={n(vals.coinsurance)} oopMax={n(vals.oopMax)} />
      case 'propertyTaxDeduction': return <PropertyTaxDeductionResults propertyTaxPaid={n(vals.propertyTaxPaid)} marginalRate={n(vals.marginalRate)} />
      case 'giftTax': return <GiftTaxResults giftAmount={n(vals.giftAmount)} annualExclusion={n(vals.annualExclusion)} />
      case 'inheritanceTax': return <InheritanceTaxResults inheritanceAmount={n(vals.inheritanceAmount)} stateExemption={n(vals.stateExemption)} taxRate={n(vals.taxRate)} />
      case 'sideHustleTax': return <SideHustleTaxResults income={n(vals.income)} expenses={n(vals.expenses)} otherIncome={n(vals.otherIncome)} />
      case 'gigEconomyTax': return <SideHustleTaxResults income={n(vals.income)} expenses={n(vals.expenses)} otherIncome={n(vals.otherIncome)} />
      case 'interestIncomeTax': return <TaxResults income={n(vals.income)} rate={n(vals.rate)} />
      case 'rentalIncomeTax': return <RentIncomeTaxResults rentIncome={n(vals.rentIncome)} expenses={n(vals.expenses)} depreciation={n(vals.depreciation)} />
      case 'amortization': return <PaymentResults p={n(vals.principal)} r={n(vals.rate)} t={n(vals.term)} />
      case 'loanComparison': return <LoanComparisonResults amount={n(vals.amount)} rate1={n(vals.rate1)} term1={n(vals.term1)} rate2={n(vals.rate2)} term2={n(vals.term2)} />
      case 'biweeklyPayment': return <BiweeklyPayResults principal={n(vals.principal)} rate={n(vals.rate)} term={n(vals.term)} />
      default: return <PaymentResults p={n(vals.principal)} r={n(vals.rate)} t={n(vals.term)} />
    }
  }, [watched, calcType])

  const field = (name: string, label: string, opts?: { min?: number; max?: number; step?: number; lockable?: boolean; unit?: string }) =>
    useSlider
      ? <CalculatorSlider key={name} name={name} label={label} min={opts?.min} max={opts?.max} step={opts?.step ?? 1} unit={opts?.unit} locked={opts?.lockable !== false ? lockedFields.has(name) : undefined} onLockToggle={opts?.lockable !== false ? toggleLock : undefined} />
      : <CalculatorFormField key={name} name={name} label={label} min={opts?.min} max={opts?.max} step={(opts?.step ?? 1).toString()} locked={opts?.lockable !== false ? lockedFields.has(name) : undefined} onLockToggle={opts?.lockable !== false ? toggleLock : undefined} />
  const sel = (name: string, label: string, options: { value: string; label: string }[]) => (
    <div key={name}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <select {...form.register(name)} className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
  type FMode = 'basic' | 'advanced' | 'professional' | 'expert'
  type FDef = { name: string; label: string; min?: number; max?: number; step?: number; lockable?: boolean; mode?: FMode }
  const simpleFormFields: Partial<Record<CalcType, (FDef | (() => JSX.Element))[]>> = {
    simpleInterest: [{ name: 'principal', label: 'Principal ($)', max: 10000000, step: 100 }, { name: 'rate', label: 'Rate %', max: 50, step: 0.01 }, { name: 'years', label: 'Years', max: 50, mode: 'advanced' }],
    apyCalc: [{ name: 'rate', label: 'APR %', max: 50, step: 0.01 }, () => sel('compound', 'Compounding', [{ value: 'monthly', label: 'Monthly' }, { value: 'quarterly', label: 'Quarterly' }, { value: 'yearly', label: 'Yearly' }]), { name: 'years', label: 'Years', max: 50, mode: 'advanced' }],
    aprCalc: [{ name: 'rate', label: 'APR %', max: 50, step: 0.01 }, () => sel('compound', 'Compounding', [{ value: 'monthly', label: 'Monthly' }, { value: 'quarterly', label: 'Quarterly' }, { value: 'yearly', label: 'Yearly' }]), { name: 'years', label: 'Years', max: 50, mode: 'advanced' }],
    futureValue: [{ name: 'present', label: 'Present Value ($)', max: 10000000, step: 100 }, { name: 'rate', label: 'Rate %', max: 30, step: 0.1 }, { name: 'years', label: 'Years', max: 60 }, { name: 'monthlyAdd', label: 'Monthly Addition ($)', max: 100000, step: 50, mode: 'advanced' }],
    presentValue: [{ name: 'present', label: 'Future Value ($)', max: 10000000, step: 100 }, { name: 'rate', label: 'Rate %', max: 30, step: 0.1 }, { name: 'years', label: 'Years', max: 60, mode: 'advanced' }],
    roi: [{ name: 'initial', label: 'Initial Investment ($)', max: 10000000, step: 100 }, { name: 'final', label: 'Final Value ($)', max: 10000000, step: 100 }, { name: 'years', label: 'Years', max: 50, mode: 'professional' }],
    npv: [{ name: 'initial', label: 'Initial Investment ($)', max: 10000000, step: 100 }, { name: 'cashFlows', label: 'Annual Cash Flow ($)', max: 10000000, step: 100 }, { name: 'rate', label: 'Discount Rate %', max: 50, step: 0.1 }, { name: 'years', label: 'Years', max: 50, mode: 'advanced' }],
    irr: [{ name: 'initial', label: 'Initial Investment ($)', max: 10000000, step: 100 }, { name: 'cashFlow', label: 'Annual Cash Flow ($)', max: 10000000, step: 100 }, { name: 'years', label: 'Years', max: 50, mode: 'advanced' }],
    paybackPeriod: [{ name: 'initial', label: 'Initial Investment ($)', max: 10000000, step: 100 }, { name: 'cashFlow', label: 'Annual Cash Flow ($)', max: 10000000, step: 100, mode: 'advanced' }],
    breakEven: [{ name: 'fixedCosts', label: 'Fixed Costs ($)', max: 10000000, step: 100 }, { name: 'pricePerUnit', label: 'Price Per Unit ($)', max: 100000, step: 1 }, { name: 'varCostPerUnit', label: 'Variable Cost/Unit ($)', max: 100000, step: 1, mode: 'advanced' }],
    bondYield: [{ name: 'price', label: 'Current Price ($)', max: 100000, step: 10 }, { name: 'faceValue', label: 'Face Value ($)', max: 100000, step: 10 }, { name: 'coupon', label: 'Annual Coupon ($)', max: 10000, step: 10, mode: 'advanced' }, { name: 'years', label: 'Years to Maturity', max: 50, mode: 'professional' }],
    bondPrice: [{ name: 'faceValue', label: 'Face Value ($)', max: 100000, step: 10 }, { name: 'coupon', label: 'Annual Coupon ($)', max: 10000, step: 10, mode: 'advanced' }, { name: 'rate', label: 'YTM %', max: 30, step: 0.01 }, { name: 'years', label: 'Years to Maturity', max: 50, mode: 'professional' }],
    couponPayment: [{ name: 'faceValue', label: 'Face Value ($)', max: 100000, step: 10 }, { name: 'couponRate', label: 'Coupon Rate %', max: 20, step: 0.01, mode: 'advanced' }, () => sel('freq', 'Frequency', [{ value: 'annual', label: 'Annual' }, { value: 'semiannual', label: 'Semi-Annual' }, { value: 'quarterly', label: 'Quarterly' }])],
    taxEquivalentYield: [{ name: 'muniYield', label: 'Municipal Yield %', max: 20, step: 0.01 }, { name: 'taxRate', label: 'Tax Rate %', max: 50, step: 0.1, mode: 'advanced' }],
    dividendYield: [{ name: 'pricePerShare', label: 'Price Per Share ($)', max: 10000, step: 1 }, { name: 'annualDividend', label: 'Annual Dividend/Share ($)', max: 1000, step: 0.1, mode: 'advanced' }],
    dividendPayout: [{ name: 'dividends', label: 'Total Dividends ($)', max: 100000000, step: 1000 }, { name: 'netIncome', label: 'Net Income ($)', max: 1000000000, step: 1000, mode: 'advanced' }],
    eps: [{ name: 'netIncome', label: 'Net Income ($)', max: 1000000000, step: 1000 }, { name: 'shares', label: 'Shares Outstanding', max: 10000000000, step: 1000, mode: 'advanced' }],
    pe: [{ name: 'price', label: 'Stock Price ($)', max: 10000, step: 1 }, { name: 'eps', label: 'EPS ($)', max: 10000, step: 0.1, mode: 'advanced' }],
    pb: [{ name: 'price', label: 'Stock Price ($)', max: 10000, step: 1 }, { name: 'bookValue', label: 'Book Value/Share ($)', max: 10000, step: 1, mode: 'advanced' }],
    ps: [{ name: 'price', label: 'Stock Price ($)', max: 10000, step: 1 }, { name: 'salesPerShare', label: 'Sales/Share ($)', max: 10000, step: 1, mode: 'advanced' }],
    peg: [{ name: 'pe', label: 'P/E Ratio', max: 100, step: 0.1 }, { name: 'growth', label: 'Earnings Growth Rate %', max: 100, step: 0.1, mode: 'advanced' }],
    dividendGrowthRate: [{ name: 'currentDividend', label: 'Current Dividend ($)', max: 1000, step: 0.1 }, { name: 'years', label: 'Years Ago', max: 50 }, { name: 'priorDividend', label: 'Dividend $ Years Ago', max: 1000, step: 0.1, mode: 'advanced' }],
    payoutRatio: [{ name: 'dividendsPerShare', label: 'Dividends/Share ($)', max: 1000, step: 0.1 }, { name: 'eps', label: 'EPS ($)', max: 1000, step: 0.1, mode: 'advanced' }],
    retentionRatio: [{ name: 'payoutRatio', label: 'Payout Ratio %', max: 100, step: 1, mode: 'advanced' }],
    stockAverageCost: [{ name: 'shares', label: 'Current Shares', max: 100000, step: 1 }, { name: 'totalCost', label: 'Total Cost ($)', max: 10000000, step: 100 }, { name: 'newShares', label: 'New Shares', max: 100000, step: 1, mode: 'advanced' }, { name: 'newPrice', label: 'New Price/Share ($)', max: 10000, step: 1, mode: 'professional' }],
    dollarCostAveraging: [{ name: 'monthlyInvest', label: 'Monthly Investment ($)', max: 100000, step: 50 }, { name: 'pricePerShare', label: 'Price/Share ($)', max: 10000, step: 1 }, { name: 'months', label: 'Months', max: 600, mode: 'advanced' }],
    costBasis: [{ name: 'purchasePrice', label: 'Purchase Price/Share ($)', max: 10000, step: 1 }, { name: 'shares', label: 'Shares', max: 100000, step: 1 }, { name: 'commissions', label: 'Commissions ($)', max: 1000, step: 1, mode: 'professional' }],
    portfolioReturn: [{ name: 'return1', label: 'Asset 1 Return %', max: 100, step: 0.1 }, { name: 'weight1', label: 'Asset 1 Weight %', max: 100, step: 1 }, { name: 'return2', label: 'Asset 2 Return %', max: 100, step: 0.1, mode: 'advanced' }, { name: 'weight2', label: 'Asset 2 Weight %', max: 100, step: 1, mode: 'professional' }],
    sharpeRatio: [{ name: 'portfolioReturn', label: 'Portfolio Return %', max: 100, step: 0.1 }, { name: 'riskFreeRate', label: 'Risk-Free Rate %', max: 20, step: 0.1 }, { name: 'stdDev', label: 'Std Dev %', max: 100, step: 0.1, mode: 'advanced' }],
    sortinoRatio: [{ name: 'portfolioReturn', label: 'Portfolio Return %', max: 100, step: 0.1 }, { name: 'riskFreeRate', label: 'Risk-Free Rate %', max: 20, step: 0.1 }, { name: 'downsideDev', label: 'Downside Dev %', max: 100, step: 0.1, mode: 'advanced' }],
    alpha: [{ name: 'portfolioReturn', label: 'Portfolio Return %', max: 100, step: 0.1 }, { name: 'riskFreeRate', label: 'Risk-Free Rate %', max: 20, step: 0.1 }, { name: 'beta', label: 'Beta', max: 10, step: 0.01, mode: 'advanced' }, { name: 'marketReturn', label: 'Market Return %', max: 100, step: 0.1, mode: 'professional' }],
    beta: [{ name: 'stockReturn', label: 'Stock Return %', max: 100, step: 0.1 }, { name: 'marketReturn', label: 'Market Return %', max: 100, step: 0.1, mode: 'advanced' }],
    rSquared: [{ name: 'correlation', label: 'Correlation r', max: 1, step: 0.01, mode: 'advanced' }],
    valueAtRisk: [{ name: 'portfolioValue', label: 'Portfolio Value ($)', max: 100000000, step: 1000 }, { name: 'meanReturn', label: 'Mean Return %', max: 100, step: 0.1 }, { name: 'stdDev', label: 'Std Dev %', max: 100, step: 0.1, mode: 'advanced' }, () => sel('confidence', 'Confidence Level', [{ value: '95', label: '95%' }, { value: '99', label: '99%' }])],
    dti: [{ name: 'monthlyDebt', label: 'Monthly Debt ($)', max: 100000, step: 100 }, { name: 'monthlyIncome', label: 'Monthly Income ($)', max: 1000000, step: 100, mode: 'advanced' }],
    ltv: [{ name: 'loanAmount', label: 'Loan Amount ($)', max: 10000000, step: 1000 }, { name: 'propertyValue', label: 'Property Value ($)', max: 10000000, step: 1000, mode: 'advanced' }],
    dscr: [{ name: 'noi', label: 'Net Operating Income ($)', max: 10000000, step: 1000 }, { name: 'debtService', label: 'Annual Debt Service ($)', max: 10000000, step: 1000, mode: 'advanced' }],
    interestCoverage: [{ name: 'ebit', label: 'EBIT ($)', max: 100000000, step: 1000 }, { name: 'interestExpense', label: 'Interest Expense ($)', max: 100000000, step: 1000, mode: 'advanced' }],
    fixedChargeCoverage: [{ name: 'ebit', label: 'EBIT ($)', max: 100000000, step: 1000 }, { name: 'interestExpense', label: 'Interest Expense ($)', max: 100000000, step: 1000, mode: 'advanced' }],
    tie: [{ name: 'ebit', label: 'EBIT ($)', max: 100000000, step: 1000 }, { name: 'interestExpense', label: 'Interest Expense ($)', max: 100000000, step: 1000, mode: 'advanced' }],
    workingCapital: [{ name: 'currentAssets', label: 'Current Assets ($)', max: 100000000, step: 1000 }, { name: 'currentLiabilities', label: 'Current Liabilities ($)', max: 100000000, step: 1000, mode: 'advanced' }],
    currentRatio: [{ name: 'currentAssets', label: 'Current Assets ($)', max: 100000000, step: 1000 }, { name: 'currentLiabilities', label: 'Current Liabilities ($)', max: 100000000, step: 1000, mode: 'advanced' }],
    quickRatio: [{ name: 'currentAssets', label: 'Current Assets ($)', max: 100000000, step: 1000 }, { name: 'currentLiabilities', label: 'Current Liabilities ($)', max: 100000000, step: 1000, mode: 'advanced' }],
    cashRatio: [{ name: 'currentAssets', label: 'Current Assets ($)', max: 100000000, step: 1000 }, { name: 'currentLiabilities', label: 'Current Liabilities ($)', max: 100000000, step: 1000, mode: 'advanced' }],
    inventoryTurnover: [{ name: 'cogs', label: 'COGS ($)', max: 100000000, step: 1000 }, { name: 'avgInventory', label: 'Average Inventory ($)', max: 100000000, step: 1000, mode: 'advanced' }],
    assetTurnover: [{ name: 'revenue', label: 'Revenue ($)', max: 1000000000, step: 1000 }, { name: 'avgAssets', label: 'Average Assets ($)', max: 1000000000, step: 1000, mode: 'advanced' }],
    roa: [{ name: 'netIncome', label: 'Net Income ($)', max: 1000000000, step: 1000 }, { name: 'avgEquity', label: 'Average Equity ($)', max: 1000000000, step: 1000, mode: 'advanced' }, { name: 'avgAssets', label: 'Average Assets ($)', max: 1000000000, step: 1000, mode: 'professional' }],
    roe: [{ name: 'netIncome', label: 'Net Income ($)', max: 1000000000, step: 1000 }, { name: 'avgEquity', label: 'Average Equity ($)', max: 1000000000, step: 1000, mode: 'advanced' }, { name: 'avgAssets', label: 'Average Assets ($)', max: 1000000000, step: 1000, mode: 'professional' }],
    debtToAsset: [{ name: 'totalDebt', label: 'Total Debt ($)', max: 1000000000, step: 1000 }, { name: 'totalEquity', label: 'Total Equity ($)', max: 1000000000, step: 1000, mode: 'advanced' }, { name: 'totalAssets', label: 'Total Assets ($)', max: 1000000000, step: 1000, mode: 'professional' }],
    debtToEquity: [{ name: 'totalDebt', label: 'Total Debt ($)', max: 1000000000, step: 1000 }, { name: 'totalEquity', label: 'Total Equity ($)', max: 1000000000, step: 1000, mode: 'advanced' }, { name: 'totalAssets', label: 'Total Assets ($)', max: 1000000000, step: 1000, mode: 'professional' }],
    rentVsBuy: [{ name: 'rent', label: 'Monthly Rent ($)', max: 10000, step: 100 }, { name: 'homePrice', label: 'Home Price ($)', max: 2000000, step: 1000 }, { name: 'downPayment', label: 'Down Payment ($)', max: 2000000, step: 1000 }, { name: 'rate', label: 'Mortgage Rate %', max: 20, step: 0.01 }, { name: 'years', label: 'Years', max: 40, mode: 'advanced' }, { name: 'propertyTax', label: 'Annual Property Tax ($)', max: 50000, step: 100, mode: 'advanced' }],
    houseAffordability: [{ name: 'income', label: 'Annual Income ($)', max: 10000000, step: 1000 }, { name: 'rate', label: 'Interest Rate %', max: 30, step: 0.01 }, { name: 'downPayment', label: 'Down Payment ($)', max: 5000000, step: 1000 }, { name: 'term', label: 'Loan Term (years)', max: 40, mode: 'advanced' }],
    closingCosts: [{ name: 'homePrice', label: 'Home Price ($)', max: 2000000, step: 1000 }, { name: 'downPayment', label: 'Down Payment ($)', max: 2000000, step: 1000, mode: 'advanced' }],
    rentalIncome: [{ name: 'monthlyRent', label: 'Monthly Rent ($)', max: 50000, step: 100 }, { name: 'expenses', label: 'Monthly Expenses ($)', max: 50000, step: 100 }, { name: 'downPayment', label: 'Down Payment ($)', max: 5000000, step: 1000, mode: 'advanced' }, { name: 'propertyValue', label: 'Property Value ($)', max: 10000000, step: 1000, mode: 'professional' }],
    capRate: [{ name: 'noi', label: 'Annual NOI ($)', max: 10000000, step: 1000 }, { name: 'propertyValue', label: 'Property Value ($)', max: 10000000, step: 1000, mode: 'advanced' }],
    cashOnCash: [{ name: 'annualCashFlow', label: 'Annual Cash Flow ($)', max: 10000000, step: 1000 }, { name: 'totalInvested', label: 'Total Cash Invested ($)', max: 10000000, step: 1000, mode: 'advanced' }],
    noiCalc: [{ name: 'rentalIncome', label: 'Monthly Rent ($)', max: 50000, step: 100 }, { name: 'vacancyRate', label: 'Vacancy Rate %', max: 50, step: 0.5 }, { name: 'operatingExpenses', label: 'Annual Expenses ($)', max: 500000, step: 100, mode: 'advanced' }],
    roiRental: [{ name: 'monthlyRent', label: 'Monthly Rent ($)', max: 50000, step: 100 }, { name: 'expenses', label: 'Monthly Expenses ($)', max: 50000, step: 100 }, { name: 'downPayment', label: 'Down Payment ($)', max: 5000000, step: 1000, mode: 'advanced' }, { name: 'propertyValue', label: 'Property Value ($)', max: 10000000, step: 1000, mode: 'professional' }],
    incomeTax: [{ name: 'income', label: 'Taxable Income', max: 10000000, step: 100 }, { name: 'rate', label: 'Tax Rate %', max: 50, step: 0.1, mode: 'advanced' }],
    taxBracket: [{ name: 'income', label: 'Taxable Income ($)', max: 10000000, step: 100 }, { name: 'bracketStart', label: 'Bracket Threshold ($)', max: 10000000, step: 100 }, { name: 'bracketRate', label: 'Bracket Rate %', max: 50, step: 0.1, mode: 'advanced' }, { name: 'baseTax', label: 'Base Tax ($)', max: 5000000, step: 100, mode: 'professional' }],
    marginalTaxRate: [{ name: 'income', label: 'Income ($)', max: 10000000, step: 100 }, { name: 'additionalIncome', label: 'Additional Income ($)', max: 10000000, step: 100 }, { name: 'rate', label: 'Marginal Rate %', max: 50, step: 0.1, mode: 'advanced' }],
    effectiveTaxRate: [{ name: 'totalTax', label: 'Total Tax Paid ($)', max: 10000000, step: 100 }, { name: 'totalIncome', label: 'Total Income ($)', max: 10000000, step: 100, mode: 'advanced' }],
    capitalGainsTax: [{ name: 'costBasis', label: 'Cost Basis ($)', max: 10000000, step: 100 }, { name: 'salePrice', label: 'Sale Price ($)', max: 10000000, step: 100 }, { name: 'taxRate', label: 'Capital Gains Tax Rate %', max: 40, step: 0.1, mode: 'advanced' }],
    dividendTax: [{ name: 'dividends', label: 'Qualified Dividends ($)', max: 10000000, step: 100 }, { name: 'taxRate', label: 'Tax Rate %', max: 40, step: 0.1, mode: 'advanced' }],
    selfEmploymentTax: [{ name: 'netEarnings', label: 'Net Earnings ($)', max: 10000000, step: 100 }, { name: 'expenseRate', label: 'Expense Deduction %', max: 50, step: 1, mode: 'advanced' }],
    salesTax: [{ name: 'price', label: 'Price ($)', max: 10000000, step: 100 }, { name: 'taxRate', label: 'Sales Tax Rate %', max: 20, step: 0.1, mode: 'advanced' }],
    vat: [{ name: 'price', label: 'Price ($)', max: 10000000, step: 100 }, { name: 'vatRate', label: 'VAT Rate %', max: 30, step: 0.1, mode: 'advanced' }],
    estateTax: [{ name: 'estateValue', label: 'Estate Value ($)', max: 100000000, step: 10000 }, { name: 'exemption', label: 'Exemption ($)', max: 100000000, step: 10000 }, { name: 'taxRate', label: 'Estate Tax Rate %', max: 60, step: 0.1, mode: 'advanced' }],
    taxRefundEstimator: [{ name: 'withheld', label: 'Total Withheld ($)', max: 10000000, step: 100 }, { name: 'taxLiability', label: 'Tax Liability ($)', max: 10000000, step: 100, mode: 'advanced' }],
    itemizedVsStandardDeduction: [{ name: 'income', label: 'Income ($)', max: 10000000, step: 100 }, { name: 'itemized', label: 'Itemized Deductions ($)', max: 10000000, step: 100 }, { name: 'standard', label: 'Standard Deduction ($)', max: 50000, step: 100, mode: 'advanced' }],
    amt: [{ name: 'income', label: 'AMT Income ($)', max: 10000000, step: 100 }, { name: 'exemption', label: 'AMT Exemption ($)', max: 10000000, step: 100 }, { name: 'rate', label: 'AMT Rate %', max: 50, step: 0.1, mode: 'advanced' }],
    cryptoProfit: [{ name: 'buyPrice', label: 'Buy Price ($)', max: 1000000, step: 100 }, { name: 'sellPrice', label: 'Sell Price ($)', max: 1000000, step: 100 }, { name: 'quantity', label: 'Quantity', max: 10000000, step: 0.01, mode: 'advanced' }],
    cryptoMining: [{ name: 'hashRate', label: 'Hash Rate (MH/s)', max: 1000000, step: 10 }, { name: 'power', label: 'Power (Watts)', max: 10000, step: 50, mode: 'advanced' }],
    cryptoStaking: [{ name: 'amount', label: 'Stake Amount ($)', max: 10000000, step: 100 }, { name: 'apy', label: 'APY %', max: 100, step: 0.1 }, { name: 'years', label: 'Years', max: 50, mode: 'advanced' }],
    impermanentLoss: [{ name: 'priceRatio', label: 'Price Ratio (new/old)', max: 10, step: 0.01 }, { name: 'investA', label: 'Initial A ($)', max: 10000000, step: 100 }, { name: 'investB', label: 'Initial B ($)', max: 10000000, step: 100, mode: 'advanced' }],
    cryptoTax: [{ name: 'buyPrice', label: 'Buy Price ($)', max: 1000000, step: 100 }, { name: 'sellPrice', label: 'Sell Price ($)', max: 1000000, step: 100 }, { name: 'quantity', label: 'Quantity', max: 10000000, step: 0.01, mode: 'advanced' }],
    lifeInsurance: [{ name: 'income', label: 'Annual Income ($)', max: 10000000, step: 100 }, { name: 'years', label: 'Years to Cover', max: 50 }, { name: 'debts', label: 'Total Debts ($)', max: 10000000, step: 100, mode: 'advanced' }, { name: 'funeral', label: 'Funeral Costs ($)', max: 100000, step: 100, mode: 'professional' }],
    termVsWholeLife: [{ name: 'age', label: 'Your Age', max: 90 }, { name: 'termPremium', label: 'Term Premium ($/mo)', max: 5000, step: 5 }, { name: 'wholePremium', label: 'Whole Life Premium ($/mo)', max: 5000, step: 5 }, { name: 'years', label: 'Years', max: 50, mode: 'advanced' }],
    disability: [{ name: 'income', label: 'Monthly Income ($)', max: 100000, step: 100 }, { name: 'benefitPct', label: 'Benefit %', max: 100, step: 1 }, { name: 'elimination', label: 'Elimination Period (months)', max: 24, mode: 'advanced' }],
    creditUtilization: [{ name: 'totalBalance', label: 'Total Balance ($)', max: 1000000, step: 100 }, { name: 'totalLimit', label: 'Total Credit Limit ($)', max: 1000000, step: 100, mode: 'advanced' }],
    creditScore: [{ name: 'paymentHistory', label: 'Payment History', max: 850, step: 1 }, { name: 'utilization', label: 'Credit Utilization', max: 300, step: 1 }, { name: 'length', label: 'Credit History', max: 300, step: 1, mode: 'advanced' }, { name: 'mix', label: 'Credit Mix', max: 150, step: 1, mode: 'professional' }, { name: 'inquiries', label: 'New Credit', max: 100, step: 1, mode: 'expert' }],
    balanceTransfer: [{ name: 'balance', label: 'Transfer Balance ($)', max: 100000, step: 100 }, { name: 'promoRate', label: 'Promo APR %', max: 30, step: 0.01 }, { name: 'promoMonths', label: 'Promo Months', max: 60, mode: 'advanced' }, { name: 'feeRate', label: 'Transfer Fee %', max: 10, step: 0.1, mode: 'professional' }],
    emergencyFund: [{ name: 'monthlyExpenses', label: 'Monthly Expenses ($)', max: 50000, step: 100 }, { name: 'months', label: 'Months to Cover', max: 24, mode: 'advanced' }],
    sinkingFund: [{ name: 'goal', label: 'Savings Goal ($)', max: 10000000, step: 100 }, { name: 'rate', label: 'Annual Rate %', max: 30, step: 0.1 }, { name: 'years', label: 'Years', max: 50, mode: 'advanced' }],
    savingsGoal: [{ name: 'goal', label: 'Target Amount ($)', max: 10000000, step: 100 }, { name: 'current', label: 'Current Savings ($)', max: 10000000, step: 100 }, { name: 'rate', label: 'Annual Return %', max: 30, step: 0.1 }, { name: 'years', label: 'Years', max: 50 }, { name: 'monthlyAdd', label: 'Monthly Addition ($)', max: 100000, step: 50, mode: 'advanced' }],
    collegeSavings: [{ name: 'goal', label: 'College Cost ($)', max: 10000000, step: 100 }, { name: 'current', label: 'Current Savings ($)', max: 10000000, step: 100 }, { name: 'years', label: 'Years Until College', max: 25 }, { name: 'rate', label: 'Expected Return %', max: 30, step: 0.1, mode: 'advanced' }, { name: 'monthly', label: 'Monthly Contribution ($)', max: 50000, step: 50, mode: 'professional' }],
    netWorth: [{ name: 'assets', label: 'Total Assets ($)', max: 100000000, step: 1000 }, { name: 'liabilities', label: 'Total Liabilities ($)', max: 100000000, step: 1000, mode: 'advanced' }],
    debtSnowball: [{ name: 'totalDebt', label: 'Total Debt ($)', max: 10000000, step: 100 }, { name: 'minPayment', label: 'Min Payment ($)', max: 50000, step: 10 }, { name: 'extraPayment', label: 'Extra Payment ($)', max: 50000, step: 10, mode: 'advanced' }, { name: 'rate', label: 'Avg Rate %', max: 36, step: 0.01, mode: 'professional' }],
    debtAvalanche: [{ name: 'totalDebt', label: 'Total Debt ($)', max: 10000000, step: 100 }, { name: 'minPayment', label: 'Min Payment ($)', max: 50000, step: 10 }, { name: 'extraPayment', label: 'Extra Payment ($)', max: 50000, step: 10, mode: 'advanced' }, { name: 'rate', label: 'Avg Rate %', max: 36, step: 0.01, mode: 'professional' }],
    debtPayoffPlan: [{ name: 'balance', label: 'Balance ($)', max: 10000000, step: 100 }, { name: 'rate', label: 'Rate %', max: 36, step: 0.01 }, { name: 'monthly', label: 'Monthly Payment ($)', max: 50000, step: 10 }, { name: 'goalMonths', label: 'Goal Months', max: 120, mode: 'advanced' }],
    debtConsolidationSavings: [{ name: 'totalDebt', label: 'Total Debt ($)', max: 10000000, step: 100 }, { name: 'currentRate', label: 'Current Avg Rate %', max: 36, step: 0.01 }, { name: 'newRate', label: 'New Rate %', max: 36, step: 0.01 }, { name: 'term', label: 'New Term (years)', max: 30, mode: 'advanced' }],
    pension: [{ name: 'currentSavings', label: 'Current Savings ($)', max: 10000000, step: 1000 }, { name: 'monthlyContrib', label: 'Monthly Contribution ($)', max: 50000, step: 50 }, { name: 'rate', label: 'Annual Return %', max: 30, step: 0.1 }, { name: 'years', label: 'Years Until Retirement', max: 50, mode: 'advanced' }],
    socialSecurity: [{ name: 'age', label: 'Your Age', max: 90 }, { name: 'earnings', label: 'Annual Income ($)', max: 10000000, step: 1000 }, { name: 'retirementAge', label: 'Retirement Age', max: 100, mode: 'advanced' }],
    annuity: [{ name: 'principal', label: 'Principal ($)', max: 10000000, step: 100 }, { name: 'rate', label: 'Annual Rate %', max: 30, step: 0.1 }, { name: 'years', label: 'Years', max: 50, mode: 'advanced' }],
    safeWithdrawalRate: [{ name: 'savings', label: 'Total Savings ($)', max: 100000000, step: 1000 }, { name: 'withdrawalRate', label: 'Withdrawal Rate %', max: 20, step: 0.1, mode: 'advanced' }],
    rmd: [{ name: 'balance', label: 'Account Balance ($)', max: 10000000, step: 1000 }, { name: 'age', label: 'Your Age', max: 95, mode: 'advanced' }],
    businessValuation: [{ name: 'revenue', label: 'Annual Revenue ($)', max: 1000000000, step: 10000 }, { name: 'ebitda', label: 'EBITDA ($)', max: 100000000, step: 10000 }, { name: 'multiple', label: 'Valuation Multiple', max: 30, step: 0.5, mode: 'advanced' }],
    startupCosts: [{ name: 'equipment', label: 'Equipment ($)', max: 10000000, step: 100 }, { name: 'license', label: 'Licenses ($)', max: 100000, step: 100, mode: 'advanced' }, { name: 'marketing', label: 'Marketing ($)', max: 1000000, step: 100, mode: 'advanced' }, { name: 'legal', label: 'Legal ($)', max: 1000000, step: 100, mode: 'professional' }, { name: 'inventory', label: 'Inventory ($)', max: 10000000, step: 100, mode: 'expert' }],
    runway: [{ name: 'cash', label: 'Cash on Hand ($)', max: 100000000, step: 1000 }, { name: 'monthlyBurn', label: 'Monthly Burn ($)', max: 10000000, step: 1000 }, { name: 'monthlyRevenue', label: 'Monthly Revenue ($)', max: 10000000, step: 1000, mode: 'advanced' }],
    burnRate: [{ name: 'startCash', label: 'Starting Cash ($)', max: 100000000, step: 1000 }, { name: 'endCash', label: 'Ending Cash ($)', max: 100000000, step: 1000 }, { name: 'months', label: 'Months', max: 60, mode: 'advanced' }],
    cac: [{ name: 'salesCost', label: 'Sales & Marketing ($)', max: 10000000, step: 1000 }, { name: 'newCustomers', label: 'New Customers', max: 10000000, step: 1, mode: 'advanced' }],
    ltvCalc: [{ name: 'avgRevenue', label: 'Avg Revenue/Customer ($)', max: 10000000, step: 100 }, { name: 'churnRate', label: 'Churn Rate %', max: 100, step: 0.1, mode: 'advanced' }],
    ltvCacRatio: [{ name: 'ltv', label: 'LTV ($)', max: 10000000, step: 100 }, { name: 'cac', label: 'CAC ($)', max: 10000000, step: 100, mode: 'advanced' }],
    churnRate: [{ name: 'lostCustomers', label: 'Lost Customers', max: 10000000, step: 1 }, { name: 'startCustomers', label: 'Starting Customers', max: 10000000, step: 1, mode: 'advanced' }],
    mrr: [{ name: 'subscribers', label: 'Paying Subscribers', max: 10000000, step: 1 }, { name: 'avgPrice', label: 'Avg Price/Month ($)', max: 100000, step: 1, mode: 'advanced' }],
    arr: [{ name: 'mrr', label: 'MRR ($)', max: 100000000, step: 100, mode: 'advanced' }],
    unitEconomics: [{ name: 'price', label: 'Price Per Unit ($)', max: 100000, step: 1 }, { name: 'varCost', label: 'Variable Cost/Unit ($)', max: 100000, step: 1 }, { name: 'fixedCost', label: 'Total Fixed Costs ($)', max: 10000000, step: 100, mode: 'advanced' }, { name: 'units', label: 'Units Sold', max: 10000000, step: 1, mode: 'professional' }],
    contributionMargin: [{ name: 'revenue', label: 'Total Revenue ($)', max: 100000000, step: 1000 }, { name: 'varCosts', label: 'Total Variable Costs ($)', max: 100000000, step: 1000, mode: 'advanced' }],
    operatingLeverage: [{ name: 'revenue', label: 'Revenue ($)', max: 100000000, step: 1000 }, { name: 'varCosts', label: 'Variable Costs ($)', max: 100000000, step: 1000 }, { name: 'fixedCosts', label: 'Fixed Costs ($)', max: 100000000, step: 1000, mode: 'advanced' }],
    financialLeverage: [{ name: 'ebit', label: 'EBIT ($)', max: 100000000, step: 1000 }, { name: 'interest', label: 'Interest Expense ($)', max: 100000000, step: 1000, mode: 'advanced' }],
    grossProfit: [{ name: 'revenue', label: 'Revenue ($)', max: 100000000, step: 1000 }, { name: 'cogs', label: 'Cost of Goods Sold ($)', max: 100000000, step: 1000, mode: 'advanced' }],
    netProfit: [{ name: 'revenue', label: 'Total Revenue ($)', max: 100000000, step: 1000 }, { name: 'expenses', label: 'Total Expenses ($)', max: 100000000, step: 1000, mode: 'advanced' }],
    profitMargin: [{ name: 'revenue', label: 'Revenue ($)', max: 100000000, step: 1000 }, { name: 'profit', label: 'Net Profit ($)', max: 100000000, step: 1000, mode: 'advanced' }],
    costVolumeProfit: [{ name: 'fixedCosts', label: 'Fixed Costs ($)', max: 10000000, step: 100 }, { name: 'pricePerUnit', label: 'Price/Unit ($)', max: 100000, step: 1 }, { name: 'varCostPerUnit', label: 'Variable Cost/Unit ($)', max: 100000, step: 1, mode: 'advanced' }, { name: 'units', label: 'Units Sold', max: 10000000, step: 1, mode: 'professional' }],
    markupCalc: [{ name: 'cost', label: 'Cost ($)', max: 10000000, step: 100 }, { name: 'markup', label: 'Markup %', max: 1000, step: 1, mode: 'advanced' }],
    carAffordability: [{ name: 'monthlyPayment', label: 'Target Payment ($)', max: 5000, step: 50 }, { name: 'rate', label: 'Interest Rate %', max: 20, step: 0.01 }, { name: 'term', label: 'Term (months)', max: 84, mode: 'advanced' }],
    childCare: [{ name: 'weeklyCost', label: 'Weekly Cost ($)', max: 5000, step: 50 }, { name: 'weeksPerYear', label: 'Weeks Per Year', max: 52, mode: 'advanced' }],
    petExpense: [{ name: 'food', label: 'Annual Food ($)', max: 50000, step: 100 }, { name: 'vet', label: 'Annual Vet ($)', max: 50000, step: 100 }, { name: 'supplies', label: 'Annual Supplies ($)', max: 50000, step: 100, mode: 'advanced' }, { name: 'other', label: 'Annual Other ($)', max: 50000, step: 100, mode: 'professional' }],
    fiftyThirtyTwenty: [{ name: 'income', label: 'Income ($)', max: 10000000, step: 100 }, { name: 'needs', label: 'Needs ($)', max: 10000000, step: 100 }, { name: 'wants', label: 'Wants ($)', max: 10000000, step: 100, mode: 'advanced' }, { name: 'savings', label: 'Savings ($)', max: 10000000, step: 100, mode: 'professional' }],
    zeroBasedBudget: [{ name: 'income', label: 'Income ($)', max: 10000000, step: 100 }, { name: 'category1', label: 'Category 1 ($)', max: 10000000, step: 100 }, { name: 'category2', label: 'Category 2 ($)', max: 10000000, step: 100 }, { name: 'category3', label: 'Category 3 ($)', max: 10000000, step: 100, mode: 'advanced' }, { name: 'category4', label: 'Category 4 ($)', max: 10000000, step: 100, mode: 'professional' }],
    envelopeSystem: [{ name: 'income', label: 'Income ($)', max: 10000000, step: 100 }, { name: 'envelopes', label: 'Number of Envelopes', max: 50 }, { name: 'perEnvelope', label: 'Per Envelope ($)', max: 100000, step: 100, mode: 'advanced' }],
    payYourselfFirst: [{ name: 'income', label: 'Income ($)', max: 10000000, step: 100 }, { name: 'savingsPct', label: 'Savings %', max: 100, step: 1, mode: 'advanced' }],
    weddingBudget: [{ name: 'guestCount', label: 'Guests', max: 1000 }, { name: 'budget', label: 'Total Budget ($)', max: 1000000, step: 1000, mode: 'advanced' }],
    vacationBudget: [{ name: 'transport', label: 'Transport ($)', max: 100000, step: 100 }, { name: 'lodging', label: 'Lodging ($)', max: 100000, step: 100 }, { name: 'food', label: 'Food ($)', max: 100000, step: 100, mode: 'advanced' }, { name: 'activities', label: 'Activities ($)', max: 100000, step: 100, mode: 'professional' }],
    holidayBudget: [{ name: 'gifts', label: 'Gifts ($)', max: 100000, step: 100 }, { name: 'travel', label: 'Travel ($)', max: 100000, step: 100 }, { name: 'food', label: 'Food ($)', max: 100000, step: 100, mode: 'advanced' }, { name: 'decorations', label: 'Decorations ($)', max: 50000, step: 100, mode: 'professional' }],
    groceryBudget: [{ name: 'householdSize', label: 'Household Size', max: 20 }, { name: 'weeklyTarget', label: 'Weekly Target ($)', max: 500, step: 10, mode: 'advanced' }],
    monthlyBudget: [{ name: 'income', label: 'Income ($)', max: 10000000, step: 100 }, { name: 'housing', label: 'Housing ($)', max: 100000, step: 100 }, { name: 'food', label: 'Food ($)', max: 50000, step: 50 }, { name: 'transport', label: 'Transport ($)', max: 50000, step: 50, mode: 'advanced' }, { name: 'utilities', label: 'Utilities ($)', max: 50000, step: 50, mode: 'professional' }, { name: 'other', label: 'Other ($)', max: 50000, step: 50, mode: 'expert' }],
    annualBudget: [{ name: 'income', label: 'Annual Income ($)', max: 100000000, step: 1000 }, { name: 'housing', label: 'Housing ($)', max: 1000000, step: 500 }, { name: 'food', label: 'Food ($)', max: 500000, step: 500 }, { name: 'transport', label: 'Transport ($)', max: 500000, step: 500, mode: 'advanced' }, { name: 'utilities', label: 'Utilities ($)', max: 500000, step: 500, mode: 'professional' }, { name: 'savings', label: 'Savings ($)', max: 10000000, step: 500, mode: 'expert' }],
    homeInsurance: [{ name: 'homeValue', label: 'Home Value ($)', max: 10000000, step: 1000 }, { name: 'deductible', label: 'Deductible ($)', max: 50000, step: 100, mode: 'advanced' }],
    autoInsurance: [{ name: 'carValue', label: 'Car Value ($)', max: 1000000, step: 1000 }, { name: 'deductible', label: 'Deductible ($)', max: 50000, step: 100, mode: 'advanced' }],
    healthInsuranceComparison: [{ name: 'premium1', label: 'Plan A Premium ($/mo)', max: 5000, step: 10 }, { name: 'deductible1', label: 'Plan A Deductible ($)', max: 50000, step: 100 }, { name: 'oopMax1', label: 'Plan A OOP Max ($)', max: 50000, step: 100, mode: 'advanced' }, { name: 'premium2', label: 'Plan B Premium ($/mo)', max: 5000, step: 10, mode: 'advanced' }, { name: 'deductible2', label: 'Plan B Deductible ($)', max: 50000, step: 100, mode: 'professional' }, { name: 'oopMax2', label: 'Plan B OOP Max ($)', max: 50000, step: 100, mode: 'professional' }],
    deductibleVsPremium: [{ name: 'lowPremium', label: 'Low Premium ($/mo)', max: 5000, step: 10 }, { name: 'lowDeductible', label: 'Low Deductible ($)', max: 50000, step: 100 }, { name: 'highPremium', label: 'High Premium ($/mo)', max: 5000, step: 10, mode: 'advanced' }, { name: 'highDeductible', label: 'High Deductible ($)', max: 50000, step: 100, mode: 'professional' }],
    outOfPocketMaximum: [{ name: 'deductible', label: 'Deductible ($)', max: 50000, step: 100 }, { name: 'coinsurance', label: 'Coinsurance %', max: 50, step: 1 }, { name: 'oopMax', label: 'OOP Maximum ($)', max: 50000, step: 100, mode: 'advanced' }],
    propertyTaxDeduction: [{ name: 'propertyTaxPaid', label: 'Property Tax Paid ($)', max: 50000, step: 100 }, { name: 'marginalRate', label: 'Marginal Tax Rate %', max: 50, step: 0.1, mode: 'advanced' }],
    giftTax: [{ name: 'giftAmount', label: 'Gift Amount ($)', max: 10000000, step: 100 }, { name: 'annualExclusion', label: 'Annual Exclusion ($)', max: 50000, step: 100, mode: 'advanced' }],
    inheritanceTax: [{ name: 'inheritanceAmount', label: 'Inheritance Amount ($)', max: 10000000, step: 1000 }, { name: 'stateExemption', label: 'State Exemption ($)', max: 10000000, step: 1000 }, { name: 'taxRate', label: 'Tax Rate %', max: 50, step: 0.1, mode: 'advanced' }],
    sideHustleTax: [{ name: 'income', label: 'Side Hustle Income ($)', max: 10000000, step: 100 }, { name: 'expenses', label: 'Business Expenses ($)', max: 10000000, step: 100 }, { name: 'otherIncome', label: 'Other W2 Income ($)', max: 10000000, step: 100, mode: 'advanced' }],
    gigEconomyTax: [{ name: 'income', label: 'Gig Income ($)', max: 10000000, step: 100 }, { name: 'expenses', label: 'Expenses ($)', max: 10000000, step: 100 }, { name: 'otherIncome', label: 'Other Income ($)', max: 10000000, step: 100, mode: 'advanced' }],
    interestIncomeTax: [{ name: 'income', label: 'Taxable Income', max: 10000000, step: 100 }, { name: 'rate', label: 'Tax Rate %', max: 50, step: 0.1, mode: 'advanced' }],
    rentalIncomeTax: [{ name: 'rentIncome', label: 'Rental Income ($)', max: 10000000, step: 100 }, { name: 'expenses', label: 'Total Expenses ($)', max: 10000000, step: 100 }, { name: 'depreciation', label: 'Depreciation ($)', max: 10000000, step: 100, mode: 'advanced' }],
    amortization: [{ name: 'principal', label: 'Loan Amount', max: 2000000, step: 100 }, { name: 'rate', label: 'Interest Rate %', max: 30, step: 0.01 }, { name: 'term', label: 'Term (years)', max: 40, mode: 'advanced' }],
    loanComparison: [{ name: 'amount', label: 'Loan Amount ($)', max: 2000000, step: 100 }, { name: 'rate1', label: 'Loan 1 Rate %', max: 30, step: 0.01 }, { name: 'term1', label: 'Loan 1 Term (years)', max: 40 }, { name: 'rate2', label: 'Loan 2 Rate %', max: 30, step: 0.01, mode: 'advanced' }, { name: 'term2', label: 'Loan 2 Term (years)', max: 40, mode: 'professional' }],
    biweeklyPayment: [{ name: 'principal', label: 'Loan Amount ($)', max: 2000000, step: 100 }, { name: 'rate', label: 'Interest Rate %', max: 30, step: 0.01 }, { name: 'term', label: 'Term (years)', max: 40, mode: 'advanced' }],
  }
  const renderFields = (defs: (FDef | (() => JSX.Element))[]) => {
    const basic: JSX.Element[] = []
    const groups: Record<string, { mode: FMode; elements: JSX.Element[] }> = {}
    defs.forEach(d => {
      if (typeof d === 'function') { basic.push(d()); return }
      const el = field(d.name, d.label, { min: d.min, max: d.max, step: d.step, lockable: d.lockable })
      if (d.mode && d.mode !== 'basic') {
        if (!groups[d.mode]) groups[d.mode] = { mode: d.mode, elements: [] }
        groups[d.mode].elements.push(el)
      } else {
        basic.push(el)
      }
    })
    const out = [...basic]
    Object.values(groups).forEach(g => {
      out.push(<ModeFieldGroup key={g.mode} minMode={g.mode} label={g.mode.charAt(0).toUpperCase() + g.mode.slice(1) + ' Options'}>{g.elements}</ModeFieldGroup>)
    })
    return out
  }

  const formContent = useMemo(() => {
    switch (calcType) {
      case 'mortgage':
        return (
          <>
            {field('homePrice', 'Home Price', { max: 2000000, step: 1000 })}
            {field('downPayment', 'Down Payment', { max: 2000000, step: 1000 })}
            {field('rate', 'Interest Rate %', { min: 0, max: 30, step: 0.01 })}
            {field('term', 'Loan Term (years)', { min: 1, max: 40, step: 1 })}
            <ModeFieldGroup minMode="advanced" label="Additional Costs">
              <details className="text-sm">
                <summary className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium">Additional costs</summary>
                <div className="mt-2 space-y-3">
                  {field('propertyTax', 'Annual Property Tax', { min: 0, max: 50000, step: 100 })}
                  {field('homeInsurance', 'Annual Insurance', { min: 0, max: 10000, step: 50 })}
                  {field('pmiRate', 'PMI Rate %', { min: 0, max: 5, step: 0.01 })}
                  {field('hoa', 'Monthly HOA', { min: 0, max: 2000, step: 10 })}
                  {field('extraPayment', 'Extra Payment/mo', { min: 0, max: 5000, step: 10 })}
                </div>
              </details>
            </ModeFieldGroup>
            <ModeFieldGroup minMode="professional" label="Payment Frequency">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Frequency</label>
                <select {...form.register('frequency')} className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="monthly">Monthly (12/yr)</option>
                  <option value="biweekly">Bi-Weekly (26/yr)</option>
                  <option value="accelerated">Accelerated Bi-Weekly</option>
                </select>
              </div>
            </ModeFieldGroup>
          </>
        )
      case 'investment':
        return (
          <>
            {field('initial', 'Initial Investment', { max: 10000000, step: 100 })}
            {field('monthly', 'Monthly Contribution', { max: 100000, step: 50 })}
            {field('rate', 'Annual Return %', { min: 0, max: 30, step: 0.1 })}
            {field('years', 'Investment Period (yrs)', { min: 1, max: 60, step: 1 })}
            {field('inflationRate', 'Expected Inflation %', { min: 0, max: 20, step: 0.1, lockable: false })}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Contribution Frequency</label>
              <select {...form.register('contribFrequency')} className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </select>
            </div>
          </>
        )
      case 'retirement':
        return (
          <>
            {field('age', 'Your Current Age', { min: 18, max: 90, step: 1 })}
            {field('retirementAge', 'Retirement Age', { min: 30, max: 100, step: 1 })}
            {field('savings', 'Current Savings', { max: 10000000, step: 1000 })}
            {field('monthly', 'Monthly Contribution', { max: 100000, step: 50 })}
            {field('rate', 'Expected Return %', { min: 0, max: 30, step: 0.1 })}
            {field('inflationRate', 'Expected Inflation %', { min: 0, max: 15, step: 0.1, lockable: false })}
            {field('socialSecurity', 'Social Security/mo', { max: 5000, step: 50, lockable: false })}
          </>
        )
      case 'salary':
        return (
          <>
            {field('amount', 'Amount', { max: 10000000, step: 100 })}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Period</label>
              <select {...form.register('period')} className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="hourly">Hourly</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
              </select>
            </div>
            {field('hoursPerWeek', 'Hours per Week', { min: 1, max: 80, step: 1, lockable: false })}
            {field('vacationWeeks', 'Vacation per Year', { min: 0, max: 12, step: 1, lockable: false })}
          </>
        )
      case 'debt':
        return (
          <>
            {field('balance', 'Current Balance', { max: 500000, step: 100 })}
            {field('rate', 'Interest Rate %', { min: 0, max: 36, step: 0.01 })}
            {field('monthly', 'Monthly Payment', { min: 1, max: 50000, step: 10 })}
            {field('extraPayment', 'Extra Payment/mo', { min: 0, max: 10000, step: 5, lockable: false })}
          </>
        )
      case 'tax':
      case 'incomeTax':
      case 'interestIncomeTax':
        return (
          <>
            {field('income', 'Taxable Income', { max: 10000000, step: 100 })}
            {field('rate', 'Tax Rate %', { min: 0, max: 50, step: 0.1 })}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filing Status</label>
              <select {...form.register('filingStatus')} className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="single">Single</option>
                <option value="married">Married Filing Jointly</option>
                <option value="separate">Married Filing Separately</option>
                <option value="head">Head of Household</option>
              </select>
            </div>
            {field('stateRate', 'State Tax Rate %', { min: 0, max: 15, step: 0.1, lockable: false })}
            {field('deductions', 'Annual Deductions', { max: 100000, step: 100, lockable: false })}
          </>
        )
      case 'budget':
        return (
          <>
            {field('income', 'Monthly Income', { max: 100000, step: 100 })}
            {field('housing', 'Housing', { max: 50000, step: 50 })}
            {field('food', 'Food', { max: 5000, step: 25 })}
            {field('transport', 'Transport', { max: 5000, step: 25 })}
            {field('utilities', 'Utilities', { max: 2000, step: 10 })}
            {field('entertainment', 'Entertainment', { max: 2000, step: 10, lockable: false })}
            {field('other', 'Other', { max: 5000, step: 25 })}
            {field('savingsGoal', 'Savings Goal', { max: 50000, step: 100, lockable: false })}
          </>
        )
      default: {
        const defs = simpleFormFields[calcType]
        if (defs) return <>{renderFields(defs)}</>
        return (
          <>
            {field('principal', 'Loan Amount', { max: 2000000, step: 100 })}
            {field('rate', 'Interest Rate %', { min: 0, max: 30, step: 0.01 })}
            {field('term', 'Term (years)', { min: 1, max: 40, step: 1 })}
            {field('downPayment', 'Down Payment', { max: 2000000, step: 100, lockable: false })}
            {field('originationFees', 'Origination Fees', { max: 50000, step: 100, lockable: false })}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Frequency</label>
              <select {...form.register('frequency')} className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="monthly">Monthly (12/yr)</option>
                <option value="biweekly">Bi-Weekly (26/yr)</option>
                <option value="accelerated">Accelerated Bi-Weekly</option>
              </select>
            </div>
          </>
        )
      }
    }
  }, [calcType, form, useSlider, lockedFields, toggleLock])

  const saveScenario = useCallback(() => {
    const vals = watched as Record<string, string>
    return Object.entries(vals).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n')
  }, [watched])

  const exportCSV = useCallback(() => {
    const vals = watched as Record<string, string>
    const header = 'Field,Value\n'
    const rows = Object.entries(vals).filter(([, v]) => v).map(([k, v]) => `${k},${v}`).join('\n')
    return `${header}${rows}`
  }, [watched])

  const watchedInputs = useMemo(() => {
    const vals = watched as Record<string, string>
    return Object.fromEntries(Object.entries(vals).filter(([, v]) => v !== undefined && v !== ''))
  }, [watched])

  const applyPreset = useCallback((preset: { values: Record<string, string> }) => {
    for (const [key, val] of Object.entries(preset.values)) {
      if (!lockedFields.has(key)) form.setValue(key as any, val)
    }
  }, [form, lockedFields])

  const finFormulas: Record<string, { formula: string; description: string }> = {
    loan: { formula: 'M = P × (r(1+r)^n) / ((1+r)^n - 1)', description: 'The loan payment formula calculates equal monthly payments covering both principal and interest over the loan term.' },
    mortgage: { formula: 'M = (P - D) × (r(1+r)^n) / ((1+r)^n - 1)', description: 'Mortgage payment calculation uses the loan amount (home price minus down payment), interest rate, and term length. Payments amortize over the loan period.' },
    investment: { formula: 'FV = PV(1+r)^n + PMT × ((1+r)^n - 1)/r', description: 'Future value calculation combines compound growth on initial principal with the accumulating contributions over time.' },
    retirement: { formula: 'FV = savings(1+r)^n + monthly × ((1+r)^n - 1)/r | 4% Rule', description: 'Retirement projections use compound growth formulas. The 4% rule suggests withdrawing 4% of savings annually for a sustainable retirement.' },
    salary: { formula: 'Annual = hourly × 2080 | Annual = monthly × 12 | Annual = weekly × 52', description: 'Salary converter translates between hourly, weekly, monthly, and annual pay rates using standard full-time conversion factors.' },
    debt: { formula: 'Payoff = iterative: remaining × (1+r) - payment', description: 'Debt payoff simulation calculates the total months and interest cost to fully repay a debt with fixed monthly payments.' },
    tax: { formula: 'Tax = income × rate / 100 | After-tax = income - tax', description: 'Simple tax calculator estimates income tax based on a flat effective tax rate and shows after-tax income.' },
    budget: { formula: 'Remaining = income - S(expenses) | Rate = remaining / income × 100', description: 'Budget calculator tracks income against expenses (housing, food, transport, utilities, other) and calculates the savings rate.' },
    simpleInterest: { formula: 'I = P × r × t | A = P + I', description: 'Simple interest is calculated only on the principal amount, not on accumulated interest.' },
    apyCalc: { formula: 'APY = (1 + r/n)^n - 1 | Doubling ˜ 72/r', description: 'APY reflects the true annual rate including compounding effects. Rule of 72 estimates doubling time.' },
    aprCalc: { formula: 'APR ˜ r × n | APY = (1 + APR/n)^n - 1', description: 'APR is the nominal annual rate before compounding. Convert to APY for true yield comparison.' },
    futureValue: { formula: 'FV = PV(1+r)^n + PMT × ((1+r)^n - 1)/r', description: 'Future value calculates what today\'s money will be worth in the future given a rate of return and regular contributions.' },
    presentValue: { formula: 'PV = FV / (1+r)^n', description: 'Present value discounts future cash flows back to today\'s dollars using a discount rate.' },
    roi: { formula: 'ROI = (Final - Initial) / Initial × 100 | CAGR = (Final/Initial)^(1/t) - 1', description: 'ROI measures total return. CAGR annualizes the return for multi-year comparisons.' },
    npv: { formula: 'NPV = -I0 + S(CF? / (1+r)^t)', description: 'Net present value sums discounted future cash flows minus initial investment. Positive NPV indicates a good investment.' },
    irr: { formula: '0 = -I0 + S(CF? / (1+IRR)^t)', description: 'Internal rate of return is the discount rate that makes NPV zero. Higher IRR indicates better returns.' },
    paybackPeriod: { formula: 'Payback = Initial Investment / Annual Cash Flow', description: 'Payback period measures how long it takes to recover the initial investment from cash flows.' },
    breakEven: { formula: 'B/E Units = Fixed Costs / (Price - Variable Cost)', description: 'Break-even analysis finds the number of units needed to cover all fixed and variable costs.' },
    bondYield: { formula: 'Current Yield = Coupon / Price | YTM ˜ (C + (F-P)/n) / ((F+P)/2)', description: 'Current yield measures annual coupon vs price. YTM approximates total return if held to maturity.' },
    bondPrice: { formula: 'Price = S(C/(1+r)^t) + F/(1+r)^n', description: 'Bond price is the present value of all future coupon payments plus face value discounted at YTM.' },
    couponPayment: { formula: 'Coupon Payment = Face Value × Coupon Rate / Frequency', description: 'Coupon payment is the periodic interest paid to bondholders based on face value and coupon rate.' },
    taxEquivalentYield: { formula: 'TEY = Municipal Yield / (1 - Tax Rate)', description: 'Tax-equivalent yield shows what taxable yield is needed to match a tax-free municipal bond yield.' },
    dividendYield: { formula: 'Dividend Yield = Annual Dividend / Price per Share × 100', description: 'Dividend yield measures the annual dividend income relative to the stock price.' },
    dividendPayout: { formula: 'Payout Ratio = Dividends / Net Income × 100', description: 'Payout ratio shows the percentage of earnings distributed as dividends to shareholders.' },
    eps: { formula: 'EPS = Net Income / Shares Outstanding', description: 'Earnings per share measures profitability on a per-share basis.' },
    pe: { formula: 'P/E = Stock Price / EPS', description: 'Price-to-earnings ratio compares stock price to earnings. Higher P/E may indicate growth expectations.' },
    pb: { formula: 'P/B = Stock Price / Book Value per Share', description: 'Price-to-book ratio compares market value to accounting book value.' },
    ps: { formula: 'P/S = Stock Price / Sales per Share', description: 'Price-to-sales ratio values a company based on revenue rather than earnings.' },
    peg: { formula: 'PEG = P/E Ratio / Earnings Growth Rate', description: 'PEG ratio adjusts P/E for growth. PEG under 1 may indicate undervaluation.' },
    dividendGrowthRate: { formula: 'CAGR = (D_current / D_prior)^(1/years) - 1', description: 'Dividend growth rate (CAGR) measures the annualized rate of dividend increases over time.' },
    payoutRatio: { formula: 'Payout Ratio = Dividends per Share / EPS × 100', description: 'Payout ratio shows the portion of earnings paid as dividends.' },
    retentionRatio: { formula: 'Retention Ratio = 1 - Payout Ratio', description: 'Retention ratio shows the portion of earnings retained and reinvested in the business.' },
    stockAverageCost: { formula: 'New Avg Cost = (Total Cost + New Shares × New Price) / Total Shares', description: 'Stock average cost calculates the new cost basis after purchasing additional shares at a different price.' },
    dollarCostAveraging: { formula: 'Shares = (Monthly Invest / Price) × Months | Avg Cost = Total Invested / Total Shares', description: 'Dollar-cost averaging reduces timing risk by investing fixed amounts at regular intervals.' },
    costBasis: { formula: 'Cost Basis = Purchase Price × Shares + Commissions', description: 'Cost basis is the original value of an asset for tax purposes, including commissions.' },
    portfolioReturn: { formula: 'Portfolio Return = S(Weight_i × Return_i)', description: 'Portfolio return is the weighted average return of all assets in the portfolio.' },
    sharpeRatio: { formula: 'Sharpe = (Portfolio Return - Risk-Free Rate) / Standard Deviation', description: 'Sharpe ratio measures risk-adjusted return. Higher values indicate better risk-adjusted performance.' },
    sortinoRatio: { formula: 'Sortino = (Portfolio Return - Risk-Free Rate) / Downside Deviation', description: 'Sortino ratio is like Sharpe but only penalizes downside volatility.' },
    alpha: { formula: 'Alpha = Portfolio Return - [RFR + Beta × (Market Return - RFR)]', description: 'Jensen\'s alpha measures excess return above what CAPM predicts based on beta.' },
    beta: { formula: 'Beta = Stock Return / Market Return', description: 'Beta measures a stock\'s volatility relative to the market. Beta > 1 means more volatile.' },
    rSquared: { formula: 'R² = r² (correlation coefficient squared)', description: 'R-squared measures how much of a fund\'s movements are explained by market movements.' },
    valueAtRisk: { formula: 'VaR = Portfolio Value × (Mean - z × StdDev)', description: 'Value at Risk estimates the maximum potential loss over a period at a given confidence level.' },
    dti: { formula: 'DTI = Monthly Debt / Monthly Income × 100', description: 'Debt-to-income ratio compares monthly debt payments to income. Lower is better for lenders.' },
    ltv: { formula: 'LTV = Loan Amount / Property Value × 100', description: 'Loan-to-value ratio measures loan amount relative to property value. Lower LTV means less risk.' },
    dscr: { formula: 'DSCR = NOI / Debt Service', description: 'Debt service coverage ratio measures ability to pay loans. Above 1.25 is generally considered healthy.' },
    interestCoverage: { formula: 'Interest Coverage = EBIT / Interest Expense', description: 'Interest coverage ratio measures ability to pay interest on outstanding debt.' },
    fixedChargeCoverage: { formula: 'FCC = EBIT / Interest Expense', description: 'Fixed charge coverage ratio measures ability to cover fixed financial obligations.' },
    tie: { formula: 'TIE = EBIT / Interest Expense', description: 'Times interest earned ratio measures how many times operating income covers interest payments.' },
    workingCapital: { formula: 'Working Capital = Current Assets - Current Liabilities', description: 'Working capital measures short-term financial health and operational efficiency.' },
    currentRatio: { formula: 'Current Ratio = Current Assets / Current Liabilities', description: 'Current ratio measures ability to pay short-term obligations. Above 1 is healthy.' },
    quickRatio: { formula: 'Quick Ratio = Current Assets / Current Liabilities', description: 'Quick ratio (acid test) measures immediate liquidity excluding inventory.' },
    cashRatio: { formula: 'Cash Ratio = Current Assets / Current Liabilities', description: 'Cash ratio is the most conservative liquidity measure using only cash equivalents.' },
    inventoryTurnover: { formula: 'Inventory Turnover = COGS / Average Inventory', description: 'Inventory turnover measures how efficiently inventory is sold and replaced over a period.' },
    assetTurnover: { formula: 'Asset Turnover = Revenue / Average Total Assets', description: 'Asset turnover measures how efficiently a company uses its assets to generate revenue.' },
    roa: { formula: 'ROA = Net Income / Average Assets × 100', description: 'Return on assets measures how profitable a company is relative to its total assets.' },
    roe: { formula: 'ROE = Net Income / Average Equity × 100', description: 'Return on equity measures profitability relative to shareholder equity.' },
    debtToAsset: { formula: 'D/A = Total Debt / Total Assets × 100 | D/E = Total Debt / Total Equity × 100', description: 'Debt ratios measure financial leverage. Higher ratios mean more debt relative to assets or equity.' },
    debtToEquity: { formula: 'D/E = Total Debt / Total Equity × 100 | D/A = Total Debt / Total Assets × 100', description: 'Debt-to-equity ratio compares debt to shareholder equity. Higher values indicate more leverage.' },
    rentVsBuy: { formula: 'Total Rent = Rent × 12 × Years | Total Buy = Monthly Pmt × 12 × Years + Down + Tax', description: 'Rent vs buy compares total costs of renting versus buying a home over a given time period.' },
    houseAffordability: { formula: 'Max Payment = Income/12 × 0.28 | Max Loan = PV(Max Payment, Rate, Term)', description: 'House affordability uses the 28% front-end DTI ratio to determine maximum home price.' },
    closingCosts: { formula: 'Total Costs ˜ Origination + Appraisal + Title + Recording + Inspection', description: 'Closing costs include origination fees, appraisal, title insurance, recording fees, and inspections.' },
    rentalIncome: { formula: 'NOI = (Rent - Expenses) × 12 | Cap Rate = NOI / Value | CoC = NOI / Down', description: 'Rental income analysis calculates NOI, cap rate, and cash-on-cash return for investment properties.' },
    capRate: { formula: 'Cap Rate = NOI / Property Value × 100', description: 'Capitalization rate measures the rate of return on a rental property based on NOI.' },
    cashOnCash: { formula: 'CoC Return = Annual Cash Flow / Total Cash Invested × 100', description: 'Cash-on-cash return measures annual return relative to the actual cash invested.' },
    noiCalc: { formula: 'NOI = Effective Income - Operating Expenses | Effective = Rent × (1 - Vacancy Rate)', description: 'Net operating income is property income after vacancy and operating expenses.' },
    roiRental: { formula: 'NOI = (Rent - Expenses) × 12 | Cap Rate = NOI / Value | CoC = NOI / Down', description: 'Rental ROI combines cap rate and cash-on-cash return metrics for property investment analysis.' },
    incomeTax: { formula: 'Tax = Income × Rate / 100 | Effective Rate = Tax / Income × 100', description: 'Income tax calculator estimates tax based on a flat rate and shows effective tax rate.' },
    taxBracket: { formula: 'Total Tax = Base Tax + (Income - Bracket Start) × Bracket Rate', description: 'Tax bracket calculator computes total tax using progressive bracket structure.' },
    marginalTaxRate: { formula: 'Extra Tax = Additional Income × Marginal Rate', description: 'Marginal tax rate calculator shows the tax impact of earning additional income.' },
    effectiveTaxRate: { formula: 'Effective Rate = Total Tax / Total Income × 100', description: 'Effective tax rate is the average rate paid on total income.' },
    capitalGainsTax: { formula: 'Capital Gain = Sale Price - Cost Basis | Tax = Gain × Tax Rate', description: 'Capital gains tax is computed on the profit from selling an asset.' },
    dividendTax: { formula: 'Dividend Tax = Dividends × Tax Rate', description: 'Dividend tax calculator estimates taxes owed on qualified dividend income.' },
    selfEmploymentTax: { formula: 'SE Tax = Net Earnings × (1 - Expense %) × 0.153', description: 'Self-employment tax covers Social Security and Medicare for self-employed individuals.' },
    salesTax: { formula: 'Sales Tax = Price × Tax Rate / 100 | Total = Price + Tax', description: 'Sales tax calculator adds the tax percentage to the base price.' },
    vat: { formula: 'VAT = Price × VAT Rate / 100 | Total = Price + VAT', description: 'VAT (Value Added Tax) is a consumption tax applied to goods and services.' },
    estateTax: { formula: 'Taxable Estate = Value - Exemption | Tax = Taxable × Rate', description: 'Estate tax is levied on estates exceeding the federal exemption threshold.' },
    taxRefundEstimator: { formula: 'Refund/Due = Withheld - Liability', description: 'Tax refund estimator compares taxes withheld to actual liability to determine refund or amount due.' },
    itemizedVsStandardDeduction: { formula: 'Best = Max(Itemized, Standard) | Savings = Itemized - Standard', description: 'Compare itemized deductions versus the standard deduction to minimize taxable income.' },
    amt: { formula: 'AMT = Max(0, AMT Income - Exemption) × Rate', description: 'Alternative Minimum Tax ensures high-income taxpayers pay a minimum level of tax.' },
    cryptoProfit: { formula: 'P/L = (Sell Price - Buy Price) × Quantity | ROI = P/L / (Buy × Qty) × 100', description: 'Cryptocurrency profit calculator computes gains and ROI from crypto trades.' },
    cryptoMining: { formula: 'Power = Watts × 24/1000 kWh/day', description: 'Crypto mining calculator estimates power consumption based on hash rate and wattage.' },
    cryptoStaking: { formula: 'Rewards = Amount × (1+APY)^Years - Amount', description: 'Staking calculator projects rewards from holding and staking cryptocurrency over time.' },
    impermanentLoss: { formula: 'IL = (Hold Value - Pool Value) / Hold Value × 100', description: 'Impermanent loss measures the opportunity cost of providing liquidity in automated market makers.' },
    cryptoTax: { formula: 'Taxable Gain = (Sell Price - Buy Price) × Quantity', description: 'Cryptocurrency tax calculator estimates capital gains tax on crypto transactions.' },
    lifeInsurance: { formula: 'Insurance Need = Income × Years + Debts + Funeral', description: 'Life insurance needs analysis calculates coverage required to protect dependents.' },
    termVsWholeLife: { formula: 'Cost = Premium × 12 × Years | Difference = Whole - Term', description: 'Compare term life vs whole life insurance costs over a given time period.' },
    disability: { formula: 'Monthly Benefit = Income × Benefit %', description: 'Disability insurance calculator estimates monthly benefit based on income and coverage percentage.' },
    creditUtilization: { formula: 'Utilization = Balance / Limit × 100', description: 'Credit utilization ratio measures how much of available credit is being used. Below 30% is ideal.' },
    creditScore: { formula: 'Score = Payment + Utilization + Length + Mix - Inquiries', description: 'Credit score estimator combines key factors: payment history, utilization, history length, mix, and inquiries.' },
    balanceTransfer: { formula: 'Monthly = Balance × (r(1+r)^n)/((1+r)^n-1) | Fee = Balance × Fee Rate', description: 'Balance transfer calculator compares promotional APR offers against transfer fees.' },
    emergencyFund: { formula: 'Emergency Fund = Monthly Expenses × Months', description: 'Emergency fund target is typically 3-6 months of essential living expenses.' },
    sinkingFund: { formula: 'Monthly = Goal × (r/((1+r)^n - 1))', description: 'Sinking fund calculates the monthly contribution needed to reach a savings goal.' },
    savingsGoal: { formula: 'FV = PV(1+r)^n + PMT × ((1+r)^n - 1)/r', description: 'Savings goal calculator projects whether current savings and contributions will meet a target amount.' },
    collegeSavings: { formula: 'FV = PV(1+r)^n + PMT × ((1+r)^n - 1)/r', description: 'College savings calculator projects 529/ESA growth toward education cost goals.' },
    netWorth: { formula: 'Net Worth = Total Assets - Total Liabilities', description: 'Net worth is the difference between what you own (assets) and what you owe (liabilities).' },
    debtSnowball: { formula: 'Iterative: Balance × (1+r) - Payment | Sort debts smallest to largest', description: 'Debt snowball method pays off smallest debts first for psychological momentum.' },
    debtAvalanche: { formula: 'Iterative: Balance × (1+r) - Payment | Sort debts by highest rate', description: 'Debt avalanche method pays off highest interest debts first to minimize total interest.' },
    debtPayoffPlan: { formula: 'Iterative payoff simulation with target goal months', description: 'Debt payoff plan checks if current payments will meet a target payoff date.' },
    debtConsolidationSavings: { formula: 'Savings = (Current Pmt × n) - (New Pmt × n)', description: 'Debt consolidation savings compares total cost of current debt vs consolidated loan.' },
    pension: { formula: 'FV = PV(1+r)^n + PMT × ((1+r)^n - 1)/r | 4% Rule for income', description: 'Pension calculator projects retirement savings growth and estimated annual income using the 4% rule.' },
    socialSecurity: { formula: 'PIA ˜ 35% × AIME | Benefit adjusted for early/late retirement', description: 'Social Security estimator provides approximate monthly retirement benefits based on earnings history.' },
    annuity: { formula: 'PMT = P × (r(1+r)^n) / ((1+r)^n - 1)', description: 'Annuity payout calculator determines monthly income from a lump sum over a specified period.' },
    safeWithdrawalRate: { formula: 'Annual Withdrawal = Savings × Withdrawal Rate', description: 'Safe withdrawal rate determines how much can be withdrawn annually without depleting savings.' },
    rmd: { formula: 'RMD = Account Balance / Life Expectancy Factor', description: 'Required minimum distribution is the minimum amount that must be withdrawn from retirement accounts after age 72.' },
    businessValuation: { formula: 'Enterprise Value = EBITDA × Multiple | EV/Revenue = EV / Revenue', description: 'Business valuation uses EBITDA multiple approach to estimate enterprise value.' },
    startupCosts: { formula: 'Total = Equipment + Licenses + Marketing + Legal + Inventory', description: 'Startup costs calculator sums all initial expenses required to launch a business.' },
    runway: { formula: 'Runway = Cash / (Burn - Revenue) if burn > revenue', description: 'Runway measures how many months a startup can operate before running out of cash.' },
    burnRate: { formula: 'Monthly Burn = (Start Cash - End Cash) / Months', description: 'Burn rate calculates how quickly a company is spending its cash reserves.' },
    cac: { formula: 'CAC = Sales & Marketing Cost / New Customers', description: 'Customer acquisition cost measures the cost to acquire each new customer.' },
    ltvCalc: { formula: 'LTV = ARPU / Churn Rate | LTV/CAC = LTV / CAC', description: 'Customer lifetime value estimates total revenue from a customer over the relationship.' },
    ltvCacRatio: { formula: 'LTV/CAC = Customer LTV / Customer Acquisition Cost', description: 'LTV/CAC ratio measures customer value vs acquisition cost. Above 3x is considered healthy.' },
    churnRate: { formula: 'Churn Rate = Lost Customers / Starting Customers × 100', description: 'Churn rate measures the percentage of customers lost over a given period.' },
    mrr: { formula: 'MRR = Subscribers × Avg Price | ARR = MRR × 12', description: 'Monthly recurring revenue is the predictable revenue stream from subscriptions.' },
    arr: { formula: 'ARR = MRR × 12', description: 'Annual recurring revenue annualizes the monthly recurring revenue stream.' },
    unitEconomics: { formula: 'Contribution = Price - Variable Cost | Profit = Contribution × Units - Fixed Cost', description: 'Unit economics analyzes profitability at the individual unit level.' },
    contributionMargin: { formula: 'CM = Revenue - Variable Costs | CM Ratio = CM / Revenue × 100', description: 'Contribution margin shows revenue remaining after variable costs to cover fixed costs.' },
    operatingLeverage: { formula: 'DOL = Contribution Margin / Operating Income', description: 'Degree of operating leverage measures how sensitive operating income is to revenue changes.' },
    financialLeverage: { formula: 'DFL = EBIT / (EBIT - Interest)', description: 'Degree of financial leverage measures how sensitive EPS is to changes in operating income.' },
    grossProfit: { formula: 'Gross Profit = Revenue - COGS | Gross Margin = GP / Revenue × 100', description: 'Gross profit is revenue minus the direct costs of producing goods or services.' },
    netProfit: { formula: 'Net Profit = Revenue - Total Expenses', description: 'Net profit is the bottom-line earnings after all expenses have been deducted.' },
    profitMargin: { formula: 'Profit Margin = Net Profit / Revenue × 100', description: 'Profit margin measures how much of each dollar of revenue becomes profit.' },
    costVolumeProfit: { formula: 'Profit = (Price - Var Cost) × Units - Fixed Costs', description: 'Cost-volume-profit analysis examines how costs and volume affect operating profit.' },
    markupCalc: { formula: 'Selling Price = Cost × (1 + Markup%) | Margin = Profit / Price × 100', description: 'Markup calculator determines selling price based on cost and desired markup percentage.' },
    carAffordability: { formula: 'Max Loan = Monthly Payment × ((1+r)^n - 1) / (r(1+r)^n)', description: 'Car affordability calculates the maximum loan amount based on target monthly payment.' },
    childCare: { formula: 'Annual = Weekly Cost × Weeks per Year', description: 'Child care cost calculator estimates annual expenses based on weekly rates.' },
    petExpense: { formula: 'Total = Food + Vet + Supplies + Other', description: 'Pet expense calculator sums annual costs of pet ownership across all categories.' },
    fiftyThirtyTwenty: { formula: '50% Needs | 30% Wants | 20% Savings', description: 'The 50/30/20 budget rule allocates after-tax income to needs, wants, and savings.' },
    zeroBasedBudget: { formula: 'Income - All Expenses = 0', description: 'Zero-based budgeting assigns every dollar of income to a specific purpose leaving zero balance.' },
    envelopeSystem: { formula: 'Total Budget = Envelopes × Per Envelope', description: 'The envelope system allocates cash to physical envelopes for different spending categories.' },
    payYourselfFirst: { formula: 'Savings = Income × Savings% | Spend = Income - Savings', description: 'Pay yourself first prioritizes savings before discretionary spending.' },
    weddingBudget: { formula: 'Per Guest = Total Budget / Guest Count', description: 'Wedding budget calculator breaks down total budget by number of guests.' },
    vacationBudget: { formula: 'Total = Transport + Lodging + Food + Activities', description: 'Vacation budget calculator sums all trip expenses across major categories.' },
    holidayBudget: { formula: 'Total = Gifts + Travel + Food + Decorations', description: 'Holiday budget calculator sums seasonal spending across gift, travel, food, and decoration categories.' },
    groceryBudget: { formula: 'Monthly = Weekly Target × 4.33 | Per Person = Weekly / Household Size', description: 'Grocery budget calculator estimates monthly spending and per-person weekly costs.' },
    monthlyBudget: { formula: 'Remaining = Income - S(Expenses)', description: 'Monthly budget tracks income against regular monthly expenses.' },
    annualBudget: { formula: 'Remaining = Income - S(Expenses)', description: 'Annual budget provides a yearly view of income and planned expenses.' },
    homeInsurance: { formula: 'Est. Premium ˜ Home Value × 0.35%', description: 'Home insurance estimator provides a rough annual premium based on home value.' },
    autoInsurance: { formula: 'Est. Premium ˜ Car Value × 5%', description: 'Auto insurance estimator provides a rough annual premium based on car value.' },
    healthInsuranceComparison: { formula: 'Worst Case = Premium × 12 + OOP Max', description: 'Health insurance comparison evaluates plans by comparing total worst-case costs.' },
    deductibleVsPremium: { formula: 'Total = Premium × 12 + Deductible', description: 'Deductible vs premium analysis compares total costs of low-deductible vs high-deductible plans.' },
    outOfPocketMaximum: { formula: 'OOP = Deductible + Coinsurance until OOP max', description: 'Out-of-pocket maximum is the most you pay for covered services in a plan year.' },
    propertyTaxDeduction: { formula: 'Savings = Property Tax × Marginal Rate', description: 'Property tax deduction savings estimates federal tax savings from deducting property taxes.' },
    giftTax: { formula: 'Taxable Gift = Gift - Annual Exclusion', description: 'Gift tax calculator determines if a gift exceeds the annual exclusion amount.' },
    inheritanceTax: { formula: 'Tax Due = Max(0, Inheritance - Exemption) × Rate', description: 'Inheritance tax is computed on amounts exceeding the state exemption threshold.' },
    sideHustleTax: { formula: 'SE Tax = Net Business Income × 0.153', description: 'Side hustle tax calculator estimates self-employment tax on freelance and gig income.' },
    gigEconomyTax: { formula: 'SE Tax = Net Gig Income × 0.153', description: 'Gig economy tax estimator calculates self-employment tax on platform-based income.' },
    interestIncomeTax: { formula: 'Tax = Interest Income × Marginal Rate', description: 'Interest income tax calculator estimates taxes due on savings account and bond interest.' },
    rentalIncomeTax: { formula: 'Net Rental = Income - Expenses - Depreciation', description: 'Rental income tax calculator estimates taxable rental income after expenses and depreciation.' },
    amortization: { formula: 'M = P × (r(1+r)^n) / ((1+r)^n - 1)', description: 'Amortization schedule shows each payment broken down into principal and interest over the loan term.' },
    loanComparison: { formula: 'Compare two loans: Payment = P × (r(1+r)^n) / ((1+r)^n - 1)', description: 'Loan comparison calculator evaluates two loan options side by side.' },
    biweeklyPayment: { formula: 'Biweekly = Monthly / 2 | 26 payments/year vs 12', description: 'Biweekly payment strategy makes 26 half-payments per year, equivalent to 13 full payments.' },
  }
  const finMeta = finSlugOverrides[calculator.slug] || getFinFormula(calculator.slug, calcType)

  const finAuthor = { name: 'Michael Torres', photoUrl: 'https://i.pravatar.cc/150?u=john-smith-finance', credential: 'CFA', title: 'Financial Analyst', linkedIn: 'https://www.linkedin.com/in/john-smith-finance' }
  const finReferences = [
    { label: 'Fabozzi FJ. Handbook of Mortgage-Backed Securities. Oxford University Press. 2016', url: 'https://en.wikipedia.org/wiki/Mortgage-backed_security' },
    { label: 'Brigham EF, Houston JF. Fundamentals of Financial Management. Cengage. 2019', url: 'https://en.wikipedia.org/wiki/Financial_management' },
  ]
  const mortgageExample = [
    { label: 'Home: $300,000, Down: $60,000 (20%)', value: 'Loan amount = $240,000' },
    { label: 'Rate: 6.5%, Term: 30 years', value: 'Monthly P&I = $1,516.96' },
    { label: 'Plus taxes $300/mo, insurance $100/mo, HOA $200/mo', value: 'Total monthly = $2,116.96' },
  ]

  const mainValue = useMemo(() => {
    const vals = watched as any
    const n = (v: any) => parseFloat(v) || 0
    switch (calcType) {
      case 'loan': {
        const p = n(vals.principal); const r = n(vals.rate); const t = n(vals.term)
        const mr = r / 100 / 12; const np = t * 12
        if (mr > 0 && np > 0 && p > 0) { const f = Math.pow(1 + mr, np); return p * (mr * f) / (f - 1) }
        if (np > 0 && p > 0) return p / np
        return 0
      }
      case 'mortgage': {
        const price = n(vals.homePrice); const down = n(vals.downPayment); const principal = price - down
        const r = n(vals.rate); const t = n(vals.term); const mr = r / 100 / 12; const np = t * 12
        if (mr > 0 && np > 0 && principal > 0) { const f = Math.pow(1 + mr, np); return principal * (mr * f) / (f - 1) }
        if (np > 0 && principal > 0) return principal / np
        return 0
      }
      case 'investment': {
        const initial = n(vals.initial); const monthly = n(vals.monthly); const rate = n(vals.rate); const years = n(vals.years)
        const mr = rate / 100 / 12; const m = years * 12
        if (mr > 0) return initial * Math.pow(1 + mr, m) + monthly * ((Math.pow(1 + mr, m) - 1) / mr)
        return initial + monthly * m
      }
      case 'retirement': {
        const age = n(vals.age); const ra = n(vals.retirementAge); const savings = n(vals.savings); const monthly = n(vals.monthly); const rate = n(vals.rate)
        const y = Math.max(0, ra - age); const mr = rate / 100 / 12; const m = y * 12
        if (mr > 0) return savings * Math.pow(1 + mr, m) + monthly * ((Math.pow(1 + mr, m) - 1) / mr)
        return savings + monthly * m
      }
      case 'salary': {
        const amount = n(vals.amount); const period = vals.period || 'annual'
        const m: Record<string, number> = { hourly: amount * 2080, weekly: amount * 52, monthly: amount * 12, annual: amount }
        return m[period] || amount
      }
      case 'tax': return n(vals.income) * (n(vals.rate) / 100)
      case 'budget': {
        const income = n(vals.income); const housing = n(vals.housing); const food = n(vals.food)
        const transport = n(vals.transport); const utilities = n(vals.utilities); const other = n(vals.other)
        return income - housing - food - transport - utilities - other
      }
      case 'debt': {
        const balance = n(vals.balance); const rate = n(vals.rate); const monthly = n(vals.monthly)
        const mr = rate / 100 / 12; let months = 0
        if (mr > 0 && monthly > balance * mr) { let rem = balance; while (rem > 0 && months < 600) { rem -= monthly - rem * mr; months++ } }
        else if (mr <= 0) { months = Math.ceil(balance / monthly) }
        return months
      }
      case 'simpleInterest': { const p = n(vals.principal); const r = n(vals.rate); const y = n(vals.years); return p * (r / 100) * y }
      case 'apyCalc': { const r = n(vals.rate) / 100; const comp = vals.compound || 'monthly'; const nv = comp === 'monthly' ? 12 : comp === 'quarterly' ? 4 : 1; return (Math.pow(1 + r / nv, nv) - 1) * 100 }
      case 'aprCalc': { const r = n(vals.rate); return r }
      case 'futureValue': { const pv = n(vals.present); const r = n(vals.rate); const y = n(vals.years); const add = n(vals.monthlyAdd); const mr = r / 100 / 12; const m = y * 12; if (mr > 0) return pv * Math.pow(1 + mr, m) + add * ((Math.pow(1 + mr, m) - 1) / mr); return pv + add * m }
      case 'presentValue': { const fv = n(vals.present); const r = n(vals.rate) / 100; const y = n(vals.years); return fv / Math.pow(1 + r, y) }
      case 'roi': { const i = n(vals.initial); const f = n(vals.final); return i > 0 ? ((f - i) / i) * 100 : 0 }
      case 'npv': { const initial = n(vals.initial); const cf = n(vals.cashFlows); const r = n(vals.rate) / 100; const y = n(vals.years); let npv = -initial; for (let yr = 1; yr <= y; yr++) npv += cf / Math.pow(1 + r, yr); return npv }
      case 'irr': { const initial = n(vals.initial); const cf = n(vals.cashFlow); const y = n(vals.years); let irr = 0.1; for (let it = 0; it < 1000; it++) { let npv = -initial; for (let yr = 1; yr <= y; yr++) npv += cf / Math.pow(1 + irr, yr); const d = -y * cf / Math.pow(1 + irr, y + 1); if (Math.abs(npv) < 0.001) break; if (d !== 0) irr -= npv / d; if (irr <= 0) { irr = 0.05; break } } return irr * 100 }
      case 'paybackPeriod': { const i = n(vals.initial); const cf = n(vals.cashFlow); return cf > 0 ? i / cf : 0 }
      case 'breakEven': { const fc = n(vals.fixedCosts); const p = n(vals.pricePerUnit); const vc = n(vals.varCostPerUnit); const cm = p - vc; return cm > 0 ? Math.ceil(fc / cm) : 0 }
      case 'bondYield': { const p = n(vals.price); const fv = n(vals.faceValue); const c = n(vals.coupon); return p > 0 ? (c / p) * 100 : 0 }
      case 'bondPrice': { const fv = n(vals.faceValue); const c = n(vals.coupon); const r = n(vals.rate) / 100; const y = n(vals.years); let pvC = 0; for (let yr = 1; yr <= y; yr++) pvC += c / Math.pow(1 + r, yr); return pvC + fv / Math.pow(1 + r, y) }
      case 'couponPayment': { const fv = n(vals.faceValue); const cr = n(vals.couponRate); const freq = vals.freq || 'semiannual'; const perYr = freq === 'annual' ? 1 : freq === 'semiannual' ? 2 : 4; return fv * (cr / 100) / perYr }
      case 'taxEquivalentYield': { const my = n(vals.muniYield); const tr = n(vals.taxRate); return tr < 100 ? my / (1 - tr / 100) : 0 }
      case 'dividendYield': { const p = n(vals.pricePerShare); const d = n(vals.annualDividend); return p > 0 ? (d / p) * 100 : 0 }
      case 'dividendPayout': { const d = n(vals.dividends); const ni = n(vals.netIncome); return ni > 0 ? (d / ni) * 100 : 0 }
      case 'eps': { const ni = n(vals.netIncome); const s = n(vals.shares); return s > 0 ? ni / s : 0 }
      case 'pe': { const p = n(vals.price); const e = n(vals.eps); return e > 0 ? p / e : 0 }
      case 'pb': { const p = n(vals.price); const bv = n(vals.bookValue); return bv > 0 ? p / bv : 0 }
      case 'ps': { const p = n(vals.price); const s = n(vals.salesPerShare); return s > 0 ? p / s : 0 }
      case 'peg': { const p = n(vals.pe); const g = n(vals.growth); return g > 0 ? p / g : 0 }
      case 'dividendGrowthRate': { const cd = n(vals.currentDividend); const y = n(vals.years); const pd = n(vals.priorDividend); return pd > 0 && y > 0 ? (Math.pow(cd / pd, 1 / y) - 1) * 100 : 0 }
      case 'payoutRatio': { const d = n(vals.dividendsPerShare); const e = n(vals.eps); return e > 0 ? (d / e) * 100 : 0 }
      case 'retentionRatio': { return 100 - n(vals.payoutRatio) }
      case 'stockAverageCost': { const s = n(vals.shares); const tc = n(vals.totalCost); const ns = n(vals.newShares); const np = n(vals.newPrice); const tshares = s + ns; return tshares > 0 ? (tc + ns * np) / tshares : 0 }
      case 'dollarCostAveraging': { const mi = n(vals.monthlyInvest); const pp = n(vals.pricePerShare); const m = n(vals.months); return pp > 0 ? (mi / pp) * m : 0 }
      case 'costBasis': { return n(vals.purchasePrice) * n(vals.shares) + n(vals.commissions) }
      case 'portfolioReturn': { const w1 = n(vals.weight1); const w2 = n(vals.weight2); const tw = w1 + w2; if (tw <= 0) return 0; return (w1 / tw) * n(vals.return1) + (w2 / tw) * n(vals.return2) }
      case 'sharpeRatio': { const pr = n(vals.portfolioReturn); const rf = n(vals.riskFreeRate); const sd = n(vals.stdDev); return sd > 0 ? (pr - rf) / sd : 0 }
      case 'sortinoRatio': { const pr = n(vals.portfolioReturn); const rf = n(vals.riskFreeRate); const dd = n(vals.downsideDev); return dd > 0 ? (pr - rf) / dd : 0 }
      case 'alpha': { const pr = n(vals.portfolioReturn); const rf = n(vals.riskFreeRate); const b = n(vals.beta); const mr = n(vals.marketReturn); return pr - (rf + b * (mr - rf)) }
      case 'beta': { const sr = n(vals.stockReturn); const mr = n(vals.marketReturn); return mr !== 0 ? sr / mr : 0 }
      case 'rSquared': { const c = n(vals.correlation); return c * c }
      case 'valueAtRisk': { const pv = n(vals.portfolioValue); const m = n(vals.meanReturn); const sd = n(vals.stdDev); const z = vals.confidence === '99' ? 2.326 : 1.645; return pv * Math.abs(m - z * sd) / 100 }
      case 'dti': { const md = n(vals.monthlyDebt); const mi = n(vals.monthlyIncome); return mi > 0 ? (md / mi) * 100 : 0 }
      case 'ltv': { const la = n(vals.loanAmount); const pv = n(vals.propertyValue); return pv > 0 ? (la / pv) * 100 : 0 }
      case 'dscr': { const noi = n(vals.noi); const ds = n(vals.debtService); return ds > 0 ? noi / ds : 0 }
      case 'interestCoverage': { const ebit = n(vals.ebit); const ie = n(vals.interestExpense); return ie > 0 ? ebit / ie : 0 }
      case 'fixedChargeCoverage': { const ebit = n(vals.ebit); const ie = n(vals.interestExpense); return ie > 0 ? ebit / ie : 0 }
      case 'tie': { const ebit = n(vals.ebit); const ie = n(vals.interestExpense); return ie > 0 ? ebit / ie : 0 }
      case 'workingCapital': { return n(vals.currentAssets) - n(vals.currentLiabilities) }
      case 'currentRatio': { const cl = n(vals.currentLiabilities); return cl > 0 ? n(vals.currentAssets) / cl : 0 }
      case 'quickRatio': { const cl = n(vals.currentLiabilities); return cl > 0 ? n(vals.currentAssets) / cl : 0 }
      case 'cashRatio': { const cl = n(vals.currentLiabilities); return cl > 0 ? n(vals.currentAssets) / cl : 0 }
      case 'inventoryTurnover': { const c = n(vals.cogs); const ai = n(vals.avgInventory); return ai > 0 ? c / ai : 0 }
      case 'assetTurnover': { const r = n(vals.revenue); const aa = n(vals.avgAssets); return aa > 0 ? r / aa : 0 }
      case 'roa': { const ni = n(vals.netIncome); const aa = n(vals.avgAssets); return aa > 0 ? (ni / aa) * 100 : 0 }
      case 'roe': { const ni = n(vals.netIncome); const ae = n(vals.avgEquity); return ae > 0 ? (ni / ae) * 100 : 0 }
      case 'debtToAsset': { const td = n(vals.totalDebt); const ta = n(vals.totalAssets); return ta > 0 ? (td / ta) * 100 : 0 }
      case 'debtToEquity': { const td = n(vals.totalDebt); const te = n(vals.totalEquity); return te > 0 ? (td / te) * 100 : 0 }
      case 'rentVsBuy': { const r = n(vals.rent); const hp = n(vals.homePrice); const dp = n(vals.downPayment); const rate = n(vals.rate); const y = n(vals.years); const pt = n(vals.propertyTax); const principal = hp - dp; const mr = rate / 100 / 12; const np = y * 12; let mp = 0; if (mr > 0 && np > 0 && principal > 0) { const f = Math.pow(1 + mr, np); mp = principal * (mr * f) / (f - 1) }; const totalRent = r * 12 * y; const totalBuy = mp * np + dp + pt * y; return totalBuy - totalRent }
      case 'houseAffordability': { const inc = n(vals.income); const rate = n(vals.rate); const dp = n(vals.downPayment); const term = n(vals.term); const maxPmt = (inc / 12) * 0.28; const mr = rate / 100 / 12; const np = term * 12; let maxLoan = 0; if (mr > 0) maxLoan = maxPmt * ((Math.pow(1 + mr, np) - 1) / (mr * Math.pow(1 + mr, np))); else if (np > 0) maxLoan = maxPmt * np; return maxLoan + dp }
      case 'closingCosts': { const hp = n(vals.homePrice); const dp = n(vals.downPayment); const loan = hp - dp; return loan * 0.01 + 500 + 1200 + 400 + 800 }
      case 'rentalIncome': { const mr = n(vals.monthlyRent); const ex = n(vals.expenses); return (mr - ex) * 12 }
      case 'capRate': { const noi = n(vals.noi); const pv = n(vals.propertyValue); return pv > 0 ? (noi / pv) * 100 : 0 }
      case 'cashOnCash': { const acf = n(vals.annualCashFlow); const ti = n(vals.totalInvested); return ti > 0 ? (acf / ti) * 100 : 0 }
      case 'noiCalc': { const ri = n(vals.rentalIncome); const vr = n(vals.vacancyRate); const oe = n(vals.operatingExpenses); const eff = ri * (1 - vr / 100); return eff - oe }
      case 'roiRental': { const mr = n(vals.monthlyRent); const ex = n(vals.expenses); return (mr - ex) * 12 }
      case 'incomeTax': { return n(vals.income) * (n(vals.rate) / 100) }
      case 'taxBracket': { const inc = n(vals.income); const bs = n(vals.bracketStart); const br = n(vals.bracketRate); const bt = n(vals.baseTax); const marginal = Math.max(0, inc - bs) * (br / 100); return bt + marginal }
      case 'marginalTaxRate': { const ai = n(vals.additionalIncome); const r = n(vals.rate); return ai * (r / 100) }
      case 'effectiveTaxRate': { const tt = n(vals.totalTax); const ti = n(vals.totalIncome); return ti > 0 ? (tt / ti) * 100 : 0 }
      case 'capitalGainsTax': { const cb = n(vals.costBasis); const sp = n(vals.salePrice); const gain = sp - cb; return gain > 0 ? gain * (n(vals.taxRate) / 100) : 0 }
      case 'dividendTax': { return n(vals.dividends) * (n(vals.taxRate) / 100) }
      case 'selfEmploymentTax': { const ne = n(vals.netEarnings); const er = n(vals.expenseRate); return ne * (1 - er / 100) * 0.153 }
      case 'salesTax': { return n(vals.price) * (n(vals.taxRate) / 100) }
      case 'vat': { return n(vals.price) * (n(vals.vatRate) / 100) }
      case 'estateTax': { const ev = n(vals.estateValue); const ex = n(vals.exemption); const tr = n(vals.taxRate); const taxable = Math.max(0, ev - ex); return taxable * (tr / 100) }
      case 'taxRefundEstimator': { return n(vals.withheld) - n(vals.taxLiability) }
      case 'itemizedVsStandardDeduction': { return Math.max(n(vals.itemized), n(vals.standard)) }
      case 'amt': { const inc = n(vals.income); const ex = n(vals.exemption); const r = n(vals.rate); return Math.max(0, inc - ex) * (r / 100) }
      case 'cryptoProfit': { const bp = n(vals.buyPrice); const sp = n(vals.sellPrice); const q = n(vals.quantity); return (sp - bp) * q }
      case 'cryptoMining': { const p = n(vals.power); return p * 24 / 1000 * 30 }
      case 'cryptoStaking': { const a = n(vals.amount); const ap = n(vals.apy); const y = n(vals.years); return a * Math.pow(1 + ap / 100, y) - a }
      case 'impermanentLoss': { const pr = n(vals.priceRatio); const ia = n(vals.investA); const ib = n(vals.investB); const hold = ia * pr + ib; const pool = 2 * Math.sqrt(ia * ib * pr); return hold > 0 ? ((pool - hold) / hold) * 100 : 0 }
      case 'cryptoTax': { const bp = n(vals.buyPrice); const sp = n(vals.sellPrice); const q = n(vals.quantity); return (sp - bp) * q }
      case 'lifeInsurance': { return n(vals.income) * n(vals.years) + n(vals.debts) + n(vals.funeral) }
      case 'termVsWholeLife': { const tp = n(vals.termPremium); const wp = n(vals.wholePremium); const y = n(vals.years); return (wp - tp) * 12 * y }
      case 'disability': { return n(vals.income) * (n(vals.benefitPct) / 100) }
      case 'creditUtilization': { const tb = n(vals.totalBalance); const tl = n(vals.totalLimit); return tl > 0 ? (tb / tl) * 100 : 0 }
      case 'creditScore': { const ph = n(vals.paymentHistory); const u = n(vals.utilization); const l = n(vals.length); const mx = n(vals.mix); const iq = n(vals.inquiries); return Math.min(850, Math.max(300, ph + u + l + mx - iq)) }
      case 'balanceTransfer': { const b = n(vals.balance); const pr = n(vals.promoRate); const pm = n(vals.promoMonths); const fr = n(vals.feeRate); const mr = pr / 100 / 12; let mp = 0; if (mr > 0 && pm > 0) { const f = Math.pow(1 + mr, pm); mp = b * (mr * f) / (f - 1) } else if (pm > 0) mp = b / pm; return mp * pm + b * (fr / 100) }
      case 'emergencyFund': { return n(vals.monthlyExpenses) * n(vals.months) }
      case 'sinkingFund': { const g = n(vals.goal); const r = n(vals.rate); const y = n(vals.years); const mr = r / 100 / 12; const m = y * 12; if (mr > 0) return g * (mr / (Math.pow(1 + mr, m) - 1)); return m > 0 ? g / m : 0 }
      case 'savingsGoal': { const g = n(vals.goal); const c = n(vals.current); const r = n(vals.rate); const y = n(vals.years); const add = n(vals.monthlyAdd); const mr = r / 100 / 12; const m = y * 12; if (mr > 0) return c * Math.pow(1 + mr, m) + add * ((Math.pow(1 + mr, m) - 1) / mr); return c + add * m }
      case 'collegeSavings': { const c = n(vals.current); const r = n(vals.rate); const y = n(vals.years); const m = n(vals.monthly); const mr = r / 100 / 12; const mn = y * 12; if (mr > 0) return c * Math.pow(1 + mr, mn) + m * ((Math.pow(1 + mr, mn) - 1) / mr); return c + m * mn }
      case 'netWorth': { return n(vals.assets) - n(vals.liabilities) }
      case 'debtSnowball': { const td = n(vals.totalDebt); const mp = n(vals.minPayment); const ep = n(vals.extraPayment); const r = n(vals.rate); const tm = mp + ep; const mr = r / 100 / 12; let months = 0; let rem = td; if (mr > 0 && tm > rem * mr) { while (rem > 0 && months < 600) { rem -= tm - rem * mr; months++ } } else { months = Math.ceil(td / tm) }; return months }
      case 'debtAvalanche': { const td = n(vals.totalDebt); const mp = n(vals.minPayment); const ep = n(vals.extraPayment); const r = n(vals.rate); const tm = mp + ep; const mr = r / 100 / 12; let months = 0; let rem = td; if (mr > 0 && tm > rem * mr) { while (rem > 0 && months < 600) { rem -= tm - rem * mr; months++ } } else { months = Math.ceil(td / tm) }; return months }
      case 'debtPayoffPlan': { const b = n(vals.balance); const r = n(vals.rate); const m = n(vals.monthly); const mr = r / 100 / 12; let months = 0; let rem = b; if (mr > 0 && m > rem * mr) { while (rem > 0 && months < 600) { rem -= m - rem * mr; months++ } } else { months = Math.ceil(b / m) }; return months }
      case 'debtConsolidationSavings': { const td = n(vals.totalDebt); const cr = n(vals.currentRate); const nr = n(vals.newRate); const t = n(vals.term); const cmr = cr / 100 / 12; const nmr = nr / 100 / 12; const np = t * 12; let cp = 0; let nwp = 0; if (cmr > 0) { const f = Math.pow(1 + cmr, np); cp = td * (cmr * f) / (f - 1) }; if (nmr > 0) { const f = Math.pow(1 + nmr, np); nwp = td * (nmr * f) / (f - 1) }; return cp * np - nwp * np }
      case 'pension': { const cs = n(vals.currentSavings); const mc = n(vals.monthlyContrib); const r = n(vals.rate); const y = n(vals.years); const mr = r / 100 / 12; const m = y * 12; if (mr > 0) return cs * Math.pow(1 + mr, m) + mc * ((Math.pow(1 + mr, m) - 1) / mr); return cs + mc * m }
      case 'socialSecurity': { const e = n(vals.earnings); const ra = n(vals.retirementAge); const pia = e * 0.35; const penalty = ra < 67 ? (67 - ra) * 0.0667 * pia : 0; return Math.max(0, ra >= 67 ? pia : pia - penalty) }
      case 'annuity': { const p = n(vals.principal); const r = n(vals.rate); const y = n(vals.years); const mr = r / 100 / 12; const m = y * 12; if (mr > 0) return p * (mr * Math.pow(1 + mr, m)) / (Math.pow(1 + mr, m) - 1); return m > 0 ? p / m : 0 }
      case 'safeWithdrawalRate': { return n(vals.savings) * (n(vals.withdrawalRate) / 100) }
      case 'rmd': { const b = n(vals.balance); const a = n(vals.age); const le = a >= 95 ? 8.2 : a >= 90 ? 9.6 : a >= 85 ? 11.4 : a >= 80 ? 13.7 : a >= 75 ? 16.7 : a >= 70 ? 20.2 : 25; return b / le }
      case 'businessValuation': { return n(vals.ebitda) * n(vals.multiple) }
      case 'startupCosts': { return n(vals.equipment) + n(vals.license) + n(vals.marketing) + n(vals.legal) + n(vals.inventory) }
      case 'runway': { const c = n(vals.cash); const mb = n(vals.monthlyBurn); const mr = n(vals.monthlyRevenue); const net = mb - mr; return net > 0 ? c / net : Infinity }
      case 'burnRate': { const sc = n(vals.startCash); const ec = n(vals.endCash); const m = n(vals.months); return m > 0 ? (sc - ec) / m : 0 }
      case 'cac': { const sc = n(vals.salesCost); const nc = n(vals.newCustomers); return nc > 0 ? sc / nc : 0 }
      case 'ltvCalc': { const ar = n(vals.avgRevenue); const cr = n(vals.churnRate); return cr > 0 ? ar * (1 / (cr / 100)) : 0 }
      case 'ltvCacRatio': { const l = n(vals.ltv); const c = n(vals.cac); return c > 0 ? l / c : 0 }
      case 'churnRate': { const lc = n(vals.lostCustomers); const sc = n(vals.startCustomers); return sc > 0 ? (lc / sc) * 100 : 0 }
      case 'mrr': { return n(vals.subscribers) * n(vals.avgPrice) }
      case 'arr': { return n(vals.mrr) * 12 }
      case 'unitEconomics': { const p = n(vals.price); const vc = n(vals.varCost); const fc = n(vals.fixedCost); const u = n(vals.units); return (p - vc) * u - fc }
      case 'contributionMargin': { return n(vals.revenue) - n(vals.varCosts) }
      case 'operatingLeverage': { const r = n(vals.revenue); const vc = n(vals.varCosts); const fc = n(vals.fixedCosts); const cm = r - vc; return cm > 0 ? cm / (cm - fc) : 0 }
      case 'financialLeverage': { const ebit = n(vals.ebit); const i = n(vals.interest); return (ebit - i) > 0 ? ebit / (ebit - i) : 0 }
      case 'grossProfit': { return n(vals.revenue) - n(vals.cogs) }
      case 'netProfit': { return n(vals.revenue) - n(vals.expenses) }
      case 'profitMargin': { const r = n(vals.revenue); return r > 0 ? (n(vals.profit) / r) * 100 : 0 }
      case 'costVolumeProfit': { const fc = n(vals.fixedCosts); const p = n(vals.pricePerUnit); const vc = n(vals.varCostPerUnit); const u = n(vals.units); return (p - vc) * u - fc }
      case 'markupCalc': { return n(vals.cost) * (1 + n(vals.markup) / 100) }
      case 'carAffordability': { const mp = n(vals.monthlyPayment); const r = n(vals.rate); const t = n(vals.term); const mr = r / 100 / 12; if (mr > 0) return mp * ((Math.pow(1 + mr, t) - 1) / (mr * Math.pow(1 + mr, t))); return mp * t }
      case 'childCare': { return n(vals.weeklyCost) * n(vals.weeksPerYear) }
      case 'petExpense': { return n(vals.food) + n(vals.vet) + n(vals.supplies) + n(vals.other) }
      case 'fiftyThirtyTwenty': { return n(vals.income) - n(vals.needs) - n(vals.wants) - n(vals.savings) }
      case 'zeroBasedBudget': { const inc = n(vals.income); return inc - n(vals.category1) - n(vals.category2) - n(vals.category3) - n(vals.category4) }
      case 'envelopeSystem': { return n(vals.envelopes) * n(vals.perEnvelope) }
      case 'payYourselfFirst': { return n(vals.income) * (n(vals.savingsPct) / 100) }
      case 'weddingBudget': { return n(vals.budget) }
      case 'vacationBudget': { return n(vals.transport) + n(vals.lodging) + n(vals.food) + n(vals.activities) }
      case 'holidayBudget': { return n(vals.gifts) + n(vals.travel) + n(vals.food) + n(vals.decorations) }
      case 'groceryBudget': { return n(vals.weeklyTarget) * 4.33 }
      case 'monthlyBudget': { const inc = n(vals.income); return inc - n(vals.housing) - n(vals.food) - n(vals.transport) - n(vals.utilities) - n(vals.other) }
      case 'annualBudget': { const inc = n(vals.income); return inc - n(vals.housing) - n(vals.food) - n(vals.transport) - n(vals.utilities) - n(vals.savings) }
      case 'homeInsurance': { return n(vals.homeValue) * 0.0035 }
      case 'autoInsurance': { return n(vals.carValue) * 0.05 }
      case 'healthInsuranceComparison': { return Math.min(n(vals.premium1) * 12 + n(vals.oopMax1), n(vals.premium2) * 12 + n(vals.oopMax2)) }
      case 'deductibleVsPremium': { const ld = n(vals.lowPremium) * 12 + n(vals.lowDeductible); const hd = n(vals.highPremium) * 12 + n(vals.highDeductible); return Math.min(ld, hd) }
      case 'outOfPocketMaximum': { return n(vals.oopMax) }
      case 'propertyTaxDeduction': { return n(vals.propertyTaxPaid) * (n(vals.marginalRate) / 100) }
      case 'giftTax': { return Math.max(0, n(vals.giftAmount) - n(vals.annualExclusion)) }
      case 'inheritanceTax': { const ia = n(vals.inheritanceAmount); const se = n(vals.stateExemption); const tr = n(vals.taxRate); return Math.max(0, ia - se) * (tr / 100) }
      case 'sideHustleTax': { const inc = n(vals.income); const ex = n(vals.expenses); return (inc - ex) * 0.153 }
      case 'gigEconomyTax': { const inc = n(vals.income); const ex = n(vals.expenses); return (inc - ex) * 0.153 }
      case 'interestIncomeTax': { return n(vals.income) * (n(vals.rate) / 100) }
      case 'rentalIncomeTax': { return n(vals.rentIncome) - n(vals.expenses) - n(vals.depreciation) }
      case 'amortization': { const p = n(vals.principal); const r = n(vals.rate); const t = n(vals.term); const mr = r / 100 / 12; const np = t * 12; if (mr > 0 && np > 0 && p > 0) { const f = Math.pow(1 + mr, np); return p * (mr * f) / (f - 1) }; if (np > 0 && p > 0) return p / np; return 0 }
      case 'loanComparison': { const a = n(vals.amount); const r1 = n(vals.rate1); const t1 = n(vals.term1); const r2 = n(vals.rate2); const t2 = n(vals.term2); const mr1 = r1 / 100 / 12; const np1 = t1 * 12; const mr2 = r2 / 100 / 12; const np2 = t2 * 12; let p1 = 0; let p2 = 0; if (mr1 > 0) { const f = Math.pow(1 + mr1, np1); p1 = a * (mr1 * f) / (f - 1) }; if (mr2 > 0) { const f = Math.pow(1 + mr2, np2); p2 = a * (mr2 * f) / (f - 1) }; return p1 * np1 - p2 * np2 }
      case 'biweeklyPayment': { const p = n(vals.principal); const r = n(vals.rate); const t = n(vals.term); const mr = r / 100 / 12; const np = t * 12; let mp = 0; if (mr > 0 && np > 0 && p > 0) { const f = Math.pow(1 + mr, np); mp = p * (mr * f) / (f - 1) } else if (np > 0) mp = p / np; return mp / 2 }
      default: {
        const p = n(vals.principal); const r = n(vals.rate); const t = n(vals.term)
        const mr = r / 100 / 12; const np = t * 12
        if (mr > 0 && np > 0 && p > 0) { const f = Math.pow(1 + mr, np); return p * (mr * f) / (f - 1) }
        if (np > 0 && p > 0) return p / np
        return 0
      }
    }
  }, [watched, calcType])

  const copyResultText = useMemo(() => {
    const lines: string[] = [calculator.title]
    Object.entries(v).filter(([, val]) => val).forEach(([k, val]) => lines.push(`${k}: ${val}`))
    return lines.join('\n')
  }, [calculator.title, v])

  return (
    <FormProvider {...form}>
      <PremiumCalculatorShell
        calculator={calculator}
        form={formContent}
        result={result}
        lockedFields={lockedFields}
        unitSystem={unitSystem}
        onUnitChange={setUnitSystem}
        presets={presets}
        onPresetApply={applyPreset}
        onSaveScenario={saveScenario}
        onExportCSV={exportCSV}
        formula={finMeta.formula}
        interpretation={finMeta.description}
        author={finAuthor}
        reviewer={{ name: 'Sarah Mitchell', photoUrl: 'https://i.pravatar.cc/150?u=jane-doe-cfa', credential: 'CPA', title: 'Tax & Financial Advisor', linkedIn: 'https://www.linkedin.com/in/jane-doe-cfa' }}
        references={finReferences}
        example={mortgageExample}
        userCount={42315}
        onReset={() => {
          const locked = Object.fromEntries(
            Array.from(lockedFields).map(key => [key, form.getValues(key)])
          )
          form.reset(defaults)
          Object.entries(locked).forEach(([key, value]) => {
            if (value !== undefined && value !== '') form.setValue(key as any, value)
          })
        }}
        copyResultText={copyResultText}
        inputs={watchedInputs}
        showTabs={true}
        useSlider={useSlider}
        onToggleSlider={() => setUseSlider(!useSlider)}
        hubCategory="financial"
        mainValue={mainValue}
        onExtraFieldsChange={setExtraFields}
      />
    </FormProvider>
  )
}
