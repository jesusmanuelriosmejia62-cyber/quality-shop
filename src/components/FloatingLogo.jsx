import { useLogoCutoutUrl } from '../cutout'

// Logo grande, tenue y flotante para el fondo de una sección.
// La sección que lo use debe llevar la clase "has-floatlogo".
// className: "floatlogo--right" o "floatlogo--left" (lado) y opcionalmente "floatlogo--low" (más abajo).
export default function FloatingLogo({ className = 'floatlogo--right' }) {
  const url = useLogoCutoutUrl()
  if (!url) return null

  return (
    <div className={`floatlogo ${className}`} aria-hidden="true">
      <img src={url} alt="" />
    </div>
  )
}
