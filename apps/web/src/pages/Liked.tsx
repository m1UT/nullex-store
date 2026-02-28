export default function Liked() {
  return (
    <main style={{ padding: '16px', paddingBottom: '96px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px' }}>Liked</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {[
          { name: 'Grotesk Variable', tag: 'Font', price: '$19.00' },
          { name: 'SciFi Asset Pack', tag: '3D Assets', price: '$49.00' },
        ].map((product) => (
          <div
            key={product.name}
            style={{
              backgroundColor: 'var(--card)',
              borderRadius: '16px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div
              style={{
                height: '120px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--surface), var(--card))',
              }}
            />
            <p style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 500 }}>{product.tag}</p>
            <p style={{ fontSize: '14px', fontWeight: 700 }}>{product.name}</p>
            <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--green)' }}>{product.price}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
