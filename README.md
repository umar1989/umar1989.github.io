# Résumé website

Standalone, no build step. Tailwind via CDN, hosted on GitHub Pages.

## Update
Edit **`data.js`** only, then run `./publish.sh` (commits + pushes; the site refreshes in ~1 min).
Inside Claude Code, edits to files here are auto-pushed by a hook in `.claude/settings.json`.

## Dynamic role views
- Buttons at the top switch between Teacher / Coordinator / Principal / Full.
- Each line in `data.js` has an optional `for: [...]` list; it only shows in those roles.
- Add a role by copying a block in `roles`.
- Share tailored links: `?role=principal&for=ABC%20School`
- "Save as PDF" prints the currently selected view.

Preview locally: open `index.html` in a browser.
