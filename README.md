## PointCash
PointCash merupakan aplikasi Point of Sale (POS) terintegrasi yang memfasilitasi pengelolaan operasional bisnis secara end-to-end. Alur sistem ini dirancang untuk melacak seluruh siklus pergerakan barang secara real-time, mulai dari penerimaan inventaris dari supplier hingga proses transaksi penjualan ke konsumen. Selain mengendalikan stok dan mencatat histori pergerakan barang untuk kebutuhan audit, aplikasi ini juga memusatkan pengelolaan data pelanggan dan menghasilkan laporan arus kas (cashflow) secara otomatis. Keseluruhan flow ini bertujuan untuk meminimalkan kesalahan pencatatan, meningkatkan transparansi operasional, dan memberikan gambaran finansial yang akurat sebagai dasar pengambilan keputusan.

Dalam pengembangannya, proyek ini dikerjakan secara full-stack (frontend dan backend) menggunakan arsitektur teknologi yang tangguh dan skalabel. Pada sisi backend, sistem dibangun dengan kombinasi NestJS dan Golang (Gin) untuk menangani logika bisnis yang kompleks serta memastikan performa API yang cepat. Antarmuka pengguna (frontend) dikembangkan menggunakan Nuxt untuk platform web dan Quasar untuk aplikasi mobile, memberikan pengalaman pengguna yang responsif di berbagai perangkat. Manajemen data didukung oleh kombinasi PostgreSQL untuk data relasional, MongoDB untuk fleksibilitas skema, serta Redis untuk optimasi caching. Selain itu, RabbitMQ diimplementasikan sebagai message broker untuk menangani antrean proses (queue), memastikan komunikasi antar-layanan tetap stabil dan andal saat sistem menangani transaksi tinggi.

tech stack :

## Backend
- Nest.js
- Golang (gin)

## Frontend
- Nuxt.js
- Quasar

## Database
- MongoDB
- PostgreSQL

## Another tools
- Docker