package com.inventory.repository;   

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.inventory.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}
