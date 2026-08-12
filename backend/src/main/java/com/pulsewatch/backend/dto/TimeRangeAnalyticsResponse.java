package com.pulsewatch.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TimeRangeAnalyticsResponse {

    private long totalRequests;
    private double averageResponseTime;
    private long errorCount;
    private double errorRate;
}