package com.pulsewatch.backend.controller;

import com.pulsewatch.backend.dto.DashboardStatisticsResponse;
import com.pulsewatch.backend.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/statistics")
    public DashboardStatisticsResponse getStatistics() {
        return dashboardService.getStatistics();
    }
}