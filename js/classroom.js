// ============================================================================
// BRAIN SMART RPG v3.0 — CLASSROOM SYSTEM & TEACHER DASHBOARD (js/classroom.js)
// Implements GDD Section 11: Teacher & Student Roles, Class Code Generation,
// 5 Classroom Modes (Live Quiz, Class Battle, Assignment, Exam Mode, Learning Adventure),
// and Comprehensive Teacher Dashboard Analytics.
// ============================================================================

window.ClassroomSystem = (function () {
  const STORAGE_KEY = "bsrpg_classrooms_v3";
  let classrooms = [];
  let activeClassCode = "BRAIN1";
  let roleView = "student"; // "student" | "teacher"

  function init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        classrooms = JSON.parse(saved);
      } catch (e) {
        classrooms = JSON.parse(JSON.stringify(window.GAME_DATA.defaultClassrooms));
      }
    } else {
      classrooms = JSON.parse(JSON.stringify(window.GAME_DATA.defaultClassrooms));
      save();
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(classrooms));
  }

  function setRoleView(role) {
    roleView = role;
    renderClassroomScreen();
  }

  function getActiveClass() {
    return classrooms.find((c) => c.code === activeClassCode) || classrooms[0];
  }

  function joinByCode() {
    const input = document.getElementById("input-class-code");
    if (!input) return;
    const code = input.value.trim().toUpperCase();
    if (!code) {
      window.App.notify("Masukkan kode kelas terlebih dahulu!", "warn");
      return;
    }

    const found = classrooms.find((c) => c.code.toUpperCase() === code);
    if (!found) {
      window.App.notify(`Kode Kelas '${code}' tidak ditemukan! Coba: BRAIN1 atau SMA101`, "error");
      return;
    }

    activeClassCode = found.code;
    const profile = window.App.getProfile();
    const alreadyIn = found.students.some((s) => s.name === profile.name);
    if (!alreadyIn) {
      found.students.push({
        name: profile.name,
        level: profile.level,
        score: 0,
        progress: 25,
        tasksDone: 0
      });
      save();
    }

    window.App.playSFX("coin");
    window.App.notify(`Berhasil bergabung ke ${found.name} (${found.code})!`, "success");
    renderClassroomScreen();
  }

  function createNewClassroom() {
    const nameEl = document.getElementById("new-class-name");
    const subjEl = document.getElementById("new-class-subject");
    const lvlEl = document.getElementById("new-class-level");
    if (!nameEl || !nameEl.value.trim()) {
      window.App.notify("Nama kelas wajib diisi!", "warn");
      return;
    }

    const randomCode = "CLS" + Math.floor(100 + Math.random() * 900);
    const profile = window.App.getProfile();

    const newCls = {
      code: randomCode,
      name: nameEl.value.trim(),
      teacherName: profile.name + " (Guru)",
      levelId: lvlEl ? lvlEl.value : "smp",
      subject: subjEl && subjEl.value.trim() ? subjEl.value.trim() : "Tematik Terpadu",
      students: [
        { name: profile.name, level: profile.level, score: 100, progress: 50, tasksDone: 1 },
        { name: "Budi_Siswa", level: 4, score: 320, progress: 75, tasksDone: 2 },
        { name: "Siti_Siswa", level: 5, score: 410, progress: 88, tasksDone: 3 }
      ],
      activities: [
        {
          id: "act_" + Date.now(),
          title: "Live Quiz Perdana: " + (subjEl.value || "Umum"),
          mode: "Live Quiz",
          subject: "Matematika",
          level: lvlEl ? lvlEl.value : "smp",
          deadline: "Hari Ini, 16:00",
          rewardGold: 150,
          completedByPlayer: false
        }
      ]
    };

    classrooms.unshift(newCls);
    activeClassCode = newCls.code;
    save();
    window.App.playSFX("victory");
    window.App.notify(`Kelas baru dibuat! Kode Kelas: ${newCls.code}`, "success");
    renderClassroomScreen();
  }

  function createClassActivity() {
    const titleEl = document.getElementById("new-act-title");
    const modeEl = document.getElementById("new-act-mode");
    const subjEl = document.getElementById("new-act-subject");
    if (!titleEl || !titleEl.value.trim()) {
      window.App.notify("Judul tugas/kuis wajib diisi!", "warn");
      return;
    }

    const cls = getActiveClass();
    if (!cls) return;

    cls.activities.unshift({
      id: "act_" + Date.now(),
      title: titleEl.value.trim(),
      mode: modeEl ? modeEl.value : "Live Quiz",
      subject: subjEl ? subjEl.value : "Matematika",
      level: cls.levelId || "smp",
      deadline: "Minggu Ini",
      rewardGold: 150,
      completedByPlayer: false
    });

    save();
    window.App.playSFX("coin");
    window.App.notify(`Aktivitas '${titleEl.value.trim()}' berhasil diterbitkan ke kelas ${cls.code}!`, "success");
    renderClassroomScreen();
  }

  function launchClassroomActivity(actId) {
    const cls = getActiveClass();
    if (!cls) return;
    const act = cls.activities.find((a) => a.id === actId);
    if (!act) return;

    let mgId = "quick_answer";
    if (act.mode === "Class Battle") mgId = "math_race";
    else if (act.mode === "Exam Mode") mgId = "quick_answer";
    else if (act.mode === "Learning Adventure") mgId = "memory_challenge";

    window.MiniGameEngine.startMatch({
      battleMode: "classroom",
      miniGameId: mgId,
      levelFilter: act.level || cls.levelId,
      subjectFilter: act.subject,
      timePerRound: act.mode === "Exam Mode" ? 20 : 15,
      classroomActivityId: act.id
    });
  }

  function markActivityCompleted(actId, scoreEarned) {
    const cls = getActiveClass();
    if (!cls) return;
    const act = cls.activities.find((a) => a.id === actId);
    if (act) act.completedByPlayer = true;

    const profile = window.App.getProfile();
    let stu = cls.students.find((s) => s.name === profile.name);
    if (!stu) {
      stu = { name: profile.name, level: profile.level, score: 0, progress: 50, tasksDone: 0 };
      cls.students.push(stu);
    }
    stu.score += scoreEarned || 300;
    stu.tasksDone += 1;
    stu.progress = Math.min(100, stu.progress + 20);
    save();
  }

  function removeStudent(studentName) {
    const cls = getActiveClass();
    if (!cls) return;
    cls.students = cls.students.filter((s) => s.name !== studentName);
    save();
    window.App.notify(`Murid ${studentName} telah dikeluarkan dari kelas.`, "info");
    renderClassroomScreen();
  }

  function renderClassroomScreen() {
    const container = document.getElementById("classroom-dynamic-content") || document.getElementById("classroom-main-container");
    if (!container) return;

    const cls = getActiveClass();
    const sortedStudents = [...cls.students].sort((a, b) => b.score - a.score);
    const avgScore = sortedStudents.length
      ? Math.round(sortedStudents.reduce((acc, s) => acc + s.score, 0) / sortedStudents.length)
      : 0;
    const avgProgress = sortedStudents.length
      ? Math.round(sortedStudents.reduce((acc, s) => acc + s.progress, 0) / sortedStudents.length)
      : 0;

    container.innerHTML = `
      <div class="classroom-top-bar">
        <div class="role-switcher-tabs">
          <button class="tab-btn ${roleView === "student" ? "active" : ""}" onclick="ClassroomSystem.setRoleView('student')">
            🎒 Portal Murid (Student View)
          </button>
          <button class="tab-btn ${roleView === "teacher" ? "active" : ""}" onclick="ClassroomSystem.setRoleView('teacher')">
            👩‍🏫 Teacher Dashboard (Guru)
          </button>
        </div>

        <div class="class-selector-group">
          <span>Kelas Aktif:</span>
          <select onchange="ClassroomSystem.selectClass(this.value)" class="select-styled">
            ${classrooms.map((c) => `
              <option value="${c.code}" ${c.code === cls.code ? "selected" : ""}>
                [${c.code}] ${c.name}
              </option>
            `).join("")}
          </select>
        </div>
      </div>

      ${roleView === "student" ? renderStudentPortal(cls, sortedStudents) : renderTeacherDashboard(cls, sortedStudents, avgScore, avgProgress)}
    `;
  }

  function renderStudentPortal(cls, sortedStudents) {
    return `
      <div class="classroom-grid-2col">
        <div class="glass-panel">
          <div class="class-banner-header">
            <div>
              <span class="badge-code">KODE KELAS: ${cls.code}</span>
              <h3>${cls.name}</h3>
              <p>👨‍🏫 Pengajar: <strong>${cls.teacherName}</strong> • Mapel: ${cls.subject}</p>
            </div>
          </div>

          <div class="join-code-box">
            <input type="text" id="input-class-code" placeholder="Masukkan Kode Kelas (Misal: BRAIN1 / SMA101)" class="input-styled" />
            <button class="btn-primary" onclick="ClassroomSystem.joinByCode()">🔑 Gabung Kelas</button>
          </div>

          <h4 style="margin-top:16px;">📋 Daftar Aktivitas Pembelajaran (5 Mode Classroom)</h4>
          <div class="activity-list">
            ${cls.activities.map((act) => `
              <div class="activity-item-card">
                <div>
                  <span class="mode-tag">${act.mode}</span>
                  <strong>${act.title}</strong>
                  <div class="act-meta">Mapel: ${act.subject} • Tenggat: ${act.deadline} • Hadiah: 🪙 ${act.rewardGold}</div>
                </div>
                <button class="btn-primary btn-sm" onclick="ClassroomSystem.launchClassroomActivity('${act.id}')">
                  ${act.completedByPlayer ? "✅ Kerjakan Ulang" : "▶️ Mulai"}
                </button>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="glass-panel">
          <h4>🏆 Ranking Kelas (${cls.name})</h4>
          <p class="sub-note">🔒 Sesuai kebijakan Child Protection, hanya Nickname & Poin Aktivitas yang ditampilkan.</p>
          <div class="leaderboard-list">
            ${sortedStudents.map((s, idx) => `
              <div class="lb-row ${idx === 0 ? "top-1" : ""}">
                <span class="lb-rank">#${idx + 1}</span>
                <span class="lb-name">${s.name} <small>(Lv.${s.level})</small></span>
                <span class="lb-score">${s.score} Poin (${s.progress}%)</span>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  }

  function renderTeacherDashboard(cls, sortedStudents, avgScore, avgProgress) {
    return `
      <!-- GDD Section 11.4 Teacher Dashboard Metrics -->
      <div class="teacher-kpi-grid">
        <div class="kpi-card"><span>👥 Jumlah Murid</span><strong>${cls.students.length} Siswa</strong></div>
        <div class="kpi-card"><span>📝 Tugas & Ujian Aktif</span><strong>${cls.activities.length} Aktivitas</strong></div>
        <div class="kpi-card"><span>📊 Rata-Rata Skor Kelas</span><strong>${avgScore} Poin</strong></div>
        <div class="kpi-card"><span>📈 Progress Belajar Kelas</span><strong>${avgProgress}%</strong></div>
      </div>

      <div class="classroom-grid-2col" style="margin-top:14px;">
        <div class="glass-panel">
          <h4>➕ Buat Kelas Baru / Terbitkan Tugas & Ujian</h4>
          <div class="form-stack">
            <label><strong>1. Buat Classroom Baru (Otomatis Generate Kode Kelas):</strong></label>
            <div class="input-row-inline">
              <input type="text" id="new-class-name" placeholder="Nama Kelas (Misal: Kelas 9B Unggulan)" class="input-styled" />
              <input type="text" id="new-class-subject" placeholder="Mata Pelajaran" class="input-styled" />
              <select id="new-class-level" class="select-styled">
                <option value="sd">SD</option>
                <option value="smp" selected>SMP</option>
                <option value="sma">SMA</option>
                <option value="smk">SMK</option>
                <option value="univ">Universitas</option>
              </select>
              <button class="btn-primary btn-sm" onclick="ClassroomSystem.createNewClassroom()">Buat Kelas</button>
            </div>

            <hr class="divider-line" />

            <label><strong>2. Tambah Aktivitas ke Kelas [${cls.code}]:</strong></label>
            <div class="input-row-inline">
              <input type="text" id="new-act-title" placeholder="Judul Kuis / Tugas / Ujian" class="input-styled" />
              <select id="new-act-mode" class="select-styled">
                <option value="Live Quiz">Live Quiz</option>
                <option value="Class Battle">Class Battle</option>
                <option value="Assignment">Assignment</option>
                <option value="Exam Mode">Exam Mode</option>
                <option value="Learning Adventure">Learning Adventure</option>
              </select>
              <select id="new-act-subject" class="select-styled">
                <option value="Matematika">Matematika</option>
                <option value="IPA">IPA / Sains</option>
                <option value="Informatika">Informatika</option>
                <option value="Sejarah">Sejarah</option>
                <option value="Bahasa Inggris">Bahasa Inggris</option>
              </select>
              <button class="btn-primary btn-sm" onclick="ClassroomSystem.createClassActivity()">+ Terbitkan</button>
            </div>
          </div>
        </div>

        <div class="glass-panel">
          <h4>📋 Daftar Murid, Nilai & Manajemen Akses (${cls.code})</h4>
          <div class="leaderboard-list">
            ${sortedStudents.map((s, idx) => `
              <div class="lb-row">
                <span class="lb-rank">#${idx + 1}</span>
                <span class="lb-name">
                  <strong>${s.name}</strong> • Tugas Selesai: ${s.tasksDone} • Progress: ${s.progress}%
                </span>
                <span class="lb-score">${s.score} Pts</span>
                <button class="btn-danger-xs" onclick="ClassroomSystem.removeStudent('${s.name}')" title="Keluarkan dari kelas">✕</button>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  }

  function selectClass(code) {
    activeClassCode = code;
    renderClassroomScreen();
  }

  return {
    init,
    setRoleView,
    selectClass,
    joinByCode,
    createNewClassroom,
    createClassActivity,
    launchClassroomActivity,
    markActivityCompleted,
    removeStudent,
    renderClassroomScreen
  };
})();
