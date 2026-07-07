const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: 'Translate this to Arabic. Return JSON: {description: "translated"}. Input: test calc' }],
    temperature: 0.3,
    response_format: { type: 'json_object' },
  }),
})
const t = await res.text()
console.log('Status:', res.status)
try {
  const j = JSON.parse(t)
  console.log('Model:', j.model)
  console.log('Content:', j.choices?.[0]?.message?.content?.substring(0, 200))
} catch(e) {
  console.log('Body:', t.substring(0, 500))
}
