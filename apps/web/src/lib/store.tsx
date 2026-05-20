import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react'
import type { Product } from '../data/products'
import type { BackendUser, CartItem, Order } from './api'
import {
  fetchMe, fetchLikes, fetchCart, fetchOrders, fetchProfilePhoto,
  toggleLike as toggleLikeApi,
  addToCart as addToCartApi,
  removeFromCart as removeFromCartApi,
  clearCart as clearCartApi,
  placeOrder as placeOrderApi,
} from './api'

interface StoreValue {
  user: BackendUser | null
  photoUrl: string | null
  likedProducts: Product[]
  likedIds: Set<number>
  cartItems: CartItem[]
  orders: Order[]
  toggleLike: (productId: number) => Promise<void>
  addToCart: (productId: number) => Promise<void>
  removeFromCart: (productId: number) => Promise<void>
  clearCart: () => Promise<void>
  placeOrder: () => Promise<{ ok: true } | { ok: false; error: string }>
}

const StoreContext = createContext<StoreValue | null>(null)

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be inside StoreProvider')
  return ctx
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<BackendUser | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [likedProducts, setLikedProducts] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  const likedIds = useMemo(
    () => new Set(likedProducts.map((p) => Number(p.id))),
    [likedProducts],
  )

  useEffect(() => {
    Promise.all([fetchMe(), fetchLikes(), fetchCart(), fetchOrders(), fetchProfilePhoto()]).then(
      ([me, likes, cart, ords, photo]) => {
        setUser(me)
        setLikedProducts(likes)
        setCartItems(cart)
        setOrders(ords)
        setPhotoUrl(photo)
      },
    )

    const interval = setInterval(() => {
      fetchMe().then((me) => { if (me) setUser(me) })
    }, 30_000)

    return () => clearInterval(interval)
  }, [])

  const toggleLike = useCallback(async (productId: number) => {
    const wasLiked = likedIds.has(productId)
    if (wasLiked) setLikedProducts((prev) => prev.filter((p) => Number(p.id) !== productId))
    await toggleLikeApi(productId)
    const likes = await fetchLikes()
    setLikedProducts(likes)
  }, [likedIds])

  const addToCart = useCallback(async (productId: number) => {
    if (cartItems.some((i) => i.productId === productId)) return
    await addToCartApi(productId)
    const cart = await fetchCart()
    setCartItems(cart)
  }, [cartItems])

  const removeFromCart = useCallback(async (productId: number) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId))
    await removeFromCartApi(productId)
  }, [])

  const clearCart = useCallback(async () => {
    setCartItems([])
    await clearCartApi()
  }, [])

  const placeOrder = useCallback(async () => {
    const result = await placeOrderApi()
    if (!result.ok) return result
    // Optimistic balance deduction
    setUser((prev) => {
      if (!prev) return prev
      const spent = cartItems.reduce((sum, item) => sum + parseFloat(item.product.price.replace('$', '')), 0)
      return { ...prev, balance: (parseFloat(prev.balance) - spent).toFixed(2) }
    })
    setCartItems([])
    const [ords, me] = await Promise.all([fetchOrders(), fetchMe()])
    setOrders(ords)
    if (me) setUser(me)
    return { ok: true as const }
  }, [cartItems])

  return (
    <StoreContext.Provider value={{
      user, photoUrl, likedProducts, likedIds, cartItems, orders,
      toggleLike, addToCart, removeFromCart, clearCart, placeOrder,
    }}>
      {children}
    </StoreContext.Provider>
  )
}
