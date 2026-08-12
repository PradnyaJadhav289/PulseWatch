package com.pulsewatch.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class EndpointAnalyticsResponse {

    private String endpoint;

    private long requestCount;

    private double averageResponseTime;
}