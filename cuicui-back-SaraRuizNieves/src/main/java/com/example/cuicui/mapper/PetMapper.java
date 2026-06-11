package com.example.cuicui.mapper;

import com.example.cuicui.dto.request.PetRequest;
import com.example.cuicui.dto.response.PetResponse;
import com.example.cuicui.entity.Pet;
import com.example.cuicui.entity.User;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class PetMapper {

    public PetResponse entityToResponse(Pet pet) {
        PetResponse response = new PetResponse();

        response.setId(pet.getId());
        response.setPetName(pet.getPetName());
        response.setBreed(pet.getBreed());
        response.setGender(pet.getGender());
        response.setDateBirth(pet.getDateBirth());
        response.setDateAdoption(pet.getDateAdoption());
        response.setDateDisable(pet.getDateDisable());
        response.setPhoto(pet.getPhoto());
        response.setUpdatedAt(pet.getUpdatedAt());

        if (pet.getUser() != null) {
            response.setUser(pet.getUser().getId());
            response.setOwnerName(pet.getUser().getName());
        }

        return response;
    }

    public List<PetResponse> entityListToResponse(List<Pet> pets) {
        return pets.stream()
                .map(this::entityToResponse)
                .collect(Collectors.toList());
    }

    public Pet requestAndUserToEntity(PetRequest petRequest, User user) {
        Pet pet = new Pet();

        if (petRequest.getId() != null) {
            pet.setId(petRequest.getId());
        }

        pet.setPetName(petRequest.getPetName());
        pet.setBreed(petRequest.getBreed());
        pet.setGender(petRequest.getGender());
        pet.setDateBirth(petRequest.getDateBirth());
        pet.setDateAdoption(petRequest.getDateAdoption());
        pet.setUser(user);

        if (StringUtils.hasText(petRequest.getPhotoName())) {
            pet.setPhoto(petRequest.getPhotoName());
        }

        return pet;
    }

    public void updateEntityFromRequest(PetRequest petRequest, Pet pet, User user) {
        pet.setPetName(petRequest.getPetName());
        pet.setBreed(petRequest.getBreed());
        pet.setGender(petRequest.getGender());
        pet.setDateBirth(petRequest.getDateBirth());
        pet.setDateAdoption(petRequest.getDateAdoption());
        pet.setUser(user);
    }
}