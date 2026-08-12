package com.pulsewatch.backend.service;

import com.pulsewatch.backend.dto.ApiMetricRequest;
import com.pulsewatch.backend.dto.ApiMetricResponse;
import com.pulsewatch.backend.entity.ApiMetric;
import com.pulsewatch.backend.entity.Application;
import com.pulsewatch.backend.exception.ResourceNotFoundException;
import com.pulsewatch.backend.repository.ApiMetricRepository;
import com.pulsewatch.backend.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class ApiMetricService {

    private final ApiMetricRepository apiMetricRepository;
    private final ApplicationRepository applicationRepository;

    public ApiMetricService(
            ApiMetricRepository apiMetricRepository,
            ApplicationRepository applicationRepository) {

        this.apiMetricRepository = apiMetricRepository;
        this.applicationRepository = applicationRepository;
    }

    public ApiMetricResponse saveMetric(ApiMetricRequest request) {

        Application application =
                applicationRepository.findById(request.getApplicationId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Application not found with id: "
                                        + request.getApplicationId()
                        ));

        ApiMetric metric = new ApiMetric();

        metric.setApplication(application);
        metric.setEndpoint(request.getEndpoint());
        metric.setMethod(request.getMethod());
        metric.setStatusCode(request.getStatusCode());
        metric.setResponseTime(request.getResponseTime());
        metric.setTimestamp(LocalDateTime.now());

        ApiMetric savedMetric =
                apiMetricRepository.save(metric);

        return mapToResponse(savedMetric);
    }

    public Page<ApiMetricResponse> getAllMetrics(Pageable pageable) {

        Page<ApiMetric> metrics =
                apiMetricRepository.findAll(pageable);

        return metrics.map(this::mapToResponse);
    }

    public Page<ApiMetricResponse> getMetricsByApplication(
            Long applicationId,
            Pageable pageable) {

        if (!applicationRepository.existsById(applicationId)) {
            throw new ResourceNotFoundException(
                    "Application not found with id: " + applicationId
            );
        }

        Page<ApiMetric> metrics =
                apiMetricRepository.findByApplicationId(
                        applicationId,
                        pageable
                );

        return metrics.map(this::mapToResponse);
    }

    private ApiMetricResponse mapToResponse(ApiMetric metric) {

        ApiMetricResponse response = new ApiMetricResponse();

        response.setId(metric.getId());
        response.setApplicationId(
                metric.getApplication().getId()
        );
        response.setEndpoint(metric.getEndpoint());
        response.setMethod(metric.getMethod());
        response.setStatusCode(metric.getStatusCode());
        response.setResponseTime(metric.getResponseTime());
        response.setTimestamp(metric.getTimestamp());

        return response;
    }
}