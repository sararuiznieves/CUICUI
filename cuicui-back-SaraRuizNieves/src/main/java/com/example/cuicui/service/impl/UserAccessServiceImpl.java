package com.example.cuicui.service.impl;

import com.example.cuicui.controller.exception.UnauthorizedException;
import com.example.cuicui.entity.User;
import com.example.cuicui.repository.UserRepository;
import com.example.cuicui.service.UserAccessServiceAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserAccessServiceImpl implements UserAccessServiceAdapter {

    @Autowired
    UserRepository userRepository;

    @Override
    public User shouldUserAccess(String email, String password) throws UnauthorizedException {
        return userRepository.findByEmailAndPassword(email, password)
                .orElseThrow(() -> new UnauthorizedException("Wrong username or password."));
    }

    @Override
    public User createUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public User updateUser(User user) {
        return userRepository.save(user);
    }
}
