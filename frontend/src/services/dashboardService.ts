import api from "./api";

import type {
  DashboardStatistics,
} from "../types/dashboard";


export const getDashboardStatistics =
  async (): Promise<DashboardStatistics> => {

    const response =
      await api.get<DashboardStatistics>(
        "/dashboard/statistics"
      );

    return response.data;
  };