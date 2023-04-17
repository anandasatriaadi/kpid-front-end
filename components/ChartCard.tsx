import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer, Tooltip, XAxis,
  YAxis
} from "recharts";

interface Props {
  chartData: { key1: string; key2?: string; title: string; data: any[] };
  title: string;
}

function ChartCard(props: Props) {
  const { chartData, title } = props;

  return (
    <div className="flex h-full w-full flex-col">
      <h2 className="mb-4 px-6 pt-6 text-lg font-bold">{title}</h2>
      <div className="flex-1 p-6">
        {chartData?.key1 !== undefined && chartData?.key2 !== undefined && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData.data}
              margin={{
                left: -22,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" xAxisId={0} />
              <XAxis dataKey="name" xAxisId={1} hide />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={chartData.key1} xAxisId={0} fill="#0285c7" />
              <Bar dataKey={chartData.key2} xAxisId={1} fill="#075985" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      {/* <div className="relative grow">
        <div className="absolute top-0 right-0 bottom-0 left-0 w-full p-6">
        </div>
      </div> */}
    </div>
  );
}

export default ChartCard;
