/* ==========================================================
   Site settings — edit these three values, nothing else needed.
   ========================================================== */
const SITE_CONFIG = {
  // Calendly / booking link for "Book a Discovery Call" buttons.
  // Leave empty to send visitors to the contact form instead.
  bookingUrl: "",

  // Form endpoint (e.g. https://formspree.io/f/xxxxxxx) used by the
  // contact form, the newsletter signup and the Flip the Script interest list.
  formEndpoint: "",

  // Shown as a fallback when the form endpoint is not set yet.
  contactEmail: "",
};

(function () {
  // Booking links
  if (SITE_CONFIG.bookingUrl) {
    document.querySelectorAll("[data-booking]").forEach((a) => {
      a.href = SITE_CONFIG.bookingUrl;
      a.target = "_blank";
      a.rel = "noopener";
    });
  }

  // Sticky header border
  const header = document.querySelector(".site-header");
  const onScroll = () => header && header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile nav
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  // "Pharmacist AND ___" rotator
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rot = document.querySelector("[data-rotate]");
  if (rot && !reduceMotion) {
    const words = rot.dataset.rotate.split("|");
    const span = rot.querySelector("span");
    let i = 0;
    setInterval(() => {
      span.classList.add("is-out");
      setTimeout(() => {
        i = (i + 1) % words.length;
        span.textContent = words[i];
        span.classList.remove("is-out");
      }, 350);
    }, 2400);
  }

  // Reveal on scroll
  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("is-visible"));
  }

  // Forms
  document.querySelectorAll("form[data-form]").forEach((form) => {
    const status = form.querySelector(".form-status") || form.parentElement.querySelector(".form-status");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!SITE_CONFIG.formEndpoint) {
        if (status) {
          status.textContent = SITE_CONFIG.contactEmail
            ? `Online signup is coming soon. In the meantime, email ${SITE_CONFIG.contactEmail}.`
            : "Online signup is coming soon. Please check back shortly.";
        }
        return;
      }
      const btn = form.querySelector("button[type=submit]");
      if (btn) btn.disabled = true;
      try {
        const data = new FormData(form);
        data.append("_form", form.dataset.form);
        const res = await fetch(SITE_CONFIG.formEndpoint, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(res.statusText);
        form.reset();
        if (status) status.textContent = form.dataset.success || "Thank you — we'll be in touch soon.";
      } catch (err) {
        if (status) status.textContent = "Sorry, something went wrong. Please try again.";
      } finally {
        if (btn) btn.disabled = false;
      }
    });
  });

  // Footer year
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
