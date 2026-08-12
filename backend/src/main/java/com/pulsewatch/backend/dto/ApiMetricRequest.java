package com.pulsewatch.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApiMetricRequest {

    private Long applicationId;

    private String endpoint;

    private String method;

    private Integer statusCode;

    private Long responseTime;
}