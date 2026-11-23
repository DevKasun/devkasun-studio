import { createFileRoute } from '@tanstack/react-router'
import { site } from '../config/site'
export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () =>
        new Response(
          `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[site.home, site.privacyPath, site.termsPath].map((path) => `<url><loc>${new URL(path, site.url).href}</loc></url>`).join('')}</urlset>`,
          { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
        ),
    },
  },
})
