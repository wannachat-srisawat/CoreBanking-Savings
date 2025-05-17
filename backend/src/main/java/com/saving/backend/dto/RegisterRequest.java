package com.saving.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 6)
    private String password;

    @Pattern(regexp = "\\d{6}", message = "PIN must be 6 digits")
    private String pin;

    @NotBlank
    @Pattern(regexp = "CUSTOMER|TELLER", message = "Role must be either CUSTOMER or TELLER")
    private String role;

    @Pattern(regexp = "\\d{13}", message = "Citizen ID must be 13 digits")
    private String citizenId;

    @NotBlank
    @Pattern(regexp = "^[\\u0E00-\\u0E7F\\s]+$", message = "Thai name must contain only Thai characters")
    private String thaiName;

    @NotBlank
    @Pattern(regexp = "^[A-Za-z\\s]+$", message = "English name must contain only English letters")
    private String engName;
}