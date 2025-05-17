package com.saving.backend.repository;

import com.saving.backend.entity.SavingAccount;
import com.saving.backend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByAccount_AccountNumber(String accountNumber);

    List<Transaction> findAllByAccountIn(List<SavingAccount> accounts);

    List<Transaction> findByAccountAndTransactionDateBetween(
            SavingAccount account,
            Date startDate,
            Date endDate
    );
}