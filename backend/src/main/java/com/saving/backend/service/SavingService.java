package com.saving.backend.service;

import com.saving.backend.dto.MonthlyStatementResponse;
import com.saving.backend.dto.OpenAccountRequest;
import com.saving.backend.entity.SavingAccount;
import com.saving.backend.entity.Transaction;
import com.saving.backend.entity.TransactionType;
import com.saving.backend.entity.User;
import com.saving.backend.repository.SavingAccountRepository;
import com.saving.backend.repository.TransactionRepository;
import com.saving.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class SavingService {
    private final SavingAccountRepository savingAccountRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public SavingAccount openAccount(OpenAccountRequest req) {
        User user = userRepository.findByCitizenId(req.getCitizenId())
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setCitizenId(req.getCitizenId());
                    newUser.setThaiName(req.getThaiName());
                    newUser.setEngName(req.getEngName());
                    newUser.setRole("CUSTOMER");
                    return userRepository.save(newUser);
                });

        Optional<SavingAccount> existing = savingAccountRepository.findByOwner(user);
        if (existing.isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"This user already has a saving account");
        }

        SavingAccount acc = new SavingAccount();
        acc.setAccountNumber(generateAccountNumber());
        acc.setBalance(req.getInitialDeposit() != null ? req.getInitialDeposit() : 0.0);
        acc.setOwner(user);
        SavingAccount newAcc = savingAccountRepository.save(acc);
        if(req.getInitialDeposit() != null && req.getInitialDeposit() != 0.0){
            Transaction txn = new Transaction();
            txn.setTransactionDate(new Date());
            txn.setType(TransactionType.DEPOSIT);
            txn.setAmount(req.getInitialDeposit());
            txn.setAccount(newAcc);
            txn.setBalance(newAcc.getBalance());
            txn.setRemark("Deposit by teller");
            transactionRepository.save(txn);
        }
        return newAcc;
    }


    public Transaction deposit(String accountNumber, double amount) {
        if (amount <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Deposit amount must be greater than 0");
        }


        SavingAccount acc = savingAccountRepository.findByAccountNumber(accountNumber).orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,"AccountNumber not found"));

        acc.setBalance(acc.getBalance() + amount);
        savingAccountRepository.save(acc);

        Transaction txn = new Transaction();
        txn.setTransactionDate(new Date());
        txn.setType(TransactionType.DEPOSIT);
        txn.setAmount(amount);
        txn.setAccount(acc);
        txn.setBalance(acc.getBalance());
        txn.setRemark("Deposit by teller");
        return transactionRepository.save(txn);
    }

    public void withdrawWithPin(String accountNumber, Double amount, String rawPin) {
        SavingAccount acc = savingAccountRepository.findByAccountNumber(accountNumber).orElseThrow(() -> new RuntimeException("AccountNumber not found"));
        User user = acc.getOwner();

        if (!passwordEncoder.matches(rawPin, user.getPin())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid PIN");
        }

        if (acc.getBalance() < amount.doubleValue()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Insufficient balance");
        }

        acc.setBalance(acc.getBalance() - amount.doubleValue());
        savingAccountRepository.save(acc);

        Transaction txn = new Transaction();
        txn.setTransactionDate(new Date());
        txn.setType(TransactionType.WITHDRAW);
        txn.setAmount(amount.doubleValue());
        txn.setAccount(acc);
        txn.setBalance(acc.getBalance());
        txn.setRemark("Withdraw by customer");
        transactionRepository.save(txn);
    }
    public SavingAccount getAccountsByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST ,"User not found"));

        return savingAccountRepository.findByOwner(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST ,"Saving account not found"));
    }

    public void transfer(String fromAccNo, String toAccNo, double amount, String pin, String email) {
        SavingAccount from = savingAccountRepository.findByAccountNumber(fromAccNo).orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,"AccountNumber not found"));
        SavingAccount to = savingAccountRepository.findByAccountNumber(toAccNo).orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,"AccountNumber not found"));

        if (!from.getOwner().getEmail().equals(email)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"You are not the owner of this account");
        }

        if (!passwordEncoder.matches(pin, from.getOwner().getPin())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid PIN");
        }

        if (from.getBalance() < amount) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Insufficient balance");
        }

        from.setBalance(from.getBalance() - amount);
        to.setBalance(to.getBalance() + amount);
        savingAccountRepository.saveAll(List.of(from, to));

        List<Transaction> txnList = new ArrayList<>();

        Transaction txnFrom = new Transaction();
        txnFrom.setTransactionDate(new Date());
        txnFrom.setType(TransactionType.TRANSFER_OUT);
        txnFrom.setAmount(amount);
        txnFrom.setAccount(from);
        txnFrom.setBalance(from.getBalance());
        txnFrom.setRemark("Transfer to " + toAccNo);

        txnList.add(txnFrom);

        Transaction txnTo = new Transaction();
        txnTo.setTransactionDate(new Date());
        txnTo.setType(TransactionType.TRANSFER_IN);
        txnTo.setAmount(amount);
        txnTo.setAccount(to);
        txnTo.setBalance(to.getBalance());
        txnTo.setRemark("Receive from " + fromAccNo);

        txnList.add(txnTo);

        transactionRepository.saveAll(txnList);
    }

    public MonthlyStatementResponse getMonthlyStatement(String accountNumber, int month, int year) {
        SavingAccount acc = savingAccountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,"Account not found"));

        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        List<Transaction> txns = transactionRepository.findByAccountAndTransactionDateBetween(
                acc,
                java.sql.Date.valueOf(startDate),
                java.sql.Date.valueOf(endDate)
        );

        double totalIn = txns.stream()
                .filter(t -> t.getType() == TransactionType.DEPOSIT || t.getType() == TransactionType.TRANSFER_IN)
                .mapToDouble(Transaction::getAmount).sum();

        double totalOut = txns.stream()
                .filter(t -> t.getType() == TransactionType.WITHDRAW || t.getType() == TransactionType.TRANSFER_OUT)
                .mapToDouble(Transaction::getAmount).sum();

        return new MonthlyStatementResponse(
                acc.getAccountNumber(),
                month,
                year,
                txns,
                totalIn,
                totalOut
        );
    }

    public String generateAccountNumber() {
        String accountNumber;
        do {
            accountNumber = String.format("%07d", new Random().nextInt(10_000_000));
        } while (savingAccountRepository.existsByAccountNumber(accountNumber));
        return accountNumber;
    }
}

