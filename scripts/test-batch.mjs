const key = process.env.GROQ_API_KEY

// Test with 10 entries in a batch
const entries = Array.from({length: 10}, (_, i) => ({slug: `test-${i}`, description: `Free Inches to CM Converter - Convert inches to centimeters instantly. Precision tool for accurate measurements.`}))

const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: `Translate these to Arabic. Return JSON. ${JSON.stringify(entries)}` }],
    temperature: 0.3,
    response_format: { type: 'json_object' },
  }),
})
const t = await res.text()
console.log('Status:', res.status)
console.log('Time:', Date.now() - start, 'ms')
const j = JSON.parse(t)
console.log('Tokens:', j.usage?.total_tokens)
