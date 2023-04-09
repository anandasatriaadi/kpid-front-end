import {
  faClock,
  faFileDownload,
  faGaugeHigh,
  faPenToSquare,
  faStopwatch,
  faTelevision,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Collapse, message, Skeleton, Tabs } from "antd";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { Tab } from "rc-tabs/lib/interface";
import { ReactElement, useEffect, useState } from "react";
import httpRequest from "../../common/HttpRequest";
import Layout from "../../components/Layout";
import ViolationIconCard from "../../components/result/ViolationIconCard";
import { isNil, isNilOrEmpty } from "../../utils/CommonUtil";
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
  clip_url: string;
  decision?: "valid" | "invalid" | "pending";
  category: string[];
}

const SingleResult: NextPageWithLayout = () => {
  const [categorySummary, setCategorySummary] = useState<any | undefined>(
    undefined
  );
  const [isModerated, setIsModerated] = useState<boolean>(false);
  const [moderationData, setModerationData] = useState<any>(undefined);

  const router = useRouter();
  const pathname = router.asPath;
  const moderationID = pathname.split("/").slice(-1)[0];
  const fetchURL = `/moderation/${moderationID}`;

  const checkIfAllModerated = () => {
    let isAllModerated = true;
    moderationData.result.forEach((timeline: detectedViolations) => {
      if (timeline.decision === "pending") {
        isAllModerated = false;
      }
    });
    setIsModerated(isAllModerated);
  };

  const onValidatePasal = (timelineKey: number) => {
    let temp = { ...moderationData };
    temp.result[timelineKey].decision = "valid";
    setModerationData(temp);
    checkIfAllModerated();
  };

  const onInvalidatePasal = (timelineKey: number) => {
    let temp = { ...moderationData };
    temp.result[timelineKey].decision = "invalid";
    setModerationData(temp);
    checkIfAllModerated();
  };

  const handleStartModeration = () => {
    const data = new FormData();
    data.set("id", moderationID);
    httpRequest.put(`/moderation/start`, data).then((response) => {});
    message.success("Video sedang diproses");
    router.push(`/result`);
  };

  const handleGenerateLaporan = () => {
    httpRequest
      .get(`/moderation/report/${moderationID}`, { responseType: "blob" })
      .then((response) => {
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
    httpRequest.get(fetchURL).then((response) => {
      const result = response.data;
      setModerationData(result.data);

      let temp: any[] = [];
      if (!isNilOrEmpty(result?.data?.result)) {
        result.data.result.forEach((item: any) => {
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
    });

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

      <div className="relative">
        {!isNilOrEmpty(moderationData) ? (
          <>
            <section className="px-4">
              <div className="grid grid-cols-4 gap-x-4 ">
                {/* Video Informations --- Hidden on Mobile */}
                <div className="hidden flex-col gap-2 rounded-md bg-white p-4 shadow-lg shadow-slate-200 lg:flex">
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
                      <p className="font-semibold">
                        {moderationData?.end_time}
                      </p>
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
                <div className="col-span-4 flex flex-col rounded-md bg-white p-4 shadow-lg shadow-slate-200 lg:col-span-3">
                  <div
                    className={
                      "mb-4 rounded-lg px-4 py-2 font-semibold tracking-wide md:hidden " +
                      (!isNilOrEmpty(moderationData?.status) &&
                        getStatusStyling(moderationData?.status).className)
                    }
                  >
                    {!isNilOrEmpty(moderationData?.status) &&
                      getStatusStyling(moderationData?.status).text}
                  </div>
                  <div className="flex justify-between">
                    <h2 className="text-base font-semibold md:text-lg">
                      {moderationData?.filename}
                    </h2>
                    <div
                      className={
                        "hidden rounded-lg px-4 py-2 font-semibold tracking-wide md:inline-block " +
                        (!isNilOrEmpty(moderationData?.status) &&
                          getStatusStyling(moderationData?.status).className)
                      }
                    >
                      {!isNilOrEmpty(moderationData?.status) &&
                        getStatusStyling(moderationData?.status).text}
                    </div>
                  </div>
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
                          isNil(categorySummary.sadis)
                            ? 0
                            : categorySummary.sadis
                        }
                        sihir={
                          isNil(categorySummary.sihir)
                            ? 0
                            : categorySummary.sihir
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
              </div>

              {/* <div className="mt-4 grid gap-y-2 gap-x-4 text-base md:grid-cols-2 md:text-lg lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                <div className="flex items-center gap-3 rounded-lg bg-white py-3 px-4 shadow-md">
                  <div className="rounded-xl bg-slate-100">
                    <FontAwesomeIcon icon={faClock} height="24px" />
                  </div>
                  <span>
                    <p className="text-sm md:text-base">Jam Mulai</p>
                    <p className="font-semibold">
                      {moderationData?.start_time}
                    </p>
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-white py-3 px-4 shadow-md">
                  <div className="rounded-xl bg-slate-100">
                    <FontAwesomeIcon icon={faClock} height="24px" />
                  </div>
                  <span>
                    <p className="text-sm md:text-base">Jam Selesai</p>
                    <p className="font-semibold">{moderationData?.end_time}</p>
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-white py-3 px-4 shadow-md">
                  <div className="rounded-xl bg-slate-100">
                    <FontAwesomeIcon icon={faStopwatch} height="24px" />
                  </div>
                  <span>
                    <p className="text-sm md:text-base">Durasi</p>
                    <p className="font-semibold">
                      {moderationData?.duration} detik
                    </p>
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-white py-3 px-4 shadow-md">
                  <div className="rounded-xl bg-slate-100">
                    <FontAwesomeIcon icon={faGaugeHigh} height="24px" />
                  </div>
                  <span>
                    <p className="text-sm md:text-base">FPS</p>
                    <p className="font-semibold">{moderationData?.fps}</p>
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-white py-3 px-4 shadow-md">
                  <div className="rounded-xl bg-slate-100">
                    <FontAwesomeIcon icon={faXmarkCircle} height="24px" />
                  </div>
                  <span>
                    <p className="text-sm md:text-base">Konten Terdeteksi</p>
                    <p className="font-semibold">
                      {moderationData?.result?.length}
                    </p>
                  </span>
                </div>
              </div> */}
            </section>
            <section className="mt-8">
              <Collapse defaultActiveKey="1" ghost>
                <Collapse.Panel
                  header="Potongan Frame Video"
                  key="1"
                  className="text-lg"
                >
                  <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                    {moderationData?.frames
                      .slice(0, 20)
                      .map((url: string, index: number) => {
                        return (
                          <div
                            key={index}
                            className="bg-cover pt-[56.25%]"
                            style={{
                              backgroundImage: `url(https://kpid-jatim.storage.googleapis.com/${encodeURI(
                                url
                              )})`,
                            }}
                          ></div>
                        );
                      })}
                  </div>
                  {moderationData?.frames.length > 20 && (
                    <p className="mt-4 text-right text-base opacity-70">
                      dan {moderationData?.frames.length - 20} potongan frame
                      lainnya.
                    </p>
                  )}
                </Collapse.Panel>
              </Collapse>
            </section>

            {moderationData?.status.includes("REJECTED") && (
              <section className="">
                <>
                  <h2 className="px-4 text-lg font-semibold">Hasil Moderasi</h2>
                  {!isNilOrEmpty(moderationData?.result) &&
                    moderationData?.result.length > 0 && (
                      <Collapse>
                        {moderationData.result.map(
                          (item: detectedViolations, index: number) => (
                            <Collapse.Panel
                              className="text-base"
                              header={
                                <div className="flex items-center justify-between">
                                  <p>Detik {item.second}</p>
                                  {item.decision != "pending" ? (
                                    item.decision == "valid" ? (
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

                                  {item.decision === "pending" ? (
                                    <div className="flex justify-end">
                                      <Button
                                        type="primary"
                                        className="mr-4"
                                        onClick={(e) => {
                                          onValidatePasal(index);
                                        }}
                                      >
                                        Valid
                                      </Button>
                                      <Button
                                        type="dashed"
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
                            </Collapse.Panel>
                          )
                        )}
                      </Collapse>
                    )}
                </>
              </section>
            )}
            {(moderationData?.status.includes("UPLOADED") || isModerated) && (
              <div className="sticky bottom-0 mt-4 flex gap-2">
                {console.log(isModerated)}
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
