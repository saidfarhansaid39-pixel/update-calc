import { z } from 'zod'

export const loanSchema = z.object({
  principal: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0'),
  rate: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, 'Must be >= 0'),
  term: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0'),
})

export const investmentSchema = z.object({
  initial: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, 'Must be >= 0'),
  monthly: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, 'Must be >= 0'),
  rate: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, 'Must be >= 0'),
  years: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0'),
})

export const healthSchema = z.object({
  age: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0 && parseFloat(v) < 150, 'Invalid age'),
  weight: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0'),
  height: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0'),
  gender: z.enum(['male', 'female']),
})

export const mathSchema = z.object({
  valueA: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)), 'Must be a number'),
  valueB: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)), 'Must be a number'),
  operation: z.enum(['+', '-', '*', '/', '^', '%']),
})

export const constructionSchema = z.object({
  length: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0'),
  width: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0'),
  depth: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, 'Must be >= 0'),
  unit: z.enum(['ft', 'm', 'in']),
})

export const engineeringSchema = z.object({
  voltage: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, 'Must be >= 0'),
  current: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, 'Must be >= 0'),
})

export const dateTimeSchema = z.object({
  date1: z.string().min(1, 'Required'),
  date2: z.string().min(1, 'Required'),
})

export const everydaySchema = z.object({
  value: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)), 'Must be a number'),
  fromUnit: z.string().min(1),
  toUnit: z.string().min(1),
})

export const mortgageSchema = z.object({
  homePrice: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0'),
  downPayment: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, 'Must be >= 0'),
  rate: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, 'Must be >= 0'),
  term: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0'),
  propertyTax: z.string().optional().default('0').refine(v => !isNaN(parseFloat(v || '0')) && parseFloat(v || '0') >= 0, 'Must be >= 0'),
  homeInsurance: z.string().optional().default('0').refine(v => !isNaN(parseFloat(v || '0')) && parseFloat(v || '0') >= 0, 'Must be >= 0'),
  pmiRate: z.string().optional().default('0').refine(v => !isNaN(parseFloat(v || '0')) && parseFloat(v || '0') >= 0, 'Must be >= 0'),
  hoa: z.string().optional().default('0').refine(v => !isNaN(parseFloat(v || '0')) && parseFloat(v || '0') >= 0, 'Must be >= 0'),
  extraPayment: z.string().optional().default('0').refine(v => !isNaN(parseFloat(v || '0')) && parseFloat(v || '0') >= 0, 'Must be >= 0'),
  frequency: z.string().optional().default('monthly'),
})

export const tipSchema = z.object({
  bill: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0'),
  tipPercent: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, 'Must be >= 0'),
  split: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1, 'Must be >= 1'),
})

export const retirementSchema = z.object({
  age: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0'),
  retirementAge: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0'),
  savings: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, 'Must be >= 0'),
  monthly: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, 'Must be >= 0'),
  rate: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, 'Must be >= 0'),
})
