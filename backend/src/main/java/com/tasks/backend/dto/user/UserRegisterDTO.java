package com.tasks.backend.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserRegisterDTO {
    
    @NotBlank(message="Name can not be blank")
    private String username;

    @NotBlank(message = "Email can not be blank.")
    @Email(message = "Email format is invalid.")
    private String email;

    @NotBlank(message = "Password can not be blank.")
    @Size(min = 6, message = "Password must have a least 6 characters/numbers.")
    private String password;

    public UserRegisterDTO(){}

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }    
}
