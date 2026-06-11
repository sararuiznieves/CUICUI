package com.example.cuicui.service.impl;

import com.example.cuicui.controller.exception.NotFoundException;
import com.example.cuicui.dto.request.MedicineRequest;
import com.example.cuicui.dto.response.MedicineResponse;
import com.example.cuicui.entity.Medicine;
import com.example.cuicui.entity.Pet;
import com.example.cuicui.mapper.MedicineMapper;
import com.example.cuicui.repository.MedicineRepository;
import com.example.cuicui.repository.PetRepository;
import com.example.cuicui.service.MedicineServiceAdapter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MedicineServiceImpl implements MedicineServiceAdapter {

  private static final Logger logger = LoggerFactory.getLogger(MedicineServiceImpl.class);

  @Autowired
  MedicineRepository medicineRepository;
  @Autowired
  MedicineMapper medicineMapper;
  @Autowired
  PetRepository petRepository;

  @Override
  public List<MedicineResponse> findAllByPetId(UUID petId) {
    List<Medicine> meds = medicineRepository.findAllByPetId(petId);

    return medicineMapper.entityListToResponse(meds);
  }

  @Override
  public MedicineResponse save(MedicineRequest request, UUID petId) throws NotFoundException {

    Optional<Pet> pet = petRepository.findById(petId);
    if (pet.isEmpty()) {
      throw new NotFoundException("Not pet with id " + petId + " was found.");
    }

    Medicine medicine = medicineMapper.RequestAndPetIdtoEntity(request, pet.get());

    if (medicine.getStartDate() == null || !LocalDate.now().isBefore(medicine.getStartDate())) {
      medicine.setActive(medicine.getEndDate() == null || !LocalDate.now().isAfter(medicine.getEndDate()));
    } else {
      medicine.setActive(false);
    }

    medicine = medicineRepository.save(medicine);

    return medicineMapper.entitytoResponse(medicine);
  }

  @Override
  public MedicineResponse endMedicine(UUID id) throws NotFoundException {
    Medicine medicine = medicineRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("No medicine with id " + id + " was found."));

    medicine.setEndDate(LocalDate.now());
    medicine.setActive(false);

    Medicine savedMed = medicineRepository.save(medicine);

    return medicineMapper.entitytoResponse(savedMed);
  }

  @Override
  public MedicineResponse update(UUID id, MedicineRequest request) throws NotFoundException {
    Optional<Medicine> medicineOptional = medicineRepository.findById(id);

    if (medicineOptional.isEmpty()) {
      throw new NotFoundException("No medicine with id " + id + " was found.");
    }

    Medicine medicine = medicineOptional.get();

    medicine.setName(request.getName());
    medicine.setDose(request.getDose());
    medicine.setFrequency(request.getFrequency());
    medicine.setStartDate(request.getStartDate());
    medicine.setEndDate(request.getEndDate());
    medicine.setVetName(request.getVetName());
    medicine.setNotes(request.getNotes());

    if (request.getPetId() != null) {
      Pet pet = petRepository.findById(request.getPetId())
              .orElseThrow(() -> new NotFoundException("No pet with id " + request.getPetId() + " was found."));

      medicine.setPet(pet);
    }

    medicine.setActive(
            medicine.getEndDate() == null || !LocalDate.now().isAfter(medicine.getEndDate())
    );

    Medicine savedMedicine = medicineRepository.save(medicine);

    return medicineMapper.entitytoResponse(savedMedicine);
  }

  @Override
  public MedicineResponse reactivateMedicine(UUID id) throws NotFoundException {
    Optional<Medicine> medicineOptional = medicineRepository.findById(id);

    if (medicineOptional.isEmpty()) {
      throw new NotFoundException("No medicine with id " + id + " was found.");
    }

    Medicine medicine = medicineOptional.get();

    medicine.setActive(true);
    medicine.setEndDate(null);

    Medicine savedMedicine = medicineRepository.save(medicine);

    return medicineMapper.entitytoResponse(savedMedicine);
  }

  @Override
  public void deleteMedicine(UUID id) throws NotFoundException {
    Optional<Medicine> medicine = medicineRepository.findById(id);

    if (medicine.isEmpty()) {
      throw new NotFoundException("No medicine with id " + id + " was found.");
    }

    medicineRepository.delete(medicine.get());
  }
}
