import { useState } from 'react'
import { logo, whatsappLink } from '../data'
import { useCatalog } from '../CatalogContext'
import { categoryLink } from '../utils'
import { useCart } from '../CartContext'
import Ticker from './Ticker'
import Photo from './Photo'

const links = [
  ['#comprar', 'Cómo comprar'],
  ['#envios', 'Envíos'],
  ['#visitanos', 'Visítanos'],
]

const announcement = ['Envíos a toda Colombia', 'Ropa de calidad', 'Tu estilo está a un mensaje', 'Pide por WhatsApp']

export default function Navbar() {
  const { categories } = useCatalog()
  const { count } = useCart()
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState(0)
  const [megaClosed, setMegaClosed] = useState(false)
  const close = () => setOpen(false)

  const menuItems = [{ title: 'Todo', photo: categories[0]?.photo ?? '' }, ...categories]

  return (
    <>
      <div className="topbar">
        <Ticker items={announcement} />
      </div>

      <header className="navbar">
        <div className="navbar__inner">
          <button
            type="button"
            className="navbar__burger"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>

          <nav className="navbar__links" aria-label="Principal">
            <div
              className={`navbar__item ${megaClosed ? 'is-closed' : ''}`}
              onMouseLeave={() => setMegaClosed(false)}
            >
              <a href="#categorias" className="navbar__trigger" aria-haspopup="true">
                Colección <i aria-hidden="true">▾</i>
              </a>

              <div className="mega">
                <div className="container mega__inner">
                  <ul className="mega__list">
                    {menuItems.map((c, i) => (
                      <li key={c.title}>
                        <a
                          href={categoryLink(c.title)}
                          className={preview === i ? 'on' : ''}
                          onMouseEnter={() => setPreview(i)}
                          onFocus={() => setPreview(i)}
                          onClick={() => setMegaClosed(true)}
                        >
                          <span>{c.title}</span>
                          <small>{String(i).padStart(2, '0')}</small>
                        </a>
                      </li>
                    ))}
                  </ul>
                  <div className="mega__preview" aria-hidden="true">
                    <Photo key={preview} className="mega__img" src={menuItems[preview].photo} />
                  </div>
                </div>
              </div>
            </div>

            {links.map(([href, text]) => (
              <a key={href} href={href}>{text}</a>
            ))}
          </nav>

          <a href="#inicio" className="navbar__brand" onClick={close}>
            <img src={logo} alt="" width="40" height="40" />
            <span>Quality Shop</span>
          </a>

          <div className="navbar__actions">
            <a href={whatsappLink()} className="navbar__wa" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a
              href="#/carrito"
              className="cart-link"
              aria-label={`Carrito, ${count} ${count === 1 ? 'prenda' : 'prendas'}`}
              onClick={close}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 7h12l-1 13H7L6 7z" />
                <path d="M9 7a3 3 0 0 1 6 0" />
              </svg>
              {count > 0 && <span className="cart-link__badge">{count}</span>}
            </a>
          </div>
        </div>

        {open && (
          <nav className="navbar__menu" aria-label="Menú móvil">
            <p className="label label--light">Colección</p>
            <div className="navbar__sub">
              {menuItems.map((c) => (
                <a key={c.title} href={categoryLink(c.title)} onClick={close}>{c.title}</a>
              ))}
            </div>
            {links.map(([href, text]) => (
              <a key={href} href={href} onClick={close}>{text}</a>
            ))}
            <a href={whatsappLink()} target="_blank" rel="noreferrer" onClick={close}>WhatsApp</a>
          </nav>
        )}
      </header>
    </>
  )
}
