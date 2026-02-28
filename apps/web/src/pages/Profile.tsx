import { getTelegramUser } from '../lib/telegram'

export default function Profile() {
  const user = getTelegramUser()

  return (
    <main style={{ paddingBottom: '96px' }}>
      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(180deg, var(--purple) 0%, var(--bg) 100%)',
          padding: '48px 16px 24px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'var(--surface)',
            margin: '0 auto 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
          }}
        >
          {user ? user.first_name[0] : '?'}
        </div>
        <p style={{ fontWeight: 700, fontSize: '20px' }}>
          {user ? `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}` : 'Guest'}
        </p>
        {user?.username && (
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '4px' }}>
            @{user.username}
          </p>
        )}
      </div>

      {/* Stats */}
      <div style={{ padding: '16px', display: 'flex', gap: '12px' }}>
        {[
          { label: 'Balance', value: '$0.00' },
          { label: 'Orders', value: '0' },
          { label: 'Liked', value: '0' },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              flex: 1,
              backgroundColor: 'var(--card)',
              borderRadius: '14px',
              padding: '14px',
              textAlign: 'center',
            }}
          >
            <p style={{ fontWeight: 700, fontSize: '18px', color: 'var(--green)' }}>{stat.value}</p>
            <p style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '2px' }}>{stat.label}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
