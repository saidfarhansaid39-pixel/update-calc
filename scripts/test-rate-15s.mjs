const key = process.env.GROQ_API_KEY
const entries = Array.from({length: 20}, (_, i) => ({slug: 'test-'+i, description: 'Free Inches to CM Converter - Convert inches to centimeters instantly.'}))

for (let round = 0; round < 5; round++) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: 'Translate to Arabic. Return JSON. ' + JSON.stringify(entries) }],
      temperature: 0.3,
    }),
  })
  const j = await res.json()
  const remaining = res.headers.get('x-ratelimit-remaining-tokens')
  console.log(`#${round}: ${res.status} | Tokens used: ${j.usage?.total_tokens} | Remaining: ${remaining} | OK: ${res.status === 200}`)
  if (round < 4) await new Promise(r => setTimeout(r, 15000))
}
