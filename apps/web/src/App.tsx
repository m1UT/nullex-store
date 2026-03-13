import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PullToRefresh from './components/PullToRefresh'
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
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', minHeight: '100dvh', position: 'relative', overflowX: 'clip' }}
    >
      <PullToRefresh />

      {/* Only this div is transformed on pull — NavPill stays outside */}
      <div id="pull-content">
        {renderPage()}

        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              key="product-detail"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden:  { y: '100%', transition: { duration: 0.28, ease: [0.4, 0, 1, 1] } },
                visible: { y: 0,      transition: { duration: 0.42, ease: [0.32, 0.72, 0, 1] } },
              }}
              style={{ position: 'fixed', inset: 0, zIndex: 200, backgroundColor: '#0D0D14', willChange: 'transform' }}
            >
              <ProductDetail
                product={selectedProduct}
                onBack={() => setSelectedProduct(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!selectedProduct && (
        <NavPill activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  )
}
