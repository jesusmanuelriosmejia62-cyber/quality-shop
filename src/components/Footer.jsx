import { business, logo, whatsappLink } from '../data'
import { useCatalog } from '../CatalogContext'
import { categoryLink } from '../utils'

export default function Footer() {
  const { categories } = useCatalog()
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer__word" aria-hidden="true">Quality Shop</p>

        <div className="footer__grid">
          <div className="footer__brand">
            <img src={logo} alt="" width="64" height="64" />
            <p>
              Ropa de calidad que no pasa de moda.
              <br />
              {business.city}.
            </p>
          </div>

          <div>
            <p className="label label--light">Tienda</p>
            <ul>
              <li><a href={categoryLink('Todo')}>Ver todo</a></li>
              {categories.slice(0, 4).map((c) => (
                <li key={c.title}><a href={categoryLink(c.title)}>{c.title}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label label--light">Ayuda</p>
            <ul>
              <li><a href="#comprar">Cómo comprar</a></li>
              <li><a href="#envios">Envíos y pagos</a></li>
              <li><a href="#visitanos">Visítanos</a></li>
              <li><a href="#/carrito">Carrito</a></li>
              <li><a href="#/politicas/cambios">Cambios y devoluciones</a></li>
              <li><a href="#/politicas/privacidad">Privacidad</a></li>
              <li><a href="#/politicas/terminos">Términos y condiciones</a></li>
            </ul>
          </div>

          <div>
            <p className="label label--light">Síguenos</p>
            <ul>
              <li><a href={whatsappLink()} target="_blank" rel="noreferrer">WhatsApp</a></li>
              <li><a href={business.tiktok} target="_blank" rel="noreferrer">TikTok</a></li>
              {business.instagram && (
                <li><a href={business.instagram} target="_blank" rel="noreferrer">Instagram</a></li>
              )}
              {business.facebook && (
                <li><a href={business.facebook} target="_blank" rel="noreferrer">Facebook</a></li>
              )}
            </ul>
          </div>
        </div>

        <p className="footer__copy">
          <span>© {new Date().getFullYear()} {business.name}</span>
          <span>Todos los derechos reservados</span>
        </p>
      </div>
    </footer>
  )
}
