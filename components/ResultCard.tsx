import { Button, Collapse, Skeleton, Timeline } from "antd";
import { useState } from "react";

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

function ResultCard() {
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

  return (
    <div className="mt-4 p-4 rounded-md shadow-lg border-2 border-gray-100">
      <h4 className="font-semibold">BBS TV_1825_Acara TV.mp4</h4>
      <div className="flex mt-2 text-center">
        <div className="flex flex-col items-center pl-0 pr-2 border-r-2 border-gray-100 last:border-0">
          <p className="text-sm text-gray-500">Jam Mulai</p>
          <p className="font-semibold">18:25:00</p>
        </div>
        <div className="flex flex-col items-center pl-2 pr-2 border-r-2 border-gray-100 last:border-0">
          <p className="text-sm text-gray-500">Jam Selesai</p>
          <p className="font-semibold">18:25:15</p>
        </div>
        <div className="flex flex-col items-center pl-2 pr-2 border-r-2 border-gray-100 last:border-0">
          <p className="text-sm text-gray-500">Durasi</p>
          <p className="font-semibold">15 detik</p>
        </div>
        <div className="flex flex-col items-center pl-2 pr-2 border-r-2 border-gray-100 last:border-0">
          <p className="text-sm text-gray-500">FPS</p>
          <p className="font-semibold">30</p>
        </div>
        <div className="flex flex-col items-center pl-2 pr-0 border-r-2 border-gray-100 last:border-0">
          <p className="text-sm text-gray-500">Konten Terdeteksi</p>
          <p className="font-semibold">1</p>
        </div>
      </div>
      <div className="mt-4">
        <Collapse onChange={onChange}>
          <Collapse.Panel header="Lihat Detail" key="1">
            {loaded ? (
              <Timeline>
                {timelines.map((item: detectedViolations, index: number) => (
                  <Timeline.Item key={index}>
                    <p className="">
                      Detik {item.second} | {item.time}
                    </p>
                    <div className="flex flex-col sm:flex-row mt-2 mb-2">
                      <div className="sm:flex-1">
                        <div
                          className="pt-[52%] relative bg-center bg-cover"
                          style={{
                            backgroundImage: `url(${item.image})`,
                          }}
                        >
                          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                        </div>
                      </div>
                      <div className="sm:flex-1 lg:flex-[2] sm:ml-4 mt-2 sm:mt-0 mb-4 sm:mb-0">
                        <h3 className="font-semibold">Dugaan Pelanggaran</h3>
                        <ol className="list-decimal list-inside">
                          {item.violations.map((violation, vIndex) => {
                            console.log(violation.decision);
                            return (
                              <li className="font-semibold mt-2" key={vIndex}>
                                {violation.pasal}
                                {violation.decision != null &&
                                  (violation.decision ? (
                                    <Button
                                      type="dashed"
                                      className="button-green ml-2"
                                    >
                                      Valid
                                    </Button>
                                  ) : (
                                    <Button
                                      className="ml-2"
                                      type="dashed"
                                      danger
                                    >
                                      Invalid
                                    </Button>
                                  ))}
                                <div>
                                  <p
                                    className="font-normal"
                                    dangerouslySetInnerHTML={{
                                      __html: violation.deskripsi,
                                    }}
                                  ></p>
                                </div>
                                {violation.decision === null ? (
                                  <div className="flex justify-end mt-2">
                                    <Button
                                      type="primary"
                                      className="button-green mr-4"
                                      onClick={(e) => {
                                        onValidatePasal(index, vIndex);
                                      }}
                                    >
                                      Valid
                                    </Button>
                                    <Button
                                      type="primary"
                                      danger
                                      onClick={(e) => {
                                        onInvalidatePasal(index, vIndex);
                                      }}
                                    >
                                      Invalid
                                    </Button>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </li>
                            );
                          })}
                        </ol>
                      </div>
                    </div>
                  </Timeline.Item>
                ))}
                {isModerated ? (
                  <div className="flex justify-end mt-2">
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
              </Timeline>
            ) : (
              <Skeleton active />
            )}
          </Collapse.Panel>
        </Collapse>
      </div>
    </div>
  );
}

export default ResultCard;
