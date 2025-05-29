package com.example.demo.controller;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class FirebaseAuthController {

    @Autowired
    private FirebaseDatabase firebaseDatabase;

    @PostMapping("/verifyToken")
    public ResponseEntity<String> verifyToken(@RequestBody String idToken) {
        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            String uid = decodedToken.getUid();
            return ResponseEntity.ok("User authenticated with UID: " + uid);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid token: " + e.getMessage());
        }
    }

    // NEW: Save user details
    @PostMapping("/saveUser")
    public ResponseEntity<Map<String, Object>> saveUser(@RequestBody Map<String, Object> userData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String uid = (String) userData.get("uid");
            if (uid == null) {
                response.put("status", "error");
                response.put("message", "Missing uid in request");
                return ResponseEntity.badRequest().body(response);
            }
    
            DatabaseReference usersRef = firebaseDatabase.getReference("users/" + uid);
            
            // Create a clean map with only the fields you want to save
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("name", userData.get("name"));
            userMap.put("email", userData.get("email"));
            userMap.put("age", userData.get("age"));
            userMap.put("createdAt", System.currentTimeMillis());
    
            // Use synchronous setValue to ensure completion
            usersRef.setValue(userMap, (databaseError, databaseReference) -> {
                if (databaseError != null) {
                    System.err.println("Data could not be saved: " + databaseError.getMessage());
                } else {
                    System.out.println("Data saved successfully.");
                }
            });
    
            response.put("status", "success");
            response.put("message", "User saved successfully");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error saving user: " + e.getMessage());
            e.printStackTrace();
            response.put("status", "error");
            response.put("message", "Failed to save user: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}