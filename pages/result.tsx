import { Select } from "antd";
import Head from "next/head";
import { ReactElement, useEffect, useState } from "react";
import httpRequest from "../common/HttpRequest";
import Layout from "../components/Layout";
import ResultCard from "../components/result/ResultCard";
import { NextPageWithLayout } from "./_app";
import useSWR from "swr";
import { isNil } from "../utils/CommonUtil";

const Result: NextPageWithLayout = () => {
  const [resultCount, setResultCount] = useState<Number>(10);

  const fetcher = () =>
    httpRequest.get("/moderation-list").then((response) => {
      const result = response.data;
      return result.data;
    });

  const { data: moderationData, error } = useSWR("/moderation-list", fetcher);
  return (
    <div>
      <Head>
        <title>Moderasi Video | KPID Jawa Timur</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <h1 className="text-2xl font-semibold">Daftar Video Unggahan</h1>
        <section className="my-4">
          <div className="flex flex-wrap gap-2 md:gap-8">
            <div className="flex flex-col gap-1 md:gap-2">
              <p>Urutkan</p>
              <Select
                defaultValue="newest"
                className="w-60"
                options={[
                  { value: "newest", label: "Unggahan Terbaru" },
                  { value: "status", label: "Status Video" },
                ]}
              />
            </div>
            <div className="flex flex-col gap-1 md:gap-2">
              <p>Hasil per halaman</p>
              <Select
                defaultValue="10"
                className="w-40"
                options={[
                  { value: "10", label: "10" },
                  { value: "20", label: "20" },
                  { value: "40", label: "40" },
                ]}
                onChange={(value) => setResultCount(Number(value))}
              />
            </div>
          </div>
        </section>
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {moderationData != undefined &&
            moderationData.map((value: any, index: number) => {
              return <ResultCard key={index} data={value} />;
            })}
        </section>
      </div>
    </div>
  );
};

export default Result;

Result.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
