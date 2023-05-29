import {
  ApplicationContext,
  ApplicationContextInterface,
} from "@/context/ApplicationContext";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Skeleton } from "antd";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import * as React from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  chartData: { labels: string[]; datasets: any[] };
  title: string;
}

function BarChartCard({ chartData, title }: Props) {
  //#region ::: Variable Initialisations
  // Context
  const { isMobile } = React.useContext(
    ApplicationContext
  ) as ApplicationContextInterface;

  // Chart Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
    },
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: false,
        text: title,
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          beginAtZero: true,
          autoSkip: true,
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        stacked: false,
      },
    },
  };
  //#endregion ::: Variable Initialisations

  //

  //#region ::: Handlers
  //#endregion ::: Handlers

  //

  //#region ::: Other Methods
  ChartJS.defaults.font.size = isMobile ? 14 : 16;
  //#endregion ::: Other Methods

  //

  //#region ::: UseEffect
  //#endregion ::: UseEffect

  return (
    <div className="flex h-full w-full flex-1 flex-col">
      <h2 className="mb-4 px-4 pt-2 text-base font-semibold md:px-4 md:pt-4">
        {title}
      </h2>
      {chartData?.datasets?.length != undefined &&
      chartData?.datasets?.length > 0 ? (
        <div className="relative max-h-full flex-1 px-4 pb-2 md:px-4 md:pb-4">
          <Bar options={chartOptions} data={chartData} />
        </div>
      ) : (
        <div className="relative mx-6 mb-6 flex-1 overflow-hidden rounded-lg">
          <Skeleton.Node
            className="absolute top-0 right-0 bottom-0 left-0 h-full w-full"
            active
          >
            <FontAwesomeIcon
              icon={faChartSimple}
              className="flex h-[40px] w-[40px] items-center justify-center text-neutral-400"
            />
          </Skeleton.Node>
        </div>
      )}
    </div>
  );
}

export default BarChartCard;
