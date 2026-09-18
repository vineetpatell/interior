# Cinematic Interior Website Expansion

## Goal

Turn the site into a richer luxury interior experience: a moving visual opening, more high-end imagery, clearer studio story, and a complete door-by-door scroll journey where visitors can pause on each room without text covering it.

## What will change

### 1. Homepage opening

- Add a visible **Home** link in the desktop navigation while keeping the brand mark linked to Home.
- Place a full-width moving carousel at the very top, mixing luxury interior photography with one short muted, looping interior film.
- Use restrained motion, readable controls, swipe support, pause/play, and reduced-motion fallbacks.
- Keep the brand name and primary action legible over the moving visuals without placing them inside a card.

### 2. Door-led room journey

- Expand each room chapter into four clear scroll beats:
  1. an attractive closed door,
  2. the door opening into a close room preview,
  3. all text and interface fading away for a clean ultra-wide room view,
  4. the door closing before the next distinct door arrives.
- Give all five doors their own material language and motion: fluted brass, smoked-glass pivot, sculpted timber screen, stone pocket doors, and upholstered bronze panels.
- Refine image zoom, depth, lighting sweep, perspective, and transitions so movement feels architectural rather than decorative.
- Preserve mobile usability and provide a calm reduced-motion version.

### 3. More visual storytelling

- Create a coordinated set of additional luxury visuals for dining, dressing, bathroom, staircase, detail craftsmanship, and styled material moments.
- Place these across Home, About, Our Work, Services, Projects, Studio, Turnkey, Contact, and Consultation where they support the page content.
- Keep images full-width or editorially composed rather than adding nested cards.

### 4. About, vision, mission, process

- Add dedicated **Vision** and **Mission** sections to About.
- Add a detailed work process from discovery and survey through drawings, sourcing, site execution, styling, quality checks, and post-handover care.
- Include practical outputs, decision points, and client involvement at every stage.

### 5. Quotes and FAQs on every page

- Add one page-specific editorial quote to each content page.
- Add a reusable accessible FAQ section with page-specific questions and answers to Home, About, Our Work, Services, Projects, Turnkey, Studio, Contact, and Consultation.
- Keep answers concise, credible, and aligned with the studio’s one-contract positioning.

### 6. Footer redesign

- Replace the current column-heavy footer with an editorial closing scene using a strong interior visual, oversized studio identity, primary consultation action, navigation, contact details, and location.
- Keep every requested page accessible and make the footer visually memorable without becoming crowded.

## Technical notes

- Reuse the current dark emerald, champagne-gold, and ivory design tokens.
- Build shared carousel, quote, and FAQ components to keep behavior and styling consistent.
- Use the existing Motion setup for scroll-linked door choreography and CSS scroll snapping only where it does not fight page scrolling.
- Generated media will be stored with the project’s asset flow; video will be muted, looping, optimized, and poster-backed.
- All pages will retain unique metadata, one H1, semantic sections, image alt text, and keyboard-accessible controls.

## Validation

- Verify desktop and mobile layouts in the live preview.
- Test carousel controls, swipe/keyboard access, all door phases, FAQ expansion, navigation, and reduced-motion behavior.
- Check for text overlap, blank frames, scroll jumps, missing images, and console errors.
