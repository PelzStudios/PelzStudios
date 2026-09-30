/* ============================================================
   Oluwasemilore Portfolio — Render Engine
   Fetches /content/*.json and renders every section into its
   fixed template slot. Edit content in the /admin/ dashboard —
   you never need to touch this file.
   ============================================================ */
(function () {
  "use strict";

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------------- Content sources ---------------- */
  var FILES = {
    settings: "content/settings.json",
    projects: "content/projects.json",
    experience: "content/experience.json",
    skills: "content/skills.json",
    testimonials: "content/testimonials.json",
    gallery: "content/gallery.json",
    blog: "content/blog.json"
  };

  /* Seed fallback so the site still renders when opened from
     disk (file://) without a server. On the live site the
     real content files always win. */
  var FALLBACK = {
    settings: {
      site: {
        name: "Oluwasemilore Ademo",
        title: "Oluwasemilore Ademo — Digital Media & Content Producer",
        description: "Portfolio of Oluwasemilore Ademo — digital media & content producer creating graphics, videos and social content from Lagos.",
        ogImage: "assets/img/og.svg",
        footerNote: "Oluwasemilore Ademo. ALL RIGHTS RESERVED",
        favicon: "assets/img/favicon.svg"
      },
      hero: {
        eyebrow: "Digital Media & Content Producer", line1: "Oluwa", sparkle: true, line2: "semilore",
        tagline1: "Create for Lagos.", tagline2: "Create for the world.",
        art: "assets/img/hero-art.svg",
        typewriter: ["scroll-stopping graphics", "short-form videos", "social campaigns", "brand stories", "content that converts"]
      },
      identity: { role: "Digital Media & Content Producer", location: "Lagos, Nigeria", avatar: "assets/img/avatar.svg", resumeUrl: "" },
      stats: [
        { value: "150+", label: "Designs delivered" }, { value: "80+", label: "Videos edited" },
        { value: "10+", label: "Brands managed" }, { value: "2M+", label: "Views generated" }
      ],
      about: {
        heading: "About me", subheading: "Where creativity becomes content",
        paragraphs: [
          "I'm Oluwasemilore Ademo — a digital media and content producer from Lagos. I design graphics, shoot and edit videos, and run social media accounts that people actually stop to watch.",
          "My workflow is end-to-end: from the first Canva frame to the final CapCut export, from the content calendar to the analytics review. I care about one thing — making brands impossible to scroll past."
        ],
        image: "assets/img/about-art.svg",
        highlights: ["Graphics that stop the scroll", "Videos from shoot to final cut", "Social accounts that grow"]
      },
      services: [
        { icon: "design", title: "Graphic Design", text: "Logos, social graphics, thumbnails and brand kits — designed in Canva and Figma, built to grab attention." },
        { icon: "video", title: "Video Production", text: "From shooting to the final cut — reels, promos and event videos edited to feel native on every platform." },
        { icon: "social", title: "Social Media Management", text: "Content calendars, posting, community and growth — I run accounts that people actually follow." },
        { icon: "bulb", title: "Content Strategy", text: "Trend-aware content plans that turn ideas into a steady stream of posts your audience loves." }
      ],
      sectionHeadings: {
        projects: { title: "Selected work", subtitle: "Graphics, videos and campaigns I've produced" },
        experience: { title: "Experience", subtitle: "My journey so far" },
        skills: { title: "Skills & tools", subtitle: "What I create with every day" },
        testimonials: { title: "What people say", subtitle: "Kind words from clients and teams" },
        gallery: { title: "Showreel & gallery", subtitle: "Visuals and videos from my work" },
        blog: { title: "Notes", subtitle: "On creating content that works" },
        contact: { title: "Let's create together", subtitle: "Got a story to tell? I'd love to hear it." }
      },
      cta: { heading: "Got a story to tell? Let's make it memorable.", subheading: "I'm open to freelance projects, brand collaborations and full-time content roles.", buttonText: "Let's work together", buttonUrl: "#contact" },
      contact: {
        email: "hello@example.com", phone: "+234 800 000 0000", location: "Lagos, Nigeria",
        availability: "Available for freelance & content roles",
        socials: [
          { platform: "Instagram", url: "https://instagram.com/yourusername" },
          { platform: "TikTok", url: "https://tiktok.com/@yourusername" },
          { platform: "YouTube", url: "https://youtube.com/@yourusername" },
          { platform: "LinkedIn", url: "https://linkedin.com/in/yourusername" }
        ]
      }
    },
    projects: {
      projects: [
        { title: "Lagos Eats — Brand Refresh", category: "Design", tagline: "Full visual identity & social kit", description: "Rebranded a growing food brand: new logo, menu graphics and a full social media template kit.", image: "assets/img/covers/cover-blue.svg", tags: ["Figma", "Canva", "Brand Kit"], demoUrl: "", repoUrl: "", featured: true, year: "2025" },
        { title: "30 Reels in 30 Days", category: "Video", tagline: "Short-form video campaign", description: "Shot, edited and published 30 reels in 30 days for a beauty brand — tripling reach.", image: "assets/img/covers/cover-play.svg", tags: ["CapCut", "Reels", "TikTok"], demoUrl: "", repoUrl: "", featured: true, year: "2025" },
        { title: "Glow Beauty — Launch Campaign", category: "Social", tagline: "Product launch across 3 platforms", description: "Planned and ran the full launch content calendar for a new skincare line.", image: "assets/img/covers/cover-social.svg", tags: ["Instagram", "Content Calendar", "Canva"], demoUrl: "", repoUrl: "", featured: true, year: "2024" },
        { title: "Street Food Festival — Aftermovie", category: "Video", tagline: "Event recap, shot & edited", description: "Filmed and edited the official aftermovie for a 2-day food festival.", image: "assets/img/covers/cover-red.svg", tags: ["Filming", "CapCut", "YouTube"], demoUrl: "", repoUrl: "", featured: false, year: "2024" },
        { title: "Naija Tech Summit — Graphics Kit", category: "Design", tagline: "Event branding & 40+ assets", description: "Designed the complete visual kit for a tech summit — stage screens, badges and a social pack.", image: "assets/img/covers/cover-yellow.svg", tags: ["Figma", "Print", "Social"], demoUrl: "", repoUrl: "", featured: false, year: "2023" },
        { title: "Amaka Wears — Instagram Growth", category: "Social", tagline: "10k to 45k followers in 8 months", description: "Managed content, reels and community for a fashion brand.", image: "assets/img/covers/cover-purple.svg", tags: ["Instagram", "Analytics", "Reels"], demoUrl: "", repoUrl: "", featured: false, year: "2023" }
      ]
    },
    experience: {
      experience: [
        { role: "Digital Media & Content Producer", company: "Freelance & Brand Projects", period: "2022 — Present", current: true, description: "Producing graphics, videos and social content for brands across food, beauty, fashion and events — from concept to publish, shoot to final cut.", tags: ["Canva", "Figma", "CapCut"] }
      ]
    },
    skills: {
      skills: [
        { name: "Canva", category: "Design", level: 95, highlight: true },
        { name: "Figma", category: "Design", level: 85, highlight: true },
        { name: "Branding & Identity", category: "Design", level: 82, highlight: false },
        { name: "Photo Editing", category: "Design", level: 80, highlight: false },
        { name: "CapCut", category: "Video", level: 92, highlight: true },
        { name: "Video Editing", category: "Video", level: 90, highlight: false },
        { name: "Color Grading", category: "Video", level: 78, highlight: false },
        { name: "Motion Graphics", category: "Video", level: 70, highlight: false },
        { name: "Instagram & TikTok", category: "Social", level: 90, highlight: true },
        { name: "Content Planning", category: "Social", level: 88, highlight: false },
        { name: "YouTube", category: "Social", level: 80, highlight: false },
        { name: "Copywriting", category: "Social", level: 75, highlight: false },
        { name: "Trend Research", category: "Strategy", level: 85, highlight: false },
        { name: "Audience Growth", category: "Strategy", level: 82, highlight: false }
      ]
    },
    testimonials: {
      testimonials: [
        { quote: "The graphics Oluwa made for our rebrand got more engagement than anything we'd ever posted. He just gets what makes people stop scrolling.", name: "Adaeze Okafor", role: "Founder, Lagos Eats" },
        { quote: "He delivered 30 reels in 30 days and our reach tripled. The consistency, the speed, the quality — unmatched.", name: "Tunde Bakare", role: "Marketing Lead, Glow Beauty" },
        { quote: "Our event aftermovie looked like a Netflix trailer. Guests kept resharing it for weeks.", name: "Amaka Nwosu", role: "Organizer, Street Food Festival" }
      ]
    },
    gallery: {
      gallery: [
        { image: "assets/img/gallery/shot-1.svg", video: "", caption: "Lagos Eats — brand identity board", category: "Design" },
        { image: "assets/img/gallery/shot-2.svg", video: "", caption: "Instagram grid — Glow Beauty launch", category: "Design" },
        { image: "assets/img/gallery/shot-3.svg", video: "", caption: "30 Reels in 30 Days — storyboard", category: "Video" },
        { image: "assets/img/gallery/shot-4.svg", video: "", caption: "Behind the scenes — festival shoot day", category: "Video" },
        { image: "assets/img/gallery/shot-5.svg", video: "", caption: "Campaign analytics — 30-day report", category: "Social" },
        { image: "assets/img/gallery/shot-6.svg", video: "", caption: "Monthly content calendar", category: "Social" }
      ]
    },
    blog: {
      posts: [
        { title: "How I plan a month of content in one afternoon", date: "2026-09-25", excerpt: "My simple system for turning one brainstorm session into 30 days of posts — without burning out.", cover: "assets/img/covers/cover-social.svg", tags: ["Social", "Strategy"], body: "## Start with one theme\n\nEvery month gets one theme. Everything I post ladders back to it.\n\n## Batch everything\n\n- Write all captions in one sitting\n- Design all graphics in one session\n- Film all reels in one shoot day\n- Schedule in one calendar block\n\n> Consistency beats perfection. Planning beats motivation.\n" },
        { title: "My CapCut workflow: raw footage to finished reel in 2 hours", date: "2026-08-14", excerpt: "The exact steps, presets and shortcuts I use to edit reels fast without them looking fast.", cover: "assets/img/covers/cover-play.svg", tags: ["Video", "CapCut"], body: "## Organise before you edit\n\nRename clips by scene, drop markers on the good takes, and delete everything unusable first.\n\n## Cut to the beat\n\nPick the audio before the visuals. Cut on the drop, hold on the hook.\n\n## Polish in one pass\n\nThree passes max, then export. A reel that's 95% done beats one that never ships.\n" },
        { title: "Designing graphics that stop the scroll", date: "2026-07-02", excerpt: "What I've learned about contrast, hierarchy and hook-first layouts from designing hundreds of social graphics.", cover: "assets/img/covers/cover-blue.svg", tags: ["Design", "Canva"], body: "## The first second decides\n\nYou have about one second in the feed. If the message isn't readable without zooming, the design has failed.\n\n## Contrast is the cheat code\n\nBold type, one accent color, plenty of negative space.\n\n> Pretty is optional. Clear is mandatory.\n" }
      ]
    }
  };

  var data = {};
  var ICON_BY_KEY = { code: "i-code", mobile: "i-mobile", ai: "i-ai", palette: "i-palette", design: "i-palette", video: "i-video", social: "i-social", bulb: "i-bulb" };

  function loadContent() {
    var jobs = Object.keys(FILES).map(function (key) {
      return fetch(FILES[key], { cache: "no-cache" })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (json) { data[key] = json; })
        .catch(function () { data[key] = FALLBACK[key]; });
    });
    return Promise.all(jobs);
  }

  /* ---------------- Helpers ---------------- */
  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function slugify(str) {
    return String(str || "").toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
  }
  /* Normalize root-absolute paths (e.g. /uploads/x.png) to relative so the
     site works at a domain root, under a repo subpath, and from disk. */
  function path(url) {
    var u = String(url || "");
    return u.charAt(0) === "/" ? u.slice(1) : u;
  }
  /* Convert a YouTube / Vimeo watch link into an embeddable iframe URL. */
  function embedSrc(url) {
    var m;
    if ((m = String(url || "").match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/)([\w-]{6,})/i))) {
      return "https://www.youtube-nocookie.com/embed/" + m[1] + "?autoplay=1&rel=0";
    }
    if ((m = String(url || "").match(/vimeo\.com\/(?:video\/)?(\d+)/i))) {
      return "https://player.vimeo.com/video/" + m[1] + "?autoplay=1";
    }
    return null;
  }
  function isDirectVideo(url) {
    return /\.(mp4|webm|m4v|mov)(\?.*)?$/i.test(String(url || ""));
  }
  function icon(name) {
    var id = ICON_BY_KEY[name] || "i-star";
    return '<svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><use href="#' + id + '"></use></svg>';
  }
  function socialIcon(platform) {
    var p = String(platform || "").toLowerCase();
    if (p.indexOf("github") !== -1) return "i-github";
    if (p.indexOf("linked") !== -1) return "i-linkedin";
    if (p.indexOf("x") !== -1 || p.indexOf("twitter") !== -1) return "i-x";
    if (p.indexOf("instagram") !== -1) return "i-instagram";
    if (p.indexOf("mail") !== -1) return "i-mail";
    return "i-external";
  }
  function fmtDate(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    if (isNaN(d.getTime())) return esc(iso);
    return d.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" });
  }
  function secHead(key) {
    var h = (data.settings.sectionHeadings || {})[key] || { title: "", subtitle: "" };
    return '<div class="sec-head"><p class="sec-head__eyebrow">' + esc(data.settings.hero.eyebrow) +
      '</p><h2 class="sec-head__title">' + esc(h.title) + '</h2>' +
      (h.subtitle ? '<p class="sec-head__sub">' + esc(h.subtitle) + '</p>' : "") + "</div>";
  }

  /* ---------------- Section renderers ---------------- */
  function renderHero() {
    var s = data.settings;
    var art = s.hero.art || "";
    var html =
      '<div class="hero">' +
      '<div class="hero__bg" aria-hidden="true">' +
      '<div class="hero__glow"></div><div class="hero__glow hero__glow--b"></div></div>' +
      '<div class="shell hero__grid">' +
      '<div class="hero__content">' +
      '<p class="hero__eyebrow">' + icon("star") + esc(s.hero.eyebrow) + "</p>" +
      '<h1 class="hero__title">' +
      '<span class="hero__title-row"><span>' + esc(s.hero.line1) + "</span>" +
      (s.hero.sparkle
        ? '<svg class="hero__sparkle" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="sparkle-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4285f4"/><stop offset="0.5" stop-color="#34a853"/><stop offset="1" stop-color="#fbbc04"/></linearGradient></defs><path class="sparkle-path" d="M32 2 C36 14 50 18 62 22 C50 26 36 30 32 42 C28 30 14 26 2 22 C14 18 28 14 32 2 Z"/></svg>'
        : "") +
      "<span>" + esc(s.hero.line2) + "</span></span></h1>" +
      '<p class="hero__tagline">' + esc(s.hero.tagline1) + "<br>" + esc(s.hero.tagline2) + "</p>" +
      '<p class="hero__typewriter"><span class="tw-static">I create </span><span data-tw></span><span class="tw-caret" aria-hidden="true"></span></p>' +
      '<div class="hero__actions">' +
      '<a class="btn btn--gradient" href="#work">See my work ' + icon("arrow") + "</a>" +
      '<a class="btn btn--ghost" href="#contact">Get in touch</a>' +
      "</div></div>" +
      '<div class="hero__art reveal">' +
      (art ? '<img src="' + esc(path(art)) + '" alt="" width="600" height="520" fetchpriority="high" />' : "") +
      '<div class="hero__art-ring" aria-hidden="true"></div></div>' +
      "</div></div>";
    $("#hero").innerHTML = html;
    initTypewriter(s.hero.typewriter || []);
  }

  function renderStats() {
    var items = (data.settings.stats || []).map(function (st) {
      return '<div class="stat reveal"><div class="stat__value grad-text">' + esc(st.value) + '</div><div class="stat__label">' + esc(st.label) + "</div></div>";
    }).join("");
    $("#stats").innerHTML = '<div class="stats"><div class="shell"><div class="stats__grid">' + items + "</div></div></div>";
  }

  function renderAbout() {
    var s = data.settings;
    var a = s.about;
    var highlights = (a.highlights || []).map(function (h) { return "<li>" + icon("star") + esc(h) + "</li>"; }).join("");
    $("#about").innerHTML =
      '<div class="section"><div class="shell about__grid">' +
      '<div class="about__art reveal">' +
      (a.image ? '<img src="' + esc(path(a.image)) + '" alt="About ' + esc(s.site.name) + '" width="520" height="420" loading="lazy" />' : "") +
      '<div class="about__art-badge">' +
      (s.identity.avatar ? '<img src="' + esc(path(s.identity.avatar)) + '" alt="" width="40" height="40" style="width:40px;height:40px;border-radius:50%;object-fit:cover" />' : "") +
      esc(s.identity.location) + "</div></div>" +
      '<div class="about__bio">' +
      '<p class="sec-head__eyebrow">' + esc(a.subheading || "About") + "</p>" +
      '<h2 class="sec-head__title">' + esc(a.heading || "About me") + "</h2>" +
      (a.paragraphs || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") +
      '<ul class="about__highlights">' + highlights + "</ul>" +
      "</div></div></div>";
  }

  function renderServices() {
    var cards = (data.settings.services || []).map(function (sv) {
      return '<div class="service-card reveal"><div class="service-card__icon">' + icon(sv.icon) + "</div><h3>" + esc(sv.title) + "</h3><p>" + esc(sv.text) + "</p></div>";
    }).join("");
    $("#services").innerHTML = '<div class="section"><div class="shell"><div class="services__grid">' + cards + "</div></div></div>";
  }

  function renderWork() {
    var projects = (data.projects.projects || []).slice().sort(function (a, b) {
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
    var cats = projects.map(function (p) { return p.category; })
      .filter(function (v, i, arr) { return v && arr.indexOf(v) === i; });

    var chips = cats.map(function (c, i) {
      return '<button type="button" class="chip' + (i === 0 ? " is-active" : "") + '" data-filter="' + esc(slugify(c)) + '" aria-pressed="' + (i === 0) + '">' + esc(c) + "</button>";
    }).join("");

    var cards = projects.map(function (p) {
      var links = "";
      if (p.demoUrl) links += '<a href="' + esc(p.demoUrl) + '" target="_blank" rel="noopener noreferrer">' + icon("external") + "Live demo</a>";
      if (p.repoUrl) links += '<a href="' + esc(p.repoUrl) + '" target="_blank" rel="noopener noreferrer">' + icon("github") + "Code</a>";
      var tags = (p.tags || []).map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("");
      return '<article class="project-card reveal" data-cat="' + esc(slugify(p.category)) + '">' +
        '<div class="project-card__media">' +
        (p.image ? '<img src="' + esc(path(p.image)) + '" alt="' + esc(p.title) + '" width="900" height="600" loading="lazy" />' : "") +
        (p.featured ? '<span class="project-card__year">Featured</span>' : '<span class="project-card__year">' + esc(p.year || "") + "</span>") +
        "</div>" +
        '<div class="project-card__body">' +
        '<span class="project-card__cat grad-text">' + esc(p.category || "") + "</span>" +
        "<h3>" + esc(p.title) + "</h3>" +
        '<p class="project-card__tagline">' + esc(p.tagline || p.description || "") + "</p>" +
        '<div class="project-card__tags">' + tags + "</div>" +
        (links ? '<div class="project-card__links">' + links + "</div>" : "") +
        "</div></article>";
    }).join("");

    $("#work").innerHTML =
      '<div class="section"><div class="shell">' + secHead("projects") +
      '<div class="chips" role="group" aria-label="Filter projects">' + chips + "</div>" +
      '<div class="projects__grid" data-grid>' + cards + "</div></div></div>";
    initProjectFilters();
  }

  function renderExperience() {
    var items = (data.experience.experience || []).map(function (x) {
      var tags = (x.tags || []).map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("");
      return '<div class="tl-item reveal' + (x.current ? " tl-item--current" : "") + '">' +
        '<div class="tl-item__dot" aria-hidden="true"></div>' +
        '<p class="tl-item__period">' + esc(x.period || "") + "</p>" +
        "<h3>" + esc(x.role || "") + (x.current ? '<span class="badge-current">NOW</span>' : "") + "</h3>" +
        '<p class="tl-item__company grad-text">' + esc(x.company || "") + "</p>" +
        (x.description ? "<p>" + esc(x.description) + "</p>" : "") +
        '<div class="tl-item__tags">' + tags + "</div></div>";
    }).join("");
    $("#experience").innerHTML = '<div class="section"><div class="shell"><div class="timeline-sec">' + secHead("experience") + '<div class="timeline">' + items + "</div></div></div></div>";
  }

  function renderSkills() {
    var byCat = {};
    (data.skills.skills || []).forEach(function (sk) {
      var c = sk.category || "Other";
      (byCat[c] = byCat[c] || []).push(sk);
    });
    var cols = Object.keys(byCat).map(function (cat) {
      var skills = byCat[cat].map(function (sk) {
        return '<div class="skill' + (sk.highlight ? " skill--hot" : "") + '">' +
          '<div class="skill__row"><span>' + esc(sk.name) + '</span><span class="skill__pct">' + esc(sk.level) + "%</span></div>" +
          '<div class="skill__bar"><i data-level="' + esc(sk.level) + '"></i></div></div>';
      }).join("");
      return '<div class="skill-cat reveal"><h3>' + esc(cat) + "</h3>" + skills + "</div>";
    }).join("");
    $("#skills").innerHTML = '<div class="section"><div class="shell">' + secHead("skills") + '<div class="skills__grid">' + cols + "</div></div></div>";
    initSkillBars();
  }

  function renderTestimonials() {
    var cards = (data.testimonials.testimonials || []).map(function (t) {
      var initials = String(t.name || "?").split(/\s+/).map(function (w) { return w.charAt(0); }).slice(0, 2).join("").toUpperCase();
      return '<div class="testi-card reveal">' +
        '<svg viewBox="0 0 24 24" class="testi-card__icon" aria-hidden="true"><use href="#i-quote"></use></svg>' +
        "<blockquote>" + esc(t.quote) + "</blockquote>" +
        '<div class="testi-card__who"><div class="testi-card__avatar">' + esc(initials) + "</div>" +
        '<div><div class="testi-card__name">' + esc(t.name) + '</div><div class="testi-card__role">' + esc(t.role) + "</div></div></div></div>";
    }).join("");
    $("#testimonials").innerHTML = '<div class="section section--tight"><div class="shell">' + secHead("testimonials") + '<div class="testi__grid">' + cards + "</div></div></div>";
  }

  function renderGallery() {
    var items = (data.gallery.gallery || []).map(function (g) {
      var isVideo = !!g.video;
      return '<button type="button" class="gallery-item reveal" data-img="' + esc(path(g.image)) + '" data-video="' + esc(path(g.video || "")) + '" data-cap="' + esc(g.caption || "") + '" aria-label="View ' + esc(g.caption || "media") + '">' +
        '<img src="' + esc(path(g.image)) + '" alt="' + esc(g.caption || "Gallery media") + '" width="800" height="600" loading="lazy" />' +
        (isVideo ? '<span class="gallery-item__play" aria-hidden="true"><svg viewBox="0 0 24 24"><use href="#i-play"></use></svg></span>' : "") +
        '<span class="gallery-item__cat">' + esc(g.category || "") + "</span>" +
        '<span class="gallery-item__cap">' + esc(g.caption || "") + "</span></button>";
    }).join("");
    $("#gallery").innerHTML =
      '<div class="section"><div class="shell">' + secHead("gallery") + '<div class="gallery__grid">' + items + "</div></div></div>" +
      '<div class="lightbox" data-lightbox role="dialog" aria-modal="true" aria-label="Media viewer">' +
      '<button class="lightbox__close" type="button" data-lightbox-close aria-label="Close"><svg viewBox="0 0 24 24" width="20" height="20"><use href="#i-close"></use></svg></button>' +
      '<figure><iframe class="lightbox__frame" style="display:none" title="Video player" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowfullscreen></iframe>' +
      '<video class="lightbox__video" controls playsinline preload="metadata" style="display:none"></video>' +
      '<img src="" alt="" />' +
      '<figcaption class="lightbox__cap"></figcaption>' +
      '<a class="lightbox__link btn btn--gradient" style="display:none" target="_blank" rel="noopener noreferrer">Watch video ↗</a></figure></div>';
    initLightbox();
  }

  function renderCta() {
    var c = data.settings.cta || {};
    $("#blog").insertAdjacentHTML("beforebegin",
      '<section class="section section--tight"><div class="shell"><div class="cta-banner reveal">' +
      "<h2>" + esc(c.heading) + "</h2><p>" + esc(c.subheading) + "</p>" +
      '<a class="btn btn--gradient" href="' + esc(c.buttonUrl || "#contact") + '">' + esc(c.buttonText || "Get in touch") + " " + icon("arrow") + "</a>" +
      "</div></div></section>");
  }

  function renderBlogPreview() {
    var posts = (data.blog.posts || []).slice(0, 3);
    var cards = posts.map(function (p) {
      return '<a class="blog-card reveal" href="post.html?slug=' + encodeURIComponent(slugify(p.title)) + '">' +
        '<div class="blog-card__media">' + (p.cover ? '<img src="' + esc(path(p.cover)) + '" alt="" width="900" height="506" loading="lazy" />' : "") + "</div>" +
        '<div class="blog-card__body">' +
        '<div class="blog-card__meta"><span class="grad-text">' + esc(fmtDate(p.date)) + "</span>" + esc((p.tags || [])[0] || "") + "</div>" +
        "<h3>" + esc(p.title) + "</h3>" +
        '<p class="blog-card__excerpt">' + esc(p.excerpt || "") + "</p>" +
        '<span class="blog-card__more">Read more ' + icon("arrow") + "</span>" +
        "</div></a>";
    }).join("");
    $("#blog").innerHTML =
      '<div class="section"><div class="shell">' + secHead("blog") +
      '<div class="blog__grid">' + cards + "</div>" +
      '<div class="blog__all"><a class="btn btn--ghost" href="blog.html">All posts ' + icon("arrow") + "</a></div></div></div>";
  }

  function renderContact() {
    var c = data.settings.contact;
    var socials = (c.socials || []).map(function (soc) {
      return '<a class="social-pill" href="' + esc(soc.url) + '" target="_blank" rel="noopener noreferrer">' +
        '<svg viewBox="0 0 24 24"><use href="#' + socialIcon(soc.platform) + '"></use></svg>' + esc(soc.platform) + "</a>";
    }).join("");
    $("#contact").innerHTML =
      '<div class="section"><div class="shell contact__grid"><div>' + secHead("contact") +
      '<div class="contact__card"><div class="contact__icon">' + icon("mail") + "</div><div><h3>Email</h3><a href=\"mailto:" + esc(c.email) + "\">" + esc(c.email) + "</a></div></div>" +
      '<div class="contact__card"><div class="contact__icon">' + icon("phone") + "</div><div><h3>Phone</h3><p>" + esc(c.phone) + "</p></div></div>" +
      '<div class="contact__card"><div class="contact__icon">' + icon("pin") + "</div><div><h3>Location</h3><p>" + esc(c.location) + "</p></div></div>" +
      '<div class="contact__socials">' + socials + "</div>" +
      "</div>" +
      '<div class="contact__panel reveal"><h3>Start a conversation</h3>' +
      '<p class="contact__avail">' + esc(c.availability || "Open to opportunities") + "</p>" +
      '<p style="color:var(--muted);margin:0 0 20px">Tell me about your project, timeline and budget — I usually reply within 24 hours.</p>' +
      '<a class="contact__mailto" href="mailto:' + esc(c.email) + '">' + icon("mail") + " " + esc(c.email) + "</a>" +
      "</div></div></div>";
  }

  /* ---------------- Chrome (site-wide bits) ---------------- */
  function applyChrome() {
    var s = data.settings.site;
    if (s.title) document.title = s.title;
    if (s.description) {
      var m = $('meta[name="description"]');
      if (m) m.setAttribute("content", s.description);
    }
    if (s.favicon) {
      var fav = $('link[rel="icon"]');
      if (fav) fav.setAttribute("href", path(s.favicon));
    }
    $$("[data-text=name]").forEach(function (el) { el.textContent = s.name || "Name"; });
    $$("[data-text=footerNote]").forEach(function (el) { el.textContent = s.footerNote || ""; });
    var socList = $("[data-socials]");
    if (socList) {
      socList.innerHTML = (data.settings.contact.socials || []).map(function (soc) {
        return '<li><a href="' + esc(soc.url) + '" target="_blank" rel="noopener noreferrer">' +
          '<svg viewBox="0 0 24 24"><use href="#' + socialIcon(soc.platform) + '"></use></svg>' + esc(soc.platform) + "</a></li>";
      }).join("");
    }
  }

  /* ---------------- Interactions ---------------- */
  function initTypewriter(phrases) {
    if (!phrases || !phrases.length) return;
    var target = $("[data-tw]");
    if (!target) return;
    var i = 0, char = 0, deleting = false;
    function tick() {
      var word = phrases[i % phrases.length];
      char += deleting ? -1 : 1;
      target.textContent = word.slice(0, char);
      var delay = deleting ? 36 : 62;
      if (!deleting && char === word.length) { delay = 1900; deleting = true; }
      else if (deleting && char === 0) { deleting = false; i += 1; delay = 350; }
      window.setTimeout(tick, delay);
    }
    tick();
  }

  function initProjectFilters() {
    var chips = $$("[data-filter]");
    var cards = $$("[data-grid] .project-card");
    if (!chips.length || !cards.length) return;
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("is-active"); c.setAttribute("aria-pressed", "false"); });
        chip.classList.add("is-active");
        chip.setAttribute("aria-pressed", "true");
        var f = chip.getAttribute("data-filter");
        cards.forEach(function (card) {
          var show = f === "all" || card.getAttribute("data-cat") === f;
          card.style.display = show ? "" : "none";
        });
      });
    });
  }

  function initSkillBars() {
    var bars = $$("#skills .skill__bar i");
    if (!bars.length) return;
    var done = false;
    var io = new IntersectionObserver(function (entries) {
      if (done || !entries.some(function (e) { return e.isIntersecting; })) return;
      done = true;
      bars.forEach(function (b) {
        var lvl = Math.max(0, Math.min(100, parseInt(b.getAttribute("data-level"), 10) || 0));
        window.setTimeout(function () { b.style.width = lvl + "%"; }, 80);
      });
      io.disconnect();
    }, { threshold: 0.25 });
    io.observe($("#skills"));
  }

  function initLightbox() {
    var box = $("[data-lightbox]");
    if (!box) return;
    var img = box.querySelector("img");
    var vid = box.querySelector("video");
    var frame = box.querySelector("iframe");
    var link = box.querySelector(".lightbox__link");
    var cap = box.querySelector(".lightbox__cap");

    function hideAll() {
      img.style.display = "none";
      vid.style.display = "none";
      frame.style.display = "none";
      link.style.display = "none";
    }

    function open(src, video, caption) {
      cap.textContent = caption || "";
      hideAll();
      if (video) {
        var embed = embedSrc(video);
        if (embed) {
          frame.src = embed;
          frame.style.display = "";
        } else if (isDirectVideo(video)) {
          vid.src = video;
          vid.style.display = "";
        } else {
          // e.g. a Google Drive / TikTok / external link
          img.src = src;
          img.alt = caption || "";
          img.style.display = "";
          link.href = video;
          link.style.display = "inline-flex";
        }
      } else {
        img.src = src;
        img.alt = caption || "";
        img.style.display = "";
      }
      box.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }

    function close() {
      box.classList.remove("is-open");
      document.body.style.overflow = "";
      vid.pause();
      vid.removeAttribute("src");
      frame.removeAttribute("src");
      img.src = "";
      link.removeAttribute("href");
      hideAll();
    }

    $$(".gallery-item").forEach(function (item) {
      item.addEventListener("click", function () { open(item.getAttribute("data-img"), item.getAttribute("data-video"), item.getAttribute("data-cap")); });
    });
    box.querySelector("[data-lightbox-close]").addEventListener("click", close);
    box.addEventListener("click", function (e) { if (e.target === box) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && box.classList.contains("is-open")) close(); });
  }

  function initMobileMenu() {
    var btn = $("[data-menu-btn]");
    var menu = $("[data-mobile-menu]");
    if (!btn || !menu) return;
    function set(open) {
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.hidden = !open;
    }
    btn.addEventListener("click", function () { set(menu.hidden); });
    $$(".mobile-menu a").forEach(function (a) { a.addEventListener("click", function () { set(false); }); });
  }

  function initSpy() {
    var links = $$("[data-spy]");
    if (!links.length) return;
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("data-spy")] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = map[entry.target.id];
        if (link && entry.isIntersecting) {
          links.forEach(function (a) { a.classList.remove("is-active"); });
          link.classList.add("is-active");
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  function initReveal() {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  }

  /* ---------------- Blog / post pages ---------------- */
  function slugFromLocation() {
    var params = new URLSearchParams(window.location.search);
    return (params.get("slug") || "").toLowerCase();
  }

  function renderBlogPage() {
    var grid = $("[data-blog-grid]");
    if (!grid) return;
    var posts = (data.blog.posts || []).slice().sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    $("#blog-count").textContent = posts.length + " posts";
    grid.innerHTML = posts.map(function (p) {
      return '<a class="blog-card reveal is-in" href="post.html?slug=' + encodeURIComponent(slugify(p.title)) + '">' +
        '<div class="blog-card__media">' + (p.cover ? '<img src="' + esc(path(p.cover)) + '" alt="" width="900" height="506" loading="lazy" />' : "") + "</div>" +
        '<div class="blog-card__body">' +
        '<div class="blog-card__meta"><span class="grad-text">' + esc(fmtDate(p.date)) + "</span>" + esc((p.tags || []).join(" · ")) + "</div>" +
        "<h3>" + esc(p.title) + "</h3>" +
        '<p class="blog-card__excerpt">' + esc(p.excerpt || "") + "</p>" +
        '<span class="blog-card__more">Read more ' + icon("arrow") + "</span>" +
        "</div></a>";
    }).join("") || '<p class="post-missing">No posts yet — write your first one in the <a href="/admin/">content dashboard</a>.</p>';
  }

  function markdownToHtml(md) {
    if (window.marked && typeof window.marked.parse === "function") {
      return window.marked.parse(md || "");
    }
    // Minimal fallback if CDN fails
    return String(md || "").split(/\n{2,}/).map(function (block) {
      block = esc(block);
      if (block.indexOf("## ") === 0) return "<h2>" + block.slice(3) + "</h2>";
      if (block.indexOf("# ") === 0) return "<h2>" + block.slice(2) + "</h2>";
      if (block.indexOf("- ") === 0) {
        return "<ul>" + block.split("\n").map(function (li) { return "<li>" + li.replace(/^- /, "") + "</li>"; }).join("") + "</ul>";
      }
      if (block.indexOf("> ") === 0) return "<blockquote>" + block.replace(/^> /, "") + "</blockquote>";
      return "<p>" + block + "</p>";
    }).join("");
  }

  function renderPostPage() {
    var holder = $("[data-post-content]");
    if (!holder) return;
    var slug = slugFromLocation();
    var post = (data.blog.posts || []).filter(function (p) { return slugify(p.title) === slug; })[0];
    if (!post) {
      holder.innerHTML = '<div class="post-missing"><h1>Post not found</h1><p>It may have been renamed or removed.</p><a class="btn btn--gradient" href="blog.html">All posts</a></div>';
      return;
    }
    document.title = post.title + " — Oluwasemilore Ademo";
    holder.innerHTML =
      (post.cover ? '<img class="post__cover" src="' + esc(path(post.cover)) + '" alt="" width="900" height="506" />' : "") +
      "<h1 class=\"post__title\">" + esc(post.title) + "</h1>" +
      '<p class="post__meta"><span>' + esc(fmtDate(post.date)) + "</span>" + (post.tags || []).map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + "</p>" +
      '<div class="post__body">' + markdownToHtml(post.body) + "</div>";
  }

  /* ---------------- Boot ---------------- */
  function boot() {
    loadContent().then(function () {
      applyChrome();
      var page = document.body.dataset.page || "home";

      if ($("[data-post-content]")) {
        renderPostPage();
        initMobileMenu();
        return;
      }
      if ($("[data-blog-grid]")) {
        renderBlogPage();
        initMobileMenu();
        return;
      }

      renderHero();
      renderStats();
      renderAbout();
      renderServices();
      renderWork();
      renderExperience();
      renderSkills();
      renderTestimonials();
      renderGallery();
      renderCta();
      renderBlogPreview();
      renderContact();
      initMobileMenu();
      initSpy();
      initReveal();
    }).catch(function (err) {
      console.error("Failed to load content", err);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
