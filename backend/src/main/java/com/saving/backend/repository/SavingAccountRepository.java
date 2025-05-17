package com.saving.backend.repository;

import com.saving.backend.entity.SavingAccount;
import com.saving.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavingAccountRepository extends JpaRepository<SavingAccount, Long> {
    Optional<SavingAccount> findByAccountNumber(String accountNumber);
    Optional<SavingAccount> findByOwner(User user);
    boolean existsByAccountNumber(String accountNumber);
}
