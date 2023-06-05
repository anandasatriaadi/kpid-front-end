import httpRequest from "@/common/HttpRequest";
import { isNilOrEmpty } from "@/utils/BooleanUtil";
import { getThisMonthDates } from "@/utils/DatesUtil";
import debounce, { debounceErrorMessage } from "@/utils/Debounce";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import moment from "moment-timezone";
import * as React from "react";
import LineChartCard from "../chart/LineChartCard";

type SelectedDate = {
  startDate: moment.Moment;
  endDate: moment.Moment;
};

type ChartProps = {
  selectedDate: SelectedDate;
};

type UserActivityResult = {
  date: moment.Moment;
  users_count: number;
  users: { name: string; email: string }[];
};

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

function UserChart({ selectedDate }: ChartProps) {
  const [userChartData, setUserChartData] = React.useState<any>({
    title: "Statistik Pengguna",
    key1: "Jumlah Pengguna",
    labels: [],
    datasets: {},
  });

  const [userActivityRank, setUserActivityRank] = React.useState<any[]>([]);

  const UserActiviyHeader: ColumnsType<DataType> = [
    {
      title: "No.",
      dataIndex: "no",
    },
    {
      title: "Nama",
      dataIndex: "name",
    },
    {
      title: "Jumlah Login",
      dataIndex: "count",
    },
  ];

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
          fill: true,
          label: "Jumlah Pengguna",
          data: all_data,
          backgroundColor: "#0285c7",
        },
      ],
    };
    setUserActivityRank(
      Object.keys(usersMapping)
        .map((key) => ({
          name: key,
          count: usersMapping[key],
        }))
        .sort((a, b) => b.count - a.count)
        .map((item, index) => ({
          no: index + 1,
          ...item,
        }))
    );
    return res;
  };

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
      let userActivityData: UserActivityResult[] = userActivityResult?.data;
      setUserChartData({
        ...userChartData,
        ...filterUserData(userActivityData),
      });
    }, 200),
    [selectedDate]
  );

  React.useEffect(() => {
    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  return (
    <>
      <section className=" flex min-h-[20rem] flex-1 flex-col rounded-lg bg-white shadow-custom">
        <LineChartCard
          chartData={userChartData}
          title="Statistik Pengguna"
        ></LineChartCard>
      </section>
      <section className=" h-[20rem] rounded-lg bg-white shadow-custom">
        <div className="flex h-full flex-col py-4 px-6">
          <h2 className="mb-4 text-base font-semibold">Keaktifan Pengguna</h2>
          <div className="flex-1 overflow-y-scroll scrollbar-thin scrollbar-track-slate-300 scrollbar-thumb-slate-400 scrollbar-track-rounded-full scrollbar-thumb-rounded-full">
            <Table
              columns={UserActiviyHeader}
              dataSource={userActivityRank}
              pagination={false}
              size="small"
            ></Table>
          </div>
        </div>
      </section>
    </>
  );
}

export default UserChart;
