import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const ANTHROPIC_MODELS = [
  { id: 'claude-sonnet-4-6',         label: 'Claude Sonnet 4.6 (recommended)' },
  { id: 'claude-opus-4-7',           label: 'Claude Opus 4.7 (most powerful)' },
  { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5 (fastest)' },
]

export const OPENAI_MODELS = [
  { id: 'gpt-4o',       label: 'GPT-4o (recommended)' },
  { id: 'gpt-4o-mini',  label: 'GPT-4o Mini (faster)' },
  { id: 'gpt-4-turbo',  label: 'GPT-4 Turbo' },
]

interface SettingsState {
  userName: string
  anthropicKey: string
  anthropicModel: string
  openaiKey: string
  openaiModel: string
  githubToken: string
  setUserName: (v: string) => void
  setAnthropicKey: (v: string) => void
  setAnthropicModel: (v: string) => void
  setOpenaiKey: (v: string) => void
  setOpenaiModel: (v: string) => void
  setGithubToken: (v: string) => void
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      userName:       '',
      anthropicKey:   '',
      anthropicModel: 'claude-sonnet-4-6',
      openaiKey:      '',
      openaiModel:    'gpt-4o',
      githubToken:    import.meta.env.VITE_GITHUB_TOKEN ?? '',
      setUserName:       (v) => set({ userName: v }),
      setAnthropicKey:   (v) => set({ anthropicKey: v }),
      setAnthropicModel: (v) => set({ anthropicModel: v }),
      setOpenaiKey:      (v) => set({ openaiKey: v }),
      setOpenaiModel:    (v) => set({ openaiModel: v }),
      setGithubToken:    (v) => set({ githubToken: v }),
    }),
    { name: 'lexdesk-settings' }
  )
)
