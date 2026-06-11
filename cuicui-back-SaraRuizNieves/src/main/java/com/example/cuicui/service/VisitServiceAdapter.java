package com.example.cuicui.service;

import com.example.cuicui.dto.request.VisitRequest;
import com.example.cuicui.dto.response.VisitResponse;

import java.util.List;
import java.util.UUID;

public interface VisitServiceAdapter {

    List<VisitResponse> findMine(UUID userId);

    VisitResponse findById(UUID id);

    VisitResponse create(VisitRequest request, UUID userId);

    VisitResponse update(VisitRequest request, UUID userId);

    VisitResponse finish(UUID visitId, UUID userId);

    void delete(UUID id, UUID userId);
}