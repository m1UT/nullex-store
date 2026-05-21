const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null
  if (url.startsWith('http')) return url
  return `${BASE}${url}`
}

function token() {
  return localStorage.getItem('admin_token') ?? ''
}

async function req<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token()}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (res.status === 401) {
    localStorage.removeItem('admin_token')
    window.location.reload()
    throw new Error('Unauthorized')
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export const api = {
  stats: ()                                          => req<Stats>('GET', '/api/admin/stats'),
  charts: ()                                         => req<ChartData>('GET', '/api/admin/charts'),
  products: ()                                       => req<Product[]>('GET', '/api/admin/products'),
  createProduct: (d: ProductInput)                   => req<Product>('POST', '/api/admin/products', d),
  updateProduct: (id: number, d: Partial<ProductInput>) => req<Product>('PUT', `/api/admin/products/${id}`, d),
  deleteProduct: (id: number)                        => req<void>('DELETE', `/api/admin/products/${id}`),
  uploadImage: async (file: File): Promise<string> => {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch(`${BASE}/api/admin/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token()}` },
      body: form,
    })
    if (!res.ok) throw new Error('Upload failed')
    const data: { url: string } = await res.json()
    return data.url
  },
  banners: ()                                        => req<Banner[]>('GET', '/api/admin/banners'),
  createBanner: (d: BannerInput)                     => req<Banner>('POST', '/api/admin/banners', d),
  updateBanner: (id: number, d: Partial<BannerInput>) => req<Banner>('PUT', `/api/admin/banners/${id}`, d),
  deleteBanner: (id: number)                         => req<void>('DELETE', `/api/admin/banners/${id}`),
  orders: ()                                         => req<Order[]>('GET', '/api/admin/orders'),
  updateOrder: (id: number, status: string)          => req<Order>('PATCH', `/api/admin/orders/${id}`, { status }),
  users: ()                                          => req<User[]>('GET', '/api/admin/users'),
  adjustBalance: (id: number, amount: number)        => req<{ id: number; balance: string }>('PATCH', `/api/admin/users/${id}/balance`, { amount }),
  sendMessage: (id: number, text: string)            => req<{ ok: boolean }>('POST', `/api/admin/users/${id}/message`, { text }),
  broadcast: (text: string)                          => req<{ sent: number; total: number }>('POST', '/api/admin/broadcast', { text }),
}

export interface Stats {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
}

export interface ChartData {
  ordersByStatus: { status: string; count: number }[]
  revenueByDay: { date: string; revenue: number }[]
  usersByDay: { date: string; users: number }[]
  topProducts: { name: string; count: number }[]
}

export interface Product {
  id: number
  name: string
  description: string | null
  category: 'GAMES' | 'SOFTWARE' | 'SUBSCRIPTIONS'
  price: string
  stock: number
  createdAt: string
  imageUrl1: string | null
  imageUrl2: string | null
  imageUrl3: string | null
}

export interface ProductInput {
  name: string
  description?: string
  category: 'GAMES' | 'SOFTWARE' | 'SUBSCRIPTIONS'
  price: number
  stock: number
  imageUrl1?: string
  imageUrl2?: string
  imageUrl3?: string
}

export interface Order {
  id: number
  total: string
  status: 'PENDING' | 'PAID' | 'DELIVERED' | 'CANCELLED'
  createdAt: string
  user: { username: string | null; telegramId: string }
  items: { product: { name: string } }[]
}

export interface Banner {
  id: number
  imageUrl: string
  action: string
  actionValue: string | null
  position: number
  active: boolean
  createdAt: string
}

export interface BannerInput {
  imageUrl: string
  action: string
  actionValue?: string | null
  position: number
  active: boolean
}

export interface User {
  id: number
  telegramId: string
  username: string | null
  balance: string
  createdAt: string
  _count: { orders: number }
}
