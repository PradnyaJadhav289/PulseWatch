package com.pulsewatch.backend.repository.projection;

import java.time.LocalDateTime;

public interface MetricTimeBucketProjection {

    LocalDateTime getTime();

    Long getRequestCount();

    Double getAverageResponseTime();

    Long getErrorCount();
}