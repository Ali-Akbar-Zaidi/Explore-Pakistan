package com.example.demo.model;

import java.util.List;
import java.util.Map;

public class SafetyGuideline {
    private Map<String, List<String>> guidelines;
    private List<EmergencyContact> emergencyContacts;

    // Getters and Setters
    public Map<String, List<String>> getGuidelines() {
        return guidelines;
    }

    public void setGuidelines(Map<String, List<String>> guidelines) {
        this.guidelines = guidelines;
    }

    public List<EmergencyContact> getEmergencyContacts() {
        return emergencyContacts;
    }

    public void setEmergencyContacts(List<EmergencyContact> emergencyContacts) {
        this.emergencyContacts = emergencyContacts;
    }

    public static class EmergencyContact {
        private String id;
        private String title;
        private String number;

        // Getters and Setters
        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getNumber() {
            return number;
        }

        public void setNumber(String number) {
            this.number = number;
        }
    }
}