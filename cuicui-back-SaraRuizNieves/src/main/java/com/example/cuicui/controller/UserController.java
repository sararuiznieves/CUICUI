package com.example.cuicui.controller;

import com.example.cuicui.controller.exception.UnauthorizedException;
import com.example.cuicui.dto.request.ChangePasswordRequest;
import com.example.cuicui.dto.request.LoginRequest;
import com.example.cuicui.dto.request.UpdateUserRequest;
import com.example.cuicui.dto.request.UserRequest;
import com.example.cuicui.dto.response.LoginResponse;
import com.example.cuicui.dto.response.UserResponse;
import com.example.cuicui.dto.response.UpdateUserResponse;
import com.example.cuicui.entity.User;
import com.example.cuicui.mapper.UserMapper;
import com.example.cuicui.repository.UserRepository;
import com.example.cuicui.service.UserAccessServiceAdapter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserAccessServiceAdapter userAccessServiceAdapter;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private UserRepository userRepository;

    @Operation(
            summary = "Authenticate a user",
            description = "Validates the user's credentials and returns a success response if valid.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "User successfully authenticated"),
                    @ApiResponse(responseCode = "401", description = "Invalid username or password"),
                    @ApiResponse(responseCode = "400", description = "Invalid request input"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PostMapping("/loginProcess")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest, HttpSession session)
            throws UnauthorizedException {

        logger.info("Received login request with email: {}", loginRequest.getEmail());

        User user = userAccessServiceAdapter.shouldUserAccess(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );

        session.setAttribute("email", user.getEmail());
        session.setAttribute("usid", user.getId());

        System.out.println("LOGIN SESSION ID = " + session.getId());
        System.out.println("LOGIN usid = " + session.getAttribute("usid"));
        System.out.println("LOGIN email = " + session.getAttribute("email"));

        LoginResponse response = new LoginResponse(
                user.getId().toString(),
                user.getName(),
                user.getEmail(),
                user.getAvatar()
        );

        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body(response);
    }

    @Operation(
            summary = "Create a new user",
            description = "Creates a new user in the system.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "User successfully created"),
                    @ApiResponse(responseCode = "400", description = "Invalid user data provided"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PostMapping("/create")
    public ResponseEntity<UserResponse> createUser(@RequestBody @Valid UserRequest createRequest) {
        logger.info("Received create user request with data: {}", createRequest);

        User user = userMapper.toDomain(createRequest);
        User createdUser = userAccessServiceAdapter.createUser(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(userMapper.toResponse(createdUser));
    }

    @Operation(
            summary = "Update an existing user",
            description = "Updates the details of an existing user based on their ID.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "User successfully updated"),
                    @ApiResponse(responseCode = "404", description = "User not found"),
                    @ApiResponse(responseCode = "400", description = "Invalid data provided"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )

    @PutMapping("/update")
    public ResponseEntity<?> updateCurrentUser(
            @RequestBody UpdateUserRequest request,
            HttpSession session) {

        String currentEmail = (String) session.getAttribute("email");

        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 🔥 VALIDACIÓN EMAIL DUPLICADO
        if (!currentEmail.equals(request.getEmail()) &&
                userRepository.existsByEmail(request.getEmail())) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Correo electrónico ya en uso");
        }

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setAvatar(request.getAvatar());

        User savedUser = userRepository.save(user);

        session.setAttribute("email", savedUser.getEmail());

        return ResponseEntity.ok(new UpdateUserResponse(
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getAvatar()
        ));
    }

    @PutMapping("/changePassword")
    public ResponseEntity<String> changePassword(
            @RequestBody ChangePasswordRequest request,
            HttpSession session) {

        String email = (String) session.getAttribute("email");

        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Sesión no válida");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        user.setPassword(request.getNewPassword());
        userRepository.save(user);

        return ResponseEntity.ok("Contraseña actualizada");
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUser(HttpSession session) {

        String email = (String) session.getAttribute("email");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        userRepository.delete(user);

        session.invalidate();

        return ResponseEntity.ok("Usuario eliminado");
    }
}