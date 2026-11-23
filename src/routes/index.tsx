import { ClientOnly, createFileRoute } from '@tanstack/react-router'
import { site } from '../config/site'
import { Hero } from '../components/sections/Hero'

import {
  Services,
  Process,
  Why,
  About,
} from '../components/sections/StudioSections'

import { World } from '../components/three/World'

import { Motion } from '../components/sections/Motion'

import { Contact } from '../components/sections/Contact'

export const Route = createFileRoute('/')({
  head: () => ({
    links: [{ rel: 'canonical', href: site.url }],
    meta: [{ property: 'og:url', content: site.url }],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: site.name,
          url: site.url,
          email: site.email,
          description: site.seo.description,
          areaServed: 'Worldwide',
          founder: { '@type': 'Person', name: site.owner },
          knowsAbout: site.services.items.map((item) => item.name),
        }),
      },
    ],
  }),
  component: Home,
})
function Home() {
  return (
    <>
      <ClientOnly>
        <World />
      </ClientOnly>
      <Motion />
      <main id="main">
        <Hero />
        <Services />
        <Process />
        <Why />
        <About />
        <Contact />
      </main>
    </>
  )
}
