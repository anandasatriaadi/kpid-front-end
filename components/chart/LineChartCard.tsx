import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  ApplicationContext,
  ApplicationContextInterface,
} from "@/context/ApplicationContext";
import { Skeleton } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface Props {
  chartData?: { labels: string[]; datasets: any[] };
  title: string;
}

function LineChartCard({ chartData, title }: Props) {
  // Context
  const { isMobile } = React.useContext(
    ApplicationContext
  ) as ApplicationContextInterface;

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
      scales: {
        x: {
          ticks: {
            beginAtZero: true,
            autoSkip: true,
            maxRotation: 0,
            minRotation: 0,
          },
        },
      },
    },
  };

  ChartJS.defaults.font.size = isMobile ? 14 : 16;

  return (
    <div className="flex h-full w-full flex-1 flex-col">
      <h2 className="mb-4 px-4 pt-2 text-base font-semibold md:px-4 md:pt-4">
        {title}
      </h2>
      {chartData?.datasets?.length != undefined &&
      chartData?.datasets?.length > 0 ? (
        <div className="relative max-h-full flex-1 px-4 pb-2 md:px-4 md:pb-4">
          <Line options={chartOptions} data={chartData} />
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

export default LineChartCard;
