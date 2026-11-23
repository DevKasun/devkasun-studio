import { ArrowDown, Globe2, Workflow, TrendingUp } from 'lucide-react'
import { site, sectionLink } from '../../config/site'
import { GlassPanel } from '../glass/GlassPanel'
export function Hero() {
  const { hero, ui } = site
  return (
    <section id="hero" className="hero container">
      <div className="hero-grid">
        <div className="hero-copy">
          <span className="eyebrow chip glass">
            <i className="ember" />
            {hero.eyebrow}
          </span>
          <h1>
            {hero.title.map((line, i) => (
              <span key={line} className={i === 2 ? 'soft' : ''}>
                {line}
                {i < 2 ? ' ' : ''}
              </span>
            ))}
          </h1>
          <p>{hero.intro}</p>
          <div className="actions">
            <a className="btn dark" href={sectionLink('contact')}>
              {ui.project}
            </a>
            <a className="btn quiet glass" href={sectionLink('services')}>
              {ui.explore}
            </a>
          </div>
        </div>
        <div className="art" id="scene-anchor" aria-hidden="true">
          <div className="fallback-art">
            <div className="orbit orbit-a" />
            <div className="orbit orbit-b" />
            <div className="art-shadow" />
            <picture>
              <source
                media="(max-width: 700px)"
                srcSet={site.scene.mobilePoster}
              />
              <img
                className="pearl-poster"
                fetchPriority="high"
                src={site.scene.poster}
                width="600"
                height="510"
                alt=""
              />
            </picture>
            <div className="css-pearl" />
          </div>
          <GlassPanel className="note note-a">
            <span className="note-icon">
              <TrendingUp size={20} />
            </span>
            {hero.notes[0]}
          </GlassPanel>
          <GlassPanel className="note note-b">
            <span className="note-icon">
              <Workflow size={18} />
            </span>
            {hero.notes[1]}
          </GlassPanel>
        </div>
      </div>
      <div className="hero-foot">
        <div className="location">
          <Globe2 size={15} />
          <span>{hero.location}</span>
          <i />
          {hero.reach}
        </div>
        <a className="scroll-chip glass" href={sectionLink('services')}>
          <ArrowDown size={13} />
          {ui.scroll}
        </a>
      </div>
    </section>
  )
}
