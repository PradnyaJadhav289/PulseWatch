package com.pulsewatch.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ApiMetricResponse {

    private Long id;

    private Long applicationId;

    private String endpoint;

    private String method;

    private Integer statusCode;

    private Long responseTime;

    private LocalDateTime timestamp;
}