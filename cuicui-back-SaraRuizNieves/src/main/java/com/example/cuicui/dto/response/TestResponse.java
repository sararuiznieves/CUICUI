package com.example.cuicui.dto.response;

import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class TestResponse {

    private UUID id;

    private UUID petId;
    private String petName;

    private String name;
    private String type;

    private LocalDate testDate;

    private String result;
    private String vetName;
    private String notes;

    private String fileName;
    private String filePath;
    private String fileType;
}