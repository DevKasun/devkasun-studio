import * as T from 'three'
import { site } from '../../config/site'

export function pearl(mobile: boolean) {
  // The radial flutes follow the knot's own moving frame, so the ridges stay
  // continuous through every crossing instead of swimming in world space.
  const geometry = new T.TorusKnotGeometry(
    1.02,
    0.38,
    mobile ? 680 : 1280,
    mobile ? 24 : 44,
    2,
    3,
  )
  const pos = geometry.attributes.position
  const normal = geometry.attributes.normal
  const uv = geometry.attributes.uv
  const colors = []
  for (let i = 0; i < pos.count; i++) {
    const phase =
      uv.getX(i) * Math.PI * 2 * (mobile ? 88 : 140) +
      1.1 * Math.sin(uv.getY(i) * Math.PI * 2)
    const ridge = Math.cos(phase)
    const offset = 0.015 * ridge
    pos.setXYZ(
      i,
      pos.getX(i) + normal.getX(i) * offset,
      pos.getY(i) + normal.getY(i) * offset,
      pos.getZ(i) + normal.getZ(i) * offset,
    )
    const depth = T.MathUtils.clamp((pos.getZ(i) + 0.89) / 1.76, 0, 1)
    const shade = (0.38 + (0.48 * (ridge + 1)) / 2) * (0.39 + 0.61 * depth)
    colors.push(shade, shade * 0.985, shade * 0.954)
  }
  geometry.setAttribute('color', new T.Float32BufferAttribute(colors, 3))
  geometry.computeVertexNormals()
  return new T.Mesh(
    geometry,
    new T.MeshPhysicalMaterial({
      vertexColors: true,
      color: 0xfffcf6,
      roughness: 0.27,
      metalness: 0.51,
      clearcoat: 0.32,
      clearcoatRoughness: 0.31,
      envMapIntensity: 0.63,
    }),
  )
}

function texture(
  width: number,
  height: number,
  paint: (c: CanvasRenderingContext2D) => void,
) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  paint(ctx)
  const map = new T.CanvasTexture(canvas)
  map.colorSpace = T.SRGBColorSpace
  map.anisotropy = 4
  return map
}

function cardFace(word: string, index: number) {
  return texture(448, 230, (c) => {
    c.strokeStyle = '#575754'
    c.fillStyle = '#464644'
    c.lineWidth = 5
    c.lineCap = 'round'
    c.lineJoin = 'round'
    c.translate(43, 40)
    c.beginPath()
    const marks = [
      [
        [0, 16],
        [10, 12],
        [15, 0],
        [20, 12],
        [31, 16],
        [20, 20],
        [15, 32],
        [10, 20],
        [0, 16],
      ],
      [
        [0, 10],
        [0, 0],
        [10, 0],
      ],
      [
        [0, 25],
        [11, 14],
        [18, 19],
        [31, 4],
      ],
      [
        [16, 0],
        [2, 19],
        [14, 18],
        [10, 32],
        [30, 12],
        [18, 13],
        [22, 0],
      ],
      [
        [0, 8],
        [17, 0],
        [33, 8],
        [17, 18],
        [0, 8],
      ],
      [
        [0, 25],
        [20, 5],
        [27, 12],
        [8, 30],
        [0, 32],
        [0, 25],
      ],
      [
        [10, 3],
        [0, 15],
        [10, 27],
      ],
      [
        [0, 24],
        [7, 7],
        [31, 0],
        [24, 24],
        [12, 18],
        [0, 24],
      ],
    ]
    marks[index].forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)))
    if (index === 1) {
      c.moveTo(22, 32)
      c.lineTo(32, 32)
      c.lineTo(32, 22)
    }
    if (index === 6) {
      c.moveTo(23, 3)
      c.lineTo(33, 15)
      c.lineTo(23, 27)
    }
    c.stroke()
    c.font = '500 63px "Geist Variable", sans-serif'
    c.fillText(word, -2, 133)
    c.fillStyle = '#979793'
    c.fillRect(305, 9, 53, 3)
    c.fillRect(323, 21, 35, 3)
  })
}

export function cards(mobile: boolean) {
  const words = site.scene.words
  return Array.from({ length: mobile ? 5 : 8 }, (_, i) => {
    const shape = new T.Shape()
    const w = 1.11,
      h = 0.61,
      r = 0.073
    shape.moveTo(-w / 2 + r, -h / 2)
    shape.lineTo(w / 2 - r, -h / 2)
    shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r)
    shape.lineTo(w / 2, h / 2 - r)
    shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2)
    shape.lineTo(-w / 2 + r, h / 2)
    shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r)
    shape.lineTo(-w / 2, -h / 2 + r)
    shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2)
    const geo = new T.ExtrudeGeometry(shape, {
      depth: 0.034,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.012,
      bevelThickness: 0.012,
      curveSegments: 5,
    })
    const p = geo.attributes.position
    for (let j = 0; j < p.count; j++)
      p.setZ(j, p.getZ(j) - 0.1 * p.getX(j) ** 2)
    geo.computeVertexNormals()
    const material = mobile
      ? new T.MeshStandardMaterial({
          color: 0xf8f7f3,
          roughness: 0.2,
          metalness: 0.18,
          transparent: true,
          opacity: 0.82,
        })
      : new T.MeshPhysicalMaterial({
          color: 0xf4f3ef,
          metalness: 0.09,
          roughness: 0.15,
          transmission: 0.52,
          thickness: 0.15,
          ior: 1.4,
          clearcoat: 0.9,
          sheen: 0.14,
          transparent: true,
          opacity: 0.88,
        })
    const card = new T.Mesh(geo, material)
    const face = new T.Mesh(
      new T.PlaneGeometry(w - 0.05, h - 0.04, 8, 1),
      new T.MeshBasicMaterial({
        map: cardFace(words[i], i),
        transparent: true,
        depthWrite: false,
        toneMapped: false,
      }),
    )
    const fp = face.geometry.attributes.position
    for (let j = 0; j < fp.count; j++) fp.setZ(j, 0.052 - 0.1 * fp.getX(j) ** 2)
    card.add(face)
    return card
  })
}

export function orbit(mobile: boolean) {
  const group = new T.Group()
  const points = Array.from({ length: 145 }, (_, i) => {
    const t = (i / 144) * Math.PI * 2
    return new T.Vector3(
      2.88 * Math.cos(t),
      -1.37 * Math.sin(t) + 0.45 * Math.cos(t),
      1.52 * Math.sin(t),
    )
  })
  group.add(
    new T.Line(
      new T.BufferGeometry().setFromPoints(points),
      new T.LineBasicMaterial({
        color: 0x89857e,
        transparent: true,
        opacity: 0.38,
      }),
    ),
  )
  const label = texture(960, 80, (c) => {
    c.font = '500 40px "Geist Variable", sans-serif'
    c.fillStyle = '#706d66'
    c.textBaseline = 'middle'
    c.textAlign = 'center'
    c.fillText(site.scene.ribbon, 480, 40)
  })
  const text = new T.Mesh(
    new T.PlaneGeometry(1.62, 0.135),
    new T.MeshBasicMaterial({
      map: label,
      transparent: true,
      depthWrite: false,
      opacity: 0.8,
      toneMapped: false,
    }),
  )
  text.position.set(0.95, -1.26, 1.8)
  text.rotation.z = 0.3
  group.add(text)
  if (!mobile) {
    const coords = []
    for (let i = 0; i < 22; i++)
      coords.push(
        Math.sin(i * 21.7) * 2.8,
        Math.cos(i * 9.7) * 1.95,
        Math.sin(i * 3.1) * 1.5,
      )
    const geometry = new T.BufferGeometry()
    geometry.setAttribute('position', new T.Float32BufferAttribute(coords, 3))
    group.add(
      new T.Points(
        geometry,
        new T.PointsMaterial({
          color: 0xaaa69c,
          size: 1.6,
          sizeAttenuation: false,
          transparent: true,
          opacity: 0.4,
        }),
      ),
    )
  }
  return group
}

export function shadow() {
  const map = texture(256, 128, (c) => {
    c.scale(1, 0.5)
    const g = c.createRadialGradient(128, 128, 0, 128, 128, 128)
    g.addColorStop(0, 'rgba(77,71,60,.23)')
    g.addColorStop(0.53, 'rgba(99,92,83,.10)')
    g.addColorStop(1, 'rgba(99,92,83,0)')
    c.fillStyle = g
    c.fillRect(0, 0, 256, 256)
  })
  const mesh = new T.Mesh(
    new T.PlaneGeometry(4, 0.58),
    new T.MeshBasicMaterial({
      map,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    }),
  )
  mesh.position.set(0, -1.98, -1.9)
  return mesh
}

export function serviceShapes(mobile: boolean) {
  return Array.from({ length: 4 }, (_, i) => {
    const g = new T.Group()
    const material = mobile
      ? new T.MeshStandardMaterial({
          color: 0xe2e0d9,
          roughness: 0.3,
          transparent: true,
          opacity: 0.55,
        })
      : new T.MeshPhysicalMaterial({
          color: 0xe3e2dd,
          roughness: 0.19,
          transmission: 0.4,
          metalness: 0.18,
          clearcoat: 0.6,
          transparent: true,
          opacity: 0.7,
        })
    if (i === 0) {
      for (const sign of [-1, 1]) {
        const curve = new T.CatmullRomCurve3([
          new T.Vector3(sign * 0.24, 0.42, 0),
          new T.Vector3(sign * 0.59, 0, 0),
          new T.Vector3(sign * 0.24, -0.42, 0),
        ])
        g.add(
          new T.Mesh(new T.TubeGeometry(curve, 16, 0.07, 8, false), material),
        )
      }
    } else if (i === 1 || i === 2) {
      for (let k = 0; k < (i === 1 ? 3 : 1); k++) {
        const m = new T.Mesh(
          new T.TorusGeometry(0.29 + k * 0.18, i === 1 ? 0.042 : 0.145, 12, 48),
          material,
        )
        m.position.z = -k * 0.12
        g.add(m)
      }
    } else {
      for (let k = 0; k < 3; k++) {
        const m = new T.Mesh(new T.BoxGeometry(0.98, 0.1, 0.69), material)
        m.position.y = (k - 1) * 0.24
        m.rotation.y = -0.35
        g.add(m)
      }
    }
    return g
  })
}
