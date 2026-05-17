import { NextRequest, NextResponse } from 'next/server'
import { SupabaseClient, createClient } from '@supabase/supabase-js'

function getSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('missing supabase server env')
  }

  return createClient(url, key)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { user_id, project_name, topic, scripts, selections } = body

  if (!user_id) return NextResponse.json({ error: 'no user' }, { status: 401 })

  const supabase = getSupabase()
  const matchTopic = topic || project_name || 'Untitled Storyboard'

  const { data: existing, error: findError } = await supabase
    .from('storyboards')
    .select('id')
    .eq('user_id', user_id)
    .eq('topic', matchTopic)
    .maybeSingle()

  if (findError) return NextResponse.json({ error: findError }, { status: 500 })

  const payload = {
    user_id,
    project_name,
    topic: matchTopic,
    scripts,
    selections,
    updated_at: new Date().toISOString(),
  }

  const query = existing?.id
    ? supabase.from('storyboards').update(payload).eq('id', existing.id)
    : supabase.from('storyboards').insert(payload)

  const { data, error } = await query.select().single()

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ storyboard: data })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const user_id = searchParams.get('user_id')

  if (!user_id) return NextResponse.json({ error: 'no user' }, { status: 401 })

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('storyboards')
    .select('*')
    .eq('user_id', user_id)
    .order('updated_at', { ascending: false })
    .limit(20)

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ storyboards: data })
}
