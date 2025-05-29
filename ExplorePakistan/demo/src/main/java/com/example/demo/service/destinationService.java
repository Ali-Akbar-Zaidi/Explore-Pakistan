package com.example.demo.service;

import com.example.demo.model.Destination;
import com.google.firebase.database.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Service
public class destinationService {

    private final DatabaseReference databaseRef;

    @Autowired
    public destinationService(FirebaseDatabase firebaseDatabase) {
        this.databaseRef = firebaseDatabase.getReference("destinations");
    }

    public List<Destination> getAllDestinations() throws ExecutionException, InterruptedException {
        CompletableFuture<List<Destination>> future = new CompletableFuture<>();
        
        databaseRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                List<Destination> destinations = new ArrayList<>();
                for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                    Destination dest = snapshot.getValue(Destination.class);
                    dest.setId(snapshot.getKey());
                    destinations.add(dest);
                }
                future.complete(destinations);
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                future.completeExceptionally(databaseError.toException());
            }
        });

        return future.get();
    }

    public Destination addDestination(Destination destination) throws InterruptedException, ExecutionException {
        // Ensure lists are initialized
        if (destination.getActivities() == null) destination.setActivities(new ArrayList<>());
        if (destination.getTags() == null) destination.setTags(new ArrayList<>());
        
        DatabaseReference newRef = databaseRef.push();
        String newId = newRef.getKey();
        destination.setId(newId);
        
        // Create a simple Map without special array handling
        Map<String, Object> destinationValues = destination.toMap();
        
        try {
            // Use setValueAsync() and wait for completion
            newRef.setValueAsync(destinationValues).get();
            return destination;
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Failed to save destination to Firebase", e);
        }
    }

    public void deleteDestination(String id) {
        databaseRef.child(id).removeValueAsync();
    }
}