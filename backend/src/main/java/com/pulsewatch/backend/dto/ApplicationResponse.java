
//Entities represent the database structure, while DTOs represent
// the API contract. Using DTOs prevents exposing internal database
// fields, allows different request and response formats, and keeps
// the API independent of database changes.
//DTO (Data Transfer Object) is a simple object used to send or
// receive only the required data between the client and the server,
// while keeping the database entity hidden.
package com.pulsewatch.backend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ApplicationResponse {

    private Long id;
    private String applicationName;
    private String ownerTeam;
    private String environment;
}
