const TOPICS = {
  "topic-zero": { name: "Zero Conditional", color: "#059669" },
  "topic-first": { name: "First Conditional", color: "#2563EB" },
  "topic-second": { name: "Second Conditional", color: "#7C3AED" },
  "topic-third": { name: "Third Conditional", color: "#DC2626" },
};

const QUESTIONS = [
  { id: "zr1", type: "true-false", topicId: "topic-zero", text: "The sentence 'If you press the power button, the computer turns on.' is a Zero Conditional.", explanation: "If + present simple (press), present simple (turns on)' — this describes an automatic cause-and-effect fact, which is the Zero Conditional structure.", correctAnswer: "true", onCorrect: "f1", onIncorrect: "zr2" },
  { id: "zr2", type: "multiple-choice", topicId: "topic-zero", text: "In Zero Conditional, which tenses are used in BOTH clauses?", explanation: "Zero Conditional always uses present simple in BOTH the if-clause AND the result clause.", optionA: "Past simple + past simple", optionB: "Present simple + present simple", optionC: "Present simple + will + verb", optionD: "Past simple + would + verb", correctOptionId: "b", onCorrect: "f1", onIncorrect: "z2" },
  { id: "z2", type: "multiple-choice", topicId: "topic-zero", text: "Complete the Zero Conditional: 'If you __ water, it becomes ice.'", explanation: "'freeze' (present simple base form) is correct.", optionA: "will freeze", optionB: "froze", optionC: "freeze", optionD: "would freeze", correctOptionId: "c", onCorrect: "f1", onIncorrect: "zr3" },
  { id: "zr3", type: "true-false", topicId: "topic-zero", text: "The sentence 'If you don't water plants, they die.' is grammatically correct as a Zero Conditional.", explanation: "If + present simple negative + present simple = valid Zero Conditional.", correctAnswer: "true", onCorrect: "f1", onIncorrect: "zr4" },
  { id: "zr4", type: "error-correction", topicId: "topic-zero", text: "Find and fix the error: 'If you heats metal, it expands.'", explanation: "Use base form with 'you': heat.", errorSegment: "heats", correction: "heat", onCorrect: "f1", onIncorrect: "f1" },
  { id: "f1", type: "multiple-choice", topicId: "topic-first", text: "Which sentence is a correctly formed First Conditional?", explanation: "First Conditional uses If + present simple, will + base verb.", optionA: "If it will rain tomorrow, I stay at home.", optionB: "If it rains tomorrow, I will stay at home.", optionC: "If it rained tomorrow, I would stay at home.", optionD: "If it had rained, I would have stayed at home.", correctOptionId: "b", onCorrect: "sr2", onIncorrect: "fr2" },
  { id: "fr2", type: "multiple-choice", topicId: "topic-first", text: "Which tenses form the First Conditional?", explanation: "First Conditional = present simple + will + base verb.", optionA: "Past simple + would + verb", optionB: "Present simple + present simple", optionC: "Present simple + will + base verb", optionD: "Past perfect + would have + past participle", correctOptionId: "c", onCorrect: "sr2", onIncorrect: "f2" },
  { id: "f2", type: "true-false", topicId: "topic-first", text: "The sentence 'If you will work hard, you will succeed.' is grammatically correct.", explanation: "Do not use will in the if-clause.", correctAnswer: "false", onCorrect: "sr2", onIncorrect: "fr3" },
  { id: "fr3", type: "error-correction", topicId: "topic-first", text: "Find and fix the error: 'If she will call me, I will answer.'", explanation: "If-clause should be present simple: calls.", errorSegment: "will call", correction: "calls", onCorrect: "sr2", onIncorrect: "f3" },
  { id: "f3", type: "multiple-choice", topicId: "topic-first", text: "Choose the best First Conditional sentence:", explanation: "Use If + present simple, will + base verb.", optionA: "If he studies, he passes.", optionB: "If he studies, he will pass.", optionC: "If he will study, he passes.", optionD: "If he studied, he would pass.", correctOptionId: "b", onCorrect: "sr2", onIncorrect: "sr2" },
  { id: "sr2", type: "multiple-choice", topicId: "topic-second", text: "Second Conditional is used for:", explanation: "It describes unreal/hypothetical present or future situations.", optionA: "General facts", optionB: "Real future possibilities", optionC: "Hypothetical present/future", optionD: "Past regrets", correctOptionId: "c", onCorrect: "tr2", onIncorrect: "s2" },
  { id: "s2", type: "true-false", topicId: "topic-second", text: "'If I were rich, I would travel the world.' is Second Conditional.", explanation: "were + would travel = Second Conditional.", correctAnswer: "true", onCorrect: "tr2", onIncorrect: "sr3" },
  { id: "sr3", type: "error-correction", topicId: "topic-second", text: "Find and fix the error: 'If I was you, I would apologize.'", explanation: "Use subjunctive were.", errorSegment: "was", correction: "were", onCorrect: "tr2", onIncorrect: "s3" },
  { id: "s3", type: "multiple-choice", topicId: "topic-second", text: "Choose a correct Second Conditional sentence:", explanation: "If + past simple, would + base verb.", optionA: "If it rains, I will stay home.", optionB: "If it rained, I would stay home.", optionC: "If it had rained, I would have stayed home.", optionD: "If it rain, I stay home.", correctOptionId: "b", onCorrect: "tr2", onIncorrect: "sr7" },
  { id: "sr7", type: "multiple-choice", topicId: "topic-second", text: "In Second Conditional, the main clause usually contains:", explanation: "would + base verb.", optionA: "will + verb", optionB: "would + base verb", optionC: "has + past participle", optionD: "had + past participle", correctOptionId: "b", onCorrect: "tr2", onIncorrect: "tr2" },
  { id: "tr2", type: "multiple-choice", topicId: "topic-third", text: "Third Conditional refers to:", explanation: "Unreal past situations and imagined results.", optionA: "General truths", optionB: "Real future events", optionC: "Unreal past situations", optionD: "Present habits", correctOptionId: "c", onCorrect: "fr1", onIncorrect: "tr4" },
  { id: "tr4", type: "multiple-choice", topicId: "topic-third", text: "Choose the correct Third Conditional pattern:", explanation: "If + had + p.p., would have + p.p.", optionA: "If + present, will + verb", optionB: "If + past, would + verb", optionC: "If + had + p.p., would have + p.p.", optionD: "If + present, present", correctOptionId: "c", onCorrect: "fr1", onIncorrect: "t3" },
  { id: "t3", type: "multiple-choice", topicId: "topic-third", text: "Complete: 'If she had left earlier, she ___ the train.'", explanation: "would have caught", optionA: "would catch", optionB: "will catch", optionC: "would have caught", optionD: "caught", correctOptionId: "c", onCorrect: "fr1", onIncorrect: "t4" },
  { id: "t4", type: "error-correction", topicId: "topic-third", text: "Find and fix the error: 'If he had studied, he would pass the exam.'", explanation: "Main clause should be would have passed.", errorSegment: "would pass", correction: "would have passed", onCorrect: "fr1", onIncorrect: "tr7" },
  { id: "tr7", type: "multiple-choice", topicId: "topic-third", text: "Which sentence is Third Conditional?", explanation: "Past unreal condition + past result.", optionA: "If I study, I pass.", optionB: "If I studied, I would pass.", optionC: "If I had studied, I would have passed.", optionD: "If I will study, I will pass.", correctOptionId: "c", onCorrect: "fr1", onIncorrect: "fr1" },
  { id: "fr1", type: "true-false", topicId: "topic-third", text: "Bonus: In formal English, Third Conditional often expresses regret.", explanation: "Yes, it's commonly used to reflect regret.", correctAnswer: "true", onCorrect: "t1", onIncorrect: "t1" },
  { id: "t1", type: "multiple-choice", topicId: "topic-third", text: "Bonus: Which sentence best expresses a missed past opportunity?", explanation: "Third conditional indicates missed chance in past.", optionA: "If I wake early, I catch the bus.", optionB: "If I woke early, I would catch the bus.", optionC: "If I had woken early, I would have caught the bus.", optionD: "If I will wake early, I will catch the bus.", correctOptionId: "c", onCorrect: "sr1", onIncorrect: "sr1" },
  { id: "sr1", type: "true-false", topicId: "topic-second", text: "Bonus: 'If I had more time, I would learn Japanese.' is Second Conditional.", explanation: "It is hypothetical present; yes, Second Conditional.", correctAnswer: "true", onCorrect: "", onIncorrect: "" },
];

const BONUS_IDS = new Set(["fr1", "t1", "sr1"]);
const questionMap = new Map(QUESTIONS.map((q) => [q.id, q]));
const visited = new Set();
const answeredBonus = new Set();
const answers = [];

const progressEl = document.getElementById("progress");
const progressFillEl = document.getElementById("progress-fill");
const titleEl = document.getElementById("question-title");
const textEl = document.getElementById("question-text");
const bodyEl = document.getElementById("question-body");
const feedbackEl = document.getElementById("feedback");
const submitBtn = document.getElementById("submit-btn");
const nextBtn = document.getElementById("next-btn");
const startBtn = document.getElementById("start-btn");
const homeCard = document.getElementById("home-card");
const timerEl = document.getElementById("timer");
const quizCard = document.getElementById("quiz-card");
const resultCard = document.getElementById("result-card");

let currentQuestion = null;
let isTransitioning = false;
let pendingNextId = "";
let hasSubmittedCurrent = false;
let timerSeconds = 210;
let timerInterval = null;
let timeExpired = false;

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function renderTimer() {
  if (!timerEl) return;
  timerEl.textContent = formatTime(timerSeconds);
  timerEl.classList.toggle("timer-warning", timerSeconds <= 30);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function startTimer() {
  stopTimer();
  timerSeconds = 210;
  timeExpired = false;
  renderTimer();
  timerInterval = setInterval(() => {
    timerSeconds -= 1;
    renderTimer();
    if (timerSeconds <= 0) {
      stopTimer();
      timeExpired = true;
      maybeFinishQuiz("");
    }
  }, 1000);
}

renderTimer();

function normalizeText(value) {
  return (value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function pickStartQuestionId() {
  const metaRoot = "z1";
  return questionMap.has(metaRoot) ? metaRoot : "zr1";
}

function renderQuestion(qid) {
  const q = questionMap.get(qid);
  if (!q) {
    maybeFinishQuiz();
    return;
  }
  currentQuestion = q;
  visited.add(q.id);
  isTransitioning = false;
  submitBtn.disabled = false;
  submitBtn.classList.remove("hidden");
  nextBtn.classList.add("hidden");
  pendingNextId = "";
  hasSubmittedCurrent = false;
  progressEl.textContent = `Answered ${answers.length} / Reached ${visited.size} nodes`;
  const progressRatio = Math.min(100, (answers.length / QUESTIONS.length) * 100);
  if (progressFillEl) {
    progressFillEl.style.width = `${progressRatio}%`;
  }
  titleEl.textContent = `${TOPICS[q.topicId]?.name ?? q.topicId} · ${q.id}`;
  textEl.textContent = q.text;
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  bodyEl.innerHTML = "";

  if (q.type === "multiple-choice") {
    ["a", "b", "c", "d"].forEach((optId) => {
      const text = q[`option${optId.toUpperCase()}`];
      if (!text) return;
      const label = document.createElement("label");
      label.className = "option";
      label.innerHTML = `<input type="radio" name="answer" value="${optId}" /> (${optId.toUpperCase()}) ${text}`;
      bodyEl.appendChild(label);
    });
  }

  if (q.type === "true-false") {
    ["true", "false"].forEach((v) => {
      const label = document.createElement("label");
      label.className = "option";
      label.innerHTML = `<input type="radio" name="answer" value="${v}" /> ${v}`;
      bodyEl.appendChild(label);
    });
  }

  if (q.type === "error-correction") {
    const input = document.createElement("input");
    input.id = "answer-input";
    input.placeholder = "Type the corrected phrase";
    bodyEl.appendChild(input);
  }
}

function getUserAnswer() {
  if (currentQuestion.type === "error-correction") {
    return normalizeText(document.getElementById("answer-input")?.value);
  }
  const picked = document.querySelector('input[name="answer"]:checked');
  return picked ? picked.value : "";
}

function isCorrect(q, userAnswer) {
  if (q.type === "multiple-choice") {
    return userAnswer === q.correctOptionId;
  }
  if (q.type === "true-false") {
    return userAnswer === q.correctAnswer;
  }
  return userAnswer === normalizeText(q.correction);
}

function maybeFinishQuiz(nextId) {
  if (timeExpired) {
    showResults();
    return;
  }
  const allBonusDone = [...BONUS_IDS].every((id) => answeredBonus.has(id));

  if (nextId && questionMap.has(nextId)) {
    renderQuestion(nextId);
    return;
  }

  if (!allBonusDone) {
    const remaining = [...BONUS_IDS].find((id) => !answeredBonus.has(id));
    renderQuestion(remaining);
    return;
  }

  showResults();
}

submitBtn.addEventListener("click", () => {
  if (timeExpired) {
    return;
  }
  if (hasSubmittedCurrent) {
    return;
  }
  const userAnswer = getUserAnswer();
  if (isTransitioning) {
    return;
  }
  if (!userAnswer) {
    feedbackEl.textContent = "Please answer the question before submitting.";
    feedbackEl.className = "feedback feedback-info";
    return;
  }
  isTransitioning = true;
  submitBtn.disabled = true;

  const correct = isCorrect(currentQuestion, userAnswer);
  if (BONUS_IDS.has(currentQuestion.id)) {
    answeredBonus.add(currentQuestion.id);
  }

  answers.push({
    id: currentQuestion.id,
    topicId: currentQuestion.topicId,
    correct,
    userAnswer,
    explanation: currentQuestion.explanation,
    text: currentQuestion.text,
  });

  feedbackEl.textContent = correct ? `✅ Correct: ${currentQuestion.explanation}` : `❌ Not correct: ${currentQuestion.explanation}`;
  feedbackEl.className = `feedback ${correct ? "feedback-correct" : "feedback-incorrect"}`;
  pendingNextId = correct ? currentQuestion.onCorrect : currentQuestion.onIncorrect;
  hasSubmittedCurrent = true;
  submitBtn.classList.add("hidden");
  nextBtn.classList.remove("hidden");
  isTransitioning = false;
});

nextBtn.addEventListener("click", () => {
  if (timeExpired) {
    return;
  }
  if (!hasSubmittedCurrent) {
    return;
  }
  maybeFinishQuiz(pendingNextId);
});

startBtn.addEventListener("click", () => {
  homeCard.classList.add("hidden");
  quizCard.classList.remove("hidden");
  startTimer();
  renderQuestion(pickStartQuestionId());
});

function showResults() {
  stopTimer();
  quizCard.classList.add("hidden");
  resultCard.classList.remove("hidden");

  const overall = answers.length ? (answers.filter((a) => a.correct).length / answers.length) * 100 : 0;
  document.getElementById("overall-score").textContent = `Overall Score: ${overall.toFixed(1)}% (${answers.length} questions)`;
  const insightEl = document.getElementById("insight-summary");
  insightEl.textContent =
    timeExpired
      ? "Time is up. Review your weaker areas below and try another attempt with tighter pacing."
      : overall >= 80
        ? "Great command of conditional structures. Keep challenging yourself with mixed-context writing."
        : overall >= 60
          ? "You understand the core patterns. Focus on tense accuracy and if-clause verb forms."
          : "Foundation needs reinforcement. Revisit each conditional pattern and practice sentence transformation.";

  const topicScoresEl = document.getElementById("topic-scores");
  topicScoresEl.innerHTML = "";
  Object.entries(TOPICS).forEach(([topicId, topic]) => {
    const subset = answers.filter((a) => a.topicId === topicId);
    if (!subset.length) return;
    const score = (subset.filter((a) => a.correct).length / subset.length) * 100;
    const row = document.createElement("div");
    row.className = "topic-row";
    row.innerHTML = `${topic.name}: ${score.toFixed(1)}% (${subset.length} questions) <span class="tag" style="background:${topic.color}">${score >= 80 ? "Strong" : score >= 60 ? "Developing" : "Needs Review"}</span>`;
    topicScoresEl.appendChild(row);
  });

  const mistakes = answers.filter((a) => !a.correct);
  const mistakeList = document.getElementById("mistake-list");
  mistakeList.innerHTML = "";
  if (!mistakes.length) {
    mistakeList.innerHTML = "<li>Excellent work — all answers are correct.</li>";
    return;
  }

  mistakes.forEach((m) => {
    const li = document.createElement("li");
    li.textContent = `${m.id}: ${m.text} (Your answer: ${m.userAnswer})`; 
    mistakeList.appendChild(li);
  });

  const typeBarsEl = document.getElementById("type-bars");
  typeBarsEl.innerHTML = "";
  Object.entries(TOPICS).forEach(([topicId, topic]) => {
    const subset = answers.filter((a) => a.topicId === topicId);
    if (!subset.length) return;
    const score = (subset.filter((a) => a.correct).length / subset.length) * 100;
    const row = document.createElement("div");
    row.className = "bar-row";
    row.innerHTML = `
      <div class="bar-label">
        <span>${topic.name}</span>
        <span>${score.toFixed(0)}%</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill" style="width:${score.toFixed(0)}%; background:${topic.color};"></div>
      </div>
    `;
    typeBarsEl.appendChild(row);
  });
}
