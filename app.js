// AWS AI Practitioner Quiz – Spiellogik (reines JavaScript, nutzt die globale Konstante QUESTIONS).
(function () {
  "use strict";

  // ------------------------------------------------------------------------
  // Konstanten
  // ------------------------------------------------------------------------
  const MAX_LIVES = 5;
  const XP_PER_CORRECT = 10;
  const STREAK_BONUS_XP = 5;
  const STREAK_BONUS_EVERY = 3;
  const STORAGE_KEY = "awsAiQuiz.bestXp";
  const OPTION_KEYS = ["A", "B", "C", "D"];

  const PRAISE = [
    "Richtig!",
    "Super gemacht!",
    "Genau so!",
    "Stark!",
    "Volltreffer!",
    "Weiter so!",
    "Ausgezeichnet!",
    "Perfekt!"
  ];

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // ------------------------------------------------------------------------
  // DOM-Elemente
  // ------------------------------------------------------------------------
  const el = {
    screens: {
      start: document.getElementById("screen-start"),
      quiz: document.getElementById("screen-quiz"),
      result: document.getElementById("screen-result")
    },
    bestScore: document.getElementById("best-score-value"),
    btnStart: document.getElementById("btn-start"),
    btnClose: document.getElementById("btn-close"),
    progress: document.getElementById("progress"),
    progressFill: document.getElementById("progress-fill"),
    lives: document.querySelector(".lives"),
    livesCount: document.getElementById("lives-count"),
    livesLabel: document.getElementById("lives-label"),
    domain: document.getElementById("question-domain"),
    question: document.getElementById("question-text"),
    options: document.getElementById("options"),
    btnCheck: document.getElementById("btn-check"),
    feedback: document.getElementById("feedback"),
    feedbackTitle: document.getElementById("feedback-title"),
    feedbackExplanation: document.getElementById("feedback-explanation"),
    btnContinue: document.getElementById("btn-continue"),
    resultEmoji: document.getElementById("result-emoji"),
    resultTitle: document.getElementById("result-title"),
    resultStars: document.getElementById("result-stars"),
    resultXp: document.getElementById("result-xp"),
    resultAccuracy: document.getElementById("result-accuracy"),
    resultStreak: document.getElementById("result-streak"),
    btnRestart: document.getElementById("btn-restart"),
    btnRetryWrong: document.getElementById("btn-retry-wrong")
  };

  // ------------------------------------------------------------------------
  // Spielzustand
  // ------------------------------------------------------------------------
  const state = {
    questions: [],     // vorbereitete Fragen der aktuellen Runde
    index: 0,          // aktuelle Frage
    lives: MAX_LIVES,
    xp: 0,
    streak: 0,
    maxStreak: 0,
    correct: 0,
    answered: 0,
    wrong: [],         // Originalfragen, die falsch beantwortet wurden
    selected: null,    // Index der gewählten Antwort
    phase: "answering" // "answering" oder "checked"
  };

  // ------------------------------------------------------------------------
  // Hilfsfunktionen
  // ------------------------------------------------------------------------

  // Fisher-Yates-Mischung, gibt eine neue Liste zurück
  function shuffle(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // Mischt die Antworten einer Frage und berechnet den neuen Index der richtigen Antwort
  function prepareQuestion(source) {
    const order = shuffle(source.options.map((_, i) => i));
    return {
      source: source,
      domain: source.domain,
      question: source.question,
      explanation: source.explanation,
      options: order.map((i) => source.options[i]),
      answer: order.indexOf(source.answer)
    };
  }

  function randomItem(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function currentQuestion() {
    return state.questions[state.index];
  }

  // Animation neu starten, auch wenn die Klasse schon gesetzt war
  function restartAnimation(node, className) {
    node.classList.remove(className);
    void node.offsetWidth;
    node.classList.add(className);
  }

  // ------------------------------------------------------------------------
  // Bestleistung (localStorage)
  // ------------------------------------------------------------------------
  function loadBestXp() {
    try {
      const value = parseInt(localStorage.getItem(STORAGE_KEY), 10);
      return Number.isFinite(value) ? value : 0;
    } catch (e) {
      return 0;
    }
  }

  function saveBestXp(xp) {
    try {
      if (xp > loadBestXp()) localStorage.setItem(STORAGE_KEY, String(xp));
    } catch (e) {
      // Speicher nicht verfügbar (z. B. privater Modus) – einfach ignorieren
    }
  }

  function renderBestScore() {
    const best = loadBestXp();
    el.bestScore.textContent = best > 0 ? best + " XP" : "–";
  }

  // ------------------------------------------------------------------------
  // Bildschirme
  // ------------------------------------------------------------------------
  function showScreen(name) {
    Object.keys(el.screens).forEach((key) => {
      el.screens[key].hidden = key !== name;
    });
    window.scrollTo(0, 0);
  }

  function goToStart() {
    stopConfetti();
    renderBestScore();
    showScreen("start");
    el.btnStart.focus();
  }

  // ------------------------------------------------------------------------
  // Rundenablauf
  // ------------------------------------------------------------------------
  function startRound(sourceQuestions) {
    stopConfetti();
    Object.assign(state, {
      questions: sourceQuestions.map(prepareQuestion),
      index: 0,
      lives: MAX_LIVES,
      xp: 0,
      streak: 0,
      maxStreak: 0,
      correct: 0,
      answered: 0,
      wrong: [],
      selected: null,
      phase: "answering"
    });

    el.progress.setAttribute("aria-valuemax", String(state.questions.length));
    el.lives.classList.remove("is-empty");
    renderLives();
    showScreen("quiz");
    renderQuestion();
  }

  function renderQuestion() {
    const q = currentQuestion();
    state.selected = null;
    state.phase = "answering";

    el.domain.textContent = q.domain;
    el.question.textContent = q.question;
    renderOptions(q);

    el.btnCheck.disabled = true;
    hideFeedback();
    renderProgress();

    window.scrollTo(0, 0);
    el.question.focus({ preventScroll: true });
  }

  function renderOptions(q) {
    el.options.textContent = "";
    q.options.forEach((text, i) => {
      el.options.appendChild(createOptionButton(text, i));
    });
    updateRovingTabindex();
  }

  function createOptionButton(text, index) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option";
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-checked", "false");
    btn.dataset.index = String(index);

    const key = document.createElement("span");
    key.className = "option-key";
    key.setAttribute("aria-hidden", "true");
    key.textContent = OPTION_KEYS[index];

    const label = document.createElement("span");
    label.className = "option-text";
    label.textContent = text;

    btn.append(key, label);
    btn.addEventListener("click", () => selectOption(index));
    return btn;
  }

  function optionButtons() {
    return Array.from(el.options.querySelectorAll(".option"));
  }

  // ------------------------------------------------------------------------
  // Auswahl
  // ------------------------------------------------------------------------
  function selectOption(index) {
    if (state.phase !== "answering") return;
    const buttons = optionButtons();
    if (index < 0 || index >= buttons.length) return;

    state.selected = index;
    buttons.forEach((btn, i) => {
      btn.setAttribute("aria-checked", String(i === index));
    });
    updateRovingTabindex();
    el.btnCheck.disabled = false;
  }

  // Nur die gewählte (oder erste) Antwort ist per Tab erreichbar, Pfeiltasten wechseln
  function updateRovingTabindex() {
    const active = state.selected === null ? 0 : state.selected;
    optionButtons().forEach((btn, i) => {
      btn.tabIndex = i === active ? 0 : -1;
    });
  }

  function moveSelection(step) {
    const count = optionButtons().length;
    const from = state.selected === null ? (step > 0 ? -1 : 0) : state.selected;
    const next = (from + step + count) % count;
    selectOption(next);
    optionButtons()[next].focus();
  }

  // ------------------------------------------------------------------------
  // Überprüfen
  // ------------------------------------------------------------------------
  function checkAnswer() {
    if (state.phase !== "answering" || state.selected === null) return;

    const q = currentQuestion();
    const isCorrect = state.selected === q.answer;
    state.phase = "checked";
    state.answered++;

    markOptions(q);
    el.btnCheck.disabled = true;

    if (isCorrect) {
      const gained = handleCorrect();
      showFeedback(true, randomItem(PRAISE) + " +" + gained + " XP", q.explanation);
    } else {
      handleWrong(q);
      showFeedback(false, "Leider falsch", q.explanation, q.options[q.answer]);
    }
  }

  // Markiert richtig/falsch nicht nur farbig, sondern auch mit Symbol und Text für Screenreader
  function markOptions(q) {
    optionButtons().forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.answer) markOption(btn, "is-correct", "✓", "richtige Antwort");
      else if (i === state.selected) markOption(btn, "is-wrong", "✗", "deine Antwort, falsch");
    });
  }

  function markOption(btn, className, symbol, srText) {
    btn.classList.add(className);
    btn.querySelector(".option-key").textContent = symbol;
    const hint = document.createElement("span");
    hint.className = "visually-hidden";
    hint.textContent = " (" + srText + ")";
    btn.appendChild(hint);
  }

  // Gibt die gewonnenen XP zurück
  function handleCorrect() {
    let gained = XP_PER_CORRECT;
    state.correct++;
    state.streak++;
    state.maxStreak = Math.max(state.maxStreak, state.streak);
    if (state.streak % STREAK_BONUS_EVERY === 0) gained += STREAK_BONUS_XP;
    state.xp += gained;
    return gained;
  }

  function handleWrong(q) {
    state.streak = 0;
    state.lives = Math.max(0, state.lives - 1);
    state.wrong.push(q.source);
    renderLives();
    restartAnimation(el.lives, "is-pulse");
  }

  // ------------------------------------------------------------------------
  // Feedback-Panel
  // ------------------------------------------------------------------------
  function showFeedback(isCorrect, title, explanation, correctText) {
    el.feedback.classList.toggle("is-correct", isCorrect);
    el.feedback.classList.toggle("is-wrong", !isCorrect);
    el.feedbackTitle.textContent = title;
    el.feedbackExplanation.textContent = "";

    if (!isCorrect) {
      const answer = document.createElement("strong");
      answer.textContent = "Richtige Antwort: " + correctText;
      el.feedbackExplanation.append(answer, document.createElement("br"));
    }
    el.feedbackExplanation.append(explanation);

    if (!isCorrect) {
      el.feedbackExplanation.append(" " + livesSentence());
    }

    const isLast = state.lives === 0 || state.index === state.questions.length - 1;
    el.btnContinue.textContent = isLast ? "Ergebnis anzeigen" : "Weiter";

    el.feedback.hidden = false;
    el.screens.quiz.classList.add("has-feedback");
    el.feedback.focus();
  }

  function hideFeedback() {
    el.feedback.hidden = true;
    el.screens.quiz.classList.remove("has-feedback");
    el.feedback.classList.remove("is-correct", "is-wrong");
  }

  // ------------------------------------------------------------------------
  // Weiter
  // ------------------------------------------------------------------------
  function continueQuiz() {
    if (state.phase !== "checked") return;

    if (state.lives === 0) {
      showResult(true);
      return;
    }

    state.index++;
    if (state.index >= state.questions.length) {
      renderProgress();
      showResult(false);
      return;
    }
    renderQuestion();
  }

  // ------------------------------------------------------------------------
  // Fortschritt und Leben
  // ------------------------------------------------------------------------
  function renderProgress() {
    const total = state.questions.length;
    const done = Math.min(state.index, total);
    el.progressFill.style.width = (total ? (done / total) * 100 : 0) + "%";
    el.progress.setAttribute("aria-valuenow", String(done));
    el.progress.setAttribute("aria-valuetext", done + " von " + total + " Fragen erledigt");
  }

  function livesSentence() {
    if (state.lives === 0) return "Du hast keine Leben mehr.";
    return state.lives === 1 ? "Du hast noch 1 Leben." : "Du hast noch " + state.lives + " Leben.";
  }

  function renderLives() {
    el.livesCount.textContent = String(state.lives);
    el.livesLabel.textContent = livesSentence();
    el.lives.classList.toggle("is-empty", state.lives === 0);
  }

  // ------------------------------------------------------------------------
  // Ergebnis
  // ------------------------------------------------------------------------
  function calcStars(accuracy) {
    if (accuracy >= 90) return 3;
    if (accuracy >= 70) return 2;
    if (accuracy >= 50) return 1;
    return 0;
  }

  function resultHeadline(outOfLives, stars) {
    if (outOfLives) return { emoji: "💔", title: "Keine Leben mehr" };
    return [
      { emoji: "📚", title: "Weiter üben!" },
      { emoji: "👍", title: "Gut gemacht!" },
      { emoji: "🎉", title: "Sehr gut!" },
      { emoji: "🏆", title: "Ausgezeichnet!" }
    ][stars];
  }

  function showResult(outOfLives) {
    hideFeedback();

    const total = state.questions.length;
    const accuracy = state.answered ? Math.round((state.correct / state.answered) * 100) : 0;
    const stars = outOfLives ? 0 : calcStars(Math.round((state.correct / total) * 100));
    const headline = resultHeadline(outOfLives, stars);

    el.resultEmoji.textContent = headline.emoji;
    el.resultTitle.textContent = headline.title;
    el.resultXp.textContent = String(state.xp);
    el.resultAccuracy.textContent = accuracy + " %";
    el.resultStreak.textContent = String(state.maxStreak);
    renderStars(stars);

    el.btnRetryWrong.hidden = state.wrong.length === 0;

    saveBestXp(state.xp);
    showScreen("result");
    el.resultTitle.focus();

    if (stars >= 2) startConfetti();
  }

  function renderStars(count) {
    const stars = el.resultStars.querySelectorAll(".star");
    stars.forEach((star, i) => {
      star.classList.remove("is-earned");
      if (i < count) restartAnimation(star, "is-earned");
    });
    el.resultStars.setAttribute("aria-label", count + " von 3 Sternen");
  }

  // ------------------------------------------------------------------------
  // Konfetti (Canvas, ohne Bibliotheken)
  // ------------------------------------------------------------------------
  const confetti = { canvas: null, frame: 0 };
  const CONFETTI_COLORS = ["#0071e3", "#34c759", "#ff3b30", "#ffcc00", "#af52de", "#ff9500"];
  const CONFETTI_DURATION = 3500;

  function startConfetti() {
    if (reducedMotion.matches) return;
    stopConfetti();

    const canvas = document.createElement("canvas");
    canvas.className = "confetti";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
    confetti.canvas = canvas;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const pieces = createConfettiPieces(width, height);
    const startTime = performance.now();

    function draw(now) {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = Math.max(0, 1 - Math.max(0, elapsed - CONFETTI_DURATION + 800) / 800);
      pieces.forEach((p) => {
        updateConfettiPiece(p);
        drawConfettiPiece(ctx, p);
      });
      if (elapsed < CONFETTI_DURATION) confetti.frame = requestAnimationFrame(draw);
      else stopConfetti();
    }
    confetti.frame = requestAnimationFrame(draw);
  }

  function createConfettiPieces(width, height) {
    const count = Math.min(160, Math.round(width / 6));
    return Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: -Math.random() * height * 0.5,
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 8,
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 3,
      angle: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.3,
      color: randomItem(CONFETTI_COLORS)
    }));
  }

  function updateConfettiPiece(p) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.05;
    p.angle += p.spin;
  }

  function drawConfettiPiece(ctx, p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.angle)));
    ctx.restore();
  }

  function stopConfetti() {
    cancelAnimationFrame(confetti.frame);
    if (confetti.canvas) confetti.canvas.remove();
    confetti.canvas = null;
  }

  // ------------------------------------------------------------------------
  // Tastatur
  // ------------------------------------------------------------------------
  function handleKeydown(event) {
    if (el.screens.quiz.hidden || event.repeat) return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    // Tasten 1–4 wählen eine Antwort
    if (/^[1-4]$/.test(event.key) && state.phase === "answering") {
      event.preventDefault();
      const index = Number(event.key) - 1;
      selectOption(index);
      const btn = optionButtons()[index];
      if (btn) btn.focus();
      return;
    }

    // Pfeiltasten innerhalb der Antwortgruppe
    if (el.options.contains(document.activeElement) && state.phase === "answering") {
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        moveSelection(1);
        return;
      }
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        moveSelection(-1);
        return;
      }
    }

    // Enter überprüft bzw. geht weiter (nicht auf dem Schließen-Button)
    if (event.key === "Enter" && document.activeElement !== el.btnClose) {
      event.preventDefault();
      if (state.phase === "answering") checkAnswer();
      else continueQuiz();
    }
  }

  // ------------------------------------------------------------------------
  // Ereignisse
  // ------------------------------------------------------------------------
  function confirmClose() {
    const ok = window.confirm("Möchtest du das Quiz wirklich beenden? Dein Fortschritt geht verloren.");
    if (ok) goToStart();
  }

  function bindEvents() {
    el.btnStart.addEventListener("click", () => startRound(QUESTIONS));
    el.btnCheck.addEventListener("click", checkAnswer);
    el.btnContinue.addEventListener("click", continueQuiz);
    el.btnClose.addEventListener("click", confirmClose);
    el.btnRestart.addEventListener("click", () => startRound(QUESTIONS));
    el.btnRetryWrong.addEventListener("click", () => startRound(state.wrong));
    el.lives.addEventListener("animationend", () => el.lives.classList.remove("is-pulse"));
    document.addEventListener("keydown", handleKeydown);
  }

  // Überschriften und Panel per Skript fokussierbar machen (für Screenreader)
  function makeFocusTargets() {
    [el.question, el.resultTitle, el.feedback].forEach((node) => {
      node.tabIndex = -1;
    });
  }

  function init() {
    makeFocusTargets();
    bindEvents();
    renderBestScore();
  }

  init();
})();
