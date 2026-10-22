import { useRef } from 'react'
import { whatsappLink } from '../data'
import Bear3D from './Bear3D'

export default function Hero() {
  const ref = useRef(null)

  // Foco de luz que sigue al cursor dentro del héroe
  const handleMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--sx', `${e.clientX - rect.left}px`)
    el.style.setProperty('--sy', `${e.clientY - rect.top}px`)
  }

  return (
    <section id="inicio" className="hero" ref={ref} onMouseMove={handleMove}>
      <span className="hero__spot" aria-hidden="true" />
      <span className="hero__photo" aria-hidden="true" style={{'--photo':`url(${import.meta.env.BASE_URL}fachada.jpg)`}}/>
      <span className="hero__ghost" aria-hidden="true">Quality</span>

      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="label label--light">Ocaña, N. de S. — Ropa de calidad</p>
          <h1 className="hero__title">
            <span>Viste a</span>
            <span>otro nivel</span>
          </h1>
          <p className="hero__lead">
            Las marcas que buscas, las prendas que quieres. Todo en Quality Shop.
          </p>
          <div className="hero__actions">
            <a href="#categorias" className="btn btn--light">Ver colección</a>
            <a href={whatsappLink()} className="btn btn--ghost-light" target="_blank" rel="noreferrer">
              Pedir por WhatsApp
            </a>
          </div>
        </div>
        <div className="hero__art">
          <Bear3D />
        </div>
      </div>

      <div className="container hero__foot">
        <span>Tienda física en Ocaña</span>
        <span>Envíos a toda Colombia</span>
        <span>Pedidos por WhatsApp</span>
      </div>
    </section>
  )
}
