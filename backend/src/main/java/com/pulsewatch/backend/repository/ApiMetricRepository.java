package com.pulsewatch.backend.repository;

import com.pulsewatch.backend.entity.ApiMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ApiMetricRepository
        extends JpaRepository<ApiMetric, Long> {

    Page<ApiMetric> findByApplicationId(
            Long applicationId,
            Pageable pageable
    );
}