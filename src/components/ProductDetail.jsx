import { useState } from 'react'
import { shipping } from '../data'
import { useCatalog } from '../CatalogContext'
import { money, categoryLink } from '../utils'
import { useCart } from '../CartContext'
import { useLogoCutoutUrl } from '../cutout'
import ProductRail from './ProductRail'
import FloatingLogo from './FloatingLogo'

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
  const { products, loading } = useCatalog()
  const watermark = useLogoCutoutUrl()
  const product = products.find((p) => p.id === id)
  const [size, setSize] = useState('')
  const [colorName, setColorName] = useState('')
  const [photoIdx, setPhotoIdx] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [added, setAdded] = useState(false)
  const [mine, setMine] = useState(() => loadReviews(id))
  const [form, setForm] = useState({ name: '', rating: 5, text: '' })

  if (!product && loading) return <main className="section" aria-busy="true" />

  if (!product) {
    return (
      <main className="section">
        <div className="container center">
          <h2>No encontramos esta prenda</h2>
          <a href="#categorias" className="btn">Ver colección</a>
        </div>
      </main>
    )
  }

  const colors = product.colors ?? []
  const color = colors.find((c) => c.name === colorName) ?? colors[0]
  const gallery = color?.photos?.length ? color.photos : product.photos?.length ? product.photos : [color?.photo ?? product.photo]
  const mainPhoto = gallery[Math.min(photoIdx, gallery.length - 1)] ?? product.photo
  const soldOut = !!product.soldOut
  const outOfStock = (s) => product.stock && product.stock[s] <= 0

  const reviews = mine
  const average = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

  const sameCategory = products.filter((p) => p.id !== product.id && p.cats.some((c) => product.cats.includes(c)))
  const others = products.filter((p) => p.id !== product.id && !sameCategory.includes(p))
  const related = [...sameCategory, ...others].slice(0, 8)

  const needSize = () => {
    if (soldOut) return false
    if (size) return true
    setShowHint(true)
    document.getElementById('sizes')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return false
  }

  const addToCart = () => {
    if (!needSize()) return
    add(product.id, size, 1, color?.name ?? '')
    setAdded(true)
  }

  const buyNow = () => {
    if (!needSize()) return
    add(product.id, size, 1, color?.name ?? '')
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
      <section className="detail">
        {watermark && (
          <div className="detail__bg" aria-hidden="true">
            <img src={watermark} alt="" />
          </div>
        )}
        <div className="container">
          <nav className="crumbs" aria-label="Ruta">
            <a href="#categorias">Colección</a>
            <span aria-hidden="true">/</span>
            <a href={categoryLink(backCategory)}>{backCategory}</a>
            <span aria-hidden="true">/</span>
            <span>{product.name}</span>
          </nav>

          <div className="detail__grid">
            <div className={`detail__gallery ${gallery.length > 1 ? 'detail__gallery--thumbs' : ''}`}>
              {gallery.length > 1 && (
                <div className="detail__thumbs" role="list" aria-label="Más fotos de la prenda">
                  {gallery.map((g, i) => (
                    <button key={g} type="button" role="listitem" className={i === photoIdx ? 'on' : ''} onClick={() => setPhotoIdx(i)} aria-label={`Foto ${i + 1}`}>
                      <img src={g} alt="" />
                    </button>
                  ))}
                </div>
              )}
              <div className="detail__img">
                <img className="photo" src={mainPhoto || undefined} alt={`${product.name}${color ? ` - ${color.name}` : ''}`} />
                {soldOut ? <span className="product__tag product__tag--out">Agotado</span> : product.tag && <span className="product__tag">{product.tag}</span>}
              </div>
            </div>

            <div className="detail__info">
              <p className="label">{product.cats.join(' · ')}</p>
              <h1>{product.name}</h1>
              {reviews.length > 0 && (
                <div className="detail__rating">
                  <Stars value={Math.round(average)} />
                  <span>{average.toFixed(1)} · {reviews.length} comentarios</span>
                </div>
              )}
              <p className="detail__price">{product.price ? money.format(product.price) : 'Consultar precio'}{soldOut && <span className="detail__out"> · Agotado</span>}</p>
              <p className="detail__desc">{product.desc}</p>

              {colors.length > 0 && (
                <>
                  <p className="detail__label">
                    Color <span className="detail__color-name">{color.name}</span>
                  </p>
                  <div className="swatches" role="radiogroup" aria-label="Elige el color">
                    {colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        role="radio"
                        aria-checked={color.name === c.name}
                        aria-label={c.name}
                        title={c.name}
                        className={`swatch ${color.name === c.name ? 'on' : ''}`}
                        onClick={() => {
                          setColorName(c.name)
                          setPhotoIdx(0)
                          setAdded(false)
                        }}
                      >
                        <span style={{ background: c.hex }} />
                      </button>
                    ))}
                  </div>
                </>
              )}

              <p className="detail__label" id="sizes">Talla</p>
              <div className="sizes" role="radiogroup" aria-label="Elige tu talla">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={size === s}
                    disabled={outOfStock(s)}
                    title={outOfStock(s) ? 'Talla agotada' : undefined}
                    className={`size ${size === s ? 'on' : ''} ${outOfStock(s) ? 'size--out' : ''} ${showHint && !size ? 'size--alert' : ''}`}
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

              <div className="detail__buy">
                <button type="button" className="btn btn--buy" onClick={buyNow} disabled={soldOut}>
                  {soldOut ? 'Agotado' : 'Comprar ahora'}
                </button>
                <button type="button" className="btn btn--outline btn--buy" onClick={addToCart} disabled={soldOut}>
                  Agregar al carrito
                </button>
              </div>
              {added && (
                <p className="detail__added" role="status">
                  ✓ Agregada al carrito. <a href="#/carrito">Ver carrito</a>
                </p>
              )}

              <div className="accordion">
                {product.details && (
                  <details open>
                    <summary>Detalles</summary>
                    <ul className="detail__list">
                      {product.details.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  </details>
                )}
                <details>
                  <summary>Envíos</summary>
                  <p>{shipping.coverage} Confirmamos disponibilidad, costo y tiempos por WhatsApp antes de despachar.</p>
                </details>
                <details>
                  <summary>Cómo pedir</summary>
                  <p>Elige tu talla, agrega al carrito y completa tus datos. Te llevamos a WhatsApp con el pedido listo para enviar.</p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
      <section className="section section--soft has-floatlogo">
        <FloatingLogo className="floatlogo--right" />
        <div className="container">
          <div className="section-head">
            <div>
              <p className="label">Completa tu pinta</p>
              <h2>También te puede gustar</h2>
            </div>
          </div>
        </div>
        <ProductRail products={related} />
      </section>
      )}

      <section className="section has-floatlogo">
        <FloatingLogo className="floatlogo--left" />
        <div className="container">
          <h2>Comentarios</h2>
          <div className="reviews">
            <div className="reviews__list">
              {reviews.length === 0 && <p className="empty">Todavía no hay comentarios. ¡Sé el primero!</p>}
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
              <button type="submit" className="btn">Publicar comentario</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
