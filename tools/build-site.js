/* Generates the static, crawler-visible parts of the site.  Usage: npm run site
   - pre-renders the default profile into index.html (between <!--pre--> markers)
   - writes one landing page per role: /pgt/, /tgt/, ... (own title, OG tags, canonical, pre-rendered content)
   - JSON-LD Person data, sitemap.xml, robots.txt, manifest.webmanifest, 404.html, assets/umarmukthar.vcf
   The page itself still renders from data.js in the browser; this only adds what crawlers and link previews see.
   Re-run after changing data.js or index.html, then commit the generated files. */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const read = f => fs.readFileSync(path.join(root, f), "utf8");
const write = (f, s) => { fs.mkdirSync(path.dirname(path.join(root, f)), { recursive: true }); fs.writeFileSync(path.join(root, f), s); };

const dataSrc = read("data.js"), scriptSrc = read("script.js");
const win0 = {}; vm.runInNewContext(dataSrc, { window: win0 });
const R = win0.RESUME, P = R.profile;
const SITE = P.siteUrl.replace(/\/?$/, "/");
const updated = new Date().toISOString().slice(0, 10);
const roleKeys = Object.keys(R.roles).filter(k => k !== R.defaultRole);
const esc = s => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const firstSentence = r => r.about.split(". ")[0].replace(/\.$/, "") + ".";

/* Run script.js against a tiny fake DOM and collect what it renders for one role. */
function prerender(dataRole, base) {
  const els = {};
  const el = key => els[key] || (els[key] = {
    innerHTML: "", textContent: "", hidden: false, attrs: {}, dataset: {}, classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    setAttribute(k, v) { this.attrs[k] = v; }, getAttribute(k) { return this.attrs[k] === undefined ? null : this.attrs[k]; },
    removeAttribute() {}, addEventListener() {}, querySelector: () => null, querySelectorAll: () => [],
  });
  const docEl = el("html");
  docEl.attrs = { "data-role": dataRole || "", "data-base": base || "" };
  el("#footer").attrs["data-updated"] = updated;
  const document = {
    documentElement: docEl, title: "",
    querySelector: s => el(s), querySelectorAll: () => [], getElementById: () => null, addEventListener() {},
  };
  const window = { RESUME: R, addEventListener() {}, print() {} };
  const ctx = {
    window, document, location: { href: SITE, search: "" }, URL, URLSearchParams, console,
    history: { replaceState() {} }, localStorage: { getItem: () => null, setItem() {} },
    qrcode() { throw new Error("no qr at build time"); },   // script.js catches this; the QR is drawn in the browser
  };
  vm.runInNewContext(scriptSrc, ctx);
  const out = {};
  ["#intro", "#switcher-mobile", "#sections", "#sidebar", "#bar-links", "#menu-panel"].forEach(s => { out[s.slice(1)] = els[s].innerHTML; });
  return out;
}

function personLd(r) {
  return {
    "@context": "https://schema.org", "@type": "Person",
    name: P.name, url: SITE, image: SITE + P.photo, email: P.email, telephone: P.phone,
    jobTitle: r.headline, description: r.about,
    address: { "@type": "PostalAddress", addressLocality: "Tiruppur", addressRegion: "Tamil Nadu", addressCountry: "IN" },
    worksFor: { "@type": "Organization", name: R.jobs[0].org },
    alumniOf: [...new Set(R.education.map(e => e.school.split(",")[0]))].map(n => ({ "@type": "EducationalOrganization", name: n })),
    knowsLanguage: P.languages.map(l => l.name),
    sameAs: P.social.map(s => s.url),
  };
}

function setTag(html, re, fn) { if (!re.test(html)) throw new Error("template tag missing: " + re); return html.replace(re, fn); }
function fill(html, id, body) {
  return setTag(html, new RegExp('(id="' + id + '"[^>]*><!--pre-->)[\\s\\S]*?(<!--/pre-->)'), (_, a, b) => a + body + b);
}

const template = read("index.html");

function page(roleKey) {
  const isRoot = !roleKey, key = roleKey || R.defaultRole, r = R.roles[key];
  const base = isRoot ? "" : "../";
  const url = isRoot ? SITE : SITE + roleKey + "/";
  const title = P.name + " - " + r.headline, desc = firstSentence(r);
  const parts = prerender(isRoot ? "" : roleKey, base);
  let h = template;
  h = setTag(h, /<title>[\s\S]*?<\/title>/, () => "<title>" + esc(title) + "</title>");
  h = setTag(h, /(<meta name="description" content=")[^"]*/, (_, a) => a + esc(desc));
  h = setTag(h, /(<meta property="og:title" content=")[^"]*/, (_, a) => a + esc(title));
  h = setTag(h, /(<meta property="og:description" content=")[^"]*/, (_, a) => a + esc(desc));
  h = setTag(h, /(<meta property="og:url" content=")[^"]*/, (_, a) => a + url);
  h = setTag(h, /(<link rel="canonical" href=")[^"]*/, (_, a) => a + url);
  h = setTag(h, /<!--ld-->[\s\S]*?<!--\/ld-->/, () =>
    '<!--ld--><script type="application/ld+json">' + JSON.stringify(personLd(r)).replace(/</g, "\\u003c") + "</script><!--/ld-->");
  h = setTag(h, /(id="footer" data-updated=")[^"]*/, (_, a) => a + updated);
  Object.keys(parts).forEach(id => { h = fill(h, id, parts[id]); });
  if (!isRoot) {
    h = h.replace(/(href|src)="(assets\/|data\.js|script\.js|manifest\.webmanifest)/g, '$1="' + base + "$2");
    h = h.replace(/<html lang="en"[^>]*>/, '<html lang="en" data-role="' + roleKey + '" data-base="' + base + '">');
  }
  return h;
}

write("index.html", page(null));
roleKeys.forEach(k => write(k + "/index.html", page(k)));

/* sitemap, robots, manifest */
const urls = [SITE].concat(roleKeys.map(k => SITE + k + "/"));
write("sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map(u => "  <url><loc>" + u + "</loc><lastmod>" + updated + "</lastmod></url>").join("\n") + "\n</urlset>\n");
write("robots.txt", "User-agent: *\nAllow: /\n\nSitemap: " + SITE + "sitemap.xml\n");
write("manifest.webmanifest", JSON.stringify({
  name: P.name + " - Resume", short_name: P.name, start_url: "/", display: "standalone",
  background_color: "#f3f2ef", theme_color: "#0a66c2",
  icons: [{ src: "assets/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
}, null, 2) + "\n");

/* vCard (contact details already public on the site) */
const [first, ...rest] = P.name.replace(/^A\.\s*/, "").split(" ");
write("assets/umarmukthar.vcf", [
  "BEGIN:VCARD", "VERSION:3.0",
  "FN:" + P.name, "N:" + (rest.join(" ") || first) + ";A.;;;",
  "ORG:" + R.jobs[0].org, "TITLE:" + R.roles[R.defaultRole].headline,
  "TEL;TYPE=CELL:" + P.phone, "EMAIL;TYPE=INTERNET:" + P.email,
  "ADR;TYPE=HOME:;;;Tiruppur;Tamil Nadu;;India", "URL:" + SITE, "END:VCARD", "",
].join("\r\n"));

/* 404 (GitHub Pages serves /404.html for unknown paths, so asset paths are absolute) */
write("404.html", `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>Page not found - ${esc(P.name)}</title>
  <meta name="theme-color" content="#0a66c2">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <script>
    try { var t = localStorage.getItem("theme"); if (t === "dark" || (!t && matchMedia("(prefers-color-scheme: dark)").matches)) document.documentElement.classList.add("dark"); } catch (e) {}
  </script>
  <link rel="stylesheet" href="/assets/styles.css">
</head>
<body class="min-h-screen bg-page font-sans text-ink antialiased">
  <main class="mx-auto flex min-h-screen max-w-page items-center justify-center px-4">
    <section class="card max-w-md text-center">
      <p class="text-sm font-semibold text-muted">404</p>
      <h1 class="mt-1 text-2xl font-semibold">Page not found</h1>
      <p class="mt-2 text-sm text-muted">This page does not exist. The resume is on the home page, with a version for each role.</p>
      <div class="mt-4 flex flex-wrap justify-center gap-2">
        <a class="btn-primary" href="/">Go to home page</a>
${roleKeys.map(k => `        <a class="btn" href="/${k}/">${esc(R.roles[k].label)}</a>`).join("\n")}
      </div>
    </section>
  </main>
</body>
</html>
`);

console.log("Built index.html + " + roleKeys.map(k => k + "/").join(", ") + ", sitemap.xml, robots.txt, manifest, vcf, 404.html");
