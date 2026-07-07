import { z } from 'zod'
import type { FieldDef } from './generic-fallback'

export function numField(name: string, label: string, opts?: { min?: number; max?: number; step?: string; placeholder?: string; mode?: 'basic' | 'advanced' | 'professional' | 'expert' }): FieldDef {
  return { name, label, type: 'number', ...opts }
}

export function selectField(name: string, label: string, options: { label: string; value: string }[]): FieldDef {
  return { name, label, type: 'select', options }
}

export function textField(name: string, label: string, opts?: { placeholder?: string }): FieldDef {
  return { name, label, type: 'text', ...opts }
}

export function n(v: string): number { return parseFloat(v) || 0 }

export function ni(v: string): number { return parseInt(v, 10) || 0 }

export function step(label: string, value: string): { label: string; value: string } {
  return { label, value }
}

export function fact(x: number): number { return x <= 1 ? 1 : x * fact(x - 1) }

export function gcd(a: number, b: number): number { return b === 0 ? Math.abs(a) : gcd(b, a % b) }

export const num2Schema = z.object({
  a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'),
  b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'),
})

export const num3Schema = z.object({
  a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'),
  b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'),
  c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'),
})

export const num4Schema = z.object({
  a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'),
  b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'),
  c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'),
  d: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'),
})
