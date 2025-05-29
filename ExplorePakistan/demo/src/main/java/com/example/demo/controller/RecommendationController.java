package com.example.demo.controller;

import com.example.demo.model.Recommendation;
import com.example.demo.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "http://localhost:3000")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @Autowired
    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping
    public ResponseEntity<List<Recommendation>> getAllRecommendations() {
        return ResponseEntity.ok(recommendationService.getAllRecommendations());
    }

    @GetMapping("/age/{age}")
    public ResponseEntity<List<Recommendation>> getRecommendationsByAge(@PathVariable int age) {
        return ResponseEntity.ok(recommendationService.getRecommendationsByAge(age));
    }

    @GetMapping("/top/{limit}")
    public ResponseEntity<List<Recommendation>> getTopRecommendations(@PathVariable int limit) {
        return ResponseEntity.ok(recommendationService.getTopRecommendations(limit));
    }

    @PostMapping
    public ResponseEntity<Recommendation> addRecommendation(@RequestBody Recommendation recommendation) {
        return ResponseEntity.ok(recommendationService.addRecommendation(recommendation));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Recommendation> updateRecommendation(@PathVariable Long id,
            @RequestBody Recommendation recommendation) {
        Recommendation updated = recommendationService.updateRecommendation(id, recommendation);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecommendation(@PathVariable Long id) {
        recommendationService.deleteRecommendation(id);
        return ResponseEntity.noContent().build();
    }
}