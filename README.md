# Aspectrum — Portfolio Website

Digital art portfolio for **Yeshini Amasha** (brand: *Aspectrum — Vision. Visualize. Create.*).

Fully static site (HTML/CSS/JS) — no build step, no dependencies. Ready to host free on GitHub Pages, Netlify, Cloudflare Pages, or Vercel.

## Structure
```
site/
├── index.html          # page markup
├── styles.css          # all styling (brand palette, layout, responsive)
├── script.js           # nav, scroll reveal, filters, lightbox, counters
├── .nojekyll           # tells GitHub Pages to serve files as-is
└── assets/
    ├── media/showreel.mp4   # hero showreel video
    ├── brand/               # logo + decorative pattern
    ├── art/                 # landscape & background artwork
    └── portraits/           # portrait studies
```

## Preview locally
Open `index.html` in a browser, or run a tiny server (recommended, so the video loads reliably):
```bash
cd site
python -m http.server 8080
# visit http://localhost:8080
```

## Deploy free on GitHub Pages
1. Create a new GitHub repository (e.g. `aspectrum`).
2. Put the **contents of this `site/` folder** at the repository root and push.
3. Repo → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / `/ (root)` → **Save**.
4. Your site goes live at `https://<username>.github.io/<repo>/` in a minute or two.

## Contact form
The form posts to **FormSubmit** (`formsubmit.co`) so it works on a static host with no backend.
The first submission triggers a one-time email to `amashayeshini@gmail.com` to confirm the address.
Swap the `action` URL in `index.html` for another service (Formspree, Getform, etc.) if preferred.

## Customising
- **Colours** live as CSS variables at the top of `styles.css` (`:root`).
- **Artwork**: drop new images into `assets/art` or `assets/portraits` and add a `<figure class="card">` block in the gallery.
- **Showreel**: replace `assets/media/showreel.mp4`.
