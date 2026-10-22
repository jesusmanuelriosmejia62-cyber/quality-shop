import { useCatalog } from '../CatalogContext'
import { categoryLink } from '../utils'
import ProductCard from './ProductCard'
import Photo from './Photo'
import FloatingLogo from './FloatingLogo'

export default function Products({ active }) {
  const { categories, products, loading } = useCatalog()
  const isAll = active === 'Todo'
  const all = categories.flatMap((c) => [c, ...(c.children ?? [])])
  const category = all.find((c) => c.title === active) ?? categories[0]
  // Si estás en una categoría con subtipos (o dentro de uno), se muestran como botones
  const parent = categories.find((c) => c.title === active || c.children?.some((k) => k.title === active))
  const subs = parent?.children ?? []
  const list = isAll ? products : products.filter((p) => p.cats.includes(active))

  return (
    <main>
      <section className="banner">
        {category && <Photo className="banner__bg" src={category.photo} />}
        <div className="container banner__inner">
          <a href="#categorias" className="banner__back">← Colección</a>
          <h1>{active}</h1>
          <p className="label label--light">
            {list.length} {list.length === 1 ? 'prenda' : 'prendas'}
          </p>
        </div>
      </section>

      <section className="section section--tight has-floatlogo">
        <FloatingLogo className="floatlogo--right floatlogo--low" />
        <div className="container">
          {!loading && (
          <nav className="pills" aria-label="Cambiar categoría">
            {['Todo', ...categories.map((c) => c.title)].map((title) => (
              <a
                key={title}
                href={categoryLink(title)}
                className={`pill ${active === title ? 'on' : ''}`}
                aria-current={active === title ? 'page' : undefined}
              >
                {title}
              </a>
            ))}
          </nav>
          )}

          {subs.length > 0 && (
            <nav className="pills pills--sub" aria-label="Tipos">
              <a href={categoryLink(parent.title)} className={`pill ${active === parent.title ? 'on' : ''}`}>Todas</a>
              {subs.map((k) => (
                <a key={k.id ?? k.title} href={categoryLink(k.title)} className={`pill ${active === k.title ? 'on' : ''}`}>{k.title}</a>
              ))}
            </nav>
          )}

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
