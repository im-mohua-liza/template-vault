# Template Vault

Your library of website templates for client work. Open **`index.html`** in a browser (double-click it) to browse everything.

## What's inside

**14 templates**

| Template | Category | Style | Best for |
|---|---|---|---|
| **Aurora** | SaaS & Startup | Futuristic, dark | software, apps, tech products |
| **Noir** | Agency & Portfolio | Editorial, dark | studios, freelancers, creatives |
| **Bloom** | Restaurant & Cafe | Warm | restaurants, cafes, food brands |
| **Atlas** | Corporate & NGO | Corporate | consultancies, NGOs, foundations |
| **Pulse** | Fitness & Events | Bold, dark | gyms, clubs, events, festivals |
| **Haven** | Real Estate & Architecture | Luxury | estate agents, architects, interiors |
| **Byte** | Agency & Portfolio | Playful (neo-brutalist) | studios, startups, Gen-Z brands |
| **Velvet** | Beauty & Wellness | Luxury | salons, spas, skincare, aesthetics |
| **Nova** | AI & Tech | Futuristic, dark | AI tools, dev tools, deep-tech |
| **Folio** | Photography & Art | Minimal | photographers, artists, videographers |
| **Harbor** | Hotel & Travel | Warm | hotels, B&Bs, resorts, tours |
| **Kite** | Education & Courses | Playful (+ dark mode) | courses, bootcamps, coaches |
| **Drift** | E-commerce & Product | Bold | product launches, D2C brands |
| **Care** | Health & Medical | Corporate | clinics, dentists, therapists, vets |

**42 animations**, **16 colour palettes** and **14 font pairings**.

Each template is plain HTML + CSS + a little JS. There's no build step and nothing to install.

## Using the vault

- **Templates tab**: live previews of every template.
  - Filter by industry, by style (Bold, Luxury, Minimal…), or light/dark. Star your ★ favourites (saved in your browser), sort, or search (press `/`).
  - Click a card to preview it full-screen at desktop, tablet or mobile size. Use ‹ › or the arrow keys to flip between templates.
- **Animations tab**: 42 copy-paste effects in 6 groups (Entrances, Text, Scroll, Mouse, Interactive, Ambient). **Live ↗** opens each one's demo in `animations.html`.
- **Styles tab**: colour palettes (click a colour to copy its code, or copy the whole palette as CSS) and Google font pairings (Copy gives you the `<link>` tag and CSS).
- Direct links: `index.html#animations` and `index.html#styles` open those tabs.
- **Use template**: type the client's name and copy the command it gives you.

## Start a client project

In PowerShell, inside this folder:

```powershell
powershell -ExecutionPolicy Bypass -File .\new-site.ps1 -Template bloom -Client "Sunrise Bakery" -Open
```

This creates `clients\sunrise-bakery\` with the template and its own copy of the animation kit (`assets\`), so it's fully standalone. Run with `-List` to see template names, or `-Dest D:\Sites` to create it somewhere else.

Then in the client folder:
1. **Brand it**: change the `:root` colour and font tokens at the top of `style.css`. The Styles tab gives you ready-made sets.
2. **Content**: edit the text in `index.html`.
3. **Photos**: the image blocks are CSS gradient placeholders or drawings. Replace them with `<img>` tags or `background-image`.
4. **Dates**: Pulse has a countdown (`data-countdown="..."`), and Kite has a cohort date in its badge.
5. **Forms**: they show a thank-you message but don't send anything yet. Hook them up to FormSubmit, Netlify Forms, Formspree or similar.

## Add a new template to the vault

1. Make a folder `templates\<id>\` with an `index.html` (and `style.css`).
2. Load the kit in it the same way the others do:
   ```html
   <script>document.documentElement.classList.add('motion')</script>
   <link rel="stylesheet" href="../_shared/motion.css">
   ...
   <script src="../_shared/motion.js"></script>
   ```
3. Add one entry to `TEMPLATES` in `registry.js` (set its `category`, `style` and `theme`). It shows up in the vault straight away, including in the filters.

To add your own palettes or font pairings, add them to `PALETTES` / `FONT_PAIRS` in `registry.js`.

## The animation kit (`templates/_shared/`)

Every effect is one attribute or class:

- **Entrance & text:** `data-reveal`, `data-stagger`, `data-split` (`="chars"` for letters), `data-scramble`, `data-rotate`, `data-typed`, `data-scrub`, `data-count`, `data-preloader`
- **Scroll:** `data-parallax`, `data-expand`, `data-zoom`, `data-stack`, `data-hscroll`, `data-skew`, `data-draw`, `data-scroll-progress`, `data-header`
- **Mouse:** `data-magnetic`, `data-tilt`, `data-spotlight`, `data-trail`, `data-cursor`, `data-particles`
- **Interactive:** `data-ripple`, `data-confetti`, `data-compare`, `data-tabs`, `data-carousel`, `data-countdown`, `data-theme-toggle`, `data-marquee`
- **Classes:** `fx-float`, `fx-spin`, `fx-blob`, `fx-shine`, `fx-glitch`, `fx-gradient-text`, `fx-pulse`, `fx-underline`, `fx-bounce-in`

It respects the visitor's "reduce motion" setting automatically.
