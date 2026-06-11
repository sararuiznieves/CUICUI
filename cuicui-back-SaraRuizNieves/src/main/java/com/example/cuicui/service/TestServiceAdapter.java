package com.example.cuicui.service;

import com.example.cuicui.controller.exception.NotFoundException;
import com.example.cuicui.dto.request.TestRequest;
import com.example.cuicui.dto.response.TestResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface TestServiceAdapter {

    List<TestResponse> findAllByPetId(UUID petId);

    TestResponse findById(UUID id) throws NotFoundException;

    TestResponse save(TestRequest request, MultipartFile file) throws Exception;

    TestResponse update(UUID id, TestRequest request, MultipartFile file) throws Exception;

    void delete(UUID id) throws NotFoundException;
}