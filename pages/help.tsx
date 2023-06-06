import HelpCollapse from "@/components/HelpCollapse";
import Layout from "@/components/Layout";
import { NextPageWithLayout } from "@/pages/_app";
import Head from "next/head";
import * as React from "react";
import "yet-another-react-lightbox/styles.css";

const HelpPage: NextPageWithLayout = () => {
  //#region ::: Variable Initialisations
  const UPLOAD_VIDEO_STEPS = [
    {
      title: 'Pilih Menu "Unggah Video"',
      image: "/help_upload_1.png",
      description: [
        <>
          Untuk mulai mengunggah video, anda dapat memilih menu <span className="font-semibold">Unggah
          Video</span> yang terdapat pada pojok kanan bawah laman.
        </>,
        <>
          Selain pada pojok kanan bawah layar, menu <span className="font-semibold">Unggah Video</span>
          juga dapat diakses dari menu akun anda pada pojok kanan atas.
        </>,
      ],
    },
    {
      title: "Unggah Video",
      image: "/help_upload_2.png",
      description: [
        <>
          Pada menu yang muncul anda dapat memilih menu <span className="font-semibold">Pilih Video</span>{" "}
          atau melakukan <i>drag and drop</i> video yang anda akan unggah
        </>,
      ],
    },
    {
      title: "Isi Formulir Informasi Video",
      image: "/help_upload_3.png",
      description: [
        <>
          Isikan formulir informasi video sesuai dengan video yang sedang anda
          unggah. Isian terdiri atas:
          <ol className="ml-4 list-outside list-decimal font-semibold">
            <li>Nama Program</li>
            <li>Stasiun Televisi</li>
            <li>Deskripsi (Opsional)</li>
            <li>Tanggal dan Waktu Rekaman</li>
            <li>Proses Sekarang</li>
          </ol>
        </>,
        <>
          Anda dapat memilih opsi{" "}
          <span className="font-semibold">Proses Sekarang</span> agar video
          langsung diproses dan moderasi oleh sistem ketika berhasil terunggah.
        </>,
        <>
          Jika anda tidak memilih opsi tersebut, anda dapat memproses moderasi
          video yang telah terunggah dari laman detail video.
        </>,
      ],
    },
    {
      title: "Verifikasi Isian Formulir",
      image: "/help_upload_4.png",
      description: [
        <>Verifikasi isian yang sudah anda masukkan pada tahap sebelumnya.</>,
        <>
          Pada tahap ini anda hanya dapat mengganti opsi{" "}
          <span className="font-semibold">Proses Sekarang</span>
        </>,
      ],
    },
    {
      title: "Unggah Formulir",
      image: "/help_upload_5.png",
      description: [
        <>
          Untuk mengunggah video serta formulir yang anda isi, pilih menu
          unggah.
        </>,

        <>
          Setelah berhasil terunggah, akan muncul pesan berupa ID dari moderasi
          yang sedang dilakukan.
        </>,

        <>
          <span className="font-semibold">
            Perhatian: Diharap untuk tidak menutup halaman sampai video selesai
            terunggah.
          </span>
        </>,
      ],
    },
  ];

  const VALIDATE_VIDEO_STEPS = [
    {
      title: 'Pilih Menu "Daftar Video"',
      image: "/help_validate_1.png",
      description: [
        <>
          Pilih menu <span className="font-semibold">Daftar Video</span> yang terdapat pada daftar menu di
          bagian kiri antarmuka sistem.
        </>,
        <>
          Selain daftar menu, daftar video juga dapat diakses dari menu{" "}
          <span className="font-semibold">Profil</span> pada pojok kanan atas.
        </>,
      ],
    },
    {
      title: "Pilih Salah Satu Hasil Moderasi",
      image: "/help_validate_2.png",
      description: [
        <>
          Pada daftar video, Anda dapat memilih salah satu video dengan status
          <span className="font-semibold">Ditemukan Pelanggaran</span>.
        </>,
      ],
    },
    {
      title: "Navigasi Menuju Bagian Hasil Moderasi",
      image: "/help_validate_3.png",
      description: [
        <>
          Pada halaman detail hasil moderasi, anda harus melakukan navigasi ke
          bawah halaman hingga mencapai bagian hasil moderasi.
        </>,
        <>
          Selanjutnya, anda dapat memilih dugaan pelanggaran untuk mengekspansi
          dugaan pelanggaran tersebut.
        </>,
        <>
          Pada setiap dugaan pelanggaran, terdapat bagian video dan kategori
          yang dilanggar.
        </>,
        <>
          Anda dapat melakukan validasi berupa{" "}
          <span className="font-semibold">Valid</span> atau
          <span className="font-semibold">Tidak Valid</span> terhadap dugaan
          pelanggaran tersebut.
        </>,
      ],
    },
    {
      title: "Hasil Moderasi Tervalidasi",
      image: "/help_validate_4.png",
      description: [
        <>
          Apabila semua dugaan pelanggaran sudah tervalidasi, maka status dari
          hasil moderasi akan menjadi{" "}
          <span className="font-semibold">Tervalidasi</span>
        </>,

        <>
          Anda dapat mengunduh laporan pelanggaran dengan menekan tombol{" "}
          <span className="font-semibold">Buat Laporan</span> pada pojok kiri
          bawah antarmuka.
        </>,
      ],
    },
  ];
  //#endregion ::: Variable Initialisations

  return (
    <div>
      <Head>
        <title>Panduan | KPID Jawa Timur</title>
        <meta
          name="description"
          content="Panduan penggunaan sistem rekomendasi KPID Jawa Timur"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="mb-4 text-xl font-semibold md:text-2xl">
        Panduan Penggunaan Sistem Rekomendasi
      </h1>
      <div className="mb-4 overflow-clip rounded-lg bg-white transition-all md:p-4 md:shadow-custom">
        <HelpCollapse
          title="Bagaimana Mengunggah Video ke Sistem Rekomendasi?"
          steps={UPLOAD_VIDEO_STEPS}
        ></HelpCollapse>
      </div>
      <div className="overflow-clip rounded-lg bg-white transition-all md:p-4 md:shadow-custom">
        <HelpCollapse
          title="Bagaimana Memvalidasi Hasil Moderasi Video?"
          steps={VALIDATE_VIDEO_STEPS}
        ></HelpCollapse>
      </div>
    </div>
  );
};

export default HelpPage;

HelpPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
