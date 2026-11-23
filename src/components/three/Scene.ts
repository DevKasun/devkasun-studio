import * as T from 'three'
import roomUrl from './studio.room?url'
import { site } from '../../config/site'
import { world } from '../../lib/store'
import { pearl, cards, orbit, serviceShapes, shadow } from './Objects'

// Preconvolved from three.js RoomEnvironment at 64px per cube face.
// Keeping the roughness levels offline avoids compiling the PMREM shader on load.
export async function loadLighting() {
  const response = await fetch(roomUrl)
  if (!response.ok || !response.body)
    throw new Error('Studio lighting unavailable')
  // Some hosts transparently decode .gz assets. Accept both transport forms.
  const body = await response.arrayBuffer()
  const signature = new Uint8Array(body, 0, 2)
  const decoded =
    signature[0] === 0x1f && signature[1] === 0x8b
      ? await new Response(
          new Blob([body])
            .stream()
            .pipeThrough(new DecompressionStream('gzip')),
        ).arrayBuffer()
      : body
  if (decoded.byteLength !== 336 * 256 * 8)
    throw new Error('Incomplete studio lighting')
  return new Uint16Array(decoded)
}

export function mountScene(
  canvas: HTMLCanvasElement,
  anchor: HTMLElement,
  context: WebGL2RenderingContext,
  lighting: Uint16Array<ArrayBuffer>,
) {
  const renderer = new T.WebGLRenderer({
    canvas,
    context,
    alpha: true,
    antialias: true,
    powerPreference: 'low-power',
  })
  const mobile =
    matchMedia('(max-width: 700px), (pointer: coarse)').matches ||
    navigator.hardwareConcurrency <= 4
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  const scene = new T.Scene()
  const camera = new T.OrthographicCamera(-1, 1, 1, -1, 1, 6000)
  camera.position.z = 2400
  renderer.outputColorSpace = T.SRGBColorSpace
  renderer.toneMapping = T.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.97
  renderer.setClearColor(0, 0)
  renderer.transmissionResolutionScale = 0.35
  let dpr = Math.min(devicePixelRatio, mobile ? 1.25 : 1.75)
  renderer.setPixelRatio(dpr)
  const environment = new T.DataTexture(
    lighting,
    336,
    256,
    T.RGBAFormat,
    T.HalfFloatType,
  )
  environment.mapping = T.CubeUVReflectionMapping
  environment.minFilter = environment.magFilter = T.LinearFilter
  environment.needsUpdate = true
  scene.environment = environment
  scene.add(new T.HemisphereLight(0xfffefa, 0x79746c, 0.58))
  const key = new T.DirectionalLight(0xfff9ec, 2.1)
  key.position.set(-3, 5, 5)
  scene.add(key)
  const rim = new T.DirectionalLight(0xffffff, 1.05)
  rim.position.set(4, 1, -3)
  scene.add(rim)
  const stage = new T.Group(),
    assembly = new T.Group(),
    center = new T.Group()
  scene.add(stage)
  stage.add(assembly)
  assembly.add(center)
  const sculpture = pearl(mobile)
  sculpture.rotation.set(0.23, -0.17, -0.37)
  center.add(sculpture)
  let disposed = false
  if (site.scene.centerpiece === 'portrait') {
    new T.TextureLoader().load(
      site.scene.portrait,
      (map) => {
        if (disposed) {
          map.dispose()
          return
        }
        map.colorSpace = T.SRGBColorSpace
        const height = 3.2
        const portrait = new T.Mesh(
          new T.PlaneGeometry(
            (height * map.image.width) / map.image.height,
            height,
          ),
          new T.MeshBasicMaterial({
            map,
            transparent: true,
            alphaTest: 0.02,
            depthWrite: false,
            toneMapped: false,
          }),
        )
        center.add(portrait)
        sculpture.visible = false
        wake()
      },
      undefined,
      () => {
        /* Keep the ceramic centerpiece if no portrait is available. */
      },
    )
  }
  const ring = cards(mobile),
    ribbon = orbit(mobile),
    floor = shadow(),
    shapes = serviceShapes(mobile)
  assembly.add(...ring, ribbon, floor)
  stage.add(...shapes)
  let width = 0,
    height = 0,
    heroLeft = 0,
    heroTop = 0,
    heroWidth = 0
  let frame = 0,
    last = 0,
    elapsed = 0,
    angle = 0.36,
    lowFrames = 0,
    samples = 0,
    inView = true
  let presence = 1,
    shapeStrength = 0,
    path = 0,
    first = true
  const goal = new T.Vector3()
  const clamp = T.MathUtils.clamp,
    damp = T.MathUtils.damp
  function measure() {
    width = innerWidth
    height = innerHeight
    const rect = anchor.getBoundingClientRect()
    heroLeft = rect.left + rect.width * 0.5
    heroTop = rect.top + scrollY + rect.height * 0.5
    heroWidth = rect.width
    renderer.setSize(width, height, false)
    camera.left = -width / 2
    camera.right = width / 2
    camera.top = height / 2
    camera.bottom = -height / 2
    camera.updateProjectionMatrix()
    wake()
  }
  function draw(now: number) {
    frame = 0
    if (disposed || document.hidden || !inView) return
    const raw = last ? (now - last) / 1000 : 1 / 60,
      dt = Math.min(raw, 0.065)
    last = now
    if (!reduced.matches && ++samples > 15) {
      lowFrames = raw > 1 / 43 ? lowFrames + 1 : Math.max(0, lowFrames - 1)
      if (lowFrames > 20 && dpr > 0.8) {
        dpr = Math.max(0.8, dpr * 0.8)
        renderer.setPixelRatio(dpr)
        lowFrames = 0
      }
    }
    if (!reduced.matches) {
      elapsed += dt
      angle += dt * (world.heroHover ? 0.033 : 0.057)
    }
    const hero = world.section === 'hero',
      contact = world.section === 'contact'
    const process = world.section === 'process',
      service = world.section === 'services'
    const smooth = (a: number, b: number, speed = 5) =>
      first || reduced.matches ? b : damp(a, b, speed, dt)
    presence = smooth(presence, hero ? 1 : contact ? 0.76 : 0)
    shapeStrength = smooth(
      shapeStrength,
      hero || contact ? 0 : service || process ? 1 : 0.58,
    )
    path = smooth(path, process ? 1 : 0)
    const x = hero ? heroLeft - width / 2 : width * (contact ? -0.24 : 0.25)
    const y = hero
      ? height / 2 - (heroTop - scrollY)
      : height * (contact ? -0.1 : 0.02)
    stage.position.x = smooth(stage.position.x, x, 11)
    stage.position.y = smooth(stage.position.y, y, 11)
    const unit = hero ? heroWidth / 5.95 : Math.min(width * 0.57, 620) / 5.95
    stage.scale.setScalar(smooth(stage.scale.x, unit, 8))
    const px = reduced.matches ? 0 : world.pointer.x,
      py = reduced.matches ? 0 : world.pointer.y
    stage.rotation.y = smooth(stage.rotation.y, px * 0.088)
    stage.rotation.x = smooth(stage.rotation.x, py * 0.036)
    camera.position.x = smooth(camera.position.x, px * 3)
    camera.position.y = smooth(
      camera.position.y,
      py * 2 + (!hero && !reduced.matches ? world.progress * 6 : 0),
    )
    assembly.visible = presence > 0.008
    assembly.scale.setScalar(Math.max(0.001, presence))
    sculpture.rotation.z = -0.37 + Math.sin(elapsed * 0.17) * 0.045
    sculpture.rotation.y = -0.17 + Math.sin(elapsed * 0.13) * 0.22
    center.position.y = Math.sin(elapsed * 0.6) * 0.025
    center.scale.setScalar(1 + 0.009 * Math.sin(elapsed * 0.65))
    ring.forEach((card, i) => {
      const t = angle + (i / ring.length) * Math.PI * 2,
        depth = (Math.sin(t) + 1) / 2
      card.position.set(
        Math.cos(t) * (2.32 + 1.4 * (1 - presence)),
        0.63 * Math.cos(t) -
          0.85 * Math.sin(t) +
          0.105 * Math.sin(i * 4 + elapsed * 0.47),
        1.48 * Math.sin(t),
      )
      card.rotation.set(
        -0.1 + Math.sin(t) * 0.13,
        -Math.cos(t) * 0.83,
        0.12 * Math.cos(t) + 0.045 * Math.sin(i * 2 + elapsed * 0.21),
      )
      card.scale.setScalar(0.66 + depth * 0.28)
      card.material.opacity = 0.48 + 0.43 * depth
      const face = card.children[0] as T.Mesh<
        T.PlaneGeometry,
        T.MeshBasicMaterial
      >
      face.material.opacity = 0.48 + 0.49 * depth
    })
    shapes.forEach((g, i) => {
      const focus = world.pillar === i && service
      const a = (i * Math.PI) / 2 + elapsed * 0.035
      goal.set(Math.cos(a) * 1.68, Math.sin(a) * 1.28, Math.sin(a) * 0.6)
      goal.x = T.MathUtils.lerp(goal.x, (i - 1.5) * 1.25, path)
      goal.y = T.MathUtils.lerp(
        goal.y,
        Math.sin(i * 1.3 + world.progress * 2) * 0.72,
        path,
      )
      g.position.lerp(goal, first ? 1 : 1 - Math.exp(-dt * 6))
      g.visible = shapeStrength > 0.012
      g.scale.setScalar(smooth(g.scale.x, shapeStrength * (focus ? 1.45 : 1)))
      g.rotation.y = smooth(
        g.rotation.y,
        focus ? 0 : 0.36 * Math.sin(elapsed * 0.22 + i),
      )
      g.rotation.x = smooth(g.rotation.x, focus ? 0.05 : 0.28)
      const material = (
        g.children[0] as T.Mesh<T.BufferGeometry, T.MeshStandardMaterial>
      ).material
      material.opacity = smooth(
        material.opacity,
        focus ? 0.86 : service || process ? 0.42 : 0.22,
      )
    })
    renderer.render(scene, camera)
    if (first) {
      first = false
      document.documentElement.classList.add('world-ready')
    }
    canvas.style.opacity = String(hero ? 1 : contact ? 0.23 : 0.45)
    if (!reduced.matches) frame = requestAnimationFrame(draw)
  }
  function wake() {
    if (!frame && !disposed && !document.hidden && inView)
      frame = requestAnimationFrame(draw)
  }
  function visibility() {
    cancelAnimationFrame(frame)
    frame = 0
    last = 0
    wake()
  }
  function scroll() {
    if (reduced.matches) wake()
  }
  function lost(event: Event) {
    event.preventDefault()
    dispose()
  }
  const observer = new ResizeObserver(measure)
  const visible = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting
    visibility()
  })
  observer.observe(anchor)
  visible.observe(canvas)
  document.addEventListener('visibilitychange', visibility)
  window.addEventListener('resize', measure)
  window.addEventListener('scroll', scroll, { passive: true })
  reduced.addEventListener('change', visibility)
  canvas.addEventListener('webglcontextlost', lost)
  measure()
  function dispose() {
    if (disposed) return
    disposed = true
    cancelAnimationFrame(frame)
    observer.disconnect()
    visible.disconnect()
    document.removeEventListener('visibilitychange', visibility)
    window.removeEventListener('resize', measure)
    window.removeEventListener('scroll', scroll)
    reduced.removeEventListener('change', visibility)
    canvas.removeEventListener('webglcontextlost', lost)
    const materials = new Set<T.Material>(),
      textures = new Set<T.Texture>()
    scene.traverse((object) => {
      if (!('geometry' in object)) return
      const mesh = object as T.Mesh
      mesh.geometry.dispose()
      for (const m of Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material])
        materials.add(m)
    })
    for (const m of materials) {
      for (const value of Object.values(m))
        if (value instanceof T.Texture) textures.add(value)
      m.dispose()
    }
    for (const map of textures) map.dispose()
    environment.dispose()
    renderer.dispose()
    document.documentElement.classList.remove('world-ready')
    canvas.style.opacity = '0'
  }
  return dispose
}
