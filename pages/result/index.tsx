import httpRequest from "@/common/HttpRequest";
import Layout from "@/components/Layout";
import ResultCard from "@/components/result/ResultCard";
import {
  ApplicationContext,
  ApplicationContextInterface,
} from "@/context/ApplicationContext";
import { isEmpty, isNil } from "@/utils/BooleanUtil";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  DatePicker,
  Divider,
  Drawer,
  Empty,
  message,
  Pagination,
  Segmented,
  Select,
  SelectProps,
  Skeleton,
  Spin,
} from "antd";
import { RangePickerProps } from "antd/lib/date-picker";
import moment from "moment";
import Head from "next/head";
import * as React from "react";
import { NextPageWithLayout } from "../_app";

type PageFilterType = {
  page: number;
  limit: number;
  sort?: string;
  status?: string;
  "created_at.lte"?: string;
  "created_at.gte"?: string;
  "recording_date.lte"?: string;
  "recording_date.gte"?: string;
};

const statusFilterOptions: SelectProps["options"] = [
  { value: "", label: "Tanpa Filter" },
  { value: "validated", label: "Tervalidasi" },
  { value: "rejected", label: "Ditemukan Pelanggaran" },
  { value: "uploaded", label: "Belum Diproses" },
  { value: "in_progress", label: "Sedang Diproses" },
  { value: "initialized", label: "Sedang Diunggah" },
  { value: "approved", label: "Tanpa Pelanggaran" },
];

const sortOptions: any[] = [
  { value: "created_at,DESC", label: "Unggahan Terbaru" },
  { value: "status,DESC", label: "Status Video" },
];

const Result: NextPageWithLayout = () => {
  //#region ::: Variable Initialisations
  const { isMobile } = React.useContext(
    ApplicationContext
  ) as ApplicationContextInterface;

  const [filterDrawerOpen, setFilterDrawerOpen] =
    React.useState<boolean>(false);
  const [isReloading, setIsReloading] = React.useState<boolean>(false);
  const [moderationData, setModerationData] = React.useState<any>(undefined);
  const [metadata, setMetadata] = React.useState<any>({});
  const [pageFilter, setPageFilter] = React.useState<PageFilterType>({
    page: 0,
    limit: 12,
    sort: "created_at,DESC",
  });

  const queryParams = {
    params: { ...pageFilter },
  };
  //#endregion ::: Variable Initialisations

  //

  //#region ::: Handlers
  //#endregion ::: Handlers

  //

  //#region ::: Other Methods
  const RenderFilterBody = (): React.ReactElement => {
    const disabledDate: RangePickerProps["disabledDate"] = (current) => {
      return current && current > moment().endOf("day");
    };

    return (
      <div className="grid grid-cols-1 flex-row flex-wrap justify-between gap-4 md:flex">
        <div className="grid grid-cols-1 flex-wrap gap-4 md:flex">
          <div className="flex flex-col gap-1 text-sm">
            <p>Status</p>
            <Select
              className="w-full min-w-[24ch] md:w-min"
              defaultValue=""
              options={statusFilterOptions}
              onChange={(value) => {
                setIsReloading(true);
                if (!isEmpty(value))
                  setPageFilter({
                    ...pageFilter,
                    status: value.toUpperCase(),
                  });
                else {
                  const { status, ...rest } = pageFilter;
                  setPageFilter(rest);
                }
              }}
            />
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <p>Tanggal Unggah</p>
            <DatePicker
              className="w-full min-w-[24ch] md:w-min"
              format="DD/MM/YYYY"
              disabledDate={disabledDate}
              onChange={(value) => {
                setIsReloading(true);
                if (!isNil(value))
                  setPageFilter({
                    ...pageFilter,
                    "created_at.lte": value?.format("YYYY-MM-DD"),
                    "created_at.gte": value?.format("YYYY-MM-DD"),
                  });
                else {
                  let temp = { ...pageFilter };
                  delete temp["created_at.lte"];
                  delete temp["created_at.gte"];
                  setPageFilter(temp);
                }
              }}
            />
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <p>Tanggal Rekaman</p>
            <DatePicker
              className="w-full min-w-[24ch] md:w-min"
              format="DD/MM/YYYY"
              disabledDate={disabledDate}
              onChange={(value) => {
                setIsReloading(true);
                if (!isNil(value))
                  setPageFilter({
                    ...pageFilter,
                    "recording_date.lte": value?.format("YYYY-MM-DD"),
                    "recording_date.gte": value?.format("YYYY-MM-DD"),
                  });
                else {
                  let temp = { ...pageFilter };
                  delete temp["recording_date.lte"];
                  delete temp["recording_date.gte"];
                  setPageFilter(temp);
                }
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <p>Urutkan</p>
          <Segmented
            className="rounded-lg border-[1px] border-slate-300 bg-transparent p-0"
            options={sortOptions}
            onChange={(value) => {
              setIsReloading(true);
              if (!isEmpty(value))
                setPageFilter({
                  ...pageFilter,
                  sort: value.toString(),
                });
              else {
                const { sort, ...rest } = pageFilter;
                setPageFilter(rest);
              }
            }}
          />
        </div>
      </div>
    );
  };
  //#endregion ::: Other Methods

  //

  //#region ::: UseEffect
  React.useEffect(() => {
    httpRequest
      .get(`/moderations/user`, queryParams)
      .then((response) => {
        const result = response.data;
        setIsReloading(false);
        setModerationData(result.data);
        setMetadata(result.metadata);
      })
      .catch((err) => {
        if (err?.response?.data !== undefined && err.response !== null) {
          message.error(err.response.data);
        }
        console.error(err);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageFilter]);
  //#endregion ::: UseEffect

  return (
    <div className="flex flex-1 flex-col">
      <Head>
        <title>Unggahan Video | KPID Jawa Timur</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="mb-4 text-xl font-semibold md:text-2xl">
        Daftar Unggahan Video
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
              <p className="text-base">Filter</p>
            </span>
          </div>
        ) : (
          <>
            <p className="text-base font-semibold md:text-lg">Filter</p>
            <Divider className="my-2" />
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
      {!isNil(moderationData) ? (
        isEmpty(moderationData) ? (
          <Empty description="Tidak ada data moderasi" />
        ) : (
          <>
            <Spin spinning={isReloading}>
              <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 ">
                {moderationData.map((value: any, _: number) => {
                  return <ResultCard key={value._id} data={value} />;
                })}
              </section>
            </Spin>
            <Pagination
              className="mx-auto mt-4 rounded-lg bg-white p-2 shadow-custom"
              total={metadata.total_elements}
              pageSizeOptions={["12", "24", "48", "96"]}
              defaultPageSize={12}
              defaultCurrent={1}
              showSizeChanger
              showTotal={(total, range) => {
                return !isMobile
                  ? `${range[0]}-${range[1]} of ${total} items`
                  : ``;
              }}
              onChange={(page, pageSize) => {
                setIsReloading(true);
                setPageFilter({
                  ...pageFilter,
                  page: page - 1,
                  limit: pageSize,
                });
              }}
            />
          </>
        )
      ) : (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 ">
          {[...Array(12)].map((_, index) => (
            <div key={index}>
              <div className="group flex cursor-pointer flex-col rounded-lg bg-white shadow-custom transition-shadow hover:shadow-custom-lg">
                <div className="relative overflow-hidden rounded-t-lg pt-[50%]">
                  <div className="absolute top-0 bottom-0 left-0 right-0">
                    <Skeleton.Image
                      active
                      className="h-full w-full"
                    ></Skeleton.Image>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-2 text-sm md:p-4">
                  <Skeleton.Button active size="small" block shape="round" />
                  <Divider className="m-0 my-2 bg-slate-200"></Divider>
                  <Skeleton active paragraph={{ rows: 1 }} round />
                  <Divider className="m-0 my-2 bg-slate-200"></Divider>
                  <div className="grid grid-cols-2 gap-2">
                    {[...Array(4)].map((_, index) => (
                      <div className="flex gap-2" key={index}>
                        <Skeleton.Avatar active size="small" />
                        <Skeleton.Button
                          block
                          active
                          size="small"
                          shape="round"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default Result;

Result.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
