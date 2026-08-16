import api from "./api";

import type { ApiMetricAnalytics } from "../types/analytics";
import type { HourlyAnalytics } from "../types/hourlyAnalytics";


// ============================================================
// OVERALL APPLICATION ANALYTICS
// ============================================================
//
// Used when we need analytics for an application.
//
// Example:
// GET /metrics/analytics?applicationId=2
//
// NOTE:
// We will use the time-range version for the Dashboard
// because the Dashboard has a Time Range filter.
// ============================================================

export const getApplicationAnalytics = async (
  applicationId: number
): Promise<ApiMetricAnalytics> => {

  const response =
    await api.get<ApiMetricAnalytics>(
      `/metrics/analytics?applicationId=${applicationId}`
    );

  return response.data;
};


// ============================================================
// TIME RANGE ANALYTICS
// ============================================================
//
// NEW FUNCTION
//
// This will be used by the Dashboard Time Range dropdown.
//
// Example:
//
// applicationId = 2
// from = 2026-08-12T00:00:00
// to   = 2026-08-12T23:59:59
//
// Backend endpoint:
//
// GET /metrics/analytics/time-range
// ============================================================

export const getApplicationAnalyticsByTimeRange =
  async (
    applicationId: number,
    from: string,
    to: string
  ): Promise<ApiMetricAnalytics> => {

    const response =
      await api.get<ApiMetricAnalytics>(
        "/metrics/analytics/time-range",
        {
          params: {
            applicationId,
            from,
            to,
          },
        }
      );

    return response.data;
  };


// ============================================================
// HOURLY ANALYTICS
// ============================================================
//
// Used for the charts.
//
// Returns data such as:
//
// 12:00 → 1 request → 320 ms → 0 errors
// 14:00 → 3 requests → 516 ms → 2 errors
//
// ============================================================

export const getHourlyAnalytics = async (
  applicationId: number,
  from: string,
  to: string
): Promise<HourlyAnalytics[]> => {

  const response =
    await api.get<HourlyAnalytics[]>(
      "/metrics/analytics/hourly",
      {
        params: {
          applicationId,
          from,
          to,
        },
      }
    );

  return response.data;
};