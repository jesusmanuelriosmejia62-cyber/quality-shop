import { categories, products } from '../data'
import { categoryLink } from '../utils'
import ProductCard from './ProductCard'

export default function Products({ active }) {
  const category = categories.find((c) => c.title === active)
  const list = products.filter((p) => p.cats.includes(active))

  return (
    <main>
      <section className="banner">
        {category && <img className="banner__bg" src={category.photo} alt="" />}
        <div className="container banner__inner">
          <a href="#categorias" className="banner__back">← Volver a categorías</a>
          <h1>{active}</h1>
          <p>
            {list.length} {list.length === 1 ? 'prenda disponible' : 'prendas disponibles'}
          </p>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <nav className="pills" aria-label="Cambiar categoría">
            {categories.map((c) => (
              <a
                key={c.title}
                href={categoryLink(c.title)}
                className={`pill ${active === c.title ? 'on' : ''}`}
                aria-current={active === c.title ? 'page' : undefined}
              >
                {c.title}
              </a>
            ))}
          </nav>

          {list.length === 0 ? (
            <p className="empty">Pronto tendremos prendas en esta categoría. Escríbenos y te contamos qué hay.</p>
          ) : (
            <div className="products">
              {list.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}