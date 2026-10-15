import { Suspense, lazy, useRef } from 'react'
import { whatsappLink } from '../data'

// El oso 3D pesa bastante: se descarga aparte para que el resto de la página cargue rápido
const BearScene = lazy(() => import('./BearScene'))

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
      <span className="hero__ghost" aria-hidden="true">Quality</span>

      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="label label--light">Ocaña, N. de S. — Ropa de calidad</p>
          <h1 className="hero__title">
            <span>Tu estilo</span>
            <span>está a</span>
            <span className="hero__fade">un mensaje</span>
          </h1>
          <p className="hero__lead">
            Ropa que no falla, que no pasa de moda. Pintas que funcionan hoy, mañana y siempre.
          </p>
          <div className="hero__actions">
            <a href="#categorias" className="btn btn--light">Ver colección</a>
            <a href={whatsappLink()} className="btn btn--ghost-light" target="_blank" rel="noreferrer">
              Pedir por WhatsApp
            </a>
          </div>
        </div>

        <div className="hero__art">
          <Suspense fallback={<div className="bear-scene" />}>
            <BearScene />
          </Suspense>
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
