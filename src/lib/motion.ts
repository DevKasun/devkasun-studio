import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function startMotion() {
  gsap.registerPlugin(ScrollTrigger)
  const match = gsap.matchMedia()
  match.add('(prefers-reduced-motion: no-preference)', () => {
    const lenis = new Lenis({
      duration: 0.85,
      anchors: true,
      smoothWheel: true,
    })
    const tick = (seconds: number) => lenis.raf(seconds * 1000)
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(tick)
    const targets = document.querySelectorAll(
      '.reveal, .section h2, .section-head > p',
    )
    // Preserve SSR visibility, including for a visitor arriving at a deep anchor.
    targets.forEach((el) => {
      if (el.getBoundingClientRect().top < innerHeight) return
      gsap.from(el, {
        y: 17,
        opacity: 0,
        filter: 'blur(2px)',
        duration: 0.72,
        ease: 'power3.out',
        clearProps: 'transform,opacity,filter',
        scrollTrigger: { trigger: el, start: 'top 96%', once: true },
      })
    })
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  })
  return () => match.revert()
}
