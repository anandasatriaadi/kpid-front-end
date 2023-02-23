import {
  faGhost,
  faHandHoldingHeart,
  faHandsPraying,
  faMarsAndVenusBurst,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Collapse, Skeleton, Timeline, Tooltip } from "antd";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useState } from "react";
import Layout from "../../components/Layout";
import { NextPageWithLayout } from "../_app";

const timelineItem = [
  {
    second: 6,
    time: "18:25:06",
    image: "/result.png",
    decision: null,
    violations: [
      {
        pasal: "P3SPS Pasal 18 BAB XII Tahun 2012",
        deskripsi: `Program siaran yang memuat adegan seksual dilarang.<br\>
        a. menayangkan ketelanjangan dan/atau penampakan alat kelamin;<br\>
        b. menampilkan adegan yang menggambarkan aktivitas seks dan/atau
        persenggamaan;<br\>
        c. menayangkan kekerasan seksual;<br\>
        d. menampilkan suara yang menggambarkan berlangsungnya aktivitas seks
        dan/atau persenggamaan;<br\>
        e. menampilkan percakapan tentang rangkaian aktivitas seks dan/atau
        persenggamaan;<br\>
        f. menayangkan adegan dan/atau suara yang menggambarkan hubungan
        seks antarbinatang secara vulgar;<br\>
        g. menampilkan adegan ciuman bibir;<br\>
        h. mengeksploitasi dan/atau menampilkan bagian-bagian tubuh tertentu,
        seperti: paha, bokong, payudara, secara close up dan/atau medium shot;<br\>
        i. menampilkan gerakan tubuh dan/atau tarian erotis;<br\>
        j. mengesankan ketelanjangan;<br\>
        k. mengesankan ciuman bibir; dan/atau<br\>
        l. menampilkan kata-kata cabul.<br\>`,
      },
      {
        pasal: "P3SPS Pasal 24 BAB XIII Tahun 2012",
        deskripsi: `
          (1) Program siaran dilarang menampilkan ungkapan kasar dan makian, baik
          secara verbal maupun nonverbal, yang mempunyai kecenderungan
          menghina atau merendahkan martabat manusia, memiliki makna jorok/
          mesum/cabul/vulgar, dan/atau menghina agama dan Tuhan.<br\><br\>
          (2) Kata-kata kasar dan makian sebagaimana yang dimaksud pada ayat (1) di
          atas mencakup kata-kata dalam bahasa Indonesia, bahasa daerah, dan
          bahasa asing.
          `,
      },
    ],
  },
  {
    second: 1256,
    time: "18:45:56",
    image: "/result.png",
    decision: null,
    violations: [
      {
        pasal: "P3SPS Pasal 18 BAB XII Tahun 2012",
        deskripsi: `Program siaran yang memuat adegan seksual dilarang.<br\>
        a. menayangkan ketelanjangan dan/atau penampakan alat kelamin;<br\>
        b. menampilkan adegan yang menggambarkan aktivitas seks dan/atau
        persenggamaan;<br\>
        c. menayangkan kekerasan seksual;<br\>
        d. menampilkan suara yang menggambarkan berlangsungnya aktivitas seks
        dan/atau persenggamaan;<br\>
        e. menampilkan percakapan tentang rangkaian aktivitas seks dan/atau
        persenggamaan;<br\>
        f. menayangkan adegan dan/atau suara yang menggambarkan hubungan
        seks antarbinatang secara vulgar;<br\>
        g. menampilkan adegan ciuman bibir;<br\>
        h. mengeksploitasi dan/atau menampilkan bagian-bagian tubuh tertentu,
        seperti: paha, bokong, payudara, secara close up dan/atau medium shot;<br\>
        i. menampilkan gerakan tubuh dan/atau tarian erotis;<br\>
        j. mengesankan ketelanjangan;<br\>
        k. mengesankan ciuman bibir; dan/atau<br\>
        l. menampilkan kata-kata cabul.<br\>`,
      },
      {
        pasal: "P3SPS Pasal 24 BAB XIII Tahun 2012",
        deskripsi: `
          (1) Program siaran dilarang menampilkan ungkapan kasar dan makian, baik
          secara verbal maupun nonverbal, yang mempunyai kecenderungan
          menghina atau merendahkan martabat manusia, memiliki makna jorok/
          mesum/cabul/vulgar, dan/atau menghina agama dan Tuhan.<br\><br\>
          (2) Kata-kata kasar dan makian sebagaimana yang dimaksud pada ayat (1) di
          atas mencakup kata-kata dalam bahasa Indonesia, bahasa daerah, dan
          bahasa asing.
          `,
      },
    ],
  },
];

interface detectedViolations {
  second: number;
  time: string;
  image: string;
  decision?: boolean | null | undefined;
  violations: {
    pasal: string;
    deskripsi: string;
  }[];
}

const SingleResult: NextPageWithLayout = () => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [timelines, setTimelines] = useState<any>(timelineItem);
  const [isModerated, setIsModerated] = useState<boolean>(false);

  const router = useRouter();

  const onChange = (key: string | string[]) => {
    if (!loaded) {
      setTimeout(() => {
        setLoaded(true);
      }, 100);
    }
    console.log(key);
  };

  const checkIfAllModerated = () => {
    let isAllModerated = true;
    timelines.forEach((timeline: detectedViolations) => {
      if (timeline.decision === null) {
        isAllModerated = false;
      }
    });
    setIsModerated(isAllModerated);
  };

  const onValidatePasal = (timelineKey: number) => {
    timelines[timelineKey].decision = true;
    setTimelines([...timelines]);
    checkIfAllModerated();
  };

  const onInvalidatePasal = (timelineKey: number) => {
    timelines[timelineKey].decision = false;
    setTimelines([...timelines]);
    checkIfAllModerated();
  };

  const pathName = router.asPath;
  console.log(pathName);
  const status = pathName?.includes("rejected") ? "rejected" : "uploaded";
  const getStatusStyling = (() => {
    switch (status) {
      case "uploaded":
        return {
          className: "bg-amber-400",
          text: "Belum Diproses",
        };
      case "on_process":
        return {
          className: "bg-cyan-300",
          text: "Sedang Diproses",
        };
      case "approved":
        return {
          className: "bg-green-300",
          text: "Tidak Ditemukan Pelanggaran",
        };
      case "rejected":
        return {
          className: "bg-red-300",
          text: "Ditemukan Pelanggaran",
        };
      default:
        return {
          className: "bg-amber-300",
          text: "Belum Diproses",
        };
    }
  })();

  return (
    <div>
      <Head>
        <title>Hasil Moderasi | KPID Jawa Timur</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto">
        <div>
          <h1 className="text-2xl font-semibold">Detail Moderasi Video</h1>
          <section>
            <div className="mt-8 flex items-center gap-6">
              <h2 className="text-lg font-semibold">
                BBS TV_1825_Acara TV.mp4
              </h2>
              <div
                className={"px-4 py-2 rounded-lg " + getStatusStyling.className}
              >
                {getStatusStyling.text}
              </div>
            </div>
            <div className="flex justify-between text-lg">
              <div className="flex mt-2 text-center">
                <div className="flex flex-col items-center pl-0 pr-2 border-r-2 border-gray-100 last:border-0">
                  <p className="text-base text-gray-500">Jam Mulai</p>
                  <p className="font-semibold">18:25:00</p>
                </div>
                <div className="flex flex-col items-center pl-2 pr-2 border-r-2 border-gray-100 last:border-0">
                  <p className="text-base text-gray-500">Jam Selesai</p>
                  <p className="font-semibold">19:25:</p>
                </div>
                <div className="flex flex-col items-center pl-2 pr-2 border-r-2 border-gray-100 last:border-0">
                  <p className="text-base text-gray-500">Durasi</p>
                  <p className="font-semibold">3600 detik</p>
                </div>
                <div className="flex flex-col items-center pl-2 pr-2 border-r-2 border-gray-100 last:border-0">
                  <p className="text-base text-gray-500">FPS</p>
                  <p className="font-semibold">30</p>
                </div>
                <div className="flex flex-col items-center pl-2 pr-0 border-r-2 border-gray-100 last:border-0">
                  <p className="text-base text-gray-500">Konten Terdeteksi</p>
                  <p className="font-semibold">2</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Tooltip className="flex flex-col justify-center" title="SARA">
                  <FontAwesomeIcon
                    icon={faHandsPraying}
                    height="32px"
                    className="text-gray-900 text-2xl"
                  />
                  <p className="text-center font-bold">0</p>
                </Tooltip>
                <Tooltip className="flex flex-col justify-center" title="SARU">
                  <FontAwesomeIcon
                    icon={faMarsAndVenusBurst}
                    height="32px"
                    className="text-gray-900 text-2xl"
                  />
                  <p className="text-center font-bold">1</p>
                </Tooltip>
                <Tooltip className="flex flex-col justify-center" title="SADIS">
                  <FontAwesomeIcon
                    icon={faHandHoldingHeart}
                    height="32px"
                    className="text-gray-900 text-2xl"
                  />
                  <p className="text-center font-bold">1</p>
                </Tooltip>
                <Tooltip className="flex flex-col justify-center" title="SIHIR">
                  <FontAwesomeIcon
                    icon={faGhost}
                    height="32px"
                    className="text-gray-900 text-2xl"
                  />
                  <p className="text-center font-bold">0</p>
                </Tooltip>
                <Tooltip
                  className="flex flex-col justify-center"
                  title="Siaran Partisan & Ilegal"
                >
                  <FontAwesomeIcon
                    icon={faPeopleGroup}
                    height="32px"
                    className="text-gray-900 text-2xl"
                  />
                  <p className="text-center font-bold">0</p>
                </Tooltip>
              </div>
            </div>
          </section>
          <section className="mt-8">
            <Collapse defaultActiveKey="1" ghost>
              <Collapse.Panel
                header="Potongan Frame dari Video"
                key="1"
                className="text-lg"
              >
                <div className="grid grid-cols-4 gap-2">
                  {new Array(16).fill(1).map((_, i) => {
                    return (
                      <div key={i} className="pt-[56.25%] bg-slate-300"></div>
                    );
                  })}
                </div>
                <p className="text-right opacity-70 mt-4">
                  dan 704 potongan frame lainnya.
                </p>
              </Collapse.Panel>
            </Collapse>
          </section>

          {pathName.includes("rejected") ? (
            <section className="mt-8">
              <Collapse onChange={onChange} ghost>
                <Collapse.Panel
                  header="Hasil Moderasi"
                  key="1"
                  className="text-lg"
                >
                  {loaded ? (
                    <Timeline>
                      {timelines.map(
                        (item: detectedViolations, index: number) => (
                          <Timeline.Item key={index}>
                            <p className="text-base">
                              Detik {item.second} | {item.time}
                            </p>
                            <div className="flex flex-col sm:flex-row mt-2 mb-2">
                              <div className="sm:flex-1">
                                <div
                                  className="pt-[52%] relative bg-center bg-cover"
                                  style={{
                                    backgroundImage: `url(${item.image})`,
                                  }}
                                >
                                  <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                                </div>
                              </div>
                              <div className="sm:flex-1 lg:flex-[2] sm:ml-4 mt-2 sm:mt-0 mb-4 sm:mb-0">
                                <div className="flex gap-4">
                                  <h3 className="text-xl font-semibold">
                                    Dugaan Pelanggaran
                                  </h3>
                                  {item.decision != null &&
                                    (item.decision ? (
                                      <Button
                                        type="dashed"
                                        className="button-green ml-2"
                                      >
                                        Valid
                                      </Button>
                                    ) : (
                                      <Button
                                        className="ml-2"
                                        type="dashed"
                                        danger
                                      >
                                        Invalid
                                      </Button>
                                    ))}
                                </div>
                                <ol className="list-decimal list-inside">
                                  {item.violations.map((violation, vIndex) => {
                                    return (
                                      <li
                                        className="text-lg items-center mt-2"
                                        key={vIndex}
                                      >
                                        {violation.pasal}
                                        {/* <div>
                                        <p
                                          className="font-normal"
                                          dangerouslySetInnerHTML={{
                                            __html: violation.deskripsi,
                                          }}
                                        ></p>
                                      </div> */}
                                      </li>
                                    );
                                  })}
                                </ol>
                                {item.decision === null ? (
                                  <div className="flex justify-end">
                                    <Button
                                      type="primary"
                                      className="button-green mr-4"
                                      onClick={(e) => {
                                        onValidatePasal(index);
                                      }}
                                    >
                                      Valid
                                    </Button>
                                    <Button
                                      type="primary"
                                      danger
                                      onClick={(e) => {
                                        onInvalidatePasal(index);
                                      }}
                                    >
                                      Invalid
                                    </Button>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </Timeline.Item>
                        )
                      )}
                      {isModerated ? (
                        <div className="flex justify-end mt-2">
                          <Button
                            type="primary"
                            className="button-green mr-4"
                            href="/tv9_result.pdf"
                            target="_blank"
                          >
                            Generate Laporan
                          </Button>
                        </div>
                      ) : (
                        ""
                      )}
                    </Timeline>
                  ) : (
                    <Skeleton active />
                  )}
                </Collapse.Panel>
              </Collapse>
            </section>
          ) : (
            <div className="flex justify-end">
              <Button type="primary" className="text-lg">
                <Link href="/result" passHref={false}>
                  Mulai Moderasi Video
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleResult;

SingleResult.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
