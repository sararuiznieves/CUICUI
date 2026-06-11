package com.example.cuicui.mapper;

import com.example.cuicui.dto.request.MedicineRequest;
import com.example.cuicui.dto.response.MedicineResponse;
import com.example.cuicui.entity.Medicine;
import com.example.cuicui.entity.Pet;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class MedicineMapper {

    public MedicineResponse entitytoResponse(Medicine medicine) {
        MedicineResponse response = new MedicineResponse();

        response.setId(medicine.getId());
        response.setPetId(medicine.getPet().getId());
        response.setPetName(medicine.getPet().getPetName());

        response.setName(medicine.getName());
        response.setDose(medicine.getDose());
        response.setFrequency(medicine.getFrequency());
        response.setActive(medicine.isActive());
        response.setStartDate(medicine.getStartDate());
        response.setEndDate(medicine.getEndDate());
        response.setVetName(medicine.getVetName());
        response.setNotes(medicine.getNotes());

        return response;
    }

    public List<MedicineResponse> entityListToResponse(List<Medicine> medicines) {
        return medicines.stream()
                .map(this::entitytoResponse)
                .collect(Collectors.toList());
    }

    public Medicine RequestAndPetIdtoEntity(MedicineRequest request, Pet pet) {
        Medicine medicine = new Medicine();

        if (request.getId() != null) {
            medicine.setId(request.getId());
        }

        medicine.setPet(pet);
        medicine.setName(request.getName());
        medicine.setDose(request.getDose());
        medicine.setFrequency(request.getFrequency());
        medicine.setActive(request.isActive());
        medicine.setStartDate(request.getStartDate());
        medicine.setEndDate(request.getEndDate());
        medicine.setVetName(request.getVetName());
        medicine.setNotes(request.getNotes());

        return medicine;
    }
}