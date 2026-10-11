/* script.js - renders the whole page from window.RESUME (data.js).
   No framework. Layout lives here and in index.html; content lives in data.js. */
(function () {
  "use strict";
  var R = window.RESUME;
  var P = R.profile;
  var VISIBLE_BULLETS = 2;   // experience bullets shown before "see more"
  var VISIBLE_SKILLS = 5;    // skills shown before "show all skills"
  var FEATURED_MAX = 3;

  var SECTION_TITLES = {
    about: "About", featured: "Featured", experience: "Experience", education: "Education",
    certifications: "Licenses & certifications", skills: "Skills", projects: "Projects",
  };
  var SECTION_NAV = {
    about: "About", featured: "Featured", experience: "Experience", education: "Education",
    certifications: "Certifications", skills: "Skills", projects: "Projects",
  };

  /* ---------- helpers ---------- */
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var ICONS = {
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.7 7L4 20l1.2-4.6A8 8 0 1 1 21 12z"/>',
    download: '<path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/>',
    pin: '<path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    github: '<path d="M9 19c-4 1.5-4-2-6-2m12 4v-3.5c0-1 .1-1.4-.5-2 2.800-.3 5.500-1.400 5.500-6a4.600 4.600 0 0 0-1.300-3.200 4.200 4.200 0 0 0-.1-3.200s-1.100-.3-3.500 1.300a12 12 0 0 0-6.200 0C6.500 2.800 5.400 3.100 5.400 3.100a4.200 4.200 0 0 0-.1 3.200A4.600 4.600 0 0 0 4 9.500c0 4.600 2.700 5.700 5.500 6-.6.600-.6 1.200-.5 2V21"/>',
    youtube: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.500 6.500h.01"/>',
    facebook: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    print: '<path d="M7 9V4h10v5M7 17H5a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2"/><rect x="7" y="14" width="10" height="6"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',
  };
  var icon = function (n, cls) {
    return '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="' + (cls || "size-4") + '">' + ICONS[n] + "</svg>";
  };

  /* ---------- role handling ---------- */
  var roleKeys = Object.keys(R.roles);
  function resolveRole(v) {
    if (!v) return null;
    v = String(v).toLowerCase().trim();
    for (var i = 0; i < roleKeys.length; i++) {
      var k = roleKeys[i], r = R.roles[k];
      if (k === v || (r.aliases || []).indexOf(v) !== -1) return k;
    }
    return null;
  }
  var urlRole = resolveRole(new URLSearchParams(location.search).get("role"));
  var locked = !!urlRole;                       // role in URL -> hide the switcher
  var role = urlRole || R.defaultRole;

  /* Entry in a master list -> {priority, name?} for the current role, or null if hidden. */
  function tag(item, idx) {
    if (R.roles[role].showAll) return { p: idx };
    var v = item.roles && item.roles[role];
    if (v === undefined) return null;
    return typeof v === "number" ? { p: v } : { p: v.p, name: v.name };
  }
  function pick(list, filter) {
    var out = [];
    list.forEach(function (it, i) {
      if (filter && !filter(it)) return;
      var t = tag(it, i);
      if (t) out.push({ item: it, p: t.p, name: t.name, i: i });
    });
    out.sort(function (a, b) { return a.p - b.p || a.i - b.i; });
    return out;
  }

  /* ---------- section renderers ---------- */
  function sectionWrap(id, body, extra) {
    return '<section id="sec-' + id + '" aria-labelledby="h-' + id + '" class="card scroll-mt-20 ' + (extra || "") + '">' +
      '<h2 id="h-' + id + '" class="mb-3 text-xl font-semibold print:mb-1 print:border-b print:border-ink print:break-after-avoid print:text-[1.05rem] print:uppercase print:tracking-wide">' + SECTION_TITLES[id] + "</h2>" + body + "</section>";
  }
  var tile = function (letter, round) {
    return '<div aria-hidden="true" class="flex size-12 shrink-0 items-center justify-center ' + (round ? "rounded-full" : "rounded-md") +
      ' bg-brand-soft text-lg font-semibold text-brand print:hidden">' + esc(letter) + "</div>";
  };

  function renderAbout() {
    return sectionWrap("about", '<p class="leading-relaxed">' + esc(R.roles[role].about) + "</p>");
  }

  function renderFeatured() {
    var items = pick(R.featured).slice(0, FEATURED_MAX);
    if (!items.length) return "";
    var cards = items.map(function (x) {
      return '<li class="rounded-lg border border-line p-3"><h3 class="font-semibold">' + esc(x.item.title) +
        '</h3><p class="mt-1 text-sm text-muted">' + esc(x.item.text) + "</p></li>";
    }).join("");
    /* literal class names so the Tailwind scanner sees them */
    var cols = ["", "md:grid-cols-1", "md:grid-cols-2", "md:grid-cols-3"][Math.min(items.length, 3)];
    return sectionWrap("featured", '<ul class="grid gap-3 ' + cols + '">' + cards + "</ul>", "print:hidden");
  }

  function renderExperience() {
    var bullets = pick(R.bullets);
    var items = R.jobs.map(function (job, n) {
      var bs = bullets.filter(function (b) { return b.item.job === job.id; });
      var lis = bs.map(function (b, i) {
        var extra = i >= VISIBLE_BULLETS;
        return "<li" + (extra ? ' data-extra class="hidden print:list-item"' : "") + ">" + esc(b.item.text) + "</li>";
      }).join("");
      var more = bs.length > VISIBLE_BULLETS
        ? '<button type="button" data-toggle="entry" aria-expanded="false" class="mt-1 text-sm font-semibold text-muted hover:text-brand print:hidden">…see more</button>' : "";
      var dates = esc(job.from) + " - " + esc(job.to) + (job.duration ? " · " + esc(job.duration) : "");
      return '<li class="flex gap-3 break-inside-avoid' + (n ? " border-t border-line pt-4 print:border-0 print:pt-2" : "") + '">' + tile(job.org.charAt(0)) +
        '<div class="min-w-0"><h3 class="font-semibold">' + esc(job.title) + "</h3>" +
        '<p class="text-sm">' + esc(job.org) + "</p>" +
        '<p class="text-sm text-muted">' + dates + " · " + esc(job.place) + "</p>" +
        (lis ? '<ul class="mt-2 list-disc space-y-1 pl-5 text-sm marker:text-muted">' + lis + "</ul>" : "") + more + "</div></li>";
    }).join("");
    return sectionWrap("experience", '<ol class="space-y-4 print:space-y-1">' + items + "</ol>");
  }

  function renderEducation() {
    var items = R.education.map(function (e, n) {
      return '<li class="flex gap-3 break-inside-avoid' + (n ? " border-t border-line pt-4 print:border-0 print:pt-1" : "") + '">' + tile(e.school.charAt(0)) +
        '<div class="min-w-0"><h3 class="font-semibold">' + esc(e.degree) + '</h3><p class="text-sm">' + esc(e.school) +
        '</p><p class="text-sm text-muted">' + esc(e.year) + (e.score ? " · " + esc(e.score) : "") + "</p></div></li>";
    }).join("");
    return sectionWrap("education", '<ul class="space-y-4 print:space-y-1">' + items + "</ul>");
  }

  function renderCertifications() {
    var items = R.certifications.map(function (c) {
      return '<li class="flex gap-3 break-inside-avoid">' + tile(c.title.charAt(0)) + '<div><h3 class="font-semibold">' + esc(c.title) +
        '</h3><p class="text-sm text-muted">' + esc(c.issuer) + "</p></div></li>";
    }).join("");
    return sectionWrap("certifications", '<ul class="space-y-3 print:space-y-1">' + items + "</ul>");
  }

  function renderSkills() {
    var chosen = pick(R.skills), byId = {};
    chosen.forEach(function (x) { byId[x.item.id] = x; });
    var groups = (R.roles[role].skillGroups || []).map(function (g) {
      return { title: g.title, list: g.ids.map(function (id) { return byId[id]; }).filter(Boolean) };
    });
    var used = {};
    groups.forEach(function (g) { g.list.forEach(function (x) { used[x.item.id] = 1; }); });
    var rest = chosen.filter(function (x) { return !used[x.item.id]; });
    if (rest.length) groups.push({ title: "More skills", list: rest });
    /* inside a group, higher-priority skills first */
    groups.forEach(function (g) { g.list.sort(function (a, b) { return a.p - b.p; }); });
    groups = groups.filter(function (g) { return g.list.length; });
    if (!groups.length) return "";

    var shown = 0, total = 0;
    var html = groups.map(function (g) {
      var firstExtra = shown >= VISIBLE_SKILLS;
      var lis = g.list.map(function (x) {
        var extra = shown >= VISIBLE_SKILLS; shown++; total++;
        return "<li" + (extra ? ' data-extra class="hidden print:list-item"' : "") + '><span class="font-semibold">' + esc(x.name || x.item.name) +
          '</span><p class="text-sm text-muted">' + esc(x.item.desc) + "</p></li>";
      }).join("");
      return "<div" + (firstExtra ? ' data-extra class="hidden print:block break-inside-avoid"' : ' class="break-inside-avoid"') + '><h3 class="mb-1 text-sm font-semibold text-brand print:text-ink">' +
        esc(g.title) + '</h3><ul class="space-y-2 print:space-y-0.5">' + lis + "</ul></div>";
    }).join("");
    var btn = total > VISIBLE_SKILLS
      ? '<button type="button" data-toggle="skills" data-total="' + total + '" aria-expanded="false" class="btn mt-4 w-full print:hidden">Show all ' + total + " skills</button>" : "";
    return sectionWrap("skills", '<div class="space-y-4 print:columns-2 print:gap-6 print:space-y-0">' + html + "</div>" + btn);
  }

  function renderProjects() {
    var items = pick(R.projects);
    if (!items.length) return "";
    var lis = items.map(function (x) {
      var p = x.item;
      return '<li class="break-inside-avoid"><h3 class="font-semibold">' + (p.link ? '<a class="text-brand hover:underline" href="' + esc(p.link) + '">' + esc(p.title) + "</a>" : esc(p.title)) +
        '</h3><p class="text-sm text-muted">' + esc(p.text) + "</p></li>";
    }).join("");
    return sectionWrap("projects", '<ul class="space-y-3">' + lis + "</ul>");
  }

  var RENDER = { about: renderAbout, featured: renderFeatured, experience: renderExperience, education: renderEducation,
    certifications: renderCertifications, skills: renderSkills, projects: renderProjects };

  /* ---------- intro, sidebar, switcher ---------- */
  function avatar(size) {
    return P.photo
      ? '<img src="' + esc(P.photo) + '" alt="' + esc(P.name) + '" class="' + size + ' rounded-full border-4 border-card object-cover">'
      : '<div role="img" aria-label="' + esc(P.name) + '" class="' + size + ' flex items-center justify-center rounded-full border-4 border-card bg-brand-soft text-4xl font-semibold text-brand">' + esc(P.initials) + "</div>";
  }
  /* Role banner: gradient colours + a faint physics-themed SVG motif (website only). */
  var MOTIFS = {
    orbits: function () {
      var o = "";
      [0, 60, 120].forEach(function (a) { o += '<ellipse cx="650" cy="80" rx="130" ry="42" transform="rotate(' + a + ' 650 80)"/>'; });
      [0, 60, 120].forEach(function (a) { o += '<ellipse cx="110" cy="70" rx="70" ry="24" transform="rotate(' + a + ' 110 70)"/>'; });
      return o + '<circle cx="650" cy="80" r="7" fill="#fff"/><circle cx="110" cy="70" r="5" fill="#fff"/>';
    },
    waves: function () {
      var o = "";
      [[40, 18, 90], [80, 26, 130], [120, 14, 70]].forEach(function (w) {
        var d = "M0 " + w[0];
        for (var x = 4; x <= 800; x += 4) d += " L" + x + " " + (w[0] + w[1] * Math.sin(x / w[2] * 2 * Math.PI / 4)).toFixed(1);
        o += '<path d="' + d + '"/>';
      });
      return o;
    },
    formulas: function () {
      var f = [["F = ma", 30, 60, 26], ["E = mc²", 210, 120, 22], ["V = IR", 400, 50, 24], ["λ = h/p", 560, 118, 22],
        ["∇·E = ρ/ε₀", 640, 48, 20], ["v = u + at", 90, 140, 18], ["ΔxΔp ≥ ħ/2", 330, 148, 16]];
      return f.map(function (t) {
        return '<text x="' + t[1] + '" y="' + t[2] + '" font-size="' + t[3] + '" fill="#fff" stroke="none" font-family="Georgia,serif" font-style="italic">' + t[0] + "</text>";
      }).join("");
    },
    trajectory: function () {
      var o = "";
      [[30, 150, 190, -50, 350, 150], [120, 150, 280, 0, 440, 150], [430, 150, 590, -30, 750, 150], [500, 150, 640, 30, 780, 150]].forEach(function (p) {
        o += '<path d="M' + p[0] + " " + p[1] + " Q" + p[2] + " " + p[3] + " " + p[4] + " " + p[5] + '" stroke-dasharray="6 7"/>' +
          '<circle cx="' + (p[0] + p[4]) / 2 + '" cy="' + ((p[1] + p[5]) / 2 + p[3]) / 2 + '" r="6" fill="#fff"/>';
      });
      return o;
    },
    grid: function () {
      var o = "";
      for (var x = 0; x <= 800; x += 66) o += '<path d="M' + x + ' 0V160"/>';
      for (var y = 0; y <= 160; y += 40) o += '<path d="M0 ' + y + "H800" + '"/>';
      [[66, 40], [198, 80], [330, 0], [462, 120], [594, 40], [726, 80]].forEach(function (c) {
        o += '<rect x="' + c[0] + '" y="' + c[1] + '" width="66" height="40" fill="#fff" fill-opacity=".35" stroke="none"/>';
      });
      return o;
    },
    steps: function () {
      var o = "";
      for (var i = 0; i < 8; i++) o += '<rect x="' + (330 + i * 56) + '" y="' + (150 - 18 * (i + 1)) + '" width="50" height="' + (18 * (i + 1) + 10) + '" fill="#fff" fill-opacity=".25"/>';
      return o + '<path d="M330 130 L560 70 L760 18 M740 14 L764 16 L752 36"/>';
    },
  };
  function banner(r) {
    var b = r.banner || {}, hex = /^#[0-9a-f]{6}$/i;
    var style = hex.test(b.a) && hex.test(b.b) ? ' style="--color-cover-a:' + b.a + ";--color-cover-b:" + b.b + '"' : "";
    var art = MOTIFS[b.motif]
      ? '<svg class="absolute inset-0 size-full" viewBox="0 0 800 160" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#fff" stroke-width="2" opacity=".22" aria-hidden="true">' + MOTIFS[b.motif]() + "</svg>" : "";
    return '<div class="relative h-28 overflow-hidden bg-linear-to-r from-cover-a to-cover-b sm:h-40 print:hidden" aria-hidden="true"' + style + ">" + art + "</div>";
  }
  /* Video introduction: any YouTube link (watch, youtu.be, shorts, live, embed). Empty -> no card.
     Click-to-play facade, so YouTube is only contacted for the thumbnail until the visitor presses play. */
  function youtubeId(u) {
    var m = String(u || "").match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/))([\w-]{11})(?![\w-])/);
    return m ? m[1] : null;
  }
  function renderVideo(r) {
    var url = r.video || P.videoIntro;
    var id = youtubeId(url);
    if (!id) return "";
    var t = String(url).match(/[?&#](?:t|start)=(\d+)/);
    return '<section aria-labelledby="h-video" class="card mt-3 overflow-hidden max-sm:rounded-none print:hidden">' +
      '<h2 id="h-video" class="mb-3 text-xl font-semibold">Video introduction</h2>' +
      '<button type="button" data-video="' + id + '"' + (t ? ' data-start="' + t[1] + '"' : "") +
      ' class="group relative block aspect-video w-full overflow-hidden rounded-lg bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand" aria-label="Play video introduction">' +
      '<img src="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg" alt="" loading="lazy" class="size-full object-cover opacity-90 group-hover:opacity-100">' +
      '<span class="absolute inset-0 flex items-center justify-center"><span class="flex size-16 items-center justify-center rounded-full bg-black/70 text-white group-hover:bg-brand">' +
      '<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" class="ml-1 size-8"><path d="M8 5v14l11-7z"/></svg></span></span></button></section>';
  }
  function renderIntro() {
    var r = R.roles[role];
    return '<section aria-labelledby="h-name" class="card overflow-hidden !p-0 max-sm:rounded-none print:!mb-2">' +
      banner(r) +
      '<div class="px-4 pb-5 sm:px-6 print:px-0 print:pb-0">' +
      '<div class="relative z-10 -mt-14 mb-3 sm:-mt-20 print:hidden">' + avatar("size-28 sm:size-36") + "</div>" +
      '<h1 id="h-name" class="text-2xl font-semibold print:text-2xl">' + esc(P.name) + "</h1>" +
      '<p class="mt-1 text-base" id="headline">' + esc(r.headline) + "</p>" +
      '<p class="mt-2 flex items-center gap-1 text-sm text-muted">' + icon("pin", "size-4 print:hidden") + esc(P.location) + "</p>" +
      '<p class="hidden text-sm print:block">' + esc(P.email) + " · " + esc(P.phone) + "</p>" +
      '<div class="mt-4 flex flex-wrap gap-2 print:hidden">' +
      '<a class="btn-primary" href="mailto:' + esc(P.email) + '">' + icon("mail") + "Email</a>" +
      '<a class="btn" href="tel:+' + esc(P.phone.replace(/\D/g, "")) + '">' + icon("phone") + "Call</a>" +
      '<a class="btn" href="https://wa.me/' + esc(P.whatsapp) + '" rel="noopener">' + icon("chat") + "WhatsApp</a>" +
      (P.social || []).map(function (l) {
        return '<a class="btn !px-2.5" href="' + esc(l.url) + '" rel="noopener" aria-label="' + esc(l.label) + '" title="' + esc(l.label) + '">' + icon(l.icon) + "</a>";
      }).join("") +
      "</div></div></section>" + renderVideo(r);
  }

  function renderSwitcher() {
    var btns = roleKeys.map(function (k) {
      var on = k === role;
      return '<button type="button" data-role="' + k + '" aria-pressed="' + on + '" class="w-full rounded-lg border px-3 py-2 text-left text-sm ' +
        (on ? "border-brand bg-brand-soft font-semibold text-brand" : "border-line hover:bg-brand-soft") +
        ' focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">' + esc(R.roles[k].label) + "</button>";
    }).join("");
    return '<section aria-labelledby="h-switch" class="card"><h2 id="h-switch" class="mb-1 text-base font-semibold">View this profile as</h2>' +
      '<p class="mb-3 text-sm text-muted">Pick the post you are hiring for.</p><div class="space-y-2" role="group" aria-labelledby="h-switch">' + btns + "</div></section>";
  }

  function row(ic, label, val, href) {
    var v = href ? '<a class="text-brand hover:underline" href="' + esc(href) + '">' + esc(val) + "</a>" : esc(val);
    return '<li class="flex items-start gap-2 text-sm">' + icon(ic, "mt-0.5 size-4 shrink-0 text-muted") + '<span class="min-w-0 break-words"><span class="sr-only">' + label + ": </span>" + v + "</span></li>";
  }
  function renderSidebar() {
    var contact = '<section aria-labelledby="h-contact" class="card"><h2 id="h-contact" class="mb-3 text-base font-semibold">Contact</h2><ul class="space-y-2">' +
      row("mail", "Email", P.email, "mailto:" + P.email) +
      row("phone", "Phone", P.phone, "tel:+" + P.phone.replace(/\D/g, "")) +
      (P.social || []).map(function (l) {
        return row(l.icon, l.label, l.url.replace(/^https?:\/\/(www\.)?/, ""), l.url);
      }).join("") +
      row("pin", "Location", P.location) + "</ul></section>";
    var langs = '<section aria-labelledby="h-lang" class="card"><h2 id="h-lang" class="mb-3 text-base font-semibold">Languages</h2><ul class="space-y-2">' +
      P.languages.map(function (l) { return '<li class="text-sm"><span class="font-semibold">' + esc(l.name) + '</span><br><span class="text-muted">' + esc(l.level) + "</span></li>"; }).join("") + "</ul></section>";
    var link = '<section aria-labelledby="h-link" class="card"><h2 id="h-link" class="mb-3 text-base font-semibold">Profile link</h2>' +
      '<p id="profile-url" class="break-all text-sm text-muted"></p>' +
      '<button type="button" id="copy-btn" class="btn mt-3 w-full">' + icon("copy") + '<span>Copy link</span></button>' +
      '<div id="qr" class="mx-auto mt-4 size-40 rounded-lg bg-white p-2" role="img" aria-label="QR code for this profile link"></div>' +
      '<p class="mt-2 text-center text-xs text-muted">Scan to open this version</p></section>';
    return contact + langs + (locked ? "" : '<div id="switcher-desktop" class="hidden lg:block">' + renderSwitcher() + "</div>") + link;
  }

  /* ---------- page assembly ---------- */
  function currentUrl() {
    var u = new URL(location.href); u.hash = ""; return u.toString();
  }
  function renderQR() {
    var el = $("#qr"), url = currentUrl();
    $("#profile-url").textContent = url;
    try {
      var qr = qrcode(0, "M"); qr.addData(url); qr.make();
      el.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
    } catch (e) { el.textContent = ""; }
  }
  function renderBar(order) {
    $("#bar-links").innerHTML = order.map(function (id) {
      return '<a href="#sec-' + id + '" class="whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-muted hover:bg-brand-soft hover:text-brand">' + SECTION_NAV[id] + "</a>";
    }).join("");
    $("#menu-panel").innerHTML = order.map(function (id) {
      return '<a href="#sec-' + id + '" class="block rounded-md px-2 py-2.5 text-sm hover:bg-brand-soft hover:text-brand">' + SECTION_NAV[id] + "</a>";
    }).join("");
  }
  function setMeta(sel, attr, val) { var el = $(sel); if (el) el.setAttribute(attr, val); }
  function updateHead() {
    var r = R.roles[role];
    var title = P.name + " - " + r.headline;
    document.title = title;
    setMeta('meta[name="description"]', "content", r.about.split(". ")[0] + ".");
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", r.about.split(". ")[0] + ".");
  }

  function render() {
    var r = R.roles[role];
    var html = r.sections.map(function (id) { return RENDER[id] ? RENDER[id]() : ""; });
    var present = r.sections.filter(function (id, i) { return html[i]; });
    $("#intro").innerHTML = renderIntro();
    $("#sections").innerHTML = html.join("");
    $("#switcher-mobile").innerHTML = locked ? "" : renderSwitcher();
    $("#sidebar").innerHTML = renderSidebar();
    renderBar(present);
    updatePdfLink();
    renderQR();
    updateHead();
  }

  function setRole(key) {
    role = key;
    var u = new URL(location.href);
    if (key === R.defaultRole) u.searchParams.delete("role"); else u.searchParams.set("role", key);
    history.replaceState(null, "", u);
    render();
  }

  /* ---------- events ---------- */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("button");
    if (!t) return;
    if (t.dataset.video) {
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + t.dataset.video + "?autoplay=1&rel=0" + (t.dataset.start ? "&start=" + t.dataset.start : "");
      f.title = "Video introduction";
      f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      f.allowFullscreen = true;
      f.className = "aspect-video w-full rounded-lg";
      t.replaceWith(f);
      return;
    }
    if (t.dataset.role) { setRole(t.dataset.role); return; }
    if (t.dataset.toggle) {
      var scope = t.dataset.toggle === "entry" ? t.parentElement : t.closest("section");
      var open = t.getAttribute("aria-expanded") !== "true";
      scope.querySelectorAll("[data-extra]").forEach(function (el) { el.classList.toggle("hidden", !open); });
      t.setAttribute("aria-expanded", open);
      t.textContent = t.dataset.toggle === "entry" ? (open ? "…see less" : "…see more")
        : (open ? "Show fewer skills" : "Show all " + t.dataset.total + " skills");
    }
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest("#copy-btn")) return;
    var b = $("#copy-btn span"), url = currentUrl();
    var done = function (m) { b.textContent = m; setTimeout(function () { b.textContent = "Copy link"; }, 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { done("Copied!"); }, function () { done("Copy failed"); });
    else done("Select the link above");
  });

  function setThemeIcon() {
    var dark = document.documentElement.classList.contains("dark");
    $("#theme-btn").innerHTML = icon(dark ? "sun" : "moon");
    $("#theme-btn").setAttribute("aria-pressed", dark);
  }
  $("#theme-btn").addEventListener("click", function () {
    var dark = document.documentElement.classList.toggle("dark");
    try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) {}
    setThemeIcon();
  });

  /* "Download PDF" = the LaTeX-built file for the current role (npm run pdf).
     "Print" = browser print dialog using the print stylesheet. */
  var savedTitle;
  window.addEventListener("beforeprint", function () {
    savedTitle = document.title;
    document.title = P.name + " - " + R.roles[role].label + " - Resume";
  });
  window.addEventListener("afterprint", function () { if (savedTitle) document.title = savedTitle; });
  function updatePdfLink() {
    var f = R.roles[role].pdf;
    $("#pdf-btn").innerHTML = icon("download") + "<span>Download PDF</span>";
    $("#pdf-btn").setAttribute("href", f || "#");
    $("#pdf-btn").hidden = !f;
  }
  $("#print-btn").innerHTML = icon("print") + "<span>Print</span>";
  $("#print-btn").addEventListener("click", function () { window.print(); });

  window.addEventListener("popstate", function () {   // back/forward through changed URLs
    var k = resolveRole(new URLSearchParams(location.search).get("role")) || R.defaultRole;
    if (k !== role) { role = k; render(); }
  });

  $("#bar-name").textContent = P.name;
  $("#footer").textContent = "© " + new Date().getFullYear() + " " + P.name + ". Resume website - use Download PDF for a copy of this version.";
  setThemeIcon();

  /* mobile section menu */
  function setMenu(open) {
    $("#menu-panel").classList.toggle("hidden", !open);
    $("#menu-btn").setAttribute("aria-expanded", open);
    $("#menu-btn").setAttribute("aria-label", open ? "Close section menu" : "Open section menu");
    $("#menu-btn").innerHTML = icon(open ? "close" : "menu");
  }
  $("#menu-btn").addEventListener("click", function () { setMenu($("#menu-btn").getAttribute("aria-expanded") !== "true"); });
  $("#menu-panel").addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  setMenu(false);
  render();
})();
