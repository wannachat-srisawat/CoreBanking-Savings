package com.saving.backend.controller;

import com.saving.backend.dto.*;
import com.saving.backend.entity.SavingAccount;
import com.saving.backend.entity.Transaction;
import com.saving.backend.service.SavingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/saving")
@RequiredArgsConstructor
public class SavingAccountController {

    private final SavingService savingService;

    @PreAuthorize("hasAuthority('TELLER')")
    @PostMapping("/open")
    public ResponseEntity<Map<String, String>> openAccount(@Valid @RequestBody OpenAccountRequest req) {
        SavingAccount account = savingService.openAccount(req);

        Map<String, String> response = new HashMap<>();
        response.put("accountNumber", account.getAccountNumber());
        response.put("message", "บัญชีถูกสร้างเรียบร้อยแล้ว");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/deposit")
    @PreAuthorize("hasAuthority('TELLER')")
    public ResponseEntity<Map<String, String>> deposit(@Valid @RequestBody TransactionRequest request) {
        savingService.deposit(request.getAccountNumber(), request.getAmount());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Deposit successful");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/withdraw")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<Map<String, String>> withdraw(@Valid @RequestBody WithdrawRequest request) {
        savingService.withdrawWithPin(request.getAccountNumber(), request.getAmount(), request.getPin());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Withdraw successful");
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasAuthority('CUSTOMER')")
    @GetMapping("/accountInfo")
    public ResponseEntity<SavingAccount> getAccounts(@RequestParam String email) {
        SavingAccount accounts = savingService.getAccountsByEmail(email);
        return ResponseEntity.ok(accounts);
    }

    @PreAuthorize("hasAuthority('CUSTOMER')")
    @PostMapping("/transfer")
    public ResponseEntity<Map<String, String>> transfer(@Valid @RequestBody TransferRequest request, Authentication auth) {
        String email = auth.getName();
        savingService.transfer(
                request.getFromAccountNumber(),
                request.getToAccountNumber(),
                request.getAmount(),
                request.getPin(),
                email
        );

        Map<String, String> response = new HashMap<>();
        response.put("message", "Transfer successful");
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasAuthority('CUSTOMER')")
    @GetMapping("/statement")
    public ResponseEntity<MonthlyStatementResponse> getMonthlyStatement(
            @RequestParam String accountNumber,
            @RequestParam int month,
            @RequestParam int year
    ) {
        MonthlyStatementResponse response = savingService.getMonthlyStatement(accountNumber, month, year);
        return ResponseEntity.ok(response);
    }
}
