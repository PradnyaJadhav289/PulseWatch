package com.pulsewatch.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


@Entity
@Table(name = "api_metrics")
@Getter
@Setter
@NoArgsConstructor
public class ApiMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String endpoint;

    private String method;

    private Integer statusCode;

    private Long responseTime;

    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;
}