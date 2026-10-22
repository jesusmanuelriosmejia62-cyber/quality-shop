import { useRef } from 'react'
import ProductCard from './ProductCard'

// Carrusel de prendas: tres a la vez, con una flecha a cada lado para pasar a las siguientes
export default function ProductRail({ products, renderItem }) {
  const railRef = useRef(null)
  const scrollRail = (dir) => {
    const el = railRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <div className="rail-wrap">
      <button type="button" className="rail-arrow rail-arrow--prev" onClick={() => scrollRail(-1)} aria-label="Anterior">‹</button>
      <div className="rail reveal" ref={railRef}>
        {products.map((p) => (renderItem ? renderItem(p) : <ProductCard key={p.id} p={p} />))}
      </div>
      <button type="button" className="rail-arrow rail-arrow--next" onClick={() => scrollRail(1)} aria-label="Siguiente">›</button>
    </div>
  )
}
