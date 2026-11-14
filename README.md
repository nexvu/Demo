# Meera's – The Beauty Saga — website design concept

A one-page demo website for Meera's – The Beauty Saga, a beauty salon and academy in Sudama Nagar, Indore.

**This is an unofficial concept.** It has not been commissioned, approved or endorsed by the business. It exists to show the owners what their website could look like.

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
| Business name, founders (Nikita and Pinky), address, both phone numbers, WhatsApp number | From the salon's public Google and Instagram listings |
| Google rating (5.0 from 870+ reviews) and the listing link | From the Google listing. Update `SITE.rating` when the count changes |
| Closing time (8:30 pm) | From the Google listing. Opening time is **not set yet**; the page assumes the salon is open daily |
| Service categories (makeup, skin, hair, nails, bridal) and home service | From the salon's Instagram bio |
| Items listed under each service, bridal package names and inclusions | Sample content |
| Bridal package prices | Not set. Cards say "Price on request" |
| Academy course names and descriptions | Placeholders. No fees, dates or certifications are shown |
| Founder portraits and bios | Placeholders |
| FAQ answers | Sample text, to be confirmed with the owners (payment modes especially) |
| About text, hero description | Sample copy |
| All photographs, including the Instagram tiles | Stock images from Unsplash. None show the salon, its staff or its clients |
| Customer reviews | None shown. None were invented. The page links to Google instead |

## Editing

**Contact details, address, hours, rating, links and bridal prices** are in the `SITE` object at the top of `script.js`. Change a value once and it updates everywhere (hero, contact section, footer, phone bar).

- `phone`, `phoneAlt`: as they should be displayed. Leave `phoneAlt` empty to hide the second number.
- `whatsapp`: digits only, with country code, e.g. `919876543210`.
- `hours`: 24-hour times. While `open` is empty the page says "Daily · closes 8:30 pm"; fill it in (e.g. `"10:00"`) and it becomes "Daily · 10:00 am – 8:30 pm".
- `rating.value`, `rating.count`, `rating.reviewsUrl`: the Google rating, review count and listing link.
- `bridalPrices`: starting prices in rupees, numbers only (e.g. `15000`). An empty price shows "Price on request"; a set one shows "From ₹15,000".
- `instagram`: handle and profile link.

The same values are also written in `index.html` so the page still reads correctly without JavaScript. If you change a number in `SITE`, update the matching `tel:` / `wa.me` fallback in `index.html` too (search for the old number). The link-preview description in the `<head>` also mentions the rating.

**Text, services, packages, courses and FAQ** are in `index.html`. Look for comments starting with `EDIT:` or `PLACEHOLDER`.

- Each service is one `<li class="service">` block. To remove a category, delete its block, the matching image in `.services__stage`, and its `<option>` in the booking form.
- Each bridal package is one `<li class="tier">`; each course is one `<li class="course">`; each FAQ is one `<div class="faq__item">` (keep the `id` / `aria-controls` pairs matching).
- Founder portraits: the comment above each placeholder frame shows the `<img>` markup to swap in.

**Photographs** are in `assets/img/`. Replace a file with one of the same name, or change the `src` in `index.html` (update `width` and `height` to match). Gallery tiles carry a `data-category` of `makeup`, `hair`, `bridal`, `nails` or `interior` for the filter buttons. The six Instagram tiles are `insta-1.jpg` to `insta-6.jpg` (600 × 600).

**Map.** The embedded map searches Google Maps for the salon's name and address. To pin the exact listing, open it in Google Maps, choose Share, then "Embed a map", and paste that `src` into the `<iframe>` in the contact section.

**Link previews.** The Open Graph and Twitter tags in the `<head>` use absolute URLs (`https://nexvu.github.io/Demo/`). Change them if the site is published at a different address.

**Colours, fonts and spacing** are CSS variables at the top of `styles.css`. `--section` controls the vertical padding of every section.

**Before a real launch:** remove the `.demo-bar` notice at the top of `index.html`, the `noindex` meta tag and the footer disclaimer, and replace the stock photographs.

## Deploying to GitHub Pages

All paths are relative, so the site works under `https://<user>.github.io/<repo>/`. The workflow in `.github/workflows/static.yml` deploys the repository on every push to `main`.

## Image credits

Photographs are from [Unsplash](https://unsplash.com) and used under the Unsplash License. They are placeholders and should be replaced with the salon's own photographs.
