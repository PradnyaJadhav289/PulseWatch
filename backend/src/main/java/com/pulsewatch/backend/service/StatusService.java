package com.pulsewatch.backend.service;

import com.pulsewatch.backend.dto.StatusResponse;
import org.springframework.stereotype.Service;

@Service
public class StatusService {

    public StatusResponse getApplicationStatus() {

        return new StatusResponse(
                "PulseWatch",
                "RUNNING",
                "1.0.0"
        );

    }

}