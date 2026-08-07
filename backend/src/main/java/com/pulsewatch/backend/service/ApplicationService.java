package com.pulsewatch.backend.service;


import com.pulsewatch.backend.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import com.pulsewatch.backend.dto.ApplicationRequest;
import com.pulsewatch.backend.dto.ApplicationResponse;
import com.pulsewatch.backend.entity.Application;
import java.util.List;
import java.util.ArrayList;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public ApplicationService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }
    public ApplicationResponse saveApplication(ApplicationRequest request) {

        // Convert Request DTO → Entity
        Application application = mapToEntity(request);

        // Save Entity
        Application savedApplication = applicationRepository.save(application);

        // Convert Entity → Response DTO
        return mapToResponse(savedApplication);
    }
    public List<ApplicationResponse> getAllApplications() {

        List<Application> applications = applicationRepository.findAll();

        List<ApplicationResponse> responses = new ArrayList<>();

        for (Application application : applications) {

           responses.add(mapToResponse(application));
        }

        return responses;
    }
    public ApplicationResponse getApplicationById(Long id) {

        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        return mapToResponse(application);
    }



    public ApplicationResponse updateApplication(Long id, ApplicationRequest request) {

        Application existingApplication = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        existingApplication.setApplicationName(request.getApplicationName());
        existingApplication.setOwnerTeam(request.getOwnerTeam());
        existingApplication.setEnvironment(request.getEnvironment());

        Application updatedApplication = applicationRepository.save(existingApplication);

        return mapToResponse(updatedApplication);
    }
    public void deleteApplication(Long id) {
        if (!applicationRepository.existsById(id)) {
            throw new RuntimeException("Application not found");
        }
        applicationRepository.deleteById(id);
    }

    private Application mapToEntity(ApplicationRequest request) {

        Application application = new Application();

        application.setApplicationName(request.getApplicationName());
        application.setOwnerTeam(request.getOwnerTeam());
        application.setEnvironment(request.getEnvironment());

        return application;
    }

    private ApplicationResponse mapToResponse(Application application) {

        ApplicationResponse response = new ApplicationResponse();

        response.setId(application.getId());
        response.setApplicationName(application.getApplicationName());
        response.setOwnerTeam(application.getOwnerTeam());
        response.setEnvironment(application.getEnvironment());

        return response;
    }

}