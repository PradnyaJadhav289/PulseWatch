package com.pulsewatch.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String applicationName;

    private String ownerTeam;

    private String environment;

    public Application() {
    }

    public Application(String applicationName,
                       String ownerTeam,
                       String environment) {

        this.applicationName = applicationName;
        this.ownerTeam = ownerTeam;
        this.environment = environment;
    }

    public Long getId() {
        return id;
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