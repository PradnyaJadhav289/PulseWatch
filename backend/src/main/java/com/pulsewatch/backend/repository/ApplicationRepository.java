package com.pulsewatch.backend.repository;

import com.pulsewatch.backend.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
//Spring Data JPA + Hibernate translate your Java operations into SQL automatically.
import org.springframework.stereotype.Repository;

@Repository
//The first type (Application) tells Spring:
//        "This repository manages Application entities."
//
//The second type (Long) tells Spring:
//        "The primary key (@Id) of the entity is of type Long."
public interface ApplicationRepository extends JpaRepository<Application, Long> {

}