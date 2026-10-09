import { steps } from '../data'

export default function Steps() {
  return (
    <section id="comprar" className="section section--dark">
      <div className="container">
        <h2>Comprar es fácil</h2>
        <p className="section__lead">Tres pasos y tu pinta llega a donde estés.</p>
        <ol className="grid grid--3 steps">
          {steps.map((s, i) => (
            <li key={s.title} className="step">
              <span className="step__num">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}