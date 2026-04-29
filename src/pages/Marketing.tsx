import { Palette, Copy, CheckCheck } from 'lucide-react'
import { useState } from 'react'

interface Swatch { name: string; hex: string; textDark: boolean }

const colors: Swatch[] = [
  { name: 'Teal',        hex: '#00c2b5', textDark: true  },
  { name: 'Navy',        hex: '#080b16', textDark: false },
  { name: 'Card',        hex: '#0f1223', textDark: false },
  { name: 'White',       hex: '#f0f0f0', textDark: true  },
  { name: 'Muted Text',  hex: '#6b7280', textDark: false },
]

const fonts = [
  { name: 'Poppins',          usage: 'Headlines, UI, body copy', weight: '300 · 400 · 500 · 600 · 700' },
  { name: 'JetBrains Mono',   usage: 'Code snippets, technical labels', weight: '400' },
]

const copyLines = [
  'Your AI Implementation Team',
  'We build custom AI systems that automate your workflows.',
  'Book a Free Strategy Call',
  'From chaos to automation — in weeks, not months.',
  'AI that fits your business. Not the other way around.',
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button onClick={handleCopy} className="p-1.5 rounded text-muted-foreground hover:text-teal transition-colors">
      {copied ? <CheckCheck className="w-3.5 h-3.5 text-teal" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{title}</h2>
      {children}
    </div>
  )
}

export function Marketing() {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <div className="flex items-start gap-3 p-4 rounded-xl bg-teal/10 border border-teal/20">
        <Palette className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-teal">Brand & Design Reference</p>
          <p className="text-xs text-muted-foreground mt-0.5">LexAi brand guidelines — colors, fonts, and approved copy.</p>
        </div>
      </div>

      {/* Colors */}
      <Section title="Brand Colors">
        <div className="flex flex-wrap gap-3">
          {colors.map(c => (
            <div key={c.hex} className="flex flex-col items-center gap-1.5 group cursor-pointer"
              onClick={() => navigator.clipboard.writeText(c.hex)}>
              <div
                className="w-14 h-14 rounded-xl border border-white/10 shadow-sm transition-transform group-hover:scale-105"
                style={{ backgroundColor: c.hex }}
              />
              <p className="text-[10px] font-medium text-foreground">{c.name}</p>
              <p className="text-[10px] text-muted-foreground font-mono">{c.hex}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Fonts */}
      <Section title="Typography">
        <div className="space-y-2">
          {fonts.map(f => (
            <div key={f.name} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
              <div>
                <p className="text-sm font-medium text-foreground">{f.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{f.usage}</p>
              </div>
              <p className="text-xs text-muted-foreground font-mono">{f.weight}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Copy */}
      <Section title="Approved Copy">
        <div className="space-y-2">
          {copyLines.map(line => (
            <div key={line} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border group">
              <p className="text-sm text-foreground">{line}</p>
              <CopyButton text={line} />
            </div>
          ))}
        </div>
      </Section>

      {/* Website */}
      <Section title="Website">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Live URL',   value: 'lexai.co' },
            { label: 'GitHub Repo', value: 'lexai-repo' },
            { label: 'Contact',    value: 'hello@lexai.co' },
            { label: 'Tagline',    value: 'Your AI Implementation Team' },
          ].map(item => (
            <div key={item.label} className="p-3 rounded-lg bg-card border border-border">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{item.label}</p>
              <p className="text-sm text-foreground mt-0.5 font-medium">{item.value}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
