'use client'

import React, { useState, useCallback } from 'react'

type Mode = 'basic' | 'scientific'

const FUNCTIONS: Record<string, (x: number) => number> = {
  sin: (x) => Math.sin((x * Math.PI) / 180),
  cos: (x) => Math.cos((x * Math.PI) / 180),
  tan: (x) => Math.tan((x * Math.PI) / 180),
  asin: (x) => (Math.asin(x) * 180) / Math.PI,
  acos: (x) => (Math.acos(x) * 180) / Math.PI,
  atan: (x) => (Math.atan(x) * 180) / Math.PI,
  ln: (x) => Math.log(x),
  log: (x) => Math.log10(x),
  sqrt: (x) => Math.sqrt(x),
  exp: (x) => Math.exp(x),
  abs: (x) => Math.abs(x),
}

function evaluate(expr: string): number {
  const tokens = expr.match(/(\d+\.?\d*|\.\d+|[+\-*/^()]|sin|cos|tan|asin|acos|atan|ln|log|sqrt|exp|abs|pi|e)/gi)
  if (!tokens) throw new Error('Invalid expression')
  const output: (number | string)[] = []
  const ops: string[] = []
  const prec: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 }
  const isFunc = (t: string) => t in FUNCTIONS
  let prev: 'num' | 'op' | 'func' | 'lparen' | 'none' = 'none'
  for (let i = 0; i < tokens.length; i++) {
    let t = tokens[i].toLowerCase()
    if (t === 'pi') t = 'p'
    if (t === 'p') { output.push(Math.PI); prev = 'num'; continue }
    if (t === 'e') { output.push(Math.E); prev = 'num'; continue }
    if (/^\d/.test(t) || t === '.') { output.push(parseFloat(t)); prev = 'num'; continue }
    if (isFunc(t)) { ops.push(t); prev = 'func'; continue }
    if (t === '(') { ops.push(t); prev = 'lparen'; continue }
    if (t === ')') {
      while (ops.length && ops[ops.length - 1] !== '(') output.push(ops.pop()!)
      if (ops[ops.length - 1] === '(') ops.pop()
      while (ops.length && isFunc(ops[ops.length - 1])) output.push(ops.pop()!)
      prev = 'num'
      continue
    }
    if (t === '+' || t === '-' || t === '*' || t === '/' || t === '^') {
      if ((t === '-' || t === '+') && (prev === 'op' || prev === 'lparen' || prev === 'none')) {
        if (t === '-') output.push(0)
      }
      while (
        ops.length &&
        ops[ops.length - 1] !== '(' &&
        !isFunc(ops[ops.length - 1]) &&
        (ops[ops.length - 1] === '^' ? prec[ops[ops.length - 1]] > prec[t] : prec[ops[ops.length - 1]] >= prec[t])
      ) {
        output.push(ops.pop()!)
      }
      ops.push(t)
      prev = 'op'
      continue
    }
    throw new Error('Unexpected token ' + t)
  }
  while (ops.length) {
    const o = ops.pop()!
    if (o === '(') throw new Error('Mismatched parentheses')
    output.push(o)
  }
  const stack: number[] = []
  for (const tok of output) {
    if (typeof tok === 'number') { stack.push(tok); continue }
    if (isFunc(tok)) {
      const a = stack.pop()
      if (a === undefined) throw new Error('Bad function input')
      stack.push(FUNCTIONS[tok](a))
      continue
    }
    const b = stack.pop()
    const a = stack.pop()
    if (a === undefined || b === undefined) throw new Error('Bad expression')
    switch (tok) {
      case '+': stack.push(a + b); break
      case '-': stack.push(a - b); break
      case '*': stack.push(a * b); break
      case '/': stack.push(a / b); break
      case '^': stack.push(Math.pow(a, b)); break
    }
  }
  if (stack.length !== 1) throw new Error('Bad expression')
  return stack[0]
}

interface Props {
  defaultMode?: Mode
  compact?: boolean
}

export function QuickCalculator({ defaultMode = 'basic', compact = false }: Props) {
  const [mode, setMode] = useState<Mode>(defaultMode)
  const [display, setDisplay] = useState('0')
  const [error, setError] = useState(false)

  const append = useCallback((val: string) => {
    setError(false)
    setDisplay(d => (d === '0' && val !== '.' ? val : d + val))
  }, [])

  const handle = useCallback((val: string) => {
    setError(false)
    if (val === 'C') { setDisplay('0'); return }
    if (val === 'DEL') { setDisplay(d => (d.length > 1 ? d.slice(0, -1) : '0')); return }
    if (val === '=') {
      try {
        const res = evaluate(display)
        if (!isFinite(res)) throw new Error('Result not finite')
        const rounded = Math.round(res * 1e10) / 1e10
        setDisplay(String(rounded))
      } catch {
        setError(true)
        setDisplay('Error')
      }
      return
    }
    append(val)
  }, [display, append])

  const applyFn = useCallback((fn: string) => {
    setError(false)
    setDisplay(d => (d === '0' ? fn + '(' : d + fn + '('))
  }, [])

  const basicKeys = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', 'DEL', '+']
  const sciKeys = ['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', '(', ')', 'pi', 'e', '^', 'C']

  return (
    <div className={`w-full ${compact ? 'max-w-[280px]' : 'max-w-sm'} mx-auto font-sans`}>
      <div className="flex items-center gap-1 mb-2">
        <button
          onClick={() => setMode('basic')}
          className={`px-2 py-1 text-xs rounded-md transition-colors ${mode === 'basic' ? 'bg-[#1a3a8a] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
          aria-pressed={mode === 'basic'}
        >
          Basic
        </button>
        <button
          onClick={() => setMode('scientific')}
          className={`px-2 py-1 text-xs rounded-md transition-colors ${mode === 'scientific' ? 'bg-[#1a3a8a] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
          aria-pressed={mode === 'scientific'}
        >
          Scientific
        </button>
      </div>

      <div
        className={`rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-3 mb-2 text-right overflow-x-auto ${error ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}
        role="textbox"
        aria-label="Calculator display"
      >
        <span className="text-2xl font-semibold tracking-tight break-all">{display}</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {mode === 'scientific' && sciKeys.map(k => (
          <button
            key={k}
            onClick={() => (k === 'C' ? handle('C') : k === '(' || k === ')' ? handle(k) : applyFn(k))}
            className="h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-medium text-[#1a3a8a] dark:text-[#06b6d4] hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {k}
          </button>
        ))}
        {basicKeys.map(k => (
          <button
            key={k}
            onClick={() => handle(k)}
            className={`h-10 rounded-lg text-sm font-semibold transition-colors ${'/*-+'.includes(k) ? 'bg-[#1a3a8a]/10 text-[#1a3a8a] dark:bg-[#1a3a8a]/30 dark:text-[#06b6d4] hover:bg-[#1a3a8a]/20' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          >
            {k}
          </button>
        ))}
        <button onClick={() => applyFn('sqrt')} className="h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-medium text-[#1a3a8a] dark:text-[#06b6d4] hover:bg-gray-200 dark:hover:bg-gray-700">sqrt</button>
        <button onClick={() => handle('=')} className="h-10 rounded-lg bg-gradient-to-br from-[#1a3a8a] to-[#06b6d4] text-white text-sm font-bold hover:opacity-90 transition-opacity col-span-2">=</button>
        <button onClick={() => handle('C')} className="h-10 rounded-lg bg-red-50 dark:bg-red-900/30 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50">C</button>
      </div>
    </div>
  )
}
