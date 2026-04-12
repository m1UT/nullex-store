import { useEffect, useState } from 'react'
import { api, Stats } from '../api'

const cards = [
  { key: 'totalUsers',    label: 'Пользователи', color: '#4F6EF7' },
  { key: 'totalProducts', label: 'Товары',        color: '#9B5CF6' },
  { key: 'totalOrders',   label: 'Заказы',        color: '#FF6BF8' },
  { key: 'totalRevenue',  label: 'Выручка ($)',   color: '#A8FF3E' },
] as const

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => { api.stats().then(setStats) }, [])

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Дашборд</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {cards.map(({ key, label, color }) => (
          <div key={key} style={{
            backgroundColor: '#12121F',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
            padding: 24,
          }}>
            <div style={{ color: '#71717A', fontSize: 13, marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color }}>
              {stats ? (key === 'totalRevenue' ? `$${stats[key].toFixed(2)}` : stats[key]) : '—'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
