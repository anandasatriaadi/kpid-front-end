import Layout from "@/components/Layout";
import { NextPageWithLayout } from "@/pages/_app";
import { Collapse } from "antd";
import Head from "next/head";
import * as React from "react";
import Lightbox, { SlideImage } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const HelpPage: NextPageWithLayout = () => {
  //#region ::: Variable Initialisations
  const [lightboxOpen, setLightboxOpen] = React.useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = React.useState<number>(0);

  const UPLOAD_VIDEO_STEPS = [
    {
      title: 'Pilih menu "Unggah Video"',
      image: "/help_upload_1.png",
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
      image: "/help_upload_2.png",
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
      image: "/help_upload_3.png",
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
      image: "/help_upload_4.png",
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
      image: "/help_upload_5.png",
      description: (
        <ol className="ml-5 grid list-outside list-disc gap-2">
          <li>
            Untuk mengunggah video serta formulir yang anda isi, pilih menu
            unggah.
          </li>
          <li>
            Setelah berhasil terunggah, akan muncul pesan berupa ID dari
            moderasi yang sedang dilakukan.
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

  const UPLOAD_VIDEO_IMAGES = UPLOAD_VIDEO_STEPS.map((step) => {
    let image: SlideImage = { src: step.image };
    return image;
  });
  //#endregion ::: Variable Initialisations

  //#region ::: Handlers

  //#endregion ::: Handlers

  //#region ::: Other Methods

  //#endregion ::: Other Methods

  //#region ::: UseEffect

  //#endregion ::: UseEffect

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
      <div className="rounded-lg bg-white p-4 shadow-custom">
        <h2 className="mb-2 text-base font-semibold md:text-lg">
          Bagaimana Mengunggah Video ke Sistem Rekomendasi?
        </h2>
        <Collapse className="custom-panel">
          <Collapse.Panel
            className="text-base"
            header={<h2>Unggah Video</h2>}
            key={1}
          >
            <section>
              <ol className="grid list-inside list-decimal gap-6 lg:grid-cols-2">
                <Lightbox
                  open={lightboxOpen}
                  index={lightboxIndex}
                  close={() => setLightboxOpen(false)}
                  slides={UPLOAD_VIDEO_IMAGES}
                />
                {UPLOAD_VIDEO_STEPS.map((val, index) => {
                  return (
                    <li className="font-semibold" key={index}>
                      <p className="mb-2 inline-block">{val.title}</p>
                      <div className="gap-4">
                        <div
                          className="mb-2 bg-slate-300 bg-cover bg-no-repeat pt-[56%] hover:cursor-pointer"
                          style={{ backgroundImage: `url(${val.image})` }}
                          onClick={() => {
                            setLightboxIndex(index);
                            setLightboxOpen(true);
                          }}
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
      <div className="mt-4 rounded-lg bg-white p-4 shadow-custom">
        <h2 className="mb-2 text-base font-semibold md:text-lg">
          Bagaimana Melakukan Moderasi terhadap Video yang Sudah Diunggah?
        </h2>
        <Collapse className="custom-panel">
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

HelpPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
