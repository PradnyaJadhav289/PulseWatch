package com.pulsewatch.backend.controller;

import com.pulsewatch.backend.dto.ApiMetricRequest;
import com.pulsewatch.backend.dto.ApiMetricResponse;
import com.pulsewatch.backend.service.ApiMetricService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;


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
}