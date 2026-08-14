package com.pulsewatch.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApiMetricRequest {

    @NotNull(message = "Application ID is required")
    @Positive(message = "Application ID must be positive")
    private Long applicationId;

    @NotBlank(message = "Endpoint is required")
    private String endpoint;

    @NotBlank(message = "HTTP method is required")
    private String method;

    @NotNull(message = "Status code is required")
    @Min(value = 100, message = "Status code must be at least 100")
    private Integer statusCode;

    @NotNull(message = "Response time is required")
    @Positive(message = "Response time must be greater than 0")
    private Long responseTime;
}