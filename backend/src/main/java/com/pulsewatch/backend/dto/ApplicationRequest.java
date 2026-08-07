//Entities represent the database structure, while DTOs represent
// the API contract. Using DTOs prevents exposing internal database
// fields, allows different request and response formats, and keeps
// the API independent of database changes.
//DTO (Data Transfer Object) is a simple object used to send or
// receive only the required data between the client and the server,
// while keeping the database entity hidden.
package com.pulsewatch.backend.dto;

public class ApplicationRequest {

    private String applicationName;
    private String ownerTeam;
    private String environment;

    public ApplicationRequest() {
    }

    public String getApplicationName() {
        return applicationName;
    }

    public void setApplicationName(String applicationName) {
        this.applicationName = applicationName;
    }

    public String getOwnerTeam() {
        return ownerTeam;
    }

    public void setOwnerTeam(String ownerTeam) {
        this.ownerTeam = ownerTeam;
    }

    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }
}