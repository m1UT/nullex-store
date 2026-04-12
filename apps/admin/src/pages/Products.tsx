import { useEffect, useState } from 'react'
import { api, Product, ProductInput } from '../api'

const CATEGORIES = ['GAMES', 'SOFTWARE', 'SUBSCRIPTIONS'] as const
const EMPTY: ProductInput = { name: '', description: '', category: 'GAMES', price: 0, stock: 0 }

const inputStyle: React.CSSProperties = {
  height: 40, borderRadius: 10, border: '1px solid rgba(255,255,255,0.09)',
  backgroundColor: '#1A1A2E', color: '#FFF', padding: '0 12px', fontSize: 13,
  outline: 'none', width: '100%',
}

const labelStyle: React.CSSProperties = {
  fontSize: 12, color: '#71717A', marginBottom: 4, display: 'block',
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; data: ProductInput; id?: number } | null>(null)
  const [saving, setSaving] = useState(false)

  const load = () => api.products().then(setProducts)
  useEffect(() => { load() }, [])

  const openCreate = () => setModal({ mode: 'create', data: { ...EMPTY } })
  const openEdit = (p: Product) => setModal({
    mode: 'edit', id: p.id,
    data: { name: p.name, description: p.description ?? '', category: p.category, price: Number(p.price), stock: p.stock },
  })

  const save = async () => {
    if (!modal) return
    setSaving(true)
    try {
      if (modal.mode === 'create') await api.createProduct(modal.data)
      else await api.updateProduct(modal.id!, modal.data)
      setModal(null)
      load()
    } finally { setSaving(false) }
  }

  const del = async (id: number) => {
    if (!confirm('Удалить товар?')) return
    await api.deleteProduct(id)
    load()
  }

  const set = (key: keyof ProductInput, value: string | number) =>
    setModal(m => m ? { ...m, data: { ...m.data, [key]: value } } : null)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Товары</h2>
        <button onClick={openCreate} style={{
          height: 40, padding: '0 20px', borderRadius: 20, border: 'none',
          background: 'linear-gradient(135deg, #4F6EF7 0%, #9B5CF6 100%)',
          color: '#FFF', fontSize: 13, fontWeight: 700,
        }}>+ Добавить</button>
      </div>

      <div style={{ backgroundColor: '#12121F', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['ID', 'Название', 'Категория', 'Цена', 'Остаток', ''].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#71717A', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px 16px', color: '#71717A', fontSize: 13 }}>#{p.id}</td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>{p.name}</td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#A1A1AA' }}>{p.category}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#A8FF3E', fontWeight: 700 }}>${p.price}</td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>
                  <span style={{
                    color: p.stock > 0 ? '#A8FF3E' : '#FF3B30',
                    fontWeight: 600,
                  }}>{p.stock > 0 ? p.stock : 'Нет'}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openEdit(p)} style={{
                      height: 32, padding: '0 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.09)',
                      background: 'transparent', color: '#A1A1AA', fontSize: 12,
                    }}>Изменить</button>
                    <button onClick={() => del(p.id)} style={{
                      height: 32, padding: '0 14px', borderRadius: 8, border: 'none',
                      background: 'rgba(255,59,48,0.15)', color: '#FF3B30', fontSize: 12,
                    }}>Удалить</button>
                  </div>
                </td>
              </tr>
            ))}
            {!products.length && (
              <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#71717A', fontSize: 13 }}>Нет товаров</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <>
          <div onClick={() => setModal(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100 }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            zIndex: 101, width: 440, backgroundColor: '#12121F',
            border: '1px solid rgba(255,255,255,0.09)', borderRadius: 20, padding: 28,
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>
              {modal.mode === 'create' ? 'Новый товар' : 'Редактировать товар'}
            </h3>

            <div>
              <label style={labelStyle}>Название</label>
              <input style={inputStyle} value={modal.data.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Описание</label>
              <textarea
                value={modal.data.description ?? ''}
                onChange={e => set('description', e.target.value)}
                style={{ ...inputStyle, height: 72, padding: '8px 12px', resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>Категория</label>
                <select style={inputStyle} value={modal.data.category} onChange={e => set('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Цена ($)</label>
                <input style={inputStyle} type="number" min="0" step="0.01"
                  value={modal.data.price} onChange={e => set('price', Number(e.target.value))} />
              </div>
              <div>
                <label style={labelStyle}>Остаток</label>
                <input style={inputStyle} type="number" min="0"
                  value={modal.data.stock} onChange={e => set('stock', Number(e.target.value))} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
              <button onClick={() => setModal(null)} style={{
                height: 40, padding: '0 20px', borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.09)', background: 'transparent', color: '#A1A1AA', fontSize: 13,
              }}>Отмена</button>
              <button onClick={save} disabled={saving || !modal.data.name} style={{
                height: 40, padding: '0 24px', borderRadius: 10, border: 'none',
                background: 'linear-gradient(135deg, #4F6EF7 0%, #9B5CF6 100%)',
                color: '#FFF', fontSize: 13, fontWeight: 700,
                opacity: saving || !modal.data.name ? 0.5 : 1,
              }}>{saving ? 'Сохранение...' : 'Сохранить'}</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
