import httpRequest from "@/common/HttpRequest";
import BarChartCard from "@/components/chart/BarChartCard";
import PieChartCard from "@/components/chart/PieChartCard";
import { isNilOrEmpty } from "@/utils/BooleanUtil";
import { getThisMonthDates } from "@/utils/DatesUtil";
import debounce, { debounceErrorMessage } from "@/utils/Debounce";
import moment from "moment-timezone";
import * as React from "react";

type SelectedDate = {
  startDate: moment.Moment;
  endDate: moment.Moment;
};

type ModerationStatisticResult = {
  all: any[];
  detected: any[];
};

type ChartProps = {
  selectedDate: SelectedDate;
};

function ModerationChart({ selectedDate }: ChartProps) {
  //#region ::: Variable Initialisations
  const [barChartData, setBarChartData] = React.useState<any>({
    title: "Statistik Moderasi",
    key1: "Total Video",
    key2: "Video Melanggar",
    labels: [],
    datasets: {},
  });

  const [pieChartData, setPieChartData] = React.useState<any>({
    title: "Statistik Moderasi",
    labels: ["Video Melanggar", "Video Tidak Melanggar"],
    datasets: {},
  });
  //#endregion ::: Variable Initialisations

  //

  //#region ::: Handlers
  //#endregion ::: Handlers

  //

  //#region ::: Other Methods
  const filterModerationDataBar = (data: ModerationStatisticResult) => {
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

    setBarChartData({
      ...barChartData,
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
    });
    return {};
  };

  const filterModerationDataPie = (data: ModerationStatisticResult) => {
    if (data?.all !== undefined && data?.detected !== undefined) {
      const totalVideo = data?.all.reduce((current, prev, index) => {
        return current + prev.count;
      }, 0);
      const totalDetectedVideo = data?.detected.reduce(
        (current, prev, index) => {
          return current + prev.count;
        },
        0
      );
      setPieChartData({
        ...pieChartData,
        datasets: [
          {
            label: "Jumlah",
            data: [totalDetectedVideo, totalVideo - totalDetectedVideo],
            backgroundColor: ["#075985", "#0285c7"],
          },
        ],
      });
    }
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
      let moderationData: ModerationStatisticResult = moderationResult?.data;
      filterModerationDataBar(moderationData);
      filterModerationDataPie(moderationData);
    }, 200),
    [selectedDate]
  );
  //#endregion ::: Other Methods

  //

  //#region ::: UseEffect
  React.useEffect(() => {
    getModerationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);
  //#endregion ::: UseEffect

  return (
    <>
      <section className="flex min-h-[20rem] flex-1 flex-col rounded-lg bg-white shadow-custom">
        <PieChartCard
          chartData={pieChartData}
          title="Video Melanggar dan Tidak Melanggar"
        />
      </section>
      <section className="flex min-h-[20rem] flex-1 flex-col rounded-lg bg-white shadow-custom">
        <BarChartCard
          chartData={barChartData}
          title="Statistik Moderasi Harian"
        ></BarChartCard>
      </section>
    </>
  );
}

export default ModerationChart;
