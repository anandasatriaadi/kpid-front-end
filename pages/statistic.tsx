import httpRequest from "@/common/HttpRequest";
import ChartCard from "@/components/ChartCard";
import Layout from "@/components/Layout";
import {
  ApplicationContext,
  ApplicationContextInterface,
} from "@/context/ApplicationContext";
import { isNilOrEmpty } from "@/utils/BooleanUtil";
import { getThisMonthDates } from "@/utils/DatesUtil";
import debounce from "@/utils/Debounce";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DatePicker, Drawer } from "antd";
import { RangePickerProps } from "antd/lib/date-picker";
import moment from "moment-timezone";
import Head from "next/head";
import * as React from "react";
import { NextPageWithLayout } from "./_app";

type ModerationStatisticResult = {
  all: any[];
  detected: any[];
};

type UserActivityResult = {
  date: moment.Moment;
  users_count: number;
  users: { name: string; email: string }[];
};

const Statistic: NextPageWithLayout = () => {
  //#region ::: Variable Initialisations
  const { isMobile } = React.useContext(
    ApplicationContext
  ) as ApplicationContextInterface;
  const [filterDrawerOpen, setFilterDrawerOpen] =
    React.useState<boolean>(false);
  const [selectedDate, setSelectedDate] = React.useState<{
    startDate: moment.Moment;
    endDate: moment.Moment;
  }>({
    startDate: moment.tz("Asia/Jakarta").add(-30, "days"),
    endDate: moment.tz("Asia/Jakarta"),
  });
  const [barChartData, setBarChartData] = React.useState<any>({
    title: "Statistik Moderasi",
    key1: "Total Video",
    key2: "Video Melanggar",
    labels: [],
    datasets: {},
  });
  const [userChartData, setUserChartData] = React.useState<any>({
    title: "Statistik Pengguna",
    key1: "Jumlah Pengguna",
    labels: [],
    datasets: {},
  });
  const [userActivityRank, setUserActivityRank] = React.useState<any[]>([]);
  //#endregion ::: Variable Initialisations

  //

  //#region ::: Handlers
  //#endregion ::: Handlers

  //

  //#region ::: Other Methods
  const filterModerationData = (data: ModerationStatisticResult) => {
    let labels: any[] = [];
    let all_dates = getThisMonthDates(
      selectedDate.startDate,
      selectedDate.endDate
    );
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

  const filterUserData = (data: UserActivityResult[]) => {
    let labels: any[] = [];
    let all_dates = getThisMonthDates(
      selectedDate.startDate,
      selectedDate.endDate
    );
    let all_data: any[] = [];
    let usersMapping: { [key: string]: number } = {};

    let formatted_date;
    if (!isNilOrEmpty(data)) {
      data.forEach((item: UserActivityResult) => {
        item.date = moment(item.date, "ddd, DD MMM YYYY HH:mm:ss [GMT]");
        item.users.forEach((user: any) => {
          if (usersMapping[user.email]) {
            usersMapping[user.email] += 1;
          } else {
            usersMapping[user.email] = 1;
          }
        });
      });

      all_dates.forEach((date: moment.Moment) => {
        let found = false;
        data.forEach((item: UserActivityResult) => {
          console.log(date, item.date);
          if (date.isSame(item.date, "day")) {
            found = true;
            all_data.push(item.users_count);
          }
        });
        if (!found) {
          all_data.push(0);
        }
        formatted_date = date.format("D MMMM YYYY");
        labels.push(formatted_date);
      });
    }

    const res = {
      labels,
      datasets: [
        {
          label: "Jumlah Pengguna",
          data: all_data,
          backgroundColor: "#0285c7",
        },
      ],
    };
    console.log(usersMapping);
    setUserActivityRank(
      Object.keys(usersMapping)
        .map((key) => ({ name: key, count: usersMapping[key] }))
        .sort((a, b) => b.count - a.count)
    );
    return res;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getModerationData = React.useCallback(
    debounce(async () => {
      let moderationResult = await httpRequest
        .get("/moderations/statistics", {
          params: {
            start_date: selectedDate.startDate.format("YYYY-MM-DD"),
            end_date: selectedDate.endDate.format("YYYY-MM-DD"),
          },
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.error(err);
          return null;
        });
      let moderationData: ModerationStatisticResult = moderationResult?.data;
      setBarChartData({
        ...barChartData,
        ...filterModerationData(moderationData),
      });
    }, 200),
    [selectedDate]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getUserData = React.useCallback(
    debounce(async () => {
      let userActivityResult = await httpRequest
        .get("/activity", {
          params: {
            "date.gte": selectedDate.startDate.format("YYYY-MM-DD"),
            "date.lte": selectedDate.endDate.format("YYYY-MM-DD"),
          },
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.error(err);
          return null;
        });
      let userActivityData: UserActivityResult[] = userActivityResult?.data;
      setUserChartData({
        ...userChartData,
        ...filterUserData(userActivityData),
      });
    }, 200),
    [selectedDate]
  );
  //#endregion ::: Other Methods

  //

  //#region ::: Renderers
  const RenderFilterBody = (): React.ReactElement => {
    const disabledDate: RangePickerProps["disabledDate"] = (current) => {
      if (!current || !selectedDate) {
        return false;
      }

      const { startDate, endDate } = selectedDate;
      const minDate = moment(endDate).add(-31, "days");
      const maxDate = moment(startDate).add(31, "days");

      return (
        current > moment().endOf("day") ||
        current > maxDate ||
        current < minDate
      );
    };

    return (
      <div className="grid grid-cols-1 flex-row flex-wrap justify-between gap-4 md:flex">
        <div className="grid grid-cols-1 flex-wrap gap-4 md:flex">
          <DatePicker.RangePicker
            className="w-full min-w-[36ch] md:w-min"
            format="DD/MM/YYYY"
            disabledDate={disabledDate}
            defaultValue={[selectedDate.startDate, selectedDate.endDate]}
            onChange={(value) => {
              if (
                value &&
                value[0] !== undefined &&
                value[0] !== null &&
                value[1] !== undefined &&
                value[1] !== null
              ) {
                setSelectedDate({ startDate: value[0], endDate: value[1] });
              }
            }}
          />
        </div>
      </div>
    );
  };
  //#endregion ::: Renderers

  //

  //#region ::: UseEffect
  React.useEffect(() => {
    getModerationData();
    getUserData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);
  //#endregion ::: UseEffect

  return (
    <div>
      <Head>
        <title>Statistik Sistem | KPID Jawa Timur</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="mb-4 rounded-lg bg-white py-2 px-4 shadow-custom md:p-6 md:py-4">
        {isMobile ? (
          <div className="flex">
            <span
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-sky-100 px-2 py-1 text-sky-600 hover:shadow-custom"
              onClick={() => {
                setFilterDrawerOpen(!filterDrawerOpen);
              }}
            >
              <FontAwesomeIcon height={16} icon={faFilter} />
              <p className="text-base">Rentang Tanggal Statistik</p>
            </span>
          </div>
        ) : (
          <>
            <p className="mb-2 text-base font-semibold md:text-lg">
              Rentang Tanggal Statistik
            </p>
          </>
        )}
        {isMobile ? (
          <Drawer
            title="Filter"
            open={filterDrawerOpen}
            onClose={() => setFilterDrawerOpen(false)}
          >
            {RenderFilterBody()}
          </Drawer>
        ) : (
          RenderFilterBody()
        )}
      </section>
      <section className="mb-4 flex h-[20rem] flex-1 flex-col rounded-lg bg-white shadow-custom">
        {barChartData?.datasets?.length != undefined &&
          barChartData?.datasets?.length > 0 && (
            <ChartCard
              chartData={barChartData}
              title="Statistik Moderasi"
            ></ChartCard>
          )}
      </section>
      <div className="grid h-[20rem] grid-cols-8 gap-4">
        <section className="col-span-5 flex h-[20rem] flex-1 flex-col rounded-lg bg-white shadow-custom">
          {userChartData?.datasets?.length != undefined &&
            userChartData?.datasets?.length > 0 && (
              <ChartCard
                chartData={userChartData}
                title="Statistik Pengguna"
              ></ChartCard>
            )}
        </section>
        <section className="col-span-3 h-[20rem] rounded-lg bg-white shadow-custom">
          <div className="h-full py-4 pl-6">
            <h2 className="text-base font-semibold">Keaktifan Pengguna</h2>
            <div className="max-h-full min-h-full overflow-y-scroll pr-6 scrollbar-thin scrollbar-track-slate-300 scrollbar-thumb-slate-400 scrollbar-track-rounded-full scrollbar-thumb-rounded-full">
              {userActivityRank !== undefined &&
                userActivityRank !== null &&
                userActivityRank.map((user, index) => {
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between pb-2"
                    >
                      <div className="flex items-center">
                        <p className="text-base">
                          {index + 1}. {user.name}
                        </p>
                      </div>
                      <p className="text-base">{user.count}</p>
                    </div>
                  );
                })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Statistic;

Statistic.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
