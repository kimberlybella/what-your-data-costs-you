# Handoff — "What Your Data Costs You"

**Read this first.** It is the complete context for the surveillance-pricing assessment tool, written so a session starting cold can be useful immediately. Everything here was decided deliberately; where a decision looks odd, the reason is given, because the odd-looking ones are usually the load-bearing ones.

**Owner:** Kimberly Bella
**Written:** 14 September 2026
**Status:** prototype live and being tested; moving to its own domain as v1.

---

## 1. What this is

A web tool that asks eighteen questions about how a person shops, scores how legible they are to a pricing system, and estimates what being priced as *them* — rather than as an anonymous shopper — costs them in a year.

Flow: **landing → 18 questions (with 3 evidence interstitials) → spend calibration → willingness-to-pay score → cost estimate → ceiling simulator → methodology → anonymous feedback.**

### Who it is for — this drives everything

**Not consumers seeking protection.** The primary audience is people who *build* these systems or decide how they get used: data science students, early-career practitioners, and the executives who approve the roadmaps.

The objective is **recognition, not defence.** Someone who has been on the receiving end of an inference makes different choices when they are the one writing the model.

Three consequences that run through every decision below:

1. **The dollar figure is the mechanism, not the message.** It exists to make the abstraction land personally. What matters is the ten seconds after they see it.
2. **The defence content is evidence about limits, not advice.** See §5.
3. **The tool's own construction is part of the argument** — a privacy-preserving instrument built by people who could have built it the other way, aimed at an audience about to make exactly that choice.

> **Change in scope, September 2026:** Kimberly now expects a much broader audience than students. See §8 for the open decisions this creates.

---

## 2. Where everything is

| Thing | Location |
|---|---|
| Live prototype | `https://www.plaininference.com/what-your-data-costs-you` — unlisted, `noindex`, not in nav |
| Prototype source | `plain-inference` repo: `src/components/WillingnessToPay.jsx` + `src/app/what-your-data-costs-you/page.js` |
| Feedback form | `https://forms.gle/bVhnLWvUvRP9ccJ39` — anonymous, confirmed no email collection |
| QR code | Generated 8 Sep 2026, points at the prototype URL |
| Model reference | `model-and-scoring-reference.md` — **generated from source**, regenerate after any model change |
| Product spec | `price-exposure-assessment-spec.md` (v0.3) |
| Questionnaire (editable) | `what-your-data-costs-you-questionnaire.docx` |
| Copy review | `what-your-data-costs-you-copy-review.pdf` — 11 pages, all major screens |

### Source material the whole thing rests on

- **Senate testimony**, *"Your Data, Their Profit: The Consumer Cost of AI Surveillance Pricing"* — Robert B. Hedges, Jr., Senate Judiciary Subcommittee on Crime and Counterterrorism, 4 August 2026. Supplies the seven-signal taxonomy, the patent and case evidence, and the four consumer strategies.
- **`dynamic_pricing_model_3vBAC deck.xlsx`** — the category/channel cost model.
- **Kimberly co-authored both.** They interlock by design; the tool is the third piece of one body of work, not an outside application of someone else's analysis.

---

## 3. The model

```
Impact = Channel spend × DP coverage × Price impact
```

Per category, split into online and in-store channels, summed across ten categories.

| Term | Personalised? | Why |
|---|---|---|
| Channel spend | **Yes** — household size, income band, online-mix sliders | A fact about the person |
| DP coverage | **No** — held at published model values | A fact about the *market*, not the shopper. Personalising it would be the tool inventing data it doesn't have. **This is the central honesty constraint — do not "improve" it.** |
| Price impact | **Yes** — multiplied by the exposure score | The only term the person's behaviour actually moves |

### Scoring

Seven dimensions, weighted to 100: identity persistence & loyalty (22), comparison shopping (20), urgency & intent (18), tracking surface (14), device (10), location (10), time & session (6). Dimension score = mean of its questions. Composite = weighted sum.

```
multiplier = 0.6 + (composite / 100) × 0.8
```

**Calibration anchor:** a composite of **50 reproduces the published baseline of $1,848/household/year exactly.** The model describes the average household, so average behaviour returns the average outcome. The score never invents a figure — it moves a person around a published one. *Preserve this property through any revision.*

Achievable range is roughly 15–86, giving $1,331–$2,381 at default spend, a blended extraction rate of 2.3%–5.4%. The testimony adopts 3–12% as its own envelope and cites research at 5–20%, so nothing the tool outputs exceeds what the underlying analysis defends.

### Two numbers that need justifying when challenged

**Displayed band: ±12%.** Narrowed from ±25% on 8 September after a heavy-online-shopper profile returned $2,690–$4,484 — too wide to quote or use. The justification is that the band should carry uncertainty added by *personalisation*, not restate the model's own uncertainty, which is disclosed on the methodology page and is larger. **The honest framing: the underlying uncertainty did not change, only how much of it the headline restates.** It is a presentation decision and is logged as one.

**Spend factor: `clamp((income × household)^0.85, 0.55, 2.0)`.** Multiplying straight through put a high-income five-person household at 2.27× the average consumer unit, which overstates it — savings rate rises with income, and grocery spend tracks headcount while airfare does not. **The 0.85 exponent and the clamp are judgement, not fitted parameters, and are the least evidenced numbers in the model.** Grounding them in BLS Consumer Expenditure Survey tables by income quintile and household size is the highest-value outstanding fix, and the assumption a sharp student will attack first.

### Model exclusions
Mortgage, auto loans, debt repayment, insurance, healthcare. The model is calibrated to a $2,000/household target and reaches 92.4% of it.

---

## 4. Locked decisions

| Decision | Resolution | Why |
|---|---|---|
| Precision | **Range only**, never point estimates, anywhere including share cards | Credibility is the product. `$2,347.19` is the attack surface |
| Length | **18 questions**, all seven dimensions covered | Fewer collapses device/location/timing into crude proxies |
| Privacy | **Strictest: no cookies, no analytics, no email capture, no ZIP.** All computation client-side | A surveillance tool that harvests is a self-own. It is also the strongest marketing claim the page has |
| Attribution | **Neutral public-interest framing** — no personal byline; contributors credited in the methodology only | Makes the methodology page the credential rather than a footnote. Copy is third person, no "we believe" |

### One scoring choice that looks like a bug and isn't

**Q15 scores location on distinctiveness, not affluence.** "Higher income" (75) and "Lower income" (68) both score high; "About average" (48) scores low.

The evidence: in the 2012 Staples case, ZIP codes shown the *discounted* price averaged $59,900 in household income while those shown the higher price averaged $48,700. **Lower-income areas systematically paid more.** Scoring "lower income" as low exposure would encode the opposite of the documented record. Someone will try to "fix" this — don't let them.

---

## 5. The ceiling simulator — read before editing it

Four toggles drawn from the testimony's consumer strategies. **They are not advice.** They demonstrate the *upper bound* on individual self-defence.

Each toggle caps its dimensions at a realistic defended value, **never zero** — the testimony is explicit that no individual can fully opt out, and a simulator that could drive the figure to nothing would claim more than the evidence supports.

**The finding, and the reason the step exists:** a maximally diligent consumer — signed out, patient, sceptical of loyalty programmes, cookies blocked — recovers about **25%**. The exposure score falls 59% and the cost falls 25%. That gap is structural: the multiplier floors at 0.6× and DP coverage never moves. **Even a consumer who becomes perfectly illegible still pays**, because most of the extraction is a property of the market they shop in, not the traces they leave.

For a builder audience that gap *is* the argument: the remaining 75% belongs to whoever specifies the feature store, sets the coverage, and signs off on the experiment.

Copy exists in two registers, builder and consumer, switchable in the UI.

---

## 6. Constraints learned the hard way

**Don't rediscover these.**

- The prototype's stylesheet had bare `body`/`h1`/`p`/`button` selectors. On a real site they leak everywhere. Styles are scoped under `.wtp` — **keep them scoped.**
- Plain Inference's `next.config.mjs` applies a CSP to `/:path*` (`font-src 'self'`, `style-src 'self'`). Google Fonts are blocked. `next/font/google` self-hosts and was the fix there; on the new static site the fonts must be self-hosted manually.
- The assessment logic is deliberately kept as one self-contained routine rather than idiomatic React state. The scoring maths is what the page's credibility rests on, and re-expressing ~700 lines of it risks silent arithmetic changes for no visible gain. A comment in the file says so.
- Local `next build` fails in the Claude sandbox — no network, so `next/font` can't fetch. It fails on Plain Inference's own Geist Mono too. **Environmental, not a code fault.** ESLint works; Vercel is the real build check.
- `device_bash` on the Mac cannot delete files without granted permission. `next build` needs to clear `.next` — `mv` it aside or grant delete.
- A daily automated Patent Watch task pushes to the Plain Inference repo, so local and remote diverge easily. **Always `git pull` before starting work there.**

---

## 7. The move — what is being built

**Decision: the tool gets its own domain, its own repo, its own Vercel project.** Plain Inference keeps only the prototype, and its URL will forward to the new home once ready.

This also makes the neutral framing structurally true rather than merely stated — a tool at a personal domain reads as one person's project.

### Target shape — no framework

```
/
  index.html        ← machinery: flow, rendering, maths
  model.json        ← questions, answer scores, weights, category
                      spends, coverage, price impacts, spend factors,
                      band width, version stamp
  fonts/            ← 4 self-hosted .woff2 (Newsreader, IBM Plex Sans/Mono)
  favicon.svg
  vercel.json       ← security headers carried over from Plain Inference
```

**Why config separation matters now:** Kimberly expects repeated changes to the questionnaire, the page flows and the model assumptions. Hardcoding all three in the JavaScript means every model tweak is a code edit. Splitting them makes questionnaire and model changes data edits in a labelled file, with only flow changes touching code. The config file is also a workshop artifact — handing data scientists the actual scoring file and asking what they'd have done differently beats any slide about it.

**Version stamping:** results should carry "Model v1.x, <month year>" so a screenshotted figure is traceable to the assumptions that produced it.

### Deployment
Static folder → GitHub → Vercel with no build command. Register the domain independently of the host (Cloudflare, Namecheap) so a host change is a DNS change.

### Last step
Forward `plaininference.com/what-your-data-costs-you` to the new URL via `redirects()` in `next.config.mjs`. Use `permanent: false` until the URL is final — a cached 308 is unfixable for anyone who already hit it. Regenerate the QR code for the new address.

---

## 8. Outstanding

**Blocking v1**
1. Convert to the standalone, config-driven build described above.
2. Calibrate the 68 answer-to-score values against student feedback — wait for the data rather than guessing.
3. Ground the 0.85 exponent and the clamp in BLS Consumer Expenditure Survey tables.
4. Regenerate `model-and-scoring-reference.md` from source after any model change.

**Prototype → v1 checklist**
- Remove `noindex`
- Drop the "PROTOTYPE · SYNTHETIC MODEL V1.0" eyebrow
- Decide analytics; if any are added, change the privacy copy **the same day** — the page currently claims "runs no analytics" flat out
- Add a version stamp

**Open decisions created by the broader audience**
- Should the default register flip from builder to consumer?
- Does "willingness-to-pay score" stay? For builders it lands *because* it's their language; for a general reader it may just read as cold. It is the hero of the first results screen, so this is not a small call.
- More sceptical arrivals make the methodology page load-bearing rather than a footnote — does it need rewriting for a general reader?

**Unrelated but unresolved:** the Plain Inference repo has a three-conflict Patent Watch merge sitting on local `main` (PUBLISHING.md, patents.ts, scan-tier.py). Not part of this tool, but it blocks clean pushes there.

---

## 9. If you change one thing, know this

The instrument's value is that **every number in it is defensible.** It applies a published model to self-reported behaviour, produces ranges rather than points, holds market facts fixed while personalising only what the person controls, and discloses its own weaknesses on the page.

The fastest way to destroy it is to make a number look better than the evidence supports. A wider range, an admitted weak assumption, or a stated limit costs almost nothing. One figure that can't be traced to a source costs everything.
