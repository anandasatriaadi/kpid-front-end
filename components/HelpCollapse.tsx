import {
  ApplicationContext,
  ApplicationContextInterface,
} from "@/context/ApplicationContext";
import { Button, Collapse, Skeleton, Steps, Timeline } from "antd";
import Image from "next/image";
import * as React from "react";
import Lightbox, { SlideImage } from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

type HelpCollapseProps = {
  title: string;
  steps: {
    title: string;
    image: string;
    description: React.ReactNode[];
  }[];
};

function HelpCollapse({ title, steps }: HelpCollapseProps) {
  const { isMobile } = React.useContext(
    ApplicationContext
  ) as ApplicationContextInterface;

  const [lightboxOpen, setLightboxOpen] = React.useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = React.useState<number>(0);
  const [currentUploadStep, setCurrentUploadStep] = React.useState<number>(0);

  const images = steps.map((step) => {
    let image: SlideImage = { src: step.image };
    return image;
  });

  return (
    <Collapse className="custom-panel">
      <Collapse.Panel
        className="text-base"
        header={<h2 className="font-semibold">{title}</h2>}
        key={1}
      >
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
        <section className="grid grid-cols-1 xl:grid-cols-4">
          <div>
            <Steps
              items={steps.map((val) => {
                return isMobile ? { title: "" } : { title: val.title };
              })}
              current={currentUploadStep}
              onChange={(current) => {
                setCurrentUploadStep(current);
              }}
              size="small"
              direction={isMobile ? "horizontal" : "vertical"}
              responsive={false}
              className="mb-4 md:mb-0"
            />
          </div>
          <div className="xl:col-span-3">
            <div className="font-semibold xl:hidden mb-2">
              {steps[currentUploadStep].title}
            </div>
            <div
              className="relative mb-2 overflow-hidden rounded-lg bg-cover bg-no-repeat pt-[56%] hover:cursor-pointer"
              onClick={() => {
                setLightboxIndex(currentUploadStep);
                setLightboxOpen(true);
              }}
            >
              <Skeleton.Image
                active
                className="absolute top-0 left-0 right-0 bottom-0 h-full w-full"
              />
              <Image
                src={steps[currentUploadStep].image}
                alt={steps[currentUploadStep].title}
                sizes="(max-width: 1280px) 100vw, 50vw)"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="mt-4 text-justify font-normal">
              <Timeline>
                {steps[currentUploadStep].description.map((val, index) => {
                  return <Timeline.Item key={index}>{val}</Timeline.Item>;
                })}
              </Timeline>
            </div>
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => {
                  setCurrentUploadStep(Math.max(currentUploadStep - 1, 0));
                }}
              >
                Sebelumnya
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setCurrentUploadStep(
                    Math.min(currentUploadStep + 1, steps.length - 1)
                  );
                }}
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        </section>
      </Collapse.Panel>
    </Collapse>
  );
}

export default HelpCollapse;
