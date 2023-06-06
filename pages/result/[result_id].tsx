import httpRequest from "@/common/HttpRequest";
import Layout from "@/components/Layout";
import FrameSection from "@/components/result/FrameSection";
import ViolationDesc from "@/components/result/ViolationDesc";
import ViolationIconCard from "@/components/ViolationIconCard";
import { NextPageWithLayout } from "@/pages/_app";
import ModerationDecision from "@/types/ModerationDecision";
import ModerationResponse from "@/types/ModerationResponse";
import ModerationResult from "@/types/ModerationResult";
import PasalResponse from "@/types/PasalResponse";
import { isNil, isNilOrEmpty } from "@/utils/BooleanUtil";
import { debounceErrorMessage, debounceSuccessMessage } from "@/utils/Debounce";
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
import { Button, Collapse, Skeleton } from "antd";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import * as React from "react";

const SingleResult: NextPageWithLayout = () => {
  //#region ::: Variable Initialisations
  // States
  const [isModerated, setIsModerated] = React.useState<boolean>(true);
  const [updateData, setUpdateData] = React.useState<boolean>(false);
  const [categorySummary, setCategorySummary] = React.useState<any | undefined>(
    undefined
  );
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
      .then((_) => {
        checkIfAllModerated();
      })
      .catch((err) => {
        if (err?.response?.data?.data !== undefined) {
          if (
            err.response.data.status !== 401 &&
            err.response.data.status !== 403
          ) {
            debounceErrorMessage(err.response.data.data);
          }
        }
        console.error(err);
      });
    if (moderationData === undefined) return;
    let temp: ModerationResponse = { ...moderationData };

    if (temp?.result === undefined) return;
    temp.result[timelineKey].decision = decision;
    setModerationData(temp);
  };

  const handleStartModeration = () => {
    const data = new FormData();
    data.set("id", moderationID);
    httpRequest
      .put(`/moderations/${moderationID}/start`, data)
      .then((_) => {})
      .catch((err) => {
        if (err?.response?.data?.data !== undefined) {
          if (
            err.response.data.status !== 401 &&
            err.response.data.status !== 403
          ) {
            debounceErrorMessage(err.response.data.data);
          }
        }
        console.error(err);
      });
    debounceSuccessMessage("Video Sedang Diproses");
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
        link.download = `Laporan_${
          moderationData?.station_name.name
        }_${moment().format("DD MMMM YYYY")}.pdf`;
        link.click();
      })
      .catch((err) => {
        if (err?.response?.data?.data !== undefined) {
          if (
            err.response.data.status !== 401 &&
            err.response.data.status !== 403
          ) {
            debounceErrorMessage(err.response.data.data);
          }
        }
        console.error(err);
      });
    debounceSuccessMessage("Laporan Berhasil Dibuat");
  };
  //#endregion ::: Handlers

  //

  //#region ::: Other Methods
  // Check if all results has been verified
  const checkIfAllModerated = () => {
    let isAllModerated = true;
    if (moderationData?.result !== undefined) {
      if (moderationData?.result.length === 0) {
        isAllModerated = false;
      } else {
        moderationData.result.forEach((result: ModerationResult) => {
          if (result.decision.toString() === "PENDING") {
            isAllModerated = false;
          }
        });
      }
    }
    if (isAllModerated) {
      setUpdateData(true);
    }
  };

  // Conditionally Get The Status Styling
  const getStatusStyling = (status: string) => {
    switch (status.toLowerCase()) {
      case "initialized":
        return {
          className: "bg-slate-300",
          text: "Mengekstraksi Frame",
        };
      case "uploaded":
        return {
          className: "bg-amber-400",
          text: "Belum Diproses",
        };
      case "in_progress":
        return {
          className: "bg-blue-600 text-white",
          text: "Sedang Diproses",
        };
      case "approved":
        return {
          className: "bg-lime-500",
          text: "Tidak Ditemukan Pelanggaran",
        };
      case "rejected":
        return {
          className: "bg-red-600 text-white",
          text: "Ditemukan Pelanggaran",
        };
      case "validated":
        return {
          className: "bg-lime-500 text-white",
          text: "Tervalidasi",
        };
      default:
        return {
          className: "bg-stone-700 text-white",
          text: "Status Tidak Diketahui",
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
    setIsModerated(true);

    // Fetch moderation data
    const fetchModerationData = async () => {
      const response = await httpRequest.get(fetchURL).catch((err) => {
        if (err?.response?.data?.data !== undefined) {
          if (
            err.response.data.status !== 401 &&
            err.response.data.status !== 403
          ) {
            debounceErrorMessage(err.response.data.data);
          }
        } else {
          debounceErrorMessage(
            "Terjadi kesalahan dalam mengambil data moderasi"
          );
        }
        console.error(err);
        return null;
      });

      if (response === null) {
        router.push("/result");
        return;
      }
      const result: ModerationResponse = response.data.data;

      setModerationData(result);
      categorizeResult(result);
    };

    // Fetch pasal data
    const fetchPasalData = async () => {
      const response = await httpRequest.get("/pasals").catch((err) => {
        if (err?.response?.data?.data !== undefined) {
          debounceErrorMessage(err.response.data.data);
        } else {
          debounceErrorMessage("Terjadi kesalahan dalam mengambil data pasal");
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
  }, [router, updateData]);
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
                        <FontAwesomeIcon
                          icon={item.icon}
                          className="h-[18px]"
                        />
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
                      <FontAwesomeIcon
                        icon={faTelevision}
                        className="h-[18x]"
                      />
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
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        className="h-[18px]"
                      />
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
                      <FontAwesomeIcon icon={faClock} className="h-[18px]" />
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
                          <FontAwesomeIcon
                            icon={item.icon}
                            className="h-[18px]"
                          />
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
            {moderationData !== undefined && (
              <FrameSection
                data={moderationData}
                className="mt-8 rounded-lg bg-white shadow-custom"
              ></FrameSection>
            )}
            {/* #endregion ::: Video Frames Section */}

            {moderationData?.status !== undefined &&
              (moderationData?.status.includes("REJECTED") ||
                moderationData?.status.includes("VALIDATED")) && (
                <section className="mt-8 rounded-lg bg-white shadow-custom">
                  <Collapse defaultActiveKey="1" ghost activeKey={1}>
                    <Collapse.Panel
                      header="Hasil Moderasi"
                      key={1}
                      className="panel-disabled text-base font-semibold md:text-lg"
                    >
                      <ViolationDesc
                        moderationData={moderationData}
                        pasalData={categorisedPasal}
                        pasalValidationHandler={handlePasalValidation}
                      />
                    </Collapse.Panel>
                  </Collapse>
                </section>
              )}
            {moderationData?.status !== undefined &&
              (moderationData?.status.includes("UPLOADED") || isModerated) && (
                <div className="sticky bottom-2 mt-4 flex gap-2">
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
                        <FontAwesomeIcon
                          className="h-[18px]"
                          icon={faFileDownload}
                        />
                        Buat Laporan
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
