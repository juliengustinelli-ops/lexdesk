import { useState } from 'react'
import { Receipt, Download, Plus, Trash2, RefreshCw } from 'lucide-react'

interface LineItem {
  id: string
  description: string
  qty: number
  rate: number
}

interface InvoiceData {
  invoiceNumber: string
  clientName: string
  clientEmail: string
  date: string
  dueDate: string
  items: LineItem[]
  notes: string
}

const newItem = (): LineItem => ({
  id: crypto.randomUUID(),
  description: '',
  qty: 1,
  rate: 0,
})

export function Invoices() {
  const [data, setData] = useState<InvoiceData>({
    invoiceNumber: '#005',
    clientName: '',
    clientEmail: '',
    date: new Date().toISOString().slice(0, 10),
    dueDate: '',
    items: [newItem()],
    notes: 'Thank you for your business.',
  })
  const [generating, setGenerating] = useState(false)

  const total = data.items.reduce((sum, item) => sum + item.qty * item.rate, 0)

  const updateField = (key: keyof InvoiceData, value: string) => {
    setData(prev => ({ ...prev, [key]: value }))
  }

  const updateItem = (id: string, key: keyof LineItem, value: string | number) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [key]: value } : item),
    }))
  }

  const addItem = () => setData(prev => ({ ...prev, items: [...prev.items, newItem()] }))

  const removeItem = (id: string) => {
    setData(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) }))
  }

  const handleGenerate = async () => {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 1000))
    setGenerating(false)
  }

  const inputCls = "w-full px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal/50 transition-colors"

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      <div className="flex items-start gap-3 p-4 rounded-xl bg-teal/10 border border-teal/20">
        <Receipt className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-teal">Invoice Generator</p>
          <p className="text-xs text-muted-foreground mt-0.5">Creates a branded LexAi invoice and exports as PDF.</p>
        </div>
      </div>

      {/* Header fields */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { key: 'invoiceNumber', label: 'Invoice #' },
          { key: 'date',          label: 'Date',       type: 'date' },
          { key: 'clientName',    label: 'Client Name' },
          { key: 'dueDate',       label: 'Due Date',   type: 'date' },
          { key: 'clientEmail',   label: 'Client Email', type: 'email' },
        ].map(f => (
          <div key={f.key} className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{f.label}</label>
            <input
              type={f.type || 'text'}
              value={(data as never)[f.key]}
              onChange={e => updateField(f.key as keyof InvoiceData, e.target.value)}
              className={inputCls}
            />
          </div>
        ))}
      </div>

      {/* Line items */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Line Items</label>
        <div className="space-y-2">
          {data.items.map(item => (
            <div key={item.id} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Description"
                value={item.description}
                onChange={e => updateItem(item.id, 'description', e.target.value)}
                className={`${inputCls} flex-1`}
              />
              <input
                type="number"
                placeholder="Qty"
                value={item.qty}
                onChange={e => updateItem(item.id, 'qty', Number(e.target.value))}
                className={`${inputCls} w-16 text-center`}
              />
              <input
                type="number"
                placeholder="Rate"
                value={item.rate}
                onChange={e => updateItem(item.id, 'rate', Number(e.target.value))}
                className={`${inputCls} w-24`}
              />
              <button
                onClick={() => removeItem(item.id)}
                disabled={data.items.length === 1}
                className="p-2 rounded-lg text-muted-foreground hover:text-destructive disabled:opacity-30 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addItem}
          className="flex items-center gap-1.5 text-xs text-teal hover:text-teal-light transition-colors mt-1"
        >
          <Plus className="w-3.5 h-3.5" /> Add item
        </button>
      </div>

      {/* Total */}
      <div className="flex justify-end">
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-2xl font-bold text-gradient">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Notes</label>
        <textarea
          value={data.notes}
          onChange={e => updateField('notes', e.target.value)}
          rows={2}
          className={`${inputCls} resize-none`}
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={generating || !data.clientName}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal text-[#080b16] font-semibold
                   text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        {generating ? 'Generating...' : 'Export Invoice PDF'}
      </button>
    </div>
  )
}
