/* ============================================================================
 *  What Your Data Costs You - MODEL & CONTENT
 *
 *  Everything you are likely to change lives in this file. index.html holds
 *  only the machinery: flow, rendering and arithmetic.
 *
 *  Editing rules that matter:
 *   - Answer scores run 0-100 where 100 = EASIEST for a pricing system to read,
 *     never "best". Keep that direction consistent.
 *   - A composite of 50 must keep reproducing the published baseline of
 *     $1,848/household/year. If the middle options drift upward, every
 *     respondent lands above average and the tool reads as rigged.
 *   - Dimension weights are RELATIVE; the code normalises them, so they need
 *     not total any particular number.
 *   - Do NOT personalise "coverage" (see categories). It is a fact about the
 *     market, not the shopper. That is the tool's main honesty constraint.
 *   - Ceiling strategies cap INDIVIDUAL QUESTIONS by id, never whole
 *     dimensions. Cap only what a strategy genuinely changes: nobody cuts
 *     their data trail and thereby moves house.
 *
 *  After changing anything here, bump MODEL.version.
 * ========================================================================== */

window.MODEL = {

  version: "v2.0",
  versionDate: "October 2026",

  /* 15 questions, matching the fielded benchmark survey. The earlier
   * 18-question version also asked about a shopping-only email address, time
   * of day, and deliberation time; those three were dropped as the least
   * informative (they correlated 0.998 with the full instrument). */

  band: 0.12,
  baseline: 1848,

  feedback: { URL: "https://forms.gle/bVhnLWvUvRP9ccJ39", EMAIL: "" },

  /* -- Benchmark -----------------------------------------------------------
   * The percentages behind this are MEASURED. The score distribution is
   * DERIVED from them (every one-way and two-way margin matched), because
   * respondent-level records were not available. The methodology page must
   * keep that distinction visible. */
  benchmark: {
    source: "Grow Progress pulse survey",
    n: 991,
    fielded: "October 19-20, 2026",
    note: "US adults, weighted to the general adult population; +/-3 pts at 90% confidence",
    medianScore: 53,
    medianCost: 1897,
    defendedFloorCost: 1600,   /* hardest-to-read 5% still pay about this */
    bands: [ { label: "Hard to read",             range: "0-20",   share: 0.000 },
             { label: "Harder to read than most", range: "21-40",  share: 0.077 },
             { label: "Typical",                  range: "41-60",  share: 0.672 },
             { label: "Easy to read",             range: "61-80",  share: 0.201 },
             { label: "An open book",             range: "81-100", share: 0.000 } ],
    percentiles: { p5: 38, p10: 41, p25: 47, p50: 53, p75: 60, p90: 65, p95: 68 },
  },

  /* -- Signal dimensions (weights relative, normalised in code) ------------ */
  dimensions: {
    d1: { name: "Identity persistence & loyalty", weight: 22 },
    d2: { name: "Comparison-shopping behavior", weight: 20 },
    d3: { name: "Urgency & intent signals", weight: 18 },
    d4: { name: "Tracking surface & data trail", weight: 14 },
    d5: { name: "Device & digital access", weight: 10 },
    d6: { name: "Location exposure", weight: 10 },
  },

  spendScaling: { exponent: 0.85, min: 0.55, max: 2.0 },

  incomeBands: [
    { label: "Under $50k", factor: 0.62 },
    { label: "$50–100k", factor: 0.88 },
    { label: "$100–150k", factor: 1.12 },
    { label: "$150–250k", factor: 1.38 },
    { label: "$250k+", factor: 1.75 },
    { label: "Prefer not to say", factor: 1 },
  ],

  householdSizes: [
    { label: "1", factor: 0.72 },
    { label: "2", factor: 0.92 },
    { label: "3–4", factor: 1.12 },
    { label: "5+", factor: 1.3 },
  ],

  categories: [
    { name: "Groceries",                       spend:  8200, mix: 0.15,
      online:  { coverage: 0.9,  priceImpact: 0.1 },
      instore: { coverage: 0.3,  priceImpact: 0.04 }, slider: "grocery" },
    { name: "Restaurants & food delivery",     spend:  3945, mix: 0.2, 
      online:  { coverage: 0.95, priceImpact: 0.12 },
      instore: { coverage: 0.1,  priceImpact: 0.06 }, slider: "dining" },
    { name: "Clothing",                        spend:  3000, mix: 0.42,
      online:  { coverage: 0.75, priceImpact: 0.08 },
      instore: { coverage: 0.05, priceImpact: 0.09 } },
    { name: "Airfare",                         spend:  3000, mix: 0.9, 
      online:  { coverage: 1,    priceImpact: 0.12 },
      instore: { coverage: 1,    priceImpact: 0.08 }, slider: "travel" },
    { name: "Hotels & vacations",              spend:  3500, mix: 0.7, 
      online:  { coverage: 0.85, priceImpact: 0.08 },
      instore: { coverage: 0.4,  priceImpact: 0.05 }, slider: "travel" },
    { name: "Ground transportation",           spend:  5000, mix: 0.12,
      online:  { coverage: 1,    priceImpact: 0.12 },
      instore: { coverage: 0.3,  priceImpact: 0.04 } },
    { name: "Rent & housing",                  spend:  5500, mix: 0.3, 
      online:  { coverage: 1,    priceImpact: 0.08 },
      instore: { coverage: 0,    priceImpact: 0.04 } },
    { name: "General merchandise",             spend:  8000, mix: 0.44,
      online:  { coverage: 0.85, priceImpact: 0.09 },
      instore: { coverage: 0.25, priceImpact: 0.04 }, slider: "general" },
    { name: "Entertainment & subscriptions",   spend:  3600, mix: 0.67,
      online:  { coverage: 0.8,  priceImpact: 0.11 },
      instore: { coverage: 0.3,  priceImpact: 0.06 } },
    { name: "Utilities & energy",              spend:  4500, mix: 0.3, 
      online:  { coverage: 1,    priceImpact: 0.09 },
      instore: { coverage: 0,    priceImpact: 0.04 } },
  ],

  /* -- The questionnaire ---------------------------------------------------
   * id  = stable handle; ceiling strategies cap questions by id.
   * NOTE ON "where-you-live": scored on DISTINCTIVENESS, not affluence.
   * "Higher income" (75) and "Lower income" (68) both score high; "About
   * average" (48) scores low. This looks like a bug and is not. In the 2012
   * Staples case the ZIPs shown the DISCOUNTED price averaged $59,900 in
   * household income, those shown the higher price $48,700 - lower-income
   * areas systematically paid more. */
  questions: [
    { id: "signed-in",         dim: "d1", text: "When you shop online, are you usually signed in to an account?",
      options: [
        ["Always signed in", 92],
        ["Usually", 65],
        ["Sometimes", 38],
        ["Rarely — I check out as a guest", 10],
      ] },
    { id: "loyalty",           dim: "d1", text: "How many retail loyalty programs, store cards, or memberships are you enrolled in?",
      options: [
        ["None", 8],
        ["One or two", 32],
        ["Three to five", 60],
        ["Six or more", 90],
      ] },
    { id: "same-retailer",     dim: "d1", text: "When you need something you buy regularly, do you go back to the same retailer?",
      options: [
        ["Almost always", 88],
        ["Usually", 60],
        ["I shop around", 25],
        ["No real pattern", 40],
      ] },
    { id: "retailers-checked", dim: "d2", text: "Before a purchase over $100, how many different retailers do you check?",
      options: [
        ["Just one", 90],
        ["Two", 55],
        ["Three or four", 25],
        ["Five or more", 8],
      ] },
    { id: "comparison-tools",  dim: "d2", text: "Do you use price-comparison tools, browser extensions, or price-history trackers?",
      options: [
        ["Never", 85],
        ["Rarely", 58],
        ["Sometimes", 30],
        ["Routinely", 10],
      ] },
    { id: "same-session",      dim: "d2", text: "When you find something you want, how often do you buy it in the same session?",
      options: [
        ["Almost always", 88],
        ["Often", 60],
        ["Sometimes", 32],
        ["I usually wait", 12],
      ] },
    { id: "arrival",           dim: "d3", text: "How do you usually arrive at a product page?",
      options: [
        ["Searching for the exact product", 85],
        ["The retailer’s app or site", 55],
        ["A social post or an ad", 48],
        ["A deals or coupon site", 15],
      ] },
    { id: "cart-sitting",      dim: "d3", text: "How often do you leave items sitting in a cart for a day or more?",
      options: [
        ["Never", 85],
        ["Rarely", 58],
        ["Sometimes", 30],
        ["Often — deliberately", 10],
      ] },
    { id: "how-quickly",       dim: "d3", text: "When you need something, how quickly do you typically buy it?",
      options: [
        ["Same day", 90],
        ["Within a few days", 55],
        ["Within a couple of weeks", 28],
        ["I wait for a price I like", 10],
      ] },
    { id: "cookie-banner",     dim: "d4", text: "When a site shows a cookie banner, what do you usually do?",
      options: [
        ["Accept all", 90],
        ["Whatever’s fastest", 72],
        ["Reject non-essential", 25],
        ["My browser handles it", 10],
      ] },
    { id: "advertising-id",    dim: "d4", text: "Have you turned off your phone’s advertising ID, or blocked third-party cookies?",
      options: [
        ["Neither", 88],
        ["One of them", 45],
        ["Both", 12],
        ["Not sure", 72],
      ] },
    { id: "device",            dim: "d5", text: "What do you mostly shop on?",
      options: [
        ["A newer iPhone or Mac", 82],
        ["A newer Android or Windows device", 55],
        ["An older device", 25],
        ["It varies", 40],
      ] },
    { id: "multi-device",      dim: "d5", text: "Do you shop across multiple devices or browsers, or from one?",
      options: [
        ["One device", 82],
        ["Two", 50],
        ["Several", 25],
        ["I deliberately vary it", 10],
      ] },
    { id: "where-you-live",    dim: "d6", text: "Relative to your metro area, how would you describe where you live?",
      options: [
        ["Higher income", 75],
        ["About average", 48],
        ["Lower income", 68],
        ["Not sure", 50],
      ] },
    { id: "vpn",               dim: "d6", text: "Do you use a VPN, or otherwise limit location sharing when you shop?",
      options: [
        ["Never", 82],
        ["Occasionally", 55],
        ["Usually", 28],
        ["Always", 10],
      ] },
  ],

  reveals: {
    5: { source: "U.S. Patent 11,429,992 · Walmart · granted 2022",
        title: "“Systems and methods for dynamic pricing.”",
        body: "Estimates demand and price elasticity for the items in a shopper’s electronic basket using a multi-armed bandit model, and sets the displayed price from the results.",
        kicker: "In plain terms: continuous live pricing experiments, run on customers." },
    8: { source: "U.S. Patent 11,182,835 · IBM, since assigned to DoorDash · granted 2021",
        title: "“Individual online price adjustments in real time.”",
        body: "Monitors a user’s online communications to identify interest in a product — and how much the user already knows about its price — then adjusts the price shown to that individual in real time.",
        kicker: "Pricing calibrated to your ignorance." },
    11: { source: "Orbitz · documented 2012",
        title: "Mac users were steered toward pricier hotels.",
        body: "The travel site inferred that shoppers browsing on a Mac would seek more upscale brands, and said Mac users were about 40 percent more likely to book four- or five-star properties.",
        kicker: "Fourteen years ago, with none of today’s tooling." },
  },

  inferences: [
    { dim: "d1", high: 1,
      claim: "You’re a returning customer who doesn’t check other prices.",
      because: "Signed in, enrolled in loyalty programs, and going back to the same retailer.",
      evidence: "In a willingness-to-pay model this is a high-confidence signal. <b>Walmart’s U.S. Patent 11,429,992</b> describes estimating elasticity for the items in a shopper’s basket and setting the displayed price from live experiments run on customers." },
    { dim: "d2", high: 1,
      claim: "You buy the first thing you find.",
      because: "Few retailers checked, no comparison tools, same-session purchases.",
      evidence: "Comparison shopping is the signal these systems read most directly — the count of product pages you open. <b>Instacart’s U.S. Patent 12,417,465</b> computes an individual shopper’s price-sensitivity score from exactly this kind of behavior, then targets prompts and offers accordingly." },
    { dim: "d3", high: 1,
      claim: "You decide fast, and you don’t wait for a better price.",
      because: "Direct searches, quick purchases, carts that don’t sit.",
      evidence: "Urgency is the most valuable inference in the set. <b>IBM’s U.S. Patent 11,182,835</b>, since assigned to DoorDash, monitors communications to gauge both interest and how much you already know about the price — then adjusts what you’re shown in real time." },
    { dim: "d4", high: 1,
      claim: "Your behavior follows you between sites.",
      because: "Cookies accepted, advertising ID live, one email address across everything.",
      evidence: "This is what makes the rest of it joinable. Customer data platforms operating at sub-second latency stream this into pricing engines while you’re still on the page — the testimony names Segment, Tealium, mParticle and ActionIQ." },
    { dim: "d5", high: 1,
      claim: "Your device suggests you can afford more.",
      because: "Shopping from one newer device, consistently.",
      evidence: "The oldest documented proxy in the record. <b>Orbitz, 2012</b> — Mac users steered toward pricier hotels on the inference that they were about 40 percent more likely to book four- and five-star properties." },
    { dim: "d6", high: 1,
      claim: "Where you live is a pricing input.",
      because: "Location shared freely, and a distinctive one.",
      evidence: "<b>Staples, 2012</b> — the Wall Street Journal found online prices varying by inferred ZIP. The ZIP codes shown the discounted price averaged $59,900 in income; those shown the higher price averaged $48,700. <b>Lower-income areas systematically paid more.</b>" },
    { dim: "d2", high: 0,
      claim: "You comparison shop — and the system notices that too.",
      because: "Multiple retailers checked, purchases delayed.",
      evidence: "Being hard to read is itself a reading. The testimony is explicit that shoppers who demonstrate scrutiny get coarser, less targeted prices — the system falls back to rough guesses. That is the defense working, and it is also the ceiling of what it can do." },
    { dim: "d4", high: 0,
      claim: "You’ve cut enough of the trail to be blurry.",
      because: "Cookies rejected, advertising ID off, or a separate shopping address.",
      evidence: "New and signed-out shoppers, with little behavioral history attached, get coarser pricing because the system has less to work with. It does not get you out — it moves you from an audience of one to an audience of a few thousand." },
    { dim: "d1", high: 0,
      claim: "You’re partially invisible, and it costs them precision.",
      because: "Guest checkout, few loyalty programs, no single retailer you return to.",
      evidence: "Identity persistence is what stitches sessions into a profile. Without it, the willingness-to-pay estimate degrades — which is precisely why loyalty programs are marketed as savings." },
  ],

  /* -- Ceiling simulator ---------------------------------------------------
   * Caps are BY QUESTION ID. "where-you-live" is deliberately uncapped by
   * every strategy: no amount of privacy hygiene moves your neighbourhood. */
  ceiling: [
    { title: "Shop signed out, and vary devices and browsers",
      detail: "Check a price on a second device or in a private window before buying.",
      caps: { "signed-in": 15, "device": 40, "multi-device": 15 } },
    { title: "Stop broadcasting urgency",
      detail: "Let carts sit. Open several product pages. Compare before you commit.",
      caps: { "retailers-checked": 20, "comparison-tools": 20, "same-session": 18, "arrival": 30, "cart-sitting": 15, "how-quickly": 18 } },
    { title: "Treat loyalty programs skeptically",
      detail: "Enroll selectively, and demonstrate a willingness to switch.",
      caps: { "loyalty": 32, "same-retailer": 28 } },
    { title: "Cut the data trail",
      detail: "Reject non-essential cookies, block third-party cookies, disable the advertising ID.",
      caps: { "cookie-banner": 18, "advertising-id": 15, "vpn": 22 } },
  ],

  /* -- Glossary ------------------------------------------------------------
   * Any copy may wrap a term in [[double brackets]] to attach a hover/tap
   * definition. Keys match case-insensitively. */
  glossary: {
    "willingness to pay": { term: "willingness to pay", definition: "The industry term for how price-sensitive you are. A high willingness to pay means a seller expects you to buy without walking away, so it can show you a higher price." },
    "surveillance pricing": { term: "surveillance pricing", definition: "Setting a price for one specific person using behavioural data collected about them without their knowledge or consent. Distinct from ordinary dynamic pricing, where the price moves with the market and everyone sees the same number." },
    "dynamic pricing": { term: "dynamic pricing", definition: "Changing a price in response to market conditions - demand, inventory, time of day. Not inherently a problem: everyone looking at the product sees the same price." },
    "product detail page": { term: "product detail page", definition: "The page for a single item. How many of these you open in one session is one of the clearest signals that you are comparing rather than committing." },
    "advertising ID": { term: "advertising ID", definition: "A unique identifier your phone hands to apps so your activity can be linked across them. It can be reset or switched off in your phone's privacy settings." },
    "third-party cookie": { term: "third-party cookie", definition: "A tracker set by a company other than the site you are on, used to follow you between sites. Most browsers can now block these by default." },
    "data broker": { term: "data broker", definition: "A company that buys, combines and sells personal information about people who have no relationship with it and usually do not know it exists." },
    "coverage": { term: "coverage", definition: "How much of a spending category is subject to algorithmic pricing at all. A fact about the market, not about you - this tool never adjusts it from your answers." },
    "consumer unit": { term: "consumer unit", definition: "The statistical household the Bureau of Labor Statistics uses to report spending. Roughly a household, averaging about 2.5 people." },
    "price elasticity": { term: "price elasticity", definition: "How much demand for something changes when its price changes. Estimating yours, individually, is the point of the behavioural data described here." },
  },
};
