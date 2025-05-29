package com.example.demo.controller;

import com.example.demo.model.SafetyGuideline;
import com.example.demo.service.SafetyGuidelineManager;
import com.example.demo.service.SafetyGuidelineViewer;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/safety")
@CrossOrigin(origins = "http://localhost:3000")
public class SafetyGuidelineController {

    @Autowired
    private SafetyGuidelineManager safetyGuidelineManager;

    @Autowired
    private SafetyGuidelineViewer safetyGuidelineViewer;

    private static final String COLLECTION_NAME = "safetyGuidelines";
    private static final String DOCUMENT_ID = "safetyData";

    @GetMapping
    public SafetyGuideline getSafetyGuidelines() throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        return db.collection(COLLECTION_NAME).document(DOCUMENT_ID)
                .get().get().toObject(SafetyGuideline.class);
    }

    @PostMapping
    public void updateSafetyGuidelines(@RequestBody SafetyGuideline safetyGuideline) {
        safetyGuidelineManager.updateSafetyGuidelines(safetyGuideline);
    }
}