import { useState } from 'react'
import { products, sampleReviews } from '../data'
import { money, categoryLink } from '../utils'
import { useCart } from '../CartContext'
import ProductCard from './ProductCard'

const storageKey = (id) => `qs-reviews-${id}`

const loadReviews = (id) => {
  try {
    return JSON.parse(localStorage.getItem(storageKey(id))) ?? []
  } catch {
    return []
  }
}

const Stars = ({ value }) => (
  <span className="stars" aria-label={`${value} de 5 estrellas`}>
    {'★'.repeat(value)}
    <span className="stars__off">{'★'.repeat(5 - value)}</span>
  </span>
)

export default function ProductDetail({ id }) {
  const { add } = useCart()
  const product = products.find((p) => p.id === id)
  const [size, setSize] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [added, setAdded] = useState(false)
  const [mine, setMine] = useState(() => loadReviews(id))
  const [form, setForm] = useState({ name: '', rating: 5, text: '' })

  if (!product) {
    return (
      <main className="section">
        <div className="container center">
          <h2>No encontramos esta prenda</h2>
          <a href="#categorias" className="btn">Ver categorías</a>
        </div>
      </main>
    )
  }

  const reviews = [...mine, ...sampleReviews]
  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

  const sameCategory = products.filter((p) => p.id !== product.id && p.cats.some((c) => product.cats.includes(c)))
  const others = products.filter((p) => p.id !== product.id && !sameCategory.includes(p))
  const related = [...sameCategory, ...others].slice(0, 4)

  const needSize = () => {
    if (size) return true
    setShowHint(true)
    return false
  }

  const addToCart = () => {
    if (!needSize()) return
    add(product.id, size)
    setAdded(true)
  }

  const buyNow = () => {
    if (!needSize()) return
    add(product.id, size)
    window.location.hash = '/carrito'
  }

  const submitReview = (e) => {
    e.preventDefault()
    const name = form.name.trim()
    const text = form.text.trim()
    if (!name || !text) return
    const review = { name, rating: form.rating, text, date: new Date().toISOString().slice(0, 10) }
    const next = [review, ...mine]
    setMine(next)
    try {
      localStorage.setItem(storageKey(id), JSON.stringify(next))
    } catch {
      /* si el navegador no deja guardar, el comentario igual se ve en esta visita */
    }
    setForm({ name: '', rating: 5, text: '' })
  }

  const backCategory = product.cats[0]

  return (
    <main>
      <section className="section section--soft detail">
        <div className="container">
          <a href={categoryLink(backCategory)} className="crumb">← Volver a {backCategory}</a>

          <div className="detail__grid">
            <div className="detail__img">
              <img src={product.photo} alt={product.name} />
              {product.tag && <span className="product__tag">{product.tag}</span>}
            </div>

            <div className="detail__info">
              <p className="detail__cats">{product.cats.join(' · ')}</p>
              <h1>{product.name}</h1>
              <div className="detail__rating">
                <Stars value={Math.round(average)} />
                <span>{average.toFixed(1)} · {reviews.length} comentarios</span>
              </div>
              <p className="detail__price">{product.price ? money.format(product.price) : 'Consultar precio'}</p>
              <p className="detail__desc">{product.desc}</p>

              {product.details && (
                <ul className="detail__list">
                  {product.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              )}

              <p className="detail__label">Talla</p>
              <div className="sizes" role="radiogroup" aria-label="Elige tu talla">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={size === s}
                    className={`size ${size === s ? 'on' : ''}`}
                    onClick={() => {
                      setSize(s)
                      setShowHint(false)
                      setAdded(false)
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {showHint && <p className="detail__hint" role="alert">Elige una talla para continuar.</p>}

              <button type="button" className="btn btn--buy" onClick={buyNow}>
                Comprar ahora
              </button>
              <button type="button" className="btn btn--outline btn--buy" onClick={addToCart}>
                Agregar al carrito
              </button>
              {added && (
                <p className="detail__added" role="status">
                  ✓ Agregada al carrito. <a href="#/carrito">Ver carrito</a>
                </p>
              )}
              <p className="detail__note">Envíos a toda Colombia · Confirmamos disponibilidad por mensaje.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Comentarios</h2>
          <div className="reviews">
            <div className="reviews__list">
              {reviews.map((r, i) => (
                <article key={`${r.name}-${r.date}-${i}`} className="review">
                  <div className="review__top">
                    <strong>{r.name}</strong>
                    <Stars value={r.rating} />
                  </div>
                  <p>{r.text}</p>
                  <small>{r.date}</small>
                </article>
              ))}
            </div>

            <form className="review-form" onSubmit={submitReview}>
              <h3>Deja tu comentario</h3>
              <label>
                Tu nombre
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  maxLength={40}
                  required
                />
              </label>
              <div className="review-form__stars" role="radiogroup" aria-label="Calificación">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={form.rating === n}
                    aria-label={`${n} estrellas`}
                    className={n <= form.rating ? 'on' : ''}
                    onClick={() => setForm({ ...form, rating: n })}
                  >
                    ★
                  </button>
                ))}
              </div>
              <label>
                Comentario
                <textarea
                  rows="4"
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  maxLength={400}
                  required
                />
              </label>
              <button type="submit" className="btn btn--dark">Publicar comentario</button>
            </form>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <h2>También te puede gustar</h2>
          <div className="products">
            {related.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}