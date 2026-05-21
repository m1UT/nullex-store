import { useEffect, useState, ReactNode } from 'react'
import { api, Stats, ChartData } from '../api'

// ── Area chart (sparkline) ───────────────────────────────

function AreaChart({ values, color }: { values: number[]; color: string }) {
  const W = 500, H = 80
  const max = Math.max(...values, 1)
  const n = values.length
  if (n < 2) return null
  const xs = values.map((_, i) => (i / (n - 1)) * W)
  const ys = values.map((v) => H - 4 - (v / max) * (H - 8))
  const line = xs.map((x, i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${ys[i].toFixed(1)}`).join(' ')
  const area = `${line} L${W} ${H} L0 ${H} Z`
  const uid = `ac${color.replace('#', '')}`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
      style={{ width: '100%', height: H, display: 'block' }}>
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${uid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Donut chart ──────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#FF9F0A', PAID: '#4F6EF7', DELIVERED: '#A8FF3E', CANCELLED: '#FF3B30',
}
const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Ожидает', PAID: 'Оплачен', DELIVERED: 'Выдан', CANCELLED: 'Отменён',
}

function DonutChart({ data }: { data: { status: string; count: number }[] }) {
  const total = data.reduce((s, d) => s + d.count, 0)
  const R = 56, CX = 70, CY = 70, SW = 20

  let angle = -Math.PI / 2
  const slices = data
    .filter((d) => d.count > 0)
    .map((d) => {
      const sweep = (d.count / total) * 2 * Math.PI
      const s = { ...d, start: angle, end: angle + sweep, color: STATUS_COLORS[d.status] ?? '#71717A' }
      angle += sweep
      return s
    })

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
      <svg viewBox="0 0 140 140" style={{ width: 140, height: 140, flexShrink: 0 }}>
        {total === 0 ? (
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={SW} />
        ) : slices.length === 1 ? (
          <circle cx={CX} cy={CY} r={R} fill="none" stroke={slices[0].color} strokeWidth={SW} />
        ) : (
          slices.map((s, i) => {
            const x1 = CX + R * Math.cos(s.start)
            const y1 = CY + R * Math.sin(s.start)
            const x2 = CX + R * Math.cos(s.end)
            const y2 = CY + R * Math.sin(s.end)
            const large = s.end - s.start > Math.PI ? 1 : 0
            return (
              <path key={i}
                d={`M${x1.toFixed(2)},${y1.toFixed(2)} A${R},${R} 0 ${large},1 ${x2.toFixed(2)},${y2.toFixed(2)}`}
                fill="none" stroke={s.color} strokeWidth={SW} />
            )
          })
        )}
        <text x={CX} y={CY + 6} textAnchor="middle" fontSize="22" fontWeight="700" fill="#FFF">{total}</text>
        <text x={CX} y={CY + 20} textAnchor="middle" fontSize="10" fill="#52525B">заказов</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.map((d) => (
          <div key={d.status} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 10, height: 10, borderRadius: 2,
              backgroundColor: STATUS_COLORS[d.status] ?? '#71717A', flexShrink: 0,
            }} />
            <span style={{ fontSize: 12, color: '#A1A1AA' }}>{STATUS_LABELS[d.status] ?? d.status}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#FFF', marginLeft: 'auto', paddingLeft: 16 }}>{d.count}</span>
          </div>
        ))}
        {total === 0 && <span style={{ fontSize: 13, color: '#52525B' }}>Нет данных</span>}
      </div>
    </div>
  )
}

// ── Horizontal bar chart ─────────────────────────────────

function HBarChart({ data }: { data: { name: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1)
  if (data.length === 0) return <span style={{ fontSize: 13, color: '#52525B' }}>Нет данных о продажах</span>
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {data.map((d, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 12, color: '#A1A1AA', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
              {d.name}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#FFF', flexShrink: 0 }}>{d.count}</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.07)' }}>
            <div style={{
              height: '100%', borderRadius: 3,
              width: `${(d.count / max) * 100}%`,
              background: 'linear-gradient(90deg, #4F6EF7 0%, #9B5CF6 100%)',
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ backgroundColor: '#12121F', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24 }}>
      <div style={{ color: '#71717A', fontSize: 13, marginBottom: 20 }}>{title}</div>
      {children}
    </div>
  )
}

function Loading() {
  return (
    <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3F3F46', fontSize: 13 }}>
      Загрузка...
    </div>
  )
}

// ── Stat cards config ────────────────────────────────────

const STAT_CARDS = [
  { key: 'totalUsers',    label: 'Пользователи', color: '#4F6EF7' },
  { key: 'totalProducts', label: 'Товары',        color: '#9B5CF6' },
  { key: 'totalOrders',   label: 'Заказы',        color: '#FF6BF8' },
  { key: 'totalRevenue',  label: 'Выручка ($)',   color: '#A8FF3E' },
] as const

// ── Dashboard ────────────────────────────────────────────

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [charts, setCharts] = useState<ChartData | null>(null)

  useEffect(() => {
    api.stats().then(setStats)
    api.charts().then(setCharts)
  }, [])

  const revTotal = charts ? charts.revenueByDay.reduce((s, d) => s + d.revenue, 0) : null
  const usersTotal = charts ? charts.usersByDay.reduce((s, d) => s + d.users, 0) : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700 }}>Дашборд</h2>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
        {STAT_CARDS.map(({ key, label, color }) => (
          <div key={key} style={{
            backgroundColor: '#12121F', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20, padding: 24,
          }}>
            <div style={{ color: '#71717A', fontSize: 13, marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color }}>
              {stats ? (key === 'totalRevenue' ? `$${stats[key].toFixed(2)}` : stats[key]) : '—'}
            </div>
          </div>
        ))}
      </div>

      {/* Revenue + Users area charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card title="Выручка за 30 дней">
          <div style={{ fontSize: 22, fontWeight: 700, color: '#A8FF3E', marginBottom: 12 }}>
            {revTotal !== null ? `$${revTotal.toFixed(2)}` : '—'}
          </div>
          {charts ? (
            <>
              <AreaChart values={charts.revenueByDay.map((d) => d.revenue)} color="#A8FF3E" />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 10, color: '#3F3F46' }}>{charts.revenueByDay[0]?.date}</span>
                <span style={{ fontSize: 10, color: '#3F3F46' }}>{charts.revenueByDay[charts.revenueByDay.length - 1]?.date}</span>
              </div>
            </>
          ) : <Loading />}
        </Card>

        <Card title="Новые пользователи (30 дней)">
          <div style={{ fontSize: 22, fontWeight: 700, color: '#4F6EF7', marginBottom: 12 }}>
            {usersTotal !== null ? `+${usersTotal}` : '—'}
          </div>
          {charts ? (
            <>
              <AreaChart values={charts.usersByDay.map((d) => d.users)} color="#4F6EF7" />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 10, color: '#3F3F46' }}>{charts.usersByDay[0]?.date}</span>
                <span style={{ fontSize: 10, color: '#3F3F46' }}>{charts.usersByDay[charts.usersByDay.length - 1]?.date}</span>
              </div>
            </>
          ) : <Loading />}
        </Card>
      </div>

      {/* Donut + Top products */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card title="Заказы по статусу">
          {charts ? <DonutChart data={charts.ordersByStatus} /> : <Loading />}
        </Card>

        <Card title="Топ товаров по продажам">
          {charts ? <HBarChart data={charts.topProducts} /> : <Loading />}
        </Card>
      </div>
    </div>
  )
}
