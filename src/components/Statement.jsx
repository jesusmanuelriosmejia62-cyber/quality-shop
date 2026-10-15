import FloatingLogo from './FloatingLogo'

const facts = [
  ['Local', 'Tienda física en Ocaña, Norte de Santander.'],
  ['Envíos', 'Enviamos a toda Colombia.'],
  ['Pedidos', 'Eliges tu prenda, nos escribes y listo.'],
]

export default function Statement() {
  return (
    <section className="section statement has-floatlogo">
      <FloatingLogo className="floatlogo--right floatlogo--low" />
      <div className="container">
        <p className="label reveal">(03) La marca</p>
        <h2 className="statement__title reveal">
          Ropa que no falla.
          <em>Que no pasa de moda.</em>
        </h2>
        <p className="statement__lead reveal">
          Pintas que funcionan hoy, mañana y siempre. En Quality Shop cada prenda es un acierto.
        </p>

        <dl className="facts">
          {facts.map(([term, text], i) => (
            <div key={term} className="fact reveal" style={{ '--d': `${i * 0.08}s` }}>
              <dt>{term}</dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
