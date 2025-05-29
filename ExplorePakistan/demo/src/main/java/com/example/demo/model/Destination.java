package com.example.demo.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Destination {
    private String id;
    private String name;
    private String region;
    private String description;
    private List<String> tags;
    private List<String> activities;
    private double pricePerDay;
    private double rating;
    private String image;

    public Destination() {
        this.tags = new ArrayList<>();
        this.activities = new ArrayList<>();
    }

    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("id", this.id);
        map.put("name", this.name);
        map.put("region", this.region);
        map.put("description", this.description);
        map.put("pricePerDay", this.pricePerDay);
        map.put("rating", this.rating);
        map.put("image", this.image);
        
        // Proper null checks for lists
        map.put("activities", this.activities != null ? this.activities : new ArrayList<>());
        map.put("tags", this.tags != null ? this.tags : new ArrayList<>());
        
        return map;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public List<String> getTags() { 
        return tags != null ? tags : new ArrayList<>(); 
    }
    
    public void setTags(List<String> tags) {
        this.tags = tags != null ? tags : new ArrayList<>();
    }
    
    public List<String> getActivities() { 
        return activities != null ? activities : new ArrayList<>(); 
    }
    
    public void setActivities(List<String> activities) {
        this.activities = activities != null ? activities : new ArrayList<>();
    }
    
    public double getPricePerDay() { return pricePerDay; }
    public void setPricePerDay(double pricePerDay) { this.pricePerDay = pricePerDay; }
    
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
}