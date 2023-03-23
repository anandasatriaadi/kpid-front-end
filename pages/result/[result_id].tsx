import {
  faClock,
  faGaugeHigh,
  faGhost,
  faHandHoldingHeart,
  faHandsPraying,
  faMarsAndVenusBurst,
  faPeopleGroup,
  faStopwatch,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Collapse, Skeleton, Tabs, Tooltip } from "antd";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useState } from "react";
import useSWR from "swr";
import httpRequest from "../../common/HttpRequest";
import Layout from "../../components/Layout";
import ViolationIconCard from "../../components/result/ViolationIconCard";
import { isNilOrEmpty } from "../../utils/CommonUtil";
import { NextPageWithLayout } from "../_app";

const timelineItem = [
  {
    second: 6,
    time: "18:25:06",
    image: "/result.png",
    decision: null,
    violations: [
      {
        pasal: "P3SPS Pasal 18 BAB XII Tahun 2012",
        deskripsi: `Program siaran yang memuat adegan seksual dilarang.<br\>
        a. menayangkan ketelanjangan dan/atau penampakan alat kelamin;<br\>
        b. menampilkan adegan yang menggambarkan aktivitas seks dan/atau
        persenggamaan;<br\>
        c. menayangkan kekerasan seksual;<br\>
        d. menampilkan suara yang menggambarkan berlangsungnya aktivitas seks
        dan/atau persenggamaan;<br\>
        e. menampilkan percakapan tentang rangkaian aktivitas seks dan/atau
        persenggamaan;<br\>
        f. menayangkan adegan dan/atau suara yang menggambarkan hubungan
        seks antarbinatang secara vulgar;<br\>
        g. menampilkan adegan ciuman bibir;<br\>
        h. mengeksploitasi dan/atau menampilkan bagian-bagian tubuh tertentu,
        seperti: paha, bokong, payudara, secara close up dan/atau medium shot;<br\>
        i. menampilkan gerakan tubuh dan/atau tarian erotis;<br\>
        j. mengesankan ketelanjangan;<br\>
        k. mengesankan ciuman bibir; dan/atau<br\>
        l. menampilkan kata-kata cabul.<br\>`,
      },
      {
        pasal: "P3SPS Pasal 24 BAB XIII Tahun 2012",
        deskripsi: `
          (1) Program siaran dilarang menampilkan ungkapan kasar dan makian, baik
          secara verbal maupun nonverbal, yang mempunyai kecenderungan
          menghina atau merendahkan martabat manusia, memiliki makna jorok/
          mesum/cabul/vulgar, dan/atau menghina agama dan Tuhan.<br\><br\>
          (2) Kata-kata kasar dan makian sebagaimana yang dimaksud pada ayat (1) di
          atas mencakup kata-kata dalam bahasa Indonesia, bahasa daerah, dan
          bahasa asing.
          `,
      },
    ],
  },
  {
    second: 1256,
    time: "18:45:56",
    image: "/result.png",
    decision: null,
    violations: [
      {
        pasal: "P3SPS Pasal 18 BAB XII Tahun 2012",
        deskripsi: `Program siaran yang memuat adegan seksual dilarang.<br\>
        a. menayangkan ketelanjangan dan/atau penampakan alat kelamin;<br\>
        b. menampilkan adegan yang menggambarkan aktivitas seks dan/atau
        persenggamaan;<br\>
        c. menayangkan kekerasan seksual;<br\>
        d. menampilkan suara yang menggambarkan berlangsungnya aktivitas seks
        dan/atau persenggamaan;<br\>
        e. menampilkan percakapan tentang rangkaian aktivitas seks dan/atau
        persenggamaan;<br\>
        f. menayangkan adegan dan/atau suara yang menggambarkan hubungan
        seks antarbinatang secara vulgar;<br\>
        g. menampilkan adegan ciuman bibir;<br\>
        h. mengeksploitasi dan/atau menampilkan bagian-bagian tubuh tertentu,
        seperti: paha, bokong, payudara, secara close up dan/atau medium shot;<br\>
        i. menampilkan gerakan tubuh dan/atau tarian erotis;<br\>
        j. mengesankan ketelanjangan;<br\>
        k. mengesankan ciuman bibir; dan/atau<br\>
        l. menampilkan kata-kata cabul.<br\>`,
      },
      {
        pasal: "P3SPS Pasal 24 BAB XIII Tahun 2012",
        deskripsi: `
          (1) Program siaran dilarang menampilkan ungkapan kasar dan makian, baik
          secara verbal maupun nonverbal, yang mempunyai kecenderungan
          menghina atau merendahkan martabat manusia, memiliki makna jorok/
          mesum/cabul/vulgar, dan/atau menghina agama dan Tuhan.<br\><br\>
          (2) Kata-kata kasar dan makian sebagaimana yang dimaksud pada ayat (1) di
          atas mencakup kata-kata dalam bahasa Indonesia, bahasa daerah, dan
          bahasa asing.
          `,
      },
    ],
  },
];

interface detectedViolations {
  second: number;
  time: string;
  image: string;
  decision?: boolean | null | undefined;
  violations: {
    pasal: string;
    deskripsi: string;
  }[];
}

const labelItems = [
  { name: "SARA", count: 2 },
  { name: "SARU", count: 1 },
  { name: "SADIS", count: 2 },
  { name: "SIHIR", count: 1 },
  { name: "Siaran Ilegal", count: 2 },
];

const tabItems = labelItems.map((item, index) => {
  let idx = index.toString();
  return {
    key: idx,
    label: (
      <span className="flex items-center gap-1">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200">
          {item.count}
        </span>
        {item.name}
      </span>
    ),
    children: timelineItem[0].violations.map((violation, vIndex) => {
      return (
        <Collapse ghost key={vIndex}>
          <Collapse.Panel header={vIndex + 1 + ". " + violation.pasal} key="1">
            <p
              dangerouslySetInnerHTML={{
                __html: violation.deskripsi,
              }}
            ></p>
          </Collapse.Panel>
        </Collapse>
      );
    }),
  };
});

const SingleResult: NextPageWithLayout = () => {
  const [loaded, setLoaded] = useState<boolean>(true);
  const [timelines, setTimelines] = useState<any>(timelineItem);
  const [isModerated, setIsModerated] = useState<boolean>(false);

  const router = useRouter();
  const pathname = router.asPath;
  const moderationID = pathname.split("/").slice(-1)[0];
  const fetchURL = `/moderation/${moderationID}`;

  const fetcher = () =>
    httpRequest.get(fetchURL).then((response) => {
      const result = response.data;
      return result.data;
    });

  const { data: moderationData, error } = useSWR(fetchURL, fetcher);

  const checkIfAllModerated = () => {
    let isAllModerated = true;
    timelines.forEach((timeline: detectedViolations) => {
      if (timeline.decision === null) {
        isAllModerated = false;
      }
    });
    setIsModerated(isAllModerated);
  };

  const onValidatePasal = (timelineKey: number) => {
    timelines[timelineKey].decision = true;
    setTimelines([...timelines]);
    checkIfAllModerated();
  };

  const onInvalidatePasal = (timelineKey: number) => {
    timelines[timelineKey].decision = false;
    setTimelines([...timelines]);
    checkIfAllModerated();
  };

  const getStatusStyling = ((status: string) => {
    switch (status) {
      case "uploaded":
        return {
          className: "bg-amber-400",
          text: "Belum Diproses",
        };
      case "on_process":
        return {
          className: "bg-cyan-500",
          text: "Sedang Diproses",
        };
      case "approved":
        return {
          className: "bg-green-500",
          text: "Tidak Ditemukan Pelanggaran",
        };
      case "rejected":
        return {
          className: "bg-red-500 text-white",
          text: "Ditemukan Pelanggaran",
        };
      default:
        return {
          className: "bg-amber-400",
          text: "Belum Diproses",
        };
    }
  })(moderationData?.status);

  return (
    <div>
      <Head>
        <title>Hasil Moderasi | KPID Jawa Timur</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative">
        {!isNilOrEmpty(moderationData) ? (
          <>
            <section className="sticky top-0 z-10 flex items-center justify-between gap-6 rounded-xl bg-white px-4 py-2 shadow-custom">
              <h2 className="text-base font-semibold md:text-lg">
                {moderationData?.filename}
              </h2>
              <div
                className={
                  "rounded-lg px-4 py-2 text-sm font-semibold tracking-wide md:text-base " +
                  getStatusStyling.className
                }
              >
                {getStatusStyling.text}
              </div>
            </section>
            <section className="px-4">
              <div className="mt-4 flex justify-between text-base md:text-lg">
                <div className="flex flex-wrap gap-y-2 gap-x-4">
                  <div className="flex flex-1 items-center gap-3 rounded-lg bg-white py-3 px-4 shadow-md md:flex-initial">
                    <div className="rounded-xl bg-slate-100">
                      <FontAwesomeIcon icon={faClock} height="24px" />
                    </div>
                    <span>
                      <p className="text-sm md:text-base">Jam Mulai</p>
                      <p className="font-semibold">
                        {moderationData?.start_time}
                      </p>
                    </span>
                  </div>
                  <div className="flex flex-1 items-center gap-3 rounded-lg bg-white py-3 px-4 shadow-md md:flex-initial">
                    <div className="rounded-xl bg-slate-100">
                      <FontAwesomeIcon icon={faClock} height="24px" />
                    </div>
                    <span>
                      <p className="text-sm md:text-base">Jam Selesai</p>
                      <p className="font-semibold">
                        {moderationData?.end_time}
                      </p>
                    </span>
                  </div>
                  <div className="flex flex-1 items-center gap-3 rounded-lg bg-white py-3 px-4 shadow-md md:flex-initial">
                    <div className="rounded-xl bg-slate-100">
                      <FontAwesomeIcon icon={faStopwatch} height="24px" />
                    </div>
                    <span>
                      <p className="text-sm md:text-base">Durasi</p>
                      <p className="font-semibold">
                        {moderationData?.duration} detik
                      </p>
                    </span>
                  </div>
                  <div className="flex flex-1 items-center gap-3 rounded-lg bg-white py-3 px-4 shadow-md md:flex-initial">
                    <div className="rounded-xl bg-slate-100">
                      <FontAwesomeIcon icon={faGaugeHigh} height="24px" />
                    </div>
                    <span>
                      <p className="text-sm md:text-base">FPS</p>
                      <p className="font-semibold">{moderationData?.fps}</p>
                    </span>
                  </div>
                  <div className="flex flex-1 items-center gap-3 rounded-lg bg-white py-3 px-4 shadow-md md:flex-initial">
                    <div className="rounded-xl bg-slate-100">
                      <FontAwesomeIcon icon={faXmarkCircle} height="24px" />
                    </div>
                    <span>
                      <p className="text-sm md:text-base">Konten Terdeteksi</p>
                      <p className="font-semibold">
                        {moderationData?.result?.length}
                      </p>
                    </span>
                  </div>
                </div>
              </div>
              <ViolationIconCard
                className="mt-8"
                height={32}
                sara={0}
                saru={1}
                sadis={1}
                sihir={0}
                siaran={0}
                cardStyle
              />
            </section>
            <section className="mt-8">
              <Collapse defaultActiveKey="1" ghost>
                <Collapse.Panel
                  header="Potongan Frame Video"
                  key="1"
                  className="text-lg"
                >
                  <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                    {moderationData?.frames
                      .slice(0, 20)
                      .map((url: string, index: number) => {
                        return (
                          <div
                            key={index}
                            className="bg-cover pt-[56.25%]"
                            style={{
                              backgroundImage: `url(https://kpid-jatim.storage.googleapis.com/${encodeURI(
                                url
                              )})`,
                            }}
                          ></div>
                        );
                      })}
                  </div>
                  {moderationData?.frames.length > 20 && (
                    <p className="mt-4 text-right text-base opacity-70">
                      dan {moderationData?.frames.length - 20} potongan frame
                      lainnya.
                    </p>
                  )}
                </Collapse.Panel>
              </Collapse>
            </section>

            {moderationData?.status.includes("UPLOADED") ? (
              <section className="">
                <>
                  <h2 className="px-4 text-lg font-semibold">Hasil Moderasi</h2>
                  {loaded ? (
                    <>
                      <Collapse>
                        {timelines.map(
                          (item: detectedViolations, index: number) => (
                            <Collapse.Panel
                              className="text-base"
                              header={
                                <div className="flex items-center justify-between">
                                  <p>
                                    Detik {item.second} | {item.time}
                                  </p>
                                  {item.decision != null ? (
                                    item.decision ? (
                                      <div className="ml-2 border-2 border-dashed border-green-500 px-2 py-0.5 text-sm">
                                        Valid
                                      </div>
                                    ) : (
                                      <div className="ml-2 border-2 border-dashed border-red-500 px-2 py-0.5 text-sm">
                                        Invalid
                                      </div>
                                    )
                                  ) : (
                                    <div className="ml-2 border-2 border-dashed border-amber-400 px-2 py-0.5 text-sm">
                                      Belum Diverifikasi
                                    </div>
                                  )}
                                </div>
                              }
                              key={index}
                            >
                              <div className="flex flex-col lg:flex-row">
                                <div className="lg:flex-[3]">
                                  <div className="relative bg-cover bg-center pt-[52%]">
                                    <div className="absolute top-0 right-0 bottom-0 left-0 bg-black">
                                      <video
                                        className="h-full w-full"
                                        controls
                                        controlsList="nodownload"
                                        src="https://kpid-jatim.storage.googleapis.com/moderation/63de2350984ddb64fc3d675f/videos/Have You Met a Hagfish_ It’s About Slime _ Deep Look_2.mp4"
                                      ></video>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-4 lg:ml-4 lg:mt-0 lg:mb-0 lg:flex-[3]">
                                  <div className="mb-4 flex gap-4">
                                    <h3 className="text-lg font-semibold">
                                      Dugaan Pelanggaran
                                    </h3>
                                  </div>
                                  <Tabs type="card" items={tabItems} />

                                  {item.decision === null ? (
                                    <div className="flex justify-end">
                                      <Button
                                        type="primary"
                                        className="mr-4"
                                        onClick={(e) => {
                                          onValidatePasal(index);
                                        }}
                                      >
                                        Valid
                                      </Button>
                                      <Button
                                        type="dashed"
                                        onClick={(e) => {
                                          onInvalidatePasal(index);
                                        }}
                                      >
                                        Invalid
                                      </Button>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            </Collapse.Panel>
                          )
                        )}
                      </Collapse>
                      {isModerated ? (
                        <div className="mt-2 flex justify-end">
                          <Button
                            type="primary"
                            className="button-green mr-4"
                            href="/tv9_result.pdf"
                            target="_blank"
                          >
                            Generate Laporan
                          </Button>
                        </div>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    <Skeleton active />
                  )}
                </>
              </section>
            ) : (
              <div className="flex justify-end">
                <Button type="primary" className="text-lg">
                  <Link href="/result" passHref={false}>
                    Mulai Moderasi Video
                  </Link>
                </Button>
              </div>
            )}
          </>
        ) : (
          <Skeleton active></Skeleton>
        )}
      </div>
    </div>
  );
};

export default SingleResult;

SingleResult.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
