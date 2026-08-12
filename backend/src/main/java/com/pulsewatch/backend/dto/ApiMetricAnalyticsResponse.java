package com.pulsewatch.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApiMetricAnalyticsResponse {

    private long totalRequests;

    private double averageResponseTime;

    private long slowestResponseTime;

    private long fastestResponseTime;

    private long errorCount;

    private double successRate;
}