import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  getApplicationAnalytics,
  getHourlyAnalytics,
} from "../services/metricService";

import { getApplications } from "../services/applicationService";

import type { ApiMetricAnalytics } from "../types/analytics";
import type { Application } from "../types/application";
import type { HourlyAnalytics } from "../types/hourlyAnalytics";

function Dashboard() {

  const [applications, setApplications] =
    useState<Application[]>([]);

  const [selectedApplicationId, setSelectedApplicationId] =
    useState<number | null>(null);

  const [analytics, setAnalytics] =
    useState<ApiMetricAnalytics | null>(null);

  const [hourlyData, setHourlyData] =
    useState<HourlyAnalytics[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  // Load applications
  useEffect(() => {

    const loadApplications = async () => {

      try {

        const data = await getApplications();

        setApplications(data);

        if (data.length > 0) {
          setSelectedApplicationId(data[0].id);
        }

      } catch (error) {

        console.error(error);

        setError("Failed to load applications");
      }
    };

    loadApplications();

  }, []);


  // Load analytics when application changes
  useEffect(() => {

    if (selectedApplicationId === null) {
      return;
    }

    const loadAnalytics = async () => {

      try {

        setLoading(true);
        setError(null);

        // Overall analytics
        const data =
          await getApplicationAnalytics(
            selectedApplicationId
          );

        setAnalytics(data);


        // Hourly analytics
        const from =
          "2026-08-12T00:00:00";

        const to =
          "2026-08-12T23:59:59";

        const hourly =
          await getHourlyAnalytics(
            selectedApplicationId,
            from,
            to
          );

        setHourlyData(hourly);

      } catch (error) {

        console.error(error);

        setError("Failed to load analytics");

      } finally {

        setLoading(false);
      }
    };

    loadAnalytics();

  }, [selectedApplicationId]);


  if (error) {
    return (
      <p className="text-red-600">
        {error}
      </p>
    );
  }


  return (
    <div>

      {/* ================= HEADER ================= */}

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            PulseWatch Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Monitor your API performance and application health.
          </p>

        </div>


        {/* Application Selector */}

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Application
          </label>

          <select
            value={selectedApplicationId ?? ""}
            onChange={(event) =>
              setSelectedApplicationId(
                Number(event.target.value)
              )
            }
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 outline-none focus:border-slate-500"
          >

            {applications.map((application) => (

              <option
                key={application.id}
                value={application.id}
              >
                {application.applicationName}
              </option>

            ))}

          </select>

        </div>

      </div>


      {/* ================= LOADING ================= */}

      {loading && (
        <p className="text-slate-500">
          Loading analytics...
        </p>
      )}


      {/* ================= ANALYTICS CARDS ================= */}

      {!loading && analytics && (

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          {/* Total Requests */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Total Requests
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {analytics.totalRequests}
            </h2>

          </div>


          {/* Average Response Time */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Avg Response Time
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {analytics.averageResponseTime.toFixed(2)} ms
            </h2>

          </div>


          {/* Error Rate */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Error Rate
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">

              {analytics.totalRequests > 0
                ? (
                    analytics.errorCount /
                    analytics.totalRequests *
                    100
                  ).toFixed(2)
                : "0.00"
              }%

            </h2>

          </div>

        </div>

      )}


      {/* ================= RESPONSE TIME ================= */}

      {!loading && hourlyData.length > 0 && (

        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-xl font-semibold text-slate-900">
            Response Time
          </h2>

          <div className="h-80">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart data={hourlyData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="time"
                  label={{
                    value: "Time",
                    position: "insideBottom",
                    offset: -5,
                  }}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )
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

      )}


      {/* ================= REQUEST VOLUME ================= */}

      {!loading && hourlyData.length > 0 && (

        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-xl font-semibold text-slate-900">
            Request Volume
          </h2>

          <div className="h-80">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart data={hourlyData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="time"
                  label={{
                    value: "Time",
                    position: "insideBottom",
                    offset: -5,
                  }}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )
                  }
                />

                <YAxis
                  label={{
                    value: "Request Count",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="requestCount"
                  name="Requests"
                  stroke="#16a34a"
                  strokeWidth={2}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

      )}


      {/* ================= ERROR TREND ================= */}

      {!loading && hourlyData.length > 0 && (

        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-xl font-semibold text-slate-900">
            Error Trend
          </h2>

          <div className="h-80">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart data={hourlyData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="time"
                  label={{
                    value: "Time",
                    position: "insideBottom",
                    offset: -5,
                  }}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )
                  }
                />

                <YAxis
                  label={{
                    value: "Error Count",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />

                <Tooltip />

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

      )}

    </div>
  );
}

export default Dashboard;