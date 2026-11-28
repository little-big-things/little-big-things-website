# Little Big Things — littlebigthings.co

Marketing site for Little Big Things, Tim & Christina Frazer's data and engineering
consultancy. One Astro page plus a 404, built as static files and served by Cloudflare. There is no CMS:
content is hand-written in the `.astro` files.

## Commands

```bash
pnpm dev         # local dev server at http://localhost:4321
pnpm build       # production build into dist/
pnpm typecheck   # astro check
pnpm deploy      # build and deploy with wrangler
```

Use Node.js 22.23.4+ (required by Astro 7) and pnpm 11.

## Where things live

| Path | What it is |
| --- | --- |
| `src/pages/index.astro` | The homepage: nav, hero, work, about, contact, footer |
| `src/pages/404.astro` | Not-found page |
| `src/layouts/MarketingLayout.astro` | `<head>`: title, description, Open Graph and X tags, fonts, icons |
| `src/styles/lbt-colors.css` | Brand tokens (Mountain, Paper, Ink), Söhne `@font-face`, type scale |
| `src/styles/lbt-page.css` | Page styles (paper theme only) |
| `src/assets/` | Photos. Astro converts them to AVIF and WebP at build time; use `<Picture>` |
| `public/` | Fonts, icons, `og-image.png`, `_headers` (security headers and CSP), `robots.txt`, `sitemap.xml` |
| `design-handoff/` | Read-only design reference. It still holds components and themes the live site doesn't use yet; port from it rather than editing it |

## Brand rules

- Three colors only: Mountain `#190ADB`, Paper `#FFFAF8`, Ink `#1C1C1E`. Tint Ink with alpha for neutrals; don't add hues.
- Söhne for headings and UI; Lora for body text, both self-hosted in `public/fonts/`. No UI text in the serif.
- One exception, pending Tim and Christina's OK: the hero word "compound." is set in Overused Grotesk (OFL, variable, subset to its 8 glyphs) so its weight can animate on hover. Söhne isn't variable. If the word changes, re-subset the font and re-measure the `.ln2` indent (see the comment in `lbt-page.css`).
- Keep website photos under 200 KB.
- Copy is plain and specific. Avoid "leverage", "unlock", "game-changer".

Flag, rather than quietly make, any change that breaks these rules.
