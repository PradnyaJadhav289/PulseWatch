package com.pulsewatch.backend.service;

import com.pulsewatch.backend.dto.DashboardStatisticsResponse;
import com.pulsewatch.backend.entity.ApplicationStatus;
import com.pulsewatch.backend.entity.Environment;
import com.pulsewatch.backend.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final ApplicationRepository applicationRepository;

    public DashboardService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    public DashboardStatisticsResponse getStatistics() {

        long totalApplications =
                applicationRepository.count();

        long activeApplications =
                applicationRepository.countByStatus(
                        ApplicationStatus.ACTIVE
                );

        long inactiveApplications =
                applicationRepository.countByStatus(
                        ApplicationStatus.INACTIVE
                );

        long productionApplications =
                applicationRepository.countByEnvironment(
                        Environment.PRODUCTION
                );

        long uatApplications =
                applicationRepository.countByEnvironment(
                        Environment.UAT
                );

        long developmentApplications =
                applicationRepository.countByEnvironment(
                        Environment.DEVELOPMENT
                );

        return new DashboardStatisticsResponse(
                totalApplications,
                activeApplications,
                inactiveApplications,
                productionApplications,
                uatApplications,
                developmentApplications
        );
    }
}