package com.inventory.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.inventory.model.Alert;
import com.inventory.model.Product;
import com.inventory.repository.AlertRepository;
import com.inventory.repository.ProductRepository;

@Service
public class AlertService {

    private final AlertRepository repo;
    private final ProductRepository productRepo;   

    public AlertService(AlertRepository repo, ProductRepository productRepo) {
        this.repo = repo;
        this.productRepo = productRepo;             
    }

    public void createAlert(String type, String message) {
        Alert alert = new Alert();
        alert.setType(type);
        alert.setMessage(message);
        alert.setStatus("Unread");
        repo.save(alert);
    }

    public List<Alert> getAllAlerts() {
        return repo.findAll();
    }

    public void markRead(Long id) {
        Alert alert = repo.findById(id).orElseThrow();
        alert.setStatus("Read");
        repo.save(alert);
    }

    public List<String> getExpiryAlerts() {

        List<String> alerts = new ArrayList<>();
        LocalDate today = LocalDate.now();

        List<Product> products = productRepo.findAll(); // 

        for (Product p : products) {

            if (p.getExpiryDate() == null) continue;

            long daysLeft =
                ChronoUnit.DAYS.between(today, p.getExpiryDate());

            if (daysLeft < 0) {
                alerts.add("❌ " + p.getName() + " has EXPIRED");
            }
            else if (daysLeft <= 7) {
                alerts.add("⚠️ " + p.getName() + " expires in " + daysLeft + " days");
            }
        }

        return alerts;
    }
    public Map<String, Integer> getExpirySummary() {

    int expiring = 0;
    int expired = 0;

    LocalDate today = LocalDate.now();
    List<Product> products = productRepo.findAll();

    for (Product p : products) {
        if (p.getExpiryDate() == null) continue;

        long daysLeft = ChronoUnit.DAYS.between(today, p.getExpiryDate());

        if (daysLeft < 0) {
            expired++;
        } else if (daysLeft <= 7) {
            expiring++;
        }
    }

    Map<String, Integer> map = new HashMap<>();
    map.put("expiring", expiring);
    map.put("expired", expired);

    return map;
}

}
