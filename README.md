# Little Big Things — littlebigthings.co

EmDash/Astro website for Little Big Things, the consulting, investing, and freelance practice of Tim & Christina Frazer.

This repo started from the `little-big-things/little-big-things-website` EmDash Cloudflare template and now uses the supplied `Little Big Things.html` design handoff as the production homepage.

## What is included

- Custom marketing homepage at `/` based on the design handoff.
- EmDash admin UI at `/_emdash/admin`.
- Blog/content routes from the source EmDash template:
  - `/posts`
  - `/posts/:slug`
  - `/category/:slug`
  - `/tag/:slug`
  - `/search`
  - `/pages/:slug`
  - `/rss.xml`
- Cloudflare Workers deployment with D1 and R2 bindings.
- Forms plugin and webhook notifier dependencies from the source template.

## Design handoff

Fetched design files are kept in:

```text
design-handoff/
├── README.md
└── Little Big Things.html
```

The implemented homepage uses:

```text
src/pages/index.astro
src/layouts/MarketingLayout.astro
src/styles/lbt-colors.css
src/styles/lbt-page.css
public/assets/
public/fonts/
```

The original design readme described a static no-build site under `site/`. This repo instead serves the same design inside the EmDash/Astro app so the site can keep the CMS/admin surface.

## Local development

Use Node.js 22.13+; pnpm 11 requires the newer `node:sqlite` built-in.

```bash
pnpm install
pnpm dev
```

If your shell resolves an older Node shim first, put Homebrew's Node on PATH before running pnpm:

```bash
export PATH=/opt/homebrew/bin:/opt/homebrew/sbin:$PATH
npm exec --yes pnpm@11.1.3 -- install
npm exec --yes pnpm@11.1.3 -- dev
```

Open `http://localhost:4321`.

## Verification

```bash
pnpm typecheck
pnpm build
```

Both commands should complete with 0 Astro diagnostics. Build output is written to `dist/`.

## Deployment

Cloudflare deployment uses the existing script:

```bash
pnpm deploy
```

Required Cloudflare bindings are defined in `wrangler.jsonc` and the EmDash integration in `astro.config.mjs`.
