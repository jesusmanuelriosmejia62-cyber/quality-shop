import { shipping, payments } from '../data'
import FloatingLogo from './FloatingLogo'

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
            <ul className="chips">
              {payments.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
