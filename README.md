# Brain Smart RPG (Version 3.0)

> **"LEARN TOGETHER, PLAY TOGETHER, GROW TOGETHER!"**

**Brain Smart RPG** adalah game edukasi berbasis Role-Playing Game (RPG) 3D yang menggabungkan kehidupan sekolah (*RPG School Life*), pembelajaran lintas jenjang (*Educational Gaming*), kompetisi *mini-game* (*Multiplayer Quiz Battle*), serta **Classroom Mode (LMS Guru & Murid)**.

---

## Fitur Utama (Sesuai GDD & PRD v3.0)

1. **3D Brain Academy World & Main Lobby (Three.js WebGL):**
   - Karakter 3D Cartoon Stylized interaktif dengan kustomisasi Gender, Rambut, Seragam (SD/SMP/SMA/SMK/Universitas/Guru), Tas, Aksesori, Pet Companion, dan Emote.
   - Eksplorasi 13 Lokasi Sekolah 3D (*Main School Building, SD/SMP/SMA/University Area, Teacher Office, Library, Science Lab, Computer Lab, Cafeteria, Playground, Sports Arena, Competition Hall*) dengan NPC & Quest.
   - Kontrol ganda: `WASD` + `Shift` di PC serta *Virtual Joystick* di Android/Mobile.
2. **Sistem Pendidikan 5 Jenjang + Teacher Academy:**
   - **SD (Kelas 1–6)**, **SMP (Kelas 7–9)**, **SMA (Kelas 10–12)**, **SMK (6 Jurusan)**, dan **Universitas (6 Prodi)**.
   - Semua jenjang terbuka (*unlocked*) tanpa dibatasi level RPG.
3. **Mode Permainan Offline & Online:**
   - **Offline:** *Adventure Mode, Academy Mode, Boss Challenge, Solo Practice,* dan **Local 2-Player** (2 pemain dalam 1 perangkat layar terbagi).
   - **Online / Kompetitif:** *Ranked Battle 1v1* (Bronze III s/d Mythic), *Friendly Battle* (Room Code), *Tournament*, dan *Leaderboard*.
4. **Sistem Mini-Game & Pertandingan 5 Ronde:**
   - 5 Ronde per pertandingan, durasi 10–20 detik per soal.
   - Skor: Jawaban Benar (`+100`), Bonus Tercepat (`+50`), *Perfect Round* (`+100`), Jawaban Salah (`0`).
   - Variasi Mini-Game: *Quick Answer, Math Race, Memory Challenge, True or False, Word Battle,* dll.
5. **Classroom System & Teacher Dashboard:**
   - **Guru (Teacher):** Buat kelas virtual, hasilkan kode kelas unik, buat tugas (*Assignment*), *Live Quiz*, *Exam Mode*, serta pantau nilai dan rata-rata kelas di *Teacher Dashboard*.
   - **Murid (Student):** Gabung kelas menggunakan kode kelas, kerjakan tugas/ujian, dan lihat ranking kelas.
6. **Ekonomi Fair-Play (Non-Pay-to-Win), Shop, Inventory & 10+ Badge:**
   - *Gold Coin* & *Diamond* murni untuk kosmetik (*Skin, Frame, Emote, Badge, Title, Pet, Background*).
7. **Arsitektur Script C# Unity (`unity-scripts/`):**
   - Menyediakan skrip referensi C# untuk pengembangan native di Unity Engine (Android & PC).

---

## Struktur Proyek

- `index.html` — Aplikasi Web Playable 3D Brain Smart RPG
- `css/style.css` — Desain UI/UX RPG Stylized responsif (PC & Android Landscape)
- `js/data.js` — Bank Soal Kurikulum Lengkap (SD/SMP/SMA/SMK/Universitas), Item Shop, Badge, & Lokasi 3D
- `js/world3d.js` — Mesin 3D Three.js untuk Lobby Karakter & Eksplorasi Dunia Sekolah 3D
- `js/minigames.js` — Mesin Pertandingan 5 Ronde, Local 2-Player, Boss Challenge, & Mini-Games
- `js/classroom.js` — Modul Classroom (Guru & Murid) dan Teacher Dashboard Analytics
- `js/app.js` — Pengelola State RPG, Penyimpanan Lokal JSON, Audio Web Synthesizer, & Navigasi 16 Layar
- `docs/PRD.md` — Dokumen Product Requirements Document (PRD) v3.0
- `unity-scripts/` — Paket Script C# untuk Unity Engine
