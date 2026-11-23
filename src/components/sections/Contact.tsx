import { useRef, useState, type FormEvent } from 'react'
import { Check, Copy, Clock3 } from 'lucide-react'
import { mailto, site } from '../../config/site'
import { enquirySchema } from '../../lib/enquiry'
import { sendEnquiry } from '../../server/contact'
import { GlassPanel } from '../glass/GlassPanel'
import { Label } from './StudioSections'

const c = site.contact
type State = 'idle' | 'sending' | 'sent' | 'failed' | 'limited'
export function Contact() {
  const [state, setState] = useState<State>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState('')
  const busy = useRef(false)
  const success = useRef<HTMLDivElement>(null)
  const send = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (busy.current) return
    const form = event.currentTarget
    const fields = new FormData(form)
    const result = enquirySchema.safeParse({
      name: fields.get('name'),
      email: String(fields.get('email') || '').trim(),
      services: fields.getAll('services'),
      budget: fields.get('budget'),
      message: fields.get('message'),
      website: fields.get('website'),
    })
    if (!result.success) {
      const next: Record<string, string> = {}
      for (const issue of result.error.issues)
        next[String(issue.path[0])] ??= issue.message
      setErrors(next)
      form
        .querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)
        ?.focus()
      return
    }
    setErrors({})
    busy.current = true
    setState('sending')
    try {
      const status = await sendEnquiry({ data: result.data })
      setState(status)
      if (status === 'sent')
        requestAnimationFrame(() => success.current?.focus())
    } catch {
      setState('failed')
    } finally {
      busy.current = false
    }
  }
  const field = (name: string) => ({
    id: 'enquiry-' + name,
    name,
    'aria-invalid': !!errors[name],
    'aria-describedby': errors[name] ? 'error-' + name : undefined,
  })
  const error = (name: string) =>
    errors[name] && (
      <span className="field-error" id={'error-' + name}>
        {errors[name]}
      </span>
    )
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(c.copied)
    } catch {
      setCopied(c.copyError)
    }
  }
  return (
    <section className="section divided container contact-grid" id="contact">
      <div>
        <Label>{c.label}</Label>
        <h2>{c.title}</h2>
        <p className="contact-intro">{c.intro}</p>
        <div className="email-row">
          <a href={mailto}>{site.email}</a>
          <button
            type="button"
            className="copy glass"
            onClick={copy}
            aria-label={c.copy}
          >
            {copied === c.copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
        <span role="status" className="copy-status">
          {copied}
        </span>
        <p className="response">
          <Clock3 size={15} />
          {c.response}
        </p>
        {site.social.length > 0 && (
          <div className="socials">
            {site.social.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
      <GlassPanel className="form-panel">
        {state === 'sent' ? (
          <div ref={success} className="success" tabIndex={-1} role="status">
            <span className="icon-tile">
              <Check />
            </span>
            <h3>{c.success}</h3>
            <button
              type="button"
              className="btn quiet glass"
              onClick={() => setState('idle')}
            >
              {c.newMessage}
            </button>
          </div>
        ) : (
          <form
            method="post"
            noValidate
            onSubmit={send}
            aria-busy={state === 'sending'}
          >
            <div className="fields-row">
              <div>
                <label htmlFor="enquiry-name">{c.name}</label>
                <input
                  {...field('name')}
                  autoComplete="name"
                  required
                  maxLength={100}
                />
                {error('name')}
              </div>
              <div>
                <label htmlFor="enquiry-email">{c.email}</label>
                <input
                  {...field('email')}
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                />
                {error('email')}
              </div>
            </div>
            <fieldset>
              <legend>{c.needs}</legend>
              <div className="needs">
                {site.services.items.map((item) => (
                  <label key={item.name} className="choice">
                    <input type="checkbox" name="services" value={item.name} />
                    <span>{item.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div>
              <label htmlFor="enquiry-budget">
                {c.budget} <small>({c.optional})</small>
              </label>
              <select {...field('budget')} defaultValue="">
                <option value="">{c.budgets[0]}</option>
                {c.budgets.slice(1).map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="enquiry-message">{c.message}</label>
              <textarea
                {...field('message')}
                rows={4}
                required
                maxLength={5000}
              />
              {error('message')}
            </div>
            <div className="honey" aria-hidden="true">
              <label htmlFor="enquiry-website">{c.website}</label>
              <input
                id="enquiry-website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            <button
              disabled={state === 'sending'}
              className="btn dark"
              type="submit"
            >
              {state === 'sending' ? c.sending : c.send}
            </button>
            {(state === 'failed' || state === 'limited') && (
              <p className="form-status" role="alert">
                {state === 'limited' ? c.limited : c.failure}{' '}
                <a href={mailto}>{site.email}</a>
              </p>
            )}
          </form>
        )}
      </GlassPanel>
    </section>
  )
}
