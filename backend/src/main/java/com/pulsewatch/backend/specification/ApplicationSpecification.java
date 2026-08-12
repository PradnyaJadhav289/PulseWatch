package com.pulsewatch.backend.specification;

import com.pulsewatch.backend.entity.Application;
import com.pulsewatch.backend.entity.ApplicationStatus;
import com.pulsewatch.backend.entity.Environment;
import org.springframework.data.jpa.domain.Specification;

public class ApplicationSpecification {

    public static Specification<Application> search(String search) {

        return (root, query, criteriaBuilder) -> {

            if (search == null || search.isBlank()) {
                return criteriaBuilder.conjunction();
            }

            String searchPattern = "%" + search.toLowerCase() + "%";

            return criteriaBuilder.or(
                    criteriaBuilder.like(
                            criteriaBuilder.lower(
                                    root.get("applicationName")
                            ),
                            searchPattern
                    ),
                    criteriaBuilder.like(
                            criteriaBuilder.lower(
                                    root.get("ownerTeam")
                            ),
                            searchPattern
                    )
            );
        };
    }

    public static Specification<Application> hasEnvironment(
            Environment environment) {

        return (root, query, criteriaBuilder) ->
                environment == null
                        ? criteriaBuilder.conjunction()
                        : criteriaBuilder.equal(
                        root.get("environment"),
                        environment
                );
    }

    public static Specification<Application> hasStatus(
            ApplicationStatus status) {

        return (root, query, criteriaBuilder) ->
                status == null
                        ? criteriaBuilder.conjunction()
                        : criteriaBuilder.equal(
                        root.get("status"),
                        status
                );
    }
}