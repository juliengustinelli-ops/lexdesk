import { create } from 'zustand'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface ChatState {
  messages: Message[]
  setMessages: (updater: Message[] | ((prev: Message[]) => Message[])) => void
  clearMessages: () => void
}

const INITIAL_MESSAGE: Message = {
  id: '0',
  role: 'assistant',
  content: `Hey! I'm your LexDesk assistant. Ask me anything — I work just like Claude.`,
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [INITIAL_MESSAGE],
  setMessages: (updater) =>
    set((state) => ({
      messages: typeof updater === 'function' ? updater(state.messages) : updater,
    })),
  clearMessages: () => set({ messages: [INITIAL_MESSAGE] }),
}))
