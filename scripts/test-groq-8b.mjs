const key = process.env.GROQ_API_KEY
const entries = Array.from({length: 10}, (_, i) => ({slug: 'test-'+i, description: 'Free Inches to CM Converter - Convert inches to centimeters instantly.'}))
const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: 'Translate to Arabic. Return JSON: ' + JSON.stringify(entries) }],
    temperature: 0.3,
    response_format: { type: 'json_object' },
  }),
})
const t = await res.text()
console.log('Status:', res.status, 'Body:', t.substring(0, 500))
