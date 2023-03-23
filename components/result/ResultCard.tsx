import { Button, Collapse, Divider, Skeleton, Timeline, Tooltip } from "antd";
import { useState } from "react";
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
import { isNilOrEmpty } from "../../utils/CommonUtil";

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
  const [loaded, setLoaded] = useState<boolean>(false);
  const [timelines, setTimelines] = useState<any>(timelineItem);
  const [isModerated, setIsModerated] = useState<boolean>(false);
  const [moderationData, _] = useState(props.data);

  const onChange = (key: string | string[]) => {
    if (!loaded) {
      setTimeout(() => {
        setLoaded(true);
      }, 100);
    }
    console.log(key);
  };

  const checkIfAllModerated = () => {
    let isAllModerated = true;
    timelines.forEach((timeline: detectedViolations) => {
      timeline.violations.forEach((violation) => {
        if (violation.decision === null) {
          isAllModerated = false;
        }
      });
    });
    setIsModerated(isAllModerated);
  };

  const onValidatePasal = (timelineKey: number, pasalKey: number) => {
    timelines[timelineKey].violations[pasalKey].decision = true;
    setTimelines([...timelines]);
    checkIfAllModerated();
  };

  const onInvalidatePasal = (timelineKey: number, pasalKey: number) => {
    timelines[timelineKey].violations[pasalKey].decision = false;
    setTimelines([...timelines]);
    checkIfAllModerated();
  };

  const getStatusStyling = ((status: string) => {
    switch (status.toLowerCase()) {
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
          className: "bg-red-600 text-white",
          text: "Ditemukan Pelanggaran",
        };
      default:
        return {
          className: "bg-amber-500",
          text: "Belum Diproses",
        };
    }
  })(moderationData.status);

  return (
    <Link href={"/result/" + moderationData._id}>
      <div className="bg cursor-pointer rounded-md bg-white shadow-custom transition-shadow hover:shadow-lg">
        <div className="relative pt-[40%]">
          <div
            className="absolute top-0 bottom-0 left-0 right-0 rounded-t-md bg-slate-200 bg-cover"
            style={{
              backgroundImage: `url(https://kpid-jatim.storage.googleapis.com/${encodeURI(
                !isNilOrEmpty(moderationData?.frames) &&
                  moderationData?.frames[moderationData?.frames.length / 2]
              )})`,
            }}
          ></div>
          <div
            className={
              "absolute top-4 right-4 rounded-lg py-2 px-4 text-sm tracking-wide " +
              getStatusStyling.className
            }
          >
            {getStatusStyling.text}
          </div>
          <div className="hidden flex-wrap justify-end gap-1 text-sm md:absolute md:bottom-4 md:right-4 md:flex lg:text-base 2xl:gap-2">
            <span className="rounded-full bg-slate-700 bg-opacity-75 py-0.5 px-2 text-white">
              SARA
            </span>
            <span className="rounded-full bg-slate-700 bg-opacity-75 py-0.5 px-2 text-white">
              SARU
            </span>
            <span className="rounded-full bg-slate-700 bg-opacity-75 py-0.5 px-2 text-white">
              SADIS
            </span>
            <span className="rounded-full bg-slate-700 bg-opacity-75 py-0.5 px-2 text-white">
              SIHIR
            </span>
            <span className="rounded-full bg-slate-700 bg-opacity-75 py-0.5 px-2 text-white">
              Siaran Partisan
            </span>
          </div>
        </div>
        <div className="py-2 px-4 text-sm md:py-4 md:px-6 lg:text-base">
          <div className="flex flex-wrap gap-1 text-sm md:hidden">
            <span className="rounded-full bg-slate-700 bg-opacity-75 py-0.5 px-2 text-white">
              SARA
            </span>
            <span className="rounded-full bg-slate-700 bg-opacity-75 py-0.5 px-2 text-white">
              SARU
            </span>
            <span className="rounded-full bg-slate-700 bg-opacity-75 py-0.5 px-2 text-white">
              SADIS
            </span>
            <span className="rounded-full bg-slate-700 bg-opacity-75 py-0.5 px-2 text-white">
              SIHIR
            </span>
            <span className="rounded-full bg-slate-700 bg-opacity-75 py-0.5 px-2 text-white">
              Siaran Partisan & Ilegal
            </span>
          </div>
          <h4 className="mt-2 mb-2 font-semibold md:mt-0">
            {moderationData.filename}
          </h4>
          <div>
            <span className="flex flex-col flex-wrap gap-1 md:flex-row md:items-center">
              <span className="grid grid-cols-8 border-slate-400 md:flex md:gap-2 md:border-r-2 md:px-2">
                <span className="flex items-center justify-center">
                  <FontAwesomeIcon icon={faTelevision} height="12px" />
                </span>
                <span className="col-span-7">
                  {" "}
                  {moderationData.station_name}
                </span>
              </span>
              <span className="grid grid-cols-8 border-slate-400 md:flex md:gap-2 md:border-r-2 md:px-2">
                <span className="flex items-center justify-center">
                  <FontAwesomeIcon icon={faPenToSquare} height="12px" />
                </span>
                <span className="col-span-7">
                  {moderationData.program_name}
                </span>
              </span>
              <span className="grid grid-cols-8 md:flex md:gap-2 md:px-2 ">
                <span className="flex items-center justify-center">
                  <FontAwesomeIcon icon={faClock} height="12px" />
                </span>
                <span className="col-span-7">
                  {moderationData.start_time} - {moderationData.end_time}
                </span>
              </span>
            </span>
          </div>
          <Divider className="m-0 my-2 bg-slate-200"></Divider>
          <p>
            {isNilOrEmpty(moderationData?.description)
              ? "No description"
              : moderationData?.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default ResultCard;
