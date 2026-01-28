package com.inventory.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inventory.model.Alert;
import com.inventory.service.AlertService;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin("*")
public class AlertController {

    private final AlertService service;

    public AlertController(AlertService service) {
        this.service = service;
    }

    // GET all alerts
    @GetMapping
    public List<Alert> getAlerts() {
        return service.getAllAlerts();
    }

    // MARK alert as read (Admin)
    @PutMapping("/read/{id}")
    public void markRead(@PathVariable Long id) {
        service.markRead(id);
    }

    // GET expiry alerts
    @GetMapping("/expiry")
    public List<String> expiryAlerts() {
        return service.getExpiryAlerts();
    }

    @GetMapping("/expiry/summary")
public Map<String, Integer> expirySummary() {
    return service.getExpirySummary();
}

@GetMapping("/expiry/ack")
public Map<String, Integer> expiryAcknowledgement() {

    List<String> alerts = service.getExpiryAlerts();

    int expired = 0;
    int expiring = 0;

    for (String a : alerts) {
        if (a.contains("EXPIRED")) expired++;
        else expiring++;
    }

    Map<String, Integer> map = new HashMap<>();
    map.put("expired", expired);
    map.put("expiring", expiring);

    return map;
}



}
