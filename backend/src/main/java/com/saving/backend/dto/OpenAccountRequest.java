package com.saving.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OpenAccountRequest {
    @NotBlank
    private String citizenId;

    @NotBlank
    private String thaiName;

    @NotBlank
    private String engName;

    private Double initialDeposit;
}
