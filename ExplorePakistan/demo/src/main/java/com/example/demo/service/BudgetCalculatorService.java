package com.example.demo.service;

import com.example.demo.model.BudgetCalculator;
import java.util.List;
import java.util.concurrent.ExecutionException;

public interface BudgetCalculatorService {

    /**
     * Creates a new budget calculation
     * @param calculator The budget calculator data to save
     * @return The created BudgetCalculator with generated ID
     */
    BudgetCalculator createBudgetCalculation(BudgetCalculator calculator) throws ExecutionException, InterruptedException;

    /**
     * Retrieves a budget calculation by its ID
     * @param calculatorId The ID of the calculation to retrieve
     * @return The requested BudgetCalculator
     * @throws IllegalArgumentException if calculation not found
     */
    BudgetCalculator getBudgetCalculationById(String calculatorId) throws ExecutionException, InterruptedException;

    /**
     * Retrieves all budget calculations for a specific user
     * @param userId The ID of the user
     * @return List of BudgetCalculators ordered by creation date (newest first)
     */
    List<BudgetCalculator> getBudgetCalculationsByUser(String userId) throws ExecutionException, InterruptedException;

    /**
     * Updates an existing budget calculation
     * @param calculatorId The ID of the calculation to update
     * @param calculator The updated budget calculator data
     * @return The updated BudgetCalculator
     */
    BudgetCalculator updateBudgetCalculation(String calculatorId, BudgetCalculator calculator) throws ExecutionException, InterruptedException;

    /**
     * Deletes a budget calculation
     * @param calculatorId The ID of the calculation to delete
     * @return Success message
     */
    String deleteBudgetCalculation(String calculatorId) throws ExecutionException, InterruptedException;

    /**
     * Deletes all budget calculations for a specific user
     * @param userId The ID of the user
     * @return Success message
     */
    String deleteBudgetCalculationsByUser(String userId) throws ExecutionException, InterruptedException;

    /**
     * Calculates a temporary budget without saving to database
     * @param calculator The budget parameters to calculate
     * @return The calculated BudgetCalculator with totals
     */
    BudgetCalculator calculateTemporaryBudget(BudgetCalculator calculator);

    /**
     * Retrieves all budget calculations
     * @return List of all BudgetCalculators
     */
    List<BudgetCalculator> getAllBudgetCalculations() throws ExecutionException, InterruptedException;

    /**
     * Saves a travel plan from the budget calculator
     * @param calculator The budget calculator data to save as a travel plan
     */
    void saveTravelPlan(BudgetCalculator calculator);
}