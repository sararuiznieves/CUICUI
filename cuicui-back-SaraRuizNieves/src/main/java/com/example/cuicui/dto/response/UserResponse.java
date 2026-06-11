package com.example.cuicui.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class UserResponse {
    private UUID id;
    private String email;
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}