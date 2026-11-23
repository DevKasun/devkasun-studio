import type { HTMLAttributes, PointerEvent } from 'react'
export function sheen(event: PointerEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty(
    '--mx',
    `${event.clientX - rect.left}px`,
  )
  event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`)
}
export function GlassPanel({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={`glass ${className}`} onPointerMove={sheen}>
      {children}
    </div>
  )
}
