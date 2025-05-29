package com.example.demo.service;

import com.example.demo.model.User;
import com.google.firebase.database.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
public class UserService {

    private final DatabaseReference databaseReference;

    @Autowired
    public UserService(FirebaseDatabase firebaseDatabase) {
        this.databaseReference = firebaseDatabase.getReference("users");
    }

    public CompletableFuture<List<User>> getAllUsers() {
        CompletableFuture<List<User>> future = new CompletableFuture<>();
        
        databaseReference.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                List<User> users = new ArrayList<>();
                for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                    User user = mapSnapshotToUser(snapshot);
                    users.add(user);
                }
                future.complete(users);
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                future.completeExceptionally(databaseError.toException());
            }
        });
        
        return future;
    }

    public CompletableFuture<List<User>> searchUsers(String searchTerm) {
        CompletableFuture<List<User>> future = new CompletableFuture<>();
        
        databaseReference.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                List<User> filteredUsers = new ArrayList<>();
                String lowerSearchTerm = searchTerm.toLowerCase();
                
                for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                    User user = mapSnapshotToUser(snapshot);
                    if (user.getName() != null && user.getName().toLowerCase().contains(lowerSearchTerm) || 
                        user.getEmail() != null && user.getEmail().toLowerCase().contains(lowerSearchTerm)) {
                        filteredUsers.add(user);
                    }
                }
                future.complete(filteredUsers);
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                future.completeExceptionally(databaseError.toException());
            }
        });
        
        return future;
    }

    public CompletableFuture<String> deleteUser(String uid) {
        CompletableFuture<String> future = new CompletableFuture<>();
        
        databaseReference.child(uid).removeValue((databaseError, databaseReference) -> {
            if (databaseError != null) {
                future.completeExceptionally(databaseError.toException());
            } else {
                future.complete("User deleted successfully");
            }
        });
        
        return future;
    }

    public CompletableFuture<User> toggleUserStatus(String uid) {
        CompletableFuture<User> future = new CompletableFuture<>();
        
        DatabaseReference userRef = databaseReference.child(uid);
        userRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                User user = mapSnapshotToUser(dataSnapshot);
                if (user != null) {
                    String newStatus = "Active".equals(user.getRole()) ? "Inactive" : "Active";
                    user.setRole(newStatus);
                    
                    Map<String, Object> updates = new HashMap<>();
                    updates.put("role", newStatus);
                    updates.put("status", newStatus); // Maintain backward compatibility
                    
                    userRef.updateChildren(updates, (databaseError, databaseReference) -> {
                        if (databaseError != null) {
                            future.completeExceptionally(databaseError.toException());
                        } else {
                            future.complete(user);
                        }
                    });
                } else {
                    future.completeExceptionally(new RuntimeException("User not found"));
                }
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                future.completeExceptionally(databaseError.toException());
            }
        });
        
        return future;
    }

    public CompletableFuture<User> updateUser(String uid, User updatedUser) {
        CompletableFuture<User> future = new CompletableFuture<>();
        
        Map<String, Object> updateValues = new HashMap<>();
        if (updatedUser.getName() != null) updateValues.put("name", updatedUser.getName());
        if (updatedUser.getEmail() != null) updateValues.put("email", updatedUser.getEmail());
        if (updatedUser.getAge() != null) updateValues.put("age", updatedUser.getAge());
        if (updatedUser.getRole() != null) {
            updateValues.put("role", updatedUser.getRole());
            updateValues.put("status", updatedUser.getRole()); // Maintain backward compatibility
        }
        
        databaseReference.child(uid).updateChildren(updateValues, (databaseError, databaseReference) -> {
            if (databaseError != null) {
                future.completeExceptionally(databaseError.toException());
            } else {
                updatedUser.setUid(uid);
                future.complete(updatedUser);
            }
        });
        
        return future;
    }

    private User mapSnapshotToUser(DataSnapshot snapshot) {
        User user = new User();
        user.setUid(snapshot.getKey());
        
        if (snapshot.hasChild("email")) {
            user.setEmail(snapshot.child("email").getValue(String.class));
        }
        if (snapshot.hasChild("name")) {
            user.setName(snapshot.child("name").getValue(String.class));
        }
        if (snapshot.hasChild("age")) {
            Object ageValue = snapshot.child("age").getValue();
            user.setAge(ageValue != null ? ageValue.toString() : null);
        }
        if (snapshot.hasChild("role")) {
            user.setRole(snapshot.child("role").getValue(String.class));
        } else if (snapshot.hasChild("status")) { // Fallback to status if role doesn't exist
            user.setRole(snapshot.child("status").getValue(String.class));
        }
        if (snapshot.hasChild("createdAt")) {
            Object createdAt = snapshot.child("createdAt").getValue();
            if (createdAt instanceof Long) {
                user.setCreatedAt((Long) createdAt);
            }
        } else if (snapshot.hasChild("joinDate")) { // Fallback to joinDate if createdAt doesn't exist
            Object joinDate = snapshot.child("joinDate").getValue();
            if (joinDate instanceof String) {
                user.setCreatedAt(parseJoinDate((String) joinDate));
            }
        }
        
        return user;
    }

    private long parseJoinDate(String joinDate) {
        try {
            // Simple parsing - adjust according to your date format
            return joinDate != null ? Long.parseLong(joinDate.replace("-", "")) : System.currentTimeMillis();
        } catch (NumberFormatException e) {
            return System.currentTimeMillis();
        }
    }
}