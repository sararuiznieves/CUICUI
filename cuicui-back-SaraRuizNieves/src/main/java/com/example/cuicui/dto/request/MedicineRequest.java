package com.example.cuicui.dto.request;

import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class MedicineRequest {
    private UUID id;
    private UUID petId;
    public String name;
    public String frequency;
    public boolean active;
    public String dose;
    public String vetName;
    public String notes;
    private LocalDate startDate;
    private LocalDate endDate;
}
