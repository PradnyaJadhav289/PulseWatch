package com.pulsewatch.backend.repository;

import com.pulsewatch.backend.entity.ApiMetric;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApiMetricRepository
        extends JpaRepository<ApiMetric, Long> {
}