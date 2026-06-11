package com.example.cuicui.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class TestRequest {

    private UUID id;
    private UUID petId;

    private String name;
    private String type;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate testDate;

    private String result;
    private String vetName;
    private String notes;

    private String fileName;
    private String filePath;
    private String fileType;
}