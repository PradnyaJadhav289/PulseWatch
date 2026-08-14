import api from "./api";
import type { Application } from "../types/application";

interface ApplicationPage {
  content: Application[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const getApplications = async (): Promise<Application[]> => {

  const response = await api.get<ApplicationPage>(
    "/applications"
  );

  return response.data.content;
};