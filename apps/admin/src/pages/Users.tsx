import { useEffect, useState } from 'react'
import { api, User } from '../api'

const inputStyle: React.CSSProperties = {
  height: 40, borderRadius: 10, border: '1px solid rgba(255,255,255,0.09)',
  backgroundColor: '#1A1A2E', color: '#FFF', padding: '0 12px', fontSize: 13,
  outline: 'none', width: '100%',
}

type SortCol = 'id' | 'telegramId' | 'username' | 'balance' | 'orders' | 'createdAt'

function SortTh({
  label, col, sort, onSort,
}: {
  label: string
  col: SortCol
  sort: { col: SortCol; dir: 'asc' | 'desc' }
  onSort: (col: SortCol) => void
}) {
  const active = sort.col === col
  return (
    <th
      onClick={() => onSort(col)}
      style={{
        padding: '12px 16px', textAlign: 'left', fontSize: 12,
        color: active ? '#E4E4E7' : '#71717A', fontWeight: 600,
        cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap',
      }}
    >
      {label}{' '}
      <span style={{ opacity: active ? 1 : 0.3, fontSize: 10 }}>
        {active ? (sort.dir === 'asc' ? '↑' : '↓') : '↕'}
      </span>
    </th>
  )
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [balanceModal, setBalanceModal] = useState<User | null>(null)
  const [amount, setAmount] = useState('')
  const [saving, setSaving] = useState(false)
  const [sort, setSort] = useState<{ col: SortCol; dir: 'asc' | 'desc' }>({ col: 'id', dir: 'desc' })

  const load = () => api.users().then(setUsers)
  useEffect(() => { load() }, [])

  const openBalance = (u: User) => { setBalanceModal(u); setAmount('') }

  const adjust = async (sign: 1 | -1) => {
    if (!balanceModal || !amount || Number(amount) <= 0) return
    setSaving(true)
    try {
      await api.adjustBalance(balanceModal.id, sign * Number(amount))
      setBalanceModal(null)
      load()
    } finally { setSaving(false) }
  }

  const toggleSort = (col: SortCol) =>
    setSort((s) => s.col === col ? { col, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { col, dir: 'desc' })

  const sorted = [...users].sort((a, b) => {
    let cmp = 0
    if (sort.col === 'id') cmp = a.id - b.id
    else if (sort.col === 'telegramId') cmp = a.telegramId.localeCompare(b.telegramId)
    else if (sort.col === 'username') cmp = (a.username ?? '').localeCompare(b.username ?? '')
    else if (sort.col === 'balance') cmp = Number(a.balance) - Number(b.balance)
    else if (sort.col === 'orders') cmp = a._count.orders - b._count.orders
    else if (sort.col === 'createdAt') cmp = a.createdAt.localeCompare(b.createdAt)
    return sort.dir === 'asc' ? cmp : -cmp
  })

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Пользователи</h2>

      <div style={{ backgroundColor: '#12121F', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <SortTh label="ID"          col="id"         sort={sort} onSort={toggleSort} />
              <SortTh label="Telegram ID" col="telegramId" sort={sort} onSort={toggleSort} />
              <SortTh label="Username"    col="username"   sort={sort} onSort={toggleSort} />
              <SortTh label="Баланс"      col="balance"    sort={sort} onSort={toggleSort} />
              <SortTh label="Заказы"      col="orders"     sort={sort} onSort={toggleSort} />
              <SortTh label="Дата"        col="createdAt"  sort={sort} onSort={toggleSort} />
              <th style={{ padding: '12px 16px' }} />
            </tr>
          </thead>
          <tbody>
            {sorted.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px 16px', color: '#71717A', fontSize: 13 }}>#{u.id}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#A1A1AA' }}>{u.telegramId}</td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>
                  {u.username ? `@${u.username}` : <span style={{ color: '#52525B' }}>—</span>}
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#A8FF3E', fontWeight: 700 }}>${u.balance}</td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>{u._count.orders}</td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#71717A' }}>
                  {new Date(u.createdAt).toLocaleDateString('ru')}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button
                    onClick={() => openBalance(u)}
                    style={{
                      height: 32, padding: '0 14px', borderRadius: 8,
                      border: '1px solid rgba(168,255,62,0.25)',
                      background: 'rgba(168,255,62,0.08)', color: '#A8FF3E', fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    Баланс
                  </button>
                </td>
              </tr>
            ))}
            {!sorted.length && (
              <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: '#71717A', fontSize: 13 }}>Нет пользователей</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Balance modal */}
      {balanceModal && (
        <>
          <div
            onClick={() => setBalanceModal(null)}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100 }}
          />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            zIndex: 101, width: 360, backgroundColor: '#12121F',
            border: '1px solid rgba(255,255,255,0.09)', borderRadius: 20, padding: 28,
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Управление балансом</h3>
              <div style={{ fontSize: 13, color: '#71717A' }}>
                {balanceModal.username ? `@${balanceModal.username}` : `ID ${balanceModal.telegramId}`}
              </div>
            </div>

            <div style={{
              backgroundColor: '#1A1A2E', borderRadius: 12, padding: '12px 16px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ color: '#71717A', fontSize: 13 }}>Текущий баланс</span>
              <span style={{ color: '#A8FF3E', fontSize: 18, fontWeight: 700 }}>${balanceModal.balance}</span>
            </div>

            <div>
              <label style={{ fontSize: 12, color: '#71717A', marginBottom: 6, display: 'block' }}>Сумма ($)</label>
              <input
                style={inputStyle}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => adjust(1)}
                disabled={saving || !amount || Number(amount) <= 0}
                style={{
                  flex: 1, height: 42, borderRadius: 10,
                  border: '1px solid rgba(168,255,62,0.3)',
                  background: saving ? '#1A1A2E' : 'rgba(168,255,62,0.15)',
                  color: '#A8FF3E', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  opacity: !amount || Number(amount) <= 0 ? 0.4 : 1,
                } as React.CSSProperties}
              >
                + Пополнить
              </button>
              <button
                onClick={() => adjust(-1)}
                disabled={saving || !amount || Number(amount) <= 0}
                style={{
                  flex: 1, height: 42, borderRadius: 10,
                  border: '1px solid rgba(255,59,48,0.25)',
                  background: 'rgba(255,59,48,0.1)',
                  color: '#FF3B30', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  opacity: !amount || Number(amount) <= 0 ? 0.4 : 1,
                } as React.CSSProperties}
              >
                − Списать
              </button>
            </div>

            <button
              onClick={() => setBalanceModal(null)}
              style={{
                height: 38, borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.09)', background: 'transparent',
                color: '#71717A', fontSize: 13, cursor: 'pointer',
              }}
            >
              Отмена
            </button>
          </div>
        </>
      )}
    </div>
  )
}
