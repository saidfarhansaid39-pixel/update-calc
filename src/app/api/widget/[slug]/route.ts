import { NextResponse } from 'next/server'

const calculatorRegistry: Record<string, { title: string; description: string; category: string }> = {
  'bmi-calculator': { title: 'BMI Calculator', description: 'Calculate your Body Mass Index', category: 'health' },
  'calorie-calculator': { title: 'Calorie Calculator', description: 'Calculate your daily calorie needs', category: 'health' },
  'mortgage-calculator': { title: 'Mortgage Calculator', description: 'Calculate monthly mortgage payments', category: 'financial' },
  'loan-calculator': { title: 'Loan Calculator', description: 'Calculate loan payments', category: 'financial' },
  'investment-calculator': { title: 'Investment Calculator', description: 'Project investment growth', category: 'financial' },
  'retirement-calculator': { title: 'Retirement Calculator', description: 'Plan your retirement savings', category: 'financial' },
  'savings-calculator': { title: 'Savings Calculator', description: 'Calculate savings growth', category: 'financial' },
  'tip-calculator': { title: 'Tip Calculator', description: 'Calculate tip amounts', category: 'everyday' },
  'percentage-calculator': { title: 'Percentage Calculator', description: 'Calculate percentages', category: 'math' },
  'compound-interest-calculator': { title: 'Compound Interest Calculator', description: 'Calculate compound interest', category: 'financial' },
  'currency-calculator': { title: 'Currency Converter', description: 'Convert between currencies', category: 'conversion' },
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const calc = calculatorRegistry[slug]

  if (!calc) {
    return NextResponse.json({ error: 'Calculator not found' }, { status: 404 })
  }

  const baseUrl = 'https://www.jdcalc.com'
  const iframeSrc = `${baseUrl}/${calc.category}/${slug}?embed=true`
  const widgetHtml = `<div id="ac-widget-${slug}" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;background:#fff;width:100%;max-width:400px;margin:0 auto;">
  <div style="background:#1a56db;color:#fff;padding:10px 16px;font-size:14px;font-weight:600;display:flex;align-items:center;justify-content:space-between;">
    <span>${calc.title}</span>
    <a href="${baseUrl}/${calc.category}/${slug}" target="_blank" rel="noopener" style="color:#fff;text-decoration:none;font-size:11px;font-weight:400;opacity:0.8;">Open ↗</a>
  </div>
  <iframe src="${iframeSrc}" style="width:100%;border:none;min-height:420px;" scrolling="no" title="${calc.title}"></iframe>
  <div style="padding:8px 16px;font-size:10px;color:#9ca3af;text-align:center;border-top:1px solid #f3f4f6;">
    Powered by <a href="${baseUrl}" target="_blank" rel="noopener" style="color:#1a56db;text-decoration:none;">JDCALC.com</a>
  </div>
</div>`

  const scriptTag = `<script src="${baseUrl}/api/widget/${slug}/embed.js" data-calculator="${slug}" async></script>`

  const iframeTag = `<iframe src="${baseUrl}/api/widget/${slug}" width="100%" height="480" frameborder="0" scrolling="no" title="${calc.title}"></iframe>`

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${calc.title} Widget</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb; }
    .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
    h1 { font-size: 24px; color: #111827; margin-bottom: 8px; }
    p { color: #6b7280; font-size: 14px; line-height: 1.5; margin-bottom: 24px; }
    h2 { font-size: 18px; color: #111827; margin: 24px 0 12px; }
    .preview { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
    code { display: block; background: #1f2937; color: #e5e7eb; padding: 16px; border-radius: 8px; font-size: 13px; line-height: 1.5; overflow-x: auto; white-space: pre-wrap; word-break: break-all; margin-top: 8px; }
    .btn { display: inline-block; padding: 8px 16px; background: #1a56db; color: white; border: none; border-radius: 6px; font-size: 13px; cursor: pointer; margin-top: 8px; }
    .btn:hover { background: #0a1d4f; }
    .tabs { display: flex; gap: 4px; margin-bottom: 16px; }
    .tab { padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 13px; cursor: pointer; background: white; color: #374151; }
    .tab.active { background: #1a56db; color: white; border-color: #1a56db; }
    input, select { width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; margin-top: 4px; }
    label { font-size: 13px; font-weight: 500; color: #374151; display: block; margin-bottom: 12px; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${calc.title} — Embed Widget</h1>
    <p>Copy the embed code below to add this calculator to your website.</p>

    <div class="preview">
      <h2>Preview</h2>
      ${widgetHtml}
    </div>

    <h2>Embed Options</h2>
    <div class="row">
      <label>Width
        <input type="number" id="widget-width" value="100" min="200" max="1200" onchange="updateCode()" />%
      </label>
      <label>Height
        <input type="number" id="widget-height" value="480" min="300" max="1200" onchange="updateCode()" />px
      </label>
    </div>

    <h2>Embed Code</h2>
    <div class="tabs">
      <button class="tab active" id="tab-iframe" onclick="switchTab('iframe')">iframe</button>
      <button class="tab" id="tab-script" onclick="switchTab('script')">Script Tag</button>
    </div>

    <div id="code-iframe">
      <code id="embed-code-iframe">${iframeTag}</code>
      <button class="btn" onclick="copyCode('iframe')">Copy iframe Code</button>
    </div>
    <div id="code-script" style="display:none;">
      <code id="embed-code-script">${scriptTag}</code>
      <button class="btn" onclick="copyCode('script')">Copy Script Tag</button>
    </div>
  </div>

  <script>
    function switchTab(tab) {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'))
      document.getElementById('tab-' + tab).classList.add('active')
      document.getElementById('code-iframe').style.display = tab === 'iframe' ? 'block' : 'none'
      document.getElementById('code-script').style.display = tab === 'script' ? 'block' : 'none'
    }

    function updateCode() {
      var width = document.getElementById('widget-width').value || '100'
      var height = document.getElementById('widget-height').value || '480'
      var iframeCode = '<iframe src="${baseUrl}/api/widget/${slug}" width="' + (width.indexOf('%') > -1 ? width : width + '%') + '" height="' + height + '" frameborder="0" scrolling="no" title="${calc.title}"></iframe>'
      document.getElementById('embed-code-iframe').textContent = iframeCode
    }

    function copyCode(type) {
      var el = document.getElementById('embed-code-' + type)
      navigator.clipboard.writeText(el.textContent).then(function() {
        var btn = el.nextElementSibling
        var orig = btn.textContent
        btn.textContent = 'Copied!'
        setTimeout(function() { btn.textContent = orig }, 2000)
      })
    }
  </script>
</body>
</html>`

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
