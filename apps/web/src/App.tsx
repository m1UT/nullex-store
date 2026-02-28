import { useState } from 'react'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Liked from './pages/Liked'
import Profile from './pages/Profile'
import NavPill from './components/layout/NavPill'

export type Tab = 'home' | 'liked' | 'cart' | 'profile'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home')

  const renderPage = () => {
    switch (activeTab) {
      case 'home':    return <Home />
      case 'liked':   return <Liked />
      case 'cart':    return <Cart />
      case 'profile': return <Profile />
    }
  }

  return (
    <div
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', minHeight: '100dvh', position: 'relative' }}
    >
      {renderPage()}
      <NavPill activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
