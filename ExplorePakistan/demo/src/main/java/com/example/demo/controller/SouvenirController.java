package com.example.demo.controller;

import com.example.demo.model.Souvenir;
import com.example.demo.service.SouvenirManager;
import com.example.demo.service.SouvenirViewer;
import com.google.firebase.cloud.FirestoreClient;
import com.google.cloud.firestore.Firestore;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.QuerySnapshot;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/souvenirs")
@CrossOrigin(origins = "http://localhost:3000")
public class SouvenirController {

    @Autowired
    private SouvenirViewer souvenirViewer;

    @Autowired
    private SouvenirManager souvenirManager;

    @GetMapping
    public List<Souvenir> getAllSouvenirs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String province,
            @RequestParam(required = false) String category) throws ExecutionException, InterruptedException {
        
        Firestore db = FirestoreClient.getFirestore();
        List<Souvenir> souvenirs = new ArrayList<>();
        
        ApiFuture<QuerySnapshot> future = db.collection("souvenirs").get();
        for (var document : future.get().getDocuments()) {
            souvenirs.add(document.toObject(Souvenir.class));
        }

        if (search != null && !search.isEmpty()) {
            souvenirs = souvenirViewer.searchSouvenirs(souvenirs, search);
        }

        if ((province != null && !province.isEmpty()) || (category != null && !category.isEmpty())) {
            souvenirs = souvenirViewer.filterByProvinceAndCategory(souvenirs, province, category);
        }

        return souvenirs;
    }

    @PostMapping
    public void addSouvenir(@RequestBody Souvenir souvenir) {
        souvenirManager.addSouvenir(souvenir);
    }

    @DeleteMapping("/{name}")
    public void removeSouvenir(@PathVariable String name) {
        souvenirManager.removeSouvenir(name);
    }

    @GetMapping("/tags")
    public List<String> getAllTags() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        List<String> tags = new ArrayList<>();
        
        ApiFuture<QuerySnapshot> future = db.collection("souvenirs").get();
        for (var document : future.get().getDocuments()) {
            Souvenir souvenir = document.toObject(Souvenir.class);
            if (souvenir.getTags() != null) {
                for (String tag : souvenir.getTags()) {
                    if (!tags.contains(tag)) {
                        tags.add(tag);
                    }
                }
            }
        }
        return tags;
    }
}