// ============================================================================
// BRAIN SMART RPG v3.0 — CORE APPLICATION CONTROLLER (js/app.js)
// State Management, RPG Progression, Web Audio Synthesizer,
// Wardrobe/Shop, HUD & Screen Router, Touch Controls, Proximity Handler
// ============================================================================

window.App = (function () {
  const STORAGE_KEY = "bsrpg_profile_v3";

  // Default Player Profile
  const defaultProfile = {
    name: "Siswa Juara",
    gender: "boy",
    educationLevel: "sd", // "sd" | "smp" | "sma" | "smk" | "univ"
    grade: "Kelas 5",
    level: 1,
    exp: 0,
    nextExp: 200,
    coins: 500,
    diamonds: 50,
    rankRP: 120,
    rankTier: "Bronze I",
    equipped: {
      skin: "skin_default",
      uniform: "skin_default",
      hair: "hair_short_black",
      hat: "none",
      bag: "bag_backpack_blue",
      pet: "pet_none",
      title: "title_newbie",
      frame: "frame_basic"
    },
    inventory: [
      "skin_default",
      "frame_basic",
      "emote_wave",
      "title_newbie",
      "pet_none"
    ],
    badges: ["first_victory"],
    stats: {
      matches: 0,
      wins: 0,
      losses: 0,
      streak: 0,
      bestStreak: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      bossDefeated: 0,
      tournamentsWon: 0,
      perfectCount: 0,
      classroomDone: 0,
      locationsVisited: 1
    },
    questsProgress: {
      dq_win2: 0,
      dq_solve10: 0,
      dq_minigame1: 0,
      dq_academy1: 0,
      wq_win10: 0,
      wq_solve50: 0,
      wq_badge3: 1,
      wq_boss5: 0
    },
    claimedQuests: [],
    settings: {
      bgm: true,
      sfx: true,
      volume: 0.7
    }
  };

  let profile = null;
  let currentScreen = "screen-lobby";
  let audioCtx = null;
  let bgmOsc = null;
  let bgmGain = null;
  let bgmPlaying = false;
  let currentInteractingLocation = null;

  // ==========================================================================
  // 1. INITIALIZATION & STORAGE
  // ==========================================================================
  function init() {
    loadProfile();
    initAudio();
    initDOMListeners();
    initVirtualJoystick();

    // Initialize 3D Engine & Classroom
    if (window.World3D) {
      window.World3D.init("canvas-wrapper");
      window.World3D.updateCharacterAppearance(profile);
    }

    if (window.ClassroomSystem) {
      window.ClassroomSystem.init();
    }

    updateHUD();
    showScreen("screen-lobby");
    notify(`Selamat datang di Brain Smart RPG v3.0, ${profile.name}! 🎓`, "info");
  }

  function loadProfile() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        profile = JSON.parse(saved);
        profile = Object.assign({}, defaultProfile, profile);
        if (!profile.equipped) profile.equipped = Object.assign({}, defaultProfile.equipped);
        if (!profile.inventory) profile.inventory = [...defaultProfile.inventory];
        if (!profile.badges) profile.badges = [...defaultProfile.badges];
        if (!profile.stats) profile.stats = Object.assign({}, defaultProfile.stats);
        if (!profile.questsProgress) profile.questsProgress = Object.assign({}, defaultProfile.questsProgress);
        if (!profile.claimedQuests) profile.claimedQuests = [];
        if (!profile.settings) profile.settings = Object.assign({}, defaultProfile.settings);
      } catch (e) {
        console.error("Gagal load profile, reset ke default:", e);
        profile = JSON.parse(JSON.stringify(defaultProfile));
      }
    } else {
      profile = JSON.parse(JSON.stringify(defaultProfile));
      saveProfile();
    }
  }

  function saveProfile() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }

  function getProfile() {
    return profile;
  }

  // ==========================================================================
  // 2. WEB AUDIO SYNTHESIZER
  // ==========================================================================
  function initAudio() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }

  function ensureAudioUnlocked() {
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
    if (profile && profile.settings && profile.settings.bgm && !bgmPlaying) {
      startBGM();
    }
  }

  function playSFX(type) {
    if (!profile || !profile.settings || !profile.settings.sfx || !audioCtx) return;
    try {
      if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
      const now = audioCtx.currentTime;

      if (type === "click") {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.06);
        gain.gain.setValueAtTime(0.2 * profile.settings.volume, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.06);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
      } else if (type === "correct") {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          const noteTime = now + idx * 0.07;
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, noteTime);
          gain.gain.setValueAtTime(0.25 * profile.settings.volume, noteTime);
          gain.gain.linearRampToValueAtTime(0.001, noteTime + 0.14);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(noteTime);
          osc.stop(noteTime + 0.15);
        });
      } else if (type === "wrong") {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.25);
        gain.gain.setValueAtTime(0.3 * profile.settings.volume, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.28);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === "coin") {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(987.77, now);
        osc.frequency.setValueAtTime(1318.51, now + 0.08);
        gain.gain.setValueAtTime(0.28 * profile.settings.volume, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.32);
      } else if (type === "victory") {
        const fanNotes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
        fanNotes.forEach((f, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          const t = now + i * 0.12;
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, t);
          gain.gain.setValueAtTime(0.3 * profile.settings.volume, t);
          gain.gain.linearRampToValueAtTime(0.01, t + (i === 4 ? 0.6 : 0.18));
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(t);
          osc.stop(t + (i === 4 ? 0.65 : 0.2));
        });
      } else if (type === "level_up") {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.4);
        gain.gain.setValueAtTime(0.25 * profile.settings.volume, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.52);
      }
    } catch (e) {
      console.warn("Audio SFX Error:", e);
    }
  }

  function startBGM() {
    if (!audioCtx || bgmPlaying || !profile.settings.bgm) return;
    try {
      bgmOsc = audioCtx.createOscillator();
      bgmGain = audioCtx.createGain();
      bgmOsc.type = "sine";

      const notes = [261.63, 329.63, 392.0, 329.63, 220.0, 261.63, 329.63, 261.63];
      let step = 0;

      const scheduleLoop = () => {
        if (!bgmPlaying || !bgmOsc) return;
        const now = audioCtx.currentTime;
        bgmOsc.frequency.setValueAtTime(notes[step % notes.length], now);
        step++;
        setTimeout(scheduleLoop, 450);
      };

      bgmGain.gain.setValueAtTime(0.03 * profile.settings.volume, audioCtx.currentTime);
      bgmOsc.connect(bgmGain);
      bgmGain.connect(audioCtx.destination);
      bgmOsc.start();
      bgmPlaying = true;
      scheduleLoop();
    } catch (e) {
      console.warn("BGM startup error:", e);
    }
  }

  function stopBGM() {
    bgmPlaying = false;
    if (bgmOsc) {
      try {
        bgmOsc.stop();
        bgmOsc.disconnect();
      } catch (e) {}
      bgmOsc = null;
    }
  }

  function toggleBGM() {
    profile.settings.bgm = !profile.settings.bgm;
    saveProfile();
    if (profile.settings.bgm) {
      startBGM();
      notify("Musik Latar (BGM) Aktif 🎵", "info");
    } else {
      stopBGM();
      notify("Musik Latar (BGM) Dimatikan 🔇", "info");
    }
    updateSettingsModalUI();
  }

  // ==========================================================================
  // 3. SCREEN ROUTING & VIEW CONTROLLER
  // ==========================================================================
  function showScreen(screenId) {
    ensureAudioUnlocked();
    const screens = document.querySelectorAll(".app-screen");
    screens.forEach((s) => s.classList.remove("active"));

    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add("active");
      currentScreen = screenId;
    }

    const canvasWrap = document.getElementById("canvas-wrapper");
    const mobileControls = document.getElementById("mobile-adventure-controls");

    if (screenId === "screen-lobby") {
      if (canvasWrap) canvasWrap.style.display = "block";
      if (mobileControls) mobileControls.style.display = "none";
      if (window.World3D) window.World3D.setMode("lobby");
    } else if (screenId === "screen-adventure") {
      if (canvasWrap) canvasWrap.style.display = "block";
      if (mobileControls) mobileControls.style.display = "flex";
      if (window.World3D) window.World3D.setMode("adventure");
      renderAdventureHUD();
    } else {
      if (canvasWrap) canvasWrap.style.display = "none";
      if (mobileControls) mobileControls.style.display = "none";
    }

    // Trigger Screen Specific Renderers
    if (screenId === "screen-classroom" && window.ClassroomSystem) {
      window.ClassroomSystem.renderClassroomScreen();
    } else if (screenId === "screen-shop") {
      renderShopScreen();
    } else if (screenId === "screen-inventory") {
      renderInventoryScreen();
    } else if (screenId === "screen-quests") {
      renderQuestsScreen();
    } else if (screenId === "screen-leaderboard") {
      renderLeaderboardScreen();
    } else if (screenId === "screen-profile") {
      renderProfileScreen();
    } else if (screenId === "screen-battle-select") {
      renderBattleSelectScreen();
    }

    updateHUD();
    playSFX("click");
    window.scrollTo(0, 0);
  }

  // ==========================================================================
  // 4. HUD, STATS & RPG LEVELING
  // ==========================================================================
  function updateHUD() {
    const nameEl = document.getElementById("hud-player-name");
    const levelEl = document.getElementById("hud-player-level");
    const expBarEl = document.getElementById("hud-exp-bar");
    const expTextEl = document.getElementById("hud-exp-text");
    const coinsEl = document.getElementById("hud-player-coins");
    const diamondsEl = document.getElementById("hud-player-diamonds");
    const rankBadgeEl = document.getElementById("hud-rank-badge");
    const rankTierEl = document.getElementById("hud-rank-tier");
    const avatarIconEl = document.getElementById("hud-player-avatar");

    if (nameEl) nameEl.textContent = profile.name;
    if (levelEl) levelEl.textContent = `Lv. ${profile.level}`;

    const expPercent = Math.min(100, Math.floor((profile.exp / profile.nextExp) * 100));
    if (expBarEl) expBarEl.style.width = `${expPercent}%`;
    if (expTextEl) expTextEl.textContent = `${profile.exp} / ${profile.nextExp} EXP`;

    if (coinsEl) coinsEl.textContent = (profile.coins || 0).toLocaleString();
    if (diamondsEl) diamondsEl.textContent = (profile.diamonds || 0).toLocaleString();

    const currentRank = calculateRankTier(profile.rankRP || 0);
    profile.rankTier = currentRank.name;
    if (rankBadgeEl) rankBadgeEl.textContent = currentRank.icon;
    if (rankTierEl) {
      rankTierEl.textContent = currentRank.name;
      rankTierEl.style.color = currentRank.color;
    }

    if (avatarIconEl) {
      avatarIconEl.textContent = profile.gender === "girl" ? "👧" : "👦";
    }
  }

  function calculateRankTier(rp) {
    const ranks = window.GAME_DATA.ranks || [];
    let current = ranks[0] || { name: "Bronze I", icon: "🥉", color: "#f59e0b" };
    for (let r of ranks) {
      if (rp >= r.minRP) {
        current = r;
      }
    }
    return current;
  }

  function addEXP(amount) {
    profile.exp += amount;
    let leveledUp = false;

    while (profile.exp >= profile.nextExp) {
      profile.exp -= profile.nextExp;
      profile.level += 1;
      profile.nextExp = Math.floor(profile.nextExp * 1.35);
      profile.coins += 150 * profile.level;
      profile.diamonds += 10;
      leveledUp = true;
    }

    if (leveledUp) {
      playSFX("level_up");
      triggerLevelUpModal();
      checkBadges();
    }
    saveProfile();
    updateHUD();
  }

  function triggerLevelUpModal() {
    const modal = document.getElementById("modal-levelup");
    if (!modal) return;
    const desc = document.getElementById("levelup-desc");
    if (desc) {
      desc.textContent = `Selamat! Karakter kamu naik ke Level ${profile.level}! Bonus +${150 * profile.level} Koin & +10 Diamond telah ditambahkan.`;
    }
    modal.classList.add("active");
  }

  // ==========================================================================
  // 5. MATCH RESULT & STATS TRACKER
  // ==========================================================================
  function recordMatchResult(summary) {
    profile.stats.matches += 1;
    const p1Score = summary.p1Score || summary.score || 0;
    const p1Correct = summary.p1Correct || summary.correctCount || 0;

    let expEarned = summary.expEarned || 100;
    let coinsEarned = summary.goldEarned || 100;
    let diamondEarned = 0;

    if (summary.won) {
      profile.stats.wins += 1;
      profile.stats.streak += 1;
      if (profile.stats.streak > profile.stats.bestStreak) {
        profile.stats.bestStreak = profile.stats.streak;
      }

      if (summary.battleMode === "ranked") {
        diamondEarned = 5;
        profile.rankRP = (profile.rankRP || 0) + (summary.rpDelta || 35);
      } else if (summary.battleMode === "boss") {
        profile.stats.bossDefeated += 1;
        diamondEarned = 15;
      } else if (summary.battleMode === "tournament") {
        profile.stats.tournamentsWon += 1;
        diamondEarned = 25;
      } else if (summary.battleMode === "classroom") {
        profile.stats.classroomDone += 1;
      }
    } else {
      profile.stats.losses += 1;
      profile.stats.streak = 0;

      if (summary.battleMode === "ranked") {
        profile.rankRP = Math.max(0, (profile.rankRP || 0) - 15);
      }
    }

    if (summary.perfect || p1Correct === 5) {
      profile.stats.perfectCount = (profile.stats.perfectCount || 0) + 1;
    }

    profile.stats.correctAnswers += p1Correct;
    profile.stats.wrongAnswers += Math.max(0, 5 - p1Correct);

    // Update quest progress
    profile.questsProgress.dq_minigame1 = (profile.questsProgress.dq_minigame1 || 0) + 1;
    profile.questsProgress.dq_solve10 = (profile.questsProgress.dq_solve10 || 0) + p1Correct;
    profile.questsProgress.wq_solve50 = (profile.questsProgress.wq_solve50 || 0) + p1Correct;

    if (summary.won) {
      profile.questsProgress.dq_win2 = (profile.questsProgress.dq_win2 || 0) + 1;
      profile.questsProgress.wq_win10 = (profile.questsProgress.wq_win10 || 0) + 1;
    }
    if (summary.battleMode === "boss" && summary.won) {
      profile.questsProgress.wq_boss5 = (profile.questsProgress.wq_boss5 || 0) + 1;
    }
    if (summary.battleMode === "classroom") {
      profile.questsProgress.dq_academy1 = (profile.questsProgress.dq_academy1 || 0) + 1;
    }

    profile.coins += Math.round(coinsEarned);
    profile.diamonds += diamondEarned;
    addEXP(Math.round(expEarned));
    checkBadges();
    saveProfile();
    updateHUD();
  }

  function checkBadges() {
    const badges = window.GAME_DATA.badges || [];
    badges.forEach((b) => {
      if (profile.badges.includes(b.id)) return;
      let unlocked = false;

      if (b.id === "first_victory" && profile.stats.wins >= 1) unlocked = true;
      if (b.id === "math_genius" && profile.stats.correctAnswers >= 10) unlocked = true;
      if (b.id === "quiz_champion" && profile.stats.wins >= 10) unlocked = true;
      if (b.id === "perfect_brain" && (profile.stats.perfectCount || 0) >= 1) unlocked = true;
      if (b.id === "boss_slayer" && (profile.stats.bossDefeated || 0) >= 1) unlocked = true;
      if (b.id === "class_star" && (profile.stats.classroomDone || 0) >= 1) unlocked = true;
      if (b.id === "school_explorer" && (profile.stats.locationsVisited || 0) >= 3) unlocked = true;

      if (unlocked) {
        profile.badges.push(b.id);
        profile.coins += b.rewardGold || 150;
        profile.questsProgress.wq_badge3 = (profile.questsProgress.wq_badge3 || 0) + 1;
        playSFX("victory");
        notify(`Lencana Baru Terbuka: [${b.name}]! +${b.rewardGold || 150} Koin 🏅`, "success");
      }
    });
    saveProfile();
  }

  // ==========================================================================
  // 6. ADVENTURE MODE & 3D INTERACTION
  // ==========================================================================
  function renderAdventureHUD() {
    const loc = currentInteractingLocation;
    const promptEl = document.getElementById("adventure-interact-prompt");
    if (!promptEl) return;

    if (loc) {
      promptEl.style.display = "block";
      promptEl.innerHTML = `
        <div class="prompt-card">
          <span class="prompt-icon">${loc.icon || "📍"}</span>
          <div class="prompt-info">
            <strong>${loc.name}</strong>
            <p>${loc.desc || loc.description || ""}</p>
          </div>
          <button class="btn-primary-sm" onclick="App.triggerCurrentLocationInteraction()">[E] Masuk</button>
        </div>
      `;
    } else {
      promptEl.style.display = "none";
    }
  }

  function onProximityLocationChange(location) {
    currentInteractingLocation = location;
    if (location) {
      profile.stats.locationsVisited = Math.max(profile.stats.locationsVisited || 1, 3);
      checkBadges();
    }
    renderAdventureHUD();
  }

  function interactWithLocation(location) {
    if (!location) return;
    currentInteractingLocation = location;
    openLocationModal(location);
  }

  function triggerCurrentLocationInteraction() {
    if (currentInteractingLocation) {
      openLocationModal(currentInteractingLocation);
    }
  }

  function openLocationModal(loc) {
    const modal = document.getElementById("modal-location-interact");
    if (!modal) return;

    const titleEl = document.getElementById("loc-modal-title");
    const descEl = document.getElementById("loc-modal-desc");
    const npcEl = document.getElementById("loc-modal-npc");
    const actionBtn = document.getElementById("loc-modal-action-btn");

    if (titleEl) titleEl.innerHTML = `${loc.icon || "📍"} ${loc.name}`;
    if (descEl) descEl.textContent = loc.desc || loc.description || "";
    if (npcEl) {
      npcEl.innerHTML = `
        <div class="npc-dialog-box">
          <span class="npc-avatar">👨‍🏫</span>
          <div class="npc-speech">
            <strong>${loc.npc || "Pemandu Akademi"}</strong>:
            <em>"${loc.dialog || 'Selamat datang di Akademi! Ayo belajar dan ikuti tantangan seru di sini!'}"</em>
          </div>
        </div>
      `;
    }

    if (actionBtn) {
      actionBtn.onclick = () => {
        closeModal("modal-location-interact");
        handleLocationAction(loc);
      };
      actionBtn.textContent = `Masuk ke ${loc.name}`;
    }

    modal.classList.add("active");
  }

  function handleLocationAction(loc) {
    if (loc.id === 5 || loc.name.includes("Guru") || loc.name.includes("Classroom")) {
      showScreen("screen-classroom");
    } else if (loc.id === 13 || loc.name.includes("Kompetisi")) {
      window.MiniGameEngine.startMatch({
        battleMode: "tournament",
        miniGameId: "quick_answer",
        timePerRound: 15
      });
    } else if (loc.id === 12 || loc.name.includes("Olahraga")) {
      window.MiniGameEngine.startMatch({
        battleMode: "ranked",
        miniGameId: "math_race",
        timePerRound: 15
      });
    } else if (loc.id === 7 || loc.name.includes("Sains")) {
      window.MiniGameEngine.startMatch({
        battleMode: "boss",
        miniGameId: "quick_answer",
        timePerRound: 20
      });
    } else if (loc.id === 6 || loc.name.includes("Perpustakaan")) {
      window.MiniGameEngine.startMatch({
        battleMode: "solo",
        miniGameId: "memory_cards",
        timePerRound: 18
      });
    } else {
      showScreen("screen-battle-select");
    }
  }

  // ==========================================================================
  // 7. BATTLE SELECT SCREEN
  // ==========================================================================
  function renderBattleSelectScreen() {
    const listEl = document.getElementById("battle-modes-list");
    if (!listEl) return;

    const modes = [
      {
        id: "ranked",
        title: "Ranked Battle 1v1",
        badge: "Competitive",
        icon: "🏆",
        desc: "Tanding online 1 lawan 1. Menangkan RP untuk naik rank dari Bronze hingga Mythic!",
        color: "#f59e0b"
      },
      {
        id: "local2p",
        title: "Local 2-Player (1 HP/Layar)",
        badge: "Multiplayer Offline",
        icon: "👥",
        desc: "Main bersama teman di satu layar perangkat! Sisi kiri vs sisi kanan.",
        color: "#10b981"
      },
      {
        id: "boss",
        title: "Boss Challenge (Titan Pengetahuan)",
        badge: "Co-op / Raid",
        icon: "👹",
        desc: "Kalahkan Boss 100 HP dengan jawaban cepat dan tepat untuk hadiah koin melimpah!",
        color: "#ef4444"
      },
      {
        id: "tournament",
        title: "Tournament Grand Championship",
        badge: "Turnamen 3 Babak",
        icon: "👑",
        desc: "Babak Perempat Final, Semifinal, hingga Grand Final untuk mahkota Juara Sekolah!",
        color: "#8b5cf6"
      },
      {
        id: "solo",
        title: "Solo Practice & Asah Otak",
        badge: "Santai",
        icon: "🎯",
        desc: "Latihan mandiri tanpa penalti ranked. Kuasai semua mata pelajaran sekolah.",
        color: "#3b82f6"
      }
    ];

    listEl.innerHTML = modes
      .map(
        (m) => `
      <div class="mode-card" onclick="App.launchSelectedBattle('${m.id}')" style="border-left: 6px solid ${m.color}">
        <div class="mode-icon">${m.icon}</div>
        <div class="mode-details">
          <div class="mode-header">
            <h3>${m.title}</h3>
            <span class="mode-badge" style="background:${m.color}22; color:${m.color}">${m.badge}</span>
          </div>
          <p>${m.desc}</p>
        </div>
        <button class="btn-play-action">PILIH ➔</button>
      </div>
    `
      )
      .join("");

    const levelSel = document.getElementById("select-battle-level");
    if (levelSel && levelSel.options.length <= 1) {
      levelSel.innerHTML = `
        <option value="all">Semua Jenjang (Campuran)</option>
        <option value="sd" ${profile.educationLevel === "sd" ? "selected" : ""}>SD (Kelas 1–6)</option>
        <option value="smp" ${profile.educationLevel === "smp" ? "selected" : ""}>SMP (Kelas 7–9)</option>
        <option value="sma" ${profile.educationLevel === "sma" ? "selected" : ""}>SMA (Kelas 10–12)</option>
        <option value="smk" ${profile.educationLevel === "smk" ? "selected" : ""}>SMK (Kejuruan)</option>
        <option value="univ" ${profile.educationLevel === "univ" ? "selected" : ""}>Universitas (Prodi)</option>
      `;
    }
  }

  function launchSelectedBattle(modeId) {
    const levelSel = document.getElementById("select-battle-level");
    const gameSel = document.getElementById("select-battle-minigame");

    const level = levelSel ? levelSel.value : "all";
    const minigame = gameSel ? gameSel.value : "quick_answer";

    window.MiniGameEngine.startMatch({
      battleMode: modeId,
      miniGameId: minigame,
      levelFilter: level,
      timePerRound: modeId === "boss" ? 20 : 15
    });
  }

  // ==========================================================================
  // 8. SHOP & INVENTORY SYSTEM
  // ==========================================================================
  let activeShopCategory = "all";

  function matchCategory(itemCat, selectedCat) {
    if (selectedCat === "all") return true;
    const cat = (itemCat || "").toLowerCase();
    const sel = selectedCat.toLowerCase();
    if (sel === "skin" || sel === "uniform") return cat.includes("skin") || cat.includes("uniform");
    if (sel === "pet") return cat.includes("pet");
    if (sel === "frame") return cat.includes("frame");
    if (sel === "emote") return cat.includes("emote");
    if (sel === "title") return cat.includes("title");
    if (sel === "background" || sel === "bg") return cat.includes("background");
    return cat.includes(sel);
  }

  function renderShopScreen() {
    const coinsEl = document.getElementById("shop-coins-display");
    const diamondsEl = document.getElementById("shop-diamonds-display");
    if (coinsEl) coinsEl.textContent = (profile.coins || 0).toLocaleString();
    if (diamondsEl) diamondsEl.textContent = (profile.diamonds || 0).toLocaleString();

    const itemsGrid = document.getElementById("shop-items-grid");
    if (!itemsGrid) return;

    const items = (window.GAME_DATA.shopItems || []).filter((it) => matchCategory(it.category, activeShopCategory));

    itemsGrid.innerHTML = items
      .map((item) => {
        const owned = profile.inventory.includes(item.id);
        const isEquipped = Object.values(profile.equipped || {}).includes(item.id);

        let actionBtn = "";
        if (owned) {
          if (isEquipped) {
            actionBtn = `<button class="btn-equipped" disabled>Terpasang ✓</button>`;
          } else {
            actionBtn = `<button class="btn-equip" onclick="App.equipItem('${item.id}', '${item.category}')">Pakai</button>`;
          }
        } else {
          const costHtml =
            item.currency === "diamond"
              ? `<span class="price-diamond">💎 ${item.price}</span>`
              : `<span class="price-coin">🪙 ${item.price}</span>`;
          actionBtn = `<button class="btn-buy" onclick="App.buyItem('${item.id}')">${costHtml} Beli</button>`;
        }

        return `
        <div class="shop-card ${owned ? "owned" : ""}">
          <div class="shop-item-preview">
            <span class="shop-item-icon">${item.icon || "🎁"}</span>
          </div>
          <div class="shop-item-info">
            <div class="shop-item-name">${item.name}</div>
            <div class="shop-item-cat">${item.category.toUpperCase()}</div>
            <div class="shop-item-desc">${item.desc || ""}</div>
          </div>
          <div class="shop-item-footer">
            ${actionBtn}
          </div>
        </div>
      `;
      })
      .join("");
  }

  function setShopCategory(cat) {
    activeShopCategory = cat;
    const tabs = document.querySelectorAll(".shop-tab-btn");
    tabs.forEach((t) => t.classList.remove("active"));
    const activeTab = document.querySelector(`[data-cat="${cat}"]`);
    if (activeTab) activeTab.classList.add("active");
    renderShopScreen();
  }

  function buyItem(itemId) {
    const item = window.GAME_DATA.shopItems.find((i) => i.id === itemId);
    if (!item) return;

    if (profile.inventory.includes(itemId)) {
      notify("Kamu sudah memiliki item ini!", "warn");
      return;
    }

    if (item.currency === "diamond") {
      if (profile.diamonds < item.price) {
        notify("Diamond tidak cukup! Ikuti Ranked atau Turnamen untuk mendapatkan Diamond.", "error");
        return;
      }
      profile.diamonds -= item.price;
    } else {
      if (profile.coins < item.price) {
        notify("Koin tidak cukup! Ikuti Quiz Battle untuk mengumpulkan koin.", "error");
        return;
      }
      profile.coins -= item.price;
    }

    profile.inventory.push(itemId);
    playSFX("coin");
    notify(`Berhasil membeli ${item.name}! 🎉`, "success");
    saveProfile();
    updateHUD();
    renderShopScreen();
  }

  function equipItem(itemId, category) {
    if (!profile.inventory.includes(itemId)) return;

    const cat = (category || "").toLowerCase();
    if (cat.includes("skin") || cat.includes("uniform")) {
      profile.equipped.skin = itemId;
      profile.equipped.uniform = itemId;
    } else if (cat.includes("pet")) {
      profile.equipped.pet = itemId;
    } else if (cat.includes("frame")) {
      profile.equipped.frame = itemId;
    } else if (cat.includes("title")) {
      profile.equipped.title = itemId;
    }

    if (window.World3D) {
      window.World3D.updateCharacterAppearance(profile);
    }

    playSFX("click");
    notify(`Item berhasil dipasang!`, "success");
    saveProfile();
    renderShopScreen();
    renderInventoryScreen();
  }

  function renderInventoryScreen() {
    const grid = document.getElementById("inventory-items-grid");
    if (!grid) return;

    const ownedItems = (window.GAME_DATA.shopItems || []).filter((i) => profile.inventory.includes(i.id));

    grid.innerHTML = ownedItems
      .map((item) => {
        const isEquipped = Object.values(profile.equipped || {}).includes(item.id);
        return `
        <div class="inv-card ${isEquipped ? "equipped-card" : ""}">
          <div class="inv-icon">${item.icon || "🎁"}</div>
          <strong>${item.name}</strong>
          <span class="inv-cat">${item.category}</span>
          ${
            isEquipped
              ? `<span class="status-equipped">Terpasang ✓</span>`
              : `<button class="btn-primary-xs" onclick="App.equipItem('${item.id}', '${item.category}')">Pasang</button>`
          }
        </div>
      `;
      })
      .join("");
  }

  // ==========================================================================
  // 9. QUESTS & MISSIONS SCREEN
  // ==========================================================================
  function renderQuestsScreen() {
    const dailyEl = document.getElementById("daily-quests-list");
    const storyEl = document.getElementById("story-quests-list");
    if (!dailyEl || !storyEl) return;

    const daily = window.GAME_DATA.quests.daily || [];
    const story = window.GAME_DATA.quests.weekly || window.GAME_DATA.quests.story || [];

    dailyEl.innerHTML = daily
      .map((q) => {
        const current = profile.questsProgress[q.id] || 0;
        const isCompleted = current >= q.target;
        const isClaimed = profile.claimedQuests.includes(q.id);

        let actionBtn = "";
        if (isClaimed) {
          actionBtn = `<button class="btn-claimed" disabled>Diklaim ✓</button>`;
        } else if (isCompleted) {
          actionBtn = `<button class="btn-claim-reward" onclick="App.claimQuestReward('${q.id}', 'daily')">Klaim 🎁</button>`;
        } else {
          actionBtn = `<span class="quest-progress-tag">${current}/${q.target}</span>`;
        }

        return `
        <div class="quest-item ${isCompleted ? "completed" : ""}">
          <div class="quest-icon">🎯</div>
          <div class="quest-info">
            <strong>${q.title}</strong>
            <p>${q.desc || `Target: ${q.target}`}</p>
            <div class="quest-rewards">Hadiah: +${q.rewardGold || 80} Koin • +${q.rewardExp || 50} EXP</div>
          </div>
          <div class="quest-action">${actionBtn}</div>
        </div>
      `;
      })
      .join("");

    storyEl.innerHTML = story
      .map((q) => {
        const current = profile.questsProgress[q.id] || 0;
        const isCompleted = current >= q.target;
        const isClaimed = profile.claimedQuests.includes(q.id);

        let actionBtn = "";
        if (isClaimed) {
          actionBtn = `<button class="btn-claimed" disabled>Diklaim ✓</button>`;
        } else if (isCompleted) {
          actionBtn = `<button class="btn-claim-reward" onclick="App.claimQuestReward('${q.id}', 'weekly')">Klaim 🎁</button>`;
        } else {
          actionBtn = `<span class="quest-progress-tag">${current}/${q.target}</span>`;
        }

        return `
        <div class="quest-item ${isCompleted ? "completed" : ""}">
          <div class="quest-icon">📜</div>
          <div class="quest-info">
            <strong>${q.title}</strong>
            <p>${q.desc || `Target: ${q.target}`}</p>
            <div class="quest-rewards">Hadiah: +${q.rewardGold || 250} Koin • +${q.rewardExp || 200} EXP</div>
          </div>
          <div class="quest-action">${actionBtn}</div>
        </div>
      `;
      })
      .join("");
  }

  function claimQuestReward(questId, type) {
    if (profile.claimedQuests.includes(questId)) return;

    const list = type === "daily" ? (window.GAME_DATA.quests.daily || []) : (window.GAME_DATA.quests.weekly || window.GAME_DATA.quests.story || []);
    const quest = list.find((q) => q.id === questId);
    if (!quest) return;

    profile.claimedQuests.push(questId);
    profile.coins += quest.rewardGold || 100;
    addEXP(quest.rewardExp || 80);

    playSFX("coin");
    notify(`Hadiah Misi '${quest.title}' berhasil diklaim! 🎁`, "success");
    saveProfile();
    updateHUD();
    renderQuestsScreen();
  }

  // ==========================================================================
  // 10. LEADERBOARD SCREEN
  // ==========================================================================
  function renderLeaderboardScreen() {
    const listEl = document.getElementById("leaderboard-list");
    if (!listEl) return;

    const topPlayers = [
      { rank: 1, name: "Bintang Juara (SMAN 1)", tier: "Mythic", score: 2890, avatar: "🥇" },
      { rank: 2, name: "Rizky Math Wizard", tier: "Grandmaster", score: 2450, avatar: "🥈" },
      { rank: 3, name: "Nabila Cerdas", tier: "Master", score: 2130, avatar: "🥉" },
      { rank: 4, name: "Ahmad Sains Explorer", tier: "Diamond", score: 1840, avatar: "⭐" },
      { rank: 5, name: profile.name + " (Kamu)", tier: profile.rankTier, score: profile.rankRP || 120, avatar: "👤", isPlayer: true },
      { rank: 6, name: "Farhan Quiz Champion", tier: "Gold I", score: 720, avatar: "🎖️" },
      { rank: 7, name: "Siti Pintar", tier: "Silver II", score: 450, avatar: "🎖️" }
    ];

    topPlayers.sort((a, b) => b.score - a.score);
    topPlayers.forEach((p, idx) => (p.rank = idx + 1));

    listEl.innerHTML = topPlayers
      .map(
        (p) => `
      <div class="lb-row ${p.isPlayer ? "player-lb-row" : ""}">
        <span class="lb-rank">#${p.rank}</span>
        <span class="lb-avatar">${p.avatar}</span>
        <div class="lb-player-info">
          <strong>${p.name}</strong>
          <small class="lb-tier-badge">${p.tier}</small>
        </div>
        <span class="lb-rp">${p.score} RP</span>
      </div>
    `
      )
      .join("");
  }

  // ==========================================================================
  // 11. PROFILE & STATS SCREEN
  // ==========================================================================
  function renderProfileScreen() {
    const nameEl = document.getElementById("prof-name-val");
    const levelEl = document.getElementById("prof-level-val");
    const rankEl = document.getElementById("prof-rank-val");
    const matchesEl = document.getElementById("prof-matches-val");
    const winrateEl = document.getElementById("prof-winrate-val");
    const streakEl = document.getElementById("prof-streak-val");
    const badgesGrid = document.getElementById("prof-badges-grid");

    if (nameEl) nameEl.textContent = profile.name;
    if (levelEl) levelEl.textContent = `Level ${profile.level} (${profile.grade})`;
    if (rankEl) rankEl.textContent = `${profile.rankTier} (${profile.rankRP || 0} RP)`;
    if (matchesEl) matchesEl.textContent = profile.stats.matches;

    const winrate =
      profile.stats.matches > 0
        ? Math.round((profile.stats.wins / profile.stats.matches) * 100)
        : 0;
    if (winrateEl) winrateEl.textContent = `${winrate}% (${profile.stats.wins} Menang / ${profile.stats.losses} Kalah)`;
    if (streakEl) streakEl.textContent = `${profile.stats.streak} (Terbaik: ${profile.stats.bestStreak})`;

    if (badgesGrid) {
      badgesGrid.innerHTML = (window.GAME_DATA.badges || [])
        .map((b) => {
          const unlocked = profile.badges.includes(b.id);
          return `
          <div class="badge-card ${unlocked ? "unlocked" : "locked"}">
            <span class="badge-icon">${b.icon}</span>
            <strong>${b.name}</strong>
            <p>${b.desc}</p>
            <span class="badge-status">${unlocked ? "Terbuka ✓" : "Terkunci 🔒"}</span>
          </div>
        `;
        })
        .join("");
    }
  }

  function editPlayerName() {
    const newName = prompt("Masukkan nama karakter baru kamu:", profile.name);
    if (newName && newName.trim().length > 0) {
      profile.name = newName.trim().slice(0, 20);
      saveProfile();
      updateHUD();
      renderProfileScreen();
      notify(`Nama karakter diubah menjadi ${profile.name}!`, "success");
    }
  }

  function setPlayerEducationLevel(lvlId) {
    profile.educationLevel = lvlId;
    saveProfile();
    updateHUD();
    notify(`Jenjang pendidikan aktif diatur ke: ${lvlId.toUpperCase()}!`, "info");
  }

  // ==========================================================================
  // 12. VIRTUAL JOYSTICK & TOUCH CONTROLS
  // ==========================================================================
  function initVirtualJoystick() {
    const stickZone = document.getElementById("virtual-joystick-zone");
    const knob = document.getElementById("joystick-knob");
    if (!stickZone || !knob) return;

    let touchId = null;
    let startX = 0;
    let startY = 0;
    const maxRadius = 45;

    stickZone.addEventListener(
      "touchstart",
      (e) => {
        if (touchId !== null) return;
        const touch = e.changedTouches[0];
        touchId = touch.identifier;
        const rect = stickZone.getBoundingClientRect();
        startX = rect.left + rect.width / 2;
        startY = rect.top + rect.height / 2;
        updateKnob(touch.clientX, touch.clientY);
        e.preventDefault();
      },
      { passive: false }
    );

    stickZone.addEventListener(
      "touchmove",
      (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          if (t.identifier === touchId) {
            updateKnob(t.clientX, t.clientY);
            e.preventDefault();
            break;
          }
        }
      },
      { passive: false }
    );

    const resetJoystick = () => {
      touchId = null;
      knob.style.transform = `translate(0px, 0px)`;
      if (window.World3D) {
        window.World3D.setJoystickInput(0, 0, false);
      }
    };

    stickZone.addEventListener("touchend", resetJoystick);
    stickZone.addEventListener("touchcancel", resetJoystick);

    function updateKnob(clientX, clientY) {
      let dx = clientX - startX;
      let dy = clientY - startY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > maxRadius) {
        dx = (dx / dist) * maxRadius;
        dy = (dy / dist) * maxRadius;
      }

      knob.style.transform = `translate(${dx}px, ${dy}px)`;

      const normX = dx / maxRadius;
      const normZ = dy / maxRadius;

      if (window.World3D) {
        window.World3D.setJoystickInput(normX, normZ, true);
      }
    }
  }

  // ==========================================================================
  // 13. MODALS, NOTIFICATIONS & DOM BINDINGS
  // ==========================================================================
  function notify(msg, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast-item toast-${type}`;
    const icon = type === "success" ? "✅" : type === "warn" ? "⚠️" : type === "error" ? "❌" : "💡";
    toast.innerHTML = `<span class="toast-icon">${icon}</span> <span>${msg}</span>`;

    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

  function openModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.classList.add("active");
  }

  function closeModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.classList.remove("active");
  }

  function updateSettingsModalUI() {
    const bgmBtn = document.getElementById("setting-bgm-toggle");
    const sfxBtn = document.getElementById("setting-sfx-toggle");
    if (bgmBtn) bgmBtn.textContent = profile.settings.bgm ? "ON 🎵" : "OFF 🔇";
    if (sfxBtn) sfxBtn.textContent = profile.settings.sfx ? "ON 🔊" : "OFF 🔈";
  }

  function toggleSFX() {
    profile.settings.sfx = !profile.settings.sfx;
    saveProfile();
    notify(profile.settings.sfx ? "Efek Suara (SFX) Aktif 🔊" : "Efek Suara Dimatikan 🔈", "info");
    updateSettingsModalUI();
  }

  function initDOMListeners() {
    window.addEventListener("keydown", (e) => {
      if (e.key === "e" || e.key === "E") {
        if (currentScreen === "screen-adventure" && currentInteractingLocation) {
          triggerCurrentLocationInteraction();
        }
      }
    });

    document.querySelectorAll(".modal-overlay").forEach((m) => {
      m.addEventListener("click", (e) => {
        if (e.target === m) m.classList.remove("active");
      });
    });
  }

  return {
    init,
    getProfile,
    saveProfile,
    showScreen,
    notify,
    playSFX,
    toggleBGM,
    toggleSFX,
    recordMatchResult,
    interactWithLocation,
    onProximityLocationChange,
    triggerCurrentLocationInteraction,
    launchSelectedBattle,
    setShopCategory,
    buyItem,
    equipItem,
    claimQuestReward,
    editPlayerName,
    setPlayerEducationLevel,
    openModal,
    closeModal
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  window.App.init();
});
