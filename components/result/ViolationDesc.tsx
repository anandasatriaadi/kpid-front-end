import ModerationDecision from "@/types/ModerationDecision";
import ModerationResponse from "@/types/ModerationResponse";
import ModerationResult from "@/types/ModerationResult";
import PasalResponse from "@/types/PasalResponse";
import { Button, Collapse, Tabs } from "antd";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { Tab } from "rc-tabs/lib/interface";

type ViolationDescProps = {
  moderationData: ModerationResponse;
  pasalData: { [key: string]: PasalResponse[] };
  pasalValidationHandler: (index: number, decision: ModerationDecision) => void;
};

function ViolationDesc({
  moderationData,
  pasalData,
  pasalValidationHandler,
}: ViolationDescProps) {
  //#region ::: Variable Initialisations
  //#endregion ::: Variable Initialisations

  //

  //#region ::: Handlers
  //#endregion ::: Handlers

  //

  //#region ::: Renderers
  // Render the Violations Tabs (Daftar Pelanggaran)
  const RenderViolationTabs = (result: ModerationResult) => {
    let responses = result.category.map((item: string, index: any) => {
      let idx: string = index.toString();
      let response: Tab = {
        key: idx,
        label: (
          <span className="flex items-center">
            {String(item).replace("_", " ")}
          </span>
        ),
        children: (
          <Collapse className="custom-panel">
            <>
              {pasalData[item.toLowerCase()] !== undefined &&
                pasalData[item.toLowerCase()].map((pasal, pIndex) => {
                  return (
                    <Collapse.Panel
                      header={`${pIndex + 1}. Pasal ${pasal.pasal} BAB ${
                        pasal.chapter
                      } Tahun 2012`}
                      key={pIndex}
                    >
                      <div className="kpid-pasal-list">
                        {parse(DOMPurify.sanitize(pasal.description))}
                      </div>
                    </Collapse.Panel>
                  );
                })}
            </>
          </Collapse>
        ),
      };
      return response;
    });
    return responses;
  };
  //#endregion ::: Renderers

  //

  //#region ::: UseEffect
  //#endregion ::: UseEffect

  if (
    moderationData?.result === undefined ||
    moderationData?.result.length === 0
  )
    return <></>;

  return (
    <Collapse className="custom-panel rounded-b-lg font-normal">
      {moderationData.result.map((item: ModerationResult, index: number) => {
        const hours = Math.floor(item.second / 3600);
        const minutes = Math.floor((item.second % 3600) / 60);
        const remainingSeconds = Math.round(item.second % 60);
        const timestamp = `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
        return (
          <Collapse.Panel
            className="text-base"
            header={
              <div className="flex items-center justify-between">
                <p>Pada {timestamp}</p>
                {item.decision?.toUpperCase() != "PENDING" ? (
                  item.decision?.toUpperCase() == "VALID" ? (
                    <div className="ml-2 rounded-lg bg-lime-500 px-2 py-0.5 text-sm font-semibold text-white">
                      Valid
                    </div>
                  ) : (
                    <div className="ml-2 rounded-lg bg-red-600 px-2 py-0.5 text-sm font-semibold text-white">
                      Tidak Valid
                    </div>
                  )
                ) : (
                  <div className="ml-2 rounded-lg bg-yellow-600 px-2 py-0.5 text-sm font-semibold text-white">
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
                      src={`https://${
                        process.env.NEXT_PUBLIC_BUCKET_NAME
                      }.storage.googleapis.com/${encodeURI(item.clip_url)}`}
                    ></video>
                  </div>
                </div>
                {item.decision.toUpperCase() === "PENDING" && (
                  <div className="mt-4 flex justify-end gap-4">
                    <Button
                      type="default"
                      onClick={(e) => {
                        pasalValidationHandler(
                          index,
                          ModerationDecision.INVALID
                        );
                      }}
                    >
                      Tidak Valid
                    </Button>
                    <Button
                      type="primary"
                      onClick={(e) => {
                        pasalValidationHandler(index, ModerationDecision.VALID);
                      }}
                    >
                      Valid
                    </Button>
                  </div>
                )}
              </div>
              <div className="mt-4 lg:ml-4 lg:mt-0 lg:mb-0 lg:flex-[3]">
                <div className="mb-4 flex gap-4">
                  <h3 className="text-lg font-semibold">Dugaan Pelanggaran</h3>
                </div>
                <Tabs
                  type="card"
                  className="mb-4"
                  items={RenderViolationTabs(item)}
                />
              </div>
            </div>
          </Collapse.Panel>
        );
      })}
    </Collapse>
  );
}

export default ViolationDesc;
