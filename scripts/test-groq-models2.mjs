const key = process.env.GROQ_API_KEY

for (const model of ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile']) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: 'Return JSON: {ok:true}' }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
  })
  console.log(`${model}: ${res.status}`)
  for (const [k, v] of res.headers) {
    if (k.includes('ratelimit') || k.includes('x-ratelimit')) {
      console.log(`  ${k}: ${v}`)
    }
  }
}
