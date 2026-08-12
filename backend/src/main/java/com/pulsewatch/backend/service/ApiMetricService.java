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
import com.pulsewatch.backend.dto.ApiMetricAnalyticsResponse;
import java.util.List;
import com.pulsewatch.backend.dto.EndpointAnalyticsResponse;

import java.util.ArrayList;
import java.util.Map;
import java.util.stream.Collectors;
import com.pulsewatch.backend.dto.SlowEndpointResponse;
import com.pulsewatch.backend.dto.ErrorAnalyticsResponse;
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

    public ApiMetricAnalyticsResponse getAnalytics(Long applicationId) {

        if (!applicationRepository.existsById(applicationId)) {
            throw new ResourceNotFoundException(
                    "Application not found with id: " + applicationId
            );
        }

        List<ApiMetric> metrics =
                apiMetricRepository.findByApplicationId(applicationId);

        if (metrics.isEmpty()) {
            return new ApiMetricAnalyticsResponse(
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
            );
        }

        long totalRequests = metrics.size();

        long totalResponseTime = 0;
        long slowestResponseTime = Long.MIN_VALUE;
        long fastestResponseTime = Long.MAX_VALUE;
        long errorCount = 0;

        for (ApiMetric metric : metrics) {

            long responseTime = metric.getResponseTime();

            totalResponseTime += responseTime;

            if (responseTime > slowestResponseTime) {
                slowestResponseTime = responseTime;
            }

            if (responseTime < fastestResponseTime) {
                fastestResponseTime = responseTime;
            }

            if (metric.getStatusCode() >= 400) {
                errorCount++;
            }
        }

        double averageResponseTime =
                (double) totalResponseTime / totalRequests;

        long successfulRequests =
                totalRequests - errorCount;

        double successRate =
                ((double) successfulRequests / totalRequests) * 100;

        return new ApiMetricAnalyticsResponse(
                totalRequests,
                averageResponseTime,
                slowestResponseTime,
                fastestResponseTime,
                errorCount,
                successRate
        );
    }


    public List<EndpointAnalyticsResponse> getEndpointAnalytics(
            Long applicationId) {

        if (!applicationRepository.existsById(applicationId)) {
            throw new ResourceNotFoundException(
                    "Application not found with id: " + applicationId
            );
        }

        List<ApiMetric> metrics =
                apiMetricRepository.findByApplicationId(applicationId);

        Map<String, List<ApiMetric>> groupedMetrics =
                metrics.stream()
                        .collect(Collectors.groupingBy(
                                ApiMetric::getEndpoint
                        ));

        List<EndpointAnalyticsResponse> responses =
                new ArrayList<>();

        for (Map.Entry<String, List<ApiMetric>> entry
                : groupedMetrics.entrySet()) {

            String endpoint = entry.getKey();

            List<ApiMetric> endpointMetrics =
                    entry.getValue();

            long requestCount = endpointMetrics.size();

            double averageResponseTime =
                    endpointMetrics.stream()
                            .mapToLong(ApiMetric::getResponseTime)
                            .average()
                            .orElse(0);

            responses.add(
                    new EndpointAnalyticsResponse(
                            endpoint,
                            requestCount,
                            averageResponseTime
                    )
            );
        }

        return responses;
    }



    public List<SlowEndpointResponse> getSlowEndpoints(
            Long applicationId,
            long threshold) {

        if (!applicationRepository.existsById(applicationId)) {
            throw new ResourceNotFoundException(
                    "Application not found with id: " + applicationId
            );
        }

        List<ApiMetric> metrics =
                apiMetricRepository.findByApplicationId(applicationId);

        Map<String, List<ApiMetric>> groupedMetrics =
                metrics.stream()
                        .collect(Collectors.groupingBy(
                                ApiMetric::getEndpoint
                        ));

        List<SlowEndpointResponse> responses =
                new ArrayList<>();

        for (Map.Entry<String, List<ApiMetric>> entry
                : groupedMetrics.entrySet()) {

            String endpoint = entry.getKey();

            List<ApiMetric> endpointMetrics =
                    entry.getValue();

            long requestCount = endpointMetrics.size();

            double averageResponseTime =
                    endpointMetrics.stream()
                            .mapToLong(ApiMetric::getResponseTime)
                            .average()
                            .orElse(0);

            if (averageResponseTime > threshold) {

                responses.add(
                        new SlowEndpointResponse(
                                endpoint,
                                requestCount,
                                averageResponseTime
                        )
                );
            }
        }

        return responses;
    }

    public ErrorAnalyticsResponse getErrorAnalytics(
            Long applicationId) {

        if (!applicationRepository.existsById(applicationId)) {
            throw new ResourceNotFoundException(
                    "Application not found with id: " + applicationId
            );
        }

        List<ApiMetric> metrics =
                apiMetricRepository.findByApplicationId(applicationId);

        long totalRequests = metrics.size();

        long errorCount = metrics.stream()
                .filter(metric -> metric.getStatusCode() >= 400)
                .count();

        double errorRate = 0;

        if (totalRequests > 0) {
            errorRate =
                    ((double) errorCount / totalRequests) * 100;
        }

        return new ErrorAnalyticsResponse(
                totalRequests,
                errorCount,
                errorRate
        );
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