'use client'

import { useState } from 'react'
import Image from 'next/image'
import { STEPS, Step } from './data/shots'

type Selections = { [stepId: string]: string | string[] }
type Scripts = { [stepId: string]: string }

const cr = '#171a2f'
const ink = '#f5f7ff'
const mu = '#8e94ba'
const br = 'rgba(255,255,255,0.08)'
const hv = 'rgba(255,255,255,0.04)'

type Recommendation = {
  picks: string[]
  reason: string
  shootingTip: string
  editTip: string
}

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
  const card = {
    border: `1px solid ${br}`,
    background: 'rgba(34, 38, 68, 0.88)',
    borderRadius: 22,
    boxShadow: '0 18px 40px rgba(4, 6, 20, 0.26)',
  } as const

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

  function getRecommendation(s: Step, script: string): Recommendation {
    const text = script.toLowerCase()
    const hasNumbers = /[\d$%]|幾|價錢|價格|平|貴|預算|票|收費/.test(script)
    const hasEmotion = /驚|震撼|開心|失望|崩潰|激動|驚喜|反應|wow|amazing|insane|sad|emotional/.test(text + script)
    const hasPlace = /地址|位於|喺|在|附近|景點|地方|餐廳|咖啡店|商場|市場|公園|aquarium|cafe|restaurant|hotel/.test(text + script)
    const hasAction = /試|食|玩|用|行|睇|體驗|開箱|挑戰|demo|test|walk|enter|show/.test(text + script)
    const hasReveal = /原來|竟然|但係|之後|跟住|突然|一轉|push|reveal|turn/.test(text + script)

    if (s.id === 'opening') {
      if (hasEmotion || hasReveal) {
        return {
          picks: ['拍法 A'],
          reason: '呢段開場有情緒或反轉感，先用最強 hook 拍法會最快拉住觀眾。',
          shootingTip: '主持第一句前 1 秒已經要入戲，表情同手勢要即刻到位。',
          editTip: '第一個 cut 保持極短，1-2 秒內就要入主資訊。',
        }
      }
      return {
        picks: ['拍法 C'],
        reason: '呢段較似帶觀眾入場景，先用移動 reveal 建立空間感最穩陣。',
        shootingTip: '主持向前行時保持步速穩定，鏡頭追得貼少少會更自然。',
        editTip: '先見主持再見背景，cut 點落喺露出主體一刻會最順。',
      }
    }

    if (s.id === 'background') {
      if (hasPlace) {
        return {
          picks: ['環境鏡頭', '主持行入鏡頭', 'Medium shot'],
          reason: '呢段有明顯場地資訊，先 wide 建立地點，再由主持承接資訊最清楚。',
          shootingTip: '先拍空景，再拍主持入鏡；主持講解版保持眼神穩定。',
          editTip: 'wide 2-3 秒後 cut 去主持，字幕可疊喺 medium shot。',
        }
      }
      if (hasNumbers) {
        return {
          picks: ['Medium shot', '文字卡資訊', 'Close-up'],
          reason: '呢段資訊量較多，應該用主持講解加字幕卡消化重點。',
          shootingTip: '數字位講慢半拍，記得為字幕留空位。',
          editTip: '數字重點最好獨立成一個 cut，令觀眾更易消化。',
        }
      }
      return {
        picks: ['環境鏡頭', 'B-roll 剪接', 'Medium shot'],
        reason: '背景段最穩陣係用空景同 B-roll 先鋪氣氛，再由主持補足資訊。',
        shootingTip: 'B-roll 儘量拍多幾個角度，方便之後節奏剪接。',
        editTip: '用 2-3 個快 cut 做鋪墊，再落主持正講會自然好多。',
      }
    }

    if (s.id === 'transition') {
      if (hasReveal) {
        return {
          picks: ['拍法 D'],
          reason: '呢段有明顯由人帶去主體嘅感覺，用指向加 reveal 最啱。',
          shootingTip: '主持指向時要明確，鏡頭穿過去主體要一氣呵成。',
          editTip: '把 reveal 點對準關鍵資訊或主體出現一刻。',
        }
      }
      return {
        picks: ['拍法 B'],
        reason: '如果轉場重點係一句說話帶去下一段，固定推前加 soundbite 會最穩。',
        shootingTip: '主持最後一句要留拍子，方便後面接 main content。',
        editTip: '轉場尾音可直接疊入下一段第一個畫面。',
      }
    }

    if (s.id === 'main') {
      if (hasAction && hasEmotion) {
        return {
          picks: ['使用過程', '反應鏡頭', '試食／試用特寫'],
          reason: '呢段既有實際動作又有反應，應該同時交代過程同真實感受。',
          shootingTip: '同一個動作拍 wide、medium、close 三個版本，後面剪接會靈活好多。',
          editTip: '先過程後反應，關鍵一啖／一試嗰刻要留 close-up。',
        }
      }
      if (hasNumbers) {
        return {
          picks: ['產品特寫', '數據字幕', '對比展示'],
          reason: '呢段偏資訊型內容，應該用特寫配數據卡同對比鏡頭。',
          shootingTip: '價格、份量、前後對比全部拍獨立鏡頭，唔好塞埋一個 shot。',
          editTip: '數據字幕最好同產品特寫同步出，令資訊更入腦。',
        }
      }
      return {
        picks: ['產品特寫', '使用過程', '多角度拍攝'],
        reason: '呢段以展示內容為主，先俾觀眾睇清楚，再用角度變化保持節奏。',
        shootingTip: '每個重點都至少拍一個乾淨 close-up，留畀剪接做保險。',
        editTip: '角度切換要跟節奏點，避免畫面太平。',
      }
    }

    if (hasEmotion) {
      return {
        picks: ['拍法 B'],
        reason: '結尾有感受輸出，用主持收尾再離場會最有人味。',
        shootingTip: '最後一句講完先停半秒，再開始離場。',
        editTip: '感想尾句可以留空氣感，唔好太快 cut 黑。',
      }
    }
    return {
      picks: ['拍法 A'],
      reason: '結尾偏向收束主題，用主持講完感想再帶返產品最穩陣。',
      shootingTip: '產品最後停留一個乾淨畫面，方便做 end card。',
      editTip: '最後一個產品鏡頭可多留 8-12 frames 畀字幕或 logo。',
    }
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
    <div style={{ minHeight: '100vh', background: cr, color: ink, fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700&display=swap" rel="stylesheet" />
      <header style={{ padding: '28px 24px 12px' }}>
        <div style={{ ...card, padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: mu, margin: '0 0 10px' }}>SOON 分鏡工作台</p>
              <h1 style={{ fontSize: 46, lineHeight: 1.02, fontWeight: 600, margin: 0 }}>IG Reel 分鏡工作台</h1>
              <p style={{ fontSize: 15, color: '#c9cdec', margin: '14px 0 0', lineHeight: 1.7, maxWidth: 760 }}>左邊導入劇本，中間選鏡頭與拍法，右邊即時檢查每一段建議與整體節奏，直接承接 SOON 內部劇本流程。</p>
            </div>
            <div style={{ padding: '14px 16px', borderRadius: 16, border: '1px solid rgba(130,126,255,0.3)', background: 'rgba(111,107,255,0.12)', fontSize: 13, color: '#c9cdec' }}>
              {doneCount()} / {STEPS.length} 段已完成
            </div>
          </div>
        </div>
      </header>

      <div style={{ padding: '8px 24px 40px', display: 'grid', gridTemplateColumns: '320px minmax(0, 1fr) 320px', gap: 20, alignItems: 'start' }}>
        <aside style={{ position: 'sticky', top: 84 }}>
          <div style={{ ...card, background: 'rgba(34, 38, 68, 0.96)', padding: 16, marginBottom: 16 }}>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, letterSpacing: '0.1em', color: mu, marginBottom: 8 }}>IMPORT SCRIPT</p>
            <div style={{ display: 'grid', gap: 8 }}>
              <input
                value={docLink}
                onChange={e => setDocLink(e.target.value)}
                placeholder="貼入 Google Doc 連結..."
                style={{ width: '100%', fontFamily: "'DM Sans', sans-serif", fontSize: 13, background: 'rgba(255,255,255,0.04)', border: `1px solid ${br}`, borderRadius: 14, padding: '12px 14px', outline: 'none', color: ink, boxSizing: 'border-box' }}
              />
              <button
                onClick={importFromDoc}
                disabled={importing}
                style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, padding: '12px 14px', background: 'linear-gradient(135deg,#7b61ff,#5e8bff)', color: '#fff', border: 'none', borderRadius: 14, cursor: importing ? 'not-allowed' : 'pointer', opacity: importing ? 0.5 : 1 }}
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

          <div style={{ ...card, overflow: 'hidden' }}>
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
                    borderBottom: index < STEPS.length - 1 ? `1px solid ${br}` : 'none',
                    background: active ? 'rgba(111,107,255,0.16)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: mu }}>{s.num}</span>
                  <span>
                    <span style={{ display: 'block', fontSize: 14, color: ink, fontWeight: active ? 700 : 500 }}>{s.name}</span>
                    <span style={{ display: 'block', fontFamily: 'system-ui, sans-serif', fontSize: 10, color: mu }}>{s.nameEm}</span>
                  </span>
                  <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: done ? '#8df0b4' : mu }}>{done ? '已選' : '未選'}</span>
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

          <section style={{ ...card, padding: 20, marginBottom: 18 }}>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, letterSpacing: '0.1em', color: mu, marginBottom: 8 }}>SCRIPT SECTION</p>
            <textarea
              value={scripts[step.id] || ''}
              onChange={e => setScripts(prev => ({ ...prev, [step.id]: e.target.value }))}
              placeholder={step.placeholder}
              rows={6}
              style={{ width: '100%', fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: ink, background: 'rgba(255,255,255,0.04)', border: `1px solid ${br}`, borderRadius: 14, padding: '12px 14px', resize: 'vertical', outline: 'none', lineHeight: 1.7, boxSizing: 'border-box' }}
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
                    border: `1px solid ${selected ? 'rgba(130,126,255,0.52)' : br}`,
                    borderRadius: 18,
                    padding: 10,
                    background: selected ? 'rgba(111,107,255,0.12)' : 'rgba(34, 38, 68, 0.88)',
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
                      <div style={{ width: '100%', aspectRatio: '9/16', marginBottom: 8, borderRadius: 12, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12, boxSizing: 'border-box' }}>
                        <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: mu, textAlign: 'center', lineHeight: 1.5 }}>暫未有示範片
                          <br />先按描述揀鏡頭
                        </span>
                      </div>
                    )}
                    <p style={{ fontSize: 13, fontWeight: 600, color: ink, margin: '0 0 4px' }}>{option.name}</p>
                    <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, color: mu, lineHeight: 1.5, margin: 0 }}>{option.description}</p>
                    <div style={{ marginTop: 8, fontFamily: 'system-ui, sans-serif', fontSize: 11, color: selected ? '#f7f8ff' : mu }}>
                      {selected ? '✓ 已加入' : step.type === 'single' ? '選擇這個拍法' : '加入這個拍法'}
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        </main>

        <aside style={{ position: 'sticky', top: 84 }}>
          <div style={{ ...card, padding: 16, marginBottom: 16 }}>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, letterSpacing: '0.1em', color: mu, marginBottom: 12 }}>LIVE SUMMARY</p>
            <div style={{ display: 'grid', gap: 12 }}>
              {STEPS.map(s => {
                const recommendation = getRecommendation(s, scripts[s.id] || '')
                return (
                  <div key={s.id} style={{ paddingBottom: 12, borderBottom: `1px solid ${br}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 13 }}>{s.name}</span>
                      <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, color: isDone(s) ? '#8df0b4' : mu }}>
                        {isDone(s) ? '已完成' : '未選'}
                      </span>
                    </div>
                    <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, color: mu, margin: '0 0 4px' }}>已選拍法</p>
                    <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: mu, lineHeight: 1.5, margin: '0 0 8px' }}>{getLabels(s).join(' / ')}</p>
                    <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, color: mu, margin: '0 0 4px' }}>推薦拍法組合</p>
                    <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: ink, lineHeight: 1.5, margin: '0 0 6px' }}>{recommendation.picks.join(' / ')}</p>
                    <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: mu, lineHeight: 1.5, margin: '0 0 8px' }}>{recommendation.reason}</p>
                    <div style={{ display: 'grid', gap: 6 }}>
                      <div style={{ padding: '10px 10px', borderRadius: 12, background: 'rgba(255,255,255,0.04)' }}>
                        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, color: mu, margin: '0 0 3px' }}>拍攝提示</p>
                        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: ink, lineHeight: 1.5, margin: 0 }}>{recommendation.shootingTip}</p>
                      </div>
                      <div style={{ padding: '10px 10px', borderRadius: 12, background: 'rgba(255,255,255,0.04)' }}>
                        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, color: mu, margin: '0 0 3px' }}>剪接提示</p>
                        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: ink, lineHeight: 1.5, margin: 0 }}>{recommendation.editTip}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ ...card, padding: 16 }}>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, letterSpacing: '0.1em', color: mu, marginBottom: 8 }}>EXPORT DOCX</p>
            <input
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              placeholder="例：產品開箱 — 分鏡指引"
              style={{ width: '100%', fontFamily: "'DM Sans', sans-serif", fontSize: 15, background: 'rgba(255,255,255,0.04)', border: `1px solid ${br}`, borderRadius: 14, padding: '12px 14px', outline: 'none', color: ink, boxSizing: 'border-box', marginBottom: 8 }}
            />
            <button
              onClick={generateDocx}
              disabled={generating}
              style={{ width: '100%', fontFamily: 'system-ui, sans-serif', fontSize: 12, padding: '12px 16px', background: 'linear-gradient(135deg,#7b61ff,#5e8bff)', color: '#fff', border: 'none', borderRadius: 14, cursor: 'pointer', opacity: generating ? 0.4 : 1 }}
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
