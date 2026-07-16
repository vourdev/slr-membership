Panduan Lengkap Integrasi API Ebook untuk Frontend
Berikut adalah daftar API yang digunakan serta cara Frontend melakukan integrasi fitur Ebook secara lengkap:

1. Alur Manajemen Ebook (Untuk Panel Admin / Super Admin)
Langkah A: Dapatkan URL Unggah Gambar (Cover / Gambar Bab)
Gunakan API ini untuk mendapatkan otorisasi upload ke storage publik.

Endpoint: POST /api/v1/ebooks/presigned-url
Headers:
http
Authorization: Bearer <JWT_TOKEN_ADMIN>
Content-Type: application/json
Request Body:
json
{
  "filename": "nama_gambar.png",
  "contentType": "image/png"
}
Response (200 OK):
json
{
  "success": true,
  "message": "Presigned upload URL generated.",
  "data": {
    "upload_url": "https://object.smartliferewards.com.au/public/ebooks/2026-07-16/...", // URL UNTUK UPLOAD
    "download_url": "https://object.smartliferewards.com.au/public/ebooks/2026-07-16/...", // URL UNTUK SIMPAN KE DB
    "object_key": "ebooks/2026-07-16/..."
  }
}
Langkah B: Upload File Gambar ke Storage
Lakukan HTTP request langsung dari Frontend ke upload_url yang didapatkan di atas.

Endpoint: Ambil dari nilai upload_url hasil Langkah A.
Method: PUT (Wajib PUT)
Headers:
http
Content-Type: image/png  <!-- Harus sama persis dengan contentType di Langkah A -->
Body: Kirim file binary mentah (raw file buffer/blob). Jangan bungkus ke dalam FormData.
JavaScript: body: fileObject
Response: 200 OK (menandakan upload berhasil).
Langkah C: Buat Ebook di Database Backend
Setelah gambar berhasil diunggah, kirim data Ebook beserta download_url ke database backend.

Endpoint: POST /api/v1/ebooks
Headers:
http
Authorization: Bearer <JWT_TOKEN_ADMIN>
Content-Type: application/json
Request Body:
json
{
  "title": "Smart Money Essentials",
  "subtitle": "Panduan Menabung",
  "coverUrl": "https://object.smartliferewards.com.au/public/ebooks/2026-07-16/...", // Ambil dari download_url Langkah A
  "description": "Buku panduan keuangan praktis.",
  "category": "Finance",
  "footnote": "Isi info footnote buku...",
  "tierAccess": "RED", // Pilihan: VISITOR, RED, BLUE
  "readingTimeMinutes": 15
}
Langkah D: Buat Bab Buku (Chapters)
Gunakan API ini untuk mengisi bab-bab di dalam Ebook tersebut.

Endpoint: POST /api/v1/ebooks/:ebookId/chapters
Headers:
http
Authorization: Bearer <JWT_TOKEN_ADMIN>
Content-Type: application/json
Request Body:
json
{
  "chapterNumber": 1,
  "title": "Pengenalan Anggaran",
  "imageUrl": "https://object.smartliferewards.com.au/public/ebooks/2026-07-16/...", // Dari langkah upload
  "body": "Isi bab dalam format Markdown atau HTML...",
  "pullQuote": "Kalimat kutipan yang menarik...",
  "sortOrder": 1
}
2. Alur Membaca Ebook (Untuk Aplikasi User / Member)
Langkah A: Menampilkan Daftar Ebook
Gunakan endpoint ini untuk memuat semua daftar Ebook.

Endpoint: GET /api/v1/ebooks?page=1&per_page=20
Headers:
http
Authorization: Bearer <JWT_TOKEN_USER>
Response (200 OK):
json
{
  "success": true,
  "data": [
    {
      "ebook_id": "uuid-buku-1",
      "title": "Smart Money Essentials",
      "cover_url": "https://object.smartliferewards.com.au/...",
      "chapter_count": 5,
      "is_locked": false // true jika user harus upgrade membership dulu
    }
  ]
}
FE Note: Jika is_locked bernilai true, beri tanda gembok di UI dan arahkan user untuk upgrade jika diklik.
Langkah B: Membaca Detail & Bab Ebook
Jika is_locked bernilai false, panggil endpoint detail untuk memuat isi konten bab.

Endpoint: GET /api/v1/ebooks/:ebookId
Headers:
http
Authorization: Bearer <JWT_TOKEN_USER>
Response jika sukses (200 OK): Mengembalikan informasi bab dan isi body konten buku.
Response jika gagal (403 Forbidden):
json
{
  "success": false,
  "message": "Upgrade membership to unlock this ebook.",
  "code": "FORBIDDEN"
}