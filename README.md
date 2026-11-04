# Jason Mandabrandja – Portfolio

Static portfolio site (HTML, CSS, JS). No build step.

## Run locally
Open `index.html` in a browser, or run `npx serve .`

## Deploy
Push to GitHub, then import the repository in Vercel (Framework Preset: Other, no build command, output directory left empty).

## Edit
- Content: `index.html`
- Colours and fonts: top of `styles.css`
- CV file: replace `cv.pdf`

## Screenshots
Replace the placeholder files in `images/` with real screenshots (keep the same file names, or update the `src` in `index.html`). Aim for an 8:5 ratio, around 1200x750.

## Contact form
1. Create a free form at https://formspree.io and copy its ID.
2. In `index.html`, replace `YOUR_FORM_ID` in the form `action` with that ID.
Until then, the form opens the visitor's email app with the message pre-filled.

## Languages
Default language follows the visitor's browser (French or English). French text lives in the `fr` object at the top of `script.js`.
# portfolio
