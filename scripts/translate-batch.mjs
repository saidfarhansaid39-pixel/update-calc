import { readFileSync, writeFileSync, existsSync, appendFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OVERRIDES_DIR = join(__dirname, '..', 'src', 'i18n', 'calculator-overrides')
const LOCALES = ['es', 'fr', 'de', 'pt', 'ru', 'ar', 'hi', 'ja', 'zh-CN']
const LOCALE_NAMES = { es: 'Spanish', fr: 'French', de: 'German', pt: 'Portuguese', ru: 'Russian', ar: 'Arabic', hi: 'Hindi', ja: 'Japanese', 'zh-CN': 'Chinese (Simplified)' }

function readExistingOverrides(locale) {
  const path = join(OVERRIDES_DIR, `${locale}.json`)
  if (!existsSync(path)) return {}
  try { return JSON.parse(readFileSync(path, 'utf-8')) } catch { return {} }
}

const apiKey = process.env.GROQ_API_KEY
if (!apiKey) { console.error('GROQ_API_KEY not set'); process.exit(1) }
const apiUrl = 'https://api.groq.com/openai/v1'
const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'

const mode = process.argv[2] || 'submit'

if (mode === 'submit') {
  const { calculatorRegistry: allEntries } = await import('@calcuniverse/calculator-registry')
  const lines = []
  let count = 0
  for (const locale of LOCALES) {
    const existing = readExistingOverrides(locale)
    for (const entry of allEntries) {
      const ov = existing[entry.slug]
      if (ov && ov.title && !/^[\x00-\x7F]*$/.test(ov.title)) continue // already translated
      const prompt = `Translate the following calculator title and description to ${LOCALE_NAMES[locale] || locale}.
Return a JSON object: { "title": "<translated title>", "description": "<translated description>" }.
Keep proper nouns in English. For Arabic use Arabic script, Japanese/Chinese use natural phrasing.

Title: ${entry.title}
Description: ${entry.description}`
      lines.push(JSON.stringify({
        custom_id: `${locale}:${entry.slug}`,
        method: 'POST',
        url: '/v1/chat/completions',
        body: { model, messages: [{ role: 'system', content: 'You are a translation assistant. Respond only with valid JSON.' }, { role: 'user', content: prompt }], temperature: 0.3, response_format: { type: 'json_object' } }
      }))
      count++
    }
  }
  const jsonlPath = join(__dirname, 'batch-input.jsonl')
  writeFileSync(jsonlPath, lines.join('\n') + '\n')
  console.log(`📝 Wrote ${count} requests to ${jsonlPath}`)

  // Upload file
  const form = new FormData()
  form.append('file', new Blob([readFileSync(jsonlPath)]), 'batch-input.jsonl')
  form.append('purpose', 'batch')
  const up = await fetch(`${apiUrl}/files`, { method: 'POST', headers: { 'Authorization': `Bearer ${apiKey}` }, body: form })
  const upJson = await up.json()
  if (!up.ok) { console.error('Upload failed:', upJson); process.exit(1) }
  console.log(`📤 Uploaded file: ${upJson.id}`)

  const batch = await fetch(`${apiUrl}/batches`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ input_file_id: upJson.id, endpoint: '/v1/chat/completions', completion_window: '24h' })
  })
  const batchJson = await batch.json()
  if (!batch.ok) { console.error('Batch create failed:', batchJson); process.exit(1) }
  writeFileSync(join(__dirname, 'batch-id.txt'), batchJson.id)
  console.log(`✅ Batch created: ${batchJson.id}`)
  console.log(`   Check status: node scripts/translate-batch.mjs retrieve`)
}

else if (mode === 'retrieve') {
  if (!existsSync(join(__dirname, 'batch-id.txt'))) { console.error('No batch-id.txt found. Run submit first.'); process.exit(1) }
  const batchId = readFileSync(join(__dirname, 'batch-id.txt'), 'utf-8').trim()
  console.log(`🔍 Checking batch ${batchId}...`)

  let status = ''
  let outputFileId = ''
  for (let i = 0; i < 200; i++) {
    const r = await fetch(`${apiUrl}/batches/${batchId}`, { headers: { 'Authorization': `Bearer ${apiKey}` } })
    const j = await r.json()
    status = j.status
    outputFileId = j.output_file_id
    console.log(`   Status: ${status}${j.request_counts ? ' (' + JSON.stringify(j.request_counts) + ')' : ''}`)
    if (status === 'completed' || status === 'failed' || status === 'expired') break
    await new Promise(r => setTimeout(r, 30000))
  }

  if (status !== 'completed' || !outputFileId) { console.log('Batch not completed yet. Try again later.'); process.exit(0) }

  const dl = await fetch(`${apiUrl}/files/${outputFileId}/content`, { headers: { 'Authorization': `Bearer ${apiKey}` } })
  const text = await dl.text()
  const lines = text.trim().split('\n').filter(Boolean)
  console.log(`📥 Downloaded ${lines.length} result lines`)

  // Group by locale for merging
  const updates = {}
  for (const line of lines) {
    try {
      const r = JSON.parse(line)
      const [locale, slug] = r.custom_id.split(':')
      if (!r.response || r.response.status_code !== 200) continue
      const content = r.response.body?.choices?.[0]?.message?.content
      if (!content) continue
      const parsed = JSON.parse(content)
      if (!updates[locale]) updates[locale] = {}
      updates[locale][slug] = { title: parsed.title || '', description: parsed.description || '' }
    } catch (e) { console.error('Parse error for line:', e.message) }
  }

  for (const locale of Object.keys(updates)) {
    const path = join(OVERRIDES_DIR, `${locale}.json`)
    const existing = readExistingOverrides(locale)
    let n = 0
    for (const [slug, val] of Object.entries(updates[locale])) {
      if (val.title) { existing[slug] = { ...existing[slug], ...val }; n++ }
    }
    writeFileSync(path, JSON.stringify(existing, null, 2) + '\n')
    console.log(`✅ ${locale}: merged ${n} translations`)
  }
  console.log('\n🎉 Batch translation complete!')
}
