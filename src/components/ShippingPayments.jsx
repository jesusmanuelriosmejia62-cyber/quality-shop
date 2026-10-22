import { useState } from 'react'
import { shipping, payments } from '../data'
import FloatingLogo from './FloatingLogo'

// Muestra el logo del método de pago; si el archivo no existe, muestra el nombre
function PaymentChip({ p }) {
  const [broken, setBroken] = useState(false)
  const showLogo = p.logo && !broken
  return (
    <li className="pay">
      {showLogo && (
        <img
          className={`pay__logo pay__logo--${p.shape || 'free'}`}
          src={`${import.meta.env.BASE_URL}${p.logo}`}
          alt=""
          onError={() => setBroken(true)}
        />
      )}
      <span>{p.name}</span>
    </li>
  )
}

export default function ShippingPayments() {
  return (
    <section id="envios" className="section has-floatlogo">
      <FloatingLogo className="floatlogo--left" />
      <div className="container">
        <div className="duo">
          <div className="duo__col reveal">
            <p className="label">(05) Envíos</p>
            <h2>Llegamos a donde estés</h2>
            <p className="strong">{shipping.coverage}</p>
            <ul className="list">
              {shipping.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>

          <div className="duo__col reveal" style={{ '--d': '0.1s' }}>
            <p className="label">(06) Pagos</p>
            <h2>Paga como prefieras</h2>
            <p className="strong">Métodos de pago disponibles.</p>
            <ul className="pays">
              {payments.map((p) => (
                <PaymentChip key={p.name} p={p} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
