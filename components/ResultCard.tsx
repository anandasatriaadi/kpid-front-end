import { Button, Collapse, Skeleton, Timeline, Tooltip } from "antd";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMarsAndVenusBurst,
  faGhost,
  faHandHoldingHeart,
  faHandsPraying,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { randomInt, randomUUID } from "crypto";

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
// ,
//   {
//     second: 376,
//     time: "13:06:16",
//     image: "https://picsum.photos/800/1001",
//     violations: [
//       {
//         pasal: "UU. XX Pasal XX BAB XX Tahun 2012",
//         deskripsi:
//           "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Suscipit tenetur fugiat eius asperiores quia error magnam officia necessitatibus cupiditate ratione!",
//         decision: null,
//       },
//       {
//         pasal: "UU. XX Pasal XX BAB XX Tahun 2012",
//         deskripsi:
//           "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquam nisi cupiditate tenetur voluptates perferendis deserunt veniam unde? Assumenda nulla eum mollitia culpa, possimus quibusdam qui.",
//         decision: null,
//       },
//     ],
//   },
//   {
//     second: 376,
//     time: "13:06:16",
//     image: "https://picsum.photos/800/1002",
//     violations: [
//       {
//         pasal: "UU. XX Pasal XX BAB XX Tahun 2012",
//         deskripsi:
//           "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Suscipit tenetur fugiat eius asperiores quia error magnam officia necessitatibus cupiditate ratione!",
//         decision: null,
//       },
//       {
//         pasal: "UU. XX Pasal XX BAB XX Tahun 2012",
//         deskripsi:
//           "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquam nisi cupiditate tenetur voluptates perferendis deserunt veniam unde? Assumenda nulla eum mollitia culpa, possimus quibusdam qui.",
//         decision: null,
//       },
//     ],
//   },

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

  const testStatus = props.index % 2 ? "uploaded" : "rejected";
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
          className: "bg-cyan-300",
          text: "Sedang Diproses",
        };
      case "approved":
        return {
          className: "bg-green-300",
          text: "Tidak Ditemukan Pelanggaran",
        };
      case "rejected":
        return {
          className: "bg-red-300",
          text: "Ditemukan Pelanggaran",
        };
      default:
        return {
          className: "bg-amber-300",
          text: "Belum Diproses",
        };
    }
  })();

  return (
    <div className="bg rounded-md border-2 border-gray-100 shadow-custom">
      <div className="relative pt-[56.25%]">
        <div className="absolute top-0 bottom-0 left-0 right-0 rounded-t-md bg-gray-400 opacity-70"></div>
        <div
          className={
            "absolute top-4 right-4 rounded-lg px-4 py-2 " +
            getStatusStyling.className
          }
        >
          {getStatusStyling.text}
        </div>
      </div>
      <div className="flex flex-col gap-4 p-4">
        <h4 className="font-semibold">BBS TV_1825_Acara TV.mp4</h4>
        <div className="flex gap-4">
          <Tooltip title="SARA">
            <FontAwesomeIcon
              icon={faHandsPraying}
              height="24px"
              className="text-2xl text-gray-900"
            />
            <p className="text-center font-bold">0</p>
          </Tooltip>
          <Tooltip title="SARU">
            <FontAwesomeIcon
              icon={faMarsAndVenusBurst}
              height="24px"
              className="text-2xl text-gray-900"
            />
            <p className="text-center font-bold">0</p>
          </Tooltip>
          <Tooltip title="SADIS">
            <FontAwesomeIcon
              icon={faHandHoldingHeart}
              height="24px"
              className="text-2xl text-gray-900"
            />
            <p className="text-center font-bold">0</p>
          </Tooltip>
          <Tooltip title="SIHIR">
            <FontAwesomeIcon
              icon={faGhost}
              height="24px"
              className="text-2xl text-gray-900"
            />
            <p className="text-center font-bold">0</p>
          </Tooltip>
          <Tooltip title="Siaran Partisan & Ilegal">
            <FontAwesomeIcon
              icon={faPeopleGroup}
              height="24px"
              className="text-2xl text-gray-900"
            />
            <p className="text-center font-bold">0</p>
          </Tooltip>
        </div>
        <Link href={"/result/" + "random_id_" + testStatus}>
          <Button type="primary" className="w-full">
            Lihat Detail
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default ResultCard;
