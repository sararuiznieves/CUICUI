package com.example.cuicui.mapper;

import com.example.cuicui.entity.User;
import com.example.cuicui.dto.request.UserRequest;
import com.example.cuicui.dto.response.UserResponse;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toDomain(UserRequest createRequest) {
        User user = new User();
        user.setEmail(createRequest.getEmail());
        user.setPassword(createRequest.getPassword());
        user.setName(createRequest.getName());
        return user;
    }

    public UserResponse toResponse(User createdUser) {
        UserResponse response = new UserResponse();
        response.setId(createdUser.getId());
        response.setEmail(createdUser.getEmail());
        response.setName(createdUser.getName());
        response.setCreatedAt(createdUser.getCreatedAt());
        return response;
    }
}

