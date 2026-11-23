import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { site } from '../config/site'
import css from '../styles.css?url'
import font from '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url'
import { GlassNav } from '../components/glass/GlassNav'
import { Footer } from '../components/sections/Footer'
import { themeBootScript, themeColors } from '../lib/theme'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: site.seo.title },
      { name: 'description', content: site.seo.description },
      { property: 'og:site_name', content: site.name },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: site.seo.title },
      { property: 'og:description', content: site.seo.description },
      { property: 'og:image', content: site.url + site.seo.image },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: site.seo.title },
      { name: 'twitter:description', content: site.seo.description },
      { name: 'twitter:image', content: site.url + site.seo.image },
    ],
    links: [
      { rel: 'stylesheet', href: css },
      { rel: 'icon', href: '/favicon.svg' },
      {
        rel: 'preload',
        href: font,
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
    ],
  }),
  shellComponent: Document,
  notFoundComponent: () => (
    <main id="main" className="legal container">
      <h1>{site.missing.title}</h1>
      <p>{site.missing.body}</p>
      <a className="btn dark" href={site.home}>
        {site.ui.home}
      </a>
    </main>
  ),
})

function Document({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="theme-color"
          content={themeColors.light}
          suppressHydrationWarning
        />
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <HeadContent />
      </head>
      <body>
        <a className="skip" href="#main">
          {site.ui.skip}
        </a>
        <GlassNav />
        {children}
        <Footer />
        <Scripts />
      </body>
    </html>
  )
}
