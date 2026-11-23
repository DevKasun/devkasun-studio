import { useEffect, useRef } from 'react'

type Blade = {
  x: number
  root: number
  length: number
  width: number
  lean: number
  phase: number
  curl: number
  color: string
  seed: boolean
  highlight: boolean
}

// Generate the same rooted tufts on every visit. Stems within a tuft fan
// out together, while nearby tufts have independent heights and densities.
function meadow(width: number, height: number) {
  let seed = 831
  const random = () => {
    seed = (Math.imul(1664525, seed) + 1013904223) >>> 0
    return seed / 4294967296
  }
  const blades: Blade[] = []
  const greens = [
    ['#a2b581', '#bbc99b', '#98b088', '#c0cda1'],
    ['#789754', '#849e5b', '#66894f', '#a2ad65'],
    ['#52763d', '#617e3f', '#7f984c', '#93a658'],
  ]
  for (let layer = 0; layer < 3; layer++) {
    for (let x = -24; x < width + 24; x += 7 + random() * 16) {
      const heightVariation =
        0.68 + 0.2 * Math.sin(x * 0.012) + 0.12 * Math.sin(x * 0.041 + layer)
      const length =
        height * (0.42 + 0.47 * random()) * heightVariation * (1 - layer * 0.1)
      const count = 4 + Math.floor(random() * 6)
      const tuftLean = (random() - 0.46) * 0.38
      for (let i = 0; i < count; i++) {
        const spread = i / (count - 1) - 0.5
        const bladeLength =
          length * (0.41 + 0.7 * random()) * (1 - 0.22 * Math.abs(spread))
        const flower = random() < 0.025 && layer < 2
        blades.push({
          x: x + spread * (3 + random() * 6),
          root: height + 4 + random() * 6,
          length: flower
            ? Math.min(height * 0.84, bladeLength * 1.64)
            : bladeLength,
          width: flower ? 0.7 : (1.1 + 2.3 * random()) * (0.85 + 0.14 * layer),
          lean: (tuftLean + spread * (0.65 + random() * 0.4)) * bladeLength,
          phase: random() * Math.PI * 2,
          curl: (random() - 0.42) * bladeLength * 0.26,
          color: greens[layer][Math.floor(random() * 4)],
          seed: flower,
          highlight: layer > 0 && random() < 0.23,
        })
      }
    }
  }
  return blades
}

export function FooterGrass() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    let blades: Blade[] = [],
      width = 0,
      height = 0,
      frame = 0,
      previous = 0,
      time = 0,
      visible = false
    function paint() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      for (const b of blades) {
        // Wind travels along the verge. Free tips yield further than the
        // lower stems, and taller seed heads move slightly behind a gust.
        const gust =
          0.075 * Math.sin(time * 0.74 - b.x * 0.009) +
          0.044 * Math.sin(time * 1.08 - b.x * 0.016 + 0.6)
        const wind = b.length * (gust + 0.022 * Math.sin(time * 1.4 + b.phase))
        const tx = b.x + b.lean + wind,
          ty = b.root - b.length + Math.abs(wind) * 0.13
        const mx = b.x + b.lean * 0.22 + b.curl + wind * 0.28,
          my = b.root - b.length * 0.58
        ctx.fillStyle = b.color
        ctx.beginPath()
        ctx.moveTo(b.x - b.width * 0.5, b.root)
        ctx.quadraticCurveTo(mx - b.width * 0.25, my, tx, ty)
        ctx.quadraticCurveTo(
          mx + b.width * 0.6,
          my + b.width * 0.35,
          b.x + b.width * 0.5,
          b.root,
        )
        ctx.closePath()
        ctx.fill()
        if (b.highlight) {
          ctx.beginPath()
          ctx.moveTo(b.x, b.root)
          ctx.quadraticCurveTo(mx + 0.25, my, tx, ty)
          ctx.strokeStyle = 'rgba(213,226,157,.32)'
          ctx.lineWidth = 0.45
          ctx.stroke()
        }
        if (b.seed) {
          ctx.beginPath()
          ctx.moveTo(b.x, b.root)
          ctx.quadraticCurveTo(mx, my, tx, ty)
          ctx.strokeStyle = b.color
          ctx.lineWidth = 0.65
          ctx.stroke()
          const direction = Math.atan2(tx - mx, my - ty)
          ctx.save()
          ctx.translate(tx, ty)
          ctx.rotate(direction)
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.lineTo(0, -9)
          ctx.stroke()
          ctx.fillStyle = '#a9aa74'
          for (let k = 0; k < 5; k++) {
            const side = k % 2 === 0 ? 1 : -1
            ctx.beginPath()
            ctx.ellipse(
              side * 1.3,
              -k * 1.95,
              0.85,
              2.6,
              side * 0.55,
              0,
              Math.PI * 2,
            )
            ctx.fill()
          }
          ctx.restore()
        }
      }
    }
    function tick(now: number) {
      frame = 0
      if (!visible || document.hidden || motion.matches) return
      if (!previous || now - previous >= 1000 / 24) {
        if (previous) time += Math.min(0.12, (now - previous) / 1000)
        previous = now
        paint()
      }
      frame = requestAnimationFrame(tick)
    }
    function resume() {
      cancelAnimationFrame(frame)
      previous = 0
      if (!visible || document.hidden) return
      paint()
      if (!motion.matches) frame = requestAnimationFrame(tick)
    }
    function size() {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const ratio = Math.min(devicePixelRatio, 1.5)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      ctx?.setTransform(ratio, 0, 0, ratio, 0, 0)
      blades = meadow(width, height)
      if (visible) paint()
    }
    const resize = new ResizeObserver(size)
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      resume()
    })
    resize.observe(canvas)
    observer.observe(canvas)
    document.addEventListener('visibilitychange', resume)
    motion.addEventListener('change', resume)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      resize.disconnect()
      document.removeEventListener('visibilitychange', resume)
      motion.removeEventListener('change', resume)
    }
  }, [])
  return <canvas ref={ref} className="footer-grass" aria-hidden="true" />
}
