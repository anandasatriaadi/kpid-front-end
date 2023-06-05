import ViolationIconCard from "@/components/ViolationIconCard";
import ModerationResponse from "@/types/ModerationResponse";
import ModerationResult from "@/types/ModerationResult";
import { isNilOrEmpty } from "@/utils/BooleanUtil";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faPenToSquare, faTelevision } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider, Skeleton } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import moment from "moment";
import Link from "next/link";
import * as React from "react";

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
          text: "Tanpa Pelanggaran",
        };
      case "rejected":
        return {
          className: "bg-red-600 text-white",
          text: "Ditemukan Pelanggaran",
        };
      case "validated":
        return {
          className: "bg-green-500 text-white",
          text: "Tervalidasi",
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
          <Paragraph
            ellipsis={{ rows: 1, tooltip: moderationData.filename }}
            className="mt-2 mb-2 text-sm font-semibold transition-colors duration-300 group-hover:text-sky-700 md:mt-0 md:text-base"
          >
            {moderationData.filename}
          </Paragraph>
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
                <span className="my-auto flex h-[1.825rem] w-[1.825rem] items-center justify-center rounded-lg bg-sky-200 p-1 text-sky-700 ">
                  <FontAwesomeIcon icon={faTelevision} height="12px" />
                </span>
                <span>
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
                <span className="my-auto flex h-[1.825rem] w-[1.825rem] items-center justify-center rounded-lg bg-sky-200 p-1 text-sky-700 ">
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
                <span className="my-auto flex h-[1.825rem] w-[1.825rem] items-center justify-center rounded-lg bg-sky-200 p-1 text-sky-700 ">
                  <FontAwesomeIcon icon={faClock} height="12px" />
                </span>
                <span className="flex gap-1 md:inline-block">
                  <p className="block md:hidden">Rekaman</p>
                  <p className="hidden  md:block">Tanggal Rekaman</p>
                  <p className="font-semibold">
                    {moment(moderationData?.recording_date).format(
                      "DD MMMM YYYY"
                    )}
                  </p>
                </span>
              </div>
              <div className="flex gap-2">
                <span className="my-auto flex h-[1.825rem] w-[1.825rem] items-center justify-center rounded-lg bg-sky-200 p-1 text-sky-700 ">
                  <FontAwesomeIcon icon={faClock} height="12px" />
                </span>
                <span className="flex gap-1 md:inline-block">
                  <p className="block md:hidden">Unggahan</p>
                  <p className="hidden  md:block">Tanggal Unggah</p>
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
