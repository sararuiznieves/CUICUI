package com.example.cuicui.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpdateUserResponse {
    private String name;
    private String email;
    private String avatar;
}