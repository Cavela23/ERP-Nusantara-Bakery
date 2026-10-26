# Product Requirements Document

## ERP Nusantara Bakery

**Status:** Draft  
**Versi:** 1.0  
**Tanggal:** 26 Oktober 2026  
**Target produk:** ERP operasional untuk bakery dengan gudang pusat, produksi, distribusi cabang, dan POS.

---

## 1. Ringkasan Produk

ERP Nusantara Bakery adalah aplikasi internal untuk membantu bakery mengelola proses operasional dari pembelian bahan baku sampai penjualan produk jadi.

Alur utama yang menjadi inti produk:

```text
Master Data
    ↓
Purchasing Bahan Baku
    ↓
Penerimaan dan Stok Gudang Pusat
    ↓
Produksi Berdasarkan BOM
    ↓
Stok Produk Jadi
    ↓
Distribusi ke Cabang
    ↓
Stok Cabang
    ↓
Penjualan POS
    ↓
Dashboard dan Laporan
```

Produk ini ditujukan untuk menjadi **ERP operasional bakery skala kecil sampai menengah**, bukan sistem akuntansi enterprise atau marketplace.

---

## 2. Tujuan Produk

### Tujuan utama

1. Memusatkan data produk, bahan baku, supplier, cabang, dan pengguna.
2. Melacak stok bahan baku dan produk jadi berdasarkan pergerakan stok.
3. Menghubungkan BOM dengan proses produksi.
4. Mengelola distribusi produk dari gudang pusat ke cabang.
5. Mencatat transaksi penjualan per cabang.
6. Menyediakan informasi operasional melalui dashboard dan laporan.
7. Membatasi akses berdasarkan peran pengguna dan cabang.
8. Menyediakan jejak audit untuk transaksi yang memengaruhi stok.

### Sasaran keberhasilan

- Tidak ada transaksi stok yang mengubah angka persediaan tanpa riwayat.
- Setiap produk jadi dapat ditelusuri ke produksi dan distribusinya.
- Owner dapat melihat ringkasan operasional seluruh cabang.
- Staff hanya dapat menjalankan aktivitas sesuai role-nya.
- Alur utama dapat dijalankan dari data kosong sampai transaksi penjualan.
- Alur utama memiliki automated test yang dapat dijalankan dari instalasi baru.

---

## 3. Persona dan Role

| Role | Tanggung jawab utama |
|---|---|
| Owner | Mengelola master data, seluruh cabang, hak akses, dan laporan |
| Purchasing Staff | Membuat dan memproses Purchase Order |
| Staff Gudang | Menerima bahan baku, mengelola stok, dan mengirim distribusi |
| Kepala Produksi | Membuat dan menyelesaikan Production Order |
| Kasir | Mencatat penjualan pada cabang yang ditugaskan |

### Aturan akses

1. Owner dapat melihat seluruh data.
2. User operasional hanya dapat mengakses modul yang sesuai role.
3. User cabang tidak boleh memilih atau melihat cabang lain tanpa izin.
4. Transaksi yang sudah memengaruhi stok tidak boleh dihapus secara langsung.
5. Perubahan atau pembatalan transaksi harus menghasilkan reversal atau adjustment.

---

## 4. Fitur yang Sudah Ada

Fitur berikut dianggap sebagai baseline produk:

- Autentikasi, verifikasi email, password reset, 2FA, dan passkey.
- Master produk, kategori, bahan baku, supplier, dan cabang.
- Bill of Materials untuk produk.
- Purchase Order bahan baku.
- Penerimaan Purchase Order dan penambahan stok bahan baku.
- Production Order dengan pemakaian bahan baku berdasarkan BOM.
- Stok gudang pusat dan stok produk per cabang.
- Distribusi produk dari gudang pusat ke cabang.
- POS atau pencatatan penjualan.
- Riwayat pergerakan stok.
- Dashboard omzet, transaksi, produk terlaris, peringatan stok, produksi, dan distribusi.
- Role-based access control.

Baseline ini harus dipertahankan ketika fitur baru dikembangkan.

---

## 5. Ruang Lingkup MVP yang Harus Diselesaikan

## 5.1 Master Data

Entitas:

- User
- Role
- Branch
- Product
- Category
- Raw Material
- Supplier
- Bill of Material

Kebutuhan:

1. SKU produk dan bahan baku harus unik.
2. Satuan harus jelas dan konsisten.
3. Produk dapat ditandai aktif atau tidak aktif.
4. BOM harus memiliki minimal satu bahan baku.
5. Produk yang sudah digunakan pada transaksi tidak boleh dihapus secara destruktif.

## 5.2 Purchasing

### Status Purchase Order

```text
Draft → Ordered → Partially Received → Received
   └──────────────→ Cancelled
```

Kebutuhan:

1. User dapat membuat PO dengan supplier, tanggal, item, quantity, dan harga.
2. PO berstatus draft dapat diedit.
3. PO berstatus ordered tidak dapat diedit tanpa mekanisme pembatalan.
4. Penerimaan dapat dilakukan sebagian.
5. Setiap penerimaan menyimpan tanggal, user penerima, quantity aktual, dan catatan.
6. Stok bahan baku bertambah hanya berdasarkan quantity yang benar-benar diterima.
7. Quantity diterima tidak boleh melebihi quantity PO tanpa alasan dan otorisasi.
8. PO yang sudah menerima barang tidak boleh dihapus.

## 5.3 Inventory dan Stock Opname

Semua perubahan stok wajib dicatat sebagai `StockMovement`.

Jenis pergerakan minimal:

- Purchase receipt
- Production consumption
- Production output
- Distribution out
- Distribution in
- Sale
- Adjustment increase
- Adjustment decrease
- Waste atau expired
- Return

Kebutuhan:

1. Sistem menampilkan stok bahan baku di gudang pusat.
2. Sistem menampilkan stok produk jadi di gudang pusat.
3. Sistem menampilkan stok produk per cabang.
4. User berwenang dapat membuat stock adjustment.
5. Adjustment wajib memiliki alasan dan pembuat.
6. Stock opname menyimpan stok sistem, stok fisik, selisih, dan hasil adjustment.
7. Riwayat stok dapat difilter berdasarkan item, lokasi, tanggal, dan tipe pergerakan.
8. Stok tidak boleh menjadi negatif.
9. Perubahan stok concurrent harus dilindungi dengan transaction dan row locking.

## 5.4 Production

### Status Production Order

```text
Draft → In Progress → Completed
   └────────────────→ Cancelled
```

Kebutuhan:

1. Production Order memilih produk yang memiliki BOM.
2. Sistem menghitung kebutuhan bahan baku dari BOM dan quantity produksi.
3. Sistem menolak produksi jika bahan baku tidak mencukupi.
4. Saat produksi dimulai, bahan baku belum langsung dianggap selesai digunakan kecuali kebijakan produk menetapkannya.
5. Saat produksi selesai:
   - bahan baku dikurangi;
   - produk jadi ditambahkan;
   - waktu selesai dan user pelaksana disimpan.
6. Sistem menyimpan quantity direncanakan dan quantity aktual.
7. Produk rusak atau gagal produksi dapat dicatat.
8. Production Order yang telah selesai tidak boleh diedit secara destruktif.
9. Pembatalan setelah stok berubah harus menggunakan reversal.

## 5.5 Distribution

### Status Distribution

```text
Draft → Approved → Shipped → Partially Received → Received
   └──────────────────────────────→ Cancelled
```

Kebutuhan:

1. User membuat permintaan distribusi untuk satu cabang.
2. Item distribusi memiliki produk dan quantity.
3. Sistem memvalidasi ketersediaan stok gudang pusat.
4. Pengiriman menyimpan pengirim dan waktu pengiriman.
5. Penerimaan menyimpan penerima, waktu penerimaan, quantity aktual, dan catatan selisih.
6. Sistem mendukung penerimaan sebagian.
7. Stok gudang pusat dan stok cabang harus konsisten dengan status distribusi.
8. Distribusi yang sudah dikirim tidak boleh diedit secara destruktif.

## 5.6 Sales/POS

Kebutuhan minimum:

1. Kasir memilih cabang yang menjadi tanggung jawabnya.
2. Kasir dapat menambahkan beberapa produk dalam satu transaksi.
3. Sistem memvalidasi stok cabang sebelum transaksi disimpan.
4. Harga transaksi disimpan sebagai snapshot, bukan selalu mengambil harga terbaru.
5. Sistem menghitung subtotal dan total secara server-side.
6. Sistem menyimpan metode pembayaran:
   - Cash
   - Transfer
   - QRIS
   - Debit atau kartu
7. Sistem menyimpan nominal pembayaran dan kembalian bila relevan.
8. Sistem mendukung diskon sesuai kewenangan user.
9. Transaksi yang selesai mengurangi stok cabang.
10. Transaksi dapat di-void atau diretur melalui reversal, bukan delete.
11. Sistem menyediakan detail transaksi dan struk yang dapat dicetak.

### Status Sale

```text
Completed → Voided
          ↘ Refunded
```

## 5.7 Dashboard dan Reports

Dashboard minimum:

- Omzet hari ini dan periode berjalan
- Jumlah transaksi
- Quantity terjual
- Produk terlaris
- Stok minimum
- Produksi terbaru
- Distribusi berjalan
- Ringkasan per cabang

Laporan minimum:

1. Sales Report
2. Inventory Movement Report
3. Stock Balance Report
4. Production Report
5. Purchasing Report
6. Distribution Report
7. Gross profit atau margin report

Setiap laporan harus mendukung:

- Filter tanggal
- Filter cabang atau lokasi
- Filter produk atau kategori bila relevan
- Pagination
- Export CSV

---

## 6. HPP dan Profitabilitas

Sistem harus dapat menghitung estimasi HPP produk berdasarkan BOM.

Perhitungan minimum:

```text
HPP produk = Σ(quantity bahan baku × harga bahan baku)
```

Versi lanjutan dapat menambahkan:

- Packaging
- Tenaga kerja
- Overhead
- Waste

Sistem harus membedakan:

- Harga jual
- HPP
- Gross profit
- Gross margin

Perubahan harga bahan baku tidak boleh mengubah HPP historis transaksi yang sudah selesai.

---

## 7. Audit dan Integritas Data

Sistem harus menyimpan minimal:

- User pembuat
- Waktu pembuatan
- User pengubah
- Waktu perubahan
- Referensi dokumen sumber
- Alasan adjustment, void, retur, atau pembatalan

Aturan integritas:

1. Nomor PO, produksi, distribusi, dan penjualan harus unik.
2. Nomor dokumen harus aman dari duplikasi pada transaksi bersamaan.
3. Semua proses multi-tabel harus menggunakan database transaction.
4. Penghapusan data master harus dicegah jika data sudah digunakan.
5. Perubahan status harus divalidasi di server.
6. Validasi stok harus dilakukan kembali di dalam transaction.

---

## 8. Non-Goals

Fitur berikut tidak termasuk scope utama versi ini:

- Akuntansi double-entry lengkap
- Payroll dan HRIS
- Marketplace atau online storefront
- Integrasi payment gateway produksi
- Integrasi pajak pemerintah
- CRM kompleks
- Procurement tender atau multi-vendor bidding
- Mobile application native
- Forecasting berbasis machine learning
- Multi-company atau multi-currency

Fitur non-goal hanya boleh dikerjakan setelah seluruh MVP dan quality gate selesai.

---

## 9. Prioritas Roadmap

### P0 — Wajib sebelum portfolio showcase

1. Memastikan test environment dapat dijalankan dari instalasi baru.
2. Menambahkan seed/demo data.
3. Menambahkan README instalasi dan demo flow.
4. Menambahkan stock adjustment dan stock opname.
5. Menambahkan lifecycle production.
6. Menambahkan payment method, void, dan reversal POS.
7. Menambahkan pembatasan akses berdasarkan cabang.
8. Menambahkan test untuk alur stok end-to-end.

### P1 — Wajib untuk MVP operasional

1. Partial receiving Purchase Order.
2. Partial receiving distribusi.
3. Laporan operasional dengan filter tanggal dan cabang.
4. HPP dan gross profit.
5. Audit log.
6. Unique document number yang aman dari race condition.
7. Export CSV.
8. Penanganan produk rusak dan kedaluwarsa.

### P2 — Setelah MVP stabil

1. Barcode atau QR scanning.
2. Shift kasir dan cash closing.
3. Reorder suggestion bahan baku.
4. Batch atau lot number.
5. Expiry date per penerimaan bahan baku.
6. Approval workflow.
7. Notifikasi stok minimum.
8. API untuk integrasi eksternal.

---

## 10. Quality Gate

Sebuah fitur dianggap selesai apabila:

1. Alur normal berhasil.
2. Input invalid ditolak dengan pesan yang jelas.
3. Role yang tidak berwenang mendapat response authorization yang benar.
4. Stok tetap konsisten saat transaksi gagal.
5. Pembatalan atau reversal tercatat dalam history.
6. Tidak ada duplicate document number.
7. Ada feature test untuk happy path dan failure path.
8. Lint, static analysis, type check, dan test suite berhasil.
9. UI memiliki loading, error, empty, dan success state.
10. Fitur terdokumentasi di halaman atau dokumentasi terkait.

Command validasi minimum:

```bash
composer lint:check
composer types:check
php artisan test
npm run lint:check
npm run format:check
npm run types:check
npm run build
```

---

## 11. Demo Flow untuk Portofolio

Demo utama harus dapat menunjukkan alur berikut:

1. Login sebagai owner.
2. Membuat kategori, bahan baku, produk, supplier, dan BOM.
3. Membuat Purchase Order.
4. Menerima seluruh atau sebagian bahan baku.
5. Melihat perubahan stok bahan baku.
6. Membuat Production Order.
7. Menyelesaikan produksi dan melihat stok produk jadi bertambah.
8. Membuat distribusi ke cabang.
9. Mengirim dan menerima distribusi.
10. Login sebagai kasir cabang.
11. Membuat transaksi POS.
12. Melihat stok cabang berkurang.
13. Melakukan void atau retur dan melihat reversal stok.
14. Membuka dashboard dan laporan.
15. Melihat history seluruh pergerakan stok.

Demo harus memperlihatkan setidaknya satu failure path:

- Produksi ditolak karena bahan baku kurang.
- Distribusi ditolak karena stok pusat kurang.
- Penjualan ditolak karena stok cabang kurang.
- User tanpa role tidak dapat mengakses modul.

---

## 12. Definisi Selesai Produk

ERP Nusantara Bakery siap dipresentasikan sebagai portofolio apabila:

- Seluruh fitur P0 selesai.
- Alur demo dapat dijalankan tanpa manipulasi database manual.
- Test environment dapat disiapkan dengan instruksi yang jelas.
- Tidak ada method controller yang dibiarkan kosong untuk route yang dipublikasikan.
- Setiap transaksi stok memiliki referensi dan audit trail.
- Dashboard menampilkan data dari transaksi nyata.
- Dokumentasi menjelaskan trade-off, batasan, dan roadmap.

ERP dianggap siap digunakan secara operasional setelah fitur P1 selesai dan quality gate terpenuhi.

