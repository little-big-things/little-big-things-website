# Share card

`og-image.html` is the source of `public/og-image-2.png`, the 1200×630 image
link previews show. It uses the site's own fonts from `public/fonts/` and the
hero's type settings, so change it whenever the name, the headline or the
hero's type changes.

Render it at exactly 1200×630 with headless Chrome:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars --force-device-scale-factor=1 --window-size=1200,630 --virtual-time-budget=3000 --allow-file-access-from-files --screenshot=public/og-image-2.png "file://$PWD/og/og-image.html"
```

When the image changes, save it under a new name (`og-image-3.png`) and update
the default in `src/layouts/MarketingLayout.astro` and the cache rule in
`public/_headers`: platforms cache share images by URL for days, and a new
name makes them fetch it again. Then check it with Facebook's Sharing Debugger
or LinkedIn's Post Inspector.
