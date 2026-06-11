package com.example.cuicui.controller.exception;

public class UnauthorizedException extends Exception{
    public UnauthorizedException() {
        super("Not found.");
    }

    public UnauthorizedException(String message) {
        super(message);
    }
}

