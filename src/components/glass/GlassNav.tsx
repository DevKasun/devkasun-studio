import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { site, sectionLink } from '../../config/site'
import { sheen } from './GlassPanel'
import { ThemeSwitch } from './ThemeSwitch'

export function Wordmark() {
  return (
    <a className="wordmark" href={site.home} aria-label={site.name}>
      <b>
        {site.brand}
        <i />
      </b>
      <span>{site.studio}</span>
    </a>
  )
}

export function GlassNav() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const [compact, setCompact] = useState(false)
  const wrap = useRef<HTMLElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const links = useRef<HTMLDivElement>(null)
  const indicator = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const sync = () => {
      setCompact(scrollY > 48)
      const current = site.nav
        .filter(({ id }) => {
          const top = document.getElementById(id)?.getBoundingClientRect().top
          return top !== undefined && top < innerHeight * 0.48
        })
        .at(-1)
      setActive(current?.id ?? '')
    }
    sync()
    window.addEventListener('scroll', sync, { passive: true })
    return () => window.removeEventListener('scroll', sync)
  }, [])
  useEffect(() => {
    const update = () => {
      const link = links.current?.querySelector<HTMLElement>('[aria-current]')
      if (link && indicator.current) {
        indicator.current.style.width = `${link.offsetWidth}px`
        indicator.current.style.transform = `translateX(${link.offsetLeft}px)`
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [active])
  useEffect(() => {
    if (!open) return
    const closeOutside = (event: Event) => {
      if (!wrap.current?.contains(event.target as Node)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggle.current?.focus()
      }
    }
    window.addEventListener('pointerdown', closeOutside)
    window.addEventListener('focusin', closeOutside)
    window.addEventListener('keydown', escape)
    return () => {
      window.removeEventListener('pointerdown', closeOutside)
      window.removeEventListener('focusin', closeOutside)
      window.removeEventListener('keydown', escape)
    }
  }, [open])
  const items = site.nav.map(({ id, label }) => (
    <a
      key={id}
      href={sectionLink(id)}
      aria-current={active === id ? 'location' : undefined}
      onClick={() => setOpen(false)}
    >
      {label}
    </a>
  ))
  return (
    <header ref={wrap} className={`header ${compact ? 'compact' : ''}`}>
      <nav
        className="nav glass"
        aria-label={site.ui.navigation}
        onPointerMove={sheen}
      >
        <Wordmark />
        <div className="navlinks" ref={links}>
          <span
            className={`nav-indicator ${active ? 'visible' : ''}`}
            ref={indicator}
          />
          {items}
        </div>
        <div className="nav-controls">
          <a
            className="nav-cta btn dark"
            href={sectionLink('contact')}
            onClick={() => setOpen(false)}
          >
            {site.ui.project}
          </a>
          <ThemeSwitch />
          <button
            ref={toggle}
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? site.ui.close : site.ui.open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <div id="mobile-nav" className="mobile-nav glass">
            {items}
          </div>
        )}
      </nav>
    </header>
  )
}
