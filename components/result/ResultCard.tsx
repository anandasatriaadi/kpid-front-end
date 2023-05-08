import ViolationIconCard from "@/components/result/ViolationIconCard";
import ModerationResponse from "@/types/ModerationResponse";
import ModerationResult from "@/types/ModerationResult";
import { isNilOrEmpty } from "@/utils/CommonUtil";
import { faClock, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import {
  faTelevision
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider, Skeleton } from "antd";
import moment from "moment";
import Link from "next/link";
import * as React from "react";

const timelineItem = [
  {
    second: 6,
    time: "18:25:06",
    image: "/result.png",
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
        decision: null,
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
        decision: null,
      },
    ],
  },
];

interface detectedViolations {
  second: number;
  time: string;
  image: string;
  violations: {
    pasal: string;
    deskripsi: string;
    decision?: boolean | null | undefined;
  }[];
}

type Props = {
  data: any;
};

function ResultCard(props: Props) {
  //#region ::: Variable Initialisations
  const [moderationData, _] = React.useState<ModerationResponse>(props.data);
  //#endregion ::: Variable Initialisations

  //

  //#region ::: Handlers
  //#endregion ::: Handlers

  //

  //#region ::: Other Methods
  const getStatusStyling = (status: string) => {
    switch (status.toLowerCase()) {
      case "initialized":
        return {
          className: "bg-slate-300",
          text: "Sedang Diunggah",
        };
      case "uploaded":
        return {
          className: "bg-amber-400",
          text: "Belum Diproses",
        };
      case "in_progress":
        return {
          className: "bg-blue-600 text-white",
          text: "Sedang Diproses",
        };
      case "approved":
        return {
          className: "bg-green-500",
          text: "Tidak Ditemukan Pelanggaran",
        };
      case "rejected":
        return {
          className: "bg-red-600 text-white",
          text: "Ditemukan Pelanggaran",
        };
      default:
        return {
          className: "bg-stone-700 text-white",
          text: "Status Tidak Diketahui",
        };
    }
  };

  const summarizeCategories = () => {
    let temp: string[] = [];
    if (moderationData?.result !== undefined) {
      moderationData?.result.forEach((violation: ModerationResult) => {
        temp = [...temp, ...violation.category];
      });
    }

    const stringCounts: { [key: string]: number } = {};

    temp.forEach((str) => {
      let tempString = str.toLowerCase();
      if (stringCounts[tempString]) {
        stringCounts[tempString]++;
      } else {
        stringCounts[tempString] = 1;
      }
    });

    return stringCounts;
  };
  //#endregion ::: Other Methods

  //

  //#region ::: UseEffect
  //#endregion ::: UseEffect

  //#region ::: After Method Initialisations
  const statusStyle = getStatusStyling(
    moderationData?.status !== undefined ? moderationData?.status : ""
  );
  const categories = summarizeCategories();
  //#endregion ::: After Method Initialisations

  return (
    <Link href={"/result/" + moderationData._id}>
      <div className="group flex cursor-pointer flex-col rounded-lg bg-white shadow-custom transition-shadow hover:shadow-custom-lg">
        <div className="relative overflow-hidden rounded-t-lg pt-[50%]">
          {moderationData?.frames !== undefined &&
          moderationData?.frames !== null ? (
            <div
              className="absolute top-0 bottom-0 left-0 right-0 bg-cover transition-transform duration-300 group-hover:scale-[1.025]"
              style={{
                backgroundImage: `url(https://${
                  process.env.NEXT_PUBLIC_BUCKET_NAME
                }.storage.googleapis.com/${encodeURI(
                  moderationData?.frames[
                    Math.floor(moderationData?.frames.length / 2)
                  ].frame_url
                )})`,
              }}
            ></div>
          ) : (
            <div className="absolute top-0 bottom-0 left-0 right-0">
              <Skeleton.Image active className="h-full w-full"></Skeleton.Image>
            </div>
          )}
          <div
            className={
              "absolute top-0 right-0 rounded-tr-lg rounded-bl-lg py-2 px-4 text-sm font-semibold tracking-wide " +
              statusStyle.className
            }
          >
            {statusStyle.text}
          </div>
          <div className="absolute bottom-2 right-2 flex flex-wrap justify-end gap-1">
            {!isNilOrEmpty(categories) && (
              <ViolationIconCard
                height={24}
                cardStyle
                hideWhenZero
                darkStyle
                sara={categories["sara"]}
                saru={categories["saru"]}
                sihir={categories["sihir"]}
                sadis={categories["sadis"]}
                siaran={categories["siaran_partisan"]}
                className="flex-wrap-reverse justify-end"
              />
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col p-2 text-sm md:p-4">
          <h4 className="mt-2 mb-2 text-sm font-semibold transition-colors duration-300 group-hover:text-sky-600 md:mt-0 md:text-base">
            {moderationData.filename}
          </h4>
          <Divider className="m-0 my-2 bg-slate-200"></Divider>
          <span className="flex-1">
            <p className="font-semibold">Deskripsi</p>
            <p>
              {isNilOrEmpty(moderationData?.description)
                ? "No description"
                : moderationData?.description}
            </p>
          </span>
          <Divider className="m-0 my-2 bg-slate-200"></Divider>
          <div>
            <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 ">
              <div className="flex gap-2">
                <span className="flex min-w-[1.825rem] items-center justify-center rounded-lg p-1 text-slate-600 ">
                  <FontAwesomeIcon icon={faTelevision} height="12px" />
                </span>
                <span className="flex flex-col justify-center">
                  <p className="hidden md:block">Stasiun</p>
                  <p className="font-semibold">
                    {typeof moderationData?.station_name === "object" &&
                    !Array.isArray(moderationData?.station_name) &&
                    moderationData?.station_name !== null
                      ? moderationData?.station_name.name
                      : moderationData?.station_name}
                  </p>
                </span>
              </div>
              <div className="flex gap-2">
                <span className="flex min-w-[1.825rem] items-center justify-center rounded-lg p-1 text-slate-600 ">
                  <FontAwesomeIcon icon={faPenToSquare} height="12px" />
                </span>
                <span>
                  <p className="hidden md:block">Program</p>
                  <p className="font-semibold">
                    {moderationData?.program_name}
                  </p>
                </span>
              </div>
              <div className="flex gap-2">
                <span className="flex min-w-[1.825rem] items-center justify-center rounded-lg p-1 text-slate-600 ">
                  <FontAwesomeIcon icon={faClock} height="12px" />
                </span>
                <span>
                  <p className="hidden md:block">Tanggal Rekaman</p>
                  <p className="font-semibold">
                    {moment(moderationData?.recording_date).format(
                      "DD MMMM YYYY"
                    )}
                  </p>
                </span>
              </div>
              <div className="flex gap-2">
                <span className="flex min-w-[1.825rem] items-center justify-center rounded-lg p-1 text-slate-600 ">
                  <FontAwesomeIcon icon={faClock} height="12px" />
                </span>
                <span>
                  <p className="hidden md:block">Tanggal Unggah</p>
                  <p className="font-semibold">
                    {moment(moderationData?.created_at).format("DD MMMM YYYY")}
                  </p>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ResultCard;
