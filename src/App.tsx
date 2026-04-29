import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe,
  FileText,
  Receipt,
  Palette,
  MessageSquare,
  ChevronRight,
} from 'lucide-react'
import { SiteEditor } from './pages/SiteEditor'
import { OnePager } from './pages/OnePager'
import { Invoices } from './pages/Invoices'
import { Marketing } from './pages/Marketing'
import { Chat } from './pages/Chat'

type Tab = 'site' | 'onepager' | 'invoices' | 'marketing' | 'chat'

const tabs: { id: Tab; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'site',      label: 'Site Editor',  icon: Globe,         description: 'Edit website content' },
  { id: 'onepager',  label: 'One-Pager',    icon: FileText,      description: 'Generate branded PDF' },
  { id: 'invoices',  label: 'Invoices',     icon: Receipt,       description: 'Create & export invoices' },
  { id: 'marketing', label: 'Marketing',    icon: Palette,       description: 'Brand & design reference' },
  { id: 'chat',      label: 'Chat',         icon: MessageSquare, description: 'Ask LexAi anything' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('site')

  const currentTab = tabs.find(t => t.id === activeTab)!

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="flex flex-col w-[220px] min-w-[220px] border-r border-border bg-card">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center flex-shrink-0 teal-glow">
            <span className="text-[#080b16] font-bold text-sm">L</span>
          </div>
          <div>
            <p className="font-bold text-foreground text-sm leading-none">LexDesk</p>
            <p className="text-muted-foreground text-[10px] mt-0.5">by LexAi</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 group
                  ${isActive
                    ? 'bg-teal/10 text-teal border border-teal/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}
                `}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-teal' : ''}`} />
                <span className="text-sm font-medium">{tab.label}</span>
                {isActive && (
                  <ChevronRight className="w-3 h-3 ml-auto text-teal opacity-70" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border">
          <p className="text-[10px] text-muted-foreground">LexDesk v1.0</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50">
          <div>
            <h1 className="text-base font-semibold text-foreground">{currentTab.label}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{currentTab.description}</p>
          </div>
        </header>

        {/* Page */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="h-full"
            >
              {activeTab === 'site'      && <SiteEditor />}
              {activeTab === 'onepager'  && <OnePager />}
              {activeTab === 'invoices'  && <Invoices />}
              {activeTab === 'marketing' && <Marketing />}
              {activeTab === 'chat'      && <Chat />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
