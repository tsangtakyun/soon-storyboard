import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyvOfWRFXarx1OXXz-CTLVz3y7_oWctRejaG-S5eXh6JIxYhmrLv9DyWl3WA9HZadY1YA/exec'
const SECRET = 'soon-bbo-2026'

export async function POST(request: NextRequest) {
  try {
    const { docId } = await request.json()
    const url = `${APPS_SCRIPT_URL}?action=read&docId=${encodeURIComponent(docId)}&secret=${SECRET}`
    const res = await fetch(url, { method: 'GET', redirect: 'follow' })
    const text = await res.text()
    let data
    try {
      data = JSON.parse(text)
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('Cannot parse response')
      data = JSON.parse(jsonMatch[0])
    }
    if (data.error) throw new Error(data.error)
    return NextResponse.json({ success: true, content: data.content })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
