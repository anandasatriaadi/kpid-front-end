import httpRequest from "@/common/HttpRequest";
import BarChartCard from "@/components/chart/BarChartCard";
import Layout from "@/components/Layout";
import { AuthContext, AuthContextInterface } from "@/context/AuthContext";
import { isNil, isNilOrEmpty } from "@/utils/BooleanUtil";
import { getThisMonthDates } from "@/utils/DatesUtil";
import debounce, { debounceErrorMessage } from "@/utils/Debounce";
import {
  faArrowTrendDown,
  faArrowTrendUp,
  faEquals,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment-timezone";
import Head from "next/head";
import Image from "next/image";
import React from "react";
import { NextPageWithLayout } from "./_app";

type StatisticResult = {
  all: any[];
  detected: any[];
};

const Home: NextPageWithLayout = () => {
  //#region ::: Variable Initialisations
  const { userData } = React.useContext(AuthContext) as AuthContextInterface;
  const [videoData, setVideoData] = React.useState<any>({
    totalVideo: 0,
    totalDetected: 0,
    lastTotalVideo: 0,
    lastTotalDetected: 0,
    totalVideoPercentage: 0,
    totalDetectedPercentage: 0,
  });
  const [chartData, setChartData] = React.useState<any>({
    title: "Statistik Moderasi Sebulan Terakhir",
    key1: "Total Video",
    key2: "Video Melanggar",
    labels: [],
    datasets: {},
  });
  //#endregion ::: Variable Initialisations

  //

  //#region ::: Handlers
  //#endregion ::: Handlers

  //

  //#region ::: Other Methods
  const filterChartData = (data: StatisticResult) => {
    let labels: any[] = [];
    let endDate = moment.tz("Asia/Jakarta");
    let startDate = moment.tz("Asia/Jakarta").add(-30, "days");
    let all_dates = getThisMonthDates(startDate, endDate);
    let all_data: any[] = [];
    let detected_data: any[] = [];

    let formatted_date;
    if (!isNilOrEmpty(data?.all) && !isNilOrEmpty(data?.detected)) {
      data.all.forEach((item: any) => {
        item.date = moment(item._id, "YYYY-MM-DD");
      });
      data.detected.forEach((item: any) => {
        item.date = moment(item._id, "YYYY-MM-DD");
      });

      all_dates.forEach((date: moment.Moment) => {
        let found = false;
        data.all.forEach((item: any) => {
          if (date.isSame(item.date, "day")) {
            found = true;
            all_data.push(item.count);
          }
        });
        if (!found) {
          all_data.push(0);
        }

        found = false;
        data.detected.forEach((item: any) => {
          if (date.isSame(item.date, "day")) {
            found = true;
            detected_data.push(item.count);
          }
        });
        if (!found) {
          detected_data.push(0);
        }
        formatted_date = date.format("D MMMM YYYY");
        labels.push(formatted_date);
      });
    }

    return {
      labels,
      datasets: [
        {
          label: "Video Melanggar",
          data: detected_data,
          backgroundColor: "#075985",
        },
        {
          label: "Total Video",
          data: all_data,
          backgroundColor: "#0285c7",
        },
      ],
    };
  };

  const recalculatePercentage = (currVideoData: any) => {
    if (
      !isNil(currVideoData?.totalVideo) &&
      !isNil(currVideoData?.totalDetected) &&
      !isNil(currVideoData?.lastTotalVideo) &&
      !isNil(currVideoData?.lastTotalDetected)
    ) {
      let totalVideoPercentage = Math.round(
        ((currVideoData.totalVideo - currVideoData.lastTotalVideo) /
          (currVideoData.lastTotalVideo != 0
            ? currVideoData.lastTotalVideo
            : 1)) *
          100
      );
      currVideoData = { ...currVideoData, totalVideoPercentage };

      let totalDetectedPercentage = Math.round(
        ((currVideoData.totalDetected - currVideoData.lastTotalDetected) /
          (currVideoData.lastTotalDetected != 0
            ? currVideoData.lastTotalDetected
            : 1)) *
          100
      );
      currVideoData = { ...currVideoData, totalDetectedPercentage };
      setVideoData(currVideoData);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getStatisticData = React.useCallback(
    debounce(async () => {
      let lastMonth = moment.tz("Asia/Jakarta").add(-30, "days");
      let currentDate = moment.tz("Asia/Jakarta");
      let twoMonths = moment.tz("Asia/Jakarta").add(-60, "days");

      let thisMonthResult = await httpRequest
        .get("/moderations/statistics", {
          params: {
            start_date: lastMonth.format("YYYY-MM-DD"),
            end_date: currentDate.format("YYYY-MM-DD"),
          },
        })
        .then((res) => {
          return res.data;
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

      let lastMonthResult = await httpRequest
        .get("/moderations/statistics", {
          params: {
            start_date: twoMonths.format("YYYY-MM-DD"),
            end_date: lastMonth.format("YYYY-MM-DD"),
          },
        })
        .then((res) => {
          return res.data;
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

      let thisMonthData: StatisticResult = thisMonthResult?.data;
      let lastMonthData: StatisticResult = lastMonthResult?.data;

      setChartData({
        ...chartData,
        ...filterChartData(thisMonthData),
      });

      let totalVideo: number = 0;
      let totalDetected: number = 0;
      let lastTotalVideo: number = 0;
      let lastTotalDetected: number = 0;
      if (!isNilOrEmpty(thisMonthData)) {
        thisMonthData.all.forEach((item: any) => {
          totalVideo += item.count;
        });
        thisMonthData.detected.forEach((item: any) => {
          totalDetected += item.count;
        });
      }

      if (!isNilOrEmpty(lastMonthData)) {
        lastMonthData.all.forEach((item: any) => {
          lastTotalVideo += item.count;
        });
        lastMonthData.detected.forEach((item: any) => {
          lastTotalDetected += item.count;
        });
      }

      let currVideoData = {
        ...videoData,
        totalVideo,
        totalDetected,
        lastTotalVideo,
        lastTotalDetected,
      };

      recalculatePercentage(currVideoData);
    }, 200),
    []
  );
  //#endregion ::: Other Methods

  //

  //#region ::: UseEffect
  React.useEffect(() => {
    getStatisticData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion ::: UseEffect

  return (
    <>
      <Head>
        <title>Moderasi Video | KPID Jawa Timur</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-full flex-col gap-4">
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="hidden rounded-lg bg-white shadow-custom md:block">
            <div className="rounded-t-lg bg-sky-100 p-4 pt-6">
              <div className="flex items-center">
                <span className="relative mr-2 h-16 w-16 rounded-full">
                  <Image
                    src={"/user.png"}
                    alt="User Profile Image"
                    layout="fill"
                    objectFit="cover"
                  ></Image>
                </span>
                <span className="flex-1">
                  <h2 className="text-2xl font-semibold capitalize text-sky-700">
                    Hai {userData !== undefined && userData.name}!
                  </h2>
                  <p className="font-semibold text-sky-700">
                    Selamat Datang di Sistem Rekomendasi KPID Jawa Timur!
                  </p>
                </span>
              </div>
            </div>
            <div className="p-4 pb-6 text-justify">
              <p className="mb-4">
                Sistem rekomendasi ini dirancang untuk membantu KPID Jawa Timur
                dalam melakukan moderasi siaran televisi. Sistem ini memudahkan
                dalam konten siaran televisi yang layak tayang sesuai dengan
                standar penyiaran yang berlaku.
              </p>
              <p className="mb-4">
                Sistem dapat memberikan rekomendasi konten yang layak tayang
                dengan lebih akurat dan efisien. Kami berharap sistem
                rekomendasi ini dapat menjadi solusi yang efektif dalam
                mendukung tugas KPID Jawa Timur dalam memastikan bahwa konten
                siaran televisi yang disajikan untuk masyarakat selalu
                berkualitas dan sesuai dengan standar penyiaran yang berlaku.
              </p>
            </div>
          </div>
          <div className="grid gap-4">
            {[
              {
                title: "Video Terunggah",
                total: videoData?.totalVideo,
                percentage: videoData?.totalVideoPercentage,
              },
              {
                title: "Video Terdeteksi Melanggar",
                total: videoData?.totalDetected,
                percentage: videoData?.totalDetectedPercentage,
              },
            ].map((key, index) => {
              return (
                <div
                  key={index}
                  className="gap-4 rounded-lg bg-white py-6 px-4 shadow-custom"
                >
                  <div className="flex">
                    <div className="flex-1">
                      <h3 className="">{key.title}</h3>
                      <p className="text-2xl font-bold">{key.total}</p>
                    </div>
                    <div
                      className={
                        "my-auto flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 " +
                        (key.percentage >= 0 ? "bg-green-100" : "bg-red-100")
                      }
                    >
                      <FontAwesomeIcon
                        icon={faEquals}
                        className={
                          "h-[18px] text-2xl transition-all duration-300 " +
                          (key.percentage >= 0
                            ? "text-green-500"
                            : "text-red-500")
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2 rounded-lg bg-slate-100 p-3.5">
                    <span
                      className={
                        "flex items-center justify-center gap-2 transition-all duration-300 " +
                        (key.percentage >= 0
                          ? "text-green-500"
                          : "text-red-500")
                      }
                    >
                      <FontAwesomeIcon
                        icon={
                          key.percentage >= 0
                            ? faArrowTrendUp
                            : faArrowTrendDown
                        }
                        className={
                          "h-[18px] transform transition-transform duration-300 " +
                          (key.percentage < 0 && "rotate-[360deg]")
                        }
                      />{" "}
                      {key.percentage}%
                    </span>{" "}
                    dari bulan lalu.
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        <section className="flex min-h-[20rem] flex-1 flex-col rounded-lg bg-white">
          <BarChartCard
            chartData={chartData}
            title="Statistik Moderasi Sebulan Terakhir"
          ></BarChartCard>
        </section>
      </div>
    </>
  );
};

export default Home;

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
  