package com.pulsewatch.backend.controller;

import com.pulsewatch.backend.dto.StatusResponse;
import com.pulsewatch.backend.service.StatusService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HelloController {

    private final StatusService statusService;

    public HelloController(StatusService statusService) {
        this.statusService = statusService;
    }

    @GetMapping("/")
    public String home() {
        return "Welcome to PulseWatch 🚀";
    }

    @GetMapping("/hello")
    public String hello() {
        return "Hello PulseWatch 🚀";
    }

    @GetMapping("/status")
    public StatusResponse status() {
        return statusService.getApplicationStatus();
    }
}