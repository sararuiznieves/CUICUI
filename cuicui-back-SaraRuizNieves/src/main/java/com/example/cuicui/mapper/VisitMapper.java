package com.example.cuicui.mapper;

import com.example.cuicui.dto.request.VisitRequest;
import com.example.cuicui.dto.response.VisitResponse;
import com.example.cuicui.entity.Pet;
import com.example.cuicui.entity.Visit;
import org.springframework.stereotype.Component;

@Component
public class VisitMapper {

    public VisitResponse entityToResponse(Visit visit) {
        VisitResponse response = new VisitResponse();

        response.setId(visit.getId());
        response.setVetName(visit.getVetName());
        response.setDate(visit.getDate());
        response.setTime(visit.getTime());
        response.setNotes(visit.getNotes());
        response.setUpdatedAt(visit.getUpdatedAt());
        response.setFinished(visit.getFinished());

        if (visit.getPet() != null) {
            response.setPetId(visit.getPet().getId());
            response.setPetName(visit.getPet().getPetName());
            response.setPetPhoto(visit.getPet().getPhoto());
        }

        return response;
    }

    public Visit requestToEntity(VisitRequest request, Pet pet) {
        Visit visit = new Visit();

        if (request.getId() != null) {
            visit.setId(request.getId());
        }

        visit.setPet(pet);
        visit.setVetName(request.getVetName());
        visit.setDate(request.getDate());
        visit.setTime(request.getTime());
        visit.setNotes(request.getNotes());

        return visit;
    }

    public void updateEntityFromRequest(VisitRequest request, Visit visit, Pet pet) {
        visit.setPet(pet);
        visit.setVetName(request.getVetName());
        visit.setDate(request.getDate());
        visit.setTime(request.getTime());
        visit.setNotes(request.getNotes());
    }


}