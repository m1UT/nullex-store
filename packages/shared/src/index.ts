// ─── Enums ────────────────────────────────────────────────────────────────────

export type Category = 'GAMES' | 'FONTS' | 'ASSETS_3D' | 'MUSIC'

export type OrderStatus = 'PENDING' | 'PAID' | 'DELIVERED' | 'CANCELLED'

// ─── Entities ─────────────────────────────────────────────────────────────────

export interface User {
  id: number
  telegramId: bigint
  username: string | null
  balance: number
  createdAt: Date
}

export interface Product {
  id: number
  name: string
  description: string | null
  category: Category
  price: number
  fileUrl: string | null
  thumbnailUrl: string | null
  createdAt: Date
}

export interface Order {
  id: number
  userId: number
  total: number
  status: OrderStatus
  createdAt: Date
  items?: OrderItem[]
}

export interface OrderItem {
  id: number
  orderId: number
  productId: number
  price: number
  product?: Product
}

export interface Like {
  userId: number
  productId: number
}

export interface CartItem {
  userId: number
  productId: number
  product?: Product
}

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface CreateOrderDto {
  userId: number
  productIds: number[]
}

export interface ProductListResponse {
  items: Product[]
  total: number
}
