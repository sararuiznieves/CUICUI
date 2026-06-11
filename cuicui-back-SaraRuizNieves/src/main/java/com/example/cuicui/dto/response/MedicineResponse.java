package com.example.cuicui.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class MedicineResponse {

    private UUID id;

    private UUID petId;

    private String petName;

    // Nombre del medicamento
    private String name;

    private String dose;

    private String frequency;

    private boolean active;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    private String vetName;

    private String notes;
}