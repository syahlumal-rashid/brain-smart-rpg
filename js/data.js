// ============================================================================
// BRAIN SMART RPG v3.0 — GAME DATABASE & CURRICULUM DATA (js/data.js)
// ============================================================================

window.GAME_DATA = {
  // 1. EDUCATION LEVELS & SUBJECTS (Section 4 GDD)
  educationLevels: [
    {
      id: "sd",
      name: "Elementary School (SD)",
      grades: "Kelas 1–6",
      color: "#EF4444",
      uniformColor: 0xdc2626, // Merah Putih
      icon: "🎒",
      description: "Fondasi dasar berhitung, membaca, sains, dan nilai Pancasila.",
      subjects: [
        "Matematika Dasar",
        "Bahasa Indonesia",
        "Pendidikan Pancasila",
        "IPA",
        "IPS",
        "Bahasa Inggris Dasar",
        "Seni dan Budaya"
      ]
    },
    {
      id: "smp",
      name: "Junior High School (SMP)",
      grades: "Kelas 7–9",
      color: "#3B82F6",
      uniformColor: 0x1d4ed8, // Putih Biru Tua
      icon: "📘",
      description: "Pengembangan logika, sains terpadu, informatika, dan sejarah.",
      subjects: [
        "Matematika",
        "Bahasa Indonesia",
        "Bahasa Inggris",
        "IPA",
        "IPS",
        "Pendidikan Pancasila",
        "Informatika",
        "Sejarah"
      ]
    },
    {
      id: "sma",
      name: "Senior High School (SMA)",
      grades: "Kelas 10–12",
      color: "#60A5FA",
      uniformColor: 0x64748b, // Putih Abu-abu
      icon: "🔬",
      description: "Pendalaman sains murni, sosial humaniora, dan teknologi.",
      subjects: [
        "Matematika",
        "Fisika",
        "Kimia",
        "Biologi",
        "Ekonomi",
        "Sejarah",
        "Sosiologi",
        "Geografi",
        "Informatika",
        "Bahasa Indonesia",
        "Bahasa Inggris",
        "Pendidikan Pancasila"
      ]
    },
    {
      id: "smk",
      name: "Vocational School (SMK)",
      grades: "Kejuruan Kelas 10–12",
      color: "#F59E0B",
      uniformColor: 0xd97706, // Wearpack / Kejuruan
      icon: "⚙️",
      description: "Keahlian terapan siap kerja di bidang teknologi, bisnis, dan rekayasa.",
      subjects: [
        "Rekayasa Perangkat Lunak",
        "Teknik Komputer dan Jaringan",
        "Akuntansi",
        "Bisnis",
        "Desain",
        "Teknik Otomotif"
      ]
    },
    {
      id: "univ",
      name: "University (Mahasiswa)",
      grades: "Program Studi S1",
      color: "#8B5CF6",
      uniformColor: 0x6d28d9, // Jas Almamater Ungu/Biru
      icon: "🎓",
      description: "Pendidikan tinggi berbasis riset, rekayasa sistem, dan keilmuan lanjut.",
      subjects: [
        "Teknologi Informasi",
        "Pendidikan",
        "Ekonomi",
        "Sains",
        "Bisnis",
        "Komunikasi"
      ]
    },
    {
      id: "teacher",
      name: "Teacher Academy (Guru)",
      grades: "Tenaga Pendidik",
      color: "#10B981",
      uniformColor: 0x059669,
      icon: "👩‍🏫",
      description: "Pusat manajemen pembelajaran, penyusunan kuis, kelas virtual, dan evaluasi.",
      subjects: [
        "Pedagogik & Kurikulum",
        "Manajemen Kelas Digital",
        "Asesmen & Evaluasi"
      ]
    }
  ],

  // 2. WORLD LOCATIONS (Section 2.1 GDD - 13 Locations in Brain Academy World)
  worldLocations: [
    { id: 1, name: "Main School Building", x: 0, z: 0, color: 0x3b82f6, icon: "🏫", npc: "Headmaster Wijaya", role: "Headmaster", questId: "q_welcome", desc: "Gedung utama pusat administrasi dan aula penerimaan siswa baru." },
    { id: 2, name: "Elementary School Area", x: -26, z: -18, color: 0xef4444, icon: "🎈", npc: "Ibu Sari (Guru SD)", role: "Teacher", levelId: "sd", desc: "Area belajar ceria untuk siswa SD Kelas 1–6." },
    { id: 3, name: "Junior High School Area", x: 26, z: -18, color: 0x2563eb, icon: "📐", npc: "Pak Budi (Guru SMP)", role: "Teacher", levelId: "smp", desc: "Gedung siswa SMP Kelas 7–9 dengan klub sains dan informatika." },
    { id: 4, name: "Senior High School Area", x: -28, z: 18, color: 0x64748b, icon: "🧪", npc: "Pak Hendra (Guru SMA)", role: "Teacher", levelId: "sma", desc: "Kompleks SMA & SMK untuk persiapan olimpiade dan keahlian." },
    { id: 5, name: "University Area", x: 28, z: 18, color: 0x8b5cf6, icon: "🎓", npc: "Prof. Ardiansyah", role: "Teacher", levelId: "univ", desc: "Kampus riset mahasiswa berbagai program studi." },
    { id: 6, name: "Teacher Office", x: -14, z: -6, color: 0x10b981, icon: "📋", npc: "Koordinator Kurikulum", role: "Teacher", desc: "Ruang guru untuk akses Teacher Academy & Classroom." },
    { id: 7, name: "Library", x: 14, z: -6, color: 0xd97706, icon: "📚", npc: "Pustakawan Nadia", role: "School NPC", desc: "Perpustakaan digital berisi modul belajar lengkap." },
    { id: 8, name: "Science Laboratory", x: -16, z: 8, color: 0x06b6d4, icon: "🔬", npc: "Asisten Lab Raka", role: "University Student", desc: "Laboratorium eksperimen IPA, Fisika, Kimia, dan Biologi." },
    { id: 9, name: "Computer Laboratory", x: 16, z: 8, color: 0x6366f1, icon: "💻", npc: "Mentor Devina", role: "Senior High Student", desc: "Pusat tantangan Informatika, RPL, dan TKJ." },
    { id: 10, name: "Cafeteria", x: 0, z: -26, color: 0xf97316, icon: "🍱", npc: "Koki Pak Maman", role: "School NPC", desc: "Kantin sekolah tempat berkumpul dan berbagi tips belajar." },
    { id: 11, name: "School Playground", x: -38, z: 0, color: 0x22c55e, icon: "🛝", npc: "Dika (Murid SD)", role: "Elementary Student", desc: "Taman bermain dengan mini-game cepat dan latihan santai." },
    { id: 12, name: "Sports Arena", x: 38, z: 0, color: 0xeab308, icon: "🏀", npc: "Kapten Rio (SMP)", role: "Junior High Student", desc: "Arena ketangkasan, Math Race, dan tantangan kecepatan." },
    { id: 13, name: "Competition Hall", x: 0, z: 28, color: 0xec4899, icon: "🏆", npc: "Grand Arbiter Zane", role: "Headmaster", desc: "Gedung turnamen Ranked Battle, Boss Challenge, dan Local 2P!" }
  ],

  // 3. MINI-GAME LIST (Section 9 GDD - 10 Mini-Games)
  miniGames: [
    { id: "quick_answer", name: "Quick Answer", icon: "⚡", category: "General", mvp: true, desc: "Jawab cepat pertanyaan pilihan ganda sebelum waktu habis!" },
    { id: "math_race", name: "Math Race", icon: "🏎️", category: "Math", mvp: true, desc: "Balapan berhitung cepat! Setiap jawaban benar melajukan karaktermu." },
    { id: "memory_challenge", name: "Memory Challenge", icon: "🧠", category: "Logic", mvp: true, desc: "Ingat pola simbol/fakta edukasi yang ditampilkan lalu pilih pasangannya!" },
    { id: "true_false", name: "True or False", icon: "⚖️", category: "General", mvp: true, desc: "Tentukan dengan kilat apakah pernyataan ilmiah/sejarah ini BENAR atau SALAH!" },
    { id: "word_battle", name: "Word Battle", icon: "🔤", category: "Language", mvp: true, desc: "Susun dan lengkapi kosakata Bahasa Indonesia & Bahasa Inggris dengan tepat!" },
    { id: "history_quiz", name: "History Quiz", icon: "🏛️", category: "History", mvp: false, desc: "Uji wawasan sejarah Nusantara dan dunia dari masa ke masa." },
    { id: "tech_challenge", name: "Technology Challenge", icon: "💻", category: "Tech", mvp: false, desc: "Tantangan algoritma, perangkat keras, jaringan, dan pemrograman." },
    { id: "logic_puzzle", name: "Logic Puzzle", icon: "🧩", category: "Logic", mvp: false, desc: "Pecahkan deret angka dan penalaran analitis tingkat tinggi." },
    { id: "science_challenge", name: "Science Challenge", icon: "🧬", category: "Science", mvp: false, desc: "Eksperimen cepat IPA, Fisika, Kimia, dan Biologi." },
    { id: "geo_challenge", name: "Geography Challenge", icon: "🌍", category: "Geography", mvp: false, desc: "Tebak ibu kota, bentang alam, iklim, dan peta dunia." }
  ],

  // 4. COMPETITIVE RANKS (Section 10 GDD)
  ranks: [
    { name: "Bronze III", minRP: 0, icon: "🥉", color: "#CD7F32" },
    { name: "Bronze II", minRP: 100, icon: "🥉", color: "#CD7F32" },
    { name: "Bronze I", minRP: 200, icon: "🥉", color: "#CD7F32" },
    { name: "Silver III", minRP: 300, icon: "🥈", color: "#C0C0C0" },
    { name: "Silver II", minRP: 450, icon: "🥈", color: "#C0C0C0" },
    { name: "Silver I", minRP: 600, icon: "🥈", color: "#C0C0C0" },
    { name: "Gold III", minRP: 800, icon: "🥇", color: "#F59E0B" },
    { name: "Gold II", minRP: 1000, icon: "🥇", color: "#F59E0B" },
    { name: "Gold I", minRP: 1200, icon: "🥇", color: "#F59E0B" },
    { name: "Platinum III", minRP: 1450, icon: "💠", color: "#06B6D4" },
    { name: "Platinum II", minRP: 1700, icon: "💠", color: "#06B6D4" },
    { name: "Platinum I", minRP: 1950, icon: "💠", color: "#06B6D4" },
    { name: "Diamond III", minRP: 2250, icon: "💎", color: "#3B82F6" },
    { name: "Diamond II", minRP: 2550, icon: "💎", color: "#3B82F6" },
    { name: "Diamond I", minRP: 2850, icon: "💎", color: "#3B82F6" },
    { name: "Mythic", minRP: 3200, icon: "👑", color: "#EC4899" }
  ],

  // 5. BADGES & ACHIEVEMENTS (Section 7 & 19 GDD - 10 MVP Badges)
  badges: [
    { id: "first_victory", name: "First Victory", icon: "🏅", desc: "Menang pertandingan pertama", reqType: "wins", reqVal: 1, rewardGold: 100 },
    { id: "math_genius", name: "Math Genius", icon: "🧮", desc: "Menyelesaikan 100 soal matematika", reqType: "math_solved", reqVal: 100, rewardGold: 300 },
    { id: "history_master", name: "History Master", icon: "📜", desc: "Menyelesaikan 100 soal sejarah", reqType: "history_solved", reqVal: 100, rewardGold: 300 },
    { id: "tech_expert", name: "Tech Expert", icon: "💻", desc: "Menyelesaikan 100 soal teknologi", reqType: "tech_solved", reqVal: 100, rewardGold: 300 },
    { id: "quiz_champion", name: "Quiz Champion", icon: "🏆", desc: "Menang 50 pertandingan", reqType: "wins", reqVal: 50, rewardGold: 500 },
    { id: "perfect_brain", name: "Perfect Brain", icon: "🧠", desc: "Mendapat nilai sempurna (5/5 benar)", reqType: "perfect_matches", reqVal: 1, rewardGold: 200 },
    { id: "knowledge_hunter", name: "Knowledge Hunter", icon: "🦉", desc: "Menyelesaikan seluruh kategori jenjang", reqType: "categories_played", reqVal: 5, rewardGold: 400 },
    { id: "school_explorer", name: "School Explorer", icon: "🧭", desc: "Mengunjungi 5 lokasi di Brain Academy World", reqType: "locations_visited", reqVal: 5, rewardGold: 150 },
    { id: "class_star", name: "Class Star", icon: "⭐", desc: "Menyelesaikan aktivitas Classroom pertama", reqType: "classroom_done", reqVal: 1, rewardGold: 150 },
    { id: "boss_slayer", name: "Boss Slayer", icon: "⚔️", desc: "Mengalahkan Boss Challenge pertama", reqType: "boss_wins", reqVal: 1, rewardGold: 250 }
  ],

  // 6. SHOP & INVENTORY ITEMS (Section 6 & 12 GDD - Strictly Cosmetic, Non-P2W)
  shopItems: [
    // Character Skins
    { id: "skin_default", name: "Standard School Uniform", category: "Character Skin", currency: "gold", price: 0, shopType: "gold", color: 0x3b82f6, icon: "👕", desc: "Seragam standar Brain Academy." },
    { id: "skin_blazer_gold", name: "Honor Blazer Gold", category: "Character Skin", currency: "gold", price: 250, shopType: "gold", color: 0xf59e0b, icon: "🧥", desc: "Blazer siswa teladan berwarna emas cerah." },
    { id: "skin_cyber_scholar", name: "Cyber Scholar Suit", category: "Character Skin", currency: "diamond", price: 50, shopType: "diamond", color: 0x06b6d4, icon: "🤖", desc: "Setelan futuristik klub robotika & informatika." },
    { id: "skin_batik_nusantara", name: "Batik Nusantara Pride", category: "Character Skin", currency: "gold", price: 300, shopType: "event", color: 0xb45309, icon: "👘", desc: "Seragam batik spesial kemerdekaan & budaya." },
    { id: "skin_astronaut", name: "Space Researcher", category: "Character Skin", currency: "diamond", price: 80, shopType: "diamond", color: 0xe2e8f0, icon: "👩‍🚀", desc: "Kostum astronot olimpiade sains nasional." },

    // Avatar Frames
    { id: "frame_basic", name: "Simple Frame", category: "Avatar Frame", currency: "gold", price: 0, shopType: "gold", icon: "🖼️", desc: "Bingkai profil dasar." },
    { id: "frame_scholar", name: "Golden Wreath Frame", category: "Avatar Frame", currency: "gold", price: 150, shopType: "daily", icon: "🌿", desc: "Bingkai daun emas juara kelas." },
    { id: "frame_neon", name: "Neon Cyber Frame", category: "Avatar Frame", currency: "diamond", price: 30, shopType: "diamond", icon: "✨", desc: "Bingkai bercahaya neon elektrik." },

    // Emotes
    { id: "emote_wave", name: "Friendly Wave", category: "Emote", currency: "gold", price: 0, shopType: "gold", icon: "👋", desc: "Menyapa teman di sekolah." },
    { id: "emote_cheer", name: "Victory Jump", category: "Emote", currency: "gold", price: 120, shopType: "daily", icon: "🙌", desc: "Lompatan semangat saat jawaban benar!" },
    { id: "emote_eureka", name: "Eureka Idea!", category: "Emote", currency: "diamond", price: 25, shopType: "diamond", icon: "💡", desc: "Animasi bola lampu ide cemerlang." },

    // Titles
    { id: "title_newbie", name: "New Student", category: "Title", currency: "gold", price: 0, shopType: "gold", icon: "🏷️", desc: "Gelar awal siswa baru." },
    { id: "title_prodigy", name: "Academy Prodigy", category: "Title", currency: "gold", price: 200, shopType: "gold", icon: "🌟", desc: "Gelar bagi pembelajar tekun." },
    { id: "title_grandmaster", name: "Grand Quizmaster", category: "Title", currency: "diamond", price: 45, shopType: "event", icon: "👑", desc: "Gelar kehormatan turnamen." },

    // Pet Companions
    { id: "pet_none", name: "Tanpa Pet", category: "Pet Companion", currency: "gold", price: 0, shopType: "gold", color: 0x000000, icon: "➖", desc: "Tidak membawa pet pendamping." },
    { id: "pet_owl", name: "Bubo the Wise Owl", category: "Pet Companion", currency: "gold", price: 350, shopType: "gold", color: 0xa855f7, icon: "🦉", desc: "Burung hantu pintar yang menemanimu berkeliling sekolah." },
    { id: "pet_robo", name: "BitBot Drone", category: "Pet Companion", currency: "diamond", price: 60, shopType: "diamond", color: 0x38bdf8, icon: "🛸", desc: "Drone mini melayang pendamping siswa IT." },

    // Profile Backgrounds
    { id: "bg_classroom", name: "Sunny Classroom", category: "Profile Background", currency: "gold", price: 0, shopType: "gold", icon: "🌅", desc: "Latar ruang kelas pagi hari." },
    { id: "bg_library", name: "Grand Library", category: "Profile Background", currency: "gold", price: 180, shopType: "daily", icon: "🏛️", desc: "Latar perpustakaan megah." },
    { id: "bg_galaxy", name: "Cosmic Observatory", category: "Profile Background", currency: "diamond", price: 40, shopType: "event", icon: "🌌", desc: "Latar observatorium bintang." }
  ],

  // 7. QUESTS & SEASONAL EVENTS (Section 13 GDD)
  quests: {
    daily: [
      { id: "dq_win2", title: "Menangkan 2 Pertandingan", type: "wins", target: 2, rewardGold: 100, rewardExp: 80 },
      { id: "dq_solve10", title: "Selesaikan 10 Soal", type: "total_solved", target: 10, rewardGold: 80, rewardExp: 60 },
      { id: "dq_minigame1", title: "Ikuti 1 Mini-Game", type: "matches_played", target: 1, rewardGold: 50, rewardExp: 50 },
      { id: "dq_academy1", title: "Selesaikan 1 Aktivitas Academy", type: "academy_sessions", target: 1, rewardGold: 75, rewardExp: 70 }
    ],
    weekly: [
      { id: "wq_win10", title: "Menangkan 10 Pertandingan", type: "wins", target: 10, rewardGold: 400, rewardExp: 300 },
      { id: "wq_solve50", title: "Selesaikan 50 Soal", type: "total_solved", target: 50, rewardGold: 350, rewardExp: 250 },
      { id: "wq_badge3", title: "Dapatkan 3 Badge", type: "badges_earned", target: 3, rewardGold: 300, rewardExp: 250 },
      { id: "wq_boss5", title: "Selesaikan 5 Boss/Dungeon Challenge", type: "boss_wins", target: 5, rewardGold: 500, rewardExp: 400 }
    ],
    seasonal: [
      { id: "ev_math", name: "Math Festival", icon: "➗", bannerColor: "#2563EB", bonusText: "Bonus +50 Gold setiap selesai Math Race!", active: true },
      { id: "ev_history", name: "History Week", icon: "🏛️", bannerColor: "#D97706", bonusText: "Jelajahi Sejarah Nusantara & klaim Batik Skin!", active: true },
      { id: "ev_tech", name: "Technology Championship", icon: "🤖", bannerColor: "#0891B2", bonusText: "Kompetisi Coding, TKJ & Informatika Nasional!", active: true },
      { id: "ev_merdeka", name: "Independence Day Event", icon: "🇮🇩", bannerColor: "#DC2626", bonusText: "Semarak Kemerdekaan: Kuis Pancasila & Sejarah!", active: true },
      { id: "ev_master", name: "Brain Master Tournament", icon: "👑", bannerColor: "#7C3AED", bonusText: "Turnamen Puncak Antar-Jenjang Pendidikan!", active: true }
    ]
  },

  // 8. QUESTION BANK DATABASE (Covers SD, SMP, SMA, SMK, Univ + Categories)
  questions: [
    // ================= SD (Kelas 1-6) =================
    { id: 101, level: "sd", subject: "Matematika Dasar", category: "Math", q: "Berapakah hasil dari 24 + 38?", options: ["52", "62", "64", "72"], a: 1, tfStatement: "Hasil dari 24 + 38 adalah 62.", tfAnswer: true, wordHint: "ENAM PULUH DUA", wordTarget: "ENAMPULUHDUA", explain: "24 + 38 = (20+30) + (4+8) = 50 + 12 = 62." },
    { id: 102, level: "sd", subject: "Matematika Dasar", category: "Math", q: "Sebuah persegi memiliki panjang sisi 9 cm. Berapakah kelilingnya?", options: ["18 cm", "27 cm", "36 cm", "81 cm"], a: 2, tfStatement: "Keliling persegi dengan sisi 9 cm adalah 36 cm.", tfAnswer: true, wordHint: "Bangun datar keempat sisinya sama panjang", wordTarget: "PERSEGI", explain: "Keliling persegi = 4 × sisi = 4 × 9 cm = 36 cm." },
    { id: 103, level: "sd", subject: "Matematika Dasar", category: "Math", q: "Hasil dari 8 × 7 adalah...", options: ["54", "56", "58", "64"], a: 1, tfStatement: "Hasil perkalian 8 dikali 7 adalah 54.", tfAnswer: false, wordHint: "Operasi penjumlahan berulang dalam matematika", wordTarget: "PERKALIAN", explain: "8 × 7 = 56." },
    { id: 104, level: "sd", subject: "Bahasa Indonesia", category: "Language", q: "Lawan kata (antonim) dari kata 'Rajin' adalah...", options: ["Tekun", "Malas", "Cepat", "Pintar"], a: 1, tfStatement: "Antonim dari kata Rajin adalah Tekun.", tfAnswer: false, wordHint: "Lawan kata dalam Bahasa Indonesia disebut...", wordTarget: "ANTONIM", explain: "Antonim adalah lawan kata; lawan kata rajin adalah malas." },
    { id: 105, level: "sd", subject: "Pendidikan Pancasila", category: "General", q: "Lambang sila pertama Pancasila 'Ketuhanan Yang Maha Esa' adalah...", options: ["Rantai Emas", "Pohon Beringin", "Bintang", "Padi dan Kapas"], a: 2, tfStatement: "Bintang emas adalah lambang sila pertama Pancasila.", tfAnswer: true, wordHint: "Lambang sila ke-1 Pancasila", wordTarget: "BINTANG", explain: "Sila ke-1 dilambangkan dengan Bintang Emas." },
    { id: 106, level: "sd", subject: "IPA", category: "Science", q: "Proses tumbuhan hijau memasak makanannya sendiri dengan bantuan cahaya matahari disebut...", options: ["Respirasi", "Fotosintesis", "Evaporasi", "Metamorfosis"], a: 1, tfStatement: "Tumbuhan memasak makanan melalui proses fotosintesis.", tfAnswer: true, wordHint: "Proses memasak makanan pada daun dengan cahaya matahari", wordTarget: "FOTOSINTESIS", explain: "Fotosintesis mengubah air dan CO2 menjadi glukosa dan oksigen dengan bantuan klorofil & cahaya matahari." },
    { id: 107, level: "sd", subject: "IPS", category: "Geography", q: "Ibu kota Provinsi Jawa Barat adalah...", options: ["Semarang", "Surabaya", "Bandung", "Yogyakarta"], a: 2, tfStatement: "Ibu kota Provinsi Jawa Barat adalah Bandung.", tfAnswer: true, wordHint: "Kota Kembang, ibu kota Jawa Barat", wordTarget: "BANDUNG", explain: "Bandung adalah ibu kota Provinsi Jawa Barat." },
    { id: 108, level: "sd", subject: "Bahasa Inggris Dasar", category: "Language", q: "Bahasa Inggris dari 'Perpustakaan' adalah...", options: ["Kitchen", "Library", "Classroom", "Hospital"], a: 1, tfStatement: "'Library' artinya adalah Kantin Sekolah.", tfAnswer: false, wordHint: "Bahasa Inggris dari Perpustakaan", wordTarget: "LIBRARY", explain: "Library = Perpustakaan, Classroom = Ruang Kelas." },
    { id: 109, level: "sd", subject: "Seni dan Budaya", category: "General", q: "Alat musik tradisional Angklung berasal dari daerah...", options: ["Jawa Barat", "Sumatera Barat", "Bali", "Papua"], a: 0, tfStatement: "Angklung berasal dari Jawa Barat dan terbuat dari bambu.", tfAnswer: true, wordHint: "Alat musik bambu dari Jawa Barat", wordTarget: "ANGKLUNG", explain: "Angklung adalah alat musik bambu khas Sunda / Jawa Barat." },

    // ================= SMP (Kelas 7-9) =================
    { id: 201, level: "smp", subject: "Matematika", category: "Math", q: "Jika 3x + 5 = 20, maka nilai x adalah...", options: ["3", "5", "6", "15"], a: 1, tfStatement: "Pada persamaan 3x + 5 = 20, nilai x adalah 5.", tfAnswer: true, wordHint: "Cabang matematika yang menggunakan huruf/variabel", wordTarget: "ALJABAR", explain: "3x = 20 - 5 = 15, sehingga x = 15 / 3 = 5." },
    { id: 202, level: "smp", subject: "Matematika", category: "Math", q: "Segitiga siku-siku memiliki alas 6 cm dan tinggi 8 cm. Panjang sisi miringnya (hipotenusa) adalah...", options: ["9 cm", "10 cm", "12 cm", "14 cm"], a: 1, tfStatement: "Menurut teorema Pythagoras, sisi miring dari 6 cm dan 8 cm adalah 10 cm.", tfAnswer: true, wordHint: "Teorema segitiga siku-siku: a² + b² = c²", wordTarget: "PYTHAGORAS", explain: "c = √(6² + 8²) = √(36 + 64) = √100 = 10 cm." },
    { id: 203, level: "smp", subject: "IPA", category: "Science", q: "Organel sel yang berfungsi sebagai tempat respirasi sel dan penghasil energi (ATP) adalah...", options: ["Ribosom", "Mitokondria", "Lisosom", "Badan Golgi"], a: 1, tfStatement: "Mitokondria dikenal sebagai 'the powerhouse of the cell'.", tfAnswer: true, wordHint: "Organel penghasil energi sel", wordTarget: "MITOKONDRIA", explain: "Mitokondria menghasilkan energi ATP melalui respirasi seluler." },
    { id: 204, level: "smp", subject: "Informatika", category: "Tech", q: "Bilangan biner 1010 jika dikonversi ke bilangan desimal bernilai...", options: ["8", "10", "12", "14"], a: 1, tfStatement: "Bilangan biner 1010 sama dengan 10 dalam desimal.", tfAnswer: true, wordHint: "Sistem bilangan berbasis 2 (0 dan 1)", wordTarget: "BINER", explain: "(1×2³) + (0×2²) + (1×2¹) + (0×2⁰) = 8 + 0 + 2 + 0 = 10." },
    { id: 205, level: "smp", subject: "Sejarah", category: "History", q: "Pembacaan teks Proklamasi Kemerdekaan Indonesia pada 17 Agustus 1945 dilaksanakan di...", options: ["Jl. Pegangsaan Timur No. 56", "Lapangan Ikada", "Gedung Sumpah Pemuda", "Istana Merdeka"], a: 0, tfStatement: "Proklamasi 17 Agustus 1945 dibacakan di Jl. Pegangsaan Timur No. 56, Jakarta.", tfAnswer: true, wordHint: "Peristiwa 17 Agustus 1945", wordTarget: "PROKLAMASI", explain: "Proklamasi dibacakan oleh Ir. Soekarno didampingi Drs. Moh. Hatta di Jl. Pegangsaan Timur No. 56." },
    { id: 206, level: "smp", subject: "Bahasa Inggris", category: "Language", q: "Bentuk Past Tense (Verb 2) dari kata kerja 'Go' adalah...", options: ["Goed", "Gone", "Went", "Going"], a: 2, tfStatement: "Bentuk lampau (V2) dari 'Go' adalah 'Went'.", tfAnswer: true, wordHint: "Verb 2 dari Go", wordTarget: "WENT", explain: "Irregular verb: Go (V1) - Went (V2) - Gone (V3)." },
    { id: 207, level: "smp", subject: "IPS", category: "Geography", q: "Garis khayal yang membagi bumi menjadi belahan Utara dan Selatan disebut garis...", options: ["Bujur", "Khatulistiwa (Ekuator)", "Meridian", "Balik Utara"], a: 1, tfStatement: "Garis Khatulistiwa berada pada lintang 0 derajat.", tfAnswer: true, wordHint: "Nama lain garis Khatulistiwa", wordTarget: "EKUATOR", explain: "Garis Khatulistiwa (Ekuator) berada di lintang 0°." },
    { id: 208, level: "smp", subject: "Pendidikan Pancasila", category: "General", q: "Semboyan Bhinneka Tunggal Ika diambil dari kitab Sutasoma karangan...", options: ["Mpu Prapanca", "Mpu Tantular", "Mpu Gandring", "Mpu Sedah"], a: 1, tfStatement: "Kitab Sutasoma ditulis oleh Mpu Tantular pada masa Majapahit.", tfAnswer: true, wordHint: "Pengarang kitab Sutasoma (Mpu ...)", wordTarget: "TANTULAR", explain: "Mpu Tantular menulis kitab Sutasoma yang memuat frasa Bhinneka Tunggal Ika." },

    // ================= SMA (Kelas 10-12) =================
    { id: 301, level: "sma", subject: "Fisika", category: "Science", q: "Sebuah benda bermassa 4 kg diberi gaya 20 N pada bidang licin. Percepatan benda tersebut adalah...", options: ["2 m/s²", "5 m/s²", "16 m/s²", "80 m/s²"], a: 1, tfStatement: "Menurut Hukum II Newton, a = F / m, sehingga 20 N / 4 kg = 5 m/s².", tfAnswer: true, wordHint: "Ilmuwan pencetus hukum gerak F = m × a", wordTarget: "NEWTON", explain: "Berdasarkan Hukum II Newton: a = F / m = 20 / 4 = 5 m/s²." },
    { id: 302, level: "sma", subject: "Kimia", category: "Science", q: "Unsur dengan nomor atom 6 dan menjadi tulang punggung senyawa organik adalah...", options: ["Oksigen (O)", "Nitrogen (N)", "Karbon (C)", "Hidrogen (H)"], a: 2, tfStatement: "Karbon (C) memiliki nomor atom 6 dan 4 elektron valensi.", tfAnswer: true, wordHint: "Unsur kimia bernomor atom 6", wordTarget: "KARBON", explain: "Karbon (C) memiliki nomor atom 6 (konfigurasi 2, 4)." },
    { id: 303, level: "sma", subject: "Biologi", category: "Science", q: "Molekul pembawa informasi genetik yang berbentuk double helix (pilin ganda) adalah...", options: ["RNA", "ATP", "DNA", "Enzim"], a: 2, tfStatement: "DNA berbentuk rantai pilin ganda (double helix).", tfAnswer: true, wordHint: "Bagian segmen DNA penentu sifat warisan", wordTarget: "GENETIKA", explain: "DNA (Deoxyribonucleic Acid) ditemukan struktur double helix-nya oleh Watson, Crick, dan Franklin." },
    { id: 304, level: "sma", subject: "Matematika", category: "Math", q: "Turunan pertama f'(x) dari fungsi f(x) = 3x² + 4x - 7 adalah...", options: ["3x + 4", "6x + 4", "6x - 7", "x³ + 2x²"], a: 1, tfStatement: "Turunan pertama dari 3x² + 4x - 7 adalah 6x + 4.", tfAnswer: true, wordHint: "Cabang matematika yang mempelajari limit, turunan, dan integral", wordTarget: "KALKULUS", explain: "f'(x) = 2·3x^(2-1) + 4 = 6x + 4." },
    { id: 305, level: "sma", subject: "Ekonomi", category: "General", q: "Kondisi kenaikan harga barang dan jasa secara umum dan terus-menerus dalam jangka waktu tertentu disebut...", options: ["Deflasi", "Inflasi", "Devaluasi", "Resesi"], a: 1, tfStatement: "Inflasi menyebabkan daya beli mata uang meningkat.", tfAnswer: false, wordHint: "Kenaikan harga barang secara umum dan terus-menerus", wordTarget: "INFLASI", explain: "Inflasi adalah kenaikan harga secara umum yang menurunkan nilai riil mata uang." },
    { id: 306, level: "sma", subject: "Geografi", category: "Geography", q: "Lapisan atmosfer bumi paling bawah tempat terjadinya fenomena cuaca, awan, dan hujan adalah...", options: ["Stratosfer", "Troposfer", "Mesosfer", "Termosfer"], a: 1, tfStatement: "Cuaca dan hujan terjadi di lapisan Troposfer.", tfAnswer: true, wordHint: "Lapisan atmosfer tempat terjadinya cuaca", wordTarget: "TROPOSFER", explain: "Troposfer adalah lapisan atmosfer terendah (0–12 km) tempat berlangsungnya cuaca." },
    { id: 307, level: "sma", subject: "Sosiologi", category: "General", q: "Perpindahan status sosial seseorang dari lapisan bawah ke lapisan sosial yang lebih tinggi disebut...", options: ["Social Sinking", "Social Climbing", "Horizontal Mobility", "Asimilasi"], a: 1, tfStatement: "Social Climbing adalah mobilitas sosial vertikal ke atas.", tfAnswer: true, wordHint: "Perpindahan status dalam masyarakat: Mobilitas ...", wordTarget: "SOSIAL", explain: "Mobilitas sosial vertikal naik disebut Social Climbing." },
    { id: 308, level: "sma", subject: "Sejarah", category: "History", q: "Organisasi pergerakan nasional modern pertama di Indonesia yang berdiri pada 20 Mei 1908 adalah...", options: ["Sarekat Islam", "Budi Utomo", "Indische Partij", "Perhimpunan Indonesia"], a: 1, tfStatement: "Hari berdirinya Budi Utomo (20 Mei) diperingati sebagai Hari Kebangkitan Nasional.", tfAnswer: true, wordHint: "Organisasi yang berdiri 20 Mei 1908", wordTarget: "BUDIUTOMO", explain: "Budi Utomo didirikan oleh dr. Sutomo dan mahasiswa STOVIA pada 20 Mei 1908." },

    // ================= SMK (Vocational School) =================
    { id: 401, level: "smk", subject: "Rekayasa Perangkat Lunak", category: "Tech", q: "Dalam pemrograman berorientasi objek (OOP), konsep menyembunyikan detail data internal menggunakan modifier private disebut...", options: ["Inheritance", "Polymorphism", "Encapsulation", "Abstraction"], a: 2, tfStatement: "Encapsulation membungkus data dan metode dalam satu class serta membatasi akses langsung.", tfAnswer: true, wordHint: "Cetak biru (blueprint) dari objek dalam OOP", wordTarget: "CLASS", explain: "Encapsulation (enkapsulasi) melindungi state objek dari modifikasi luar secara sembarangan." },
    { id: 402, level: "smk", subject: "Teknik Komputer dan Jaringan", category: "Tech", q: "Protokol jaringan yang bertugas memberikan alamat IP secara otomatis kepada perangkat klien adalah...", options: ["DNS", "DHCP", "HTTP", "FTP"], a: 1, tfStatement: "DHCP memberikan IP Address secara otomatis ke komputer klien.", tfAnswer: true, wordHint: "Perangkat penghubung dua jaringan berbeda subnet", wordTarget: "ROUTER", explain: "DHCP (Dynamic Host Configuration Protocol) mendistribusikan konfigurasi IP secara otomatis." },
    { id: 403, level: "smk", subject: "Akuntansi", category: "Math", q: "Persamaan dasar akuntansi yang benar adalah...", options: ["Aset = Liabilitas + Ekuitas", "Aset = Liabilitas - Ekuitas", "Ekuitas = Aset + Liabilitas", "Liabilitas = Aset + Ekuitas"], a: 0, tfStatement: "Persamaan dasar akuntansi adalah Aset = Kewajiban (Liabilitas) + Modal (Ekuitas).", tfAnswer: true, wordHint: "Harta yang dimiliki perusahaan dalam akuntansi", wordTarget: "ASET", explain: "Harta (Aset) selalu seimbang dengan sumber pendanaannya: Liabilitas (Utang) + Ekuitas (Modal)." },
    { id: 404, level: "smk", subject: "Desain", category: "General", q: "Model warna aditif yang digunakan untuk tampilan layar monitor dan smartphone adalah...", options: ["CMYK", "RGB", "Pantone", "Grayscale"], a: 1, tfStatement: "CMYK digunakan untuk layar monitor, sedangkan RGB digunakan untuk mesin cetak.", tfAnswer: false, wordHint: "Format gambar vektor yang skalabel untuk web (3 huruf)", wordTarget: "SVG", explain: "Layar digital memancarkan cahaya Red, Green, Blue (RGB), sedangkan percetakan memakai tinta CMYK." },
    { id: 405, level: "smk", subject: "Teknik Otomotif", category: "Science", q: "Urutan siklus motor bakar 4 langkah (4-tak) yang benar adalah...", options: ["Hisap - Kompresi - Usaha - Buang", "Kompresi - Hisap - Usaha - Buang", "Hisap - Usaha - Kompresi - Buang", "Usaha - Hisap - Buang - Kompresi"], a: 0, tfStatement: "Langkah ketiga pada mesin 4-tak adalah langkah Usaha (tenaga).", tfAnswer: true, wordHint: "Komponen mesin yang bergerak naik-turun di dalam silinder", wordTarget: "PISTON", explain: "Siklus Otto 4-tak: 1. Intake (Hisap), 2. Compression (Kompresi), 3. Power (Usaha), 4. Exhaust (Buang)." },

    // ================= UNIVERSITY (Mahasiswa) =================
    { id: 501, level: "univ", subject: "Teknologi Informasi", category: "Tech", q: "Berapakah kompleksitas waktu rata-rata algoritma Binary Search pada array terurut berukuran n?", options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"], a: 2, tfStatement: "Binary Search memiliki kompleksitas waktu O(log n) karena membagi ruang pencarian menjadi separuh di setiap langkah.", tfAnswer: true, wordHint: "Struktur data LIFO (Last In First Out)", wordTarget: "STACK", explain: "Binary Search membelah ruang pencarian menjadi n/2 di tiap iterasi, sehingga kompleksitasnya O(log n)." },
    { id: 502, level: "univ", subject: "Pendidikan", category: "General", q: "Dalam Taksonomi Bloom revisi Anderson & Krathwohl, tingkatan kognitif tertinggi (C6) adalah...", options: ["Menganalisis (Analyze)", "Mengevaluasi (Evaluate)", "Mencipta (Create)", "Mengaplikasikan (Apply)"], a: 2, tfStatement: "Tingkatan kognitif tertinggi pada Taksonomi Bloom revisi adalah Mencipta (Create / C6).", tfAnswer: true, wordHint: "Ilmu dan seni mengajar anak/peserta didik", wordTarget: "PEDAGOGI", explain: "Urutan C1–C6: Remember, Understand, Apply, Analyze, Evaluate, Create." },
    { id: 503, level: "univ", subject: "Bisnis", category: "General", q: "Analisis strategis yang mengevaluasi Strengths, Weaknesses, Opportunities, dan Threats disebut...", options: ["PESTEL", "SWOT", "Balanced Scorecard", "Five Forces"], a: 1, tfStatement: "Opportunities dan Threats pada analisis SWOT berasal dari faktor eksternal organisasi.", tfAnswer: true, wordHint: "Modal awal untuk merintis perusahaan rintisan (Startup)", wordTarget: "KAPITAL", explain: "SWOT memetakan faktor internal (Strengths, Weaknesses) dan eksternal (Opportunities, Threats)." },
    { id: 504, level: "univ", subject: "Komunikasi", category: "Language", q: "Formula klasik komunikasi 'Who says What in Which Channel to Whom with What Effect' dikemukakan oleh...", options: ["Claude Shannon", "Harold D. Lasswell", "Marshall McLuhan", "Wilbur Schramm"], a: 1, tfStatement: "Model komunikasi linear 5 unsur tersebut dikemukakan oleh Harold D. Lasswell.", tfAnswer: true, wordHint: "Saluran penyampaian pesan dalam komunikasi", wordTarget: "MEDIA", explain: "Model Lasswell (1948) merumuskan 5 komponen analisis komunikasi." }
  ],

  // 9. DEFAULT CLASSROOMS (Section 11 GDD - Pre-loaded for instant demo + editable)
  defaultClassrooms: [
    {
      code: "BRAIN1",
      name: "Kelas 8A - Unggulan Sains & IT",
      teacherName: "Pak Budi Santoso, M.Pd.",
      levelId: "smp",
      subject: "Informatika & Matematika",
      students: [
        { name: "Rizky Pratama", level: 7, score: 450, progress: 92, tasksDone: 3 },
        { name: "Alya Putri", level: 8, score: 480, progress: 98, tasksDone: 3 },
        { name: "Dimas Aditya", level: 6, score: 390, progress: 80, tasksDone: 2 },
        { name: "Citra Kirana", level: 7, score: 420, progress: 86, tasksDone: 3 }
      ],
      activities: [
        { id: "act_1", title: "Live Quiz: Logika Biner & Aljabar", mode: "Live Quiz", subject: "Informatika", level: "smp", deadline: "Hari Ini, 15:00", rewardGold: 120, completedByPlayer: false },
        { id: "act_2", title: "Assignment: Latihan Pythagoras", mode: "Assignment", subject: "Matematika", level: "smp", deadline: "Besok, 23:59", rewardGold: 100, completedByPlayer: false },
        { id: "act_3", title: "Exam Mode: Ujian Tengah Semester", mode: "Exam Mode", subject: "IPA", level: "smp", deadline: "Jumat, 12:00", rewardGold: 200, completedByPlayer: false },
        { id: "act_4", title: "Class Battle: Turnamen Kelompok 8A", mode: "Class Battle", subject: "Sejarah", level: "smp", deadline: "Sabtu, 10:00", rewardGold: 150, completedByPlayer: false },
        { id: "act_5", title: "Learning Adventure: Misi Lab Sains", mode: "Learning Adventure", subject: "IPA", level: "smp", deadline: "Minggu Depan", rewardGold: 180, completedByPlayer: false }
      ]
    },
    {
      code: "SMA101",
      name: "Kelas 11 IPA - Olimpiade",
      teacherName: "Ibu Ratna Dewi, S.Si.",
      levelId: "sma",
      subject: "Fisika, Kimia & Biologi",
      students: [
        { name: "Naufal Akbar", level: 11, score: 500, progress: 100, tasksDone: 4 },
        { name: "Sinta Maharani", level: 10, score: 460, progress: 91, tasksDone: 4 }
      ],
      activities: [
        { id: "act_sma1", title: "Exam Mode: Hukum Newton & Struktur Sel", mode: "Exam Mode", subject: "Fisika", level: "sma", deadline: "Hari Ini, 17:00", rewardGold: 250, completedByPlayer: false },
        { id: "act_sma2", title: "Live Quiz: Tabel Periodik & Kalkulus", mode: "Live Quiz", subject: "Kimia", level: "sma", deadline: "Besok, 14:00", rewardGold: 150, completedByPlayer: false }
      ]
    }
  ]
};
