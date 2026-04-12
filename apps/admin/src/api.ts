const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

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
  stats: ()                                => req<Stats>('GET', '/api/admin/stats'),
  products: ()                             => req<Product[]>('GET', '/api/admin/products'),
  createProduct: (d: ProductInput)         => req<Product>('POST', '/api/admin/products', d),
  updateProduct: (id: number, d: Partial<ProductInput>) => req<Product>('PUT', `/api/admin/products/${id}`, d),
  deleteProduct: (id: number)              => req<void>('DELETE', `/api/admin/products/${id}`),
  orders: ()                               => req<Order[]>('GET', '/api/admin/orders'),
  updateOrder: (id: number, status: string) => req<Order>('PATCH', `/api/admin/orders/${id}`, { status }),
  users: ()                                => req<User[]>('GET', '/api/admin/users'),
}

export interface Stats {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
}

export interface Product {
  id: number
  name: string
  description: string | null
  category: 'GAMES' | 'SOFTWARE' | 'SUBSCRIPTIONS'
  price: string
  stock: number
  createdAt: string
}

export interface ProductInput {
  name: string
  description?: string
  category: 'GAMES' | 'SOFTWARE' | 'SUBSCRIPTIONS'
  price: number
  stock: number
}

export interface Order {
  id: number
  total: string
  status: 'PENDING' | 'PAID' | 'DELIVERED' | 'CANCELLED'
  createdAt: string
  user: { username: string | null; telegramId: string }
  items: { product: { name: string } }[]
}

export interface User {
  id: number
  telegramId: string
  username: string | null
  balance: string
  createdAt: string
  _count: { orders: number }
}
