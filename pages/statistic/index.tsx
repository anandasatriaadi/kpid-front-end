import Layout from "@/components/Layout";
import ModerationChart from "@/components/statistic/ModerationChart";
import UserChart from "@/components/statistic/UserChart";
import {
  ApplicationContext,
  ApplicationContextInterface,
} from "@/context/ApplicationContext";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DatePicker, Drawer } from "antd";
import { RangePickerProps } from "antd/lib/date-picker";
import moment from "moment-timezone";
import Head from "next/head";
import * as React from "react";
import { NextPageWithLayout } from "../_app";

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
  //#endregion ::: Variable Initialisations

  //

  //#region ::: Handlers
  //#endregion ::: Handlers

  //

  //#region ::: Other Methods

  // eslint-disable-next-line react-hooks/exhaustive-deps

  // eslint-disable-next-line react-hooks/exhaustive-deps

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
            allowClear={false}
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

      <h1 className="mb-4 text-xl font-semibold md:text-2xl">
        Panduan Penggunaan Sistem Rekomendasi
      </h1>
      <section className="mb-4 rounded-lg bg-white py-2 px-4 shadow-custom md:p-4">
        {isMobile ? (
          <div className="flex">
            <span
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-sky-100 px-2 py-1 text-sky-700 hover:shadow-custom"
              onClick={() => {
                setFilterDrawerOpen(!filterDrawerOpen);
              }}
            >
              <FontAwesomeIcon className="h-[16px]" icon={faFilter} />
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
      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ModerationChart selectedDate={selectedDate} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <UserChart selectedDate={selectedDate} />
      </div>
    </div>
  );
};

export default Statistic;

Statistic.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
