# Role-adaptive resume website

Plain static site: `index.html`, `script.js`, `data.js`, and one compiled, minified CSS file
(`assets/styles.css`, committed). HTML + Tailwind CSS v4 + vanilla JS, no framework, no server build.

## How roles work
- `/` shows the general profile with a role switcher (sidebar on desktop, under the intro card on mobile).
- `/?role=pgt` shows only that version, **with the switcher hidden**. Send schools these links.
- Keys: `tgt`, `pgt`, `foundation`, `coordinator`, `principal` (aliases such as `?role=vp`, `?role=iit` also work).
- Switching in the switcher updates the page and the URL without reloading.
- **Download PDF** downloads the LaTeX-built PDF for the selected role (`assets/pdf/`). **Print** opens the browser print dialog instead.

## Edit content
Everything is in **`data.js`** (commented). Fixed facts (name, contact, education, certifications, jobs, dates)
are written once; bullets, skills, featured items and projects are in master lists, each with a
`roles: { key: priority }` map (key missing = hidden for that role, 1 = first). Save and refresh. No rebuild needed.
Projects are empty (none in the resume); add some and the card appears.
A profile photo: put it in `assets/` and set `profile.photo` in `data.js`.

## Add a role
1. In `data.js`, copy a block inside `roles` and give it a new key, `label`, `headline`, `about`, `sections` order and `skillGroups`.
2. Add that key to the `roles` map of every bullet, skill and featured item that should appear for it.
3. Done: it appears in the switcher and works at `?role=newkey`. Each job needs at least one bullet tagged for the role, or it shows with the title only.

## Rebuild the PDFs
One PDF per role is generated from `data.js` with LaTeX (needs `pdflatex`). Run it after any content change, then commit `assets/pdf/`.
```
npm run pdf              # all roles
node tools/build-pdf.js pgt   # one role
```
The file name of each role's PDF is its `pdf:` field in `data.js`. Only `assets/pdf/*.pdf` is un-ignored; `resume.pdf` stays private.

## Rebuild the CSS
Only needed after changing classes in `index.html`/`script.js` or the theme in `src/input.css`.
```
npm install          # once
npm run build        # writes assets/styles.css (minified); commit it
npm run watch        # optional, rebuilds while you edit
```
Colours, fonts, radius and spacing are theme tokens at the top of `src/input.css` (Tailwind v4 is CSS-first, so that
`@theme` block is the config; dark mode values sit just below it).

## Deploy to GitHub Pages with a custom domain
1. Push to a GitHub repo. Settings -> Pages -> Source: *Deploy from a branch*, branch `main`, folder `/ (root)`.
2. Custom domain: in Pages settings enter your domain (e.g. `umarmukthar.in`) and tick *Enforce HTTPS*. GitHub adds a `CNAME` file.
3. DNS: for an apex domain add four `A` records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`;
   for `www`, a `CNAME` to `<your-username>.github.io`.
4. Make sure `siteUrl` in `data.js` and the `canonical` / `og:url` / `og:image` URLs in `index.html` match your real domain.

## Notes
- Link previews (WhatsApp etc.) read only the static tags in `index.html`, so every `?role=` link previews with the general headline.
- `resume.pdf` (home address, reference phone) is git-ignored and is not published.
- The QR code library (`assets/qrcode.js`, MIT) is vendored so nothing loads from a CDN.
