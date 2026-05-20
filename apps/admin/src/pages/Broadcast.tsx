import { useState } from 'react'
import { api } from '../api'

export default function Broadcast() {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ sent: number; total: number } | null>(null)

  const send = async () => {
    if (!text.trim() || sending) return
    setSending(true)
    setResult(null)
    try {
      const res = await api.broadcast(text.trim())
      setResult(res)
      setText('')
    } finally { setSending(false) }
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Рассылка</h2>
      <p style={{ color: '#71717A', fontSize: 13, marginBottom: 24 }}>
        Сообщение будет отправлено всем пользователям, которые запустили бота.
      </p>

      <div style={{
        backgroundColor: '#12121F', borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.08)', padding: 24,
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        <div>
          <label style={{ fontSize: 12, color: '#71717A', marginBottom: 6, display: 'block' }}>
            Текст сообщения
          </label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Введите текст рассылки..."
            rows={6}
            style={{
              width: '100%', borderRadius: 10, border: '1px solid rgba(255,255,255,0.09)',
              backgroundColor: '#1A1A2E', color: '#FFF', padding: '12px',
              fontSize: 13, outline: 'none', resize: 'vertical',
              fontFamily: 'inherit', boxSizing: 'border-box',
            }}
          />
        </div>

        {result && (
          <div style={{
            backgroundColor: 'rgba(168,255,62,0.08)',
            border: '1px solid rgba(168,255,62,0.25)',
            borderRadius: 10, padding: '12px 16px',
            color: '#A8FF3E', fontSize: 13, fontWeight: 600,
          }}>
            ✓ Отправлено {result.sent} из {result.total} пользователей
          </div>
        )}

        <button
          onClick={send}
          disabled={sending || !text.trim()}
          style={{
            height: 44, borderRadius: 10, border: 'none',
            background: sending || !text.trim()
              ? 'rgba(79,110,247,0.3)'
              : 'linear-gradient(135deg, #4F6EF7 0%, #9B5CF6 100%)',
            color: '#FFF', fontSize: 14, fontWeight: 700,
            cursor: sending || !text.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          {sending ? 'Отправка...' : 'Отправить всем'}
        </button>
      </div>
    </div>
  )
}
