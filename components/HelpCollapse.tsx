import {
  ApplicationContext,
  ApplicationContextInterface,
} from "@/context/ApplicationContext";
import { Collapse, Steps, Timeline } from "antd";
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
            <li className="font-semibold">
              <div className="gap-4">
                <div
                  className="relative mb-2 overflow-hidden rounded-lg bg-slate-300 bg-cover bg-no-repeat pt-[177%] hover:cursor-pointer md:pt-[56%]"
                  onClick={() => {
                    setLightboxIndex(currentUploadStep);
                    setLightboxOpen(true);
                  }}
                >
                  <Image
                    src={steps[currentUploadStep].image}
                    alt={steps[currentUploadStep].title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="mt-6 text-justify font-normal">
                  <Timeline>
                    {steps[currentUploadStep].description.map((val, index) => {
                      return <Timeline.Item key={index}>{val}</Timeline.Item>;
                    })}
                  </Timeline>
                </div>
              </div>
            </li>
          </div>
        </section>
      </Collapse.Panel>
    </Collapse>
  );
}

export default HelpCollapse;
