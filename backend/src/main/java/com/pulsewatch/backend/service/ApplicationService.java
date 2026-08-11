package com.pulsewatch.backend.service;

import com.pulsewatch.backend.dto.ApplicationRequest;
import com.pulsewatch.backend.dto.ApplicationResponse;
import com.pulsewatch.backend.entity.Application;
import com.pulsewatch.backend.entity.ApplicationStatus;
import com.pulsewatch.backend.entity.Environment;
import com.pulsewatch.backend.exception.ResourceNotFoundException;
import com.pulsewatch.backend.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    // Constructor Injection
    public ApplicationService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    // CREATE
    public ApplicationResponse saveApplication(ApplicationRequest request) {

        // Request DTO → Entity
        Application application = mapToEntity(request);

        // Save Entity
        Application savedApplication =
                applicationRepository.save(application);

        // Entity → Response DTO
        return mapToResponse(savedApplication);
    }

    // GET ALL
    public List<ApplicationResponse> getAllApplications() {

        List<Application> applications =
                applicationRepository.findAll();

        List<ApplicationResponse> responses = new ArrayList<>();

        for (Application application : applications) {
            responses.add(mapToResponse(application));
        }

        return responses;
    }

    // GET BY ID
    public ApplicationResponse getApplicationById(Long id) {

        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Application not found with id: " + id
                ));

        return mapToResponse(application);
    }

    // UPDATE
    public ApplicationResponse updateApplication(
            Long id,
            ApplicationRequest request) {

        Application existingApplication =
                applicationRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Application not found with id: " + id
                        ));

        existingApplication.setApplicationName(
                request.getApplicationName()
        );

        existingApplication.setOwnerTeam(
                request.getOwnerTeam()
        );

        existingApplication.setEnvironment(
                Environment.valueOf(
                        request.getEnvironment().toUpperCase()
                )
        );

        existingApplication.setBaseUrl(
                request.getBaseUrl()
        );

        existingApplication.setDescription(
                request.getDescription()
        );

        existingApplication.setStatus(
                ApplicationStatus.valueOf(
                        request.getStatus().toUpperCase()
                )
        );

        Application updatedApplication =
                applicationRepository.save(existingApplication);

        return mapToResponse(updatedApplication);
    }

    // DELETE
    public void deleteApplication(Long id) {

        if (!applicationRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Application not found with id: " + id
            );
        }

        applicationRepository.deleteById(id);
    }

    // Request DTO → Entity
    private Application mapToEntity(ApplicationRequest request) {

        Application application = new Application();

        application.setApplicationName(
                request.getApplicationName()
        );

        application.setOwnerTeam(
                request.getOwnerTeam()
        );

        application.setEnvironment(
                Environment.valueOf(
                        request.getEnvironment().toUpperCase()
                )
        );

        application.setBaseUrl(
                request.getBaseUrl()
        );

        application.setDescription(
                request.getDescription()
        );

        application.setStatus(
                ApplicationStatus.valueOf(
                        request.getStatus().toUpperCase()
                )
        );

        return application;
    }

    // Entity → Response DTO
    private ApplicationResponse mapToResponse(
            Application application) {

        ApplicationResponse response =
                new ApplicationResponse();

        response.setId(application.getId());

        response.setApplicationName(
                application.getApplicationName()
        );

        response.setOwnerTeam(
                application.getOwnerTeam()
        );

        response.setEnvironment(
                application.getEnvironment().name()
        );

        response.setBaseUrl(
                application.getBaseUrl()
        );

        response.setDescription(
                application.getDescription()
        );

        response.setStatus(
                application.getStatus().name()
        );

        response.setCreatedAt(
                application.getCreatedAt()
        );

        response.setUpdatedAt(
                application.getUpdatedAt()
        );

        return response;
    }
}