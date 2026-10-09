import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Categories from './components/categories'
import Products from './components/products'
import ProductDetail from './components/ProductDetail'
import CartPage from './components/CartPage'
import Steps from './components/Steps'
import ShippingPayments from './components/ShippingPayments'
import Visit from './components/Visit'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'

// Rutas en la URL: #/categoria/Camisetas · #/prenda/4 · #/carrito
const readRoute = () => {
  const hash = decodeURIComponent(window.location.hash)
  if (hash === '#/carrito') return { page: 'cart' }
  let match = hash.match(/^#\/prenda\/(\d+)$/)
  if (match) return { page: 'product', id: Number(match[1]) }
  match = hash.match(/^#\/categoria\/(.+)$/)
  if (match) return { page: 'category', name: match[1] }
  return { page: 'home' }
}

const routeKey = (r) =>
  r.page === 'product' ? `p${r.id}` : r.page === 'category' ? `c${r.name}` : r.page === 'cart' ? 'cart' : ''

export default function App() {
  const [route, setRoute] = useState(readRoute)

  useEffect(() => {
    const onHashChange = () => {
      const next = readRoute()
      setRoute(next)

      // Al volver al inicio, ir a la sección que pidió el enlace (o arriba)
      if (next.page === 'home') {
        const id = window.location.hash.slice(1)
        setTimeout(() => {
          if (id) document.getElementById(id)?.scrollIntoView()
          else window.scrollTo(0, 0)
        }, 0)
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // Al entrar a una categoría, prenda o al carrito, empezar arriba
  const key = routeKey(route)
  useEffect(() => {
    if (key) window.scrollTo(0, 0)
  }, [key])

  return (
    <>
      <Navbar />
      {route.page === 'cart' && <CartPage />}
      {route.page === 'product' && <ProductDetail key={route.id} id={route.id} />}
      {route.page === 'category' && <Products active={route.name} />}
      {route.page === 'home' && (
        <main>
          <Hero />
          <Categories />
          <Steps />
          <ShippingPayments />
          <Visit />
        </main>
      )}
      <Footer />
      <WhatsAppButton />
    </>
  )
}
