package com.example.cuicui.service.impl;

import com.example.cuicui.dto.request.VisitRequest;
import com.example.cuicui.dto.response.VisitResponse;
import com.example.cuicui.entity.Pet;
import com.example.cuicui.entity.Visit;
import com.example.cuicui.mapper.VisitMapper;
import com.example.cuicui.repository.PetRepository;
import com.example.cuicui.repository.VisitRepository;
import com.example.cuicui.service.VisitServiceAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.webjars.NotFoundException;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
public class VisitServiceImpl implements VisitServiceAdapter {

    @Autowired
    private VisitRepository visitRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private VisitMapper visitMapper;

    @Override
    public List<VisitResponse> findMine(UUID userId) {
        return visitRepository.findByPetUserId(userId).stream()
                .sorted(Comparator.comparing(Visit::getDate).thenComparing(Visit::getTime))
                .map(visitMapper::entityToResponse)
                .toList();
    }

    @Override
    public VisitResponse findById(UUID id) {
        Visit visit = visitRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Visit not found with ID: " + id));

        return visitMapper.entityToResponse(visit);
    }

    @Override
    public VisitResponse create(VisitRequest request, UUID userId) {
        Pet pet = petRepository.findById(request.getPetId())
                .orElseThrow(() -> new NotFoundException("Pet not found with ID: " + request.getPetId()));

        if (!pet.getUser().getId().equals(userId)) {
            throw new RuntimeException("La mascota no pertenece al usuario autenticado");
        }

        Visit visit = visitMapper.requestToEntity(request, pet);
        Visit savedVisit = visitRepository.save(visit);

        return visitMapper.entityToResponse(savedVisit);
    }

    @Override
    public VisitResponse update(VisitRequest request, UUID userId) {
        Visit visit = visitRepository.findById(request.getId())
                .orElseThrow(() -> new NotFoundException("Visit not found with ID: " + request.getId()));

        Pet pet = petRepository.findById(request.getPetId())
                .orElseThrow(() -> new NotFoundException("Pet not found with ID: " + request.getPetId()));

        if (!pet.getUser().getId().equals(userId)) {
            throw new RuntimeException("La mascota no pertenece al usuario autenticado");
        }

        if (!visit.getPet().getUser().getId().equals(userId)) {
            throw new RuntimeException("La visita no pertenece al usuario autenticado");
        }

        visitMapper.updateEntityFromRequest(request, visit, pet);
        Visit updatedVisit = visitRepository.save(visit);

        return visitMapper.entityToResponse(updatedVisit);
    }

    @Override
    public void delete(UUID id, UUID userId) {
        Visit visit = visitRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Visit not found with ID: " + id));

        if (!visit.getPet().getUser().getId().equals(userId)) {
            throw new RuntimeException("La visita no pertenece al usuario autenticado");
        }

        visitRepository.delete(visit);
    }

    @Override
    public VisitResponse finish(UUID visitId, UUID userId) {

        Visit visit = visitRepository.findById(visitId)
                .orElseThrow(() ->
                        new NotFoundException("Visita no encontrada: " + visitId));

        if (!visit.getPet().getUser().getId().equals(userId)) {
            throw new RuntimeException("La visita no pertenece al usuario autenticado");
        }

        visit.setFinished(!visit.getFinished());

        Visit updatedVisit = visitRepository.save(visit);

        return visitMapper.entityToResponse(updatedVisit);
    }
}