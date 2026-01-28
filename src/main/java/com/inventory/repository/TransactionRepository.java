package com.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.inventory.model.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
}
