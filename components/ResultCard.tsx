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
  index: number;
};

function ResultCard(props: Props) {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [timelines, setTimelines] = useState<any>(timelineItem);
  const [isModerated, setIsModerated] = useState<boolean>(false);

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

  let testStatus = props.index % 2 ? "uploaded" : "rejected";
  const getStatusStyling = (() => {
    const status = testStatus;
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
          className: "bg-red-600 text-white",
          text: "Ditemukan Pelanggaran",
        };
      default:
        return {
          className: "bg-amber-500",
          text: "Belum Diproses",
        };
    }
  })();

  return (
    <Link href={"/result/" + "random_id_" + testStatus}>
      <div className="bg cursor-pointer rounded-md bg-white shadow-custom transition-shadow hover:shadow-lg">
        <div className="relative pt-[40%]">
          <div
            className="absolute top-0 bottom-0 left-0 right-0 rounded-t-md bg-slate-200 bg-cover"
            style={{
              backgroundImage: `url(https://kpid-jatim.storage.googleapis.com/moderation/63de2350984ddb64fc3d675f/frames/Have%20You%20Met%20a%20Hagfish_%20It%E2%80%99s%20About%20Slime%20_%20Deep%20Look_f180.jpg)`,
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
            BBS TV_1825_Acara TV.mp4
          </h4>
          <div>
            <span className="flex flex-col flex-wrap gap-1 md:flex-row md:items-center">
              <span className="grid grid-cols-8 ">
                <span className="flex items-center justify-center">
                  <FontAwesomeIcon icon={faTelevision} height="12px" />
                </span>
                <span className="col-span-7"> BBS TV</span>
                <Divider
                  type="vertical"
                  className="hidden bg-slate-300 md:block"
                />
              </span>
              <span className="grid grid-cols-8">
                <span className="flex items-center justify-center">
                  <FontAwesomeIcon icon={faPenToSquare} height="12px" />
                </span>
                <span className="col-span-7"> Acara TV</span>
                <Divider
                  type="vertical"
                  className="hidden bg-slate-300 md:block"
                />
              </span>
              <span className="grid grid-cols-8">
                <span className="flex items-center justify-center">
                  <FontAwesomeIcon icon={faClock} height="12px" />
                </span>
                <span className="col-span-7"> 18:15:00 - 19:00:15</span>
              </span>
            </span>
          </div>
          <Divider className="m-0 my-2 bg-slate-200"></Divider>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quibusdam
            animi quod fuga aperiam quasi qui?
          </p>
        </div>
      </div>
    </Link>
  );
}

export default ResultCard;
