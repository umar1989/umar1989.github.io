/* Builds one LaTeX PDF per role from data.js.  Usage: npm run pdf   (needs pdflatex)
   Selection rules mirror script.js (roles map, priorities, skill groups). */
"use strict";
const fs = require("fs"), path = require("path"), cp = require("child_process"), os = require("os");
const root = path.join(__dirname, "..");
global.window = {};
require(path.join(root, "data.js"));
const R = window.RESUME, P = R.profile;

const tex = s => String(s)
  .replace(/\\/g, "\\textbackslash{}").replace(/([&%$#_{}])/g, "\\$1")
  .replace(/~/g, "\\textasciitilde{}").replace(/\^/g, "\\textasciicircum{}")
  .replace(/ - /g, " -- ").replace(/(\d) - (\d)/g, "$1--$2");
const url = s => String(s).replace(/([%#\\])/g, "\\$1");

function tag(item, role, idx) {
  if (R.roles[role].showAll) return { p: idx };
  const v = item.roles && item.roles[role];
  if (v === undefined) return null;
  return typeof v === "number" ? { p: v } : { p: v.p, name: v.name };
}
function pick(list, role) {
  const out = [];
  list.forEach((item, i) => { const t = tag(item, role, i); if (t) out.push({ item, p: t.p, name: t.name, i }); });
  return out.sort((a, b) => a.p - b.p || a.i - b.i);
}

const ICON = { github: "\\faGithub", youtube: "\\faYoutube", instagram: "\\faInstagram", facebook: "\\faFacebook" };

/* pdflatex cannot read WebP, so the PDF uses a JPEG or PNG of the same name (assets/image.jpeg for
   assets/image.webp). With no such file the photo is left out of the PDF rather than failing the build. */
function pdfPhoto(p) {
  if (!p || !/\.webp$/i.test(p)) return p;
  const alt = [".jpeg", ".jpg", ".png"].map(e => p.replace(/\.webp$/i, e)).find(q => fs.existsSync(path.join(root, q)));
  return alt || "";
}
const PHOTO = pdfPhoto(P.photo);

function build(role) {
  const r = R.roles[role];
  const bullets = pick(R.bullets, role);
  const sec = {};

  sec.about = `\\section*{About}\n${tex(r.about)}\n`;

  sec.experience = "\\section*{Experience}\n" + R.jobs.map(j => {
    const bs = bullets.filter(b => b.item.job === j.id);
    return `\\entry{${tex(j.title)}}{${tex(j.from)} -- ${tex(j.to)}}{${tex(j.org)}}{${tex(j.place)}}\n` +
      (bs.length ? "\\begin{itemize}\n" + bs.map(b => `\\item ${tex(b.item.text)}`).join("\n") + "\n\\end{itemize}\n" : "");
  }).join("\n");

  const chosen = pick(R.skills, role), byId = {};
  chosen.forEach(x => { byId[x.item.id] = x; });
  let groups = (r.skillGroups || []).map(g => ({ title: g.title, list: g.ids.map(id => byId[id]).filter(Boolean) }));
  const used = new Set(); groups.forEach(g => g.list.forEach(x => used.add(x.item.id)));
  const rest = chosen.filter(x => !used.has(x.item.id));
  if (rest.length) groups.push({ title: "More skills", list: rest });
  groups.forEach(g => g.list.sort((a, b) => a.p - b.p));
  groups = groups.filter(g => g.list.length);
  if (groups.length) {
    sec.skills = "\\section*{Skills}\n" + groups.map(g =>
      `\\textbf{${tex(g.title)}}\\par\\nopagebreak\n\\begin{itemize}[beginpenalty=10000]\n` +   /* keep a group's heading with its first skill */
      g.list.map(x => `\\item \\textbf{${tex(x.name || x.item.name)}}: ${tex(x.item.desc)}`).join("\n") +
      "\n\\end{itemize}\n").join("");
  }

  sec.education = "\\section*{Education}\n" + R.education.map(e =>
    `\\entry{${tex(e.degree)}}{${tex(e.year)}}{${tex(e.school)}}{${e.score ? tex(e.score) : ""}}\n`).join("");

  sec.certifications = "\\section*{Licenses \\& certifications}\n" + R.certifications.map(c =>
    `\\entry{${tex(c.title)}}{}{${tex(c.issuer)}}{}\n`).join("");

  const proj = pick(R.projects, role);
  if (proj.length) sec.projects = "\\section*{Projects}\n\\begin{itemize}\n" + proj.map(x =>
    `\\item \\textbf{${x.item.link ? `\\href{${url(x.item.link)}}{${tex(x.item.title)}}` : tex(x.item.title)}}: ${tex(x.item.text)}`).join("\n") + "\n\\end{itemize}\n";

  const body = r.sections.filter(id => sec[id]).map(id => sec[id]).join("\n");   /* featured is screen-only, as in print */
  const links = (P.social || []).map(l =>
    `\\href{${url(l.url)}}{${ICON[l.icon] || ""}\\,${tex(l.url.replace(/^https?:\/\/(www\.)?/, ""))}}`);
  const social = [];                                  /* two links per line so none runs past the margin */
  for (let n = 0; n < links.length; n += 2) social.push(links.slice(n, n + 2).join(" \\quad "));
  const socialTex = social.join(" \\\\\n");

  return String.raw`\documentclass[10pt,a4paper]{article}
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage{lmodern}
\usepackage[a4paper,margin=15mm]{geometry}
\usepackage[dvipsnames]{xcolor}
\usepackage{enumitem,titlesec,fontawesome5,graphicx,tikz}
\usepackage[hidelinks,pdftitle={${tex(P.name)} - ${tex(r.label)} - Resume},pdfauthor={${tex(P.name)}}]{hyperref}
\definecolor{accent}{HTML}{0A4E96}
\frenchspacing\setlength{\parindent}{0pt}\setlength{\parskip}{3pt}
\pagestyle{empty}
\titleformat{\section}{\large\bfseries\color{accent}}{}{0pt}{\MakeUppercase}[\vspace{-5pt}\textcolor{accent}{\rule{\linewidth}{0.6pt}}]
\titlespacing*{\section}{0pt}{9pt}{5pt}
\setlist[itemize]{leftmargin=1.2em,itemsep=1pt,topsep=2pt,parsep=0pt}
\newcommand{\entry}[4]{\textbf{#1}\hfill #2\par\nopagebreak {#3}\ifx\relax#4\relax\else\ $\cdot$\ #4\fi\par\vspace{1pt}}
\begin{document}
${PHOTO ? String.raw`\noindent\begin{minipage}[t]{\dimexpr\linewidth-3cm\relax}` : ""}
{\Huge\bfseries ${tex(P.name)}}\par\vspace{2pt}
{\large ${tex(r.headline)}}\par\vspace{4pt}
\faEnvelope\ \href{mailto:${url(P.email)}}{${tex(P.email)}} \quad \faPhone\ ${tex(P.phone)} \quad \faMapMarker*\ ${tex(P.location)}\par
${socialTex}\par
${PHOTO ? String.raw`\end{minipage}\hfill\begin{minipage}[t]{2.6cm}\vspace{0pt}\raggedleft
\begin{tikzpicture}\clip (0,0) circle (1.2cm);\node at (0,0) {\includegraphics[width=2.4cm]{${path.join(root, PHOTO).replace(/\\/g, "/")}}};\end{tikzpicture}
\end{minipage}` : ""}
${body}
\end{document}
`;
}

const only = process.argv[2];
const outDir = path.join(root, "assets", "pdf");
fs.mkdirSync(outDir, { recursive: true });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "resume-pdf-"));
let failed = 0;
Object.keys(R.roles).filter(k => !only || k === only).forEach(k => {
  const out = path.join(root, R.roles[k].pdf || `assets/pdf/resume-${k}.pdf`);
  const base = path.basename(out, ".pdf");
  fs.writeFileSync(path.join(tmp, base + ".tex"), build(k));
  const res = cp.spawnSync("pdflatex", ["-interaction=nonstopmode", "-halt-on-error", base + ".tex"], { cwd: tmp, encoding: "utf8" });
  if (res.status !== 0) { failed++; console.error("FAILED " + k + "\n" + (res.stdout || "").split("\n").slice(-25).join("\n")); return; }
  fs.copyFileSync(path.join(tmp, base + ".pdf"), out);
  const pages = (fs.readFileSync(path.join(tmp, base + ".log"), "utf8").match(/Output written on .*\((\d+) page/) || [])[1];
  console.log("ok  " + path.relative(root, out) + "  (" + pages + " page" + (pages === "1" ? "" : "s") + ")");
});
if (failed) process.exit(1);
