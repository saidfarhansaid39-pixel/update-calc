const key = process.env.GROQ_API_KEY

for (const size of [20, 30, 40, 50]) {
  const entries = Array.from({length: size}, (_, i) => ({slug: 'test-'+i, description: 'Free Inches to CM Converter - Convert inches to centimeters instantly.'}))
  const start = Date.now()
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: 'Translate to Arabic. Return JSON. ' + JSON.stringify(entries) }],
      temperature: 0.3,
    }),
  })
  const t = await res.text()
  console.log(`Size ${size}: ${res.status} in ${Date.now()-start}ms`)
  if (res.status !== 200) console.log('  Error:', t.substring(0, 200))
}
