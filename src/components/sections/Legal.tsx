import { site } from '../../config/site'
export function legalHead(kind: keyof typeof site.legal) {
  const content = site.legal[kind]
  const url =
    site.url + (kind === 'privacy' ? site.privacyPath : site.termsPath)
  const title = `${content.title} · ${site.name}`
  return {
    meta: [
      { title },
      { name: 'description', content: content.paragraphs[0] },
      { property: 'og:title', content: title },
      { property: 'og:description', content: content.paragraphs[0] },
      { property: 'og:url', content: url },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: content.paragraphs[0] },
    ],
    links: [{ rel: 'canonical', href: url }],
  }
}
export function Legal({ kind }: { kind: keyof typeof site.legal }) {
  const content = site.legal[kind]
  return (
    <main className="legal container" id="main">
      <h1>{content.title}</h1>
      {content.paragraphs.map((p) => (
        <p key={p}>{p}</p>
      ))}
      <a className="btn quiet glass" href={site.home}>
        {site.ui.home}
      </a>
    </main>
  )
}
