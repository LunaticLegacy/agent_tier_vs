import { useEffect, useRef } from 'react'
import { useInView, animate } from 'framer-motion'

export default function CountUp({
  to,
  duration = 1.2,
  decimals = 0,
  className,
}: {
  to: number
  duration?: number
  decimals?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  useEffect(() => {
    if (!inView || !ref.current) return
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = v.toFixed(decimals)
      },
    })
    return () => controls.stop()
  }, [inView, to, duration, decimals])

  return (
    <span ref={ref} className={className}>
      0
    </span>
  )
}
