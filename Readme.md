## 🌸 Produk Skincare Kecantikan

Proyek ini adalah halaman web interaktif yang menampilkan sistem pemesanan dan pembayaran untuk produk skincare. Aplikasi ini dirancang dengan antarmuka modern menggunakan **Tailwind CSS** dan JavaScript, serta menyimpan transaksi pengguna secara lokal di browser.

---

### ✨ Fitur Utama

* 🎨 **Tema Terang/Gelap** — Pengguna dapat mengubah tema dengan tombol toggle.
* 🧾 **Formulir Pembayaran Interaktif** — Termasuk input nama, email, pilihan produk, jumlah, metode pembayaran, dan kode promo.
* 💸 **Perhitungan Otomatis** — Subtotal, diskon (jika ada), dan total dihitung secara real-time.
* 🧧 **Kode Promo** — Mendukung kode diskon seperti `Poduk` dan `Skincare Kecantikan`.
* 🗂️ **Riwayat Transaksi** — Menampilkan ringkasan semua transaksi yang disimpan di `localStorage`.
* ✅ **Modal Konfirmasi Pembayaran** — Tampil setelah transaksi berhasil.
* 🖨️ **Cetak Invoice** — Pengguna dapat mencetak bukti pembayaran.
* 🧹 **Hapus Riwayat** — Tombol untuk menghapus semua transaksi yang tersimpan.

---

### 📁 Struktur File

```
.
├── index.html       # Halaman utama
├── script.js        # Logika interaktif dengan JavaScript
├── assets/
│   └── Picture1.jpg # Gambar profil (gunakan direktori ini untuk gambar)
```

---

### 🚀 Cara Menjalankan

1. **Download semua file** termasuk `index.html`, `script.js`, dan folder `assets`.
2. **Buka `index.html` di browser** (cukup klik dua kali atau buka via VS Code + Live Server).
3. Mulai isi formulir dan lakukan transaksi!

---

### 🧪 Contoh Kode Promo

| Kode Promo            | Diskon |
| --------------------- | ------ |
| `Poduk`               | 10%    |
| `Skincare Kecantikan` | 20%    |

Masukkan salah satu kode di atas dalam kolom **"Kode Promo"** sebelum menyelesaikan transaksi.

---

### 📌 Catatan Teknis

* Transaksi disimpan secara lokal menggunakan `localStorage`, tidak ada backend/server.
* Tailwind CSS di-load via CDN.
* File ini menggunakan **bahasa Indonesia** sebagai bahasa antarmuka.

---

### 👩‍💻 Developer

**Nama:** Halimatus Saadah
**NIM:** 1124160186
**Institusi:** Global Institute