'use client'
import { useState } from 'react'
import { STEPS, Step } from './data/shots'
import Image from 'next/image'

type Selections = { [stepId: string]: string | string[] }
type Scripts = { [stepId: string]: string }

export default function StoryboardPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [showSummary, setShowSummary] = useState(false)
  const [selections, setSelections] = useState<Selections>({})
  const [scripts, setScripts] = useState<Scripts>({})
  const [projectName, setProjectName] = useState('')
  const [generating, setGenerating] = useState(false)
  const [genStatus, setGenStatus] = useState('')
  const step = STEPS[currentStep]
  const cr = '#F5F2EC', ink = '#1a1a18', mu = '#8a8780', br = '#d8d4cc', hv = '#eae6de'

  function isDone(s: Step) {
    const sel = selections[s.id]
    if (s.type === 'single') return typeof sel === 'string' && sel !== ''
    return Array.isArray(sel) && sel.length > 0
  }
  function doneCount() { return STEPS.filter(isDone).length }
  function pickSingle(id: string) { setSelections(p => ({ ...p, [step.id]: id })) }
  function pickMulti(id: string) {
    setSelections(p => {
      const c = (p[step.id] as string[]) || []
      const e = c.includes(id)
      return { ...p, [step.id]: e ? c.filter((x: string) => x !== id) : [...c, id] }
    })
  }
  function getLabels(s: Step) {
    const sel = selections[s.id]
    if (s.type === 'single') {
      const o = s.options.find(o => o.id === sel)
      return o ? [o.name] : ['（未選）']
    }
    if (Array.isArray(sel) && sel.length > 0) return sel.map((id: string) => s.options.find(o => o.id === id)?.name ?? id)
    return ['（未選）']
  }
  function goTo(i: number) { setShowSummary(false); setCurrentStep(i) }

  async function generateDocx() {
    setGenerating(true); setGenStatus('生成中…')
    try {
      const docx = await import('docx')
      const { Document, Packer, Paragraph, TextRun, BorderStyle, AlignmentType } = docx
      const td = new Date()
      const ds = `${td.getFullYear()}.${String(td.getMonth()+1).padStart(2,'0')}.${String(td.getDate()).padStart(2,'0')}`
      const proj = projectName || 'SOON 分鏡指引'
      const ch: InstanceType<typeof Paragraph>[] = []
      ch.push(new Paragraph({ children: [new TextRun({ text: 'SOON · AI MEDIA CONTENT CREATION', font: 'Arial', size: 18, color: '8a8780' })], spacing: { after: 100 } }))
      ch.push(new Paragraph({ children: [new TextRun({ text: proj, font: 'Georgia', size: 52 })], spacing: { after: 80 } }))
      ch.push(new Paragraph({ children: [new TextRun({ text: `分鏡指引  /  ${ds}`, font: 'Arial', size: 20, color: '8a8780', italics: true })], spacing: { after: 480 }, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'd8d4cc', space: 1 } } }))
      STEPS.forEach(s => {
        ch.push(new Paragraph({ children: [new TextRun({ text: `${s.num}  /  ${s.name}  /  ${s.nameEm}`, font: 'Arial', size: 18, color: '8a8780' })], spacing: { before: 400, after: 100 } }))
        const sc = scripts[s.id] || ''
        ch.push(new Paragraph({ children: [new TextRun({ text: sc || '（未填入 Script）', font: 'Georgia', size: 26, italics: true, color: sc ? '1a1a18' : 'aaa89e' })], spacing: { after: 140 }, indent: { left: 360 }, border: { left: { style: BorderStyle.SINGLE, size: 8, color: 'd8d4cc', space: 1 } } }))
        ch.push(new Paragraph({ children: [new TextRun({ text: '鏡頭選擇', font: 'Arial', size: 18, color: '8a8780' })], spacing: { after: 70 } }))
        getLabels(s).forEach((l: string) => ch.push(new Paragraph({ children: [new TextRun({ text: `· ${l}`, font: 'Arial', size: 22 })], spacing: { after: 50 }, indent: { left: 240 } })))
        if (s.id !== 'ending') ch.push(new Paragraph({ children: [new TextRun({ text: ' ', size: 20 })], spacing: { after: 0 }, border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: 'd8d4cc', space: 1 } } }))
      })
      ch.push(new Paragraph({ children: [new TextRun({ text: `生成於 ${ds} · SOON Internal System`, font: 'Arial', size: 18, color: 'aaa89e', italics: true })], spacing: { before: 600 }, alignment: AlignmentType.CENTER }))
      const doc = new Document({ sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1800, right: 1800, bottom: 1800, left: 1800 } } }, children: ch }] })
      const blob = await Packer.toBlob(doc)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = `${proj}.docx`; a.click(); URL.revokeObjectURL(url)
      setGenStatus('✓ 已下載，可直接上傳 Google Drive')
    } catch(e) {
      console.error(e); setGenStatus('生成失敗，請重試')
    } finally { setGenerating(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: cr, color: ink, fontFamily: 'Georgia, serif' }}>
      <header style={{ padding: '20px 24px 16px', borderBottom: `0.5px solid ${br}` }}>
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, letterSpacing: '0.1em', color: mu, marginBottom: 4 }}>SOON · AI MEDIA CONTENT CREATION</p>
        <h1 style={{ fontSize: 22, fontWeight: 400, margin: 0 }}>分鏡指引 <em style={{ color: mu }}>/ Beta</em></h1>
      </header>
      <nav style={{ display: 'flex', borderBottom: `0.5px solid ${br}` }}>
        {STEPS.map((s, i) => (
          <button key={s.id} onClick={() => goTo(i)} style={{ flex: 1, padding: '10px 4px', fontFamily: 'system-ui, sans-serif', fontSize: 11, textAlign: 'center', background: 'none', border: 'none', borderBottom: !showSummary && i === currentStep ? `1.5px solid ${ink}` : '1.5px solid transparent', color: (!showSummary && i === currentStep) || isDone(s) ? ink : mu, cursor: 'pointer', marginBottom: -1 }}>
            #{s.num} {s.name}
          </button>
        ))}
      </nav>
      {showSummary ? (
        <div style={{ padding: 24 }}>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, letterSpacing: '0.1em', color: mu, marginBottom: 6 }}>完整分鏡指引</p>
          <h2 style={{ fontSize: 20, fontWeight: 400, marginBottom: 32 }}>預覽 <em style={{ color: mu }}>/ Preview</em></h2>
          {STEPS.map((s, i) => (
            <div key={s.id} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: i < STEPS.length - 1 ? `0.5px solid ${br}` : 'none' }}>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, letterSpacing: '0.1em', color: mu, marginBottom: 4 }}>{s.num} / 05</p>
              <h3 style={{ fontSize: 16, fontWeight: 400, marginBottom: 12 }}>{s.name} <em style={{ color: mu }}>/ {s.nameEm}</em></h3>
              <p style={{ fontSize: 13, fontStyle: 'italic', lineHeight: 1.7, marginBottom: 8, padding: '8px 12px', borderLeft: `1.5px solid ${br}`, color: scripts[s.id] ? mu : '#c8c4bc' }}>{scripts[s.id] || '（未填入 Script）'}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {getLabels(s).map((l: string) => (
                  <span key={l} style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, padding: '3px 10px', border: `0.5px solid ${br}`, borderRadius: 999, background: hv, color: ink }}>{l}</span>
                ))}
              </div>
            </div>
          ))}
          <div style={{ paddingTop: 20, borderTop: `0.5px solid ${br}` }}>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, letterSpacing: '0.1em', color: mu, marginBottom: 8 }}>PROJECT NAME</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="例：產品開箱 — 分鏡指引" style={{ flex: 1, fontFamily: 'Georgia, serif', fontSize: 15, background: 'transparent', border: `0.5px solid ${br}`, borderRadius: 4, padding: '7px 11px', outline: 'none', color: ink }} />
              <button onClick={generateDocx} disabled={generating} style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, padding: '9px 18px', background: ink, color: cr, border: 'none', borderRadius: 4, cursor: 'pointer', whiteSpace: 'nowrap', opacity: generating ? 0.4 : 1 }}>生成 .docx ↓</button>
            </div>
            {genStatus && <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: mu, marginTop: 8 }}>{genStatus}</p>}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingTop: 16, borderTop: `0.5px solid ${br}` }}>
            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: mu }}>完整預覽</span>
            <button onClick={() => goTo(STEPS.length - 1)} style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, padding: '9px 22px', border: `0.5px solid ${br}`, borderRadius: 4, background: cr, color: ink, cursor: 'pointer' }}>← 返回修改</button>
          </div>
        </div>
      ) : (
        <div style={{ padding: 24 }}>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, letterSpacing: '0.1em', color: mu, marginBottom: 6 }}>{step.num} / 05</p>
          <h2 style={{ fontSize: 20, fontWeight: 400, marginBottom: 20 }}>{step.name} <em style={{ color: mu }}>/ {step.nameEm}</em></h2>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, letterSpacing: '0.1em', color: mu, marginBottom: 8 }}>SCRIPT</p>
          <textarea value={scripts[step.id] || ''} onChange={e => setScripts(p => ({ ...p, [step.id]: e.target.value }))} placeholder={step.placeholder} rows={3} style={{ width: '100%', fontFamily: 'Georgia, serif', fontSize: 15, color: ink, background: 'transparent', border: `0.5px solid ${br}`, borderRadius: 4, padding: '10px 12px', resize: 'none', outline: 'none', lineHeight: 1.7, marginBottom: 20, boxSizing: 'border-box' }} />
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, letterSpacing: '0.1em', color: mu, marginBottom: 12 }}>{step.note.toUpperCase()}</p>
          {step.type === 'single' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 24 }}>
              {step.options.map(o => {
                const sel = selections[step.id] === o.id
                return (
                  <button key={o.id} onClick={() => pickSingle(o.id)} style={{ textAlign: 'left', border: `0.5px solid ${sel ? ink : br}`, borderRadius: 5, padding: '11px 10px', background: sel ? hv : 'transparent', cursor: 'pointer' }}>
                    {o.img ? <div style={{ position: 'relative', width: '100%', aspectRatio: '9/16', marginBottom: 8, borderRadius: 3, overflow: 'hidden' }}><Image src={o.img} alt={o.name} fill style={{ objectFit: 'cover' }} sizes="200px" /></div> : <div style={{ width: '100%', aspectRatio: '9/16', marginBottom: 8, borderRadius: 3, background: hv, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, color: mu }}>待補充</span></div>}
                    <p style={{ fontSize: 12, fontWeight: 500, color: ink, margin: '0 0 2px' }}>{o.name}</p>
                    <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, color: mu, lineHeight: 1.4, margin: 0 }}>{o.description}</p>
                  </button>
                )
              })}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
              {step.options.map(o => {
                const on = Array.isArray(selections[step.id]) && (selections[step.id] as string[]).includes(o.id)
                return (
                  <button key={o.id} onClick={() => pickMulti(o.id)} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', border: `0.5px solid ${on ? ink : br}`, borderRadius: 5, background: on ? hv : 'transparent', cursor: 'pointer', textAlign: 'left' }}>
                    <span style={{ width: 14, height: 14, borderRadius: 3, border: `0.5px solid ${on ? ink : br}`, background: on ? ink : 'transparent', flexShrink: 0, marginTop: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {on && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5L7 1" stroke="#F5F2EC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </span>
                    <span>
                      <p style={{ fontSize: 14, color: ink, margin: '0 0 2px' }}>{o.name}</p>
                      <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, color: mu, margin: 0 }}>{o.description}</p>
                    </span>
                  </button>
                )
              })}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: `0.5px solid ${br}` }}>
            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: mu }}>{doneCount()} / 5 完成</span>
            <div style={{ display: 'flex', gap: 8 }}>
              {currentStep > 0 && <button onClick={() => goTo(currentStep - 1)} style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, padding: '9px 22px', border: `0.5px solid ${br}`, borderRadius: 4, background: cr, color: ink, cursor: 'pointer' }}>← 上一步</button>}
              {currentStep === STEPS.length - 1 ? <button onClick={() => setShowSummary(true)} style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, padding: '9px 22px', background: ink, color: cr, border: 'none', borderRadius: 4, cursor: 'pointer' }}>預覽 &amp; 生成 →</button> : <button onClick={() => goTo(currentStep + 1)} style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, padding: '9px 22px', background: ink, color: cr, border: 'none', borderRadius: 4, cursor: 'pointer' }}>下一步 →</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
