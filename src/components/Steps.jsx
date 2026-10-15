import { steps } from '../data'

export default function Steps() {
  return (
    <section id="comprar" className="section section--dark">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <p className="label label--light">(04) Cómo comprar</p>
            <h2>Comprar es fácil</h2>
          </div>
        </div>

        <ol className="steps">
          {steps.map((s, i) => (
            <li key={s.title} className="step reveal" style={{ '--d': `${i * 0.1}s` }}>
              <span className="step__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
