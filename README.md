# Website Utama SakTe

Website resmi PT Satya Karya Technosolution yang dibangun menggunakan React dan Vite. Project ini menampilkan profil perusahaan, layanan, portofolio, FAQ, testimoni, serta halaman administrasi untuk mengelola konten.

## Teknologi

- React 18
- Vite
- Tailwind CSS
- React Router
- Clerk Authentication
- Appwrite Database dan Storage
- Framer Motion
- Vercel

## Fitur

- Landing page responsif
- Informasi layanan dan teknologi perusahaan
- Portofolio project
- FAQ dan testimoni pelanggan
- Konten dinamis dari Appwrite
- Autentikasi halaman admin menggunakan Clerk
- Pengelolaan layanan, fitur, portofolio, FAQ, dan testimoni
- SPA routing yang kompatibel dengan Vercel

## Menjalankan Project

Pastikan Node.js dan npm sudah tersedia, kemudian jalankan:

```bash
npm install
cp .env.example .env
npm run dev
```

Development server dapat diakses melalui:

```text
http://localhost:5173
```

## Environment Variables

Salin `.env.example` menjadi `.env`, lalu isi konfigurasi berikut:

```env
VITE_CLERK_PUBLISHABLE_KEY=

VITE_APPWRITE_ENDPOINT=
VITE_APPWRITE_PROJECT_ID=
VITE_APPWRITE_DATABASE_ID=
VITE_APPWRITE_BUCKET_ID=

VITE_APPWRITE_FEATURES_COLLECTION_ID=
VITE_APPWRITE_SERVICES_COLLECTION_ID=
VITE_APPWRITE_PORTFOLIO_COLLECTION_ID=
VITE_APPWRITE_FAQ_COLLECTION_ID=
VITE_APPWRITE_TESTIMONIALS_COLLECTION_ID=
VITE_APPWRITE_NEBENG_COLLECTION_ID=
```

Jangan memasukkan `.env` atau secret key ke repository. Semua variable dengan prefix `VITE_` akan tersedia di bundle browser, sehingga hanya gunakan konfigurasi public/client-side pada variable tersebut.

## Perintah Project

```bash
npm run dev      # Menjalankan development server
npm run build    # Membuat production build
npm run preview  # Melihat production build secara lokal
npm run lint     # Menjalankan pemeriksaan ESLint
```

Hasil production build dibuat di folder `dist`.

## Deployment Vercel

1. Import repository ini ke Vercel.
2. Pilih framework preset **Vite**.
3. Gunakan build command `npm run build`.
4. Gunakan output directory `dist`.
5. Masukkan environment variables melalui **Project Settings → Environment Variables**.
6. Deploy dan uji URL sementara dari Vercel.
7. Setelah berhasil, hubungkan domain `sakte.id` melalui menu **Settings → Domains**.

File `vercel.json` menangani fallback routing agar halaman React Router tetap dapat dibuka atau di-refresh secara langsung.

## Keamanan

- Atur permission database, collection, document, dan bucket Appwrite dari sisi server.
- Jangan mengandalkan pemeriksaan email di frontend sebagai satu-satunya proteksi halaman administrasi.
- Batasi origin Clerk dan Appwrite ke domain development serta production yang digunakan.
- Audit dependency dan perbarui package secara berkala.

## Catatan Pengembangan

Antarmuka awal project dikembangkan dengan merujuk pada project tutorial [Xora oleh JavaScript Mastery](https://github.com/adrianhajdin/xora), kemudian disesuaikan untuk kebutuhan website PT Satya Karya Technosolution dan diintegrasikan dengan Clerk serta Appwrite.

Pastikan hak penggunaan kode dan aset pihak ketiga telah dipenuhi sebelum distribusi atau penggunaan komersial.
