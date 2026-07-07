const res = await fetch('https://router.bynara.id/v1/chat/completions', {
  method: 'POST',
  headers: { Authorization: 'Bearer sk-nry-UBghlDSlJGYA63LAAd0O6hqZnNCpkTohU0iAtVF0EUc', 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'mistral-medium-3-5',
    messages: [{ role: 'user', content: 'Translate to Arabic. Return JSON: {description: "translated"}. Input slug: test' }],
    temperature: 0.3,
    response_format: { type: 'json_object' },
  }),
})
const t = await res.text()
console.log('Status:', res.status)
console.log('Full body:', t.substring(0, 500))
