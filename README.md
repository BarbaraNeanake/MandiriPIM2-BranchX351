# PIM 2 Community Ecosystem Mapping

Dashboard internal tim out-branch **Bank Mandiri KCP Pondok Indah Mall 2** untuk
memetakan komunitas olahraga & kebugaran di sekitar cabang dan mengubahnya menjadi
pipeline akuisisi nasabah baru (NTB).

Titik acuan cabang: **-6.2656748, 106.7829315**. Semua jarak dihitung dengan rumus
haversine dan ditampilkan dalam meter (< 1 km) atau kilometer.

---

## Menjalankan

```bash
npm install
npm run dev
```

Buka http://localhost:5173. **Tidak ada konfigurasi yang wajib diisi** - secara
default aplikasi memakai peta OpenStreetMap (Leaflet, tanpa API key) dan menyimpan
data di `localStorage` browser. Data seed 95 komunitas terisi otomatis saat pertama
kali dibuka.

Perintah lain:

| Perintah            | Fungsi                                  |
| ------------------- | --------------------------------------- |
| `npm run dev`       | Server pengembangan                     |
| `npm run build`     | Type-check + build produksi ke `dist/`  |
| `npm run preview`   | Pratinjau hasil build                   |
| `npm run typecheck` | Hanya pemeriksaan TypeScript            |

---

## Halaman

| Halaman            | Isi                                                                                                  |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| **Dashboard**      | Panduan "Cara menggunakan", KPI, funnel 4 tahap, sebaran kategori & radius, "Butuh tindak lanjut" |
| **Peta Komunitas** | Marker berwarna per status, lingkaran radius 1/3/5 km dari cabang, filter kategori + status + radius  |
| **Database**       | Tabel induk: cari, sortir, filter, inline edit, tambah/hapus, export Excel                            |
| **Pipeline**       | Papan kanban 4 kolom, kartu bisa diseret antar tahap (+ area "Ditolak" di bawah)                      |
| **Log Aktivitas**  | Timeline kunjungan/telepon/event/onboarding + formulir pencatatan                                     |

## Pita radius

Jarak dan pita radius dihitung otomatis dari koordinat. Database dan daftar lain
diurutkan dari komunitas terdekat. Aplikasi tidak memakai skor prioritas; potensi
pemilik usaha berstatus "Belum dinilai" sampai diisi tim.

> **Catatan pita radius.** Spesifikasi awal menyebut tiga pita (`<1km`, `1-3km`,
> `3-5km`). Seluruh seed saat ini berada di dalam 5 km, tetapi komunitas yang
> ditambahkan tim bisa saja lebih jauh. Pita keempat `>5km` disediakan agar data
> tidak dipaksakan masuk pita yang salah.

---

## Mengaktifkan Google Maps

Peta dibungkus komponen `<MapView>` (`src/components/MapView/`) dengan adapter, jadi
penyedia peta bisa ditukar tanpa menyentuh kode halaman.

1. Buat API key di [Google Cloud Console](https://console.cloud.google.com/), aktifkan
   **Maps JavaScript API**, dan (opsional) buat sebuah **Map ID** bertipe *JavaScript*
   agar Advanced Marker aktif.
2. Salin `.env.example` menjadi `.env`, lalu isi:

   ```dotenv
   VITE_MAP_PROVIDER=google
   VITE_GOOGLE_MAPS_API_KEY=isi-kunci-anda
   VITE_GOOGLE_MAPS_MAP_ID=isi-map-id-anda   # opsional, default DEMO_MAP_ID
   ```

3. Jalankan ulang `npm run dev` (Vite hanya membaca `.env` saat start).

Kembalikan `VITE_MAP_PROVIDER=leaflet` untuk memakai OpenStreetMap lagi. Bila
provider `google` dipilih tapi kuncinya kosong, peta menampilkan pesan pengingat
alih-alih layar kosong.

## Mengaktifkan Supabase

Penyimpanan berada di balik antarmuka `Repo` (`src/lib/repo.ts`) dengan dua
implementasi: `localStorage` (default) dan Supabase.

1. Buat proyek di [supabase.com](https://supabase.com).
2. Buka **SQL Editor**, jalankan seluruh isi [`supabase/schema.sql`](supabase/schema.sql)
   (tabel, indeks, trigger `updated_at`, dan RLS khusus pengguna yang sudah masuk).
   Setelah itu jalankan [`supabase/seed.sql`](supabase/seed.sql) **sekali** untuk
   mengisi 95 komunitas awal. Seed menolak jalan bila tabel sudah berisi.
3. Buat akun tim bersama di **Authentication > Users > Add user > Create new user**:
   email `tim@pim2.local` (atau email lain, samakan dengan `.env`), password tim, dan
   centang **Auto Confirm User**.
4. Matikan pendaftaran bebas di **Authentication > Sign In / Providers**: nonaktifkan
   **Allow new users to sign up**. Tanpa ini, orang luar bisa membuat akun sendiri
   dan ikut membaca data.
5. Isi `.env`:

   ```dotenv
   VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   VITE_SUPABASE_LOGIN_EMAIL=tim@pim2.local
   ```

6. Jalankan ulang `npm run dev`. Bila URL dan anon key terisi, aplikasi memakai
   Supabase dan menampilkan halaman password; bila salah satu kosong, kembali ke
   `localStorage` tanpa halaman password. Backend aktif tampil sebagai lencana di
   atas konten.

> **Keamanan.** Halaman masuk hanya meminta password; email akun tim dipasangkan
> otomatis dan tidak pernah diketik pengguna. Sesi disimpan di `sessionStorage`:
> tetap masuk saat refresh, tetapi password diminta lagi setiap tab/browser dibuka ulang. Password diverifikasi oleh Supabase Auth dan **tidak tersimpan di kode**.
> RLS hanya membuka tabel untuk peran `authenticated`, jadi anon key yang ikut
> ter-bundle di browser tidak cukup untuk membaca atau mengubah data. Ganti password
> tim di menu Users bila ada anggota yang keluar. Jangan pernah memakai
> *service role key* di sisi klien.

## Deploy

- **Wajib memakai Supabase.** Mode `localStorage` tidak punya halaman password dan
  data tiap orang hanya tersimpan di browsernya sendiri.
- Isi variabel `VITE_*` di pengaturan environment hosting (Vercel/Netlify), bukan
  dengan mengunggah `.env`.
- Aplikasi memakai routing sisi klien: atur rewrite semua path ke `/index.html`.
- Halaman diberi `noindex` dan `public/robots.txt` menolak crawler.
- Bila memakai Google Maps, batasi API key ke domain produksi di Google Cloud
  Console (**Application restrictions > Websites**) dan hanya ke **Maps JavaScript API**.

---

## Struktur

```
src/
  components/
    MapView/          adapter peta (index.tsx memilih Leaflet atau Google)
    CommunityDetail   panel detail komunitas
    CommunityForm     modal tambah/ubah dengan pratinjau jarak
    UsageGuide        panduan "Cara menggunakan" di Dashboard
    Layout, ui, charts
  lib/
    constants.ts      titik cabang, label, palet status, pita radius
    geo.ts            haversine, pita radius, format jarak
    repo.ts           antarmuka Repo + implementasi localStorage & Supabase
    seed.ts           95 komunitas dari direktori publik Google Places
    supabase.ts       klien Supabase bersama (repo + login)
    env.ts            pembacaan variabel .env
    excel.ts          export .xlsx (sheet Komunitas + Aktivitas)
    format.ts
  pages/              Dashboard, CommunityMap, Database, Pipeline, ActivityLog
  state/DataContext   pemuatan & mutasi data
  state/AuthGate      gerbang password (Supabase Auth)
supabase/schema.sql   tabel + RLS
supabase/seed.sql     data awal 95 komunitas (dibuat dari seed.ts)
```

---

## Data dan kepatuhan

- **Tidak ada data nasabah.** Aplikasi hanya memuat informasi komunitas yang bersifat
  publik (nama venue, kategori, koordinat).
- Seed berisi 95 komunitas olahraga dalam radius 5 km (padel dikecualikan). Koordinat,
  alamat, dan telepon publik diambil dari direktori publik Google Places pada
  24 September 2026. Semua berstatus **Belum Dihubungi**.
- Jenis pengelola, telepon publik, dan jumlah ulasan disimpan di **catatan**, bukan di
  kolom PIC. Jenis pengelola masih dugaan dari informasi publik. Jumlah ulasan hanya
  perkiraan kasar keramaian, **bukan jumlah member**.
- **Nama PIC, nomor PIC, jadwal, potensi, dan estimasi anggota sengaja dikosongkan** -
  diisi tim saat survei lapangan. Belum ada log aktivitas.
- Kunci API dan kredensial hanya dibaca dari `.env`; tidak ada nilai yang di-hardcode.
  `.env` sudah masuk `.gitignore`.
