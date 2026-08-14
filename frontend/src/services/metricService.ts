import api from "./api";
import type { ApiMetricAnalytics } from "../types/analytics";

export const getApplicationAnalytics = async (
  applicationId: number
): Promise<ApiMetricAnalytics> => {

  const response = await api.get<ApiMetricAnalytics>(
    `/metrics/analytics?applicationId=${applicationId}`
  );

  return response.data;
};