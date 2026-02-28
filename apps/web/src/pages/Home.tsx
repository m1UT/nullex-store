export default function Home() {
  return (
    <main style={{ padding: '16px', paddingBottom: '96px' }}>
      <header style={{ marginBottom: '16px' }}>
        <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Good morning 👋</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700 }}>Nullex Store</h1>
          <div
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--green)',
            }}
          >
            $0.00
          </div>
        </div>
      </header>

      {/* Search bar placeholder */}
      <div
        style={{
          backgroundColor: 'var(--card)',
          borderRadius: '12px',
          padding: '12px 16px',
          color: 'var(--muted)',
          fontSize: '14px',
          marginBottom: '16px',
        }}
      >
        Search products…
      </div>

      {/* Promo banner placeholder */}
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '16px',
          background: 'linear-gradient(135deg, var(--purple), var(--blue))',
        }}
      >
        <p style={{ fontWeight: 700, fontSize: '18px' }}>20% Off First Order</p>
        <p style={{ fontSize: '13px', opacity: 0.8, marginTop: '4px' }}>Use code NULLEX20</p>
      </div>

      {/* Category chips placeholder */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto' }}>
        {['All', 'Games', 'Fonts', '3D Assets', 'Music'].map((cat) => (
          <div
            key={cat}
            style={{
              backgroundColor: cat === 'All' ? 'var(--green)' : 'var(--card)',
              color: cat === 'All' ? '#000' : 'var(--text)',
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {cat}
          </div>
        ))}
      </div>

      {/* Product grid placeholder */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {[
          { name: 'Neon Racer Pro', tag: 'Game', price: '$24.99' },
          { name: 'Grotesk Variable', tag: 'Font', price: '$19.00' },
          { name: 'SciFi Asset Pack', tag: '3D Assets', price: '$49.00' },
          { name: 'Lo-Fi Beats Vol.3', tag: 'Music', price: '$12.00' },
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
