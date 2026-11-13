/* ==========================================================================
   Meera's-The Beauty Saga — design concept

   EDIT HERE: every unverified business detail lives in SITE below.
   Leave a value empty ("") to keep showing its placeholder on the page.
   ========================================================================== */
const SITE = {
  // Phone number as it should be displayed, e.g. "+91 98765 43210".
  phone: "+91 98269 10703",

  // WhatsApp number in international format, digits only, e.g. "919876543210".
  // While empty, WhatsApp buttons show a demo notice instead of opening a chat.
  whatsapp: "919826910703",

  // Opening line of every WhatsApp enquiry.
  whatsappGreeting: "Hello Meera's-The Beauty Saga, I'd like to enquire about an appointment.",

  // Opening line of an appointment request sent from the form.
  bookingGreeting: "Hello Meera's-The Beauty Saga, I'd like to book an appointment.",

  // Business hours, e.g. [{ days: "Monday to Saturday", time: "10:00 am to 8:00 pm" }].
  // Leave the array empty until the owner confirms them.
  hours: [],

  // Google rating. Set verified to true once it has been checked against the
  // salon's Google Business Profile; the "to be confirmed" note then disappears.
  rating: {
    value: "5.0",
    verified: false,
    reviewsUrl: "" // direct link to the Google reviews page, when available
  },

  // Direct Google Maps link to the salon, when available.
  mapsUrl: ""
};

/* ---------- Helpers ---------- */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const desktop = window.matchMedia("(min-width: 60rem)");

/* ---------- Apply SITE details to the page ---------- */
function applySiteDetails() {
  if (SITE.phone) {
    const link = document.createElement("a");
    link.className = "text-link";
    link.href = "tel:" + SITE.phone.replace(/[^\d+]/g, "");
    link.textContent = SITE.phone;
    $("[data-phone]").replaceChildren(link);
  }

  if (SITE.hours.length) {
    $("[data-hours]").replaceChildren(
      ...SITE.hours.map(({ days, time }) => {
        const row = document.createElement("li");
        const d = document.createElement("span");
        const t = document.createElement("span");
        d.textContent = days;
        t.textContent = time;
        row.append(d, t);
        return row;
      })
    );
  }

  $("[data-rating-value]").textContent = SITE.rating.value;
  if (SITE.rating.verified) $("[data-rating-status]").hidden = true;
  if (SITE.rating.reviewsUrl) $("[data-reviews-link]").href = SITE.rating.reviewsUrl;
  if (SITE.mapsUrl) $("[data-maps-link]").href = SITE.mapsUrl;
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

  // "Enquire about ..." links pre-select the service in the enquiry form
  $$("[data-enquire]").forEach((link) => {
    link.addEventListener("click", () => {
      $("#f-service").value = link.dataset.enquire;
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
    caption.textContent = source.alt + " (stock photograph)";
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

/* ---------- WhatsApp enquiries ---------- */
function openWhatsApp(message) {
  if (SITE.whatsapp) {
    const url = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener");
    return;
  }
  // Placeholder number: show what would be sent instead of opening a broken chat
  $("#notice-message").textContent = message;
  $("#notice").showModal();
}

function initEnquiries() {
  $$("[data-whatsapp]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openWhatsApp(SITE.whatsappGreeting);
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
      "Date: " + date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
      "Time: " + (data.get("time") || "Any time")
    ];
    if (data.get("message").trim()) lines.push("Note: " + data.get("message").trim());
    lines.push("", "Please confirm if this slot is available.");
    openWhatsApp(lines.join("\n"));
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
initEnquiries();
initReveal();
