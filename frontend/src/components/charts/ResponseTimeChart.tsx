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
  isDaily?: boolean;
}

function ResponseTimeChart({
  data,
  isDaily = false,
}: ResponseTimeChartProps) {

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold text-slate-900">
        Response Time
      </h2>

      <div className="h-80">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart data={data}>

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="time"
              label={{
                value: isDaily
                  ? "Date"
                  : "Time",
                position: "insideBottom",
                offset: -5,
              }}
              tickFormatter={(value) => {

                const date =
                  new Date(String(value));

                if (isDaily) {

                  return date.toLocaleDateString(
                    [],
                    {
                      month: "short",
                      day: "numeric",
                    }
                  );
                }

                return date.toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                );
              }}
            />

            <YAxis
              label={{
                value:
                  "Average Response Time (ms)",
                angle: -90,
                position: "insideLeft",
              }}
            />

           <Tooltip
  labelFormatter={(value) => {

    const date =
      new Date(String(value));

    if (isDaily) {

      return date.toLocaleDateString(
        [],
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      );
    }

    return date.toLocaleString(
      [],
      {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }}
  formatter={(value) => {

    if (value === null) {
      return [
        "No data",
        "Average Response Time",
      ];
    }

    return [
      `${Number(value).toFixed(2)} ms`,
      "Average Response Time",
    ];
  }}
/>

            <Line
              type="monotone"
              dataKey="averageResponseTime"
              name="Average Response Time"
              stroke="#2563eb"
              strokeWidth={2}
              connectNulls={false}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default ResponseTimeChart;