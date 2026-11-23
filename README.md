# DevKasun Studio

A single-page studio portfolio built with TanStack Start, React, strict TypeScript, Tailwind CSS v4 and three.js. The HTML, navigation and project enquiry form are server-rendered. A separate, client-only WebGL scene follows the visitor through the page.

## Run locally

Use Node.js 24 LTS and pnpm 12.6.0.

```sh
pnpm install --frozen-lockfile
cp .env.example .env
pnpm dev
```

Open the local URL printed by Vite. The portfolio and direct email link work immediately. Add the Resend settings below to enable form delivery.

## Content and links

Edit **src/config/site.ts** for the wordmark, headings, service descriptions, process, contact details, legal copy, metadata, hero labels and response-time promise. The site's canonical domain also supplies the sitemap and social metadata. The privacy and terms routes are file-based. If you rename a legal URL, rename its route file too.

Add confirmed social profiles to `site.social` as objects with a label and a complete HTTPS URL. A WhatsApp link can use the wa.me format. Empty lists are hidden. The displayed two-working-day response target and USD budget choices are editable defaults.

## Hero and portrait

The default centerpiece is a procedurally fluted ceramic knot. To use a portrait, place a transparent PNG at **public/images/kasun-cutout.png** and change `site.scene.centerpiece` to `'portrait'`. A failed image load keeps the sculpture visible. A different portrait path can be set in the same config.

The self-hosted **public/images/pearl.webp** and **public/images/pearl-mobile.webp** are the desktop and five-card mobile first-paint and WebGL fallbacks. Replace it to customise the still composition. Keep a transparent background and center the subject. CSS supplies the ambient shapes and orbit lines. The share image is **public/images/studio-og.png**, sized at 1200 × 630.

The fixed renderer reads a small mutable store in **src/lib/store.ts**. Touch devices show the still immediately and load the five-card scene after the first tap, scroll or keyboard interaction. The studio lighting is baked from three.js RoomEnvironment so phones can skip that GPU preprocessing. The renderer adapts its pixel ratio, pauses in background tabs and cleans up GPU resources on unmount. The default sculpture uses its prerendered still for reduced motion and software-only graphics. A configured portrait uses a static WebGL frame with reduced motion. Reduced transparency replaces glass UI panels with solid surfaces.

The footer meadow uses lightweight Canvas 2D. Its rooted tufts, seed heads and leaf tips move with a travelling breeze. Drawing pauses when the footer is outside the viewport or the tab is hidden. Reduced motion displays a still meadow.

## Enquiry delivery

Set secrets in the hosting environment or an untracked **.env** file and restart the server. Vite dev also needs server environment variables loaded. The dev command loads the local .env file.

| Variable | Purpose |
| --- | --- |
| RESEND_API_KEY | Resend API key with email sending permission |
| RESEND_FROM | Sender address on a domain verified in Resend |
| CONTACT_TO | Optional destination override. Defaults to site.email |
| TRUST_PROXY | Default false. Enable only when a trusted reverse proxy overwrites X-Forwarded-For and direct access to the application server is blocked |
| PORT | Production HTTP port, default 3000 |

The server validates every submission with Zod, filters a hidden honeypot and admits up to four delivery attempts per peer per 15 minutes. The in-memory limiter fits a single Node process. For multiple instances, move the counters to shared storage or enforce an equivalent limit at the proxy. Development requests without a socket identity share one counter.

The email is sent as plain text, with the visitor's address in Reply-To. The browser displays success after provider acceptance. Missing credentials and provider errors preserve the draft and display a direct email option. Test delivery with a configured sender and a destination you control.

## Production

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm check
pnpm start
```

Build first on a clean checkout to regenerate the file-based route tree. Deploy to a Node web service with the project root as its working directory. Use the install and build commands above for its build step, and `pnpm start` for its start command. Include **dist/client**, **dist/server**, **scripts/serve.mjs**, **package.json**, the lockfile and runtime dependencies. Set the environment variables in the host's secret settings.

The Node entry serves immutable hashed assets and forwards application requests to the TanStack Start fetch handler. Attach **devkasun.com** to the host, configure DNS using its assigned records and enable HTTPS. Check the homepage, /privacy, /terms, /robots.txt, /sitemap.xml and a missing URL. Submit a real test enquiry after the email domain is verified.

## Project layout

```text
src/config/site.ts          Editable content and public settings
src/routes/                 SSR homepage, legal pages, sitemap and robots
src/components/glass/       Shared glass surfaces and responsive navigation
src/components/sections/    Hero, services, process, studio details and contact
src/components/three/       Client-only renderer and procedural objects
src/lib/                    Scene state, motion and validation
src/server/contact.ts       Enquiry delivery and rate limiting
src/styles.css              Design tokens, responsive layout and preferences
scripts/serve.mjs           Production Node adapter
public/images/              Hero still and Open Graph image
```
