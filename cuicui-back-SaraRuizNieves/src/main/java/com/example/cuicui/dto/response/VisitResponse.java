package com.example.cuicui.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Data
public class VisitResponse {

    private UUID id;

    private UUID petId;
    private String petName;
    private String petPhoto;

    private String vetName;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate date;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime time;

    private String notes;
    private LocalDateTime updatedAt;
    private Boolean finished;
}