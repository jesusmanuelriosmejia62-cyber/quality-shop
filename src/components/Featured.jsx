import { products } from '../data'
import { categoryLink } from '../utils'
import ProductCard from './ProductCard'
import FloatingLogo from './FloatingLogo'

// Primero las prendas con etiqueta (Nuevo, Más vendido) y luego el resto hasta completar 8
const featured = [...products.filter((p) => p.tag), ...products.filter((p) => !p.tag)].slice(0, 8)

export default function Featured() {
  return (
    <section className="section section--soft has-floatlogo">
      <FloatingLogo className="floatlogo--right" />
      <div className="container">
        <div className="section-head reveal">
          <div>
            <p className="label">(02) Lo más buscado</p>
            <h2>Pintas que funcionan</h2>
          </div>
          <a href={categoryLink('Todo')} className="link-line">Ver todo</a>
        </div>
      </div>

      <div className="rail reveal">
        {featured.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  )
}
