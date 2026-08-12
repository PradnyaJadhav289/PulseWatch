package com.pulsewatch.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SlowEndpointResponse {

    private String endpoint;
    private long requestCount;
    private double averageResponseTime;
}