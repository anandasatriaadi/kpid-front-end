import { Button, Collapse, Divider, Skeleton, Timeline, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMarsAndVenusBurst,
  faGhost,
  faHandHoldingHeart,
  faHandsPraying,
  faPeopleGroup,
  faTelevision,
  faPenAlt,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { randomInt, randomUUID } from "crypto";
import { faClock, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { isNil, isNilOrEmpty } from "../../utils/CommonUtil";
import moment from "moment";

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
  const [moderationData, _] = useState(props.data);

  const getStatusStyling = ((status: string) => {
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
          className: "bg-red-600 text-white",
          text: "Ditemukan Pelanggaran",
        };
      default:
        return {
          className: "bg-stone-700 text-white",
          text: "Status Tidak Diketahui",
        };
    }
  })(moderationData.status);

  const summarizeCategories = () => {
    let temp: Array<String> = [];
    if (!isNilOrEmpty(moderationData?.result)) {
      moderationData?.result.forEach((violation: any) => {
        temp = [...temp, ...violation.category];
      });
    }

    return Array.from(new Set(temp)).sort((a, b) => a.length - b.length);
  };
  const categories = summarizeCategories();

  return (
    <Link href={"/result/" + moderationData._id}>
      <div className="flex cursor-pointer flex-col rounded-md bg-white shadow-custom transition-shadow hover:shadow-lg hover:shadow-slate-300">
        <div className="relative pt-[40%] md:pt-[50%]">
          {!isNilOrEmpty(moderationData?.frames) ? (
            <div
              className="absolute top-0 bottom-0 left-0 right-0 rounded-t-md bg-cover"
              style={{
                backgroundImage: `url(https://kpid-jatim.storage.googleapis.com/${encodeURI(
                  moderationData?.frames[
                    Math.floor(moderationData?.frames.length / 2)
                  ]
                )})`,
              }}
            ></div>
          ) : (
            <div className="absolute top-0 bottom-0 left-0 right-0 rounded-t-md">
              <Skeleton.Image active className="h-full w-full"></Skeleton.Image>
            </div>
          )}
          <div
            className={
              "absolute top-0 right-0 rounded-tr-md rounded-bl-md py-2 px-4 text-sm font-semibold tracking-wide " +
              getStatusStyling.className
            }
          >
            {getStatusStyling.text}
          </div>
          <div className="hidden flex-wrap justify-end gap-1 text-sm md:absolute md:bottom-2 md:right-2 md:flex lg:text-base">
            {!isNilOrEmpty(categories) &&
              categories.map((category, idx) => {
                return (
                  <span
                    key={idx}
                    className="rounded-lg bg-slate-700 bg-opacity-80 py-0.5 px-2 text-sm font-semibold text-white"
                  >
                    {category.replace(/_/g, " ")}
                  </span>
                );
              })}
          </div>
        </div>
        <div className="flex flex-1 flex-col p-2 text-sm md:p-4">
          <div className="flex flex-wrap gap-1 text-sm md:hidden">
            {!isNilOrEmpty(categories) &&
              categories.map((category, idx) => {
                return (
                  <span
                    key={idx}
                    className="rounded-lg bg-slate-700 bg-opacity-80 py-0.5 px-2 text-sm font-semibold text-white"
                  >
                    {category.replace(/_/g, " ")}
                  </span>
                );
              })}
          </div>
          <h4 className="mt-2 mb-2 font-semibold md:mt-0">
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
                  <p className="text-sm">Stasiun</p>
                  <p className="font-semibold">
                    {moderationData?.station_name}
                  </p>
                </span>
              </div>
              <div className="flex gap-2">
                <span className="flex min-w-[1.825rem] items-center justify-center rounded-lg p-1 text-slate-600 ">
                  <FontAwesomeIcon icon={faPenToSquare} height="12px" />
                </span>
                <span>
                  <p className="text-sm">Program</p>
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
                  <p className="text-sm">Tanggal Rekaman</p>
                  <p className="font-semibold">
                    {moment(moderationData?.recording_date).format(
                      "d MMMM YYYY"
                    )}
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
