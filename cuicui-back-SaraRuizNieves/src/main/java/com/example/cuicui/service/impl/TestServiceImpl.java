package com.example.cuicui.service.impl;

import com.example.cuicui.controller.exception.NotFoundException;
import com.example.cuicui.dto.request.TestRequest;
import com.example.cuicui.dto.response.TestResponse;
import com.example.cuicui.entity.Pet;
import com.example.cuicui.entity.Test;
import com.example.cuicui.mapper.TestMapper;
import com.example.cuicui.repository.PetRepository;
import com.example.cuicui.repository.TestRepository;
import com.example.cuicui.service.TestServiceAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class TestServiceImpl implements TestServiceAdapter {

    private final Path uploadPath = Paths.get("uploads/tests");

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private TestMapper testMapper;

    @Override
    public java.util.List<TestResponse> findAllByPetId(UUID petId) {
        return testMapper.entityListToResponse(testRepository.findAllByPetId(petId));
    }

    @Override
    public TestResponse findById(UUID id) throws NotFoundException {
        Test test = testRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("No test with id " + id + " was found."));

        return testMapper.entityToResponse(test);
    }

    @Override
    public TestResponse save(TestRequest request, MultipartFile file) throws Exception {
        Pet pet = petRepository.findById(request.getPetId())
                .orElseThrow(() -> new NotFoundException("No pet with id " + request.getPetId() + " was found."));

        Test test = testMapper.requestToEntity(request, pet);

        saveFileIfPresent(test, file);

        Test savedTest = testRepository.save(test);

        return testMapper.entityToResponse(savedTest);
    }

    @Override
    public TestResponse update(UUID id, TestRequest request, MultipartFile file) throws Exception {
        Test test = testRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("No test with id " + id + " was found."));

        if (request.getPetId() != null) {
            Pet pet = petRepository.findById(request.getPetId())
                    .orElseThrow(() -> new NotFoundException("No pet with id " + request.getPetId() + " was found."));

            test.setPet(pet);
        }

        test.setName(request.getName());
        test.setType(request.getType());
        test.setTestDate(request.getTestDate());
        test.setResult(request.getResult());
        test.setVetName(request.getVetName());
        test.setNotes(request.getNotes());

        saveFileIfPresent(test, file);

        Test savedTest = testRepository.save(test);

        return testMapper.entityToResponse(savedTest);
    }

    @Override
    public void delete(UUID id) throws NotFoundException {
        Test test = testRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("No test with id " + id + " was found."));

        testRepository.delete(test);
    }

    private void saveFileIfPresent(Test test, MultipartFile file) throws Exception {
        if (file == null || file.isEmpty()) return;

        Files.createDirectories(uploadPath);

        String originalName = file.getOriginalFilename();
        String extension = "";

        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }

        String storedFileName = UUID.randomUUID() + extension;

        Path destination = uploadPath.resolve(storedFileName);

        Files.copy(file.getInputStream(), destination);

        test.setFileName(originalName);
        test.setFilePath(storedFileName);
        test.setFileType(file.getContentType());
    }
}