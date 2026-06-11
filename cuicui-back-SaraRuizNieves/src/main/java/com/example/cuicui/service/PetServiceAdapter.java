package com.example.cuicui.service;

import com.example.cuicui.dto.request.PetRequest;
import com.example.cuicui.dto.response.PetResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface PetServiceAdapter {

  List<PetResponse> findAllByUserId(UUID userId);

  PetResponse findById(UUID id);

  PetResponse create(PetRequest petRequest, UUID userId);

  PetResponse update(PetRequest petRequest, UUID userId);

  PetResponse disable(UUID id, LocalDate dateDisable);

  void hardDelete(UUID id);
}