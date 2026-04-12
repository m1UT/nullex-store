import { useEffect, useState } from 'react'
import { api, User } from '../api'

export default function Users() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => { api.users().then(setUsers) }, [])

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Пользователи</h2>

      <div style={{ backgroundColor: '#12121F', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['ID', 'Telegram ID', 'Username', 'Баланс', 'Заказы', 'Дата регистрации'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#71717A', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
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
              </tr>
            ))}
            {!users.length && (
              <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#71717A', fontSize: 13 }}>Нет пользователей</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
