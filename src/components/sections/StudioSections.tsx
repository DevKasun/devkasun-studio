import {
  Braces,
  Radio,
  Fingerprint,
  Layers3,
  Plus,
  Minus,
  Compass,
  PenTool,
  Code2,
  Sprout,
  MessagesSquare,
  Combine,
  Gauge,
  CalendarCheck,
} from 'lucide-react'
import { useState } from 'react'
import { site } from '../../config/site'
import { GlassPanel } from '../glass/GlassPanel'
import { world } from '../../lib/store'

const services = [Braces, Radio, Fingerprint, Layers3]
const steps = [Compass, PenTool, Code2, Sprout]
const values = [MessagesSquare, Combine, Gauge, CalendarCheck]
export function Label({ children }: { children: string }) {
  return (
    <div className="section-label">
      <i className="ember" />
      {children}
    </div>
  )
}
export function Services() {
  const [expanded, setExpanded] = useState<number | null>(null)
  return (
    <section className="section container" id="services">
      <div className="section-head">
        <div>
          <Label>{site.services.label}</Label>
          <h2>{site.services.title}</h2>
        </div>
        <p>{site.services.intro}</p>
      </div>
      <div className="service-grid">
        {site.services.items.map((item, i) => {
          const Icon = services[i]
          const isOpen = expanded === i
          return (
            <GlassPanel
              key={item.name}
              className="service-card reveal"
              onPointerEnter={() => (world.pillar = i)}
              onPointerLeave={() => (world.pillar = -1)}
              onFocus={() => (world.pillar = i)}
              onBlur={() => (world.pillar = -1)}
            >
              <span className="icon-tile">
                <Icon strokeWidth={1.45} />
              </span>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <ul>
                {item.outcomes.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>
              <button
                className="learn"
                aria-expanded={isOpen}
                aria-controls={`service-detail-${i}`}
                onClick={() => setExpanded(isOpen ? null : i)}
              >
                {isOpen ? site.ui.less : site.ui.learn}
                {isOpen ? <Minus size={15} /> : <Plus size={15} />}
              </button>
              <p id={`service-detail-${i}`} className="detail" hidden={!isOpen}>
                {item.detail}
              </p>
            </GlassPanel>
          )
        })}
      </div>
    </section>
  )
}
export function Process() {
  return (
    <section className="section container divided" id="process">
      <div className="section-head">
        <div>
          <Label>{site.process.label}</Label>
          <h2>{site.process.title}</h2>
        </div>
        <p>{site.process.intro}</p>
      </div>
      <ol className="step-grid">
        {site.process.steps.map(([name, text], i) => {
          const Icon = steps[i]
          return (
            <li key={name}>
              <GlassPanel className="step reveal">
                <Icon size={23} strokeWidth={1.45} />
                <h3>{name}</h3>
                <p>{text}</p>
              </GlassPanel>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
export function Why() {
  return (
    <section className="section container divided split" id="why">
      <div>
        <Label>{site.why.label}</Label>
        <h2>{site.why.title}</h2>
      </div>
      <div className="values">
        {site.why.values.map(([title, text], i) => {
          const Icon = values[i]
          return (
            <article key={title} className="value reveal">
              <span className="icon-tile">
                <Icon strokeWidth={1.4} />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
export function About() {
  return (
    <section className="section container divided" id="about">
      <GlassPanel className="about-card reveal">
        <div>
          <Label>{site.about.label}</Label>
          <h2>{site.about.title}</h2>
          <p className="role">{site.about.role}</p>
        </div>
        <div>
          <p>{site.about.intro}</p>
          <p>{site.about.body}</p>
          <ul className="tech">
            {site.about.stack.map((tech) => (
              <li className="glass" key={tech}>
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </GlassPanel>
    </section>
  )
}
