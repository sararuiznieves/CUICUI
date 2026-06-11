package com.example.cuicui.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserRequest {
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String name;
}
