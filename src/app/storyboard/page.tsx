'use client'

import { useState } from 'react'
import { STEPS, Step, ShotOption } from './data/shots'
import Image from 'next/image'

type Selections = {
  [stepId: string]: string | string[]
}

type Scripts = {
  [stepId: string]: string
}

export default function StoryboardPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [showSummary, setShowSummary] = useState(false)
  const [selections, setSelections] = useState<Selections>({})
  const [scripts, setScripts] = useState<Scripts>({})
  const [projectName, setProjectName] = useState('')
  const [generating, setGenerating] = useState(false)
  const [genStatus, setGenStatus] = useState('')

  const step = STEPS[currentStep]

  function isDone(s: Step): boolean {
    const sel = selections[s.id]
    if (s.type === 'single') return typeof sel === 'string' && sel !== ''
    return Array.isArray(sel) && sel.length > 0
  }

  function doneCount() {
    return STEPS.filter(isDone).length
  }

  function pickSingle(optionId: string) {
    setSelections(prev => ({ ...prev, [step.id]: optionId }))
  }

  function pickMulti(optionId: string) {
    setSelections(prev => {
      const current = (prev[step.id] as string[]) || []
      const exists = current.includes(optionId)
      return {
        ...prev,
        [step.id]: exists
          ? current.filter(id => id !== optionId)
          : [...current, optionId],
      }
    })
  }

  function getSelectedLabels(s: Step): string[] {
    const sel = selections[s.id]
    if (s.type === 'single') {
      const opt = s.options.find(o => o.id === sel)
      return opt ? [opt.name] : ['（未選）']
    }
    if (Array.isArray(sel) && sel.length > 0) {
      return sel.map(id => s.options.find(o => o.id === id)?.name ?? id)
    }
    return ['（未選）']
  }

  function goTo(index: number) {
    setShowSummary(false)
    setCurrentStep(index)
  }

  async function generateDocx() {
    setGenerating(true)
    setGenStatus('生成中…')
    try {
      const docx = await import('docx')
      const { Document, Packer, Paragraph, TextRun, BorderStyle, AlignmentType } = docx

      const today = new Date()
      const ds = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`
      const proj = projectName || 'SOON 分鏡指引'

      const children: InstanceType<typeof Paragraph>[] = []

      children.push(new Paragraph({
        children: [new TextRun({ text: 'SOON · AI MEDIA CONTENT CREATION', font: 'Arial', size: 18, color: '8a8780' })],
        spacing: { after: 100 },
      }))
      children.push(new Paragraph({
        children: [new TextRun({ text: proj, font: 'Georgia', size: 52 })],
        spacing: { after: 80 },
      }))
      children.push(new Paragraph({
        children: [new TextRun({ text: `分鏡指引  /  ${ds}`, font: 'Arial', size: 20, color: '8a8780', italics: true })],
        spacing: { after: 480 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'd8d4cc', space: 1 } },
      }))

      STEPS.forEach(s => {
        children.push(new Paragraph({
          children: [new TextRun({ text: `${s.num}  /  ${s.name}  /  ${s.nameEm}`, font: 'Arial', size: 18, color: '8a8780' })],
          spacing: { before: 400, after: 100 },
        }))

        const sc = scripts[s.id] || ''
        children.push(new Paragraph({
          children: [new TextRun({ text: sc || '（未填入 Script）', font: 'Georgia', size: 26, italics: true, color: sc ? '1a1a18' : 'aaa89e' })],
          spacing: { after: 140 },
          indent: { left: 360 },
          border: { left: { style: BorderStyle.SINGLE, size: 8, color: 'd8d4cc', space: 1 } },
        }))

        children.push(new Paragraph({
          children: [new TextRun({ text: '鏡頭選擇', font: 'Arial', size: 18, color: '8a8780' })],
          spacing: { after: 70 },
        }))

        getSelectedLabels(s).forEach(label => {
          children.push(new Paragraph({
            children: [new TextRun({ text: `· ${label}`, font: 'Arial', size: 22 })],
            spacing: { after: 50 },
            indent: { left: 240 },
          }))
        })

        if (s.id !== 'ending') {
          children.push(new Paragraph({
            children: [new TextRun({ text: ' ', size: 20 })],
            spacing: { after: 0 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: 'd8d4cc', space: 1 } },
          }))
        }
      })

      children.push(new Paragraph({
        children: [new TextRun({ text: `生成於 ${ds} · SOON Internal System`, font: 'Arial', size: 18, color: 'aaa89e', italics: true })],
        spacing: { before: 600 },
        alignment: AlignmentType.CENTER,
      }))

      const doc = new Document({
        sections: [{
          properties: {
            page: {
              size: { width: 11906, height: 16838 },
              margin: { top: 1800, right: 1800, bottom: 1800, left: 1800 },
            },
          },
          children,
        }],
      })

      const buf = await Packer.toBuffer(doc)
      const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${proj}.docx`
      a.click()
      URL.revokeObjectURL(url)
      setGenStatus('✓ 已下載，可直接上傳 Google Drive')
    } catch (e) {
      console.error(e)
      setGenStatus('生成失敗，請重試')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F2EC] text-[#1a1a18] font-serif">
      {/* Header */}
      <header className="px-6 py-5 border-b border-[#d8d4cc]">
        <p className="text-[11px] tracking-widest text-[#8a8780] font-sans mb-1">
          SOON · AI MEDIA CONTENT CREATION
        </p>
        <h1 className="text-[22px] font-normal">
          分鏡指引 <em className="text-[#8a8780]">/ Beta</em>
        </h1>
      </header>

      {/* Step Tabs */}
      <nav className="flex border-b border-[#d8d4cc]">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            className={`flex-1 py-[10px] px-1 font-sans text-[11px] text-center border-b-[1.5px] -mb-px transition-colors ${
              !showSummary && i === currentStep
                ? 'text-[#1a1a18] border-[#1a1a18]'
                : isDone(s)
                ? 'text-[#1a1a18] border-transparent'
                : 'text-[#8a8780] border-transparent'
            }`}
          >
            #{s.num} {s.name}
          </button>
        ))}
      </nav>

      {/* Content */}
      {showSummary ? (
        <SummaryView
          steps={STEPS}
          scripts={scripts}
          selections={selections}
          getSelectedLabels={getSelectedLabels}
          projectName={projectName}
          setProjectName={setProjectName}
          generating={generating}
          genStatus={genStatus}
          onGenerate={generateDocx}
          onBack={() => goTo(STEPS.length - 1)}
        />
      ) : (
        <StepView
          step={step}
          script={scripts[step.id] || ''}
          selection={selections[step.id]}
          doneCount={doneCount()}
          isLast={currentStep === STEPS.length - 1}
          onScriptChange={val => setScripts(prev => ({ ...prev, [step.id]: val }))}
          onPickSingle={pickSingle}
          onPickMulti={pickMulti}
          onPrev={() => goTo(currentStep - 1)}
          onNext={() => goTo(currentStep + 1)}
          onSummary={() => setShowSummary(true)}
          hasPrev={currentStep > 0}
        />
      )}
    </div>
  )
}

// ─── Step View ────────────────────────────────────────────────

function StepView({
  step, script, selection, doneCount, isLast,
  onScriptChange, onPickSingle, onPickMulti,
  onPrev, onNext, onSummary, hasPrev,
}: {
  step: Step
  script: string
  selection: string | string[] | undefined
  doneCount: number
  isLast: boolean
  onScriptChange: (v: string) => void
  onPickSingle: (id: string) => void
  onPickMulti: (id: string) => void
  onPrev: () => void
  onNext: () => void
  onSummary: () => void
  hasPrev: boolean
}) {
  return (
    <div className="px-6 py-6">
      <p className="font-sans text-[11px] tracking-widest text-[#8a8780] mb-2">{step.num} / 05</p>
      <h2 className="text-[20px] mb-5">
        {step.name} <em className="text-[#8a8780]">/ {step.nameEm}</em>
      </h2>

      <p className="font-sans text-[10px] tracking-widest text-[#8a8780] mb-2">SCRIPT</p>
      <textarea
        value={script}
        onChange={e => onScriptChange(e.target.value)}
        placeholder={step.placeholder}
        rows={3}
        className="w-full bg-transparent border border-[#d8d4cc] rounded text-[15px] px-3 py-2.5 resize-none outline-none leading-relaxed mb-5 placeholder:text-[#8a8780] placeholder:italic focus:border-[#1a1a18] transition-colors"
      />

      <p className="font-sans text-[10px] tracking-widest text-[#8a8780] mb-3">
        {step.note.toUpperCase()}
      </p>

      {step.type === 'single' ? (
        <div className="grid grid-cols-3 gap-2 mb-6">
          {step.options.map(opt => {
            const selected = selection === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => onPickSingle(opt.id)}
                className={`text-left border rounded-md p-2.5 transition-colors ${
                  selected
                    ? 'border-[#1a1a18] bg-[#eae6de]'
                    : 'border-[#d8d4cc] hover:bg-[#eae6de]'
                }`}
              >
                <ShotImage opt={opt} />
                <p className="text-[12px] font-medium text-[#1a1a18] mb-0.5">{opt.name}</p>
                <p className="font-sans text-[10px] text-[#8a8780] leading-snug">{opt.description}</p>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-1.5 mb-6">
          {step.options.map(opt => {
            const checked = Array.isArray(selection) && selection.includes(opt.id)
            return (
              <button
                key={opt.id}
                onClick={() => onPickMulti(opt.id)}
                className={`flex items-start gap-2.5 px-3 py-2.5 border rounded-md text-left transition-colors ${
                  checked
                    ? 'border-[#1a1a18] bg-[#eae6de]'
                    : 'border-[#d8d4cc] hover:bg-[#eae6de]'
                }`}
              >
                <span className={`mt-0.5 w-3.5 h-3.5 rounded flex-shrink-0 border flex items-center justify-center ${
                  checked ? 'bg-[#1a1a18] border-[#1a1a18]' : 'border-[#d8d4cc]'
                }`}>
                  {checked && (
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3L3 5L7 1" stroke="#F5F2EC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                <span>
                  <p className="text-[14px] text-[#1a1a18]">{opt.name}</p>
                  <p className="font-sans text-[10px] text-[#8a8780] mt-0.5">{opt.description}</p>
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Nav */}
      <div className="flex justify-between items-center pt-4 border-t border-[#d8d4cc]">
        <span className="font-sans text-[11px] text-[#8a8780]">{doneCount} / 5 完成</span>
        <div className="flex gap-2">
          {hasPrev && (
            <button
              onClick={onPrev}
              className="font-sans text-[12px] px-5 py-2 border border-[#d8d4cc] rounded hover:bg-[#eae6de] transition-colors"
            >
              ← 上一步
            </button>
          )}
          {isLast ? (
            <button
              onClick={onSummary}
              className="font-sans text-[12px] px-5 py-2 bg-[#1a1a18] text-[#F5F2EC] rounded hover:opacity-85 transition-opacity"
            >
              預覽 &amp; 生成 →
            </button>
          ) : (
            <button
              onClick={onNext}
              className="font-sans text-[12px] px-5 py-2 bg-[#1a1a18] text-[#F5F2EC] rounded hover:opacity-85 transition-opacity"
            >
              下一步 →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Shot Image ───────────────────────────────────────────────

function ShotImage({ opt }: { opt: ShotOption }) {
  if (opt.img) {
    return (
      <div className="relative w-full mb-2 rounded overflow-hidden bg-[#eae6de]" style={{ aspectRatio: '9/16' }}>
        <Image
          src={opt.img}
          alt={opt.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 33vw, 200px"
        />
      </div>
    )
  }
  return (
    <div
      className="w-full mb-2 rounded bg-[#eae6de] flex items-center justify-center"
      style={{ aspectRatio: '9/16' }}
    >
      <span className="font-sans text-[10px] text-[#8a8780]">待補充</span>
    </div>
  )
}

// ─── Summary View ─────────────────────────────────────────────

function SummaryView({
  steps, scripts, selections, getSelectedLabels,
  projectName, setProjectName, generating, genStatus, onGenerate, onBack,
}: {
  steps: Step[]
  scripts: Scripts
  selections: Selections
  getSelectedLabels: (s: Step) => string[]
  projectName: string
  setProjectName: (v: string) => void
  generating: boolean
  genStatus: string
  onGenerate: () => void
  onBack: () => void
}) {
  return (
    <div className="px-6 py-6">
      <p className="font-sans text-[11px] tracking-widest text-[#8a8780] mb-2">完整分鏡指引</p>
      <h2 className="text-[20px] mb-8">預覽 <em className="text-[#8a8780]">/ Preview</em></h2>

      {steps.map((s, i) => {
        const labels = getSelectedLabels(s)
        const sc = scripts[s.id]
        return (
          <div key={s.id} className={`mb-6 pb-6 ${i < steps.length - 1 ? 'border-b border-[#d8d4cc]' : ''}`}>
            <p className="font-sans text-[10px] tracking-widest text-[#8a8780] mb-1">{s.num} / 05</p>
            <h3 className="text-[16px] mb-3">
              {s.name} <em className="text-[#8a8780]">/ {s.nameEm}</em>
            </h3>
            <p className={`text-[13px] italic leading-relaxed mb-2 px-3 py-2 border-l-[1.5px] border-[#d8d4cc] ${sc ? 'text-[#8a8780]' : 'text-[#c8c4bc]'}`}>
              {sc || '（未填入 Script）'}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {labels.map(l => (
                <span key={l} className="font-sans text-[11px] px-2.5 py-0.5 border border-[#d8d4cc] rounded-full bg-[#eae6de] text-[#1a1a18]">
                  {l}
                </span>
              ))}
            </div>
          </div>
        )
      })}

      {/* Generate */}
      <div className="pt-5 border-t border-[#d8d4cc]">
        <p className="font-sans text-[10px] tracking-widest text-[#8a8780] mb-2">PROJECT NAME</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
            placeholder="例：產品開箱 — 分鏡指引"
            className="flex-1 bg-transparent border border-[#d8d4cc] rounded px-3 py-2 text-[15px] outline-none placeholder:text-[#8a8780] placeholder:italic focus:border-[#1a1a18] transition-colors"
          />
          <button
            onClick={onGenerate}
            disabled={generating}
            className="font-sans text-[12px] px-4 py-2 bg-[#1a1a18] text-[#F5F2EC] rounded disabled:opacity-40 hover:opacity-85 transition-opacity whitespace-nowrap"
          >
            生成 .docx ↓
          </button>
        </div>
        {genStatus && (
          <p className="font-sans text-[11px] text-[#8a8780] mt-2">{genStatus}</p>
        )}
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#d8d4cc]">
        <span className="font-sans text-[11px] text-[#8a8780]">完整預覽</span>
        <button
          onClick={onBack}
          className="font-sans text-[12px] px-5 py-2 border border-[#d8d4cc] rounded hover:bg-[#eae6de] transition-colors"
        >
          ← 返回修改
        </button>
      </div>
    </div>
  )
}
