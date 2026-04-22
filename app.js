const TOPICS = {
  "topic-zero": { name: "Zero Conditional", color: "#059669" },
  "topic-first": { name: "First Conditional", color: "#2563EB" },
  "topic-second": { name: "Second Conditional", color: "#7C3AED" },
  "topic-third": { name: "Third Conditional", color: "#DC2626" },
};
const TOPIC_PATTERNS = [
  { topicId: "topic-zero", patterns: ["zero conditional"] },
  { topicId: "topic-first", patterns: ["first conditional"] },
  { topicId: "topic-second", patterns: ["second conditional"] },
  { topicId: "topic-third", patterns: ["third conditional"] },
];

const QUESTIONS = [
  { id: "zr1", type: "true-false", topicId: "topic-zero", text: "The sentence 'If you press the power button, the computer turns on.' is a Zero Conditional.", explanation: "If + present simple (press), present simple (turns on)' — this describes an automatic cause-and-effect fact, which is the Zero Conditional structure.", correctAnswer: "true", onCorrect: "f1", onIncorrect: "zr2" },
  { id: "zr2", type: "multiple-choice", topicId: "topic-zero", text: "In Zero Conditional, which tenses are used in BOTH clauses?", explanation: "Zero Conditional always uses present simple in BOTH the if-clause AND the result clause. Example: 'If you mix red and blue, you get purple.' Both 'mix' and 'get' are present simple.", optionA: "Past simple + past simple", optionB: "Present simple + present simple", optionC: "Present simple + will + verb", optionD: "Past simple + would + verb", correctOptionId: "b", onCorrect: "f1", onIncorrect: "z2" },
  { id: "z2", type: "multiple-choice", topicId: "topic-zero", text: "Complete the Zero Conditional: 'If you __ water, it becomes ice.'", explanation: "Freeze' (present simple base form) is correct. Zero Conditional requires present simple in the if-clause. 'Will freeze' belongs to First Conditional; 'froze' and 'would freeze' belong to other types.", optionA: "will freeze", optionB: "froze", optionC: "freeze", optionD: "would freeze", correctOptionId: "c", onCorrect: "f1", onIncorrect: "zr3" },
  { id: "zr3", type: "true-false", topicId: "topic-zero", text: "The sentence 'If you don't water plants, they die.' is grammatically correct as a Zero Conditional.", explanation: "'If + present simple negative (don't water), present simple (die)' — this is a valid Zero Conditional stating a general biological fact.", correctAnswer: "true", onCorrect: "f1", onIncorrect: "zr4" },
  { id: "zr4", type: "error-correction", topicId: "topic-zero", text: "Find and fix the error: 'If you heats metal, it expands.'", explanation: "In Zero Conditional, the if-clause uses present simple. With 'you', use the base form 'heat', not 'heats' (which is for he/she/it). Correct: 'If you heat metal, it expands.'", errorSegment: "heats", correction: "heat", onCorrect: "f1", onIncorrect: "f1" },
  { id: "f1", type: "multiple-choice", topicId: "topic-first", text: "Which sentence is a correctly formed First Conditional?", explanation: "First Conditional uses 'If + present simple, will + base verb' for real future possibilities. Option A incorrectly uses 'will rain' in the if-clause. Option C is Second Conditional; Option D is Third Conditional.", optionA: "If it will rain tomorrow, I stay at home.", optionB: "If it rains tomorrow, I will stay at home.", optionC: "If it rained tomorrow, I would stay at home.", optionD: "If it had rained, I would have stayed at home.", correctOptionId: "b", onCorrect: "sr2", onIncorrect: "fr2" },
  { id: "fr2", type: "multiple-choice", topicId: "topic-first", text: "Which tenses form the First Conditional?", explanation: "First Conditional = 'If + present simple, will + base verb'. Example: 'If she calls, I will answer.' The if-clause uses present simple; the main clause uses will + verb.", optionA: "Past simple + would + verb", optionB: "Present simple + present simple", optionC: "Present simple + will + base verb", optionD: "Past perfect + would have + past participle", correctOptionId: "c", onCorrect: "sr2", onIncorrect: "f2" },
  { id: "f2", type: "true-false", topicId: "topic-first", text: "The sentence 'If you will work hard, you will succeed.' is grammatically correct.", explanation: "NEVER use 'will' in the if-clause of First Conditional. The correct sentence is: 'If you work hard, you will succeed.' The if-clause must use present simple.", correctAnswer: "false", onCorrect: "sr2", onIncorrect: "fr3" },
  { id: "fr3", type: "error-correction", topicId: "topic-first", text: "Find and fix the error: 'If she will call me, I will answer.'", explanation: "Remove 'will' from the if-clause. Use present simple instead: 'calls'. Correct sentence: 'If she calls me, I will answer.' This is a very common error to avoid in First Conditional.", errorSegment: "will call", correction: "calls", onCorrect: "sr2", onIncorrect: "f3" },
  { id: "f3", type: "multiple-choice", topicId: "topic-first", text: "Complete the First Conditional: 'If it __ tomorrow, we will cancel the match.'", explanation: "'Rains' (present simple, 3rd person singular) is correct. In the if-clause of First Conditional, always use present simple. 'Will rain' is the most common mistake — avoid 'will' in the if-clause.", optionA: "will rain", optionB: "rained", optionC: "rains", optionD: "would rain", correctOptionId: "c", onCorrect: "sr2", onIncorrect: "sr2" },
  { id: "sr2", type: "multiple-choice", topicId: "topic-second", text: "Which tenses form the Second Conditional?", explanation: "Second Conditional = 'If + past simple, would + base verb'. Example: 'If she knew the answer, she would tell us.' The past simple in the if-clause signals unreality, NOT past time.", optionA: "Present simple + will + verb", optionB: "Past simple + would + base verb", optionC: "Past perfect + would have + past participle", optionD: "Present perfect + would + verb", correctOptionId: "b", onCorrect: "tr2", onIncorrect: "s2" },
  { id: "s2", type: "true-false", topicId: "topic-second", text: "In Second Conditional, it is more formal and grammatically preferred to use 'were' instead of 'was' for all subjects, including 'I'.", explanation: "In Second Conditional, 'were' is preferred for all subjects: 'If I were you...', 'If he were here...'. While 'was' is common in informal speech, 'were' is the standard in written and formal English.", correctAnswer: "true", onCorrect: "tr2", onIncorrect: "sr3" },
  { id: "sr3", type: "error-correction", topicId: "topic-second", text: "Find and fix the error: 'If I was you, I would apologize immediately.'", explanation: "In Second Conditional, use 'were' for all subjects (not 'was'). Correct: 'If I were you, I would apologize immediately.' The expression 'If I were you' is a fixed phrase meaning 'in your situation'.", errorSegment: "was", correction: "were", onCorrect: "tr2", onIncorrect: "s3" },
  { id: "s3", type: "multiple-choice", topicId: "topic-second", text: "What is wrong with: 'If she knew the answer, she will tell us.'?", explanation: "The if-clause 'If she knew' uses past simple, signalling Second Conditional. The main clause must use 'would', not 'will'. 'Will' is for First Conditional (real future). Correct: 'If she knew the answer, she would tell us.'", optionA: "knew' should be 'know'", optionB: "will tell' should be 'would tell'", optionC: "she' should be 'her'", optionD: "Nothing is wrong", correctOptionId: "b", onCorrect: "tr2", onIncorrect: "sr7" },
  { id: "sr7", type: "multiple-choice", topicId: "topic-second", text: "Which sentence is Second Conditional (imaginary), NOT First Conditional (real)?", explanation: "Option C is Second Conditional — having wings is imaginary/impossible. Options A, B, and D are all First Conditional because they describe genuinely possible future events.", optionA: "If it snows tomorrow, school will be cancelled.", optionB: "If you study, you will improve.", optionC: "If I had wings, I would fly to school.", optionD: "If she calls, I will answer.", correctOptionId: "c", onCorrect: "tr2", onIncorrect: "tr2" },
  { id: "tr2", type: "multiple-choice", topicId: "topic-third", text: "In Third Conditional, what form does the if-clause use?", explanation: "Third Conditional if-clause uses PAST PERFECT: 'had + past participle'. Examples: 'If she had called...', 'If they had arrived...', 'If I had known...'. This past perfect signals we're imagining a different past.", optionA: "Present perfect (has/have + past participle)", optionB: "Past perfect (had + past participle)", optionC: "Past simple", optionD: "Present simple", correctOptionId: "b", onCorrect: "fr1", onIncorrect: "tr4" },
  { id: "tr4", type: "multiple-choice", topicId: "topic-third", text: "Complete the Third Conditional: 'If she __ earlier, she would have caught the flight.'", explanation: "'Had left' (past perfect) is correct for the if-clause of Third Conditional. 'Left' alone is past simple (Second Conditional). 'Would leave' cannot go in the if-clause. 'Has left' is present perfect (wrong).", optionA: "left", optionB: "would leave", optionC: "had left", optionD: "has left", correctOptionId: "c", onCorrect: "fr1", onIncorrect: "t3" },
  { id: "t3", type: "multiple-choice", topicId: "topic-third", text: "What is wrong with: 'If we had booked earlier, we would save money.'?", explanation: "The if-clause 'If we had booked' uses past perfect — Third Conditional. The main clause must use 'would have + past participle': 'would have saved'. Using 'would save' (without 'have') is a very common mistake.", optionA: "'Had booked' should be 'booked'", optionB: "'Would save' should be 'would have saved'", optionC: "'We' should be 'us'", optionD: "Nothing is wrong", correctOptionId: "b", onCorrect: "fr1", onIncorrect: "t4" },
  { id: "t4", type: "error-correction", topicId: "topic-third", text: "Find and fix the error: 'If she had taken the medicine, she would recovered faster.'", explanation: "Third Conditional main clause requires 'would HAVE + past participle'. 'Would recovered' is missing 'have'. Correct: 'If she had taken the medicine, she would have recovered faster.' Never omit 'have' in Third Conditional.", errorSegment: "would recovered", correction: "would have recovered", onCorrect: "fr1", onIncorrect: "tr7" },
  { id: "tr7", type: "multiple-choice", topicId: "topic-third", text: "Which correctly completes this Third Conditional? 'If he had studied the map, he __ lost.'", explanation: "'Wouldn't have been' is correct: 'would not have + past participle (been)'. Option A ('wouldn't be') is Second Conditional. Option B uses 'won't' (wrong — needs 'would'). Option D has wrong form 'had been' after 'wouldn't'.", optionA: "wouldn't be", optionB: "won't have been", optionC: "wouldn't have been", optionD: "wouldn't had been", correctOptionId: "c", onCorrect: "fr1", onIncorrect: "fr1" },
  { id: "fr1", type: "true-false", topicId: "topic-first", text: "The First Conditional describes situations that are impossible or imaginary.", explanation: "First Conditional describes REAL, possible future situations. Example: 'If you study, you will pass.' (It's genuinely possible.) Second Conditional is for imaginary/unlikely situations.", correctAnswer: "false", onCorrect: "t1", onIncorrect: "t1" },
  { id: "t1", type: "multiple-choice", topicId: "topic-third", text: "Which one is uesd to talk about situations that actually happened in the past?", explanation: "Third Conditional uses 'If + past perfect (had + past participle), would have + past participle' for imaginary changes to past situations. Option A is First; Option B is Second; Option D mixes tenses incorrectly.", optionA: "If I study hard, I will pass.", optionB: "If I studied hard, I would pass.", optionC: "If I had studied hard, I would have passed.", optionD: "If I have studied hard, I will have passed.", correctOptionId: "c", onCorrect: "sr1", onIncorrect: "sr1" },
  { id: "sr1", type: "true-false", topicId: "topic-second", text: "Second Conditional describes situations that are real and likely to happen in the future.", explanation: "Second Conditional describes IMAGINARY or UNLIKELY situations. Example: 'If I were a bird, I would fly.' (You're not a bird — it's imaginary.)", correctAnswer: "false" },
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
const bonusNoteEl = document.getElementById("bonus-note");
const submitBtn = document.getElementById("submit-btn");
const nextBtn = document.getElementById("next-btn");
const reviewBtn = document.getElementById("review-btn");
const startBtn = document.getElementById("start-btn");
const homeCard = document.getElementById("home-card");
const timerEl = document.getElementById("timer");
const quizCard = document.getElementById("quiz-card");
const resultCard = document.getElementById("result-card");
const reviewCard = document.getElementById("review-card");
const reviewListEl = document.getElementById("review-list");

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

function inferTopicIdFromContent(question) {
  const haystack = normalizeText(`${question.text || ""} ${question.explanation || ""}`);
  for (const rule of TOPIC_PATTERNS) {
    if (rule.patterns.some((p) => haystack.includes(p))) {
      return rule.topicId;
    }
  }
  return question.topicId;
}

function formatAnswerForDisplay(question, userAnswer) {
  if (!userAnswer) return "(no answer)";
  if (question.type === "multiple-choice") {
    const key = `option${String(userAnswer).toUpperCase()}`;
    const optionText = question[key];
    return optionText ? `${String(userAnswer).toUpperCase()}: ${optionText}` : String(userAnswer).toUpperCase();
  }
  return userAnswer;
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
  if (BONUS_IDS.has(q.id)) {
    const inferredTopicId = inferTopicIdFromContent(q);
    bonusNoteEl.textContent = `⭐ Bonus Question (${TOPICS[inferredTopicId]?.name ?? "Mixed"}): extra challenge credit.`;
    bonusNoteEl.classList.remove("hidden");
  } else {
    bonusNoteEl.classList.add("hidden");
  }
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
    topicId: inferTopicIdFromContent(currentQuestion),
    originalTopicId: currentQuestion.topicId,
    correct,
    userAnswer,
    userAnswerText: formatAnswerForDisplay(currentQuestion, userAnswer),
    questionType: currentQuestion.type,
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
  } else {
    mistakes.forEach((m) => {
      const li = document.createElement("li");
      li.textContent = `${m.id}: ${m.text} (Your answer: ${m.userAnswer})`; 
      mistakeList.appendChild(li);
    });
  }

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

function renderReviewList() {
  reviewListEl.innerHTML = "";
  answers.forEach((a, idx) => {
    const item = document.createElement("div");
    item.className = "review-item";
    item.innerHTML = `
      <h4>${idx + 1}. ${a.id} · ${TOPICS[a.topicId]?.name ?? a.topicId}</h4>
      <p class="review-meta"><strong>Question:</strong> ${a.text}</p>
      <p class="review-meta"><strong>Your answer:</strong> ${a.userAnswerText}</p>
      <p class="review-meta"><strong>Status:</strong> ${a.correct ? "Correct" : "Incorrect"}</p>
      <p class="review-meta"><strong>Explanation:</strong> ${a.explanation}</p>
    `;
    reviewListEl.appendChild(item);
  });
}

reviewBtn.addEventListener("click", () => {
  resultCard.classList.add("hidden");
  reviewCard.classList.remove("hidden");
  renderReviewList();
});
