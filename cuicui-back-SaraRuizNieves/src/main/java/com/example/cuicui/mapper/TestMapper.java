package com.example.cuicui.mapper;

import com.example.cuicui.dto.request.TestRequest;
import com.example.cuicui.dto.response.TestResponse;
import com.example.cuicui.entity.Pet;
import com.example.cuicui.entity.Test;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TestMapper {

    public TestResponse entityToResponse(Test test) {
        TestResponse response = new TestResponse();

        response.setId(test.getId());

        response.setPetId(test.getPet().getId());
        response.setPetName(test.getPet().getPetName());

        response.setName(test.getName());
        response.setType(test.getType());
        response.setTestDate(test.getTestDate());
        response.setResult(test.getResult());
        response.setVetName(test.getVetName());
        response.setNotes(test.getNotes());

        response.setFileName(test.getFileName());
        response.setFilePath(test.getFilePath());
        response.setFileType(test.getFileType());

        return response;
    }

    public List<TestResponse> entityListToResponse(List<Test> tests) {
        return tests.stream()
                .map(this::entityToResponse)
                .toList();
    }

    public Test requestToEntity(TestRequest request, Pet pet) {
        Test test = new Test();

        if (request.getId() != null) {
            test.setId(request.getId());
        }

        test.setPet(pet);
        test.setName(request.getName());
        test.setType(request.getType());
        test.setTestDate(request.getTestDate());
        test.setResult(request.getResult());
        test.setVetName(request.getVetName());
        test.setNotes(request.getNotes());

        test.setFileName(request.getFileName());
        test.setFilePath(request.getFilePath());
        test.setFileType(request.getFileType());

        return test;
    }
}