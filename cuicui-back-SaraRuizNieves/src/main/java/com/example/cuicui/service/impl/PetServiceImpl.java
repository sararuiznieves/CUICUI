package com.example.cuicui.service.impl;

import com.example.cuicui.dto.request.PetRequest;
import com.example.cuicui.dto.response.PetResponse;
import com.example.cuicui.entity.Pet;
import com.example.cuicui.entity.User;
import com.example.cuicui.mapper.PetMapper;
import com.example.cuicui.repository.PetRepository;
import com.example.cuicui.repository.UserRepository;
import com.example.cuicui.service.PetServiceAdapter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.webjars.NotFoundException;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
public class PetServiceImpl implements PetServiceAdapter {

  private static final Logger LOGGER = LoggerFactory.getLogger(PetServiceImpl.class);

  @Autowired
  private PetRepository petRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PetMapper petMapper;

  @Override
  public List<PetResponse> findAllByUserId(UUID userId) {
    List<Pet> pets = petRepository.findByUserId(userId);

    return pets.stream()
            .sorted((p1, p2) -> {
              boolean p1Deceased = p1.getDateDisable() != null;
              boolean p2Deceased = p2.getDateDisable() != null;

              if (p1Deceased == p2Deceased) {
                return p1.getCreatedAt().compareTo(p2.getCreatedAt());
              }

              return p1Deceased ? 1 : -1;
            })
            .map(petMapper::entityToResponse)
            .toList();
  }

  @Override
  public PetResponse findById(UUID id) {
    Pet pet = petRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Pet not found with ID: " + id));

    return petMapper.entityToResponse(pet);
  }

  @Override
  public PetResponse create(PetRequest petRequest, UUID userId) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new NotFoundException("User not found with ID: " + userId));

    try {
      if (petRequest.getPhoto() != null && !petRequest.getPhoto().isBlank()) {
        String photoName = saveImage(petRequest.getPhoto());
        petRequest.setPhotoName(photoName);
      }
    } catch (IOException e) {
      throw new RuntimeException("Error saving pet image", e);
    }

    Pet pet = petMapper.requestAndUserToEntity(petRequest, user);
    Pet savedPet = petRepository.save(pet);

    return petMapper.entityToResponse(savedPet);
  }

  @Override
  public PetResponse update(PetRequest petRequest, UUID userId) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new NotFoundException("User not found with ID: " + userId));

    Pet pet = petRepository.findById(petRequest.getId())
            .orElseThrow(() -> new NotFoundException("Pet not found with ID: " + petRequest.getId()));

    try {
      if (petRequest.getPhoto() != null && !petRequest.getPhoto().isBlank()) {
        String photoName = saveImage(petRequest.getPhoto());
        petRequest.setPhotoName(photoName);
      }
    } catch (IOException e) {
      throw new RuntimeException("Error saving pet image", e);
    }

    petMapper.updateEntityFromRequest(petRequest, pet, user);

    if (Boolean.TRUE.equals(petRequest.getRemovePhoto())) {
      pet.setPhoto(null);
    } else if (petRequest.getPhotoName() != null && !petRequest.getPhotoName().isBlank()) {
      pet.setPhoto(petRequest.getPhotoName());
    }

    Pet updatedPet = petRepository.save(pet);

    return petMapper.entityToResponse(updatedPet);
  }

  @Override
  public PetResponse disable(UUID id, LocalDate dateDisable) {
    Pet pet = petRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Pet not found with ID: " + id));

    pet.setDateDisable(dateDisable);

    Pet updatedPet = petRepository.save(pet);

    return petMapper.entityToResponse(updatedPet);
  }

  @Override
  public void hardDelete(UUID id) {
    Pet pet = petRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Pet not found with ID: " + id));

    petRepository.delete(pet);
  }

  private String saveImage(String decodedContent) throws IOException {
    byte[] decodedImage = Base64.getDecoder().decode(decodedContent);
    Path relativePath = Paths.get(
            "C:/Users/admin/Desktop/cuicui-front-SaraRuizNieves/public/pets"
    ).toAbsolutePath().normalize();

    String uploadDirectory = relativePath.toString();
    File directory = new File(uploadDirectory);

    if (!directory.exists() && !directory.mkdirs()) {
      throw new IOException("No se pudo crear el directorio: " + uploadDirectory);
    }

    String filename = UUID.randomUUID() + ".jpg";
    String filePath = uploadDirectory + File.separator + filename;
    LOGGER.info("Creando imagen en el directorio: {}", filePath);

    try (FileOutputStream outputStream = new FileOutputStream(filePath)) {
      outputStream.write(decodedImage);
      return filename;
    } catch (IOException e) {
      System.err.println("No se pudo guardar la imagen en " + filePath);
      throw new RuntimeException("Error al guardar la imagen: " + e.getMessage(), e);
    }
  }
}