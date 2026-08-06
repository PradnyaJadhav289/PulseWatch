package com.pulsewatch.backend.service;

import com.pulsewatch.backend.repository.ApplicationRepository;
import org.springframework.stereotype.Service;
import com.pulsewatch.backend.entity.Application;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public ApplicationService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }
    public Application saveApplication(Application application) {
        return applicationRepository.save(application);
    }

}