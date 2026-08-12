package com.pulsewatch.backend.controller;

import com.pulsewatch.backend.dto.ApiMetricRequest;
import com.pulsewatch.backend.dto.ApiMetricResponse;
import com.pulsewatch.backend.service.ApiMetricService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import com.pulsewatch.backend.dto.ApiMetricAnalyticsResponse;
import com.pulsewatch.backend.dto.EndpointAnalyticsResponse;
import java.util.List;
import com.pulsewatch.backend.dto.SlowEndpointResponse;
import com.pulsewatch.backend.dto.ErrorAnalyticsResponse;

@RestController
@RequestMapping("/api/metrics")
public class ApiMetricController {

    private final ApiMetricService apiMetricService;

    public ApiMetricController(ApiMetricService apiMetricService) {
        this.apiMetricService = apiMetricService;
    }

    @PostMapping
    public ApiMetricResponse createMetric(
            @RequestBody ApiMetricRequest request) {

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
}