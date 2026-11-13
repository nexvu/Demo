# Meera's-The Beauty Saga — website design concept

A one-page demo website for Meera's-The Beauty Saga, a beauty salon in Sudama Nagar, Indore.

**This is an unofficial concept.** It has not been commissioned, approved or endorsed by the business. It exists to show the owner what their website could look like.

Plain HTML, CSS and JavaScript. No build step, no dependencies.

## View it

Open `index.html` in a browser, or serve the folder:

```
python -m http.server 8000
```

Then visit http://localhost:8000.

## What is confirmed and what is sample content

| Content | Status |
| --- | --- |
| Business name, category (beauty salon), locality (Sudama Nagar, Indore) | From the public listing |
| Google rating of 5.0 | Reported on public listings, **not yet verified**. The page says so until `rating.verified` is set to `true` |
| Service categories and the items under them | Proposed for the demo |
| About text, hero description | Sample copy |
| Phone and WhatsApp number | Supplied, set in `script.js` |
| Hours, street address, map | Placeholders |
| All photographs | Stock images from Unsplash. None show the salon, its staff or its clients |
| Customer reviews | None shown. None were invented |

## Editing

**Contact details, hours, rating and map link** are in the `SITE` object at the top of `script.js`. Fill a value in and the placeholder on the page is replaced.

- `whatsapp`: digits only, with country code, e.g. `919876543210`. While it is empty, WhatsApp buttons show a "number not set yet" notice with the message that would have been sent.
- `rating.verified`: set to `true` after checking the salon's Google Business Profile. This hides the "to be confirmed" note.

**Text and services** are in `index.html`. Look for comments starting with `EDIT:`. Each service is one `<li class="service">` block. To remove a category, delete its block, the matching image in `.services__stage`, and its `<option>` in the enquiry form.

**Photographs** are in `assets/img/`. Replace a file with one of the same name, or change the `src` in `index.html`. Gallery tiles carry a `data-category` of `makeup`, `hair`, `bridal` or `interior` for the filter buttons.

**Colours, fonts and spacing** are CSS variables at the top of `styles.css`.

**Before a real launch:** remove the `.demo-bar` notice at the top of `index.html`, the `noindex` meta tag, the sample notes, and the footer disclaimer.

## Deploying to GitHub Pages

All paths are relative, so the site works under `https://<user>.github.io/<repo>/`.

1. Push this folder to a GitHub repository.
2. In the repository, go to Settings, then Pages.
3. Under "Build and deployment", choose "Deploy from a branch".
4. Select the `main` branch and the `/ (root)` folder, then save.
5. Wait a minute or two. The site URL appears at the top of the Pages settings.

## Image credits

Photographs are from [Unsplash](https://unsplash.com) and used under the Unsplash License. They are placeholders and should be replaced with the salon's own photographs.
