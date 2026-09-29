// Sample registry exampleInput/exampleResult values for '$' content.
const reg = await import('@calcuniverse/calculator-registry')
const all = reg.getAllCalculators ? reg.getAllCalculators() : (reg.registry || [])
let dollar = 0, strVals = 0, total = 0
const samples = []
for (const c of all) {
  for (const obj of [c.exampleInput, c.exampleResult]) {
    if (!obj || typeof obj !== 'object') continue
    for (const [k, v] of Object.entries(obj)) {
      total++
      if (typeof v === 'string') {
        strVals++
        if (v.includes('$')) {
          dollar++
          if (samples.length < 15) samples.push(`${c.slug} ${k}: ${JSON.stringify(v)}`)
        }
      }
    }
  }
}
console.log(`values: ${total}, string values: ${strVals}, containing $: ${dollar}`)
samples.forEach(s => console.log('  ' + s))
