Drop seven .woff2 files here, named exactly:

  newsreader-400.woff2
  newsreader-500.woff2
  plex-sans-400.woff2
  plex-sans-500.woff2
  plex-sans-600.woff2
  plex-mono-400.woff2
  plex-mono-500.woff2

Easiest source: https://gwfh.mranftl.com  (google-webfonts-helper)
  - search "Newsreader", charset "latin", styles 400 + 500, take the .woff2 files
  - repeat for "IBM Plex Sans" (400, 500, 600) and "IBM Plex Mono" (400, 500)
  - rename to match the list above

THEN ONE MORE STEP, or the files will sit here unused:

  Open index.html, find the block beginning
      /* Self-hosted webfonts — CURRENTLY DISABLED.
  and delete the two marker lines inside it:
      -- remove this line to enable --
      -- and this line too --
  plus the opening /* and closing */ around them.

The @font-face rules are commented out on purpose. Left active without the
files, they request seven fonts that do not exist — seven 404s on every page
load, which looks careless on a page that promises it does nothing extra.

Until you enable them the page falls back to Georgia and the system sans/mono.
That is why nothing looks broken without them.
