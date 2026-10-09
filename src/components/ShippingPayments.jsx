import { shipping, payments } from '../data'

export default function ShippingPayments() {
  return (
    <section id="envios" className="section">
      <div className="container grid grid--2">
        <div className="card card--big">
          <h2>Envíos</h2>
          <p className="strong">{shipping.coverage}</p>
          <ul className="list">
            {shipping.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
        <div className="card card--big">
          <h2>Métodos de pago</h2>
          <p className="strong">Paga como prefieras.</p>
          <ul className="chips">
            {payments.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}