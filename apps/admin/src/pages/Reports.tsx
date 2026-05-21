import { useState } from 'react'
import { api } from '../api'

const REPORTS = [
  {
    key:         'sales',
    title:       'Продажи',
    description: 'Все заказы: пользователь, товары, сумма, статус и дата',
    accent:      '#4F6EF7',
    accentBg:    'rgba(79,110,247,0.12)',
    icon:        '📊',
  },
  {
    key:         'products',
    title:       'Товары',
    description: 'Каталог товаров с категориями, ценами и остатками на складе',
    accent:      '#9B5CF6',
    accentBg:    'rgba(155,92,246,0.12)',
    icon:        '📦',
  },
  {
    key:         'users',
    title:       'Пользователи',
    description: 'Список пользователей с балансом и количеством заказов',
    accent:      '#A8FF3E',
    accentBg:    'rgba(168,255,62,0.10)',
    icon:        '👥',
  },
] as const

const FORMATS = [
  { key: 'excel', label: 'Excel', color: '#1D7044', bg: 'rgba(29,112,68,0.15)' },
  { key: 'pdf',   label: 'PDF',   color: '#FF3B30', bg: 'rgba(255,59,48,0.12)' },
  { key: 'word',  label: 'Word',  color: '#2B79D4', bg: 'rgba(43,121,212,0.12)' },
] as const

type LoadingKey = `${typeof REPORTS[number]['key']}_${typeof FORMATS[number]['key']}`

export default function Reports() {
  const [loading, setLoading] = useState<LoadingKey | null>(null)
  const [error, setError]     = useState<string | null>(null)

  const download = async (reportKey: string, formatKey: string) => {
    const key = `${reportKey}_${formatKey}` as LoadingKey
    setLoading(key)
    setError(null)
    try {
      await api.downloadReport(reportKey, formatKey)
    } catch {
      setError('Ошибка при формировании отчёта. Попробуйте ещё раз.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Отчёты</h2>
        <p style={{ fontSize: 13, color: '#71717A', margin: 0 }}>
          Выгрузка данных из базы в Excel, PDF или Word
        </p>
      </div>

      {error && (
        <div style={{
          backgroundColor: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.25)',
          borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#FF3B30',
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {REPORTS.map((report) => (
          <div
            key={report.key}
            style={{
              backgroundColor: '#12121F',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20,
              padding: 28,
              display: 'flex',
              alignItems: 'center',
              gap: 24,
            }}
          >
            {/* Icon */}
            <div style={{
              width: 56, height: 56, borderRadius: 16, flexShrink: 0,
              backgroundColor: report.accentBg,
              border: `1px solid ${report.accent}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26,
            }}>
              {report.icon}
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#FFF', marginBottom: 4 }}>
                {report.title}
              </div>
              <div style={{ fontSize: 13, color: '#71717A' }}>{report.description}</div>
            </div>

            {/* Download buttons */}
            <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
              {FORMATS.map((fmt) => {
                const key = `${report.key}_${fmt.key}` as LoadingKey
                const busy = loading === key
                return (
                  <button
                    key={fmt.key}
                    onClick={() => download(report.key, fmt.key)}
                    disabled={loading !== null}
                    style={{
                      height: 40, padding: '0 18px', borderRadius: 10,
                      border: `1px solid ${fmt.color}40`,
                      backgroundColor: busy ? fmt.bg : 'transparent',
                      color: loading !== null && !busy ? '#3F3F46' : fmt.color,
                      fontSize: 13, fontWeight: 600,
                      cursor: loading !== null ? (busy ? 'wait' : 'default') : 'pointer',
                      transition: 'background-color 0.15s, color 0.15s',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    {busy && (
                      <span style={{ display: 'inline-block', width: 12, height: 12, border: `2px solid ${fmt.color}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                    )}
                    {fmt.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Info block */}
      <div style={{
        marginTop: 24, backgroundColor: '#12121F',
        border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16,
        padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: 18 }}>ℹ️</span>
        <div style={{ fontSize: 12, color: '#71717A', lineHeight: 1.6 }}>
          Отчёты формируются на основе текущих данных в базе и загружаются автоматически.
          Крупные выгрузки могут занять несколько секунд.
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
