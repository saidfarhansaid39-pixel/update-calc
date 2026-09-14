import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, category, description, email } = body

    if (!name || !category || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log('[SuggestCalculator]', { name, category, description, email })

    return NextResponse.json({ success: true, message: 'Suggestion received' })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
