package com.example.demo.service;

import com.example.demo.model.SafetyGuideline;
import org.springframework.stereotype.Service;

@Service
public class SafetyGuidelineViewer {
    public SafetyGuideline getSafetyGuidelines(SafetyGuideline safetyGuideline) {
        return safetyGuideline;
    }
}