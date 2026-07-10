import { getTemplateContent } from './hub-template-content'

export function getMetadataDescription(
  calcName: string,
  calcDescription: string | undefined,
  category: string,
): string {
  if (calcDescription && calcDescription.length > 10) {
    return calcDescription
  }
  const template = getTemplateContent(category, calcName)
  return template.description || `Free online ${calcName} — calculate instantly with accurate results.`
}
