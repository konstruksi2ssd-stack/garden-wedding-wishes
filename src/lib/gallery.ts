import couple from "@/assets/gallery-couple.webp.asset.json";
import rings from "@/assets/gallery-rings.webp.asset.json";
import table from "@/assets/gallery-table.webp.asset.json";
import path from "@/assets/garden-path.webp.asset.json";
import leaves from "@/assets/garden-leaves.webp.asset.json";
import walk from "@/assets/gallery-walk.webp.asset.json";
import bouquet from "@/assets/gallery-bouquet.webp.asset.json";
import akad from "@/assets/gallery-akad.webp.asset.json";

/**
 * Galeri "Momen Bahagia": 8 photos, each with its own short story shown when a guest taps it.
 * The photos and stories here are samples — replace the text (and the asset files) with the couple's own.
 */
export type GalleryStory = { id: string; src: string; alt: string; title: string; date: string; story: string };

export const GALLERY_STORIES: GalleryStory[] = [
  {
    id: "taman",
    src: path.url,
    alt: "Jalan setapak di taman yang rindang",
    title: "Taman Tempat Bertemu",
    date: "Maret 2021",
    story: "Semua bermula di taman kecil ini. Sebuah pertemuan singkat yang tak disengaja, sapaan sederhana, lalu obrolan panjang yang terasa begitu akrab — seolah kami sudah lama saling mengenal.",
  },
  {
    id: "mengenal",
    src: leaves.url,
    alt: "Dedaunan hijau yang rimbun",
    title: "Musim Saling Mengenal",
    date: "2021 – 2023",
    story: "Jarak sempat memisahkan kami. Namun pesan-pesan sederhana, doa yang saling dititipkan, dan kesabaran membuat kami tumbuh bersama, seperti dedaunan yang tetap hijau di setiap musim.",
  },
  {
    id: "restu",
    src: couple.url,
    alt: "Salsabila dan Lukman berdua",
    title: "Restu Dua Keluarga",
    date: "Juni 2025",
    story: "Dengan hati berdebar, Lukman datang menemui keluarga Salsabila. Hari itu dua keluarga dipertemukan dalam kehangatan, dan restu pun diberikan dengan penuh senyum dan haru.",
  },
  {
    id: "cincin",
    src: rings.url,
    alt: "Sepasang cincin pernikahan",
    title: "Cincin Sebuah Janji",
    date: "Januari 2026",
    story: "Lamaran resmi digelar sederhana namun khidmat. Sepasang cincin ini menjadi tanda janji kami untuk saling menjaga, dalam suka maupun duka, hingga hari akad tiba.",
  },
  {
    id: "persiapan",
    src: table.url,
    alt: "Meja jamuan yang tertata indah",
    title: "Merancang Hari Bahagia",
    date: "Agustus 2026",
    story: "Berbulan-bulan kami merancang setiap detail bersama keluarga: warna, bunga, hingga hidangan. Semua disiapkan dengan cinta agar hari bahagia ini juga terasa hangat bagi setiap tamu.",
  },
  {
    id: "buket",
    src: bouquet.url,
    alt: "Pengantin wanita memegang buket mawar putih dan peony merah marun",
    title: "Buket Pilihan Salsabila",
    date: "Oktober 2026",
    story: "Mawar putih untuk ketulusan, peony merah marun untuk cinta yang matang. Salsabila memilih sendiri setiap tangkainya — buket kecil yang menyimpan harapan besar.",
  },
  {
    id: "langkah",
    src: walk.url,
    alt: "Salsabila dan Lukman berjalan bergandengan tangan di taman",
    title: "Langkah Bersama",
    date: "November 2026",
    story: "Kembali ke taman tempat semuanya dimulai, kali ini dengan tangan yang saling menggenggam. Langkah kecil hari itu adalah awal dari perjalanan panjang yang akan kami tempuh berdua.",
  },
  {
    id: "akad",
    src: akad.url,
    alt: "Salsabila dan Lukman saling tersenyum di meja akad",
    title: "Menuju Hari Akad",
    date: "18 Desember 2026",
    story: "Dan inilah hari yang kami nantikan. Dengan memohon ridho Allah SWT, kami mengikat janji suci. Kehadiran dan doa restu Anda akan melengkapi kebahagiaan kami.",
  },
];
