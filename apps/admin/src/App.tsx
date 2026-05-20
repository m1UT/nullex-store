import { useState } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Users from './pages/Users'
import Broadcast from './pages/Broadcast'

type Page = 'dashboard' | 'products' | 'orders' | 'users' | 'broadcast'

const TABS: { key: Page; label: string }[] = [
  { key: 'dashboard',  label: 'Дашборд' },
  { key: 'products',   label: 'Товары' },
  { key: 'orders',     label: 'Заказы' },
  { key: 'users',      label: 'Пользователи' },
  { key: 'broadcast',  label: 'Рассылка' },
]

export default function App() {
  const [authed, setAuthed] = useState(!!localStorage.getItem('admin_token'))
  const [page, setPage] = useState<Page>('dashboard')

  if (!authed) return <Login onLogin={() => setAuthed(true)} />

  const logout = () => {
    localStorage.removeItem('admin_token')
    setAuthed(false)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, backgroundColor: '#0A0A10',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', padding: 24, gap: 8, flexShrink: 0,
      }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Nullex</div>
          <div style={{ fontSize: 12, color: '#71717A' }}>Admin Panel</div>
        </div>

        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setPage(tab.key)}
            style={{
              height: 40, borderRadius: 10, border: 'none', textAlign: 'left',
              padding: '0 14px', fontSize: 14, fontWeight: page === tab.key ? 700 : 400,
              background: page === tab.key ? 'rgba(79,110,247,0.15)' : 'transparent',
              color: page === tab.key ? '#4F6EF7' : '#A1A1AA',
              cursor: 'pointer',
            }}
          >{tab.label}</button>
        ))}

        <div style={{ flex: 1 }} />
        <button onClick={logout} style={{
          height: 40, borderRadius: 10, border: '1px solid rgba(255,59,48,0.2)',
          background: 'transparent', color: '#FF3B30', fontSize: 13, cursor: 'pointer',
        }}>Выйти</button>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        {page === 'dashboard' && <Dashboard />}
        {page === 'products'  && <Products />}
        {page === 'orders'    && <Orders />}
        {page === 'users'     && <Users />}
        {page === 'broadcast' && <Broadcast />}
      </main>
    </div>
  )
}
