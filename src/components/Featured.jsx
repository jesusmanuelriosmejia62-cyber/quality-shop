import { useCatalog } from '../CatalogContext'
import { categoryLink } from '../utils'
import ProductRail from './ProductRail'
import FloatingLogo from './FloatingLogo'

// Un look: foto, título y texto corto. Si tiene una prenda enlazada, lleva a ella; si no, a la colección
function LookCard({ l }) {
  const href = l.productId ? `#/prenda/${l.productId}` : categoryLink('Todo')
  return (
    <a key={l.id} href={href} className="product">
      <div className="product__img">
        <img className="photo" src={l.photo || undefined} alt={l.title} loading="lazy" />
      </div>
      <div className="product__body">
        <p className="product__cat">Look</p>
        <h3>{l.title}</h3>
        {l.desc && <p className="product__sizes">{l.desc}</p>}
      </div>
    </a>
  )
}

export default function Featured() {
  const { looks } = useCatalog()
  if (looks.length === 0) return null
  return (
    <section className="section section--soft has-floatlogo">
      <FloatingLogo className="floatlogo--right" />
      <div className="container">
        <div className="section-head reveal">
          <div>
            <p className="label">(02) Lo más buscado</p>
            <h2>Looks aprobados por nosotros</h2>
          </div>
          <a href={categoryLink('Todo')} className="link-line">Ver todo</a>
        </div>
      </div>

      <ProductRail products={looks} renderItem={(l) => <LookCard key={l.id} l={l} />} />
    </section>
  )
}
