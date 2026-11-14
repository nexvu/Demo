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

  // Business hours. Closing time is from the Google listing.
  // Fill in "opens" (e.g. "10:00 am") and "days" (e.g. "Monday to Sunday")
  // once confirmed; while they are empty the page says "Open until 8:30 pm".
  hours: {
    days: "",
    opens: "",
    closes: "8:30 pm"
  },

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

  // Bridal package prices, shown in the "Bridal packages" section.
  // Replace "₹ —" with the real price, e.g. "₹ 15,000" or "From ₹ 15,000".
  bridalPrices: {
    engagement: "₹ —",
    bridal: "₹ —",
    prebridal: "₹ —"
  }
};

/* ---------- Helpers ---------- */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const desktop = window.matchMedia("(min-width: 60rem)");
const telHref = (number) => "tel:" + number.replace(/[^\d+]/g, "");

function hoursText() {
  const { days, opens, closes } = SITE.hours;
  if (!closes) return "";
  const time = opens ? `${opens} to ${closes}` : `Open until ${closes}`;
  return days ? `${days}, ${opens ? time : time.toLowerCase()}` : time;
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
    const price = SITE.bridalPrices[el.dataset.price];
    if (price) el.textContent = price;
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

  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Highlight the section currently in view
  const sections = links.map((link) => $(link.getAttribute("href"))).filter(Boolean);
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          const current = link.getAttribute("href") === "#" + entry.target.id;
          if (current) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((section) => observer.observe(section));
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
