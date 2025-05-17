package com.saving.backend.dto;

import com.saving.backend.entity.Transaction;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class MonthlyStatementResponse {
    private String accountNumber;
    private int month;
    private int year;
    private List<Transaction> transactions;
    private double totalIn;
    private double totalOut;
}
