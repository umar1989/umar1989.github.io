const R = window.RESUME;
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const safe = (fn) => { try { return fn(); } catch { return null; } };
const slug = R.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const range = (x) => (x.start ? `${x.start} – ${x.end}` : x.end);

/* ---------- render ---------- */
document.title = `${R.name} – ${R.title}`;
$("#brand").textContent = R.name;
$("#name").textContent = R.name;
$("#summary").textContent = R.summary;
$("#emailText").textContent = R.email;
$("#loc").textContent = R.location;
$("#foot").textContent = `© ${new Date().getFullYear()} ${R.name}`;
$("#avatar").innerHTML = R.photo ? `<img src="${esc(R.photo)}" alt="${esc(R.name)}">` : esc(R.name.split(" ").map((w) => w[0]).join("").slice(0, 2));
$("#social").innerHTML = R.links.map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join("");
if (!R.links.length) $("#social").remove();
$("#stats").innerHTML = R.stats.map((s) => `<div class="stat reveal"><b data-n="${s.value}" data-s="${s.suffix || ""}">0</b>${esc(s.label)}</div>`).join("");

$("#skillGroups").innerHTML = `<div class="grid">${R.skills.map((k) => `<div class="card reveal"><h3>${esc(k.name)}</h3><ul>${k.details.map((d) => `<li>${esc(d)}</li>`).join("")}</ul></div>`).join("")}</div>`;

$("#timeline").innerHTML = R.experience.map((j) => `<div class="job reveal"><h3>${esc(j.role)} · ${esc(j.company)}</h3>
  <div class="muted">${esc(range(j))} · ${esc(j.location)}</div><ul>${j.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul></div>`).join("");

if (!R.projects.length) { $("#projects").remove(); document.querySelector('#links a[href="#projects"]').remove(); }
const tags = [...new Set(R.projects.flatMap((p) => p.tags))];
if (R.projects.length) $("#filters").innerHTML = ["All", ...tags].map((t, i) => `<button class="${i ? "" : "on"}" data-t="${esc(t)}">${esc(t)}</button>`).join("");
function drawProjects(tag = "All") {
  $("#projectGrid").innerHTML = R.projects.filter((p) => tag === "All" || p.tags.includes(tag)).map((p) => `<div class="card"><h3>${esc(p.name)}</h3>
    <p>${esc(p.description)}</p><div class="chips">${p.tags.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>
    ${p.url ? `<p><a href="${esc(p.url)}" target="_blank" rel="noopener">View project ↗</a></p>` : ""}</div>`).join("");
}
if (R.projects.length) drawProjects();
if (R.projects.length) $("#filters").onclick = (e) => {
  if (e.target.tagName !== "BUTTON") return;
  document.querySelectorAll("#filters button").forEach((b) => b.classList.toggle("on", b === e.target));
  drawProjects(e.target.dataset.t);
};

$("#edu").innerHTML = R.education.map((e) => `<div class="card"><h3>${esc(e.degree)}</h3><div class="muted">${esc(e.school)} · ${esc(range(e))}</div><p>${esc(e.details || "")}</p></div>`).join("")
  + R.certifications.map((c) => `<div class="card"><h3>${esc(c.name)}</h3><div class="muted">${esc(c.issuer)}${c.year ? " · " + esc(c.year) : ""}</div></div>`).join("");
$("#langs").innerHTML = R.languages.map((l) => `<span class="chip">${esc(l.name)} – ${esc(l.level)}</span>`).join("");

/* typing effect */
(function typing() {
  const el = $("#typed"), words = [R.title, R.tagline];
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = R.title; return; }
  let w = 0, i = 0, del = false;
  (function tick() {
    const full = words[w];
    el.textContent = full.slice(0, i);
    if (!del && i === full.length) { del = true; return setTimeout(tick, 1800); }
    if (del && i === 0) { del = false; w = (w + 1) % words.length; }
    i += del ? -1 : 1;
    setTimeout(tick, del ? 25 : 60);
  })();
})();

/* ---------- ui behaviour ---------- */
const root = document.documentElement;
const stored = safe(() => localStorage.getItem("theme"));
root.dataset.theme = stored || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
function toggleTheme() {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  safe(() => localStorage.setItem("theme", root.dataset.theme));
}
$("#theme").onclick = toggleTheme;
addEventListener("keydown", (e) => { if (e.key.toLowerCase() === "t" && !/INPUT|TEXTAREA/.test(e.target.tagName) && !e.ctrlKey && !e.metaKey) toggleTheme(); });
$("#menu").onclick = () => $("#links").classList.toggle("open");
$("#links").onclick = () => $("#links").classList.remove("open");

addEventListener("scroll", () => {
  const h = document.documentElement;
  $("#progress").style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight || 1)) * 100 + "%";
}, { passive: true });

const navLinks = [...document.querySelectorAll("#links a")];
const spy = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) navLinks.forEach((a) => a.classList.toggle("active", a.hash === "#" + e.target.id));
}), { rootMargin: "-40% 0px -55% 0px" });
document.querySelectorAll("main section").forEach((s) => spy.observe(s));

const reveal = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add("in");
  e.target.querySelectorAll(".bar i").forEach((b) => (b.style.width = b.dataset.w + "%"));
  e.target.querySelectorAll("[data-n]").forEach((n) => {
    const t = +n.dataset.n; let c = 0;
    const id = setInterval(() => { c = Math.min(t, c + Math.max(1, t / 30)); n.textContent = Math.round(c) + n.dataset.s; if (c >= t) clearInterval(id); }, 30);
  });
  reveal.unobserve(e.target);
}), { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => reveal.observe(el));

function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
}
$("#copyEmail").onclick = () => navigator.clipboard.writeText(R.email).then(() => toast("Email copied"), () => toast("Copy failed"));
$("#form").onsubmit = (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  location.href = `mailto:${R.email}?subject=${encodeURIComponent("Hello from " + f.get("n"))}&body=${encodeURIComponent(f.get("m") + "\n\n" + f.get("n") + " <" + f.get("e") + ">")}`;
};

/* QR code of the page URL (loaded lazily from CDN) */
(function qr() {
  const s = document.createElement("script");
  s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js";
  s.onload = () => {
    const q = qrcode(0, "M"); q.addData(location.href.split("#")[0]); q.make();
    const c = $("#qr"), x = c.getContext("2d"), n = q.getModuleCount(), sz = (c.width - 12) / n;
    x.fillStyle = "#000";
    for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) if (q.isDark(r, k)) x.fillRect(6 + k * sz, 6 + r * sz, Math.ceil(sz), Math.ceil(sz));
  };
  s.onerror = () => ($(".qr").style.display = "none");
  document.head.appendChild(s);
})();

/* ---------- downloads ---------- */
const contactLine = () => [R.email, R.phone, R.location, ...R.links.map((l) => l.url)].filter(Boolean);

function toMarkdown() {
  const L = [`# ${R.name}`, `**${R.title}**`, "", contactLine().join(" | "), "", "## Summary", R.summary, "", "## Skills"];
  R.skills.forEach((k) => { L.push(`- **${k.name}**`); k.details.forEach((d) => L.push(`  - ${d}`)); });
  L.push("", "## Experience");
  R.experience.forEach((j) => { L.push(`### ${j.role}, ${j.company}`, `*${range(j)} · ${j.location}*`, ""); j.bullets.forEach((b) => L.push(`- ${b}`)); L.push(""); });
  if (R.projects.length) { L.push("## Projects"); R.projects.forEach((p) => L.push(`- **${p.name}** – ${p.description}${p.url ? ` (${p.url})` : ""}`)); L.push(""); }
  L.push("## Education");
  R.education.forEach((e) => L.push(`- **${e.degree}**, ${e.school} (${range(e)}) ${e.details || ""}`));
  if (R.certifications.length) { L.push("", "## Certifications"); R.certifications.forEach((c) => L.push(`- ${c.name} – ${c.issuer}, ${c.year}`)); }
  if (R.languages.length) L.push("", "## Languages", R.languages.map((l) => `${l.name} (${l.level})`).join(", "));
  return L.join("\n") + "\n";
}
const toText = () => toMarkdown().replace(/^#{1,3} /gm, "").replace(/\*+/g, "");

function toHTML() {
  const css = "body{font:14px/1.5 Arial,sans-serif;max-width:800px;margin:30px auto;padding:0 20px;color:#111}h1{margin:0}h2{border-bottom:1px solid #999;margin-top:22px}h3{margin:12px 0 0}";
  const body = `<h1>${esc(R.name)}</h1><p><b>${esc(R.title)}</b><br>${contactLine().map(esc).join(" | ")}</p><h2>Summary</h2><p>${esc(R.summary)}</p>
<h2>Skills</h2>${R.skills.map((k) => `<p><b>${esc(k.name)}</b></p><ul>${k.details.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>`).join("")}
<h2>Experience</h2>${R.experience.map((j) => `<h3>${esc(j.role)}, ${esc(j.company)}</h3><i>${esc(range(j))} · ${esc(j.location)}</i><ul>${j.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`).join("")}
${R.projects.length ? `<h2>Projects</h2><ul>${R.projects.map((p) => `<li><b>${esc(p.name)}</b> – ${esc(p.description)}</li>`).join("")}</ul>` : ""}
<h2>Education</h2><ul>${R.education.map((e) => `<li><b>${esc(e.degree)}</b>, ${esc(e.school)} (${esc(range(e))}) ${esc(e.details || "")}</li>`).join("")}</ul><h2>Certifications</h2><ul>${R.certifications.map((c) => `<li>${esc(c.name)}</li>`).join("")}</ul><h2>Languages</h2><p>${R.languages.map((l) => esc(l.name + " (" + l.level + ")")).join(", ")}</p>`;
  return { css, body };
}
const toFullHTML = () => { const h = toHTML(); return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(R.name)} – Resume</title><style>${h.css}</style></head><body>${h.body}</body></html>`; };
// Word opens HTML saved as .doc, so this needs no library and works offline
const toWordDoc = () => { const h = toHTML(); return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><style>${h.css}</style></head><body>${h.body}</body></html>`; };

function toVCard() {
  const [first, ...rest] = R.name.split(" ");
  return ["BEGIN:VCARD", "VERSION:3.0", `FN:${R.name}`, `N:${rest.join(" ")};${first};;;`, `TITLE:${R.title}`, `EMAIL:${R.email}`, R.phone && `TEL:${R.phone}`, R.links[0] && `URL:${R.links[0].url}`, "END:VCARD"].filter(Boolean).join("\r\n");
}

async function toDocx() {
  if (!window.docx) throw new Error("docx library not loaded (offline?)");
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = window.docx;
  const P = (t, o = {}) => new Paragraph({ children: [new TextRun({ text: t, bold: o.bold, italics: o.italics })], heading: o.h, bullet: o.bullet ? { level: 0 } : undefined });
  const H = (t) => P(t, { h: HeadingLevel.HEADING_2, bold: true });
  const c = [P(R.name, { h: HeadingLevel.TITLE, bold: true }), P(R.title, { bold: true }), P(contactLine().join(" | ")),
    H("Summary"), P(R.summary), H("Skills"),
    ...R.skills.flatMap((k) => [P(k.name, { bold: true }), ...k.details.map((d) => P(d, { bullet: true }))]),
    H("Experience")];
  R.experience.forEach((j) => { c.push(P(`${j.role}, ${j.company}`, { bold: true }), P(`${range(j)} · ${j.location}`, { italics: true })); j.bullets.forEach((b) => c.push(P(b, { bullet: true }))); });
  if (R.projects.length) c.push(H("Projects"), ...R.projects.map((p) => P(`${p.name} – ${p.description}`, { bullet: true })));
  c.push(H("Education"), ...R.education.map((e) => P(`${e.degree}, ${e.school} (${range(e)}) ${e.details || ""}`, { bullet: true })));
  c.push(H("Certifications"), ...R.certifications.map((x) => P(x.name, { bullet: true })), H("Languages"), P(R.languages.map((l) => `${l.name} (${l.level})`).join(", ")));
  return Packer.toBlob(new Document({ sections: [{ children: c }] }));
}

function save(content, name, type) {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: name });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast(`Downloaded ${name}`);
}

const formats = [
  { label: "PDF", note: R.pdfFile ? "Original file" : "Print → Save as PDF", run: () => (R.pdfFile ? save(null, "") : print()) },
  { label: "Word (.docx)", note: "Editable", run: async () => save(await toDocx(), `${slug}-resume.docx`) },
  { label: "Word (.doc)", note: "Works offline", run: () => save(toWordDoc(), `${slug}-resume.doc`, "application/msword") },
  { label: "HTML", note: "Standalone page", run: () => save(toFullHTML(), `${slug}-resume.html`, "text/html") },
  { label: "Markdown", note: ".md", run: () => save(toMarkdown(), `${slug}-resume.md`, "text/markdown") },
  { label: "Plain text", note: ".txt (ATS friendly)", run: () => save(toText(), `${slug}-resume.txt`, "text/plain") },
  { label: "JSON", note: "Structured data", run: () => save(JSON.stringify(R, null, 2), `${slug}-resume.json`, "application/json") },
  { label: "vCard", note: "Contact card (.vcf)", run: () => save(toVCard(), `${slug}.vcf`, "text/vcard") }
];
$("#dl").innerHTML = "";
formats.forEach((f) => {
  let el;
  if (f.label === "PDF" && R.pdfFile) { el = document.createElement("a"); el.href = R.pdfFile; el.download = `${slug}-resume.pdf`; }
  else { el = document.createElement("button"); el.onclick = () => Promise.resolve(f.run()).catch((e) => toast(e.message)); }
  el.className = "btn card";
  el.innerHTML = `<strong>${esc(f.label)}</strong><small>${esc(f.note)}</small>`;
  $("#dl").appendChild(el);
});
