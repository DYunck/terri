# Satsuma — website redesign

A redesign of the Satsuma website: career coaching for pharmacists.

- `index.html`: Home (hero, "what we hear", Find your AND, meet Terri, ways to work together, testimonial, newsletter)
- `about.html`: About (mission, values, team, contact form, newsletter)
- `assets/styles.css`, `assets/main.js`, `assets/img/`

It's a plain static site with no build step. Open `index.html` in a browser to view it.

## Share it with GitHub Pages

1. Go to the repo's **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and `/ (root)`, then **Save**.
3. After a minute or so the site is live at **https://dyunck.github.io/terri/**.

## Settings to fill in

Open `assets/main.js` and edit `SITE_CONFIG` at the top:

| Setting | What it does |
| --- | --- |
| `bookingUrl` | A Calendly (or similar) link. Every "Book a Discovery Call" button then goes straight to it. If it's left empty, those buttons scroll to the contact form. |
| `formEndpoint` | Where the contact form, newsletter signup and Flip the Script interest list send submissions. A free [Formspree](https://formspree.io) form works out of the box: paste its `https://formspree.io/f/...` URL. |
| `contactEmail` | Optional. Shown to visitors if the forms aren't connected yet. |

## Photos

The two headshots in `assets/img/` were cropped from a screenshot of the current site and are low resolution. Replace `terri-wang.jpg` and `mengdi-lin.jpg` with the original photo files (same names) for the sharpest result.
