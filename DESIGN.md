---
name: Kinetic Noir
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f21'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#e3beb3'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#aa897f'
  outline-variant: '#5b4138'
  surface-tint: '#ffb59d'
  primary: '#ffb59d'
  on-primary: '#5d1900'
  primary-container: '#ff5e1e'
  on-primary-container: '#561600'
  inverse-primary: '#ab3500'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#c6c6cf'
  on-tertiary: '#2f3037'
  tertiary-container: '#93939c'
  on-tertiary-container: '#2b2c33'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59d'
  on-primary-fixed: '#390c00'
  on-primary-fixed-variant: '#832700'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e2e1eb'
  tertiary-fixed-dim: '#c6c6cf'
  on-tertiary-fixed: '#1a1b22'
  on-tertiary-fixed-variant: '#45464e'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
  surface-pitch: '#050507'
  surface-slate: '#111114'
  border-hairline: '#1F1F23'
  border-subtle: '#27272A'
  text-muted: '#71717A'
  accent-hover: '#FF7A45'
typography:
  display-hero:
    fontFamily: Anton
    fontSize: 112px
    fontWeight: '400'
    lineHeight: 96px
    letterSpacing: -0.04em
  display-hero-mobile:
    fontFamily: Anton
    fontSize: 56px
    fontWeight: '400'
    lineHeight: 52px
    letterSpacing: -0.03em
  headline-xl:
    fontFamily: Anton
    fontSize: 72px
    fontWeight: '400'
    lineHeight: 68px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Anton
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Anton
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Anton
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Outfit
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Outfit
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-mono-lg:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.08em
  label-mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
    letterSpacing: 0.1em
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 2rem
  space-xl: 3.5rem
---

## Brand & Style

This design system embodies the intersection of avant-garde cinema, haute-couture editorial typography, and disciplined brutalist architecture. Built for high-concept production agencies, independent motion picture houses, and boundary-pushing creative studios, the aesthetic strips away decorative frivolity in favor of structural purity, monumental type scaling, and film slate precision.

The visual language contrasts obsidian voids with searing optical whites, anchored by an incendiary electric vermilion accent drawn from cinema tally lamps and industrial marking tapes. The tone is deliberate, uncompromising, and commanding. Every element behaves like an architectural framing device or camera metadata readout: deliberate hairline partitions, asymmetric pacing, tight tracking on monumental headings, and stark monospaced annotations that treat the viewport as a live cinematic monitor.

## Colors

The palette operates under absolute dark mode discipline. The primary chromatic energy is an unyielding electric vermilion (`#FF5E1E`), reserved strictly for focal engagement, active operational states, live metadata indicators (such as recording badges or playheads), and tactical interactive hovers.

The structural foundation relies on a layered sequence of pitch blacks:
- `surface-pitch` (`#050507`): Absolute canvas base, simulating the depth of unlit celluloid.
- `neutral_color_hex` (`#0A0A0C`): Primary workspace and layout background.
- `surface-slate` (`#111114`): Elevated panels, lightbox drawers, and inset preview wells.

Typography relies on optical white (`#FFFFFF`) for headline punch and maximum legibility, balanced by bone neutral gray (`#A1A1AA`) for long-form narrative body and muted iron (`#71717A`) for tertiary timecodes and camera metadata. Grid divisions and borders strictly employ razor-thin hairlines (`#1F1F23` and `#27272A`) to partition space without interrupting cinematic immersion.

## Typography

The typography strategy leverages tension between monumental, condensed editorial impact and rigorous technical clarity.

Display headings utilize **Anton** in uppercase, locked to tight line heights and negative tracking to achieve an architectural, masthead-style presence reminiscent of cinema title sequences and art-house broadsheets. Body copy shifts into **Outfit**, providing geometric balance, legible human warmth, and seamless reading flow against dark backgrounds. 

All interactive prompts, categorization tags, production logs, timecodes, indices, and camera metadata leverage **JetBrains Mono** set in uppercase with wide tracking (`0.08em` to `0.1em`). Repeated slash motifs (`//////`) and numeric sequences act as typographic glyph dividers between content groups.

## Layout & Spacing

The layout is built on a 12-column fluid grid that alternates between full-bleed cinematic horizontal bands and sharply delineated vertical structural rails. Canvas gutters are maintained with strict hairline boundaries rather than soft whitespace.

Outer margins span `3rem` on desktop to simulate the matting of an art gallery catalog, collapsing cleanly to `1.25rem` on mobile interfaces. Breakpoints adhere to standard viewports:
- **Desktop (1280px+)**: 12 columns, 1.5rem gutter, extensive negative space offsets, and asymmetric multi-column headline spans.
- **Tablet (768px - 1279px)**: 8 columns, 1rem gutter, with 2-column project index cards.
- **Mobile (under 768px)**: 4 columns, single-column full-bleed asset stacks, and edge-to-edge interactive marquee ribbons.

Asymmetric vertical rhythm is intentional: dense, compact metadata blocks sit immediately alongside vast expansive visual viewports to preserve tension.

## Elevation & Depth

This design system strictly rejects skeuomorphic blurs, drop shadows, and soft neomorphic depth. Depth is defined through planar architectural layering, high color contrast, and 1px hairline structural frames (`#1F1F23` and `#27272A`).

1. **Base Depth (Ground Zero):** Surfaces sit on `#050507`. Content containers do not hover or lift; they sit edge-to-edge divided by razor-sharp border strokes.
2. **Elevated Panels & Flyouts:** Contextual drawers, filter overlays, and mobile navigation sheets translate strictly along the X or Y axis with 100% opacity backgrounds (`#0A0A0C`), framed by a single 1px solid hairline (`#27272A`).
3. **Film Grain & Overlays:** Video framing elements utilize pure black letterbox overlays with no shadow bleed. Focus and active selections are highlighted through instantaneous line-weight shifts or vermilion perimeter outlines instead of diffuse elevation.

## Shapes

The geometric philosophy is strictly non-rounded (`0px` border radius everywhere). Every element—from primary action buttons and thumbnail containers to input fields, badges, and modals—adheres to razor-sharp 90-degree corners. 

This absolute square geometry echoes viewfinders, slate clappers, and modernist industrial design, distinguishing the UI from generic rounded consumer software and delivering uncompromising brutalist character.

## Components

### Buttons
- **Primary:** Sharp rectangles with background `#FF5E1E`, text `#FFFFFF` in `label-mono-lg`, 0px radius. Padding: `14px 28px`. On hover, the surface shifts to `#FF7A45` with instant transition.
- **Secondary / Ghost:** Transparent background with 1px solid hairline border `#27272A`, text `#FFFFFF`. On hover, border turns `#FFFFFF`, and background shifts to `#111114`.
- **Text Action:** `JetBrains Mono` with preceding slash accent (`/ VIEW REEL`), transforming to vermilion underline on hover.

### Chips & Badges
- Constructed with a 1px border (`#1F1F23`), `#050507` background, and uppercase `label-mono-sm` text in `#A1A1AA`.
- Live or active status chips incorporate a 6px blinking square indicator rendered in `#FF5E1E` alongside uppercase text (e.g., `[ • REC 24FPS ]`).

### Lists & Tables
- Divided strictly by 1px horizontal rules in `#1F1F23`.
- List rows feature index markers (`01`, `02`, `03`) in `JetBrains Mono` muted gray (`#71717A`), expanding to full white with an instantaneous vermilion flash upon hover across the entire row span.

### Checkboxes & Radios
- Sharp 14px × 14px squares with 1px hairline borders (`#27272A`).
- Checked state fills the box entirely with `#FF5E1E` featuring a centered black optical dot, maintaining pure brutalist mechanics.

### Input Fields
- Underline-only or stark box variants. Underline variant features a 1px solid border at the bottom (`#27272A`) over an inset background `#050507`.
- Input text uses `Outfit` body-md, while floating labels utilize `label-mono-sm` in `#71717A`. On focus, the border transitions immediately to `#FF5E1E` without an outer glow.

### Cards & Media Viewports
- Sharp edge-to-edge media containers featuring an aspect ratio of 16:9 or 2.39:1 (anamorphic cinema standard).
- Overlaid metadata sits pinned to the corners (top-left project category, top-right year/client code, bottom-left title in `Anton`). 
- Cards lack background shadows and are enclosed in 1px border frames (`#1F1F23`).

### Studio Marquee & Slash Dividers
- Continuously scrolling infinite horizontal tickers rendering agency credos, current status, and client rosters.
- Words are separated by bold forward slash sequences (`//////`) colored in `#FF5E1E`.