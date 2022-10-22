import { Button, DatePicker, Tooltip } from "antd";
import React, { useState } from "react";
import type { Moment } from "moment";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import styles from "../styles/components/ChartCard.module.scss";
import moment from "moment";
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
    <div className="w-full lg:w-1/2 px-4 mb-8">
      <div className="p-4 last:mb-0 rounded-md shadow-lg border-2 border-gray-100">
        <h2 className="text-lg mb-2">{title}</h2>
        <div className="flex flex-wrap justify-between gap-4 mb-6">
          <DatePicker.RangePicker
            value={hackValue || value}
            disabledDate={disabledDate}
            onCalendarChange={(val) => setDates(val)}
            onChange={(val) => setValue(val)}
            onOpenChange={onOpenChange}
            format={"DD-MM-YYYY"}
          />
          <Button type="primary" onClick={onButtonClick}>
            Cari
          </Button>
        </div>
        <div className="h-[20rem]">
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
              {chartData.key1 ? (
                <Bar dataKey={chartData.key1} xAxisId={0} fill="#0285c7" />
              ) : (
                ""
              )}
              {chartData.key2 ? (
                <Bar dataKey={chartData.key2} xAxisId={1} fill="#075985" />
              ) : (
                ""
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default ChartCard;
