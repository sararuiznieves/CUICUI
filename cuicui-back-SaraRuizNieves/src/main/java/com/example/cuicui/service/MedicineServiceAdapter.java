package com.example.cuicui.service;

import com.example.cuicui.controller.exception.NotFoundException;
import com.example.cuicui.dto.request.MedicineRequest;
import com.example.cuicui.dto.response.MedicineResponse;

import java.util.List;
import java.util.UUID;

public interface MedicineServiceAdapter {
    List<MedicineResponse> findAllByPetId(UUID petId);

    MedicineResponse save(MedicineRequest request, UUID petId) throws NotFoundException;

    MedicineResponse update(UUID id, MedicineRequest request) throws NotFoundException;

    MedicineResponse endMedicine(UUID id) throws NotFoundException;

    MedicineResponse reactivateMedicine(UUID id) throws NotFoundException;

    void deleteMedicine(UUID id) throws NotFoundException;
}
