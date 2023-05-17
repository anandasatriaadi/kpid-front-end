import httpRequest from "@/common/HttpRequest";
import Layout from "@/components/Layout";
import ViolationIconCard from "@/components/result/ViolationIconCard";
import { NextPageWithLayout } from "@/pages/_app";
import FrameResult from "@/types/FrameResult";
import ModerationDecision from "@/types/ModerationDecision";
import ModerationResponse from "@/types/ModerationResponse";
import ModerationResult from "@/types/ModerationResult";
import { isNil, isNilOrEmpty } from "@/utils/BooleanUtil";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
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
import * as React from "react";
import PasalResponse from "@/types/PasalResponse";
import debounce from "@/utils/Debounce";

const SingleResult: NextPageWithLayout = () => {
  //#region ::: Variable Initialisations
  // States
  const [categorySummary, setCategorySummary] = React.useState<any | undefined>(
    undefined
  );
  const [framesToShow, setFramesToShow] = React.useState<FrameResult[]>([]);
  const [isModerated, setIsModerated] = React.useState<boolean>(true);
  const [moderationData, setModerationData] =
    React.useState<ModerationResponse>();
  const [categorisedPasal, setCategorisedPasal] = React.useState<{
    [key: string]: PasalResponse[];
  }>({});

  // Refs
  const router = useRouter();
  const pathname = router.asPath;
  const moderationID = pathname.split("/").slice(-1)[0];
  const fetchURL = `/moderations/${moderationID}`;

  // Constants
  const RecordInformations = [
    {
      title: "Jam Mulai",
      value: `${moderationData?.start_time}`,
      icon: faClock,
    },
    {
      title: "Jam Selesai",
      value: `${moderationData?.end_time}`,
      icon: faClock,
    },
    {
      title: "Durasi",
      value: `${moderationData?.duration} detik`,
      icon: faStopwatch,
    },
    { title: "FPS", value: `${moderationData?.fps}`, icon: faGaugeHigh },
    {
      title: "Konten Terdeteksi",
      value: `${moderationData?.result?.length}`,
      icon: faXmarkCircle,
    },
  ];
  //#endregion ::: Variable Initialisations

  //

  //#region ::: Handlers
  const handlePasalValidation = (
    timelineKey: number,
    decision: ModerationDecision
  ) => {
    const data = new FormData();
    data.set("id", moderationID);
    data.set("index", timelineKey.toString());
    data.set("decision", decision.toUpperCase());
    httpRequest
      .put(`/moderations/${moderationID}/validate`, data)
      .then((_) => {})
      .catch((err) => {
        if (err?.response?.data !== undefined && err.response !== null) {
          message.error(err.response.data);
        }
        console.error(err);
      });
    if (moderationData === undefined) return;
    let temp: ModerationResponse = { ...moderationData };

    if (temp?.result === undefined) return;
    temp.result[timelineKey].decision = decision;
    setModerationData(temp);
    checkIfAllModerated();
  };

  const handleStartModeration = () => {
    const data = new FormData();
    data.set("id", moderationID);
    httpRequest
      .put(`/moderations/${moderationID}/start`, data)
      .then((_) => {})
      .catch((err) => {
        if (err?.response?.data !== undefined && err.response !== null) {
          message.error(err.response.data);
        }
        console.error(err);
      });
    message.success("Video sedang diproses");
    router.push(`/result`);
  };

  const handleGenerateLaporan = () => {
    httpRequest
      .get(`/moderations/${moderationID}/report`, { responseType: "blob" })
      .then((response) => {
        if (moderationData === undefined) return;
        const type = response.headers["content-type"];
        const blob = new Blob([response.data], { type: type });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        const station_name =
          typeof moderationData?.station_name === "object" &&
          !Array.isArray(moderationData?.station_name) &&
          moderationData?.station_name !== null
            ? moderationData?.station_name.name
            : moderationData?.station_name;
        link.download = `Laporan_${station_name}_${moderationData.created_at}.pdf`;
        link.click();
      });
    message.success("Laporan berhasil di-generate");
  };
  //#endregion ::: Handlers

  //

  //#region ::: Other Methods
  // Debounce message method
  const debounceMessage = debounce((msg: string) => {
    message.error(msg);
  }, 500);

  // Check if all results has been verified
  const checkIfAllModerated = () => {
    let isAllModerated = true;
    if (moderationData?.result !== undefined) {
      if (moderationData?.result.length === 0) {
        isAllModerated = false;
      } else {
        moderationData.result.forEach((timeline: ModerationResult) => {
          if (timeline.decision.toString() === "PENDING") {
            isAllModerated = false;
          }
        });
      }
    }
    setIsModerated(isAllModerated);
  };

  // Render the Violations Tabs (Daftar Pelanggaran)
  const RenderViolationTabs = (result: ModerationResult) => {
    let responses = result.category.map((item: string, index: any) => {
      let idx: string = index.toString();
      let response: Tab = {
        key: idx,
        label: (
          <span className="flex items-center">
            {String(item).replace("_", " ")}
          </span>
        ),
        children: (
          <Collapse className="custom-panel">
            <>
              {categorisedPasal[item.toLowerCase()] !== undefined &&
                categorisedPasal[item.toLowerCase()].map((pasal, pIndex) => {
                  return (
                    <Collapse.Panel
                      header={`${pIndex + 1}. Pasal ${pasal.pasal} BAB ${
                        pasal.chapter
                      } Tahun 2012`}
                      key={pIndex}
                    >
                      <div className="kpid-pasal-list">
                        {parse(DOMPurify.sanitize(pasal.description))}
                      </div>
                    </Collapse.Panel>
                  );
                })}
            </>
            {/* {timelineItem[0].violations.map((violation, vIndex) => {
              return (
                <Collapse.Panel
                  header={vIndex + 1 + ". " + violation.pasal}
                  key={vIndex}
                >
                  <div className="kpid-pasal-list">
                    {parse(DOMPurify.sanitize(violation.deskripsi))}
                  </div>
                </Collapse.Panel>
              );
            })} */}
          </Collapse>
        ),
      };
      return response;
    });
    return responses;
  };

  // Conditionally Get The Status Styling
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

  // Categorize result
  const categorizeResult = (data: ModerationResponse) => {
    let temp: any[] = [];
    if (data?.result !== undefined) {
      if (data?.result.length === 0) {
        setIsModerated(false);
      } else {
        data.result.forEach((item: ModerationResult) => {
          if (item.decision.toUpperCase() === "PENDING") {
            setIsModerated(false);
          }
          temp = [...temp, ...item.category];
        });
      }
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
  };

  // Set the frames to show, equally thoughout the video
  const divideAndSetFrames = (data: ModerationResponse) => {
    let tempFrames: FrameResult[] = [];
    if (data?.frames !== undefined && data?.frames !== null) {
      if (data.frames.length > 20) {
        let step =
          data?.frames !== undefined ? Math.floor(data.frames.length / 20) : 0;
        tempFrames = data.frames.reduce((acc: FrameResult[], curr, index) => {
          if (acc.length === 20) {
            return acc;
          }
          if (index % step === 0) {
            acc.push(curr);
          }
          return acc;
        }, []);
      } else {
        tempFrames = data.frames;
      }
    }
    setFramesToShow(tempFrames);
  };

  // Sort the pasal into its categories
  const sortPasal = (data: PasalResponse[]) => {
    let tempCategory: { [key: string]: PasalResponse[] } = {};
    data.map((item) => {
      let key = String(item.category).toLowerCase();
      if (tempCategory[key]) {
        tempCategory[key].push(item);
      } else {
        tempCategory[key] = [item];
      }
    });
    setCategorisedPasal(tempCategory);
  };
  //#endregion ::: Other Methods

  //

  //#region ::: UseEffect
  React.useEffect(() => {
    // Fetch moderation data
    const fetchModerationData = async () => {
      const response = await httpRequest.get(fetchURL).catch((err) => {
        if (err?.response?.data !== undefined && err.response !== null) {
          debounceMessage(err.response.data);
        } else {
          debounceMessage("Terjadi kesalahan dalam mengambil data moderasi");
        }
        console.error(err);
        return null;
      });

      if (response === null) return;
      const result: ModerationResponse = response.data.data;

      setModerationData(result);
      categorizeResult(result);
      divideAndSetFrames(result);
    };

    // Fetch pasal data
    const fetchPasalData = async () => {
      const response = await httpRequest.get("/pasals").catch((err) => {
        if (err?.response?.data !== undefined && err.response !== null) {
          debounceMessage(err.response.data);
        } else {
          debounceMessage("Terjadi kesalahan dalam mengambil data pasal");
        }
        console.error(err);
        return null;
      });

      if (response === null) return;
      const result: PasalResponse[] = response.data.data;

      sortPasal(result);
    };

    fetchModerationData();
    fetchPasalData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);
  //#endregion ::: UseEffect

  return (
    <div>
      <Head>
        <title>Hasil Moderasi | KPID Jawa Timur</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* #region ::: Header */}
      <div className="mb-2 flex items-center gap-4">
        <h1 className="text-xl font-semibold md:text-2xl">Detail Video</h1>
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
      {/* #endregion ::: Header */}
      <div className="relative">
        {!isNilOrEmpty(moderationData) ? (
          <>
            <section className="grid grid-cols-4 gap-x-4 ">
              {/* #region ::: Video Informations --- Hidden on Mobile */}
              <div className="hidden flex-col gap-2 rounded-lg bg-white p-4 shadow-custom lg:flex">
                <p className="text-base font-semibold md:text-lg">
                  Informasi Rekaman
                </p>
                {RecordInformations.map((item, index) => {
                  return (
                    <div key={index} className="flex items-center gap-4">
                      <span className="flex min-w-[2.825rem] justify-center rounded-lg bg-sky-200 p-2 text-sky-700">
                        <FontAwesomeIcon icon={item.icon} height="24px" />
                      </span>
                      <span>
                        <p className="text-sm">{item.title}</p>
                        <p className="font-semibold">{item.value}</p>
                      </span>
                    </div>
                  );
                })}
              </div>
              {/* #endregion ::: Video Informations --- Hidden on Mobile */}
              <div className="col-span-4 flex flex-col rounded-lg bg-white p-4 shadow-custom lg:col-span-3">
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
                  <p className="">
                    {moderationData?.description !== undefined
                      ? moderationData?.description
                      : ""}
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-y-2 md:grid-cols-2 xl:grid-cols-3">
                  <div className="flex gap-2">
                    <span className="flex min-w-[2.825rem] items-center justify-center rounded-lg bg-sky-200 p-2 text-sky-700 ">
                      <FontAwesomeIcon icon={faTelevision} height="24px" />
                    </span>
                    <span className="flex flex-col justify-center">
                      <p className="text-sm">Stasiun</p>
                      <p className="font-semibold">
                        {typeof moderationData?.station_name === "object" &&
                        !Array.isArray(moderationData?.station_name) &&
                        moderationData?.station_name !== null
                          ? moderationData?.station_name.name
                          : moderationData?.station_name}
                      </p>
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="flex min-w-[2.825rem] items-center justify-center rounded-lg bg-sky-200 p-2 text-sky-700 ">
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
                    <span className="flex min-w-[2.825rem] items-center justify-center rounded-lg bg-sky-200 p-2 text-sky-700 ">
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
                  {/* #region ::: Video Informations --- Hidden on desktop */}
                  {RecordInformations.map((item, index) => {
                    return (
                      <div key={index} className="flex gap-2 lg:hidden">
                        <span className="flex min-w-[2.825rem] justify-center rounded-lg bg-sky-200 p-2 text-sky-700">
                          <FontAwesomeIcon icon={item.icon} height="24px" />
                        </span>
                        <span>
                          <p className="text-sm">{item.title}</p>
                          <p className="font-semibold">{item.value}</p>
                        </span>
                      </div>
                    );
                  })}
                  {/* #endregion ::: Video Informations --- Hidden on desktop */}
                </div>
              </div>
            </section>
            {/* #region ::: Video Frames Section */}
            <section className="mt-8 rounded-lg bg-white shadow-custom">
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
                              backgroundImage: `url(https://${
                                process.env.NEXT_PUBLIC_BUCKET_NAME
                              }.storage.googleapis.com/${encodeURI(
                                frame_data.frame_url
                              )})`,
                            }}
                          ></div>
                        );
                      }
                    )}
                  </div>
                  {moderationData?.frames !== undefined &&
                    moderationData?.frames !== null &&
                    moderationData?.frames.length > 20 && (
                      <p className="mt-4 text-right text-base font-normal opacity-70">
                        dan {moderationData?.frames.length - 20} potongan frame
                        lainnya.
                      </p>
                    )}
                </Collapse.Panel>
              </Collapse>
            </section>
            {/* #endregion ::: Video Frames Section */}

            {moderationData?.status !== undefined &&
              moderationData?.status.includes("REJECTED") && (
                <section className="mt-8 rounded-lg bg-white shadow-custom">
                  <Collapse defaultActiveKey="1" ghost activeKey={1}>
                    <Collapse.Panel
                      header="Hasil Moderasi"
                      key={1}
                      className="panel-disabled text-base font-semibold md:text-lg"
                    >
                      {moderationData?.result !== undefined &&
                        moderationData?.result.length > 0 && (
                          <Collapse className="custom-panel rounded-b-lg font-normal">
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
                                          <div className="ml-2 rounded-lg border-2 border-dashed border-lime-600 px-2 py-0.5 text-sm">
                                            Valid
                                          </div>
                                        ) : (
                                          <div className="ml-2 rounded-lg border-2 border-dashed border-red-600 px-2 py-0.5 text-sm">
                                            Invalid
                                          </div>
                                        )
                                      ) : (
                                        <div className="ml-2 rounded-lg border-2 border-dashed border-amber-500 px-2 py-0.5 text-sm">
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
                                            src={`https://${
                                              process.env
                                                .NEXT_PUBLIC_BUCKET_NAME
                                            }.storage.googleapis.com/${encodeURI(
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
                                        className="mb-4"
                                        items={RenderViolationTabs(item)}
                                      />

                                      {item.decision.toUpperCase() ===
                                        "PENDING" && (
                                        <div className="flex justify-end gap-4">
                                          <Button
                                            type="default"
                                            onClick={(e) => {
                                              handlePasalValidation(
                                                index,
                                                ModerationDecision.INVALID
                                              );
                                            }}
                                          >
                                            Invalid
                                          </Button>
                                          <Button
                                            type="primary"
                                            onClick={(e) => {
                                              handlePasalValidation(
                                                index,
                                                ModerationDecision.VALID
                                              );
                                            }}
                                          >
                                            Valid
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

SingleResult.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
