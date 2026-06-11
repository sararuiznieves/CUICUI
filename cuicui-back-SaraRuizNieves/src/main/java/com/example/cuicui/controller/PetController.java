package com.example.cuicui.controller;

import com.example.cuicui.dto.request.PetDeceaseRequest;
import com.example.cuicui.dto.request.PetRequest;
import com.example.cuicui.dto.response.PetResponse;
import com.example.cuicui.service.PetServiceAdapter;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/pets")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class PetController {

    @Autowired
    private PetServiceAdapter petServiceAdapter;

    @GetMapping("/mine")
    public ResponseEntity<List<PetResponse>> findMine(HttpSession session) {
        UUID userId = (UUID) session.getAttribute("usid");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(petServiceAdapter.findAllByUserId(userId));
    }

    @GetMapping("/{petId}")
    public ResponseEntity<PetResponse> getPet(@PathVariable UUID petId) {
        return ResponseEntity.ok(petServiceAdapter.findById(petId));
    }

    @PostMapping("/create")
    public ResponseEntity<PetResponse> create(@RequestBody PetRequest petRequest, HttpSession session) {
        System.out.println("CREATE SESSION ID = " + session.getId());
        System.out.println("CREATE usid = " + session.getAttribute("usid"));
        System.out.println("CREATE email = " + session.getAttribute("email"));
        System.out.println("CREATE body = " + petRequest);

        UUID userId = (UUID) session.getAttribute("usid");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(petServiceAdapter.create(petRequest, userId));
    }

    @PutMapping("/update")
    public ResponseEntity<PetResponse> update(@RequestBody PetRequest petRequest, HttpSession session) {
        UUID userId = (UUID) session.getAttribute("usid");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(petServiceAdapter.update(petRequest, userId));
    }

    @DeleteMapping("/{petId}/hard-delete")
    public ResponseEntity<Void> hardDelete(@PathVariable UUID petId) {
        petServiceAdapter.hardDelete(petId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{petId}/decease")
    public ResponseEntity<PetResponse> markAsDeceased(
            @PathVariable UUID petId,
            @RequestBody PetDeceaseRequest request) {

        return ResponseEntity.ok(
                petServiceAdapter.disable(petId, request.getDateDisable())
        );
    }
}