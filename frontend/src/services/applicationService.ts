import api from "./api";
import type { Application } from "../types/application";

interface ApplicationPage {
  content: Application[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

//get all applications
export const getApplications = async (): Promise<Application[]> => {

  const response = await api.get<ApplicationPage>(
    "/applications"
  );

  return response.data.content;
};

// delete
export const deleteApplication = async (
  id: number
): Promise<void> => {

  await api.delete(`/applications/${id}`);
};

//Edit application
export const updateApplication = async (
  id: number,
  data: Omit<Application, "id" | "createdAt" | "updatedAt">
): Promise<Application> => {

  const response = await api.put<Application>(
    `/applications/${id}`,
    data
  );

  return response.data;
};
