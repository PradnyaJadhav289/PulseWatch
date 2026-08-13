package com.pulsewatch.backend.controller;

import com.pulsewatch.backend.dto.*;
import com.pulsewatch.backend.service.ApiMetricService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.time.LocalDateTime;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/metrics")
public class ApiMetricController {

    private final ApiMetricService apiMetricService;

    public ApiMetricController(ApiMetricService apiMetricService) {
        this.apiMetricService = apiMetricService;
    }

    @PostMapping
    public ApiMetricResponse createMetric(
            @Valid @RequestBody ApiMetricRequest request) {

        return apiMetricService.saveMetric(request);
    }

    @GetMapping
    public Page<ApiMetricResponse> getAllMetrics(
            Pageable pageable) {

        return apiMetricService.getAllMetrics(pageable);
    }
    @GetMapping("/application/{applicationId}")
    public Page<ApiMetricResponse> getMetricsByApplication(
            @PathVariable Long applicationId,
            Pageable pageable) {

        return apiMetricService.getMetricsByApplication(
                applicationId,
                pageable
        );
    }

    @GetMapping("/analytics")
    public ApiMetricAnalyticsResponse getAnalytics(
            @RequestParam Long applicationId) {

        return apiMetricService.getAnalytics(applicationId);
    }

    @GetMapping("/analytics/endpoints")
    public List<EndpointAnalyticsResponse> getEndpointAnalytics(
            @RequestParam Long applicationId) {

        return apiMetricService.getEndpointAnalytics(
                applicationId
        );
    }

    @GetMapping("/analytics/slow")
    public List<SlowEndpointResponse> getSlowEndpoints(
            @RequestParam Long applicationId,
            @RequestParam long threshold) {

        return apiMetricService.getSlowEndpoints(
                applicationId,
                threshold
        );
    }

    @GetMapping("/analytics/errors")
    public ErrorAnalyticsResponse getErrorAnalytics(
            @RequestParam Long applicationId) {

        return apiMetricService.getErrorAnalytics(
                applicationId
        );
    }

    @GetMapping("/analytics/time-range")
    public TimeRangeAnalyticsResponse getTimeRangeAnalytics(
            @RequestParam Long applicationId,
            @RequestParam LocalDateTime from,
            @RequestParam LocalDateTime to) {

        return apiMetricService.getTimeRangeAnalytics(
                applicationId,
                from,
                to
        );
    }
    @GetMapping("/analytics/hourly")
    public List<MetricTimeBucketResponse> getHourlyAnalytics(
            @RequestParam Long applicationId,
            @RequestParam LocalDateTime from,
            @RequestParam LocalDateTime to) {

        return apiMetricService.getHourlyAnalytics(
                applicationId,
                from,
                to
        );
    }
}