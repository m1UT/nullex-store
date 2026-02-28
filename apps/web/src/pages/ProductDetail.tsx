export default function ProductDetail() {
  return (
    <main style={{ padding: '16px', paddingBottom: '96px' }}>
      {/* Hero image */}
      <div
        style={{
          height: '260px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, var(--purple), var(--blue))',
          marginBottom: '24px',
        }}
      />

      <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '4px' }}>Game · Indie</p>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Neon Racer Pro</h1>
      <p style={{ color: 'var(--muted2)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
        A high-speed neon racing experience with procedurally generated tracks and
        an electrifying synthwave soundtrack.
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: '28px', fontWeight: 700, color: 'var(--green)' }}>$24.99</p>
        <button
          style={{
            backgroundColor: 'var(--green)',
            color: '#000',
            fontWeight: 700,
            fontSize: '15px',
            padding: '14px 28px',
            borderRadius: '14px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Buy Now
        </button>
      </div>
    </main>
  )
}
