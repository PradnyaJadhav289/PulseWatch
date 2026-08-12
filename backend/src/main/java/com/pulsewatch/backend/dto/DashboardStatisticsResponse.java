package com.pulsewatch.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DashboardStatisticsResponse {

    private long totalApplications;
    private long activeApplications;
    private long inactiveApplications;
    private long productionApplications;
    private long uatApplications;
    private long developmentApplications;
}