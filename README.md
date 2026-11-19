# Jason Mandabrandja – Portfolio

Static portfolio site (HTML, CSS, JS). No build step.

## Run locally
Open `index.html` in a browser, or run `npx serve .`

## Deploy
Push to GitHub, then import the repository in Vercel (Framework Preset: Other, no build command, output directory left empty).

## Edit
- Content: `index.html`
- Colours and fonts: top of `styles.css` (see Charte graphique below)
- CV file: replace `cv.pdf`

## Screenshots
Replace the placeholder files in `images/` with real screenshots (keep the same file names, or update the `src` in `index.html`). Aim for an 8:5 ratio, around 1200x750.

## Contact form
1. Create a free form at https://formspree.io and copy its ID.
2. In `index.html`, replace `YOUR_FORM_ID` in the form `action` with that ID.
Until then, the form opens the visitor's email app with the message pre-filled.

## Charte graphique
Toutes les couleurs sont des variables au tout début de `styles.css` (bloc « CHARTE GRAPHIQUE »), avec une version claire et une version sombre selon le thème du visiteur.
- Marine `--ink` pour le texte, bleu `--accent` pour les liens, boutons et repères, vert `--ok` réservé au statut « en ligne ».
- `--on-accent` et `--on-ok` : couleur du texte posé sur ces fonds (contrastes vérifiés, au moins 5:1).
- `--panel`, `--panel-deep`, `--panel-line`, `--panel-accent` : le panneau sombre du simulateur d'estimation.
- Pour changer d'accent, modifiez `--accent` (clair et sombre), `--on-accent` et `--panel-accent` : tout le site suit.

## Estimation (devis freelance)
Le simulateur d'estimation (section « Estimation ») lit ses prix dans `tarifs.json`. Modifiez ce fichier à votre guise, puis rechargez la page :
- `types` : prix de base `min` / `max` par type de projet.
- `complexites` : multiplicateur appliqué au prix du type (ex. Avancé = 2).
- `options` : suppléments ajoutés quand l'option est cochée. Chaque option a un `label`, une `desc` (courte description), une `icone` et un `min` / `max`.
- Option à niveaux (l'IA) : au lieu de `min` / `max`, une liste `niveaux` (Basique, Intermédiaire, Avancé). Chaque niveau a son `label`, sa `desc` et ses prix `min` / `max`. Le visiteur en choisit un seul, ou « Sans IA ». Vous pouvez ajouter, renommer ou retirer des niveaux. Avec `"choix": "multiple"`, les niveaux deviennent des cases à cocher cumulables. Une option simple avec `"large": true` s'affiche sur toute la largeur.
- `afficherPrix` : mettez `false` pour masquer les prix sur les cartes d'options.
- `arrondi` : le résultat est arrondi à ce multiple (2500 FCFA par défaut). `devise`, `note` et `defaut` (sélection initiale) se modifient aussi.
- Type « Analyse de données » : il n'a pas de prix de base (`min` / `max` à 0) et n'affiche que les blocs `analyse` (sans IA) et `analyse_ia` (avec IA), chacun à 4 niveaux (Basique, Intermédiaire, Avancé, Expert). Les deux blocs s'excluent mutuellement (`exclusif`).
- Réglages avancés : sur un type, `options` (liste d'id) limite les options affichées, `sansComplexite` masque le choix de complexité et `titreOptions` renomme la section ; sur une option, `types` la limite à certains types ; sur un niveau, `ouvert: true` affiche un « + » après le maximum (prix « à partir de »).
- Formule : `(prix du type × multiplicateur) + options choisies`.
- Textes de la section : clés `est_*` dans `script.js` (FR) et dans `index.html` (EN).
- Le fichier est chargé avec `fetch` : en local, utilisez `npx serve .` (l'ouverture directe de `index.html` ne suffit pas pour cette section). Sur Vercel, rien à faire.

## Languages
Default language follows the visitor's browser (French or English). French text lives in the `fr` object at the top of `script.js`.

KM-Hôtel screenshot: replace `images/km-hotel.svg` (or change its `src` in `index.html`).
