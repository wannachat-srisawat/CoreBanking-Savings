package com.saving.backend.entity;

import jakarta.persistence.*;
import lombok.Data;


@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;

    private String password;
    private String pin;

    private String role;

    @Column(unique = true)
    private String citizenId;

    private String thaiName;
    private String engName;
}
