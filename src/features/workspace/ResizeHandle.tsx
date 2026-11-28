import { useRef } from 'react'

export function ResizeHandle({ value, onChange }: { value: number; onChange: (width: number) => void }) {
  const drag = useRef({ startX: 0, startWidth: 0 })
  function resize(width: number) {
    onChange(Math.min(68, Math.max(25, Math.round(width))))
  }

  return (
    <div
      className="resize-handle"
      role="separator"
      tabIndex={0}
      aria-label="Resize preview"
      aria-orientation="vertical"
      aria-valuemin={25}
      aria-valuemax={68}
      aria-valuenow={value}
      onPointerDown={(event) => {
        event.preventDefault()
        event.currentTarget.focus()
        event.currentTarget.setPointerCapture(event.pointerId)
        drag.current = { startX: event.clientX, startWidth: value }
      }}
      onPointerMove={(event) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
        const room = event.currentTarget.parentElement!.clientWidth
        resize(drag.current.startWidth + (drag.current.startX - event.clientX) * 100 / room)
      }}
      onKeyDown={(event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
        event.preventDefault()
        if (event.key === 'Home') resize(25)
        else if (event.key === 'End') resize(68)
        else resize(value + (event.key === 'ArrowLeft' ? 3 : -3))
      }}
    />
  )
}
