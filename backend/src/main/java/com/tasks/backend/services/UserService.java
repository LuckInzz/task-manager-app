package com.tasks.backend.services;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tasks.backend.dto.user.UserRegisterDTO;
import com.tasks.backend.dto.user.UserResponseDTO;
import com.tasks.backend.entity.User;
import com.tasks.backend.exception.ResourceNotFoundException;
import com.tasks.backend.repository.UserRepository;


@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponseDTO registerUser(UserRegisterDTO registerDTO) {
        if(userRepository.existsByEmail(registerDTO.getEmail())){
            throw new IllegalStateException("Email already used");
        }

        User newUser = new User();
        newUser.setName(registerDTO.getUsername());
        newUser.setEmail(registerDTO.getEmail());
        String encodedPassword = passwordEncoder.encode(registerDTO.getPassword());
        newUser.setPassword(encodedPassword);
        User savedUser = userRepository.save(newUser);  //Cria um novo User depois do repository atribuir um ID ao newUser.
        return convertToResponseDTO(savedUser);
    }

    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with this id: " + id));
        return convertToResponseDTO(user);
    }
    
    public List<UserResponseDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public void deleteUser(Long id) {
        //Auth
        userRepository.deleteById(id);
    }

    private UserResponseDTO convertToResponseDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        return dto;
    }
}
