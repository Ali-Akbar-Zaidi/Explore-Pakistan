package com.example.demo.controller;

import com.example.demo.model.BudgetCalculator;
import com.example.demo.service.BudgetCalculatorService;
import org.springframework.beans.factory.annotation.Autowired;
import com.google.firebase.cloud.FirestoreClient;
import com.google.cloud.firestore.Firestore;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/budget-calculations")
@CrossOrigin(origins = "http://localhost:3000")
public class BudgetCalculatorController {

    @Autowired
    private BudgetCalculatorService budgetCalculatorService;

    @PostMapping
    public ResponseEntity<?> createBudgetCalculation(@RequestBody BudgetCalculator calculator) {
        try {
            BudgetCalculator createdCalculator = budgetCalculatorService.createBudgetCalculation(calculator);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCalculator);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Error creating budget calculation: " + e.getMessage());
        }
    }

    @GetMapping("/{calculatorId}")
    public ResponseEntity<?> getBudgetCalculation(@PathVariable String calculatorId) {
        try {
            BudgetCalculator calculator = budgetCalculatorService.getBudgetCalculationById(calculatorId);
            return ResponseEntity.ok(calculator);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Error retrieving budget calculation: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getBudgetCalculationsByUser(@PathVariable String userId) {
        try {
            List<BudgetCalculator> calculations = budgetCalculatorService.getBudgetCalculationsByUser(userId);
            return ResponseEntity.ok(calculations);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Error retrieving user's budget calculations: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllBudgetCalculations() {
        try {
            List<BudgetCalculator> calculations = budgetCalculatorService.getAllBudgetCalculations();
            return ResponseEntity.ok(calculations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching budget calculations: " + e.getMessage());
        }
    }

    @PutMapping("/{calculatorId}")
    public ResponseEntity<?> updateBudgetCalculation(
            @PathVariable String calculatorId,
            @RequestBody BudgetCalculator calculator) {
        try {
            BudgetCalculator updatedCalculator = budgetCalculatorService.updateBudgetCalculation(calculatorId, calculator);
            return ResponseEntity.ok(updatedCalculator);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Error updating budget calculation: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{calculatorId}")
    public ResponseEntity<?> deleteBudgetCalculation(@PathVariable String calculatorId) {
        try {
            String result = budgetCalculatorService.deleteBudgetCalculation(calculatorId);
            return ResponseEntity.ok(result);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Error deleting budget calculation: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<?> deleteBudgetCalculationsByUser(@PathVariable String userId) {
        try {
            String result = budgetCalculatorService.deleteBudgetCalculationsByUser(userId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting user's budget calculations: " + e.getMessage());
        }
    }

    @PostMapping("/calculate")
    public ResponseEntity<?> calculateTemporaryBudget(@RequestBody BudgetCalculator calculator) {
        try {
            BudgetCalculator result = budgetCalculatorService.calculateTemporaryBudget(calculator);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error calculating budget: " + e.getMessage());
        }
    }

    @PostMapping("/save-travel-plan")
    public ResponseEntity<?> saveTravelPlan(@RequestBody BudgetCalculator calculator) {
        try {
            // Save the travel plan in the database
            budgetCalculatorService.saveTravelPlan(calculator);
            return ResponseEntity.status(HttpStatus.CREATED).body("Travel plan saved successfully!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error saving travel plan: " + e.getMessage());
        }
    }
}