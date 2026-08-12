package com.pulsewatch.backend.repository;

import com.pulsewatch.backend.entity.ApiMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.pulsewatch.backend.repository.projection.MetricTimeBucketProjection;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ApiMetricRepository
        extends JpaRepository<ApiMetric, Long> {

    Page<ApiMetric> findByApplicationId(
            Long applicationId,
            Pageable pageable
    );

    List<ApiMetric> findByApplicationId(
            Long applicationId
    );

    List<ApiMetric> findByApplicationIdAndTimestampBetween(
            Long applicationId,
            LocalDateTime from,
            LocalDateTime to
    );

    @Query(value = """
        SELECT
            date_trunc('hour', timestamp) AS time,
            COUNT(*) AS requestCount,
            AVG(response_time) AS averageResponseTime,
            COUNT(*) FILTER (
                WHERE status_code >= 400
            ) AS errorCount
        FROM api_metrics
        WHERE application_id = :applicationId
          AND timestamp BETWEEN :from AND :to
        GROUP BY date_trunc('hour', timestamp)
        ORDER BY date_trunc('hour', timestamp)
        """, nativeQuery = true)
    List<MetricTimeBucketProjection> findHourlyAnalytics(
            @Param("applicationId") Long applicationId,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );
}