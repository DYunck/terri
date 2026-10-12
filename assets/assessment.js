/* ==========================================================
   "Find Your AND" self-assessment
   ========================================================== */
(function () {
  const root = document.querySelector("[data-assessment]");
  if (!root) return;

  const QUESTIONS = [
    {
      q: "Which part of your current job gives you the most energy?",
      a: [
        ["leader", "Coaching my team and keeping everything running smoothly"],
        ["technologist", "Fixing a broken workflow or figuring out a new system"],
        ["entrepreneur", "Spotting a better way to do things and wanting to build it"],
        ["connector", "Counseling patients and explaining complex topics simply"],
      ],
    },
    {
      q: "When colleagues come to you, it's usually for…",
      a: [
        ["leader", "Help making a tough call or calming a tense situation"],
        ["technologist", "Help with the software, an automation, or the data"],
        ["entrepreneur", "A creative idea or a fresh angle on a problem"],
        ["connector", "A clear explanation of a drug, a guideline, or a study"],
      ],
    },
    {
      q: "Your ideal workday looks like…",
      a: [
        ["leader", "Conversations where decisions get made and people move forward"],
        ["technologist", "Heads-down problem solving with tools and data"],
        ["entrepreneur", "Variety, autonomy, and owning the outcome"],
        ["connector", "Presenting, writing, teaching, or advising"],
      ],
    },
    {
      q: "What frustrates you most right now?",
      a: [
        ["leader", "Watching good people burn out under poor management"],
        ["technologist", "Outdated systems and wasted manual steps"],
        ["entrepreneur", "Having no say in how things are done"],
        ["connector", "Never having time to really share what I know"],
      ],
    },
    {
      q: "Which of these would you most enjoy learning next?",
      a: [
        ["leader", "Leadership or project management (like a PMP)"],
        ["technologist", "Informatics, data analytics, or a new health-tech platform"],
        ["entrepreneur", "Business basics: marketing, pricing, starting something"],
        ["connector", "Public speaking, medical writing, or teaching"],
      ],
    },
    {
      q: "A year from now, you'd be proudest to say…",
      a: [
        ["leader", "“I lead a team that makes a real difference.”"],
        ["technologist", "“I build the tools other clinicians rely on.”"],
        ["entrepreneur", "“I built something that's mine.”"],
        ["connector", "“I help people understand their health and the science.”"],
      ],
    },
  ];

  const RESULTS = {
    leader: {
      short: "Leader",
      title: "A pharmacist AND a leader",
      summary:
        "You're energized by people, decisions, and momentum. You already do the work of a leader: steadying the team, making judgment calls, and keeping patients safe under pressure. Those skills translate well beyond the pharmacy counter.",
      strengths: ["Decision-making under pressure", "Developing and supporting people", "Operational know-how", "Calm, credible communication"],
      paths: ["Pharmacy or clinical operations management", "Program and project management", "Chief of staff and strategy roles", "Quality, safety, and compliance leadership"],
    },
    technologist: {
      short: "Technologist",
      title: "A pharmacist AND a technologist",
      summary:
        "You're the one who notices the broken process and wants to fix it. Clinical knowledge combined with a systems mindset is rare and valuable: health-tech teams need people who understand both the medication and the workflow.",
      strengths: ["Systems thinking", "Workflow and process improvement", "Comfort with data and new tools", "Translating between clinicians and builders"],
      paths: ["Pharmacy informatics", "Digital health product roles", "Health IT implementation and consulting", "Data and analytics"],
    },
    entrepreneur: {
      short: "Entrepreneur",
      title: "A pharmacist AND an entrepreneur",
      summary:
        "You want ownership: of your time, your ideas, and the outcome. Your clinical credibility is a real asset for building something of your own, whether that's a service, a business, or a side project that grows.",
      strengths: ["Creative problem-solving", "Comfort with autonomy", "Spotting unmet needs", "Resourcefulness"],
      paths: ["Independent consulting", "Starting a pharmacy-adjacent business or service", "Joining an early-stage health startup", "Creating content, courses, or a coaching practice"],
    },
    connector: {
      short: "Communicator",
      title: "A pharmacist AND a communicator",
      summary:
        "You come alive when you're helping someone understand. Explaining complex science clearly, whether to a patient, a provider, or a room full of people, is a skill many organizations are looking for.",
      strengths: ["Explaining complex science simply", "Building trust quickly", "Teaching and presenting", "Empathy and active listening"],
      paths: ["Medical science liaison and medical affairs", "Medical writing and education", "Teaching and academia", "Patient advocacy and engagement"],
    },
  };

  const steps = root.querySelector("[data-steps]");
  const progressBar = root.querySelector("[data-progress]");
  const progressText = root.querySelector("[data-progress-text]");
  const gate = root.querySelector("[data-gate]");
  const resultEl = root.querySelector("[data-result]");
  const backBtn = root.querySelector("[data-back]");
  const answers = [];
  let current = 0;

  function renderQuestion() {
    const item = QUESTIONS[current];
    steps.innerHTML = "";
    const fs = document.createElement("fieldset");
    fs.className = "quiz-q";
    const legend = document.createElement("legend");
    legend.textContent = item.q;
    fs.appendChild(legend);
    item.a.forEach(([key, label], i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-option" + (answers[current] === key ? " is-selected" : "");
      btn.innerHTML = `<span class="letter">${"ABCD"[i]}</span><span></span>`;
      btn.lastChild.textContent = label;
      btn.addEventListener("click", () => {
        answers[current] = key;
        btn.classList.add("is-selected");
        setTimeout(next, 220);
      });
      fs.appendChild(btn);
    });
    steps.appendChild(fs);
    const pct = Math.round((current / QUESTIONS.length) * 100);
    progressBar.style.width = pct + "%";
    progressText.textContent = `Question ${current + 1} of ${QUESTIONS.length}`;
    backBtn.hidden = current === 0;
    const first = fs.querySelector("button");
    if (first && renderQuestion.focused) first.focus();
    renderQuestion.focused = true;
  }

  function next() {
    if (current < QUESTIONS.length - 1) {
      current++;
      renderQuestion();
    } else {
      showGate();
    }
  }

  backBtn.addEventListener("click", () => {
    if (current > 0) {
      current--;
      renderQuestion();
    }
  });

  function showGate() {
    root.querySelector("[data-quiz]").hidden = true;
    progressBar.style.width = "100%";
    gate.hidden = false;
    gate.querySelector("input").focus();
  }

  function score() {
    const tally = { leader: 0, technologist: 0, entrepreneur: 0, connector: 0 };
    answers.forEach((k) => tally[k]++);
    // Ties go to the most recent answer, which tends to reflect where someone wants to go.
    const order = Object.keys(tally).sort((a, b) => tally[b] - tally[a] || answers.lastIndexOf(b) - answers.lastIndexOf(a));
    return { tally, order };
  }

  function showResult(firstName) {
    const { tally, order } = score();
    const top = RESULTS[order[0]];
    const second = tally[order[1]] >= 2 ? RESULTS[order[1]] : null;
    const total = QUESTIONS.length;
    const list = (items) => items.map((t) => `<li>${t}</li>`).join("");
    const bars = order
      .map((k) => {
        const pct = Math.round((tally[k] / total) * 100);
        const name = RESULTS[k].short;
        return `<div class="bar"><span class="bar-label">${name}</span><span class="bar-track"><span class="bar-fill" style="width:${pct}%"></span></span><span class="bar-val">${tally[k]}/${total}</span></div>`;
      })
      .join("");

    resultEl.querySelector("[data-result-body]").innerHTML = `
      <p class="eyebrow">${firstName ? escapeHtml(firstName) + ", your" : "Your"} result</p>
      <h2>${top.title.replace("AND", '<span class="accent">AND</span>')}</h2>
      <p class="lede">${top.summary}</p>
      <div class="result-grid">
        <div class="result-card"><h3>Strengths you already have</h3><ul class="checks">${list(top.strengths)}</ul></div>
        <div class="result-card"><h3>Paths worth exploring</h3><ul class="checks">${list(top.paths)}</ul></div>
      </div>
      <div class="result-card result-card--soft">
        <h3>Your mix</h3>
        <div class="bars">${bars}</div>
        ${second ? `<p class="small">You also scored well as <strong>${second.title.replace("A pharmacist AND ", "")}</strong>. Many pharmacists blend two directions, and that combination can open roles you haven't considered yet.</p>` : ""}
      </div>`;
    gate.hidden = true;
    resultEl.hidden = false;
    resultEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  gate.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const firstName = form.elements.first_name.value.trim();
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    const endpoint = typeof SITE_CONFIG !== "undefined" ? SITE_CONFIG.formEndpoint : "";
    if (endpoint) {
      try {
        const data = new FormData(form);
        const { order } = score();
        data.append("_form", "assessment");
        data.append("result", RESULTS[order[0]].title);
        data.append("answers", answers.join(", "));
        await fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
      } catch (err) {
        // Never block someone from their results because of a network hiccup.
      }
    }
    btn.disabled = false;
    showResult(firstName);
  });

  root.querySelector("[data-restart]").addEventListener("click", () => {
    answers.length = 0;
    current = 0;
    resultEl.hidden = true;
    root.querySelector("[data-quiz]").hidden = false;
    renderQuestion();
    root.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  renderQuestion();
})();
