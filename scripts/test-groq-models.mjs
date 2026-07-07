const models = ['llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it', 'llama-3.3-70b-versatile']
const key = process.env.GROQ_API_KEY

for (const model of models) {
  const start = Date.now()
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: 'Translate to French: Return JSON: {description: "translated"}. Input: hello' }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
  })
  const t = await res.text()
  const ms = Date.now() - start
  const ok = res.status === 200
  console.log(`${model}: ${res.status} in ${ms}ms${ok ? ' ✅' : ' ❌'}`)
}
