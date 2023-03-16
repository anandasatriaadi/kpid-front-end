import { Tooltip } from "antd";
import type { Moment } from "moment";
import moment from "moment";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import debounce from "../utils/Debounce";

type RangeValue = [Moment | null, Moment | null] | null;

interface Props {
  chartData: { key1: string; key2?: string; title: string; data: any[] };
  title: string;
}

function ChartCard(props: Props) {
  const { chartData, title } = props;

  const [dates, setDates] = useState<RangeValue>(null);
  const [hackValue, setHackValue] = useState<RangeValue>(null);
  const [value, setValue] = useState<RangeValue>(null);

  const disabledDate = (current: Moment) => {
    if (!dates) {
      return false;
    }
    const tooLate =
      dates[0] &&
      current.diff(dates[0], "days") > Number(moment(dates[0]).daysInMonth())
        ? true
        : false;
    const tooEarly =
      dates[1] &&
      dates[1].diff(current, "days") > Number(moment(dates[1]).daysInMonth())
        ? true
        : false;
    const maxDate =
      current && moment(current).diff(moment()) > 0 ? true : false;

    let res = tooEarly || tooLate || maxDate;
    return res;
  };

  const onOpenChange = (open: boolean) => {
    if (open) {
      setHackValue([null, null]);
      setDates([null, null]);
    } else {
      setHackValue(null);
    }
  };

  const onButtonClick = debounce((e: any) => {
    console.log("click ", e);
  }, 200);

  return (
    <div className="absolute top-0 right-0 bottom-0 left-0 w-full p-8 pb-16">
      <h2 className="mb-4 text-lg font-bold">{title}</h2>
      {chartData?.key1 !== undefined && chartData?.key2 !== undefined && (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData.data}
            margin={{
              left: -22,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" xAxisId={0} />
            <XAxis dataKey="name" xAxisId={1} hide />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={chartData.key1} xAxisId={0} fill="#0285c7" />
            <Bar dataKey={chartData.key2} xAxisId={1} fill="#075985" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default ChartCard;
