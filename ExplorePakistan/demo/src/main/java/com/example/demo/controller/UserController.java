package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.FirebaseAuth;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.concurrent.CompletionException;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers().join();
            List<Map<String, Object>> adminUsers = users.stream()
                .map(user -> {
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("id", user.getUid());
                    userMap.put("name", user.getName());
                    userMap.put("email", user.getEmail());
                    userMap.put("status", user.getRole());
                    userMap.put("joinDate", formatJoinDate(user.getCreatedAt()));
                    userMap.put("age", user.getAge());
                    return userMap;
                })
                .collect(Collectors.toList());
            return ResponseEntity.ok(adminUsers);
        } catch (CompletionException e) {
            return ResponseEntity.status(500).body(Map.of(
                "status", "error",
                "message", "Failed to fetch users: " + e.getCause().getMessage()
            ));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam String term) {
        try {
            List<User> users = userService.searchUsers(term).join();
            List<Map<String, Object>> adminUsers = users.stream()
                .map(user -> {
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("id", user.getUid());
                    userMap.put("name", user.getName());
                    userMap.put("email", user.getEmail());
                    userMap.put("status", user.getRole());
                    userMap.put("joinDate", formatJoinDate(user.getCreatedAt()));
                    userMap.put("age", user.getAge());
                    return userMap;
                })
                .collect(Collectors.toList());
            return ResponseEntity.ok(adminUsers);
        } catch (CompletionException e) {
            return ResponseEntity.status(500).body(Map.of(
                "status", "error",
                "message", "Failed to search users: " + e.getCause().getMessage()
            ));
        }
    }

    @DeleteMapping("/{uid}")
    public ResponseEntity<?> deleteUser(@PathVariable String uid) {
        try {
            String result = userService.deleteUser(uid).join();
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", result
            ));
        } catch (CompletionException e) {
            return ResponseEntity.status(500).body(Map.of(
                "status", "error",
                "message", "Failed to delete user: " + e.getCause().getMessage()
            ));
        }
    }

    @PutMapping("/{uid}/toggle-status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable String uid) {
        try {
            User user = userService.toggleUserStatus(uid).join();
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "newStatus", user.getRole()
            ));
        } catch (CompletionException e) {
            return ResponseEntity.status(500).body(Map.of(
                "status", "error",
                "message", "Failed to toggle user status: " + e.getCause().getMessage()
            ));
        }
    }

    @PutMapping("/{uid}")
    public ResponseEntity<?> updateUser(@PathVariable String uid, @RequestBody Map<String, Object> updates) {
        try {
            User user = new User();
            user.setUid(uid);
            if (updates.containsKey("name")) user.setName((String) updates.get("name"));
            if (updates.containsKey("email")) user.setEmail((String) updates.get("email"));
            if (updates.containsKey("age")) user.setAge(updates.get("age").toString());
            if (updates.containsKey("status")) user.setRole((String) updates.get("status"));
            
            User updatedUser = userService.updateUser(uid, user).join();
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("user", createUserMap(updatedUser));
            return ResponseEntity.ok(response);
        } catch (CompletionException e) {
            return ResponseEntity.status(500).body(Map.of(
                "status", "error",
                "message", "Failed to update user: " + e.getCause().getMessage()
            ));
        }
    }

    @PostMapping("/delete-by-details")
    public ResponseEntity<?> deleteUserByNameAndEmail(@RequestBody Map<String, String> payload) {
        try {
            String name = payload.get("name");
            String email = payload.get("email");
            
            if (name == null || email == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", "Both name and email are required"
                ));
            }
            
            List<User> users = userService.getAllUsers().join();
            User userToDelete = users.stream()
                .filter(u -> u.getName().equalsIgnoreCase(name) && u.getEmail().equalsIgnoreCase(email))
                .findFirst()
                .orElse(null);
                
            if (userToDelete == null) {
                return ResponseEntity.status(404).body(Map.of(
                    "status", "error",
                    "message", "No user found with that name and email combination"
                ));
            }
            
            String result = userService.deleteUser(userToDelete.getUid()).join();
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", result);
            response.put("deletedUser", createUserMap(userToDelete));
            return ResponseEntity.ok(response);
        } catch (CompletionException e) {
            return ResponseEntity.status(500).body(Map.of(
                "status", "error",
                "message", "Failed to delete user: " + e.getCause().getMessage()
            ));
        }
    }

    private String formatJoinDate(long timestamp) {
        // Implement your date formatting logic here
        return String.valueOf(timestamp);
    }

    private Map<String, Object> createUserMap(User user) {
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getUid());
        userMap.put("name", user.getName());
        userMap.put("email", user.getEmail());
        userMap.put("status", user.getRole());
        userMap.put("joinDate", formatJoinDate(user.getCreatedAt()));
        userMap.put("age", user.getAge());
        return userMap;
    }
}