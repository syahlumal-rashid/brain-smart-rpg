// ============================================================================
// BRAIN SMART RPG v3.0 — MINI-GAME & QUIZ BATTLE ENGINE (js/minigames.js)
// Implements GDD Section 8 & 9: 5 Rounds, 10-20s Timer, +100/+50/+100 Scoring,
// Solo Practice, Local 2-Player (Shared Screen), Boss Challenge, Ranked 1v1, Tournament
// ============================================================================

window.MiniGameEngine = (function () {
  let state = {
    active: false,
    battleMode: "ranked", // "solo" | "local2p" | "boss" | "ranked" | "friendly" | "tournament" | "classroom"
    miniGameId: "quick_answer",
    levelFilter: "all",
    subjectFilter: "all",
    totalRounds: 5,
    currentRound: 0,
    timePerRound: 15,
    timeLeft: 15,
    timerId: null,
    aiTimeoutId: null,
    questions: [],
    p1: { name: "Player 1", score: 0, correctCount: 0, answered: false, correct: false, timeUsed: 0 },
    p2: { name: "Rival", score: 0, correctCount: 0, answered: false, correct: false, timeUsed: 0 },
    fastestClaimed: false,
    bossHP: 100,
    tournamentStage: 1, // 1: Perempat Final, 2: Semifinal, 3: Grand Final
    classroomActivityId: null
  };

  function startMatch(config) {
    clearTimers();
    const profile = window.App.getProfile();

    state.active = true;
    state.battleMode = config.battleMode || "ranked";
    state.miniGameId = config.miniGameId || "quick_answer";
    state.levelFilter = config.levelFilter || profile.educationLevel || "all";
    state.subjectFilter = config.subjectFilter || "all";
    state.totalRounds = 5;
    state.currentRound = 0;
    state.timePerRound = config.timePerRound || 15;
    state.bossHP = 100;
    state.classroomActivityId = config.classroomActivityId || null;

    state.p1 = { name: profile.name || "Siswa", score: 0, correctCount: 0, answered: false, correct: false };

    let oppName = "Bot Cerdas";
    if (state.battleMode === "local2p") oppName = "Pemain 2 (Lokal)";
    else if (state.battleMode === "boss") oppName = "Boss: Shadow Ignoramus";
    else if (state.battleMode === "ranked") oppName = pickRandomOpponentName(profile.rankRP);
    else if (state.battleMode === "friendly") oppName = "Teman Room #" + (config.roomCode || "8821");
    else if (state.battleMode === "tournament") {
      const stages = ["Perempat Final: Kevin", "Semifinal: Aurelia", "Grand Final: Grandmaster Raka"];
      oppName = stages[(state.tournamentStage - 1) % 3];
    } else if (state.battleMode === "solo" || state.battleMode === "classroom") {
      oppName = "Target Latihan";
    }

    state.p2 = { name: oppName, score: 0, correctCount: 0, answered: false, correct: false };

    // Filter Question Pool
    state.questions = buildQuestionSet(state.miniGameId, state.levelFilter, state.subjectFilter, 5);

    window.App.showScreen("screen-active-match");
    renderMatchHeader();
    nextRound();
  }

  function pickRandomOpponentName(rp) {
    const names = ["Rizky_SMP8", "Alya_Olimpiade", "Naufal_SMA1", "Devina_RPL", "Bima_Genius", "Putri_Sains", "Bagas_Math"];
    return names[Math.floor(Math.random() * names.length)];
  }

  function buildQuestionSet(miniGameId, levelFilter, subjectFilter, count) {
    let pool = [...(window.GAME_DATA.questions || [])];

    // Mini-game specific category filter
    if (miniGameId === "math_race") {
      const mathPool = pool.filter((q) => q.category === "Math");
      if (mathPool.length >= 3) pool = mathPool;
    } else if (miniGameId === "word_battle") {
      const wordPool = pool.filter((q) => q.wordHint && q.wordTarget);
      if (wordPool.length >= 3) pool = wordPool;
    } else if (miniGameId === "history_quiz") {
      const histPool = pool.filter((q) => q.category === "History");
      if (histPool.length >= 3) pool = histPool;
    } else if (miniGameId === "tech_challenge") {
      const techPool = pool.filter((q) => q.category === "Tech");
      if (techPool.length >= 3) pool = techPool;
    } else if (miniGameId === "science_challenge") {
      const sciPool = pool.filter((q) => q.category === "Science");
      if (sciPool.length >= 3) pool = sciPool;
    }

    if (levelFilter && levelFilter !== "all" && levelFilter !== "teacher") {
      const byLevel = pool.filter((q) => q.level === levelFilter);
      if (byLevel.length >= 3) pool = byLevel;
    }

    if (subjectFilter && subjectFilter !== "all") {
      const bySub = pool.filter((q) => q.subject && q.subject.toLowerCase().includes(subjectFilter.toLowerCase()));
      if (bySub.length >= 2) pool = bySub;
    }

    // Shuffle and pick
    const shuffled = pool.sort(() => Math.random() - 0.5);
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(shuffled[i % shuffled.length]);
    }
    return result;
  }

  function nextRound() {
    clearTimers();
    if (state.currentRound >= state.totalRounds) {
      finishMatch();
      return;
    }

    state.currentRound++;
    state.timeLeft = state.timePerRound;
    state.fastestClaimed = false;
    state.p1.answered = false;
    state.p2.answered = false;

    const qObj = state.questions[state.currentRound - 1];
    renderRoundUI(qObj);

    // Start 1-second timer tick
    state.timerId = setInterval(() => {
      state.timeLeft--;
      updateTimerDisplay();
      if (state.timeLeft <= 0) {
        clearTimers();
        revealRoundOutcome(qObj, true);
      }
    }, 1000);

    // Schedule AI answer if against AI
    if (state.battleMode !== "local2p" && state.battleMode !== "solo" && state.battleMode !== "classroom") {
      const aiDelayMs = (3.5 + Math.random() * 5.5) * 1000;
      state.aiTimeoutId = setTimeout(() => {
        if (!state.active || state.p2.answered) return;
        const aiCorrect = Math.random() < 0.72;
        processPlayerAnswer(2, aiCorrect ? getCorrectAnswerValue(qObj) : -999, qObj);
      }, aiDelayMs);
    }
  }

  function getCorrectAnswerValue(qObj) {
    if (!qObj) return 0;
    if (state.miniGameId === "true_false") return qObj.tfAnswer;
    return qObj.a;
  }

  function renderMatchHeader() {
    const mg = window.GAME_DATA.miniGames.find((m) => m.id === state.miniGameId) || window.GAME_DATA.miniGames[0];
    const titleEl = document.getElementById("match-mode-title");
    const p1NameEl = document.getElementById("match-p1-name");
    const p2NameEl = document.getElementById("match-p2-name");
    if (titleEl) titleEl.textContent = `${mg.icon || "⚔️"} ${mg.name || "Quiz Battle"} — ${state.battleMode.toUpperCase()}`;
    if (p1NameEl) p1NameEl.textContent = state.p1.name;
    if (p2NameEl) p2NameEl.textContent = state.p2.name;
    updateScoreHUD();
  }

  function updateScoreHUD() {
    const p1ScoreEl = document.getElementById("match-p1-score");
    const p2ScoreEl = document.getElementById("match-p2-score");
    const roundEl = document.getElementById("match-round-badge") || document.getElementById("match-round-text");
    if (p1ScoreEl) p1ScoreEl.textContent = state.p1.score;
    if (p2ScoreEl) p2ScoreEl.textContent = state.p2.score;
    if (roundEl) roundEl.textContent = `Ronde ${state.currentRound} / ${state.totalRounds}`;

    // Special Visual Track for Math Race or Boss HP Bar
    const specialBar = document.getElementById("match-special-visual");
    if (specialBar) {
      if (state.battleMode === "boss") {
        specialBar.style.display = "block";
        specialBar.innerHTML = `
          <div class="boss-bar-wrap">
            <div class="boss-label">👹 BOSS: SHADOW IGNORAMUS — HP: ${Math.max(0, state.bossHP)}%</div>
            <div class="boss-hp-track"><div class="boss-hp-fill" style="width:${Math.max(0, state.bossHP)}%"></div></div>
          </div>`;
      } else if (state.miniGameId === "math_race") {
        const p1Pct = Math.min(92, (state.p1.correctCount / 5) * 85 + 8);
        const p2Pct = Math.min(92, (state.p2.correctCount / 5) * 85 + 8);
        specialBar.style.display = "block";
        specialBar.innerHTML = `
          <div class="race-track-box">
            <div class="race-lane"><span class="race-runner" style="left:${p1Pct}%">🏎️ ${state.p1.name}</span></div>
            <div class="race-lane"><span class="race-runner p2" style="left:${p2Pct}%">🚀 ${state.p2.name}</span></div>
          </div>`;
      } else {
        specialBar.style.display = "none";
      }
    }
  }

  function updateTimerDisplay() {
    const timerEl = document.getElementById("match-timer-text") || document.getElementById("match-timer-box");
    const fillEl = document.getElementById("match-timer-fill");
    if (timerEl) timerEl.textContent = `${state.timeLeft}d`;
    if (fillEl) {
      const pct = Math.max(0, (state.timeLeft / state.timePerRound) * 100);
      fillEl.style.width = `${pct}%`;
      fillEl.style.background = state.timeLeft <= 5 ? "#EF4444" : "#22C55E";
    }
  }

  function renderRoundUI(qObj) {
    updateScoreHUD();
    updateTimerDisplay();

    const feedbackEl = document.getElementById("match-feedback-banner");
    if (feedbackEl) feedbackEl.style.display = "none";

    const arenaEl = document.getElementById("match-arena-body") || document.getElementById("match-interactive-area");
    if (!arenaEl || !qObj) return;

    // 1. LOCAL 2-PLAYER SPLIT SCREEN MODE
    if (state.battleMode === "local2p") {
      arenaEl.innerHTML = `
        <div class="question-card-main">
          <span class="q-meta-pill">${qObj.subject || "Umum"} • ${(qObj.level || "SD").toUpperCase()}</span>
          <h3>${qObj.q}</h3>
        </div>
        <div class="local2p-split-grid">
          <div class="local2p-panel p1-side" id="local-p1-pad">
            <h4>🟦 ${state.p1.name}</h4>
            <div class="options-grid-compact">
              ${(qObj.options || []).map((opt, idx) => `
                <button class="btn-opt p1-opt" onclick="MiniGameEngine.answerLocal2P(1, ${idx})">
                  <strong>${String.fromCharCode(65 + idx)}.</strong> ${opt}
                </button>
              `).join("")}
            </div>
          </div>
          <div class="local2p-panel p2-side" id="local-p2-pad">
            <h4>🟧 ${state.p2.name}</h4>
            <div class="options-grid-compact">
              ${(qObj.options || []).map((opt, idx) => `
                <button class="btn-opt p2-opt" onclick="MiniGameEngine.answerLocal2P(2, ${idx})">
                  <strong>${String.fromCharCode(65 + idx)}.</strong> ${opt}
                </button>
              `).join("")}
            </div>
          </div>
        </div>
      `;
      return;
    }

    // 2. TRUE OR FALSE MINI-GAME
    if (state.miniGameId === "true_false") {
      arenaEl.innerHTML = `
        <div class="question-card-main">
          <span class="q-meta-pill">⚖️ TRUE OR FALSE • ${qObj.subject || "Umum"}</span>
          <h3>"${qObj.tfStatement || qObj.q}"</h3>
          <p class="q-sub-hint">Tentukan apakah pernyataan di atas BENAR atau SALAH!</p>
        </div>
        <div class="tf-buttons-row">
          <button class="btn-tf btn-true" onclick="MiniGameEngine.submitAnswer(true)">✅ BENAR (TRUE)</button>
          <button class="btn-tf btn-false" onclick="MiniGameEngine.submitAnswer(false)">❌ SALAH (FALSE)</button>
        </div>
      `;
      return;
    }

    // 3. WORD BATTLE MINI-GAME
    if (state.miniGameId === "word_battle") {
      const target = qObj.wordTarget || "BELAJAR";
      const masked = target.split("").map((ch, i) => (i === 0 || i === target.length - 1 ? ch : "_")).join(" ");
      const distractors = ["PROKLAMASI", "ALJABAR", "EKUATOR", "FOTOSINTESIS", "KALKULUS", "BINER"]
        .filter((w) => w !== target)
        .slice(0, 3);
      const wordChoices = [target, ...distractors].sort(() => Math.random() - 0.5);

      arenaEl.innerHTML = `
        <div class="question-card-main">
          <span class="q-meta-pill">🔤 WORD BATTLE • ${qObj.subject || "Bahasa"}</span>
          <h3>Petunjuk: "${qObj.wordHint || qObj.q}"</h3>
          <div class="word-mask-box">${masked}</div>
        </div>
        <div class="options-grid-2x2">
          ${wordChoices.map((w) => `
            <button class="btn-opt" onclick="MiniGameEngine.submitWordAnswer('${w}', '${target}')">
              🔤 ${w}
            </button>
          `).join("")}
        </div>
      `;
      return;
    }

    // 4. MEMORY CHALLENGE MINI-GAME
    if (state.miniGameId === "memory_cards" || state.miniGameId === "memory_challenge") {
      arenaEl.innerHTML = `
        <div class="question-card-main memory-flash-card" id="mem-flash-box">
          <span class="q-meta-pill">🧠 MEMORY CHALLENGE — INGAT FAKTA INI (2 DETIK)!</span>
          <h3 style="color:#FACC15">💡 KUNCI INGATAN: "${qObj.options[qObj.a]}"</h3>
          <p>Pertanyaan akan muncul sesaat lagi...</p>
        </div>
        <div id="mem-question-area" style="display:none">
          <div class="question-card-main">
            <span class="q-meta-pill">🧠 MEMORY CHALLENGE • ${qObj.subject || "Umum"}</span>
            <h3>${qObj.q}</h3>
          </div>
          <div class="options-grid-2x2">
            ${(qObj.options || []).map((opt, idx) => `
              <button class="btn-opt" onclick="MiniGameEngine.submitAnswer(${idx})">
                <span class="opt-letter">${String.fromCharCode(65 + idx)}</span> ${opt}
              </button>
            `).join("")}
          </div>
        </div>
      `;
      setTimeout(() => {
        const fb = document.getElementById("mem-flash-box");
        const qa = document.getElementById("mem-question-area");
        if (fb && qa) {
          fb.style.display = "none";
          qa.style.display = "block";
        }
      }, 1800);
      return;
    }

    // 5. DEFAULT: QUICK ANSWER / MATH RACE / GENERAL QUIZ
    arenaEl.innerHTML = `
      <div class="question-card-main">
        <span class="q-meta-pill">${qObj.subject || "Umum"} • Jenjang ${(qObj.level || "SD").toUpperCase()}</span>
        <h3>${qObj.q}</h3>
      </div>
      <div class="options-grid-2x2">
        ${(qObj.options || []).map((opt, idx) => `
          <button class="btn-opt" onclick="MiniGameEngine.submitAnswer(${idx})">
            <span class="opt-letter">${String.fromCharCode(65 + idx)}</span> ${opt}
          </button>
        `).join("")}
      </div>
    `;
  }

  function submitWordAnswer(chosen, target) {
    const qObj = state.questions[state.currentRound - 1];
    const isCorrect = chosen === target;
    processPlayerAnswer(1, isCorrect ? getCorrectAnswerValue(qObj) : -999, qObj);
  }

  function submitAnswer(choiceVal) {
    const qObj = state.questions[state.currentRound - 1];
    processPlayerAnswer(1, choiceVal, qObj);
  }

  function answerLocal2P(playerNum, choiceIdx) {
    const qObj = state.questions[state.currentRound - 1];
    processPlayerAnswer(playerNum, choiceIdx, qObj);
  }

  function processPlayerAnswer(playerNum, choiceVal, qObj) {
    const p = playerNum === 1 ? state.p1 : state.p2;
    if (p.answered) return;

    p.answered = true;
    const expected = getCorrectAnswerValue(qObj);
    const isCorrect = choiceVal === expected;
    p.correct = isCorrect;

    let pointsEarned = 0;
    let fastestBonus = 0;

    if (isCorrect) {
      pointsEarned = 100;
      p.correctCount++;
      if (!state.fastestClaimed) {
        state.fastestClaimed = true;
        fastestBonus = 50;
      }
      p.score += pointsEarned + fastestBonus;

      if (playerNum === 1) {
        window.App.playSFX("correct");
        if (state.battleMode === "boss") {
          state.bossHP = Math.max(0, state.bossHP - 25);
        }
      }
    } else if (playerNum === 1) {
      window.App.playSFX("wrong");
    }

    // Lock visually in Local 2P
    if (state.battleMode === "local2p") {
      const padId = playerNum === 1 ? "local-p1-pad" : "local-p2-pad";
      const padEl = document.getElementById(padId);
      if (padEl) {
        padEl.innerHTML = `<div class="locked-answer-msg">${p.name} sudah mengunci jawaban! ${isCorrect ? "✅ (+100" + (fastestBonus ? " +50 Cepat!" : "") + ")" : "❌ (0 Poin)"}</div>`;
      }
      if (state.p1.answered && state.p2.answered) {
        clearTimers();
        revealRoundOutcome(qObj, false);
      }
      updateScoreHUD();
      return;
    }

    // In 1P/Online modes, once Player 1 answers, resolve AI if needed and show explanation
    if (playerNum === 1) {
      if (!state.p2.answered && state.battleMode !== "solo" && state.battleMode !== "classroom") {
        const aiCorrect = Math.random() < 0.65;
        state.p2.answered = true;
        if (aiCorrect) {
          state.p2.correctCount++;
          const aiFastest = !state.fastestClaimed ? 50 : 0;
          state.fastestClaimed = true;
          state.p2.score += 100 + aiFastest;
        }
      }
      clearTimers();
      revealRoundOutcome(qObj, false, pointsEarned, fastestBonus);
    }

    updateScoreHUD();
  }

  function revealRoundOutcome(qObj, timedOut, p1Base = 0, p1Fast = 0) {
    const feedbackEl = document.getElementById("match-feedback-banner");
    if (feedbackEl) {
      feedbackEl.style.display = "block";
      let titleMsg = "";
      if (timedOut && !state.p1.answered) {
        titleMsg = "⏰ Waktu Habis! (+0 Poin)";
        feedbackEl.className = "match-feedback-banner wrong";
      } else if (state.p1.correct) {
        titleMsg = `✅ Jawaban Benar! +${p1Base} Poin ${p1Fast > 0 ? "⚡ +50 Bonus Tercepat!" : ""}`;
        feedbackEl.className = "match-feedback-banner correct";
      } else {
        titleMsg = "❌ Jawaban Kurang Tepat (+0 Poin)";
        feedbackEl.className = "match-feedback-banner wrong";
      }

      feedbackEl.innerHTML = `
        <strong>${titleMsg}</strong>
        <div class="explain-line">💡 Pembahasan: ${qObj.explain || (qObj.options && qObj.options[qObj.a]) || ""}</div>
      `;
    }

    setTimeout(() => {
      if (state.active) nextRound();
    }, 2200);
  }

  function finishMatch() {
    clearTimers();
    state.active = false;

    // Perfect Round Bonus (+100 if all 5 rounds correct)
    let p1PerfectBonus = 0;
    if (state.p1.correctCount === state.totalRounds) {
      p1PerfectBonus = 100;
      state.p1.score += 100;
    }

    const isSolo = state.battleMode === "solo" || state.battleMode === "classroom";
    const p1Won = isSolo ? state.p1.correctCount >= 3 : state.p1.score >= state.p2.score;

    // Calculate Rewards
    const goldEarned = p1Won ? 85 + state.p1.correctCount * 15 : 30 + state.p1.correctCount * 10;
    const expEarned = p1Won ? 90 + state.p1.correctCount * 15 : 45 + state.p1.correctCount * 10;
    let rpDelta = 0;
    if (state.battleMode === "ranked") {
      rpDelta = p1Won ? 35 : -15;
    }

    // Record stats into App Profile
    window.App.recordMatchResult({
      won: p1Won,
      battleMode: state.battleMode,
      miniGameId: state.miniGameId,
      correctCount: state.p1.correctCount,
      p1Correct: state.p1.correctCount,
      totalRounds: state.totalRounds,
      perfect: p1PerfectBonus > 0,
      goldEarned,
      expEarned,
      rpDelta,
      score: state.p1.score,
      p1Score: state.p1.score,
      questions: state.questions,
      classroomActivityId: state.classroomActivityId
    });

    window.App.playSFX(p1Won ? "victory" : "correct");

    // Render Result Modal directly in match arena body
    const resBox = document.getElementById("match-arena-body") || document.getElementById("match-interactive-area");
    if (resBox) {
      resBox.innerHTML = `
        <div class="match-result-card">
          <div class="result-trophy">${p1Won ? "🏆 VICTORY!" : "💪 GOOD EFFORT!"}</div>
          <h2>${state.p1.name}: ${state.p1.score} Poin ${!isSolo ? ` vs ${state.p2.name}: ${state.p2.score} Poin` : ""}</h2>
          <p class="result-breakdown">
            Jawaban Benar: <strong>${state.p1.correctCount}/${state.totalRounds}</strong>
            ${p1PerfectBonus > 0 ? ` • 🌟 <strong>Perfect Round Bonus: +100 Poin!</strong>` : ""}
          </p>
          <div class="reward-pills-row">
            <span class="reward-pill gold">🪙 +${goldEarned} Gold Coin</span>
            <span class="reward-pill exp">⭐ +${expEarned} EXP</span>
            ${state.battleMode === "ranked" ? `<span class="reward-pill rank">🏆 ${rpDelta >= 0 ? "+" + rpDelta : rpDelta} RP</span>` : ""}
          </div>
          <div class="result-actions-row">
            <button class="btn-primary" onclick="MiniGameEngine.rematch()">🔄 Main Lagi</button>
            <button class="btn-secondary" onclick="App.showScreen('screen-lobby')">🏠 Kembali ke Lobby</button>
          </div>
        </div>
      `;
    }
  }

  function rematch() {
    startMatch({
      battleMode: state.battleMode,
      miniGameId: state.miniGameId,
      levelFilter: state.levelFilter,
      subjectFilter: state.subjectFilter
    });
  }

  function quitMatch() {
    clearTimers();
    state.active = false;
    window.App.showScreen("screen-lobby");
  }

  function clearTimers() {
    if (state.timerId) clearInterval(state.timerId);
    if (state.aiTimeoutId) clearTimeout(state.aiTimeoutId);
    state.timerId = null;
    state.aiTimeoutId = null;
  }

  return {
    startMatch,
    submitAnswer,
    submitWordAnswer,
    answerLocal2P,
    rematch,
    quitMatch
  };
})();
