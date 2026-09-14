'use client'

import React, { useMemo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { cn } from '@/lib/utils'

interface DependentFieldProps {
  name: string
  label: string
  dependsOn: string | string[]
  condition: 'equals' | 'notEquals' | 'includes' | 'truthy' | 'falsy' | ((values: unknown[]) => boolean)
  value?: unknown | unknown[]
  children: React.ReactNode
  fallback?: React.ReactNode
  animate?: boolean
}

export function DependentField({
  name,
  label,
  dependsOn,
  condition,
  value,
  children,
  fallback,
  animate = true,
}: DependentFieldProps) {
  const dependsOnArray = Array.isArray(dependsOn) ? dependsOn : [dependsOn]
  const watchedValues = useWatch({ name: dependsOnArray as any, defaultValue: [] as string[] }) as string[]

  const shouldShow = useMemo(() => {
    const values = dependsOnArray.map((dep, i) => watchedValues[i])
    
    if (typeof condition === 'function') {
      return condition(values)
    }

    switch (condition) {
      case 'equals':
        return values.every((v, i) => v === (Array.isArray(value) ? value[i] : value))
      case 'notEquals':
        return values.every((v, i) => v !== (Array.isArray(value) ? value[i] : value))
      case 'includes':
        return values.some((v, i) => {
          const checkVal = Array.isArray(value) ? value[i] : value
          return Array.isArray(v) ? v.includes(checkVal) : v === checkVal
        })
      case 'truthy':
        return values.every(v => Boolean(v))
      case 'falsy':
        return values.every(v => !Boolean(v))
      default:
        return true
    }
  }, [dependsOnArray, condition, value, watchedValues])

  if (!shouldShow) {
    return fallback ? <>{fallback}</> : null
  }

  return (
    <div
      className={cn(
        'transition-all duration-200',
        animate && 'animate-fade-in'
      )}
    >
      {children}
    </div>
  )
}

interface ConditionalRenderProps {
  watch: string | string[]
  equals?: unknown
  notEquals?: unknown
  includes?: unknown
  truthy?: boolean
  falsy?: boolean
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ConditionalRender({ 
  watch, 
  equals, 
  notEquals, 
  includes, 
  truthy, 
  falsy, 
  children, 
  fallback 
}: ConditionalRenderProps) {
  const watchedValues = useWatch({ 
    name: (Array.isArray(watch) ? watch : [watch]) as any, 
    defaultValue: [] as string[] 
  }) as string[]

  const values = Array.isArray(watch) ? watchedValues : [watchedValues[0]]

  const shouldShow = (() => {
    if (equals !== undefined) return values.every(v => v === equals)
    if (notEquals !== undefined) return values.every(v => v !== notEquals)
    if (includes !== undefined) return values.some(v => 
      Array.isArray(v) ? v.includes(includes) : v === includes
    )
    if (truthy) return values.every(v => Boolean(v))
    if (falsy) return values.every(v => !Boolean(v))
    return true
  })()

  return shouldShow ? <>{children}</> : fallback ? <>{fallback}</> : null
}

interface SmartDefaultsProps {
  name: string
  getDefaults: (context: Record<string, unknown>) => Record<string, unknown>
  contextFields: string[]
  children: (defaults: Record<string, unknown>) => React.ReactNode
}

export function SmartDefaults({ 
  name, 
  getDefaults, 
  contextFields, 
  children 
}: SmartDefaultsProps) {
  const context = useWatch({ name: contextFields as any, defaultValue: {} as Record<string, string> }) as Record<string, string>
  const defaults = useMemo(() => getDefaults(context as Record<string, unknown>), [context, getDefaults])
  
  return <>{children(defaults)}</>
}