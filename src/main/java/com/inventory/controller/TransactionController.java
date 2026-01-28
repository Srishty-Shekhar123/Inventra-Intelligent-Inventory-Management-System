package com.inventory.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inventory.model.Transaction;
import com.inventory.repository.TransactionRepository;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin("*")
public class TransactionController {

    private final TransactionRepository repo;

    public TransactionController(TransactionRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Transaction> getAllTransactions() {
        return repo.findAll();
    }
}