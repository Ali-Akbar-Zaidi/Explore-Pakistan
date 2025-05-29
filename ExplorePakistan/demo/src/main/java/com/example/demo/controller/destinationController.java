package com.example.demo.controller;

import com.example.demo.model.Destination;
import com.example.demo.service.destinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/destinations")
@CrossOrigin(origins = "*")
public class destinationController {

    @Autowired
    private destinationService destinationService;

    @GetMapping
    public ResponseEntity<?> getAllDestinations() {
        try {
            List<Destination> destinations = destinationService.getAllDestinations();
            return ResponseEntity.ok(destinations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching destinations: " + e.getMessage());
        }
    }

    @PostMapping
public ResponseEntity<?> addDestination(@RequestBody Destination destination) {
    System.out.println("Received destination: " + destination.toString());
    try {
        Destination savedDestination = destinationService.addDestination(destination);
        System.out.println("Saved destination: " + savedDestination.toString());
        return ResponseEntity.ok(savedDestination);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error saving destination: " + e.getMessage());
    }
}

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDestination(@PathVariable String id) {
        try {
            destinationService.deleteDestination(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting destination: " + e.getMessage());
        }
    }
}