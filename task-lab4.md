# Lab 4 - SSG & Git CMS

Level up your landing page with a Static Site Generator and a Git-based CMS

## Customer requirements

- Migrate the landing page to a Static Site Generator (SSG) `3 Points`
  - [Astro](https://astro.build/)
  - [Hugo](https://gohugo.io/)
  - [Eleventy](https://www.11ty.dev/)
  - [Jekyll](https://jekyllrb.com/)
  - [Next.js](https://nextjs.org/) (with static export)

- Integrate a Git-based CMS so non-technical editors can update content `3 Points`
  - [Decap CMS](https://decapcms.org/) (formerly Netlify CMS)
  - [Tina CMS](https://tina.io/)
  - [Keystatic](https://keystatic.com/)

- Content managed through the CMS should include at least: `2 Points`
  - Hero section (title, subtitle, CTA)
  - One repeatable collection (services, testimonials, or benefits)

## Dev requirements

- Have a decent git history with at least 2 PRs:
  - PR 1: SSG migration
  - PR 2: CMS integration
- The page should be deployable via Docker (`Dockerfile` + `docker-compose.yml`) `2 Points`
- Content files should live in the repository (JSON / YAML / Markdown) `1 Point`

## Implementation

**SSG:** Astro 4.x with `@astrojs/tailwind`  
**CMS:** Decap CMS 3.x with `local_backend` for dev, GitHub PKCE OAuth for production  
**Deployment:** Docker multi-stage build (node:20-alpine → nginx:alpine)

### Content collections

| Collection | Type | Files |
|---|---|---|
| `site/hero` | singleton | `src/content/site/hero.json` |
| `site/about` | singleton | `src/content/site/about.json` |
| `site/contact` | singleton | `src/content/site/contact.json` |
| `services` | folder | `src/content/services/*.json` |
| `benefits` | folder | `src/content/benefits/*.json` |
| `testimonials` | folder | `src/content/testimonials/*.json` |

### Local development

```bash
# Terminal 1 — site
npm run dev       # http://localhost:4321

# Terminal 2 — CMS proxy
npm run cms       # http://localhost:4321/admin/
```

## Links

- https://astro.build/
- https://decapcms.org/docs/intro/
- https://decapcms.org/docs/local-backend/
- https://docs.astro.build/en/guides/content-collections/
