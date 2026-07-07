const res = await fetch('https://router.bynara.id/v1/chat/completions', {
  method: 'POST',
  headers: { Authorization: 'Bearer sk-nry-fveChT1VIKf4M3luNg3nOAx1wnIC0FBJBeBN36XtdSM', 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'mistral-medium-3-5',
    messages: [{ role: 'user', content: 'Translate to German. Return JSON: {description: "translated text"}. Input: {slug: "test-de", title: "Test", description: "Kostenloser Test text"}' }],
    temperature: 0.3,
    response_format: { type: 'json_object' },
  }),
})
const t = await res.text()
console.log('Status:', res.status)
console.log('Body:', t.substring(0, 500))
