# Mo'eats — *More than eats*

The marketing website for **Mo'eats**, the trusted platform for verified wellness food — connecting producers, retailers, and homes across Nigeria.

A fast, fully-static, multi-page site. No build step, no dependencies. Just open `index.html` or deploy the folder anywhere.

---

## 🗂 Structure

```
moeats/
├── index.html          # Home (customer-facing entry + platform overview)
├── processors.html     # For Producers & Processors
├── retailers.html      # For Retailers & Stores
├── riders.html         # For Riders & Logistics
├── about.html          # About + the Intelligence Layer
├── login.html          # Log in / onboarding (multi-role: shopper, producer, retailer, rider)
├── README.md
└── assets/
    ├── css/
    │   ├── base.css        # Shared design system (tokens, nav, mega-menu, footer)
    │   ├── home.css        # Home-page-specific styles
    │   └── interior.css    # Interior-page styles (features, dashboards, auth, FAQ)
    ├── js/
    │   └── main.js         # Nav, mega-menu, scroll reveals, count-ups, forms, accordions
    └── img/                # (reserved for future imagery)
```

## 🧭 Navigation

A **hover-triggered mega-menu** on desktop (with the Nielsen-recommended hover delay to avoid flicker), collapsing to a **tap-accordion** on mobile:

- **Shop** — browse categories + how ordering works + app promo
- **Platform** — the three audiences: Producers, Retailers, Riders (each links to its full page) + the Intelligence Layer
- **Resources** — how it works, help centre, insights, stories
- **Company** — about, mission, careers, contact
- **Log in** / **Get the app** — utility actions

Each dropdown item shows a short description, following the Ahrefs/HubSpot pattern. Fully keyboard-accessible (Escape closes, focus states visible) and respects `prefers-reduced-motion`.

## 🎨 Brand

**Colour system is light-dominant.** Soft Ivory is the primary background everywhere; Deep Forest Green is reserved strictly for CTAs and anything clickable-to-elsewhere. It is not used as a general background.

| Token | Hex | Use |
|---|---|---|
| Soft Ivory | `#F5F2E8` | **dominant page background** |
| Cream | `#FAF8F1` | alternating sections |
| Deep Forest Green | `#1A3A2E` | **CTAs / clickable-to-elsewhere only** — buttons, the footer, select dramatic hero/CTA moments |
| Emerald Glow | `#2D5A45` | hover state on forest CTAs, ambient glows within forest moments |
| Near-Black Green | `#0D1A14` | deepest edge of forest gradients |
| Muted Brass | `#C9A961` | small accents — eyebrows, rules, icons, stat numbers |

**Soft supporting tones** (added for warmth): Sage `#A8BFA8`, Sand `#E8DFC8`, Clay `#D4A574`.

The real Mo'eats logo (`assets/img/moeats-logo.png` / `-sm.png` / `favicon.png`) is used throughout — nav, footer, login, and favicon. It's the source-uploaded mark, trimmed and rounded, not a redrawn approximation.

Each page mixes light and forest deliberately: light ivory/cream carries most of the page; forest appears at the hero visual (home), and always at the closing CTA band and footer — the "dramatic dark moments." Type: **Fraunces** (display) + **Inter** (body).

## ✨ Motion system

- **Kinetic headlines** (`data-kinetic`) — words rise into place, staggered, on scroll into view.
- **Pathway signature** (`.pathway-track`, in the Home "How it works" section) — a scroll-scrubbed line fills and lights up nodes as you scroll, echoing the pathway in the logo's negative space. This is the site's unique-to-Mo'eats motion element.
- **Scroll reveals** (`data-reveal`) — staggered fade/rise-ins throughout.
- **Magnetic CTAs** (`data-magnetic`, desktop only) — primary buttons drift slightly toward the cursor.
- **Parallax halo** (`data-parallax`) — the hero's ambient glow drifts on scroll.
- All motion respects `prefers-reduced-motion` and degrades to instant/static.

## 🚀 Deploy

**GitHub Pages:** push to a repo → Settings → Pages → deploy from `main` / root. Done.

**Or any static host** (Vercel, Netlify, Cloudflare Pages): point it at this folder — no build command needed.

**Local preview:**
```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## 📝 Notes

- Forms are front-end demos (no backend wired). Submitting shows a confirmation state — connect to your backend / form service when ready.
- The in-app phone mockups and dashboards are HTML/CSS (no images), so they stay crisp at any resolution and are easy to restyle.
- `login.html` reads a `?role=` query param (`customer`, `producer`, `retailer`, `rider`) to pre-select the account type and swap the contextual copy — the partner-page CTAs use this.

---

© 2026 Mo'eats. *More than eats.*
