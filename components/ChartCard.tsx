import {
  ApplicationContext,
  ApplicationContextInterface,
} from "@/context/ApplicationContext";
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

function ChartCard(props: Props) {
  const { isMobile } = React.useContext(
    ApplicationContext
  ) as ApplicationContextInterface;
  const { chartData, title } = props;
  ChartJS.defaults.font.size = isMobile ? 14 : 16;
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

  return (
    <div className="flex h-full w-full flex-1 flex-col">
      <h2 className="mb-4 px-4 pt-4 text-lg font-bold md:px-6 md:pt-6">
        {title}
      </h2>
      <div className="relative max-h-full flex-1 px-4 pb-2 md:px-6 md:pb-4">
        <Bar options={chartOptions} data={chartData} />
      </div>
    </div>
  );
}

export default ChartCard;
