package com.example.demo.service;

import com.example.demo.model.TravelHistory;
import java.util.List;
import java.util.concurrent.ExecutionException;

public interface TravelHistoryService {
    TravelHistory createTravelHistory(TravelHistory history) throws ExecutionException, InterruptedException;
    TravelHistory getTravelHistoryById(String id) throws ExecutionException, InterruptedException;
    List<TravelHistory> getTravelHistoriesByUser(String userId) throws ExecutionException, InterruptedException;
    TravelHistory updateTravelHistory(String id, TravelHistory history) throws ExecutionException, InterruptedException;
    String deleteTravelHistory(String id) throws ExecutionException, InterruptedException;
    List<TravelHistory> getRecentTravelHistories(String userId, int limit) throws ExecutionException, InterruptedException;
}