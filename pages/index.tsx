import httpRequest from "@/common/HttpRequest";
import ChartCard from "@/components/ChartCard";
import Layout from "@/components/Layout";
import { AuthContext, AuthContextInterface } from "@/context/AuthContext";
import { isNil, isNilOrEmpty } from "@/utils/CommonUtil";
import debounce from "@/utils/Debounce";
import {
  faArrowTrendDown,
  faArrowTrendUp,
  faEquals,
  faNotEqual,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment-timezone";
import Head from "next/head";
import {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { NextPageWithLayout } from "./_app";

type StatisticResult = {
  all: any[];
  detected: any[];
};

const Home: NextPageWithLayout = () => {
  const { userData } = useContext(AuthContext) as AuthContextInterface;
  const [videoData, setVideoData] = useState<any>({
    totalVideo: 0,
    totalDetected: 0,
    lastTotalVideo: 0,
    lastTotalDetected: 0,
    totalVideoPercentage: 0,
    totalDetectedPercentage: 0,
  });
  const [chartData, setChartData] = useState<any>({
    title: "Statistik Moderasi Sebulan Terakhir",
    key1: "Total Video",
    key2: "Video Melanggar",
    labels: [],
    datasets: {},
  });

  function getDates(): moment.Moment[] {
    let dateArray = [];
    let stopDate = moment.tz("Asia/Jakarta");
    let currentDate = moment.tz("Asia/Jakarta").add(-30, "days");
    while (currentDate <= stopDate) {
      dateArray.push(moment(currentDate));
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
      result_object[item.format("D MMMM YYYY")] = {
        name: item.format("D MMMM YYYY"),
        "Total Video": 0,
        "Video Melanggar": 0,
      };
    });

    let formatted_date;
    if (!isNilOrEmpty(data?.all) && !isNilOrEmpty(data?.detected)) {
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
    }

    return Object.values(result_object);
  };

  const filterChartData2 = (data: StatisticResult) => {
    let labels: any[] = [];
    let all_dates = getDates();
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

      console.log(labels, all_data, detected_data);
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
      if (currVideoData.lastTotalVideo != 0) {
        let totalVideoPercentage = Math.round(
          ((currVideoData.totalVideo - currVideoData.lastTotalVideo) /
            currVideoData.lastTotalVideo) *
            100
        );
        currVideoData = { ...currVideoData, totalVideoPercentage };
      } else {
        currVideoData = { ...currVideoData, totalVideoPercentage: 0 };
      }

      if (currVideoData.lastTotalDetected != 0) {
        let totalDetectedPercentage = Math.round(
          ((currVideoData.totalDetected - currVideoData.lastTotalDetected) /
            currVideoData.lastTotalDetected) *
            100
        );
        currVideoData = { ...currVideoData, totalDetectedPercentage };
      } else {
        currVideoData = { ...currVideoData, totalDetectedPercentage: 0 };
      }
      setVideoData(currVideoData);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getStatisticData = useCallback(
    debounce(async () => {
      let lastMonth = moment.tz("Asia/Jakarta").add(-30, "days");
      let currentDate = moment.tz("Asia/Jakarta");
      let twoMonths = moment.tz("Asia/Jakarta").add(-60, "days");

      let thisMonthResult = await httpRequest
        .get("/moderation/statistics", {
          params: {
            start_date: lastMonth.format("YYYY-MM-DD"),
            end_date: currentDate.format("YYYY-MM-DD"),
          },
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return null;
        });

      let lastMonthResult = await httpRequest
        .get("/moderation/statistics", {
          params: {
            start_date: twoMonths.format("YYYY-MM-DD"),
            end_date: lastMonth.format("YYYY-MM-DD"),
          },
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return null;
        });

      let thisMonthData: StatisticResult = thisMonthResult?.data;
      let lastMonthData: StatisticResult = lastMonthResult?.data;

      setChartData({
        ...chartData,
        ...filterChartData2(thisMonthData),
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

  useEffect(() => {
    getStatisticData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>Moderasi Video | KPID Jawa Timur</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-full flex-col gap-4">
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="hidden rounded-lg bg-white p-6 shadow-custom md:block">
            <h2 className="text-2xl font-semibold capitalize">
              Hai {userData.name}!
            </h2>
            <p className="mb-4 font-semibold">
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
            <div className="gap-4 rounded-lg bg-white p-6 shadow-custom">
              <div className="flex">
                <div className="flex-1">
                  <h3 className="">Video Terunggah</h3>
                  <p className="text-2xl font-bold">{videoData?.totalVideo}</p>
                </div>
                <div
                  className={
                    "my-auto flex h-12 w-12 items-center justify-center rounded-xl " +
                    (videoData?.totalVideoPercentage >= 0
                      ? "bg-green-100"
                      : "bg-red-100")
                  }
                >
                  <FontAwesomeIcon
                    icon={faEquals}
                    height="24px"
                    className={
                      "text-2xl " +
                      (videoData?.totalVideoPercentage >= 0
                        ? "text-green-500"
                        : "text-red-500")
                    }
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2 rounded-lg bg-slate-100 p-3.5">
                <span
                  className={
                    "flex gap-2 " +
                    (videoData?.totalVideoPercentage >= 0
                      ? "text-green-500"
                      : "text-red-500")
                  }
                >
                  <FontAwesomeIcon
                    icon={
                      videoData?.totalVideoPercentage >= 0
                        ? faArrowTrendUp
                        : faArrowTrendDown
                    }
                    height="24px"
                  />{" "}
                  {videoData?.totalVideoPercentage}%
                </span>{" "}
                dari bulan lalu.
              </div>
            </div>
            <div className="gap-4 rounded-lg bg-white p-6 shadow-custom">
              <div className="flex">
                <div className="flex-1">
                  <h3 className="">Video Terdeteksi Melanggar</h3>
                  <p className="text-2xl font-bold">
                    {videoData?.totalDetected}
                  </p>
                </div>
                <div
                  className={
                    "my-auto flex h-12 w-12 items-center justify-center rounded-xl " +
                    (videoData?.totalDetectedPercentage >= 0
                      ? "bg-green-100"
                      : "bg-red-100")
                  }
                >
                  <FontAwesomeIcon
                    icon={faNotEqual}
                    height="24px"
                    className={
                      "text-2xl " +
                      (videoData?.totalDetectedPercentage >= 0
                        ? "text-green-500"
                        : "text-red-500")
                    }
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2 rounded-lg bg-slate-100 p-3.5">
                <span
                  className={
                    "flex gap-2 " +
                    (videoData?.totalDetectedPercentage >= 0
                      ? "text-green-500"
                      : "text-red-500")
                  }
                >
                  <FontAwesomeIcon
                    icon={
                      videoData?.totalDetectedPercentage >= 0
                        ? faArrowTrendUp
                        : faArrowTrendDown
                    }
                    height="24px"
                  />{" "}
                  {videoData?.totalDetectedPercentage}%
                </span>{" "}
                dari bulan lalu.
              </div>
            </div>
          </div>
        </section>
        <section className="flex min-h-[20rem] flex-1 flex-col rounded-lg bg-white">
          {chartData?.datasets?.length != undefined &&
            chartData?.datasets?.length > 0 && (
              <ChartCard
                chartData={chartData}
                title="Statistik Moderasi Sebulan Terakhir"
              ></ChartCard>
            )}
        </section>
      </div>
    </>
  );
};

export default Home;

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
