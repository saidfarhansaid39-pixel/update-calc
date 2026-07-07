const key = process.env.GROQ_API_KEY
const entries = Array.from({length: 20}, (_, i) => ({slug: 'test-'+i, description: 'Free Inches to CM Converter - Convert inches to centimeters instantly.'}))

// Test 1
let res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: 'Translate to Arabic. Return JSON. ' + JSON.stringify(entries) }],
    temperature: 0.3,
  }),
})
let j = await res.json()
console.log('Request 1: Status', res.status, 'Tokens:', j.usage?.total_tokens)
for (const [k, v] of res.headers) {
  if (k.includes('ratelimit')) console.log(`  ${k}: ${v}`)
}

// Test 2 after 20s
console.log('\nWaiting 20s...')
await new Promise(r => setTimeout(r, 20000))

res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: 'Translate to Arabic. Return JSON. ' + JSON.stringify(entries) }],
    temperature: 0.3,
  }),
})
j = await res.json()
console.log('Request 2 (20s later): Status', res.status, 'Tokens:', j.usage?.total_tokens)
for (const [k, v] of res.headers) {
  if (k.includes('ratelimit')) console.log(`  ${k}: ${v}`)
}
