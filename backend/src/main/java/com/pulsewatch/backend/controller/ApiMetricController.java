package com.pulsewatch.backend.controller;

import com.pulsewatch.backend.dto.ApiMetricRequest;
import com.pulsewatch.backend.dto.ApiMetricResponse;
import com.pulsewatch.backend.service.ApiMetricService;
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
}