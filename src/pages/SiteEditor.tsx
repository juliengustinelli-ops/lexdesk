import { useState, useRef, useEffect } from 'react'
import { Globe, Send, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { useSettings } from '../store/settings'

const REPO_OWNER = import.meta.env.VITE_GITHUB_OWNER
const REPO_NAME = import.meta.env.VITE_GITHUB_REPO

const SITE_PATH_PREFIX = '05-lex-ai-frontend/code'

interface Message {
  role: 'user' | 'assistant'
  content: string
  status?: 'success' | 'error'
}

async function getFileList(ghToken: string): Promise<string[]> {
  const res = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/main?recursive=1`,
    { headers: { Authorization: `Bearer ${ghToken}` } }
  )
  const data = await res.json()
  return (data.tree as { path: string; type: string }[])
    .filter(f => f.type === 'blob' && f.path.startsWith(SITE_PATH_PREFIX) && f.path.endsWith('.html'))
    .map(f => f.path.replace(`${SITE_PATH_PREFIX}/`, ''))
}

async function getFileContent(filePath: string, ghToken: string): Promise<{ content: string; sha: string }> {
  const res = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${SITE_PATH_PREFIX}/${filePath}`,
    { headers: { Authorization: `Bearer ${ghToken}` } }
  )
  const data = await res.json()
  return {
    content: atob(data.content.replace(/\n/g, '')),
    sha: data.sha,
  }
}

async function commitFileChange(filePath: string, newContent: string, sha: string, message: string, ghToken: string): Promise<void> {
  const res = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${SITE_PATH_PREFIX}/${filePath}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${ghToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        content: btoa(unescape(encodeURIComponent(newContent))),
        sha,
      }),
    }
  )
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || 'GitHub commit failed')
  }
}

async function askAI(userRequest: string, fileList: string[], aiKey: string, aiModel: string): Promise<{ file: string; instruction: string } | null> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${aiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: aiModel,
      messages: [
        {
          role: 'system',
          content: `You are a website editor assistant for lexaib2b.com. The website files are HTML files in a GitHub repo.
Available pages: ${fileList.join(', ')}

The user will describe a change they want on the website. You must respond with ONLY valid JSON in this format:
{"file": "filename.html", "instruction": "precise description of exactly what text/HTML to change and to what"}

Pick the most relevant file. If the user says "homepage" or "main page", use index.html.
If the request is unclear or not a website edit request, respond with: {"error": "explanation"}`,
        },
        { role: 'user', content: userRequest },
      ],
      temperature: 0,
    }),
  })
  const data = await res.json()
  const text = data.choices?.[0]?.message?.content?.trim()
  try {
    const parsed = JSON.parse(text)
    if (parsed.error) return null
    return parsed
  } catch {
    return null
  }
}

async function applyEditWithAI(html: string, instruction: string, aiKey: string, aiModel: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${aiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: aiModel,
      messages: [
        {
          role: 'system',
          content: `You are an HTML editor. The user will give you an HTML file and an instruction.
Apply the instruction to the HTML and return ONLY the complete modified HTML file with no explanation, no markdown, no code fences — just raw HTML.`,
        },
        {
          role: 'user',
          content: `Instruction: ${instruction}\n\nHTML:\n${html}`,
        },
      ],
      temperature: 0,
    }),
  })
  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() ?? html
}

export function SiteEditor() {
  const { openaiKey, openaiModel, githubToken } = useSettings()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi${useSettings.getState().userName ? ' ' + useSettings.getState().userName : ''}! Tell me what you'd like to change on the lexaib2b.com website and I'll update it for you.`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setLoading(true)

    try {
      const fileList = await getFileList(githubToken)
      const plan = await askAI(text, fileList, openaiKey, openaiModel)

      if (!plan) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "I couldn't figure out what to change. Could you be more specific? For example: \"Change the hero headline on the homepage to 'We Build AI That Grows Your Pipeline'\"",
        }])
        setLoading(false)
        return
      }

      const { file, instruction } = plan
      const { content, sha } = await getFileContent(file, githubToken)
      const updatedHtml = await applyEditWithAI(content, instruction, openaiKey, openaiModel)
      await commitFileChange(file, updatedHtml, sha, `LexDesk: ${text.slice(0, 72)}`, githubToken)

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Done! I updated **${file}** and pushed the change to GitHub. It should be live on lexaib2b.com shortly.`,
        status: 'success',
      }])
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Something went wrong: ${message}`,
        status: 'error',
      }])
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <Globe className="w-4 h-4 text-teal" />
        <span className="text-sm font-medium text-teal">lexaib2b.com</span>
        <span className="text-xs text-muted-foreground">— connected via GitHub</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-teal text-[#080b16] font-medium rounded-br-sm'
                  : 'bg-card border border-border text-foreground rounded-bl-sm'
              }`}
            >
              {msg.status === 'success' && (
                <CheckCircle2 className="w-4 h-4 text-green-400 inline mr-2 mb-0.5" />
              )}
              {msg.status === 'error' && (
                <XCircle className="w-4 h-4 text-red-400 inline mr-2 mb-0.5" />
              )}
              {msg.content.split('**').map((part, j) =>
                j % 2 === 1 ? <strong key={j}>{part}</strong> : part
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-teal" />
              <span className="text-sm text-muted-foreground">Updating website...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-border">
        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Tell me what to change on the website..."
            rows={2}
            className="flex-1 px-4 py-3 rounded-xl bg-card border border-border text-sm text-foreground
                       focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal/50
                       resize-none transition-colors placeholder:text-muted-foreground"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="flex items-center justify-center w-11 h-11 rounded-xl bg-teal text-[#080b16]
                       transition-opacity hover:opacity-90 disabled:opacity-40 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}
