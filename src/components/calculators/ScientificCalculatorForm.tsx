'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { evaluateExpression } from '@/lib/calculators/scientificEngine'
import { cn } from '@/lib/utils'

type AngleMode = 'deg' | 'rad' | 'grad'

const CONSTANT_VALUES: Record<string, number> = {
  pi: Math.PI,
  e: Math.E,
}

function formatResult(n: number): string {
  if (!isFinite(n)) return 'Error'
  if (Number.isInteger(n)) return n.toString()
  return parseFloat(n.toPrecision(12)).toString()
}

export function ScientificCalculatorForm() {
  const [expression, setExpression] = useState('')
  const [display, setDisplay] = useState('0')
  const [history, setHistory] = useState<string[]>([])
  const [angleMode, setAngleMode] = useState<AngleMode>('deg')
  const [memory, setMemory] = useState(0)
  const [showSecond, setShowSecond] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [error, setError] = useState(false)
  const [lastResult, setLastResult] = useState<number | null>(null)

  const append = useCallback((val: string) => {
    setError(false)
    if (val === 'ans' && lastResult !== null) {
      setExpression(prev => prev + lastResult.toString())
      return
    }
    setExpression(prev => prev + val)
  }, [lastResult])

  const handleConst = useCallback((name: string) => {
    setError(false)
    const v = CONSTANT_VALUES[name]
    if (v) setExpression(prev => prev + v.toString())
  }, [])

  const handleClear = useCallback(() => {
    setExpression('')
    setDisplay('0')
    setError(false)
  }, [])

  const handleDelete = useCallback(() => {
    setError(false)
    setExpression(prev => prev.slice(0, -1))
  }, [])

  const handleCalculate = useCallback(() => {
    if (!expression.trim()) return
    const result = evaluateExpression(expression, angleMode === 'deg')
    if (!isNaN(result) && isFinite(result)) {
      const formatted = formatResult(result)
      setHistory(prev => [`${expression} = ${formatted}`, ...prev].slice(0, 25))
      setDisplay(formatted)
      setExpression(formatted)
      setLastResult(result)
      setError(false)
    } else {
      setDisplay('Error')
      setError(true)
    }
  }, [expression, angleMode])

  const handleMemoryAdd = useCallback(() => {
    const val = parseFloat(expression)
    if (!isNaN(val)) setMemory(prev => prev + val)
  }, [expression])

  const handleMemorySubtract = useCallback(() => {
    const val = parseFloat(expression)
    if (!isNaN(val)) setMemory(prev => prev - val)
  }, [expression])

  const handleMemoryRecall = useCallback(() => {
    setExpression(prev => prev + memory.toString())
  }, [memory])

  const handleMemoryClear = useCallback(() => setMemory(0), [])

  const handleMemoryStore = useCallback(() => {
    const val = parseFloat(expression)
    if (!isNaN(val)) setMemory(val)
  }, [expression])

  const toggleSign = useCallback(() => {
    setExpression(prev => {
      if (prev.startsWith('-')) return prev.slice(1)
      return '-' + prev
    })
  }, [])

  const insertParen = useCallback(() => {
    setError(false)
    const openCount = (expression.match(/\(/g) || []).length
    const closeCount = (expression.match(/\)/g) || []).length
    if (openCount > closeCount) {
      setExpression(prev => prev + ')')
    } else {
      setExpression(prev => prev + '(')
    }
  }, [expression])

  const insertFactorial = useCallback(() => {
    setExpression(prev => prev + '!')
  }, [])

  const insertAndCalculate = useCallback((val: string) => {
    if (val === 'x^2') { setExpression(prev => prev + '^2'); return }
    if (val === 'x^3') { setExpression(prev => prev + '^3'); return }
    if (val === '10^x') { setExpression(prev => prev + '10^'); return }
    if (val === 'e^x') { setExpression(prev => prev + 'exp('); return }
    if (val === 'sqrt') { setExpression(prev => prev + 'sqrt('); return }
    if (val === 'cbrt') { setExpression(prev => prev + 'cbrt('); return }
    if (val === 'recip') { setExpression(prev => prev + 'recip('); return }
    if (val === 'abs') { setExpression(prev => prev + 'abs('); return }
    if (['sin','cos','tan','asin','acos','atan','sinh','cosh','tanh','asinh','acosh','atanh','log','ln','log2','floor','ceil','round'].includes(val)) {
      setExpression(prev => prev + val + '(')
      return
    }
    append(val)
  }, [append])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key
      if (/[0-9+\-*/().^%]/.test(key)) {
        e.preventDefault()
        append(key)
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault()
        handleCalculate()
      } else if (key === 'Backspace') {
        e.preventDefault()
        handleDelete()
      } else if (key === 'Escape') {
        e.preventDefault()
        handleClear()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [append, handleCalculate, handleDelete, handleClear])

  const btn = 'min-h-[48px] h-auto rounded-xl text-sm font-medium transition-all duration-150 active:scale-95 select-none cursor-pointer flex items-center justify-center border'

  const variants = {
    num: `${btn} bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm`,
    op: `${btn} bg-[#1a3a8a]/8 dark:bg-[#06b6d4]/10 text-[#1a3a8a] dark:text-[#06b6d4] border-[#1a3a8a]/15 dark:border-[#06b6d4]/20 hover:bg-[#1a3a8a]/15 dark:hover:bg-[#06b6d4]/20 shadow-sm`,
    sci: `${btn} bg-gray-50 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs`,
    sciActive: `${btn} bg-[#1a3a8a] dark:bg-[#06b6d4] text-white border-[#1a3a8a] dark:border-[#06b6d4] hover:opacity-90 text-xs`,
    action: `${btn} bg-gradient-to-br from-[#1a3a8a] to-[#06b6d4] text-white border-0 hover:opacity-90 shadow-md text-base font-bold`,
    clear: `${btn} bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/30 hover:bg-red-100 dark:hover:bg-red-900/30`,
    mem: `${btn} bg-gray-50 dark:bg-gray-800 text-[10px] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700`,
  }

  const sciRow1 = showSecond
    ? ['sinh', 'cosh', 'tanh', 'asinh', 'acosh']
    : ['sin', 'cos', 'tan', 'asin', 'acos']
  const sciRow2 = showSecond
    ? ['atanh', 'log2', 'cbrt', 'abs', 'recip']
    : ['log', 'ln', 'sqrt', 'exp', '10^x']
  const sciRow3 = showSecond
    ? ['floor', 'ceil', 'round', 'x^2', 'x^3']
    : ['e^x', 'x^2', 'x^3', 'sqrt', 'cbrt']

  return (
    <div className="w-full font-sans">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Calculator */}
        <div className="w-full lg:w-[420px] xl:w-[460px] flex-shrink-0">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 shadow-sm">

            {/* Display */}
            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-4 mb-3 min-h-[80px] sm:min-h-[90px] flex flex-col justify-end text-right overflow-hidden">
              <div className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 min-h-[18px] sm:min-h-[20px] overflow-hidden whitespace-nowrap font-mono">
                {error ? '' : expression || '\u00A0'}
              </div>
              <div className="text-2xl sm:text-3xl font-semibold tracking-tight font-mono leading-tight overflow-hidden whitespace-nowrap text-gray-900 dark:text-white">
                {error ? (
                  <span className="text-red-500 dark:text-red-400">Error</span>
                ) : (
                  display
                )}
              </div>
            </div>

            {/* Memory + Mode Row */}
            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
              <div className="flex gap-1">
                <button className={variants.mem} onClick={handleMemoryClear} aria-label="Memory clear">MC</button>
                <button className={variants.mem} onClick={handleMemoryRecall} aria-label="Memory recall">MR</button>
                <button className={variants.mem} onClick={handleMemoryStore} aria-label="Memory store">MS</button>
                <button className={variants.mem} onClick={handleMemoryAdd} aria-label="Memory add">M+</button>
                <button className={variants.mem} onClick={handleMemorySubtract} aria-label="Memory subtract">M-</button>
              </div>
              {memory !== 0 && (
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono ml-1">M:{formatResult(memory)}</span>
              )}
              <div className="flex-1" />
              <button
                onClick={() => setShowHistory(v => !v)}
                className="min-h-[32px] px-2 py-1 rounded-lg text-[10px] font-medium border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
                aria-label="Toggle history"
              >
                {showHistory ? 'Hide' : 'History'} ({history.length})
              </button>
            </div>

            {/* Angle Mode Toggle */}
            <div className="flex items-center gap-1 mb-2">
              {(['deg', 'rad', 'grad'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setAngleMode(mode)}
                  className={cn(
                    'min-h-[32px] px-3 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all',
                    angleMode === mode
                      ? 'bg-[#1a3a8a] dark:bg-[#06b6d4] text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                  aria-pressed={angleMode === mode}
                >
                  {mode}
                </button>
              ))}
              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
              <button
                onClick={() => setShowSecond(v => !v)}
                className={cn(
                  'min-h-[32px] px-3 py-1 rounded-lg text-[11px] font-semibold transition-all',
                  showSecond
                    ? 'bg-[#1a3a8a] dark:bg-[#06b6d4] text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
                aria-pressed={showSecond}
              >
                2nd
              </button>
            </div>

            {/* Scientific Functions */}
            <div className="grid grid-cols-5 gap-1.5 mb-2">
              {sciRow1.map(fn => (
                <button key={fn} className={variants.sci} onClick={() => insertAndCalculate(fn)}>
                  {fn === 'sqrt' ? '√' : fn === 'cbrt' ? '∛' : fn === 'recip' ? '1/x' : fn === 'abs' ? '|x|' : fn === 'exp' ? 'eˣ' : fn === 'log2' ? 'log₂' : fn}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-1.5 mb-2">
              {sciRow2.map(fn => (
                <button key={fn} className={variants.sci} onClick={() => insertAndCalculate(fn)}>
                  {fn === 'exp' ? 'eˣ' : fn === 'sqrt' ? '√' : fn === 'cbrt' ? '∛' : fn === 'recip' ? '1/x' : fn === 'abs' ? '|x|' : fn === 'log2' ? 'log₂' : fn}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-1.5 mb-3">
              {sciRow3.map(fn => (
                <button key={fn} className={variants.sci} onClick={() => insertAndCalculate(fn)}>
                  {fn === 'sqrt' ? '√' : fn === 'cbrt' ? '∛' : fn}
                </button>
              ))}
            </div>

            {/* Numpad */}
            <div className="grid grid-cols-4 gap-1.5 mb-1.5">
              <button className={variants.op} onClick={insertParen}>(</button>
              <button className={variants.op} onClick={() => append(')')}>)</button>
              <button className={variants.clear} onClick={handleClear}>AC</button>
              <button className={variants.clear} onClick={handleDelete}>CE</button>

              <button className={variants.num} onClick={() => append('7')}>7</button>
              <button className={variants.num} onClick={() => append('8')}>8</button>
              <button className={variants.num} onClick={() => append('9')}>9</button>
              <button className={variants.op} onClick={() => append('/')}>÷</button>

              <button className={variants.num} onClick={() => append('4')}>4</button>
              <button className={variants.num} onClick={() => append('5')}>5</button>
              <button className={variants.num} onClick={() => append('6')}>6</button>
              <button className={variants.op} onClick={() => append('*')}>×</button>

              <button className={variants.num} onClick={() => append('1')}>1</button>
              <button className={variants.num} onClick={() => append('2')}>2</button>
              <button className={variants.num} onClick={() => append('3')}>3</button>
              <button className={variants.op} onClick={() => append('-')}>−</button>

              <button className={variants.num} onClick={toggleSign}>±</button>
              <button className={variants.num} onClick={() => append('0')}>0</button>
              <button className={variants.num} onClick={() => append('.')}>.</button>
              <button className={variants.op} onClick={() => append('+')}>+</button>
            </div>

            {/* Equals + extra row */}
            <div className="grid grid-cols-4 gap-1.5">
              <button className={variants.sci} onClick={insertFactorial}>x!</button>
              <button className={variants.sci} onClick={() => append('^')}>xʸ</button>
              <button className={variants.sci} onClick={() => handleConst('pi')}>π</button>
              <button className={variants.sci} onClick={() => handleConst('e')}>e</button>
            </div>

            <button
              onClick={handleCalculate}
              className="mt-2 w-full min-h-[52px] rounded-xl bg-gradient-to-br from-[#1a3a8a] to-[#06b6d4] text-white text-lg font-bold hover:opacity-90 transition-all active:scale-[0.98] shadow-md"
            >
              =
            </button>

          </div>
        </div>

        {/* History Panel */}
        <div className={cn(
          'flex-1 min-w-0',
          'lg:block',
          showHistory ? 'block' : 'hidden'
        )}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm h-full max-h-[600px] flex flex-col">
            <div className="bg-gradient-to-r from-[#1a3a8a] to-[#06b6d4] text-white font-semibold py-2.5 px-4 rounded-t-2xl text-sm flex items-center justify-between flex-shrink-0">
              <span>History</span>
              <span className="text-white/70 text-xs font-normal">{history.length} entries</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {history.length === 0 ? (
                <p className="text-gray-400 dark:text-gray-500 italic text-sm text-center py-8">
                  No history yet. Calculations will appear here.
                </p>
              ) : (
                history.map((item, idx) => {
                  const eq = item.split(' = ')[0]
                  const res = item.split(' = ')[1]
                  return (
                    <div
                      key={idx}
                      onClick={() => { setExpression(res || ''); setDisplay(res || '') }}
                      className="group flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0"
                    >
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate mr-2">{eq}</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white font-mono flex-shrink-0">{res}</span>
                    </div>
                  )
                })
              )}
            </div>
            {history.length > 0 && (
              <div className="p-2 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                <button
                  onClick={() => setHistory([])}
                  className="w-full py-1.5 rounded-lg text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Clear History
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
