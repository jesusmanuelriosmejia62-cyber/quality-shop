import { useRef } from 'react'
import { business, whatsappLink } from '../data'

export default function Hero() {
  const ref = useRef(null)

  const handleMove = (e) => {
    const el = ref.current
    if (!el) return
    const x = (e.clientX / window.innerWidth - 0.5) * 2
    const y = (e.clientY / window.innerHeight - 0.5) * 2
    el.style.setProperty('--mx', x.toFixed(3))
    el.style.setProperty('--my', y.toFixed(3))
  }

  return (
    <section id="inicio" className="hero" ref={ref} onMouseMove={handleMove}>
      <div className="hero__bg" aria-hidden="true">
        <img src="/logo.png" alt="" />
      </div>

      <div className="container hero__inner">
        <img className="hero__badge" src="/logo.png" alt="Logo de Quality Shop" />
        <p className="eyebrow">Ocaña · Envíos a toda Colombia</p>
        <h1>
          Tu estilo está a <span>un mensaje</span>
        </h1>
        <p className="hero__lead">
          Ropa que no falla, que no pasa de moda. Pintas que funcionan hoy, mañana y siempre.
        </p>
        <div className="hero__actions">
          <a href={whatsappLink()} className="btn" target="_blank" rel="noreferrer">
            Pedir por WhatsApp
          </a>
          <a href={business.tiktok} className="btn btn--ghost" target="_blank" rel="noreferrer">
            Ver lo nuevo en TikTok
          </a>
        </div>
      </div>
    </section>
  )
}