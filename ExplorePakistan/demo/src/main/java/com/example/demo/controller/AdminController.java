package com.example.demo.controller;

import com.example.demo.service.UserStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final UserStatsService userStatsService;

    @Autowired
    public AdminController(UserStatsService userStatsService) {
        this.userStatsService = userStatsService;
    }

    @GetMapping("/user-stats")
    public ResponseEntity<Map<String, Object>> getUserStats() {
        Map<String, Object> stats = new HashMap<>();

        // Get total users count
        long totalUsers = userStatsService.getTotalUserCount();
        stats.put("totalUsers", totalUsers);

        // Get monthly signups for the last 6 months
        List<Map<String, Object>> monthlySignups = userStatsService.getMonthlySignups(6);
        stats.put("monthlySignups", monthlySignups);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/monthly-signups")
    public ResponseEntity<List<Map<String, Object>>> getMonthlySignups(
            @RequestParam(defaultValue = "6") int months) {
        List<Map<String, Object>> monthlySignups = userStatsService.getMonthlySignups(months);
        return ResponseEntity.ok(monthlySignups);
    }
}