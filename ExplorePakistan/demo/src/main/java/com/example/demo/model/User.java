package com.example.demo.model;

import java.util.HashMap;
import java.util.Map;

public class User {
    private String uid;  // Firebase Auth UID
    private String email;
    private String password;  // Note: Only store this temporarily, not in DB
    private String name;
    private String age;
    private String role = "user";  // Default role
    private long createdAt = System.currentTimeMillis();

    public User() {}

    // Getters and Setters
    public String getUid() { return uid; }
    public void setUid(String uid) { this.uid = uid; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAge() { return age; }
    public void setAge(String age) { this.age = age; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public long getCreatedAt() { return createdAt; }
    public void setCreatedAt(long createdAt) { this.createdAt = createdAt; }

    // Convert to Map for Firebase
    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("uid", uid);
        map.put("email", email);
        map.put("name", name);
        map.put("age", age);
        map.put("role", role);
        map.put("createdAt", createdAt);
        return map;
    }
}