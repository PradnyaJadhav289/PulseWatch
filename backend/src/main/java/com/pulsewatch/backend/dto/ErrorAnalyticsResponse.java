package com.pulsewatch.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ErrorAnalyticsResponse {

    private long totalRequests;
    private long errorCount;
    private double errorRate;
}