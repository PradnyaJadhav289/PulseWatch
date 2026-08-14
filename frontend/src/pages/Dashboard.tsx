import { useEffect, useState } from "react";

import ResponseTimeChart from "../components/charts/ResponseTimeChart";
import RequestVolumeChart from "../components/charts/RequestVolumeChart";
import ErrorTrendChart from "../components/charts/ErrorTrendChart";

import {
  getApplicationAnalytics,
  getHourlyAnalytics,
} from "../services/metricService";

import { getApplications } from "../services/applicationService";

import type { ApiMetricAnalytics } from "../types/analytics";
import type { Application } from "../types/application";
import type { HourlyAnalytics } from "../types/hourlyAnalytics";

import MetricCard from "../components/MetricCard";



const getDateRange = (
  range: "today" | "24h" | "7d"
) => {

  const now = new Date();

  const to = new Date(now);

  const from = new Date(now);

  if (range === "today") {
    from.setHours(0, 0, 0, 0);
  }

  if (range === "24h") {
    from.setHours(
      from.getHours() - 24
    );
  }

  if (range === "7d") {
    from.setDate(
      from.getDate() - 7
    );
  }

  return {
    from: from.toISOString().slice(0, 19),
    to: to.toISOString().slice(0, 19),
  };
};

function Dashboard() {

  const [applications, setApplications] =
    useState<Application[]>([]);

  const [selectedApplicationId, setSelectedApplicationId] =
    useState<number | null>(null);

  const [analytics, setAnalytics] =
    useState<ApiMetricAnalytics | null>(null);

  const [hourlyData, setHourlyData] =
    useState<HourlyAnalytics[]>([]);

    const [timeRange, setTimeRange] =
  useState<"today" | "24h" | "7d">("today");

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
        const { from, to } =
  getDateRange(timeRange);

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

  }, [selectedApplicationId, timeRange]);


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

        <div>

  <label className="mb-2 block text-sm font-medium text-slate-700">
    Time Range
  </label>

  <select
    value={timeRange}
    onChange={(event) =>
      setTimeRange(
        event.target.value as
          "today" | "24h" | "7d"
      )
    }
    className="rounded-lg border border-slate-300 bg-white px-4 py-2 outline-none focus:border-slate-500"
  >

    <option value="today">
      Today
    </option>

    <option value="24h">
      Last 24 Hours
    </option>

    <option value="7d">
      Last 7 Days
    </option>

  </select>

</div>

      </div>


      {/* ================= LOADING ================= */}
{loading && (
  <div className="mt-8 rounded-xl bg-white p-8 text-center shadow-sm">
    <p className="text-slate-500">
      Loading analytics...
    </p>
  </div>
)}

      {/* ================= ANALYTICS CARDS ================= */}

{!loading && analytics && (

  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

    <MetricCard
      title="Total Requests"
      value={analytics.totalRequests}
      description="Total API requests"
    />

    <MetricCard
      title="Avg Response Time"
      value={`${analytics.averageResponseTime.toFixed(2)} ms`}
      description="Average API response time"
    />

    <MetricCard
      title="Error Rate"
      value={
        analytics.totalRequests > 0
          ? `${(
              analytics.errorCount /
              analytics.totalRequests *
              100
            ).toFixed(2)}%`
          : "0.00%"
      }
      description={`${analytics.errorCount} errors detected`}
    />

  </div>

)}




{/* Charts */}

{!loading && hourlyData.length > 0 && (
  <>
    <ResponseTimeChart data={hourlyData} />

    <RequestVolumeChart data={hourlyData} />

    <ErrorTrendChart data={hourlyData} />
  </>
)}

{!loading && hourlyData.length === 0 && (
  <div className="mt-8 rounded-xl bg-white p-8 text-center shadow-sm">
    <h2 className="text-lg font-semibold text-slate-900">
      No metrics available
    </h2>

    <p className="mt-2 text-sm text-slate-500">
      No API metrics were recorded for the selected application
      and time range.
    </p>
  </div>
)}
     

    </div>
  );
}

export default Dashboard;