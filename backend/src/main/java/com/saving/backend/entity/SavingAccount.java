package com.saving.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "savingAccount")
@Data
public class SavingAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String accountNumber;

    private Double balance = 0.0;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User owner;
}