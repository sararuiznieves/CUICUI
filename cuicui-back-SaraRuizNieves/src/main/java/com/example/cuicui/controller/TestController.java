package com.example.cuicui.controller;

import com.example.cuicui.controller.exception.NotFoundException;
import com.example.cuicui.dto.request.TestRequest;
import com.example.cuicui.dto.response.TestResponse;
import com.example.cuicui.service.TestServiceAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/test")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class TestController {

    @Autowired
    private TestServiceAdapter testServiceAdapter;

    @GetMapping("/pet/{petId}")
    public ResponseEntity<List<TestResponse>> findAllByPetId(
            @PathVariable UUID petId
    ) {
        return ResponseEntity.ok(testServiceAdapter.findAllByPetId(petId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestResponse> findById(
            @PathVariable UUID id
    ) throws NotFoundException {
        return ResponseEntity.ok(testServiceAdapter.findById(id));
    }

    @PostMapping("/upload")
    public ResponseEntity<TestResponse> create(
            @RequestParam UUID petId,
            @RequestParam String name,
            @RequestParam(required = false) String type,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate testDate,
            @RequestParam(required = false) String result,
            @RequestParam(required = false) String vetName,
            @RequestParam(required = false) String notes,
            @RequestParam(required = false) MultipartFile file
    ) throws Exception {

        TestRequest request = new TestRequest();

        request.setPetId(petId);
        request.setName(name);
        request.setType(type);
        request.setTestDate(testDate);
        request.setResult(result);
        request.setVetName(vetName);
        request.setNotes(notes);

        TestResponse response = testServiceAdapter.save(request, file);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/upload")
    public ResponseEntity<TestResponse> update(
            @PathVariable UUID id,
            @RequestParam UUID petId,
            @RequestParam String name,
            @RequestParam(required = false) String type,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate testDate,
            @RequestParam(required = false) String result,
            @RequestParam(required = false) String vetName,
            @RequestParam(required = false) String notes,
            @RequestParam(required = false) MultipartFile file
    ) throws Exception {

        TestRequest request = new TestRequest();

        request.setPetId(petId);
        request.setName(name);
        request.setType(type);
        request.setTestDate(testDate);
        request.setResult(result);
        request.setVetName(vetName);
        request.setNotes(notes);

        TestResponse response = testServiceAdapter.update(id, request, file);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id
    ) throws NotFoundException {

        testServiceAdapter.delete(id);

        return ResponseEntity.noContent().build();
    }
}