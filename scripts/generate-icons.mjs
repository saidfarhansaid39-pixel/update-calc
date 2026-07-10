/**
 * Generates PWA icon PNGs from public/favicon.svg.
 *
 * Usage:
 *   node scripts/generate-icons.mjs
 *
 * Requires sharp (npm i sharp) or uses a fallback SVG-to-PNG approach.
 * If sharp is unavailable, outputs SVG placeholders with instructions.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const ICONS_DIR = resolve(ROOT, 'public', 'icons')
const SVG_PATH = resolve(ROOT, 'public', 'favicon.svg')

const SIZES = [192, 512]

async function main() {
  mkdirSync(ICONS_DIR, { recursive: true })

  // Try sharp
  try {
    const sharp = (await import('sharp')).default
    const svgBuffer = readFileSync(SVG_PATH)

    for (const size of SIZES) {
      const outPath = resolve(ICONS_DIR, `icon-${size}.png`)
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outPath)
      console.log(`Generated ${outPath}`)
    }
    console.log('All icons generated successfully.')
    return
  } catch {
    // sharp not available — create minimal placeholder PNGs
    console.warn('sharp not available. Creating minimal placeholder PNGs.')
    console.warn('Install sharp: npm install sharp')
    console.warn('Then run: node scripts/generate-icons.mjs')
  }

  // Minimal valid 1x1 pixel transparent PNG (67 bytes)
  const MINI_PNG_BASE64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
  const pngBuffer = Buffer.from(MINI_PNG_BASE64, 'base64')

  for (const size of SIZES) {
    const outPath = resolve(ICONS_DIR, `icon-${size}.png`)
    writeFileSync(outPath, pngBuffer)
    console.log(`Created placeholder ${outPath} (1x1 transparent PNG — replace with real icon)`)
  }

  console.log('\nPlaceholder icons created. For production:')
  console.log('  npm install sharp && node scripts/generate-icons.mjs')
}

main().catch(console.error)
