import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type { HourlyAnalytics } from "../../types/hourlyAnalytics";

interface ResponseTimeChartProps {
  data: HourlyAnalytics[];
}

function ResponseTimeChart({
  data,
}: ResponseTimeChartProps) {

  return (
    <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold text-slate-900">
        Response Time
      </h2>

      <div className="h-80">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="time"
              label={{
                value: "Time",
                position: "insideBottom",
                offset: -5,
              }}
              tickFormatter={(value) =>
                new Date(value).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }
            />

            <YAxis
              label={{
                value: "Average Response Time (ms)",
                angle: -90,
                position: "insideLeft",
              }}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="averageResponseTime"
              name="Average Response Time"
              stroke="#2563eb"
              strokeWidth={2}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default ResponseTimeChart;