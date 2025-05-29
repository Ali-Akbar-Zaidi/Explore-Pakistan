package com.example.demo.service;

import com.example.demo.model.User;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.database.*;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Service
public class AuthServiceIMPL implements AuthService {
    
    private final DatabaseReference databaseRef;

    public AuthServiceIMPL() {
        this.databaseRef = FirebaseDatabase.getInstance().getReference("users");
    }

    @Override
    public User signUp(User user) throws Exception {
        // 1. Create Firebase Auth user
        UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                .setEmail(user.getEmail())
                .setPassword(user.getPassword())
                .setDisplayName(user.getName());
        
        UserRecord userRecord = FirebaseAuth.getInstance().createUser(request);
        
        // 2. Prepare user data for Realtime Database
        user.setUid(userRecord.getUid());
        user.setPassword(null); // Don't store password in DB
        
        // 3. Save additional user data to Realtime Database
        databaseRef.child(user.getUid())
                  .setValueAsync(user.toMap())
                  .get(); // Wait for completion
        
        return user;
    }

    @Override
    public User login(String email) throws Exception {
        try {
            // 1. Get user from Firebase Auth
            UserRecord userRecord = FirebaseAuth.getInstance().getUserByEmail(email);
            
            // 2. Get additional data from Realtime Database
            CompletableFuture<User> future = new CompletableFuture<>();
            
            databaseRef.child(userRecord.getUid()).addListenerForSingleValueEvent(
                new ValueEventListener() {
                    @Override
                    public void onDataChange(DataSnapshot snapshot) {
                        if (snapshot.exists()) {
                            User user = snapshot.getValue(User.class);
                            future.complete(user);
                        } else {
                            future.completeExceptionally(new Exception("User data not found in database"));
                        }
                    }
                    
                    @Override
                    public void onCancelled(DatabaseError error) {
                        future.completeExceptionally(error.toException());
                    }
                }
            );
            
            return future.get();
        } catch (FirebaseAuthException e) {
            throw new Exception("Authentication failed: " + e.getMessage());
        } catch (Exception e) {
            throw new Exception("Login failed: " + e.getMessage());
        }
    }

    @Override
    public User getUserData(String uid) throws Exception {
        CompletableFuture<User> future = new CompletableFuture<>();
        
        databaseRef.child(uid).addListenerForSingleValueEvent(
            new ValueEventListener() {
                @Override
                public void onDataChange(DataSnapshot snapshot) {
                    if (snapshot.exists()) {
                        User user = snapshot.getValue(User.class);
                        future.complete(user);
                    } else {
                        future.completeExceptionally(new Exception("User data not found"));
                    }
                }
                
                @Override
                public void onCancelled(DatabaseError error) {
                    future.completeExceptionally(error.toException());
                }
            }
        );
        
        return future.get();
    }
}