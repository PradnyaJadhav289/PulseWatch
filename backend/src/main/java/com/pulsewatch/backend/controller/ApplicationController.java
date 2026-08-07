package com.pulsewatch.backend.controller;

import com.pulsewatch.backend.dto.ApplicationResponse;
import com.pulsewatch.backend.entity.Application;
import com.pulsewatch.backend.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
//Annotations start with:@

import java.util.List;
import java.util.Optional;
import com.pulsewatch.backend.dto.ApplicationRequest;
import com.pulsewatch.backend.dto.ApplicationResponse;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public ApplicationResponse createApplication(@RequestBody ApplicationRequest request) {
       return applicationService.saveApplication( request);
    }
    @GetMapping
    public List<ApplicationResponse> getAllApplications() {

        return applicationService.getAllApplications();
    }
    @GetMapping("/{id}")
    public  ApplicationResponse getApplicationById(@PathVariable Long id) {
        return applicationService.getApplicationById(id);
    }
    @PutMapping("/{id}")
    public ApplicationResponse updateApplication(@PathVariable Long id,
                                         @RequestBody ApplicationRequest request) {

        return applicationService.updateApplication(id, request);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteApplication(@PathVariable Long id) {
        applicationService.deleteApplication(id);
        return ResponseEntity.ok("Application deleted successfully.");
    }

}