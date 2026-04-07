'use client'

import { useState } from 'react'
import Image from 'next/image'
import { STEPS, Step } from './data/shots'

type Selections = { [stepId: string]: string | string[] }
type Scripts = { [stepId: string]: string }

const cr = '#F5F2EC'
const ink = '#1a1a18'
const mu = '#8a8780'
const br = '#d8d4cc'
const hv = '#eae6de'

export default function StoryboardPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selections, setSelections] = useState<Selections>({})
  const [scripts, setScripts] = useState<Scripts>({})
  const [projectName, setProjectName] = useState('')
  const [generating, setGenerating] = useState(false)
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null)
  const [audioEnabled, setAudioEnabled] = useState<string | null>(null)
  const [genStatus, setGenStatus] = useState('')
  const [docLink, setDocLink] = useState('')
  const [importing, setImporting] = useState(false)
  const [importStatus, setImportStatus] = useState('')

  const step = STEPS[currentStep]

  function isDone(s: Step) {
    const sel = selections[s.id]
    if (s.type === 'single') return typeof sel === 'string' && sel !== ''
    return Array.isArray(sel) && sel.length > 0
  }

  function doneCount() {
    return STEPS.filter(isDone).length
  }

  function pickSingle(stepId: string, id: string) {
    setSelections(prev => ({ ...prev, [stepId]: id }))
  }

  function pickMulti(stepId: string, id: string) {
    setSelections(prev => {
      const current = (prev[stepId] as string[]) || []
      const exists = current.includes(id)
      return {
        ...prev,
        [stepId]: exists ? current.filter(item => item !== id) : [...current, id],
      }
    })
  }

  function getLabels(s: Step) {
    const sel = selections[s.id]
    if (s.type === 'single') {
      const option = s.options.find(o => o.id === sel)
      return option ? [option.name] : ['（未選）']
    }
    if (Array.isArray(sel) && sel.length > 0) {
      return sel.map(id => s.options.find(o => o.id === id)?.name ?? id)
    }
    return ['（未選）']
  }

  function optionSelected(s: Step, optionId: string) {
    const sel = selections[s.id]
    if (s.type === 'single') return sel === optionId
    return Array.isArray(sel) && sel.includes(optionId)
  }

  async function importFromDoc() {
    if (!docLink) return
    setImporting(true)
    setImportStatus('讀取 Google Doc 中...')
    try {
      const match = docLink.match(/\/d\/([a-zA-Z0-9_-]+)/)
      if (!match) throw new Error('無效嘅 Google Doc 連結')
      const docId = match[1]

      const res = await fetch('/api/read-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      setImportStatus('AI 分析 Script 中...')

      const analyseRes = await fetch('/api/analyse-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: data.content }),
      })
      const analysed = await analyseRes.json()
      if (analysed.error) throw new Error(analysed.error)

      setScripts({
        opening: analysed.opening || '',
        background: analysed.background || '',
        transition: analysed.transition || '',
        main: analysed.main || '',
        ending: analysed.ending || '',
      })
      setImportStatus('✓ Script 已匯入，可以開始揀分鏡')
    } catch (err: any) {
      setImportStatus('匯入失敗：' + err.message)
    }
    setImporting(false)
  }

  async function generateDocx() {
    setGenerating(true)
    setGenStatus('生成中…')
    try {
      const docx = await import('docx')
      const { AlignmentType, BorderStyle, Document, Packer, Paragraph, TextRun } = docx
      const td = new Date()
      const ds = `${td.getFullYear()}.${String(td.getMonth() + 1).padStart(2, '0')}.${String(td.getDate()).padStart(2, '0')}`
      const proj = projectName || 'SOON 分鏡指引'
      const children: InstanceType<typeof Paragraph>[] = []

      children.push(
        new Paragraph({
          children: [new TextRun({ text: 'SOON · AI MEDIA CONTENT CREATION', font: 'Arial', size: 18, color: '8a8780' })],
          spacing: { after: 100 },
        })
      )
      children.push(
        new Paragraph({
          children: [new TextRun({ text: proj, font: 'Georgia', size: 52 })],
          spacing: { after: 80 },
        })
      )
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `分鏡指引  /  ${ds}`, font: 'Arial', size: 20, color: '8a8780', italics: true })],
          spacing: { after: 480 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'd8d4cc', space: 1 } },
        })
      )

      STEPS.forEach(s => {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: `${s.num}  /  ${s.name}  /  ${s.nameEm}`, font: 'Arial', size: 18, color: '8a8780' })],
            spacing: { before: 400, after: 100 },
          })
        )

        const script = scripts[s.id] || ''
        children.push(
          new Paragraph({
            children: [new TextRun({ text: script || '（未填入 Script）', font: 'Georgia', size: 26, italics: true, color: script ? '1a1a18' : 'aaa89e' })],
            spacing: { after: 140 },
            indent: { left: 360 },
            border: { left: { style: BorderStyle.SINGLE, size: 8, color: 'd8d4cc', space: 1 } },
          })
        )

        children.push(
          new Paragraph({
            children: [new TextRun({ text: '鏡頭選擇', font: 'Arial', size: 18, color: '8a8780' })],
            spacing: { after: 70 },
          })
        )

        getLabels(s).forEach(label => {
          const option = s.options.find(o => o.name === label)
          const descText = option?.description ? ` — ${option.description}` : ''
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: `· ${label}`, font: 'Arial', size: 22, bold: true }),
                new TextRun({ text: descText, font: 'Arial', size: 22, color: '888888' }),
              ],
              spacing: { after: 50 },
              indent: { left: 240 },
            })
          )
        })

        if (s.id !== 'ending') {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: ' ', size: 20 })],
              spacing: { after: 0 },
              border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: 'd8d4cc', space: 1 } },
            })
          )
        }
      })

      children.push(
        new Paragraph({
          children: [new TextRun({ text: `生成於 ${ds} · SOON Internal System`, font: 'Arial', size: 18, color: 'aaa89e', italics: true })],
          spacing: { before: 600 },
          alignment: AlignmentType.CENTER,
        })
      )

      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                size: { width: 11906, height: 16838 },
                margin: { top: 1800, right: 1800, bottom: 1800, left: 1800 },
              },
            },
            children,
          },
        ],
      })

      const blob = await Packer.toBlob(doc)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${proj}.docx`
      a.click()
      URL.revokeObjectURL(url)
      setGenStatus('✓ 已下載，可直接上傳 Google Drive')
    } catch (error) {
      console.error(error)
      setGenStatus('生成失敗，請重試')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: cr, color: ink, fontFamily: 'Georgia, serif' }}>
      <header style={{ padding: '20px 24px 16px', borderBottom: `0.5px solid ${br}` }}>
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, letterSpacing: '0.1em', color: mu, marginBottom: 4 }}>SOON · AI MEDIA CONTENT CREATION</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 400, margin: 0 }}>分鏡指引 <em style={{ color: mu }}>/ Beta</em></h1>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: mu, margin: '6px 0 0' }}>左邊睇 script，中間揀鏡頭，右邊隨時檢查整體節奏。</p>
          </div>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: mu }}>{doneCount()} / {STEPS.length} steps 完成</div>
        </div>
      </header>

      <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '320px minmax(0, 1fr) 320px', gap: 20, alignItems: 'start' }}>
        <aside style={{ position: 'sticky', top: 20 }}>
          <div style={{ border: `0.5px solid ${br}`, background: hv, borderRadius: 8, padding: 16, marginBottom: 16 }}>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, letterSpacing: '0.1em', color: mu, marginBottom: 8 }}>IMPORT SCRIPT</p>
            <div style={{ display: 'grid', gap: 8 }}>
              <input
                value={docLink}
                onChange={e => setDocLink(e.target.value)}
                placeholder="貼入 Google Doc 連結..."
                style={{ width: '100%', fontFamily: 'Georgia, serif', fontSize: 13, background: 'transparent', border: `0.5px solid ${br}`, borderRadius: 4, padding: '9px 11px', outline: 'none', color: ink, boxSizing: 'border-box' }}
              />
              <button
                onClick={importFromDoc}
                disabled={importing}
                style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, padding: '10px 14px', background: ink, color: cr, border: 'none', borderRadius: 4, cursor: importing ? 'not-allowed' : 'pointer', opacity: importing ? 0.5 : 1 }}
              >
                {importing ? '匯入中...' : '匯入 Script →'}
              </button>
            </div>
            {importStatus && (
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: importStatus.startsWith('✓') ? '#4a8a5c' : mu, marginTop: 8, lineHeight: 1.5 }}>
                {importStatus}
              </p>
            )}
          </div>

          <div style={{ border: `0.5px solid ${br}`, background: '#fffdf9', borderRadius: 8, overflow: 'hidden' }}>
            {STEPS.map((s, index) => {
              const active = index === currentStep
              const done = isDone(s)
              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentStep(index)}
                  style={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: '46px 1fr auto',
                    gap: 10,
                    padding: '14px 14px',
                    border: 'none',
                    borderBottom: index < STEPS.length - 1 ? `0.5px solid ${br}` : 'none',
                    background: active ? hv : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: mu }}>{s.num}</span>
                  <span>
                    <span style={{ display: 'block', fontSize: 14, color: ink }}>{s.name}</span>
                    <span style={{ display: 'block', fontFamily: 'system-ui, sans-serif', fontSize: 10, color: mu }}>{s.nameEm}</span>
                  </span>
                  <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: done ? '#4a8a5c' : mu }}>{done ? '已選' : '未選'}</span>
                </button>
              )
            })}
          </div>
        </aside>

        <main>
          <div style={{ marginBottom: 18 }}>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, letterSpacing: '0.1em', color: mu, marginBottom: 6 }}>{step.num} / 05</p>
            <h2 style={{ fontSize: 22, fontWeight: 400, margin: '0 0 8px' }}>{step.name} <em style={{ color: mu }}>/ {step.nameEm}</em></h2>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: mu, margin: 0 }}>{step.note}</p>
          </div>

          <section style={{ border: `0.5px solid ${br}`, borderRadius: 8, padding: 16, background: '#fffdf9', marginBottom: 18 }}>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, letterSpacing: '0.1em', color: mu, marginBottom: 8 }}>SCRIPT SECTION</p>
            <textarea
              value={scripts[step.id] || ''}
              onChange={e => setScripts(prev => ({ ...prev, [step.id]: e.target.value }))}
              placeholder={step.placeholder}
              rows={6}
              style={{ width: '100%', fontFamily: 'Georgia, serif', fontSize: 15, color: ink, background: 'transparent', border: `0.5px solid ${br}`, borderRadius: 4, padding: '10px 12px', resize: 'vertical', outline: 'none', lineHeight: 1.7, boxSizing: 'border-box' }}
            />
          </section>

          <section>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, letterSpacing: '0.1em', color: mu, marginBottom: 12 }}>SHOT OPTIONS</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
              {step.options.map(option => {
                const selected = optionSelected(step, option.id)
                return (
                  <button
                    key={option.id}
                    onClick={() => (step.type === 'single' ? pickSingle(step.id, option.id) : pickMulti(step.id, option.id))}
                    style={{
                      textAlign: 'left',
                      border: `0.5px solid ${selected ? ink : br}`,
                      borderRadius: 8,
                      padding: 10,
                      background: selected ? hv : '#fffdf9',
                      cursor: 'pointer',
                    }}
                  >
                    {option.video ? (
                      <div
                        style={{ position: 'relative', width: '100%', aspectRatio: '9/16', marginBottom: 8, borderRadius: 6, overflow: 'hidden', background: '#000' }}
                        onMouseEnter={() => {
                          setHoveredVideo(option.id)
                          setAudioEnabled(prev => (prev === option.id ? prev : null))
                        }}
                        onMouseLeave={() => setHoveredVideo(null)}
                      >
                        <video
                          ref={el => {
                            if (el) {
                              hoveredVideo === option.id ? el.play() : el.pause()
                            }
                          }}
                          src={option.video}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          muted={audioEnabled !== option.id}
                          loop
                          playsInline
                        />
                        {hoveredVideo === option.id && (
                          <button
                            onClick={e => {
                              e.stopPropagation()
                              setAudioEnabled(prev => (prev === option.id ? null : option.id))
                            }}
                            style={{ position: 'absolute', bottom: 6, right: 6, background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: 13 }}
                          >
                            {audioEnabled === option.id ? '🔊' : '🔇'}
                          </button>
                        )}
                        {hoveredVideo !== option.id && (
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.15)' }}>
                            <span style={{ fontSize: 20, opacity: 0.8 }}>▶</span>
                          </div>
                        )}
                      </div>
                    ) : option.img ? (
                      <div style={{ position: 'relative', width: '100%', aspectRatio: '9/16', marginBottom: 8, borderRadius: 6, overflow: 'hidden' }}>
                        <Image src={option.img} alt={option.name} fill style={{ objectFit: 'cover' }} sizes="240px" />
                      </div>
                    ) : (
                      <div style={{ width: '100%', aspectRatio: '9/16', marginBottom: 8, borderRadius: 6, background: hv, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12, boxSizing: 'border-box' }}>
                        <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: mu, textAlign: 'center', lineHeight: 1.5 }}>暫未有示範片
                          <br />先按描述揀鏡頭
                        </span>
                      </div>
                    )}
                    <p style={{ fontSize: 13, fontWeight: 500, color: ink, margin: '0 0 4px' }}>{option.name}</p>
                    <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, color: mu, lineHeight: 1.5, margin: 0 }}>{option.description}</p>
                    <div style={{ marginTop: 8, fontFamily: 'system-ui, sans-serif', fontSize: 11, color: selected ? ink : mu }}>
                      {selected ? '✓ 已加入' : step.type === 'single' ? '選擇這個拍法' : '加入這個拍法'}
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        </main>

        <aside style={{ position: 'sticky', top: 20 }}>
          <div style={{ border: `0.5px solid ${br}`, borderRadius: 8, background: '#fffdf9', padding: 16, marginBottom: 16 }}>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, letterSpacing: '0.1em', color: mu, marginBottom: 12 }}>LIVE SUMMARY</p>
            <div style={{ display: 'grid', gap: 12 }}>
              {STEPS.map(s => (
                <div key={s.id} style={{ paddingBottom: 10, borderBottom: `0.5px solid ${br}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 13 }}>{s.name}</span>
                    <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, color: isDone(s) ? '#4a8a5c' : mu }}>
                      {isDone(s) ? '已完成' : '未選'}
                    </span>
                  </div>
                  <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: mu, lineHeight: 1.5, margin: 0 }}>{getLabels(s).join(' / ')}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ border: `0.5px solid ${br}`, borderRadius: 8, background: hv, padding: 16 }}>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, letterSpacing: '0.1em', color: mu, marginBottom: 8 }}>EXPORT DOCX</p>
            <input
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              placeholder="例：產品開箱 — 分鏡指引"
              style={{ width: '100%', fontFamily: 'Georgia, serif', fontSize: 15, background: 'transparent', border: `0.5px solid ${br}`, borderRadius: 4, padding: '9px 11px', outline: 'none', color: ink, boxSizing: 'border-box', marginBottom: 8 }}
            />
            <button
              onClick={generateDocx}
              disabled={generating}
              style={{ width: '100%', fontFamily: 'system-ui, sans-serif', fontSize: 12, padding: '10px 16px', background: ink, color: cr, border: 'none', borderRadius: 4, cursor: 'pointer', opacity: generating ? 0.4 : 1 }}
            >
              {generating ? '生成中...' : '生成 .docx ↓'}
            </button>
            {genStatus && <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: mu, marginTop: 8, lineHeight: 1.5 }}>{genStatus}</p>}
          </div>
        </aside>
      </div>
    </div>
  )
}
