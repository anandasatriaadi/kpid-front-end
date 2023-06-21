import ModerationDecision from "@/types/ModerationDecision";
import ModerationResult from "@/types/ModerationResult";
import PasalResponse from "@/types/PasalResponse";
import { Button, Collapse, Tabs } from "antd";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { Tab } from "rc-tabs/lib/interface";
import * as React from "react";

type ViolationPanelProps = {
  key: number;
  moderationResult: ModerationResult;
  pasalData: { [key: string]: PasalResponse[] };
  pasalValidationHandler: (index: number, decision: ModerationDecision) => void;
};

function ViolationPanel({
  key,
  moderationResult,
  pasalData,
  pasalValidationHandler,
}: ViolationPanelProps) {
  const [isChanging, setIsChanging] = React.useState(false);

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

  const hours = Math.floor(moderationResult.second / 3600);
  const minutes = Math.floor((moderationResult.second % 3600) / 60);
  const remainingSeconds = Math.round(moderationResult.second % 60);
  const timestamp = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;

  return (
    <Collapse.Panel
      className="text-base"
      header={
        <div className="flex items-center justify-between">
          <p>Pada {timestamp}</p>
          {moderationResult.decision?.toUpperCase() != "PENDING" ? (
            moderationResult.decision?.toUpperCase() == "VALID" ? (
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
      key={key}
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
                }.storage.googleapis.com/${encodeURI(
                  moderationResult.clip_url
                )}`}
              ></video>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-4">
            {moderationResult.decision.toUpperCase() === "PENDING" ||
            isChanging ? (
              <>
                {isChanging && (
                  <Button
                    type="default"
                    onClick={(e) => {
                      setIsChanging(false);
                    }}
                  >
                    Batalkan
                  </Button>
                )}
                <Button
                  type="default"
                  onClick={(e) => {
                    setIsChanging(false);
                    pasalValidationHandler(key, ModerationDecision.INVALID);
                  }}
                >
                  Tidak Valid
                </Button>
                <Button
                  type="primary"
                  onClick={(e) => {
                    setIsChanging(false);
                    pasalValidationHandler(key, ModerationDecision.VALID);
                  }}
                >
                  Valid
                </Button>
              </>
            ) : (
              <Button
                type="default"
                onClick={(e) => {
                  setIsChanging(true);
                }}
              >
                Ubah
              </Button>
            )}
          </div>
        </div>
        <div className="mt-4 lg:ml-4 lg:mt-0 lg:mb-0 lg:flex-[3]">
          <div className="mb-4 flex gap-4">
            <h3 className="text-lg font-semibold">Dugaan Pelanggaran</h3>
          </div>
          <Tabs
            type="card"
            className="mb-4"
            items={RenderViolationTabs(moderationResult)}
          />
        </div>
      </div>
    </Collapse.Panel>
  );
}

export default ViolationPanel;
