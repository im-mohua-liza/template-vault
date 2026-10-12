/* ==========================================================================
   VAULT REGISTRY — the list the vault shows.
   To add a template: put its folder in templates/<id>/ (with an index.html),
   then add one entry below. That's it.
   style: Minimal | Bold | Luxury | Playful | Futuristic | Editorial | Warm | Corporate
   ========================================================================== */

window.TEMPLATES = [
  {
    id: 'aurora', name: 'Aurora', category: 'SaaS & Startup', style: 'Futuristic', theme: 'dark', added: '2026-10-12',
    description: 'Dark glassmorphism landing page with drifting gradient light, a live CSS dashboard mockup, pricing toggle and FAQ.',
    bestFor: 'Software, apps, tech startups, digital products',
    colors: ['#07071a', '#7c5cff', '#22d3ee', '#f472b6'], fonts: 'Space Grotesk + Inter',
    sections: ['Hero', 'Product mockup', 'Logo marquee', 'Features', 'Stats', 'Testimonials', 'Pricing', 'FAQ', 'CTA'],
    animations: ['Split-text headline', 'Typed words', 'Scroll reveal', 'Counters', 'Tilt + spotlight cards', 'Marquee', 'Magnetic buttons', 'Scroll progress']
  },
  {
    id: 'noir', name: 'Noir', category: 'Agency & Portfolio', style: 'Editorial', theme: 'dark', added: '2026-10-12',
    description: 'Editorial black-and-lime studio site with a custom cursor, film grain, giant type, and project previews that follow the mouse.',
    bestFor: 'Design studios, freelancers, creatives',
    colors: ['#0a0a0a', '#f2efe9', '#d4ff3a', '#8b877f'], fonts: 'Syne + DM Sans',
    sections: ['Hero', 'Double marquee', 'Work list', 'Featured tiles', 'Services', 'About + stats', 'Contact'],
    animations: ['Custom cursor with labels', 'Hover image follow', 'Split text', 'Outline marquee', 'Clip reveal', 'Parallax', 'Grain']
  },
  {
    id: 'bloom', name: 'Bloom', category: 'Restaurant & Cafe', style: 'Warm', theme: 'light', added: '2026-10-12',
    description: 'Warm, elegant serif design with a spinning plate illustration, rotating badge, tabbed menu with dotted price leaders and a booking form.',
    bestFor: 'Restaurants, cafes, bakeries, wine bars, food brands',
    colors: ['#f6efe4', '#1f3a2e', '#c8643b', '#d9a441'], fonts: 'Cormorant Garamond + Jost',
    sections: ['Hero', 'Story', 'Tabbed menu', 'Gallery marquee', 'Reviews', 'Reservation form', 'Hours & location'],
    animations: ['Parallax leaves', 'Rotating text badge', 'Menu tabs', 'Clip reveal', 'Review carousel', 'Magnetic buttons']
  },
  {
    id: 'atlas', name: 'Atlas', category: 'Corporate & NGO', style: 'Corporate', theme: 'light', added: '2026-10-12',
    description: 'Trustworthy, clean consulting site with floating stat cards, a sticky step-by-step approach, impact numbers, case studies and team.',
    bestFor: 'Consultancies, NGOs, foundations, law & finance firms',
    colors: ['#ffffff', '#0f2a4a', '#14b8a6', '#f59e0b'], fonts: 'Fraunces + Inter',
    sections: ['Hero', 'Clients', 'Services', 'Approach timeline', 'Impact numbers', 'Case studies', 'Testimonial', 'Team', 'Contact'],
    animations: ['Line-draw chart', 'Floating parallax cards', 'Hover-lift services', 'Counters', 'Sticky timeline', 'Scroll progress']
  },
  {
    id: 'pulse', name: 'Pulse', category: 'Fitness & Events', style: 'Bold', theme: 'dark', added: '2026-10-12',
    description: 'Loud neon design with huge condensed type, crossing tape marquees, a live event countdown, tabbed class schedule and tilt coach cards.',
    bestFor: 'Gyms, studios, sports clubs, events, festivals, music',
    colors: ['#0b0b0b', '#c6ff00', '#ff2e88', '#f5f5f5'], fonts: 'Anton + Inter',
    sections: ['Hero + countdown', 'Crossing tapes', 'Class schedule', 'Coaches', 'Numbers', 'Plans', 'Final CTA'],
    animations: ['Live countdown', 'Crossing marquees', 'Schedule tabs', 'Tilt + glare cards', 'Heartbeat logo', 'Counters']
  },
  {
    id: 'haven', name: 'Haven', category: 'Real Estate & Architecture', style: 'Luxury', theme: 'light', added: '2026-10-12',
    description: 'Calm, premium design with an illustrated landscape hero, property search bar and a horizontal-scroll listings gallery.',
    bestFor: 'Real estate, architects, interior designers',
    colors: ['#f4f1ec', '#1c1c1c', '#b89b72', '#6f6a62'], fonts: 'Playfair Display + Manrope',
    sections: ['Hero + search', 'Intro statement', 'Horizontal listings', 'About', 'Process', 'Testimonial', 'Contact'],
    animations: ['Horizontal scroll section', 'Clip reveal hero', 'Parallax images', 'Split text', 'Counters', 'Transparent-to-solid nav']
  },
  {
    id: 'byte', name: 'Byte', category: 'Agency & Portfolio', style: 'Playful', theme: 'light', added: '2026-10-12',
    description: 'Neo-brutalist studio site: thick black outlines, hard shadows, loud colour blocks, spinning stickers, a bento services grid and a confetti contact button.',
    bestFor: 'Creative studios, startups, Gen-Z brands, freelancers',
    colors: ['#fffbea', '#111111', '#ffd23f', '#ff5d8f'], fonts: 'Archivo Black + Space Mono',
    sections: ['Hero + stickers', 'Tape marquee', 'Bento services', 'Work grid', 'Pricing', 'Contact form'],
    animations: ['Letter-by-letter headline', 'Flipping words', 'Click ripple', 'Confetti button', 'Floating stickers', 'Pressable buttons']
  },
  {
    id: 'velvet', name: 'Velvet', category: 'Beauty & Wellness', style: 'Luxury', theme: 'light', added: '2026-10-12',
    description: 'Soft blush-and-plum beauty studio with morphing blob shapes, an arched portrait, tabbed treatment menu and a draggable before/after slider.',
    bestFor: 'Salons, spas, skincare, aesthetics clinics, nail & lash studios',
    colors: ['#fbf4ef', '#3d2430', '#c97b6b', '#c9a27a'], fonts: 'Bodoni Moda + Outfit',
    sections: ['Hero', 'Treatments marquee', 'Tabbed rituals menu', 'Before/after results', 'Reviews', 'Booking form'],
    animations: ['Before/after slider', 'Morphing blobs', 'Flipping words', 'Shine buttons', 'Rotating badge', 'Hover underline']
  },
  {
    id: 'nova', name: 'Nova', category: 'AI & Tech', style: 'Futuristic', theme: 'dark', added: '2026-10-12',
    description: 'Futuristic AI product page with an interactive particle network, decoding text, a terminal demo, scroll-lit statement, stacking cards and spotlight grid.',
    bestFor: 'AI tools, dev tools, Web3, cybersecurity, deep-tech',
    colors: ['#05050c', '#8b7bff', '#4de3ff', '#b6ff6c'], fonts: 'Sora + JetBrains Mono',
    sections: ['Hero + particles', 'Terminal demo', 'Integrations', 'Statement', 'How it works', 'Feature grid', 'Security', 'CTA'],
    animations: ['Particle network', 'Scramble text', 'Scroll-lit words', 'Stacking cards', 'SVG line drawing', 'Cursor spotlight', 'Gradient text']
  },
  {
    id: 'folio', name: 'Folio', category: 'Photography & Art', style: 'Minimal', theme: 'light', added: '2026-10-12',
    description: 'Swiss-minimal photographer portfolio with a counting intro loader, images that trail the cursor, an expanding feature image and a masonry gallery.',
    bestFor: 'Photographers, artists, illustrators, videographers, models',
    colors: ['#efede8', '#141414', '#7c7a74', '#b55d3c'], fonts: 'Inter Tight + Newsreader',
    sections: ['Intro loader', 'Hero + image trail', 'Expanding feature', 'Masonry gallery', 'About', 'Services', 'Contact'],
    animations: ['Preloader counter', 'Cursor image trail', 'Letter-by-letter name', 'Expand on scroll', 'Scroll-lit words', 'Hover underline']
  },
  {
    id: 'harbor', name: 'Harbor', category: 'Hotel & Travel', style: 'Warm', theme: 'light', added: '2026-10-12',
    description: 'Sun-washed boutique hotel with an illustrated sunset hero, booking bar, expanding terrace image, stacking room cards and an animated map route.',
    bestFor: 'Hotels, B&Bs, resorts, tour operators, holiday rentals',
    colors: ['#f3efe7', '#12304a', '#2f6f8f', '#e07a5f'], fonts: 'Gloock + Figtree',
    sections: ['Hero + booking bar', 'Intro', 'Expanding image', 'Rooms', 'Experiences', 'Location map', 'Reviews', 'Book CTA'],
    animations: ['Expand on scroll', 'Zoom on scroll', 'Stacking room cards', 'Skew on scroll', 'Map route drawing', 'Scroll-lit words']
  },
  {
    id: 'kite', name: 'Kite', category: 'Education & Courses', style: 'Playful', theme: 'light', added: '2026-10-12',
    description: 'Bright, friendly course site with a dark-mode toggle, floating UI cards, colourful bento grid, curriculum accordion, review marquees and confetti enrol.',
    bestFor: 'Online courses, bootcamps, coaches, schools, workshops',
    colors: ['#fffaf2', '#1b1340', '#8338ec', '#ffbe0b'], fonts: 'Bricolage Grotesque + Nunito',
    sections: ['Hero', 'Bento features', 'Curriculum', 'Mentors', 'Review marquees', 'Enrol card', 'FAQ'],
    animations: ['Dark/light toggle', 'Bounce-in badge', 'Floating cards', 'Confetti button', 'Tilt cards', 'Double marquee']
  },
  {
    id: 'drift', name: 'Drift', category: 'E-commerce & Product', style: 'Bold', theme: 'light', added: '2026-10-12',
    description: 'Single-product launch page with CSS-drawn headphones, colour swatches that re-theme the whole page, a skewing tape, stacking feature cards and an add-to-bag counter.',
    bestFor: 'Product launches, D2C brands, gadgets, Shopify stores',
    colors: ['#e4ebe1', '#1f2a1f', '#9cb39a', '#f2836b'], fonts: 'Unbounded + Manrope',
    sections: ['Hero + colour picker', 'Spec tape', 'Statement', 'Feature stack', 'Tech specs', 'Reviews', 'Buy CTA'],
    animations: ['Live colour re-theme', 'Letter-by-letter headline', 'Skew on scroll', 'Stacking cards', 'Scroll-lit words', 'Confetti add-to-bag']
  },
  {
    id: 'care', name: 'Care', category: 'Health & Medical', style: 'Corporate', theme: 'light', added: '2026-10-12',
    description: 'Calm, reassuring clinic site with a heartbeat line that draws itself, floating confirmation cards, spotlight service grid, 3-step process and appointment booking.',
    bestFor: 'Clinics, dentists, therapists, physios, vets, pharmacies',
    colors: ['#f6faf9', '#0f2d2a', '#0f8b7e', '#ffb48a'], fonts: 'Plus Jakarta Sans',
    sections: ['Top bar', 'Hero + trust stats', 'Services', 'How it works', 'Doctors', 'Insurance marquee', 'Booking form', 'FAQ'],
    animations: ['ECG line drawing', 'Pulse dot', 'Cursor spotlight', 'Counters', 'Booking tabs', 'Bounce-in confirmation']
  }
];

/* Animation snippets shown in the "Animations" tab. All run on
   templates/_shared/motion.js + motion.css. Live demos: animations.html#<id> */
window.SNIPPETS = [
  // --- Entrances
  { id: 'reveal', group: 'Entrances', name: 'Scroll reveal', description: 'Fades elements in as they scroll into view. Directions: up, down, left, right, zoom, blur, fade, clip.',
    code: '<div data-reveal="up">Fades up</div>\n<div data-reveal="zoom" data-delay="200">Zooms in after 200ms</div>\n<div data-reveal="clip">Wipes in (great on images)</div>' },
  { id: 'stagger', group: 'Entrances', name: 'Staggered list', description: 'Children appear one after another. Optional value sets the gap in ms.',
    code: '<ul data-stagger="100">\n  <li>One</li>\n  <li>Two</li>\n  <li>Three</li>\n</ul>' },
  { id: 'bounce', group: 'Entrances', name: 'Bounce in', description: 'Springy pop-in on page load. Great for badges and stickers.',
    code: '<span class="badge fx-bounce-in" style="--d:.2s">New!</span>' },
  { id: 'preloader', group: 'Entrances', name: 'Intro loader', description: 'Full-screen intro that counts to 100 then wipes away. Value is minimum time in ms. Page reveals wait for it.',
    code: '<div data-preloader="1500" class="loader">\n  <span data-preloader-count>0</span>%\n</div>' },

  // --- Text
  { id: 'split', group: 'Text', name: 'Split-text headline', description: 'Each word rises from a mask. Keeps inline tags like <em>.',
    code: '<h1 data-split>Brands that <em>refuse</em> to be ignored</h1>' },
  { id: 'chars', group: 'Text', name: 'Letter by letter', description: 'Same as split text, but every letter rises separately.',
    code: '<h1 data-split="chars">HELLO WORLD</h1>' },
  { id: 'scramble', group: 'Text', name: 'Scramble / decode', description: 'Text decodes from random characters. Add ="hover" to replay on hover (great for nav links).',
    code: '<h2 data-scramble>SYSTEM ONLINE</h2>\n<a href="#" data-scramble="hover">Features</a>' },
  { id: 'typed', group: 'Text', name: 'Typed words', description: 'Types and deletes a list of words in a loop.',
    code: 'We help teams <span data-typed="move fast|ship weekly|grow"></span>' },
  { id: 'rotate', group: 'Text', name: 'Flipping words', description: 'Words flip upward in place, one after another.',
    code: 'Websites that <span data-rotate="slap|convert|sell" data-interval="1800"></span>' },
  { id: 'scrub', group: 'Text', name: 'Scroll-lit text', description: 'Words light up one by one as you scroll through the paragraph. Perfect for big statements.',
    code: '<p data-scrub>Most teams lose a day a week to busywork. We give it back.</p>' },
  { id: 'gradient', group: 'Text', name: 'Animated gradient text', description: 'Colour flows through the text. Set --g1, --g2, --g3 to change colours.',
    code: '<span class="fx-gradient-text" style="--g1:#7c5cff;--g2:#22d3ee;--g3:#f472b6">AI copilot</span>' },
  { id: 'glitch', group: 'Text', name: 'Glitch on hover', description: 'RGB-split glitch when hovered. data-text must match the text.',
    code: '<h2 class="fx-glitch" data-text="GLITCH">GLITCH</h2>' },
  { id: 'count', group: 'Text', name: 'Counter', description: 'Counts up from zero when visible. Decimals follow the number you give.',
    code: '<strong data-count="2400" data-suffix="+"></strong>\n<strong data-count="99.9" data-suffix="%"></strong>\n<strong data-count="48" data-prefix="$" data-suffix="k"></strong>' },

  // --- Scroll
  { id: 'parallax', group: 'Scroll', name: 'Parallax', description: 'Moves at a different speed while scrolling. Put it inside a wrapper with overflow: hidden.',
    code: '<figure style="overflow:hidden">\n  <img src="photo.jpg" data-parallax="0.15" alt="">\n</figure>' },
  { id: 'expand', group: 'Scroll', name: 'Expand on scroll', description: 'An image starts inset with rounded corners and grows to full width as you scroll to it.',
    code: '<div data-expand="12" style="height:90vh;background:url(photo.jpg) center/cover"></div>' },
  { id: 'zoom', group: 'Scroll', name: 'Zoom on scroll', description: 'Image slowly zooms out as it scrolls past. Value is the starting scale.',
    code: '<figure style="overflow:hidden">\n  <img src="photo.jpg" data-zoom="1.25" alt="">\n</figure>' },
  { id: 'stack', group: 'Scroll', name: 'Stacking cards', description: 'Cards stick and stack on top of each other; the ones behind shrink and darken. Value is the top offset in px.',
    code: '<div data-stack="100">\n  <article class="card">One</article>\n  <article class="card">Two</article>\n  <article class="card">Three</article>\n</div>' },
  { id: 'hscroll', group: 'Scroll', name: 'Horizontal scroll section', description: 'Vertical scrolling moves a row of cards sideways.',
    code: '<section data-hscroll>\n  <div class="hscroll__sticky">\n    <div class="hscroll__track">\n      <article>…</article><article>…</article>\n    </div>\n  </div>\n</section>' },
  { id: 'skew', group: 'Scroll', name: 'Skew on scroll speed', description: 'Content leans with how fast you scroll, then settles. Feels physical.',
    code: '<div data-skew>\n  <div data-marquee="25"><span>FAST</span><span>SMOOTH</span></div>\n</div>' },
  { id: 'draw', group: 'Scroll', name: 'SVG line drawing', description: 'Every line in the SVG draws itself when it scrolls into view.',
    code: '<svg viewBox="0 0 200 60" data-draw fill="none" stroke="red" stroke-width="3">\n  <path d="M0 30 H50 L60 10 L72 52 L84 18 L92 30 H200"/>\n</svg>' },
  { id: 'progress', group: 'Scroll', name: 'Scroll progress bar', description: 'Thin bar at the top that fills as you scroll. Style its background.',
    code: '<div data-scroll-progress style="background:#7c5cff"></div>' },
  { id: 'header', group: 'Scroll', name: 'Shrinking header', description: 'Adds .is-scrolled to the header after scrolling, so you can shrink it or add a background.',
    code: '<header class="nav" data-header>…</header>\n\n.nav.is-scrolled { padding: 10px 0; background: rgba(0,0,0,.7); backdrop-filter: blur(12px); }' },

  // --- Mouse
  { id: 'magnetic', group: 'Mouse', name: 'Magnetic button', description: 'Button leans toward the cursor. Value is strength (0.1 to 0.6).',
    code: '<a href="#" class="btn" data-magnetic="0.3">Get started</a>' },
  { id: 'tilt', group: 'Mouse', name: '3D tilt card', description: 'Card tilts in 3D toward the cursor and exposes --mx/--my for a glare.',
    code: '<article class="card" data-tilt="10">...</article>\n\n/* CSS glare */\n.card { background: radial-gradient(400px circle at var(--mx) var(--my), rgba(255,255,255,.15), transparent 60%), #111; }' },
  { id: 'spotlight', group: 'Mouse', name: 'Cursor spotlight', description: 'A soft light follows the cursor. Also sets --sx/--sy on each child card for per-card glows.',
    code: '<section data-spotlight style="--spot: rgba(124,92,255,.15)">\n  …\n</section>' },
  { id: 'trail', group: 'Mouse', name: 'Image trail', description: 'Images pop up along the cursor path. Value is the distance between drops in px.',
    code: '<section data-trail="90" style="height:100vh">\n  <img class="trail-item" src="1.jpg" width="220" alt="">\n  <img class="trail-item" src="2.jpg" width="220" alt="">\n  <img class="trail-item" src="3.jpg" width="220" alt="">\n</section>' },
  { id: 'cursor', group: 'Mouse', name: 'Custom cursor', description: 'Dot + trailing ring cursor. Hover labels via data-cursor-text.',
    code: '<body data-cursor>\n  <a href="#" data-cursor-text="View">Project</a>\n</body>' },
  { id: 'particles', group: 'Mouse', name: 'Particle network', description: 'Living network of connected dots that moves away from the cursor. Value is the colour.',
    code: '<section data-particles="#8b7bff" style="height:100vh;background:#05050c">\n  …\n</section>' },

  // --- Click & interact
  { id: 'ripple', group: 'Interactive', name: 'Click ripple', description: 'Material-style ripple from the click point.',
    code: '<button class="btn" data-ripple>Click me</button>' },
  { id: 'confetti', group: 'Interactive', name: 'Confetti burst', description: 'Confetti explodes from the click. Optional colours separated by |.',
    code: '<button data-confetti="#ff5d8f|#ffd166|#06d6a0">Celebrate 🎉</button>' },
  { id: 'compare', group: 'Interactive', name: 'Before / after slider', description: 'Drag to compare two images. Value is the starting position (%).',
    code: '<div data-compare="50" style="aspect-ratio:4/3">\n  <img src="before.jpg" alt="Before">\n  <img src="after.jpg" alt="After">\n</div>' },
  { id: 'tabs', group: 'Interactive', name: 'Tabs', description: 'Tabs with a fade-up panel transition.',
    code: '<div data-tabs>\n  <button data-tab="a">Lunch</button>\n  <button data-tab="b">Dinner</button>\n  <div data-panel="a">Lunch menu…</div>\n  <div data-panel="b">Dinner menu…</div>\n</div>' },
  { id: 'carousel', group: 'Interactive', name: 'Fade carousel', description: 'Auto-rotating slides with dots. Value is ms per slide.',
    code: '<div data-carousel="5000">\n  <blockquote>Quote one</blockquote>\n  <blockquote>Quote two</blockquote>\n</div>' },
  { id: 'countdown', group: 'Interactive', name: 'Countdown', description: 'Live countdown to a date and time.',
    code: '<div data-countdown="2026-12-31T18:00">\n  <b data-unit="d"></b>d <b data-unit="h"></b>h\n  <b data-unit="m"></b>m <b data-unit="s"></b>s\n</div>' },
  { id: 'theme', group: 'Interactive', name: 'Dark / light toggle', description: 'Toggles data-theme="dark" on <html> and remembers the choice. Define dark colours in CSS.',
    code: '<button data-theme-toggle>Toggle theme</button>\n\n[data-theme="dark"] { --bg: #111; --text: #fff; }' },
  { id: 'marquee', group: 'Interactive', name: 'Infinite marquee', description: 'Endless scrolling strip. Value is seconds per loop. Add data-marquee-reverse to flip.',
    code: '<div data-marquee="30">\n  <span>Logo one</span><span>Logo two</span><span>Logo three</span>\n</div>' },

  // --- Ambient
  { id: 'float', group: 'Ambient', name: 'Floating', description: 'Gentle up-and-down bob. Siblings get different timings automatically.',
    code: '<div class="sticker fx-float">☺</div>' },
  { id: 'blob', group: 'Ambient', name: 'Morphing blob', description: 'Organic shape that slowly morphs. Give it a size and background.',
    code: '<div class="fx-blob" style="width:300px;height:300px;background:#f3d9cf"></div>' },
  { id: 'spin', group: 'Ambient', name: 'Slow spin', description: 'Continuous slow rotation, great for circular text badges.',
    code: '<div class="badge fx-spin">★ NEW ★ NEW ★</div>' },
  { id: 'shine', group: 'Ambient', name: 'Shine sweep', description: 'A glossy light sweeps across on hover.',
    code: '<a href="#" class="btn fx-shine">Book now</a>' },
  { id: 'pulse', group: 'Ambient', name: 'Pulse ring', description: 'Radar-style pulsing ring in the current text colour. Great for "live" dots.',
    code: '<i class="dot fx-pulse" style="color:#22c55e"></i>' },
  { id: 'underline', group: 'Ambient', name: 'Hover underline', description: 'Underline draws in from the left on hover.',
    code: '<a href="#" class="fx-underline">Read more</a>' }
];

/* Colour palettes shown in the "Styles" tab: [name, mood, colours (bg → accents)] */
window.PALETTES = [
  { name: 'Midnight Neon', mood: 'Tech · Futuristic', colors: ['#05050c', '#eceaff', '#8b7bff', '#4de3ff', '#b6ff6c'] },
  { name: 'Terracotta Kitchen', mood: 'Food · Warm', colors: ['#f6efe4', '#1f3a2e', '#c8643b', '#d9a441', '#9bbf6a'] },
  { name: 'Blush & Plum', mood: 'Beauty · Luxury', colors: ['#fbf4ef', '#3d2430', '#c97b6b', '#c9a27a', '#f3d9cf'] },
  { name: 'Corporate Teal', mood: 'Trust · Professional', colors: ['#ffffff', '#0f2a4a', '#14b8a6', '#f59e0b', '#f3f6f9'] },
  { name: 'Lime Noir', mood: 'Agency · Editorial', colors: ['#0a0a0a', '#f2efe9', '#d4ff3a', '#8b877f', '#1d1d1d'] },
  { name: 'Brutal Pop', mood: 'Playful · Loud', colors: ['#fffbea', '#111111', '#ffd23f', '#ff5d8f', '#3a86ff'] },
  { name: 'Sunset Harbour', mood: 'Travel · Calm', colors: ['#f3efe7', '#12304a', '#2f6f8f', '#e07a5f', '#e3cfae'] },
  { name: 'Clinic Mint', mood: 'Health · Reassuring', colors: ['#f6faf9', '#0f2d2a', '#0f8b7e', '#d6efeb', '#ffb48a'] },
  { name: 'Candy Class', mood: 'Education · Friendly', colors: ['#fffaf2', '#1b1340', '#8338ec', '#ffbe0b', '#06d6a0'] },
  { name: 'Sand Dune', mood: 'Architecture · Minimal', colors: ['#f4f1ec', '#1c1c1c', '#b89b72', '#6f6a62', '#e2c9a6'] },
  { name: 'Electric Gym', mood: 'Fitness · Energy', colors: ['#0b0b0b', '#f5f5f5', '#c6ff00', '#ff2e88', '#00e5ff'] },
  { name: 'Sage Product', mood: 'E-commerce · Natural', colors: ['#e4ebe1', '#1f2a1f', '#9cb39a', '#6f8a6d', '#f2836b'] },
  { name: 'Ocean Deep', mood: 'Finance · Serious', colors: ['#f7f9fc', '#0b1f3a', '#1e5eff', '#00b3a4', '#ffcc4d'] },
  { name: 'Forest Retreat', mood: 'Eco · Wellness', colors: ['#f2f0e6', '#1e2d24', '#4f7a52', '#c9a96e', '#e6d9b8'] },
  { name: 'Berry Night', mood: 'Music · Nightlife', colors: ['#120818', '#f7e9ff', '#c026d3', '#f43f5e', '#facc15'] },
  { name: 'Paper & Ink', mood: 'Writing · Editorial', colors: ['#faf8f3', '#1a1a1a', '#b91c1c', '#6b7280', '#e7e2d5'] }
];

/* Font pairings shown in the "Styles" tab (all free on Google Fonts) */
window.FONT_PAIRS = [
  { display: 'Space Grotesk', body: 'Inter', mood: 'Modern tech' },
  { display: 'Syne', body: 'DM Sans', mood: 'Creative agency' },
  { display: 'Cormorant Garamond', body: 'Jost', mood: 'Elegant food & hospitality' },
  { display: 'Fraunces', body: 'Inter', mood: 'Trustworthy, warm corporate' },
  { display: 'Anton', body: 'Inter', mood: 'Loud sport & events' },
  { display: 'Playfair Display', body: 'Manrope', mood: 'Premium real estate' },
  { display: 'Archivo Black', body: 'Space Mono', mood: 'Neo-brutalist' },
  { display: 'Bodoni Moda', body: 'Outfit', mood: 'Fashion & beauty' },
  { display: 'Sora', body: 'JetBrains Mono', mood: 'AI & developer' },
  { display: 'Gloock', body: 'Figtree', mood: 'Boutique travel' },
  { display: 'Bricolage Grotesque', body: 'Nunito', mood: 'Friendly education' },
  { display: 'Unbounded', body: 'Manrope', mood: 'Bold product' },
  { display: 'Plus Jakarta Sans', body: 'Plus Jakarta Sans', mood: 'Clean health & SaaS' },
  { display: 'Instrument Serif', body: 'Inter Tight', mood: 'Minimal portfolio' }
];
