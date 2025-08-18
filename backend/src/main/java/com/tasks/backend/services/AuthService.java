package com.tasks.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.tasks.backend.dto.user.LoginRequestDTO;
import com.tasks.backend.dto.user.LoginResponseDTO;
import com.tasks.backend.entity.User;

@Service
public class AuthService {
    
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Autowired
    public AuthService(AuthenticationManager authenticationManager, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public LoginResponseDTO loginUser(LoginRequestDTO loginRequestDTO) {
        Authentication auth = authenticationManager.authenticate
        (new UsernamePasswordAuthenticationToken(loginRequestDTO.getEmail(), loginRequestDTO.getPassword()));
        
        User user = (User) auth.getPrincipal();
        String jwt = jwtService.generateToken(user);

        return new LoginResponseDTO(jwt);
    }
}
