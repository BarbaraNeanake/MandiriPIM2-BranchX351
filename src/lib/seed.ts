import type { ActivityDraft, Category, CommunityDraft } from '../types'

/**
 * Data pool komunitas olahraga di sekitar KCP Pondok Indah Mall 2 (kode 10115),
 * radius maksimal 5 km, padel dikecualikan. Koordinat, alamat, dan telepon berasal
 * dari direktori publik Google Places, diambil 24 September 2026. Jarak & pita
 * radius dihitung ulang oleh repo.
 *
 * - phone: telepon publik usaha, BUKAN nomor PIC. Disimpan di catatan agar tidak
 *   tertukar dengan kontak PIC hasil survei.
 * - reviews: jumlah ulasan publik, proksi kasar keramaian - BUKAN jumlah member.
 * - owner: jenis pengelola menurut informasi publik, belum dikonfirmasi.
 * Semua komunitas berstatus Belum Dihubungi; PIC, jadwal, potensi, dan estimasi
 * member diisi tim saat survei. Tidak memuat data nasabah.
 */
interface SeedPoint {
  name: string
  category: Category
  address: string
  lat: number
  lng: number
  phone: string | null
  reviews: number
  owner: string
  note: string
}

const POINTS: SeedPoint[] = [
  { name: 'JAYA Pilates Studio - Pondok Indah', category: 'pilates', address: 'Plaza 5, Jl. Margaguna Raya No.11, Gandaria Utara', lat: -6.262815, lng: 106.7862702, phone: '+62 851-2158-1101', reviews: 100, owner: 'usaha perorangan', note: 'Reformer & hot mat pilates, buka 07.00-21.00, segmen affluent' },
  { name: 'The Funtastic Gym of Pondok Indah', category: 'gym', address: 'Unit 1 Rooftop PIM 2, Jl. Metro Pondok Indah', lat: -6.26439, lng: 106.783088, phone: '+62 811-9775-375', reviews: 44, owner: 'usaha perorangan', note: 'Kids gym di rooftop PIM 2; member = orang tua anak usia dini (pintu ke parenting community)' },
  { name: 'Bumi Pilates & Movement Pondok Indah', category: 'pilates', address: 'Plaza 5, Jl. Margaguna Raya No.5-6, Gandaria Utara', lat: -6.262744, lng: 106.785736, phone: '+62 878-8045-3333', reviews: 49, owner: 'usaha perorangan', note: 'Studio pilates (reformer, cadillac), satu gedung dengan JAYA Pilates' },
  { name: 'SPORT ONE PADEL & BADMINTON', category: 'badminton', address: 'Jl. Ciputat Raya No.1, Kby. Lama Utara', lat: -6.2513972, lng: 106.7780214, phone: '+62 895-1351-7433', reviews: 641, owner: 'usaha perorangan', note: 'Lapangan badminton & padel, buka 06.00-23.00, parkir luas' },
  { name: 'Yoga Fit Indonesia', category: 'pilates', address: 'Jl. Sultan Iskandar Muda No.18C, Kby. Lama Selatan', lat: -6.247904, lng: 106.7808991, phone: '+62 21 27094881', reviews: 1070, owner: 'usaha perorangan', note: 'Studio yoga besar dengan instruktur asing - basis member sangat luas' },
  { name: 'The Gym Pondok Indah', category: 'gym', address: 'Jl. Metro Pondok Indah No.16, Pd. Pinang', lat: -6.2684386, lng: 106.783749, phone: '+62 21 29235230', reviews: 19, owner: 'usaha perorangan', note: 'Gym privat milik perorangan (owner = calon nasabah bisnis), buka 06.00-20.00' },
  { name: 'The Fit Community Pondok Pinang', category: 'gym', address: 'Jl. Ciputat Raya No.17B, Kby. Lama Selatan', lat: -6.2595561, lng: 106.7779502, phone: '+62 838-3494-8327', reviews: 2, owner: 'usaha perorangan', note: 'Komunitas latihan bersama coach; jadwal Selasa, Kamis, Sabtu, Minggu' },
  { name: 'FTL Gym Pondok Indah', category: 'gym', address: 'Jl. Ciputat Raya No.63, Pd. Pinang', lat: -6.2701568, lng: 106.7749136, phone: '+62 818-687-858', reviews: 229, owner: 'usaha perorangan', note: 'Gym 3 lantai buka 24 jam, ratusan loker RFID, sauna - basis member besar' },
  { name: 'GOR Radio Dalam (Pasar Inpres)', category: 'badminton', address: 'Jl. Ps. Inpres No.56, Gandaria Utara', lat: -6.2592454, lng: 106.7913459, phone: null, reviews: 229, owner: 'usaha perorangan', note: '3 lapangan badminton indoor, parkir luas' },
  { name: 'Corner Futsal 2', category: 'futsal', address: 'Jl. H. Saiman No.53, Pd. Pinang, Kebayoran Lama', lat: -6.2614787, lng: 106.7728798, phone: '+62 857-1473-5571', reviews: 116, owner: 'usaha perorangan', note: 'Futsal indoor milik perorangan, buka 06.00-24.00' },
  { name: 'Warriors Sports Complex', category: 'lainnya', address: 'Jl. RC. Veteran Raya, Bintaro, Pesanggrahan', lat: -6.2553231, lng: 106.7691718, phone: '+62 812-3300-8660', reviews: 125, owner: 'usaha perorangan', note: '2 lapangan basket indoor + klub basket anak & remaja (akses ke orang tua)' },
  { name: 'Be More Indonesia - Pondok Indah', category: 'gym', address: 'Ruko THB Lt.2, Jl. Gedung Hijau I, Pd. Pinang', lat: -6.2771339, lng: 106.7760532, phone: '+62 851-1477-7095', reviews: 33, owner: 'usaha perorangan', note: 'Studio latihan berbasis membership & personal training' },
  { name: 'Jet Fitness Fatmawati', category: 'gym', address: 'Gandaria Selatan, Cilandak', lat: -6.2650112, lng: 106.7970518, phone: '+62 811-1183-8302', reviews: 85, owner: 'usaha perorangan', note: 'Gym premium baru dekat MRT, ada sauna, buka 06.00-22.00' },
  { name: 'RIBENS Sports Center', category: 'lainnya', address: 'Jl. RS. Fatmawati Raya No.188, Gandaria Selatan', lat: -6.2716404, lng: 106.7970195, phone: '+62 812-8708-8208', reviews: 83, owner: 'usaha perorangan', note: 'Multi-sport: badminton, basket, padel; buka 06.00-23.00' },
  { name: 'RamBoe Gym', category: 'gym', address: 'Ruko Duta Mas Fatmawati Blok B1 No.35, Cipete Utara', lat: -6.2634936, lng: 106.798423, phone: '+62 21 7237838', reviews: 99, owner: 'usaha perorangan', note: 'Gym komunitas dengan suasana kekeluargaan, buka 07.00-22.00' },
  { name: 'Hello Pilates', category: 'pilates', address: 'Jl. RC. Veteran Raya No.42A, Bintaro, Pesanggrahan', lat: -6.2644163, lng: 106.7664265, phone: '+62 811-4431-1000', reviews: 32, owner: 'usaha perorangan', note: 'Studio pilates kelas kecil (maks 5 orang), buka 06.30-20.00' },
  { name: 'Soccer Chief', category: 'futsal', address: 'Jl. Bintaro Raya, Bintaro, Pesanggrahan', lat: -6.2550935, lng: 106.7699552, phone: '+62 811-1524-166', reviews: 64, owner: 'usaha perorangan', note: 'Mini soccer, futsal & basket; buka 06.00-24.00' },
  { name: 'MAIIN', category: 'lainnya', address: 'Jl. Ciputat Raya, Kby. Lama Utara', lat: -6.2458481, lng: 106.7799638, phone: '+62 811-1922-4305', reviews: 322, owner: 'usaha perorangan', note: 'Venue baru: mini soccer & basket indoor, ada kios F&B; buka 08.00-22.00' },
  { name: 'GOR Badminton Cipete', category: 'badminton', address: 'Jl. Bunga Anggrek No.9, Cipete Selatan, Cilandak', lat: -6.2672912, lng: 106.8039764, phone: '+62 878-7788-7736', reviews: 407, owner: 'usaha perorangan', note: '6 lapangan (1 khusus member), buka 07.00-22.00 - hall badminton paling ramai di radius 3 km' },
  { name: 'Beaulates Pilates Bintaro', category: 'pilates', address: 'Rukan Bintaro Jaya Sektor I Blok E, Jl. Bintaro Utama No.14', lat: -6.2706708, lng: 106.7570479, phone: '+62 853-8505-7631', reviews: 348, owner: 'usaha perorangan', note: 'Studio pilates besar, buka 07.00-20.00 - basis member paling ramai di Bintaro' },
  { name: 'PB PUJA', category: 'badminton', address: 'RT.3/RW.3 Pondok Pinang, Kebayoran Lama', lat: -6.2615509, lng: 106.7810617, phone: null, reviews: 4, owner: 'komunitas warga', note: 'Klub bulutangkis warga; latihan Rabu & Jumat malam, Sabtu-Minggu pagi' },
  { name: 'Lapangan Bulutangkis PB. NOLSATU', category: 'badminton', address: 'Jl. H. Eman I No.70, Pd. Pinang, Kebayoran Lama', lat: -6.2711085, lng: 106.776467, phone: null, reviews: 21, owner: 'komunitas warga', note: 'Klub bulutangkis warga Pondok Pinang, lapangan outdoor akses 24 jam' },
  { name: 'GOR BULU TANGKIS TK IKASTRI', category: 'badminton', address: 'Jl. Bouraq No.34, Kby. Lama Selatan', lat: -6.2586598, lng: 106.7750067, phone: '+62 812-1036-1238', reviews: 7, owner: 'usaha perorangan', note: 'Sewa per jam terjangkau, sering dipakai komunitas warga' },
  { name: 'Raketku', category: 'badminton', address: 'Jl. Rajawali No.19, Kby. Lama Selatan', lat: -6.2588426, lng: 106.7747333, phone: '+62 813-1454-3456', reviews: 3, owner: 'usaha perorangan', note: 'Klub badminton + jasa stringing raket - titik kumpul pemain' },
  { name: 'SGym Studio', category: 'gym', address: 'Jl. Kartika Pinang No.6, Pd. Pinang', lat: -6.2737557, lng: 106.7757422, phone: '+62 823-1532-7916', reviews: 1, owner: 'usaha perorangan', note: 'Studio gym kecil di kompleks Kartika Pinang, buka 07.00-18.00' },
  { name: 'The Slow Pondok Indah', category: 'pilates', address: 'Jl. Gedung Hijau Raya No.1A, Pd. Pinang', lat: -6.276809, lng: 106.776604, phone: '+62 812-8712-7067', reviews: 28, owner: 'usaha perorangan', note: 'Studio hot mat pilates, buka 07.00-20.00' },
  { name: 'Ela Fit Studio', category: 'pilates', address: 'Jl. Ciputat Raya, Pd. Pinang', lat: -6.2793891, lng: 106.7726181, phone: '+62 857-1741-4658', reviews: 7, owner: 'usaha perorangan', note: 'Studio yoga/fit kecil area Ciputat Raya' },
  { name: 'Avana Private Pilates Studio Kebayoran', category: 'pilates', address: 'Jl. Delman Utama No.27, Kby. Lama Utara', lat: -6.2501869, lng: 106.7721385, phone: '+62 823-4200-0199', reviews: 108, owner: 'usaha perorangan', note: 'Pilates privat: prenatal, postnatal, lansia - segmen keluarga' },
  { name: 'Black Eagle Futsal', category: 'futsal', address: 'Jl. Damai Raya, Cipete Utara', lat: -6.2600925, lng: 106.8043996, phone: '+62 815-5401-8463', reviews: 104, owner: 'usaha perorangan', note: 'Futsal, buka 06.00-01.00' },
  { name: 'Essence Pilates Studio', category: 'pilates', address: 'The Buya Building, Jl. Cipete IX No.1, Cipete Selatan', lat: -6.277681, lng: 106.8025243, phone: '+62 822-5868-0461', reviews: 130, owner: 'usaha perorangan', note: 'Studio pilates semi-private (reformer, chair), buka 09.00-20.00' },
  { name: 'Maxima Fitness', category: 'gym', address: 'Jl. RS. Fatmawati Raya No.14, Cilandak Barat', lat: -6.2876974, lng: 106.795545, phone: '+62 21 7696670', reviews: 148, owner: 'usaha perorangan', note: 'Gym komunitas dengan kelas Zumba, buka 08.00-21.00' },
  { name: 'Arrayan Sport Center', category: 'badminton', address: 'Jl. Wadassari 4, Pd. Karya, Pd. Aren', lat: -6.265299, lng: 106.7458782, phone: null, reviews: 396, owner: 'usaha perorangan', note: 'Lapangan badminton & futsal harga terjangkau, buka 07.00-22.00' },
  { name: 'Futton Sport Club', category: 'futsal', address: 'Jl. Kemajuan No.1, Petukangan Selatan, Pesanggrahan', lat: -6.2425173, lng: 106.7530552, phone: '+62 822-1321-1483', reviews: 316, owner: 'usaha perorangan', note: '4 lapangan badminton lantai kayu + futsal + kantin; buka 08.00-21.00' },
  { name: 'Lapangan Badminton Jaya Billal Club (JBC) Hall', category: 'badminton', address: 'Jl. Bahari I No.7, Gandaria Selatan, Cilandak', lat: -6.2791256, lng: 106.7926696, phone: null, reviews: 70, owner: 'komunitas warga', note: 'Hall badminton, jam operasional pagi-siang' },
  { name: 'Maha Jakarta', category: 'gym', address: 'Jl. RC. Veteran Raya No.1, Bintaro, Pesanggrahan', lat: -6.2698956, lng: 106.7649112, phone: '+62 858-9409-5116', reviews: 73, owner: 'usaha perorangan', note: 'Strength & conditioning gym dengan komunitas kelas rutin' },
  { name: 'Senyaman Studio', category: 'pilates', address: 'Jl. Cipete Raya No.16, Cipete Selatan', lat: -6.2777364, lng: 106.7991066, phone: '+62 852-8322-5693', reviews: 58, owner: 'usaha perorangan', note: 'Studio yoga termasuk kelas prenatal - segmen ibu muda' },
  { name: 'Glimpse Studio', category: 'pilates', address: 'Cipete Selatan, Cilandak', lat: -6.2723125, lng: 106.8028125, phone: '+62 852-1092-4300', reviews: 63, owner: 'usaha perorangan', note: 'Studio pilates/yoga lengkap (reformer, chair, tower) + kafe di lantai 1' },
  { name: 'GROUND FUTSAL KEMANG', category: 'futsal', address: 'Gg. Masjid Dalam I A, Cilandak Timur', lat: -6.2767954, lng: 106.8147981, phone: '+62 877-1666-2226', reviews: 244, owner: 'usaha perorangan', note: 'Futsal, buka 07.00-24.00' },
  { name: 'Lapangan bulutangkis Cendrawasih', category: 'badminton', address: 'Jl. Cendrawasih No.59H, Kby. Lama Selatan', lat: -6.256018, lng: 106.778358, phone: null, reviews: 3, owner: 'komunitas warga', note: 'Lapangan warga, buka 07.00-21.00' },
  { name: 'FUTSAL GRATIS KAVLING', category: 'futsal', address: 'Jl. Jati Indah No.6, Pd. Pinang, Kebayoran Lama', lat: -6.2596902, lng: 106.7728772, phone: null, reviews: 1, owner: 'komunitas warga', note: 'Lapangan futsal warga (gratis) - komunitas kampung Pondok Pinang' },
  { name: 'Lapangan Badminton Pinggir Kali', category: 'badminton', address: 'Jl. Villa Anggrek Raya, Bintaro, Pesanggrahan', lat: -6.2629118, lng: 106.7705082, phone: null, reviews: 1, owner: 'komunitas warga', note: 'Lapangan warga outdoor, akses 24 jam' },
  { name: 'Lapangan batminton hijau 16', category: 'badminton', address: 'Jl. Kp. Baru No.22, Pd. Pinang, Kebayoran Lama', lat: -6.2742556, lng: 106.7695892, phone: null, reviews: 4, owner: 'komunitas warga', note: 'Lapangan warga serbaguna (olahraga + kegiatan sosial), akses 24 jam' },
  { name: 'Futsal Five', category: 'futsal', address: 'Jl. Damai Raya No.45, Cipete Utara', lat: -6.2600635, lng: 106.800332, phone: null, reviews: 9, owner: 'usaha perorangan', note: 'Lapangan futsal kecil harga terjangkau, area Cipete' },
  { name: 'Blaze Studio & Cafe', category: 'pilates', address: 'Jl. Gandaria 1 No.71, Kramat Pela', lat: -6.2485637, lng: 106.7906037, phone: '+62 822-7778-8850', reviews: 17, owner: 'usaha perorangan', note: 'Studio hot mat pilates + kafe' },
  { name: 'Adaya House', category: 'pilates', address: 'Jl. Asem II No.20A, Cipete Selatan, Cilandak', lat: -6.2722668, lng: 106.802355, phone: '+62 819-0897-5702', reviews: 22, owner: 'usaha perorangan', note: 'Studio latihan + kafe + toko, buka 08.00-20.00' },
  { name: 'Toned Studio', category: 'pilates', address: 'Gedung Itjeher Essence, Jl. Cipete Raya No.64, Cipete Selatan', lat: -6.2779451, lng: 106.8000339, phone: '+62 852-1923-0088', reviews: 20, owner: 'usaha perorangan', note: 'Studio khusus perempuan (TRX, bootcamp, yoga), buka 07.00-20.00' },
  { name: 'Tone Pilates Studio', category: 'pilates', address: 'Jl. Gandaria Tengah II, Kramat Pela', lat: -6.2447145, lng: 106.7893614, phone: '+62 817-303-377', reviews: 5, owner: 'usaha perorangan', note: 'Studio pilates baru area Gandaria' },
  { name: "Body N'gine Fitness", category: 'gym', address: 'Jl. Rw. Papan No.47, Bintaro, Pesanggrahan', lat: -6.2637616, lng: 106.7591724, phone: '+62 816-1789-8830', reviews: 27, owner: 'usaha perorangan', note: 'Gym lingkungan, buka 07.00-22.00' },
  { name: 'SAMASE Sports Club', category: 'gym', address: 'Jl. Pd. Betung Raya No.134, Pd. Betung', lat: -6.2620721, lng: 106.7551341, phone: '+62 851-1135-7194', reviews: 89, owner: 'usaha perorangan', note: 'Sports club dengan gym + layanan fisioterapi' },
  { name: 'Yogaland Studio', category: 'pilates', address: 'Jl. Benda Bawah No.77, Cilandak Timur', lat: -6.279032, lng: 106.8128304, phone: '+62 821-1511-5870', reviews: 31, owner: 'usaha perorangan', note: 'Studio yoga khusus anak, termasuk kelas untuk anak neurodivergen' },
  { name: 'B23 Arena Simprug', category: 'futsal', address: 'Jl. Simprug Garden II, Grogol Selatan', lat: -6.2326491, lng: 106.7865596, phone: '+62 821-1373-1684', reviews: 86, owner: 'usaha perorangan', note: 'Lapangan futsal & badminton dekat perkantoran Senayan, buka 06.00-22.00' },
  { name: 'MU Resto & Futsal', category: 'futsal', address: 'Jl. Bintaro Utama 3A Blok DD1 No.71, Pd. Karya', lat: -6.2698932, lng: 106.7382334, phone: null, reviews: 95, owner: 'usaha perorangan', note: 'Futsal + resto, buka 09.00-22.00' },
  { name: 'Lapangan Futsal Sangrila Indah II', category: 'futsal', address: 'Jl. Sakti VI No.6, Petukangan Selatan, Pesanggrahan', lat: -6.2429159, lng: 106.7597643, phone: '+62 812-9673-082', reviews: 188, owner: 'komunitas warga', note: 'Futsal harga terjangkau, buka 06.00-24.00' },
  { name: 'SPACI Studio I - Cilandak', category: 'pilates', address: 'Jl. Banjarsari IV No.09, Cilandak Barat', lat: -6.2903058, lng: 106.7942158, phone: '+62 812-1116-8328', reviews: 0, owner: 'usaha perorangan', note: 'Studio yoga/pilates area Banjarsari' },
  { name: 'Sukha Studio', category: 'pilates', address: 'Jl. Arco Raya No.61A, Cipete Selatan', lat: -6.2749069, lng: 106.8112191, phone: '+62 815-900-787', reviews: 17, owner: 'usaha perorangan', note: 'Studio yoga kecil dengan kafe, kapasitas ±10 orang' },
  { name: 'Futsal Zona (Pitch 98 Kemang)', category: 'futsal', address: 'Jl. Kemang Sel. No.98A, Cilandak Timur', lat: -6.2735347, lng: 106.8167213, phone: null, reviews: 2, owner: 'usaha perorangan', note: 'Lapangan futsal/mini soccer area Kemang Selatan, buka 08.00-01.00' },
  { name: 'Meet & Move Bintaro', category: 'gym', address: 'Ruko Graha Marcella No.10, Jl. Bintaro Utama Sektor 3A', lat: -6.2733765, lng: 106.744021, phone: '+62 858-8148-6646', reviews: 16, owner: 'usaha perorangan', note: 'Gym berbasis kelas, ada jadwal khusus perempuan' },
  { name: 'FITX GYM Fatmawati', category: 'gym', address: 'Jl. RS. Fatmawati Raya No.36, Cipete Selatan', lat: -6.2702494, lng: 106.7976114, phone: '+62 811-8802-1085', reviews: 839, owner: 'jaringan lokal', note: 'Gym 24 jam dekat MRT Haji Nawi - salah satu basis member terbesar di area' },
  { name: 'PB Seruni', category: 'badminton', address: 'RT.4/RW.10 Bintaro, Pesanggrahan', lat: -6.2557315, lng: 106.7670022, phone: null, reviews: 6, owner: 'komunitas warga', note: 'Klub bulutangkis warga' },
  { name: 'Lapangan Futsal RT.12 Kebayoran Lama', category: 'futsal', address: 'RT.1/RW.11 Kby. Lama Utara', lat: -6.2477761, lng: 106.7746281, phone: null, reviews: 3, owner: 'komunitas warga', note: 'Lapangan futsal warga, akses 24 jam' },
  { name: 'Lapangan Badminton Depsos', category: 'badminton', address: 'Bintaro, Pesanggrahan (dekat Masjid Baiturrahman)', lat: -6.2639259, lng: 106.7612416, phone: null, reviews: 1, owner: 'komunitas warga', note: 'Lapangan warga, juga dipakai kegiatan lingkungan' },
  { name: 'Lapangan Nurul Iman', category: 'futsal', address: 'Jl. Peninggaran Timur III No.8, Kby. Lama Utara', lat: -6.2443192, lng: 106.7775476, phone: null, reviews: 7, owner: 'komunitas warga', note: 'Lapangan warga (futsal/badminton), markas PB Kalong' },
  { name: 'Lapangan Tenis dan Rumah Ulujami', category: 'lainnya', address: 'Jl. Ulujami Raya No.18, Pesanggrahan', lat: -6.2549938, lng: 106.7634637, phone: '+62 813-1093-1073', reviews: 28, owner: 'komunitas warga', note: 'Lapangan tenis indoor & outdoor, buka 07.00-21.00' },
  { name: 'LAPANGAN BULU TANGKIS RT 03', category: 'badminton', address: 'Jl. Kesehatan Bawah No.45, Bintaro, Pesanggrahan', lat: -6.2697271, lng: 106.7603463, phone: null, reviews: 8, owner: 'komunitas warga', note: 'Lapangan bulutangkis warga RT, akses 24 jam' },
  { name: 'PB SAILIN 1', category: 'badminton', address: 'Jl. Sailin I, Bintaro, Pesanggrahan', lat: -6.2785071, lng: 106.7635008, phone: null, reviews: 1, owner: 'komunitas warga', note: 'Klub bulutangkis warga, akses 24 jam' },
  { name: 'LAPANGAN BULUTANGKIS Mawar Raya', category: 'badminton', address: 'Jl. Mawar Raya No.31, Bintaro, Pesanggrahan', lat: -6.2857588, lng: 106.7672309, phone: null, reviews: 8, owner: 'komunitas warga', note: 'Lapangan bulutangkis warga pinggir kali' },
  { name: 'PB 56 Bintaro', category: 'badminton', address: 'Jl. Rw. Papan Gg. H. Nasim, Bintaro, Pesanggrahan', lat: -6.269519, lng: 106.7574522, phone: '+62 856-8476-755', reviews: 0, owner: 'komunitas warga', note: 'Klub bulutangkis warga, jadwal latihan Jumat malam' },
  { name: 'Lapangan Futsal Rw 011 Bintaro', category: 'futsal', address: 'Jl. Perumahan Taman Bintaro, Bintaro, Pesanggrahan', lat: -6.2735527, lng: 106.7578388, phone: null, reviews: 4, owner: 'komunitas warga', note: 'Lapangan futsal warga RW, jadwal Jumat-Minggu sore' },
  { name: 'Celebrity Fitness Pondok Indah Mall 2', category: 'gym', address: 'Jl. Metro Pondok Indah, PIM 2, Pd. Pinang', lat: -6.2655802, lng: 106.783076, phone: '+62 21 30514233', reviews: 467, owner: 'jaringan nasional', note: 'Gym rantai nasional DI DALAM PIM 2, buka 06.00-22.00 - basis member terbesar di gedung sendiri' },
  { name: 'Lapangan Bulutangkis 010/04', category: 'badminton', address: 'Gg. Darma Bakti No.17, Petukangan Utara, Pesanggrahan', lat: -6.2336343, lng: 106.7536022, phone: null, reviews: 38, owner: 'komunitas warga', note: 'Lapangan warga + tenis meja, sekretariat karang taruna' },
  { name: 'SixSoccer', category: 'futsal', address: 'Jl. Gedung Hijau Raya No.1 (Raffles Christian School), Pd. Pinang', lat: -6.2802648, lng: 106.7782248, phone: '+62 882-1216-8246', reviews: 117, owner: 'dalam sekolah', note: 'Mini soccer rumput sintetis di kompleks Raffles Christian School' },
  { name: 'Lapangan Bulutangkis H. Nawih', category: 'badminton', address: 'Jl. H. Nawi No.12, Bintaro, Pesanggrahan', lat: -6.2733121, lng: 106.7555549, phone: null, reviews: 8, owner: 'komunitas warga', note: 'Lapangan bulutangkis warga' },
  { name: 'Lapangan Futsal Kongsi', category: 'futsal', address: 'Sektor 6, Bintaro, Pesanggrahan', lat: -6.2881322, lng: 106.7654527, phone: '+62 878-7805-9354', reviews: 3, owner: 'komunitas warga', note: 'Lapangan warga: futsal, voli, olahraga umum; akses 24 jam' },
  { name: 'Lapangan PB. Mujahidin', category: 'badminton', address: 'Jl. Kramat, Ulujami, Pesanggrahan', lat: -6.2395859, lng: 106.7608231, phone: null, reviews: 10, owner: 'komunitas warga', note: 'Klub bulutangkis warga Ulujami, di pinggir jalan raya' },
  { name: 'Aalaya Pilates Gandaria (BASI Pilates Indonesia)', category: 'pilates', address: 'Jl. Radio Dalam Raya No.2, Gandaria Utara', lat: -6.2552928, lng: 106.7905635, phone: '+62 878-8880-330', reviews: 66, owner: 'HQ lisensi', note: 'HQ BASI Pilates Indonesia, juga sekolah instruktur; buka 06.00-21.00' },
  { name: 'FIT HUB Fatmawati', category: 'gym', address: 'Jl. RS. Fatmawati Raya No.9, Gandaria Selatan', lat: -6.2727918, lng: 106.7973471, phone: null, reviews: 593, owner: 'jaringan nasional', note: 'Gym rantai nasional 3 lantai di depan jalur MRT, buka 05.00-24.00' },
  { name: 'Yoona Pilates x Legra Bintaro', category: 'pilates', address: 'Jl. Bintaro Raya No.11I-11J, Bintaro, Pesanggrahan', lat: -6.2739086, lng: 106.7637506, phone: '+62 813-9888-1159', reviews: 101, owner: 'kolaborasi dua brand', note: 'Studio pilates & hot pilates, buka 08.00-20.00' },
  { name: 'Active Barn Sports & Wellness Center', category: 'pilates', address: 'Urban Forest, Jl. RS. Fatmawati Raya No.45, Cilandak Barat', lat: -6.2807909, lng: 106.79772, phone: '+62 813-1491-3279', reviews: 236, owner: 'dalam kompleks korporasi', note: 'Wellness center besar: gym, hot pilates, sauna, cold plunge; buka 06.30-21.00' },
  { name: 'BRI BRILiaN Stadium Jakarta', category: 'lainnya', address: 'Jl. RS Fatmawati Raya (sebelah ITC Duta Mas), Cipete Utara', lat: -6.2629052, lng: 106.7971899, phone: null, reviews: 171, owner: 'milik bank pesaing', note: 'Mini soccer + jogging track + basket, buka 06.00-23.00' },
  { name: 'Leo Hall Futsal & Badminton', category: 'futsal', address: 'Jl. Raya Kby. Lama No.182, Cipulir', lat: -6.2355857, lng: 106.7803448, phone: '+62 858-1490-4902', reviews: 1315, owner: 'venue besar', note: 'Kompleks futsal + 4 lapangan badminton, salah satu terbesar di Kebayoran Lama' },
  { name: 'NF Mini Soccer', category: 'futsal', address: 'Jl. M. Saidi Raya No.5, Petukangan Selatan, Pesanggrahan', lat: -6.2483274, lng: 106.7567045, phone: '+62 813-1893-0000', reviews: 1279, owner: 'venue besar', note: 'Mini soccer rumput sintetis, buka 07.00-23.00 - salah satu paling ramai' },
  { name: 'Triboon Mini Soccer', category: 'futsal', address: 'Jl. Benda Bawah No.77, Cilandak Timur', lat: -6.278747, lng: 106.812683, phone: '+62 813-8342-3136', reviews: 512, owner: 'venue besar', note: 'Mini soccer + gym + badminton + kafe, buka 06.00-24.00' },
  { name: 'My Futsal', category: 'futsal', address: 'Jl. Komp. Hankam Cidodol No.17B, Grogol Selatan', lat: -6.228042, lng: 106.7770989, phone: '+62 897-6693-853', reviews: 1265, owner: 'venue besar', note: '2 lapangan futsal + tribun lantai 2, buka 08.00-22.00' },
  { name: 'HOM Gym Cipete Fatmawati', category: 'gym', address: 'Rukan Fatmawati Mas Blok II, Jl. RS. Fatmawati Raya No.20', lat: -6.2808668, lng: 106.796104, phone: '+62 813-8083-5411', reviews: 31, owner: 'jaringan lokal', note: 'Gym keluarga: kids gym, hers gym, fisioterapi, sauna; buka 06.00-22.00' },
  { name: 'WE Studio Pilates - Gandaria', category: 'pilates', address: 'Jl. Gandaria 1 No.57A, Kramat Pela', lat: -6.246002, lng: 106.7891239, phone: '+62 851-1747-1737', reviews: 77, owner: 'jaringan lokal', note: 'Studio mat pilates, buka 08.00-20.00' },
  { name: 'GOR CILANDAK BARAT', category: 'lainnya', address: 'Jl. KH. Muhasyim VII No.8, Cilandak Barat', lat: -6.2904561, lng: 106.790614, phone: '+62 877-3964-7287', reviews: 842, owner: 'milik pemda', note: 'GOR 2 lantai: badminton, basket, voli, karate, taekwondo; buka 06.00-22.00' },
  { name: 'The Forum Sports Hub', category: 'lainnya', address: 'Jl. Taman Bintaro Barat, Bintaro, Pesanggrahan', lat: -6.2693515, lng: 106.7549361, phone: '+62 811-8784-231', reviews: 179, owner: 'dikelola pengembang', note: 'Multi-sport: futsal, mini soccer, basket, inline hockey, kelas anak; buka 06.00-23.30' },
  { name: 'SweatBar Cilandak - Yoga & Pilates Studio', category: 'pilates', address: 'Jl. Cilandak Dalam No.3A Lt.3, Cilandak Barat', lat: -6.2871633, lng: 106.8043755, phone: '+62 821-3023-7583', reviews: 212, owner: 'jaringan lokal', note: 'Studio yoga & pilates, buka 06.00-20.00' },
  { name: 'HOM Kids Academy Cipete', category: 'gym', address: 'Jl. RS. Fatmawati Raya No.B3, Cilandak Barat', lat: -6.2809133, lng: 106.7962087, phone: null, reviews: 7, owner: 'jaringan lokal', note: 'Kelas olahraga anak - akses ke komunitas orang tua murid' },
  { name: 'Hall Badminton Cipete Selatan by SR', category: 'badminton', address: 'Jl. Cipete Raya No.30 (lantai 3 Pasar Cipete), Cipete Selatan', lat: -6.2784864, lng: 106.8081765, phone: '+62 812-9255-5112', reviews: 58, owner: 'dalam pasar', note: '6 lapangan di lantai 3 pasar, ada kantin; buka 06.00-24.00' },
  { name: 'GOR Seskoal', category: 'lainnya', address: 'Komp. Seskoal, Cipulir, Kebayoran Lama', lat: -6.2396085, lng: 106.7712974, phone: null, reviews: 650, owner: 'institusi TNI', note: 'GOR dalam komplek TNI AL: basket, tenis indoor; komunitas pegawai & warga' },
  { name: 'Futsal Court - Cilandak Sport Centre', category: 'futsal', address: 'Jl. TB Simatupang Kav.17 (Citos), Cilandak Barat', lat: -6.2899616, lng: 106.8000014, phone: '+62 21 75816231', reviews: 1210, owner: 'dalam kompleks korporasi', note: '4 lapangan futsal dalam kompleks Citos, sering dipakai turnamen' },
  { name: 'Kebayoran Lama Youth Center', category: 'lainnya', address: 'Jl. Peninggaran Barat III No.73, Kby. Lama Utara', lat: -6.2453239, lng: 106.7692426, phone: '+62 813-2072-6225', reviews: 63, owner: 'milik pemda', note: 'Gelanggang remaja: badminton + aula serbaguna, milik Dispora' },
  { name: 'Lapangan Bulutangkis Pasar Jumat PU PR', category: 'badminton', address: 'Jl. Sapta Taruna I No.4, Pd. Pinang', lat: -6.2875948, lng: 106.7737952, phone: null, reviews: 0, owner: 'institusi kementerian', note: 'Lapangan komplek Kementerian PUPR, buka 08.00-22.00 - komunitas pegawai' },
  { name: 'GOR Kebayoran Lama', category: 'lainnya', address: 'Jl. Peninggaran Barat III, Kby. Lama Utara', lat: -6.2453247, lng: 106.7692439, phone: null, reviews: 8, owner: 'milik pemda', note: 'GOR pemda, gedung baru, dipakai komunitas warga' },
]

function notesOf(p: SeedPoint): string {
  const parts = [p.note, 'Pengelola: ' + p.owner]
  if (p.phone) parts.push('Telp. publik: ' + p.phone)
  parts.push('Ulasan publik: ' + p.reviews.toLocaleString('id-ID') + ' (proksi keramaian, bukan jumlah member)')
  return parts.join(' · ')
}

function baseDraft(p: SeedPoint): CommunityDraft {
  return {
    name: p.name,
    category: p.category,
    address: p.address,
    lat: p.lat,
    lng: p.lng,
    estimated_members: null,
    pic_name: '',
    pic_phone: '',
    activity_schedule: '',
    business_owner_potential: null,
    funding_potential_idr: null,
    product_opportunity: [],
    status: 'not_contacted',
    next_action: '',
    next_action_date: null,
    notes: notesOf(p),
    ntb_acquired: 0,
  }
}

export function seedCommunities(): CommunityDraft[] {
  return POINTS.map(baseDraft)
}

/** Belum ada aktivitas nyata; log diisi tim lewat halaman Log Aktivitas. */
export const SEED_ACTIVITIES: Array<Omit<ActivityDraft, 'community_id'> & { community: string }> = []
