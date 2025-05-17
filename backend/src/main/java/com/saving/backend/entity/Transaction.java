package com.saving.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Table(name = "transaction")
@Data
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Date transactionDate;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    private Double amount;

    private Double balance;

    private String remark;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private SavingAccount account;
}