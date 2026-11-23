import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'
import { createHash } from 'node:crypto'
import { site } from '../config/site'
import { enquirySchema } from '../lib/enquiry'

const attempts = new Map<string, { count: number; until: number }>()
const interval = 15 * 60_000
let nextSweep = 0

function admit(peer: string) {
  const now = Date.now()
  if (now >= nextSweep) {
    for (const [key, bucket] of attempts)
      if (bucket.until <= now) attempts.delete(key)
    nextSweep = now + 60_000
  }
  const existing = attempts.get(peer)
  const bucket =
    existing && existing.until > now
      ? existing
      : { count: 0, until: now + interval }
  if (bucket.count >= 4 || (!existing && attempts.size >= 10000)) return false
  bucket.count++
  attempts.set(peer, bucket)
  return true
}

export const sendEnquiry = createServerFn({ method: 'POST' })
  .validator(enquirySchema)
  .handler(async ({ data }): Promise<'sent' | 'limited' | 'failed'> => {
    if (data.website) return 'sent'
    const proxy =
      process.env.TRUST_PROXY === 'true' &&
      getRequestHeader('x-forwarded-for')?.split(',')[0]?.trim()
    if (!admit(proxy || getRequestHeader('x-studio-peer') || 'local'))
      return 'limited'
    const token = process.env.RESEND_API_KEY,
      sender = process.env.RESEND_FROM
    if (!token || !sender) return 'failed'
    const text = [
      `${site.contact.name}: ${data.name}`,
      `${site.contact.email}: ${data.email}`,
      `${site.contact.needs} ${data.services.join(', ')}`,
      `${site.contact.budget}: ${data.budget}`,
      '',
      data.message,
    ].join('\n')
    // A retry after a transport timeout must not produce two identical leads.
    const id = createHash('sha256')
      .update(JSON.stringify([data, Math.floor(Date.now() / interval)]))
      .digest('hex')
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        signal: AbortSignal.timeout(12_000),
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': id,
        },
        body: JSON.stringify({
          from: sender,
          to: [process.env.CONTACT_TO || site.email],
          reply_to: data.email,
          subject: `${site.name} · ${data.name.replace(/[\r\n]/g, ' ')}`,
          text,
        }),
      })
      return response.ok ? 'sent' : 'failed'
    } catch {
      return 'failed'
    }
  })
