package com.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.inventory.model.Alert;

public interface AlertRepository extends JpaRepository<Alert, Long> {
}
