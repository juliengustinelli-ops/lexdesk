import { useState } from 'react'
import { Eye, EyeOff, CheckCircle2, RefreshCw, Download, AlertCircle } from 'lucide-react'
import { useSettings, ANTHROPIC_MODELS, OPENAI_MODELS } from '../store/settings'

const isTauri = '__TAURI__' in window

async function checkForUpdate(): Promise<{ hasUpdate: boolean; version?: string; body?: string } | null> {
  try {
    const { checkUpdate } = await import('@tauri-apps/api/updater')
    const { shouldUpdate, manifest } = await checkUpdate()
    return { hasUpdate: shouldUpdate, version: manifest?.version, body: manifest?.body }
  } catch {
    return null
  }
}

async function installUpdate() {
  const { installUpdate, onUpdaterEvent } = await import('@tauri-apps/api/updater')
  const { relaunch } = await import('@tauri-apps/api/process')
  await onUpdaterEvent(() => {})
  await installUpdate()
  await relaunch()
}

function KeyField({ label, value, onChange, placeholder }: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</label>
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-11 rounded-lg bg-card border border-border text-sm text-foreground
                     placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2
                     focus:ring-teal/40 focus:border-teal/50 transition-colors font-mono"
        />
        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}

function ModelSelect({ label, value, onChange, options }: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { id: string; label: string }[]
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-lg bg-card border border-border text-sm text-foreground
                   focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal/50
                   transition-colors cursor-pointer"
      >
        {options.map(o => (
          <option key={o.id} value={o.id}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

export function Settings() {
  const s = useSettings()
  const [saved, setSaved] = useState(false)
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'checking' | 'available' | 'uptodate' | 'error'>('idle')
  const [updateVersion, setUpdateVersion] = useState('')
  const [installing, setInstalling] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleCheckUpdate = async () => {
    setUpdateStatus('checking')
    const result = await checkForUpdate()
    if (!result) {
      setUpdateStatus('error')
    } else if (result.hasUpdate && result.version) {
      setUpdateVersion(result.version)
      setUpdateStatus('available')
    } else {
      setUpdateStatus('uptodate')
    }
  }

  const handleInstall = async () => {
    setInstalling(true)
    await installUpdate()
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-8">

      {/* Identity */}
      <section className="space-y-4">
        <div className="pb-2 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Your Profile</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Personalizes the app to you</p>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Your Name</label>
          <input
            type="text"
            value={s.userName}
            onChange={e => s.setUserName(e.target.value)}
            placeholder="e.g. Eric"
            className="w-full px-4 py-3 rounded-lg bg-card border border-border text-sm text-foreground
                       placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2
                       focus:ring-teal/40 focus:border-teal/50 transition-colors"
          />
        </div>
      </section>

      {/* Anthropic */}
      <section className="space-y-4">
        <div className="pb-2 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Anthropic — Claude</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Used for AI-powered site editing, same model as Claude Code</p>
        </div>
        <KeyField
          label="API Key"
          value={s.anthropicKey}
          onChange={s.setAnthropicKey}
          placeholder="sk-ant-..."
        />
        <ModelSelect
          label="Model"
          value={s.anthropicModel}
          onChange={s.setAnthropicModel}
          options={ANTHROPIC_MODELS}
        />
      </section>

      {/* OpenAI */}
      <section className="space-y-4">
        <div className="pb-2 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">OpenAI — ChatGPT</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Used for chat, one-pager generation, and other AI tasks</p>
        </div>
        <KeyField
          label="API Key"
          value={s.openaiKey}
          onChange={s.setOpenaiKey}
          placeholder="sk-proj-..."
        />
        <ModelSelect
          label="Model"
          value={s.openaiModel}
          onChange={s.setOpenaiModel}
          options={OPENAI_MODELS}
        />
      </section>

      {/* GitHub */}
      <section className="space-y-4">
        <div className="pb-2 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">GitHub</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Personal access token used by the Site Editor to publish changes</p>
        </div>
        <KeyField
          label="Personal Access Token"
          value={s.githubToken}
          onChange={s.setGithubToken}
          placeholder="ghp_..."
        />
      </section>

      {/* Updates */}
      {isTauri && (
        <section className="space-y-4">
          <div className="pb-2 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">App Updates</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Check for the latest version of LexDesk</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCheckUpdate}
              disabled={updateStatus === 'checking' || installing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm
                         text-muted-foreground hover:text-foreground hover:border-teal/40 transition-all disabled:opacity-40"
            >
              <RefreshCw className={`w-4 h-4 ${updateStatus === 'checking' ? 'animate-spin' : ''}`} />
              {updateStatus === 'checking' ? 'Checking...' : 'Check for Updates'}
            </button>

            {updateStatus === 'available' && (
              <button
                onClick={handleInstall}
                disabled={installing}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal text-[#080b16]
                           font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {installing ? 'Installing...' : `Install v${updateVersion}`}
              </button>
            )}
          </div>

          {updateStatus === 'uptodate' && (
            <p className="flex items-center gap-1.5 text-xs text-teal">
              <CheckCircle2 className="w-3.5 h-3.5" /> You're on the latest version
            </p>
          )}
          {updateStatus === 'error' && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <AlertCircle className="w-3.5 h-3.5" /> Could not check for updates
            </p>
          )}
        </section>
      )}

      {/* Save */}
      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal text-[#080b16] font-semibold
                   text-sm transition-opacity hover:opacity-90"
      >
        {saved && <CheckCircle2 className="w-4 h-4" />}
        {saved ? 'Saved!' : 'Save Settings'}
      </button>

      <p className="text-xs text-muted-foreground">
        Settings are stored locally on this device and never sent anywhere.
      </p>
    </div>
  )
}
