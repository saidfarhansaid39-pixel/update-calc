import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const srcDir = join(__dirname, '..', 'src', 'components', 'hub-calculators')

function splitFile(fileName) {
  const content = readFileSync(join(srcDir, fileName), 'utf-8')
  const lines = content.split(/\r?\n/)
  const baseName = fileName.replace(/\.tsx?$/, '').replace('Generic', '').replace('Calculator', '')
  const dirName = baseName.charAt(0).toLowerCase() + baseName.slice(1)
  const outDir = join(srcDir, dirName)
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

  // Detect pattern: individual-assignment (calcDefs['slug'] = {) vs object-literal ('slug': { ... })
  const hasIndividualAssignments = content.includes("calcDefs['") && !content.includes("calcDefs['") === false
  const individualPattern = content.match(/^calcDefs\['/m) !== null

  const blocks = []
  const aliases = []

  if (individualPattern) {
    // Pattern 1: calcDefs['slug'] = { ... }
    let i = 0
    while (i < lines.length) {
      const line = lines[i]
      const defMatch = line.match(/^calcDefs\['([^']+)'\]\s*=\s*\{$/)
      const aliasMatch = line.match(/^calcDefs\['([^']+)'\]\s*=\s*calcDefs\[(['"][^'"]+['"])\]$/)
      if (defMatch) {
        const slug = defMatch[1]
        const blockLines = [line]
        let braceDepth = 1
        while (i + 1 < lines.length && braceDepth > 0) {
          i++
          const l = lines[i]
          blockLines.push(l)
          for (const ch of l) {
            if (ch === '{') braceDepth++
            else if (ch === '}') braceDepth--
          }
        }
        const blockContent = blockLines.join('\n')
        const objContent = blockContent.replace(/^calcDefs\[[^\]]+\]\s*=\s*/, '')
        blocks.push({ slug, objContent })
      } else if (aliasMatch) {
        aliases.push({ slug: aliasMatch[1], source: aliasMatch[2] })
      }
      i++
    }
  } else {
    // Pattern 2: const calcDefs = { 'slug': { ... }, ... }
    // Find the start and end of the calcDefs object
    let startIdx = -1, endIdx = -1
    for (let i = 0; i < lines.length; i++) {
      if (/^const calcDefs/.test(lines[i]) && /\{/.test(lines[i])) {
        // Could be 'const calcDefs: Record<string, CalcDef> = {' or similar
        // Find the opening brace — might be on the same line
        let bracePos = lines[i].indexOf('{')
        if (bracePos === -1) {
          // Brace is on next line
          startIdx = i + 1
        } else {
          startIdx = i
        }
        break
      }
    }
    if (startIdx === -1) {
      console.log(`⚠️  No calcDefs object found in ${fileName}, skipping`)
      return
    }

    // Find closing brace by counting
    let braceDepth = 0
    for (let i = startIdx; i < lines.length; i++) {
      const l = lines[i]
      // Count brace depth starting from the opening brace
      for (const ch of l) {
        if (ch === '{') braceDepth++
        else if (ch === '}') braceDepth--
      }
      if (braceDepth <= 0) {
        endIdx = i
        break
      }
    }

    if (endIdx === -1) {
      console.log(`⚠️  Could not find closing brace for calcDefs in ${fileName}`)
      return
    }

    // Now extract individual entries: ['slug']: { ... },
    const objLines = lines.slice(startIdx, endIdx + 1)
    let i = 0
    while (i < objLines.length) {
      const l = objLines[i]
      const entryMatch = l.match(/^\s*'([^']+)'\s*:\s*\{$/)
      if (entryMatch) {
        const slug = entryMatch[1]
        const entryBlock = [l]
        let depth = 1
        while (i + 1 < objLines.length && depth > 0) {
          i++
          const nl = objLines[i]
          entryBlock.push(nl)
          for (const ch of nl) {
            if (ch === '{') depth++
            else if (ch === '}') depth--
          }
        }
        const entryContent = entryBlock.join('\n')
        // Strip the "'slug': prefix" and trailing comma
        let objContent = entryContent.replace(/^\s*'[^']+'\s*:\s*/, '')
        // Remove trailing comma on the last line
        objContent = objContent.replace(/,\s*\n\s*\}\s*$/, '\n}')
        blocks.push({ slug, objContent })
      }
      i++
    }
  }

  // Write individual files
  for (const { slug, objContent } of blocks) {
    const code = `import { z } from 'zod'\nimport type { CalcDef } from '../../../lib/generic-fallback'\n\nconst calcDef: CalcDef = ${objContent}\n\nexport default calcDef\n`
    writeFileSync(join(outDir, `${slug}.ts`), code, 'utf-8')
  }

  // Generate index.ts (no .ts extension in imports)
  const indexLines = []
  for (const { slug } of blocks) {
    const varName = `d_${slug.replace(/[^a-zA-Z0-9_]/g, '_')}`
    indexLines.push(`import ${varName} from './${slug}'`)
  }
  indexLines.push('')
  indexLines.push("import type { CalcDef } from '../../../lib/generic-fallback'")
  indexLines.push('')
  indexLines.push('export const calcDefs: Record<string, CalcDef> = {')
  for (const { slug } of blocks) {
    const varName = `d_${slug.replace(/[^a-zA-Z0-9_]/g, '_')}`
    indexLines.push(`  '${slug}': ${varName},`)
  }
  indexLines.push('}')
  for (const { slug, source } of aliases) {
    indexLines.push(`calcDefs['${slug}'] = calcDefs[${source}]`)
  }
  indexLines.push('')

  writeFileSync(join(outDir, 'index.ts'), indexLines.join('\n'), 'utf-8')
  console.log(`✅ Split ${fileName}: ${blocks.length} definitions + ${aliases.length} aliases → ${dirName}/`)
}

// Files to split (in order, largest first)
const files = [
  'GenericHealthCalculator.tsx',
  'GenericMathCalculator.tsx',
  'GenericFinancialCalculator.tsx',
  'GenericStatisticsCalculator.tsx',
  'GenericBiologyCalculator.tsx',
  'GenericChemistryCalculator.tsx',
  'GenericPhysicsCalculator.tsx',
  'GenericSportsCalculator.tsx',
  'GenericFoodCalculator.tsx',
  'GenericEcologyCalculator.tsx',
]

for (const f of files) splitFile(f)
