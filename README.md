# What Your Data Costs You

A surveillance-pricing self-assessment. Fifteen questions about how someone shops, a willingness-to-pay score, and an estimate of what being priced as themselves costs them in a year.

**No framework, no build step, no dependencies.** What you push is exactly what gets served.

---

## The files

```
index.html     the machinery — flow, rendering, arithmetic. Rarely edited.
model.js       the questions, the model, all editable content. Edit this.
fonts/         seven .woff2 files (see fonts/README.txt) — optional
favicon.svg
vercel.json    security headers
```

Open `index.html` by double-clicking it. No server needed — that's why the config is a `.js` file rather than `.json`.

---

## Making changes

Almost everything lives in **`model.js`**, which is commented throughout.

| To change | Edit |
|---|---|
| A question or its answer options | `questions` |
| How much an answer counts | the score beside each option (0–100) |
| How much a signal category matters | `dimensions` → `weight` (relative — normalised automatically) |
| Spending assumptions | `categories` |
| Income / household scaling | `spendScaling`, `incomeBands`, `householdSizes` |
| Width of the displayed range | `band` |
| The evidence cards mid-assessment | `reveals` |
| "What they can infer about you" | `inferences` |
| The four defence strategies | `ceiling` — caps are **by question id**, not by dimension |
| Hover definitions | `glossary` — wrap any term as `[[term]]` in copy |
| Benchmark comparison data | `benchmark` |
| Where feedback goes | `feedback.URL` |

**Bump `version` and `versionDate` after any change.** Results display the stamp, so a figure someone screenshots stays traceable to the assumptions behind it.

### Four rules worth not breaking

1. **Scores run 0–100 where 100 means *easiest to read* for a pricing system** — never "best". Keep the direction consistent across every question. The interface word is "read" rather than "legible" — the axis, the band names and the prose all use it, so new copy should too.

2. **A composite of 50 must keep reproducing $1,848/household/year.** The model describes the average household, so average behaviour should return the average outcome. If the middle options drift upward, everyone lands above average and the tool reads as rigged.

3. **A ceiling strategy may only cap questions it genuinely changes.** Caps are keyed by question id. Capping a whole dimension let a strategy move answers it never mentioned — "treat loyalty programmes sceptically" was silently capping whether you stay signed in, so it moved the figure for people in zero loyalty programmes. `where-you-live` is capped by nothing, because no amount of privacy hygiene moves your neighbourhood.

4. **Never personalise `coverage`.** It describes how much of a channel is subject to dynamic pricing at all — a fact about the market, not the shopper. `priceImpact` is the term a person's behaviour moves. That separation is the tool's main honesty constraint.

### The benchmark block

`benchmark` holds the Grow Progress survey results (n=991 US adults, weighted, 19–20 Oct 2026). **The percentages behind it are measured; the score distribution is derived from them**, because respondent-level records weren't available. Keep that distinction on the methodology page if you surface any of it in the interface.

Nothing in the flow reads `benchmark` yet — it's staged for the peer-comparison work.

### After changing the model

Regenerate `model-and-scoring-reference.md`, which is produced from source and goes stale the moment the numbers move.

---

## Checking a change

```bash
# open it and click through
open index.html
```

Take the assessment end to end at least once. The two things worth watching: the figure on the cost screen, and the methodology page, which reads its numbers from the config and will expose any inconsistency.

---

## Deploying

This folder is a git repository. Point Vercel at it.

1. Push to a GitHub repo.
2. In Vercel: **New Project** → import the repo → **Framework Preset: Other** → leave build command and output directory **empty**.
3. Deploy. Add the custom domain under Project → Settings → Domains.

Updates are: edit, commit, push. Vercel redeploys automatically.

### Before the first public deploy

- Replace `REPLACE_WITH_DOMAIN` in the `og:url` meta tag in `index.html`.
- Add the fonts (see `fonts/README.txt`) — optional; the page falls back to Georgia and the system stacks and still reads correctly without them.
- Decide on analytics. **If you add any, change the privacy copy the same day** — the page currently states it runs none, and a room of data scientists will check.

### Forwarding the old prototype URL

In the `plain-inference` repo's `next.config.mjs`:

```js
async redirects() {
  return [
    { source: "/what-your-data-costs-you",
      destination: "https://YOUR-NEW-DOMAIN/",
      permanent: false },
  ];
}
```

Keep `permanent: false` until the URL is final — a cached 308 can't be undone for anyone who already hit it. Regenerate the QR code for the new address.

---

## Background

The model and evidence come from written testimony to the Senate Judiciary Committee, Subcommittee on Crime and Counterterrorism, 4 August 2026. Full context, including why several non-obvious decisions were made the way they were, is in `HANDOFF-what-your-data-costs-you.md`.
