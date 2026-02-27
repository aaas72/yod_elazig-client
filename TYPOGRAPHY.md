# Typography Scale

This project uses Tailwind CSS and defines a **global, responsive typography system**. The goal is to have a unified set of font sizes for headings, cards, paragraphs, etc., which adapt automatically to the screen width.

## Utility classes

Use the following classes in your markup:

| Role           | Class        | Description                                            |
| -------------- | ------------ | ------------------------------------------------------|
| Primary headline | `text-h1`    | Main page titles                                       |
| Section title  | `text-h2`    | Sections and important headings                        |
| Subheading     | `text-h3`    | Subsections                                            |
| Smaller heading| `text-h4`    | Panel titles, cards                                    |
| Minor heading  | `text-h5`    | Labels, card subtitles                                 |
| Body text      | `text-body`  | Paragraphs, general content                            |
| Card text      | `text-card`  | Titles inside cards or small components                |
| Small text     | `text-small` | Footnotes, metadata, disclaimers                       |

Each of these uses `clamp()` behind the scenes, so they grow and shrink with the viewport. For fine–tuning you can still apply responsive prefixes, e.g.

```html
<h1 class="text-h1 sm:text-h2 lg:text-h1">…</h1>
<p class="text-body lg:text-card">…</p>
```

## Responsive breakpoints

Because the values are fluid, you rarely need `sm:` or `md:` variants. However you may choose to override or scale further when appropriate.

## Updating existing code

Components such as `SectionTitle` and `PageHero` have already been migrated to `text-h2` / `text-h1`. You should replace hard‑coded `text-xl`, `text-2xl`, etc. with the semantic classes above as you touch each file.

## Adding new sizes

If you need another role (e.g. `text-caption`), add it to `theme.extend.fontSize` in `tailwind.config.js`. Use the same `clamp()` pattern for fluidity.

---

With this in place, all pages share a coherent scale, and fonts automatically adjust for phones, tablets, and desktops.
