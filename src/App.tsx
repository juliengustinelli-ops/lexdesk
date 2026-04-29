import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe,
  FileText,
  Receipt,
  Palette,
  MessageSquare,
  ChevronRight,
  Settings as SettingsIcon,
} from 'lucide-react'
import { SiteEditor } from './pages/SiteEditor'
import { OnePager } from './pages/OnePager'
import { Invoices } from './pages/Invoices'
import { Marketing } from './pages/Marketing'
import { Chat } from './pages/Chat'
import { Settings } from './pages/Settings'
import { useSettings } from './store/settings'

type Tab = 'site' | 'onepager' | 'invoices' | 'marketing' | 'chat' | 'settings'

const tabs: { id: Tab; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'site',      label: 'Site Editor',  icon: Globe,         description: 'Edit website content' },
  { id: 'onepager',  label: 'One-Pager',    icon: FileText,      description: 'Generate branded PDF' },
  { id: 'invoices',  label: 'Invoices',     icon: Receipt,       description: 'Create & export invoices' },
  { id: 'marketing', label: 'Marketing',    icon: Palette,       description: 'Brand & design reference' },
  { id: 'chat',      label: 'Chat',         icon: MessageSquare, description: 'Ask LexAi anything' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('site')
  const { userName } = useSettings()
  const displayName = userName.trim() || 'there'

  const currentTab = activeTab === 'settings'
    ? { label: 'Settings', description: 'API keys & model preferences' }
    : tabs.find(t => t.id === activeTab)!

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="flex flex-col w-[220px] min-w-[220px] border-r border-border bg-card">
        {/* Logo */}
        <div className="flex items-center px-5 py-5 border-b border-border">
          <span className="font-bold text-[1.55rem] leading-none tracking-tight text-white font-sans">
            Lex<span className="text-teal">Ai</span>
          </span>
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
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200
                  ${isActive
                    ? 'bg-teal/10 text-teal border border-teal/25'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent'}
                `}
                style={isActive ? { boxShadow: '0 0 12px rgba(0,194,181,0.2), inset 0 0 12px rgba(0,194,181,0.04)' } : {}}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-teal' : ''}`} />
                <span className="text-sm font-medium">{tab.label}</span>
                {isActive && <ChevronRight className="w-3 h-3 ml-auto text-teal opacity-70" />}
              </button>
            )
          })}
        </nav>

        {/* Settings pinned at bottom */}
        <div className="px-3 pb-3 border-t border-border pt-3">
          <button
            onClick={() => setActiveTab('settings')}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200
              ${activeTab === 'settings'
                ? 'bg-teal/10 text-teal border border-teal/25'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent'}
            `}
            style={activeTab === 'settings' ? { boxShadow: '0 0 12px rgba(0,194,181,0.2), inset 0 0 12px rgba(0,194,181,0.04)' } : {}}
          >
            <SettingsIcon className={`w-4 h-4 flex-shrink-0 ${activeTab === 'settings' ? 'text-teal' : ''}`} />
            <span className="text-sm font-medium">Settings</span>
            {activeTab === 'settings' && <ChevronRight className="w-3 h-3 ml-auto text-teal opacity-70" />}
          </button>
          <p className="text-[10px] text-muted-foreground mt-3 px-1">LexDesk v1.0</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="relative flex items-center justify-between px-6 py-4 border-b border-border overflow-hidden">
          {/* Radial teal glow background */}
          <div className="absolute inset-0 bg-[#080b16]" />
          <div className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 60% 120% at 50% -10%, rgba(0,194,181,0.18) 0%, transparent 70%)',
            }}
          />

          <div className="relative z-10">
            <h1 className="text-base font-semibold text-foreground">{currentTab.label}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{currentTab.description}</p>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-0.5">
            <span
              className="text-xl font-bold leading-none tracking-tight text-white"
              style={{ textShadow: '0 0 24px rgba(0,194,181,0.5)' }}
            >
              LexDesk
            </span>
            <span className="text-[11px] font-medium text-white/50">
              by Lex<span className="text-teal font-semibold">Ai</span>
            </span>
          </div>

          <div className="relative z-10 text-right">
            <p className="text-sm font-semibold text-foreground">Hi {displayName} 👋</p>
            <p className="text-xs text-muted-foreground mt-0.5">Welcome to your personalized workspace</p>
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
              {activeTab === 'settings'  && <Settings />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
