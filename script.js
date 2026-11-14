/* ==========================================================================
   Meera's – The Beauty Saga — design concept

   EDIT HERE: every business detail lives in SITE below. Change a value and
   it updates everywhere on the page (header, contact, footer, bottom bar).
   ========================================================================== */
const SITE = {
  // Phone numbers as they should be displayed.
  phone: "+91 70009 01183",    // primary; also used by the "Call" button
  phoneAlt: "+91 98269 10703", // second number; leave "" to hide it

  // WhatsApp number in international format, digits only.
  // If left empty, WhatsApp buttons show a notice instead of opening a chat.
  whatsapp: "917000901183",

  // Opening lines of the WhatsApp messages.
  whatsappGreeting: "Hello Meera's – The Beauty Saga, I'd like to enquire about an appointment.",
  bookingGreeting: "Hello Meera's – The Beauty Saga, I'd like to book an appointment.",
  coursesGreeting: "Hello Meera's – The Beauty Saga, I'd like to know more about your academy courses.",

  // Address, one array item per line.
  address: [
    "630, Narendra Tiwari Marg, Sector D,",
    "Sudama Nagar, Indore,",
    "Madhya Pradesh 452001"
  ],

  // Business hours, in 24-hour "HH:MM". Closing time is from the Google listing.
  // While "open" is empty the page says "Daily · closes 8:30 pm".
  // Fill it in (e.g. "10:00") and it becomes "Daily · 10:00 am – 8:30 pm".
  hours: { open: "", close: "20:30" },

  // Google rating, review count and the link to the Google listing.
  rating: {
    value: "5.0",
    count: "870+",
    reviewsUrl: "https://g.co/kgs/CBFCUQE"
  },

  // Link used by "Open the Google listing for directions".
  mapsUrl: "https://g.co/kgs/CBFCUQE",

  instagram: {
    handle: "@meerasthebeautysaga",
    url: "https://www.instagram.com/meerasthebeautysaga"
  },

  // Bridal package starting prices, in rupees, numbers only (e.g. 15000).
  // While a price is empty the card says "Price on request";
  // once set it says "From ₹15,000".
  bridalPrices: {
    engagement: "",
    bridal: "",
    prebridal: ""
  }
};

/* ---------- Helpers ---------- */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const desktop = window.matchMedia("(min-width: 60rem)");
const telHref = (number) => "tel:" + number.replace(/[^\d+]/g, "");

// "20:30" -> "8:30 pm"
function formatTime(value) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(String(value).trim());
  if (!match) return String(value).trim(); // already written out, e.g. "8:30 pm"
  const hour = Number(match[1]);
  return `${hour % 12 || 12}:${match[2]} ${hour < 12 ? "am" : "pm"}`;
}

function hoursText() {
  const { open, close } = SITE.hours;
  if (!close) return "";
  return open
    ? `Daily · ${formatTime(open)} – ${formatTime(close)}`
    : `Daily · closes ${formatTime(close)}`;
}

// 15000 -> "From ₹15,000"; empty -> "Price on request"
function priceText(value) {
  const digits = String(value == null ? "" : value).replace(/[^\d]/g, "");
  if (!digits) return "Price on request";
  return "From ₹" + Number(digits).toLocaleString("en-IN");
}

/* ---------- Apply SITE details to the page ---------- */
function applySiteDetails() {
  $$("[data-phone]").forEach((link) => {
    const number = link.dataset.phone === "alt" ? SITE.phoneAlt : SITE.phone;
    if (!number) {
      (link.closest("p") || link).hidden = true;
      return;
    }
    link.href = telHref(number);
    link.textContent = number;
  });
  $$("[data-phone-link]").forEach((link) => {
    if (SITE.phone) link.href = telHref(SITE.phone);
  });

  if (SITE.address.length) {
    $$("[data-address]").forEach((el) => {
      el.replaceChildren();
      SITE.address.forEach((line, i) => {
        if (i) el.append(document.createElement("br"));
        el.append(line);
      });
    });
  }

  const hours = hoursText();
  if (hours) $$("[data-hours]").forEach((el) => { el.textContent = hours; });

  $$("[data-rating-value]").forEach((el) => { el.textContent = SITE.rating.value; });
  $$("[data-rating-count]").forEach((el) => { el.textContent = SITE.rating.count; });
  if (SITE.rating.reviewsUrl) $$("[data-reviews-link]").forEach((el) => { el.href = SITE.rating.reviewsUrl; });
  if (SITE.mapsUrl) $$("[data-maps-link]").forEach((el) => { el.href = SITE.mapsUrl; });

  $$("[data-instagram-link]").forEach((el) => { el.href = SITE.instagram.url; });
  $$("[data-instagram-handle]").forEach((el) => { el.textContent = SITE.instagram.handle; });

  $$("[data-price]").forEach((el) => {
    el.textContent = priceText(SITE.bridalPrices[el.dataset.price]);
  });
}

/* ---------- Header and navigation ---------- */
function initNavigation() {
  const header = $(".site-header");
  const toggle = $(".menu-toggle");
  const nav = $("#site-nav");
  const links = $$(".site-nav__list a");

  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.documentElement.classList.toggle("menu-open", open);
  };

  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      toggle.focus();
    }
  });
  desktop.addEventListener("change", () => setMenu(false));

  // Highlight the nav link of the section crossing the middle of the screen.
  // Every section is watched, so one without a nav link (hero, Instagram, FAQ)
  // clears the highlight instead of leaving the previous link lit.
  const setCurrent = (id) => {
    links.forEach((link) => {
      if (id && link.getAttribute("href") === "#" + id) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };
  const sections = $$("main > section[id]");
  const lastSection = sections[sections.length - 1];
  const atPageEnd = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

  const observer = new IntersectionObserver(
    (entries) => {
      if (atPageEnd()) return; // handled in onScroll below
      entries.forEach((entry) => {
        if (entry.isIntersecting) setCurrent(entry.target.id);
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((section) => observer.observe(section));

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
    // At the very bottom the footer fills the screen: keep the last section (Contact) lit
    if (atPageEnd() && window.scrollY > 0) setCurrent(lastSection.id);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------- Services: swap the large image as each category is explored ---------- */
function initServices() {
  const items = $$(".service");
  const stageImages = $$(".services__stage img");

  const activate = (item) => {
    items.forEach((el) => el.classList.toggle("is-active", el === item));
    stageImages.forEach((img) => img.classList.toggle("is-active", img.dataset.stage === item.dataset.service));
  };

  items.forEach((item) => {
    item.addEventListener("mouseenter", () => activate(item));
    item.addEventListener("focusin", () => activate(item));
  });

  // While scrolling on desktop, follow whichever category sits mid-screen
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => entry.isIntersecting && activate(entry.target)),
    { rootMargin: "-45% 0px -45% 0px" }
  );
  items.forEach((item) => observer.observe(item));

  // "Enquire about ..." links pre-fill the booking form.
  // data-enquire selects the service; data-enquire-note adds a line to the message.
  $$("[data-enquire]").forEach((link) => {
    link.addEventListener("click", () => {
      $("#f-service").value = link.dataset.enquire;
      const note = link.dataset.enquireNote;
      const message = $("#f-message");
      if (note && (!message.value.trim() || message.value.startsWith("Package: "))) message.value = note;
    });
  });
}

/* ---------- Gallery: filters and lightbox ---------- */
function initGallery() {
  const filters = $$(".filter");
  const items = $$("#gallery-grid li");
  const lightbox = $("#lightbox");
  const image = $("#lightbox-img");
  const caption = $("#lightbox-caption");
  const count = $("#lightbox-count");
  let visible = items;
  let index = 0;

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter;
      filters.forEach((el) => {
        const active = el === button;
        el.classList.toggle("is-active", active);
        el.setAttribute("aria-pressed", String(active));
      });
      items.forEach((item) => {
        item.hidden = category !== "all" && item.dataset.category !== category;
      });
      visible = items.filter((item) => !item.hidden);
    });
  });

  const show = (next) => {
    index = (next + visible.length) % visible.length;
    const source = $("img", visible[index]);
    image.src = source.currentSrc || source.src;
    image.alt = source.alt;
    caption.textContent = source.alt;
    count.textContent = `${index + 1} / ${visible.length}`;
  };

  items.forEach((item) => {
    $(".tile", item).addEventListener("click", () => {
      show(visible.indexOf(item));
      lightbox.showModal();
    });
  });

  $("[data-lightbox-close]").addEventListener("click", () => lightbox.close());
  $("[data-lightbox-prev]").addEventListener("click", () => show(index - 1));
  $("[data-lightbox-next]").addEventListener("click", () => show(index + 1));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close(); // click on the backdrop
  });
  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") show(index - 1);
    if (event.key === "ArrowRight") show(index + 1);
  });
  lightbox.addEventListener("close", () => {
    const tile = visible[index] && $(".tile", visible[index]);
    if (tile) tile.focus();
  });
}

/* ---------- FAQ accordion ---------- */
function initFaq() {
  $$(".faq__q").forEach((button) => {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    panel.hidden = true; // answers stay readable if JavaScript never runs
    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(open));
      panel.hidden = !open;
    });
  });
}

/* ---------- WhatsApp enquiries ---------- */
const whatsappUrl = (message) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;

function showNotice(message) {
  // No number set: show what would be sent instead of opening a broken chat
  $("#notice-message").textContent = message;
  $("#notice").showModal();
}

function initEnquiries() {
  // Plain WhatsApp links: data-whatsapp="courses" uses the academy greeting
  $$("[data-whatsapp]").forEach((link) => {
    const message = link.dataset.whatsapp === "courses" ? SITE.coursesGreeting : SITE.whatsappGreeting;
    if (SITE.whatsapp) {
      link.href = whatsappUrl(message);
      return;
    }
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showNotice(message);
    });
  });

  const form = $("#enquiry");
  const required = [$("#f-name"), $("#f-date")];

  const validate = (field) => {
    const error = $("#" + field.id + "-error");
    const valid = field.value.trim() !== "";
    error.hidden = valid;
    if (valid) {
      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-describedby");
    } else {
      field.setAttribute("aria-invalid", "true");
      field.setAttribute("aria-describedby", error.id);
    }
    return valid;
  };
  required.forEach((field) => {
    field.addEventListener("input", () => {
      if (field.hasAttribute("aria-invalid")) validate(field);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const invalid = required.filter((field) => !validate(field));
    if (invalid.length) {
      invalid[0].focus();
      return;
    }
    const data = new FormData(form);
    const date = new Date(data.get("date") + "T00:00:00");
    const lines = [
      SITE.bookingGreeting,
      "",
      "Name: " + data.get("name").trim(),
      "Service: " + (data.get("service") || "Not sure yet"),
      "Where: " + data.get("place"),
      "Date: " + date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
      "Time: " + (data.get("time") || "Any time")
    ];
    if (data.get("message").trim()) lines.push("Note: " + data.get("message").trim());
    lines.push("", "Please confirm if this slot is available.");
    const message = lines.join("\n");

    if (SITE.whatsapp) window.open(whatsappUrl(message), "_blank", "noopener");
    else showNotice(message);
  });

  // Appointments can't be requested for a past date
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  $("#f-date").min = today.toISOString().slice(0, 10);
}

/* ---------- Quiet reveal for a few images ---------- */
function initReveal() {
  const targets = $$("[data-reveal]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px" }
  );
  targets.forEach((target) => observer.observe(target));
}

applySiteDetails();
initNavigation();
initServices();
initGallery();
initFaq();
initEnquiries();
initReveal();
