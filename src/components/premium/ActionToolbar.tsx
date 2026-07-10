'use client'

import { useRef, useEffect, useState } from 'react'
import {
  Printer,
  FileText,
  Share2,
  Check,
  Copy,
  Plus,
  Layers,
  MoreHorizontal,
  RefreshCw,
  Sliders,
} from 'lucide-react'

interface ActionToolbarProps {
  onReset?: () => void
  onUnitChange?: (unit: string) => void
  unitOptions?: { value: string; label: string }[]
  unitSystem?: string
  onToggleSlider?: () => void
  useSlider?: boolean
  onExport?: (format: string) => void
  onShare?: () => void
  shareCopied?: boolean
  onCopyResult?: () => void
  resultCopied?: boolean
  copyResultText?: string
  inputs?: Record<string, string>
  onSaveScenario?: () => void
  showCSV?: boolean
  modeLevel?: number
  tierFeatures?: { export?: boolean; comparison?: boolean }
  showBatch?: boolean
  onToggleBatch?: (show: boolean) => void
  extraActions?: React.ReactNode
  shareButtons?: React.ReactNode
  embedWidget?: React.ReactNode
  citationGenerator?: React.ReactNode
}

const btnBase =
  'min-h-[44px] px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors inline-flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#06b6d4] focus-visible:ring-offset-2'

const primaryBtn = `${btnBase} border-primary text-primary hover:bg-primary/10`
const ghostBtn = `${btnBase} border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800`
const accentBtn = `${btnBase} border-primary bg-primary text-white hover:bg-primary/90`

export function ActionToolbar({
  onReset,
  onUnitChange,
  unitOptions,
  unitSystem,
  onToggleSlider,
  useSlider,
  onExport,
  onShare,
  shareCopied,
  onCopyResult,
  resultCopied,
  copyResultText = 'Copy',
  inputs,
  onSaveScenario,
  showCSV,
  modeLevel,
  tierFeatures,
  showBatch,
  onToggleBatch,
  extraActions,
  shareButtons,
  embedWidget,
  citationGenerator,
}: ActionToolbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Unit toggle */}
      {unitOptions && unitOptions.length > 0 && onUnitChange && (
        <select
          value={unitSystem}
          onChange={(e) => onUnitChange(e.target.value)}
          className={`${btnBase} border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 cursor-pointer`}
          aria-label="Unit system"
        >
          {unitOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {/* Slider toggle */}
      {onToggleSlider && (
        <button
          onClick={onToggleSlider}
          className={useSlider ? accentBtn : ghostBtn}
          aria-label={useSlider ? 'Disable sliders' : 'Enable sliders'}
          aria-pressed={useSlider}
        >
          <Sliders className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">
            {useSlider ? 'Sliders On' : 'Sliders'}
          </span>
        </button>
      )}

      {/* Reset */}
      {onReset && (
        <button onClick={onReset} className={ghostBtn} aria-label="Reset all values">
          <RefreshCw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      )}

      {/* Desktop group — secondary actions */}
      <div className="hidden md:flex items-center gap-2">
        {onExport && (
          <button onClick={() => onExport('print')} className={ghostBtn} aria-label="Print results">
            <Printer className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            Print
          </button>
        )}
        {showCSV && onExport && (
          <button onClick={() => onExport('csv')} className={ghostBtn} aria-label="Export results as CSV">
            <FileText className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            CSV
          </button>
        )}
        {onShare && (
          <button onClick={onShare} className={ghostBtn} aria-label={shareCopied ? 'Link copied to clipboard' : 'Share calculator link'}>
            {shareCopied ? (
              <Check className="w-3.5 h-3.5 shrink-0 text-green-500" aria-hidden="true" />
            ) : (
              <Share2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            )}
            {shareCopied ? 'Copied' : 'Share'}
          </button>
        )}
        {onCopyResult && (
          <button onClick={onCopyResult} className={ghostBtn} aria-label={resultCopied ? 'Result copied to clipboard' : 'Copy result to clipboard'}>
            {resultCopied ? (
              <Check className="w-3.5 h-3.5 shrink-0 text-green-500" aria-hidden="true" />
            ) : (
              <Copy className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            )}
            {resultCopied ? 'Copied' : copyResultText}
          </button>
        )}
        {modeLevel != null && modeLevel >= 3 && tierFeatures?.comparison && onSaveScenario && (
          <button onClick={onSaveScenario} className={ghostBtn} aria-label="Save current scenario">
            <Plus className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            Save
          </button>
        )}
        {modeLevel != null && modeLevel >= 3 && tierFeatures?.comparison && onToggleBatch && (
          <button
            onClick={() => onToggleBatch(!showBatch)}
            className={showBatch ? accentBtn : ghostBtn}
            aria-label={showBatch ? 'Close batch comparison' : 'Open batch comparison'}
            aria-pressed={showBatch}
          >
            <Layers className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            Batch
          </button>
        )}
        {shareButtons}
        {embedWidget}
        {citationGenerator}
        {extraActions}
      </div>

      {/* Mobile dropdown */}
      <div className="relative md:hidden" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((o) => !o)}
          className={ghostBtn}
          aria-label="More actions"
          aria-expanded={dropdownOpen}
          aria-haspopup="menu"
        >
          <MoreHorizontal className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>More</span>
        </button>

        {dropdownOpen && (
          <div className="absolute bottom-full right-0 mb-2 z-50 flex flex-col gap-1 min-w-[160px] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 shadow-lg" role="menu">
            {onExport && (
              <button
                onClick={() => {
                  onExport('print')
                  setDropdownOpen(false)
                }}
                className={ghostBtn}
                aria-label="Print results"
                role="menuitem"
              >
                <Printer className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                Print
              </button>
            )}
            {showCSV && onExport && (
              <button
                onClick={() => {
                  onExport('csv')
                  setDropdownOpen(false)
                }}
                className={ghostBtn}
                aria-label="Export results as CSV"
                role="menuitem"
              >
                <FileText className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                CSV
              </button>
            )}
            {onShare && (
              <button
                onClick={() => {
                  onShare()
                  setDropdownOpen(false)
                }}
                className={ghostBtn}
                aria-label={shareCopied ? 'Link copied to clipboard' : 'Share calculator link'}
                role="menuitem"
              >
                {shareCopied ? (
                  <Check className="w-3.5 h-3.5 shrink-0 text-green-500" aria-hidden="true" />
                ) : (
                  <Share2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                )}
                {shareCopied ? 'Copied' : 'Share'}
              </button>
            )}
            {onCopyResult && (
              <button
                onClick={() => {
                  onCopyResult()
                  setDropdownOpen(false)
                }}
                className={ghostBtn}
                aria-label={resultCopied ? 'Result copied to clipboard' : 'Copy result to clipboard'}
                role="menuitem"
              >
                {resultCopied ? (
                  <Check className="w-3.5 h-3.5 shrink-0 text-green-500" aria-hidden="true" />
                ) : (
                  <Copy className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                )}
                {resultCopied ? 'Copied' : copyResultText}
              </button>
            )}
            {modeLevel != null && modeLevel >= 3 && tierFeatures?.comparison && onSaveScenario && (
              <button
                onClick={() => {
                  onSaveScenario()
                  setDropdownOpen(false)
                }}
                className={ghostBtn}
                aria-label="Save current scenario"
                role="menuitem"
              >
                <Plus className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                Save
              </button>
            )}
            {modeLevel != null && modeLevel >= 3 && tierFeatures?.comparison && onToggleBatch && (
              <button
                onClick={() => {
                  onToggleBatch(!showBatch)
                  setDropdownOpen(false)
                }}
                className={showBatch ? accentBtn : ghostBtn}
                aria-label={showBatch ? 'Close batch comparison' : 'Open batch comparison'}
                role="menuitem"
              >
                <Layers className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                Batch
              </button>
            )}
            {shareButtons}
            {embedWidget}
            {citationGenerator}
            {extraActions && (
              <div onClick={() => setDropdownOpen(false)}>{extraActions}</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}