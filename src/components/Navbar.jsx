import { business, whatsappLink } from '../data'
import { useCart } from '../CartContext'

export default function Navbar() {
  const { count } = useCart()

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <a href="#inicio" className="navbar__brand">
          <img src="/logo.png" alt="" width="40" height="40" />
          <span>{business.name}</span>
        </a>
        <nav className="navbar__links">
          <a href="#categorias">Prendas</a>
          <a href="#comprar">Cómo comprar</a>
          <a href="#envios">Envíos</a>
          <a href="#visitanos">Visítanos</a>
        </nav>
        <div className="navbar__actions">
          <a href={whatsappLink()} className="btn btn--small" target="_blank" rel="noreferrer">
            Escríbenos
          </a>
          <a href="#/carrito" className="cart-link" aria-label={`Carrito, ${count} ${count === 1 ? 'prenda' : 'prendas'}`}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 7h12l-1 13H7L6 7z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            {count > 0 && <span className="cart-link__badge">{count}</span>}
          </a>
        </div>
      </div>
    </header>
  )
}