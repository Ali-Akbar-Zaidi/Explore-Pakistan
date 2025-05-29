package com.example.demo.service;

import com.example.demo.model.Souvenir;
import com.google.firebase.cloud.FirestoreClient;
import com.google.cloud.firestore.Firestore;
import java.util.concurrent.ExecutionException;
import org.springframework.stereotype.Service;

@Service
public class SouvenirManager {
    private static final String COLLECTION_NAME = "souvenirs";

    public boolean addSouvenir(Souvenir souvenir) {
        Firestore db = FirestoreClient.getFirestore();
        String docId = souvenir.getSouvenirName();

        try {
            // Check if document already exists
            var docRef = db.collection(COLLECTION_NAME).document(docId);
            var docSnapshot = docRef.get().get();

            if (docSnapshot.exists()) {
                return false; // already exists
            }

            docRef.set(souvenir);
            return true;
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace(); // Log the exception or handle as necessary
            return false;
        }
    }

    public void removeSouvenir(String souvenirName) {
        Firestore db = FirestoreClient.getFirestore();
        db.collection(COLLECTION_NAME).document(souvenirName).delete();
    }
}
