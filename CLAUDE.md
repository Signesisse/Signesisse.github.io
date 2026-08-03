# CLAUDE.md

Context for Claude Code. Read before making changes.

## Project

Personal website on GitHub Pages, served from a custom `.dk` domain. Plain
static HTML/CSS/JS — no framework, no build step, no dependencies. That is a
deliberate choice.

Currently one homepage: short Danish text over a full-bleed photograph of a tree
whose canopy resembles lungs. More pages are planned.

```
index.html      # homepage
style.css       # all styles
aandedraet.jpg  # the background picture
CNAME           # custom domain binding
```

## Local dev and deploy

`python3 -m http.server 8000`, then open `localhost:8000`. Hard-refresh after CSS
changes. Pushing to `main` goes live in ~1 minute; there is no staging, so verify
locally first.

## Hard rules

- **Never touch `CNAME`.** Removing it detaches the domain and forces HTTPS
  re-provisioning. It holds the domain in Punycode (`xn--…`) — that looks like a
  typo but is correct; do not "fix" it.
- **Never add a framework, build step, or dependency without asking.**
- **Never commit unoptimized images.**
- **Never reformat files you weren't asked to touch.** Keep diffs small.

## The background image

The photograph is the centrepiece of the site, not a backdrop. On desktop,
compose so the full image reads clearly.

On mobile, usability wins over showing the whole photo. Crop to fill rather than
shrinking or letterboxing it:

```css
img { object-fit: cover; object-position: center 30%; }
```

Tune `object-position` so the lung-shaped canopy stays in frame at portrait
aspect ratios — that shape is the entire point of the image. Text over it must
stay legible; check contrast where the photo is lightest.

## Responsive

Every change works on phone and desktop. Mobile-first: base styles narrow,
`min-width` queries to add complexity. Check ~375px, 768px, 1440px. No horizontal
scroll at any width; tap targets ≥44px; relative units (`rem`, `clamp()`) over
fixed pixels. Use `100dvh` not `100vh` — mobile address bars change viewport
height and cause jumping.

If any animation is added, gate it behind `prefers-reduced-motion`.

## Language

All visitor-facing text is **Danish** — body text, headings, nav, `alt`,
`<title>`, meta descriptions. Never translate to English or draft new content in
English unless asked.

- `<html lang="da">` and `<meta charset="utf-8">` on every page (the latter or
  æ/ø/å break).
- Danish quotation marks »tekst«, dates as `3. august 2026`, decimal comma.
- Danish barely capitalises headings: `Om mig`, not `Om Mig`.

Comments, commit messages, and filenames stay English. No æ/ø/å in filenames or
URL paths.

## Conventions

Two-space indent. Lowercase-hyphenated class names. Colours and key spacing as
custom properties in `:root`. Semantic HTML over nested `<div>`s; real heading
hierarchy; meaningful `alt` text (`alt=""` if decorative). New pages need
`<title>`, meta description, and viewport meta, and share the common stylesheet.

**Before finishing:** checked narrow + wide, no console errors, `CNAME` intact,
new text in Danish rendering correctly.
