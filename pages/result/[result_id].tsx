import httpRequest from "@/common/HttpRequest";
import Layout from "@/components/Layout";
import ViolationIconCard from "@/components/result/ViolationIconCard";
import { NextPageWithLayout } from "@/pages/_app";
import FrameResult from "@/types/FrameResult";
import ModerationDecision from "@/types/ModerationDecision";
import ModerationResponse from "@/types/ModerationResponse";
import ModerationResult from "@/types/ModerationResult";
import { isNil, isNilOrEmpty } from "@/utils/CommonUtil";
import {
  faClock,
  faFileDownload,
  faGaugeHigh,
  faPenToSquare,
  faStopwatch,
  faTelevision,
  faXmarkCircle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Collapse, message, Skeleton, Tabs } from "antd";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { Tab } from "rc-tabs/lib/interface";
import { ReactElement, useEffect, useState } from "react";

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

const SingleResult: NextPageWithLayout = () => {
  const [categorySummary, setCategorySummary] = useState<any | undefined>(
    undefined
  );
  const [isModerated, setIsModerated] = useState<boolean>(true);
  const [moderationData, setModerationData] = useState<ModerationResponse>();
  const [framesToShow, setFramesToShow] = useState<FrameResult[]>([]);

  const router = useRouter();
  const pathname = router.asPath;
  const moderationID = pathname.split("/").slice(-1)[0];
  const fetchURL = `/moderation/${moderationID}`;

  const checkIfAllModerated = () => {
    let isAllModerated = true;
    if (moderationData?.result !== undefined) {
      moderationData.result.forEach((timeline: ModerationResult) => {
        if (timeline.decision.toString() === "PENDING") {
          isAllModerated = false;
        }
      });
    }
    setIsModerated(isAllModerated);
  };

  const handlePasalValidation = (
    timelineKey: number,
    decision: ModerationDecision
  ) => {
    const data = new FormData();
    data.set("id", moderationID);
    data.set("index", timelineKey.toString());
    data.set("decision", decision.toUpperCase());
    httpRequest
      .put(`/moderation/validate`, data)
      .then((_) => {})
      .catch((err) => {
        console.error(err);
      });
    if (moderationData === undefined) return;
    let temp: ModerationResponse = moderationData;

    if (temp?.result === undefined) return;
    temp.result[timelineKey].decision = decision;
    setModerationData(temp);
    checkIfAllModerated();
  };

  const handleStartModeration = () => {
    const data = new FormData();
    data.set("id", moderationID);
    httpRequest
      .put(`/moderation/start`, data)
      .then((_) => {})
      .catch((err) => {
        console.error(err);
      });
    message.success("Video sedang diproses");
    router.push(`/result`);
  };

  const handleGenerateLaporan = () => {
    httpRequest
      .get(`/moderation/report/${moderationID}`, { responseType: "blob" })
      .then((response) => {
        if (moderationData === undefined) return;
        const type = response.headers["content-type"];
        const blob = new Blob([response.data], { type: type });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `Laporan_${moderationData.station_name}_${moderationData.created_at}.pdf`;
        link.click();
      });
    message.success("Laporan berhasil di-generate");
  };

  useEffect(() => {
    (async () => {
      const response = await httpRequest.get(fetchURL).catch((err) => {
        console.error(err);
        return null;
      });

      if (response === null) return;

      const result: ModerationResponse = response.data.data;
      setModerationData(result);

      let temp: any[] = [];
      if (result?.result !== undefined) {
        result.result.forEach((item: ModerationResult) => {
          if (item.decision.toUpperCase() === "PENDING") {
            setIsModerated(false);
          }
          temp = [...temp, ...item.category];
        });
      }

      const summary = temp.reduce((res, val) => {
        let key = String(val).toLowerCase();
        if (res[key]) {
          res[key]++;
        } else {
          res[key] = 1;
        }
        return res;
      }, {});

      setCategorySummary(summary);

      let tempFrames: FrameResult[] = [];
      if (result?.frames !== undefined && result?.frames !== null) {
        if (result.frames.length > 20) {
          tempFrames = result.frames.reduce(
            (acc: FrameResult[], curr, index) => {
              let step =
                moderationData?.frames !== undefined
                  ? Math.floor(moderationData.frames.length / 20)
                  : 0;
              if (acc.length === 20) {
                return acc;
              }
              if (index % step === 0) {
                acc.push(curr);
              }
              return acc;
            },
            []
          );
        } else {
          tempFrames = result.frames;
        }
      }
      setFramesToShow(tempFrames);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const RenderViolationTabs = (result: any) => {
    let responses = result.category.map((item: any, index: any) => {
      let idx: string = index.toString();
      const className =
        "flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-black " +
        (item.count > 1 ? "bg-red-500" : item.count > 0 && "bg-amber-400");
      let response: Tab = {
        key: idx,
        label: <span className="flex items-center">{item}</span>,
        children: timelineItem[0].violations.map((violation, vIndex) => {
          return (
            <Collapse ghost key={vIndex}>
              <Collapse.Panel
                header={vIndex + 1 + ". " + violation.pasal}
                key="1"
              >
                <p
                  dangerouslySetInnerHTML={{
                    __html: violation.deskripsi,
                  }}
                ></p>
              </Collapse.Panel>
            </Collapse>
          );
        }),
      };
      return response;
    });
    return responses;
  };

  const getStatusStyling = (status: string) => {
    switch (status.toLowerCase()) {
      case "uploaded":
        return {
          className: "bg-amber-400",
          text: "Belum Diproses",
        };
      case "on_process":
        return {
          className: "bg-cyan-500",
          text: "Sedang Diproses",
        };
      case "approved":
        return {
          className: "bg-green-500",
          text: "Tidak Ditemukan Pelanggaran",
        };
      case "rejected":
        return {
          className: "bg-red-600 text-white",
          text: "Ditemukan Pelanggaran",
        };
      default:
        return {
          className: "bg-amber-400",
          text: "Belum Diproses",
        };
    }
  };

  return (
    <div>
      <Head>
        <title>Hasil Moderasi | KPID Jawa Timur</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mb-2 flex items-center gap-4">
        <h1 className="text-lg font-semibold md:text-xl">Detail Video</h1>
        <div
          className={
            "rounded-lg px-4 py-2 font-semibold tracking-wide " +
            (moderationData?.status &&
              getStatusStyling(moderationData?.status).className)
          }
        >
          {moderationData?.status &&
            getStatusStyling(moderationData?.status).text}
        </div>
      </div>
      <div className="relative">
        {!isNilOrEmpty(moderationData) ? (
          <>
            <section className="grid grid-cols-4 gap-x-4 ">
              {/* Video Informations --- Hidden on Mobile */}
              <div className="hidden flex-col gap-2 rounded-md bg-white p-4 shadow-custom lg:flex">
                <p className="text-base font-semibold md:text-lg">
                  Informasi Rekaman
                </p>
                <div className="flex items-center gap-4">
                  <span className="flex min-w-[2.825rem] justify-center rounded-lg bg-slate-200 p-2 text-slate-600">
                    <FontAwesomeIcon icon={faClock} height="24px" />
                  </span>
                  <span>
                    <p className="text-sm">Jam Mulai</p>
                    <p className="font-semibold">
                      {moderationData?.start_time}
                    </p>
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex min-w-[2.825rem] justify-center rounded-lg bg-slate-200 p-2 text-slate-600">
                    <FontAwesomeIcon icon={faClock} height="24px" />
                  </span>
                  <span>
                    <p className="text-sm">Jam Selesai</p>
                    <p className="font-semibold">{moderationData?.end_time}</p>
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex min-w-[2.825rem] justify-center rounded-lg bg-slate-200 p-2 text-slate-600">
                    <FontAwesomeIcon icon={faStopwatch} height="24px" />
                  </span>
                  <span>
                    <p className="text-sm">Durasi</p>
                    <p className="font-semibold">
                      {moderationData?.duration} detik
                    </p>
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex min-w-[2.825rem] justify-center rounded-lg bg-slate-200 p-2 text-slate-600">
                    <FontAwesomeIcon icon={faGaugeHigh} height="24px" />
                  </span>
                  <span>
                    <p className="text-sm">FPS</p>
                    <p className="font-semibold">{moderationData?.fps}</p>
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex min-w-[2.825rem] justify-center rounded-lg bg-slate-200 p-2 text-slate-600">
                    <FontAwesomeIcon icon={faXmarkCircle} height="24px" />
                  </span>
                  <span>
                    <p className="text-sm">Konten Terdeteksi</p>
                    <p className="font-semibold">
                      {moderationData?.result?.length}
                    </p>
                  </span>
                </div>
              </div>
              <div className="col-span-4 flex flex-col rounded-md bg-white p-4 shadow-custom lg:col-span-3">
                <h2 className="text-base font-semibold md:text-lg">
                  {moderationData?.filename}
                </h2>
                {!isNil(categorySummary) && (
                  <div className="relative mt-4">
                    <ViolationIconCard
                      height={32}
                      sara={
                        isNil(categorySummary.sara) ? 0 : categorySummary.sara
                      }
                      saru={
                        isNil(categorySummary.saru) ? 0 : categorySummary.saru
                      }
                      sadis={
                        isNil(categorySummary.sadis) ? 0 : categorySummary.sadis
                      }
                      sihir={
                        isNil(categorySummary.sihir) ? 0 : categorySummary.sihir
                      }
                      siaran={
                        isNil(categorySummary.siaran_ilegal)
                          ? 0
                          : categorySummary.siaran_ilegal
                      }
                      cardStyle
                    />
                  </div>
                )}
                <div className="mt-4 flex-1">
                  <p className="font-semibold">Deskripsi</p>
                  <p className="">{moderationData?.description}</p>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-y-2 md:grid-cols-2 xl:grid-cols-3">
                  <div className="flex gap-2">
                    <span className="flex min-w-[2.825rem] items-center justify-center rounded-lg bg-slate-200 p-2 text-slate-600 ">
                      <FontAwesomeIcon icon={faTelevision} height="24px" />
                    </span>
                    <span className="flex flex-col justify-center">
                      <p className="text-sm">Stasiun</p>
                      <p className="font-semibold">
                        {moderationData?.station_name}
                      </p>
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="flex min-w-[2.825rem] items-center justify-center rounded-lg bg-slate-200 p-2 text-slate-600 ">
                      <FontAwesomeIcon icon={faPenToSquare} height="24px" />
                    </span>
                    <span>
                      <p className="text-sm">Program</p>
                      <p className="font-semibold">
                        {moderationData?.program_name}
                      </p>
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="flex min-w-[2.825rem] items-center justify-center rounded-lg bg-slate-200 p-2 text-slate-600 ">
                      <FontAwesomeIcon icon={faClock} height="24px" />
                    </span>
                    <span>
                      <p className="text-sm">Tanggal Rekaman</p>
                      <p className="font-semibold">
                        {moment(moderationData?.recording_date).format(
                          "d MMMM YYYY"
                        )}
                      </p>
                    </span>
                  </div>
                  {/* Video Informations --- Hidden on desktop */}
                  <div className="flex gap-2 lg:hidden">
                    <span className="flex min-w-[2.825rem] justify-center rounded-lg bg-slate-200 p-2 text-slate-600">
                      <FontAwesomeIcon icon={faClock} height="24px" />
                    </span>
                    <span>
                      <p className="text-sm">Jam Mulai</p>
                      <p className="font-semibold">
                        {moderationData?.start_time}
                      </p>
                    </span>
                  </div>
                  <div className="flex gap-2 lg:hidden">
                    <span className="flex min-w-[2.825rem] justify-center rounded-lg bg-slate-200 p-2 text-slate-600">
                      <FontAwesomeIcon icon={faClock} height="24px" />
                    </span>
                    <span>
                      <p className="text-sm">Jam Selesai</p>
                      <p className="font-semibold">
                        {moderationData?.end_time}
                      </p>
                    </span>
                  </div>
                  <div className="flex gap-2 lg:hidden">
                    <span className="flex min-w-[2.825rem] justify-center rounded-lg bg-slate-200 p-2 text-slate-600">
                      <FontAwesomeIcon icon={faStopwatch} height="24px" />
                    </span>
                    <span>
                      <p className="text-sm">Durasi</p>
                      <p className="font-semibold">
                        {moderationData?.duration} detik
                      </p>
                    </span>
                  </div>
                  <div className="flex gap-2 lg:hidden">
                    <span className="flex min-w-[2.825rem] justify-center rounded-lg bg-slate-200 p-2 text-slate-600">
                      <FontAwesomeIcon icon={faGaugeHigh} height="24px" />
                    </span>
                    <span>
                      <p className="text-sm">FPS</p>
                      <p className="font-semibold">{moderationData?.fps}</p>
                    </span>
                  </div>
                  <div className="flex gap-2 lg:hidden">
                    <span className="flex min-w-[2.825rem] justify-center rounded-lg bg-slate-200 p-2 text-slate-600">
                      <FontAwesomeIcon icon={faXmarkCircle} height="24px" />
                    </span>
                    <span>
                      <p className="text-sm">Konten Terdeteksi</p>
                      <p className="font-semibold">
                        {moderationData?.result?.length}
                      </p>
                    </span>
                  </div>
                </div>
              </div>
            </section>
            <section className="mt-8 rounded-md bg-white shadow-custom">
              <Collapse defaultActiveKey="1" ghost>
                <Collapse.Panel
                  header="Potongan Frame Video"
                  key="1"
                  className="text-base font-semibold md:text-lg"
                >
                  <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                    {framesToShow.map(
                      (frame_data: FrameResult, index: number) => {
                        return (
                          <div
                            key={index}
                            className="bg-cover pt-[56.25%]"
                            style={{
                              backgroundImage: `url(https://kpid-jatim.storage.googleapis.com/${encodeURI(
                                frame_data.frame_url
                              )})`,
                            }}
                          ></div>
                        );
                      }
                    )}
                  </div>
                  {moderationData?.frames !== undefined &&
                    moderationData?.frames.length > 20 && (
                      <p className="mt-4 text-right text-base font-normal opacity-70">
                        dan {moderationData?.frames.length - 20} potongan frame
                        lainnya.
                      </p>
                    )}
                </Collapse.Panel>
              </Collapse>
            </section>

            {moderationData?.status !== undefined &&
              moderationData?.status.includes("REJECTED") && (
                <section className="mt-8 rounded-md bg-white shadow-custom">
                  <Collapse defaultActiveKey="1" ghost activeKey={1}>
                    <Collapse.Panel
                      header="Hasil Moderasi"
                      key={1}
                      className="panel-disabled text-base font-semibold md:text-lg"
                    >
                      {moderationData?.result !== undefined &&
                        moderationData?.result.length > 0 && (
                          <Collapse className="custom-panel rounded-b-md">
                            {moderationData.result.map(
                              (item: ModerationResult, index: number) => (
                                <Collapse.Panel
                                  className="text-base"
                                  header={
                                    <div className="flex items-center justify-between">
                                      <p>Detik {item.second.toFixed(2)}</p>
                                      {item.decision?.toUpperCase() !=
                                      "PENDING" ? (
                                        item.decision?.toUpperCase() ==
                                        "VALID" ? (
                                          <div className="ml-2 border-2 border-dashed border-green-500 px-2 py-0.5 text-sm">
                                            Valid
                                          </div>
                                        ) : (
                                          <div className="ml-2 border-2 border-dashed border-red-500 px-2 py-0.5 text-sm">
                                            Invalid
                                          </div>
                                        )
                                      ) : (
                                        <div className="ml-2 border-2 border-dashed border-amber-400 px-2 py-0.5 text-sm">
                                          Belum Diverifikasi
                                        </div>
                                      )}
                                    </div>
                                  }
                                  key={index}
                                >
                                  <div className="flex flex-col lg:flex-row">
                                    <div className="lg:flex-[3]">
                                      <div className="relative bg-cover bg-center pt-[52%]">
                                        <div className="absolute top-0 right-0 bottom-0 left-0 bg-black">
                                          <video
                                            className="h-full w-full"
                                            controls
                                            controlsList="nodownload"
                                            src={`https://kpid-jatim.storage.googleapis.com/${encodeURI(
                                              item.clip_url
                                            )}`}
                                          ></video>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="mt-4 lg:ml-4 lg:mt-0 lg:mb-0 lg:flex-[3]">
                                      <div className="mb-4 flex gap-4">
                                        <h3 className="text-lg font-semibold">
                                          Dugaan Pelanggaran
                                        </h3>
                                      </div>
                                      <Tabs
                                        type="card"
                                        items={RenderViolationTabs(item)}
                                      />

                                      {item.decision.toUpperCase() ===
                                        "PENDING" && (
                                        <div className="flex justify-end">
                                          <Button
                                            type="primary"
                                            className="mr-4"
                                            onClick={(e) => {
                                              handlePasalValidation(
                                                index,
                                                ModerationDecision.VALID
                                              );
                                            }}
                                          >
                                            Valid
                                          </Button>
                                          <Button
                                            type="dashed"
                                            onClick={(e) => {
                                              handlePasalValidation(
                                                index,
                                                ModerationDecision.INVALID
                                              );
                                            }}
                                          >
                                            Invalid
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </Collapse.Panel>
                              )
                            )}
                          </Collapse>
                        )}
                    </Collapse.Panel>
                  </Collapse>
                  {/* <h2 className="px-4 pb-3 text-base font-semibold md:text-lg">
                    
                  </h2> */}
                </section>
              )}
            {moderationData?.status !== undefined &&
              (moderationData?.status.includes("UPLOADED") || isModerated) && (
                <div className="sticky bottom-0 mt-4 flex gap-2">
                  {moderationData?.status.includes("UPLOADED") && (
                    <div className="flex justify-end">
                      <Button
                        type="primary"
                        className="text-lg"
                        onClick={handleStartModeration}
                      >
                        Mulai Moderasi Video
                      </Button>
                    </div>
                  )}
                  {isModerated && (
                    <Button
                      type="primary"
                      className="mr-4 text-lg"
                      onClick={handleGenerateLaporan}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <FontAwesomeIcon height={24} icon={faFileDownload} />
                        Generate Laporan
                      </span>
                    </Button>
                  )}
                </div>
              )}
          </>
        ) : (
          <Skeleton active></Skeleton>
        )}
      </div>
    </div>
  );
};

export default SingleResult;

SingleResult.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
