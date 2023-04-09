import {
  faArrowTrendUp,
  faEquals,
  faNotEqual,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment-timezone";
import Head from "next/head";
import { ReactElement, useContext, useEffect, useState } from "react";
import httpRequest from "../common/HttpRequest";
import ChartCard from "../components/ChartCard";
import Layout from "../components/Layout";
import { AuthContext, AuthContextInterface } from "../context/AuthContext";
import { isNil, isNilOrEmpty } from "../utils/CommonUtil";
import { chart1 } from "./statistic";
import { NextPageWithLayout } from "./_app";

type StatisticResult = {
  all: any[];
  detected: any[];
};

const Home: NextPageWithLayout = () => {
  const { userData } = useContext(AuthContext) as AuthContextInterface;
  const [videoData, setVideoData] = useState<any>(undefined);
  const [chartData, setChartData] = useState<any>({
    title: "Statistik Moderasi Sebulan Terakhir",
    key1: "Total Video",
    key2: "Video Melanggar",
  });

  function getDates(): string[] {
    let dateArray = [];
    let stopDate = moment.tz("Asia/Jakarta");
    let currentDate = moment.tz("Asia/Jakarta").add(-30, "days");
    while (currentDate <= stopDate) {
      dateArray.push(moment(currentDate).format("D MMMM YYYY"));
      currentDate = moment(currentDate).add(1, "days");
    }
    return dateArray;
  }

  const filterChartData = (data: StatisticResult) => {
    let totalVideo = 0;
    let totalDetected = 0;
    let result: any[] = getDates();
    let result_object: any = {};
    result.forEach((item) => {
      result_object[item] = {
        name: item,
        "Total Video": 0,
        "Video Melanggar": 0,
      };
    });

    let formatted_date;
    data.all.forEach((item: any) => {
      formatted_date = moment(item._id, "YYYY-MM-DD").format("D MMMM YYYY");
      if (result_object[formatted_date]) {
        result_object[formatted_date]["Total Video"] = item.count;
      }
      totalVideo += item.count;
    });

    data.detected.forEach((item: any) => {
      formatted_date = moment(item._id, "YYYY-MM-DD").format("D MMMM YYYY");
      if (result_object[formatted_date]) {
        result_object[formatted_date]["Video Melanggar"] = item.count;
      }
      totalDetected += item.count;
    });

    return Object.values(result_object);
  };

  const recalculatePercentage = () => {
    console.log({ ...videoData });
    if (
      !isNil(videoData?.totalVideo) &&
      !isNil(videoData?.totalDetected) &&
      !isNil(videoData?.lastTotalVideo) &&
      !isNil(videoData?.lastTotalDetected)
    ) {
      if (videoData.lastTotalVideo != 0) {
        let totalVideoPercentage = Math.round(
          (videoData.totalVideo / videoData.lastTotalVideo) * 100
        );
        setVideoData({ ...videoData, totalVideoPercentage });
      } else {
        setVideoData({ ...videoData, totalVideoPercentage: 0 });
      }

      if (videoData.lastTotalDetected != 0) {
        let totalDetectedPercentage = Math.round(
          (videoData.totalDetected / videoData.lastTotalDetected) * 100
        );
        setVideoData({ ...videoData, totalDetectedPercentage });
      } else {
        setVideoData({ ...videoData, totalDetectedPercentage: 0 });
      }
    }
  };

  useEffect(() => {
    let twoMonths = moment.tz("Asia/Jakarta").add(-60, "days");
    let lastMonth = moment.tz("Asia/Jakarta").add(-30, "days");
    let currentDate = moment.tz("Asia/Jakarta");

    httpRequest
      .get("/moderation/statistics", {
        params: {
          start_date: lastMonth.format("YYYY-MM-DD"),
          end_date: currentDate.format("YYYY-MM-DD"),
        },
      })
      .then((res) => {
        let result: StatisticResult = res.data.data;
        setChartData({
          ...chartData,
          data: filterChartData(result),
        });

        let totalVideo: number = 0;
        let totalDetected: number = 0;
        if (!isNilOrEmpty(result)) {
          result.all.forEach((item: any) => {
            totalVideo += item.count;
          });
          result.detected.forEach((item: any) => {
            totalDetected += item.count;
          });
        }

        setVideoData({ ...videoData, totalVideo, totalDetected });

        console.log(result);
        recalculatePercentage();
      });

    httpRequest
      .get("/moderation/statistics", {
        params: {
          start_date: twoMonths.format("YYYY-MM-DD"),
          end_date: lastMonth.format("YYYY-MM-DD"),
        },
      })
      .then((res) => {
        let result: StatisticResult = res.data.data;

        let lastTotalVideo: number = 0;
        let lastTotalDetected: number = 0;
        if (!isNilOrEmpty(result)) {
          result.all.forEach((item: any) => {
            lastTotalVideo += item.count;
          });
          result.detected.forEach((item: any) => {
            console.log(item);
            lastTotalDetected += item.count;
          });
        }

        setVideoData({
          ...videoData,
          lastTotalVideo,
          lastTotalDetected,
        });

        console.log(result);
        recalculatePercentage();
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>Moderasi Video | KPID Jawa Timur</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-1 flex-col gap-4">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="hidden rounded-md bg-white p-6 shadow-custom md:block">
            <h2 className="text-2xl font-semibold capitalize">
              Hai {userData.name}!
            </h2>
            <p className="mb-4 text-lg">
              Selamat Datang di Sistem Rekomendasi KPID Jawa Timur!
            </p>
            <p className="mb-4">
              Sistem rekomendasi ini dirancang untuk membantu KPID Jawa Timur
              dalam melakukan moderasi siaran televisi. Sistem ini memudahkan
              dalam konten siaran televisi yang layak tayang sesuai dengan
              standar penyiaran yang berlaku.
            </p>
            <p className="mb-4">
              Sistem dapat memberikan rekomendasi konten yang layak tayang
              dengan lebih akurat dan efisien. Kami berharap sistem rekomendasi
              ini dapat menjadi solusi yang efektif dalam mendukung tugas KPID
              Jawa Timur dalam memastikan bahwa konten siaran televisi yang
              disajikan untuk masyarakat selalu berkualitas dan sesuai dengan
              standar penyiaran yang berlaku.
            </p>
          </div>
          <div className="grid gap-4">
            <div className="gap-4 rounded-md bg-white p-6 shadow-custom">
              <div className="flex">
                <div className="flex-1">
                  <h3 className="">Video Terunggah</h3>
                  <p className="text-2xl font-bold">{videoData?.totalVideo}</p>
                </div>
                <div className="my-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                  <FontAwesomeIcon
                    icon={faEquals}
                    height="24px"
                    className="text-2xl text-green-500"
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2 rounded-lg bg-slate-100 p-3.5">
                <span className="flex gap-2 text-green-500">
                  <FontAwesomeIcon icon={faArrowTrendUp} height="24px" />{" "}
                  {videoData?.totalVideoPercentage}%
                </span>{" "}
                dari bulan lalu.
              </div>
            </div>
            <div className="gap-4 rounded-md bg-white p-6 shadow-custom">
              <div className="flex">
                <div className="flex-1">
                  <h3 className="">Video Terdeteksi Melanggar</h3>
                  <p className="text-2xl font-bold">
                    {videoData?.totalDetected}
                  </p>
                </div>
                <div className="my-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                  <FontAwesomeIcon
                    icon={faNotEqual}
                    height="24px"
                    className="text-2xl text-red-500"
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2 rounded-lg bg-slate-100 p-3.5">
                <span className="flex gap-2 text-red-500">
                  <FontAwesomeIcon icon={faArrowTrendUp} height="24px" />{" "}
                  {videoData?.totalDetectedPercentage}%
                </span>{" "}
                dari bulan lalu.
              </div>
            </div>
          </div>
        </section>
        <section className="min-h-[20rem] flex-1 grow flex-col rounded-lg bg-white">
          <>
            {chartData?.data?.length != undefined &&
              chartData?.data?.length > 0 && (
                <ChartCard
                  chartData={chartData}
                  title={chart1.title}
                ></ChartCard>
              )}
          </>
        </section>
      </div>
    </>
  );
};

export default Home;

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
