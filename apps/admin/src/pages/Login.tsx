import { useState } from 'react'

interface Props { onLogin: () => void }

export default function Login({ onLogin }: Props) {
  const [secret, setSecret] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL ?? 'http://localhost:3000'}/api/admin/stats`,
        { headers: { Authorization: `Bearer ${secret}` } }
      )
      if (res.status === 401) { setError('Неверный ключ'); return }
      localStorage.setItem('admin_token', secret)
      onLogin()
    } catch {
      setError('Сервер недоступен')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <form onSubmit={submit} style={{
        backgroundColor: '#12121F',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 24,
        padding: 40,
        width: 360,
        display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Nullex Admin</h1>
          <p style={{ color: '#71717A', fontSize: 13, marginTop: 4 }}>Введите секретный ключ</p>
        </div>

        <input
          type="password"
          value={secret}
          onChange={e => setSecret(e.target.value)}
          placeholder="ADMIN_SECRET"
          style={{
            height: 48, borderRadius: 12, border: '1px solid rgba(255,255,255,0.09)',
            backgroundColor: '#1A1A2E', color: '#FFF', padding: '0 16px', fontSize: 14,
            outline: 'none', width: '100%',
          }}
        />

        {error && <p style={{ color: '#FF3B30', fontSize: 13 }}>{error}</p>}

        <button
          type="submit"
          disabled={!secret || loading}
          style={{
            height: 48, borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg, #4F6EF7 0%, #9B5CF6 100%)',
            color: '#FFF', fontSize: 15, fontWeight: 700,
            opacity: !secret || loading ? 0.5 : 1,
          }}
        >
          {loading ? 'Проверка...' : 'Войти'}
        </button>
      </form>
    </div>
  )
}
