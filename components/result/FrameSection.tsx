import FrameResult from "@/types/FrameResult";
import ModerationResponse from "@/types/ModerationResponse";
import { isNil } from "@/utils/BooleanUtil";
import { Collapse } from "antd";
import Image from "next/image";
import * as React from "react";
import Lightbox, { SlideImage } from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

type FrameSectionProps = {
  data: ModerationResponse;
  className?: string;
};

function FrameSection({ data, className }: FrameSectionProps) {
  //#region ::: Variable Initialisations
  const [images, setImages] = React.useState<SlideImage[]>([]);
  const [lightboxOpen, setLightboxOpen] = React.useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = React.useState<number>(0);
  const [framesToShow, setFramesToShow] = React.useState<FrameResult[]>([]);
  const [resultMapping, setResultMapping] = React.useState<{
    [key: number]: boolean;
  }>({});
  //#endregion ::: Variable Initialisations

  //

  //#region ::: Handlers
  //#endregion ::: Handlers

  //

  //#region ::: Other Methods
  // Set the frames to show, equally thoughout the video
  const divideAndSetFrames = (inputData: ModerationResponse) => {
    let tempFrames: FrameResult[] = [];
    if (inputData?.frames !== undefined && inputData?.frames !== null) {
      if (inputData.frames.length > 20) {
        let step =
          inputData?.frames !== undefined
            ? Math.floor(inputData.frames.length / 20)
            : 0;
        tempFrames = inputData.frames.reduce(
          (acc: FrameResult[], curr, index) => {
            if (acc.length === 20) {
              return acc;
            }
            if (index % step === 0) {
              acc.push(curr);
            }
            return acc;
          },
          []
        );
      } else {
        tempFrames = inputData.frames;
      }
    }
    setFramesToShow(tempFrames);
    setImages(
      tempFrames.map((frame) => {
        let image: SlideImage = { src: `https://${
          process.env.NEXT_PUBLIC_BUCKET_NAME
        }.storage.googleapis.com/${encodeURI(
          frame.frame_url
        )}` };
        return image;
      })
    );
  };

  const getResultMapping = (inputData: ModerationResponse) => {
    let tempResultMapping: { [key: number]: boolean } = {};
    if (
      inputData?.result !== undefined &&
      inputData?.result !== null &&
      inputData?.result.length > 0
    ) {
      inputData.result.forEach((result) => {
        tempResultMapping[result.second] = true;
      });
    }
    setResultMapping(tempResultMapping);
  };
  //#endregion ::: Other Methods

  //

  //#region ::: UseEffect
  React.useEffect(() => {
    divideAndSetFrames(data);
    getResultMapping(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion ::: UseEffect

  return (
    <section className={className}>
      <Lightbox
        styles={{
          root: { "--yarl__color_backdrop": "rgba(0, 0, 0, 0.7)" },
        }}
        plugins={[Zoom]}
        open={lightboxOpen}
        index={lightboxIndex}
        close={() => setLightboxOpen(false)}
        slides={images}
      />
      <Collapse defaultActiveKey="1" ghost>
        <Collapse.Panel
          header="Potongan Frame Video"
          key="1"
          className="text-base font-semibold md:text-lg"
        >
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {framesToShow.map((frame_data: FrameResult, index: number) => {
              const hours = Math.floor(frame_data.frame_time / 3600);
              const minutes = Math.floor((frame_data.frame_time % 3600) / 60);
              const remainingSeconds = Math.round(frame_data.frame_time % 60);
              const timestamp = `${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}:${remainingSeconds
                .toString()
                .padStart(2, "0")}`;
              return (
                <div
                  key={index}
                  className="relative cursor-pointer bg-cover pt-[56.25%]"
                  onClick={() => {
                    setLightboxIndex(index);
                    setLightboxOpen(true);
                  }}
                >
                  <Image
                    src={`https://${
                      process.env.NEXT_PUBLIC_BUCKET_NAME
                    }.storage.googleapis.com/${encodeURI(
                      frame_data.frame_url
                    )}`}
                    alt={data?.filename}
                    objectFit="cover"
                    layout="fill"
                  ></Image>
                  <div
                    className={
                      "absolute bottom-0 left-0 rounded-tr-lg bg-opacity-75 p-1 text-sm font-normal text-white " +
                      (isNil(resultMapping[frame_data.frame_time])
                        ? "bg-slate-700"
                        : "bg-red-600")
                    }
                  >
                    {timestamp}
                  </div>
                </div>
              );
            })}
          </div>
          {data?.frames !== undefined &&
            data?.frames !== null &&
            data?.frames.length > 20 && (
              <p className="mt-4 text-right text-base font-normal opacity-70">
                dan {data?.frames.length - 20} potongan frame lainnya.
              </p>
            )}
        </Collapse.Panel>
      </Collapse>
    </section>
  );
}

export default FrameSection;
