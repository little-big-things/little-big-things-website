# Little Big Things — littlebigthings.co

Static marketing site for the consulting, investing and freelance practice of
Tim &amp; Christina Frazer. Built as a single-page HTML site, no build step,
ready for **Cloudflare Pages**.

## Repo layout

```
site/
├── index.html              # The page
├── colors_and_type.css     # Design tokens + type stack (Söhne + Lora)
├── fonts/                  # Self-hosted Söhne weights (woff2)
├── assets/                 # Photography
├── favicon.svg             # Vector favicon (LBT mountain mark)
├── favicon-32.png          # PNG fallback for older browsers
├── apple-touch-icon.png    # iOS home-screen icon
├── og-image.png            # 1200×630 social preview
├── robots.txt
├── sitemap.xml
├── _headers                # Cloudflare Pages cache + security headers
└── _redirects              # Reserved for future redirects
```

The site is intentionally a single `index.html` — every section is a static
anchor (`#services`, `#focus`, `#about`, `#podcast`, `#contact`). No bundler,
no framework, no build.

## Local development

```bash
cd site
python3 -m http.server 8080
# or
npx serve .
```

Open `http://localhost:8080`.

## Deploy to Cloudflare Pages

### Option A — Connect a Git repo (recommended)

1. Push this repo to GitHub / GitLab.
2. In the Cloudflare dashboard → **Workers &amp; Pages** → **Create application**
   → **Pages** → **Connect to Git**.
3. Pick the repo. In the build configuration:
   - **Framework preset:** *None*
   - **Build command:** *(leave blank)*
   - **Build output directory:** `site`
4. Save and deploy. Every push to `main` ships a new production build;
   feature branches get preview URLs automatically.

### Option B — Direct upload via Wrangler

```bash
npm install -g wrangler
cd site
wrangler pages deploy . --project-name=little-big-things
```

### Custom domain

Once the project is live:

1. Cloudflare dashboard → Pages project → **Custom domains** → **Set up a
   custom domain**.
2. Add `littlebigthings.co` and `www.littlebigthings.co`. Cloudflare will
   wire up the CNAMEs automatically if the domain is already on Cloudflare DNS.
3. The `_headers` file sets HSTS (`Strict-Transport-Security: max-age=31536000`)
   — confirm SSL/TLS is set to **Full (strict)** in the dashboard before going
   live.

## Editing copy

All copy lives inline in `site/index.html`. There is no CMS. To edit:

- **Hero, services, focus, about, podcast, contact** — search for the
  matching section comment block (e.g. `<!-- ===== HERO ===== -->`).
- **Email addresses** — search `tim@littlebigthings.co`.
- **Selected work links** — search `swork-list`.
- **Mountain mark** — the SVG path is inline three times (nav, footer, and
  the favicon). Update all three if the geometry changes.

## Form handling

The contact form currently `event.preventDefault()`s and shows a success
message in-place. To wire it up:

- **Cloudflare Pages Functions:** add `site/functions/api/contact.js`. Pages
  Functions are auto-deployed alongside static assets.
- **Formspree / Web3Forms / Getform:** swap the `<form>` action to your
  endpoint and remove the inline handler.
- **Resend / Postmark:** call your transactional provider from a Pages Function.

## Performance budget

- HTML: ~50KB uncompressed (~12KB gzip).
- CSS: ~10KB.
- Fonts: 3× Söhne woff2 (~25KB each).
- Photos: JPEG, optimise to ≤200KB each before deploy (currently ~1–2MB).
  Suggested: run `cwebp -q 82` or use Cloudflare Images for responsive variants.

## Notes

- The design system that underpins this site is *Little Big Humans* (sibling
  project). Tokens are mirrored in `colors_and_type.css`.
- Google Fonts (Manrope, Lora) load from `fonts.googleapis.com` for the
  display + UI stacks; Söhne is self-hosted.
- No JavaScript runtime — the page works with JS disabled.
