package com.pulsewatch.backend.service;

import com.pulsewatch.backend.repository.ApplicationRepository;
import org.springframework.stereotype.Service;
import com.pulsewatch.backend.entity.Application;
import java.util.List;
import java.util.Optional;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public ApplicationService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }
    public Application saveApplication(Application application) {
        return applicationRepository.save(application);
    }
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }
    public Optional<Application> getApplicationById(Long id) {
        return applicationRepository.findById(id);
    }
    public Application updateApplication(Long id, Application updatedApplication) {

        Application existingApplication = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        existingApplication.setApplicationName(updatedApplication.getApplicationName());
        existingApplication.setOwnerTeam(updatedApplication.getOwnerTeam());
        existingApplication.setEnvironment(updatedApplication.getEnvironment());

        return applicationRepository.save(existingApplication);
    }
    public void deleteApplication(Long id) {
        if (!applicationRepository.existsById(id)) {
            throw new RuntimeException("Application not found");
        }
        applicationRepository.deleteById(id);
    }


}