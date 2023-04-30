import Layout from "@/components/Layout";
import { NextPageWithLayout } from "@/pages/_app";
import { Collapse } from "antd";
import Head from "next/head";
import { ReactElement } from "react";

const HelpPage: NextPageWithLayout = () => {
  const UPLOAD_VIDEO_STEPS = [
    {
      title: 'Pilih menu "Unggah Video"',
      image: "/login_image.png",
      description: (
        <ol className="ml-5 grid list-outside list-disc gap-2">
          <li>
            Untuk memulai mengunggah video, anda dapat memilih menu &quot;Unggah
            Video&quot; yang terdapat pada pojok kanan bawah laman.
          </li>
          <li>
            Selain pada pojok kanan bawah layar, menu &quot;Unggah Video&quot;
            juga dapat diakses dari menu akun anda pada pojok kanan atas.
          </li>
        </ol>
      ),
    },
    {
      title: "Unggah Video",
      image: "",
      description: (
        <ol className="ml-5 grid list-outside list-disc gap-2">
          <li>
            Pada menu yang muncul anda dapat memilih menu &quot;Pilih
            Video&quot; atau melakukan <i>drag and drop</i> video yang anda akan
            unggah
          </li>
        </ol>
      ),
    },
    {
      title: "Isi Formulir Informasi Video",
      image: "",
      description: (
        <ol className="ml-5 grid list-outside list-disc gap-2">
          <li>
            Isikan formulir informasi video sesuai dengan video yang sedang anda
            unggah. Isian terdiri atas:
            <ol className="list-outsude ml-4 list-decimal font-semibold">
              <li>Nama Program</li>
              <li>Stasiun Televisi</li>
              <li>Deskripsi (Opsional)</li>
              <li>Tanggal dan Waktu Rekaman</li>
              <li>Proses Sekarang</li>
            </ol>
          </li>
          <li>
            Anda dapat memilih opsi{" "}
            <span className="font-semibold">Proses Sekarang</span> agar video
            langsung diproses dan moderasi oleh sistem ketika berhasil
            terunggah.
          </li>
          <li>
            Jika anda tidak memilih opsi tersebut, anda dapat memproses moderasi
            video yang telah terunggah dari laman detail video.
          </li>
        </ol>
      ),
    },
    {
      title: "Verifikasi Isian Formulir",
      image: "",
      description: (
        <ol className="ml-5 grid list-outside list-disc gap-2">
          <li>
            Verifikasi isian yang sudah anda masukkan pada tahap sebelumnya.
          </li>
          <li>
            Pada tahap ini anda hanya dapat mengganti opsi{" "}
            <span className="font-semibold">Proses Sekarang</span>.
          </li>
        </ol>
      ),
    },
    {
      title: "Unggah Formulir",
      image: "",
      description: (
        <ol className="ml-5 grid list-outside list-disc gap-2">
          <li>
            Untuk mengunggah video serta formulir yang anda isi, pilih menu
            unggah.
          </li>
          <li className="font-semibold">
            Perhatian: Diharap untuk tidak menutup halaman sampai video selesai
            terunggah.
          </li>
        </ol>
      ),
    },
  ];

  const MODERATE_VIDEO_STEPS = [
    {
      title: 'Pilih menu "Unggah Video"',
      image: "/login_image.png",
      description: (
        <ol className="ml-5 grid list-outside list-disc gap-2">
          <li>
            Untuk memulai mengunggah video, anda dapat memilih menu &quot;Unggah
            Video&quot; yang terdapat pada pojok kanan bawah laman.
          </li>
          <li>
            Selain pada pojok kanan bawah layar, menu &quot;Unggah Video&quot;
            juga dapat diakses dari menu akun anda pada pojok kanan atas.
          </li>
        </ol>
      ),
    },
    {
      title: "Unggah Video",
      image: "",
      description: (
        <ol className="ml-5 grid list-outside list-disc gap-2">
          <li>
            Pada menu yang muncul anda dapat memilih menu &quot;Pilih
            Video&quot; atau melakukan <i>drag and drop</i> video yang anda akan
            unggah
          </li>
        </ol>
      ),
    },
    {
      title: "Isi Formulir Informasi Video",
      image: "",
      description: (
        <ol className="ml-5 grid list-outside list-disc gap-2">
          <li></li>
        </ol>
      ),
    },
    {
      title: "Verifikasi Isian Formulir",
      image: "",
      description: (
        <ol className="ml-5 grid list-outside list-disc gap-2">
          <li></li>
        </ol>
      ),
    },
    {
      title: "Unggah Formulir",
      image: "",
      description: (
        <ol className="ml-5 grid list-outside list-disc gap-2">
          <li></li>
        </ol>
      ),
    },
  ];

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

      <h1 className="mb-4 text-lg font-semibold md:text-xl">
        Panduan Penggunaan Sistem Rekomendasi
      </h1>
      <div className="rounded-md bg-white p-4">
        <Collapse className="custom-panel">
          <Collapse.Panel
            className="text-base"
            header={<h2>Unggah Video</h2>}
            key={1}
          >
            <section>
              <ol className="grid list-inside list-decimal gap-6 lg:grid-cols-2">
                {UPLOAD_VIDEO_STEPS.map((val, index) => {
                  return (
                    <li className="font-semibold" key={index}>
                      <p className="mb-2 inline-block">{val.title}</p>
                      <div className="gap-4">
                        <div
                          className="mb-2 bg-slate-300 bg-cover bg-no-repeat pt-[56%]"
                          style={{ backgroundImage: `url(${val.image})` }}
                        ></div>
                        <div className="text-justify font-normal">
                          {val.description}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          </Collapse.Panel>
          <Collapse.Panel
            className="text-base"
            header={<h2>Moderasi Video</h2>}
            key={2}
          >
            <section>
              <ol className="list-inside list-decimal">
                {MODERATE_VIDEO_STEPS.map((val, index) => {
                  return (
                    <li className="font-semibold" key={index}>
                      <p className="mb-2 inline-block">{val.title}</p>
                      <div className="gap-4">
                        <div
                          className="mb-2 bg-slate-300 bg-cover bg-no-repeat pt-[56%]"
                          style={{ backgroundImage: `url(${val.image})` }}
                        ></div>
                        <div className="text-justify font-normal">
                          {val.description}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          </Collapse.Panel>
        </Collapse>
      </div>
    </div>
  );
};

export default HelpPage;

HelpPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
