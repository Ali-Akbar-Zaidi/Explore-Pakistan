package com.example.demo.model;

import java.util.List;

public class BudgetCalculator {
    private String calculatorId;
    private String userId;
    private List<String> destinationIds;
    private double totalBudget;
    private double dailyAllowance;
    private int tripDurationDays;
    private double accommodationCost;
    private double transportCost;
    private double activityCosts;
    private String notes;
    private int rating; // Rating given by the user

    // Default constructor
    public BudgetCalculator() {}

    // Constructor with required fields
    public BudgetCalculator(String userId, List<String> destinationIds, double dailyAllowance, 
                          int tripDurationDays, double accommodationCost, double transportCost, 
                          double activityCosts) {
        this.userId = userId;
        this.destinationIds = destinationIds;
        this.dailyAllowance = dailyAllowance;
        this.tripDurationDays = tripDurationDays;
        this.accommodationCost = accommodationCost;
        this.transportCost = transportCost;
        this.activityCosts = activityCosts;
        this.totalBudget = calculateTotal();
    }

    // Helper method to calculate total
    private double calculateTotal() {
        return (dailyAllowance * tripDurationDays) + accommodationCost + transportCost + activityCosts;
    }

    // Getters and Setters
    public String getCalculatorId() {
        return calculatorId;
    }

    public void setCalculatorId(String calculatorId) {
        this.calculatorId = calculatorId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public List<String> getDestinationIds() {
        return destinationIds;
    }

    public void setDestinationIds(List<String> destinationIds) {
        this.destinationIds = destinationIds;
    }

    public double getTotalBudget() {
        return totalBudget;
    }

    public void setTotalBudget(double totalBudget) {
        this.totalBudget = totalBudget;
    }

    public double getDailyAllowance() {
        return dailyAllowance;
    }

    public void setDailyAllowance(double dailyAllowance) {
        this.dailyAllowance = dailyAllowance;
        this.totalBudget = calculateTotal();
    }

    public int getTripDurationDays() {
        return tripDurationDays;
    }

    public void setTripDurationDays(int tripDurationDays) {
        this.tripDurationDays = tripDurationDays;
        this.totalBudget = calculateTotal();
    }

    public double getAccommodationCost() {
        return accommodationCost;
    }

    public void setAccommodationCost(double accommodationCost) {
        this.accommodationCost = accommodationCost;
        this.totalBudget = calculateTotal();
    }

    public double getTransportCost() {
        return transportCost;
    }

    public void setTransportCost(double transportCost) {
        this.transportCost = transportCost;
        this.totalBudget = calculateTotal();
    }

    public double getActivityCosts() {
        return activityCosts;
    }

    public void setActivityCosts(double activityCosts) {
        this.activityCosts = activityCosts;
        this.totalBudget = calculateTotal();
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }
}