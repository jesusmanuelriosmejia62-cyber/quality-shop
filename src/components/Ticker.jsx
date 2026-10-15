// Cinta de texto que se desplaza sin parar. Repite la lista dos veces para que el bucle no tenga saltos.
export default function Ticker({ items, className = '' }) {
  const row = (hidden) => (
    <ul className="ticker__row" aria-hidden={hidden || undefined}>
      {items.map((text) => (
        <li key={text}>
          <span>{text}</span>
          <span className="ticker__x" aria-hidden="true">✕</span>
        </li>
      ))}
    </ul>
  )

  return (
    <div className={`ticker ${className}`}>
      <div className="ticker__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
