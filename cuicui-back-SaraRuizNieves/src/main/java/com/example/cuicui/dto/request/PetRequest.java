package com.example.cuicui.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.annotation.Nullable;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class PetRequest {
    @Nullable
    private UUID id;
    private String petName;
    private String breed;
    private String gender;

    @Nullable
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateBirth;

    @Nullable
    private String photo;

    @Nullable
    private String photoName;

    @Nullable
    private Boolean removePhoto;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateAdoption;
}
