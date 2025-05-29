package com.example.demo.service;

import com.example.demo.model.SafetyGuideline;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

@Service
public class SafetyGuidelineManager {
    private static final String COLLECTION_NAME = "safetyGuidelines";
    private static final String DOCUMENT_ID = "safetyData";

    public void updateSafetyGuidelines(SafetyGuideline safetyGuideline) {
        Firestore db = FirestoreClient.getFirestore();
        db.collection(COLLECTION_NAME).document(DOCUMENT_ID).set(safetyGuideline);
    }
}