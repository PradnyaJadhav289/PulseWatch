export interface ApiMetricAnalytics {
  totalRequests: number;
  averageResponseTime: number;
  slowestResponseTime: number;
  fastestResponseTime: number;
  errorCount: number;
  successRate: number;
}