import { useEffect, useState } from 'react'
import { api, Order } from '../api'

const STATUS_COLOR: Record<string, string> = {
  PENDING:   '#FF9F0A',
  PAID:      '#4F6EF7',
  DELIVERED: '#A8FF3E',
  CANCELLED: '#FF3B30',
}

const STATUS_LABEL: Record<string, string> = {
  PENDING:   'Ожидает',
  PAID:      'Оплачен',
  DELIVERED: 'Выдан',
  CANCELLED: 'Отменён',
}

type SortCol = 'id' | 'user' | 'product' | 'total' | 'status' | 'createdAt'

function SortTh({
  label, col, sort, onSort, style,
}: {
  label: string
  col: SortCol
  sort: { col: SortCol; dir: 'asc' | 'desc' }
  onSort: (col: SortCol) => void
  style?: React.CSSProperties
}) {
  const active = sort.col === col
  return (
    <th
      onClick={() => onSort(col)}
      style={{
        padding: '12px 16px', textAlign: 'left', fontSize: 12,
        color: active ? '#E4E4E7' : '#71717A', fontWeight: 600,
        cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap', ...style,
      }}
    >
      {label}{' '}
      <span style={{ opacity: active ? 1 : 0.3, fontSize: 10 }}>
        {active ? (sort.dir === 'asc' ? '↑' : '↓') : '↕'}
      </span>
    </th>
  )
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [sort, setSort] = useState<{ col: SortCol; dir: 'asc' | 'desc' }>({ col: 'id', dir: 'desc' })

  useEffect(() => { api.orders().then(setOrders) }, [])

  const toggleSort = (col: SortCol) =>
    setSort((s) => s.col === col ? { col, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { col, dir: 'desc' })

  const sorted = [...orders].sort((a, b) => {
    let cmp = 0
    if (sort.col === 'id') cmp = a.id - b.id
    else if (sort.col === 'user') cmp = (a.user.username ?? a.user.telegramId).localeCompare(b.user.username ?? b.user.telegramId)
    else if (sort.col === 'product') cmp = a.items.map((i) => i.product.name).join(', ').localeCompare(b.items.map((i) => i.product.name).join(', '))
    else if (sort.col === 'total') cmp = Number(a.total) - Number(b.total)
    else if (sort.col === 'status') cmp = a.status.localeCompare(b.status)
    else if (sort.col === 'createdAt') cmp = a.createdAt.localeCompare(b.createdAt)
    return sort.dir === 'asc' ? cmp : -cmp
  })

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Заказы</h2>

      <div style={{ backgroundColor: '#12121F', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <SortTh label="ID"           col="id"        sort={sort} onSort={toggleSort} />
              <SortTh label="Пользователь" col="user"      sort={sort} onSort={toggleSort} />
              <SortTh label="Товар"        col="product"   sort={sort} onSort={toggleSort} />
              <SortTh label="Сумма"        col="total"     sort={sort} onSort={toggleSort} />
              <SortTh label="Статус"       col="status"    sort={sort} onSort={toggleSort} />
              <SortTh label="Дата"         col="createdAt" sort={sort} onSort={toggleSort} />
            </tr>
          </thead>
          <tbody>
            {sorted.map((o) => (
              <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px 16px', color: '#71717A', fontSize: 13 }}>#{o.id}</td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>
                  {o.user.username ? `@${o.user.username}` : o.user.telegramId}
                </td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#A1A1AA' }}>
                  {o.items.map((i) => i.product.name).join(', ')}
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#A8FF3E', fontWeight: 700 }}>${o.total}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    display: 'inline-block', padding: '4px 10px', borderRadius: 6,
                    fontSize: 12, fontWeight: 600,
                    color: STATUS_COLOR[o.status] ?? '#A1A1AA',
                    backgroundColor: `${STATUS_COLOR[o.status] ?? '#A1A1AA'}18`,
                    border: `1px solid ${STATUS_COLOR[o.status] ?? '#A1A1AA'}40`,
                  }}>
                    {STATUS_LABEL[o.status] ?? o.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#71717A' }}>
                  {new Date(o.createdAt).toLocaleDateString('ru')}
                </td>
              </tr>
            ))}
            {!sorted.length && (
              <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#71717A', fontSize: 13 }}>Нет заказов</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
