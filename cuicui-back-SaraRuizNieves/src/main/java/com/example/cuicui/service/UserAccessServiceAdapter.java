package com.example.cuicui.service;

import com.example.cuicui.controller.exception.UnauthorizedException;
import com.example.cuicui.entity.User;

public interface UserAccessServiceAdapter {

    User shouldUserAccess(String email, String password) throws UnauthorizedException;

    User createUser(User user);

    User updateUser(User user);

}
