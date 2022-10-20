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

type RangeValue = [Moment | null, Moment | null] | null;

interface Props {
  data: any[];
  title: string;
}

function ChartCard(props: Props) {
  const { data, title } = props;

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
      current && moment.now() < moment(current).valueOf() ? true : false;

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

  return (
    <div className={styles["chart-container"]}>
      <h2 className="text-lg mb-2">{title}</h2>
      <div>
        <DatePicker.RangePicker
          value={hackValue || value}
          disabledDate={disabledDate}
          onCalendarChange={(val) => setDates(val)}
          onChange={(val) => setValue(val)}
          onOpenChange={onOpenChange}
          format={"DD-MM-YYYY"}
          className="mb-6"
        />
        <Button type="primary" className="ml-4">
          Cari
        </Button>
      </div>
      <div className={styles["chart-body"]}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
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
            <Bar dataKey="Total Video" xAxisId={0} fill="#0285c7" />
            <Bar dataKey="Moderated Video" xAxisId={1} fill="#075985" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ChartCard;
