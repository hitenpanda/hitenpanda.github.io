---
name: design-melon-studio
description: Design system extracted from melon studio (https://melon.studio/). Use when building UI that should match this brand's visual identity.
triggers:
  - "melon studio"
  - "melon-studio"
  - "design like melon studio"
  - "melon studio風"
source: https://melon.studio/
extractedAt: 2026-11-20T06:02:21.798Z
tags: ["light", "rounded", "monochrome", "monospace", "sans-serif"]
---
# Design System Inspired by melon studio

> Auto-extracted from `https://melon.studio/` on 2026-11-20

## 1. Visual Theme & Atmosphere

Friendly, approachable design with rounded shapes and generous whitespace.

The hero section leads with "melon studio — UX/UI, web, app and SaaS design studio in Poznań, Poland".

**Key Characteristics:**
- early-sans-variable as the heading font
- early-sans-variable as the body font for all running text
- Heading weight 700
- Light/white background (#ffffff) as the primary canvas
- Primary accent `#888888` used for CTAs and brand highlights
- 4 shadow level(s) detected — standard shadows
- Rounded corners (6px+) creating a friendly, approachable feel
- Tags: light, rounded, monochrome, monospace, sans-serif

## 2. Color Palette & Roles

### Primary
- **Primary Accent** (`#888888`) · `--color-primary`: Brand color, CTA backgrounds, link text, interactive highlights.
- **Secondary Accent** (`#aaaaaa`) · `--color-secondary`: Secondary brand, hover states, complementary highlights.
- **Background** (`#ffffff`) · `--color-bg`: Page background, primary canvas.
- **Background Secondary** (``) · `--color-bg-secondary`: Cards, surfaces, alternating sections.

### Text
- **Text Primary** (`#000000`) · `--color-text`: Headings and body text.
- **Text Secondary** (`#666666`) · `--color-text-secondary`: Muted text, captions, placeholders.

### Borders & Surfaces
- **Border** (`#e5e5e5`) · `--color-border`: Dividers, outlines, input borders.

## 3. Typography Rules

- **Heading Font:** `early-sans-variable`, sans-serif
- **Body Font:** `early-sans-variable`, sans-serif

### Type Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| H1 | early-sans-variable | 36px | 700 | 52.2px | normal |
| H2 | early-sans-variable | 176px | 300 | 151.36px | -8.8px |
| H3 | early-sans-variable | 18px | 400 | 18px | -0.18px |
| Body | early-sans-variable | 33.81px | 300 | 36.5148px | -0.84525px |

### Type Scale

| Token | Size | Suggested Usage |
|---|---|---|
| Display | `176px` | headings |
| H1 | `170.52px` | headings |
| H2 | `117.6px` | headings |
| H3 | `108.78px` | headings |
| H4 | `75.705px` | headings |
| Body L | `52.92px` | body / supporting text |
| Body | `44.1px` | body / supporting text |
| Small | `36px` | body / supporting text |
| XS | `33.81px` | body / supporting text |
| Caption | `32.34px` | body / supporting text |

## 4. Component Stylings

### Primary Button

```css
.btn-primary {
  background: transparent;
  color: ;
  border-radius: 50px;
  padding: 1px 6px;
  font-size: 18px;
  font-weight: 400;
  border: 1px solid oklch(0.999998 0.0000253939 none / 0.3);
  cursor: pointer;
}
```

### Pill Button

```css
.btn-pill {
  background: transparent;
  color: ;
  border-radius: 999px;
  padding: 0px 18px;
  font-size: 14px;
  font-weight: 450;
  border: 1px solid lab(100 0 0);
  cursor: pointer;
}
```

### Pill Button 2

```css
.btn-pill-2 {
  background: transparent;
  color: ;
  border-radius: 999px;
  padding: 0px 18px;
  font-size: 14px;
  font-weight: 450;
  border: 1px solid lab(100 0 0);
  cursor: pointer;
}
```

### Card

```css
.card {
  background: #000000;
  border-radius: 6px;
  padding: 0px;
}
```

## 5. Layout Principles

- **Base spacing unit:** `20px` — use multiples (40px, 60px, 80px, etc.)

### Spacing Scale (extracted from real elements)

| Token | Value | Role |
|---|---|---|
| spacing-1 | `20px` | element |
| spacing-2 | `5.85px` | element |
| spacing-3 | `26px` | card |
| spacing-4 | `31px` | card |
| spacing-5 | `8px` | element |
| spacing-6 | `12.6px` | element |
| spacing-7 | `137.88px` | section |
| spacing-8 | `1px` | element |

### Border Radius Scale

| Token | Value | Element |
|---|---|---|
| radius-button | `6px` | button |
| radius-card | `50px` | card |
| radius-subtle | `2px` | subtle |
| radius-subtle | `3px` | subtle |

## 6. Depth & Elevation

| Level | Shadow | Usage |
|---|---|---|
| Deep | `lab(0 0 0 / 0.75) 0px 16px 30px -16px, oklch(0.999998 0.0000253939 none / 0.06) ...` | Hero sections, deep layers |
| Low | `oklch(0.999998 0.0000253939 none / 0.22) 0px 0px 0px 3px` | Cards, subtle elevation |
| Low | `oklch(0.628011 0.257679 29.2347 / 0.2) 0px 0px 0px 4px` | Cards, subtle elevation |
| Deep | `lab(0 0 0 / 0.6) 0px 18px 44px -22px` | Hero sections, deep layers |


## 7. Do's and Don'ts

### Do
- Use `#ffffff` as the primary background color
- Use `early-sans-variable` for all headings and `early-sans-variable` for body text
- Use `#888888` as the single dominant accent/CTA color
- Maintain `20px` as the base spacing unit — all gaps should be multiples
- Use rounded corners (`6px`+) consistently for all interactive elements
- Stick to grayscale + `#888888` accent — avoid color overload
- Apply the shadow system for elevation — use the extracted shadow values
- Use weight 700 for headings to match the brand's typographic voice

### Don't
- Don't use colors outside the extracted palette without justification
- Don't substitute early-sans-variable/early-sans-variable with generic alternatives
- Don't use irregular spacing — stick to 20px grid
- Don't use dark/black backgrounds — this is a light-themed design
- Don't use sharp corners — they feel hostile in this rounded design language
- Don't add additional saturated colors beyond the primary accent
- Don't use pure black (#000000) for text — use `#000000` instead
- Don't add decorative elements not present in the original design — no badges, ribbons, banners, or ornaments unless the source site uses them
- Don't invent UI patterns the source site doesn't have — if the original has no NEW badge, don't add one just because a red is in the palette

## 8. Responsive Behavior

| Breakpoint | Width | Notes |
|---|---|---|
| Mobile | < 640px | Single column, stack sections, reduce font sizes ~80% |
| Tablet | 640–1024px | 2-column where appropriate, maintain spacing ratios |
| Desktop | 1024–1440px | Full layout as designed |
| Wide | > 1440px | Max-width container, center content |

- Touch targets: minimum 44×44px on mobile
- Maintain 20px base unit across breakpoints — only scale multipliers

## 9. Agent Prompt Guide

### Quick Color Reference

```
Background:  #ffffff
Text:        #000000
Accent:      #888888
Secondary:   #aaaaaa
Border:      #e5e5e5
```

### Example Prompts

1. "Build a hero section with a `#ffffff` background, `early-sans-variable` heading in `#000000`, and a `#888888` CTA button."
2. "Create a pricing card using background ``, border `#e5e5e5`, `early-sans-variable` for text, and 60px padding."
3. "Design a navigation bar — `#ffffff` background, `#000000` links, `#888888` for active state."
4. "Build a feature grid with 3 columns, 60px gap, each card using the card component style."
5. "Create a footer with `#000000` background, `#ffffff` text, and 40px padding."

### Iteration Guide

1. Start with layout structure (sections, grid, spacing)
2. Apply colors from the palette — background first, then text, then accents
3. Set typography — font families, sizes from the type scale, weights
4. Add components — buttons, cards, inputs using the specs above
5. Apply border-radius consistently across all elements
6. Add shadows for depth — use the extracted shadow values, not defaults
7. Check responsive behavior — test mobile and tablet layouts
8. Final pass — verify all colors match, spacing is consistent, fonts are correct

## 10. CSS Custom Properties

> 28 custom properties extracted from `:root` / `html` stylesheets.

### Color Variables

| Variable | Value |
|---|---|
| `--black` | `#0f0000` |
| `--white` | `#f6efed` |
| `--red-3` | `#e5524a` |
| `--liquid-pink` | `#ffb3b3` |
| `--ink` | `#fff` |
| `--muted` | `oklch(from var(--ink) l c h / .55)` |
| `--rule` | `oklch(from var(--ink) l c h / .12)` |
| `--f-rule` | `oklch(from var(--ink) l c h / .16)` |

### Spacing Variables

| Variable | Value |
|---|---|
| `--gutter` | `40px` |
| `--f-gap` | `24px` |
| `--col-gap` | `3.5rem` |
| `--cap-gap` | `24px` |
| `--f-inv` | `0` |

### Typography Variables

| Variable | Value |
|---|---|
| `--font` | `"early-sans-variable", ui-sans-serif, system-ui, sans-serif` |
| `--font-mono` | `var(--font-geist-mono), ui-monospace, monospace` |
| `--font-display` | `"lekick-regular", "early-sans-variable", ui-sans-serif, sans-serif` |

### Other Variables

| Variable | Value |
|---|---|
| `--red` | `red` |
| `--f-bg` | `var(--black)` |
| `--f-fg` | `var(--ink)` |
| `--f-fg2` | `var(--muted)` |
| `--f-mono` | `500 13px/1.35 var(--font-mono)` |
| `--f-title-size` | `clamp(3.25rem, 7.4vw, 8.75rem)` |
| `--st-gap` | `clamp(72px, 9.5vw, 144px)` |
| `--atf-hero` | `max(83svh, calc(.8vh + 32.4vw + 64px))` |
| `--col-w` | `min(52vw, 92svh)` |
| `--appear-ease` | `cubic-bezier(.11, .06, .18, 1)` |
| `--ease-reveal` | `cubic-bezier(.18, .66, .18, 1)` |
| `--ease-under` | `cubic-bezier(.18, .83, .27, 1)` |
