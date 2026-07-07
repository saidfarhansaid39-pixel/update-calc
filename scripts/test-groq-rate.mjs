const key = process.env.GROQ_API_KEY

async function test(seq, delay) {
  console.log(`${seq}: waiting ${delay}ms, then requesting...`)
  if (delay > 0) await new Promise(r => setTimeout(r, delay))
  const start = Date.now()
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: `Request #${seq}. Return JSON: {ok:true}` }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
  })
  const ms = Date.now() - start
  console.log(`  #${seq}: ${res.status} in ${ms}ms${res.status===200?' ✅':res.status===429?' ❌':''}`)
  return res.status
}

// Test with increasing delays
let status
status = await test(1, 0)
status = await test(2, 2000)
status = await test(3, 4000)
if (status === 200) {
  status = await test(4, 3000)
} else {
  status = await test(4, 6000)
}
status = await test(5, 5000)
