package com.inventory.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.inventory.model.User;
import com.inventory.repository.UserRepository;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin("*")
public class AdminUserController {

    private final UserRepository repo;

    public AdminUserController(UserRepository repo) {
        this.repo = repo;
    }

    // GET all users
    @GetMapping
    public List<User> getAllUsers() {
        return repo.findAll();
    }

    // ADD user (admin / emp)
    @PostMapping
    public String addUser(@RequestBody User user) {

        user.setPassword("123456"); // default password
        user.setActive(true);

        repo.save(user);
        return "User added successfully";
    }

    // BLOCK / UNBLOCK user
    @PutMapping("/toggle/{id}")
    public void toggleUser(@PathVariable Long id) {

        User user = repo.findById(id).orElseThrow();
        user.setActive(!user.isActive());
        repo.save(user);
    }
}
