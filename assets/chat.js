/* ==========================================================
   Terri's assistant: a scripted chat that helps visitors
   and guides them to request a discovery call.
   No server or API key needed. Edit the copy in NODES/TOPICS.
   ========================================================== */
(function () {
  const PHOTO = "assets/img/terri-wang.jpg";
  const CONTACT_PAGE = "about.html#contact";
  const cfg = typeof SITE_CONFIG !== "undefined" ? SITE_CONFIG : {};
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} },
    del(k) { try { sessionStorage.removeItem(k); } catch (e) {} },
  };

  /* ---------- Contact form prefill (runs on about.html) ---------- */
  const prefill = store.get("satsumaChatPrefill");
  const contactForm = document.querySelector('form[data-form="contact"]');
  function fillContact(d) {
    if (d.name) contactForm.elements.name.value = d.name;
    if (d.email) contactForm.elements.email.value = d.email;
    if (d.message) contactForm.elements.message.value = d.message;
    contactForm.elements.topic.value = "Booking a discovery call";
  }
  if (prefill && contactForm) {
    try { fillContact(JSON.parse(prefill)); } catch (e) {}
    store.del("satsumaChatPrefill");
  }

  /* ---------- Conversation ---------- */
  const state = { setting: "", timeline: "", interest: "" };
  const BOOK = { label: "Request a Discovery Call", go: "book", primary: true };

  const NODES = {
    start: {
      say: [
        "Hi, I'm Terri's virtual assistant.",
        "I can answer questions about working with Terri and help you take the next step. What brings you here today?",
      ],
      options: [
        { label: "I feel stuck in my role", go: "stuck" },
        { label: "I want to explore other paths", go: "explore" },
        { label: "Tell me about coaching", go: "coaching" },
        { label: "I have a question", go: "question" },
      ],
    },
    stuck: {
      set: { interest: "Feeling stuck in current role" },
      say: [
        "That feeling is more common than you might think. Pharmacists often tell Terri things like “All I know is pharmacy” or “I'm just a pharmacist.”",
        "The good news: you don't have to start over. Your pharmacy degree is the foundation, not the boundary.",
      ],
      next: "qualify",
    },
    explore: {
      set: { interest: "Exploring other career paths" },
      say: [
        "Love that. A pharmacist's clinical knowledge carries into many areas: healthcare technology and informatics, leadership and operations, consulting, industry and medical affairs, education, or building something of your own.",
        "The right path depends on your strengths and the life you want. That's exactly what Terri helps you figure out.",
      ],
      next: "qualify",
    },
    coaching: {
      set: { interest: "Learning about coaching" },
      say: [
        "Terri offers two ways to work together:",
        "<b>Private Coaching</b>: bespoke, one-to-one coaching with Terri, tailored to your goals, challenges, and career.",
        "<b>Flip the Script</b>: an intimate small-group experience for pharmacists navigating what's next. The first cohort is forming now.",
      ],
      options: [
        { label: "Private coaching sounds right", go: "qualify" },
        { label: "Tell me about Flip the Script", go: "flip" },
        { label: "How does it start?", go: "howstart" },
      ],
    },
    flip: {
      set: { interest: "Flip the Script small group" },
      say: [
        "Flip the Script is a small-group experience for pharmacists navigating what's next. Terri is building the first group now and keeping it small.",
        "You can join the interest list to hear first when enrollment opens, or talk with Terri about which option fits you best.",
      ],
      options: [
        { label: "Join the interest list", href: "index.html#flip-the-script" },
        { label: "I'd like to talk with Terri", go: "qualify" },
      ],
    },
    howstart: {
      say: [
        "Everything starts with a discovery call: a relaxed, private conversation about where you are, what's prompting you to look at what's next, and whether working together is the right fit.",
        "There's no pressure to commit.",
      ],
      options: [BOOK, { label: "I have another question", go: "question" }],
    },
    question: {
      say: ["Of course. Type your question below, or pick one of these:"],
      options: [
        { label: "Do I have to leave pharmacy?", ask: "Do I need to leave pharmacy entirely?" },
        { label: "Is this only for retail?", ask: "Is this only for retail pharmacists?" },
        { label: "How long does coaching take?", ask: "How long does coaching take?" },
        { label: "What does it cost?", ask: "What does coaching cost?" },
      ],
    },
    qualify: {
      say: ["Can I ask two quick questions so Terri has some context?", "Where do you practice today?"],
      options: ["Retail / community", "Hospital / health system", "Industry or other", "Not currently practicing"].map((s) => ({ label: s, go: "timeline", value: { setting: s } })),
    },
    timeline: {
      say: ["Thanks. And how soon are you hoping to make a change?"],
      options: ["As soon as possible", "In the next 6–12 months", "Just exploring for now"].map((s) => ({ label: s, go: "recommend", value: { timeline: s } })),
    },
    recommend: {
      say: () => [
        state.timeline === "Just exploring for now"
          ? "That's a great place to start. Many pharmacists begin simply by exploring, and there's no pressure to commit."
          : "Thank you, that's really helpful.",
        "Based on what you've shared, the best next step is a private discovery call with Terri. You'll talk through where you are, what you want, and whether working together is the right fit.",
        "Would you like to request one?",
      ],
      options: [BOOK, { label: "Not yet", go: "notyet" }],
    },
    notyet: {
      say: [
        "No problem at all. If you'd like a quiet place to start, try the two-minute Find Your AND reflection. It gives you a personal snapshot of where your strengths could take you.",
        "And I'm here whenever you're ready.",
      ],
      options: [{ label: "Take the reflection", href: "assessment.html" }, BOOK],
    },
    booked: {
      say: () => [
        `Thank you${state.name ? ", " + esc(state.name) : ""}! Your request is on its way to Terri, and she'll be in touch to find a time.`,
        "In the meantime, you're welcome to read more about Terri's story.",
      ],
      options: [{ label: "Read Terri's story", href: "about.html#team" }],
    },
  };

  const TOPICS = [
    { k: /\b(cost|price|pricing|fee|fees|expensive|afford|invest|pay|payment)\b/, a: ["Because coaching is tailored to each person, the investment depends on the engagement that fits you. Terri walks through the options on the discovery call, with no pressure to commit."] },
    { k: /(leave|quit|stay in|give up).*(pharmacy|profession)|leave pharmacy/, a: ["Not necessarily. Satsuma's whole approach is built on the AND. Some pharmacists move into a new role full-time; others add something alongside their current job, change settings, or reshape the role they already have.", "Coaching helps you figure out which of those fits you."] },
    { k: /\b(retail|hospital|ambulatory|clinic|industry|managed care|academia|new grad|graduate|setting)\b/, a: ["Coaching is for pharmacists in any setting: retail, hospital, ambulatory care, long-term care, industry, managed care, or academia. New grads and pharmacists with decades of experience are equally welcome."] },
    { k: /(how long|duration|weeks|months|how many sessions|timeline|time commitment)/, a: ["It depends on where you're starting and where you want to go. Some pharmacists want a few focused sessions to get clear on a direction; others want ongoing support through a full transition. You'll talk through what makes sense on the discovery call."] },
    { k: /(role|roles|job|jobs|career path|options|informatics|tech|remote|non.?clinical|alternative)/, a: ["A pharmacist's clinical knowledge carries into many areas, including healthcare technology and informatics, leadership and operations, consulting, industry and medical affairs, education, and building a business of your own.", "Which direction fits you depends on your strengths and goals, which is exactly what Terri helps you uncover."] },
    { k: /(flip the script|group|cohort|community)/, go: "flip" },
    { k: /(confidential|private|privacy|employer|boss|manager|secret|anyone know)/, a: ["Conversations with Terri are a private, judgement-free space to think out loud about your career, even if you haven't told anyone you're exploring."] },
    { k: /(who is terri|about terri|terri'?s|background|experience|qualif|credential|pharmd|amazon)/, a: ["Terri Wang, PharmD, PMP, started her career in retail pharmacy and forged her own path from there: healthcare IT, consulting, Amazon Pharmacy, and most recently Chief of Staff at a global healthcare technology company.", "Today she helps other pharmacists find their AND."] },
    { k: /(assessment|quiz|reflection|test)/, a: ["The Find Your AND reflection is six quick questions that give you a personal snapshot of your strengths and paths worth exploring."], options: [{ label: "Take the reflection", href: "assessment.html" }, BOOK] },
    { k: /(discovery|book|schedule|appointment|consult|call|meet|talk to terri|speak)/, go: "howstart" },
    { k: /(human|real person|are you (a )?(bot|real|terri)|is this terri)/, a: ["I'm an automated assistant, not Terri herself. The best way to speak with Terri directly is a discovery call."] },
    { k: /^(hi|hello|hey|good (morning|afternoon|evening))\b/, a: ["Hello! What can I help you with today?"], options: NODES.start.options },
    { k: /(thank|thanks|appreciate)/, a: ["You're very welcome! Is there anything else I can help with?"] },
  ];

  /* ---------- DOM ---------- */
  const root = document.createElement("div");
  root.className = "chat";
  root.innerHTML = `
    <div class="chat-teaser" hidden>
      <button type="button" class="chat-teaser-close" aria-label="Dismiss">&times;</button>
      <p>Wondering what's next after pharmacy? I can help you find your way.</p>
    </div>
    <button type="button" class="chat-launcher" aria-expanded="false" aria-controls="chat-panel" aria-label="Chat with Terri's assistant">
      <img src="${PHOTO}" alt="" width="60" height="60">
    </button>
    <section class="chat-panel" id="chat-panel" role="dialog" aria-label="Chat with Terri's assistant" hidden>
      <header class="chat-header">
        <img src="${PHOTO}" alt="Terri Wang" width="44" height="44">
        <div>
          <b>Terri's assistant</b>
          <span>Automated assistant · Satsuma</span>
        </div>
        <button type="button" class="chat-close" aria-label="Close chat">&times;</button>
      </header>
      <div class="chat-log" aria-live="polite"></div>
      <div class="chat-options"></div>
      <form class="chat-input">
        <label class="sr-only" for="chat-text">Type a message</label>
        <input id="chat-text" type="text" placeholder="Type a question…" autocomplete="off">
        <button type="submit" aria-label="Send">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </button>
      </form>
    </section>`;
  document.body.appendChild(root);

  const launcher = root.querySelector(".chat-launcher");
  const panel = root.querySelector(".chat-panel");
  const log = root.querySelector(".chat-log");
  const opts = root.querySelector(".chat-options");
  const input = root.querySelector(".chat-input");
  const teaser = root.querySelector(".chat-teaser");
  let started = false;
  let busy = Promise.resolve();

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  const wait = (ms) => new Promise((r) => setTimeout(r, reduceMotion ? 0 : ms));

  function addUser(text) {
    const m = document.createElement("div");
    m.className = "msg msg--user";
    m.textContent = text;
    log.appendChild(m);
    scroll();
  }

  async function addBot(html) {
    const t = document.createElement("div");
    t.className = "msg msg--bot msg--typing";
    t.innerHTML = "<span></span><span></span><span></span>";
    log.appendChild(t);
    scroll();
    await wait(Math.min(1200, 350 + html.length * 6));
    t.classList.remove("msg--typing");
    t.innerHTML = html;
    scroll();
  }

  function scroll() {
    log.scrollTop = log.scrollHeight;
  }

  function setOptions(list) {
    opts.innerHTML = "";
    (list || []).forEach((o) => {
      const el = document.createElement(o.href ? "a" : "button");
      el.className = "chat-opt" + (o.primary ? " chat-opt--primary" : "");
      el.textContent = o.label;
      if (o.href) {
        el.href = o.href;
      } else {
        el.type = "button";
        el.addEventListener("click", () => {
          addUser(o.label);
          if (o.value) Object.assign(state, o.value);
          if (o.ask) respond(o.ask, true);
          else run(o.go);
        });
      }
      opts.appendChild(el);
    });
  }

  function run(id) {
    busy = busy.then(async () => {
      if (id === "book") return book();
      const node = NODES[id];
      if (node.set) Object.assign(state, node.set);
      setOptions([]);
      const lines = typeof node.say === "function" ? node.say() : node.say;
      for (const line of lines) await addBot(line);
      if (node.next) return run(node.next);
      setOptions(node.options);
    });
  }

  function respond(text, fromButton) {
    if (!fromButton) addUser(text);
    const q = text.toLowerCase();
    const hit = TOPICS.find((t) => t.k.test(q));
    if (hit && hit.go) return run(hit.go);
    busy = busy.then(async () => {
      setOptions([]);
      const lines = hit
        ? hit.a
        : ["That's a great question, and one Terri would be happy to answer personally. The quickest way is a short discovery call."];
      for (const line of lines) await addBot(line);
      setOptions(hit && hit.options ? hit.options : [BOOK, { label: "Ask something else", go: "question" }]);
    });
  }

  function summary() {
    const parts = [];
    if (state.interest) parts.push(`Interested in: ${state.interest}`);
    if (state.setting) parts.push(`Practice setting: ${state.setting}`);
    if (state.timeline) parts.push(`Timeline: ${state.timeline}`);
    return parts.join("\n");
  }

  async function book() {
    setOptions([]);
    if (cfg.bookingUrl) {
      await addBot("Wonderful! You can pick a time that works for you on Terri's calendar.");
      setOptions([{ label: "Choose a time", href: cfg.bookingUrl, primary: true }]);
      opts.querySelector("a").target = "_blank";
      opts.querySelector("a").rel = "noopener";
      return;
    }
    if (!cfg.formEndpoint) {
      await addBot("Wonderful! I'll take you to the request form. I've filled in what you've shared so far.");
      const d = { message: summary() };
      if (contactForm) {
        fillContact(d);
        setOptions([{ label: "Continue to the request form", href: "#contact", primary: true }]);
        opts.querySelector("a").addEventListener("click", close);
      } else {
        store.set("satsumaChatPrefill", JSON.stringify(d));
        setOptions([{ label: "Continue to the request form", href: CONTACT_PAGE, primary: true }]);
      }
      return;
    }
    await addBot("Wonderful! Share your name and email, and Terri will be in touch to find a time.");
    const f = document.createElement("form");
    f.className = "chat-lead";
    f.innerHTML = `
      <label class="sr-only" for="chat-name">First name</label>
      <input id="chat-name" name="name" placeholder="First name" required autocomplete="given-name">
      <label class="sr-only" for="chat-email">Email</label>
      <input id="chat-email" name="email" type="email" placeholder="Email" required autocomplete="email">
      <button type="submit" class="chat-opt chat-opt--primary">Send request</button>`;
    opts.appendChild(f);
    f.elements.name.focus();
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = f.querySelector("button");
      btn.disabled = true;
      state.name = f.elements.name.value.trim();
      const data = new FormData();
      data.append("_form", "chat-discovery-call");
      data.append("name", state.name);
      data.append("email", f.elements.email.value.trim());
      data.append("topic", "Booking a discovery call");
      data.append("message", summary() || "Requested via the website chat.");
      try {
        const res = await fetch(cfg.formEndpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(res.statusText);
        addUser(`${state.name} · ${f.elements.email.value.trim()}`);
        run("booked");
      } catch (err) {
        btn.disabled = false;
        await addBot("Sorry, something went wrong sending that. You can also use the request form instead.");
        store.set("satsumaChatPrefill", JSON.stringify({ name: state.name, email: f.elements.email.value.trim(), message: summary() }));
        setOptions([{ label: "Open the request form", href: CONTACT_PAGE, primary: true }]);
      }
    });
  }

  /* ---------- Open / close ---------- */
  function open() {
    teaser.hidden = true;
    store.set("satsumaChatTeaser", "1");
    panel.hidden = false;
    root.classList.add("is-open");
    launcher.setAttribute("aria-expanded", "true");
    if (!started) {
      started = true;
      run("start");
    }
    setTimeout(() => root.querySelector("#chat-text").focus({ preventScroll: true }), 50);
  }
  function close() {
    panel.hidden = true;
    root.classList.remove("is-open");
    launcher.setAttribute("aria-expanded", "false");
    launcher.focus();
  }

  launcher.addEventListener("click", () => (panel.hidden ? open() : close()));
  root.querySelector(".chat-close").addEventListener("click", close);
  teaser.querySelector("p").addEventListener("click", open);
  root.querySelector(".chat-teaser-close").addEventListener("click", () => {
    teaser.hidden = true;
    store.set("satsumaChatTeaser", "1");
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) close();
  });
  input.addEventListener("submit", (e) => {
    e.preventDefault();
    const field = input.querySelector("input");
    const text = field.value.trim();
    if (!text) return;
    field.value = "";
    if (!started) started = true;
    respond(text);
  });

  // Any "Chat with Terri's assistant" link on the page opens the chat.
  document.querySelectorAll("[data-open-chat]").forEach((el) =>
    el.addEventListener("click", (e) => {
      e.preventDefault();
      open();
    })
  );

  // Gentle teaser, once per visit
  if (!store.get("satsumaChatTeaser")) {
    setTimeout(() => {
      if (panel.hidden) teaser.hidden = false;
    }, 6000);
  }
})();
