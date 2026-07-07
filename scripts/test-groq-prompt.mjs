const key = process.env.GROQ_API_KEY

// Simulate the actual script's prompt
const localeName = 'Arabic'
const batch = Array.from({length: 20}, (_, i) => ({slug: 'test-'+i, description: 'Free Inches to CM Converter - Convert inches to centimeters instantly.'}))

const prompt = `Translate these calculator descriptions to ${localeName}. Return a JSON object where keys are slugs and values are {description: "translated description"}.

Guidelines:
- Natural, fluent ${localeName}
- Keep numbers, units, and technical terms intact
- Adapt to ${localeName} conventions
- For Arabic: natural Arabic script (RTL)
- For Japanese/Chinese: natural phrasing
- For Hindi: standard Hindi

${JSON.stringify(batch, null, 2)}`

console.log('Prompt tokens (estimated):', Math.round(prompt.length / 4))

const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  }),
})
const text = await res.text()
console.log('Status:', res.status)
if (res.status === 200) {
  const j = JSON.parse(text)
  console.log('Tokens:', j.usage?.total_tokens)
  for (const [k, v] of res.headers) {
    if (k.includes('ratelimit')) console.log(`  ${k}: ${v}`)
  }
} else {
  console.log('Error:', text.substring(0, 300))
}
