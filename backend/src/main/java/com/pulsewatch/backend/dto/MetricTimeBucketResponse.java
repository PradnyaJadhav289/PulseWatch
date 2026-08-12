package com.pulsewatch.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class MetricTimeBucketResponse {

    private LocalDateTime time;

    private long requestCount;

    private double averageResponseTime;

    private long errorCount;
}