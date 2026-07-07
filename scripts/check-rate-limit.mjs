const key = process.env.GROQ_API_KEY

// Check what the rate limit headers say
const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: 'hi' }],
  }),
})
console.log('Status:', res.status)
// Print all headers
for (const [k, v] of res.headers) {
  if (k.includes('ratelimit') || k.includes('rate') || k.includes('x-')) {
    console.log(`  ${k}: ${v}`)
  }
}
