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

interface ErrorTrendChartProps {
  data: HourlyAnalytics[];
   isDaily?: boolean;
}

function ErrorTrendChart({
  data,
  isDaily = false,
}: ErrorTrendChartProps) {

  return (
    <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold text-slate-900">
        Error Trend
      </h2>

      <div className="h-80">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
  dataKey="time"
  label={{
    value: isDaily ? "Date" : "Time",
    position: "insideBottom",
    offset: -5,
  }}
  tickFormatter={(value) => {

    const date = new Date(String(value));

    if (isDaily) {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
    }

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }}
/>

            <YAxis
              label={{
                value: "Error Count",
                angle: -90,
                position: "insideLeft",
              }}
            />

<Tooltip
  labelFormatter={(value) => {
    const date = new Date(String(value));

    if (isDaily) {
      return date.toLocaleDateString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    return date.toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }}
  formatter={(value) => [
    `${Number(value)} errors`,
    "Errors",
  ]}
/>
            <Line
              type="monotone"
              dataKey="errorCount"
              name="Errors"
              stroke="#dc2626"
              strokeWidth={2}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default ErrorTrendChart;