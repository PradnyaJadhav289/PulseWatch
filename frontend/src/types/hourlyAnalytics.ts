export interface HourlyAnalytics {
  time: string;
  requestCount: number;
  errorCount: number;
  averageResponseTime: number | null;
}