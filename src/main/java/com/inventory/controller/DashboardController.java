package com.inventory.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inventory.model.Product;
import com.inventory.repository.ProductRepository;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin("*")
public class DashboardController {

    private final ProductRepository repo;

    public DashboardController(ProductRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/summary")
    public Map<String, Integer> getSummary() {

        List<Product> products = repo.findAll();

        int total = products.size();
        int available = 0;
        int low = 0;
        int critical = 0;

        for (Product p : products) {
            if (p.getQuantity() == 0) {
                critical++;
            } else if (p.getQuantity() <= 5) {
                low++;
            } else {
                available++;
            }
        }

        Map<String, Integer> data = new HashMap<>();
        data.put("total", total);
        data.put("available", available);
        data.put("low", low);
        data.put("critical", critical);

        return data;
    }
}
