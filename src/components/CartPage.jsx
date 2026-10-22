import { useState } from 'react'
import { payments, whatsappLink } from '../data'
import { useCatalog } from '../CatalogContext'
import { money } from '../utils'
import { useCart } from '../CartContext'

const EMPTY_FORM = {
  name: '',
  phone: '',
  country: 'Colombia',
  state: '',
  city: '',
  address: '',
  reference: '',
  payment: '',
  notes: '',
  accept: false,
}

const validate = (f) => {
  const errors = {}
  if (f.name.trim().length < 3) errors.name = 'Escribe tu nombre completo.'
  const digits = f.phone.replace(/\D/g, '')
  if (digits.length < 7 || digits.length > 15) errors.phone = 'Escribe un número de celular válido.'
  if (!f.country.trim()) errors.country = 'Escribe tu país.'
  if (!f.state.trim()) errors.state = 'Escribe tu departamento o estado.'
  if (!f.city.trim()) errors.city = 'Escribe tu ciudad o municipio.'
  if (f.address.trim().length < 5) errors.address = 'Escribe tu dirección completa.'
  if (!f.payment) errors.payment = 'Elige un método de pago.'
  if (!f.accept) errors.accept = 'Debes aceptar la política de privacidad para continuar.'
  return errors
}

const buildMessage = (lines, f, total, allPriced) => {
  const items = lines
    .map((l, i) => {
      const price = l.product.price ? ` - ${money.format(l.product.price * l.qty)}` : ' - precio por confirmar'
      return `${i + 1}. ${l.product.name} | Talla ${l.size}${l.color ? ` | Color ${l.color}` : ''} | Cant. ${l.qty}${price}`
    })
    .join('\n')

  const totalLine = allPriced ? money.format(total) : 'por confirmar (hay prendas sin precio)'

  return [
    '*Nuevo pedido - Quality Shop Col* 🛍️',
    '',
    '*Prendas*',
    items,
    '',
    `*Total:* ${totalLine}`,
    '',
    '*Datos de entrega*',
    `Nombre: ${f.name.trim()}`,
    `Celular: ${f.phone.trim()}`,
    `País: ${f.country.trim()}`,
    `Departamento: ${f.state.trim()}`,
    `Ciudad: ${f.city.trim()}`,
    `Dirección: ${f.address.trim()}`,
    f.reference.trim() && `Barrio / referencia: ${f.reference.trim()}`,
    `Método de pago: ${f.payment}`,
    f.notes.trim() && `Notas: ${f.notes.trim()}`,
  ]
    .filter((line) => line !== false && line !== undefined)
    .join('\n')
}

function Field({ id, label, error, optional, children }) {
  return (
    <div className={`field ${error ? 'field--error' : ''}`}>
      <label htmlFor={id}>
        {label} {optional && <span className="field__opt">(opcional)</span>}
      </label>
      {children}
      {error && <p className="field__error" role="alert">{error}</p>}
    </div>
  )
}

export default function CartPage() {
  const { items, setQty, remove, clear, maxQty } = useCart()
  const { products } = useCatalog()
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [sentUrl, setSentUrl] = useState('')

  const lines = items
    .map((i) => ({ ...i, product: products.find((p) => p.id === i.id) }))
    .filter((l) => l.product)

  const allPriced = lines.length > 0 && lines.every((l) => l.product.price)
  const total = lines.reduce((sum, l) => sum + (l.product.price || 0) * l.qty, 0)
  const units = lines.reduce((sum, l) => sum + l.qty, 0)

  const errors = validate(form)
  const shown = (name) => (submitted ? errors[name] : undefined)

  const bind = (name) => ({
    id: `f-${name}`,
    value: form[name],
    onChange: (e) => setForm({ ...form, [name]: e.target.value }),
    'aria-invalid': shown(name) ? 'true' : undefined,
  })

  const submit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    const first = Object.keys(errors)[0]
    if (first) {
      document.getElementById(`f-${first}`)?.focus()
      return
    }
    const url = whatsappLink(buildMessage(lines, form, total, allPriced))
    setSentUrl(url)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (lines.length === 0) {
    return (
      <main className="section section--soft">
        <div className="container cart-empty">
          <p className="label">Carrito</p>
          <h1>Tu carrito está vacío</h1>
          <p>Mira la colección y elige las prendas que más te gusten.</p>
          <a href="#categorias" className="btn">Ver colección</a>
        </div>
      </main>
    )
  }

  return (
    <main className="section section--soft cart">
      <div className="container">
        <a href="#categorias" className="crumb">← Seguir comprando</a>
        <h1 className="cart__title">Tu carrito <small>{units} {units === 1 ? 'prenda' : 'prendas'}</small></h1>

        <div className="cart__layout">
          <div className="cart__main">
            <ul className="cart__items">
              {lines.map((l) => (
                <li key={l.key} className="cart-item">
                  <a href={`#/prenda/${l.product.id}`} className="cart-item__img" aria-label={`Ver ${l.product.name}`}>
                    <img src={l.product.photo || undefined} alt="" />
                  </a>

                  <div className="cart-item__info">
                    <a href={`#/prenda/${l.product.id}`} className="cart-item__name">{l.product.name}</a>
                    <p>Talla: <strong>{l.size}</strong>{l.color && <> · Color: <strong>{l.color}</strong></>}</p>
                    <p className="cart-item__unit">
                      {l.product.price ? money.format(l.product.price) : 'Precio por confirmar'}
                    </p>
                  </div>

                  <div className="cart-item__side">
                    <div className="qty" aria-label={`Cantidad de ${l.product.name}`}>
                      <button
                        type="button"
                        onClick={() => setQty(l.key, l.qty - 1)}
                        disabled={l.qty <= 1}
                        aria-label="Quitar una unidad"
                      >
                        −
                      </button>
                      <span aria-live="polite">{l.qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(l.key, l.qty + 1)}
                        disabled={l.qty >= maxQty}
                        aria-label="Agregar una unidad"
                      >
                        +
                      </button>
                    </div>
                    {l.product.price && (
                      <p className="cart-item__total">{money.format(l.product.price * l.qty)}</p>
                    )}
                    <button type="button" className="cart-item__remove" onClick={() => remove(l.key)}>
                      Quitar
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <form id="checkout-form" className="checkout" onSubmit={submit} noValidate>
              <h2>Datos de entrega</h2>
              <p className="checkout__lead">Con esto armamos tu pedido y te lo enviamos por WhatsApp.</p>

              <div className="checkout__grid">
                <Field id="f-name" label="Nombre completo" error={shown('name')}>
                  <input type="text" autoComplete="name" {...bind('name')} />
                </Field>
                <Field id="f-phone" label="Celular" error={shown('phone')}>
                  <input type="tel" inputMode="tel" autoComplete="tel" placeholder="300 123 4567" {...bind('phone')} />
                </Field>
                <Field id="f-country" label="País" error={shown('country')}>
                  <input type="text" autoComplete="country-name" {...bind('country')} />
                </Field>
                <Field id="f-state" label="Departamento" error={shown('state')}>
                  <input type="text" autoComplete="address-level1" {...bind('state')} />
                </Field>
                <Field id="f-city" label="Ciudad / municipio" error={shown('city')}>
                  <input type="text" autoComplete="address-level2" {...bind('city')} />
                </Field>
                <Field id="f-payment" label="Método de pago" error={shown('payment')}>
                  <select {...bind('payment')}>
                    <option value="">Elige uno</option>
                    {payments.map((p) => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </Field>
                <div className="checkout__full">
                  <Field id="f-address" label="Dirección" error={shown('address')}>
                    <input type="text" autoComplete="street-address" placeholder="Calle, número, apto..." {...bind('address')} />
                  </Field>
                </div>
                <div className="checkout__full">
                  <Field id="f-reference" label="Barrio / punto de referencia" optional>
                    <input type="text" {...bind('reference')} />
                  </Field>
                </div>
                <div className="checkout__full">
                  <Field id="f-notes" label="Notas del pedido" optional>
                    <textarea rows="3" maxLength={300} {...bind('notes')} />
                  </Field>
                </div>
                <div className="checkout__full">
                  <div className={`field field--check ${shown('accept') ? 'field--error' : ''}`}>
                    <label>
                      <input
                        type="checkbox"
                        id="f-accept"
                        checked={form.accept}
                        onChange={(e) => setForm({ ...form, accept: e.target.checked })}
                        aria-invalid={shown('accept') ? 'true' : undefined}
                      />
                      <span>
                        Autorizo el tratamiento de mis datos según la{' '}
                        <a href="#/politicas/privacidad" target="_blank" rel="noreferrer">política de privacidad</a> y acepto los{' '}
                        <a href="#/politicas/terminos" target="_blank" rel="noreferrer">términos</a> y la{' '}
                        <a href="#/politicas/cambios" target="_blank" rel="noreferrer">política de cambios</a>.
                      </span>
                    </label>
                    {shown('accept') && <p className="field__error" role="alert">{shown('accept')}</p>}
                  </div>
                </div>
              </div>
            </form>
          </div>

          <aside className="summary">
            <h2>Resumen</h2>
            <dl>
              <div><dt>Prendas</dt><dd>{units}</dd></div>
              <div>
                <dt>Subtotal</dt>
                <dd>{allPriced ? money.format(total) : 'Por confirmar'}</dd>
              </div>
              <div><dt>Envío</dt><dd>A convenir</dd></div>
            </dl>
            <p className="summary__total">
              <span>Total</span>
              <strong>{allPriced ? money.format(total) : 'Por confirmar'}</strong>
            </p>
            {!allPriced && (
              <p className="summary__note">Algunas prendas no tienen precio publicado: te lo confirmamos por WhatsApp.</p>
            )}

            <button type="submit" form="checkout-form" className="btn btn--buy">
              Pedir por WhatsApp
            </button>
            <p className="summary__note">
              Se abrirá WhatsApp con tu pedido listo. No pagas nada en esta página: confirmamos disponibilidad, envío y pago por mensaje.
            </p>

            {sentUrl && (
              <p className="summary__sent" role="status">
                ✓ Preparamos tu pedido. Si WhatsApp no se abrió,{' '}
                <a href={sentUrl} target="_blank" rel="noreferrer">toca aquí</a>.
              </p>
            )}

            <button type="button" className="summary__clear" onClick={clear}>
              Vaciar carrito
            </button>
          </aside>
        </div>
      </div>
    </main>
  )
}