package com.example.cuicui.repository;

import com.example.cuicui.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MedicineRepository extends JpaRepository<Medicine, UUID> {

    List<Medicine> findAllByPetId(UUID petId);
}