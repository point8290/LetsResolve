"use server";

import { apiGet } from "./server/api-client";
import DashboardSummary from "./model/DashboardSummary";

export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  return apiGet<DashboardSummary>("/dashboard/summary");
};
