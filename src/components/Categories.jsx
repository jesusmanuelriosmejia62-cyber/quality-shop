import { categories } from '../data'
import { categoryLink } from '../utils'
import Photo from './Photo'

export default function Categories() {
  return (
    <section id="categorias" className="section">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <p className="label">(01) Colección</p>
            <h2>Compra por categoría</h2>
          </div>
          <a href={categoryLink('Todo')} className="link-line">Ver todo</a>
        </div>

        <div className="tiles">
          {categories.map((c, i) => (
            <a
              key={c.title}
              href={categoryLink(c.title)}
              className="tile reveal"
              style={{ '--d': `${(i % 3) * 0.08}s` }}
            >
              <Photo className="tile__bg" src={c.photo} />
              <span className="tile__idx">{String(i + 1).padStart(2, '0')}</span>
              <span className="tile__title">{c.title}</span>
              <span className="tile__cta">Comprar <i aria-hidden="true">→</i></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
