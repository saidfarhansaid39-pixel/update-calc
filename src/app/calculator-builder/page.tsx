'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, Save, Calculator, ExternalLink, Code, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'

interface FieldDef {
  name: string
  label: string
  type: 'number' | 'text' | 'select'
  min?: number
  max?: number
  step?: number
  options?: string[]
}

interface CustomCalculator {
  id: string
  name: string
  slug: string
  description: string
  formula: string
  fields: FieldDef[]
  createdAt: number
}

const STORAGE_KEY = 'custom_calculators'

function loadCalculators(): CustomCalculator[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveCalculators(calcs: CustomCalculator[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(calcs)) } catch { }
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'custom-calculator'
}

export default function CalculatorBuilderPage() {
  const [calculators, setCalculators] = useState<CustomCalculator[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [formula, setFormula] = useState('')
  const [fields, setFields] = useState<FieldDef[]>([{ name: 'value1', label: 'Value 1', type: 'number', min: 0, max: 1000000, step: 1 }])
  const [saved, setSaved] = useState(false)
  const [activeCalc, setActiveCalc] = useState<string | null>(null)
  const [calcInputs, setCalcInputs] = useState<Record<string, string>>({})
  const [calcResult, setCalcResult] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showBuilder, setShowBuilder] = useState(false)
  const [showSaved, setShowSaved] = useState(true)

  useEffect(() => {
    setCalculators(loadCalculators())
  }, [])

  const addField = useCallback(() => {
    const n = fields.length + 1
    setFields(prev => [...prev, { name: `value${n}`, label: `Value ${n}`, type: 'number', min: 0, max: 1000000, step: 1 }])
  }, [fields.length])

  const removeField = useCallback((index: number) => {
    setFields(prev => prev.filter((_, i) => i !== index))
  }, [])

  const updateField = useCallback((index: number, key: keyof FieldDef, value: any) => {
    setFields(prev => prev.map((f, i) => i === index ? { ...f, [key]: value } : f))
  }, [])

  const handleSave = useCallback(() => {
    if (!name.trim()) return
    const calc: CustomCalculator = {
      id: crypto.randomUUID(),
      name: name.trim(),
      slug: slugify(name),
      description: description.trim(),
      formula: formula.trim(),
      fields: fields.filter(f => f.name.trim()),
      createdAt: Date.now(),
    }
    const updated = [...calculators, calc]
    setCalculators(updated)
    saveCalculators(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setName('')
    setDescription('')
    setFormula('')
    setFields([{ name: 'value1', label: 'Value 1', type: 'number', min: 0, max: 1000000, step: 1 }])
  }, [name, description, formula, fields, calculators])

  const deleteCalc = useCallback((id: string) => {
    const updated = calculators.filter(c => c.id !== id)
    setCalculators(updated)
    saveCalculators(updated)
    if (activeCalc === id) { setActiveCalc(null); setCalcResult(null) }
  }, [calculators, activeCalc])

  const evaluateFormula = useCallback((calc: CustomCalculator) => {
    try {
      let expr = calc.formula
      const inputValues: Record<string, number> = {}
      calc.fields.forEach(f => {
        const v = parseFloat(calcInputs[f.name] || '0')
        inputValues[f.name] = isNaN(v) ? 0 : v
        const regex = new RegExp(`\\b${f.name}\\b`, 'g')
        expr = expr.replace(regex, String(v))
      })
      const result = Function(`"use strict"; return (${expr})`)()
      setCalcResult(typeof result === 'number' ? result.toLocaleString(undefined, { maximumFractionDigits: 4 }) : String(result))
    } catch {
      setCalcResult('Error evaluating formula')
    }
  }, [calcInputs])

  const selectCalc = useCallback((calc: CustomCalculator) => {
    setActiveCalc(calc.id)
    const initial: Record<string, string> = {}
    calc.fields.forEach(f => { initial[f.name] = '' })
    setCalcInputs(initial)
    setCalcResult(null)
  }, [])

  const embedCode = activeCalc ? calculators.find(c => c.id === activeCalc) : null
  const iframeCode = embedCode ? `<iframe src="https://www.jdcalc.com/calculator-builder?calc=${embedCode.slug}" width="100%" height="500" frameborder="0" title="${embedCode.name}"></iframe>` : ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(iframeCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calculator Builder</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create your own custom calculators with custom formulas and fields.</p>
      </div>

      {/* Saved Calculators */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
          onClick={() => setShowSaved(!showSaved)}
          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            My Calculators ({calculators.length})
          </h2>
          {showSaved ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {showSaved && (
          <div className="px-6 pb-4">
            {calculators.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No custom calculators yet. Create your first one below.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {calculators.map(calc => (
                  <div
                    key={calc.id}
                    className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                      activeCalc === calc.id ? 'border-[#06b6d4] bg-[#1a3a8a]/5' : 'border-gray-200 dark:border-gray-700 hover:border-[#06b6d4]/30'
                    }`}
                    onClick={() => selectCalc(calc)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{calc.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{calc.fields.length} field(s)</p>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); deleteCalc(calc.id) }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {calc.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{calc.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Active calculator runner */}
            {activeCalc && (() => {
              const calc = calculators.find(c => c.id === activeCalc)
              if (!calc) return null
              return (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl space-y-3">
                  <h3 className="font-medium text-gray-900 dark:text-white">{calc.name}</h3>
                  {calc.description && <p className="text-xs text-gray-500 dark:text-gray-400">{calc.description}</p>}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {calc.fields.map(f => (
                      <div key={f.name}>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{f.label}</label>
                        {f.type === 'select' ? (
                          <select
                            value={calcInputs[f.name] || ''}
                            onChange={e => { setCalcInputs(prev => ({ ...prev, [f.name]: e.target.value })); setCalcResult(null) }}
                            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                          >
                            <option value="">Select...</option>
                            {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : (
                          <input
                            type={f.type}
                            value={calcInputs[f.name] || ''}
                            onChange={e => { setCalcInputs(prev => ({ ...prev, [f.name]: e.target.value })); setCalcResult(null) }}
                            min={f.min}
                            max={f.max}
                            step={f.step}
                            placeholder={`Enter ${f.label.toLowerCase()}`}
                            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 placeholder-gray-400"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => evaluateFormula(calc)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-[#1a3a8a] text-white hover:bg-[#0a1d4f] transition-colors"
                  >
                    <Calculator className="w-4 h-4" /> Calculate
                  </button>

                  {calcResult !== null && (
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Result</p>
                      <p className="text-xl font-bold text-[#06b6d4]">{calcResult}</p>
                    </div>
                  )}

                  {/* Embed code */}
                  <div className="pt-2">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Embed Code</p>
                    <div className="relative">
                      <pre className="p-3 bg-gray-900 text-gray-100 rounded-lg text-[10px] overflow-x-auto">{iframeCode}</pre>
                      <button
                        onClick={handleCopy}
                        className="absolute top-2 right-2 p-1.5 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
                      >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>

      {/* Builder Form */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
          onClick={() => setShowBuilder(!showBuilder)}
          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Calculator</h2>
          {showBuilder ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {showBuilder && (
          <div className="px-6 pb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Calculator Name</label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g., Profit Margin Calculator"
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Brief description of what this calculator does"
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Formula <span className="text-gray-400 font-normal">(use field names as variables, e.g., value1 * value2 / 100)</span>
              </label>
              <input
                type="text" value={formula} onChange={e => setFormula(e.target.value)}
                placeholder="value1 * value2 / 100"
                className="w-full px-3 py-2 text-sm font-mono border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 placeholder-gray-400"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fields</label>
                <button
                  onClick={addField}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-[#1a3a8a]/10 text-[#06b6d4] hover:bg-[#1a3a8a]/20 transition-colors"
                >
                  <Plus className="w-3 h-3" /> Add Field
                </button>
              </div>
              <div className="space-y-2">
                {fields.map((field, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <input
                      type="text" value={field.name} onChange={e => updateField(i, 'name', e.target.value)}
                      placeholder="Field name"
                      className="flex-1 min-w-0 px-2 py-1 text-xs font-mono border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 placeholder-gray-400"
                    />
                    <input
                      type="text" value={field.label} onChange={e => updateField(i, 'label', e.target.value)}
                      placeholder="Label"
                      className="flex-1 min-w-0 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 placeholder-gray-400"
                    />
                    <select
                      value={field.type} onChange={e => updateField(i, 'type', e.target.value)}
                      className="px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      <option value="number">Number</option>
                      <option value="text">Text</option>
                      <option value="select">Select</option>
                    </select>
                    <button
                      onClick={() => removeField(i)}
                      className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-[#1a3a8a] text-white hover:bg-[#0a1d4f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save Calculator'}
            </button>

            {/* Slug preview */}
            {name && (
              <p className="text-xs text-gray-400">
                URL slug: <code className="text-[#06b6d4]">{slugify(name)}</code>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
