import api from "./api";
import type { ApiMetricAnalytics } from "../types/analytics";
import type { HourlyAnalytics } from "../types/hourlyAnalytics";

export const getApplicationAnalytics = async (
  applicationId: number
): Promise<ApiMetricAnalytics> => {

  const response = await api.get<ApiMetricAnalytics>(
    `/metrics/analytics?applicationId=${applicationId}`
  );

  return response.data;
};

export const getHourlyAnalytics = async (
  applicationId: number,
  from: string,
  to: string
): Promise<HourlyAnalytics[]> => {

  const response = await api.get<HourlyAnalytics[]>(
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