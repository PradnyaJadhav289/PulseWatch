import { useEffect, useState } from "react";

import ResponseTimeChart from "../components/charts/ResponseTimeChart";
import RequestVolumeChart from "../components/charts/RequestVolumeChart";
import ErrorTrendChart from "../components/charts/ErrorTrendChart";
import {
  getApplicationAnalyticsByTimeRange,
  getHourlyAnalytics,
} from "../services/metricService";

import { getApplications } from "../services/applicationService";

import type { ApiMetricAnalytics } from "../types/analytics";
import type { Application } from "../types/application";
import type { HourlyAnalytics } from "../types/hourlyAnalytics";

import MetricCard from "../components/MetricCard";
import { getDashboardStatistics } from "../services/dashboardService";
import type { DashboardStatistics } from "../types/dashboard";

import {
  aggregateDailyAnalytics,
} from "../utils/analytics";


const formatDateTime = (date: Date): string => {

  const year =
    date.getFullYear();

  const month =
    String(date.getMonth() + 1).padStart(2, "0");

  const day =
    String(date.getDate()).padStart(2, "0");

  const hours =
    String(date.getHours()).padStart(2, "0");

  const minutes =
    String(date.getMinutes()).padStart(2, "0");

  const seconds =
    String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};
const getTodayDate = (): string => {

  const today = new Date();

  const year =
    today.getFullYear();

  const month =
    String(today.getMonth() + 1)
      .padStart(2, "0");

  const day =
    String(today.getDate())
      .padStart(2, "0");

  return `${year}-${month}-${day}`;
};


const getDateRange = (
  range:
    | "yesterday"
    | "today"
    | "24h"
    | "7d",
): { from: string; to: string } => {

  const now = new Date();

  const from = new Date(now);
  const to = new Date(now);


  // TODAY
  if (range === "today") {

    from.setHours(0, 0, 0, 0);

    to.setHours(23, 59, 59, 999);
  }


  // YESTERDAY
  else if (range === "yesterday") {

    from.setDate(
      from.getDate() - 1
    );

    to.setDate(
      to.getDate() - 1
    );

    from.setHours(0, 0, 0, 0);

    to.setHours(23, 59, 59, 999);
  }


  // LAST 24 HOURS
  else if (range === "24h") {

    from.setHours(
      from.getHours() - 24
    );
  }


  // LAST 7 DAYS
  else if (range === "7d") {

    from.setDate(
      from.getDate() - 6
    );

    from.setHours(0, 0, 0, 0);

    to.setHours(23, 59, 59, 999);
  }


  return {
    from: formatDateTime(from),
    to: formatDateTime(to),
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
  useState<
    "yesterday" | "today" | "24h" | "7d" | "custom"
  >("today");

  // Custom date range selected by the user
const [fromDate, setFromDate] =
  useState("");

const [toDate, setToDate] =
  useState("");

// Stores the date range after the user clicks Apply
const [appliedFromDate, setAppliedFromDate] =
  useState("");

const [appliedToDate, setAppliedToDate] =
  useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);
 
  const [statistics, setStatistics] =
  useState<DashboardStatistics | null>(null);

const [statisticsLoading, setStatisticsLoading] =
  useState(true);

const [statisticsError, setStatisticsError] =
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
// Load analytics when application or time range changes
useEffect(() => {

  if (selectedApplicationId === null) {
    return;
  }

 const loadAnalytics = async () => {

  try {

    setLoading(true);
    setError(null);

    let from: string;
    let to: string;


    // ======================================================
    // CUSTOM DATE RANGE
    // ======================================================

    if (timeRange === "custom") {

      if (
        !appliedFromDate ||
        !appliedToDate
      ) {
        setLoading(false);
        return;
      }

      from =
        `${appliedFromDate}T00:00:00`;

      to =
        `${appliedToDate}T23:59:59`;
    }


    // ======================================================
    // PRESET DATE RANGE
    // ======================================================

    else {

      const dateRange =
        getDateRange(timeRange);

      from = dateRange.from;
      to = dateRange.to;
    }


    // ======================================================
    // SUMMARY ANALYTICS
    // ======================================================

    const data =
      await getApplicationAnalyticsByTimeRange(
        selectedApplicationId,
        from,
        to
      );

    setAnalytics(data);


    // ======================================================
    // HOURLY ANALYTICS
    // ======================================================

    const hourly =
      await getHourlyAnalytics(
        selectedApplicationId,
        from,
        to
      );

    setHourlyData(hourly);

  } catch (error) {

    console.error(error);

    setError(
      "Failed to load analytics"
    );

  } finally {

    setLoading(false);
  }
};


  loadAnalytics();

}, [
  selectedApplicationId,
  timeRange,
  appliedFromDate,
  appliedToDate
]);


  const shouldAggregate =
  timeRange === "7d" ||
  (
    timeRange === "custom" &&
    appliedFromDate !== "" &&
    appliedToDate !== "" &&
    (
      new Date(appliedToDate).getTime() -
      new Date(appliedFromDate).getTime()
    ) > 2 * 24 * 60 * 60 * 1000
  );
const displayedChartData =
  shouldAggregate
    ? aggregateDailyAnalytics(
        hourlyData,
        appliedFromDate,
        appliedToDate
      )
    : hourlyData;

  useEffect(() => {

  const loadStatistics = async () => {

    try {

      setStatisticsLoading(true);
      setStatisticsError(null);

      const data =
        await getDashboardStatistics();

      setStatistics(data);

    } catch (error) {

      console.error(error);

      setStatisticsError(
        "Failed to load dashboard statistics"
      );

    } finally {

      setStatisticsLoading(false);
    }
  };

  loadStatistics();

}, []);


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
          "yesterday"| "today" | "24h" | "7d" | "custom"
      )
    }
    className="rounded-lg border border-slate-300 bg-white px-4 py-2 outline-none focus:border-slate-500"
  >

    <option value="today">
      Today
    </option>
    <option value="yesterday">
      Yesterday
    </option>

    <option value="24h">
      Last 24 Hours
    </option>

    <option value="7d">
      Last 7 Days
    </option>

    <option value="custom">
      Custom Date Range
    </option>

  </select>

  {timeRange === "custom" && (

  <div className="mt-4 flex flex-wrap items-end gap-4">

    {/* From Date */}

    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        From
      </label>

      <input
        type="date"
        value={fromDate}
        max={toDate || getTodayDate()}
        onChange={(event) =>
          setFromDate(event.target.value)
        }
        className="rounded-lg border border-slate-300 bg-white px-4 py-2"
      />
    </div>


    {/* To Date */}

    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        To
      </label>

      <input
        type="date"
        value={toDate}
        max={
getTodayDate()
        }
        onChange={(event) =>
          setToDate(event.target.value)
        }
        className="rounded-lg border border-slate-300 bg-white px-4 py-2"
      />
    </div>


    {/* Apply */}

    <button
      type="button"
      onClick={() => {

        if (!fromDate || !toDate) {
          setError(
            "Please select both From and To dates."
          );
          return;
        }

        if (fromDate > toDate) {
          setError(
            "From date cannot be after To date."
          );
          return;
        }

        setError(null);

        setAppliedFromDate(fromDate);
        setAppliedToDate(toDate);

      }}
      className="rounded-lg bg-slate-900 px-5 py-2.5 font-medium text-white hover:bg-slate-800"
    >
      Apply
    </button>

  </div>
)}

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
{/* Dashboard Statistics */}

{statisticsLoading && (
  <p className="mb-6 text-slate-500">
    Loading dashboard statistics...
  </p>
)}

{statisticsError && (
  <p className="mb-6 text-red-600">
    {statisticsError}
  </p>
)}

{!statisticsLoading && statistics && (

  <div className="mb-8">

    <h2 className="mb-4 text-xl font-semibold text-slate-900">
      Application Overview
    </h2>

    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

      {/* Total Applications */}

      <div className="rounded-xl bg-white p-6 shadow-sm">

        <p className="text-sm text-slate-500">
          Total Applications
        </p>

        <h3 className="mt-2 text-3xl font-bold text-slate-900">
          {statistics.totalApplications}
        </h3>

      </div>


      {/* Active Applications */}

      <div className="rounded-xl bg-white p-6 shadow-sm">

        <p className="text-sm text-slate-500">
          Active Applications
        </p>

        <h3 className="mt-2 text-3xl font-bold text-slate-900">
          {statistics.activeApplications}
        </h3>

      </div>


      {/* Inactive Applications */}

      <div className="rounded-xl bg-white p-6 shadow-sm">

        <p className="text-sm text-slate-500">
          Inactive Applications
        </p>

        <h3 className="mt-2 text-3xl font-bold text-slate-900">
          {statistics.inactiveApplications}
        </h3>

      </div>


      {/* Production */}

      <div className="rounded-xl bg-white p-6 shadow-sm">

        <p className="text-sm text-slate-500">
          Production
        </p>

        <h3 className="mt-2 text-3xl font-bold text-slate-900">
          {statistics.productionApplications}
        </h3>

      </div>


      {/* Testing */}

      <div className="rounded-xl bg-white p-6 shadow-sm">

        <p className="text-sm text-slate-500">
          Testing
        </p>

        <h3 className="mt-2 text-3xl font-bold text-slate-900">
          {statistics.testingApplications}
        </h3>

      </div>


      {/* Development */}

      <div className="rounded-xl bg-white p-6 shadow-sm">

        <p className="text-sm text-slate-500">
          Development
        </p>

        <h3 className="mt-2 text-3xl font-bold text-slate-900">
          {statistics.developmentApplications}
        </h3>

      </div>


      {/* Staging */}

      <div className="rounded-xl bg-white p-6 shadow-sm">

        <p className="text-sm text-slate-500">
          Staging
        </p>

        <h3 className="mt-2 text-3xl font-bold text-slate-900">
          {statistics.stagingApplications}
        </h3>

      </div>

    </div>

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
<ResponseTimeChart
  data={displayedChartData}
  isDaily={shouldAggregate}
/>

<RequestVolumeChart
  data={displayedChartData}
  isDaily={shouldAggregate}
/>

<ErrorTrendChart
  data={displayedChartData}
  isDaily={shouldAggregate}
/>
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