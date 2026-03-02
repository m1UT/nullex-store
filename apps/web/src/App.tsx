import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Liked from './pages/Liked'
import Profile from './pages/Profile'
import NavPill from './components/layout/NavPill'
import type { Product } from './data/products'

export type Tab = 'home' | 'liked' | 'cart' | 'profile'


export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)


  const renderPage = () => {
    switch (activeTab) {
      case 'home':    return <Home onProductClick={setSelectedProduct} />
      case 'liked':   return <Liked onProductClick={setSelectedProduct} />
      case 'cart':    return <Cart />
      case 'profile': return <Profile />
    }
  }

  return (
    <div
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', minHeight: '100dvh', position: 'relative', overflow: 'hidden' }}
    >
      {renderPage()}

      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            key="product-detail"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ position: 'fixed', inset: 0, zIndex: 200, backgroundColor: '#0D0D14' }}
          >
            <ProductDetail
              product={selectedProduct}
              onBack={() => setSelectedProduct(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {!selectedProduct && (
        <NavPill activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  )
}
