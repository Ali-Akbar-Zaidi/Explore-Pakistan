package com.example.demo.service;

import com.example.demo.model.Recommendation;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecommendationServiceIMPL implements RecommendationService {

        // In-memory storage of recommendations for the sake of simplicity
        // In a real application, this would use a database repository
        private List<Recommendation> recommendations;
        private Long nextId = 1L;

        public RecommendationServiceIMPL() {
                // Initialize with some sample recommendations
                recommendations = new ArrayList<>();

                // Young adults (16-25)
                recommendations.add(new Recommendation(nextId++, "Lahore",
                                "Experience the cultural heart of Pakistan with historic monuments, vibrant food streets, and the magnificent Badshahi Mosque.",
                                "/api/placeholder/400/320", 16, 25, "Punjab", true));

                recommendations.add(new Recommendation(nextId++, "Islamabad",
                                "Visit Pakistan's beautiful capital city with its stunning Faisal Mosque, lush green Margalla Hills, and modern cityscape.",
                                "/api/placeholder/400/320", 16, 25, "Federal Territory", true));

                recommendations.add(new Recommendation(nextId++, "Murree",
                                "Explore this popular hill station with pine forests, cool climate, and fun activities like chairlift rides and hiking trails.",
                                "/api/placeholder/400/320", 26, 35, "Punjab", false));

                // Adults (26-40)
                recommendations.add(new Recommendation(nextId++, "Hunza Valley",
                                "Discover breathtaking mountain landscapes, serene lakes, ancient forts, and the famous Attabad Lake in this northern paradise.",
                                "/api/placeholder/400/320", 26, 35, "Gilgit-Baltistan", true));

                recommendations.add(new Recommendation(nextId++, "Swat Valley",
                                "Experience the 'Switzerland of Pakistan' with lush green meadows, crystal clear rivers, and beautiful mountainous terrain.",
                                "/api/placeholder/400/320", 36, 45, "Khyber Pakhtunkhwa", true));

                recommendations.add(new Recommendation(nextId++, "Naran Kaghan",
                                "Visit stunning valleys with alpine lakes, waterfalls, and the famous Saiful Muluk Lake surrounded by snow-capped peaks.",
                                "/api/placeholder/400/320", 36, 45, "Khyber Pakhtunkhwa", false));

                // Middle-aged (41-60)
                recommendations.add(new Recommendation(nextId++, "Karachi",
                                "Explore Pakistan's largest city with beautiful beaches, bustling markets, historic architecture, and delicious seafood cuisine.",
                                "/api/placeholder/400/320", 46, 55, "Sindh", true));

                recommendations.add(new Recommendation(nextId++, "Mohenjo-daro",
                                "Visit one of the world's oldest civilizations and explore the archaeological ruins of this ancient Indus Valley city.",
                                "/api/placeholder/400/320", 46, 55, "Sindh", true));

                recommendations.add(new Recommendation(nextId++, "Taxila",
                                "Discover the ancient Buddhist archaeological site with ruins dating back to the Gandhara civilization and fascinating museums.",
                                "/api/placeholder/400/320", 56, 60, "Punjab", false));

                // Seniors (61+)
                recommendations.add(new Recommendation(nextId++, "Skardu",
                                "Experience the tranquil beauty of this high-altitude desert valley with majestic mountains, serene lakes, and historic forts.",
                                "/api/placeholder/400/320", 56, 60, "Gilgit-Baltistan", true));

                recommendations.add(new Recommendation(nextId++, "Quetta",
                                "Visit the 'Fruit Garden of Pakistan' known for its mild climate, fruit orchards, and natural beauty surrounded by mountains.",
                                "/api/placeholder/400/320", 61, 80, "Balochistan", true));

                recommendations.add(new Recommendation(nextId++, "Kalash Valley",
                                "Discover the unique culture, colorful festivals, and beautiful landscapes of the ancient Kalash people in these remote valleys.",
                                "/api/placeholder/400/320", 61, 80, "Khyber Pakhtunkhwa", false));
        }

        @Override
        public List<Recommendation> getAllRecommendations() {
                return new ArrayList<>(recommendations);
        }

        @Override
        public List<Recommendation> getRecommendationsByAge(int age) {
                // Filter recommendations based on age range and limit to 2 results
                return recommendations.stream()
                                .filter(rec -> age >= rec.getMinAge() && age <= rec.getMaxAge())
                                .collect(Collectors.toList());
        }

        @Override
        public List<Recommendation> getTopRecommendations(int limit) {
                // Get featured recommendations first, then sort by ID (newest first), and limit
                // to specified count
                return recommendations.stream()
                                .sorted(Comparator.comparing(Recommendation::getFeatured).reversed()
                                                .thenComparing(Recommendation::getId).reversed())
                                .limit(limit)
                                .collect(Collectors.toList());
        }

        @Override
        public Recommendation addRecommendation(Recommendation recommendation) {
                recommendation.setId(nextId++);
                recommendations.add(recommendation);
                return recommendation;
        }

        @Override
        public Recommendation updateRecommendation(Long id, Recommendation updatedRecommendation) {
                for (int i = 0; i < recommendations.size(); i++) {
                        Recommendation rec = recommendations.get(i);
                        if (rec.getId().equals(id)) {
                                updatedRecommendation.setId(id);
                                recommendations.set(i, updatedRecommendation);
                                return updatedRecommendation;
                        }
                }
                return null;
        }

        @Override
        public void deleteRecommendation(Long id) {
                recommendations.removeIf(rec -> rec.getId().equals(id));
        }
}