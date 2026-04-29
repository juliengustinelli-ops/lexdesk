import { useState } from 'react'
import { FileText, Download, X } from 'lucide-react'

const TEAL = '#00c2b5'

function getMonthYear() {
  return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function printOnePager(name: string) {
  const date = getMonthYear()
  const headerLabel = name.trim() ? `For ${name.trim()} · LexAi · ${date}` : `LexAi · ${date}`

  const printHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>LexAi One-Pager${name ? ' – ' + name : ''}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', Arial, sans-serif; color: #111; background: #fff; font-size: 10.5pt; line-height: 1.55; }
  .page { width: 100%; max-width: 760px; margin: 0 auto; padding: 48px 56px; page-break-after: always; }
  .page:last-child { page-break-after: avoid; }
  .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 36px; }
  .logo { font-size: 22pt; font-weight: 900; letter-spacing: -0.5px; }
  .logo-ai { color: ${TEAL}; }
  .page-meta { font-size: 8.5pt; color: #888; }
  hr { border: none; border-top: 1px solid #e0e0e0; margin: 28px 0; }
  .section-label { font-size: 8pt; font-weight: 700; color: ${TEAL}; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px; }
  .section-headline { font-size: 16pt; font-weight: 800; color: #111; margin-bottom: 12px; line-height: 1.25; }
  .body-text { font-size: 10pt; color: #333; margin-bottom: 10px; }
  .service-card { border-left: 3px solid ${TEAL}; background: #f8f8f8; padding: 14px 16px; margin-bottom: 14px; border-radius: 2px; }
  .service-title { font-size: 10pt; font-weight: 700; color: #111; margin-bottom: 6px; }
  .service-body { font-size: 9.5pt; color: #444; line-height: 1.5; }
  .sub-heading { font-size: 10pt; font-weight: 700; color: #111; margin: 20px 0 12px; }
  .bullet { display: flex; gap: 10px; margin-bottom: 10px; align-items: flex-start; }
  .bullet-dash { color: ${TEAL}; font-weight: 700; flex-shrink: 0; margin-top: 1px; }
  .bullet-text { font-size: 9.5pt; color: #333; line-height: 1.5; }
  .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
  .contact-card { border: 1px solid #e0e0e0; border-radius: 4px; padding: 16px 18px; }
  .contact-name { font-size: 10pt; font-weight: 700; color: #111; margin-bottom: 6px; }
  .contact-email { font-size: 9.5pt; color: ${TEAL}; }
  @page { margin: 0; }
</style>
</head>
<body>

<!-- PAGE 1 -->
<div class="page">
  <div class="page-header">
    <div class="logo">Lex<span class="logo-ai">Ai</span></div>
    <div class="page-meta">${headerLabel}</div>
  </div>

  <div class="section-label">WHAT WE DO</div>
  <div class="section-headline">We help businesses turn AI into a competitive advantage.</div>
  <p class="body-text">Whether automating internal processes or building LLM-powered chat experiences, we build AI systems that address high-impact business challenges.</p>

  <hr/>

  <div class="section-label">HOW WE WORK</div>
  <div class="section-headline">Product developers who work hand-in-hand with your team.</div>
  <p class="body-text">We are product developers who work hand-in-hand with clients to design and ship custom AI solutions inside companies that want to expand their capabilities.</p>
  <p class="body-text">Our clients often have ambiguous business problems. And that's OK.</p>
  <p class="body-text">We run discovery workshops to identify the highest-impact opportunities where automation can drive meaningful efficiencies, then build the workflows and products that operationalize them.</p>
  <p class="body-text">In short, we accelerate your business by applying AI to the <em>right</em> problem.</p>

  <hr/>

  <div class="section-label">OUR SERVICES</div>
  <div class="section-headline">Three ways to work with us.</div>

  <div class="service-card">
    <div class="service-title">End-to-end AI Product Development</div>
    <div class="service-body">We partner with teams to identify where AI can materially impact revenue, cost, or operational efficiency. From discovery through deployment, we design and ship custom solutions that integrate seamlessly into your existing workflows.</div>
  </div>

  <div class="service-card">
    <div class="service-title">AI Integration and Enablement</div>
    <div class="service-body">For teams with a clear AI use case but limited internal capacity, we design and deploy the solution – often placing a working MVP in front of users within days.</div>
  </div>
</div>

<!-- PAGE 2 -->
<div class="page">
  <div class="page-header">
    <div class="logo">Lex<span class="logo-ai">Ai</span></div>
    <div class="page-meta">${headerLabel}</div>
  </div>

  <div class="service-card">
    <div class="service-title">Strategy &amp; Advisory</div>
    <div class="service-body">We advise leadership teams on how to thoughtfully integrate AI into their business. We conduct structured discovery to surface the most valuable use cases, evaluate vendor and tooling landscapes, and assess data readiness.</div>
  </div>

  <hr/>

  <div class="section-label">ABOUT US</div>
  <div class="section-headline">Built by practitioners, not theorists.</div>
  <p class="body-text">Eric and Julien bring together over 15 years of tech experience, spanning lean startups to industry giants like Google and Amazon. We are entrepreneurs who have built enterprise products from zero-to-one, advised early-stage AI founders, and even contributed to the development of Google Gemini – serving as trusted thought partners across product, engineering, and R&amp;D.</p>

  <div class="sub-heading">Modeling</div>
  <hr/>
  <div class="bullet"><span class="bullet-dash">—</span><span class="bullet-text">Operationalized quality standards for Google Gemini, training model outputs to drive go/no-go decisions across major releases for millions of users</span></div>
  <div class="bullet"><span class="bullet-dash">—</span><span class="bullet-text">Trained an LLM-powered agent to crawl and scrape thousands of Meta ads to collect market data for outbound campaigns</span></div>

  <div class="sub-heading">Documents and Data</div>
  <hr/>
  <div class="bullet"><span class="bullet-dash">—</span><span class="bullet-text">Created Python-based RAG pipelines from scratch grounded in proprietary financial documents stored in vector databases with security filters</span></div>
  <div class="bullet"><span class="bullet-dash">—</span><span class="bullet-text">Deployed a microservice for a 200-person firm that creates real-time visualizations of survey data using Qualtrics and Tableau</span></div>
</div>

<!-- PAGE 3 -->
<div class="page">
  <div class="page-header">
    <div class="logo">Lex<span class="logo-ai">Ai</span></div>
    <div class="page-meta">${headerLabel}</div>
  </div>

  <div class="sub-heading">General AI Expertise</div>
  <hr/>
  <div class="bullet"><span class="bullet-dash">—</span><span class="bullet-text">LLM integration &amp; API orchestration, generative AI platform development, prompt engineering, agentic workflows, enterprise AI deployment, and conversational AI/NLU design</span></div>
  <div class="bullet"><span class="bullet-dash">—</span><span class="bullet-text">Experience with most major LLM apps and models for productivity and software development</span></div>

  <div class="sub-heading">Product Development</div>
  <hr/>
  <div class="bullet"><span class="bullet-dash">—</span><span class="bullet-text">Built an early-warning system for a Series A SaaS startup that uses Slack to proactively alert technical teams of data migration issues</span></div>
  <div class="bullet"><span class="bullet-dash">—</span><span class="bullet-text">Created a rules-based eligibility system for credit recovery on behalf of NYCDOE, the largest school district in the US</span></div>

  <hr/>

  <div class="section-label">CONTACT</div>
  <div class="section-headline">Get in touch.</div>
  <div class="contact-grid">
    <div class="contact-card">
      <div class="contact-name">Eric Park</div>
      <div class="contact-email">eric@lexaib2b.com</div>
    </div>
    <div class="contact-card">
      <div class="contact-name">Julien Gustinelli</div>
      <div class="contact-email">julien@lexaib2b.com</div>
    </div>
  </div>
</div>

</body>
</html>`

  const win = window.open('', '_blank', 'width=900,height=700')
  if (!win) return
  win.document.write(printHtml)
  win.document.close()
  win.onload = () => {
    win.focus()
    win.print()
  }
}

export function OnePager() {
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')

  const handleGenerate = () => {
    printOnePager(name)
    setShowModal(false)
    setName('')
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
      <div className="text-center space-y-2">
        <FileText className="w-10 h-10 text-teal mx-auto" />
        <h2 className="text-lg font-semibold text-foreground">One-Pager Generator</h2>
        <p className="text-sm text-muted-foreground">Generate a branded LexAi one-pager PDF for any client.</p>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-teal text-[#080b16] font-semibold
                   text-sm transition-opacity hover:opacity-90"
      >
        <Download className="w-4 h-4" />
        Generate One-Pager
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">For who?</h3>
              <button onClick={() => { setShowModal(false); setName('') }} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              autoFocus
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && name.trim()) handleGenerate() }}
              placeholder="e.g. David Escamilla"
              className="w-full px-4 py-3 rounded-lg bg-background border border-border text-sm text-foreground
                         placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2
                         focus:ring-teal/40 focus:border-teal/50 transition-colors"
            />

            <button
              onClick={handleGenerate}
              disabled={!name.trim()}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-teal
                         text-[#080b16] font-semibold text-sm transition-opacity hover:opacity-90
                         disabled:opacity-40"
            >
              <Download className="w-4 h-4" />
              Generate PDF
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
