import { categories, business } from '../data'

export default function Categories() {
  return (
    <section id="categorias" className="section">
      <div className="container">
        <div className="section__head">
          <span className="eyebrow eyebrow--dark">Categorías</span>
          <h2>¿Qué pinta buscas hoy?</h2>
          <p className="section__lead">Cada prenda es un acierto. Elige una categoría y mira lo que tenemos.</p>
        </div>

        <div className="tiles">
          {categories.map((c) => (
            <a key={c.title} href={`#/categoria/${encodeURIComponent(c.title)}`} className="tile">
              <img className="tile__bg" src={c.photo} alt="" loading="lazy" />
              <span className="tile__title">{c.title}</span>
              <small>Ver prendas →</small>
            </a>
          ))}
        </div>

        <div className="center">
          <a href={business.tiktok} className="btn btn--dark" target="_blank" rel="noreferrer">
            Ver las novedades en TikTok
          </a>
        </div>
      </div>
    </section>
  )
}