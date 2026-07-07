import type { ExtraFieldDef } from '.'
import type { useTranslations } from 'next-intl'

export function getLabelKey(name: string): string {
  return name.startsWith('extra_') ? name.slice(6) : name
}

export function localizeLabel(field: ExtraFieldDef, t: ReturnType<typeof useTranslations<'extraFields'>>): string {
  return t(getLabelKey(field.name)) || field.label
}

export function localizePlaceholder(field: ExtraFieldDef, t: ReturnType<typeof useTranslations<'extraFields'>>): string | undefined {
  if (!field.placeholder) return undefined
  return t(getLabelKey(field.name) + '_placeholder') || field.placeholder
}

export function localizeOption(field: ExtraFieldDef, value: string, t: ReturnType<typeof useTranslations<'extraFields'>>): string {
  const option = field.options?.find(o => o.value === value)
  if (!option) return value
  return t(getLabelKey(field.name) + '_' + value.replace(/\./g, '_')) || option.label
}

export function localizeExtraField(field: ExtraFieldDef, t: ReturnType<typeof useTranslations<'extraFields'>>, extraFieldValues?: Record<string, string>): ExtraFieldDef {
  const localized: ExtraFieldDef = {
    ...field,
    label: localizeLabel(field, t),
  }
  if (field.placeholder) {
    localized.placeholder = localizePlaceholder(field, t)
  }
  if (field.options && extraFieldValues) {
    localized.options = field.options.map(opt => ({
      ...opt,
      label: extraFieldValues[opt.value] || localizeOption(field, opt.value, t),
    }))
  } else if (field.options) {
    localized.options = field.options.map(opt => ({
      ...opt,
      label: localizeOption(field, opt.value, t),
    }))
  }
  return localized
}
