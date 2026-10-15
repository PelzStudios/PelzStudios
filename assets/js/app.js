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
        name: "Pelz Studios",
        title: "Pelz Studios — Digital Media & Content Studio",
        description: "Pelz Studios — a digital media & content studio creating scroll-stopping graphics, videos and social content.",
        ogImage: "assets/img/og.svg",
        footerNote: "Pelz Studios. ALL RIGHTS RESERVED",
        favicon: "assets/img/favicon.svg"
      },
      hero: {
        eyebrow: "Digital Media & Content Studio", line1: "Pelumi", sparkle: true, line2: "Ademo",
        tagline1: "I make cool things.", tagline2: "",
        art: "assets/img/hero-art.svg",
        typewriter: ["scroll-stopping graphics", "short-form videos", "social campaigns", "brand stories", "content that converts"]
      },
      identity: { role: "Digital Media & Content Producer", location: "", avatar: "assets/img/headshot.jpeg", resumeUrl: "" },
      stats: [
        { value: "150+", label: "Designs delivered" }, { value: "80+", label: "Videos edited" },
        { value: "10+", label: "Brands managed" }, { value: "2M+", label: "Views generated" }
      ],
      about: {
        heading: "About me", subheading: "Where creativity becomes content",
        paragraphs: [
          "I'm Oluwasemilore Ademo — a digital media and content producer. I design graphics, shoot and edit videos, and run social media accounts that people actually stop to watch.",
          "My workflow is end-to-end: from the first Canva frame to the final CapCut export, from the content calendar to the analytics review. I care about one thing — making brands impossible to scroll past."
        ],
        image: "assets/img/headshot.jpeg",
        highlights: ["Graphics that stop the scroll", "Videos from shoot to final cut", "Social accounts that grow"]
      },
      services: [
        { icon: "design", title: "Graphic Design", text: "Logos, social graphics, thumbnails and brand kits — designed in Canva and Figma, built to grab attention." },
        { icon: "video", title: "Video Production", text: "From shooting to the final cut — reels, promos and event videos edited to feel native on every platform." },
        { icon: "social", title: "Social Media Management", text: "Content calendars, posting, community and growth — I run accounts that people actually follow." },
        { icon: "bulb", title: "Content Strategy", text: "Trend-aware content plans that turn ideas into a steady stream of posts your audience loves." }
      ],
      sectionHeadings: {
        showcase: { title: "Showcase", subtitle: "My graphics and videos — filter to explore" },
        experience: { title: "Experience", subtitle: "My journey so far" },
        skills: { title: "Skills & tools", subtitle: "What I create with every day" },
        contact: { title: "Let's create together", subtitle: "Got a story to tell? I'd love to hear it." }
      },
      cta: { heading: "Got a story to tell? Let's make it memorable.", subheading: "I'm open to freelance projects, brand collaborations and full-time content roles.", buttonText: "Let's work together", buttonUrl: "#contact" },
      contact: {
        email: "hello@example.com", phone: "+234 800 000 0000", location: "",
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
        { title: "Karaoke Night", category: "Design", tagline: "Event flyer — neon club night", description: "Event flyer for a karaoke night: neon typography, disco glow and venue details laid out for Instagram and print.", image: "KARAOKE.png", tags: ["Flyer", "Neon", "Canva"], demoUrl: "", repoUrl: "", featured: true, year: "2026" },
        { title: "GAME ON", category: "Design", tagline: "Gaming hub event poster", description: "High-energy poster for a gaming hub — 3D character, game lineup and 'why us' panels in one bold layout.", image: "Game.png", tags: ["Poster", "Gaming", "Branding"], demoUrl: "", repoUrl: "", featured: true, year: "2026" },
        { title: "PELZ'S Apparel — 50% OFF", category: "Design", tagline: "Sale promo for the studio's apparel brand", description: "Promo design for Pelz's Apparel: sneaker showcase, 50% badge and a clear ORDER NOW call-to-action.", image: "50%20OFF%20(1).png", tags: ["Promo", "E-commerce", "Canva"], demoUrl: "", repoUrl: "", featured: true, year: "2026" },
        { title: "Campus Fest 1.0", category: "Design", tagline: "Campus event poster", description: "Poster for Campus Fest 1.0 — bunting, brush lettering and a full activity line-up for the launch edition.", image: "campus%20fest.png", tags: ["Event", "Poster", "Print"], demoUrl: "", repoUrl: "", featured: false, year: "2026" },
        { title: "Bi-Weekly Report", category: "Social", tagline: "Community report graphic", description: "Report graphic for Community Innovation Hub — activity stats, photo collage and a clean call-to-action.", image: "Screenshot%202026-09-30%20163446.png", tags: ["Infographic", "Social", "Branding"], demoUrl: "", repoUrl: "", featured: false, year: "2026" },
        { title: "World Reboot", category: "Design", tagline: "Game title artwork", description: "Coming-soon game artwork — tribal fantasy characters, gold borders and a cinematic title treatment.", image: "Game%20(1).png", tags: ["Game Art", "Poster", "3D"], demoUrl: "", repoUrl: "", featured: false, year: "2026" }
      ]
    },
    experience: {
      experience: [
        { role: "Marketing & Media — ALU Alive Committee", company: "African Leadership College of Higher Education", period: "Aug 2026 — Present", current: true, description: "Leading marketing and media coverage for campus events — capturing pictures and videos, editing coverage, and producing promotional video content for ALU Alive.", tags: ["Marketing", "Video Editing", "Event Coverage"] },
        { role: "Marketing Lead — Hult Prize at ALCHE", company: "Hult Prize on Campus", period: "2026", current: false, description: "Leading marketing for the Hult Prize on-campus program at ALCHE — creating content, driving sign-ups and covering competition events.", tags: ["Marketing", "Content Creation", "Event Coverage"] },
        { role: "Social Media & Marketing Lead", company: "NASA Space Apps Challenge — Mauritius 2026", period: "2026", current: false, description: "Led social media and marketing for the NASA Space Apps Challenge in Mauritius 2026 — the first event of its kind in the country, handling campaigns, content and coverage end-to-end.", tags: ["Social Media", "Campaigns", "Content Strategy"] },
        { role: "Media Team Member", company: "Community Innovation Hub — Lagos, Nigeria", period: "Jan 2024 — Mar 2026", current: false, description: "Covered every hub activity in pictures and videos, and created content for events like Tech Fest and Sexual Awareness Day. Managed the hub's Instagram, TikTok and YouTube accounts, significantly growing engagement.", tags: ["Social Media", "Content Creation", "Photography"] },
        { role: "Media Team Head", company: "RCCG City of Light Teens Church", period: "2024 — 2025", current: false, description: "Led the coverage and marketing of two annual programs, WPC '24 and WPC '25 — producing graphics, countdowns, marketing content, event coverage and edits end-to-end.", tags: ["Graphic Design", "Event Coverage", "Video Editing"] }
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
        { quote: "The graphics Oluwa made for our rebrand got more engagement than anything we'd ever posted. He just gets what makes people stop scrolling.", name: "Adaeze Okafor", role: "Founder, EatsCo" },
        { quote: "He delivered 30 reels in 30 days and our reach tripled. The consistency, the speed, the quality — unmatched.", name: "Tunde Bakare", role: "Marketing Lead, Glow Beauty" },
        { quote: "Our event aftermovie looked like a Netflix trailer. Guests kept resharing it for weeks.", name: "Amaka Nwosu", role: "Organizer, Street Food Festival" }
      ]
    },
    gallery: {
      gallery: [
        { image: "KARAOKE.png", video: "", caption: "Karaoke Night — event flyer", category: "Design" },
        { image: "Game.png", video: "", caption: "GAME ON — gaming event poster", category: "Design" },
        { image: "50% OFF (1).png", video: "", caption: "PELZ'S Apparel — sale promo", category: "Design" },
        { image: "campus fest.png", video: "", caption: "Campus Fest 1.0 — event poster", category: "Design" },
        { image: "evaluation (2).png", video: "", caption: "Monthly Evaluation — TicTechyHub", category: "Design" },
        { image: "Add a heading (1).png", video: "", caption: "Back to School — campaign graphic", category: "Design" },
        { image: "Canter 3d (1).png", video: "", caption: "Domino's Mega Promo — 3D banner", category: "Design" },
        { image: "KARAOKE (1).png", video: "", caption: "We Are Back — food promo", category: "Design" },
        { image: "Game (1).png", video: "", caption: "World Reboot — game title art", category: "Design" },
        { image: "Screenshot 2026-09-30 163352.png", video: "", caption: "Evaluation & Game Day — CIH flyer", category: "Design" },
        { image: "Screenshot 2026-09-30 163446.png", video: "", caption: "Bi-Weekly Report — CIH", category: "Social" },
        { image: "Screenshot 2026-09-30 164052.png", video: "", caption: "Dream Vacation — travel banner", category: "Design" },
        { image: "Screenshot 2026-09-30 164133.png", video: "", caption: "FIRE Conference 2025 — event flyer", category: "Design" },
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
    if ((m = String(url || "").match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/file\/d\/)([\w-]{20,})/i))) {
      return "https://drive.google.com/file/d/" + m[1] + "/preview";
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
    var services = (s.services || []).map(function (sv) { return esc(sv.title); });
    var names = services.length ? services : ["Graphic Design", "Video Production", "Social Media", "Content Strategy"];
    var marquee = names.concat(names).map(function (t) {
      return '<span class="hero__marquee-item">' + t + ' <svg class="hero__marquee-star" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-star"></use></svg></span>';
    }).join("");
    var html =
      '<div class="hero">' +
      '<div class="hero__bg" aria-hidden="true">' +
      '<div class="hero__aurora hero__aurora--a"></div>' +
      '<div class="hero__aurora hero__aurora--b"></div>' +
      '<div class="hero__aurora hero__aurora--c"></div>' +
      '<div class="hero__grid-lines"></div>' +
      '<div class="hero__noise"></div></div>' +
      '<div class="shell hero__grid">' +
      '<div class="hero__content">' +
      '<h1 class="hero__title">' +
      '<span class="hero__title-row"><span class="hero__title-solid">' + esc(s.hero.line1) + "</span>" +
      (s.hero.sparkle
        ? '<svg class="hero__sparkle" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="sparkle-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff3860"/><stop offset="0.5" stop-color="#a855f7"/><stop offset="1" stop-color="#3d7bff"/></linearGradient></defs><path class="sparkle-path" d="M32 2 C36 14 50 18 62 22 C50 26 36 30 32 42 C28 30 14 26 2 22 C14 18 28 14 32 2 Z"/></svg>'
        : "") +
      '<span class="hero__title-outline">' + esc(s.hero.line2) + "</span></span></h1>" +
      '<p class="hero__accent">' + (s.hero.tagline2 ? esc(s.hero.tagline1) + " <em>" + esc(s.hero.tagline2) + "</em>" : "<em>" + esc(s.hero.tagline1) + "</em>") + "</p>" +
      '<p class="hero__typewriter"><span class="tw-static">I create </span><span data-tw></span><span class="tw-caret" aria-hidden="true"></span></p>' +
      '<div class="hero__actions">' +
      '<a class="btn btn--gradient" href="#showcase">See my work ' + icon("arrow") + "</a>" +
      "</div></div>" +
      '<div class="hero__collage" aria-hidden="true">' +
      '<div class="hero__ring"></div>' +
      '<div class="hero__dashed"></div>' +
      '<div class="hero__photo">' +
      '<img src="assets/img/headshot.jpeg" alt="" width="420" height="520" fetchpriority="high" />' +
      '<div class="hero__photo-badge">' + esc(s.identity.role || "Digital Media & Content Producer") + "</div></div>" +
      '<div class="hero__chip hero__chip--video">' +
      '<img src="https://drive.google.com/thumbnail?id=1LJ6fPsNpxaYJWvGyIre1MUAsgW2pdyit&amp;sz=w1000" alt="" width="190" height="240" loading="lazy" onerror="this.onerror=null;this.src=\'assets/img/media-fallback.svg\'" />' +
      '<span class="hero__chip-play"><svg viewBox="0 0 24 24"><use href="#i-play"></use></svg></span>' +
      '<span class="hero__chip-label">80+ videos edited</span></div>' +
      '<div class="hero__chip hero__chip--design">' +
      '<img src="KARAOKE.png" alt="" width="200" height="150" loading="lazy" />' +
      '<span class="hero__chip-label">150+ designs delivered</span></div>' +
      "</div></div>" +
      '<div class="hero__marquee" aria-hidden="true"><div class="hero__marquee-track">' + marquee + "</div></div>" +
      "</div>";
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
      esc(s.identity.role || "") + "</div></div>" +
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

  function renderShowcase() {
    var items = (data.gallery.gallery || []).map(function (g) {
      var isVideo = !!g.video;
      var filter = isVideo ? "videos" : "graphics";
      var cat = isVideo ? "Video" : (g.category || "Graphic");
      return '<button type="button" class="gallery-item reveal" data-filter="' + filter + '" data-img="' + esc(path(g.image)) + '" data-video="' + esc(path(g.video || "")) + '" data-aspect="' + esc(g.aspect || "16-9") + '" data-cap="' + esc(g.caption || "") + '" aria-label="View ' + esc(g.caption || "media") + '">' +
        '<img src="' + esc(path(g.image)) + '" alt="' + esc(g.caption || "Gallery media") + '" width="800" height="600" loading="lazy" onerror="this.onerror=null;this.src=\'assets/img/media-fallback.svg\'" />' +
        (isVideo ? '<span class="gallery-item__play" aria-hidden="true"><svg viewBox="0 0 24 24"><use href="#i-play"></use></svg></span>' : "") +
        '<span class="gallery-item__cat">' + esc(cat) + "</span>" +
        '<span class="gallery-item__cap">' + esc(g.caption || "") + "</span></button>";
    }).join("");
    $("#showcase").innerHTML =
      '<div class="section"><div class="shell">' + secHead("showcase") +
      '<div class="chips" role="group" aria-label="Filter showcase">' +
      '<button type="button" class="chip is-active" data-filter="all" aria-pressed="true">All</button>' +
      '<button type="button" class="chip" data-filter="graphics" aria-pressed="false">Graphics</button>' +
      '<button type="button" class="chip" data-filter="videos" aria-pressed="false">Videos</button>' +
      "</div>" +
      '<div class="gallery__grid">' + items + "</div></div></div>" +
      '<div class="lightbox" data-lightbox role="dialog" aria-modal="true" aria-label="Media viewer">' +
      '<button class="lightbox__close" type="button" data-lightbox-close aria-label="Close"><svg viewBox="0 0 24 24" width="20" height="20"><use href="#i-close"></use></svg></button>' +
      '<figure><iframe class="lightbox__frame" style="display:none" title="Video player" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowfullscreen></iframe>' +
      '<video class="lightbox__video" controls playsinline preload="metadata" style="display:none"></video>' +
      '<img src="" alt="" />' +
      '<figcaption class="lightbox__cap"></figcaption>' +
      '<a class="lightbox__link btn btn--gradient" style="display:none" target="_blank" rel="noopener noreferrer">Watch video ↗</a></figure></div>';
    initLightbox();
    initShowcaseFilters();
  }

  function renderCta() {
    var c = data.settings.cta || {};
    $("#contact").insertAdjacentHTML("beforebegin",
      '<section class="section section--tight"><div class="shell"><div class="cta-banner reveal">' +
      "<h2>" + esc(c.heading) + "</h2><p>" + esc(c.subheading) + "</p>" +
      '<a class="btn btn--gradient" href="' + esc(c.buttonUrl || "#contact") + '">' + esc(c.buttonText || "Get in touch") + " " + icon("arrow") + "</a>" +
      "</div></div></section>");
  }

  function renderContact() {
    var c = data.settings.contact;
    var socials = (c.socials || []).map(function (soc) {
      return '<a class="social-pill" href="' + esc(soc.url) + '" target="_blank" rel="noopener noreferrer">' +
        '<svg viewBox="0 0 24 24"><use href="#' + socialIcon(soc.platform) + '"></use></svg>' + esc(soc.platform) + "</a>";
    }).join("");
    $("#contact").innerHTML =
      '<div class="section"><div class="shell contact__grid"><div>' + secHead("contact") +
      '<div class="contact__socials">' + socials + "</div>" +
      "</div>" +
      '<div class="contact__panel reveal"><h3>Let\'s connect</h3>' +
      '<p class="contact__avail">' + esc(c.availability || "Open to opportunities") + "</p>" +
      '<p style="color:var(--muted);margin:0">Reach me on any of these platforms — I usually reply within 24 hours.</p>' +
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

  function initShowcaseFilters() {
    var chips = $$("#showcase .chip");
    var items = $$("#showcase .gallery-item");
    if (!chips.length || !items.length) return;
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("is-active"); c.setAttribute("aria-pressed", "false"); });
        chip.classList.add("is-active");
        chip.setAttribute("aria-pressed", "true");
        var f = chip.getAttribute("data-filter");
        items.forEach(function (item) {
          item.style.display = f === "all" || item.getAttribute("data-filter") === f ? "" : "none";
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

    function open(src, video, caption, aspect) {
      cap.textContent = caption || "";
      hideAll();
      if (video) {
        var embed = embedSrc(video);
        if (embed) {
          frame.src = embed;
          frame.className = "lightbox__frame" + (aspect === "9-16" ? " lightbox__frame--9x16" : "");
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
      frame.className = "lightbox__frame";
      img.src = "";
      link.removeAttribute("href");
      hideAll();
    }

    $$(".gallery-item").forEach(function (item) {
      item.addEventListener("click", function () { open(item.getAttribute("data-img"), item.getAttribute("data-video"), item.getAttribute("data-cap"), item.getAttribute("data-aspect")); });
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
    document.title = post.title + " — Pelz Studios";
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
      renderShowcase();
      renderExperience();
      renderSkills();
      renderCta();
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
