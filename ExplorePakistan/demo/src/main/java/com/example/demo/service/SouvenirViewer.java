package com.example.demo.service;

import com.example.demo.model.Souvenir;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SouvenirViewer {

    public List<Souvenir> getAllSouvenirs(List<Souvenir> souvenirs) {
        return souvenirs;
    }

    public List<Souvenir> searchSouvenirs(List<Souvenir> souvenirs, String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return souvenirs;
        }
        String lowerKeyword = keyword.toLowerCase();
        return souvenirs.stream()
                .filter(souvenir ->
                        (souvenir.getSouvenirName() != null && souvenir.getSouvenirName().toLowerCase().contains(lowerKeyword)) ||
                        (souvenir.getDescription() != null && souvenir.getDescription().toLowerCase().contains(lowerKeyword)) ||
                        (souvenir.getLocation() != null && souvenir.getLocation().toLowerCase().contains(lowerKeyword)) ||
                        (souvenir.getProvince() != null && souvenir.getProvince().toLowerCase().contains(lowerKeyword)) ||
                        (souvenir.getTags() != null && souvenir.getTags().stream().anyMatch(tag -> tag.toLowerCase().contains(lowerKeyword)))
                )
                .collect(Collectors.toList());
    }

    public List<Souvenir> filterByProvinceAndCategory(List<Souvenir> souvenirs, String province, String category) {
        return souvenirs.stream()
                .filter(souvenir -> 
                        (province == null || province.isEmpty() || province.equalsIgnoreCase("All") ||
                        (souvenir.getProvince() != null && souvenir.getProvince().equalsIgnoreCase(province))) &&
                        (category == null || category.isEmpty() || category.equalsIgnoreCase("All") ||
                        (souvenir.getTags() != null && souvenir.getTags().contains(category)))
                )
                .collect(Collectors.toList());
    }
}
