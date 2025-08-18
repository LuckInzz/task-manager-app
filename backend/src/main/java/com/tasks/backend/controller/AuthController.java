package com.tasks.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tasks.backend.dto.user.LoginRequestDTO;
import com.tasks.backend.dto.user.LoginResponseDTO;
import com.tasks.backend.dto.user.UserRegisterDTO;
import com.tasks.backend.dto.user.UserResponseDTO;
import com.tasks.backend.services.AuthService;
import com.tasks.backend.services.UserService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    
    private final UserService userService;
    private final AuthService authService;

    @Autowired
    public AuthController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> registerUser(@RequestBody UserRegisterDTO user) {
        UserResponseDTO userResponseDTO = userService.registerUser(user);
        return ResponseEntity.status(201).body(userResponseDTO);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> loginUser(@RequestBody LoginRequestDTO loginRequestDTO) {
        LoginResponseDTO response = authService.loginUser(loginRequestDTO);
        return ResponseEntity.ok(response);
    }
}
