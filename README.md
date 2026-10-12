# Satsuma — website redesign

A redesign of the Satsuma website: career coaching for pharmacists.

- `index.html`: Home (hero, "what we hear", Find your AND, meet Terri, ways to work together, testimonial, FAQ, free assessment offer)
- `about.html`: About (mission, values, team, contact form)
- `assessment.html`: "Find Your AND" free self-assessment, the lead magnet. Six questions; visitors give their first name and email to see their results.
- `assets/chat.js`: Terri's assistant, the chat in the bottom corner of every page
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

## SEO setup

Each page has a canonical URL, Open Graph and Twitter card tags (with the share image `assets/img/og-image.png`), and JSON-LD structured data: `ProfessionalService` for Satsuma, `Person` for Terri, plus the FAQ. `robots.txt` and `sitemap.xml` sit at the repo root.

**When the custom domain goes live**, replace `https://dyunck.github.io/terri/` with the new address everywhere it appears (canonical, `og:url`, `og:image`, `twitter:image`, the JSON-LD blocks, `robots.txt` and `sitemap.xml`). A find-and-replace across the repo does it in one step. Then:

1. Add the domain under **Settings → Pages → Custom domain**.
2. Verify the site in [Google Search Console](https://search.google.com/search-console) and submit `sitemap.xml`.
3. Check the share preview with LinkedIn's [Post Inspector](https://www.linkedin.com/post-inspector/).

Note: search engines only read `robots.txt` at the root of a domain, so it takes effect once the site is on its own domain. Until then, submit the sitemap directly in Search Console.

## Photos

The two headshots in `assets/img/` were cropped from a screenshot of the current site and are low resolution. Replace `terri-wang.jpg` and `mengdi-lin.jpg` with the original photo files (same names) for the sharpest result.

## FAQ and assessment content

- The FAQ answers on the home page are draft copy written for this redesign. Terri should review them, especially "How long does coaching take?" and "What kinds of roles do clients move into?". The FAQ is also marked up with FAQPage structured data (the JSON-LD block in the `<head>` of `index.html`) so it can appear in search results; if you edit an answer, update it in both places.
- The assessment's questions, result descriptions and suggested career paths live at the top of `assets/assessment.js` (`QUESTIONS` and `RESULTS`) and can be edited as plain text.

## Boutique positioning: claims to confirm

The site positions Satsuma as a small, founder-led boutique practice. Before sharing widely, Terri should confirm she's comfortable with these statements:

- "Limited availability" and "Terri works with a small number of pharmacists at a time" (hero and The Satsuma Approach)
- "Every conversation is with Terri… not a rotating roster of coaches"
- "A confidential, judgement-free space"
- The Flip the Script cohort "will be kept small"

## Terri's assistant (chat)

A scripted chat assistant, shown with Terri's photo, sits in the bottom-right corner of every page. It is clearly labelled as an automated assistant, not Terri herself.

- It greets visitors, offers paths ("I feel stuck", "explore other paths", "tell me about coaching", "I have a question"), answers common questions typed in free text (cost, leaving pharmacy, settings, timelines, roles, confidentiality, Terri's background, Flip the Script) and steers every conversation toward a discovery call.
- It asks two light qualifying questions (practice setting and timeline) and passes them along with the request so Terri has context.
- **How booking works, based on `SITE_CONFIG` in `assets/main.js`:**
  - `bookingUrl` set: offers a "Choose a time" button linking to the calendar.
  - Otherwise, `formEndpoint` set: collects name and email right in the chat and sends the request (with the chat context).
  - Neither set: sends visitors to the contact form with the message prefilled from the chat.
- All of the wording lives at the top of `assets/chat.js` (`NODES` for the guided flow, `TOPICS` for typed questions) and can be edited as plain text.
- It needs no server or API key. It answers only from its script, so it won't improvise. Its cost answer says pricing depends on the engagement and is discussed on the call; Terri should confirm she's happy with that wording.
