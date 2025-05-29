package com.example.demo.service;

import com.example.demo.model.Recommendation;
import java.util.List;

public interface RecommendationService {
    List<Recommendation> getAllRecommendations();

    List<Recommendation> getRecommendationsByAge(int age);

    List<Recommendation> getTopRecommendations(int limit);

    Recommendation addRecommendation(Recommendation recommendation);

    Recommendation updateRecommendation(Long id, Recommendation recommendation);

    void deleteRecommendation(Long id);
}