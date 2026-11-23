import { useEffect, useRef } from 'react'
import { site } from '../../config/site'
import { world } from '../../lib/store'

export function World() {
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const element = canvas.current!,
      anchor = document.getElementById('scene-anchor')!
    let gone = false,
      dispose: (() => void) | undefined
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('main section[id]'),
    )
    const glow = document.querySelector<HTMLElement>('.cursor-glow')
    const sync = () => {
      world.progress = Math.min(
        1,
        Math.max(
          0,
          scrollY /
            Math.max(1, document.documentElement.scrollHeight - innerHeight),
        ),
      )
      world.section =
        sections
          .filter(
            (section) =>
              section.getBoundingClientRect().top < innerHeight * 0.48,
          )
          .at(-1)?.id ?? 'hero'
    }
    const pointer = (e: PointerEvent) => {
      world.pointer.x = (e.clientX / innerWidth) * 2 - 1
      world.pointer.y = 1 - (e.clientY / innerHeight) * 2
      world.heroHover =
        e.target instanceof Element && !!e.target.closest('#hero')
      if (glow && e.pointerType === 'mouse')
        glow.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`
    }
    sync()
    window.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('pointermove', pointer, { passive: true })
    const preferences = matchMedia('(prefers-reduced-motion: reduce)')
    let generation = 0
    let probe: Worker | undefined
    const accelerated = () =>
      new Promise<boolean>((resolve) => {
        probe = new Worker(new URL('./probe.worker.ts', import.meta.url), {
          type: 'module',
        })
        const finish = (supported: boolean) => {
          probe?.terminate()
          probe = undefined
          resolve(supported)
        }
        probe.onmessage = (event) => finish(event.data === true)
        probe.onerror = () => finish(false)
        probe.postMessage(null)
      })
    const load = async () => {
      const version = ++generation
      dispose?.()
      dispose = undefined
      if (preferences.matches && site.scene.centerpiece === 'sculpture') return
      try {
        await Promise.all([
          document.fonts.ready,
          anchor
            .querySelector('img')
            ?.decode()
            .catch(() => {}),
        ])
        if (gone || version !== generation) return
        // Software rasterizers can spend seconds compiling even a single glass
        // frame. Keep the prerendered composition on those machines.
        if (!(await accelerated()) || gone || version !== generation) return
        const context = element.getContext('webgl2', {
          alpha: true,
          antialias: true,
          powerPreference: 'low-power',
          failIfMajorPerformanceCaveat: true,
        })
        if (!context) return
        const { mountScene, loadLighting } = await import('./Scene')
        const lighting = await loadLighting()
        if (!gone && version === generation)
          dispose = mountScene(element, anchor, context, lighting)
      } catch (error) {
        if (import.meta.env.DEV) console.debug('Studio scene fallback', error)
        document.documentElement.classList.remove('world-ready')
      }
    }
    let timer: number | undefined
    const inputEvents = ['pointerdown', 'scroll', 'keydown'] as const
    const engage = () => {
      for (const event of inputEvents) window.removeEventListener(event, engage)
      timer = window.setTimeout(load, 100)
    }
    if (matchMedia('(pointer: coarse), (max-width: 700px)').matches) {
      // Preserve mobile bandwidth and battery while a visitor reads the hero.
      // The first gesture enables the same world with its five-card setup.
      for (const event of inputEvents)
        window.addEventListener(event, engage, { passive: true })
    } else {
      timer = window.setTimeout(load, 400)
    }
    preferences.addEventListener('change', load)
    return () => {
      gone = true
      probe?.terminate()
      preferences.removeEventListener('change', load)
      clearTimeout(timer)
      for (const event of inputEvents) window.removeEventListener(event, engage)
      dispose?.()
      window.removeEventListener('scroll', sync)
      window.removeEventListener('pointermove', pointer)
    }
  }, [])
  return (
    <>
      <canvas className="world" ref={canvas} aria-hidden="true" />
      <div className="cursor-glow" aria-hidden="true" />
    </>
  )
}
