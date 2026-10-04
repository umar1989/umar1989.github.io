# Resume website

Static site (no build step). Works on GitHub Pages.

## Edit
Change **only `resume-data.js`**. The page and every download (DOCX, DOC, HTML, Markdown, TXT, JSON, vCard, PDF) are generated from it.
- Photo: put an image in `assets/` and set `photo`.
- Ready-made PDF: set `pdfFile: "assets/resume.pdf"` (the PDF is kept out of git via .gitignore because it holds private details); otherwise the PDF button opens the print dialog (choose "Save as PDF").

## Preview locally
    python3 -m http.server 8000   # then open http://localhost:8000

## Publish on GitHub Pages
    git init && git add . && git commit -m "Resume site"
    git branch -M main
    git remote add origin https://github.com/<user>/<user>.github.io.git
    git push -u origin main
Name the repo `<user>.github.io` for a root URL, or use any repo and enable
Settings → Pages → Deploy from branch → `main` / root.

## Features
Dark/light theme (press `T`), typing headline, scroll progress and active-section nav, animated skill bars and counters,
project tag filter, 8 download formats, copy-email, mailto contact form, QR code of the page, print-friendly layout, responsive, reduced-motion support.
