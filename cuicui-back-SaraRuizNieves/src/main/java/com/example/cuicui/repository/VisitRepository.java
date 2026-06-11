package com.example.cuicui.repository;

import com.example.cuicui.entity.Visit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface VisitRepository extends JpaRepository<Visit, UUID> {
    List<Visit> findByPetUserId(UUID userId);
}