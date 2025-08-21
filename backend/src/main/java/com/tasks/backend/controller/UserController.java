package com.tasks.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tasks.backend.dto.user.UserResponseDTO;
import com.tasks.backend.entity.User;
import com.tasks.backend.services.UserService;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    
    private final UserService userService;

    @Autowired
    public UserController (UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserResponseDTO> getAll() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getById(@PathVariable Long id) {
        UserResponseDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getMyInfo(@AuthenticationPrincipal User currentUser) {
        // @AuthenticationPrincipal injeta o utilizador que foi validado a partir do token.
        // Convertemos a entidade para um DTO seguro antes de a retornar.
        UserResponseDTO userDto = userService.convertToResponseDTO(currentUser);
        return ResponseEntity.ok(userDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

}
