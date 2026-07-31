# OHL Eigenfaces: Face Recognition Web App

Aplikasi web pengenalan wajah sederhana berbasis **Eigenfaces** (Turk & Pentland, 1991), dibangun dengan Flask (backend) dan Next.js (frontend). Seluruh inti algoritma, representasi data, mean-centering, pembentukan eigenface, proyeksi, pengukuran jarak, dan logika pengenalan, diimplementasikan sendiri, tanpa menggunakan library face recognition siap pakai.

## Author

| Nama Lengkap | NIM | 
|---|---|
| Kalyca Nathania Benedicta Manullang | 13524071 |

---

## Daftar Isi

- [Cara Menjalankan Program](#cara-menjalankan-program)
- [Sumber Dataset](#sumber-dataset)
- [Struktur Proyek](#struktur-proyek)
- [Penjelasan Pendekatan](#penjelasan-pendekatan)
  - [1. Representasi Matriks](#1-representasi-matriks)
  - [2. Mean-Centering](#2-mean-centering)
  - [3. Komputasi Eigenfaces](#3-komputasi-eigenfaces)
  - [4. Pemilihan Jumlah Eigenfaces (k)](#4-pemilihan-jumlah-eigenfaces-k)
  - [5. Proyeksi dan Pengenalan Wajah](#5-proyeksi--pengenalan-wajah)
  - [6. Cara Pengukuran Kecocokan (Threshold Unknown Face)](#6-cara-pengukuran-kecocokan-threshold-unknown-face)
  - [7. Preprocessing Input Pengguna](#7-preprocessing-input-pengguna)
  - [8. Tambah Dataset dan Retrain Otomatis](#8-tambah-dataset--retrain-otomatis)
- [Batasan dan Asumsi Sistem](#batasan-dan-asumsi-sistem)
- [Fitur Bonus](#fitur-bonus)
- [API Endpoints](#api-endpoints)
- [Link Demo Video](#link-demo-video)

---

## Cara Menjalankan Program

### Prasyarat

- Python ≥ 3.11
- [uv](https://docs.astral.sh/uv/) sebagai package/environment manager
- Node.js ≥ 18 dan npm
- Browser dengan akses webcam (untuk fitur capture)

### Backend (Flask)

```bash
cd backend
uv sync
uv run app.py
```

Setelah dijalankan, server akan otomatis:
1. Memuat dataset ORL dari `backend/dataset/orl_faces/`
2. Melakukan preprocessing (equalize histogram, resize, flatten)
3. Menghitung mean face, covariance matrix, eigendecomposition, dan proyeksi
4. Menyimpan visualisasi mean face dan top-k eigenfaces ke `backend/generated/`
5. Menyalakan API server di `http://127.0.0.1:5000`

Contoh log yang akan muncul di terminal:

```
Loading dataset...
400 images loaded
Mean face computed
Eigenfaces computed
Projection computed
Ready.
```

Tidak ada langkah manual tambahan, dataset ORL sudah disertakan dalam repository (di-commit karena ukurannya kecil, ~4 MB), sehingga backend langsung bisa jalan setelah `uv sync`.

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Buka `http://localhost:3000` di browser. Pastikan backend (`http://127.0.0.1:5000`) sudah berjalan terlebih dahulu karena frontend mengambil semua data lewat HTTP request ke backend (lihat `frontend/services/api.ts`).

### Halaman yang Tersedia

| Halaman | Path | Deskripsi |
|---|---|---|
| Home | `/` | Halaman utama |
| Recognize | `/recognize` | Upload atau capture wajah untuk dikenali |
| Add Face | `/add-face` | Tambah subjek baru ke dataset (retrain otomatis) |
| Gallery | `/gallery` | Bonus: Mean Face, Top-k Eigenfaces, info dataset |

---

## Sumber Dataset

**AT&T (ORL) Face Dataset** yang berisi kumpulan 400 citra grayscale (40 subjek × 10 citra per subjek), ukuran asli 92×112 piksel, dengan variasi ekspresi wajah, pencahayaan, dan aksesoris (kacamata/tidak).

- Sumber: [AT&T Database of Faces, Kaggle](https://www.kaggle.com/datasets/kasikrit/att-database-of-faces)
- Disimpan di `backend/dataset/orl_faces/sX/Y.pgm`, dengan `X` = nomor subjek (1–40) dan `Y` = nomor citra (1–10)
- Dataset mentah **di-commit** ke repository karena ukurannya kecil dan agar program bisa langsung dijalankan tanpa perlu mengunduh ulang
- Data turunan (matriks, mean face, eigenfaces, proyeksi) **tidak** di-commit, semuanya dihitung ulang di memori setiap kali server start (`backend/generated/` masuk `.gitignore`)

---

## Struktur Proyek

```
backend/
├── app.py                        # Entry point Flask
├── config.py                     # Konfigurasi (ukuran citra, k, threshold, dsb.)
├── dataset/orl_faces/            # Dataset ORL (di-commit)
├── generated/                    # Cache runtime: mean face, eigenfaces (tidak di-commit)
├── api/                          # Blueprint endpoint (recognition, dataset, gallery, health)
├── core/                         # Inti algoritma Eigenfaces (custom implementation)
├── models/                       # State model (EigenfaceModel)
├── utils/                        # Helper (distance, image utils, visualization)
└── scripts/                      # Script kalibrasi threshold

frontend/
├── app/                           # Halaman Next.js (App Router)
├── components/                    # Komponen UI
├── services/                      # Wrapper fetch ke backend
├── hooks/                         # Custom hooks (webcam, upload)
└── types/                         # TypeScript interfaces
```

---

## Penjelasan Pendekatan

### 1. Representasi Matriks

Setiap citra ORL (92×112 piksel grayscale) di-*flatten* menjadi vektor kolom berdimensi `D = 92 × 112 = 10.304`. Seluruh `N` citra (400 untuk dataset awal, bertambah seiring subjek baru ditambahkan) disusun menjadi matriks data:

```
X ∈ R^(N × D)
```

Diimplementasikan di `core/data_loader.py` (baca dataset dari folder `sX/Y.pgm`) dan `core/preprocessing.py` (fungsi `flatten_image`).

### 2. Mean-Centering

Wajah rata-rata (*mean face*) dihitung sebagai rata-rata seluruh vektor wajah pada matriks `X`:

```
ψ = (1/N) Σ xᵢ
```

Setiap citra kemudian dikurangi dengan `ψ` untuk mendapatkan citra ter-*mean-centered*:

```
Φᵢ = xᵢ − ψ
```

Diimplementasikan di `core/mean_face.py` (`compute_mean_face`, `mean_centering`). Mean face divisualisasikan dan disimpan ke `generated/mean_face.png` setiap kali model dibangun/di-retrain (fitur bonus Gallery).

### 3. Komputasi Eigenfaces

Secara teori, eigenfaces diperoleh dari eigendecomposition covariance matrix `C = A·Aᵀ` berukuran `D × D` (di mana `A` adalah matriks citra ter-*mean-centered*, `D = 10.304`). Namun, mendekomposisi matriks sebesar itu sangat mahal secara komputasi.

Penulis menggunakan **trik Turk-Pentland**: alih-alih menghitung `C = A·Aᵀ` (D×D), penulis menghitung matriks surrogate yang jauh lebih kecil:

```
L = A·Aᵀ / N   (berukuran N × N, bukan D × D)
```

diimplementasikan di `core/covariance.py`. Eigendecomposition `L` dilakukan dengan `numpy.linalg.eigh` (diizinkan sesuai spesifikasi tugas, khusus untuk langkah dekomposisi). Karena `eigh` tidak menjamin urutan eigenvalue, hasil eigenvalue/eigenvector diurutkan secara *descending* secara manual sebelum dipilih top-`k`.

Eigenvector asli di ruang `D`-dimensi (eigenfaces) diperoleh dengan memproyeksikan kembali eigenvector `L` ke ruang citra:

```
uᵢ = Aᵀ · vᵢ
```

lalu dinormalisasi menjadi unit vector. Seluruh langkah ini (pemilihan top-k, proyeksi balik, normalisasi) diimplementasikan sendiri di `core/eigenfaces.py`, `numpy.linalg.eigh` hanya dipakai untuk langkah dekomposisi matriks `L`, bukan untuk pembentukan eigenface itu sendiri.

### 4. Pemilihan Jumlah Eigenfaces (k)

Dikonfigurasi lewat `N_COMPONENTS = 50` di `config.py`, sebanyak 50 komponen utama (dari maksimum 400, dibatasi oleh jumlah sampel `N`) digunakan untuk membangun ruang eigenface dan melakukan proyeksi/pengenalan.

Pertimbangan pemilihan `k = 50`:
- Pada dataset wajah, sebagian besar variansi (perbedaan pencahayaan, ekspresi, identitas) umumnya terkonsentrasi pada beberapa puluh komponen pertama, komponen ke-50 ke atas cenderung menangkap noise berresolusi tinggi yang tidak signifikan untuk identifikasi.
- `k` yang terlalu kecil (misal < 10) berisiko menghilangkan informasi pembeda antarsubjek yang mirip, `k` yang terlalu besar mendekati dimensi asli (10.304) kehilangan manfaat *dimensionality reduction* dan lebih rentan *overfitting* terhadap noise piksel individual.
- Nilai 50 dipilih sebagai titik tengah yang empiris cukup baik untuk 40 subjek dengan 10 sampel per subjek pada dataset ORL dan dapat disesuaikan lewat `config.py` tanpa mengubah kode inti.

Untuk keperluan visualisasi (fitur bonus Gallery), hanya `EIGENFACE_TOP_K = 16` eigenface pertama yang divisualisasikan sebagai gambar meskipun seluruh 50 komponen tetap dipakai dalam proses pengenalan.

### 5. Proyeksi dan Pengenalan Wajah

Setiap wajah ter-*mean-centered* diproyeksikan ke ruang eigenface berdimensi `k` untuk mendapatkan vektor bobot (koordinat):

```
w = Φᵀ · U   (U = matriks eigenfaces, k kolom)
```

diimplementasikan di `core/projection.py`. Untuk wajah input baru, proyeksi menggunakan mean face dan eigenfaces hasil training (`project_face`).

Pengenalan dilakukan dengan mencari wajah training yang proyeksinya **paling dekat** secara jarak Euclidean terhadap proyeksi wajah input:

```
d(w_query, w_training) = ||w_query − w_training||₂
```

diimplementasikan di `utils/distance.py` (`euclidean_distance`) dan `core/recognizer.py` (`recognize`, nearest neighbor search di antara seluruh proyeksi training). Subjek dari wajah training terdekat diambil sebagai hasil prediksi, disertai jarak/skor kemiripan dan citra pembanding (ditampilkan lewat endpoint `/training-image/<index>`).

### 6. Cara Pengukuran Kecocokan (Threshold Unknown Face)

Karena nearest-neighbor akan **selalu** mengembalikan subjek terdekat meskipun wajah input sama sekali bukan bagian dari dataset, penulis menambahkan mekanisme **threshold** (fitur bonus) untuk menyatakan wajah "Unknown" jika jarak terdekat melebihi ambang batas tertentu:

```python
def is_unknown_face(distance, threshold):
    return distance > threshold
```

(`core/threshold.py`)

**Kalibrasi threshold** dilakukan secara empiris lewat `scripts/calibrate_threshold.py` dengan menghitung distribusi jarak proyeksi:
- Antarcitra **subjek yang sama** (should be kecil) diambil persentil ke-95 sebagai batas atas kemiripan wajar dalam subjek yang sama.
- Antar citra **subjek yang berbeda** (should be lebih besar diambil persentil ke-5 sebagai batas bawah jarak antarsubjek berbeda.

Nilai threshold final diambil sebagai titik tengah antara kedua batas tersebut:

```
threshold = (p95(same-subject) + p5(different-subject)) / 2
```

Hasil kalibrasi pada dataset ORL (setelah preprocessing histogram equalization + resize + `k = 50`) menghasilkan `UNKNOWN_FACE_THRESHOLD = 6054.75`, dikonfigurasi di `config.py`. Nilai ini perlu dikalibrasi ulang (jalankan ulang script) apabila `N_COMPONENTS`, ukuran citra, atau parameter preprocessing lain diubah karena skala jarak proyeksi bergantung pada parameter tersebut.

### 7. Preprocessing Input Pengguna

Untuk wajah input dari upload/webcam (yang kondisinya jauh lebih bervariasi dibanding foto ORL yang sudah rapi ter-crop), dilakukan tahap tambahan sebelum proyeksi:

1. **Deteksi dan crop wajah** menggunakan Haar Cascade bawaan OpenCV (`cv2.CascadeClassifier`) untuk melokalisasi wajah dominan (area terbesar jika terdeteksi lebih dari satu) dan meng-crop area tersebut, murni untuk lokalisasi, bukan pengenalan (`utils/image_utils.py`, fungsi `detect_and_crop_face`). Jika tidak ada wajah terdeteksi, sistem mengembalikan error `422 No face detected` alih-alih memaksa memproses gambar mentah.
2. **Histogram equalization**: `cv2.equalizeHist` untuk menormalisasi variasi pencahayaan antara foto training (ORL, pencahayaan terkontrol) dan foto pengguna (webcam/HP, pencahayaan bervariasi).
3. **Resize** ke ukuran standar 92×112 piksel.
4. **Flatten** menjadi vektor 1D.

Urutan operasi ini (**crop → equalize → resize → flatten**) diterapkan **konsisten** baik pada jalur query (`preprocess_uploaded_image`) maupun jalur training/retrain (`data_loader.py`) agar distribusi piksel yang dibandingkan berada pada skala yang sama, krusial untuk keakuratan pengukuran jarak di ruang eigenspace.

### 8. Tambah Dataset dan Retrain Otomatis

Saat pengguna menambahkan subjek baru lewat endpoint `POST /dataset/add`:

1. Citra di-crop wajahnya (`prepare_face_for_dataset`) dan disimpan apa adanya (**tanpa** resize/equalize di tahap ini) ke folder `dataset/orl_faces/sX/Y.pgm`, nomor urut citra dihitung otomatis berdasarkan file yang sudah ada di folder subjek tersebut.
2. Fungsi `retrain_model()` (`core/retrain.py`) dipanggil, yang membangun ulang **seluruh** model dari awal, memuat ulang dataset (termasuk citra baru), menghitung ulang mean face, covariance, eigenfaces, dan proyeksi, lalu menggantikan model lama secara atomik di memori (`model_instance.py`, variabel modul global `_model`).
3. Subjek baru langsung dapat dikenali pada request `/recognize` berikutnya **tanpa restart server**.

Preprocessing subjek baru sengaja ditunda hingga tahap load/retrain (bukan saat penyimpanan) agar melalui jalur `equalize → resize` yang identik dengan seluruh citra ORL lainnya, termasuk citra dengan ukuran crop yang bervariasi antar subjek/antar foto.

---

## Batasan dan Asumsi Sistem

- **Ketergantungan pada Haar Cascade**: deteksi wajah menggunakan `haarcascade_frontalface_default.xml` bawaan OpenCV yang bekerja optimal untuk wajah frontal dengan pencahayaan cukup. Wajah dengan sudut ekstrem, oklusi berat, atau pencahayaan sangat rendah dapat gagal terdeteksi (sistem akan mengembalikan error, bukan memaksa memproses).
- **Satu wajah dominan per foto**: jika terdeteksi lebih dari satu wajah dalam satu foto, sistem hanya memproses wajah dengan area bounding box terbesar.
- **Sensitif terhadap variasi ekstrem**: meskipun histogram equalization membantu menormalisasi pencahayaan, Eigenfaces sebagai metode klasik tetap kurang robust terhadap perubahan pose signifikan, ekspresi ekstrem, atau aksesoris wajah (masker, dsb.) dibanding metode berbasis deep learning modern.
- **Threshold bersifat statis dan dataset-dependent**: nilai `UNKNOWN_FACE_THRESHOLD` dikalibrasi berdasarkan distribusi jarak pada dataset ORL yang ada saat kalibrasi dilakukan. Penambahan banyak subjek baru dengan karakteristik yang berbeda secara signifikan berpotensi menggeser distribusi jarak optimal, sehingga threshold ideal bisa berubah seiring waktu.
- **Concurrency saat retrain**: model disimpan sebagai variabel modul global tunggal (bukan per-request). Pada skenario ekstrem di mana request `/recognize` bersamaan persis dengan proses `retrain_model()` sedang menggantikan referensi model, Python menjamin operasi reassignment atomik sehingga tidak terjadi crash, tetapi tidak ada mekanisme locking eksplisit, cukup memadai untuk skala penggunaan tugas ini (single-process Flask dev server).
- **Dimensionality reduction tetap dibatasi oleh jumlah sampel**: karena trik Turk-Pentland menghitung eigendecomposition pada matriks `N × N`, jumlah komponen utama maksimum yang bisa diekstrak dibatasi oleh jumlah total citra `N`, bukan dimensi asli `D`.

---

## Fitur Bonus

### Eigenfaces Gallery

Halaman `/gallery` menampilkan:
- **Mean Face**: wajah rata-rata dari seluruh dataset (`GET /gallery/mean-face/image`)
- **Top-16 Eigenfaces**: divisualisasikan sebagai citra grayscale, disertai nilai eigenvalue dan persentase explained variance masing-masing (`GET /gallery/eigenfaces`)
- **Info Dataset**: jumlah subjek dan total citra saat ini

### Threshold "Unknown Face"

Dijelaskan lengkap pada [bagian 6](#6-cara-pengukuran-kecocokan-threshold-unknown-face) di atas, sistem dapat menyatakan wajah tidak dikenali (bukan memaksa mencocokkan ke subjek terdekat) berdasarkan ambang batas jarak yang dikalibrasi secara empiris.

---

## API Endpoints

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/health` | Cek status server dan nilai threshold aktif |
| `POST` | `/recognize` | Kirim citra (`multipart/form-data`, field `image`), kembalikan subjek, jarak, dan status known/unknown |
| `POST` | `/dataset/add` | Tambah citra subjek baru (`image`, `subject`), otomatis retrain |
| `GET` | `/gallery` | Info seluruh subjek dan jumlah citra |
| `GET` | `/gallery/mean-face` | URL citra mean face |
| `GET` | `/gallery/eigenfaces` | Daftar top-k eigenfaces beserta eigenvalue |
| `GET` | `/training-image/<index>` | Citra training pada index tertentu (untuk citra pembanding hasil recognition) |

---

## Link Demo Video

[...]