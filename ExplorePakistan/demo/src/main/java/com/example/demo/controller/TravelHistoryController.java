package com.example.demo.controller;

import com.example.demo.model.TravelHistory;
import com.example.demo.service.TravelHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/travel-histories")
@CrossOrigin(origins = "http://localhost:3000")
public class TravelHistoryController {

    @Autowired
    private TravelHistoryService travelHistoryService;

    @PostMapping
    public ResponseEntity<?> createTravelHistory(@RequestBody TravelHistory history) {
        try {
            TravelHistory createdHistory = travelHistoryService.createTravelHistory(history);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdHistory);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Error creating travel history: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTravelHistoryById(@PathVariable String id) {
        try {
            TravelHistory history = travelHistoryService.getTravelHistoryById(id);
            return ResponseEntity.ok(history);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Error retrieving travel history: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getTravelHistoriesByUser(@PathVariable String userId) {
        try {
            List<TravelHistory> histories = travelHistoryService.getTravelHistoriesByUser(userId);
            return ResponseEntity.ok(histories);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Error retrieving user's travel histories: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}/recent")
    public ResponseEntity<?> getRecentTravelHistories(
            @PathVariable String userId,
            @RequestParam(defaultValue = "3") int limit) {
        try {
            List<TravelHistory> histories = travelHistoryService.getRecentTravelHistories(userId, limit);
            return ResponseEntity.ok(histories);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Error retrieving recent travel histories: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTravelHistory(
            @PathVariable String id,
            @RequestBody TravelHistory history) {
        try {
            TravelHistory updatedHistory = travelHistoryService.updateTravelHistory(id, history);
            return ResponseEntity.ok(updatedHistory);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Error updating travel history: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTravelHistory(@PathVariable String id) {
        try {
            String result = travelHistoryService.deleteTravelHistory(id);
            return ResponseEntity.ok(result);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Error deleting travel history: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}