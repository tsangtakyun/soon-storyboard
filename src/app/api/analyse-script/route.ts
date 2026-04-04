import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()
    const apiKey = process.env.ANTHROPIC_API_KEY!

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `以下係一份 IG Reel Script，請分析並提取以下5個部分，以 JSON 格式返回（只返回 JSON，唔好加其他文字）：

{
  "opening": "【Opening Hook】嘅完整內容",
  "background": "【背景 VO】嘅完整內容",
  "transition": "【轉場】嘅完整內容",
  "main": "【實測內容】嘅完整內容，包括所有實測項目",
  "ending": "【Ending】嘅完整內容"
}

重要：
- 每個 key 都必須有內容
- content 欄位係指【實測內容】部分，唔好遺漏
- 如果搵唔到某部分，填入「（未找到）」

Script 內容：
${content}`
        }],
      }),
    })

    const data = await res.json()
    const text = data.content?.[0]?.text || ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Cannot parse AI response')
    const parsed = JSON.parse(jsonMatch[0])
    return NextResponse.json(parsed)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
