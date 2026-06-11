package com.example.cuicui.repository;

import com.example.cuicui.entity.Test;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TestRepository extends JpaRepository<Test, UUID> {

    List<Test> findAllByPetId(UUID petId);
}