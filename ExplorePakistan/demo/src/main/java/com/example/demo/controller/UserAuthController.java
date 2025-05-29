package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.AuthService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class UserAuthController {
    private static final Logger logger = LoggerFactory.getLogger(UserAuthController.class);

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        String email = payload.get("email");
        logger.info("Login attempt for email: {}", email);
        
        try {
            // Check if Authorization header exists
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                logger.error("Missing or invalid authorization header for login attempt");
                return ResponseEntity.status(401).body(Map.of(
                    "status", "error",
                    "message", "Missing or invalid authorization token"
                ));
            }
            
            // Extract and verify the token
            String idToken = authHeader.substring(7);
            logger.debug("Verifying Firebase token");
            
            FirebaseToken decodedToken;
            try {
                decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            } catch (FirebaseAuthException e) {
                logger.error("Firebase token verification failed: {}", e.getMessage());
                return ResponseEntity.status(401).body(Map.of(
                    "status", "error",
                    "message", "Invalid Firebase token: " + e.getMessage()
                ));
            }
            
            String uid = decodedToken.getUid();
            logger.info("Token verified for UID: {}", uid);
            
            // Verify that the token belongs to the user trying to log in
            if (!email.equals(decodedToken.getEmail())) {
                logger.warn("Token email mismatch. Token: {}, Request: {}", decodedToken.getEmail(), email);
                return ResponseEntity.status(403).body(Map.of(
                    "status", "error",
                    "message", "Token does not match provided email"
                ));
            }
            
            logger.info("Fetching user data from service for email: {}", email);
            User user = authService.login(email);
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("user", user);
            response.put("message", "Login successful");
            
            logger.info("Login successful for user: {}", user.getUid());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Login error for email {}: {}", email, e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("status", "error");
            error.put("message", e.getMessage());
            return ResponseEntity.status(401).body(error);
        }
    }

    // Options mapping to handle preflight requests
    @RequestMapping(value = "/login", method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleOptions() {
        logger.info("Received OPTIONS request for /auth/login");
        return ResponseEntity.ok().build();
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        logger.info("Signup attempt for email: {}", user.getEmail());
        try {
            User createdUser = authService.signUp(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("user", createdUser);
            response.put("message", "Signup successful");
            
            logger.info("Signup successful for user: {}", createdUser.getUid());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Signup error: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(createErrorResponse(e));
        }
    }

    @GetMapping("/user/{uid}")
    public ResponseEntity<?> getUser(@PathVariable String uid, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        logger.info("Get user data request for UID: {}", uid);
        try {
            // Verify the token
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                logger.error("Missing or invalid authorization header for user data request");
                return ResponseEntity.status(401).body(Map.of(
                    "status", "error",
                    "message", "Missing or invalid authorization token"
                ));
            }
            
            String idToken = authHeader.substring(7);
            FirebaseToken decodedToken;
            try {
                decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            } catch (FirebaseAuthException e) {
                logger.error("Firebase token verification failed: {}", e.getMessage());
                return ResponseEntity.status(401).body(Map.of(
                    "status", "error",
                    "message", "Invalid Firebase token: " + e.getMessage()
                ));
            }
            
            // Only allow users to access their own data or if they are admin
            String tokenUid = decodedToken.getUid();
            if (!tokenUid.equals(uid) && !isAdmin(decodedToken.getEmail())) {
                logger.warn("Unauthorized access attempt. Token UID: {}, Requested UID: {}", tokenUid, uid);
                return ResponseEntity.status(403).body(Map.of(
                    "status", "error",
                    "message", "Unauthorized access to user data"
                ));
            }
            
            User user = authService.getUserData(uid);
            logger.info("User data retrieved successfully for UID: {}", uid);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            logger.error("Error retrieving user data: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(createErrorResponse(e));
        }
    }

    private boolean isAdmin(String email) {
        return email != null && email.toLowerCase().equals("admin@gmail.com");
    }

    private Map<String, String> createErrorResponse(Exception e) {
        Map<String, String> error = new HashMap<>();
        error.put("status", "error");
        error.put("message", e.getMessage());
        return error;
    }
}