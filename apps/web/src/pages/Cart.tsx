export default function Cart() {
  return (
    <main style={{ padding: '16px', paddingBottom: '96px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px' }}>Cart</h1>

      {[
        { name: 'Neon Racer Pro', price: '$24.99' },
        { name: 'Grotesk Variable', price: '$19.00' },
        { name: 'Lo-Fi Beats Vol.3', price: '$12.00' },
      ].map((item) => (
        <div
          key={item.name}
          style={{
            backgroundColor: 'var(--card)',
            borderRadius: '14px',
            padding: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <p style={{ fontWeight: 600 }}>{item.name}</p>
          <p style={{ color: 'var(--green)', fontWeight: 700 }}>{item.price}</p>
        </div>
      ))}

      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '14px',
          padding: '16px',
          marginTop: '16px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: 'var(--muted)' }}>Subtotal</span>
          <span style={{ fontWeight: 600 }}>$55.99</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '18px' }}>
          <span>Total</span>
          <span style={{ color: 'var(--green)' }}>$55.99</span>
        </div>
      </div>

      <button
        style={{
          width: '100%',
          backgroundColor: 'var(--green)',
          color: '#000',
          fontWeight: 700,
          fontSize: '16px',
          padding: '16px',
          borderRadius: '14px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Checkout
      </button>
    </main>
  )
}
