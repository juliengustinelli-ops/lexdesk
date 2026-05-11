import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, User } from 'lucide-react'
import { useSettings } from '../store/settings'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const SYSTEM_CONTEXT = `You are the LexDesk assistant — a helpful AI built into the LexDesk desktop app for LexAi.
You are a general-purpose assistant, like Claude, and can help with anything the user asks — writing, research, brainstorming, coding, questions, conversation, or anything else.
You also have specific knowledge about LexAi: an AI implementation agency with a teal (#00c2b5) brand color, dark navy theme, and Poppins font. You can help with the LexAi website, marketing materials, invoices, and one-pagers when needed.
Be natural, conversational, and helpful — just like talking to Claude directly.`

const suggestions = [
  'How do I update the hero headline?',
  'What are LexAi\'s brand colors?',
  'Generate invoice copy for a $2,500 project',
  'Write a one-pager intro for a new client',
]

export function Chat() {
  const { anthropicKey, anthropicModel } = useSettings()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: `Hey${useSettings.getState().userName ? ' ' + useSettings.getState().userName : ''}! I'm your LexDesk assistant. Ask me anything about the website, brand, invoices, or marketing materials.`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text?: string) => {
    const content = text || input.trim()
    if (!content || loading) return

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    const assistantId = crypto.randomUUID()
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }])

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: anthropicModel,
          system: SYSTEM_CONTEXT,
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          max_tokens: 4096,
          stream: true,
        }),
      })

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6).trim()
          if (raw === '[DONE]') break
          try {
            const parsed = JSON.parse(raw)
            if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
              accumulated += parsed.delta.text
              setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: accumulated } : m))
            }
          } catch { /* skip malformed lines */ }
        }
      }

      if (!accumulated) {
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: 'Sorry, I could not get a response.' } : m))
      }
    } catch {
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: 'Sorry, something went wrong.' } : m))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 select-text">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-teal/20 border border-teal/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-teal" />
              </div>
            )}
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap select-text cursor-text
                ${msg.role === 'user'
                  ? 'bg-teal text-[#080b16] font-medium rounded-tr-sm'
                  : 'bg-card border border-border text-foreground rounded-tl-sm'
                }`}
            >
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 rounded-full bg-teal/20 border border-teal/30 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-teal animate-pulse" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-card border border-border">
              <div className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 rounded-full bg-teal/60 animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-teal/60 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-teal/60 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Welcome card (shown before first message) */}
      {messages.length === 1 && (
        <div className="px-6 pb-5 flex justify-center">
          <div
            className="w-full max-w-lg rounded-2xl border border-teal/20 px-6 py-5 flex flex-col items-center gap-4"
            style={{
              background: 'linear-gradient(135deg, rgba(0,194,181,0.07) 0%, rgba(8,11,22,0.6) 100%)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 0 40px rgba(0,194,181,0.08)',
            }}
          >
            <div className="text-center">
              <p className="text-sm font-semibold text-white">
                Lex<span className="text-teal">Ai</span> Assistant
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Ask me anything or pick a suggestion below
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs px-3.5 py-1.5 rounded-full border border-teal/25 text-teal/80
                             hover:border-teal hover:text-teal hover:bg-teal/10 transition-all duration-150"
                  style={{ backdropFilter: 'blur(8px)', background: 'rgba(0,194,181,0.06)' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-6 pb-6">
        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
            }}
            placeholder="Ask anything about LexAi..."
            rows={1}
            className="flex-1 px-4 py-3 rounded-xl bg-card border border-border text-sm text-foreground
                       placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2
                       focus:ring-teal/40 focus:border-teal/50 resize-none transition-colors"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="p-3 rounded-xl bg-teal text-[#080b16] disabled:opacity-40 hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground/50 mt-2 text-center">
          Shift+Enter for new line · Enter to send
        </p>
      </div>
    </div>
  )
}
