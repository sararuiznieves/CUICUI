package com.example.cuicui.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String sessionId;
    private String name;
    private String email;
    private String avatar;
}