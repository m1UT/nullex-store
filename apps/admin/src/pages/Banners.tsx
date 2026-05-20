import { useEffect, useRef, useState } from 'react'
import { api, Banner, BannerInput, resolveImageUrl } from '../api'

const ACTION_OPTIONS = [
  { value: 'none',    label: 'Нет действия' },
  { value: 'product', label: 'Открыть товар' },
  { value: 'scroll',  label: 'Прокрутить к товарам' },
]

const EMPTY: BannerInput = { imageUrl: '', action: 'none', actionValue: '', position: 0, active: true }

const inputStyle: React.CSSProperties = {
  height: 40, borderRadius: 10, border: '1px solid rgba(255,255,255,0.09)',
  backgroundColor: '#1A1A2E', color: '#FFF', padding: '0 12px', fontSize: 13,
  outline: 'none', width: '100%',
}
const labelStyle: React.CSSProperties = { fontSize: 12, color: '#71717A', marginBottom: 4, display: 'block' }

export default function Banners() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; data: BannerInput; id?: number } | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () => api.banners().then(setBanners)
  useEffect(() => { load() }, [])

  const openCreate = () => setModal({ mode: 'create', data: { ...EMPTY } })
  const openEdit = (b: Banner) => setModal({
    mode: 'edit', id: b.id,
    data: { imageUrl: b.imageUrl, action: b.action, actionValue: b.actionValue ?? '', position: b.position, active: b.active },
  })

  const save = async () => {
    if (!modal) return
    setSaving(true)
    try {
      const payload = {
        ...modal.data,
        actionValue: modal.data.action === 'product' ? modal.data.actionValue : null,
      }
      if (modal.mode === 'create') await api.createBanner(payload)
      else await api.updateBanner(modal.id!, payload)
      setModal(null)
      load()
    } finally { setSaving(false) }
  }

  const del = async (id: number) => {
    if (!confirm('Удалить баннер?')) return
    await api.deleteBanner(id)
    load()
  }

  const set = (key: keyof BannerInput, value: string | number | boolean | null) =>
    setModal(m => m ? { ...m, data: { ...m.data, [key]: value } } : null)

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setUploading(true)
    try {
      const url = await api.uploadImage(file)
      set('imageUrl', url)
    } finally { setUploading(false) }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Баннеры</h2>
        <button onClick={openCreate} style={{
          height: 40, padding: '0 20px', borderRadius: 20, border: 'none',
          background: 'linear-gradient(135deg, #4F6EF7 0%, #9B5CF6 100%)',
          color: '#FFF', fontSize: 13, fontWeight: 700,
        }}>+ Добавить</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {banners.map(b => {
          const resolved = resolveImageUrl(b.imageUrl)
          return (
            <div key={b.id} style={{
              backgroundColor: '#12121F', borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.08)',
              padding: 16, display: 'flex', alignItems: 'center', gap: 16,
            }}>
              {/* Thumbnail */}
              <div style={{
                width: 120, height: 60, borderRadius: 10, flexShrink: 0,
                backgroundColor: '#1A1A2E', overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {resolved
                  ? <img src={resolved} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ color: '#3F3F46', fontSize: 22 }}>🖼</span>
                }
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>#{b.id}</span>
                  <span style={{
                    fontSize: 11, padding: '2px 8px', borderRadius: 999, fontWeight: 600,
                    background: b.active ? 'rgba(168,255,62,0.12)' : 'rgba(255,59,48,0.12)',
                    color: b.active ? '#A8FF3E' : '#FF3B30',
                  }}>{b.active ? 'Активен' : 'Скрыт'}</span>
                </div>
                <div style={{ fontSize: 12, color: '#71717A' }}>
                  Позиция: {b.position} · Действие: {ACTION_OPTIONS.find(a => a.value === b.action)?.label ?? b.action}
                  {b.action === 'product' && b.actionValue && ` · Товар #${b.actionValue}`}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={() => openEdit(b)} style={{
                  height: 32, padding: '0 14px', borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.09)', background: 'transparent', color: '#A1A1AA', fontSize: 12,
                }}>Изменить</button>
                <button onClick={() => del(b.id)} style={{
                  height: 32, padding: '0 14px', borderRadius: 8, border: 'none',
                  background: 'rgba(255,59,48,0.15)', color: '#FF3B30', fontSize: 12,
                }}>Удалить</button>
              </div>
            </div>
          )
        })}
        {!banners.length && (
          <div style={{ padding: 48, textAlign: 'center', color: '#71717A', fontSize: 13 }}>
            Баннеры не добавлены
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <>
          <div onClick={() => setModal(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100 }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            zIndex: 101, width: 460, backgroundColor: '#12121F',
            border: '1px solid rgba(255,255,255,0.09)', borderRadius: 20, padding: 28,
            display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '90vh', overflowY: 'auto',
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>
              {modal.mode === 'create' ? 'Новый баннер' : 'Редактировать баннер'}
            </h3>

            {/* Image */}
            <div>
              <label style={labelStyle}>Изображение</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 72, height: 44, borderRadius: 8, flexShrink: 0,
                  border: '1px solid rgba(255,255,255,0.09)', backgroundColor: '#1A1A2E',
                  overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {resolveImageUrl(modal.data.imageUrl)
                    ? <img src={resolveImageUrl(modal.data.imageUrl)!} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ color: '#3F3F46' }}>+</span>
                  }
                </div>
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  placeholder="https://... или загрузите файл"
                  value={modal.data.imageUrl}
                  onChange={e => set('imageUrl', e.target.value)}
                />
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => handleFile(e.target.files?.[0])} />
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} style={{
                  height: 40, padding: '0 12px', borderRadius: 8, flexShrink: 0,
                  border: '1px solid rgba(255,255,255,0.09)', background: '#1A1A2E',
                  color: uploading ? '#52525B' : '#A1A1AA', fontSize: 12,
                  cursor: uploading ? 'wait' : 'pointer',
                }}>{uploading ? '...' : 'Загрузить'}</button>
              </div>
            </div>

            {/* Action */}
            <div>
              <label style={labelStyle}>Действие при нажатии</label>
              <select style={inputStyle} value={modal.data.action} onChange={e => set('action', e.target.value)}>
                {ACTION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Action value — only for "product" */}
            {modal.data.action === 'product' && (
              <div>
                <label style={labelStyle}>ID товара</label>
                <input
                  style={inputStyle}
                  placeholder="Например: 3"
                  value={modal.data.actionValue ?? ''}
                  onChange={e => set('actionValue', e.target.value)}
                />
              </div>
            )}

            {/* Position + Active */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>Позиция (порядок)</label>
                <input style={inputStyle} type="number" min="0"
                  value={modal.data.position} onChange={e => set('position', Number(e.target.value))} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', paddingBottom: 10 }}>
                  <input
                    type="checkbox"
                    checked={modal.data.active}
                    onChange={e => set('active', e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: '#4F6EF7' }}
                  />
                  <span style={{ fontSize: 13, color: '#A1A1AA' }}>Активен</span>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
              <button onClick={() => setModal(null)} style={{
                height: 40, padding: '0 20px', borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.09)', background: 'transparent', color: '#A1A1AA', fontSize: 13,
              }}>Отмена</button>
              <button onClick={save} disabled={saving || !modal.data.imageUrl} style={{
                height: 40, padding: '0 24px', borderRadius: 10, border: 'none',
                background: 'linear-gradient(135deg, #4F6EF7 0%, #9B5CF6 100%)',
                color: '#FFF', fontSize: 13, fontWeight: 700,
                opacity: saving || !modal.data.imageUrl ? 0.5 : 1,
              }}>{saving ? 'Сохранение...' : 'Сохранить'}</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
