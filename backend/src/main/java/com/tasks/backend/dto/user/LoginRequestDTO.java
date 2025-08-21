package com.tasks.backend.dto.user;

import jakarta.validation.constraints.NotBlank;

public class LoginRequestDTO {
    
    @NotBlank(message = "Email can not be blank.")
    private String email;
    @NotBlank(message = "Password can not be blank.")
    private String password;

    public LoginRequestDTO(){}

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
