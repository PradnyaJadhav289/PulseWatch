//Entities represent the database structure, while DTOs represent
// the API contract. Using DTOs prevents exposing internal database
// fields, allows different request and response formats, and keeps
// the API independent of database changes.
//DTO (Data Transfer Object) is a simple object used to send or
// receive only the required data between the client and the server,
// while keeping the database entity hidden.
package com.pulsewatch.backend.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ApplicationRequest {

    @NotBlank(message = "Application name is required")
    @Size(min = 3, max = 50, message = "Application name must be between 3 and 50 characters")
    private String applicationName;

    @NotBlank(message = "Owner team is required")
    private String ownerTeam;

    @NotBlank(message = "Environment is required")
    private String environment;

    private String baseUrl;

    private String description;

    @NotBlank(message = "Status is required")
    private String status;
}
