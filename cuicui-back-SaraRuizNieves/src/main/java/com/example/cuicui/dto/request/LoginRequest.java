package com.example.cuicui.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class LoginRequest {
    @JsonProperty("email")
    private String email;
    @JsonProperty("password")
    private String password;
}