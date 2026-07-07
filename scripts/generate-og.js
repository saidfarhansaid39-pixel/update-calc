const sharp = require('sharp')
const path = require('path')

async function main() {
  const width = 1200
  const height = 630

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a3a8a"/>
          <stop offset="100%" style="stop-color:#06b6d4"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bg)"/>
      <rect x="0" y="0" width="${width}" height="${height}" fill="rgba(0,0,0,0.15)"/>
      <text x="600" y="280" font-family="system-ui, -apple-system, sans-serif" font-size="72" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">JDCALC.com</text>
      <text x="600" y="360" font-family="system-ui, -apple-system, sans-serif" font-size="28" fill="rgba(255,255,255,0.85)" text-anchor="middle" dominant-baseline="middle">2,200+ Free Online Calculators</text>
      <rect x="450" y="410" width="300" height="2" rx="1" fill="rgba(255,255,255,0.4)"/>
      <text x="600" y="440" font-family="system-ui, -apple-system, sans-serif" font-size="18" fill="rgba(255,255,255,0.7)" text-anchor="middle" dominant-baseline="middle">Financial · Health · Math · Conversion &amp; more</text>
    </svg>
  `

  await sharp(Buffer.from(svg))
    .resize(width, height)
    .png()
    .toFile(path.join(__dirname, '..', 'public', 'og-image.png'))

  console.log(`Generated OG image: public/og-image.png`)
}

main().catch(console.error)
