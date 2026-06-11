package com.example.cuicui.controller;

import com.example.cuicui.dto.request.VisitRequest;
import com.example.cuicui.dto.response.VisitResponse;
import com.example.cuicui.service.VisitServiceAdapter;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/visits")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class VisitController {

    @Autowired
    private VisitServiceAdapter visitServiceAdapter;

    @GetMapping("/mine")
    public ResponseEntity<List<VisitResponse>> findMine(HttpSession session) {
        UUID userId = (UUID) session.getAttribute("usid");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(visitServiceAdapter.findMine(userId));
    }

    @PostMapping("/create")
    public ResponseEntity<VisitResponse> create(
            @RequestBody VisitRequest request,
            HttpSession session) {

        UUID userId = (UUID) session.getAttribute("usid");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(visitServiceAdapter.create(request, userId));
    }

    @PutMapping("/update")
    public ResponseEntity<VisitResponse> update(
            @RequestBody VisitRequest request,
            HttpSession session) {

        UUID userId = (UUID) session.getAttribute("usid");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(visitServiceAdapter.update(request, userId));
    }

    @PutMapping("/{visitId}/finish")
    public ResponseEntity<VisitResponse> finish(
            @PathVariable UUID visitId,
            HttpSession session) {

        UUID userId = (UUID) session.getAttribute("usid");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(
                visitServiceAdapter.finish(visitId, userId)
        );
    }

    @GetMapping("/{visitId}")
    public ResponseEntity<VisitResponse> findById(@PathVariable UUID visitId) {
        return ResponseEntity.ok(visitServiceAdapter.findById(visitId));
    }
}