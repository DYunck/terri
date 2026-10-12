# Satsuma — website redesign

A redesign of the Satsuma website: career coaching for pharmacists.

- `index.html`: Home (hero, "what we hear", Find your AND, meet Terri, ways to work together, testimonial, FAQ, free assessment offer)
- `about.html`: About (mission, values, team, contact form)
- `assessment.html`: "Find Your AND" free self-assessment, the lead magnet. Six questions; visitors give their first name and email to see their results.
- `assets/styles.css`, `assets/main.js`, `assets/assessment.js`, `assets/img/`

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
| `formEndpoint` | Where the contact form, Flip the Script interest list and self-assessment send submissions. Assessment signups include the person's result (e.g. "A pharmacist AND a technologist") and answers, so follow-ups can be personal. A free [Formspree](https://formspree.io) form works out of the box: paste its `https://formspree.io/f/...` URL. |
| `contactEmail` | Optional. Shown to visitors if the forms aren't connected yet. |

## Photos

The two headshots in `assets/img/` were cropped from a screenshot of the current site and are low resolution. Replace `terri-wang.jpg` and `mengdi-lin.jpg` with the original photo files (same names) for the sharpest result.

## FAQ and assessment content

- The FAQ answers on the home page are draft copy written for this redesign. Terri should review them, especially "How long does coaching take?" and "What kinds of roles do clients move into?". The FAQ is also marked up with FAQPage structured data (the JSON-LD block in the `<head>` of `index.html`) so it can appear in search results; if you edit an answer, update it in both places.
- The assessment's questions, result descriptions and suggested career paths live at the top of `assets/assessment.js` (`QUESTIONS` and `RESULTS`) and can be edited as plain text.
