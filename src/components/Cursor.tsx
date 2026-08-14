import { useEffect, useRef } from 'react'

/**
 * Custom cursor: 12px orange dot + 32px lerped outline ring.
 * Ring grows to 48px and shows a label when hovering clickable elements.
 * Disabled on coarse pointers.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return
    document.body.classList.add('custom-cursor')

    const dot = dotRef.current!
    const ring = ringRef.current!
    const label = labelRef.current!
    let mx = -100
    let my = -100
    let rx = -100
    let ry = -100
    let raf = 0

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      const target = (e.target as HTMLElement | null)?.closest('a, button, [data-cursor]')
      const text = (e.target as HTMLElement | null)
        ?.closest('[data-cursor-label]')
        ?.getAttribute('data-cursor-label')
      if (target) {
        ring.style.width = '48px'
        ring.style.height = '48px'
        ring.style.borderColor = 'var(--accent-vs)'
      } else {
        ring.style.width = '32px'
        ring.style.height = '32px'
        ring.style.borderColor = 'var(--line-bright)'
      }
      label.textContent = text ?? ''
    }

    const loop = () => {
      rx += (mx - rx) * 0.15
      ry += (my - ry) * 0.15
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      document.body.classList.remove('custom-cursor')
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none' }}
        className="hidden h-3 w-3 rounded-full bg-vs md:block"
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9998,
          pointerEvents: 'none',
          width: 32,
          height: 32,
        }}
        className="hidden items-center justify-center rounded-full border md:flex"
      >
        <span ref={labelRef} className="font-mono text-[9px] text-vs" />
      </div>
    </>
  )
}
