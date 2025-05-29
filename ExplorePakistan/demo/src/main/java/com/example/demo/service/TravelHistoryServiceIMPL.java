package com.example.demo.service;

import com.example.demo.model.TravelHistory;
import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
public class TravelHistoryServiceIMPL implements TravelHistoryService {
    private static final String COLLECTION_NAME = "travelHistories";

    @Override
    public TravelHistory createTravelHistory(TravelHistory history) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = db.collection(COLLECTION_NAME).document();
        history.setId(docRef.getId());

        // Convert dates to Firestore Timestamp
        Map<String, Object> historyMap = new HashMap<>();
        historyMap.put("id", history.getId());
        historyMap.put("userId", history.getUserId());
        historyMap.put("destination", history.getDestination());
        historyMap.put("startDate", Timestamp.of(history.getStartDate()));
        historyMap.put("endDate", Timestamp.of(history.getEndDate()));
        historyMap.put("durationDays", history.getDurationDays());
        historyMap.put("highlights", history.getHighlights());
        historyMap.put("rating", history.getRating());
        historyMap.put("imageUrls", history.getImageUrls() != null ? history.getImageUrls() : new ArrayList<>());
        historyMap.put("notes", history.getNotes() != null ? history.getNotes() : "");

        ApiFuture<WriteResult> writeResult = docRef.set(historyMap);
        writeResult.get();
        return history;
    }

    @Override
    public TravelHistory getTravelHistoryById(String id) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = db.collection(COLLECTION_NAME).document(id);
        DocumentSnapshot document = docRef.get().get();

        if (document.exists()) {
            return document.toObject(TravelHistory.class);
        } else {
            throw new IllegalArgumentException("Travel history not found with ID: " + id);
        }
    }

    @Override
    public List<TravelHistory> getTravelHistoriesByUser(String userId) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        Query query = db.collection(COLLECTION_NAME)
                       .whereEqualTo("userId", userId)
                       .orderBy("startDate", Query.Direction.DESCENDING);

        ApiFuture<QuerySnapshot> querySnapshot = query.get();
        List<TravelHistory> histories = new ArrayList<>();

        // Debugging log to check query results
        System.out.println("Fetching travel histories for userId: " + userId);

        for (DocumentSnapshot document : querySnapshot.get().getDocuments()) {
            System.out.println("Document found: " + document.getId() + " => " + document.getData());
            histories.add(document.toObject(TravelHistory.class));
        }

        System.out.println("Total travel histories fetched: " + histories.size());
        return histories;
    }

    @Override
    public TravelHistory updateTravelHistory(String id, TravelHistory history) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = db.collection(COLLECTION_NAME).document(id);

        Map<String, Object> updates = new HashMap<>();
        updates.put("destination", history.getDestination());
        updates.put("startDate", Timestamp.of(history.getStartDate()));
        updates.put("endDate", Timestamp.of(history.getEndDate()));
        updates.put("durationDays", history.getDurationDays());
        updates.put("highlights", history.getHighlights());
        updates.put("rating", history.getRating());
        updates.put("imageUrls", history.getImageUrls());
        updates.put("notes", history.getNotes());

        ApiFuture<WriteResult> writeResult = docRef.update(updates);
        writeResult.get();

        // Return updated document
        DocumentSnapshot updatedDoc = docRef.get().get();
        return updatedDoc.toObject(TravelHistory.class);
    }

    @Override
    public String deleteTravelHistory(String id) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = db.collection(COLLECTION_NAME).document(id);

        // Check if document exists first
        if (!docRef.get().get().exists()) {
            throw new IllegalArgumentException("Travel history not found with ID: " + id);
        }

        ApiFuture<WriteResult> writeResult = docRef.delete();
        writeResult.get();
        return "Travel history with ID " + id + " has been deleted.";
    }

    @Override
    public List<TravelHistory> getRecentTravelHistories(String userId, int limit) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        Query query = db.collection(COLLECTION_NAME)
                       .whereEqualTo("userId", userId)
                       .orderBy("startDate", Query.Direction.DESCENDING)
                       .limit(limit);

        ApiFuture<QuerySnapshot> querySnapshot = query.get();
        List<TravelHistory> histories = new ArrayList<>();

        for (DocumentSnapshot document : querySnapshot.get().getDocuments()) {
            histories.add(document.toObject(TravelHistory.class));
        }

        return histories;
    }
}